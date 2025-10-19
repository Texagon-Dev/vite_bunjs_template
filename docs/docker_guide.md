# Docker Guide

This guide explains how to containerize, run, and deploy the **Texagon Vite + Bun + TanStack + Zustand** template using Docker. It includes **dev** and **production** setups, **Traefik/Nginx** examples, environment handling with **APP\_**-prefixed variables, and common troubleshooting.

---

## 📦 What We’re Shipping

- **Dev**: Hot-reloading Vite server inside Docker (port **5173**).
- **Prod**: Static SPA build served via **Nginx** (recommended) or minimal **Bun** file server.
- **Reverse proxy**: Traefik/Nginx examples with HTTPS-ready configs.
- **Env**: `APP_`-prefixed variables surfaced via `vite.config.ts` → `envPrefix: ['APP_']`.

> ⚠️ Do **not** put secrets in `APP_` variables — client-side builds expose them.

---

## 🧱 Files & Conventions

### `.dockerignore`

Always include a `.dockerignore` to keep images lean:

```gitignore
node_modules
bun.lockb
npm-debug.log
yarn.lock
.pnpm-store
.vite
coverage
.DS_Store
.env
.env.*
.git
.github
.idea
.vscode
```

### `vite.config.ts` (Env Prefix)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: ["APP_"],
  server: {
    host: true, // required for Docker HMR over LAN/containers
  },
});
```

---

## 🏗️ Dockerfile (Multi‑Stage)

### Option A — **Recommended**: Build with Bun → Serve with **Nginx**

This yields the smallest, fastest production runtime for a Vite SPA.

```dockerfile
# ---------- Build stage ----------
FROM oven/bun:1.2 AS build
WORKDIR /app

# Install deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build (outputs to /app/dist)
RUN bun run build

# ---------- Runtime stage (Nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Copy static build
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA fallback
# (ensures deep links route to index.html)
COPY ./deploy/nginx/spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

A suitable `deploy/nginx/spa.conf`:

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Basic hardening
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### Option B — Build & Serve with **Bun**

Useful for quick prototypes; Nginx is still preferred for production.

```dockerfile
FROM oven/bun:1.2 AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Minimal static file server with Bun
EXPOSE 3000
CMD ["bun", "run", "serve"]
```

Example `package.json` script:

```json
{
  "scripts": {
    "serve": "bunx serve -p 3000 ./dist"
  }
}
```

---

## 🧪 Local Development (Compose)

**`docker-compose.dev.yml`**

```yaml
version: "3.9"
services:
  web:
    image: oven/bun:1.2
    working_dir: /app
    command: ["bun", "run", "dev", "--host"]
    ports:
      - "5173:5173"
    environment:
      APP_API_BASE_URL: "http://localhost:3001" # example API
      APP_ENV: "development"
      CHOKIDAR_USEPOLLING: "true" # enable polling inside containers
    volumes:
      - ./:/app
      - /app/node_modules
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:5173"]
      interval: 30s
      timeout: 3s
      retries: 5
```

Run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

> If HMR doesn’t work, confirm `server.host = true` in `vite.config.ts` and that your firewall allows the port.

---

## 🚀 Production (Compose)

**`docker-compose.yml`** (Nginx runtime)

```yaml
version: "3.9"
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile # Option A above
    image: texagon/template-web:latest
    environment:
      APP_ENV: "production"
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### With Traefik (recommended)

```yaml
version: "3.9"
services:
  web:
    build: .
    image: texagon/template-web:latest
    environment:
      APP_ENV: "production"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.template.rule=Host(`app.example.com`)"
      - "traefik.http.routers.template.entrypoints=websecure"
      - "traefik.http.routers.template.tls.certresolver=letsencrypt"
      - "traefik.http.services.template.loadbalancer.server.port=80"
    networks:
      - web
    restart: unless-stopped

networks:
  web:
    external: true
```

> Ensure you already have a Traefik instance on the `web` network managing TLS (Let’s Encrypt).

---

## 🔐 Environment Strategy

- Use **`APP_`** for client-visible configuration: `APP_API_BASE_URL`, `APP_ENV`, flags.
- For server-only secrets (if any backend in the same stack), store them as regular env vars **without** `APP_` and never import from `import.meta.env` on the client.
- Maintain: `.env`, `.env.development`, `.env.production` (non-secret only).

**Example `.env.production`**

```bash
APP_API_BASE_URL=https://api.yourdomain.com
APP_ENV=production
```

> Rebuild images when envs change to bake them into the static client build.

---

## 📈 Healthchecks & Observability

- Add container **`HEALTHCHECK`** so orchestrators can restart unhealthy containers.
- Serve `/` or `/healthz` endpoints (Nginx build serves `/`).
- Pipe logs to stdout/stderr — Docker/Compose captures them.

```bash
docker logs -f <container>
```

---

## 🧰 CI/CD (GitHub Actions Example)

```yaml
name: Build & Push Docker Image
on:
  push:
    branches: [main]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ghcr.io/texagon/template-web:latest
```

> For private registries (ECR/GCR/ACR), replace the login step accordingly.

---

## 🐞 Troubleshooting

### Dev HMR not connecting

- Ensure `server.host = true` in `vite.config.ts`.
- Map port `5173:5173`.
- If running on WSL2/remote Docker, set `server.hmr.host` and `server.hmr.port` explicitly.

```ts
server: {
  host: true,
  hmr: { host: 'localhost', port: 5173 },
}
```

### File changes not detected on Windows/WSL

- Use `CHOKIDAR_USEPOLLING=true` in dev service.
- Mount volumes correctly; avoid nested mounts that break inotify.

### CORS/API issues

- Confirm `APP_API_BASE_URL` and the backend CORS policy.
- In dev, proxy API through Vite if needed:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api/, ''),
    },
  },
}
```

### Arm64 vs AMD64 builds

- Use Buildx and multi-arch images (`platforms: linux/amd64,linux/arm64`).
- Prefer Alpine base images compatible with both.

### Permissions

- If you see permission issues with mounted volumes, run container as your UID/GID or adjust file ownership.

```yaml
user: "1000:1000"
```

---

## ✅ Production Checklist

- [ ] `APP_` env values baked into build (rebuild after change)
- [ ] Reverse proxy (Traefik/Nginx) terminating TLS
- [ ] Healthchecks in compose
- [ ] Proper caching (.dockerignore, multi-stage)
- [ ] Static SPA fallback configured (`try_files ... /index.html`)
- [ ] Minimal headers & CSP added

---

- **Primary Architect:** [@mtalhazulf](https://github.com/mtalhazulf)
- **Maintained by:** Texagon Engineering Team

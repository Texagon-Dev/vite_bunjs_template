# Vite + Bun + TanStack + Zustand Template

A **production-ready frontend boilerplate** built by **Texagon** for modern web apps using
**Bun**, **Vite**, **React (TypeScript)**, **TanStack Router + Table + Form**, **Zustand**, and **TailwindCSS**.

This template provides a clean folder structure, routing system, data-table integration,
form handling, and pre-configured developer tooling — ready for scalable projects.

---

## ⚙️ Tech Stack

| Layer            | Technology                                    | Purpose                           |
| ---------------- | --------------------------------------------- | --------------------------------- |
| Runtime          | **Bun 1.2+**                                  | Fast JS runtime & package manager |
| Framework        | **Vite 7 + React 19 (TypeScript)**            | Modern frontend toolchain         |
| UI               | **TailwindCSS 4**                             | Utility-first styling             |
| State            | **Zustand 5**                                 | Lightweight global state          |
| Routing          | **TanStack Router 1.x**                       | File-based routing                |
| Data             | **TanStack Table 8.x**, **TanStack Form 5.x** | Declarative tables & forms        |
| Validation       | **Zod 4.x**                                   | Schema validation                 |
| HTTP             | **Axios 1.x**                                 | API communication                 |
| Quality          | **ESLint + Prettier + Husky + lint-staged**   | Code quality automation           |
| Containerization | **Docker + Compose**                          | Deployment ready                  |

---

## 🚀 Quick Start (Bun)

### 1️⃣ Clone the repo

```bash
git clone https://github.com/texagon/vitejs_bunjs_template.git
cd vitejs_bunjs_template
```

### 2️⃣ Install dependencies

```bash
bun install
```

### 3️⃣ Start development server

```bash
bun run dev
```

Default port: **5173**
Access: `http://localhost:5173`

### 4️⃣ Build for production

```bash
bun run build
```

### 5️⃣ Preview production build

```bash
bun run preview
```

---

## 🧱 Folder Structure

```
src/
 ├─ assets/           # Static images, SVGs
 ├─ components/       # Shared reusable UI components
 ├─ pages/            # Route-based pages (TanStack Router)
 │   ├─ index.tsx     # Root page
 │   ├─ env/          # Example sub-route
 │   └─ dynamic/      # Route params (e.g. $userId.tsx)
 ├─ services/         # API clients (Axios + Zod)
 │   ├─ env/Env.ts    # Example service
 │   └─ user/         # User service
 ├─ store/            # Zustand stores
 │   ├─ index.tsx
 │   └─ appstore/     # Example app store
 ├─ utils/            # Helpers, pagination, etc.
 ├─ types/            # TypeScript interfaces & schemas
 ├─ index.css         # Tailwind entry
 └─ main.tsx          # React app entry
```

---

## 🧉 Environment Variables

Example `.env` file:

```bash
API_BASE_URL=https://api.example.com
APP_ENV=development
```

Make sure to duplicate `.env.example` if available:

```bash
cp .env.example .env
```

---

## 🐳 Docker Setup (Optional)

Build & run using Docker:

```bash
docker build -t texagon-template .
docker run -p 5173:5173 texagon-template
```

Or using Compose:

```bash
docker compose up --build
```

For detailed container usage → [docs/docker_guide.md](./docs/docker_guide.md)

---

## 🤪 Linting & Formatting

Run lint:

```bash
bun run lint
```

Auto-fix:

```bash
bun run lint:fix
```

Pre-commit hooks are powered by **Husky + lint-staged** to keep code clean.

---

## 🧠 Developer Docs

| Guide                                        | Description                              |
| -------------------------------------------- | ---------------------------------------- |
| [Dev Guide](./docs/dev_guide.md)             | Architecture, adding routes/forms/stores |
| [Docker Guide](./docs/docker_guide.md)       | Running inside containers                |
| [Troubleshooting](./docs/troubleshooting.md) | Common issues & solutions                |
| [Contributing](./docs/contributing.md)       | Team workflow & PR standards             |

---

## 🛩 Best Practices

These conventions ensure maintainability and scalability across Texagon projects:

### 🧱 Code & Folder Practices

- **Each page = single route folder** under `/pages`
- **Components** are always reusable and stateless
- **Hooks & state** belong in `/store` (Zustand)
- **APIs** go in `/services` — each domain gets its own subfolder
- **Types & Schemas** live in `/types` for global sharing
- **Utility functions** (pagination, formatting, etc.) go in `/utils`
- **Keep imports absolute** using `@/` alias (configured in `tsconfig.json`)
- Use **Zod** for validation and data contracts
- Keep **React components functional** with clear prop typing
- Commit messages follow the format:
  `feat: add user form validation` / `fix: router not loading profile`

### 🎨 UI & Styling

- **Tailwind only** — avoid inline styles
- Follow consistent spacing and color tokens from `tailwind.config.js`
- Use responsive design with mobile-first mindset
- Group related UI under `/components/ui/` when reusable

### 🔧 Workflow

- Always run `bun run lint:fix` before committing
- Run local dev with `bun run dev` and test hot-reloads
- Follow branch naming conventions:
  `feature/`, `fix/`, `chore/`, `refactor/`
- Submit PRs with clear description, screenshots (if UI)

---

## 👨‍💻 Credits

- **Primary Architect:** [@mtalhazulf](https://github.com/mtalhazulf)
- **Organization:** Texagon
- **Maintainers:** Texagon Engineering Team

> Designed to accelerate AI-powered and data-driven projects by Texagon.
> Use this as a starter for all internal and client-facing frontend builds.

---

## 🦯 License

© Texagon — Internal template for commercial and in-house projects.
Reproduction or distribution outside Texagon is not permitted without written consent.

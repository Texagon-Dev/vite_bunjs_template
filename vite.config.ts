import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/routeTree.gen.ts",
      routeFileIgnorePattern: ".json",
    }),
    // Dev-only middleware to serve /env.config.js from .env.local at runtime
    {
      name: "dev-env-config",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/env.config.js") {
            const env = loadEnv("development", process.cwd(), "");
            const entries = Object.entries(env).filter(([k]) => k.startsWith("APP_"));
            const lines = [
              "window.__ENV__ = window.__ENV__ || {};",
              ...entries.map(([k, v]) => `window.__ENV__["${k}"] = ${JSON.stringify(v ?? "")};`),
            ];
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/javascript; charset=utf-8");
            res.end(lines.join("\n"));
            return;
          }
          next();
        });
      },
    } as Plugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});

# 🏗️ Texagon Developer Guide

> **Comprehensive Engineering Manual** for Vite + Bun + React 19 + TanStack + Zustand Template
>
> **Important Convention:** Whenever a folder (outside `/pages`) contains an `index.tsx` (or `index.ts`) file, it must **re-export all its modules, components, hooks, and utilities**. Treat these as **entry points** for clean imports and clear APIs.
>
> **Example**
>
> ```ts
> // src/components/index.ts
> export * from './ui/Button';
> export * from './ui/Card';
> export * from './layout/Header';
> // Usage
> import { Button, Card, Header } from '@/components';
> ```

**Primary Architect:** [@mtalhazulf](https://github.com/mtalhazulf)
**Maintained by:** Texagon Engineering Team

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Architecture Principles](#-architecture-principles)
3. [Project Structure](#-project-structure)
4. [Environment Configuration](#-environment-configuration)
5. [HTTP Layer & Services](#-http-layer--services)
6. [State Management](#-state-management)
7. [Routing Patterns](#-routing-patterns)
8. [Component Patterns](#-component-patterns)
9. [Forms & Validation (no Zod)](#-forms--validation-no-zod)
10. [TanStack Table](#-tanstack-table)
11. [TypeScript Best Practices](#-typescript-best-practices)
12. [Performance Optimization](#-performance-optimization)
13. [Error Handling](#-error-handling)
14. [Testing Strategy](#-testing-strategy)
15. [Accessibility](#-accessibility)
16. [Security](#-security)
17. [Monitoring & Observability](#-monitoring--observability)
18. [Build & Deployment](#-build--deployment)
19. [Developer Experience](#-developer-experience)
20. [Troubleshooting](#-troubleshooting)

---

## 🧭 Overview

A **production-ready foundation** for scalable React apps with modern tooling and best practices.

### 🎯 Design Goals

* **Developer Productivity** — Fast refresh, type safety, great DX
* **Performance** — Optimized bundles, lazy loading, React 19 features
* **Maintainability** — Clear patterns and consistent structure
* **Scalability** — Modular, feature-first architecture
* **Reliability** — Robust error handling, testing, and monitoring

### 🛠️ Technology Stack

| Category   | Technology                | Purpose                          |
| ---------- | --------------------------| -------------------------------- |
| Runtime    | Bun                       | Fast package manager & scripts   |
| Build Tool | Vite                      | HMR and optimized builds         |
| Framework  | React 19                  | Latest concurrent features       |
| Language   | TypeScript 5+             | Type safety, DX                  |
| Router     | TanStack Router           | Type-safe file-based routing     |
| Data       | TanStack Query(Optional)  | Server-state caching & mutations |
| Tables     | TanStack Table            | Headless table logic             |
| Forms      | TanStack Form             | Type-safe form state             |
| State      | Zustand                   | Lightweight global state         |
| Styling    | Tailwind CSS              | Utility-first styling            |
| HTTP       | Axios                     | HTTP client with interceptors    |

---

## 🏛️ Architecture Principles

1. **Separation of Concerns** — UI, state, services, and infra are cleanly separated.
2. **Composition Over Inheritance** — Small components + custom hooks.
3. **Single Responsibility** — Each module does one thing well.
4. **Type Safety First** — Strict TS config, no `any` in prod; runtime checks where necessary (custom guards instead of Zod).
5. **Performance by Default** — Lazy routes, memoization, virtual lists, code splitting.

### 📐 Architectural Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Components, Hooks, Layouts)      │
├─────────────────────────────────────┤
│          State Layer                │
│   (Zustand, TanStack Query, Form)   │
├─────────────────────────────────────┤
│          Service Layer              │
│    (API clients, Business logic)    │
├─────────────────────────────────────┤
│          Infrastructure             │
│  (HTTP client, Config, Utilities)   │
└─────────────────────────────────────┘
```

---

## 📁 Project Structure

> **Entry-Point Convention:** Any directory (outside `/pages`) with `index.tsx` (or `index.ts`) **must** re-export that folder’s public API.

```
src/
├─ assets/               # Static files (images, fonts)
├─ components/
│  ├─ ui/                # Base primitives (Button, Input, Card)
│  ├─ layout/            # Header, Sidebar, Shells
│  └─ index.ts           # ⚠️ Barrel re-exports
├─ features/
│  ├─ auth/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ api/
│  │  └─ index.ts        # ⚠️ Barrel re-exports
│  └─ users/
│     ├─ components/
│     ├─ hooks/
│     ├─ api/
│     └─ index.ts        # ⚠️ Barrel re-exports
├─ hooks/
│  └─ index.ts           # ⚠️ Barrel re-exports
├─ pages/                # TanStack Router file routes
│  ├─ __root.tsx
│  ├─ index.tsx
│  └─ dashboard/
│     └─ index.tsx
├─ services/
│  ├─ http/              # axios client, errors, interceptors
│  ├─ user/
│  │  ├─ userService.ts
│  │  └─ types.ts
│  └─ index.ts           # ⚠️ Barrel re-exports
├─ store/
│  ├─ authStore.ts
│  ├─ uiStore.ts
│  └─ index.ts           # ⚠️ Barrel re-exports
├─ types/                # App-wide TS types only
├─ utils/
│  └─ index.ts           # ⚠️ Barrel re-exports
├─ config/
│  ├─ constants.ts
│  └─ env.ts
├─ styles/
│  └─ index.css
├─ main.tsx
└─ vite-env.d.ts
```

---

## ⚙️ Environment Configuration

### ✅ Use `APP_` Prefix (no `VITE_`)

* Configure Vite to expose `APP_` variables.
* Example variables: `APP_API_BASE_URL`, `APP_ENV`, `APP_LOG_LEVEL`, `APP_ENABLE_MSW`.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['APP_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
```

#### `.env.example`

```bash
APP_API_BASE_URL=https://api.example.com
APP_ENV=development # development|staging|production
APP_LOG_LEVEL=info  # debug|info|warn|error
APP_ENABLE_MSW=false
APP_SENTRY_DSN=
APP_ANALYTICS_ID=
```

### 🔒 Type-Safe Env Access (No Zod)

```ts
// src/config/env.ts
const required = (key: string) => {
  const val = (import.meta as any).env[`APP_${key}`];
  if (!val) throw new Error(`Missing APP_${key} in environment`);
  return val as string;
};

const asBool = (v: string | undefined, fallback = 'false') => (v ?? fallback) === 'true';

export const ENV = {
  API_BASE_URL: required('API_BASE_URL'),
  ENV: (required('ENV') as 'development' | 'staging' | 'production'),
  LOG_LEVEL: (required('LOG_LEVEL') as 'debug' | 'info' | 'warn' | 'error'),
  ENABLE_MSW: asBool((import.meta as any).env.APP_ENABLE_MSW),
} as const;
```

---

## 🌐 HTTP Layer & Services

### 📡 Axios Client with Interceptors

```ts
// src/services/http/client.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import { normalizeHttpError } from './errors';

const client: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    if (config.headers) {
      config.headers['X-Request-ID'] = crypto.randomUUID();
      config.headers['X-Client-Version'] = (import.meta as any).env.APP_VERSION || '1.0.0';
    }
    if (ENV.ENV === 'development') console.log('→', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeHttpError(error))
);

client.interceptors.response.use(
  (res) => {
    if (ENV.ENV === 'development') console.log('←', res.status, res.config.url);
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const err = normalizeHttpError(error);

    if (err.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const auth = useAuthStore.getState();
        if (auth.refreshToken) {
          await auth.refreshAccessToken();
          const newToken = useAuthStore.getState().token;
          if (newToken && original.headers) original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        }
      } catch (_) {
        useAuthStore.getState().logout();
        // Avoid hard redirects here; prefer router-aware navigation to preserve state.
// Example adapter approach (prevents circular deps): expose a tiny authNav.toLogin()
// that your router layer sets up at app start.
// import { authNav } from '@/services/http/authNav';
useAuthStore.getState().logout();
// authNav.toLogin?.();
      }
    }

    return Promise.reject(err);
  }
);

export default client;
```

### 🚨 Error Normalization (No Zod)

```ts
// src/services/http/errors.ts
import { AxiosError } from 'axios';

export interface HttpError {
  status: number | null;
  code?: string;
  message: string;
  details?: unknown;
  validationErrors?: Array<{ field: string; message: string }>;
  originalError?: unknown;
}

export function normalizeHttpError(error: unknown): HttpError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;
    const data = (error.response?.data ?? {}) as any;
    const message = data?.message || error.message || 'Network error';
    return {
      status,
      code: data?.code || error.code,
      message,
      details: data?.details,
      validationErrors: Array.isArray(data?.errors) ? data.errors : undefined,
      originalError: error,
    };
  }
  if (error instanceof Error) return { status: null, message: error.message, originalError: error };
  return { status: null, message: 'Unexpected error', originalError: error };
}

export function userMessage(err: HttpError): string {
  if (err.status === 401) return 'Please log in to continue.';
  if (err.status === 403) return "You don't have permission to perform this action.";
  if (err.status === 404) return 'Resource not found.';
  if (err.status === 422) return 'Please check your input and try again.';
  if (err.status && err.status >= 500) return 'Server error. Try again later.';
  return err.message || 'Something went wrong.';
}
```

### 🎯 Service Pattern (Types Only)

```ts
// src/services/user/types.ts
export type Role = 'admin' | 'user' | 'guest';
export interface User { id: number; email: string; name: string; avatar?: string | null; role: Role; createdAt: string; updatedAt: string; }
export interface Paginated<T> { data: T[]; meta: { total: number; page: number; perPage: number } }
export type CreateUserPayload = Pick<User, 'email' | 'name' | 'role'>;
export type UpdateUserPayload = Partial<CreateUserPayload>;
```

```ts
// src/services/user/userService.ts
import client from '../http/client';
import type { User, Paginated, CreateUserPayload, UpdateUserPayload } from './types';

export const userService = {
  async list(params?: { page?: number; perPage?: number; search?: string; role?: string }): Promise<Paginated<User>> {
    const res = await client.get('/users', { params });
    return res.data as Paginated<User>;
  },
  async get(id: number): Promise<User> {
    const res = await client.get(`/users/${id}`);
    return res.data as User;
  },
  async create(payload: CreateUserPayload): Promise<User> {
    const res = await client.post('/users', payload);
    return res.data as User;
  },
  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    const res = await client.patch(`/users/${id}`, payload);
    return res.data as User;
  },
  async remove(id: number): Promise<void> {
    await client.delete(`/users/${id}`);
  },
};
```

---

## 🧠 State Management

### 🎯 Zustand Stores

```ts
// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import client from '@/services/http/client';

interface User { id: number; email: string; name: string; role: string }

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
      refreshAccessToken: async () => {
        const rt = get().refreshToken;
        if (!rt) throw new Error('No refresh token');
        const res = await client.post('/auth/refresh', { refreshToken: rt });
        set({ token: res.data.token, refreshToken: res.data.refreshToken, user: res.data.user, isAuthenticated: true });
      },
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => localStorage), partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken, user: s.user }) }
  )
);
```

> **Security note:** Storing access/refresh tokens in `localStorage` is susceptible to XSS. For production, prefer **HTTP-only secure cookies** managed by the API (session or token-in-cookie) and keep client storage to minimal, non-sensitive data.

```ts
// src/store/uiStore.ts
import { create } from 'zustand';

export const useUIStore = create<{ isSidebarOpen: boolean; toggleSidebar: () => void; theme: 'light'|'dark'|'system'; setTheme: (t:'light'|'dark'|'system')=>void; activeModal: string|null; openModal:(id:string)=>void; closeModal:()=>void; toasts: Array<{id:string;message:string;type:'success'|'error'|'info'}>; addToast:(m:string,t:'success'|'error'|'info')=>void; removeToast:(id:string)=>void; }>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  toasts: [],
  addToast: (message, type) => set((s) => ({ toasts: [...s.toasts, { id: crypto.randomUUID(), message, type }] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
```

---

## 🧭 Routing Patterns

### 📍 Root Setup

```tsx
// src/pages/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
});

export const Route = createRootRoute({ component: Root });

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

### 🔒 Guards & Loaders (No Zod)

```tsx
// src/pages/admin/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: '/login', search: { redirect: location.href } });
    if (user?.role !== 'admin') throw redirect({ to: '/unauthorized' });
  },
  component: () => <div>Admin</div>,
});
```

```tsx
// src/pages/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { userService } from '@/services/user/userService';

export const Route = createFileRoute('/users/$userId')({
  parseParams: (p) => ({ userId: Number(p.userId) }),
  loader: async ({ params }) => ({ user: await userService.get(params.userId) }),
  component: () => {
    const { user } = Route.useLoaderData();
    return <div>{user.name}</div>;
  },
});
```

---

## 🧩 Component Patterns

* **Barrel Exports** for every public component folder.
* **Props-first**: co-locate prop types, document with JSDoc.
* **Hooks at top**: follow the Rules of Hooks.
* **Styling**: Tailwind for primitives; avoid deep, ad-hoc CSS.
* **Memoize** expensive components and computations.

```tsx
// Example skeleton
interface UserCardProps { user: { id:number; name:string; email:string }; onEdit?: () => void }
export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <div className="font-semibold">{user.name}</div>
      <div className="text-sm text-white/70">{user.email}</div>
      {onEdit && <button onClick={onEdit} className="mt-2 text-blue-400">Edit</button>}
    </div>
  );
}
```

---

## 📝 Forms & Validation (No Zod)

* Use **TanStack Form** with **custom validators** or light, local checks.
* Keep validation **UI-friendly**: inline messages, `aria-invalid`, and `aria-describedby`.

```tsx
// src/features/auth/LoginForm.tsx
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { userMessage } from '@/services/http/errors';

const rules = {
  email: (v: string) => (/.+@.+/.test(v) ? undefined : 'Invalid email address'),
  password: (v: string) => (v.length >= 6 ? undefined : 'Min 6 characters'),
};

export function LoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      // replace with authService.login
      return { token: 't', refreshToken: 'rt', user: { id: 1, email: payload.email, name: 'User', role: 'user' } };
    },
    onSuccess: (d) => setAuth(d.token, d.refreshToken, d.user),
  });

  const form = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
    onSubmit: async ({ value }) => { await login.mutateAsync({ email: value.email, password: value.password }); },
  });

  return (
    <form onSubmit={(e)=>{e.preventDefault(); form.handleSubmit();}} className="space-y-4">
      {form.useField({ name: 'email', validators: { onChange: rules.email } })((field) => (
        <div>
          <input aria-invalid={!!field.state.meta.errors?.length} value={field.state.value} onChange={(e)=>field.handleChange(e.target.value)} placeholder="Email" className="w-full rounded border px-3 py-2" />
          {field.state.meta.errors?.[0] && <p className="text-red-400 text-sm">{field.state.meta.errors[0]}</p>}
        </div>
      ))}
      {form.useField({ name: 'password', validators: { onChange: rules.password } })((field) => (
        <div>
          <input type="password" aria-invalid={!!field.state.meta.errors?.length} value={field.state.value} onChange={(e)=>field.handleChange(e.target.value)} placeholder="Password" className="w-full rounded border px-3 py-2" />
          {field.state.meta.errors?.[0] && <p className="text-red-400 text-sm">{field.state.meta.errors[0]}</p>}
        </div>
      ))}
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">{login.isPending ? 'Signing in…' : 'Sign in'}</button>
      {login.isError && <p className="text-red-400">{userMessage(login.error as any)}</p>}
    </form>
  );
}
```

---

## 📊 TanStack Table 

```tsx
// src/components/UsersTable.tsx
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

type User = { id:number; name:string; email:string; role:string; createdAt:string };

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'createdAt', header: 'Created', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString() },
];

export function UsersTable({ data }: { data: User[] }) {
  const [pageSize] = useState(10);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize } } });
  return (
    <div className="space-y-3">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="py-2">{flexRender(h.column.columnDef.header, h.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded border px-3 py-1 disabled:opacity-50">Prev</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
```

---

## 🎨 TypeScript Best Practices

* Enable **strict mode** and helpful `no*` flags.
* Prefer **type inference**; avoid explicit generics unless needed.
* Use **narrowed types** via custom guards for runtime.
* Keep **domain types** in `src/types` or `feature/…/types.ts`.

```json
// tsconfig.json (highlights)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

**Useful utilities**

```ts
export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
export const isDefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;
```

---

## ⚡ Performance Optimization

* **Code Split** heavy routes/components with `lazy()` and `Suspense`.
* Use `memo`, `useMemo`, and `useCallback` for expensive paths.
* **Virtualize** long lists (`@tanstack/react-virtual`).
* **Bundle hygiene**: vendor chunks, avoid large transient deps.

```tsx
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('@/features/dashboard'));

export function RouteWrapper() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

---

## 🚨 Error Handling

* Centralize error normalization.
* Wrap app shells with an **Error Boundary**.
* Show **toast** notifications for transient failures.

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface BoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode; // optional custom renderer
}

interface BoundaryState { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error as Error, this.reset);
      return (
        <div className="grid place-items-center gap-3 p-6 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm opacity-80">{this.state.error?.message ?? 'Unexpected error'}</p>
          <button onClick={this.reset} className="rounded bg-blue-600 px-4 py-2 text-white">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 🧪 Testing Strategy

* **Vitest + Testing Library** for unit/integration tests.
* Target: **~80%** coverage on critical paths.

```bash
bun add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({ plugins: [react()], test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] }, resolve: { alias: { '@': path.resolve(__dirname, './src') } } });
```

---

## ♿ Accessibility

* Keyboard-first: focus states, `tabindex`, and logical order.
* **Focus management:** on route changes and dialog open, move focus to the primary heading/first actionable control; restore focus when closing.
* **Trap focus in modals** and prevent background scroll while open.
* Use appropriate **ARIA roles** and labels.
* Use appropriate **ARIA roles** and labels.
* Maintain **contrast** and readable font sizes.
* Manage focus on route/dialog changes.

```tsx
export function Modal({ isOpen, onClose, title, children }: { isOpen:boolean; onClose:()=>void; title:string; children:React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 grid place-items-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-black">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button aria-label="Close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

---

## 🔒 Security

* **Never** render unsanitized HTML; avoid `dangerouslySetInnerHTML` with user data.
* Sanitize inputs, filenames, and URLs.
* Add **security headers** at the edge (Nginx/Traefik).
* Avoid leaking tokens to logs.

```ts
export const sanitizeEmail = (v: string) => v.trim().toLowerCase();
export const sanitizeFilename = (f: string) => f.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.{2,}/g, '.');
```

---

## 📊 Monitoring & Observability

* Integrate error tracking (SaaS or custom logger).
* **Note:** The `measure()` helper is console-only by default. Wire it to analytics (e.g., `analytics.track`) in production if you need persisted timings.
* Add **performance markers** around expensive flows.
* Track **web vitals** and SPA route changes.

```ts
export function measure(name: string) {
  const t0 = performance.now();
  return () => {
    const dt = performance.now() - t0;
    if (import.meta.env.DEV) console.log(`⏱️ ${name}: ${dt.toFixed(2)}ms`);
  };
}
```

---

## 🚀 Build & Deployment

### `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  }
}
```

### Docker (Multi-Stage) *(Optional: use if you ship as a static container)*

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf (Optional)
# Use this only if deploying behind Nginx. For Traefik, prefer labels on your service.
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  location / { try_files $uri $uri/ /index.html; }
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

**Traefik (example labels)**

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.app.rule=Host(`app.example.com`)
  - traefik.http.routers.app.entrypoints=websecure
  - traefik.http.routers.app.tls=true
  - traefik.http.services.app.loadbalancer.server.port=80
```

---

## 💻 Developer Experience 
### VSCode Settings

```json
{
  "eslint.useFlatConfig": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [{ "directory": "../", "changeProcessCWD": true }],
  "eslint.quiet": false,
  "eslint.format.enable": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.organizeImports": "always"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": { "*.css": "tailwindcss" }
}

```

### Recommended Extensions

```json
{ "recommendations": [
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode",
  "bradlc.vscode-tailwindcss",
  "usernamehw.errorlens",
  "streetsidesoftware.code-spell-checker",
  "ms-vscode.vscode-typescript-next",
  "oven.bun-vscode"
]}
```

---

## 🔧 Troubleshooting

* **Hydration errors**: any non-deterministic value during SSR (e.g., `Date.now()`, `Math.random()`, browser-only APIs, locale-dependent formatting) must run inside `useEffect` or be conditionally rendered on the client.
* **Infinite re-renders**: stabilize callbacks with `useCallback`; memoize derived data.
* **Broken imports**: enforce barrel exports in every `index.ts` and use `@/…` aliases.
* **Env not found**: ensure `envPrefix: ['APP_']` and `.env` values are set.

---

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export type ApiClientOptions = {
  baseURL?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

const DEFAULT_BASE_URL = "https://dummyjson.com";

export class ApiClient {
  private readonly instance: AxiosInstance;

  constructor(opts: ApiClientOptions = {}) {
    const { baseURL = DEFAULT_BASE_URL, headers, timeoutMs = 20_000 } = opts;

    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(headers ?? {}),
      },
      timeout: timeoutMs,
    });

    this.instance.interceptors.request.use((config) => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        if (token) {
          config.headers = {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${token}`,
          } as typeof config.headers;
        }
      } catch {
        // ignore storage errors
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const status = error.response?.status ?? 0;
        const data = error.response?.data as Record<string, unknown> | undefined;
        const message =
          (typeof data === "object" && data && "message" in data ? String(data.message) : null) ||
          error.message ||
          "Request failed";

        if (status === 401) {
          try {
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth_token");
              const redirectTo = window.location.pathname + window.location.search;
              const url = `/?redirect=${encodeURIComponent(redirectTo)}`;
              if (window.location.pathname !== "/") {
                window.location.assign(url);
              }
            }
          } catch {
            // ignore me here
          }
        }
        return Promise.reject(new Error(`${status}: ${message}`));
      },
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then((r) => r.data);
  }
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then((r) => r.data);
  }
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config).then((r) => r.data);
  }
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<T>(url, data, config).then((r) => r.data);
  }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config).then((r) => r.data);
  }
}

export const api = new ApiClient();

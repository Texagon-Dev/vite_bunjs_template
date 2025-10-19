export type EnvRecord = Record<string, string>;

export class Env {
  private static _instance: Env | null = null;
  private readonly data: EnvRecord;

  private constructor() {
    const win = (typeof window !== "undefined" ? (window as unknown) : ({} as unknown)) as {
      __ENV__?: EnvRecord;
    };

    const defaults: EnvRecord = {
      APP_API_BASE: "/api",
      APP_ENV: "development",
    };
    // Any Kind of Mutations Here [win.__ENV__]
    this.data = {
      ...defaults,
      ...(win.__ENV__ || {}),
    };
  }

  static instance(): Env {
    if (!this._instance) this._instance = new Env();
    return this._instance;
  }

  get(key: string, fallback?: string): string | undefined {
    return this.data[key] ?? fallback;
  }

  getRequired(key: string): string {
    const v = this.data[key];
    if (v == null) throw new Error(`Missing required env: ${key}`);
    return v;
  }

  apiBase(): string {
    return this.get("APP_API_BASE", "/api") as string;
  }

  env(): string {
    return this.get("APP_ENV", "development") as string;
  }

  all(): EnvRecord {
    return { ...this.data };
  }
}
// For All Folks Reading this
/*
    This is the Source of Truth. Means This Will be Used on Runtime Injection at Start
    and will be used to get env variables at runtime.
    --> No More import.meta.env
    --> No More process.env
*/
export const env = (): Env => Env.instance();

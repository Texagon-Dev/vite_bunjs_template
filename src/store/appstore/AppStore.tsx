// This will Host the Basic AppSettings for this App Only like ThemeColor , Selected Language etc
import { create } from "zustand";

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));

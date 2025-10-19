import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { DefaultURLSearchPaginationParamters } from "@/types";

import { useAppStore } from "../store";

export const Header = () => {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => {
    const isDark = theme === "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [theme]);
  return (
    <div
      className={` ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} bg-amber-400 h-full`}
    >
      <nav className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-amber-400 h-full">
        <div className="font-bold text-lg">⚡ App Template</div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link
            to="/dynammic"
            className="hover:underline"
            search={DefaultURLSearchPaginationParamters}
          >
            Dynammic
          </Link>
          <Link to="/env" className="hover:underline">
            ENV
          </Link>
          <Link
            to="/products"
            className="hover:underline"
            search={{ page: 1, pageSize: 10, sortBy: "title", sortDir: "asc", q: "", category: "" }}
          >
            Products
          </Link>
          <button
            onClick={toggleTheme}
            className="px-2 py-1 text-sm rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>
    </div>
  );
};

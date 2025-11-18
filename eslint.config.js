import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prettierConfig = JSON.parse(readFileSync(resolve(__dirname, ".prettierrc.json"), "utf8"));

const compat = new FlatCompat({ baseDirectory: process.cwd() });

export default [
  // Ignored paths
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "**/node_modules/eslint-module-utils/tsconfig.json",
      ".env*",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "vite.config.*",
      "postcss.config.*",
      "tailwind.config.*",
      "setupTests.*",
      "scripts/**/*.mjs",
      "**/routeTree.gen.ts",
    ],
  },

  // Base JS + TS + React configs
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended,
  // ...compat.extends("plugin:jsx-a11y/recommended"),

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        // Use project service to auto-detect tsconfig for type-aware linting
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      import: pluginImport,
      "react-hooks": pluginReactHooks,
      prettier: pluginPrettier,
      "@tanstack/router": pluginRouter,
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: true,
      },
    },

    rules: {
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],

      /* --- React / Hooks --- */
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* --- Accessibility --- */
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/alt-text": "warn",

      /* --- Import hygiene --- */
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-cycle": "warn",
      "import/no-self-import": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      /* --- Async / Promises --- */
      "no-async-promise-executor": "error",
      "no-await-in-loop": "warn",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "warn",

      /* --- Code Quality / Style --- */
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "prefer-arrow-callback": "warn",
      "arrow-body-style": ["warn", "as-needed"],
      "object-shorthand": "warn",
      "prefer-template": "warn",

      /* --- React Performance --- */
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/jsx-fragments": ["error", "syntax"],
      "react/no-unstable-nested-components": "warn",
      "react/self-closing-comp": "error",

      /* --- Security --- */
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      /* --- TanStack Router / TypeScript interop --- */
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              package: "@tanstack/router-core",
              name: "Redirect",
            },
          ],
        },
      ],
      /* --- Prettier Integration --- */
      "prettier/prettier": [
        "error",
        {
          ...prettierConfig,
        },
      ],
    },
  },

  // Prettier config must be last
  prettier,

  // .d.ts files (relax strictness)
  {
    files: ["*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },

  // TSX: relax function return type rule
  // {
  //   files: ["**/*.tsx"],
  //   rules: {
  //     "@typescript-eslint/explicit-function-return-type": "off",
  //     "jsx-a11y/label-has-associated-control": "warn",
  //   },
  // },
];

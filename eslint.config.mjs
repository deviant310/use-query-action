import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// TODO добавить условные правила при NODE_ENV=production
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "builtin",
            "react",
            "external",
            "internal",
            "parent",
            "sibling",
          ],
          customGroups: {
            value: {
              react: ["react", "react-dom/*"],
            },
          },
        },
      ],
    },
  },
  {
    plugins: {
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    name: "typescript-eslint",
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    rules: {
      "no-undefined": "error",
      "no-void": "error",
      "no-console": "off",
      "no-debugger": "off",
    },
  },
];

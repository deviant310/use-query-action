import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import { fixupPluginRules } from "@eslint/compat";

// TODO добавить условные правила при NODE_ENV=production
export default [
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "prettier": eslintPluginPrettier
    },
    rules: {
      "prettier/prettier": "error"
    }
  },
  {
    plugins: {
      perfectionist
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
            "sibling"
          ],
          customGroups: {
            "value": {
              "react": ["react", "react-dom/*"]
            }
          }
        }
      ]
    }
  },
  {
    plugins: {
      "react-hooks": fixupPluginRules(eslintPluginReactHooks)
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error"
    }
  },
  {
    name: "typescript-eslint",
    rules: {
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    "rules": {
      "no-undef": "error",
      "no-undefined": "error",
      "no-void": "error",
      "no-console": "off",
      "no-debugger": "off",
    }
  }
];

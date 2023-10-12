module.exports = {
  plugins: ["react", "react-hooks", "prettier", "import", "@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": 0,
    "react/display-name": 0,
    "react-hooks/exhaustive-deps": 0, // Disable until find a better alternative
    "space-before-function-paren": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 1,
    "@next/next/no-img-element": 0, // Disable until find a better alternative
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
          },
          {
            pattern: "next/**",
            group: "builtin",
          },
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "next/**"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
  },
  root: true,
};

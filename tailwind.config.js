// eslint-disable-next-line
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".inset-center": {
          "@apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2": {},
        },
        ".inset-y-center": {
          "@apply top-1/2 -translate-y-1/2": {},
        },
        ".inset-x-center": {
          "@apply left-1/2 -translate-x-1/2": {},
        },
      });
    }),
    plugin(
      ({ matchUtilities, theme }) => {
        matchUtilities(
          {
            "color-context": (value) => {
              if (typeof value === "object") {
                let vars = {};
                Object.entries(value).forEach(([key, val]) => {
                  vars[`--context-color-${key}`] = val;
                });
                return vars;
              }
              return null;
            },
          },
          {
            values: theme("colors"),
          },
        );
      },
      {
        theme: {
          extend: {
            colors: {
              context: {
                DEFAULT: "var(--context-color-500, #64748b)",
                50: "var(--context-color-50, #f8fafc)",
                100: "var(--context-color-100, #f1f5f9)",
                200: "var(--context-color-200, #e2e8f0)",
                300: "var(--context-color-300, #cbd5e1)",
                400: "var(--context-color-400, #94a3b8)",
                500: "var(--context-color-500, #64748b)",
                600: "var(--context-color-600, #475569)",
                700: "var(--context-color-700, #334155)",
                800: "var(--context-color-800, #1e293b)",
                900: "var(--context-color-900, #0f172a)",
                950: "var(--context-color-950, #020617)",
              },
            },
          },
        },
      },
    ),
  ],
};

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e9ff",
          200: "#b3d3ff",
          300: "#80b6ff",
          400: "#4d8ffc",
          500: "#2568e8",
          600: "#1a4fc2",
          700: "#173f99",
          800: "#16367a",
          900: "#152f63",
        },
        surface: {
          DEFAULT: "#f6f8fb",
          card: "#ffffff",
          border: "#e6eaf1",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(21, 47, 99, 0.04), 0 4px 12px -2px rgba(21, 47, 99, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;

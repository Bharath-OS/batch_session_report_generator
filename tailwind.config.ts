import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#0F172A",
        primary: {
          light: "#E0F2FE",
          DEFAULT: "#0284C7",
          dark: "#0369A1",
        },
        secondary: {
          light: "#F1F5F9",
          DEFAULT: "#64748B",
          dark: "#334155",
        },
        success: {
          light: "#D1FAE5",
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        danger: {
          light: "#FEE2E2",
          DEFAULT: "#EF4444",
          dark: "#DC2626",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;

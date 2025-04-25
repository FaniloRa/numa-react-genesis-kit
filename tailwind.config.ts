
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-purple': '#E5DEFF',
        'soft-blue': '#D3E4FD',
        'vivid-purple': '#8B5CF6',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

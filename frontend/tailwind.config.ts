import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-space)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"]
      },
      colors: {
        base: {
          50: "#f4fbff",
          100: "#e8f6ff",
          900: "#09121a"
        },
        accent: {
          400: "#35d0ba",
          500: "#20bfa8",
          700: "#1a8e82"
        },
        secondary: {
          400: "#69a3ff",
          600: "#3f77ce"
        }
      },
      boxShadow: {
        glass: "0 8px 30px rgba(31, 38, 135, 0.2)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

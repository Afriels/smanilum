import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f3ff",
          100: "#e9e5ff",
          200: "#d4ccff",
          300: "#b5a7ff",
          400: "#9373ff",
          500: "#7850ff",
          600: "#6031f0",
          700: "#5124cf",
          800: "#431fa8",
          900: "#391c85"
        },
        slate: {
          950: "#050816"
        }
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(127deg, #2a729b 0%, #576ac7 26%, #ed53db 100%)"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;

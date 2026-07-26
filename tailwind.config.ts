import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf9f7",
          100: "#f5f3ef",
          200: "#e8e4dc",
          300: "#d4cec2",
          400: "#b8b0a0",
          500: "#9a8f7e",
          600: "#7d7264",
          700: "#5e554a",
          800: "#3d3730",
          900: "#1f1c18",
          950: "#0f0e0c",
        },
        gold: {
          50: "#fdf8f0",
          100: "#f9ecd6",
          200: "#f0d4a8",
          300: "#e4b56e",
          400: "#d49a3e",
          500: "#c4841e",
          600: "#a86a12",
          700: "#8a530e",
          800: "#6d410c",
          900: "#52330d",
        },
      },
      fontFamily: {
        // Wired to the next/font CSS variables set in app/layout.tsx.
        // Previously `serif` was Georgia while Playfair was downloaded and never
        // used - the font was costing bandwidth on every page load for nothing.
        serif: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-body)", "Karla", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
    },
  },
  plugins: [],
}

export default config

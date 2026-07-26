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
        // Warm stone running to espresso. The previous 50 was #faf9f7 -
        // effectively white - which made every page glare, with pure-white
        // cards sitting on top of it. Dropping the page background's luminance
        // and lifting cards to a soft off-white gives depth instead of glare.
        brand: {
          50: "#efe9df",
          100: "#e5ded1",
          200: "#d5c9b6",
          300: "#bcab91",
          400: "#9d8b6f",
          500: "#7f6e56",
          600: "#655643",
          700: "#4b4033",
          800: "#332b23",
          900: "#1d1811",
          950: "#12100b",
        },
        // Cards and panels. Lighter than the page so surfaces separate, but
        // still warm - never pure #fff.
        surface: {
          DEFAULT: "#fbf8f3",
          muted: "#f6f1e9",
        },
        // Secondary accent: deep oxblood, drawn from the maroon saree in the
        // brand photography and common in South Indian temple jewellery.
        // Gives sale/status moments somewhere to live other than gold.
        spice: {
          50: "#fbf1f0",
          100: "#f5ddda",
          200: "#e6b8b2",
          300: "#d18b82",
          400: "#b55f54",
          500: "#94413a",
          600: "#7a332e",
          700: "#5f2724",
          800: "#461d1b",
          900: "#301413",
        },
        // Antique gold - slightly deeper and less brassy than before so it
        // reads as metal rather than yellow against the warmer background.
        gold: {
          50: "#fbf5ea",
          100: "#f4e6cc",
          200: "#e8cd9c",
          300: "#d9ae67",
          400: "#c8913e",
          500: "#b17724",
          600: "#95601a",
          700: "#794b15",
          800: "#5d3a13",
          900: "#452c12",
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

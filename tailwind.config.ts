import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#DC143C",
        "brand-dark": "#B91C3C",
        "brand-light": "#F43F5E",
        "brand-bg": "#FFF1F2",
        "brand-navy": "#1A1A2E",
        "brand-navy-light": "#2D2D44",
        "premium-gold": "#F59E0B",
        "rose-50": "#FFF1F2",
        "rose-100": "#FFE4E6",
        "rose-200": "#FECDD3",
        "warm-white": "#FFFBFA",
        "cream": "#FEF7F0",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

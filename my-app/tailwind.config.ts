import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b5161e", // Crimson Red
        secondary: "#005caa", // Deep Royal Blue
        tertiary: "#755700", // Sunny Gold
        surface: "#f6f6f6", // Neutral Base
        "surface-container-low": "#f0f1f1",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#acadad",
        "on-surface": "#2d2f2f",
        emerald: "#10b981", // Accent
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)"], // Next/Font integration
        cairo: ["var(--font-cairo)"],
      },
      boxShadow: {
        // 40px blur, 5% opacity, #2d2f2f
        ambient: "0 20px 40px 0 rgba(45, 47, 47, 0.05)", 
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".glassmorphism": {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
      });
    }),
  ],
} satisfies Config;

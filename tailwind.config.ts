import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgray: "#1B1B1B",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      // 👇 Added this part
      keyframes: {
        pulseScaleColor: {
          "0%, 100%": { transform: "scale(1)", color: "#000000" }, // small & black
          "50%": { transform: "scale(1.25)", color: "#ffffff" },   // larger & white
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #ff6b01, 0 0 10px #ff6b01" },
          "50%": { boxShadow: "0 0 20px #ffd522, 0 0 30px #ff6b01" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.1)", filter: "drop-shadow(0 0 8px #ffd522)" },
        },
      },
      animation: {
        pulseScaleColor: "pulseScaleColor 1.5s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        pulseGlow: "pulseGlow 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

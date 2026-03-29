/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'], 
        display: ['"Oswald"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mbgSoft: {
          "primary": "#F97316", // Orange-500 (Soft Orange)
          "secondary": "#FFEDD5", // Orange-100 (Peach)
          "accent": "#FDBA74", // Orange-300
          "neutral": "#F3F4F6", // Gray-100
          "base-100": "#FFFFFF", // White
          "info": "#38BDF8", // Sky-400
          "success": "#4ADE80", // Green-400
          "warning": "#FBBF24", // Amber-400
          "error": "#F87171", // Red-400
          
          "--rounded-box": "1rem", 
          "--rounded-btn": "0.5rem", 
          "--rounded-badge": "1rem",
          
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      "light",
      "dark",
      "mbgSoftDark"
    ],
  },
}
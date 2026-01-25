/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'], 
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px var(--shadow-color)',
        'neo-sm': '3px 3px 0px 0px var(--shadow-color)',
        'neo-lg': '8px 8px 0px 0px var(--shadow-color)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mbgTheme: {
          "primary": "#C2410C", 
          "secondary": "#FB923C",
          "accent": "#FB923C",
          "neutral": "#E5E5E5",
          "base-100": "#FFF7ED",
          "info": "#3ABFF8",
          "success": "#36D399", 
          "warning": "#FBBD23",
          "error": "#F87272",
          
          "--rounded-box": "1rem", 
          "--rounded-btn": "0.5rem", 
          "--rounded-badge": "1.9rem",
          
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          
          "--btn-focus-scale": "0.95",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "1rem",
        },
        mbgDark: {
          "primary": "#0046FF", 
          "secondary": "#FFAC41",
          "accent": "#FFAC41",
          "neutral": "#323232",
          "base-100": "#000000",
          "info": "#3ABFF8",
          "success": "#36D399", 
          "warning": "#FBBD23",
          "error": "#F87272",
          
          "--rounded-box": "1rem", 
          "--rounded-btn": "0.5rem", 
          "--rounded-badge": "1.9rem",
          
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          
          "--btn-focus-scale": "0.95",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "1rem",
        },
      },
    ],
  },
}
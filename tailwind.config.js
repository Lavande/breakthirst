/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F27A54",
          dark: "#D55F39",
        },
        secondary: {
          DEFAULT: "#7A54F2",
          dark: "#5F39D5",
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        breakthirst: {
          "primary": "#F27A54",
          "secondary": "#7A54F2",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
} 
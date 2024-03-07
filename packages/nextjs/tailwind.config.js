/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: "#00bde5",
          "primary-content": "#000000",
          secondary: "#e573e5",
          "secondary-content": "#000000",
          accent: "#80ff9f",
          "accent-content": "#000000",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#000000",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        scaffoldEthDark: {
          primary: "#00bde5",
          "primary-content": "#000000",
          secondary: "#e573e5",
          "secondary-content": "#000000",
          accent: "#80ff9f",
          "accent-content": "#000000",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#000000",
          "base-200": "#faf7f5",
          "base-300": "#ffffff",
          "base-content": "#ffffff",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "hsl(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        primary: "-6px 6px 0px 1px rgb(0 189 229 / 1.0)",
        secondary: "-6px 6px 0px 1px rgb(229 115 229 / 1.0)",
        accent: "-6px 6px 0px 1px rgb(128 255 159 / 1.0)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
    fontFamily: {
      pixel: ["Pixel", "sans-serif"],
      helvetica: ["Helvetica", "sans-serif"],
      "helvetica-bold": ["Helvetica-Bold"],
    },
  },
};

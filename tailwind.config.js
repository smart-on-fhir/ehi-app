const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */

// Custom colors
// Cardinal
const red = {
  50: "#fae9e9",
  100: "#f5d4d3",
  200: "#eca9a7",
  300: "#e27d7a",
  400: "#d9524e",
  500: "#cf2722",
  600: "#a61f1b",
  700: "#7c1714",
  800: "#53100e",
  900: "#290807",
};
// ALMOND X YELLOW METAL
const neutral = {
  50: "#fdfbfa",
  100: "#fbf8f5",
  200: "#f8f0ea",
  300: "#f4e9e0",
  400: "#f1e1d5",
  500: "#eddacb",
  600: "#beaea2",
  700: "#8e837a",
  800: "#5f5751",
  900: "#2f2c29",
};
// YELLOW METAL
const primary = {
  50: "#f1f0ec",
  100: "#e3e0d8",
  200: "#c7c2b1",
  300: "#aaa38a",
  400: "#8e8563",
  500: "#72663c",
  600: "#5b5230",
  700: "#443d24",
  800: "#2e2918",
  900: "#17140c",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 500ms ease-in-out",
      },
      colors: {
        // Palettes
        red: red,
        neutral: neutral,
        primary: primary,
        // Specific colors
        active: primary["500"],
        "active-dark": primary["600"],
        alert: red["500"],
        "alert-dark": red["600"],
      },
      borderColor: {
        DEFAULT: colors.stone[500],
      },
      divideColor: {
        DEFAULT: colors.stone[500],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

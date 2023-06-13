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
const yellow = {
  50: "#faf6e9",
  100: "#f4ecd2",
  200: "#e9d9a5",
  300: "#dfc678",
  400: "#d4b34b",
  500: "#c9a01e",
  600: "#a18018",
  700: "#796012",
  800: "#50400c",
  900: "#282006",
};
const green = {
  50: "#edf1ec",
  100: "#dae3d8",
  200: "#b6c7b1",
  300: "#91aa8a",
  400: "#6d8e63",
  500: "#48723c",
  600: "#3a5b30",
  700: "#2b4424",
  800: "#1d2e18",
  900: "#0e170c",
};
// ALMOND
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
// Status Indicator Colors
// awaiting-input`
const awaitingInput = yellow[200];
// requested`
const requested = yellow[400];
// in-review`
const inReview = "#abc1e4";
// approved`
const approved = green[400];
// aborted`
const aborted = "#e4aa86";
// rejected`
const rejected = red[400];

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
        green: green,
        yellow: yellow,
        neutral: neutral,
        primary: primary,
        // Specific colors
        active: primary["500"],
        "active-dark": primary["600"],
        alert: red["500"],
        "alert-dark": red["600"],
        "awaiting-input": awaitingInput,
        requested,
        "in-review": inReview,
        approved,
        aborted,
        rejected,
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

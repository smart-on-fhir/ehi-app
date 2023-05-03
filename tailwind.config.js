const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cardinal
        red: {
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
        },
        // ALMOND X YELLOW METAL
        neutral: {
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
        },
        // YELLOW METAL -

        primary: {
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
        },
        gray: colors.stone,
        // // WESTAR X SAN JUAN
        // neutral: {
        //   50: "#fcfcfb",
        //   100: "#f9f9f8",
        //   200: "#f4f3f1",
        //   300: "#eeece9",
        //   400: "#e9e6e2",
        //   500: "#e3e0db",
        //   600: "#b6b3af",
        //   700: "#888683",
        //   800: "#5b5a58",
        //   900: "#2d2d2c",
        // },
        // // SAN JUAN
        // primary: {
        //   50: "#eaedf0",
        //   100: "#d4dbe0",
        //   200: "#a9b7c1",
        //   300: "#7f92a2",
        //   400: "#546e83",
        //   500: "#294a64",
        //   600: "#213b50",
        //   700: "#192c3c",
        //   800: "#101e28",
        //   900: "#080f14",
        // },
        // // SARATOGA
        // primary: {
        //   50: "#efefe7",
        //   100: "#dfe0cf",
        //   200: "#bec09f",
        //   300: "#9ea16f",
        //   400: "#7d813f",
        //   500: "#5d620f",
        //   600: "#4a4e0c",
        //   700: "#383b09",
        //   800: "#252706",
        //   900: "#131403",
        // },
        // // TANA x SARA
        // neutral: {
        //   50: "#fcfcf9",
        //   100: "#f8f8f2",
        //   200: "#f1f1e5",
        //   300: "#eaebd9",
        //   400: "#e3e4cc",
        //   500: "#dcddbf",
        //   600: "#b0b199",
        //   700: "#848573",
        //   800: "#58584c",
        //   900: "#2c2c26",
        // },
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

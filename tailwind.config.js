/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: colors.stone[500],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

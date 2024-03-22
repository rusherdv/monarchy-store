/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [    nextui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#52525B",
            foreground: "#FFFFFF",
          },
        },
      },
    },
  }),]
}


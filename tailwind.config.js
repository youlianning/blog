const colors = require("tailwindcss/colors")

module.exports = {
  purge: [
    "./posts/**/*.md",
    "./node_modules/@celesta/vuepress-theme-celesta/lib/**/*.css",
    "./node_modules/@celesta/vuepress-theme-celesta/lib/**/*.vue",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.cyan,
        secondary: colors.pink,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}

import { defineUserConfig } from "vuepress"
import { translations } from "./translations"
import type { ThemeOptions } from "@celesta/vuepress-theme-celesta"

export default defineUserConfig<ThemeOptions>({
  title: "TTF's blog",
  description: "Technique && Life",

  lang: "zh-CN",
  base: process.env.BASE_PATH || "/",
  head: [["link", { rel: "icon", href: `/logo.png` }]],

  locales: {
    "/": {
      lang: "zh-CN",
    },
  },

  plugins: [],

  theme: "@celesta/vuepress-theme-celesta",
  themeConfig: {
    repo: "nsznsznjsz/blog",
    particles: "particles-preset-starry.json",
    translations,
  },
})

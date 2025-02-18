import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "RTS Memoirs",
  description: "RTS Memoirs By LHN",

  theme,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&family=ZCOOL+KuaiLe&display=swap', rel: 'stylesheet' }],
  ],

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});

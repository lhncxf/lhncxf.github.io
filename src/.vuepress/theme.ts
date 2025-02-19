import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://lhncxf.github.io",

  author: {
    name: "LHN",
    url: "https://lhncxf.github.io",
    email: 'kobeluhaonan@gmail.com'
  },

  logo: "/logo.png",

  repo: "lhncxf/lhncxf.github.io",

  docsDir: "src/docs",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "默认页脚",
  displayFooter: true,

  // 博客相关
  blog: {
    avatar: "/avatar.jpg",
    description: "一个前端开发者",
    intro: "/intro.html",
    medias: {
      Baidu: "https://example.com",
      BiliBili: "https://example.com",
      Bitbucket: "https://example.com",
      Dingding: "https://example.com",
      Discord: "https://example.com",
      Dribbble: "https://example.com",
      Email: "mailto:kobeluhaonan@163.com",
      Evernote: "https://example.com",
      Facebook: "https://example.com",
      Flipboard: "https://example.com",
      Gitee: "https://example.com",
      GitHub: "https://example.com",
      Gitlab: "https://example.com",
      Gmail: "mailto:kobeluhaonan@gmail.com",
      Instagram: "https://example.com",
      Lark: "https://example.com",
      Lines: "https://example.com",
      Linkedin: "https://example.com",
      Pinterest: "https://example.com",
      Pocket: "https://example.com",
      QQ: "https://example.com",
      Qzone: "https://example.com",
      Reddit: "https://example.com",
      Rss: "https://example.com",
      Steam: "https://example.com",
      Twitter: "https://example.com",
      Wechat: "https://example.com",
      Weibo: "https://example.com",
      Whatsapp: "https://example.com",
      Youtube: "https://example.com",
      Zhihu: "https://example.com"
    },
  },

  // 加密配置
  encrypt: {
    config: {},
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    // 启用属性支持
    attrs: true,
    // 启用代码块分组
    codeTabs: true,
    // 启用组件快速使用
    component: true,
    // 启用代码演示
    demo: true,
    // 启用 figure
    figure: true,
    // 启用图片懒加载
    imgLazyload: true,
    // 启用图片标记
    imgMark: true,
    // 启用图片大小
    imgSize: true,
    // 启用gfm警告
    alert: true,
    // 启用gfm保证在站点和github上保持一致
    gfm: true,
    // 启用导入文件
    include: true,
    // 启用标记
    mark: true,
    plantuml: true,
    // 启用剧透模式
    spoiler: true,
    // 启用脚注
    footnote: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    // 启用上下角标
    sub: true,
    sup: true,
    // 启用选项卡
    tabs: true,
    // 启用任务列表
    tasklist: true,
    // 启用markdown v-pre
    vPre: true,
    // 思维导图 启用前安装 pnpm add -D markmap-lib markmap-toolbar markmap-view
    markmap: true,
    // https://theme-hope.vuejs.press/zh/guide/markdown/code/kotlin-playground.html
    // kotlinPlayground: true,

    // 启用数学公式，取消注释它们如果你需要 TeX 支持
    math: {
      // 启用前安装 katex
      type: "katex",
      // 或者安装 mathjax-full
      // type: "mathjax",
    },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    revealjs: {
      plugins: ["highlight", "math", "search", "notes", "zoom"],
    },

    // 在启用之前安装 chart.js
    chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    echarts: true,

    // 在启用之前安装 flowchart.ts
    flowchart: true,

    // 在启用之前安装 mermaid
    mermaid: true,

    playground: {
      presets: ["vue"],
    },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,
    // 全局搜索插件
    slimsearch: true,
    // 水印
    watermark: false,

    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: [
        "ArtPlayer",
        "Badge",
        "BiliBili",
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "StackBlitz",
        "VPBanner",
        "VPCard",
        "VidStack",
        "XiGua"
      ],
    },

    icon: {
      prefix: "fa6-solid:",
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});

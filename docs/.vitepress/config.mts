import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "10年前端老炮知识库",
  description: "个人深度技术与业务复盘",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '技术与研发', link: '/02_技术与研发/' },
      { text: '产品与设计', link: '/03_产品与设计/' },
      { text: '运营与营销', link: '/04_运营与营销/' }
    ],
    sidebar: [
      {
        text: '知识库分类',
        items: [
          { text: '技术与研发', link: '/02_技术与研发/' },
          { text: '产品与设计', link: '/03_产品与设计/' },
          { text: '运营与营销', link: '/04_运营与营销/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lhncxf' }
    ]
  }
})

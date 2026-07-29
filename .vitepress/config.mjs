import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "云北知识库",
  description: "关于云北的知识库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    nav: [
      { text: '指南', link: '/docs/guide/' }
    ],
    head: [["link", { rel: "icon", href: "/logo.png" }]],

    sidebar: [
      {
        text: '云北指南',
        collapsed: false,
        items: [
          { text: '开始', link: '/docs/guide/' },
          { text: '开发成员', link: '/docs/guide/team' }
        ]
      }
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    returnToTopLabel: '返回顶部',

    darkModeSwitchLabel: '外观',

    editLink: {
      pattern: `https://github.com/Corona-Studio/docs/edit/main/:path`,
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      copyright: "Copyright@ 2026 BGSDT"
    },

    search: {
      provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              noResultsText: "无法找到相关结果",
              resetButtonTitle: "清除查询条件",
              footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Crawl4AI Design",
  description: "Crawl4AI 架构设计文档站 - 开源 LLM 友好型网页爬虫",
  lang: "zh-CN",
  base: "/crawl4ai-design/",

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "首页", link: "/" },
      { text: "架构概览", link: "/architecture" },
      { text: "爬取配置", link: "/crawler-config" },
      { text: "内容提取", link: "/extraction" },
      { text: "深度爬取", link: "/deep-crawling" },
      { text: "高级特性", link: "/advanced" },
    ],

    sidebar: [
      {
        text: "文档",
        items: [
          { text: "首页", link: "/" },
          { text: "架构概览", link: "/architecture" },
          { text: "爬取配置", link: "/crawler-config" },
          { text: "内容提取策略", link: "/extraction" },
          { text: "深度爬取", link: "/deep-crawling" },
          { text: "高级特性", link: "/advanced" },
          { text: "API 参考", link: "/api" },
          { text: "快速开始", link: "/getting-started" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/YeLuo45/crawl4ai-design" },
    ],

    footer: {
      message: "基于 unclecode/crawl4ai 开源项目构建",
      copyright: "Copyright © 2025-present Crawl4AI Contributors",
    },
  },
});

---
layout: home

hero:
  name: "Crawl4AI"
  text: "LLM 友好型网页爬虫"
  tagline: "基于 unclecode/crawl4ai 开源项目构建"
  image:
    src: /logo.svg
    alt: Crawl4AI Logo
  actions:
    - theme: brand
      text: 架构分析
      link: /architecture
    - theme: brand
      text: 快速开始
      link: /getting-started

features:
  - icon: 🏗️
    title: 架构概览
    details: 异步浏览器池、LLM 输出优化、Adaptive Intelligence 自适应爬取
    link: /architecture
    linkText: 查看详情
  - icon: ⚙️
    title: 爬取配置
    details: BrowserConfig、CrawlerRunConfig、HTTPCrawlerConfig 完整配置体系
    link: /crawler-config
    linkText: 查看详情
  - icon: 📄
    title: 内容提取策略
    details: LLMExtraction / CosineStrategy / JsonCssExtraction 多种提取方式
    link: /extraction
    linkText: 查看详情
  - icon: 🕷️
    title: 深度爬取
    details: BFS/DFS/BFF 策略、Crash Recovery、Prefetch Mode
    link: /deep-crawling
    linkText: 查看详情
  - icon: 🛡️
    title: 反爬与代理
    details: 3-Tier Anti-Bot Detection、Proxy Rotation、User Agent 生成
    link: /advanced
    linkText: 查看详情
  - icon: 💻
    title: API 参考
    details: AsyncWebCrawler 完整 API、async/await 异步接口、结果模型
    link: /api
    linkText: 查看详情
---

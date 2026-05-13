# Crawl4AI Design

Crawl4AI 架构设计文档站，基于 [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) 开源项目。

## 系统概述

Crawl4AI 是一个专为 LLM 设计的异步网页爬虫，输出干净的 Markdown 用于 RAG 和 AI 数据管道。

## 核心架构

- **AsyncWebCrawler**: 异步浏览器池管理
- **内容处理管道**: Filter → Scraping → Extraction → Markdown
- **深度爬取**: BFS / DFS / BFF 策略
- **LLM 集成**: 语义理解提取、多模型支持

## 文档导航

- [首页](https://yeluo45.github.io/crawl4ai-design/) - 系统概览
- [架构概览](https://yeluo45.github.io/crawl4ai-design/architecture) - 完整架构
- [爬取配置](https://yeluo45.github.io/crawl4ai-design/crawler-config) - BrowserConfig / CrawlerRunConfig
- [内容提取](https://yeluo45.github.io/crawl4ai-design/extraction) - LLM / CSS / XPath 提取
- [深度爬取](https://yeluo45.github.io/crawl4ai-design/deep-crawling) - BFS/DFS/BFF 策略
- [高级特性](https://yeluo45.github.io/crawl4ai-design/advanced) - 反爬、代理、监控
- [API 参考](https://yeluo45.github.io/crawl4ai-design/api) - AsyncWebCrawler 完整 API

## 技术栈

| 组件 | 技术 |
|------|------|
| 爬虫核心 | Playwright |
| HTML 解析 | LXML / BeautifulSoup |
| LLM 集成 | LiteLLM |
| 异步框架 | asyncio |
| 部署 | Docker |

## License

MIT License

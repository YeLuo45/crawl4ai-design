# 快速开始

> 5 分钟快速上手 Crawl4AI。

## 环境要求

| 要求 | 说明 |
|------|------|
| Python | 3.9+ |
| pip | 最新版本 |
| Playwright | 自动安装 |

## 安装

### 1. 安装 Crawl4AI

```bash
pip install -U crawl4ai
```

### 2. 运行安装向导

```bash
crawl4ai-setup
```

这会自动安装 Playwright 和浏览器依赖。

### 3. 验证安装

```bash
crawl4ai-doctor
```

## 基础用法

### 简单爬取

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com"
        )
        print(f"Success: {result.success}")
        print(f"Markdown: {result.markdown[:500]}")

asyncio.run(main())
```

### 带配置的爬取

```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.content_filter_strategy import BM25ContentFilter

async def main():
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1920,
        viewport_height=1080,
    )

    crawl_config = CrawlerRunConfig(
        content_filter=BM25ContentFilter(keywords=["AI", "technology"]),
        max_scroll_pages=3,
        remove_overlay_elements=True,
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://example.com",
            config=crawl_config,
        )
        print(result.markdown)

asyncio.run(main())
```

## CLI 用法

```bash
# 简单爬取
crawl4ai https://example.com

# 输出到文件
crawl4ai https://example.com -o output.md

# 查看完整选项
crawl4ai --help
```

## Docker 用法

```bash
# 运行容器
docker run -p 8000:8000 unclecode/crawl4ai

# 或使用 Docker Compose
docker-compose up
```

## 常见问题

### Q: 浏览器安装失败

```bash
# 手动安装 Playwright 浏览器
python -m playwright install --with-deps chromium
```

### Q: SSL 证书错误

```python
from crawl4ai.ssl_certificate import SSLCertificateHandler

config = CrawlerRunConfig(
    ssl_certificate_handler=SSLCertificateHandler(verify_ssl=False)
)
```

### Q: 被反爬检测

```python
browser_config = BrowserConfig(
    anti_bot_detection="aggressive",
    user_agent_mode="random",
)
```

## 下一步

- [架构概览](/architecture) - 深入了解系统设计
- [爬取配置](/crawler-config) - 掌握完整配置体系
- [内容提取](/extraction) - 各种提取策略
- [深度爬取](/deep-crawling) - 多页面爬取
- [高级特性](/advanced) - 反爬、代理、监控
- [API 参考](/api) - 完整 API 文档

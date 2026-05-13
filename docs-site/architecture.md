# 架构概览

> Crawl4AI 是一个专为 LLM 设计的异步网页爬虫，输出干净的 Markdown 用于 RAG 和 AI 数据管道。

## 核心设计理念

| 特性 | 说明 |
|------|------|
| **LLM Ready Output** | 智能 Markdown 输出，包含标题、表格、代码块、引用提示 |
| **Fast in Practice** | 异步浏览器池、缓存、最小化跳转 |
| **Full Control** | Session、代理、Cookie、用户脚本、Hook |
| **Adaptive Intelligence** | 学习站点模式，只爬取重要的内容 |
| **Deploy Anywhere** | 零配置、CLI 和 Docker、云端友好 |

## 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AsyncWebCrawler                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│  │   Browser   │───▶│  Content Filter  │───▶│   LLM Output    │  │
│  │    Pool     │    │   & Scraping     │    │    (Markdown)   │  │
│  └──────────────┘    └──────────────────┘    └─────────────────┘  │
│         │                     │                       │              │
│         ▼                     ▼                       ▼              │
│  ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│  │   Session    │    │  Extraction       │    │   Chunking &    │  │
│  │  Management  │    │  Strategies      │    │   Caching       │  │
│  └──────────────┘    └──────────────────┘    └─────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. AsyncWebCrawler

主入口类，负责管理浏览器实例池和爬取生命周期。

```python
from crawl4ai import AsyncWebCrawler

async with AsyncWebCrawler() as crawler:
    result = await crawler.arun(
        url="https://example.com",
        config=CrawlerRunConfig()
    )
    print(result.markdown)
```

### 2. 浏览器管理

```python
# Browser Manager 架构
crawl4ai/
├── browser_manager.py      # 浏览器生命周期管理
├── browser_adapter.py      # 浏览器适配器抽象
├── browser_profiler.py    # 浏览器指纹管理
└── docker_client.py       # Docker 容器化浏览器
```

### 3. 内容处理管道

```
HTML Input
    │
    ▼
┌─────────────────┐
│ Content Filter  │  ← BM25ContentFilter / PruningContentFilter / LLMContentFilter
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Scraping       │  ← LXMLWebScrapingStrategy / BeautifulSoup
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extraction     │  ← LLMExtraction / CosineStrategy / JsonCssExtraction
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Markdown Gen   │  ← DefaultMarkdownGenerator
└────────┬────────┘
         │
         ▼
Markdown Output (LLM Ready)
```

### 4. 异步架构

```python
# 异步调度器
crawl4ai/
├── async_dispatcher.py          # 任务调度
│   ├── MemoryAdaptiveDispatcher  # 内存自适应调度
│   └── SemaphoreDispatcher      # 信号量限流
├── async_url_seeder.py          # URL 种子管理
└── async_crawler_strategy.py    # 爬取策略
```

## 关键特性

### Adaptive Crawling

```python
# 自适应爬取核心
crawl4ai/
├── adaptive_crawler.py          # 自适应爬取引擎
├── deep_crawling/
│   ├── base_strategy.py         # 策略基类
│   ├── bfs_strategy.py          # 广度优先
│   ├── dfs_strategy.py          # 深度优先
│   ├── bff_strategy.py          # 最佳优先
│   └── scorers.py               # 页面评分
```

### 缓存系统

```python
# 多层缓存
crawl4ai/
├── cache_context.py             # 缓存上下文
├── cache_validator.py           # 缓存验证
```

### LLM 集成

```python
# LLM 支持
crawl4ai/
├── model_loader.py              # 模型加载
├── llm_config.py               # LLM 配置
├── extraction_strategy.py      # LLM 提取策略
│   ├── LLMExtractionStrategy    # LLM 通用提取
│   └── CosineStrategy           # 余弦相似度匹配
```

## 数据流

```
URL Input
    │
    ▼
┌─────────────────────────────────────────┐
│  Browser Pool (Playwright)              │
│  - 异步浏览器实例管理                    │
│  - 自动重试和健康检查                    │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│  CrawlerRunConfig                       │
│  - 页面过滤策略                          │
│  - 内容提取策略                          │
│  - Markdown 生成策略                     │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│  CrawlResult                            │
│  {                                      │
│    markdown: str,      # LLM 可用输出    │
│    html: str,          # 原始 HTML       │
│    url: str,           # 来源 URL        │
│    success: bool,      # 是否成功        │
│    error: str,         # 错误信息         │
│    metadata: dict      # 元数据          │
│  }                                      │
└─────────────────────────────────────────┘
```

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 爬虫核心 | Playwright | 异步浏览器自动化 |
| HTML 解析 | LXML / BeautifulSoup | 内容提取 |
| LLM 集成 | LiteLLM | 多模型统一接口 |
| 异步框架 | asyncio | 并发控制 |
| 部署 | Docker | 环境隔离 |

## 目录结构

```
crawl4ai/
├── __init__.py              # 主入口
├── async_webcrawler.py      # AsyncWebCrawler 主类
├── browser_manager.py       # 浏览器管理
├── config.py                # 配置管理
├── models.py                # 数据模型
│   ├── CrawlResult          # 爬取结果
│   └── MarkdownGenerationResult
├── chunking_strategy.py     # 分块策略
├── extraction_strategy.py    # 提取策略
├── content_filter_strategy.py # 内容过滤
├── markdown_generation_strategy.py # Markdown 生成
├── deep_crawling/           # 深度爬取
│   ├── base_strategy.py
│   ├── bfs_strategy.py
│   ├── dfs_strategy.py
│   └── bff_strategy.py
├── components/
│   └── crawler_monitor.py  # 爬虫监控
└── utils.py                 # 工具函数
```

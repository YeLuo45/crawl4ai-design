# 深度爬取

> Crawl4AI 支持多页面的深度爬取，提供多种策略适应不同场景。

## 爬取策略一览

| 策略 | 类名 | 适用场景 |
|------|------|---------|
| BFS | `BFSStrategy` | 广度优先，适合大规模发现 |
| DFS | `DFSStrategy` | 深度优先，适合垂直爬取 |
| BFF | `BFFStrategy` | 最佳优先，相关性排序 |
| Crazy | `CrazyStrategy` | 激进探索，最大限度发现 |

## BFSStrategy (广度优先)

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.deep_crawling import BFSStrategy

config = CrawlerRunConfig(
    deep_crawl_strategy=BFSStrategy(
        max_depth=3,                    # 最大深度
        max_pages=100,                  # 最大页面数
        max_children=10,                # 每页最大子链接
        include_external=False,          # 是否包含外部链接
        url_scorer=None,                # URL 评分器
    )
)

async with AsyncWebCrawler() as crawler:
    results = await crawler.arun_many(
        urls=["https://example.com"],
        config=config,
    )
```

## DFSStrategy (深度优先)

```python
from crawl4ai.deep_crawling import DFSStrategy

config = CrawlerRunConfig(
    deep_crawl_strategy=DFSStrategy(
        max_depth=5,
        max_pages=50,
        include_external=False,
    )
)
```

## BFFStrategy (最佳优先)

基于内容相关性评分，优先爬取高价值页面。

```python
from crawl4ai.deep_crawling import BFFStrategy

config = CrawlerRunConfig(
    deep_crawl_strategy=BFFStrategy(
        max_depth=2,
        max_pages=30,
        url_scorer=lambda url: 1.0 if "blog" in url else 0.5,
        content_scorer=None,  # 可选：基于内容的评分
    )
)
```

## 自定义评分器

```python
from crawl4ai.deep_crawling import BFSStrategy
from crawl4ai.deep_crawling.scorers import URLPatternScorer

# URL 模式评分
url_scorer = URLPatternScorer(
    patterns=[
        (r"/blog/.*", 1.0),        # 高优先级
        (r"/products/.*", 0.8),
        (r"/tags/.*", 0.3),        # 低优先级
        (r".*\.pdf$", 0.0),        # 跳过 PDF
    ]
)

strategy = BFSStrategy(
    max_depth=3,
    max_pages=100,
    url_scorer=url_scorer,
)
```

## Crash Recovery

v0.8.0+ 支持深度爬取崩溃恢复。

```python
from crawl4ai import CrawlerRunConfig
from crawl4ai.deep_crawling import BFSStrategy

config = CrawlerRunConfig(
    deep_crawl_strategy=BFSStrategy(
        max_depth=3,
        max_pages=500,
    ),
    # 崩溃恢复配置
    resume_state=True,              # 从上次状态恢复
    on_state_change=None,           # 状态变化回调
)

async with AsyncWebCrawler() as crawler:
    results = await crawler.arun_many(
        urls=["https://example.com"],
        config=config,
    )
```

## Prefetch Mode

v0.8.0+ 支持预取模式，URL 发现速度提升 5-10 倍。

```python
config = CrawlerRunConfig(
    deep_crawl_strategy=BFSStrategy(
        max_depth=2,
        max_pages=200,
    ),
    prefetch=True,                  # 启用预取
)
```

## URL 过滤

```python
from crawl4ai.deep_crawling import BFSStrategy
from crawl4ai.deep_crawling.filters import URLFilter

# URL 过滤器
url_filter = URLFilter(
    exclude_patterns=[
        r".*logout.*",
        r".*signin.*",
        r".*\/auth\/.*",
        r".*\.pdf$",
    ],
    include_patterns=[
        r"example\.com/.*",      # 只爬取主域名
    ],
)

strategy = BFSStrategy(
    max_depth=3,
    url_filter=url_filter,
)
```

## 链接发现配置

```python
from crawl4ai import CrawlerRunConfig
from crawl4ai.async_url_seeder import URLSeedingConfig

config = CrawlerRunConfig(
    url_seeding_config=URLSeedingConfig(
        seed_urls=["https://example.com"],
        max_depth=3,
        max_unique_urls=1000,
    ),
)
```

## 结果处理

```python
async with AsyncWebCrawler() as crawler:
    async for result in crawler.arun_lazy(
        url="https://example.com",
        config=CrawlerRunConfig(
            deep_crawl_strategy=BFSStrategy(max_depth=2)
        )
    ):
        # 实时处理每个页面
        print(f"URL: {result.url}")
        print(f"Markdown length: {len(result.markdown)}")
        # 保存到数据库、文件等
```

## 深度爬取流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    Deep Crawl Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌────────────┐    ┌──────────────────┐   │
│  │ URL Seed │───▶│ Link Disc. │───▶│ URL Filter &     │   │
│  │          │    │            │    │ Scoring          │   │
│  └──────────┘    └────────────┘    └────────┬─────────┘   │
│                                               │               │
│  ┌─────────────────────────────────────────────┼─────────┐  │
│  │                                             ▼         │  │
│  │  ┌──────────────┐    ┌──────────────────────────┐   │  │
│  │  │  Page Queue  │◀───│  Strategy (BFS/DFS/BFF) │   │  │
│  │  └──────┬───────┘    └──────────────────────────┘   │  │
│  │         │                                            │  │
│  │         ▼                                            │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │              Content Extraction                │   │  │
│  │  │  (LLM / CSS / XPath / Cosine)               │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │         │                                            │  │
│  └─────────┼────────────────────────────────────────────┘  │
│            ▼                                                 │
│  ┌──────────────────────────────────────────────┐           │
│  │              Output (Markdown + Metadata)     │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

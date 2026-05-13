# 内容提取策略

> Crawl4AI 支持多种内容提取策略，从简单 CSS 选择器到高级 LLM 语义理解。

## 提取策略一览

| 策略 | 适用场景 | 性能 |
|------|---------|------|
| `LLMExtractionStrategy` | 复杂语义理解、非结构化页面 | 较慢 |
| `CosineStrategy` | 示例驱动、相似度匹配 | 中等 |
| `JsonCssExtractionStrategy` | 结构化 JSON、API 响应 | 快 |
| `JsonLxmlExtractionStrategy` | XPath 表达式 | 快 |
| `RegexExtractionStrategy` | 简单正则模式 | 最快 |
| `NoExtraction` | 仅获取 Markdown | 最快 |

## LLMExtractionStrategy

使用 LLM 进行语义理解提取。

```python
from crawl4ai import LLMConfig
from crawl4ai.extraction_strategy import LLMExtractionStrategy

strategy = LLMExtractionStrategy(
    llm_config=LLMConfig(
        provider="openai/gpt-4o",
        api_token="sk-...",
    ),
    prompt="Extract the article title, author, and publication date.",
    extraction_type="json",  # "json" | "text"
    input_schema={           # 可选：定义输出结构
        "title": str,
        "author": str,
        "date": str,
    },
)
```

**输出格式**：
```json
{
  "title": "Article Title",
  "author": "John Doe",
  "date": "2024-01-15"
}
```

## CosineStrategy

基于示例的余弦相似度匹配。

```python
from crawl4ai.extraction_strategy import CosineStrategy

strategy = CosineStrategy(
    semantic_similarity_threshold=0.3,  # 相似度阈值
    top_k=5,                            # 返回 Top-K 结果
    word_count_threshold=10,           # 最小词数
)
```

**工作原理**：
1. 用户提供正例（目标内容）和负例（非目标内容）
2. CosineStrategy 学习语义模式
3. 对页面内容进行相似度打分
4. 返回高分内容块

## JsonCssExtractionStrategy

基于 CSS 选择器的结构化提取。

```python
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

strategy = JsonCssExtractionStrategy(
    css_selector=".article-content",     # 主容器选择器
    fields=[
        {
            "name": "title",
            "selector": "h1.article-title",
            "type": "text",
        },
        {
            "name": "author",
            "selector": "span.author-name",
            "type": "text",
        },
        {
            "name": "published_date",
            "selector": "time.published",
            "type": "attribute",
            "attr": "datetime",
        },
        {
            "name": "content",
            "selector": "div.article-body",
            "type": "html",
        },
        {
            "name": "tags",
            "selector": "a.tag",
            "type": "list",
        },
    ],
)
```

**输出格式**：
```json
{
  "title": "Article Title",
  "author": "John Doe",
  "published_date": "2024-01-15T10:30:00Z",
  "content": "<div class=\"article-body\">...</div>",
  "tags": ["AI", "Machine Learning", "Python"]
}
```

## JsonLxmlExtractionStrategy

基于 XPath 的结构化提取。

```python
from crawl4ai.extraction_strategy import JsonLxmlExtractionStrategy

strategy = JsonLxmlExtractionStrategy(
    xpath_selector="//article[@class='post']",
    fields=[
        {"name": "title", "xpath": ".//h1/text()"},
        {"name": "content", "xpath": ".//div[@class='content']//text()"},
        {"name": "links", "xpath": ".//a/@href"},
    ],
)
```

## RegexExtractionStrategy

简单正则表达式提取。

```python
from crawl4ai.extraction_strategy import RegexExtractionStrategy

strategy = RegexExtractionStrategy(
    patterns=[
        (r"email: (\S+)", "email"),
        (r"phone: (\d{3}-\d{4})", "phone"),
        (r"price: \$(\d+\.?\d*)", "price"),
    ],
    re_flags=0,  # re.MULTILINE, re.IGNORECASE 等
)
```

## 内容过滤策略

配合提取策略使用，先过滤噪音内容。

```python
from crawl4ai.content_filter_strategy import (
    BM25ContentFilter,
    PruningContentFilter,
    LLMContentFilter,
    RelevantContentFilter,
)

# BM25 关键词过滤
content_filter = BM25ContentFilter(
    keywords=["AI", "machine learning"],
    threshold=1.0,
)

# 修剪低价值内容（导航、页脚、广告）
content_filter = PruningContentFilter(
    threshold=0.2,
)

# LLM 判断内容相关性
content_filter = LLMContentFilter(
    llm_config=LLMConfig(provider="openai/gpt-4o", api_token="sk-..."),
)
```

## 分块策略

将长内容分块便于处理。

```python
from crawl4ai.chunking_strategy import ChunkingStrategy, RegexChunking

# 按正则分块
chunking = RegexChunking(
    patterns=[r"\n\n+", r"\n(?=[A-Z])"],  # 段落分隔
    overlap=50,                              # 重叠字符数
    max_chars=1000,                          # 每块最大字符
)

# 策略组合
config = CrawlerRunConfig(
    extraction_strategy=strategy,
    content_filter=content_filter,
    chunking_strategy=chunking,
)
```

## 完整示例

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.extraction_strategy import LLMExtractionStrategy, JsonCssExtractionStrategy
from crawl4ai.content_filter_strategy import BM25ContentFilter

async def main():
    # LLM 语义提取
    llm_strategy = LLMExtractionStrategy(
        llm_config={"provider": "openai/gpt-4o", "api_token": "sk-..."},
        prompt="Extract all product names, prices, and descriptions",
        extraction_type="json",
    )

    # CSS 选择器提取（更快）
    css_strategy = JsonCssExtractionStrategy(
        css_selector="div.product-item",
        fields=[
            {"name": "name", "selector": ".product-name", "type": "text"},
            {"name": "price", "selector": ".product-price", "type": "text"},
        ],
    )

    async with AsyncWebCrawler() as crawler:
        # LLM 提取
        result1 = await crawler.arun(
            url="https://example.com/products",
            config=CrawlerRunConfig(extraction_strategy=llm_strategy),
        )
        print(result1.extracted_content)

        # CSS 提取（用于简单页面）
        result2 = await crawler.arun(
            url="https://example.com/list",
            config=CrawlerRunConfig(extraction_strategy=css_strategy),
        )
        print(result2.extracted_content)

asyncio.run(main())
```

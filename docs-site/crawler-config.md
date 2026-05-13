# 爬取配置

> Crawl4AI 提供完整的配置体系，控制爬取过程的每个环节。

## 配置类一览

| 配置类 | 用途 |
|--------|------|
| `BrowserConfig` | 浏览器配置（UA、窗口大小、视口） |
| `CrawlerRunConfig` | 爬取运行时配置（提取策略、过滤、钩子） |
| `HTTPCrawlerConfig` | 纯 HTTP 爬取配置（无浏览器） |
| `LLMConfig` | LLM API 配置 |
| `ProxyConfig` | 代理配置 |
| `GeolocationConfig` | 地理位置模拟配置 |

## BrowserConfig

控制 Playwright 浏览器实例。

```python
from crawl4ai import BrowserConfig

browser_config = BrowserConfig(
    browser_type="chromium",      # chromium / firefox / webkit
    headless=True,                  # 是否无头模式
    viewport_width=1920,            # 视口宽度
    viewport_height=1080,           # 视口高度
    user_agent="Mozilla/5.0 ...",  # 自定义 User-Agent
    proxy_config=None,             # ProxyConfig 实例
    extra_args=[
        "--disable-blink-features=AutomationControlled",
    ],
)
```

## CrawlerRunConfig

爬取的核心配置类。

```python
from crawl4ai import CrawlerRunConfig

config = CrawlerRunConfig(
    # 内容提取
    extraction_strategy=LLMExtractionStrategy(...),
    content_filter=BM25ContentFilter(...),

    # Markdown 生成
    markdown_generator=DefaultMarkdownGenerator(...),

    # 页面行为
    js_code=[],                    # 注入 JavaScript
    js_only=False,                 # 仅执行 JS 不爬取
    wait_for=None,                 # 等待条件
    delay_before_return_html=0,     # 延迟返回

    # 爬取控制
    max_scroll_pages=1,            # 最大滚动页数
    scroll_interval=1.0,            # 滚动间隔（秒）
    remove_overlay_elements=True,   # 移除弹窗
    check_https=True,              # 检查 HTTPS

    # 缓存
    cache_mode=CacheMode.ENABLE,   # 缓存模式
    word_count_threshold=10,       # 最小词数

    # 结果
    verbose=False,                  # 详细输出
    ttl=300,                       # 任务超时（秒）
)
```

## HTTPCrawlerConfig

无浏览器的纯 HTTP 爬取（更快，但不执行 JS）。

```python
from crawl4ai import HTTPCrawlerConfig

config = HTTPCrawlerConfig(
    headers={"User-Agent": "..."},
    proxies=["http://proxy:8080"],
    verify_ssl=True,
    timeout=30,
)
```

## LLMConfig

配置 LLM API 调用。

```python
from crawl4ai import LLMConfig

llm_config = LLMConfig(
    provider="openai/gpt-4o",      # 模型提供者
    api_token="sk-...",           # API Token
    base_url=None,                # 自定义 API 端点
    temperature=0.0,              # 温度参数
    max_tokens=4096,              # 最大 token 数
)
```

## ProxyConfig

代理服务器配置。

```python
from crawl4ai import ProxyConfig

proxy_config = ProxyConfig(
    server="http://my-proxy:8080",
    username="user",
    password="pass",
)
```

## 缓存模式

```python
from crawl4ai import CacheMode

# 缓存模式枚举
CacheMode.ENABLE       # 启用缓存（默认）
CacheMode.BYPASS       # 绕过缓存
CacheMode.REVALIDATE   # 重新验证
```

## 完整示例

```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.extraction_strategy import LLMExtractionStrategy

async def main():
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1920,
        viewport_height=1080,
    )

    crawl_config = CrawlerRunConfig(
        extraction_strategy=LLMExtractionStrategy(
            provider="openai/gpt-4o",
            api_token="sk-...",
        ),
        content_filter=BM25ContentFilter(),
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

## 配置继承与覆盖

```python
# 基础配置
base_config = CrawlerRunConfig(
    content_filter=BM25ContentFilter(),
    max_scroll_pages=1,
)

# 覆盖部分配置
custom_config = base_config.copy(
    max_scroll_pages=5,
    js_code=["window.scrollTo(0, document.body.scrollHeight)"],
)
```

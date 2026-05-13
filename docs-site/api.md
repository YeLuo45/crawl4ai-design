# API 参考

> AsyncWebCrawler 完整 API 文档。

## AsyncWebCrawler

主入口类，管理浏览器生命周期和爬取操作。

### 构造函数

```python
class AsyncWebCrawler:
    def __init__(
        self,
        config: BrowserConfig | None = None,
        verbose: bool = False,
    ) -> None:
        """
        Args:
            config: 浏览器配置
            verbose: 是否输出详细日志
        """
```

### 上下文管理器

```python
async with AsyncWebCrawler() as crawler:
    # crawler 已准备好
    pass
# 自动清理
```

### 方法

#### `arun()`

单 URL 爬取。

```python
async def arun(
    self,
    url: str,
    config: CrawlerRunConfig | None = None,
) -> CrawlResult:
    """
    Args:
        url: 目标 URL
        config: 爬取配置
    Returns:
        CrawlResult: 爬取结果
    """
```

#### `arun_many()`

批量 URL 爬取。

```python
async def arun_many(
    self,
    urls: list[str],
    config: CrawlerRunConfig | None = None,
) -> list[CrawlResult]:
    """
    Args:
        urls: URL 列表
        config: 爬取配置
    Returns:
        list[CrawlResult]: 结果列表
    """
```

#### `arun_lazy()`

懒加载迭代器，适合大规模爬取。

```python
async def arun_lazy(
    self,
    url: str,
    config: CrawlerRunConfig | None = None,
) -> AsyncIterator[CrawlResult]:
    """
    Yields:
        CrawlResult: 逐个返回结果
    """
```

#### `create_session()`

创建持久化 Session。

```python
async def create_session(
    self,
    session_id: str | None = None,
) -> CrawlerSession:
    """
    Returns:
        CrawlerSession: 会话对象
    """
```

## CrawlerSession

持久化会话，保持 Cookie 和状态。

```python
class CrawlerSession:
    async def crawl(self, url: str, config: CrawlerRunConfig | None = None) -> CrawlResult:
        """在当前会话中爬取 URL"""

    async def close(self) -> None:
        """关闭会话"""
```

## CrawlResult

爬取结果数据模型。

```python
class CrawlResult:
    url: str                      # 来源 URL
    html: str                     # 原始 HTML
    markdown: str                 # LLM 可用的 Markdown
    success: bool                 # 是否成功
    error: str | None             # 错误信息
    status_code: int              # HTTP 状态码
    extracted_content: dict | None # 提取的内容（如果有）
    metadata: dict                 # 元数据
        - title: str
        - description: str
        - author: str | None
        - published_date: str | None
        - language: str | None
        - image: str | None
        - favicon: str | None
   _links: list[str]             # 发现的所有链接
    internal_links: list[str]     # 内部链接
    external_links: list[str]      # 外部链接
    media: dict                   # 媒体资源
        - images: list[dict]
        - videos: list[dict]
        - audios: list[dict]
    raw_html: str                 # 原始 HTML（未处理）
    session_id: str | None        # 会话 ID
```

## 配置类

### BrowserConfig

```python
@dataclass
class BrowserConfig:
    browser_type: str = "chromium"      # chromium/firefox/webkit
    headless: bool = True
    viewport_width: int = 1920
    viewport_height: int = 1080
    user_agent: str | None = None
    user_agent_mode: str = "random"
    proxy_config: ProxyConfig | None = None
    extra_args: list[str] = []
    anti_bot_detection: str = "auto"
    geolocation: GeolocationConfig | None = None
```

### CrawlerRunConfig

```python
@dataclass
class CrawlerRunConfig:
    # 内容处理
    extraction_strategy: ExtractionStrategy | None = None
    content_filter: ContentFilterStrategy | None = None
    markdown_generator: MarkdownGenerationStrategy | None = None
    chunking_strategy: ChunkingStrategy | None = None

    # 页面行为
    js_code: list[str] = []
    js_only: bool = False
    wait_for: str | None = None
    delay_before_return_html: float = 0

    # 爬取控制
    max_scroll_pages: int = 1
    scroll_interval: float = 1.0
    remove_overlay_elements: bool = True
    check_https: bool = True

    # 深度爬取
    deep_crawl_strategy: DeepCrawlStrategy | None = None
    prefetch: bool = False
    resume_state: bool = False

    # 缓存
    cache_mode: CacheMode = CacheMode.ENABLE

    # 其他
    verbose: bool = False
    ttl: int = 300
    logger: AsyncLoggerBase | None = None
```

## 枚举

### CacheMode

```python
class CacheMode(Enum):
    ENABLE = "enable"           # 启用缓存
    BYPASS = "bypass"           # 绕过缓存
    REVALIDATE = "revalidate"    # 重新验证
```

### DisplayMode

```python
class DisplayMode(Enum):
    ALL = "all"                 # 显示所有内容
    ONLY_VISIBLE = "only_visible"  # 仅可见内容
```

## 错误处理

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async def main():
    try:
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(
                url="https://example.com",
                config=CrawlerRunConfig(),
            )

            if result.success:
                print(result.markdown)
            else:
                print(f"Crawl failed: {result.error}")

    except Exception as e:
        print(f"Unexpected error: {e}")

asyncio.run(main())
```

## 异步迭代示例

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.deep_crawling import BFSStrategy

async def main():
    async with AsyncWebCrawler() as crawler:
        async for result in crawler.arun_lazy(
            url="https://example.com",
            config=CrawlerRunConfig(
                deep_crawl_strategy=BFSStrategy(max_depth=2, max_pages=50)
            )
        ):
            if result.success:
                print(f"URL: {result.url}")
                print(f"Markdown: {result.markdown[:200]}...")
                print("---")

asyncio.run(main())
```

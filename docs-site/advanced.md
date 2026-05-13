# 高级特性

> Crawl4AI 提供丰富的高级特性，涵盖反爬对抗、代理、监控等场景。

## Anti-Bot 检测与对抗

v0.8.5+ 提供自动 3 层反爬检测和代理升级。

### 3-Tier Anti-Bot Detection

```python
from crawl4ai import CrawlerRunConfig

config = CrawlerRunConfig(
    anti_bot_detection="auto",  # "auto" | "aggressive" | "off"
    # 或手动配置
    anti_bot_config={
        "tier1_retries": 3,
        "tier2_proxy_rotation": True,
        "tier3_proxy_list": ["http://proxy1:8080", "http://proxy2:8080"],
    }
)
```

### 浏览器指纹管理

```python
from crawl4ai import BrowserConfig

browser_config = BrowserConfig(
    # 随机化指纹
    randomize_ua=True,
    randomize_viewport=True,
    # 模拟真实浏览器
    webgl_vendor="Intel Inc.",
    webgl_renderer="Intel Iris OpenGL Engine",
    # 隐藏自动化特征
    disable_automation_detection=True,
)
```

## 代理轮换

### 基础代理配置

```python
from crawl4ai import ProxyConfig, CrawlerRunConfig

config = CrawlerRunConfig(
    proxy_config=ProxyConfig(
        server="http://my-proxy:8080",
        username="user",
        password="pass",
    )
)
```

### 代理轮换策略

```python
from crawl4ai.proxy_strategy import RoundRobinProxyStrategy, ProxyRotationStrategy

# 轮换策略
rotation_strategy = RoundRobinProxyStrategy(
    proxies=[
        "http://proxy1:8080",
        "http://proxy2:8080",
        "http://proxy3:8080",
    ]
)

# 或自定义策略
class CustomProxyStrategy(ProxyRotationStrategy):
    def select_proxy(self, context):
        # 根据 URL 或其他条件选择代理
        return self.proxies[0]
```

## User-Agent 管理

```python
from crawl4ai import BrowserConfig
from crawl4ai.user_agent_generator import UserAgentGenerator

# 随机 UA 生成
browser_config = BrowserConfig(
    user_agent_mode="random",  # "random" | "desktop" | "mobile"
    desktop_ua_families=["Chrome", "Firefox", "Safari"],
    mobile_ua_families=["Safari iOS", "Chrome Android"],
)

# 自定义 UA
browser_config = BrowserConfig(
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
)
```

## Session 管理

```python
async with AsyncWebCrawler() as crawler:
    # 创建 Session
    session = await crawler.create_session()

    # 同一 Session 保持 Cookie
    result1 = await session.crawl(url="https://example.com/login")
    result2 = await session.crawl(url="https://example.com/dashboard")
    result3 = await session.crawl(url="https://example.com/profile")

    # 清理 Session
    await session.close()
```

## JavaScript 注入

```python
from crawl4ai import CrawlerRunConfig

config = CrawlerRunConfig(
    # 注入 JavaScript 代码
    js_code=[
        # 点击按钮
        "document.querySelector('.load-more-btn').click()",
        # 滚动页面
        "window.scrollTo(0, document.body.scrollHeight)",
        # 等待元素
        "await new Promise(r => setTimeout(r, 2000))",
    ],
    # 执行 JS 后等待
    wait_for="div.content-loaded",
)
```

## 自定义 Hooks

```python
from crawl4ai import CrawlerRunConfig, AsyncLogger

class MyLogger(AsyncLoggerBase):
    async def on_page_fetched(self, url, html_length):
        print(f"Fetched: {url} ({html_length} bytes)")

    async def on_result(self, result):
        print(f"Result: {result.url} - {len(result.markdown)} chars")

    async def on_error(self, url, error):
        print(f"Error: {url} - {error}")

config = CrawlerRunConfig(
    logger=MyLogger(),
)
```

## 地理位置模拟

```python
from crawl4ai import BrowserConfig, GeolocationConfig

browser_config = BrowserConfig(
    geolocation=GeolocationConfig(
        latitude=37.7749,
        longitude=-122.4194,
        accuracy=100,
    ),
    # 权限覆盖
    permissions=["geolocation"],
)
```

## SSL 证书处理

```python
from crawl4ai.ssl_certificate import SSLCertificateHandler

# 忽略 SSL 错误
handler = SSLCertificateHandler(
    verify_ssl=False,  # 仅测试环境使用
)

config = CrawlerRunConfig(
    ssl_certificate_handler=handler,
)
```

## 爬虫监控

```python
from crawl4ai.components import CrawlerMonitor

monitor = CrawlerMonitor(
    prometheus_port=9090,
    metrics=[
        "pages_fetched",
        "bytes_downloaded",
        "crawl_duration",
        "error_rate",
    ],
)

async with AsyncWebCrawler() as crawler:
    monitor.attach(crawler)
    # 开始爬取...
```

## Shadow DOM 处理

v0.8.5+ 支持 Shadow DOM 自动扁平化。

```python
config = CrawlerRunConfig(
    flatten_shadow_dom=True,  # 自动处理 Shadow DOM
)
```

## 弹窗和 Overlay 处理

```python
config = CrawlerRunConfig(
    # 自动移除弹窗元素
    remove_overlay_elements=True,
    # 自定义弹窗处理
    overlay_selectors=[
        ".cookie-banner",
        ".newsletter-popup",
        ".age-verification",
    ],
)
```

## 速率限制

```python
from crawl4ai import CrawlerRunConfig
from crawl4ai.async_dispatcher import SemaphoreDispatcher

config = CrawlerRunConfig(
    dispatcher=SemaphoreDispatcher(
        max_concurrent=5,      # 最大并发
        rate_limit=10,         # 每秒最大请求
    )
)
```

## 完整示例

```python
import asyncio
from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CrawlerRunConfig,
    ProxyConfig,
)
from crawl4ai.deep_crawling import BFSStrategy
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

async def main():
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1920,
        viewport_height=1080,
        user_agent_mode="random",
        anti_bot_detection="auto",
    )

    crawl_config = CrawlerRunConfig(
        deep_crawl_strategy=BFSStrategy(
            max_depth=2,
            max_pages=50,
        ),
        extraction_strategy=JsonCssExtractionStrategy(
            css_selector="article.post",
            fields=[...],
        ),
        proxy_config=ProxyConfig(
            server="http://proxy:8080",
        ),
        remove_overlay_elements=True,
        flatten_shadow_dom=True,
        js_code=["window.scrollTo(0, document.body.scrollHeight)"],
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        async for result in crawler.arun_lazy(
            url="https://example.com/blog",
            config=crawl_config,
        ):
            print(result.markdown)

asyncio.run(main())
```

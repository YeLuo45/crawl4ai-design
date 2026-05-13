# Crawl4AI Design Specification

## 1. 项目概述

| 属性 | 值 |
|------|-----|
| 项目名称 | crawl4ai-design |
| 上游项目 | unclecode/crawl4ai |
| 项目类型 | 设计文档站 (VitePress) |
| 部署平台 | GitHub Pages |
| 部署 URL | https://yeluo45.github.io/crawl4ai-design/ |

## 2. 设计目标

- 完整记录 Crawl4AI 系统的架构设计
- 文档化配置体系和各类策略
- 说明内容提取和深度爬取的工作原理
- 提供 API 参考文档

## 3. 文档结构

docs-site/
├── index.md              # 首页 (VitePress home layout)
├── architecture.md       # 架构概览
├── crawler-config.md    # 爬取配置
├── extraction.md        # 内容提取策略
├── deep-crawling.md     # 深度爬取
├── advanced.md          # 高级特性
├── api.md              # API 参考
├── getting-started.md   # 快速开始
└── .vitepress/
    ├── config.mjs      # VitePress 配置 (base: /crawl4ai-design/)
    ├── theme/
    │   ├── index.js    # 主题入口
    │   └── style.css   # 暗色主题 (青色 #22d3ee)
    └── public/
        └── logo.svg    # Logo (蜘蛛网主题)

## 4. 视觉设计

### 4.1 主题配色

| 用途 | 颜色 |
|------|------|
| 背景 | #0a1015 (深色) |
| 强调色 | #22d3ee (青色) |
| 次强调色 | #a78bfa (紫色) |
| 文字主色 | #e8f0f4 |
| 文字次色 | #a8bcc8 |

## 5. 验收标准

- [x] 首页 HTTP 200
- [x] 8 个文档页面全部可访问
- [x] 导航栏链接全部正确
- [x] 青色暗色主题正常显示

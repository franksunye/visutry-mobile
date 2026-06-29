# VisuTry Mobile

VisuTry 移动端 PWA 应用 — 单页 Web 应用,设计为可向微信小程序等形态演化。

## 技术栈

- **Vite + React 18 + TypeScript** — 轻量 SPA,PWA 离线可装
- **vite-plugin-pwa** — manifest + service worker
- **Tailwind CSS** — 与主站一致
- **Zustand** — 轻量状态管理
- **@visutry/tryon-web** — 脸型分析 SDK(file: 引用本地 SDK)

## 架构分层

```
src/
├── core/          # 平台无关层(纯 TS,无 DOM)← 迁移微信时复用
│   ├── api/       # 调用主站 REST API 的客户端
│   ├── types/     # 业务类型(与主站对齐)
│   ├── face-shape/ # 消费 SDK 的脸型推荐逻辑
│   └── state/     # zustand 状态管理
├── platform/      # 平台适配层
│   └── web/       # DOM API、相机、PWA、IndexedDB
└── ui/            # React 组件(仅 Web 端)
```

### 关键约束

- `core/` 层**禁止 import DOM API**(no `window`/`document`),平台能力通过依赖注入传入
- 业务类型与主站 `FaceGeometryAnalysis` 等保持一致

## 演化路径

| 阶段 | 形态 | 复用 |
|------|------|------|
| 现在 | Vite PWA(单页) | `@visutry/tryon-web` + 主站 API |
| 演化 | 微信小程序 | `core/` 抽包 + `@visutry/tryon-wechat` + WXML 重写 |
| 进一步 | 其它端 | `core/` 包 + 新平台适配层 |

## 开发

```bash
pnpm install
pnpm dev          # 启动开发服务器 http://localhost:5173
pnpm build        # 生产构建
pnpm preview      # 预览生产构建
pnpm typecheck    # 类型检查
```

## 前置条件

- 本地已构建 `visutry-tryon-sdk`(在 `../visutry-tryon-sdk/` 执行 `pnpm build`)

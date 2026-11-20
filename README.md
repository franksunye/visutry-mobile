# VisuTry Mobile

VisuTry 移动端 PWA 应用 — 单页 Web 应用,设计为可向微信小程序等形态演化。

## 真实运行状态（2026-11 R0 恢复）

- 当前 `src/App.tsx` 主要是**带示例数据的 UI 原型**，不是已接通的真实照片分析/AR/付费产品闭环；勿以页面演示作为实测证据。
- `src/platform/web/face-shape.ts` 提供调用独立 SDK 的**照片分析适配器**；实际面向用户的上传→分析→报告流程尚须单独接入和验收。
- SDK 以 Git submodule 固定精确提交，R0 对齐独立 SDK `43339ade`（核心 `0.2.2`、Web `0.2.3`），不再沿用 2026-07-02 的旧 `1.0.0-beta` pin。
- Mobile 使用 SDK 处理端侧人脸能力；用户登录、订阅、历史及生成式 Try-On 必须复用 VisuTry 主站的业务服务，不建设第二套。
- `.github/workflows/ci.yml` 验证依赖安装、构建、类型和照片输入契约；CI **不**等同于真实设备相机/AR 的验收。

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

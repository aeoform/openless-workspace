# OpenLess 官网

Next.js 静态官网，中英文切换和浏览器动画不依赖服务端。风格市场、云同步服务独立部署，不包含在本项目。

## 构建

使用 Node.js 24 和 pnpm 11.27.1：

```bash
npm install --global pnpm@11.27.1
pnpm install --frozen-lockfile
pnpm dev
# 发布静态网站
pnpm build
```

发布目录为 `out/`，包括 `index.html`、`404.html`、`_next/` 和 public 素材。上传的是 **out 内的全部内容**，不是源码、`.next/` 或 node_modules。静态部署不运行 `pnpm start`。本项目关闭图片服务端优化，使用系统字体，构建无需下载 Google 字体。

GitHub Actions 的 `static-site.yml` 会构建并提供 `openless-static-site` 下载包，不会自动修改云资源。当前目录若未关联 Git 仓库，需先将项目纳入自己的仓库才能使用该流程。

## 阿里云（优先）：ESA 函数和 Pages

仓库根目录的 `esa.jsonc` 已配置好构建，ESA 导入 GitHub 仓库后会以该文件为唯一配置来源，控制台里的同名构建项不生效。

| 配置项 | 值（来自 esa.jsonc） |
| --- | --- |
| 项目名 | `openless-web` |
| 生产分支 | `main` |
| 安装命令 | `npx --yes pnpm@11.27.1 install --frozen-lockfile` |
| 构建命令 | `npx --yes pnpm@11.27.1 build` |
| 静态资源目录 | `./out` |
| 404 策略 | `404Page`（静态站点，不做 SPA 回退） |
| Node.js | `package.json` 中 `engines.node: 22` |
| 函数入口 | 不配置。本站是纯静态站点，不需要边缘函数 |

部署步骤：

1. 开通「函数和 Pages」服务，在 ESA 控制台选择边缘函数 → 创建 → 导入 GitHub 仓库，授权并选择本仓库的 `main` 分支。
2. 直接开始部署，构建信息由 `esa.jsonc` 决定。首轮构建成功后会生成公共域名。
3. 需要自定义域名时，通过域名绑定或路由绑定接入该 Pages；NS 接入会自动添加解析，CNAME 接入需自行添加 CNAME 记录。

注意事项：

- 若控制台强制要求填写「函数文件路径」，不要随意指向一个不存在的文件；先确认控制台是否允许留空。本站不提供 ER 函数，填错会导致请求落到函数而返回错误。
- 构建产物来自 `next build` 的静态导出，`next.config.ts` 已设置 `output: "export"`、`trailingSlash: true` 和 `images.unoptimized`。
- 内节点访问需按供应商要求完成域名备案；`*.aliyun` 测试域名只用于预览，不作为正式官网地址。

如后续需要 OSS 托管（例如自定义缓存头或独立 CDN），仍可复用同一构建产物：创建 Bucket，配置静态网站首页 `index.html`、错误页 `404.html`，再上传 `out/` 全部内容：

```bash
ossutil cp -r out/ oss://YOUR_WEBSITE_BUCKET/
```

## Cloudflare Pages

选择静态导出，不使用 Next.js SSR 适配器或 next-on-pages：

| 配置项 | 值 |
| --- | --- |
| 项目根目录 | 本项目目录 |
| Node.js | 24（环境变量 NODE_VERSION=24） |
| 构建命令 | `npx --yes pnpm@11.27.1 install --frozen-lockfile && npx --yes pnpm@11.27.1 build` |
| 输出目录 | `out` |

也可先在本地构建，再用已认证的 Wrangler CLI 执行 `wrangler pages deploy out --project-name YOUR_PROJECT`。Pages 会识别输出目录中的 404.html；无需 Functions、数据库绑定或 `_redirects` SPA 回退。域名在 Pages 控制台绑定。

## 腾讯云

使用 COS 静态网站托管 + CDN/EdgeOne 自定义域名，或支持上传静态产物的 Pages 托管产品：

- 构建命令同上，输出目录 `out`。
- COS 配置首页 index.html、错误页 404.html，上传全部产物。
- 使用已认证的 COSCLI 可执行 `coscli cp -r out/ cos://YOUR_WEBSITE_BUCKET/`，先通过当前 CLI 的 help 确认目录上传语义。
- 配置 HTTPS、DNS、访问权限、回源和备案要求。

## 缓存和发布

- `/_next/static/*`：`Cache-Control: public, max-age=31536000, immutable`。
- HTML、404 和 Next 导出的路由数据：要求重新验证或短缓存，不设置一年缓存。
- logo、dashboard 等非哈希素材：短缓存；改图后刷新 CDN 缓存。
- 先上传新静态资源，再发布 HTML，最后刷新 HTML/CDN 缓存；保留旧哈希资源一段时间以兼容已打开的页面，不使用带删除行为的全量同步。
- 保留上一版完整 out 产物用于回滚。生产凭据只进入云平台密钥配置，不提交仓库。

## 验收

检查 HTTPS 首页、中英文切换及刷新后的语言偏好、图片、下载锚点、移动端滑动和 GitHub 跳转。检查随机不存在路径确实为 404，静态 JS/CSS 正常返回，并确认浏览器不请求 `/_next/image`。动画需在真实移动端检查帧率。

迁移代码不等于完成上线：需要云账号、Bucket/Pages 项目、域名与证书配置后再执行发布。原始代码的 ESLint 存在 React hooks/purity 告警，构建工作流不把未修复的历史 lint 问题当成已通过。

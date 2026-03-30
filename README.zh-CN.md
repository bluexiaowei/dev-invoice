# invoice

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**纯前端发票填写工具**：本地录入信息、实时预览，通过浏览器**打印 → 另存为 PDF** 导出。无服务端，草稿默认仅存于本机浏览器。

**English** → [README.md](./README.md)

## 功能

| 功能 | 说明 |
|------|------|
| 表单与预览 | 开票方、客户、发票号、日期、币种、税率、多行明细、付款说明与备注 |
| 中英文界面 | 顶栏切换 **中文** / **English**，界面与发票文案随语言变化 |
| 导出 PDF | 使用系统打印对话框，目标选「另存为 PDF」 |
| 本地暂存 | `localStorage` 保存（含防抖自动保存）；支持手动暂存、载入、新建 |
| 打印版式 | A4、`@page` 边距；表头与正文左右对齐；白底 |

## 技术栈

- Vite 8、TypeScript、React 19、Tailwind CSS 4

## 快速开始

```bash
git clone https://github.com/<your-org>/invoice.git
cd invoice
npm install
npm run dev
```

浏览器访问终端提示的本地地址（一般为 `http://localhost:5173`）。

## GitHub Pages

仓库已包含 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)：在 `main` / `master` 推送时自动构建并部署到 GitHub Pages，Vite 会按仓库名设置正确的 `base` 路径。

**首次启用**

1. 仓库 **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**。
2. 推送 `main` 或在 **Actions** 里手动运行工作流。
3. 部署完成后访问：`https://<用户名>.github.io/<仓库名>/`（例如 `acme/invoice` → `https://acme.github.io/invoice/`）。

若仓库名为 `<用户>.github.io`（用户/组织站根域名），构建会自动使用 `base: "/"`。若需自定义，可在工作流的 Build 步骤里设置环境变量 `VITE_BASE_URL`。

### 故障排除：`deploy-pages` 报 `HttpError: Not Found`（404）

在仓库里**尚未**把 Pages 的发布方式设为 **GitHub Actions** 时，部署接口会返回 **404**：

1. 打开 **Settings → Pages → Build and deployment**。
2. **Source** 选 **GitHub Actions**（不要选 “Deploy from a branch”），保存。
3. 到 **Actions** 里 **Re-run** 失败的工作流。

另请检查：

- **Settings → Actions → General → Workflow permissions**：若组织默认只读，需允许 **Read and write**，否则 `GITHUB_TOKEN` 无法完成 Pages 部署。
- **私有仓库**：免费账号下私有仓库发布 Pages 可能受限；可改为**公开**仓库，或参考 [GitHub Pages 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) 升级方案。
- **Fork**：要在 **fork 仓库** 里同样启用 Pages（Source = GitHub Actions），或只在主仓库部署。

```bash
npm run build    # 生产构建，输出 dist/
npm run preview  # 本地预览构建结果
npm run lint     # ESLint
```

## 导出 PDF

1. 填写表单并核对预览。
2. 点击 **打印 / 导出 PDF** 或 `Ctrl+P` / `Cmd+P`。
3. 打印机选择 **另存为 PDF**。
4. 边距、缩放可在打印对话框中微调。

## 本地存储

| 键名 | 用途 |
|------|------|
| `invoice-stash-v2` | 草稿 `{ savedAt, state }` |
| `invoice-locale-v1` | 界面语言 `zh` / `en` |

旧版 `invoice-form-v1` 会自动迁移到 `invoice-stash-v2` 后删除。

数据不离开本机；清除站点数据会丢失草稿，重要内容请自行保存 PDF。

## 参与贡献

见 [CONTRIBUTING.md](./CONTRIBUTING.md)（英文）。

## 安全

见 [SECURITY.md](./SECURITY.md)（英文）。

## 许可证

[MIT](./LICENSE)

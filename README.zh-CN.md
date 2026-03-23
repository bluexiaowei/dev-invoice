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

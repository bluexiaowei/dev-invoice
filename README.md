# invoice

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A **client-side invoice** web app: fill in billing details, preview in real time, and export a **PDF** via the browser print dialog (**Save as PDF**). No backend; data stays in your browser unless you export.

**中文说明** → [README.zh-CN.md](./README.zh-CN.md)

## Features

- Form + live preview (issuer, client, invoice no., dates, currency, tax, line items, terms, notes)
- **English / 中文** UI toggle (single language at a time)
- **Print to PDF** using `window.print()` and A4-oriented styles
- **Local draft** storage (`localStorage`, auto-save with debounce; manual save / load / new invoice)
- Tailwind CSS for layout and print tweaks

## Tech stack

| Layer    | Choice                          |
| -------- | ------------------------------- |
| Build    | Vite 8, TypeScript              |
| UI       | React 19, Tailwind CSS 4        |
| Data     | Browser `localStorage` only     |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm (or pnpm / yarn)

## Getting started

```bash
git clone https://github.com/<your-org>/invoice.git
cd invoice
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## GitHub Pages

This repo includes a workflow ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) that builds with the correct Vite [`base`](https://vite.dev/config/shared-options.html#base) and deploys to **GitHub Pages** on every push to `main` or `master`.

**One-time setup**

1. Repo → **Settings** → **Pages** → **Build and deployment** → **Source**: **GitHub Actions**.
2. Push to `main` (or run the workflow manually under **Actions**).
3. After the deploy job finishes, open the site at:

   `https://<your-username>.github.io/<repo-name>/`

   Example: repo `acme/invoice` → `https://acme.github.io/invoice/`.

If the repository is a **user/org site** (`<user>.github.io`), `vite.config.ts` sets `base` to `/` automatically. If you need to override (e.g. custom path), set `VITE_BASE_URL` in the workflow `env` for the Build step.

## Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start dev server with HMR      |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint`  | Run ESLint                     |

## Exporting PDF

1. Complete the form and check the preview.
2. Click **Print / Save as PDF** (or press `Ctrl+P` / `Cmd+P`).
3. Choose **Save as PDF** / **Microsoft Print to PDF** as the destination.
4. Adjust margins or scale in the print dialog if needed.

## Local storage keys

| Key                  | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `invoice-stash-v2`   | Draft payload `{ savedAt, state }`           |
| `invoice-locale-v1`  | UI locale `zh` or `en`                       |

Legacy `invoice-form-v1` is migrated once to `invoice-stash-v2` and then removed.

**Privacy:** Data never leaves your machine unless you print/save PDF or copy it yourself. Clearing site data removes drafts.

## Project layout

```
src/
  App.tsx
  components/InvoiceForm.tsx
  components/InvoicePreview.tsx
  i18n/copy.ts
  i18n/locale.ts
  types/invoice.ts
  index.css
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE)

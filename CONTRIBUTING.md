# Contributing

Thanks for your interest in improving **invoice**. This document describes how to set up the project and submit changes.

## Development setup

1. Fork and clone the repository.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Before opening a pull request, run `npm run lint` and `npm run build` to ensure the project passes checks.

## Pull requests

- Keep changes focused on a single concern (feature, fix, or docs).
- Update **README.md** / **README.zh-CN.md** if user-facing behavior changes.
- Follow existing code style (TypeScript strict mode, Tailwind utility classes for UI).

## Internationalization

UI strings live in `src/i18n/copy.ts`. When adding labels:

- Add entries for both **English** (`en`) and **Chinese** (`zh`) in the `Copy` type and both locale objects.
- Avoid showing two languages at once in the UI; the app switches locale with a single toggle.

## Reporting issues

Use GitHub Issues with:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS version (especially for print/PDF quirks)

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

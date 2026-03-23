# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open source documentation: `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, bilingual `README` / `README.zh-CN`.
- GitHub Actions workflow to deploy to GitHub Pages; Vite `base` resolved from `GITHUB_REPOSITORY` (and `*.github.io` root repos).

## [0.1.0] - 2026-03-23

### Added

- Vite + React + TypeScript + Tailwind invoice form and preview
- English / Chinese UI toggle
- Browser print-to-PDF workflow with A4 print styles
- Local draft storage (`localStorage`) with auto-save and manual save / load / new invoice

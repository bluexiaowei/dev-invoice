import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub Pages project site: https://<user>.github.io/<repo>/
 * User/org root site: https://<user>.github.io/ → repo name ends with .github.io → base "/"
 * Override: VITE_BASE_URL (e.g. "/" or "/my-repo/")
 */
function resolveBase(): string {
  const raw = process.env.VITE_BASE_URL
  if (raw !== undefined) {
    if (raw === '' || raw === '/') return '/'
    return raw.endsWith('/') ? raw : `${raw}/`
  }
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (process.env.CI === 'true' && repo) {
    if (repo.endsWith('.github.io')) return '/'
    return `/${repo}/`
  }
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [react(), tailwindcss()],
})

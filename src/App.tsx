import { useEffect, useState } from 'react'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoicePreview } from './components/InvoicePreview'
import { getCopy } from './i18n/copy'
import type { Locale } from './i18n/locale'
import { loadLocale, saveLocale } from './i18n/locale'
import {
  defaultInvoiceState,
  loadStash,
  saveStash,
  type InvoiceFormState,
} from './types/invoice'

function formatSavedAt(iso: string, locale: Locale): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => loadLocale())
  const [state, setState] = useState<InvoiceFormState>(() => {
    return loadStash()?.state ?? defaultInvoiceState()
  })
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    return loadStash()?.savedAt ?? null
  })
  const [toast, setToast] = useState<string | null>(null)

  const copy = getCopy(locale)

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  useEffect(() => {
    saveLocale(locale)
  }, [locale])

  useEffect(() => {
    const id = window.setTimeout(() => {
      const payload = saveStash(state)
      setLastSavedAt(payload.savedAt)
    }, 500)
    return () => window.clearTimeout(id)
  }, [state])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const handleManualSave = () => {
    const payload = saveStash(state)
    setLastSavedAt(payload.savedAt)
    setToast(copy.app.stashSaved)
  }

  const handleLoadStash = () => {
    const stash = loadStash()
    if (stash) {
      setState(stash.state)
      setLastSavedAt(stash.savedAt)
    }
  }

  const handleNewInvoice = () => {
    if (!window.confirm(copy.app.confirmNew)) return
    const fresh = defaultInvoiceState()
    setState(fresh)
    const payload = saveStash(fresh)
    setLastSavedAt(payload.savedAt)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:min-h-0">
      {toast ? (
        <div
          role="status"
          className="print:hidden fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              {copy.app.title}
            </h1>
            <p className="text-sm text-slate-500">{copy.app.subtitle}</p>
            <p className="mt-1 text-xs text-slate-500">
              {copy.app.lastSaved}
              {lastSavedAt
                ? ` · ${formatSavedAt(lastSavedAt, locale)}`
                : ` · ${copy.app.neverSaved}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleManualSave}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                {copy.app.stashSave}
              </button>
              <button
                type="button"
                onClick={handleLoadStash}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                {copy.app.stashLoad}
              </button>
              <button
                type="button"
                onClick={handleNewInvoice}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                {copy.app.newInvoice}
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <span className="sr-only">{copy.app.language}</span>
              <button
                type="button"
                onClick={() => setLocale('zh')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'zh'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={locale === 'zh'}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={locale === 'en'}
              >
                English
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              {copy.app.print}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 print:max-w-none print:p-0 print:py-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start print:grid-cols-1">
          <div className="print:hidden">
            <InvoiceForm state={state} onChange={setState} copy={copy} />
          </div>
          <div className="lg:sticky lg:top-28 print:static">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500 print:hidden">
              {copy.app.preview}
            </p>
            <InvoicePreview state={state} copy={copy} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'GBP'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceFormState {
  sellerName: string
  sellerAddress: string
  sellerTaxId: string
  buyerName: string
  buyerAddress: string
  invoiceNumber: string
  /** Default print/PDF base name (via document.title); auto-sync with issuer + invoice no. */
  exportFileName: string
  invoiceDate: string
  dueDate: string
  currency: CurrencyCode
  taxRatePercent: number
  lineItems: LineItem[]
  notes: string
  paymentTerms: string
}

/** Legacy flat JSON without metadata */
const LEGACY_STORAGE_KEY = 'invoice-form-v1'
export const STASH_KEY = 'invoice-stash-v2'

export type StashPayload = {
  savedAt: string
  state: InvoiceFormState
}

export function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
  }
}

/** `2026-03-30` → `INV-20260330` */
export function autoInvoiceNumberFromDate(isoDate: string): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return ''
  return `INV-${isoDate.replace(/-/g, '')}`
}

function sanitizeFileBaseSegment(s: string): string {
  return s
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, '_')
}

/** 默认：开票方-发票号（去非法文件名字符）；缺一则用另一项，皆空为 invoice */
export function suggestedExportFileName(
  state: Pick<InvoiceFormState, 'sellerName' | 'invoiceNumber'>,
): string {
  const a = sanitizeFileBaseSegment(state.sellerName)
  const b = sanitizeFileBaseSegment(state.invoiceNumber)
  if (a && b) return `${a}-${b}`
  if (b) return b
  if (a) return a
  return 'invoice'
}

/** 开票方或发票号变更时：空或与上次建议一致则更新为新的建议，否则视为用户手写文件名并保留 */
export function syncExportFileNameAfterChange(
  prev: InvoiceFormState,
  next: InvoiceFormState,
): string {
  const oldSuggested = suggestedExportFileName(prev)
  const newSuggested = suggestedExportFileName(next)
  const cur = prev.exportFileName.trim()
  if (cur === '') return newSuggested
  if (cur !== oldSuggested) return prev.exportFileName
  return newSuggested
}

/** 供 document.title 使用，便于「另存为 PDF」时作为默认文件名 */
export function printDocumentTitle(state: InvoiceFormState): string {
  const raw = state.exportFileName.trim() || suggestedExportFileName(state)
  return raw.length > 200 ? raw.slice(0, 200) : raw
}

export function defaultInvoiceState(): InvoiceFormState {
  const invoiceDate = new Date().toISOString().slice(0, 10)
  const invoiceNumber = autoInvoiceNumberFromDate(invoiceDate)
  const base: Omit<InvoiceFormState, 'exportFileName'> = {
    sellerName: '',
    sellerAddress: '',
    sellerTaxId: '',
    buyerName: '',
    buyerAddress: '',
    invoiceNumber,
    invoiceDate,
    dueDate: '',
    currency: 'CNY',
    taxRatePercent: 0,
    lineItems: [createEmptyLineItem()],
    notes: '',
    paymentTerms: '',
  }
  return {
    ...base,
    exportFileName: suggestedExportFileName(base),
  }
}

export function lineAmount(item: LineItem): number {
  return Math.round(item.quantity * item.unitPrice * 100) / 100
}

export function computeTotals(state: InvoiceFormState): {
  subtotal: number
  tax: number
  total: number
} {
  const subtotal =
    Math.round(
      state.lineItems.reduce((s, li) => s + lineAmount(li), 0) * 100,
    ) / 100
  const tax =
    Math.round(subtotal * (state.taxRatePercent / 100) * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100
  return { subtotal, tax, total }
}

const currencySymbols: Record<CurrencyCode, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const sym = currencySymbols[currency]
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${sym}${formatted}`
}

function isInvoiceState(v: unknown): v is InvoiceFormState {
  return (
    typeof v === 'object' &&
    v !== null &&
    Array.isArray((v as InvoiceFormState).lineItems)
  )
}

function withExportFileName(s: InvoiceFormState): InvoiceFormState {
  return {
    ...s,
    exportFileName:
      typeof s.exportFileName === 'string'
        ? s.exportFileName
        : suggestedExportFileName(s),
  }
}

/** Load local stash; migrates legacy flat `invoice-form-v1` once. */
export function loadStash(): StashPayload | null {
  try {
    const raw = localStorage.getItem(STASH_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'state' in parsed &&
        'savedAt' in parsed &&
        isInvoiceState((parsed as StashPayload).state)
      ) {
        const p = parsed as StashPayload
        return {
          ...p,
          state: withExportFileName(p.state),
        }
      }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const state = JSON.parse(legacy) as unknown
      if (isInvoiceState(state)) {
        const normalized = withExportFileName(state)
        const payload: StashPayload = {
          savedAt: new Date().toISOString(),
          state: normalized,
        }
        saveStash(normalized)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
        return payload
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function saveStash(state: InvoiceFormState): StashPayload {
  const payload: StashPayload = {
    savedAt: new Date().toISOString(),
    state,
  }
  try {
    localStorage.setItem(STASH_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
  return payload
}

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

export function defaultInvoiceState(): InvoiceFormState {
  return {
    sellerName: '',
    sellerAddress: '',
    sellerTaxId: '',
    buyerName: '',
    buyerAddress: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    currency: 'CNY',
    taxRatePercent: 0,
    lineItems: [createEmptyLineItem()],
    notes: '',
    paymentTerms: '',
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
        return parsed as StashPayload
      }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const state = JSON.parse(legacy) as unknown
      if (isInvoiceState(state)) {
        const payload: StashPayload = {
          savedAt: new Date().toISOString(),
          state,
        }
        saveStash(state)
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

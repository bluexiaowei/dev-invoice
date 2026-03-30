import type { Copy } from '../i18n/copy'
import type { CurrencyCode, InvoiceFormState, LineItem } from '../types/invoice'
import {
  autoInvoiceNumberFromDate,
  createEmptyLineItem,
  suggestedExportFileName,
  syncExportFileNameAfterChange,
} from '../types/invoice'

type Props = {
  state: InvoiceFormState
  onChange: (next: InvoiceFormState) => void
  copy: Copy
}

function currencyLabels(copy: Copy): { value: CurrencyCode; label: string }[] {
  return [
    { value: 'CNY', label: `CNY · ${copy.currencies.CNY}` },
    { value: 'USD', label: `USD · ${copy.currencies.USD}` },
    { value: 'EUR', label: `EUR · ${copy.currencies.EUR}` },
    { value: 'GBP', label: `GBP · ${copy.currencies.GBP}` },
  ]
}

function labelClass() {
  return 'mb-1 block text-xs font-medium text-slate-600'
}

function inputClass() {
  return 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2'
}

export function InvoiceForm({ state, onChange, copy }: Props) {
  const t = copy.form
  const p = copy.placeholders
  const set = (patch: Partial<InvoiceFormState>) => {
    onChange({ ...state, ...patch })
  }

  const setLineItems = (lineItems: LineItem[]) => {
    onChange({ ...state, lineItems })
  }

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLineItems(
      state.lineItems.map((li) =>
        li.id === id ? { ...li, ...patch } : li,
      ),
    )
  }

  const addLine = () => {
    setLineItems([...state.lineItems, createEmptyLineItem()])
  }

  const removeLine = (id: string) => {
    if (state.lineItems.length <= 1) return
    setLineItems(state.lineItems.filter((li) => li.id !== id))
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">{t.from}</h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass()} htmlFor="sellerName">
              {t.name}
            </label>
            <input
              id="sellerName"
              className={inputClass()}
              value={state.sellerName}
              onChange={(e) => {
                const sellerName = e.target.value
                const next = { ...state, sellerName }
                onChange({
                  ...next,
                  exportFileName: syncExportFileNameAfterChange(state, next),
                })
              }}
              placeholder={p.sellerName}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="sellerAddress">
              {t.address}
            </label>
            <textarea
              id="sellerAddress"
              rows={3}
              className={inputClass() + ' resize-y min-h-18'}
              value={state.sellerAddress}
              onChange={(e) => set({ sellerAddress: e.target.value })}
              placeholder={p.sellerAddress}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="sellerTaxId">
              {t.taxIdOptional}
            </label>
            <input
              id="sellerTaxId"
              className={inputClass()}
              value={state.sellerTaxId}
              onChange={(e) => set({ sellerTaxId: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">{t.billTo}</h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass()} htmlFor="buyerName">
              {t.name}
            </label>
            <input
              id="buyerName"
              className={inputClass()}
              value={state.buyerName}
              onChange={(e) => set({ buyerName: e.target.value })}
              placeholder={p.clientName}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="buyerAddress">
              {t.address}
            </label>
            <textarea
              id="buyerAddress"
              rows={3}
              className={inputClass() + ' resize-y min-h-18'}
              value={state.buyerAddress}
              onChange={(e) => set({ buyerAddress: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          {t.invoiceInfo}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
         
          <div>
            <label className={labelClass()} htmlFor="invoiceDate">
              {t.date}
            </label>
            <input
              id="invoiceDate"
              type="date"
              className={inputClass()}
              value={state.invoiceDate}
              onChange={(e) => {
                const newDate = e.target.value
                const oldDate = state.invoiceDate
                const oldAuto = oldDate
                  ? autoInvoiceNumberFromDate(oldDate)
                  : ''
                const newAuto = newDate
                  ? autoInvoiceNumberFromDate(newDate)
                  : ''
                const customized =
                  state.invoiceNumber !== '' &&
                  state.invoiceNumber !== oldAuto
                const nextState = {
                  ...state,
                  invoiceDate: newDate,
                  invoiceNumber: customized ? state.invoiceNumber : newAuto,
                }
                onChange({
                  ...nextState,
                  exportFileName: syncExportFileNameAfterChange(
                    state,
                    nextState,
                  ),
                })
              }}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="dueDate">
              {t.dueOptional}
            </label>
            <input
              id="dueDate"
              type="date"
              className={inputClass()}
              value={state.dueDate}
              onChange={(e) => set({ dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="currency">
              {t.currency}
            </label>
            <select
              id="currency"
              className={inputClass()}
              value={state.currency}
              onChange={(e) =>
                set({ currency: e.target.value as CurrencyCode })
              }
            >
              {currencyLabels(copy).map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass()} htmlFor="taxRate">
              {t.taxRate}
            </label>
            <input
              id="taxRate"
              type="number"
              min={0}
              step={0.01}
              className={inputClass()}
              value={state.taxRatePercent}
              onChange={(e) =>
                set({ taxRatePercent: Number(e.target.value) || 0 })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass()} htmlFor="invoiceNumber">
              {t.invoiceNo}
            </label>
            <input
              id="invoiceNumber"
              className={inputClass()}
              value={state.invoiceNumber}
              onChange={(e) => {
                const invoiceNumber = e.target.value
                const next = { ...state, invoiceNumber }
                onChange({
                  ...next,
                  exportFileName: syncExportFileNameAfterChange(state, next),
                })
              }}
              placeholder={p.invoiceNo}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass()} htmlFor="exportFileName">
              {t.pdfFileName}
            </label>
            <p className="mb-1.5 text-xs leading-snug text-slate-500">
              {t.pdfFileNameHint}
            </p>
            <input
              id="exportFileName"
              className={inputClass()}
              value={state.exportFileName}
              onChange={(e) => set({ exportFileName: e.target.value })}
              placeholder={suggestedExportFileName(state)}
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {t.lineItems}
          </h3>
          <button
            type="button"
            onClick={addLine}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            + {t.addLine}
          </button>
        </div>
        <div className="space-y-4">
          {state.lineItems.map((li, index) => (
            <div
              key={li.id}
              className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {t.lineN(index + 1)}
                </span>
                {state.lineItems.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeLine(li.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    {t.remove}
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass()} htmlFor={`desc-${li.id}`}>
                    {t.description}
                  </label>
                  <input
                    id={`desc-${li.id}`}
                    className={inputClass()}
                    value={li.description}
                    onChange={(e) =>
                      updateLine(li.id, { description: e.target.value })
                    }
                    placeholder={p.lineDescription}
                  />
                </div>
                <div>
                  <label className={labelClass()} htmlFor={`qty-${li.id}`}>
                    {t.qty}
                  </label>
                  <input
                    id={`qty-${li.id}`}
                    type="number"
                    min={0}
                    step={0.01}
                    className={inputClass()}
                    value={li.quantity}
                    onChange={(e) =>
                      updateLine(li.id, {
                        quantity: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass()} htmlFor={`price-${li.id}`}>
                    {t.unitPrice}
                  </label>
                  <input
                    id={`price-${li.id}`}
                    type="number"
                    min={0}
                    step={0.01}
                    className={inputClass()}
                    value={li.unitPrice}
                    onChange={(e) =>
                      updateLine(li.id, {
                        unitPrice: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          {t.notesSection}
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass()} htmlFor="paymentTerms">
              {t.paymentTerms}
            </label>
            <textarea
              id="paymentTerms"
              rows={3}
              className={inputClass() + ' resize-y min-h-18'}
              value={state.paymentTerms}
              onChange={(e) => set({ paymentTerms: e.target.value })}
              placeholder={p.paymentTerms}
            />
          </div>
          <div>
            <label className={labelClass()} htmlFor="notes">
              {t.notes}
            </label>
            <textarea
              id="notes"
              rows={3}
              className={inputClass() + ' resize-y min-h-18'}
              value={state.notes}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

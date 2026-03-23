import type { Copy } from '../i18n/copy'
import type { InvoiceFormState } from '../types/invoice'
import {
  computeTotals,
  formatMoney,
  lineAmount,
} from '../types/invoice'

type Props = {
  state: InvoiceFormState
  copy: Copy
}

export function InvoicePreview({ state, copy }: Props) {
  const { subtotal, tax, total } = computeTotals(state)
  const p = copy.preview

  return (
    <article className="invoice-print-root overflow-hidden rounded-lg border border-slate-200 bg-white text-left text-slate-900 shadow-sm print:border-0 print:shadow-none">
      <div className="px-8 pb-8 print:px-0 print:pb-0">
        <header className="invoice-print-header bg-white pt-8 pb-6 print:pt-4 print:pb-4">
          <div className="flex flex-col gap-6 border-b border-slate-200/80 pb-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                {p.invoice}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                {p.invoiceNo}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
                {state.invoiceNumber || '—'}
              </h2>
            </div>
            <dl className="grid gap-2 text-sm sm:text-right">
              <div>
                <dt className="text-slate-500">{p.date}</dt>
                <dd className="font-medium">{state.invoiceDate || '—'}</dd>
              </div>
              {state.dueDate ? (
                <div>
                  <dt className="text-slate-500">{p.due}</dt>
                  <dd className="font-medium">{state.dueDate}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-slate-500">{p.currency}</dt>
                <dd className="font-medium">{state.currency}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="space-y-8 pt-6 print:space-y-6 print:pt-4">
          <div className="grid gap-8 sm:grid-cols-2">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {p.from}
            </h3>
            <p className="font-medium text-slate-900">
              {state.sellerName || '—'}
            </p>
            {state.sellerAddress ? (
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                {state.sellerAddress}
              </p>
            ) : null}
            {state.sellerTaxId ? (
              <p className="mt-2 text-sm text-slate-600">
                <span className="text-slate-500">{p.taxIdLabel}</span>
                {state.sellerTaxId}
              </p>
            ) : null}
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {p.billTo}
            </h3>
            <p className="font-medium text-slate-900">
              {state.buyerName || '—'}
            </p>
            {state.buyerAddress ? (
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                {state.buyerAddress}
              </p>
            ) : null}
          </section>
          </div>

          <div className="overflow-x-auto">
          <table className="invoice-print-table w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4 font-medium">{p.colDescription}</th>
                <th className="w-20 py-2 pr-4 text-right font-medium">
                  {p.colQty}
                </th>
                <th className="w-28 py-2 pr-4 text-right font-medium">
                  {p.colUnit}
                </th>
                <th className="w-28 py-2 text-right font-medium">
                  {p.colAmount}
                </th>
              </tr>
            </thead>
            <tbody>
              {state.lineItems.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 align-top text-slate-800">
                    {row.description || '—'}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-slate-700">
                    {row.quantity}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-slate-700">
                    {formatMoney(row.unitPrice, state.currency)}
                  </td>
                  <td className="py-3 text-right tabular-nums font-medium text-slate-900">
                    {formatMoney(lineAmount(row), state.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="flex flex-col items-end gap-2 border-t border-slate-200 pt-4 text-sm print:pt-3">
          <div className="flex w-full max-w-xs justify-between gap-8">
            <span className="text-slate-600">{p.subtotal}</span>
            <span className="tabular-nums font-medium">
              {formatMoney(subtotal, state.currency)}
            </span>
          </div>
          <div className="flex w-full max-w-xs justify-between gap-8">
            <span className="text-slate-600">
              {p.tax(state.taxRatePercent)}
            </span>
            <span className="tabular-nums font-medium">
              {formatMoney(tax, state.currency)}
            </span>
          </div>
          <div className="flex w-full max-w-xs justify-between gap-8 border-t border-slate-200 pt-2 text-base">
            <span className="font-semibold text-slate-800">{p.total}</span>
            <span className="tabular-nums font-semibold text-slate-900">
              {formatMoney(total, state.currency)}
            </span>
          </div>
          </div>

          {(state.paymentTerms || state.notes) && (
          <footer className="space-y-4 border-t border-slate-200 pt-6 text-sm text-slate-600 print:pt-4">
            {state.paymentTerms ? (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {p.paymentTerms}
                </h4>
                <p className="whitespace-pre-wrap">{state.paymentTerms}</p>
              </div>
            ) : null}
            {state.notes ? (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {p.notes}
                </h4>
                <p className="whitespace-pre-wrap">{state.notes}</p>
              </div>
            ) : null}
          </footer>
          )}
        </div>
      </div>
    </article>
  )
}

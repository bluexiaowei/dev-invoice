import type { Locale } from './locale'

/** UI + invoice document strings for one language at a time */
export type Copy = {
  app: {
    title: string
    subtitle: string
    print: string
    preview: string
    language: string
    stashSave: string
    stashLoad: string
    newInvoice: string
    lastSaved: string
    neverSaved: string
    confirmNew: string
    stashSaved: string
  }
  form: {
    from: string
    billTo: string
    invoiceInfo: string
    name: string
    address: string
    taxIdOptional: string
    invoiceNo: string
    date: string
    dueOptional: string
    currency: string
    taxRate: string
    lineItems: string
    addLine: string
    lineN: (n: number) => string
    remove: string
    description: string
    qty: string
    unitPrice: string
    notesSection: string
    paymentTerms: string
    notes: string
  }
  placeholders: {
    sellerName: string
    sellerAddress: string
    invoiceNo: string
    clientName: string
    lineDescription: string
    paymentTerms: string
  }
  currencies: {
    CNY: string
    USD: string
    EUR: string
    GBP: string
  }
  preview: {
    invoice: string
    invoiceNo: string
    date: string
    due: string
    currency: string
    from: string
    billTo: string
    taxIdLabel: string
    colDescription: string
    colQty: string
    colUnit: string
    colAmount: string
    subtotal: string
    tax: (pct: number) => string
    total: string
    paymentTerms: string
    notes: string
  }
}

const zh: Copy = {
  app: {
    title: '发票',
    subtitle: '填写表单 · 实时预览 · 打印另存为 PDF',
    print: '打印 / 导出 PDF',
    preview: '预览',
    language: '语言',
    stashSave: '暂存到本地',
    stashLoad: '载入暂存',
    newInvoice: '新建',
    lastSaved: '上次暂存',
    neverSaved: '尚未手动暂存',
    confirmNew: '确定清空当前内容并新建？未暂存的内容将丢失。',
    stashSaved: '已保存到本机浏览器',
  },
  form: {
    from: '开票方',
    billTo: '客户',
    invoiceInfo: '发票信息',
    name: '名称',
    address: '地址',
    taxIdOptional: '税号（可选）',
    invoiceNo: '发票号码',
    date: '日期',
    dueOptional: '到期日（可选）',
    currency: '币种',
    taxRate: '税率（%）',
    lineItems: '明细',
    addLine: '添加一行',
    lineN: (n) => `第 ${n} 行`,
    remove: '删除',
    description: '说明',
    qty: '数量',
    unitPrice: '单价',
    notesSection: '备注',
    paymentTerms: '付款说明',
    notes: '备注',
  },
  placeholders: {
    sellerName: '姓名或公司名',
    sellerAddress: '街道、城市、国家',
    invoiceNo: '例如 INV-2025-001',
    clientName: '客户姓名或公司',
    lineDescription: '服务或商品',
    paymentTerms: '例如：账期 30 天、银行转账',
  },
  currencies: {
    CNY: '¥ 人民币',
    USD: '$ 美元',
    EUR: '€ 欧元',
    GBP: '£ 英镑',
  },
  preview: {
    invoice: '发票',
    invoiceNo: '发票号码',
    date: '日期',
    due: '到期日',
    currency: '币种',
    from: '开票方',
    billTo: '客户',
    taxIdLabel: '税号：',
    colDescription: '说明',
    colQty: '数量',
    colUnit: '单价',
    colAmount: '金额',
    subtotal: '小计',
    tax: (pct) => `税额（${pct}%）`,
    total: '合计',
    paymentTerms: '付款说明',
    notes: '备注',
  },
}

const en: Copy = {
  app: {
    title: 'Invoice',
    subtitle: 'Fill in the form · Live preview · Print to PDF',
    print: 'Print / Save as PDF',
    preview: 'Preview',
    language: 'Language',
    stashSave: 'Save draft locally',
    stashLoad: 'Load draft',
    newInvoice: 'New',
    lastSaved: 'Last saved',
    neverSaved: 'No manual save yet',
    confirmNew: 'Discard current content and start a new invoice? Unsaved edits will be lost.',
    stashSaved: 'Saved to this browser',
  },
  form: {
    from: 'From',
    billTo: 'Bill to',
    invoiceInfo: 'Invoice details',
    name: 'Name',
    address: 'Address',
    taxIdOptional: 'Tax ID (optional)',
    invoiceNo: 'Invoice number',
    date: 'Date',
    dueOptional: 'Due date (optional)',
    currency: 'Currency',
    taxRate: 'Tax rate (%)',
    lineItems: 'Line items',
    addLine: 'Add line',
    lineN: (n) => `Line ${n}`,
    remove: 'Remove',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit price',
    notesSection: 'Notes',
    paymentTerms: 'Payment terms',
    notes: 'Notes',
  },
  placeholders: {
    sellerName: 'Your name or company',
    sellerAddress: 'Street, city, country',
    invoiceNo: 'e.g. INV-2025-001',
    clientName: 'Client name or company',
    lineDescription: 'Service or product',
    paymentTerms: 'e.g. Net 30, bank transfer',
  },
  currencies: {
    CNY: 'CNY',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  },
  preview: {
    invoice: 'INVOICE',
    invoiceNo: 'Invoice number',
    date: 'Date',
    due: 'Due',
    currency: 'Currency',
    from: 'From',
    billTo: 'Bill to',
    taxIdLabel: 'Tax ID: ',
    colDescription: 'Description',
    colQty: 'Qty',
    colUnit: 'Unit',
    colAmount: 'Amount',
    subtotal: 'Subtotal',
    tax: (pct) => `Tax (${pct}%)`,
    total: 'Total',
    paymentTerms: 'Payment terms',
    notes: 'Notes',
  },
}

const byLocale: Record<Locale, Copy> = { zh, en }

export function getCopy(locale: Locale): Copy {
  return byLocale[locale]
}

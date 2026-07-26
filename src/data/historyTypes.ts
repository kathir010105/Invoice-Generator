import { Invoice } from './types'

export interface InvoiceRecord {
  id: string
  invoice: Invoice
  createdAt: number
  updatedAt: number
}

export interface InvoiceHistory {
  records: InvoiceRecord[]
  currentId: string | null
}

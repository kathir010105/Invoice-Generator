import { ProductLine, Invoice } from './types'

export const initialProductLine: ProductLine = {
  description: '',
  quantity: '1',
  rate: '0.00',
}

export const initialInvoice: Invoice = {
  logo: '',
  logoWidth: 100,
  title: 'INVOICE',
  companyName: '',
  companyGSTIN: '',
  name: '',
  companyAddress: '',
  companyAddress2: '',
  companyCountry: 'India',
  billTo: 'Bill To:',
  clientName: '',
  clientAddress: '',
  clientAddress2: '',
  clientCountry: '',
  invoiceTitleLabel: 'Invoice#',
  invoiceTitle: '',
  invoiceDateLabel: 'Invoice Date',
  invoiceDate: '',
  productLineDescription: 'Item Description',
  productLineQuantity: 'Qty',
  productLineQuantityRate: 'Rate',
  productLineQuantityAmount: 'Amount',
  productLines: [
    { ...initialProductLine }
  ],
  subTotalLabel: 'Sub Total',
  discountLabel: 'Discount',
  discountAmount: '0.00',
  taxLabel: 'SGST (18%)',
  totalLabel: 'TOTAL',
  currency: '₹',
}

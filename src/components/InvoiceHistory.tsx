import { FC } from 'react'
import { format } from 'date-fns/format'
import { InvoiceRecord } from '../data/historyTypes'
import '../scss/invoiceHistory.scss'

interface Props {
  records: InvoiceRecord[]
  currentId: string | null
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onNew: () => void
  onClose: () => void
}

const InvoiceHistory: FC<Props> = ({ records, currentId, onLoad, onDelete, onDuplicate, onNew, onClose }) => {
  const dateFormat = 'MMM dd, yyyy HH:mm'

  return (
    <>
      <div className="history-backdrop" onClick={onClose} />
      <div className="invoice-history">
        <div className="history-header">
          <h2>Invoice History</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={onNew}>
              + New Invoice
            </button>
            <button
              className="btn-primary"
              onClick={onClose}
              style={{ background: '#6c757d' }}
            >
              Close
            </button>
          </div>
        </div>

        <div className="history-list">
          {records.length === 0 ? (
            <p className="empty-state">No invoices yet. Create one to get started.</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className={`history-item ${currentId === record.id ? 'active' : ''}`}>
                <div className="item-content" onClick={() => onLoad(record.id)}>
                  <div className="item-title">{record.invoice.companyName || 'Untitled Invoice'}</div>
                  <div className="item-details">
                    <span className="client">
                      {record.invoice.clientName ? `Bill To: ${record.invoice.clientName}` : 'No client'}
                    </span>
                    <span className="date">{format(new Date(record.updatedAt), dateFormat)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <button className="btn-icon" title="Duplicate" onClick={() => onDuplicate(record.id)}>
                    📋
                  </button>
                  <button
                    className="btn-icon danger"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this invoice?')) {
                        onDelete(record.id)
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default InvoiceHistory

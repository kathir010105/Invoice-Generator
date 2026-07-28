import { useCallback, useMemo, useState } from 'react'
import InvoicePage from './components/InvoicePage'
import Download from './components/DownloadPDF'
import InvoiceHistory from './components/InvoiceHistory'
import { Invoice } from './data/types'
import { initialInvoice } from './data/initialData'
import { useInvoiceHistory } from './hooks/useInvoiceHistory'

const getDefaultInvoice = (): Invoice => {
  const savedTemplate = window.localStorage.getItem('defaultInvoiceTemplate')
  if (savedTemplate) {
    try {
      const template = JSON.parse(savedTemplate)
      if (template.taxLabel === 'Sale Tax (10%)') {
        template.taxLabel = 'SGST (18%)'
      }
      if (!template.signatureLabel || template.signatureLabel === 'Authorized Signatory') {
        template.signatureLabel = 'Authorized Signate'
      }
      if (!template.signatureWidth || template.signatureWidth <= 150) {
        template.signatureWidth = 200
      }
      return template
    } catch (e) {
      console.error('Failed to parse default template', e)
    }
  }
  return { ...initialInvoice }
}

function App() {
  const [showHistory, setShowHistory] = useState(false)
  const { history, currentId, addInvoice, updateInvoice, deleteInvoice, getCurrentInvoice, loadInvoice, duplicateInvoice } =
    useInvoiceHistory()

  const generateNextInvoiceTitle = useCallback(() => {
    let maxNumber = 0;
    let prefix = 'INV-';
    let paddedLength = 0;

    history.forEach((record) => {
      const title = record.invoice.invoiceTitle;
      if (title) {
        const match = title.match(/^(.*?)(\d+)$/);
        if (match) {
          const numStr = match[2];
          const num = parseInt(numStr, 10);
          if (num > maxNumber) {
            maxNumber = num;
            prefix = match[1];
            paddedLength = numStr.length;
          }
        }
      }
    });

    if (maxNumber > 0) {
      const nextNumStr = (maxNumber + 1).toString();
      const paddedNextNum = nextNumStr.padStart(paddedLength, '0');
      return `${prefix}${paddedNextNum}`;
    }
    return 'INV-1';
  }, [history]);

  const getDefaultInvoiceWithAutoIncrement = useCallback((): Invoice => {
    const baseInvoice = getDefaultInvoice();
    baseInvoice.invoiceTitle = generateNextInvoiceTitle();
    return baseInvoice;
  }, [generateNextInvoiceTitle]);

  const currentInvoice = useMemo(() => getCurrentInvoice() || getDefaultInvoiceWithAutoIncrement(), [
    getCurrentInvoice,
    getDefaultInvoiceWithAutoIncrement,
  ])

  const handleNewInvoice = () => {
    addInvoice(getDefaultInvoiceWithAutoIncrement())
    setShowHistory(false)
  }

  const handleInvoiceChange = useCallback((invoice: Invoice) => {
    if (currentId) {
      updateInvoice(currentId, invoice)
    } else {
      addInvoice(invoice)
    }
  }, [currentId, updateInvoice, addInvoice])

  const handleLoadInvoice = (id: string) => {
    loadInvoice(id)
    setShowHistory(false)
  }

  const handleDuplicate = (id: string) => {
    duplicateInvoice(id)
    setShowHistory(false)
  }

  return (
    <div className="app-container">
      <div className="app-sidebar">
        <div className="sidebar-header">
          <h1 className="fs-30">Invoice Generator</h1>
        </div>

        <div className="sidebar-controls">
          <Download
            data={currentInvoice}
            setData={handleInvoiceChange}
            onToggleHistory={() => setShowHistory(!showHistory)}
          />
        </div>
      </div>

      <div className="app-main">
        <InvoicePage data={currentInvoice} onChange={handleInvoiceChange} />
      </div>

      {showHistory && (
        <InvoiceHistory
          records={history}
          currentId={currentId}
          onLoad={handleLoadInvoice}
          onDelete={deleteInvoice}
          onDuplicate={handleDuplicate}
          onNew={handleNewInvoice}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}

export default App

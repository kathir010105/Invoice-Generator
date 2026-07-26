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
      return JSON.parse(savedTemplate)
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

  const currentInvoice = useMemo(() => getCurrentInvoice() || getDefaultInvoice(), [getCurrentInvoice])

  const handleNewInvoice = () => {
    addInvoice(getDefaultInvoice())
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
            onNewInvoice={handleNewInvoice}
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

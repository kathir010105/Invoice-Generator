import React, { FC, useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice, TInvoice } from '../data/types'
import { useDebounce } from '@uidotdev/usehooks'
import InvoicePage from './InvoicePage'
import FileSaver from 'file-saver'

interface Props {
  data: Invoice
  setData(data: Invoice): void
  onToggleHistory(): void
  onNewInvoice(): void
}

const Download: FC<Props> = ({
  data,
  setData,
  onToggleHistory,
  onNewInvoice,
}) => {
  const debounced = useDebounce(data, 500)

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    file
      .text()
      .then((str: string) => {
        try {
          if (!(str.startsWith('{') && str.endsWith('}'))) {
            str = atob(str)
          }
          const d = JSON.parse(str)
          const dParsed = TInvoice.parse(d)
          console.info('parsed correctly')
          setData(dParsed)
        } catch (e) {
          console.error(e)
          return
        }
      })
      .catch((err) => console.error(err))
  }

  function handleSaveTemplate() {
    const blob = new Blob([JSON.stringify(debounced)], {
      type: 'text/plain;charset=utf-8',
    })
    FileSaver(blob, title + '.template')
  }

  function handleSaveDefaultTemplate() {
    window.localStorage.setItem('defaultInvoiceTemplate', JSON.stringify(debounced))
    window.alert('Saved as default template!')
  }

  const title = data.invoiceTitle ? data.invoiceTitle.toLowerCase() : 'invoice'
  const pdfDocument = useMemo(() => <InvoicePage pdfMode={true} data={debounced} />, [debounced])

  return (
    <div className={'download-pdf '}>
      <div className="download-pdf history-control">
        <button
          className="download-pdf__history"
          aria-label="Toggle History"
          onClick={onToggleHistory}
        />
        <p>History</p>
      </div>

      <PDFDownloadLink
        key={title}
        document={pdfDocument}
        fileName={`${title}.pdf`}
        aria-label="Save PDF"
        title="Save PDF"
        className="download-pdf__pdf"
      >
        {() => null}
      </PDFDownloadLink>
      <p>Save PDF</p>

      <button
        onClick={handleSaveTemplate}
        aria-label="Save Template"
        title="Save Template"
        className="download-pdf__template_download mt-40"
      />
      <p className="text-small">Save Template</p>

      <button
        onClick={handleSaveDefaultTemplate}
        aria-label="Save as Default"
        title="Save as Default"
        className="download-pdf__template_download"
        style={{ marginTop: '10px' }}
      />
      <p className="text-small">Save as Default</p>

      <label className="download-pdf__template_upload" style={{ marginTop: '10px' }}>
        <input type="file" accept=".json,.template" onChange={handleInput} />
      </label>
      <p className="text-small">Upload Template</p>
    </div>
  )
}

export default Download

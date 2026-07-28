import { useCallback, useEffect, useRef, useState } from 'react'
import { Invoice } from '../data/types'
import { InvoiceRecord } from '../data/historyTypes'

const HISTORY_KEY = 'invoiceHistory'
const CURRENT_KEY = 'currentInvoiceId'
const LEGACY_KEY = 'invoiceData'

export const useInvoiceHistory = () => {
  const [history, setHistory] = useState<InvoiceRecord[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const currentIdRef = useRef<string | null>(null)

  useEffect(() => {
    currentIdRef.current = currentId
  }, [currentId])

  useEffect(() => {
    const savedHistory = window.localStorage.getItem(HISTORY_KEY)
    const savedCurrentId = window.localStorage.getItem(CURRENT_KEY)
    const legacyInvoice = window.localStorage.getItem(LEGACY_KEY)

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as InvoiceRecord[]
        parsedHistory.forEach((record) => {
          if (record.invoice.taxLabel === 'Sale Tax (10%)') {
            record.invoice.taxLabel = 'SGST (18%)'
          }
        })
        setHistory(parsedHistory)
        setCurrentId(savedCurrentId ?? parsedHistory[0]?.id ?? null)
        return
      } catch (_e) {
        console.error('Failed to parse invoice history')
      }
    }

    if (legacyInvoice) {
      try {
        const invoice = JSON.parse(legacyInvoice) as Invoice
        if (invoice.taxLabel === 'Sale Tax (10%)') {
          invoice.taxLabel = 'SGST (18%)'
        }
        const newRecord: InvoiceRecord = {
          id: `${Date.now()}`,
          invoice,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        setHistory([newRecord])
        setCurrentId(newRecord.id)
      } catch (_e) {
        console.error('Failed to parse legacy invoice data')
      }
    }

    if (savedCurrentId) {
      setCurrentId(savedCurrentId)
    }
  }, [])

  useEffect(() => {
    if (history.length > 0) {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } else {
      window.localStorage.removeItem(HISTORY_KEY)
    }
  }, [history])

  useEffect(() => {
    if (currentId) {
      window.localStorage.setItem(CURRENT_KEY, currentId)
    } else {
      window.localStorage.removeItem(CURRENT_KEY)
    }
  }, [currentId])

  const addInvoice = useCallback((invoice: Invoice) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const newRecord: InvoiceRecord = {
      id,
      invoice,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setHistory((prev) => [newRecord, ...prev])
    setCurrentId(id)
    return id
  }, [])

  const updateInvoice = useCallback((id: string, invoice: Invoice) => {
    setHistory((prev) =>
      prev.map((record) => (record.id === id ? { ...record, invoice, updatedAt: Date.now() } : record)),
    )
  }, [])

  const deleteInvoice = useCallback((id: string) => {
    setHistory((prev) => {
      const remaining = prev.filter((record) => record.id !== id)

      if (remaining.length === 0) {
        setCurrentId(null)
        return []
      }

      if (currentIdRef.current === id) {
        setCurrentId(remaining[0].id)
      }

      return remaining
    })
  }, [])

  const getCurrentInvoice = useCallback((): Invoice | null => {
    if (!currentId) return null
    const record = history.find((entry) => entry.id === currentId)
    return record ? record.invoice : null
  }, [currentId, history])

  const loadInvoice = useCallback((id: string) => {
    const record = history.find((entry) => entry.id === id)
    if (record) {
      setCurrentId(id)
      return record.invoice
    }
    return null
  }, [history])

  const duplicateInvoice = useCallback((id: string) => {
    const record = history.find((entry) => entry.id === id)
    if (record) {
      return addInvoice({ ...record.invoice })
    }
    return null
  }, [addInvoice, history])

  return {
    history,
    currentId,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getCurrentInvoice,
    loadInvoice,
    duplicateInvoice,
  }
}

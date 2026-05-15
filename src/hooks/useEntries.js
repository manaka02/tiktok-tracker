import { useCallback, useState } from 'react'
import { generateTxtExport } from '../utils/export'
import { loadState, saveState } from '../utils/storage'
import { isValidTikTokUrl } from '../utils/validators'

export function useEntries() {
  const [state, setState] = useState(loadState)

  const persist = useCallback((next) => {
    setState(next)
    saveState(next)
  }, [])

  const entries = state.entries
  const lastExportDate = state.lastExportDate
  const mode = state.lastMode

  const setMode = useCallback(
    (nextMode) => {
      setState((prev) => {
        const next = { ...prev, lastMode: nextMode }
        saveState(next)
        return next
      })
    },
    [],
  )

  const addEntries = useCallback(
    (urls, type) => {
      const counts = { saved: 0, duplicate: 0, invalid: 0 }
      const current = loadState()
      const existingUrls = new Set(current.entries.map((e) => e.url))
      const seenInBatch = new Set()
      const newEntries = []

      const baseTime = Date.now()

      urls.forEach((raw, index) => {
        const trimmed = raw.trim()
        if (!trimmed || !isValidTikTokUrl(trimmed)) {
          counts.invalid += 1
          return
        }
        if (seenInBatch.has(trimmed) || existingUrls.has(trimmed)) {
          counts.duplicate += 1
          seenInBatch.add(trimmed)
          return
        }
        seenInBatch.add(trimmed)
        newEntries.push({
          id: crypto.randomUUID(),
          url: trimmed,
          type,
          createdAt: new Date(baseTime + index).toISOString(),
          exported: false,
        })
        counts.saved += 1
      })

      if (newEntries.length > 0) {
        persist({
          ...current,
          entries: [...newEntries, ...current.entries],
          lastMode: type,
        })
      }

      return counts
    },
    [persist],
  )

  const addEntry = useCallback(
    (url, type) => {
      const result = addEntries([url], type)
      if (result.saved > 0) return 'saved'
      if (result.duplicate > 0) return 'duplicate'
      return 'invalid'
    },
    [addEntries],
  )

  const exportNew = useCallback(() => {
    const current = loadState()
    const toExport = current.entries.filter((e) => !e.exported)
    if (toExport.length === 0) return { status: 'empty' }

    const content = generateTxtExport(toExport, current.lastExportDate)
    const now = new Date().toISOString()
    const exportedIds = new Set(toExport.map((e) => e.id))

    persist({
      ...current,
      entries: current.entries.map((e) =>
        exportedIds.has(e.id) ? { ...e, exported: true } : e,
      ),
      lastExportDate: now,
    })

    return { status: 'ok', count: toExport.length, content }
  }, [persist])

  const clearAll = useCallback(() => {
    persist({
      entries: [],
      lastExportDate: null,
      lastMode: 'comment',
    })
  }, [persist])

  return {
    entries,
    mode,
    setMode,
    addEntry,
    addEntries,
    exportNew,
    lastExportDate,
    clearAll,
  }
}

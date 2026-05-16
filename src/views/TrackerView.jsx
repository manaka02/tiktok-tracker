import { useMemo, useRef, useState } from 'react'
import TrackerBody from '../components/tracker/TrackerBody'
import TrackerComposer from '../components/tracker/TrackerComposer'
import TrackerHeader from '../components/tracker/TrackerHeader'
import { formatBatchToast } from '../utils/batchToast'
import { downloadTxtFile, generateTxtExportAll } from '../utils/export'
import { isToday } from '../utils/dates'
import { parseTikTokUrls } from '../utils/validators'

export default function TrackerView({
  entries,
  mode,
  setMode,
  addEntries,
  exportNew,
  lastExportDate,
  onToast,
}) {
  const [url, setUrl] = useState('')
  const inputRef = useRef(null)
  const listEndRef = useRef(null)

  const visibleEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [entries],
  )

  const unexportedCount = entries.filter((e) => !e.exported).length

  const { commentsToday, totalComments } = useMemo(() => {
    let today = 0
    let total = 0
    for (const e of entries) {
      if (e.type !== 'comment') continue
      total += 1
      if (isToday(e.createdAt)) today += 1
    }
    return { commentsToday: today, totalComments: total }
  }, [entries])

  const submitText = (text) => {
    const urls = parseTikTokUrls(text)

    if (urls.length === 0) {
      onToast({ message: '❌ Lien TikTok invalide', variant: 'error' })
      return
    }
    const counts = addEntries(urls, mode)
    onToast(formatBatchToast(counts))
    setUrl('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitText(url)
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const t = text.trimEnd()
      if (!t) return
      setUrl((prev) => {
        const p = prev.trimEnd()
        return p ? `${p}\n${t}` : t
      })
      inputRef.current?.focus()
    } catch {
      onToast({
        message: '❌ Accès au presse-papiers refusé',
        variant: 'error',
      })
      inputRef.current?.focus()
    }
  }

  const handleExport = () => {
    const result = exportNew()
    if (result.status === 'empty') {
      onToast({ message: 'Rien de nouveau à exporter', variant: 'warning' })
      return
    }
    downloadTxtFile(result.content, 'nouveaux')
    onToast({
      message: `✅ Export réussi — ${result.count} liens exportés`,
      variant: 'success',
    })
  }

  const handleExportAll = () => {
    if (entries.length === 0) {
      onToast({ message: 'Aucun lien à exporter', variant: 'warning' })
      return
    }
    downloadTxtFile(generateTxtExportAll(entries), 'complet')
    onToast({
      message: `✅ Export complet — ${entries.length} liens exportés`,
      variant: 'success',
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TrackerHeader
        entries={entries}
        commentsToday={commentsToday}
        totalComments={totalComments}
        unexportedCount={unexportedCount}
        lastExportDate={lastExportDate}
        onExportNew={handleExport}
        onExportAll={handleExportAll}
      />
      <TrackerBody
        sortedEntries={visibleEntries}
        listEndRef={listEndRef}
      />
      <TrackerComposer
        url={url}
        onUrlChange={setUrl}
        mode={mode}
        onToggleMode={() => setMode(mode === 'video' ? 'comment' : 'video')}
        onSubmit={handleSubmit}
        onPasteFromClipboard={handlePasteFromClipboard}
        inputRef={inputRef}
      />
    </div>
  )
}

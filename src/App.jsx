import { useCallback, useState } from 'react'
import Toast from './components/Toast'
import { useEntries } from './hooks/useEntries'
import TrackerView from './views/TrackerView'

export default function App() {
  const [toast, setToast] = useState(null)
  const { entries, mode, setMode, addEntries, exportNew, lastExportDate } =
    useEntries()

  const showToast = useCallback((payload) => {
    setToast(payload)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-hidden bg-bg">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TrackerView
          entries={entries}
          mode={mode}
          setMode={setMode}
          addEntries={addEntries}
          exportNew={exportNew}
          lastExportDate={lastExportDate}
          onToast={showToast}
        />
      </main>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

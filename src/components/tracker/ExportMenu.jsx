import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { IconChevronDown } from '../icons/Icons'

const StatsModal = lazy(() => import('./StatsModal'))

const menuItemClass =
  'w-full px-4 py-3 text-left text-sm text-text transition-colors hover:bg-input'

export default function ExportMenu({
  entries,
  unexportedCount,
  onExportNew,
  onExportAll,
}) {
  const [open, setOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <>
      <div ref={containerRef} className="relative flex shrink-0">
        <button
          type="button"
          onClick={onExportNew}
          className="relative flex min-h-[40px] items-center rounded-l-lg bg-video py-2 pl-3 pr-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Exporter
          {unexportedCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
              {unexportedCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Options d'export"
          className="flex min-h-[40px] items-center rounded-r-lg border-l border-white/20 bg-video px-2 text-white transition-opacity hover:opacity-90"
        >
          <IconChevronDown
            size={18}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-30 mt-1 min-w-[200px] overflow-hidden rounded-lg border border-input bg-surface py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setStatsOpen(true)
                setOpen(false)
              }}
              className={menuItemClass}
            >
              Statistiques
              <span className="mt-0.5 block text-xs text-muted">
                Mois en cours, par jour
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onExportAll()
                setOpen(false)
              }}
              className={menuItemClass}
            >
              Exporter tout
              <span className="mt-0.5 block text-xs text-muted">
                Sauvegarde complète, groupée par jour
              </span>
            </button>
          </div>
        )}
      </div>

      {statsOpen && (
        <Suspense fallback={null}>
          <StatsModal entries={entries} onClose={() => setStatsOpen(false)} />
        </Suspense>
      )}
    </>
  )
}

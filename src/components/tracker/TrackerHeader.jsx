import { formatDateTimeFr } from '../../utils/dates'
import ExportMenu from './ExportMenu'

export default function TrackerHeader({
  commentsToday,
  totalComments,
  unexportedCount,
  lastExportDate,
  onExportNew,
  onExportAll,
}) {
  return (
    <header className="z-10 shrink-0 border-b border-input bg-surface px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold">TikTok Tracker</h1>
          <p className="mt-0.5 text-xs text-muted">
            {commentsToday} commentaire{commentsToday !== 1 ? 's' : ''}{' '}
            aujourd&apos;hui · {totalComments} au total
          </p>
        </div>
        <ExportMenu
          unexportedCount={unexportedCount}
          onExportNew={onExportNew}
          onExportAll={onExportAll}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        {lastExportDate
          ? `Dernier export : ${formatDateTimeFr(lastExportDate)}`
          : "Aucun export pour l'instant"}
      </p>
    </header>
  )
}

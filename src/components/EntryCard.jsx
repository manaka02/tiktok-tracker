import { formatTime } from '../utils/dates'

export default function EntryCard({ entry }) {
  const isVideo = entry.type === 'video'

  return (
    <div className="mb-2 flex justify-end">
      <div
        className={`max-w-[min(100%,20rem)] rounded-2xl rounded-br-md px-4 py-2.5 ${
          isVideo
            ? 'bg-video/15 ring-1 ring-video/30'
            : 'bg-comment/15 ring-1 ring-comment/30'
        }`}
      >
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block break-all text-sm text-text underline-offset-2 hover:underline"
        >
          {entry.url}
        </a>
        <div className="mt-1 flex items-center justify-end gap-2">
          {entry.exported && (
            <span className="text-[10px] text-muted">Exporté</span>
          )}
          <span className="text-[10px] text-muted">
            {formatTime(entry.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

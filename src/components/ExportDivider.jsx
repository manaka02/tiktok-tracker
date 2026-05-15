export default function ExportDivider() {
  return (
    <div
      className="my-4 flex items-center gap-3"
      role="separator"
      aria-label="Nouveaux liens depuis le dernier export"
    >
      <div className="h-px flex-1 bg-error/60" />
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-error">
        Nouveaux liens
      </span>
      <div className="h-px flex-1 bg-error/60" />
    </div>
  )
}

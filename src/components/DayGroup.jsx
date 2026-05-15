import EntryCard from './EntryCard'
import ExportDivider from './ExportDivider'

export default function DayGroup({
  label,
  entries,
  chatLayout = false,
  dividerAfterId = null,
}) {
  if (entries.length === 0) return null

  return (
    <section className={chatLayout ? 'mb-2' : 'mb-6'}>
      <h2
        className={
          chatLayout
            ? 'my-3 text-center text-xs font-medium text-muted'
            : 'mb-3 text-sm font-semibold text-muted'
        }
      >
        {label}
      </h2>
      <div className={chatLayout ? '' : 'flex flex-col gap-2'}>
        {entries.map((entry) => (
          <div key={entry.id}>
            <EntryCard entry={entry} />
            {dividerAfterId === entry.id && <ExportDivider />}
          </div>
        ))}
      </div>
    </section>
  )
}

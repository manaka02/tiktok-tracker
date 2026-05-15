import { getDateKey } from './dates'

function getMonthKey(isoString) {
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function buildCurrentMonthDailyStats(entries) {
  const currentMonthKey = getMonthKey(new Date().toISOString())
  const map = new Map()

  for (const entry of entries) {
    if (getMonthKey(entry.createdAt) !== currentMonthKey) continue

    const key = getDateKey(entry.createdAt)
    if (!map.has(key)) {
      map.set(key, { dateKey: key, videos: 0, comments: 0 })
    }
    const row = map.get(key)
    if (entry.type === 'video') row.videos += 1
    else row.comments += 1
  }

  return [...map.values()]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map((row) => {
      const d = new Date(`${row.dateKey}T12:00:00`)
      return {
        dateKey: row.dateKey,
        label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        videos: row.videos,
        comments: row.comments,
        total: row.videos + row.comments,
      }
    })
}

export function getCurrentMonthLabel() {
  const label = new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatDayLabel(dateInput) {
  const date = new Date(dateInput)
  const today = startOfDay(new Date())
  const target = startOfDay(date)
  const diff = today.getTime() - target.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  if (diff === 0) return "Aujourd'hui"
  if (diff === oneDay) return 'Hier'

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getDateKey(isoString) {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isToday(isoString) {
  return getDateKey(isoString) === getDateKey(new Date().toISOString())
}

export function formatDateTimeFr(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

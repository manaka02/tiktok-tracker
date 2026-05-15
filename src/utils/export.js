import { formatDateTimeFr, formatDayLabel, getDateKey } from './dates'

function groupEntriesByDay(entries) {
  const map = new Map()
  for (const entry of entries) {
    const key = getDateKey(entry.createdAt)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(entry)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, dayEntries]) =>
      [...dayEntries].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    )
}

function appendTypeByDay(lines, title, underline, entries) {
  lines.push(title, underline)
  const days = groupEntriesByDay(entries)
  if (days.length === 0) {
    lines.push('(aucune)')
    return
  }
  for (const dayEntries of days) {
    lines.push('', formatDayLabel(dayEntries[0].createdAt))
    dayEntries.forEach((e) => lines.push(e.url))
  }
}

export function generateTxtExport(entries, lastExportDate) {
  const lines = []

  if (lastExportDate) {
    lines.push(
      `Nouveaux liens depuis : ${formatDateTimeFr(lastExportDate)}`,
      '',
    )
  }

  const videos = entries.filter((e) => e.type === 'video')
  const comments = entries.filter((e) => e.type === 'comment')

  lines.push('VIDÉOS', '------')
  videos.forEach((e) => lines.push(e.url))

  lines.push('', '================================================', '')

  lines.push('COMMENTAIRES', '------------')
  comments.forEach((e) => lines.push(e.url))

  return lines.join('\n')
}

export function generateTxtExportAll(entries) {
  const lines = [
    `Export complet — ${formatDateTimeFr(new Date().toISOString())}`,
    '',
  ]
  const videos = entries.filter((e) => e.type === 'video')
  const comments = entries.filter((e) => e.type === 'comment')

  appendTypeByDay(lines, 'VIDÉOS', '------', videos)
  lines.push('', '================================================', '')
  appendTypeByDay(lines, 'COMMENTAIRES', '------------', comments)

  return lines.join('\n')
}

export function downloadTxtFile(content, variant = 'nouveaux') {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  const filename = `tiktok-export-${variant}-${stamp}.txt`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

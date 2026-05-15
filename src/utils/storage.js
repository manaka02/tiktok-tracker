const STORAGE_KEY = 'tiktok-tracker'

const DEFAULT_STATE = {
  entries: [],
  lastExportDate: null,
  lastMode: 'comment',
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw)
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      lastExportDate: parsed.lastExportDate ?? null,
      lastMode: parsed.lastMode === 'comment' ? 'comment' : 'video',
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getEntries() {
  return loadState().entries
}

export function setEntries(entries) {
  const state = loadState()
  saveState({ ...state, entries })
}

export function getLastExportDate() {
  return loadState().lastExportDate
}

export function setLastExportDate(date) {
  const state = loadState()
  saveState({ ...state, lastExportDate: date })
}

export function getLastMode() {
  return loadState().lastMode
}

export function setLastMode(mode) {
  const state = loadState()
  saveState({ ...state, lastMode: mode })
}

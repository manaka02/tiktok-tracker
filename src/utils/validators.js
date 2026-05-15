const TIKTOK_HOST = /^([a-z0-9-]+\.)*tiktok\.com$/i

export function isValidTikTokUrl(input) {
  const trimmed = input.trim()
  if (!trimmed) return false

  let parsed
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
  } catch {
    return false
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false
  }

  if (!TIKTOK_HOST.test(parsed.hostname)) {
    return false
  }

  const path = parsed.pathname.replace(/\/+$/, '')
  if (!path || path === '/') {
    return false
  }

  return true
}

export function parseTikTokUrls(input) {
  const trimmed = input.trim()
  if (!trimmed) return []

  const urls = []
  const seen = new Set()

  for (const token of trimmed.split(/\s+/)) {
    const candidate = token.trim()
    if (!candidate || !isValidTikTokUrl(candidate) || seen.has(candidate)) continue
    seen.add(candidate)
    urls.push(candidate)
  }

  return urls
}

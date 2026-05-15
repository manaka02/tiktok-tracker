import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import DayGroup from '../DayGroup'
import { formatDayLabel, getDateKey } from '../../utils/dates'

const PAGE_SIZE = 20

function buildGroups(entries) {
  const map = new Map()
  for (const entry of entries) {
    const key = getDateKey(entry.createdAt)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(entry)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, dayEntries]) => ({
      dateKey,
      label: formatDayLabel(dayEntries[0].createdAt),
      entries: dayEntries,
    }))
}

export default function TrackerBody({ sortedEntries, listEndRef }) {
  const scrollRef = useRef(null)
  const loadMoreRef = useRef(null)
  const scrollAnchorRef = useRef(null)
  const loadingMoreRef = useRef(false)
  const didInitialScrollRef = useRef(false)
  const prevTotalRef = useRef(sortedEntries.length)

  const scrollToBottom = useCallback((behavior = 'auto') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const totalCount = sortedEntries.length
  const hasMore = displayCount < totalCount

  const displayedEntries = useMemo(() => {
    if (totalCount <= displayCount) return sortedEntries
    return sortedEntries.slice(totalCount - displayCount)
  }, [sortedEntries, displayCount, totalCount])

  const groups = useMemo(
    () => buildGroups(displayedEntries),
    [displayedEntries],
  )

  const dividerAfterId = useMemo(() => {
    let lastExportedIdx = -1
    for (let i = 0; i < displayedEntries.length; i++) {
      if (displayedEntries[i].exported) lastExportedIdx = i
    }
    if (lastExportedIdx === -1) return null
    if (lastExportedIdx >= displayedEntries.length - 1) return null
    return displayedEntries[lastExportedIdx].id
  }, [displayedEntries])

  useEffect(() => {
    const prev = prevTotalRef.current
    const grew = totalCount > prev

    if (grew) {
      setDisplayCount((c) => {
        const hidden = totalCount - c
        if (hidden <= PAGE_SIZE) return totalCount
        return c
      })
    }
  }, [totalCount])

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current) return
    setDisplayCount((c) => {
      if (c >= totalCount) return c
      const el = scrollRef.current
      if (el) {
        scrollAnchorRef.current = { top: el.scrollTop, height: el.scrollHeight }
      }
      loadingMoreRef.current = true
      return Math.min(c + PAGE_SIZE, totalCount)
    })
  }, [totalCount])

  useLayoutEffect(() => {
    if (loadingMoreRef.current) {
      loadingMoreRef.current = false
      const el = scrollRef.current
      const anchor = scrollAnchorRef.current
      if (el && anchor) {
        el.scrollTop = anchor.top + (el.scrollHeight - anchor.height)
      }
      return
    }

    if (totalCount > 0 && !didInitialScrollRef.current) {
      scrollToBottom('auto')
      requestAnimationFrame(() => scrollToBottom('auto'))
      didInitialScrollRef.current = true
    }
  }, [displayCount, totalCount, scrollToBottom])

  useEffect(() => {
    const prev = prevTotalRef.current
    const grew = totalCount > prev
    if (grew && didInitialScrollRef.current) {
      const hidden = totalCount - displayCount
      if (hidden <= PAGE_SIZE) {
        scrollToBottom('smooth')
      }
    }
    prevTotalRef.current = totalCount
  }, [totalCount, displayCount, scrollToBottom])

  useEffect(() => {
    const root = scrollRef.current
    const target = loadMoreRef.current
    if (!root || !target || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { root, rootMargin: '80px', threshold: 0 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-2"
    >
      {groups.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted">
          Colle un lien TikTok pour commencer
        </p>
      ) : (
        <>
          {hasMore && (
            <div
              ref={loadMoreRef}
              className="mb-3 py-2 text-center text-xs text-muted"
            >
              Faites défiler pour charger plus…
            </div>
          )}
          {groups.map(({ dateKey, label, entries }) => (
            <DayGroup
              key={dateKey}
              label={label}
              entries={entries}
              chatLayout
              dividerAfterId={dividerAfterId}
            />
          ))}
          <div ref={listEndRef} />
        </>
      )}
    </div>
  )
}

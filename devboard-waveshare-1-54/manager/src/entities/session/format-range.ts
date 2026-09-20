import type { Session } from './sessions'

const day = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

/** "Sep 12 – Sep 15", "Sep 12" (same day), "before Sep 12", "since Sep 12". */
export function formatRange({ from, to }: Pick<Session, 'from' | 'to'>): string {
  if (from !== null && to !== null) return day(from) === day(to) ? day(from) : `${day(from)} – ${day(to)}`
  if (to !== null) return `before ${day(to)}`
  if (from !== null) return `since ${day(from)}`
  return 'unknown'
}

import type { Flashcard } from './flashcard'

export interface Stats {
  unpracticed: number
  /** [box, card count], ascending by box. */
  boxes: [number, number][]
}

export function computeStats(cards: Flashcard[]): Stats {
  const counts = new Map<number, number>()
  let unpracticed = 0
  for (const card of cards) {
    if (card.practiced) counts.set(card.box, (counts.get(card.box) ?? 0) + 1)
    else unpracticed++
  }
  return { unpracticed, boxes: [...counts].sort(([a], [b]) => a - b) }
}

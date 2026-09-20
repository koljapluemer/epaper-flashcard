export interface Flashcard {
  /** Stable client-side key for list rendering. */
  key: string
  /** Device card id; 0 = not on the device yet. */
  id: number
  front: string
  back: string
  box: number
  practiced: boolean
  /** Text as last known on the device. */
  syncedFront: string
  syncedBack: string
}

export function newFlashcard(front = '', back = ''): Flashcard {
  return {
    key: crypto.randomUUID(),
    id: 0,
    front,
    back,
    box: 0,
    practiced: false,
    syncedFront: '',
    syncedBack: '',
  }
}

export function isDirty(card: Flashcard): boolean {
  return card.id === 0 || card.front !== card.syncedFront || card.back !== card.syncedBack
}

export function hasText(card: Flashcard): boolean {
  return card.front.trim() !== '' || card.back.trim() !== ''
}

import { readU16LE, readU32LE } from '@/dumb/bytes'
import { newFlashcard, type Flashcard } from './flashcard'

const RECORD_HEADER_BYTES = 14

/** Bit 0 of `bits` is the most recent trial; returns oldest first. */
function expandHistory(count: number, bits: number): boolean[] {
  return Array.from({ length: count }, (_, i) => ((bits >>> (count - 1 - i)) & 1) === 1)
}

/** Record: `[id u32][box u16][practiced u8][histCount u8][histBits u32][frontLen u16][front][backLen u16][back]`. */
export function parseList(bytes: Uint8Array): Flashcard[] {
  const decoder = new TextDecoder()
  const cards: Flashcard[] = []
  let off = 0
  const readText = () => {
    const len = readU16LE(bytes, off)
    const text = decoder.decode(bytes.subarray(off + 2, off + 2 + len))
    off += 2 + len
    return text
  }

  while (off + RECORD_HEADER_BYTES <= bytes.length) {
    const card = newFlashcard()
    card.id = readU32LE(bytes, off)
    card.box = readU16LE(bytes, off + 4)
    card.practiced = bytes[off + 6] !== 0
    card.history = expandHistory(bytes[off + 7], readU32LE(bytes, off + 8))
    off += 12
    card.front = card.syncedFront = readText()
    card.back = card.syncedBack = readText()
    cards.push(card)
  }
  return cards
}

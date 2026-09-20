import { concatBytes, u16le } from '@/dumb/bytes'
import { renderTextTo1bpp } from './bitmap'
import type { Flashcard } from './flashcard'

/** PUT body: `[frontLen u16][front][backLen u16][back][frontBitmap][backBitmap]`. */
export async function encodeBody(card: Pick<Flashcard, 'front' | 'back'>): Promise<Uint8Array> {
  const encoder = new TextEncoder()
  const front = encoder.encode(card.front)
  const back = encoder.encode(card.back)
  const frontBitmap = await renderTextTo1bpp(card.front)
  const backBitmap = await renderTextTo1bpp(card.back)
  return concatBytes(u16le(front.length), front, u16le(back.length), back, frontBitmap, backBitmap)
}

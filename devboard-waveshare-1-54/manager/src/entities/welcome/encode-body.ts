import { concatBytes, u16le } from '@/dumb/bytes'
import { renderTextTo1bpp } from '@/dumb/text-bitmap'

// Must match WELCOME_H in esp/config.h: the top rows of the power-off screen.
export const WELCOME_W = 200
export const WELCOME_H = 32
/** Longest message that still fits legibly in the banner. */
export const WELCOME_MAX_CHARS = 60

/** Welcome body: `[textLen u16][text][bitmap]`. */
export async function encodeWelcomeBody(text: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(text)
  const bitmap = await renderTextTo1bpp(text, WELCOME_W, WELCOME_H)
  return concatBytes(u16le(bytes.length), bytes, bitmap)
}

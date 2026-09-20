import { renderTextTo1bpp as renderTo1bpp } from '@/dumb/text-bitmap'

// Must match BMP_W / BMP_H in esp/config.h: one half of the content area.
export const BMP_W = 200
export const BMP_H = 92

/** Renders one card face into a 1bpp BMP_W x BMP_H bitmap. */
export function renderTextTo1bpp(text: string): Promise<Uint8Array> {
  return renderTo1bpp(text, BMP_W, BMP_H)
}

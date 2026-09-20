import { fontFamiliesFor, fontStackFor } from './script-fonts'

// Must match BMP_W / BMP_H in esp/config.h: one half of the content area.
export const BMP_W = 200
export const BMP_H = 92
const ROW_BYTES = Math.ceil(BMP_W / 8)

const MAX_FONT_PX = 44
const MIN_FONT_PX = 10
const MAX_LINES = 3
const LINE_GAP = 1.15
const PADDING_X = 4
// The device draws its dashed separator over the back half's first row.
const TOP_ROW = 1
const BOTTOM_MARGIN = 3

const canvas = document.createElement('canvas')
canvas.width = BMP_W
canvas.height = BMP_H
const ctx = canvas.getContext('2d', { willReadFrequently: true })!

/** Greedy word wrap; breaks per character for unspaced scripts or overlong words. */
function wrapLines(text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    const tokens = paragraph.includes(' ') ? paragraph.split(/(?<= )/) : Array.from(paragraph)
    for (const token of tokens) {
      if (line && ctx.measureText(line + token).width > maxWidth) {
        lines.push(line.trimEnd())
        line = ''
      }
      line += token
    }
    lines.push(line.trimEnd())
  }
  return lines
}

/** Largest font size whose wrapped text fits, or the minimum size. */
function fitText(text: string, stack: string, maxWidth: number, maxHeight: number) {
  let size = MAX_FONT_PX
  for (;; size--) {
    ctx.font = `${size}px ${stack}`
    const lines = wrapLines(text, maxWidth)
    const fits = lines.length <= MAX_LINES && lines.length * size * LINE_GAP <= maxHeight
    if (fits || size <= MIN_FONT_PX) return { size, lines }
  }
}

function drawText(text: string) {
  const families = fontFamiliesFor(text)
  const maxWidth = BMP_W - 2 * PADDING_X
  const maxHeight = BMP_H - TOP_ROW - BOTTOM_MARGIN
  const { size, lines } = fitText(text, fontStackFor(families), maxWidth, maxHeight)
  const lineHeight = size * LINE_GAP
  const first = TOP_ROW + (maxHeight - lines.length * lineHeight) / 2 + lineHeight / 2
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  lines.forEach((line, i) => ctx.fillText(line, BMP_W / 2, first + i * lineHeight, maxWidth))
}

/** Thresholds to black/white and packs MSB-first, rows padded to a byte (Adafruit_GFX drawBitmap). */
function pack(pixels: Uint8ClampedArray): Uint8Array {
  const out = new Uint8Array(ROW_BYTES * BMP_H)
  for (let y = 0; y < BMP_H; y++) {
    for (let x = 0; x < BMP_W; x++) {
      if (pixels[(y * BMP_W + x) * 4] < 128) out[y * ROW_BYTES + (x >> 3)] |= 0x80 >> (x & 7)
    }
  }
  return out
}

/** Renders `text` centered into a 1bpp BMP_W x BMP_H bitmap. */
export async function renderTextTo1bpp(text: string): Promise<Uint8Array> {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, BMP_W, BMP_H)
  if (text) {
    await Promise.all(fontFamiliesFor(text).map((family) => document.fonts.load(`16px "${family}"`, text)))
    drawText(text)
  }
  return pack(ctx.getImageData(0, 0, BMP_W, BMP_H).data)
}

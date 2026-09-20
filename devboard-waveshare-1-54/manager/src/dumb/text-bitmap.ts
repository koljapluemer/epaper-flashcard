import { fontFamiliesFor, fontStackFor } from './script-fonts'

const MAX_FONT_PX = 44
const MIN_FONT_PX = 10
const MAX_LINES = 3
const LINE_GAP = 1.15
const PADDING_X = 4
// The device draws its dashed separator over the first row of a card's back.
const TOP_ROW = 1
const BOTTOM_MARGIN = 3

/** Greedy word wrap; breaks per character for unspaced scripts or overlong words. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  stack: string,
  maxWidth: number,
  maxHeight: number,
) {
  let size = MAX_FONT_PX
  for (;; size--) {
    ctx.font = `${size}px ${stack}`
    const lines = wrapLines(ctx, text, maxWidth)
    const fits = lines.length <= MAX_LINES && lines.length * size * LINE_GAP <= maxHeight
    if (fits || size <= MIN_FONT_PX) return { size, lines }
  }
}

function drawText(ctx: CanvasRenderingContext2D, text: string, width: number, height: number) {
  const families = fontFamiliesFor(text)
  const maxWidth = width - 2 * PADDING_X
  const maxHeight = height - TOP_ROW - BOTTOM_MARGIN
  const { size, lines } = fitText(ctx, text, fontStackFor(families), maxWidth, maxHeight)
  const lineHeight = size * LINE_GAP
  const first = TOP_ROW + (maxHeight - lines.length * lineHeight) / 2 + lineHeight / 2
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  lines.forEach((line, i) => ctx.fillText(line, width / 2, first + i * lineHeight, maxWidth))
}

/** Thresholds to black/white and packs MSB-first, rows padded to a byte (Adafruit_GFX drawBitmap). */
function pack(pixels: Uint8ClampedArray, width: number, height: number): Uint8Array {
  const rowBytes = Math.ceil(width / 8)
  const out = new Uint8Array(rowBytes * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4] < 128) out[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7)
    }
  }
  return out
}

/** Renders `text` centered into a 1bpp width x height bitmap. */
export async function renderTextTo1bpp(text: string, width: number, height: number): Promise<Uint8Array> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  if (text) {
    await Promise.all(fontFamiliesFor(text).map((family) => document.fonts.load(`16px "${family}"`, text)))
    drawText(ctx, text, width, height)
  }
  return pack(ctx.getImageData(0, 0, width, height).data, width, height)
}

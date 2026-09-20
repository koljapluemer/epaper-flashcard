export function u16le(n: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array([n & 0xff, (n >> 8) & 0xff])
}

export function u32le(n: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff])
}

export function readU16LE(b: Uint8Array, off: number): number {
  return b[off] | (b[off + 1] << 8)
}

export function readU32LE(b: Uint8Array, off: number): number {
  return (b[off] | (b[off + 1] << 8) | (b[off + 2] << 16) | (b[off + 3] << 24)) >>> 0
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let off = 0
  for (const p of parts) {
    out.set(p, off)
    off += p.length
  }
  return out
}

/** CRC-32/ISO-HDLC, same as esp_rom_crc32_le(0, ...). */
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return ~crc >>> 0
}

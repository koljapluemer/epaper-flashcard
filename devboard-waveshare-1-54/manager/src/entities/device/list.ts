import { readU32LE } from '@/dumb/bytes'
import { OP_LIST, REPLY_TIMEOUT_MS } from './constants'
import { collect, writeAcked } from './transport'

/** LIST: `[0x10, total u32]` header notify, then raw chunks until `total` bytes arrived. */
export function readList(onProgress: (received: number, total: number) => void): Promise<Uint8Array> {
  let body: Uint8Array | null = null
  let received = 0

  return collect<Uint8Array>(
    () => writeAcked(new Uint8Array([OP_LIST])),
    (bytes, handle) => {
      if (!body) {
        if (bytes.length < 5 || bytes[0] !== OP_LIST) return handle.fail(new Error('Unexpected reply'))
        body = new Uint8Array(readU32LE(bytes, 1))
      } else {
        body.set(bytes, received)
        received += bytes.length
      }
      onProgress(received, body.length)
      if (received >= body.length) handle.resolve(body)
      else handle.rearm()
    },
    REPLY_TIMEOUT_MS,
  )
}

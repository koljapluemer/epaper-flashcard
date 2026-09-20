import { concatBytes, u32le } from '@/dumb/bytes'
import { OP_SET_TIME, OP_STATS } from './constants'
import { readStream } from './list'
import { request, writeAcked } from './transport'

/** Raw session records: `[practiced u32][syncTs u32]` each. */
export function readSessionBytes(): Promise<Uint8Array> {
  return readStream(OP_STATS)
}

/** Tells the device the real time; it stamps the current session with it. */
export async function sendTime(): Promise<void> {
  const frame = concatBytes(new Uint8Array([OP_SET_TIME]), u32le(Math.floor(Date.now() / 1000)))
  const reply = await request(() => writeAcked(frame), (b) => b.length >= 2 && b[0] === OP_SET_TIME)
  if (reply[1] !== 0) throw new Error('Device rejected the time')
}

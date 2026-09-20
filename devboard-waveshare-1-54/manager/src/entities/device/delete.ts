import { concatBytes, readU32LE, u32le } from '@/dumb/bytes'
import { OP_DELETE, OP_DELETE_ALL } from './constants'
import { request, writeAcked } from './transport'

export async function deleteCard(id: number): Promise<void> {
  const frame = concatBytes(new Uint8Array([OP_DELETE]), u32le(id))
  const reply = await request(() => writeAcked(frame), (b) => b.length >= 2 && b[0] === OP_DELETE)
  if (reply[1] !== 0) throw new Error('Device could not delete the card')
}

/** Returns how many cards the device removed. */
export async function deleteAll(): Promise<number> {
  const frame = new Uint8Array([OP_DELETE_ALL])
  const reply = await request(() => writeAcked(frame), (b) => b.length >= 6 && b[0] === OP_DELETE_ALL)
  if (reply[1] !== 0) throw new Error('Device could not delete the cards')
  return readU32LE(reply, 2)
}

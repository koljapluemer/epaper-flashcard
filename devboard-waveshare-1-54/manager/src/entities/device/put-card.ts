import { concatBytes, crc32, readU32LE, u16le, u32le } from '@/dumb/bytes'
import {
  DATA_PAYLOAD_BYTES,
  OP_BEGIN,
  OP_COMMIT,
  OP_DATA,
  OP_STATUS,
  WINDOW_FRAMES,
  WINDOW_TIMEOUT_MS,
} from './constants'
import { ReplyTimeout, request, writeAcked, writeNoResponse } from './transport'

export interface PutCardArgs {
  /** 0 = let the device assign an id. */
  id: number
  box: number
  practiced: boolean
  /** `[frontLen][front][backLen][back][frontBitmap][backBitmap]` */
  body: Uint8Array
}

const STATUS_OK = 0
const STATUS_GAP = 2
const MAX_STALLS = 4
const COMMIT_ERRORS: Record<number, string> = {
  1: 'invalid card data',
  2: 'checksum mismatch',
  3: 'SD card write failed',
}

function randomTransferId(): number {
  const value = new Uint32Array(1)
  do crypto.getRandomValues(value)
  while (value[0] === 0)
  return value[0]
}

/** Sends `opcode + transferId + extra` acknowledged and waits for the matching reply. */
function control(opcode: number, tid: number, extra = new Uint8Array()): Promise<Uint8Array> {
  const frame = concatBytes(new Uint8Array([opcode]), u32le(tid), extra)
  return request(() => writeAcked(frame), isReplyTo(opcode, tid))
}

function isReplyTo(opcode: number, tid: number) {
  return (b: Uint8Array) => b.length >= 10 && b[0] === opcode && readU32LE(b, 2) === tid
}

function dataFrames(tid: number, body: Uint8Array, from: number): Uint8Array<ArrayBuffer>[] {
  const frames: Uint8Array<ArrayBuffer>[] = []
  for (let at = from; frames.length < WINDOW_FRAMES && at < body.length; at += DATA_PAYLOAD_BYTES) {
    const payload = body.subarray(at, at + DATA_PAYLOAD_BYTES)
    frames.push(concatBytes(new Uint8Array([OP_DATA]), u32le(tid), u32le(at), payload))
  }
  return frames
}

/** Sends one window without response; a lost cumulative ack is recovered via STATUS. */
async function sendWindow(tid: number, frames: Uint8Array<ArrayBuffer>[]): Promise<Uint8Array> {
  const send = async () => {
    for (const frame of frames) await writeNoResponse(frame)
  }
  try {
    return await request(send, isReplyTo(OP_DATA, tid), WINDOW_TIMEOUT_MS)
  } catch (err) {
    if (!(err instanceof ReplyTimeout)) throw err
    return control(OP_STATUS, tid)
  }
}

/** Uploads one card (fast PUT: BEGIN, windowed DATA, COMMIT). Returns the card id. */
export async function putCard(
  { id, box, practiced, body }: PutCardArgs,
  onProgress?: (sent: number, total: number) => void,
): Promise<number> {
  const tid = randomTransferId()
  const begin = concatBytes(
    u32le(id),
    u16le(box),
    new Uint8Array([practiced ? 1 : 0]),
    u32le(body.length),
    u32le(crc32(body)),
  )
  let reply = await control(OP_BEGIN, tid, begin)
  if (reply[1] !== STATUS_OK) throw new Error('Device rejected the upload')

  let offset = readU32LE(reply, 6)
  let stalls = 0
  while (offset < body.length) {
    reply = await sendWindow(tid, dataFrames(tid, body, offset))
    if (reply[1] !== STATUS_OK && reply[1] !== STATUS_GAP) throw new Error('Device rejected card data')
    const acked = readU32LE(reply, 6)
    if (acked > body.length) throw new Error('Device reported an invalid offset')
    if (acked <= offset) {
      if (++stalls > MAX_STALLS) throw new Error('Upload made no progress')
      continue
    }
    stalls = 0
    offset = acked
    onProgress?.(offset, body.length)
  }

  reply = await control(OP_COMMIT, tid)
  if (reply[1] !== STATUS_OK || reply.length < 14) {
    throw new Error(`Device failed to save the card: ${COMMIT_ERRORS[reply[1]] ?? 'unknown error'}`)
  }
  return readU32LE(reply, 10)
}

import { requireLink } from './link'
import { REPLY_TIMEOUT_MS } from './constants'

export class ReplyTimeout extends Error {
  constructor() {
    super('Device stopped responding')
  }
}

/** Chrome rejects overlapping GATT writes; that specific error is safe to retry. */
async function withGattRetry(write: () => Promise<void>): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await write()
    } catch (err) {
      const busy = err instanceof Error && /GATT operation already in progress/i.test(err.message)
      if (!busy || attempt >= 12) throw err
      await new Promise((r) => setTimeout(r, 4 * (attempt + 1)))
    }
  }
}

export function writeAcked(bytes: Uint8Array<ArrayBuffer>): Promise<void> {
  return withGattRetry(() => requireLink().rx.writeValueWithResponse(bytes))
}

export function writeNoResponse(bytes: Uint8Array<ArrayBuffer>): Promise<void> {
  return withGattRetry(() => requireLink().rx.writeValueWithoutResponse(bytes))
}

interface Handle<T> {
  resolve(value: T): void
  fail(err: Error): void
  /** Restart the stall timer (streamed replies). */
  rearm(): void
}

/**
 * Runs `send` while listening to TX notifications. Settles once `send` finished
 * AND a handler resolved (a reply can arrive before the send promise resumes);
 * fails on send error, disconnect, or `timeoutMs` without a rearm.
 */
export function collect<T>(
  send: () => Promise<void>,
  onNotify: (bytes: Uint8Array, handle: Handle<T>) => void,
  timeoutMs: number,
): Promise<T> {
  const { device, tx } = requireLink()
  return new Promise<T>((resolve, reject) => {
    let timer = 0
    let sent = false
    let result: { value: T } | null = null
    let settled = false

    const cleanup = () => {
      clearTimeout(timer)
      tx.removeEventListener('characteristicvaluechanged', onValue)
      device.removeEventListener('gattserverdisconnected', onDisconnect)
    }
    const fail = (err: Error) => {
      if (settled) return
      settled = true
      cleanup()
      reject(err)
    }
    const settleIfReady = () => {
      if (settled || !sent || !result) return
      settled = true
      cleanup()
      resolve(result.value)
    }
    const rearm = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => fail(new ReplyTimeout()), timeoutMs)
    }
    const handle: Handle<T> = {
      resolve(value) {
        result = { value }
        settleIfReady()
      },
      fail,
      rearm,
    }
    const onValue = () => {
      const view = tx.value!
      onNotify(new Uint8Array(view.buffer, view.byteOffset, view.byteLength).slice(), handle)
    }
    const onDisconnect = () => fail(new Error('Device disconnected'))

    tx.addEventListener('characteristicvaluechanged', onValue)
    device.addEventListener('gattserverdisconnected', onDisconnect)
    rearm()
    send().then(() => {
      sent = true
      settleIfReady()
    }, fail)
  })
}

/** Resolves with the first notification accepted by `isReply`. */
export function request(
  send: () => Promise<void>,
  isReply: (bytes: Uint8Array) => boolean,
  timeoutMs = REPLY_TIMEOUT_MS,
): Promise<Uint8Array> {
  return collect<Uint8Array>(
    send,
    (bytes, handle) => {
      if (isReply(bytes)) handle.resolve(bytes)
    },
    timeoutMs,
  )
}

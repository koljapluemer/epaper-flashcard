import { OP_WELCOME, WELCOME_TARGET } from './constants'
import { readStream } from './list'
import { putCard } from './put-card'

/** The welcome message text currently on the device ('' if none). */
export async function readWelcomeText(): Promise<string> {
  return new TextDecoder().decode(await readStream(OP_WELCOME))
}

/** Uploads an encoded welcome body (see the welcome entity). */
export async function putWelcome(body: Uint8Array): Promise<void> {
  await putCard({ id: WELCOME_TARGET, box: 0, practiced: false, body })
}

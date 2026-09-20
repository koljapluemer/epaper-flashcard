import { ref, watch } from 'vue'
import { useDevice } from '@/entities/device/use-device'
import { putWelcome, readWelcomeText } from '@/entities/device/welcome'
import { encodeWelcomeBody } from '@/entities/welcome/encode-body'

type Message = { kind: 'success' | 'error'; text: string }

export function useSettings() {
  const { isConnected } = useDevice()
  const welcomeMessage = ref('')
  const busy = ref(false)
  const message = ref<Message | null>(null)

  async function run(failure: string, task: () => Promise<string>) {
    busy.value = true
    message.value = null
    try {
      const text = await task()
      if (text) message.value = { kind: 'success', text }
    } catch (err) {
      message.value = { kind: 'error', text: `${failure}: ${err instanceof Error ? err.message : err}` }
    } finally {
      busy.value = false
    }
  }

  const load = () =>
    run('Load failed', async () => {
      welcomeMessage.value = await readWelcomeText()
      return ''
    })

  const save = () =>
    run('Save failed', async () => {
      welcomeMessage.value = welcomeMessage.value.trim()
      await putWelcome(await encodeWelcomeBody(welcomeMessage.value))
      return 'Saved. Shown next time the device powers off.'
    })

  watch(isConnected, (connected) => connected && load(), { immediate: true })
  return { isConnected, welcomeMessage, busy, message, save }
}

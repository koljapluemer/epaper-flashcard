import { computed, ref } from 'vue'
import { RX_UUID, SERVICE_UUID, TX_UUID } from './constants'
import { currentLink, setLink } from './link'
import { sendTime } from './stats'

type Status = 'disconnected' | 'connecting' | 'connected'

const status = ref<Status>('disconnected')
const error = ref('')
const isSupported = 'bluetooth' in navigator

function onDisconnected() {
  setLink(null)
  status.value = 'disconnected'
}

async function connect() {
  status.value = 'connecting'
  error.value = ''
  let device: BluetoothDevice | undefined
  try {
    device = await navigator.bluetooth.requestDevice({ filters: [{ services: [SERVICE_UUID] }] })
    device.addEventListener('gattserverdisconnected', onDisconnected, { once: true })
    const server = await device.gatt!.connect()
    const service = await server.getPrimaryService(SERVICE_UUID)
    const rx = await service.getCharacteristic(RX_UUID)
    const tx = await service.getCharacteristic(TX_UUID)
    await tx.startNotifications()
    setLink({ device, rx, tx })
    await sendTime()
    status.value = 'connected'
  } catch (err) {
    device?.removeEventListener('gattserverdisconnected', onDisconnected)
    if (device?.gatt?.connected) device.gatt.disconnect()
    status.value = 'disconnected'
    // Closing the device picker is not an error.
    const cancelled = err instanceof DOMException && err.name === 'NotFoundError'
    if (!cancelled) error.value = err instanceof Error ? err.message : String(err)
  }
}

function disconnect() {
  currentLink()?.device.gatt?.disconnect()
}

export function useDevice() {
  return {
    status,
    error,
    isConnected: computed(() => status.value === 'connected'),
    isSupported,
    connect,
    disconnect,
  }
}

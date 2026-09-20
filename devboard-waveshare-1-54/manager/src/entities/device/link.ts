export interface Link {
  device: BluetoothDevice
  rx: BluetoothRemoteGATTCharacteristic
  tx: BluetoothRemoteGATTCharacteristic
}

let current: Link | null = null

export function setLink(link: Link | null) {
  current = link
}

export function currentLink(): Link | null {
  return current
}

export function requireLink(): Link {
  if (!current) throw new Error('Not connected')
  return current
}

// Mirrors esp/config.h and esp/ble_sync.cpp.
export const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
export const RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e' // app -> device
export const TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e' // device -> app

export const OP_LIST = 0x10
export const OP_DELETE = 0x12
export const OP_DELETE_ALL = 0x13
export const OP_STATS = 0x14
export const OP_SET_TIME = 0x15
export const OP_BEGIN = 0x20
export const OP_DATA = 0x21
export const OP_STATUS = 0x22
export const OP_COMMIT = 0x23

/** BLE_CHUNK: one DATA frame is 9 header bytes + payload. */
export const FRAME_BYTES = 180
export const DATA_HEADER_BYTES = 9
export const DATA_PAYLOAD_BYTES = FRAME_BYTES - DATA_HEADER_BYTES
/** FAST_WINDOW: frames sent before the device sends a cumulative ack. */
export const WINDOW_FRAMES = 4

export const REPLY_TIMEOUT_MS = 8000
export const WINDOW_TIMEOUT_MS = 4000

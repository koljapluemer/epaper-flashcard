export type Placement = [x: number, y: number, rotation?: number]

/** Kept at or below 100 x 100mm, JLC's cheapest PCB size bracket. */
export const BOARD_WIDTH = 98
export const BOARD_HEIGHT = 56

/**
 * Front-side display outline: 84.70 x 54.41mm, landscape, vertically centered
 * and flush with the +x edge (the FPC wraps around that edge into J3). Seen
 * from the front this is the left edge; the case adds the left grip in plastic.
 */
export const DISPLAY = {
  width: 84.7,
  height: 54.41,
  centerX: BOARD_WIDTH / 2 - 84.7 / 2,
  centerY: 0,
}

/** Button strip on the -x side (the right side seen from the front). */
export const BUTTON_STRIP = {
  width: BOARD_WIDTH - DISPLAY.width,
  centerX: -BOARD_WIDTH / 2 + (BOARD_WIDTH - DISPLAY.width) / 2,
}

/** 2mm non-plated holes for flush plastic pins, one per corner, 2.5mm in from both edges. */
const HOLE_X = BOARD_WIDTH / 2 - 2.5
const HOLE_Y = BOARD_HEIGHT / 2 - 2.5
export const MOUNTING_HOLES = [
  [-HOLE_X, HOLE_Y],
  [HOLE_X, HOLE_Y],
  [-HOLE_X, -HOLE_Y],
  [HOLE_X, -HOLE_Y],
]

/**
 * Back-side area kept free for the 403450 LiPo (4 x 34 x 50mm plus its
 * protection board), between the MCU (left), the panel capacitors (right) and
 * the power/boost row (top).
 */
export const BATTERY_ZONE = { x: 13, y: -10, width: 51, height: 34 }

/** ESP32-C3-WROOM-02 rotated so its antenna runs off the bottom edge. */
const MCU = { x: -27, y: -BOARD_HEIGHT / 2 + 13.55 }

/**
 * PCB placement in mm, origin at the board center, seen from the top layer.
 * Top layer = back of the device (all SMD parts). Bottom layer = front: the
 * e-paper panel (not modeled) and the three through-hole buttons.
 */
export const placements: Record<string, Placement> = {
  // MCU, antenna at the bottom edge
  U1: [MCU.x, MCU.y, 180],
  C10: [-14, -24],
  C11: [-14, -21.5],
  R20: [-14, -19.5],
  C12: [-14, -17.5],
  R33: [-14, -15.5],

  // Front buttons, stacked in the strip (16mm pitch; rotated so the 6.5mm pin spacing runs vertically)
  SW1: [BUTTON_STRIP.centerX, 16, 90],
  SW2: [BUTTON_STRIP.centerX, 0, 90],
  SW3: [BUTTON_STRIP.centerX, -16, 90],

  // USB-C on the top edge, CC resistors and power path below it
  USB1: [-22, BOARD_HEIGHT / 2 - 3.72, 180],
  R6: [-26.8, 17.9, 180],
  R2: [-23.8, 17.9, 180],
  R1: [-20, 17.9],
  D1: [-15.5, 17.9],
  C6: [-15.5, 14.6],
  Q1: [-27, 12, 180],
  U3: [-21, 12],
  C4: [-24.6, 8.6],
  C3: [-21, 8.6],

  // Charge LED along the top edge
  LED1: [-12, 25.8],
  R4: [-12, 23.6],

  // Charger, battery ADC and battery connector
  U2: [-32, 2],
  C1: [-32, 5.4],
  C2: [-32, -1.4],
  R3: [-28.5, 3.7],
  R13: [-28.5, 1.7],
  R14: [-28.5, 0.5],
  C7: [-28.5, -0.7],
  J2: [-15.5, 1.5, 270],

  // Spare/debug pads along the top edge
  J5: [6, 24.5],

  // E-paper supply switch and boost, top-right
  Q4: [27, 13],
  R30: [27, 16],
  C41: [27, 17.8],
  L2: [34, 14, 90],
  C40: [34, 19.6],
  D30: [34, 22.2, 180],
  D31: [34, 24.4],
  D32: [27, 20.5],
  Q5: [41, 12.5],
  R32: [41, 15.6, 180],
  R34: [44.2, 15.6, 180],
  R31: [41, 17.4],

  // Panel FPC connector at the +x edge, capacitors in a column next to it
  J3: [BOARD_WIDTH / 2 - 3.68, DISPLAY.centerY, 90],
  C31: [40.4, 5.4],
  C32: [40.4, 3.8],
  C30: [40.4, 2.3],
  C33: [40.4, 0.8],
  C34: [40.4, -0.8],
  C35: [40.4, -2.4],
  C36: [40.4, -4],
  C37: [40.4, -5.6],
  C38: [40.4, -7.2],
  C39: [40.4, -8.8],
}

/** Placement lookup; throws on refs without a placement. */
export const at = (name: string) => {
  const placement = placements[name]
  if (!placement) throw new Error(`No PCB placement defined for ${name}`)
  const [pcbX, pcbY, pcbRotation = 0] = placement
  return { pcbX, pcbY, pcbRotation }
}

/** Antenna keep-out under the module's antenna, at the bottom edge. */
export const ANTENNA_KEEPOUT = { x: MCU.x, y: -BOARD_HEIGHT / 2 + 3.2, width: 21, height: 6.4 }

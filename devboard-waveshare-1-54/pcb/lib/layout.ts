type Placement = [x: number, y: number, rotation?: number]

export const BOARD_WIDTH = 85
export const BOARD_HEIGHT = 74

/** Front-side display outline: 84.70 x 54.41mm, landscape, flush with the top edge. */
export const DISPLAY = { width: 84.7, height: 54.41, centerY: BOARD_HEIGHT / 2 - 54.41 / 2 }

/**
 * PCB placement in mm, origin at the board center, seen from the top layer.
 * Top layer = back of the device (all electronics). Bottom layer = front:
 * the e-paper panel (not modeled) and the three buttons. The panel's FPC
 * wraps around the right edge (as seen from the back) into J3.
 */
const placements: Record<string, Placement> = {
  // Edge parts
  U1: [-32.7, -20.15, 180], // antenna in the bottom-left corner, below the display
  J3: [38.82, DISPLAY.centerY, 90],
  USB1: [-25, 31.46, 180],
  J4: [8, 27.2, 180],
  J2: [-38.2, 5, 90],
  SW4: [-38.45, 20, 270],

  // Front: buttons and solder pads centered under the display (16mm pitch; rotated so the 12.5mm pin spacing runs vertically)
  SW1: [-16, -25.3, 90],
  SW2: [0, -25.3, 90],
  SW3: [16, -25.3, 90],
  J5: [0, -34.9],
  R21: [-26, -6],

  // MCU support, between SW1's pins (clear of its peg holes)
  C11: [-16, -27.5],
  C10: [-16, -25.3],
  R20: [-16, -22.9, 180],
  C12: [-16, -21.5],

  // USB CC resistors, VBUS diode, power path
  R2: [-26.8, 26.9, 180],
  R1: [-23, 26.9],
  D1: [-18.5, 26.9],
  R6: [-29.8, 26.9],
  Q1: [-30, 21],

  // 3.3V buck
  U3: [-24, 21],
  L1: [-18.5, 21],
  R10: [-24, 24.3],
  C4: [-27.6, 17.6],
  C3: [-24, 17.6],
  C6: [-18.5, 17.6],
  C5: [-24, 15.6],
  R11: [-21.5, 15.6],
  R12: [-19, 15.6],

  // Charger + battery ADC
  U2: [-26.5, 8],
  C1: [-26.5, 11.4],
  C2: [-26.5, 4.6],
  R3: [-22.5, 8],
  R13: [-22.5, 5],
  R14: [-22.5, 3.8],
  C7: [-22.5, 2.6],

  // LEDs along the top edge
  LED1: [-15, 34.8],
  R4: [-15, 32.8],
  LED2: [-10, 34.8],
  R22: [-10, 32.8],

  // RTC + I2C pull-ups
  U4: [2, 12],
  Y1: [6.5, 12],
  C50: [10, 13.2],
  R40: [10, 12],
  R41: [10, 10.8],
  R42: [10, 9.6],
  D40: [2.5, 8],
  D41: [2.5, 5.8],

  // microSD support
  C60: [2.4, 18.6, 180],
  R50: [4.5, 18.6],
  R51: [6.6, 18.6],
  R52: [8.7, 18.6, 180],
  R53: [10.8, 18.6],
  R54: [12.9, 18.6],

  // E-paper supply switch and boost
  Q4: [21, 12],
  R30: [21, 9.4],
  C41: [21, 7.6],
  L2: [27.5, 12],
  C40: [27.5, 8],
  D30: [27.5, 5.6, 180],
  D31: [27.5, 3.4],
  D32: [27.5, 1.2],
  Q5: [33.9, 19.5],
  R32: [29.5, 19.5],
  R31: [29.5, 17.6],

  // Panel capacitors in a column next to J3
  C31: [33.9, 15.2],
  C32: [33.9, 13.6],
  C30: [34.4, 12.1],
  C33: [33.9, 10.6],
  C34: [33.9, 9],
  C35: [33.9, 7.4],
  C36: [33.9, 5.8],
  C37: [33.9, 4.2],
  C38: [33.9, 2.6],
  C39: [33.9, 1],
}

export const at = (name: string) => {
  const placement = placements[name]
  if (!placement) throw new Error(`No PCB placement defined for ${name}`)
  const [pcbX, pcbY, pcbRotation = 0] = placement
  return { pcbX, pcbY, pcbRotation }
}

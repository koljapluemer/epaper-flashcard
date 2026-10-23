type Placement = [x: number, y: number, rotation?: number]

export const BOARD_WIDTH = 42
export const BOARD_HEIGHT = 54

/**
 * PCB placement in mm. Origin is the board center, +y is the antenna edge.
 * All parts sit on the top side; the e-paper panel mounts on the bottom side
 * and its FPC wraps around the bottom edge into J3.
 */
const placements: Record<string, Placement> = {
  // Large parts / edge connectors
  U1: [-9.15, 10.15],
  J4: [11.25, 7, 90],
  USB1: [-15.85, -21.49],
  J3: [0, -22.9],
  J2: [16.15, -21.25],
  J5: [-17.94, -9, 90],
  SW1: [6, 24.3],
  SW2: [14.6, 24.3],

  // MCU support: decoupling/EN in the strip left of the module
  C11: [-19.95, 18.9, 90],
  C10: [-19.95, 15.9, 90],
  R20: [-19.95, 13, 90],
  C12: [-19.95, 11, 90],
  R21: [2.75, 3.3, 90],
  C60: [2.75, 6, 90],

  // RTC + I2C pull-ups, top right
  U4: [5, 18.7],
  Y1: [9.2, 18.7],
  R41: [12.9, 21],
  C50: [12.9, 19.8, 180],
  R40: [12.9, 17.6],
  R42: [12.9, 16.4],
  D40: [17.2, 19.9],
  D41: [17.2, 17.4],

  // USB CC resistors and VBUS pull-down between header and USB-C
  R1: [-18.6, -17.84, 180],
  R2: [-16.4, -17.84],
  R6: [-14.2, -17.84],

  // 3.3V buck
  U3: [-12.6, -2.9],
  L1: [-7.9, -2.9],
  C6: [-4.3, -2.9, 90],
  C4: [-13.6, -5.6],
  R10: [-11.6, -5.6],
  R11: [-9.6, -5.6],
  R12: [-7.6, -5.6],
  C5: [-5.6, -5.6, 180],
  C3: [-12.9, -7.3],

  // Soft power latch + battery/USB power path
  D2: [-8.6, -7.5],
  R9: [-5, -7.5],
  Q3: [-12.8, -10.1],
  R7: [-8.9, -9.4],
  R8: [-6.9, -9.4],
  R5: [-4.9, -9.4],
  D3: [-8.1, -11],
  Q1: [-12.8, -13.8],
  Q2: [-8.5, -13.8],
  D1: [-5.2, -13.8, 270],

  // Battery ADC divider
  R13: [-1.8, -2.6],
  R14: [0.2, -2.6],
  C7: [2.2, -2.6],

  // microSD pull-ups
  R50: [6, -2.6],
  R51: [8, -2.6],
  R52: [10, -2.6],
  R53: [12, -2.6],
  R54: [14, -2.6],

  // LEDs, right edge
  LED1: [17, -2.6],
  R4: [19.6, -2.6, 90],
  LED2: [17, -4.4],
  R22: [19.6, -4.6, 90],

  // Charger next to the battery connector
  U2: [17.8, -7.3],
  C2: [17.8, -10],
  C1: [17.8, -12],
  R3: [17.8, -13.7],

  // E-paper supply switch and boost
  L2: [7.8, -6.6, 180],
  C41: [12.6, -5],
  Q4: [12.8, -8],
  R30: [12.8, -10.5],
  C40: [7.8, -10.2],
  D30: [7.8, -12.4],
  D31: [7.8, -14.5],
  D32: [12.6, -13],
  Q5: [-2, -16.9],
  R32: [-2, -14.3],
  R31: [-2, -12.5],

  // Panel capacitors in a row above the FPC connector
  C31: [-7.8, -20.2, 90],
  C32: [-6.2, -20.2, 90],
  C30: [-4.8, -20.2, 90],
  C33: [0, -20.2, 90],
  C34: [1.6, -20.2, 90],
  C35: [3.2, -20.2, 90],
  C36: [4.8, -20.2, 90],
  C37: [6.4, -20.2, 90],
  C38: [8, -20.2, 90],
  C39: [9.6, -20.2, 90],
}

export const at = (name: string) => {
  const placement = placements[name]
  if (!placement) throw new Error(`No PCB placement defined for ${name}`)
  const [pcbX, pcbY, pcbRotation = 0] = placement
  return { pcbX, pcbY, pcbRotation }
}

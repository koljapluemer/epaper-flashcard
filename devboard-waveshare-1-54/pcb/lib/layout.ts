export type Placement = [x: number, y: number, rotation?: number]

export const BOARD_WIDTH = 85
export const BOARD_HEIGHT = 74

/** Front-side display outline: 84.70 x 54.41mm, landscape, flush with the top edge. */
export const DISPLAY = { width: 84.7, height: 54.41, centerY: BOARD_HEIGHT / 2 - 54.41 / 2 }

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
 * Back-side area kept free for the battery: a 403450 LiPo (4 x 34 x 50mm,
 * plus protection board and leads) or a 1xAAA holder with leads (~52 x 14 x
 * 13mm). Between the power section (left), the J3 cap column (right), the
 * button pins (below) and the USB/power strip (above).
 */
export const BATTERY_ZONE = { x: 5.4, y: 0.5, width: 53.8, height: 36 }

/**
 * PCB placement in mm, origin at the board center, seen from the top layer.
 * Top layer = back of the device (all electronics). Bottom layer = front:
 * the e-paper panel (not modeled) and the three buttons. The panel's FPC
 * wraps around the right edge (as seen from the back) into J3.
 */
export const sharedPlacements: Record<string, Placement> = {
  // Edge parts
  U1: [-32.7, -16.15, 180], // antenna along the bottom edge, raised to clear the bottom-left mounting hole
  J3: [38.82, DISPLAY.centerY, 90],
  USB1: [-25, 33.28, 180], // front shell legs 0.3mm from the top edge, mouth ~1.5mm past it
  J2: [-24, -1.5, 90],

  // Front: buttons and solder pads centered under the display (16mm pitch; rotated so the 12.5mm pin spacing runs vertically)
  SW1: [-16, -25.3, 90],
  SW2: [0, -25.3, 90],
  SW3: [16, -25.3, 90],
  J5: [0, -34.9],
  R21: [-26, -5.2],

  // MCU support, between SW1's pins (clear of its peg holes)
  C11: [-16, -27.5],
  C10: [-16, -25.3],
  R20: [-16, -22.9, 180],
  C12: [-16, -21.5],

  // USB CC resistors (both variants)
  R2: [-26.8, 26.9, 180],
  R1: [-23, 26.9],

  // E-paper supply switch and boost, top-right corner
  Q4: [20.5, 22],
  R30: [20.5, 25],
  C41: [20.5, 26.8],
  L2: [27.5, 22, 180],
  C40: [27.5, 26.2],
  D30: [27.5, 28.6, 180],
  D31: [27.5, 30.8],
  D32: [27.5, 33],
  Q5: [34.5, 21.5],
  R32: [34.5, 24.6, 180],
  R31: [34.5, 26.4],

  // Panel capacitors in a column next to J3
  C31: [33.9, 15.2],
  C32: [33.9, 13.6],
  C30: [33.9, 12.1],
  C33: [33.9, 10.6],
  C34: [33.9, 9],
  C35: [33.9, 7.4],
  C36: [33.9, 5.8],
  C37: [33.9, 4.2],
  C38: [33.9, 2.6],
  C39: [33.9, 1],
}

/** Placement lookup for a table of refs; throws on refs without a placement. */
export const placer = (table: Record<string, Placement>) => (name: string) => {
  const placement = table[name]
  if (!placement) throw new Error(`No PCB placement defined for ${name}`)
  const [pcbX, pcbY, pcbRotation = 0] = placement
  return { pcbX, pcbY, pcbRotation }
}

/** Placements of the parts both variants share; each power block extends this table. */
export const at = placer(sharedPlacements)

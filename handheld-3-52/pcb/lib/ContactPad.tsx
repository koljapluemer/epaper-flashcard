import type { ChipProps } from "@tscircuit/props"

/** Square contact area, wide enough for a 10mm key's conductive ring (~7.6mm) or any pill >= 2mm. */
export const CONTACT_SIZE = 9
const FINGER_WIDTH = 0.45
const FINGER_PITCH = 0.8
const SPINE_WIDTH = 0.6
/** Gap between a finger's end and the opposite spine. */
const END_GAP = 0.4

const half = CONTACT_SIZE / 2
const fingerCount = Math.floor((CONTACT_SIZE - FINGER_WIDTH) / FINGER_PITCH) + 1
const firstY = -((fingerCount - 1) * FINGER_PITCH) / 2

type Pad = { x: number; y: number; width: number; height: number; port: "pin1" | "pin2" }

/** Two interleaved combs: pin1 spine on the left, pin2 spine on the right, fingers alternating. */
const pads: Pad[] = [
  { x: -half + SPINE_WIDTH / 2, y: 0, width: SPINE_WIDTH, height: CONTACT_SIZE, port: "pin1" },
  { x: half - SPINE_WIDTH / 2, y: 0, width: SPINE_WIDTH, height: CONTACT_SIZE, port: "pin2" },
  ...Array.from({ length: fingerCount }, (_, i): Pad => {
    const length = CONTACT_SIZE - SPINE_WIDTH - END_GAP
    const fromLeft = i % 2 === 0
    return {
      x: fromLeft ? -half + length / 2 : half - length / 2,
      y: firstY + i * FINGER_PITCH,
      width: length,
      height: FINGER_WIDTH,
      port: fromLeft ? "pin1" : "pin2",
    }
  }),
]

const pinLabels = { pin1: ["A"], pin2: ["B"] } as const

/**
 * Bare-copper key contact for a rubber key with a carbon pill or conductive
 * ring: pressing bridges the two combs. Not an assembled part (doNotPlace), so
 * it never appears in the BOM or pick-and-place; no solder paste.
 */
export const ContactPad = (props: ChipProps<typeof pinLabels>) => (
  <chip
    pinLabels={pinLabels}
    doNotPlace
    footprint={
      <footprint>
        {pads.map((p, i) => (
          <smtpad
            key={i}
            shape="rect"
            pcbX={p.x}
            pcbY={p.y}
            width={p.width}
            height={p.height}
            portHints={[p.port]}
            noSolderPaste
            solderMaskMargin={0.05}
          />
        ))}
        <silkscreencircle pcbX={0} pcbY={0} radius={CONTACT_SIZE / 2 + 1.2} />
        <courtyardoutline
          outline={[
            { x: -half - 0.5, y: -half - 0.5 },
            { x: half + 0.5, y: -half - 0.5 },
            { x: half + 0.5, y: half + 0.5 },
            { x: -half - 0.5, y: half + 0.5 },
          ]}
        />
      </footprint>
    }
    {...props}
  />
)

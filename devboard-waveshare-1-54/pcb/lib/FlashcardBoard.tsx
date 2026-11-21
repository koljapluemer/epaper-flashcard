import type { ReactNode } from "react"
import { Epaper } from "./Epaper"
import { FrontPanel } from "./FrontPanel"
import { BATTERY_ZONE, BOARD_HEIGHT, BOARD_WIDTH, DISPLAY, MOUNTING_HOLES } from "./layout"
import { Mcu } from "./Mcu"

/**
 * Everything the variants share: 2-layer board outline, ESP32-S3 module
 * (radio unused, cards are loaded over USB), 3.52" landscape e-paper on the
 * front, three buttons and spare-signal solder pads below it, and the battery
 * area on the back. Each variant passes in its power block.
 */
export const FlashcardBoard = ({
  power,
  powerNets,
  supplyNet,
  batteryLabel,
}: {
  /** Power block: USB-C, battery and the regulator feeding V3_3 */
  power: ReactNode
  /** Nets that get wide traces */
  powerNets: string[]
  /** Unregulated supply brought out on the spare-signal pads */
  supplyNet: "VSYS" | "VBAT"
  /** Silkscreen text inside the battery area, for batteries not mounted on the board */
  batteryLabel?: string
}) => (
  <board width={BOARD_WIDTH} height={BOARD_HEIGHT} layers={2} routeRemaining pcbStyle={{ viaHoleDiameter: "0.3mm", viaPadDiameter: "0.6mm" }}>
    <Mcu />
    {power}
    <Epaper />
    <FrontPanel supplyNet={supplyNet} />

    {/* Wider copper for the supply rails (0.3mm is good for ~1A) */}
    {powerNets.map((name) => (
      <net key={name} name={name} isPowerNet nominalTraceWidth="0.3mm" />
    ))}
    <net name="GND" isGroundNet />

    {MOUNTING_HOLES.map(([x, y]) => (
      <hole key={`${x},${y}`} diameter="2mm" pcbX={x} pcbY={y} />
    ))}

    {/* E-paper panel outline on the front (bottom layer) */}
    <fabricationnoterect
      layer="bottom"
      pcbX={0}
      pcbY={DISPLAY.centerY}
      width={DISPLAY.width}
      height={DISPLAY.height}
      strokeWidth={0.2}
      isStrokeDashed
    />

    {/* Battery area on the back: kept free for the battery or its holder */}
    <silkscreenrect
      pcbX={BATTERY_ZONE.x}
      pcbY={BATTERY_ZONE.y}
      width={BATTERY_ZONE.width}
      height={BATTERY_ZONE.height}
      strokeWidth={0.2}
    />
    {batteryLabel && <silkscreentext text={batteryLabel} pcbX={BATTERY_ZONE.x} pcbY={BATTERY_ZONE.y} fontSize="1.5mm" />}

    {/* Both layers are flooded with GND */}
    <copperpour connectsTo="net.GND" layer="top" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="bottom" clearance="0.2mm" />

    {/* Radio is unused; the antenna keep-out only keeps the option open */}
    <keepout
      shape="rect"
      pcbX={-32.5}
      pcbY={-31.4}
      width="20mm"
      height="11.2mm"
      layers={["top", "bottom"]}
      excludeRefs={[".U1"]}
    />
  </board>
)

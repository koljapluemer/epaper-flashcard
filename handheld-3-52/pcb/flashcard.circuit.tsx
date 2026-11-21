import { Epaper } from "./lib/Epaper"
import { FrontPanel } from "./lib/FrontPanel"
import { ANTENNA_KEEPOUT, BATTERY_ZONE, BOARD_HEIGHT, BOARD_WIDTH, DISPLAY, MOUNTING_HOLES } from "./lib/layout"
import { LipoPower } from "./lib/LipoPower"
import { Mcu } from "./lib/Mcu"

const POWER_NETS = ["VBUS", "VSYS", "VBAT", "V3_3"]

/**
 * Landscape handheld: 3.52" 360x240 e-paper on the front with three buttons
 * stacked to its right, everything else on the back (single-sided SMT for JLC
 * Economic PCBA; the buttons are through-hole). ESP32-C3 module, USB-C LiPo
 * charging, 403450 cell.
 */
export default () => (
  <board width={BOARD_WIDTH} height={BOARD_HEIGHT} layers={2} routeRemaining pcbStyle={{ viaHoleDiameter: "0.3mm", viaPadDiameter: "0.6mm" }}>
    <Mcu />
    <LipoPower />
    <Epaper />
    <FrontPanel />

    {/* Wider copper for the supply rails (0.3mm is good for ~1A) */}
    {POWER_NETS.map((name) => (
      <net key={name} name={name} isPowerNet nominalTraceWidth="0.3mm" />
    ))}
    <net name="GND" isGroundNet />

    {MOUNTING_HOLES.map(([x, y]) => (
      <hole key={`${x},${y}`} diameter="2mm" pcbX={x} pcbY={y} />
    ))}

    {/* E-paper panel outline on the front (bottom layer) */}
    <fabricationnoterect
      layer="bottom"
      pcbX={DISPLAY.centerX}
      pcbY={DISPLAY.centerY}
      width={DISPLAY.width}
      height={DISPLAY.height}
      strokeWidth={0.2}
      isStrokeDashed
    />

    {/* Battery area on the back */}
    <silkscreenrect
      pcbX={BATTERY_ZONE.x}
      pcbY={BATTERY_ZONE.y}
      width={BATTERY_ZONE.width}
      height={BATTERY_ZONE.height}
      strokeWidth={0.2}
    />
    <silkscreentext text="LiPo 403450 (JST-PH to J2)" pcbX={BATTERY_ZONE.x} pcbY={BATTERY_ZONE.y} fontSize="1.5mm" />

    {/* Both layers are flooded with GND */}
    <copperpour connectsTo="net.GND" layer="top" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="bottom" clearance="0.2mm" />

    {/* No copper under the antenna */}
    <keepout
      shape="rect"
      pcbX={ANTENNA_KEEPOUT.x}
      pcbY={ANTENNA_KEEPOUT.y}
      width={`${ANTENNA_KEEPOUT.width}mm`}
      height={`${ANTENNA_KEEPOUT.height}mm`}
      layers={["top", "bottom"]}
      excludeRefs={[".U1"]}
    />
  </board>
)

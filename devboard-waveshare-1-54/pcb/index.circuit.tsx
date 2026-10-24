import { Epaper } from "./lib/Epaper"
import { FrontPanel } from "./lib/FrontPanel"
import { BATTERY_ZONE, BOARD_HEIGHT, BOARD_WIDTH, DISPLAY } from "./lib/layout"
import { Mcu } from "./lib/Mcu"
import { Fram, Rtc } from "./lib/Peripherals"
import { Power } from "./lib/Power"

const POWER_NETS = ["VBUS", "VSYS", "VBAT", "BAT_SW", "V3_3", "BUCK_SW"]

/**
 * ESP32-S3 dev board with a 3.52" landscape e-paper on the front, three
 * buttons and spare-signal solder pads below it. Derived from the Waveshare
 * ESP32-S3-ePaper-1.54 (audio and SHTC3 removed, WROOM module instead of the
 * PICO SiP).
 */
export default () => (
  <board width={BOARD_WIDTH} height={BOARD_HEIGHT} layers={4} routeRemaining>
    <Mcu />
    <Power />
    <Epaper />
    <Rtc />
    <Fram />
    <FrontPanel />

    {/* Wider copper for the supply rails (~0.5A peak with Wi-Fi; 0.3mm is good for ~1A) */}
    {POWER_NETS.map((name) => (
      <net key={name} name={name} isPowerNet nominalTraceWidth="0.3mm" />
    ))}
    <net name="GND" isGroundNet />

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

    {/* Battery area on the back: no components, cell fixed with foam tape */}
    <silkscreenrect
      pcbX={BATTERY_ZONE.x}
      pcbY={BATTERY_ZONE.y}
      width={BATTERY_ZONE.width}
      height={BATTERY_ZONE.height}
      strokeWidth={0.2}
    />
    <silkscreentext
      text="LiPo 403450 (leads to BAT pads)"
      pcbX={BATTERY_ZONE.x}
      pcbY={BATTERY_ZONE.y}
      fontSize="1.5mm"
    />

    {/* inner1 is a solid ground plane; outer layers are flooded with GND */}
    <copperpour connectsTo="net.GND" layer="inner1" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="top" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="bottom" clearance="0.2mm" />

    {/* No copper under or beside the module's PCB antenna */}
    <keepout
      shape="rect"
      pcbX={-32.5}
      pcbY={-33.4}
      width="20mm"
      height="7.2mm"
      layers={["top", "inner1", "inner2", "bottom"]}
      excludeRefs={[".U1"]}
    />
  </board>
)

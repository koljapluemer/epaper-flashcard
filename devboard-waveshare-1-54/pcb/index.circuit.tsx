import { Epaper } from "./lib/Epaper"
import { BOARD_HEIGHT, BOARD_WIDTH } from "./lib/layout"
import { Mcu } from "./lib/Mcu"
import { ExpansionHeader, Rtc, SdCard } from "./lib/Peripherals"
import { Power } from "./lib/Power"

/**
 * ESP32-S3 1.54" e-paper dev board, derived from the Waveshare
 * ESP32-S3-ePaper-1.54 (audio and SHTC3 removed, WROOM module instead of
 * the PICO SiP).
 */
export default () => (
  <board width={BOARD_WIDTH} height={BOARD_HEIGHT} layers={4} routeRemaining>
    <Mcu />
    <Power />
    <Epaper />
    <Rtc />
    <SdCard />
    <ExpansionHeader />

    {/* inner1 is a solid ground plane; outer layers are flooded with GND */}
    <copperpour connectsTo="net.GND" layer="inner1" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="top" clearance="0.2mm" />
    <copperpour connectsTo="net.GND" layer="bottom" clearance="0.2mm" />

    {/* No copper under or beside the module's PCB antenna */}
    <keepout
      shape="rect"
      pcbX={-9.5}
      pcbY={23.65}
      width="23mm"
      height="6.7mm"
      layers={["top", "inner1", "inner2", "bottom"]}
      excludeRefs={[".U1"]}
    />
  </board>
)

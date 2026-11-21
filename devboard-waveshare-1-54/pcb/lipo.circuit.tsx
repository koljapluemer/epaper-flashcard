import { FlashcardBoard } from "./lib/FlashcardBoard"
import { LipoPower } from "./lib/LipoPower"

/**
 * LiPo variant: 403450 cell charged over USB-C (TP4054) and a 3.3V LDO.
 * Derived from the Waveshare ESP32-S3-ePaper-1.54.
 */
export default () => (
  <FlashcardBoard
    power={<LipoPower />}
    powerNets={["VBUS", "VSYS", "VBAT", "V3_3"]}
    supplyNet="VSYS"
    batteryLabel="LiPo 403450 (leads to BAT pads)"
  />
)

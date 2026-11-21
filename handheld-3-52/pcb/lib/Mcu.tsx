import { ESP32_C3_WROOM_02_N4 } from "../imports/ESP32_C3_WROOM_02_N4"
import { at } from "./layout"

/**
 * ESP32-C3-WROOM-02-N4 with reset RC. Buttons sit on GPIO3-5, which can wake
 * the chip from deep sleep (only GPIO0-5 can). Strapping: IO2 is held high by
 * R30 (EPD_PWR_EN, off), IO8 by R33 (EPD_CS, idle high), IO9 has an internal
 * pull-up and a BOOT pad; USB enters download mode without it.
 */
export const Mcu = () => (
  <group name="MCU" pcbX={0} pcbY={0}>
    <schematicsheet name="MCU" displayName="MCU" sheetIndex={1}>
      <ESP32_C3_WROOM_02_N4
        name="U1" {...at("U1")}
        connections={{
          GND: "net.GND",
          EP: "net.GND",
          "3V3": "net.V3_3",
          EN: "net.EN",
          IO0: "net.BAT_ADC",
          IO1: "net.EPD_BUSY",
          IO2: "net.EPD_PWR_EN",
          IO3: "net.BTN1",
          IO4: "net.BTN2",
          IO5: "net.BTN3",
          IO6: "net.EPD_SCLK",
          IO7: "net.EPD_SDI",
          IO8: "net.EPD_CS",
          IO9: "net.BOOT",
          IO10: "net.EPD_DC",
          IO18: "net.USB_DN",
          IO19: "net.USB_DP",
          RXD: "net.EPD_RST",
          TXD: "net.UART_TX",
        }}
      />
      <capacitor name="C10" {...at("C10")} capacitance="10uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
      <capacitor name="C11" {...at("C11")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />

      {/* EN power-on delay per Espressif guidelines */}
      <resistor name="R20" {...at("R20")} resistance="10k" footprint="0402" connections={{ pin1: "net.EN", pin2: "net.V3_3" }} />
      <capacitor name="C12" {...at("C12")} capacitance="1uF" maxVoltageRating="50V" footprint="0603" connections={{ pin1: "net.EN", pin2: "net.GND" }} />

      {/* IO8 must not be low at reset */}
      <resistor name="R33" {...at("R33")} resistance="10k" footprint="0402" connections={{ pin1: "net.EPD_CS", pin2: "net.V3_3" }} />
    </schematicsheet>
  </group>
)

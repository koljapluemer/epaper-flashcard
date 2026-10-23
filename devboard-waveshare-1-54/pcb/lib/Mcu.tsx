import { ESP32_S3_WROOM_1_N16R8 } from "../imports/ESP32_S3_WROOM_1_N16R8"
import { TS_1187A_B_A_B } from "../imports/TS_1187A_B_A_B"
import { at } from "./layout"

/** ESP32-S3 module with reset RC, BOOT button and status LED. */
export const Mcu = () => (
  <group name="MCU" pcbX={0} pcbY={0}>
    <schematicsheet name="MCU" displayName="MCU" sheetIndex={1}>
      <ESP32_S3_WROOM_1_N16R8
        name="U1" {...at("U1")}
        connections={{
          GND1: "net.GND",
          GND2: "net.GND",
          GND3: "net.GND",
          "3V3": "net.V3_3",
          EN: "net.EN",
          IO0: "net.BOOT",
          IO1: "net.GP1",
          IO2: "net.GP2",
          IO3: "net.LED_G",
          IO4: "net.BAT_ADC",
          IO5: "net.RTC_INT",
          IO6: "net.EPD_PWR_EN",
          IO8: "net.EPD_BUSY",
          IO9: "net.EPD_RST",
          IO10: "net.EPD_DC",
          IO11: "net.EPD_CS",
          IO12: "net.EPD_SCLK",
          IO13: "net.EPD_SDI",
          IO17: "net.BAT_CTRL",
          IO18: "net.BAT_KEY",
          IO19: "net.USB_DN",
          IO20: "net.USB_DP",
          IO39: "net.SD_CLK",
          IO40: "net.SD_D0",
          IO41: "net.SD_CMD",
          IO47: "net.I2C_SDA",
          IO48: "net.I2C_SCL",
          TXD0: "net.UART_TX",
          RXD0: "net.UART_RX",
        }}
      />
      <capacitor name="C10" {...at("C10")} capacitance="10uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
      <capacitor name="C11" {...at("C11")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />

      {/* EN power-on delay per Espressif guidelines */}
      <resistor name="R20" {...at("R20")} resistance="10k" footprint="0402" connections={{ pin1: "net.EN", pin2: "net.V3_3" }} />
      <capacitor name="C12" {...at("C12")} capacitance="1uF" footprint="0402" connections={{ pin1: "net.EN", pin2: "net.GND" }} />

      <resistor name="R21" {...at("R21")} resistance="10k" footprint="0402" connections={{ pin1: "net.BOOT", pin2: "net.V3_3" }} />
      <TS_1187A_B_A_B name="SW2" {...at("SW2")} connections={{ A: "net.BOOT", C: "net.GND" }} />

      {/* Active-low green status LED on GPIO3 */}
      <resistor name="R22" {...at("R22")} resistance="1k" footprint="0402" connections={{ pin1: "net.V3_3" }} />
      <led name="LED2" {...at("LED2")} schRotation={180} color="green" footprint="0603" connections={{ anode: "R22.pin2", cathode: "net.LED_G" }} />
    </schematicsheet>
  </group>
)

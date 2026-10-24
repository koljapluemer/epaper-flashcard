import { A_1N5819WS } from "../imports/A_1N5819WS"
import { FM24V02A_GTR } from "../imports/FM24V02A_GTR"
import { PCF85063ATL_1_118 } from "../imports/PCF85063ATL_1_118"
import { Q13FC13500004 } from "../imports/Q13FC13500004"
import { at } from "./layout"

/** PCF85063 RTC, kept alive from VBAT when 3V3 is off. */
export const Rtc = () => (
  <group name="RTC" pcbX={0} pcbY={0}>
    <schematicsheet name="RTC" displayName="RTC" sheetIndex={3}>
      <PCF85063ATL_1_118
        name="U4" {...at("U4")} schWidth={1.5}
        connections={{
          VDD: "net.RTC_VDD",
          VSS: "net.GND",
          EP: "net.GND",
          CLKOE: "net.GND",
          SDA: "net.I2C_SDA",
          SCL: "net.I2C_SCL",
          N_INT: "net.RTC_INT",
        }}
      />
      {/* 12.5pF crystal: matches the PCF85063's internal load caps, no external caps needed */}
      <Q13FC13500004 name="Y1" {...at("Y1")} connections={{ pin1: "U4.OSCI", pin2: "U4.OSCO" }} />
      <A_1N5819WS name="D40" {...at("D40")} connections={{ anode: "net.V3_3", cathode: "net.RTC_VDD" }} />
      <A_1N5819WS name="D41" {...at("D41")} connections={{ anode: "net.VBAT", cathode: "net.RTC_VDD" }} />
      <capacitor name="C50" {...at("C50")} capacitance="1uF" footprint="0402" connections={{ pin1: "net.RTC_VDD", pin2: "net.GND" }} />

      <resistor name="R40" {...at("R40")} resistance="10k" footprint="0402" connections={{ pin1: "net.RTC_INT", pin2: "net.V3_3" }} />
      <resistor name="R41" {...at("R41")} resistance="4.7k" footprint="0402" connections={{ pin1: "net.I2C_SDA", pin2: "net.V3_3" }} />
      <resistor name="R42" {...at("R42")} resistance="4.7k" footprint="0402" connections={{ pin1: "net.I2C_SCL", pin2: "net.V3_3" }} />
    </schematicsheet>
  </group>
)

/**
 * Optional 32KB I2C FRAM, not populated: user data lives in the module's
 * internal flash (see docs/storage.md). Shares the RTC's I2C bus at 0x50
 * (A0-A2 low); any SOIC-8 I2C FRAM/EEPROM with the 24xx pinout fits.
 */
export const Fram = () => (
  <group name="FRAM" pcbX={0} pcbY={0}>
    <schematicsheet name="FRAM" displayName="FRAM (DNP)" sheetIndex={4}>
      <FM24V02A_GTR
        name="U5" {...at("U5")}
        doNotPlace
        connections={{
          VDD: "net.V3_3",
          VSS: "net.GND",
          A0: "net.GND",
          A1: "net.GND",
          A2: "net.GND",
          WP: "net.GND",
          SDA: "net.I2C_SDA",
          SCL: "net.I2C_SCL",
        }}
      />
      <capacitor name="C51" {...at("C51")} capacitance="100nF" footprint="0402" doNotPlace connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
    </schematicsheet>
  </group>
)

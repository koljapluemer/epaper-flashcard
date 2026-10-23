import { A_1N5819WS } from "../imports/A_1N5819WS"
import { PCF85063ATL_1_118 } from "../imports/PCF85063ATL_1_118"
import { Q13FC13500004 } from "../imports/Q13FC13500004"
import { TF_01A } from "../imports/TF_01A"
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

/** microSD in 1-bit SD mode (CLK/CMD/D0), D1-D3 pulled high. */
export const SdCard = () => (
  <group name="SD" pcbX={0} pcbY={0}>
    <schematicsheet name="SD" displayName="microSD" sheetIndex={4}>
      <TF_01A
        name="J4" {...at("J4")}
        connections={{
          VDD: "net.V3_3",
          VSS: "net.GND",
          GND1: "net.GND",
          GND2: "net.GND",
          GND3: "net.GND",
          GND4: "net.GND",
          CLK_SCLK: "net.SD_CLK",
          CMD_DI: "net.SD_CMD",
          DAT0_D0: "net.SD_D0",
        }}
      />
      <capacitor name="C60" {...at("C60")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
      <resistor name="R50" {...at("R50")} resistance="10k" footprint="0402" connections={{ pin1: "net.SD_CMD", pin2: "net.V3_3" }} />
      <resistor name="R51" {...at("R51")} resistance="10k" footprint="0402" connections={{ pin1: "net.SD_D0", pin2: "net.V3_3" }} />
      <resistor name="R52" {...at("R52")} resistance="10k" footprint="0402" connections={{ pin1: "J4.DAT1_RSV", pin2: "net.V3_3" }} />
      <resistor name="R53" {...at("R53")} resistance="10k" footprint="0402" connections={{ pin1: "J4.DAT2_RSV", pin2: "net.V3_3" }} />
      <resistor name="R54" {...at("R54")} resistance="10k" footprint="0402" connections={{ pin1: "J4.CDDAT3_CS", pin2: "net.V3_3" }} />
    </schematicsheet>
  </group>
)

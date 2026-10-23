import { A_1N5819WS } from "../imports/A_1N5819WS"
import { AO3401A } from "../imports/AO3401A"
import { BSS138 } from "../imports/BSS138"
import { FPC_05FB_24PH20 } from "../imports/FPC_05FB_24PH20"
import { SWPA4020S680MT } from "../imports/SWPA4020S680MT"
import { at } from "./layout"

/** Storage capacitors on the panel's internal supply pins (1uF / 50V each). */
const panelCapPins = ["pin4", "pin5", "pin18", "pin19", "pin20", "pin21", "pin22", "pin23", "pin24"]

/**
 * 3.52" 360x240 e-paper (Waveshare raw panel, UC8253c driver) on a 24-pin
 * 0.5mm FPC, with the boost circuit from the panel datasheet and a switchable
 * 3.3V supply (EPD_PWR_EN low = on). The FPC wraps around the board edge, so
 * J3 is a dual-contact connector.
 */
export const Epaper = () => (
  <group name="EPAPER" pcbX={0} pcbY={0}>
    <schematicsheet name="EPAPER" displayName="E-Paper" sheetIndex={2}>
      <AO3401A name="Q4" {...at("Q4")} connections={{ S: "net.V3_3", D: "net.EPD_3V3", G: "net.EPD_PWR_EN" }} />
      <resistor name="R30" {...at("R30")} resistance="10k" footprint="0402" connections={{ pin1: "net.EPD_PWR_EN", pin2: "net.V3_3" }} />

      <FPC_05FB_24PH20
        name="J3" {...at("J3")}
        connections={{
          pin2: "net.EPD_GDR",
          pin3: "net.EPD_RESE",
          pin8: "net.GND", // BS low = 4-wire SPI
          pin9: "net.EPD_BUSY",
          pin10: "net.EPD_RST",
          pin11: "net.EPD_DC",
          pin12: "net.EPD_CS",
          pin13: "net.EPD_SCLK",
          pin14: "net.EPD_SDI",
          pin15: "net.EPD_3V3",
          pin16: "net.EPD_3V3",
          pin17: "net.GND",
          pin21: "net.EPD_PREVGH",
          pin23: "net.EPD_PREVGL",
        }}
      />
      <capacitor name="C30" {...at("C30")} capacitance="1uF" footprint="0402" connections={{ pin1: "net.EPD_3V3", pin2: "net.GND" }} />
      {panelCapPins.map((pin, i) => (
        <capacitor
          key={pin}
          name={`C${31 + i}`}
          {...at(`C${31 + i}`)}
          capacitance="1uF"
          maxVoltageRating="50V"
          footprint="0603"
          connections={{ pin1: `J3.${pin}`, pin2: "net.GND" }}
        />
      ))}

      {/* Boost: PREVGH via D30, PREVGL via the C40 charge pump (D31, D32) */}
      <capacitor name="C40" {...at("C40")} capacitance="4.7uF" maxVoltageRating="50V" footprint="0805" connections={{ pin1: "net.EPD_SW", pin2: "net.EPD_PUMP" }} />
      <capacitor name="C41" {...at("C41")} capacitance="4.7uF" footprint="0603" connections={{ pin1: "net.EPD_3V3", pin2: "net.GND" }} />
      <SWPA4020S680MT name="L2" {...at("L2")} connections={{ pin1: "net.EPD_3V3", pin2: "net.EPD_SW" }} />
      <BSS138 name="Q5" {...at("Q5")} connections={{ D: "net.EPD_SW", G: "net.EPD_GDR", S: "net.EPD_RESE" }} />
      <resistor name="R31" {...at("R31")} resistance="10k" footprint="0402" connections={{ pin1: "net.EPD_GDR", pin2: "net.GND" }} />
      <resistor name="R32" {...at("R32")} resistance="3" footprint="0603" connections={{ pin1: "net.EPD_RESE", pin2: "net.GND" }} />
      <A_1N5819WS name="D30" {...at("D30")} connections={{ anode: "net.EPD_SW", cathode: "net.EPD_PREVGH" }} />
      <A_1N5819WS name="D31" {...at("D31")} connections={{ anode: "net.EPD_PUMP", cathode: "net.GND" }} />
      <A_1N5819WS name="D32" {...at("D32")} connections={{ anode: "net.EPD_PREVGL", cathode: "net.EPD_PUMP" }} />
    </schematicsheet>
  </group>
)

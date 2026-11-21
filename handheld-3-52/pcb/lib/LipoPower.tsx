import { A_1N5819WS } from "../imports/A_1N5819WS"
import { AO3401A } from "../imports/AO3401A"
import { RT9080_33GJ5 } from "../imports/RT9080_33GJ5"
import { TP4054 } from "../imports/TP4054"
import { WAFER_PH2_0_2PWB } from "../imports/WAFER_PH2_0_2PWB"
import { at } from "./layout"
import { UsbC } from "./UsbC"


/**
 * USB-C input, Li-ion charging and a 3.3V LDO. There is no power switch: the
 * rail is always on and firmware puts the ESP32-C3 into deep sleep (~5uA),
 * waking on any front button (GPIO3-5).
 *
 * Power path (from the Waveshare reference design):
 * - USB present: VBUS -> D1 -> VSYS, and Q1 is held off so the battery is
 *   isolated from VSYS.
 * - Battery only: Q1 conducts and VBAT feeds VSYS.
 */
export const LipoPower = () => (
  <group name="POWER" pcbX={0} pcbY={0}>
    <schematicsheet name="POWER" displayName="Power" sheetIndex={0}>
      <UsbC />
      <A_1N5819WS name="D1" {...at("D1")} connections={{ anode: "net.VBUS", cathode: "net.VSYS" }} />

      {/* Charger: I_charge = 1000V / R_PROG = ~200mA (0.4C for a 500mAh 403450) */}
      <TP4054
        name="U2" {...at("U2")}
        connections={{ VCC: "net.VBUS", GND: "net.GND", BAT: "net.VBAT" }}
      />
      <capacitor name="C1" {...at("C1")} capacitance="4.7uF" footprint="0603" connections={{ pin1: "net.VBUS", pin2: "net.GND" }} />
      <capacitor name="C2" {...at("C2")} capacitance="4.7uF" footprint="0603" connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />
      <resistor name="R3" {...at("R3")} resistance="5.1k" footprint="0402" connections={{ pin1: "U2.PROG", pin2: "net.GND" }} />
      <resistor name="R4" {...at("R4")} resistance="5.1k" footprint="0402" connections={{ pin1: "net.VBUS" }} />
      <led name="LED1" {...at("LED1")} schRotation={180} color="red" footprint="0603" supplierPartNumbers={{ jlcpcb: ["C2286"] }} connections={{ anode: "R4.pin2", cathode: "U2.CHRG" }} />

      {/* JST-PH 2.0 for the LiPo lead (pin1 = +); pin3/pin4 are the mechanical tabs */}
      <WAFER_PH2_0_2PWB name="J2" {...at("J2")} connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />

      {/* Q1 blocks the battery while USB is present */}
      <AO3401A name="Q1" {...at("Q1")} connections={{ S: "net.VSYS", D: "net.VBAT", G: "net.VBUS" }} />
      <resistor name="R6" {...at("R6")} resistance="10k" footprint="0402" connections={{ pin1: "net.VBUS", pin2: "net.GND" }} />

      {/* 3.3V LDO, 2uA quiescent; drops out below ~3.4V battery, the ESP32-S3 runs down to 3.0V */}
      <RT9080_33GJ5 name="U3" {...at("U3")} connections={{ VIN: "net.VSYS", EN: "net.VSYS", GND: "net.GND", VOUT: "net.V3_3" }} />
      <capacitor name="C3" {...at("C3")} capacitance="10uF" footprint="0805" connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <capacitor name="C4" {...at("C4")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <capacitor name="C6" {...at("C6")} capacitance="22uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />

      {/* Battery voltage sense: BAT_ADC = VBAT / 2, ~2uA permanent drain */}
      <resistor name="R13" {...at("R13")} resistance="1M" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C26083"] }} connections={{ pin1: "net.VBAT", pin2: "net.BAT_ADC" }} />
      <resistor name="R14" {...at("R14")} resistance="1M" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C26083"] }} connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
      <capacitor name="C7" {...at("C7")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
    </schematicsheet>
  </group>
)

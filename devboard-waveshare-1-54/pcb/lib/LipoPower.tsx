import { A_1N5819WS } from "../imports/A_1N5819WS"
import { AO3401A } from "../imports/AO3401A"
import { RT9080_33GJ5 } from "../imports/RT9080_33GJ5"
import { TP4054 } from "../imports/TP4054"
import { placer, sharedPlacements } from "./layout"
import { UsbC } from "./UsbC"

const at = placer({
  ...sharedPlacements,

  // VBUS diode, power path
  D1: [-18.5, 26.9],
  R6: [-29.8, 26.9],
  Q1: [-30, 21, 180],

  // 3.3V LDO
  U3: [-24, 21],
  C4: [-27.6, 17.6],
  C3: [-24, 17.6],
  C6: [-19.6, 24.4],

  // Charger + battery ADC
  U2: [-26.5, 8],
  C1: [-26.5, 11.4],
  C2: [-26.5, 4.6],
  R3: [-22.5, 8],
  R13: [-22.5, 5],
  R14: [-22.5, 3.8],
  C7: [-22.5, 2.6],

  // Charge LED along the top edge
  LED1: [-15, 34.8],
  R4: [-15, 32.8],
})

/**
 * USB-C input, Li-ion charging and a 3.3V LDO. There is no power switch: the
 * rail is always on and firmware puts the ESP32-S3 into deep sleep (~8uA),
 * waking on any front button (ext1 on GPIO0/7/14).
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

      {/* Charger: I_charge = 1000V / R_PROG = ~210mA */}
      <TP4054
        name="U2" {...at("U2")}
        connections={{ VCC: "net.VBUS", GND: "net.GND", BAT: "net.VBAT" }}
      />
      <capacitor name="C1" {...at("C1")} capacitance="4.7uF" footprint="0603" connections={{ pin1: "net.VBUS", pin2: "net.GND" }} />
      <capacitor name="C2" {...at("C2")} capacitance="4.7uF" footprint="0603" connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />
      <resistor name="R3" {...at("R3")} resistance="4.7k" footprint="0402" connections={{ pin1: "U2.PROG", pin2: "net.GND" }} />
      <resistor name="R4" {...at("R4")} resistance="1k" footprint="0402" connections={{ pin1: "net.VBUS" }} />
      <led name="LED1" {...at("LED1")} schRotation={180} color="red" footprint="0603" supplierPartNumbers={{ jlcpcb: ["C2286"] }} connections={{ anode: "R4.pin2", cathode: "U2.CHRG" }} />

      {/* Solder pads for the LiPo leads, at the edge of the battery zone */}
      <pinheader
        name="J2" {...at("J2")}
        pinCount={2}
        pitch="2.54mm"
        doNotPlace
        showSilkscreenPinLabels
        pinLabels={["BAT_P", "BAT_N"]}
        connections={{ BAT_P: "net.VBAT", BAT_N: "net.GND" }}
      />

      {/* Q1 blocks the battery while USB is present */}
      <AO3401A name="Q1" {...at("Q1")} connections={{ S: "net.VSYS", D: "net.VBAT", G: "net.VBUS" }} />
      <resistor name="R6" {...at("R6")} resistance="100k" footprint="0402" connections={{ pin1: "net.VBUS", pin2: "net.GND" }} />

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

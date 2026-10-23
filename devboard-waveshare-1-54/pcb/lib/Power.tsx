import { A_1N5819WS } from "../imports/A_1N5819WS"
import { AO3401A } from "../imports/AO3401A"
import { MSK12C02 } from "../imports/MSK12C02"
import { SY8089AAAC } from "../imports/SY8089AAAC"
import { TP4054 } from "../imports/TP4054"
import { TYPE_C_16PIN_2MD_073_ } from "../imports/TYPE_C_16PIN_2MD_073_"
import { WPN3012H2R2MT } from "../imports/WPN3012H2R2MT"
import { at } from "./layout"

/**
 * USB-C input, Li-ion charging, power switch and 3.3V buck.
 *
 * Power path:
 * - USB present: VBUS -> D1 -> VSYS, and Q1 is held off so the battery is
 *   isolated from VSYS. The battery charges regardless of SW4.
 * - Battery only: SW4 on connects VBAT to BAT_SW and Q1 conducts into VSYS.
 */
export const Power = () => (
  <group name="POWER" pcbX={0} pcbY={0}>
    <schematicsheet name="POWER" displayName="Power" sheetIndex={0}>
      {/* USB-C (device, 5V only) */}
      <TYPE_C_16PIN_2MD_073_
        name="USB1" {...at("USB1")}
        connections={{
          VBUS1: "net.VBUS",
          VBUS2: "net.VBUS",
          GND1: "net.GND",
          GND2: "net.GND",
          EH1: "net.GND",
          EH2: "net.GND",
          Dp1: "net.USB_DP",
          Dp2: "net.USB_DP",
          Dn1: "net.USB_DN",
          Dn2: "net.USB_DN",
        }}
      />
      <resistor name="R1" {...at("R1")} resistance="5.1k" footprint="0402" connections={{ pin1: "USB1.CC1", pin2: "net.GND" }} />
      <resistor name="R2" {...at("R2")} resistance="5.1k" footprint="0402" connections={{ pin1: "USB1.CC2", pin2: "net.GND" }} />
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
      <led name="LED1" {...at("LED1")} schRotation={180} color="orange" footprint="0603" connections={{ anode: "R4.pin2", cathode: "U2.CHRG" }} />

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

      {/* Battery / USB power path: SW4 disconnects the battery, Q1 blocks it while USB is present */}
      <MSK12C02 name="SW4" {...at("SW4")} connections={{ pin2: "net.BAT_SW", pin1: "net.VBAT" }} />
      <AO3401A name="Q1" {...at("Q1")} connections={{ S: "net.VSYS", D: "net.BAT_SW", G: "net.VBUS" }} />
      <resistor name="R6" {...at("R6")} resistance="100k" footprint="0402" connections={{ pin1: "net.VBUS", pin2: "net.GND" }} />

      {/* 3.3V buck: Vout = 0.6V * (1 + 200k / 44.2k) = 3.31V */}
      <SY8089AAAC name="U3" {...at("U3")} connections={{ IN: "net.VSYS", GND: "net.GND", LX: "net.BUCK_SW" }} />
      <resistor name="R10" {...at("R10")} resistance="100k" footprint="0402" connections={{ pin1: "net.VSYS", pin2: "U3.EN" }} />
      <capacitor name="C3" {...at("C3")} capacitance="10uF" footprint="0805" connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <capacitor name="C4" {...at("C4")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <WPN3012H2R2MT name="L1" {...at("L1")} connections={{ pin1: "net.BUCK_SW", pin2: "net.V3_3" }} />
      <resistor name="R11" {...at("R11")} resistance="200k" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "U3.FB" }} />
      <resistor name="R12" {...at("R12")} resistance="44.2k" footprint="0402" connections={{ pin1: "U3.FB", pin2: "net.GND" }} />
      <capacitor name="C5" {...at("C5")} capacitance="22pF" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "U3.FB" }} />
      <capacitor name="C6" {...at("C6")} capacitance="22uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />

      {/* Battery voltage sense: BAT_ADC = VBAT / 2 */}
      <resistor name="R13" {...at("R13")} resistance="200k" footprint="0402" connections={{ pin1: "net.VBAT", pin2: "net.BAT_ADC" }} />
      <resistor name="R14" {...at("R14")} resistance="200k" footprint="0402" connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
      <capacitor name="C7" {...at("C7")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
    </schematicsheet>
  </group>
)

import { K2_1102DP_C4SW_04 } from "../imports/K2_1102DP_C4SW_04"
import { at } from "./layout"

/** pin1/pin2 and pin3/pin4 are tied inside the switch; pressing joins the pairs. */
const buttonConnections = (net: string) => ({ pin1: net, pin3: "net.GND" })

/**
 * Front side: three 6x6mm through-hole buttons stacked right of the display
 * (active low, internal pull-ups; JLC hand-solders them). Back side: a row of
 * unpopulated 2.54mm pads for debugging.
 */
export const FrontPanel = () => (
  <group name="FRONT" pcbX={0} pcbY={0}>
    <schematicsheet name="FRONT" displayName="Buttons & Pads" sheetIndex={5}>
      <K2_1102DP_C4SW_04 name="SW1" {...at("SW1")} layer="bottom" connections={buttonConnections("net.BTN1")} />
      <K2_1102DP_C4SW_04 name="SW2" {...at("SW2")} layer="bottom" connections={buttonConnections("net.BTN2")} />
      <K2_1102DP_C4SW_04 name="SW3" {...at("SW3")} layer="bottom" connections={buttonConnections("net.BTN3")} />

      <pinheader
        name="J5" {...at("J5")}
        pinCount={5}
        pitch="2.54mm"
        doNotPlace
        showSilkscreenPinLabels
        pinLabels={["GND", "V3_3", "VSYS", "BOOT", "TX"]}
        connections={{
          GND: "net.GND",
          V3_3: "net.V3_3",
          VSYS: "net.VSYS",
          BOOT: "net.BOOT",
          TX: "net.UART_TX",
        }}
      />
    </schematicsheet>
  </group>
)

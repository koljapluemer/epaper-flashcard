import { ContactPad } from "./ContactPad"
import { at } from "./layout"

const buttonConnections = (net: string) => ({ A: net, B: "net.GND" })

/**
 * Front side: three bare-copper key contacts stacked right of the display,
 * closed by rubber keys held in the case (active low, internal pull-ups). No
 * assembled parts on the front, so JLC Economic PCBA (single-sided) applies.
 * 15mm pitch fits a 1x3 strip cut from an Adafruit 1611 keypad. Back side: a
 * row of unpopulated 2.54mm pads for debugging.
 */
export const FrontPanel = () => (
  <group name="FRONT" pcbX={0} pcbY={0}>
    <schematicsheet name="FRONT" displayName="Buttons & Pads" sheetIndex={5}>
      <ContactPad name="SW1" {...at("SW1")} layer="bottom" connections={buttonConnections("net.BTN1")} />
      <ContactPad name="SW2" {...at("SW2")} layer="bottom" connections={buttonConnections("net.BTN2")} />
      <ContactPad name="SW3" {...at("SW3")} layer="bottom" connections={buttonConnections("net.BTN3")} />

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

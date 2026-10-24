import { JT_S1212WFP } from "../imports/JT_S1212WFP"
import { at } from "./layout"

/** Diagonal pins of a 4-pin tactile switch are always on opposite contacts. */
const buttonConnections = (net: string) => ({ pin1: net, pin4: "net.GND" })

/**
 * Front side: three 12x12mm buttons under the display (active low, internal
 * pull-ups except BTN1; hand-soldered, not assembled) and a row of 2.54mm
 * solder pads for spare signals.
 */
export const FrontPanel = () => (
  <group name="FRONT" pcbX={0} pcbY={0}>
    <schematicsheet name="FRONT" displayName="Buttons & Pads" sheetIndex={5}>
      {/* BTN1 is GPIO0: held at reset/power-up it enters the USB download mode */}
      <JT_S1212WFP name="SW1" {...at("SW1")} layer="bottom" doNotPlace connections={buttonConnections("net.BTN1")} />
      <JT_S1212WFP name="SW2" {...at("SW2")} layer="bottom" doNotPlace connections={buttonConnections("net.BTN2")} />
      <JT_S1212WFP name="SW3" {...at("SW3")} layer="bottom" doNotPlace connections={buttonConnections("net.BTN3")} />
      <resistor name="R21" {...at("R21")} resistance="10k" footprint="0402" connections={{ pin1: "net.BTN1", pin2: "net.V3_3" }} />

      <pinheader
        name="J5" {...at("J5")}
        schWidth={0.58}
        pinCount={14}
        pitch="2.54mm"
        doNotPlace
        showSilkscreenPinLabels
        pinLabels={[
          "GND", "V3_3", "VSYS", "IO1", "IO2", "IO15", "IO16",
          "IO21", "IO38", "IO42", "TX", "RX", "SDA", "SCL",
        ]}
        connections={{
          GND: "net.GND",
          V3_3: "net.V3_3",
          VSYS: "net.VSYS",
          IO1: "net.GP1",
          IO2: "net.GP2",
          IO15: "net.GP15",
          IO16: "net.GP16",
          IO21: "net.GP21",
          IO38: "net.GP38",
          IO42: "net.GP42",
          TX: "net.UART_TX",
          RX: "net.UART_RX",
          SDA: "net.I2C_SDA",
          SCL: "net.I2C_SCL",
        }}
      />
    </schematicsheet>
  </group>
)

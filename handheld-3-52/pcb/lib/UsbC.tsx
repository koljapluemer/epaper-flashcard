import { TYPE_C_16PIN_2MD_073_ } from "../imports/TYPE_C_16PIN_2MD_073_"
import { at } from "./layout"

/** USB-C device port (5V only, CC pulled down) with native USB to the ESP32-S3. */
export const UsbC = () => (
  <>
    <TYPE_C_16PIN_2MD_073_
      name="USB1" {...at("USB1")} allowOffBoard
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
    <resistor name="R1" {...at("R1")} resistance="5.1k" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C25905"] }} connections={{ pin1: "USB1.CC1", pin2: "net.GND" }} />
    <resistor name="R2" {...at("R2")} resistance="5.1k" footprint="0402" connections={{ pin1: "USB1.CC2", pin2: "net.GND" }} />
  </>
)

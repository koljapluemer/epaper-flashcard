import { A_1N5819WS } from "../imports/A_1N5819WS"
import { AO3400A } from "../imports/AO3400A"
import { BH_AAA_A1AJ020 } from "../imports/BH_AAA_A1AJ020"
import { BH_AAA_A6AJ031 } from "../imports/BH_AAA_A6AJ031"
import { TPS61099DRVR } from "../imports/TPS61099DRVR"
import { WPN252012H2R2MTY01 } from "../imports/WPN252012H2R2MTY01"
import { BATTERY_ZONE, placer, sharedPlacements } from "./layout"
import { UsbC } from "./UsbC"

/**
 * Holders are rotated 180deg so the pins sit at the left end, next to the
 * power parts; the placements put the holder body on the battery zone center
 * (1xAAA: 0.5mm left of it, clear of the J3 capacitor column).
 * 1xAAA: footprint origin between the pins, body center 2.52mm off the pin line.
 * 2xAAA: footprint origin at the pin column, body center 24.1mm along the cells.
 */
const holderPlacement = {
  1: [BATTERY_ZONE.x - 0.5, BATTERY_ZONE.y - 2.52, 180],
  2: [BATTERY_ZONE.x - 24.1, BATTERY_ZONE.y, 180],
} as const

const placements = (cells: 1 | 2) =>
  placer({
    ...sharedPlacements,
    BT1: [...holderPlacement[cells]],

    // Boost converter, in the corner the LiPo variant uses for its LDO
    U3: [-24, 21],
    L1: [-28.5, 21, 90],
    C1: [-28.5, 17.6],
    C3: [-20.5, 21, 90],
    C6: [-19.6, 24.4],
    R7: [-24, 17.6],
    R8: [-24, 16.4, 180],

    // Reverse-polarity switch, gate close to V3_3
    Q1: [-28.5, 13.5],
    D1: [-28.5, 10.8],

    // Battery ADC
    R13: [-26, 7, cells === 1 ? 0 : 180],
    R14: [-26, 5.8, 180],
    C7: [-26, 4.6, 180],
  })

/**
 * User-replaceable AAA cells in an on-board holder, boosted to V3_3 by a
 * TPS61099 (starts from 0.7V, 1uA quiescent, true load disconnect, regulates
 * in down mode when the input is near the output). USB-C carries data only;
 * the board always runs from the cells, so cards can only be loaded with
 * batteries inserted.
 *
 * - 1xAAA (BH-AAA-A6AJ031): 0.9-1.6V. The 0.8A minimum switch current gives
 *   I_out(max) = V_in * (0.8A - 0.3A/2) * 0.85 / 3.2V, ~155mA at 0.9V, ~210mA
 *   at 1.2V: enough with the radio off, Wi-Fi does not fit, BLE is marginal.
 * - 2xAAA in series (BH-AAA-A1AJ020): 1.8-3.2V, ~310mA at 1.8V, twice the
 *   energy. BLE fits; Wi-Fi TX peaks are still marginal near end of life.
 *
 * Reverse polarity: Q1 sits in the battery's negative lead with its gate on
 * V3_3. A reversed cell sees Q1's body diode and D1 in reverse, so no current
 * flows. A correct cell cold-starts through D1 (Schottky, ~0.3V) until V3_3
 * turns Q1 on; a single cell therefore needs >1.0V to cold-start.
 *
 * Both holders are through-hole: the pins come out on the front, behind the
 * display, and must be cut flush after soldering.
 */
export const AaaPower = ({ cells }: { cells: 1 | 2 }) => {
  const at = placements(cells)
  const Holder = cells === 1 ? BH_AAA_A6AJ031 : BH_AAA_A1AJ020

  return (
    <group name="POWER" pcbX={0} pcbY={0}>
      <schematicsheet name="POWER" displayName="Power" sheetIndex={0}>
        <UsbC />

        <Holder name="BT1" {...at("BT1")} connections={{ pos: "net.VBAT", neg: "net.BAT_N" }} />
        <AO3400A name="Q1" {...at("Q1")} connections={{ D: "net.BAT_N", S: "net.GND" }} />
        {/* Gate to the nearest V3_3 pad, not across the board */}
        <trace from=".Q1 > .G" to=".R7 > .pin1" />
        <A_1N5819WS name="D1" {...at("D1")} connections={{ anode: "net.GND", cathode: "net.BAT_N" }} />

        {/* Boost to V3_3 = 1.0V * (1 + R7/R8) = 3.2V (PFM ~3.3V); EN tied to VIN */}
        <TPS61099DRVR
          name="U3" {...at("U3")}
          connections={{
            VIN: "net.VBAT",
            EN: "net.VBAT",
            SW: "net.BOOST_SW",
            VOUT: "net.V3_3",
            FB: "net.BOOST_FB",
            GND: "net.GND",
            EP: "net.GND",
          }}
        />
        <WPN252012H2R2MTY01 name="L1" {...at("L1")} connections={{ pin1: "net.VBAT", pin2: "net.BOOST_SW" }} />
        <capacitor name="C1" {...at("C1")} capacitance="10uF" footprint="0805" connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />
        {/* Datasheet minimum is 20uF nominal on VOUT; C10 at the module adds 10uF */}
        <capacitor name="C3" {...at("C3")} capacitance="22uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
        <capacitor name="C6" {...at("C6")} capacitance="22uF" footprint="0805" connections={{ pin1: "net.V3_3", pin2: "net.GND" }} />
        {/* ~1.5uA divider current, the largest standby drain after the ESP32-S3 */}
        <resistor name="R7" {...at("R7")} resistance="1.5M" footprint="0402" connections={{ pin1: "net.V3_3", pin2: "net.BOOST_FB" }} />
        <resistor name="R8" {...at("R8")} resistance="680k" footprint="0402" connections={{ pin1: "net.BOOST_FB", pin2: "net.GND" }} />

        {/* Battery voltage sense. 1 cell: BAT_ADC = VBAT, no standby drain.
            2 cells: BAT_ADC = VBAT / 2 (3.2V exceeds the ADC range), ~1.6uA drain. */}
        {cells === 1 ? (
          <resistor name="R13" {...at("R13")} resistance="100k" footprint="0402" connections={{ pin1: "net.VBAT", pin2: "net.BAT_ADC" }} />
        ) : (
          <>
            <resistor name="R13" {...at("R13")} resistance="1M" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C26083"] }} connections={{ pin1: "net.VBAT", pin2: "net.BAT_ADC" }} />
            <resistor name="R14" {...at("R14")} resistance="1M" footprint="0402" supplierPartNumbers={{ jlcpcb: ["C26083"] }} connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
          </>
        )}
        <capacitor name="C7" {...at("C7")} capacitance="100nF" footprint="0402" connections={{ pin1: "net.BAT_ADC", pin2: "net.GND" }} />
      </schematicsheet>
    </group>
  )
}

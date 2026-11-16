import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["VIN"],
  pin2: ["GND"],
  pin3: ["EN"],
  pin4: ["NC"],
  pin5: ["VOUT"]
} as const

const pinAttributes = {
  pin1: {requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "1uF"},
  pin2: {requiresGround: true, requiresVoltage: 0, mustBeConnected: true},
  pin4: {},
  pin3: {isInput: true},
  pin5: {isOutput: true, providesPower: true, providesVoltage: 3.3, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "1uF"}
} satisfies NonNullable<ChipProps["pinAttributes"]>

export const RT9080_33GJ5 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C841192"
  ]
}}
      manufacturerPartNumber="RT9080-33GJ5"
      footprint="sot25_w2.3mm_pw0.53mm_pl1.05mm_pin1location(leftside,bottom)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C841192.obj?uuid=c7fdf6dae3ca4abaabd1bafd2d31350d",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C841192.step?uuid=c7fdf6dae3ca4abaabd1bafd2d31350d",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0, y: 0.000012700000070253736, z: 0.050795 },
      }}
      {...props}
    />
  )
}
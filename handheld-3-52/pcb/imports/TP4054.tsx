import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["CHRG"],
  pin2: ["GND"],
  pin3: ["BAT"],
  pin4: ["VCC"],
  pin5: ["PROG"]
} as const

const pinAttributes = {
  pin2: {requiresGround: true},
  pin4: {requiresPower: true}
} as const

export const TP4054 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C668215"
  ]
}}
      manufacturerPartNumber="TP4054"
      footprint="sot25_w2.4mm_pl1mm_pin1location(rightside,bottom)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C668215.obj?uuid=c7fdf6dae3ca4abaabd1bafd2d31350d",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C668215.step?uuid=c7fdf6dae3ca4abaabd1bafd2d31350d",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0, y: 0.0001142999999501626, z: 0.050795 },
      }}
      {...props}
    />
  )
}
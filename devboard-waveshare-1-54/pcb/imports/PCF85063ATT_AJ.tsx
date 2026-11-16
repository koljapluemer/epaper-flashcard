import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["OSCI"],
  pin2: ["OSCO"],
  pin3: ["N_INT"],
  pin4: ["VSS"],
  pin5: ["SDA"],
  pin6: ["SCL"],
  pin7: ["CLKOUT"],
  pin8: ["VDD"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const PCF85063ATT_AJ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C165608"
  ]
}}
      manufacturerPartNumber="PCF85063ATT/AJ"
      footprint="tssop8_p0.65mm_w3.0904mm_pw0.37mm_pl1.35mm_rounded0.185mm_pin1location(leftside,bottom)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165608.obj?uuid=d6419c302e4e4880b11e69fd39742cf6",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165608.step?uuid=d6419c302e4e4880b11e69fd39742cf6",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.000012700000070253736, z: -0.175 },
      }}
      {...props}
    />
  )
}
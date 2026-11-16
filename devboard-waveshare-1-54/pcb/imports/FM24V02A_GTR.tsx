import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["A0"],
  pin2: ["A1"],
  pin3: ["A2"],
  pin4: ["VSS"],
  pin5: ["SDA"],
  pin6: ["SCL"],
  pin7: ["WP"],
  pin8: ["VDD"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const FM24V02A_GTR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C382041"
  ]
}}
      manufacturerPartNumber="FM24V02A-GTR"
      footprint="soic8_pillpads_w7.36mm_pw0.57mm_pl1.95mm_pin1location(leftside,bottom)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C382041.obj?uuid=7abc64c95a1a4a04a4ef38f9097c870b",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C382041.step?uuid=7abc64c95a1a4a04a4ef38f9097c870b",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}
import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const A_1_25_2PWB = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2905009"
  ]
}}
      manufacturerPartNumber="1.25-2PWB"
      footprint="jst2_smd_p1.2499mm_pw0.8mm_pl1.8mm_mpx6.4mm_mpy2.5499mm_mpw1.8mm_mpl2.9mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2905009.obj?uuid=59d5c618af974d15b82ba6530751c61e",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2905009.step?uuid=59d5c618af974d15b82ba6530751c61e",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999956566899, y: -0.3970039499998621, z: -3.57683 },
      }}
      {...props}
    />
  )
}
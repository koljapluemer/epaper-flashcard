import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const WAFER_PH2_0_2PWB = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C3029440"
  ]
}}
      manufacturerPartNumber="WAFER-PH2.0-2PWB"
      footprint="jst2_smd_p2mm_pw1mm_pl3.5mm_mpx6.7mm_mpy5.7mm_mpw1.5mm_mpl3.5mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3029440.obj?uuid=cc24a12d6f61425da92b8fb6acccd699",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3029440.step?uuid=cc24a12d6f61425da92b8fb6acccd699",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012700000070253736, y: -1.7278641000000106, z: -2.85 },
      }}
      {...props}
    />
  )
}
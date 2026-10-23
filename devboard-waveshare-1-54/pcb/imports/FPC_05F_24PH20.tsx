import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"],
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["pin9"],
  pin10: ["pin10"],
  pin11: ["pin11"],
  pin12: ["pin12"],
  pin13: ["pin13"],
  pin14: ["pin14"],
  pin15: ["pin15"],
  pin16: ["pin16"],
  pin17: ["pin17"],
  pin18: ["pin18"],
  pin19: ["pin19"],
  pin20: ["pin20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["pin23"],
  pin24: ["pin24"],
  pin25: ["pin25"],
  pin26: ["pin26"]
} as const

export const FPC_05F_24PH20 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2856805"
  ]
}}
      manufacturerPartNumber="FPC-05F-24PH20"
      footprint="fpc24_p0.5mm_pw0.3mm_pl1.25mm_mpx14.88mm_mpy2.58mm_mpw2mm_mpl2.5mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2856805.obj?uuid=f46a72d85a114cdba2775a80755ab8ed",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2856805.step?uuid=f46a72d85a114cdba2775a80755ab8ed",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.0000762000000804619, y: -1.2974985999999809, z: 0 },
      }}
      {...props}
    />
  )
}
import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["GND"],
  pin2: ["VOUT"],
  pin3: ["FB"],
  pin4: ["EN"],
  pin5: ["SW"],
  pin6: ["VIN"],
  pin7: ["EP"]
} as const

const pinAttributes = {
  pin1: {requiresGround: true},
  pin6: {requiresPower: true}
} as const

const footprinterPinLabels = {
  ...pinLabels,
  "pin7": [...pinLabels["pin7"], "thermalpad"],
} as const

export const TPS61099DRVR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={footprinterPinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2842395"
  ]
}}
      manufacturerPartNumber="TPS61099DRVR"
      footprint="dfn6_thermalpad1mmx1.6mm_pillpads_p0.65mm_w2.67mm_pw0.36mm_pl0.61mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2842395.obj?uuid=c909123e4a7a4da5a0270979fee6c02c",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2842395.step?uuid=c909123e4a7a4da5a0270979fee6c02c",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}
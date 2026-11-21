import type { DiodeProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["cathode","neg"],
  pin2: ["anode","pos"]
} as const

export const A_1N5819WS = (props: DiodeProps) => {
  const { name = "D1", ...restProps } = props

  return (
    <diode
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C191023"
  ]
}}
      manufacturerPartNumber="1N5819WS"
      footprint="diode_p2.3449mm_pw1mm_ph0.7mm_rounded0_cyw3.8449mm_cyh1.8mm_cathodepin1"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C191023.obj?uuid=7459fe65e23146c0a8d836e46a0add72",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C191023.step?uuid=7459fe65e23146c0a8d836e46a0add72",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.00011430000006384944, z: 0 },
      }}
      {...restProps}
    />
  )
}
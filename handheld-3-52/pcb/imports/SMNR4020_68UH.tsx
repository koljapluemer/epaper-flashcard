import type { InductorProps } from "@tscircuit/props"

export const SMNR4020_68UH = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="68uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C135265"
  ]
}}
      manufacturerPartNumber="SMNR4020-68UH"
      footprint="smdpads2_p3.8562mm_pw1.874mm_ph3.52mm_cyw6.2302mm_cyh4.5mm_pin1location(rightside,top)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C135265.obj?uuid=17e6bc9de5ec4d44a160fa801e621a52",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C135265.step?uuid=17e6bc9de5ec4d44a160fa801e621a52",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.000050000000000105516, z: 0 },
      }}
      {...props}
    />
  )
}
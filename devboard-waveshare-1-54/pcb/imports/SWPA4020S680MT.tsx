import type { InductorProps } from "@tscircuit/props"

export const SWPA4020S680MT = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="68uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C67545"
  ]
}}
      manufacturerPartNumber="SWPA4020S680MT"
      footprint="smdpads2_p3.1999mm_pw1.6mm_ph3.5mm_cyw5.2999mm_cyh4.5mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C67545.obj?uuid=54384860ccaa4399aecca69a879f17ac",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C67545.step?uuid=54384860ccaa4399aecca69a879f17ac",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.000050000000000105516, z: 0 },
      }}
      {...props}
    />
  )
}
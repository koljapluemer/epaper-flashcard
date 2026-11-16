import type { InductorProps } from "@tscircuit/props"

export const WPN3012H2R2MT = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="2.2uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C98355"
  ]
}}
      manufacturerPartNumber="WPN3012H2R2MT"
      footprint="smdpads2_p2.7mm_pw1.3mm_ph2.72mm_cyw4.5mm_cyh3.5mm_pin1location(rightside,top)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C98355.obj?uuid=63cc21aede2e4e639d7047cf5b8d8e62",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C98355.step?uuid=63cc21aede2e4e639d7047cf5b8d8e62",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0, y: 0, z: -0.01 },
      }}
      {...props}
    />
  )
}
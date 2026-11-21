import type { InductorProps } from "@tscircuit/props"

export const WPN252012H2R2MTY01 = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="2.2uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C279858"
  ]
}}
      manufacturerPartNumber="WPN252012H2R2MTY01"
      footprint="smdpads2_p1.9mm_pw0.95mm_ph2mm_cyw3.35mm_cyh2.5mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C279858.obj?uuid=750ab1cbbad448db9242b8cd0b86686a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C279858.step?uuid=750ab1cbbad448db9242b8cd0b86686a",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0.0037845999999888136, y: -0.005003799999997227, z: -0.01 },
      }}
      {...props}
    />
  )
}
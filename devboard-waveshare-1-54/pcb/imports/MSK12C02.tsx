import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

const pinAttributes = {
  pin4: {isPassive: true},
  pin3: {isPassive: true},
  pin2: {isPassive: true},
  pin1: {isPassive: true}
} satisfies NonNullable<ChipProps["pinAttributes"]>

const footprinterPinLabels = {
  ...pinLabels,
  "pin4": [...pinLabels["pin4"], "pin5"],
  "pin4": [...pinLabels["pin4"], "pin6"],
  "pin4": [...pinLabels["pin4"], "pin7"],
} as const

export const MSK12C02 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={footprinterPinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C431540"
  ]
}}
      manufacturerPartNumber="MSK12C02"
      footprint="smdslideswitch7_signalcols4_missing(2)_p1.5mm_pw0.6mm_pl1.524mm_mounty-2.2501mm_mpx7.1999mm_mpy2.3mm_mpw1.2mm_mpl0.7mm_holex1.5mm_holey-2.2502mm_holed0.9mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C431540.obj?uuid=fc12522ae2f04394b021187ce17b23bb",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C431540.step?uuid=fc12522ae2f04394b021187ce17b23bb",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0.000025400000026820635, y: -0.7060877499999378, z: -0.0000010000000000287557 },
      }}
      {...props}
    />
  )
}
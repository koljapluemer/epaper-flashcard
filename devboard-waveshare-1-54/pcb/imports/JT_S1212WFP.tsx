import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

export const JT_S1212WFP = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C465074"
  ]
}}
      manufacturerPartNumber="JT-S1212WFP"
      footprint={<footprint>
        <hole pcbX="-0mm" pcbY="-4.499991mm" diameter="1.9000216mm" />
<hole pcbX="-0mm" pcbY="4.499991mm" diameter="1.9000216mm" />
<platedhole  portHints={["pin1"]} pcbX="6.249924mm" pcbY="-2.540127mm" outerDiameter="2.499995mm" holeDiameter="1.5000224mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="-6.249924mm" pcbY="-2.540127mm" outerDiameter="2.499995mm" holeDiameter="1.5000224mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="6.249924mm" pcbY="2.539873mm" outerDiameter="2.499995mm" holeDiameter="1.5000224mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="-6.249924mm" pcbY="2.539873mm" outerDiameter="2.499995mm" holeDiameter="1.5000224mm" shape="circle" />
<silkscreenpath route={[{"x":-6.30001279999999,"y":6.29983500000003},{"x":6.299961999999823,"y":6.299860399999943}]} />
<silkscreenpath route={[{"x":-6.30001279999999,"y":-6.300089000000071},{"x":6.299961999999823,"y":-6.300114399999984}]} />
<silkscreenpath route={[{"x":-6.30001279999999,"y":6.29983500000003},{"x":-6.30001279999999,"y":4.020159600000056}]} />
<silkscreenpath route={[{"x":-6.30001279999999,"y":1.05958639999983},{"x":-6.30001279999999,"y":-1.0598403999999846}]} />
<silkscreenpath route={[{"x":-6.30001279999999,"y":-4.020413600000097},{"x":-6.30001279999999,"y":-6.300089000000071}]} />
<silkscreenpath route={[{"x":6.299961999999823,"y":6.299860399999943},{"x":6.299961999999823,"y":4.020159600000056}]} />
<silkscreenpath route={[{"x":6.299961999999823,"y":1.05958639999983},{"x":6.299961999999823,"y":-1.0598403999999846}]} />
<silkscreenpath route={[{"x":6.299961999999823,"y":-4.020413600000097},{"x":6.299961999999823,"y":-6.300114399999984}]} />
<silkscreencircle pcbX="-0.002032mm" pcbY="0.001397mm" radius="4.498086mm" />
<silkscreencircle pcbX="-0mm" pcbY="-0.000127mm" radius="4.064mm" />
<silkscreentext text="{NAME}" pcbX="0.001524mm" pcbY="7.299073mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-7.749921500000141,"y":6.24986100000001},{"x":7.749921500000028,"y":6.24986100000001},{"x":7.749921500000028,"y":-6.250115000000051},{"x":-7.749921500000141,"y":-6.250115000000051},{"x":-7.749921500000141,"y":6.24986100000001}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C465074.obj?uuid=3d82182052b84a8db86f7572b211a0dd",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C465074.step?uuid=3d82182052b84a8db86f7572b211a0dd",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012699999842880061, y: 0.00012700000002041634, z: -0.000006999999999646178 },
      }}
      {...restProps}
    />
  )
}
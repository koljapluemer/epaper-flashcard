import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"]
} as const

const pinAttributes = {
  pin4: {isPassive: true},
  pin2: {isPassive: true},
  pin1: {isPassive: true},
  pin3: {isPassive: true}
} satisfies NonNullable<PushButtonProps["pinAttributes"]>

export const K2_1102DP_C4SW_04 = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C110153"
  ]
}}
      manufacturerPartNumber="K2-1102DP-C4SW-04"
      pinAttributes={pinAttributes}
      internallyConnectedPins={[["pin1","pin2"],["pin3","pin4"]]}
      footprint={<footprint>
        <platedhole  portHints={["pin4"]} pcbX="3.24993mm" pcbY="-2.249932mm" outerDiameter="1.999996mm" holeDiameter="1.3000228mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="3.24993mm" pcbY="2.249932mm" outerDiameter="1.999996mm" holeDiameter="1.3000228mm" shape="circle" />
<platedhole  portHints={["pin1"]} pcbX="-3.24993mm" pcbY="2.249932mm" outerDiameter="1.999996mm" holeDiameter="1.3000228mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="-3.24993mm" pcbY="-2.249932mm" outerDiameter="1.999996mm" holeDiameter="1.3000228mm" shape="circle" />
<silkscreenpath route={[{"x":-2.2743160000001126,"y":-2.999994000000015},{"x":2.274315999999999,"y":-2.999994000000015}]} />
<silkscreenpath route={[{"x":-2.999994000000129,"y":1.0999978000000965},{"x":-2.999994000000129,"y":-0.999998000000005}]} />
<silkscreenpath route={[{"x":3.0999937999998792,"y":1.0279888000000028},{"x":3.0999937999998792,"y":-1.0999977999999828}]} />
<silkscreenpath route={[{"x":-1.99999600000001,"y":2.999994000000015},{"x":2.274315999999999,"y":2.999994000000015}]} />
<silkscreencircle pcbX="0mm" pcbY="0mm" radius="1.700022mm" />
<silkscreencircle pcbX="1.897888mm" pcbY="-1.498346mm" radius="0.430022mm" />
<silkscreencircle pcbX="-1.901952mm" pcbY="1.501648mm" radius="0.430022mm" />
<silkscreencircle pcbX="-1.89992mm" pcbY="-1.49987mm" radius="0.430022mm" />
<silkscreencircle pcbX="1.871726mm" pcbY="1.52908mm" radius="0.430022mm" />
<silkscreentext text="{NAME}" pcbX="0.0127mm" pcbY="4.302mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.499927999999954,"y":3.499930000000063},{"x":4.499927999999841,"y":3.499930000000063},{"x":4.499927999999841,"y":-3.499930000000063},{"x":-4.499927999999954,"y":-3.499930000000063},{"x":-4.499927999999954,"y":3.499930000000063}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C110153.obj?uuid=6ef04b62f1e945518af209609f65fa6f",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C110153.step?uuid=6ef04b62f1e945518af209609f65fa6f",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -3.200007 },
      }}
      {...restProps}
    />
  )
}
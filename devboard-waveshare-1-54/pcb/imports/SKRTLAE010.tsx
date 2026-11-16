import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"]
} as const

export const SKRTLAE010 = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C110293"
  ]
}}
      manufacturerPartNumber="SKRTLAE010"
      footprint={<footprint>
        <hole pcbX="2.1250021mm" pcbY="-0.14998065mm" diameter="0.9000236mm" />
<hole pcbX="-2.1250021mm" pcbY="-0.14998065mm" diameter="0.9000236mm" />
<smtpad portHints={["pin1"]} pcbX="-1.2250039mm" pcbY="0.74999215mm" width="0.7500112mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.0147447mm" pcbY="0.74999215mm" width="0.599948mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="1.2250039mm" pcbY="0.74999215mm" width="0.7500112mm" height="1.7999964mm" shape="rect" />
{/* Mounting tabs trimmed to end at the body front (datasheet land runs 0.3mm past it), so the actuator can overhang the board edge */}
<smtpad portHints={["pin4"]} pcbX="-1.8499963mm" pcbY="-1.05mm" width="1.2999974mm" height="0.6mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="1.8499963mm" pcbY="-1.05mm" width="1.2999974mm" height="0.6mm" shape="rect" />
{/* Datasheet: no copper between the mounting tabs */}
<keepout shape="rect" pcbX="0mm" pcbY="-1.05mm" width="2mm" height="1.2mm" layer="top" allowPlacements />
<silkscreenpath route={[{"x":-0.9999853000000059,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-1.350003650000005}]} />
<silkscreenpath route={[{"x":1.073619899999997,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-1.350003650000005},{"x":1.0000107000000042,"y":-2.1900070500000055},{"x":-0.9999853000000059,"y":-2.1900070500000055},{"x":-0.9999853000000059,"y":-1.350003650000005},{"x":-1.0735944999999987,"y":-1.350003650000005}]} />
<silkscreenpath route={[{"x":2.2500208999999955,"y":1.2099861499999918},{"x":2.2500208999999955,"y":0.4286313500000034}]} />
<silkscreenpath route={[{"x":-1.7412080999999944,"y":1.2099861499999918},{"x":-2.2499700999999988,"y":1.2099861499999918},{"x":-2.2499700999999988,"y":0.4286313500000034}]} />
<silkscreenpath route={[{"x":-0.4653660999999971,"y":1.2099861499999918},{"x":-0.6311264999999935,"y":1.2099861499999918}]} />
<silkscreenpath route={[{"x":0.6606158999999963,"y":1.2099861499999918},{"x":0.4948554999999999,"y":1.2099861499999918}]} />
<silkscreenpath route={[{"x":2.2500208999999955,"y":1.2099861499999918},{"x":1.7706975000000114,"y":1.2099861499999918}]} />
<silkscreentext text="{NAME}" pcbX="-0.0048387mm" pcbY="2.65984555mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":1.999983300000011,"y":-0.5000180500000084},{"x":1.999983300000011,"y":0.19998054999999226},{"x":2.2499955000000114,"y":0.19998054999999226},{"x":2.2499955000000114,"y":-0.5000180500000084},{"x":1.999983300000011,"y":-0.5000180500000084}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":-2.249995499999997,"y":-0.5000180500000084},{"x":-2.249995499999997,"y":0.19998054999999226},{"x":-1.9999832999999967,"y":0.19998054999999226},{"x":-1.9999832999999967,"y":-0.5000180500000084},{"x":-2.249995499999997,"y":-0.5000180500000084}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":-1.0499724999999955,"y":-1.2749974500000008},{"x":-1.0499724999999955,"y":-2.2250336500000003},{"x":-1.0499724999999955,"y":-2.225008250000002},{"x":1.00001069999999,"y":-2.225008250000002},{"x":1.0500232999999923,"y":-2.225008250000002},{"x":1.0500232999999923,"y":-1.2749974500000008},{"x":0.9499980999999877,"y":-1.2749974500000008},{"x":0.9499980999999877,"y":-2.1250084499999957},{"x":-0.9499727000000036,"y":-2.1250084499999957},{"x":-0.9499727000000036,"y":-1.2749974500000008},{"x":-1.0499724999999955,"y":-1.2749974500000008}]} strokeWidth="0mm" isFilled hasStroke={false} />
<courtyardoutline outline={[{"x":-2.825013900000002,"y":1.899990349999996},{"x":2.825013900000002,"y":1.899990349999996},{"x":2.825013900000002,"y":-1.899990349999996},{"x":-2.825013900000002,"y":-1.899990349999996},{"x":-2.825013900000002,"y":1.899990349999996}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C110293.obj?uuid=377cf136e3224a92b7f0ab7bebc44537",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C110293.step?uuid=377cf136e3224a92b7f0ab7bebc44537",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.0018626000000014908, y: 0.15200194999999506, z: 0.04999899999999996 },
      }}
      {...restProps}
    />
  )
}
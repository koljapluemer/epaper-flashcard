import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pos"], // next to the locating hole, per MYOUNG drawing MY-CP-0445
  pin2: ["neg"]
} as const

export const BH_AAA_A6AJ031 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.1,"y":0.18},{"x":-0.1,"y":-0.14}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.04,"y":0.1},{"x":-0.04,"y":-0.08}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.02,"y":0.18},{"x":0.02,"y":-0.14}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.08,"y":0.1},{"x":0.08,"y":-0.08}]} strokeColor="#880000" />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-0.4} schY={0} schStemLength={0.3} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={0.4} schY={0} schStemLength={0.3} />
          <schematictext schX={-0.001} schY={0.41} text="{NAME}" fontSize={0.2} anchor="bottom_center" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C48687368"
  ]
}}
      manufacturerPartNumber="BH-AAA-A6AJ031"
      footprint={<footprint>
        <hole pcbX="-24.799925mm" pcbY="2.824988mm" diameter="1.5999968mm" />
<platedhole  portHints={["pin1"]} pcbX="-24.849963mm" pcbY="-2.5249886mm" outerDiameter="2.1999956mm" holeDiameter="1.5000224mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="24.849963mm" pcbY="-2.5249886mm" outerDiameter="2.1999956mm" holeDiameter="1.5000224mm" shape="circle" />
<silkscreenpath route={[{"x":-21.971101599999884,"y":-2.5249886000001425},{"x":-19.431101600000034,"y":-2.5249886000001425}]} />
<silkscreenpath route={[{"x":-20.701101600000015,"y":-1.3819886000001134},{"x":-20.701101600000015,"y":-3.667988600000058}]} />
<silkscreenpath route={[{"x":-27.305101599999944,"y":-8.77496340000016},{"x":27.30489840000007,"y":-8.77496340000016}]} />
<silkscreenpath route={[{"x":-27.305101599999944,"y":3.7249861999998757},{"x":27.30489840000007,"y":3.7249861999998757}]} />
<silkscreenpath route={[{"x":-27.305101599999944,"y":3.7249861999998757},{"x":-27.305101599999944,"y":-8.77496340000016}]} />
<silkscreenpath route={[{"x":27.30489840000007,"y":3.7249861999998757},{"x":27.30489840000007,"y":-8.77496340000016}]} />
<silkscreentext text="{NAME}" pcbX="0.006985mm" pcbY="4.8852094mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-27.450047200000085,"y":3.9750115999999025},{"x":27.4498440000001,"y":3.9750115999999025},{"x":27.4498440000001,"y":-9.02496340000016},{"x":-27.450047200000085,"y":-9.02496340000016},{"x":-27.450047200000085,"y":3.9750115999999025}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C48687368.obj?uuid=588dc58ba3724b7c9529472d0e0e8b74",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C48687368.step?uuid=588dc58ba3724b7c9529472d0e0e8b74",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.0001015999999935957, y: 2.524975900000072, z: -0.000005999999999950489 },
      }}
      {...props}
    />
  )
}
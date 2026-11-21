import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pos"],
  pin2: ["neg"]
} as const

export const BH_AAA_A1AJ020 = (props: ChipProps<typeof pinLabels>) => {
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
          <schematictext schX={0} schY={0.408} text="{NAME}" fontSize={0.2} anchor="bottom_center" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C5290191"
  ]
}}
      manufacturerPartNumber="BH-AAA-A1AJ020"
      footprint={<footprint>
        {/* Corrected from the MYOUNG drawing WD-CP-0164 rev A/1 (the EasyEDA footprint had the
            pins 11mm apart and no post holes). Origin at the pin column; body center at x=-24.1. */}
        <platedhole portHints={["pin1"]} pcbX="0mm" pcbY="-6.04mm" outerDiameter="3mm" holeDiameter="2mm" shape="circle" />
        <platedhole portHints={["pin2"]} pcbX="0mm" pcbY="6.04mm" outerDiameter="3mm" holeDiameter="2mm" shape="circle" />
        {/* Holes for the three locating posts under the housing */}
        <hole pcbX="-39.1mm" pcbY="2.35mm" diameter="3mm" />
        <hole pcbX="-24.1mm" pcbY="0mm" diameter="3mm" />
        <hole pcbX="-9.1mm" pcbY="-2.35mm" diameter="3mm" />
<silkscreenpath route={[{"x":1.999970600000097,"y":12.2493786},{"x":1.999970600000097,"y":-12.25057240000001},{"x":-50.29992479999987,"y":-12.25057240000001},{"x":-50.29992479999987,"y":12.2493786}]} />
<silkscreenpath route={[{"x":-50.29992479999987,"y":12.2493786},{"x":1.999970600000097,"y":12.2493786}]} />
<silkscreentext text="-" pcbX="-0.890524mm" pcbY="7.282307mm" anchorAlignment="bottom_left" fontSize="2.032mm" />
<silkscreentext text="+" pcbX="-0.890524mm" pcbY="-9.130665mm" anchorAlignment="bottom_left" fontSize="2.032mm" />
<silkscreentext text="{NAME}" pcbX="-24.12619mm" pcbY="13.244197mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":-1.0000233999999182,"y":-8.099983800000018},{"x":-1.0000233999999182,"y":-8.299983400000087},{"x":0.8499856000000818,"y":-8.299983400000087},{"x":0.8499856000000818,"y":-8.099983800000018},{"x":-1.0000233999999182,"y":-8.099983800000018}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":-0.15001239999969584,"y":-9.099981800000023},{"x":0.04998720000003232,"y":-9.099981800000023},{"x":0.04998720000003232,"y":-7.249972800000023},{"x":-0.15001239999969584,"y":-7.249972800000023},{"x":-0.15001239999969584,"y":-9.099981800000023}]} strokeWidth="0mm" isFilled hasStroke={false} />
<fabricationnotepath route={[{"x":0.8999727999998868,"y":8.099983800000018},{"x":0.8999727999998868,"y":8.300008799999887},{"x":-0.95011240000008,"y":8.300008799999887},{"x":-0.95011240000008,"y":8.099983800000018},{"x":0.8999727999998868,"y":8.099983800000018}]} strokeWidth="0mm" isFilled hasStroke={false} />
<courtyardoutline outline={[{"x":-50.54992479999987,"y":12.499403999999913},{"x":2.249970600000097,"y":12.499403999999913},{"x":2.249970600000097,"y":-12.500547000000097},{"x":-50.54992479999987,"y":-12.500547000000097},{"x":-50.54992479999987,"y":12.499403999999913}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5290191.obj?uuid=016cf5daf2a246219a026260ff22562f",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5290191.step?uuid=016cf5daf2a246219a026260ff22562f",
        pcbRotationOffset: 0,
        // x offset was 24.15 from EasyEDA, which rendered the model 24mm off the footprint
        modelOriginPosition: { x: 0, y: 0.0005715000000918735, z: -0.000010000000000509601 },
      }}
      {...props}
    />
  )
}
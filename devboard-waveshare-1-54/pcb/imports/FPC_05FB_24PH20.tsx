import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"],
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["pin9"],
  pin10: ["pin10"],
  pin11: ["pin11"],
  pin12: ["pin12"],
  pin13: ["pin13"],
  pin14: ["pin14"],
  pin15: ["pin15"],
  pin16: ["pin16"],
  pin17: ["pin17"],
  pin18: ["pin18"],
  pin19: ["pin19"],
  pin20: ["pin20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["pin23"],
  pin24: ["pin24"],
  pin25: ["pin25"],
  pin26: ["pin26"]
} as const

export const FPC_05FB_24PH20 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2856831"
  ]
}}
      manufacturerPartNumber="FPC-05FB-24PH20"
      footprint={<footprint>
        <smtpad portHints={["pin24"]} pcbX="-5.750052mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="-5.249926mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="-4.750054mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="-4.249928mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="-3.750056mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-3.24993mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-2.750058mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-2.249932mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-1.75006mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-1.249934mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-0.750062mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-0.249936mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.249936mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="0.750062mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="1.249934mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="1.75006mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="2.249932mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="2.750058mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="3.24993mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="3.750056mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="4.249928mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="4.750054mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="5.249926mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="5.750052mm" pcbY="1.7749647mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="-7.29996mm" pcbY="-1.4749653mm" width="1.999996mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="7.29996mm" pcbY="-1.4749653mm" width="1.999996mm" height="1.7999964mm" shape="rect" />
<silkscreenpath route={[{"x":-7.753045200000088,"y":1.6739489000000276},{"x":-6.131204399999888,"y":1.6739489000000276}]} />
<silkscreenpath route={[{"x":-7.753045200000088,"y":-0.3439032999999654},{"x":-7.753045200000088,"y":1.6739489000000276}]} />
<silkscreenpath route={[{"x":-7.753045200000088,"y":-3.7250243000000864},{"x":-7.753045200000088,"y":-2.6061796999999842}]} />
<silkscreenpath route={[{"x":7.749971800000026,"y":-3.7250243000000864},{"x":-7.753045200000088,"y":-3.7250243000000864}]} />
<silkscreenpath route={[{"x":7.749971800000026,"y":-0.3439032999999654},{"x":7.749971800000026,"y":1.6499459000000343},{"x":6.131102800000008,"y":1.6499459000000343}]} />
<silkscreenpath route={[{"x":7.749971800000026,"y":-3.7250243000000864},{"x":7.749971800000026,"y":-2.6061796999999842}]} />
<silkscreencircle pcbX="6.49986mm" pcbY="2.1498687mm" radius="0.127mm" />
<silkscreentext text="{NAME}" pcbX="0.00635mm" pcbY="3.3845647mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-8.549957999999947,"y":2.6249634999999216},{"x":8.54995800000006,"y":2.6249634999999216},{"x":8.54995800000006,"y":-3.625037700000007},{"x":-8.549957999999947,"y":-3.625037700000007},{"x":-8.549957999999947,"y":2.6249634999999216}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2856831.obj?uuid=fcf4dde741db49ed89d9f372e0cbd97c",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2856831.step?uuid=fcf4dde741db49ed89d9f372e0cbd97c",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00006349999989652133, y: -1.7749568999999612, z: 0 },
      }}
      {...props}
    />
  )
}
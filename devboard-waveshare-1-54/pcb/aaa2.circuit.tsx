import { AaaPower } from "./lib/AaaPower"
import { FlashcardBoard } from "./lib/FlashcardBoard"

/**
 * 2xAAA variant: two user-replaceable AAA cells in series in an on-board
 * holder, boosted to 3.3V; USB-C for data only. Same board, display and
 * buttons as the LiPo variant.
 */
export default () => (
  <FlashcardBoard
    power={<AaaPower cells={2} />}
    powerNets={["VBAT", "BAT_N", "BOOST_SW", "V3_3"]}
    supplyNet="VBAT"
  />
)

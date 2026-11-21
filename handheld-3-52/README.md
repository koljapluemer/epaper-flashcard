# Landscape handheld (3.52" e-paper)

A pocketable flashcard device: 3.52" 360×240 e-paper in landscape, three buttons
stacked right of the screen, equal grips on both sides, LiPo charged over USB-C.
Built to be ordered fully assembled from JLCPCB (Economic PCBA, nothing to
solder yourself).

![front](case/front.png)

| | |
|---|---|
| Case (rough) | 115 × 60 × 12 mm, 15 mm grip each side of the screen |
| PCB | 98 × 56 mm, 2 layers (≤ 100×100 keeps JLC's lowest PCB price) |
| MCU | ESP32-C3-WROOM-02-N4 (4 MB flash, USB, BLE) |
| Power | USB-C → TP4054 (~200 mA) → 403450 LiPo (JST-PH 2.0) → RT9080 3.3 V LDO (2 µA Iq) |
| Buttons | 3 × 6×6 mm THT on the front, hand-soldered by JLC |

- `pcb/`: tscircuit project (`npx tsci build`, `npx tsci export flashcard.circuit.tsx -f gerbers -o fab/gerbers.zip`).
  `pcb/fab/gerbers.zip` contains gerbers, drills, `bom.csv` and `pick_and_place.csv`.
- `case/`: FreeCAD form-factor study (`case.FCStd`, `case.step`, renders). No snap fits or screws yet.

## Ordering at JLCPCB
1. Upload `pcb/fab/gerbers.zip` (2 layers, 1.6 mm). Enable PCB Assembly and choose **Economic** and **top side** (all SMD parts are on the back = top layer).
2. Upload `bom.csv` and `pick_and_place.csv`. The buttons SW1–3 are through-hole parts on the other side; JLC hand-solders them (about $3.50 per order + $0.0173 per joint).
3. In the placement preview, check the rotations of **USB1** and **U3**: the export couldn't verify their pin-1 orientation.

### Expected cost (5 boards, prices from 2026-11-21)
| Item | |
|---|---|
| Parts | ≈ $4.46 per board → $22.30 |
| Economic setup + stencil | $8.18 + $1.53 |
| Extended-part fee: 9 types × $3.07 | $27.63 |
| SMT joints (~230 × 5 × $0.0016) | ≈ $1.84 |
| THT hand soldering | ≈ $4.54 |
| PCB (5 pcs, ≤ 100×100) | ≈ $2 |
| **Total before shipping** | **≈ $68** |

The 9 extended parts are U1 C2934560, USB1 C2765186, U2 C668215, U3 C841192, J3 C2856831,
L2 C135265, Q5 C52895, J2 C3029440 and SW C110153. Everything else is a basic part, which has no fee in Economic PCBA.
R32 + R34 (2 Ω + 1 Ω, both basic) replace the reference circuit's single 3 Ω
sense resistor, which is extended.

## ESP32-C3 pin map
| GPIO | Use |
|---|---|
| IO0 | BAT_ADC (VBAT / 2) |
| IO1 | EPD_BUSY |
| IO2 | EPD_PWR_EN (low = panel on; R30 pull-up = strapping high) |
| IO3 / IO4 / IO5 | BTN1 / BTN2 / BTN3, active low, internal pull-ups; deep-sleep wake (only GPIO0–5 can) |
| IO6 / IO7 | EPD_SCLK / EPD_SDI |
| IO8 | EPD_CS (R33 pull-up, strapping) |
| IO9 | BOOT pad on J5 (USB enters download mode without it) |
| IO10 | EPD_DC |
| IO18 / IO19 | USB D− / D+ |
| IO20 (RXD) | EPD_RST |
| IO21 (TXD) | TX pad on J5 |

**Firmware:** `devboard-waveshare-1-54/esp` targets the ESP32-S3 dev board (touch, SD card).
This board needs a port: buttons instead of touch, internal flash instead of SD, 360×240 panel, C3 pins.

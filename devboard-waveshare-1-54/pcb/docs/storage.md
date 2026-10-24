# Persistent storage

Requirement: a few KB, at most about 1 MB, of user data that is rewritten
often, roughly on every button press. The user never needs to take the storage
out.

## Decision: ESP32-S3 internal flash

The ESP32-S3-WROOM-1-N16R8 has 16 MB of flash. Firmware uses about 2–4 MB, so
a dedicated data partition fits easily. The microSD slot (J4, TF-01A, plus its
pull-ups and decoupling capacitor) was removed. This frees GPIO39–41, saves
board area and drops a part from the BOM.

### Firmware

- **Small key/value state** (settings, counters): use **NVS** (Arduino:
  `Preferences`). It spreads wear across its pages and updates atomically.
  Keep frequently changing keys in their own NVS partition, separate from
  configuration that rarely changes.
- **Logs and records**: use **LittleFS** (ESP Component Registry). It is
  power-loss safe and spreads wear dynamically.
- Do **not** use FATFS on raw flash. A power cut during a write can corrupt it.

### Endurance

NOR flash is rated for about 100k erase cycles per 4 KB sector. Wear
leveling spreads those erases over the whole partition:

- NVS appends 32-byte entries. A page holds 126 of them before it has to be
  erased.
- A 1 MB LittleFS partition has 256 sectors, so about 25.6 M sector erases
  in total. Even in the worst case of one erase per press, 1,000 presses a
  day would last decades.
- A larger partition, or waiting 1–2 s after a press to combine bursts of
  presses into one write, extends the lifetime further.

### Caveats

- A sector erase takes about 40–400 ms and stalls code running from flash.
  Write after the e-paper refresh, not inside the button handler.
- Flash writes draw a burst of current. Keep brownout detection enabled. NVS
  and LittleFS recover from an interrupted write, but losing the newest
  record is still possible.
- RTC memory and PSRAM do not survive the power switch. Use them only as a
  buffer in front of flash.

## Backup option: I2C FRAM (footprint only)

U5 + C51 are placed and routed but marked `doNotPlace`, so JLCPCB does not
assemble them. Populate them by hand only if internal flash proves
insufficient.

- **Part:** Infineon **FM24V02A-GTR** (LCSC C382041). 32 KB, SOIC-8,
  2.0–3.6 V, 10^14 write cycles, no erase or write delay, I2C up to 3.4 MHz.
  It is in active production. The MB85RC256V is a common alternative but is
  listed as obsolete or not recommended for new designs.
- **Bus:** shares I2C with the PCF85063 RTC (IO47/IO48, existing 4.7k
  pull-ups).
- **Address:** A0–A2 tied low gives 0x50. The RTC is at 0x51.
- **WP** is tied low, so the whole array is writable.
- **Drop-in substitutes:** any SOIC-8 I2C memory with the standard 24xx
  pinout (A0 A1 A2 VSS / SDA SCL WP VCC) that uses A0–A2 as address pins.
  Examples are MB85RC256V, MB85RC64V, FM24CL64B, and 24C32/64/128/256/512
  EEPROMs.
- **Not compatible:** small 2–16 Kbit parts (FM24CL16B, FM24C16B, 24C04–24C16)
  use the address bits as page select and occupy 0x50–0x57, so they collide
  with the RTC.

## Alternatives considered

| Option | Endurance | Notes | Verdict |
| --- | --- | --- | --- |
| Internal flash (NVS/LittleFS) | ~100k/sector, wear-leveled | No extra parts | **Chosen** |
| I2C FRAM | 10^12–10^14, byte writes | ~$1–5, JLCPCB stock patchy | Backup footprint |
| I2C EEPROM (24Cxx) | ~1M per byte, 5 ms write | Cheap, JLCPCB basic parts | Worse than internal flash |
| External SPI NOR (W25Qxx) | ~100k/sector | Needs GPIOs | Pointless next to 16 MB on-module |
| microSD | Card-dependent | Connector, 3 GPIOs, user-removable | Removed |
| RTC memory / PSRAM | Unlimited | Lost on power-off | Buffer only |

## Sources

- [ESP-IDF: File System Considerations](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/file-system-considerations.html)
- [ESP-IoT-Solution: File System](https://docs.espressif.com/projects/esp-iot-solution/en/latest/storage/file_system.html)
- [esp32.com: NVS Read/Write Over Usage](https://esp32.com/viewtopic.php?p=18021)
- [Meshtastic: On-chip flash endurance](https://meshtastic.discourse.group/t/on-chip-flash-endurance/9939)
- [FM24V02A datasheet](datasheets/FM24V02A_C382041.pdf) ([Infineon](https://www.infineon.com/dgdl/Infineon-FM24V02A_256_Kbit_(32K_8)_Serial_(I2C)_F_RAM-DataSheet-v10_00-EN.pdf), [LCSC C382041](https://fat.lcsc.com/product-detail/C382041.html))
- [JLCPCB MB85RC256V C47538](https://jlcpcb.com/partdetail/C47538), [DigiKey MB85RC256V (obsolete)](https://azcus.digikey.com/en/products/detail/ramxeed/MB85RC256VPNF-G-JNERE1/4022651)

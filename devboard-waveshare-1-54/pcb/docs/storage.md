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
- RTC memory survives deep sleep but not a flat battery, and PSRAM is lost
  in deep sleep. Use them only as a buffer in front of flash.

## Alternatives considered

| Option | Endurance | Notes | Verdict |
| --- | --- | --- | --- |
| Internal flash (NVS/LittleFS) | ~100k/sector, wear-leveled | No extra parts | **Chosen** |
| I2C FRAM | 10^12–10^14, byte writes | ~$1–5, JLCPCB stock patchy | Removed (budget board) |
| I2C EEPROM (24Cxx) | ~1M per byte, 5 ms write | Cheap, JLCPCB basic parts | Worse than internal flash |
| External SPI NOR (W25Qxx) | ~100k/sector | Needs GPIOs | Pointless next to 16 MB on-module |
| microSD | Card-dependent | Connector, 3 GPIOs, user-removable | Removed |
| RTC memory / PSRAM | Unlimited | Lost on battery loss | Buffer only |

## Sources

- [ESP-IDF: File System Considerations](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/file-system-considerations.html)
- [ESP-IoT-Solution: File System](https://docs.espressif.com/projects/esp-iot-solution/en/latest/storage/file_system.html)
- [esp32.com: NVS Read/Write Over Usage](https://esp32.com/viewtopic.php?p=18021)
- [Meshtastic: On-chip flash endurance](https://meshtastic.discourse.group/t/on-chip-flash-endurance/9939)

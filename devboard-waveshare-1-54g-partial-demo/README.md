# Waveshare ESP32-S3-ePaper-1.54G partial-window demo

This is a deliberately small, standalone experiment for the four-colour
`ESP32-S3-ePaper-1.54G` (JD79660AA controller). It tests whether controller
command `0x83` produces a useful black/white-only partial update.

The initialization sequence comes from
[Waveshare's official example](https://github.com/waveshareteam/ESP32-S3-ePaper-1.54G/tree/main/Example/Arduino_3.2.0/examples/08_E_paper_test),
while the experimental window sequence follows the
[official panel manual](https://files.waveshare.com/wiki/ESP32-S3-ePaper-1.54G/1.54inch_e-Paper_G.pdf).

No external buttons or SD card are required. After boot, the sketch:

1. draws a full-screen black/white baseline using the normal waveform;
2. switches to Waveshare's fast waveform and performs a full-screen control
   refresh;
3. changes only the outlined centre window several times; and
4. leaves the final result on screen and prints a timing summary over USB.

The title, corner markers, and footer are outside the partial window. Watch
whether they remain unchanged. The serial log reports how long BUSY remains
active for each refresh; a smaller SPI transfer alone does not prove that the
physical refresh is faster.

The test is intentionally finite. Reset the board to run it again. Repeatedly
refreshing a four-colour e-paper panel at short intervals is not a normal usage
pattern.

## Build

The sketch uses `Adafruit_GFX` only for its in-memory 1-bit canvas. The e-paper
commands are sent directly and do not use GxEPD2.

```sh
arduino-cli compile \
  --fqbn "esp32:esp32:esp32s3:PSRAM=opi,PartitionScheme=default_8MB,FlashSize=8M,USBMode=hwcdc,CDCOnBoot=cdc" \
  devboard-waveshare-1-54g-partial-demo/esp
```

To upload, add `arduino-cli upload` with the same FQBN and the board's port.

## Expected serial output

At 115200 baud, each refresh prints its requested window, transmitted byte
count, and BUSY duration. Interpret the result conservatively:

- outside pixels unchanged: partial-window selection works;
- about 10,000 bytes for full versus fewer bytes for partial: partial RAM
  transfer works;
- shorter BUSY time than the **full fast control**: the physical waveform also
  benefits from the window;
- similar BUSY time to the **full fast control**: it is a partial image/RAM
  update, but not a faster physical refresh.

If the first partial operation corrupts the image, power-cycle the board and
do not repeatedly rerun the test. The partial sequence is based on the panel
datasheet but is absent from Waveshare's supplied Arduino example.

/*
 * ESP32-S3-ePaper-1.54G partial-window experiment.
 *
 * Target: Waveshare ESP32-S3-ePaper-1.54G, 200x200 four-colour panel,
 *         JD79660AA controller. This sketch deliberately emits only the
 *         BLACK (00) and WHITE (01) 2-bpp colour codes.
 *
 * No external buttons are needed. The test runs once at boot and reports
 * refresh timings over USB Serial at 115200 baud.
 * Panel initialization is adapted from Waveshare's MIT-licensed example;
 * partial command 0x83 follows the JD79660AA panel manual.
 */

#include <Adafruit_GFX.h>
#include <Arduino.h>
#include <SPI.h>

namespace {

constexpr int PIN_EPD_PWR  = 6;   // active LOW
constexpr int PIN_EPD_BUSY = 8;   // LOW while busy, HIGH while idle
constexpr int PIN_EPD_RST  = 9;
constexpr int PIN_EPD_DC   = 10;
constexpr int PIN_EPD_CS   = 11;
constexpr int PIN_EPD_SCK  = 12;
constexpr int PIN_EPD_MOSI = 13;

constexpr int PIN_BAT_HOLD = 17;  // battery self-latch

constexpr uint16_t PANEL_W = 200;
constexpr uint16_t PANEL_H = 200;
constexpr uint16_t ROW_BYTES = PANEL_W / 4; // four 2-bpp pixels per byte
constexpr size_t FRAME_BYTES = ROW_BYTES * PANEL_H;

constexpr uint8_t COLOR_BLACK = 0b00;
constexpr uint8_t COLOR_WHITE = 0b01;

// Horizontal partial-window bounds must be multiples of four. End coordinates
// are inclusive. Keep permanent reference graphics outside this rectangle.
constexpr uint16_t WIN_X = 12;
constexpr uint16_t WIN_Y = 62;
constexpr uint16_t WIN_W = 176;
constexpr uint16_t WIN_H = 76;

constexpr uint32_t BUSY_TIMEOUT_MS = 45000;
constexpr uint32_t BETWEEN_TESTS_MS = 2500;

SPISettings epdSpi(4'000'000, MSBFIRST, SPI_MODE0);
GFXcanvas1 canvas(PANEL_W, PANEL_H);
uint8_t frame[FRAME_BYTES];

struct Result {
  const char* label;
  uint16_t x;
  uint16_t y;
  uint16_t w;
  uint16_t h;
  size_t bytes;
  uint32_t busyMs;
  bool timedOut;
};

Result results[6];
size_t resultCount = 0;

void sendCommand(uint8_t command) {
  SPI.beginTransaction(epdSpi);
  digitalWrite(PIN_EPD_DC, LOW);
  digitalWrite(PIN_EPD_CS, LOW);
  SPI.transfer(command);
  digitalWrite(PIN_EPD_CS, HIGH);
  SPI.endTransaction();
}

void sendData(uint8_t data) {
  SPI.beginTransaction(epdSpi);
  digitalWrite(PIN_EPD_DC, HIGH);
  digitalWrite(PIN_EPD_CS, LOW);
  SPI.transfer(data);
  digitalWrite(PIN_EPD_CS, HIGH);
  SPI.endTransaction();
}

void sendDataBlock(const uint8_t* data, size_t length) {
  SPI.beginTransaction(epdSpi);
  digitalWrite(PIN_EPD_DC, HIGH);
  digitalWrite(PIN_EPD_CS, LOW);
  SPI.writeBytes(data, length);
  digitalWrite(PIN_EPD_CS, HIGH);
  SPI.endTransaction();
}

void hardwareReset() {
  digitalWrite(PIN_EPD_RST, HIGH);
  delay(200);
  digitalWrite(PIN_EPD_RST, LOW);
  delay(2);
  digitalWrite(PIN_EPD_RST, HIGH);
  delay(200);
}

// Waveshare's example treats HIGH as idle for power-on and display refresh.
bool waitUntilIdle(uint32_t timeoutMs, uint32_t* elapsedMs = nullptr) {
  const uint32_t started = millis();
  delay(100);
  while (digitalRead(PIN_EPD_BUSY) == LOW) {
    if (millis() - started >= timeoutMs) {
      if (elapsedMs) *elapsedMs = millis() - started;
      return false;
    }
    delay(10);
  }
  if (elapsedMs) *elapsedMs = millis() - started;
  return true;
}

void initPanel(bool fast) {
  hardwareReset();

  sendCommand(0x4D);
  sendData(0x78);

  sendCommand(0x00); // PSR
  sendData(0x0F);
  sendData(0x29);

  sendCommand(0x06); // booster soft start
  constexpr uint8_t booster[] = {0x0D, 0x12, 0x30, 0x20, 0x19, 0x2A, 0x22};
  for (uint8_t value : booster) sendData(value);

  sendCommand(0x50); // VCOM/data interval
  sendData(0x37);

  sendCommand(0x61); // resolution
  sendData(PANEL_W >> 8);
  sendData(PANEL_W & 0xFF);
  sendData(PANEL_H >> 8);
  sendData(PANEL_H & 0xFF);

  sendCommand(0xE9);
  sendData(0x01);
  sendCommand(0x30); // PLL
  sendData(0x08);

  sendCommand(0x04); // power on
  if (!waitUntilIdle(BUSY_TIMEOUT_MS)) {
    Serial.println("ERROR: panel did not become idle during init");
  }

  if (fast) {
    // Additional sequence from Waveshare's EPD_1IN54G_Init_Fast().
    sendCommand(0xE0);
    sendData(0x02);
    sendCommand(0xE6);
    sendData(0x5D);
    sendCommand(0xA5);
    sendData(0x00);
    if (!waitUntilIdle(BUSY_TIMEOUT_MS)) {
      Serial.println("ERROR: panel did not become idle during fast init");
    }
  }
}

// JD79660AA command 0x83. Coordinates are inclusive. Horizontal coordinates
// are quantized by the controller to groups of four pixels.
void setPartialWindow(uint16_t x, uint16_t y, uint16_t w, uint16_t h,
                      bool enabled) {
  uint16_t x0 = x & ~uint16_t(3);
  uint16_t x1 = min<uint16_t>(PANEL_W - 1, (x + w - 1) | 3);
  uint16_t y0 = y;
  uint16_t y1 = min<uint16_t>(PANEL_H - 1, y + h - 1);

  sendCommand(0x83); // PTL: Partial Window
  sendData((x0 >> 8) & 0x03); // PTH_ENB=0, HRST[9:8]
  sendData(x0 & 0xFC);        // HRST[7:2], low two bits ignored
  sendData((x1 >> 8) & 0x03); // HRED[9:8]
  sendData(x1 & 0xFC);        // HRED[7:2], low two bits forced to 11
  sendData((y0 >> 8) & 0x03); // VRST[9:8]
  sendData(y0 & 0xFF);        // VRST[7:0]
  sendData((y1 >> 8) & 0x03); // VRED[9:8]
  sendData(y1 & 0xFF);        // VRED[7:0]
  sendData(enabled ? 0x01 : 0x00); // PMODE
}

void canvasToFrame() {
  memset(frame, 0x55, sizeof(frame)); // four WHITE pixels per byte
  for (uint16_t y = 0; y < PANEL_H; ++y) {
    for (uint16_t x = 0; x < PANEL_W; ++x) {
      const uint8_t colour = canvas.getPixel(x, y) ? COLOR_BLACK : COLOR_WHITE;
      const size_t index = y * ROW_BYTES + x / 4;
      const uint8_t shift = 6 - 2 * (x & 3);
      frame[index] = (frame[index] & ~(uint8_t(0x03) << shift)) |
                     (colour << shift);
    }
  }
}

Result updateWindow(const char* label, uint16_t x, uint16_t y,
                    uint16_t w, uint16_t h, bool partial) {
  const uint16_t x0 = x & ~uint16_t(3);
  const uint16_t x1 = min<uint16_t>(PANEL_W - 1, (x + w - 1) | 3);
  const uint16_t y1 = min<uint16_t>(PANEL_H - 1, y + h - 1);
  const uint16_t actualW = x1 - x0 + 1;
  const uint16_t actualH = y1 - y + 1;
  const uint16_t bytesPerRow = actualW / 4;

  canvasToFrame();
  setPartialWindow(x0, y, actualW, actualH, partial);
  sendCommand(0x10); // DTM: data start transmission
  for (uint16_t row = y; row <= y1; ++row) {
    sendDataBlock(frame + row * ROW_BYTES + x0 / 4, bytesPerRow);
  }

  sendCommand(0x12); // display refresh
  sendData(0x00);
  uint32_t busyMs = 0;
  const bool idle = waitUntilIdle(BUSY_TIMEOUT_MS, &busyMs);

  Result result{label, x0, y, actualW, actualH,
                size_t(bytesPerRow) * actualH, busyMs, !idle};
  Serial.printf("%-18s window=(%u,%u %ux%u) bytes=%u BUSY=%lu ms%s\n",
                label, result.x, result.y, result.w, result.h,
                static_cast<unsigned>(result.bytes),
                static_cast<unsigned long>(result.busyMs),
                result.timedOut ? " TIMEOUT" : "");
  return result;
}

void drawCentred(const char* text, int16_t y, uint8_t size, uint16_t colour) {
  canvas.setTextSize(size);
  canvas.setTextColor(colour);
  int16_t x1, y1;
  uint16_t w, h;
  canvas.getTextBounds(text, 0, y, &x1, &y1, &w, &h);
  canvas.setCursor((PANEL_W - w) / 2, y);
  canvas.print(text);
}

void drawBaseline() {
  canvas.fillScreen(0);
  canvas.drawRect(0, 0, PANEL_W, PANEL_H, 1);
  canvas.fillRect(4, 4, 7, 7, 1);
  canvas.fillRect(PANEL_W - 11, 4, 7, 7, 1);
  canvas.fillRect(4, PANEL_H - 11, 7, 7, 1);
  canvas.fillRect(PANEL_W - 11, PANEL_H - 11, 7, 7, 1);

  drawCentred("1.54G PARTIAL", 14, 2, 1);
  drawCentred("MONO TEST", 34, 2, 1);
  canvas.drawRect(WIN_X - 2, WIN_Y - 2, WIN_W + 4, WIN_H + 4, 1);
  drawCentred("BASELINE", WIN_Y + 16, 2, 1);
  drawCentred("FULL REFRESH", WIN_Y + 39, 2, 1);
  drawCentred("CORNERS MUST NOT CHANGE", 158, 1, 1);
  drawCentred("TIMINGS ON USB SERIAL", 177, 1, 1);
}

void drawWindowMessage(const char* top, const char* bottom, bool inverted) {
  canvas.fillRect(WIN_X, WIN_Y, WIN_W, WIN_H, inverted ? 1 : 0);
  const uint16_t textColour = inverted ? 0 : 1;
  drawCentred(top, WIN_Y + 14, 2, textColour);
  drawCentred(bottom, WIN_Y + 42, 2, textColour);
}

void saveResult(const Result& result) {
  if (resultCount < sizeof(results) / sizeof(results[0])) {
    results[resultCount++] = result;
  }
}

void printSummary() {
  Serial.println("\nSummary");
  Serial.println("label               bytes    BUSY ms");
  for (size_t i = 0; i < resultCount; ++i) {
    Serial.printf("%-18s %5u    %7lu%s\n", results[i].label,
                  unsigned(results[i].bytes),
                  static_cast<unsigned long>(results[i].busyMs),
                  results[i].timedOut ? " TIMEOUT" : "");
  }
  Serial.println("\nInspect the title, footer, and four corner squares.");
  Serial.println("If they changed, window isolation failed.");
  Serial.println("Reset the board to repeat the finite test.");
}

void runTest() {
  Serial.println("\n=== 1.54G partial monochrome test ===");
  Serial.println("Initialising normal waveform...");
  initPanel(false);
  drawBaseline();
  saveResult(updateWindow("full baseline", 0, 0, PANEL_W, PANEL_H, false));
  delay(BETWEEN_TESTS_MS);

  Serial.println("Switching to Waveshare fast waveform...");
  initPanel(true);
  saveResult(updateWindow("full fast control", 0, 0, PANEL_W, PANEL_H, false));
  delay(BETWEEN_TESTS_MS);

  drawWindowMessage("PARTIAL 1", "BLACK ON WHITE", false);
  saveResult(updateWindow("partial white", WIN_X, WIN_Y, WIN_W, WIN_H, true));
  delay(BETWEEN_TESTS_MS);

  drawWindowMessage("PARTIAL 2", "WHITE ON BLACK", true);
  saveResult(updateWindow("partial black", WIN_X, WIN_Y, WIN_W, WIN_H, true));
  delay(BETWEEN_TESTS_MS);

  drawWindowMessage("PARTIAL 3", "BLACK ON WHITE", false);
  saveResult(updateWindow("partial white 2", WIN_X, WIN_Y, WIN_W, WIN_H, true));
  delay(BETWEEN_TESTS_MS);

  drawWindowMessage("TEST COMPLETE", "CHECK CORNERS", false);
  saveResult(updateWindow("partial final", WIN_X, WIN_Y, WIN_W, WIN_H, true));
  printSummary();
}

} // namespace

void setup() {
  // Hold battery power before doing anything slow. Harmless while USB-powered.
  pinMode(PIN_BAT_HOLD, OUTPUT);
  digitalWrite(PIN_BAT_HOLD, HIGH);

  pinMode(PIN_EPD_PWR, OUTPUT);
  digitalWrite(PIN_EPD_PWR, LOW);
  pinMode(PIN_EPD_BUSY, INPUT);
  pinMode(PIN_EPD_RST, OUTPUT);
  pinMode(PIN_EPD_DC, OUTPUT);
  pinMode(PIN_EPD_CS, OUTPUT);
  digitalWrite(PIN_EPD_CS, HIGH);

  Serial.begin(115200);
  delay(1500);
  SPI.begin(PIN_EPD_SCK, -1, PIN_EPD_MOSI, PIN_EPD_CS);
  runTest();
}

void loop() {
  delay(1000);
}

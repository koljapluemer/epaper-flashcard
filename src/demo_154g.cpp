// Demo for Waveshare ESP32-S3-ePaper-1.54G
// 200x200, 4-color (Black / White / Red / Yellow), driver: JD79660AA
// Touch: FT6336 capacitive touch on I2C (pins reserved; detected if present)

#include <Arduino.h>
#include <SPI.h>

#include <GxEPD2_4C.h>
#include <epd4c/GxEPD2_154c_GDEM0154F51H.h>

#include <TouchDrvFT6X36.hpp>

// --- E-Paper SPI pins (from Waveshare schematic) ---
#define EPD_SCK  12
#define EPD_MOSI 13
#define EPD_CS   11
#define EPD_DC   10
#define EPD_RST   9
#define EPD_BUSY  8
#define EPD_PWR   6  // active-high power enable

// --- I2C bus (shared: RTC, SHTC3, ES8311, FT6336) ---
#define I2C_SDA 47
#define I2C_SCL 48

// --- Touch (FT6336) ---
#define TP_RST  7
#define TP_INT  21

GxEPD2_4C<GxEPD2_154c_GDEM0154F51H, GxEPD2_154c_GDEM0154F51H::HEIGHT> display(
    GxEPD2_154c_GDEM0154F51H(EPD_CS, EPD_DC, EPD_RST, EPD_BUSY));

TouchDrvFT6X36 touch;
bool touchAvailable = false;

void drawDemo() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);

    // Four quadrants, one per display color
    display.fillRect(0,   0,   100, 100, GxEPD_BLACK);
    display.fillRect(100, 0,   100, 100, GxEPD_RED);
    display.fillRect(0,   100, 100, 100, GxEPD_YELLOW);
    // bottom-right stays GxEPD_WHITE from fillScreen

    // Labels (contrast-appropriate text colors)
    display.setTextSize(2);
    display.setTextWrap(false);

    display.setTextColor(GxEPD_WHITE);
    display.setCursor(8, 40);
    display.print("Black");

    display.setTextColor(GxEPD_WHITE);
    display.setCursor(108, 40);
    display.print("Red");

    display.setTextColor(GxEPD_BLACK);
    display.setCursor(8, 140);
    display.print("Yellow");

    display.setTextColor(GxEPD_BLACK);
    display.setCursor(108, 140);
    display.print("White");

    // Center label
    display.setTextSize(1);
    display.setTextColor(GxEPD_BLACK);
    display.setCursor(60, 96);
    display.print("1.54G OK");
  } while (display.nextPage());

  Serial.println("Refresh triggered. Full update takes ~20s.");
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\nESP32-S3-ePaper-1.54G demo");

  // PWR is active-LOW (P-FET: LOW = display powered on)
  pinMode(EPD_PWR, OUTPUT);
  digitalWrite(EPD_PWR, LOW);
  delay(100);

  // Configure SPI with Waveshare pin mapping before GxEPD2 init
  SPI.begin(EPD_SCK, /*MISO*/ -1, EPD_MOSI, EPD_CS);

  display.init(115200, true, 2, false);
  display.setRotation(0);
  Serial.println("Display init done");

  // Touch init — pass SDA/SCL so SensorLib calls Wire.begin() internally
  touchAvailable = touch.begin(Wire, 0x38, I2C_SDA, I2C_SCL);  // FT6336 fixed address 0x38
  if (touchAvailable) {
    Serial.println("Touch FT6336 detected");
  } else {
    Serial.println("Touch not detected (may be reserved/unpopulated on this revision)");
  }

  drawDemo();
}

void loop() {
  if (!touchAvailable || !touch.isPressed()) {
    delay(50);
    return;
  }

  const auto& pts = touch.getTouchPoints();
  for (int i = 0; i < pts.getPointCount(); i++) {
    const auto& p = pts.getPoint(i);
    Serial.printf("Touch[%d]: x=%d y=%d\n", i, p.x, p.y);
  }
}

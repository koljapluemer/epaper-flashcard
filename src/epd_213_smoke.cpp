#include <Arduino.h>
#include <GxEPD2_BW.h>

#define EPD_BUSY 16
#define EPD_RST  4
#define EPD_DC   5
#define EPD_CS   15

using Panel = GxEPD2_213_B74;
GxEPD2_BW<Panel, Panel::HEIGHT> display(Panel(EPD_CS, EPD_DC, EPD_RST, EPD_BUSY));

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=== EPD 2.13\" smoke test ===");

  Serial.println("init display...");
  display.init(115200, true, 2, false);
  display.setRotation(1);
  Serial.println("init OK");

  Serial.println("full refresh: white...");
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
  } while (display.nextPage());
  Serial.println("white OK");

  Serial.println("full refresh: pattern...");
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.fillRect(0, 0, display.width(), display.height() / 2, GxEPD_BLACK);
    display.setTextColor(GxEPD_WHITE);
    display.setTextSize(2);
    display.setCursor(8, 8);
    display.print("SMOKE OK");
  } while (display.nextPage());
  Serial.println("pattern OK — done");
}

void loop() {}

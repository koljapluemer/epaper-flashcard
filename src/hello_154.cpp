#include <Arduino.h>
#include <GxEPD2_BW.h>
#include <ESP8266WiFi.h>
#include <Fonts/FreeMonoBold24pt7b.h>

// Waveshare 1.54" Rev 2.1 wiring for ESP8266
#define EPD_BUSY 12  // D6
#define EPD_RST 5    // D1
#define EPD_DC 4     // D2
#define EPD_CS 15    // D8

// D_IN: D7 13
// CLK: D5 14
// CS: D8 15
// DC: D2 4
// RST: D1 5
// BSU: D6 12

using DisplayPanel = GxEPD2_154_GDEY0154D67;

GxEPD2_BW<DisplayPanel, DisplayPanel::HEIGHT> display(
    DisplayPanel(EPD_CS, EPD_DC, EPD_RST, EPD_BUSY));
const auto *const FONT = &FreeMonoBold24pt7b;


// void drawHelloWorld() {


//   do {
//     display.fillScreen(GxEPD_WHITE);
//     display.drawRect(0, 0, display.width(), display.height(), GxEPD_BLACK);
//     display.setCursor(20, 40);
//     display.setTextSize(2);
//     display.print("Hello");
//     display.setCursor(20, 70);
//     display.print("1.54");
//     display.setCursor(20, 100);
//     display.setTextSize(1);
//     display.print("GDEY0154D67");
//   } while (display.nextPage());
// }

void sendString(const char *const text, int offset_x = 0, int offset_y = 0) {
    GFXcanvas1 canvas(display.width() - offset_x, display.height() - offset_y);
    canvas.setTextSize(4);
    canvas.setRotation(180);
    canvas.println(text);
    display.drawBitmap(offset_x, offset_y, canvas.getBuffer(), display.width() - offset_x, display.height() - offset_y, GxEPD_BLACK, GxEPD_WHITE);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("Hello 1.54 starting");


  display.init(115200, true, 2, false);
  Serial.println("Display init complete");
  display.setRotation(0);
  display.setTextColor(GxEPD_BLACK);
  display.setFullWindow();
  display.setFont(FONT);

  display.firstPage();
  display.clearScreen();
  
  do {
    sendString("Penis!", 30, 30);
  } while (display.nextPage()); 

}

void loop() {
  delay(1000);
}

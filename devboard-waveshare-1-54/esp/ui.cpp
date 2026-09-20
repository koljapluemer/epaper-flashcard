#include <Arduino.h>
#include <map>
#include <SPI.h>
#include <GxEPD2_BW.h>
#include <U8g2_for_Adafruit_GFX.h>
#include "config.h"
#include "icons.h"
#include "ui.h"
#include "welcome_store.h"

// Single-page buffer (page height = HEIGHT): the firstPage()/nextPage() body
// runs exactly once, so reading bitmaps from SD inside it is safe.
static GxEPD2_BW<GxEPD2_154_D67, GxEPD2_154_D67::HEIGHT> display(
    GxEPD2_154_D67(PIN_EPD_CS, PIN_EPD_DC, PIN_EPD_RST, PIN_EPD_BUSY));
static U8G2_FOR_ADAFRUIT_GFX u8f;

// UI text is fixed ASCII (sync/empty/fatal screens); card content is bitmaps.
static const uint8_t *FONT_BIG   = u8g2_font_9x15_tf;
static const uint8_t *FONT_SMALL = u8g2_font_6x12_tf;

static uint8_t bmpBuf[BMP_BYTES];

void uiPowerOn() {
  pinMode(PIN_EPD_PWR, OUTPUT);
  digitalWrite(PIN_EPD_PWR, LOW);    // e-paper rail ON (active low)
}

void uiBegin() {
  delay(100);
  SPI.begin(PIN_EPD_SCK, -1, PIN_EPD_MOSI, PIN_EPD_CS);
  // initial=true: the first refresh is forced full, which cleans the panel at boot.
  display.init(0, true, 2, false);
  display.setRotation(0);

  u8f.begin(display);
  u8f.setFontMode(1);
  u8f.setForegroundColor(GxEPD_BLACK);
}

// ---- Helpers ----
static void selectFont(const uint8_t *font) {
  u8f.setFont(font);
  u8f.setFontMode(1);
}

static void printCentered(int cx, int baselineY, const char *text) {
  int w = u8f.getUTF8Width(text);
  u8f.setCursor(cx - w / 2, baselineY);
  u8f.print(text);
}

static void drawIcon(const uint8_t *icon, int x, int y) {
  display.drawBitmap(x, y, icon, ICON_PX, ICON_PX, GxEPD_BLACK);
}

static void drawDashedLine(int y) {
  for (int x = 0; x < W; x += 8) {
    display.drawLine(x, y, min(x + 4, W - 1), y, GxEPD_BLACK);
  }
}

static void drawTextButton(int x, int y, int w, int h, const char *label, bool inverted) {
  if (inverted) display.fillRect(x, y, w, h, GxEPD_BLACK);
  else          display.drawRect(x, y, w, h, GxEPD_BLACK);
  selectFont(FONT_BIG);
  u8f.setForegroundColor(inverted ? GxEPD_WHITE : GxEPD_BLACK);
  printCentered(x + w / 2, y + h / 2 + 5, label);
  u8f.setForegroundColor(GxEPD_BLACK);
}

// Draws a card bitmap at (0, y). Blank on any SD hiccup rather than garbage.
static void drawCardBitmap(const Flashcard &c, bool front, int y) {
  if (readCardBitmap(c, front, bmpBuf)) {
    display.drawBitmap(0, y, bmpBuf, BMP_W, BMP_H, GxEPD_BLACK);
  }
}

// ---- Card screen ----
void uiRenderCard(const Flashcard *card, bool revealed, Region region, Refresh mode) {
  int wy = 0, wh = H;
  if (mode == REFRESH_FULL) {
    display.setFullWindow();
  } else {
    wy = (region == REGION_LOWER_HALF) ? BACK_Y : CONTENT_Y;
    wh = H - wy;
    display.setPartialWindow(0, wy, W, wh);
  }
  auto inWindow = [&](int y, int h) { return y < wy + wh && y + h > wy; };

  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);

    if (inWindow(TOP_STRIP_Y, STRIP_H)) {
      drawIcon(ICON_RELOAD,  ICON_LEFT_X,  TOP_STRIP_Y);
      drawIcon(ICON_CONNECT, ICON_RIGHT_X, TOP_STRIP_Y);
    }

    if (inWindow(FRONT_Y, HALF_H)) {
      if (card) {
        drawCardBitmap(*card, true, FRONT_Y);
      } else {
        selectFont(FONT_SMALL);
        printCentered(MID_X, FRONT_Y + 36, "No flashcards on SD.");
        printCentered(MID_X, FRONT_Y + 54, "Tap the link icon (top");
        printCentered(MID_X, FRONT_Y + 68, "right) to sync some in.");
      }
    }

    if (inWindow(BACK_Y, 1)) drawDashedLine(BACK_Y);
    if (card && revealed && inWindow(BACK_Y, HALF_H)) drawCardBitmap(*card, false, BACK_Y);

    if (card && inWindow(BOTTOM_STRIP_Y, STRIP_H)) {
      if (revealed) {
        drawIcon(ICON_WRONG,   ICON_LEFT_X,  BOTTOM_STRIP_Y);
        drawIcon(ICON_CORRECT, ICON_RIGHT_X, BOTTOM_STRIP_Y);
      } else {
        drawIcon(ICON_REVEAL,  ICON_CENTER_X, BOTTOM_STRIP_Y);
      }
    }
  } while (display.nextPage());
}

// ---- Sync screen ----
static void drawSyncPage(bool restartInverted) {
  display.fillScreen(GxEPD_WHITE);
  selectFont(FONT_BIG);
  printCentered(MID_X, SYNC_TITLE_Y, "Sync Mode");
  drawTextButton(SYNC_RST_X, SYNC_RST_Y, SYNC_RST_W, SYNC_RST_H, "Restart", restartInverted);
}

void uiRenderSync() {
  display.setFullWindow();
  display.firstPage();
  do { drawSyncPage(false); } while (display.nextPage());
}

void uiFlashRestart() {
  display.setPartialWindow(SYNC_RST_X, SYNC_RST_Y, SYNC_RST_W, SYNC_RST_H);
  display.firstPage();
  do { drawSyncPage(true); } while (display.nextPage());
}

// ---- One-off full-screen messages ----
void uiRenderFatalSd() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    selectFont(FONT_BIG);
    printCentered(MID_X, 90, "No SD card");
    selectFont(FONT_SMALL);
    printCentered(MID_X, 116, "Insert a FAT32 card,");
    printCentered(MID_X, 132, "then reset.");
  } while (display.nextPage());
}

// ---- Power-off screen ----
//   y   0..31   welcome banner (bitmap from the manager, if set)
//   y  32..     "You practiced n times", separator, then the box counts --
//               or a hint when nothing has been practiced yet
constexpr int BYE_HEADLINE_Y = 52;
constexpr int BYE_SEPARATOR_Y = 60;
constexpr int BYE_BOXES_Y = 78;
constexpr int BYE_LINE_H = 16;
constexpr int BYE_TEXT_X = 8;
constexpr int BYE_MAX_BOXES = 5;

static void drawWelcomeBanner() {
  if (welcomeReadBitmap(bmpBuf)) display.drawBitmap(0, 0, bmpBuf, W, WELCOME_H, GxEPD_BLACK);
}

static void drawNoStats() {
  selectFont(FONT_BIG);
  printCentered(MID_X, 98, "No stats yet.");
  printCentered(MID_X, 118, "Turn on and");
  printCentered(MID_X, 138, "get started.");
}

static void drawCountLine(int baselineY, const char *label, int box, int count) {
  char line[32];
  if (box < 0) snprintf(line, sizeof(line), "%s: %d", label, count);
  else         snprintf(line, sizeof(line), "%s %d: %d", label, box, count);
  u8f.setCursor(BYE_TEXT_X, baselineY);
  u8f.print(line);
}

static void drawStats(uint32_t trials, int unpracticed, const std::map<int, int> &boxes) {
  char headline[32];
  snprintf(headline, sizeof(headline), "You practiced %u time%s",
           (unsigned)trials, trials == 1 ? "" : "s");
  selectFont(FONT_BIG);
  if (u8f.getUTF8Width(headline) > W) selectFont(FONT_SMALL);   // huge counts
  printCentered(MID_X, BYE_HEADLINE_Y, headline);
  display.drawFastHLine(0, BYE_SEPARATOR_Y, W, GxEPD_BLACK);

  selectFont(FONT_BIG);
  u8f.setCursor(BYE_TEXT_X, BYE_BOXES_Y);
  u8f.print("Boxes:");
  int y = BYE_BOXES_Y + BYE_LINE_H;
  drawCountLine(y, "Unpracticed", -1, unpracticed);
  int shown = 0;
  for (const auto &box : boxes) {
    if (shown++ == BYE_MAX_BOXES) break;
    y += BYE_LINE_H;
    drawCountLine(y, "Box", box.first, box.second);
  }
}

void uiRenderBye(uint32_t sessionTrials) {
  int unpracticed = 0;
  std::map<int, int> boxes;   // box -> practiced cards in it, ascending
  for (const auto &c : cards) {
    if (c.practiced) boxes[c.box]++;
    else unpracticed++;
  }

  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    drawWelcomeBanner();
    if (boxes.empty()) drawNoStats();
    else drawStats(sessionTrials, unpracticed, boxes);
  } while (display.nextPage());
}

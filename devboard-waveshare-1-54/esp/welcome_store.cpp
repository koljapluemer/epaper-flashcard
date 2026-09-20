#include <Arduino.h>
#include "SD_MMC.h"
#include "config.h"
#include "card_store.h"
#include "welcome_store.h"

static const char *WELCOME_PATH = "/welcome.bin";
static const char *WELCOME_TMP_PATH = "/welcome.tmp";

bool welcomeBodyValid(const uint8_t *body, size_t len) {
  if (len < 2 + WELCOME_BYTES) return false;
  size_t textLen = body[0] | ((size_t)body[1] << 8);
  return 2 + textLen + WELCOME_BYTES == len;
}

bool welcomeSave(const uint8_t *body, size_t len) {
  if (!sdOk || !welcomeBodyValid(body, len)) return false;
  SD_MMC.remove(WELCOME_TMP_PATH);
  File f = SD_MMC.open(WELCOME_TMP_PATH, FILE_WRITE);
  if (!f) return false;
  bool ok = f.write(body, len) == len;
  f.close();
  if (ok) {
    SD_MMC.remove(WELCOME_PATH);
    ok = SD_MMC.rename(WELCOME_TMP_PATH, WELCOME_PATH);
  }
  if (!ok) SD_MMC.remove(WELCOME_TMP_PATH);
  return ok;
}

// Opens the file and reads the text length; the file must be exactly one record.
static bool openWelcome(File &f, uint16_t &textLen) {
  if (!sdOk) return false;
  f = SD_MMC.open(WELCOME_PATH, FILE_READ);
  if (!f) return false;
  uint8_t lenBuf[2];
  if (f.read(lenBuf, 2) != 2) { f.close(); return false; }
  textLen = lenBuf[0] | ((uint16_t)lenBuf[1] << 8);
  if (f.size() != 2 + (size_t)textLen + WELCOME_BYTES) { f.close(); return false; }
  return true;
}

bool welcomeReadBitmap(uint8_t *buf) {
  File f;
  uint16_t textLen;
  if (!openWelcome(f, textLen)) return false;
  bool ok = f.seek(2 + textLen) && f.read(buf, WELCOME_BYTES) == WELCOME_BYTES;
  f.close();
  return ok;
}

bool welcomeReadText(std::vector<uint8_t> &out) {
  out.clear();
  File f;
  uint16_t textLen;
  if (!openWelcome(f, textLen)) return true;   // unset is not an error
  out.resize(textLen);
  bool ok = f.read(out.data(), textLen) == textLen;
  f.close();
  if (!ok) out.clear();
  return ok;
}

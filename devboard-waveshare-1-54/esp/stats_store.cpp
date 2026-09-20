#include <Arduino.h>
#include "SD_MMC.h"
#include "config.h"
#include "card_store.h"
#include "stats_store.h"

static const char *SESSIONS_PATH = "/sessions.bin";
static constexpr size_t RECORD_BYTES = 8;

static bool haveRecord = false;      // this boot's record exists on the SD
static uint32_t recordOffset = 0;
static uint32_t practiced = 0;
static uint32_t syncTs = 0;

static void putU32(uint8_t *out, uint32_t v) {
  out[0] = (uint8_t)v;         out[1] = (uint8_t)(v >> 8);
  out[2] = (uint8_t)(v >> 16); out[3] = (uint8_t)(v >> 24);
}

// Appends this boot's empty record on first use.
static bool ensureRecord() {
  if (haveRecord) return true;
  if (!sdOk) return false;
  File f = SD_MMC.open(SESSIONS_PATH, FILE_APPEND);
  if (!f) { Serial.println("stats: open for append FAILED"); return false; }
  uint32_t size = f.size();
  uint8_t rec[RECORD_BYTES] = {};
  bool ok = f.write(rec, RECORD_BYTES) == RECORD_BYTES;
  f.close();
  if (ok) { haveRecord = true; recordOffset = size; }
  return ok;
}

// Rewrites this boot's record in place (tiny, aligned, so a torn write is unlikely).
static void writeRecord() {
  File f = SD_MMC.open(SESSIONS_PATH, "r+");
  if (!f) { Serial.println("stats: open for update FAILED"); return; }
  uint8_t rec[RECORD_BYTES];
  putU32(rec, practiced);
  putU32(rec + 4, syncTs);
  bool ok = f.seek(recordOffset) && f.write(rec, RECORD_BYTES) == RECORD_BYTES;
  f.close();
  if (!ok) Serial.println("stats: record update FAILED");
}

void statsRecordTrial() {
  if (!ensureRecord()) return;
  practiced++;
  writeRecord();
}

void statsRecordSync(uint32_t unixSec) {
  if (!ensureRecord()) return;
  syncTs = unixSec;
  writeRecord();
  Serial.printf("stats: synced at %u, %u practiced this session\n",
                (unsigned)unixSec, (unsigned)practiced);
}

uint32_t statsSessionTrials() { return practiced; }

bool statsReadAll(std::vector<uint8_t> &out) {
  out.clear();
  if (!sdOk || !SD_MMC.exists(SESSIONS_PATH)) return true;   // no sessions yet
  File f = SD_MMC.open(SESSIONS_PATH, FILE_READ);
  if (!f) return false;
  size_t n = f.size() / RECORD_BYTES * RECORD_BYTES;
  out.resize(n);
  bool ok = f.read(out.data(), n) == n;
  f.close();
  return ok;
}

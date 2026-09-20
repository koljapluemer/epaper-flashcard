// Session stats on the SD: /sessions.bin, one fixed 8-byte record per session
// (= one boot in which something was practiced or a sync happened):
//   [u32 practiced LE][u32 syncTs LE]
// `practiced` counts graded trials. `syncTs` is the unix time the manager sent
// when it connected (0 = the session never synced). The device has no clock,
// so a session is only dated by the syncs around it; the manager works that out.
// The file is append-only; only the current boot's record is updated in place.
#pragma once
#include <Arduino.h>
#include <vector>

void statsRecordTrial();                    // one graded card in this session
void statsRecordSync(uint32_t unixSec);     // manager connected; latest one wins
uint32_t statsSessionTrials();               // graded trials since this boot
bool statsReadAll(std::vector<uint8_t> &out);   // whole file, records back to back

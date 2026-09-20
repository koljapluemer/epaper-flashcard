// The welcome banner shown on the power-off screen: /welcome.bin on the SD,
//   [u16 textLen LE][text UTF-8][bitmap]
// The bitmap is WELCOME_H rows, full width, 1bpp MSB-first (like card bitmaps),
// rendered by the manager. The text is carried only so the manager can show it
// again; the device just draws the bitmap.
//
// Uploaded through the fast PUT protocol with WELCOME_TARGET_ID as the card id.
#pragma once
#include <Arduino.h>
#include <vector>

constexpr uint32_t WELCOME_TARGET_ID = 0xFFFFFFFF;   // never a real card id

bool welcomeBodyValid(const uint8_t *body, size_t len);
bool welcomeSave(const uint8_t *body, size_t len);   // atomic; validates first
bool welcomeReadBitmap(uint8_t *buf);                // WELCOME_BYTES; false if unset
bool welcomeReadText(std::vector<uint8_t> &out);     // empty if unset

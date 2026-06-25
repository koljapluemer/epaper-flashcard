#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("\n=== ESP8285 alive ===");
  Serial.print("Chip ID: 0x");
  Serial.println(ESP.getChipId(), HEX);
  Serial.print("Flash size: ");
  Serial.print(ESP.getFlashChipSize() / 1024);
  Serial.println(" KB");
  Serial.print("Free heap: ");
  Serial.println(ESP.getFreeHeap());
  Serial.println("Send any character to ping.");
}

void loop() {
  Serial.print("alive, uptime ");
  Serial.print(millis() / 1000);
  Serial.println("s");
  delay(1000);
}

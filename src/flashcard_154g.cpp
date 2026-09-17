// Flashcard quiz for ESP32-S3-ePaper-1.54G
// Single button on GPIO1: press to reveal answer, press again for next card.
// Reveal uses partial refresh (answer area only); next card uses full refresh.

#include <Arduino.h>
#include <SPI.h>
#include <GxEPD2_4C.h>
#include <epd4c/GxEPD2_154c_GDEM0154F51H.h>

#define EPD_SCK  12
#define EPD_MOSI 13
#define EPD_CS   11
#define EPD_DC   10
#define EPD_RST   9
#define EPD_BUSY  8
#define EPD_PWR   6

#define BUTTON_PIN   1
#define DEBOUNCE_MS  150

// y-coordinate where answer area begins (below question text)
#define ANSWER_Y  110

GxEPD2_4C<GxEPD2_154c_GDEM0154F51H, GxEPD2_154c_GDEM0154F51H::HEIGHT> display(
    GxEPD2_154c_GDEM0154F51H(EPD_CS, EPD_DC, EPD_RST, EPD_BUSY));

struct QA { const char* q; const char* a; };

static const QA cards[] = {
  {"Afghanistan", "Kabul"},         {"Albania", "Tirana"},
  {"Algeria", "Algiers"},           {"Andorra", "Andorra la Vella"},
  {"Angola", "Luanda"},             {"Argentina", "Buenos Aires"},
  {"Armenia", "Yerevan"},           {"Australia", "Canberra"},
  {"Austria", "Vienna"},            {"Azerbaijan", "Baku"},
  {"Bahamas", "Nassau"},            {"Bahrain", "Manama"},
  {"Bangladesh", "Dhaka"},          {"Belarus", "Minsk"},
  {"Belgium", "Brussels"},          {"Belize", "Belmopan"},
  {"Benin", "Porto-Novo"},          {"Bhutan", "Thimphu"},
  {"Bolivia", "Sucre"},             {"Bosnia & Herz.", "Sarajevo"},
  {"Botswana", "Gaborone"},         {"Brazil", "Brasilia"},
  {"Bulgaria", "Sofia"},            {"Burkina Faso", "Ouagadougou"},
  {"Burundi", "Gitega"},            {"Cambodia", "Phnom Penh"},
  {"Cameroon", "Yaounde"},          {"Canada", "Ottawa"},
  {"Chad", "N'Djamena"},            {"Chile", "Santiago"},
  {"China", "Beijing"},             {"Colombia", "Bogota"},
  {"Croatia", "Zagreb"},            {"Cuba", "Havana"},
  {"Cyprus", "Nicosia"},            {"Czechia", "Prague"},
  {"DR Congo", "Kinshasa"},         {"Denmark", "Copenhagen"},
  {"Ecuador", "Quito"},             {"Egypt", "Cairo"},
  {"Estonia", "Tallinn"},           {"Ethiopia", "Addis Ababa"},
  {"Fiji", "Suva"},                 {"Finland", "Helsinki"},
  {"France", "Paris"},              {"Georgia", "Tbilisi"},
  {"Germany", "Berlin"},            {"Ghana", "Accra"},
  {"Greece", "Athens"},             {"Guatemala", "Guatemala City"},
  {"Hungary", "Budapest"},          {"Iceland", "Reykjavik"},
  {"India", "New Delhi"},           {"Indonesia", "Jakarta"},
  {"Iran", "Tehran"},               {"Iraq", "Baghdad"},
  {"Ireland", "Dublin"},            {"Israel", "Jerusalem"},
  {"Italy", "Rome"},                {"Jamaica", "Kingston"},
  {"Japan", "Tokyo"},               {"Jordan", "Amman"},
  {"Kazakhstan", "Astana"},         {"Kenya", "Nairobi"},
  {"Kuwait", "Kuwait City"},        {"Laos", "Vientiane"},
  {"Latvia", "Riga"},               {"Lebanon", "Beirut"},
  {"Libya", "Tripoli"},             {"Lithuania", "Vilnius"},
  {"Luxembourg", "Luxembourg"},     {"Madagascar", "Antananarivo"},
  {"Malaysia", "Kuala Lumpur"},     {"Mali", "Bamako"},
  {"Malta", "Valletta"},            {"Mexico", "Mexico City"},
  {"Moldova", "Chisinau"},          {"Mongolia", "Ulaanbaatar"},
  {"Morocco", "Rabat"},             {"Mozambique", "Maputo"},
  {"Myanmar", "Naypyidaw"},         {"Nepal", "Kathmandu"},
  {"Netherlands", "Amsterdam"},     {"New Zealand", "Wellington"},
  {"Nigeria", "Abuja"},             {"North Korea", "Pyongyang"},
  {"Norway", "Oslo"},               {"Oman", "Muscat"},
  {"Pakistan", "Islamabad"},        {"Panama", "Panama City"},
  {"Paraguay", "Asuncion"},         {"Peru", "Lima"},
  {"Philippines", "Manila"},        {"Poland", "Warsaw"},
  {"Portugal", "Lisbon"},           {"Qatar", "Doha"},
  {"Romania", "Bucharest"},         {"Russia", "Moscow"},
  {"Rwanda", "Kigali"},             {"Saudi Arabia", "Riyadh"},
  {"Senegal", "Dakar"},             {"Serbia", "Belgrade"},
  {"Singapore", "Singapore"},       {"Slovakia", "Bratislava"},
  {"Slovenia", "Ljubljana"},        {"Somalia", "Mogadishu"},
  {"South Africa", "Pretoria"},     {"South Korea", "Seoul"},
  {"South Sudan", "Juba"},          {"Spain", "Madrid"},
  {"Sri Lanka", "Sri Jayawardena"}, {"Sudan", "Khartoum"},
  {"Sweden", "Stockholm"},          {"Switzerland", "Bern"},
  {"Syria", "Damascus"},            {"Taiwan", "Taipei"},
  {"Tanzania", "Dodoma"},           {"Thailand", "Bangkok"},
  {"Tunisia", "Tunis"},             {"Turkey", "Ankara"},
  {"Uganda", "Kampala"},            {"Ukraine", "Kyiv"},
  {"UAE", "Abu Dhabi"},             {"UK", "London"},
  {"USA", "Washington DC"},         {"Uruguay", "Montevideo"},
  {"Uzbekistan", "Tashkent"},       {"Venezuela", "Caracas"},
  {"Vietnam", "Hanoi"},             {"Yemen", "Sanaa"},
  {"Zambia", "Lusaka"},             {"Zimbabwe", "Harare"},
};
static const int CARD_COUNT = sizeof(cards) / sizeof(cards[0]);

int  currentIdx  = -1;
bool showAnswer  = false;
bool prevPressed = false;
unsigned long lastPress = 0;

int drawWrapped(const char* text, int x, int y, int maxW, uint8_t sz, int maxLines) {
  const int cw = 6 * sz;
  const int lh = 8 * sz + 3;
  const int charsPerLine = maxW / cw;
  char buf[64], line[64];
  strncpy(buf, text, sizeof(buf) - 1);
  buf[sizeof(buf) - 1] = '\0';
  line[0] = '\0';
  display.setTextSize(sz);
  int drawn = 0;
  char* save = nullptr;
  char* tok = strtok_r(buf, " ", &save);
  while (tok && drawn < maxLines) {
    char candidate[64];
    if (line[0] == '\0') strncpy(candidate, tok, sizeof(candidate) - 1);
    else                 snprintf(candidate, sizeof(candidate), "%s %s", line, tok);
    candidate[sizeof(candidate) - 1] = '\0';
    if ((int)strlen(candidate) <= charsPerLine) {
      strncpy(line, candidate, sizeof(line) - 1);
      tok = strtok_r(nullptr, " ", &save);
      continue;
    }
    display.setCursor(x, y + drawn * lh);
    display.print(line[0] ? line : tok);
    drawn++;
    strncpy(line, line[0] ? tok : "", sizeof(line) - 1);
    tok = strtok_r(nullptr, " ", &save);
  }
  if (line[0] && drawn < maxLines) {
    display.setCursor(x, y + drawn * lh);
    display.print(line);
    drawn++;
  }
  return drawn;
}

void drawAnswerArea() {
  display.fillRect(0, ANSWER_Y, 200, 200 - ANSWER_Y, GxEPD_WHITE);
  display.drawFastHLine(6, ANSWER_Y + 4, 188, GxEPD_BLACK);
  display.setTextColor(GxEPD_BLACK);
  uint8_t sz = (strlen(cards[currentIdx].a) <= 12) ? 3 : 2;
  drawWrapped(cards[currentIdx].a, 6, ANSWER_Y + 12, 188, sz, 3);
  display.setTextSize(1);
  display.setCursor(6, 188);
  display.print("press for next");
}

void drawQuestionArea() {
  display.fillRect(0, 0, 200, 200, GxEPD_WHITE);
  display.fillRect(0, 0, 200, 28, GxEPD_RED);
  display.setTextColor(GxEPD_BLACK);
  display.setTextSize(1);
  display.setCursor(6, 10);
  display.print("Capital of:");
  display.setTextColor(GxEPD_BLACK);
  uint8_t sz = (strlen(cards[currentIdx].q) <= 12) ? 3 : 2;
  drawWrapped(cards[currentIdx].q, 6, 40, 188, sz, 3);
  display.setTextSize(1);
  display.setCursor(6, 188);
  display.print("press to reveal");
}

void showQuestion() {
  display.setFullWindow();
  display.firstPage();
  do { drawQuestionArea(); } while (display.nextPage());
}

void revealAnswer() {
  // Partial refresh: only update the answer area, question stays visible
  display.setPartialWindow(0, ANSWER_Y, 200, 200 - ANSWER_Y);
  display.firstPage();
  do { drawAnswerArea(); } while (display.nextPage());
}

void nextCard() {
  int next;
  do { next = random(CARD_COUNT); } while (next == currentIdx && CARD_COUNT > 1);
  currentIdx  = next;
  showAnswer  = false;
  showQuestion();
}

void setup() {
  Serial.begin(115200);
  pinMode(EPD_PWR, OUTPUT);
  digitalWrite(EPD_PWR, LOW);
  delay(100);
  SPI.begin(EPD_SCK, -1, EPD_MOSI, EPD_CS);
  display.init(115200, true, 2, false);
  display.setRotation(0);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  randomSeed(esp_random());
  nextCard();
}

void loop() {
  bool pressed = digitalRead(BUTTON_PIN) == LOW;
  unsigned long now = millis();

  if (pressed && !prevPressed && (now - lastPress) > DEBOUNCE_MS) {
    lastPress = now;
    if (!showAnswer) {
      showAnswer = true;
      revealAnswer();
    } else {
      nextCard();
    }
  }

  prevPressed = pressed;
  delay(20);
}

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <GxEPD2_BW.h>

// Waveshare 1.54" Rev 2.1 prototype wiring for ESP8266
#define EPD_BUSY 12  // D6
#define EPD_RST 5    // D1
#define EPD_DC 4     // D2
#define EPD_CS 15    // D8

// Buttons
#define BUTTON_1_PIN 0  // D3 / GPIO0
#define BUTTON_2_PIN 2  // D4 / GPIO2

// Waveshare 1.54" V2 / Rev 2.1 modules often match this newer Good Display panel
// better than the older D67 profile. If this still stays blank, the next candidates
// to try are GxEPD2_154_M09 and GxEPD2_154.
using DisplayPanel = GxEPD2_154_GDEY0154D67;

GxEPD2_BW<DisplayPanel, DisplayPanel::HEIGHT> display(
    DisplayPanel(EPD_CS, EPD_DC, EPD_RST, EPD_BUSY));

struct QA {
  const char* country;
  const char* capital;
};

const QA countries[] PROGMEM = {
    {"Afghanistan", "Kabul"},
    {"Albania", "Tirana"},
    {"Algeria", "Algiers"},
    {"Andorra", "Andorra la Vella"},
    {"Angola", "Luanda"},
    {"Antigua and Barbuda", "Saint John's"},
    {"Argentina", "Buenos Aires"},
    {"Armenia", "Yerevan"},
    {"Australia", "Canberra"},
    {"Austria", "Vienna"},
    {"Azerbaijan", "Baku"},
    {"Bahamas", "Nassau"},
    {"Bahrain", "Manama"},
    {"Bangladesh", "Dhaka"},
    {"Barbados", "Bridgetown"},
    {"Belarus", "Minsk"},
    {"Belgium", "Brussels"},
    {"Belize", "Belmopan"},
    {"Benin", "Porto-Novo"},
    {"Bhutan", "Thimphu"},
    {"Bolivia", "Sucre"},
    {"Bosnia and Herzegovina", "Sarajevo"},
    {"Botswana", "Gaborone"},
    {"Brazil", "Brasilia"},
    {"Brunei", "Bandar Seri Begawan"},
    {"Bulgaria", "Sofia"},
    {"Burkina Faso", "Ouagadougou"},
    {"Burundi", "Gitega"},
    {"Cabo Verde", "Praia"},
    {"Cambodia", "Phnom Penh"},
    {"Cameroon", "Yaounde"},
    {"Canada", "Ottawa"},
    {"Central African Republic", "Bangui"},
    {"Chad", "N'Djamena"},
    {"Chile", "Santiago"},
    {"China", "Beijing"},
    {"Colombia", "Bogota"},
    {"Comoros", "Moroni"},
    {"Congo", "Brazzaville"},
    {"Costa Rica", "San Jose"},
    {"Cote d'Ivoire", "Yamoussoukro"},
    {"Croatia", "Zagreb"},
    {"Cuba", "Havana"},
    {"Cyprus", "Nicosia"},
    {"Czechia", "Prague"},
    {"DR Congo", "Kinshasa"},
    {"Denmark", "Copenhagen"},
    {"Djibouti", "Djibouti"},
    {"Dominica", "Roseau"},
    {"Dominican Republic", "Santo Domingo"},
    {"Ecuador", "Quito"},
    {"Egypt", "Cairo"},
    {"El Salvador", "San Salvador"},
    {"Equatorial Guinea", "Malabo"},
    {"Eritrea", "Asmara"},
    {"Estonia", "Tallinn"},
    {"Eswatini", "Mbabane"},
    {"Ethiopia", "Addis Ababa"},
    {"Fiji", "Suva"},
    {"Finland", "Helsinki"},
    {"France", "Paris"},
    {"Gabon", "Libreville"},
    {"Gambia", "Banjul"},
    {"Georgia", "Tbilisi"},
    {"Germany", "Berlin"},
    {"Ghana", "Accra"},
    {"Greece", "Athens"},
    {"Grenada", "Saint George's"},
    {"Guatemala", "Guatemala City"},
    {"Guinea", "Conakry"},
    {"Guinea-Bissau", "Bissau"},
    {"Guyana", "Georgetown"},
    {"Haiti", "Port-au-Prince"},
    {"Honduras", "Tegucigalpa"},
    {"Hungary", "Budapest"},
    {"Iceland", "Reykjavik"},
    {"India", "New Delhi"},
    {"Indonesia", "Jakarta"},
    {"Iran", "Tehran"},
    {"Iraq", "Baghdad"},
    {"Ireland", "Dublin"},
    {"Israel", "Jerusalem"},
    {"Italy", "Rome"},
    {"Jamaica", "Kingston"},
    {"Japan", "Tokyo"},
    {"Jordan", "Amman"},
    {"Kazakhstan", "Astana"},
    {"Kenya", "Nairobi"},
    {"Kiribati", "South Tarawa"},
    {"Kuwait", "Kuwait City"},
    {"Kyrgyzstan", "Bishkek"},
    {"Laos", "Vientiane"},
    {"Latvia", "Riga"},
    {"Lebanon", "Beirut"},
    {"Lesotho", "Maseru"},
    {"Liberia", "Monrovia"},
    {"Libya", "Tripoli"},
    {"Liechtenstein", "Vaduz"},
    {"Lithuania", "Vilnius"},
    {"Luxembourg", "Luxembourg"},
    {"Madagascar", "Antananarivo"},
    {"Malawi", "Lilongwe"},
    {"Malaysia", "Kuala Lumpur"},
    {"Maldives", "Male"},
    {"Mali", "Bamako"},
    {"Malta", "Valletta"},
    {"Marshall Islands", "Majuro"},
    {"Mauritania", "Nouakchott"},
    {"Mauritius", "Port Louis"},
    {"Mexico", "Mexico City"},
    {"Micronesia", "Palikir"},
    {"Moldova", "Chisinau"},
    {"Monaco", "Monaco"},
    {"Mongolia", "Ulaanbaatar"},
    {"Montenegro", "Podgorica"},
    {"Morocco", "Rabat"},
    {"Mozambique", "Maputo"},
    {"Myanmar", "Naypyidaw"},
    {"Namibia", "Windhoek"},
    {"Nauru", "Yaren"},
    {"Nepal", "Kathmandu"},
    {"Netherlands", "Amsterdam"},
    {"New Zealand", "Wellington"},
    {"Nicaragua", "Managua"},
    {"Niger", "Niamey"},
    {"Nigeria", "Abuja"},
    {"North Korea", "Pyongyang"},
    {"North Macedonia", "Skopje"},
    {"Norway", "Oslo"},
    {"Oman", "Muscat"},
    {"Pakistan", "Islamabad"},
    {"Palau", "Ngerulmud"},
    {"Palestine", "East Jerusalem"},
    {"Panama", "Panama City"},
    {"Papua New Guinea", "Port Moresby"},
    {"Paraguay", "Asuncion"},
    {"Peru", "Lima"},
    {"Philippines", "Manila"},
    {"Poland", "Warsaw"},
    {"Portugal", "Lisbon"},
    {"Qatar", "Doha"},
    {"Romania", "Bucharest"},
    {"Russia", "Moscow"},
    {"Rwanda", "Kigali"},
    {"Saint Kitts and Nevis", "Basseterre"},
    {"Saint Lucia", "Castries"},
    {"Saint Vincent", "Kingstown"},
    {"Samoa", "Apia"},
    {"San Marino", "San Marino"},
    {"Sao Tome and Principe", "Sao Tome"},
    {"Saudi Arabia", "Riyadh"},
    {"Senegal", "Dakar"},
    {"Serbia", "Belgrade"},
    {"Seychelles", "Victoria"},
    {"Sierra Leone", "Freetown"},
    {"Singapore", "Singapore"},
    {"Slovakia", "Bratislava"},
    {"Slovenia", "Ljubljana"},
    {"Solomon Islands", "Honiara"},
    {"Somalia", "Mogadishu"},
    {"South Africa", "Pretoria"},
    {"South Korea", "Seoul"},
    {"South Sudan", "Juba"},
    {"Spain", "Madrid"},
    {"Sri Lanka", "Sri Jayawardenepura"},
    {"Sudan", "Khartoum"},
    {"Suriname", "Paramaribo"},
    {"Sweden", "Stockholm"},
    {"Switzerland", "Bern"},
    {"Syria", "Damascus"},
    {"Tajikistan", "Dushanbe"},
    {"Tanzania", "Dodoma"},
    {"Thailand", "Bangkok"},
    {"Timor-Leste", "Dili"},
    {"Togo", "Lome"},
    {"Tonga", "Nuku'alofa"},
    {"Trinidad and Tobago", "Port of Spain"},
    {"Tunisia", "Tunis"},
    {"Turkey", "Ankara"},
    {"Turkmenistan", "Ashgabat"},
    {"Tuvalu", "Funafuti"},
    {"Uganda", "Kampala"},
    {"Ukraine", "Kyiv"},
    {"United Arab Emirates", "Abu Dhabi"},
    {"United Kingdom", "London"},
    {"United States", "Washington DC"},
    {"Uruguay", "Montevideo"},
    {"Uzbekistan", "Tashkent"},
    {"Vanuatu", "Port Vila"},
    {"Vatican City", "Vatican City"},
    {"Venezuela", "Caracas"},
    {"Vietnam", "Hanoi"},
    {"Yemen", "Sanaa"},
    {"Zambia", "Lusaka"},
    {"Zimbabwe", "Harare"}};

const int COUNTRY_COUNT = sizeof(countries) / sizeof(countries[0]);

int currentIndex = -1;
bool answerVisible = false;

char countryBuf[40];
char capitalBuf[40];

bool previousPressed = false;
unsigned long lastPressTime = 0;
const unsigned long debounceMs = 150;

const int SCREEN_MARGIN = 10;
const int LABEL_TEXT_SIZE = 1;
const int LARGE_TEXT_SIZE = 2;
const int SMALL_TEXT_SIZE = 1;

void disableWiFi() {
  WiFi.persistent(false);
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  WiFi.forceSleepBegin();
  delay(1);
}

void rearmButtons() {
  // D3/GPIO0 is a boot strap pin; do not hold LOW during boot/upload.
  pinMode(BUTTON_1_PIN, INPUT_PULLUP);

  // D4/GPIO2 is also a boot strap pin and should stay HIGH during boot.
  pinMode(BUTTON_2_PIN, INPUT_PULLUP);
}

bool anyButtonPressed() {
  rearmButtons();

  const bool b1 = digitalRead(BUTTON_1_PIN) == LOW;
  const bool b2 = digitalRead(BUTTON_2_PIN) == LOW;

  return b1 || b2;
}

void loadPair(int index) {
  strcpy_P(countryBuf, (PGM_P)pgm_read_ptr(&(countries[index].country)));
  strcpy_P(capitalBuf, (PGM_P)pgm_read_ptr(&(countries[index].capital)));
}

void pickRandomPair() {
  int nextIndex;

  do {
    nextIndex = random(COUNTRY_COUNT);
  } while (nextIndex == currentIndex && COUNTRY_COUNT > 1);

  currentIndex = nextIndex;
  loadPair(currentIndex);
  answerVisible = false;
}

int lineHeightForSize(uint8_t textSize) { return 8 * textSize + 4; }

uint8_t pickTextSize(const char* text, int maxWidth, int maxLines) {
  const int largeCharsPerLine = maxWidth / (6 * LARGE_TEXT_SIZE);
  if ((int)strlen(text) <= largeCharsPerLine * maxLines) {
    return LARGE_TEXT_SIZE;
  }
  return SMALL_TEXT_SIZE;
}

int drawWrappedText(const char* text,
                    int x,
                    int y,
                    int maxWidth,
                    uint8_t textSize,
                    int maxLines) {
  char buffer[64];
  char line[64];
  int lineCount = 0;
  int charsPerLine = maxWidth / (6 * textSize);
  const int lineHeight = lineHeightForSize(textSize);

  if (charsPerLine < 1) {
    charsPerLine = 1;
  }

  strncpy(buffer, text, sizeof(buffer) - 1);
  buffer[sizeof(buffer) - 1] = '\0';
  line[0] = '\0';

  display.setTextSize(textSize);

  char* saveptr = nullptr;
  char* token = strtok_r(buffer, " ", &saveptr);

  while (token && lineCount < maxLines) {
    char candidate[64];

    if (line[0] == '\0') {
      strncpy(candidate, token, sizeof(candidate) - 1);
      candidate[sizeof(candidate) - 1] = '\0';
    } else {
      snprintf(candidate, sizeof(candidate), "%s %s", line, token);
    }

    if ((int)strlen(candidate) <= charsPerLine) {
      strncpy(line, candidate, sizeof(line) - 1);
      line[sizeof(line) - 1] = '\0';
      token = strtok_r(nullptr, " ", &saveptr);
      continue;
    }

    display.setCursor(x, y + lineCount * lineHeight);
    display.print(line[0] ? line : token);
    lineCount++;

    if (line[0]) {
      strncpy(line, token, sizeof(line) - 1);
      line[sizeof(line) - 1] = '\0';
      token = strtok_r(nullptr, " ", &saveptr);
    } else {
      line[0] = '\0';
      token = strtok_r(nullptr, " ", &saveptr);
    }
  }

  if (line[0] && lineCount < maxLines) {
    display.setCursor(x, y + lineCount * lineHeight);
    display.print(line);
    lineCount++;
  }

  return lineCount;
}

void drawQuestionFull() {
  Serial.print("Question: ");
  Serial.print(countryBuf);
  Serial.print(" -> ");
  Serial.println(capitalBuf);

  display.setFullWindow();
  display.firstPage();

  do {
    const int screenWidth = display.width();
    const int screenHeight = display.height();
    const int contentWidth = screenWidth - (SCREEN_MARGIN * 2);
    const uint8_t countryTextSize = pickTextSize(countryBuf, contentWidth, 2);
    const int countryTextY = 34;

    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);

    display.setTextSize(LABEL_TEXT_SIZE);
    display.setCursor(SCREEN_MARGIN, 16);
    display.print("Capital of:");

    drawWrappedText(countryBuf, SCREEN_MARGIN, countryTextY, contentWidth, countryTextSize, 2);

    display.setTextSize(LABEL_TEXT_SIZE);
    display.setCursor(SCREEN_MARGIN, screenHeight - 8);
    display.print("Press to reveal");

  } while (display.nextPage());

  rearmButtons();
}

void revealAnswerPartial() {
  Serial.print("Answer: ");
  Serial.println(capitalBuf);

  const int screenWidth = display.width();
  const int screenHeight = display.height();
  const int answerTop = screenHeight / 2 + 4;
  const int answerHeight = screenHeight - answerTop;
  const int contentWidth = screenWidth - (SCREEN_MARGIN * 2);
  const uint8_t capitalTextSize = pickTextSize(capitalBuf, contentWidth, 2);

  display.setPartialWindow(0, answerTop, screenWidth, answerHeight);
  display.firstPage();

  do {
    display.fillRect(0, answerTop, screenWidth, answerHeight, GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);

    display.setTextSize(LABEL_TEXT_SIZE);
    display.setCursor(SCREEN_MARGIN, answerTop + 12);
    display.print("Answer:");

    drawWrappedText(capitalBuf, SCREEN_MARGIN, answerTop + 30, contentWidth, capitalTextSize, 2);

  } while (display.nextPage());

  answerVisible = true;
  rearmButtons();
}

void waitForRelease() {
  rearmButtons();

  while (anyButtonPressed()) {
    delay(10);
  }

  previousPressed = false;
  delay(80);
}

void handlePress() {
  Serial.println("Button press detected");

  if (!answerVisible) {
    revealAnswerPartial();
  } else {
    pickRandomPair();
    drawQuestionFull();
  }

  waitForRelease();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("Capital quiz starting (1.54 prototype)");

  disableWiFi();

  rearmButtons();

  randomSeed(ESP.getCycleCount() ^ micros() ^ analogRead(A0));

  // Waveshare boards use a reset circuit that works better with the
  // short reset pulse recommended by the GxEPD2 examples.
  display.init(115200, true, 2, false);
  display.setRotation(1);
  Serial.println("Display init complete");

  rearmButtons();

  pickRandomPair();
  Serial.println("Drawing initial question");
  drawQuestionFull();

  waitForRelease();

  Serial.print("Loaded ");
  Serial.print(COUNTRY_COUNT);
  Serial.println(" countries");

  Serial.println("Ready");
}

void loop() {
  const bool pressed = anyButtonPressed();
  const unsigned long now = millis();

  if (pressed && !previousPressed && now - lastPressTime > debounceMs) {
    lastPressTime = now;
    handlePress();
  }

  previousPressed = pressed;
  delay(20);
}

#include <Arduino.h>
#include <vector>
#include "config.h"
#include "scheduler.h"
#include "stats_store.h"

static std::vector<int> queue;   // play order for this session
static size_t queuePos = 0;      // index into `queue` of the card on screen
// Indexed like `cards`; deliberately session-only. A wrong answer breaks the
// streak, while correct answers beyond two do not repeatedly introduce cards.
static std::vector<uint8_t> consecutiveCorrect;

static inline size_t minSize(size_t a, size_t b) { return a < b ? a : b; }

static void shuffleQueue(std::vector<int> &q) {
  for (int i = (int)q.size() - 1; i > 0; i--) {
    int j = random(0, i + 1);
    int t = q[i]; q[i] = q[j]; q[j] = t;
  }
}

static bool queueContains(int cardIdx) {
  for (int queuedIdx : queue) {
    if (queuedIdx == cardIdx) return true;
  }
  return false;
}

// The normal session build admits only NEW_CARDS_PER_SESSION new cards. This
// finds the next one beyond that active set, in deck/creation order.
static int nextUnpracticedCardOutsideQueue() {
  for (int i = 0; i < (int)cards.size(); i++) {
    if (!cards[i].practiced && !queueContains(i)) return i;
  }
  return -1;
}

// Fully random shuffle, then an intentionally incomplete (2-pass) bubble sort
// by box, so lower-box items tend to end up earlier on average -- a gentle
// bias, not a real sort. Never-practiced cards are skipped by every
// comparison they're part of, so they stay wherever the shuffle put them;
// box changes made during the session only affect ordering from next boot.
void buildSessionQueue() {
  queue.clear();
  queuePos = 0;
  consecutiveCorrect.assign(cards.size(), 0);
  if (cards.empty()) return;

  // Only the next NEW_CARDS_PER_SESSION never-practiced cards (in deck order)
  // join the queue this session; the rest sit out until a future boot.
  std::vector<int> newIdx;
  for (int i = 0; i < (int)cards.size() && (int)newIdx.size() < NEW_CARDS_PER_SESSION; i++) {
    if (!cards[i].practiced) newIdx.push_back(i);
  }
  for (int i = 0; i < (int)cards.size(); i++) {
    if (cards[i].practiced) queue.push_back(i);
  }
  for (int idx : newIdx) queue.push_back(idx);

  shuffleQueue(queue);

  for (int pass = 0; pass < BUBBLE_PASSES; pass++) {
    for (size_t i = 0; i + 1 < queue.size(); i++) {
      int a = queue[i], b = queue[i + 1];
      if (!cards[a].practiced || !cards[b].practiced) continue;   // new cards stay put
      if (cards[a].box > cards[b].box) { queue[i] = b; queue[i + 1] = a; }
    }
  }
}

const Flashcard *currentCard() {
  if (queue.empty()) return nullptr;
  return &cards[queue[queuePos]];
}

void gradeCorrect() {
  if (queue.empty()) return;
  int idx = queue[queuePos];
  if ((size_t)idx >= consecutiveCorrect.size()) {
    consecutiveCorrect.resize(cards.size(), 0);
  }
  if (consecutiveCorrect[idx] < UINT8_MAX) consecutiveCorrect[idx]++;
  bool introduceNewCard = consecutiveCorrect[idx] == 2;

  cards[idx].box++;
  cards[idx].practiced = true;
  pushHistory(cards[idx], true);
  saveCard(cards[idx]);
  statsRecordTrial();

  queue.erase(queue.begin() + queuePos);
  // Whatever slid into queuePos (if anything) is next; if that was the last
  // card, wrap.
  size_t nextPos = (queuePos < queue.size()) ? queuePos : 0;
  queue.push_back(idx);   // appending never shifts indices <= nextPos
  if (introduceNewCard) {
    int newIdx = nextUnpracticedCardOutsideQueue();
    if (newIdx >= 0) queue.insert(queue.begin() + nextPos, newIdx);
  }
  queuePos = nextPos;
}

void gradeIncorrect() {
  if (queue.empty()) return;
  int idx = queue[queuePos];
  if ((size_t)idx >= consecutiveCorrect.size()) {
    consecutiveCorrect.resize(cards.size(), 0);
  }
  consecutiveCorrect[idx] = 0;
  cards[idx].box = max(0, cards[idx].box - 2);
  cards[idx].practiced = true;
  pushHistory(cards[idx], false);
  saveCard(cards[idx]);
  statsRecordTrial();

  queue.erase(queue.begin() + queuePos);
  size_t nextPos = (queuePos < queue.size()) ? queuePos : 0;
  int delay = random(INCORRECT_DELAY_MIN, INCORRECT_DELAY_MAX + 1);
  size_t insertPos = minSize(nextPos + (size_t)delay, queue.size());
  queue.insert(queue.begin() + insertPos, idx);   // insertPos >= nextPos, so the
                                                   // element at nextPos never shifts
  queuePos = nextPos;
}

import { ref } from 'vue'
import { newFlashcard, type Flashcard } from './flashcard'

const cards = ref<Flashcard[]>([])
/** Ids removed locally that still exist on the device. */
const pendingDeletes = ref<number[]>([])

function replace(list: Flashcard[]) {
  cards.value = list
  pendingDeletes.value = []
}

function add(front = '', back = '') {
  cards.value.push(newFlashcard(front, back))
}

function remove(card: Flashcard) {
  cards.value = cards.value.filter((c) => c !== card)
  if (card.id) pendingDeletes.value.push(card.id)
}

function confirmDeleted(id: number) {
  pendingDeletes.value = pendingDeletes.value.filter((pending) => pending !== id)
}

export function useFlashcards() {
  return { cards, pendingDeletes, replace, add, remove, confirmDeleted }
}

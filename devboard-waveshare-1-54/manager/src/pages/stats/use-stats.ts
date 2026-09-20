import { ref, watch } from 'vue'
import { readList } from '@/entities/device/list'
import { readSessionBytes } from '@/entities/device/stats'
import { useDevice } from '@/entities/device/use-device'
import { parseList } from '@/entities/flashcard/parse-list'
import { useFlashcards } from '@/entities/flashcard/use-flashcards'
import { parseSessions, type Session } from '@/entities/session/sessions'

/** Loads sessions on connect, and the cards too if no page has loaded them yet. */
export function useStats() {
  const { isConnected } = useDevice()
  const { cards, replace } = useFlashcards()
  const sessions = ref<Session[]>([])
  const error = ref('')

  async function load() {
    error.value = ''
    try {
      sessions.value = parseSessions(await readSessionBytes())
      if (cards.value.length === 0) replace(parseList(await readList(() => {})))
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    }
  }

  watch(isConnected, (connected) => connected && load(), { immediate: true })
  return { cards, sessions, error, isConnected }
}

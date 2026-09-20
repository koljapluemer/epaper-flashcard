import { ref } from 'vue'
import { parseCSV } from '@/dumb/csv'
import { deleteAll, deleteCard } from '@/entities/device/delete'
import { readList } from '@/entities/device/list'
import { putCard } from '@/entities/device/put-card'
import { encodeBody } from '@/entities/flashcard/encode-body'
import { hasText, isDirty } from '@/entities/flashcard/flashcard'
import { parseList } from '@/entities/flashcard/parse-list'
import { useFlashcards } from '@/entities/flashcard/use-flashcards'

type Message = { kind: 'info' | 'success' | 'error'; text: string }

export function useSync() {
  const { cards, pendingDeletes, replace, add, confirmDeleted } = useFlashcards()
  const busy = ref(false)
  /** 0-100, or null when no transfer is running. */
  const progress = ref<number | null>(null)
  const message = ref<Message | null>(null)

  function setProgress(done: number, total: number, text: string) {
    progress.value = total ? (done / total) * 100 : 0
    message.value = { kind: 'info', text }
  }

  async function run(failure: string, task: () => Promise<string>) {
    busy.value = true
    try {
      message.value = { kind: 'success', text: await task() }
    } catch (err) {
      message.value = { kind: 'error', text: `${failure}: ${err instanceof Error ? err.message : err}` }
    } finally {
      busy.value = false
      progress.value = null
    }
  }

  const load = () =>
    run('Load failed', async () => {
      const bytes = await readList((received, total) =>
        setProgress(received, total, `Loading cards (${received}/${total} bytes)`),
      )
      replace(parseList(bytes))
      return `Loaded ${cards.value.length} card(s).`
    })

  async function save() {
    const toDelete = [...pendingDeletes.value]
    const toSave = cards.value.filter((card) => isDirty(card) && hasText(card))
    const total = toDelete.length + toSave.length
    if (total === 0) {
      message.value = { kind: 'info', text: 'Nothing to save.' }
      return
    }

    await run('Save failed', async () => {
      let done = 0
      for (const id of toDelete) {
        setProgress(done++, total, `Step ${done} of ${total}: deleting`)
        await deleteCard(id)
        confirmDeleted(id)
      }
      for (const card of toSave) {
        setProgress(done++, total, `Step ${done} of ${total}: saving`)
        card.front = card.front.trim()
        card.back = card.back.trim()
        const body = await encodeBody(card)
        card.id = await putCard({ id: card.id, box: card.box, practiced: card.practiced, body })
        card.syncedFront = card.front
        card.syncedBack = card.back
      }
      return `Saved ${toSave.length}, deleted ${toDelete.length}. Restart the device to use the changes.`
    })
  }

  const deleteEverything = () =>
    run('Delete failed', async () => {
      setProgress(1, 2, 'Deleting all cards')
      await deleteAll()
      replace([])
      return 'Deleted all cards.'
    })

  async function importCsv(file: File) {
    const rows = parseCSV(await file.text())
    for (const [front = '', back = ''] of rows) add(front.trim(), back.trim())
    message.value = { kind: 'success', text: `Imported ${rows.length} card(s). Review, then save.` }
  }

  return { busy, progress, message, load, save, deleteEverything, importCsv }
}

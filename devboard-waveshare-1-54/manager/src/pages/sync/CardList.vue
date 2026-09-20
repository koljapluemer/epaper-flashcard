<script setup lang="ts">
import { useTemplateRef } from 'vue'
import FlashcardRow from '@/entities/flashcard/FlashcardRow.vue'
import { useFlashcards } from '@/entities/flashcard/use-flashcards'

const { cards, remove } = useFlashcards()
const list = useTemplateRef('list')

defineExpose({ focusLast: () => list.value?.querySelector<HTMLInputElement>('li:last-child input')?.focus() })
</script>

<template>
  <p
    v-if="cards.length === 0"
    class="py-10 text-center text-base-content/60"
  >
    No cards yet.
  </p>
  <ul
    ref="list"
    class="flex flex-col gap-4"
  >
    <FlashcardRow
      v-for="card in cards"
      :key="card.key"
      v-model:front="card.front"
      v-model:back="card.back"
      :history="card.history"
      @remove="remove(card)"
    />
  </ul>
</template>

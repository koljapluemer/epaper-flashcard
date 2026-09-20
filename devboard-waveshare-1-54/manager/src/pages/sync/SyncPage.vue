<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import { useDevice } from '@/entities/device/use-device'
import { useFlashcards } from '@/entities/flashcard/use-flashcards'
import CardList from './CardList.vue'
import CardToolbar from './CardToolbar.vue'
import StatsPanel from './StatsPanel.vue'
import UnsupportedNotice from './UnsupportedNotice.vue'
import { useSync } from './use-sync'

const { isConnected, isSupported, error } = useDevice()
const { cards, add } = useFlashcards()
const sync = useSync()
const list = useTemplateRef('list')

watch(isConnected, (connected) => connected && sync.load(), { immediate: true })

async function onAdd() {
  add()
  await nextTick()
  list.value?.focusLast()
}
</script>

<template>
  <UnsupportedNotice v-if="!isSupported" />
  <div
    v-else-if="!isConnected"
    class="flex flex-col gap-2 py-16 text-center text-base-content/60"
  >
    <p
      v-if="error"
      class="text-error"
    >
      {{ error }}
    </p>
    <p>Tap Connect and pick “Flashcards”. On the device, tap the connect icon (top right).</p>
  </div>
  <div
    v-else
    class="flex flex-col gap-4"
  >
    <StatsPanel :cards="cards" />
    <CardToolbar
      :busy="sync.busy.value"
      :card-count="cards.length"
      @add="onAdd"
      @import-csv="sync.importCsv"
      @delete-all="sync.deleteEverything"
      @save="sync.save"
    />
    <progress
      v-if="sync.progress.value !== null"
      class="progress progress-primary w-full"
      :value="sync.progress.value"
      max="100"
    />
    <p
      v-if="sync.message.value"
      class="text-sm"
      :class="{
        'text-error': sync.message.value.kind === 'error',
        'text-success': sync.message.value.kind === 'success',
        'text-base-content/60': sync.message.value.kind === 'info',
      }"
    >
      {{ sync.message.value.text }}
    </p>
    <CardList ref="list" />
  </div>
</template>

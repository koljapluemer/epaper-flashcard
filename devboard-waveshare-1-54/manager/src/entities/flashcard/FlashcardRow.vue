<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import FlashcardPreview from './FlashcardPreview.vue'

const front = defineModel<string>('front', { required: true })
const back = defineModel<string>('back', { required: true })
defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[auto_1fr_1fr_auto]">
    <FlashcardPreview
      :front="front"
      :back="back"
    />
    <label>
      <span class="sr-only">Front</span>
      <input
        v-model="front"
        class="input input-sm w-full"
        placeholder="Front"
      >
    </label>
    <label>
      <span class="sr-only">Back</span>
      <input
        v-model="back"
        class="input input-sm w-full"
        placeholder="Back"
      >
    </label>
    <button
      class="btn btn-ghost btn-sm text-error"
      aria-label="Delete card"
      @click="$emit('remove')"
    >
      <Trash2 class="size-4" />
    </button>
  </li>
</template>

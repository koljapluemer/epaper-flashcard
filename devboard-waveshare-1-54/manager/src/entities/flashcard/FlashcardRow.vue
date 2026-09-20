<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

const front = defineModel<string>('front', { required: true })
const back = defineModel<string>('back', { required: true })
defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
    <label class="flex flex-col gap-1">
      <span class="text-sm">Front</span>
      <input
        v-model="front"
        class="input input-sm w-full"
      >
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-sm">Back</span>
      <input
        v-model="back"
        class="input input-sm w-full"
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

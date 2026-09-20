<script setup lang="ts">
import { FileUp, Plus, Save, Trash2 } from 'lucide-vue-next'

const props = defineProps<{ busy: boolean; cardCount: number }>()
const emit = defineEmits<{
  add: []
  importCsv: [file: File]
  deleteAll: []
  save: []
}>()

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) emit('importCsv', file)
}

function onDeleteAll() {
  if (confirm(`Delete all ${props.cardCount} card(s) from the device? This can't be undone.`)) {
    emit('deleteAll')
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      class="btn btn-primary btn-sm"
      :disabled="busy"
      @click="emit('add')"
    >
      <Plus class="size-4" /> Add
    </button>
    <label
      class="btn btn-outline btn-sm"
      :class="{ 'btn-disabled': busy }"
    >
      <FileUp class="size-4" /> Import CSV
      <input
        type="file"
        accept=".csv,text/csv,text/plain"
        class="hidden"
        @change="onFile"
      >
    </label>
    <button
      class="btn btn-error btn-outline btn-sm"
      :disabled="busy || cardCount === 0"
      @click="onDeleteAll"
    >
      <Trash2 class="size-4" /> Delete all
    </button>
    <button
      class="btn btn-success btn-sm ml-auto"
      :disabled="busy"
      @click="emit('save')"
    >
      <Save class="size-4" /> Save to device
    </button>
  </div>
</template>

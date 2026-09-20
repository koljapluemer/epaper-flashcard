<script setup lang="ts">
import { computed } from 'vue'
import type { Flashcard } from '@/entities/flashcard/flashcard'
import { computeStats } from '@/entities/flashcard/stats'

const props = defineProps<{ cards: Flashcard[] }>()
const stats = computed(() => computeStats(props.cards))
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span class="badge badge-outline">Unpracticed: {{ stats.unpracticed }}</span>
    <span
      v-for="[box, count] in stats.boxes"
      :key="box"
      class="badge badge-outline"
    >
      Box {{ box }}: {{ count }}
    </span>
  </div>
</template>

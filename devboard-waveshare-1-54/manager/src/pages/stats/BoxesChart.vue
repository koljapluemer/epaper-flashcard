<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { Flashcard } from '@/entities/flashcard/flashcard'
import { computeStats } from '@/entities/flashcard/stats'
import { barColor, barOptions } from './chart-options'

const props = defineProps<{ cards: Flashcard[] }>()

const data = computed(() => {
  const { unpracticed, boxes } = computeStats(props.cards)
  return {
    labels: ['New', ...boxes.map(([box]) => `Box ${box}`)],
    datasets: [
      {
        data: [unpracticed, ...boxes.map(([, count]) => count)],
        backgroundColor: barColor(),
        borderRadius: 4,
        maxBarThickness: 28,
      },
    ],
  }
})
const options = barOptions('cards')
</script>

<template>
  <div class="h-64">
    <Bar
      :data="data"
      :options="options"
    />
  </div>
</template>

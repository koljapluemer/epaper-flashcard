<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { formatRange } from '@/entities/session/format-range'
import type { Session } from '@/entities/session/sessions'
import { barColor, barOptions } from './chart-options'

const props = defineProps<{ sessions: Session[] }>()

const ranges = computed(() => props.sessions.map(formatRange))
const data = computed(() => ({
  labels: ranges.value,
  datasets: [
    {
      data: props.sessions.map((s) => s.practiced),
      backgroundColor: barColor(),
      borderRadius: 4,
      maxBarThickness: 28,
    },
  ],
}))
const options = barOptions('cards', (i) => ranges.value[i])
</script>

<template>
  <div class="h-64">
    <Bar
      :data="data"
      :options="options"
    />
  </div>
</template>

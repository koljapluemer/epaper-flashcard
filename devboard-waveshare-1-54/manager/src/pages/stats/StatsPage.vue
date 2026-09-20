<script setup lang="ts">
import BoxesChart from './BoxesChart.vue'
import SessionsChart from './SessionsChart.vue'
import { useStats } from './use-stats'

const { cards, sessions, error, isConnected } = useStats()
</script>

<template>
  <p
    v-if="!isConnected"
    class="py-16 text-center text-base-content/60"
  >
    Connect to the device to see stats.
  </p>
  <p
    v-else-if="error"
    class="text-error"
  >
    {{ error }}
  </p>
  <div
    v-else
    class="flex flex-col gap-8"
  >
    <section>
      <h2 class="mb-2 font-semibold">
        Cards practiced per session
      </h2>
      <p
        v-if="sessions.length === 0"
        class="text-base-content/60"
      >
        No sessions yet.
      </p>
      <SessionsChart
        v-else
        :sessions="sessions"
      />
    </section>
    <section>
      <h2 class="mb-2 font-semibold">
        Cards per box
      </h2>
      <BoxesChart :cards="cards" />
    </section>
  </div>
</template>

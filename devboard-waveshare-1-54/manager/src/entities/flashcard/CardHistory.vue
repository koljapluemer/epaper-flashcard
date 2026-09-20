<script setup lang="ts">
defineProps<{ history: boolean[] }>()
</script>

<template>
  <div
    v-if="history.length"
    class="flex flex-wrap gap-0.5"
  >
    <span
      v-for="(correct, i) in history"
      :key="i"
      class="size-1.5"
      :class="correct ? 'bg-success' : 'bg-red-300'"
    />
  </div>
</template>

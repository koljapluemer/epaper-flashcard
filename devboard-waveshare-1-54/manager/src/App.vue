<script setup lang="ts">
import ConnectButton from '@/features/device-connect/ConnectButton.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar sticky top-0 z-10 bg-base-100 shadow-sm">
      <h1 class="flex-1 px-2 text-lg font-semibold">
        Flashcards
      </h1>
      <ConnectButton />
    </header>
    <main class="mx-auto max-w-2xl p-4">
      <RouterView />
    </main>
  </div>
</template>

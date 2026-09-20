<script setup lang="ts">
import { BarChart3, Layers, Settings } from 'lucide-vue-next'
import ConnectButton from '@/features/device-connect/ConnectButton.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar sticky top-0 z-10 flex-wrap gap-y-1 bg-base-100 shadow-sm">
      <h1 class="px-2 text-lg font-semibold">
        Flashcards
      </h1>
      <nav class="flex flex-1 gap-1">
        <RouterLink
          to="/"
          class="btn btn-ghost btn-sm"
          active-class="btn-active"
        >
          <Layers class="size-4" /> Cards
        </RouterLink>
        <RouterLink
          to="/stats"
          class="btn btn-ghost btn-sm"
          active-class="btn-active"
        >
          <BarChart3 class="size-4" /> Stats
        </RouterLink>
        <RouterLink
          to="/settings"
          class="btn btn-ghost btn-sm"
          active-class="btn-active"
        >
          <Settings class="size-4" /> Settings
        </RouterLink>
      </nav>
      <ConnectButton />
    </header>
    <main class="mx-auto max-w-2xl p-4">
      <RouterView v-slot="{ Component }">
        <KeepAlive include="SyncPage">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

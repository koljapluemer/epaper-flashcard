<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { WELCOME_MAX_CHARS } from '@/entities/welcome/encode-body'
import { useSettings } from './use-settings'

const { isConnected, welcomeMessage, busy, message, save } = useSettings()
</script>

<template>
  <p
    v-if="!isConnected"
    class="py-16 text-center text-base-content/60"
  >
    Connect to the device to change settings.
  </p>
  <form
    v-else
    class="flex flex-col gap-4"
    @submit.prevent="save"
  >
    <fieldset class="fieldset">
      <label
        class="label"
        for="welcome-message"
      >Welcome message</label>
      <input
        id="welcome-message"
        v-model="welcomeMessage"
        type="text"
        class="input w-full"
        :maxlength="WELCOME_MAX_CHARS"
        :disabled="busy"
      >
      <p class="label">
        Shown at the top of the screen when the device powers off.
      </p>
    </fieldset>
    <button
      class="btn btn-success btn-sm self-start"
      :disabled="busy"
    >
      <Save class="size-4" /> Save to device
    </button>
    <p
      v-if="message"
      class="text-sm"
      :class="message.kind === 'error' ? 'text-error' : 'text-success'"
    >
      {{ message.text }}
    </p>
  </form>
</template>

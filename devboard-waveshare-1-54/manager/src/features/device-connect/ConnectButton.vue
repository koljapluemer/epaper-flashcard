<script setup lang="ts">
import { Bluetooth, BluetoothOff } from 'lucide-vue-next'
import { useDevice } from '@/entities/device/use-device'

const { status, isConnected, isSupported, connect, disconnect } = useDevice()
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      class="badge"
      :class="isConnected ? 'badge-success' : 'badge-ghost'"
    >
      {{ isConnected ? 'Connected' : 'Not connected' }}
    </span>
    <button
      class="btn btn-primary btn-sm"
      :disabled="!isSupported || status === 'connecting'"
      @click="isConnected ? disconnect() : connect()"
    >
      <component
        :is="isConnected ? BluetoothOff : Bluetooth"
        class="size-4"
      />
      {{ isConnected ? 'Disconnect' : 'Connect' }}
    </button>
  </div>
</template>

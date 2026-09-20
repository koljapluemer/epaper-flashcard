<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { X } from 'lucide-vue-next'
import DitheredFace from './DitheredFace.vue'

defineProps<{ front: string, back: string }>()

const dialog = useTemplateRef('dialog')
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="(text, side) in { front, back }"
      :key="side"
      type="button"
      class="h-8 w-[4.35rem] shrink-0 cursor-zoom-in overflow-hidden rounded-sm border border-base-300 bg-[#eeebda]"
      :aria-label="`Preview ${side} of card`"
      @click="dialog?.showModal()"
    >
      <DitheredFace
        :text="text"
        class="size-full"
      />
    </button>
  </div>

  <dialog
    ref="dialog"
    class="modal"
  >
    <div class="modal-box max-w-xl">
      <form method="dialog">
        <button
          class="btn btn-circle btn-ghost btn-sm absolute top-2 right-2"
          aria-label="Close preview"
        >
          <X class="size-4" />
        </button>
      </form>
      <h2 class="mb-4 text-lg font-bold">
        Card preview
      </h2>
      <div class="flex flex-col gap-3">
        <DitheredFace
          :text="front"
          class="w-full border border-base-300"
        />
        <DitheredFace
          :text="back"
          class="w-full border border-base-300"
        />
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button aria-label="Close preview">
        close
      </button>
    </form>
  </dialog>
</template>

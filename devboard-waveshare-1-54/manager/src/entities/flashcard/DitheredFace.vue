<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
import { BMP_H, BMP_W, renderTextTo1bpp } from './bitmap'

const props = defineProps<{ text: string }>()
const canvas = useTemplateRef('canvas')
let renderNumber = 0

async function draw() {
  const currentRender = ++renderNumber
  const bitmap = await renderTextTo1bpp(props.text)
  if (currentRender !== renderNumber || !canvas.value) return

  const context = canvas.value.getContext('2d')
  if (!context) return

  const image = context.createImageData(BMP_W, BMP_H)
  const rowBytes = Math.ceil(BMP_W / 8)
  for (let y = 0; y < BMP_H; y++) {
    for (let x = 0; x < BMP_W; x++) {
      const isBlack = (bitmap[y * rowBytes + (x >> 3)] & (0x80 >> (x & 7))) !== 0
      const offset = (y * BMP_W + x) * 4
      image.data[offset] = isBlack ? 0 : 238
      image.data[offset + 1] = isBlack ? 0 : 235
      image.data[offset + 2] = isBlack ? 0 : 218
      image.data[offset + 3] = 255
    }
  }
  context.putImageData(image, 0, 0)
}

onMounted(draw)
watch(() => props.text, draw)
</script>

<template>
  <canvas
    ref="canvas"
    :width="BMP_W"
    :height="BMP_H"
    class="block aspect-[200/92] bg-[#eeebda]"
  />
</template>

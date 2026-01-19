<template>
  <TooltipContent class="z-50" side="bottom" :side-offset="5" as-child>
    <div
      class="overflow-hidden bg-gray-900 px-3 py-1.5 rounded-md shadow-md data-[state=delayed-open]:animate-slide-upfade"
      will-change="transform,opacity"
      text="xs white"
    >
      {{ tip }}
    </div>
    <TooltipArrow class="fill-gray-900" />
  </TooltipContent>
</template>

<script setup lang="ts">
import { TooltipArrow, TooltipContent } from "reka-ui";

const { tip } = defineProps<{
  /** 提示 */
  tip?: string;
}>();
</script>

<style lang="scss" scoped></style>

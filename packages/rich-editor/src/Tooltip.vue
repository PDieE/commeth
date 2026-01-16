<template>
  <TooltipContent
    class="z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    side="bottom"
    :side-offset="5"
  >
    <div
      class="bg-gray-900 px-3 py-1.5 text-xs text-white rounded-md shadow-md"
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

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <ToolbarButton
        class="flex items-center justify-center rounded-0.75 transition-all outline-none border-none cursor-pointer"
        :class="{
          'size-8': shape === 'square',
          'h-8 px-2': shape === 'rectangle',
          'text-[var(--brand-color)] bg-[var(--brand-color-light)] hover:bg-gray-100':
            active,
          'bg-transparent  text-gray-600 hover:bg-gray-100':
            !active && !disabled,
          'opacity-50 cursor-not-allowed': disabled,
        }"
        :disabled="disabled"
        @click="emits('click')"
      >
        <slot name="icon" />
      </ToolbarButton>
    </TooltipTrigger>

    <Tooltip :tip="tip" />
  </TooltipRoot>
</template>

<script setup lang="ts">
import { TooltipRoot, ToolbarButton, TooltipTrigger } from "reka-ui";

import Tooltip from "./Tooltip.vue";

const {
  tip,
  active,
  disabled,
  shape = "square",
} = defineProps<{
  /** 提示 */
  tip?: string;
  /** 是否激活 */
  active?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /**
   * 形状
   * @describe square: 正方形; rectangle: 长方形;
   */
  shape?: "square" | "rectangle";
}>();
const emits = defineEmits<{
  /** 点击事件 */
  click: [];
}>();
</script>

<style lang="scss" scoped></style>

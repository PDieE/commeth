<template>
  <TooltipRoot>
    <PopoverRoot>
      <TooltipTrigger as-child>
        <PopoverTrigger as-child>
          <ToolbarButton
            class="h-8 px-2 flex items-center gap-1 rounded-3px transition-all outline-none border-none bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100"
          >
            <div class="flex items-center">
              <Icon
                class="size-3.5 text-gray-700"
                :icon="active?.icon ?? ''"
                inline
              />
              <Icon
                class="size-3 text-gray-400 ml-0.5"
                icon="tdesign:chevron-down"
                inline
              />
            </div>
          </ToolbarButton>
        </PopoverTrigger>
      </TooltipTrigger>

      <Tooltip :tip="tip"></Tooltip>
      <PopoverPortal>
        <PopoverContent
          class="z-50 min-w-32 overflow-hidden rounded-md border border-gray-100 bg-white p-1 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          side="bottom"
          align="start"
          :side-offset="5"
        >
          <div class="space-y-0.5">
            <div
              v-for="item in options"
              :key="item.value"
              class="h-8 px-2 rounded-3px flex items-center gap-2 cursor-pointer transition-all text-sm"
              :class="{
                'text-[var(--brand-color)] bg-[var(--brand-color-light)]':
                  item.active,
                'hover:bg-gray-100 text-gray-700': !item.active,
              }"
              @click="select(item)"
            >
              <Icon :icon="item.icon" class="size-4" inline />
              <span>{{ item.label }}</span>
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </TooltipRoot>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  ToolbarButton,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { computed } from "vue";

import type { RichEditorSelectOption } from "./types";

import Tooltip from "./Tooltip.vue";

const { tip = undefined, options } = defineProps<{
  /** 提示 */
  tip?: string;
  /** 可选项 */
  options: RichEditorSelectOption[];
}>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const active = computed(() => {
  return options.find((item) => item.active);
});
/**
 * 选择选项
 * @param option 选项
 */
function select(option: RichEditorSelectOption) {
  option.action();
}
</script>

<style lang="scss" scoped></style>

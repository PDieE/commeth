<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <Button :tip="tip" shape="rectangle">
        <template #icon>
          <Icon :icon="active?.icon ?? ''" inline />
          <Icon
            class="text-gray-400 ml-0.5"
            icon="tdesign:chevron-down"
            inline
          />
        </template>
      </Button>
    </PopoverTrigger>

    <PopoverPortal :to="`#${editorId}`">
      <PopoverContent side="bottom" align="start" :side-offset="10" as-child>
        <div
          class="rounded-md overflow-hidden bg-white shadow-lg outline-none space-y-0.5 data-[state=open]:animate-slide-upfade"
          will-change="transform,opacity"
          border="1 solid [--component-border]"
        >
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
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from "reka-ui";
import { computed } from "vue";

import type { RichEditorSelectOption } from "../types";

import { useBridgeStore } from "../injectionState";
import Button from "./Button.vue";

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
const { editorId } = useBridgeStore()!;
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

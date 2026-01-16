<template>
  <TooltipRoot :delay-duration="0">
    <PopoverRoot>
      <TooltipTrigger as-child>
        <PopoverTrigger as-child>
          <Button>
            <template #icon>
              <Icon
                class="size-4"
                :style="{ color: color }"
                :icon="icon"
                inline
              />
            </template>
          </Button>
        </PopoverTrigger>
      </TooltipTrigger>

      <Tooltip :tip="tip" />

      <PopoverPortal>
        <PopoverContent
          class="z-50 w-56 overflow-hidden rounded-md border border-gray-100 bg-white p-3 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          side="bottom"
          align="start"
          :side-offset="5"
        >
          <SketchPicker v-model="innerColor" />
          <button
            class="flex-1 h-7 text-xs rounded-3px border border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-600"
            @click="confirm()"
          >
            确认
          </button>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </TooltipRoot>
</template>

<script setup lang="ts">
import "vue-color/style.css";
import { Icon } from "@iconify/vue";
import { cloneDeep } from "es-toolkit";
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { shallowRef } from "vue";
import { SketchPicker } from "vue-color";

import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";

const {
  icon,
  color = undefined,
  tip = undefined,
} = defineProps<{
  /** 图标 */
  icon: string;
  /** 颜色 */
  color?: string;
  /** 提示 */
  tip?: string;
}>();
const emits = defineEmits<{
  /**
   * 确认颜色
   * @param color 颜色
   */
  confirm: [color?: string];
}>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/** 选择框popup是否显示 */
const innerColor = shallowRef<string>("#000000");
/** 确认颜色 */
function confirm() {
  emits("confirm", cloneDeep(innerColor.value));
}
</script>

<style lang="scss" scoped></style>

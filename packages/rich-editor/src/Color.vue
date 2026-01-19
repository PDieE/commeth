<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <Button :tip="tip">
        <template #icon>
          <Icon :style="{ color: color }" :icon="icon" inline />
        </template>
      </Button>
    </PopoverTrigger>

    <PopoverPortal :to="`#${editorId}`">
      <PopoverContent side="bottom" align="start" :side-offset="10" as-child>
        <div
          class="overflow-hidden rounded-md bg-white p-2 shadow-lg outline-none data-[state=open]:animate-slide-upfade"
          will-change="transform,opacity"
          border="1 solid [--component-border]"
        >
          <SketchPicker
            v-model="innerColor"
            class="border-none p-0 shadow-none"
          />
          <button
            class="w-full h-6 text-xs leading-6 rounded-3px text-white transition-all border-none cursor-pointer"
            bg="[--brand-color] hover:[--brand-color-hover] active:[--brand-color-active]"
            @click="confirm()"
          >
            确认
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
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
} from "reka-ui";
import { shallowRef, watch } from "vue";
import { SketchPicker } from "vue-color";

import Button from "./Button.vue";
import { useBridgeStore } from "./injectionState";

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
watch(
  () => color,
  (val) => {
    innerColor.value = val || "#000000";
  },
);
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
const { editorId } = useBridgeStore()!;
/** 选择框popup是否显示 */
const innerColor = shallowRef<string>("#000000");
/** 确认颜色 */
function confirm() {
  emits("confirm", cloneDeep(innerColor.value));
}
</script>

<style lang="scss" scoped></style>

<template>
  <Tooltip
    :title="tip"
    placement="bottom"
    :trigger="popupVisible ? ('disabled' as 'hover') : 'hover'"
  >
    <Popover
      v-model:open="popupVisible"
      :overlayInnerStyle="{ padding: 0 }"
      destroyTooltipOnHide
      trigger="click"
      placement="bottomLeft"
    >
      <Button variant="text" size="small">
        <div class="flex items-center">
          <CeIconifyIcon class="size-3.5" :icon="active?.icon ?? ''" />
          <CeIconifyIcon class="size-3" icon="tdesign:chevron-down" />
        </div>
      </Button>
      <template #content>
        <div class="p-1.5 space-y-0.5">
          <div
            v-for="item in options"
            :key="item.value"
            class="min-w-20 h-7 px-2 rounded-3px flex items-center gap-1 cursor-pointer transition-all"
            :class="{
              'text-brand bg-brand-color-light': item.active,
              'hover:bg-container-hover': !item.active,
            }"
            @click="select(item)"
          >
            <CeIconifyIcon :icon="item.icon" />{{ item.label }}
          </div>
        </div>
      </template>
    </Popover>
  </Tooltip>
</template>

<script setup lang="ts">
import { Button, Popover, Tooltip } from "ant-design-vue";
import { computed, shallowRef } from "vue";

import type { RichEditorSelectOption } from "./types";

import { CeIconifyIcon } from "../";

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
/** 选择框popup是否显示 */
const popupVisible = shallowRef(false);
const active = computed(() => {
  return options.find((item) => item.active);
});
/**
 * 选择选项
 * @param option 选项
 */
function select(option: RichEditorSelectOption) {
  option.action();
  popupVisible.value = false;
}
</script>

<style lang="scss" scoped></style>

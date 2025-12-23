<template>
  <t-tooltip :content="tip" :disabled="popupVisible" placement="bottom">
    <t-popup
      :visible="popupVisible"
      overlay-inner-class-name="!p-0"
      destroy-on-close
      trigger="mousedown"
      placement="bottom-left"
      @visible-change="close"
    >
      <t-button variant="text" size="small" @click="toSelect()">
        <template #icon>
          <CeIconifyIcon
            class="t-icon"
            :style="{ color: color }"
            :icon="icon"
          />
        </template>
      </t-button>
      <template #content>
        <t-color-picker-panel v-model="innerColor" />
        <div class="text-right pt-1 pb-3 px-3">
          <t-button size="small" @click="confirm">确定</t-button>
        </div>
      </template>
    </t-popup>
  </t-tooltip>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";

import { CeIconifyIcon } from "../";

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
const popupVisible = shallowRef(false);
const innerColor = shallowRef<string>();
/** 前往选择 */
function toSelect() {
  innerColor.value = color ?? "#000000";
  popupVisible.value = true;
}
/**
 * 选择选项
 * @param option 选项
 */
function confirm() {
  emits("confirm", innerColor.value);
  popupVisible.value = false;
}
/**
 * 关闭选择框
 * @param visible 是否显示
 */
function close(visible: boolean) {
  if (!visible) {
    popupVisible.value = false;
  }
}
</script>

<style lang="scss" scoped></style>

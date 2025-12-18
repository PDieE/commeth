<template>
  <Button
    class="inline-flex max-w-full items-center gap-1"
    type="link"
    size="small"
  >
    <Tooltip v-if="showTooltip">
      <template #title><slot></slot></template>
      <div ref="textRef" class="flex-1 truncate"><slot></slot></div>
    </Tooltip>
    <div v-else ref="textRef" class="flex-1 truncate"><slot></slot></div>
    <CeIconifyIcon icon="ant-design:export-outlined" />
  </Button>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core";
import { Button, Tooltip } from "ant-design-vue";
import { ref, shallowRef } from "vue";

import { CeIconifyIcon } from "../";

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const textRef = ref<HTMLElement>();
const showTooltip = shallowRef(false);
useResizeObserver(textRef, () => {
  if (!textRef.value) return;
  showTooltip.value = textRef.value.scrollWidth > textRef.value.clientWidth;
});
</script>

<style scoped lang="less"></style>

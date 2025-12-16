<template>
  <Button class="inline-flex max-w-full items-center gap-1" type="link" size="small">
    <Tooltip v-if="showTooltip">
      <template #title><slot></slot></template>
      <div ref="textRef" class="flex-1 truncate"><slot></slot></div>
    </Tooltip>
    <div v-else ref="textRef" class="flex-1 truncate"><slot></slot></div>
    <Icon icon="tdesign:jump" :inline="true" />
  </Button>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Button, Tooltip } from 'ant-design-vue';
import { Icon } from "@iconify/vue";
import { useResizeObserver } from '@vueuse/core';

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

<!-- @iconify/vue的二次封装 -->
<template>
  <Icon v-bind="iconProps" :inline="inline" />
</template>

<script setup lang="ts">
import { Icon, IconProps } from "@iconify/vue";

const { inline = true, ...iconProps } = defineProps<IconProps>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
</script>

<style scoped></style>

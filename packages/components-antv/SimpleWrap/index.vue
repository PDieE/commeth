<template>
  <div>
    <div v-if="loading" class="text-center pt-20%"><Spin /></div>
    <Result v-else-if="error" v-bind="errorProps">
      <template #extra>
        <Button type="primary" @click="emits('retry')">重试</Button>
      </template>
    </Result>
    <Empty v-else-if="empty" />
    <slot v-else></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Button, Empty, Result, ResultProps, Spin } from "ant-design-vue";

const {
  loading = false,
  error = false,
  empty = false,
} = defineProps<{
  /** 加载状态, 优先级最高 */
  loading?: boolean;
  /** 错误状态, 优先级次于 `loading` */
  error?: boolean | (ResultProps & { class?: unknown });
  /** 空状态, 优先级最低 */
  empty?: boolean;
}>();
const emits = defineEmits<{
  /** 重试 */
  retry: [];
}>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const errorProps = computed<ResultProps>(() => {
  if (!error) {
    return {};
  }

  if (error === true) {
    return { status: "error", subTitle: "数据获取失败" };
  }

  return { status: "error", subTitle: "数据获取失败", ...error };
});
</script>

<style lang="less" scoped></style>

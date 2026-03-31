<template>
  <div class="text-center space-x-2 text-#999">
    <Spin v-if="loading" />
    <span v-else-if="finished">没有更多了</span>
    <template v-else-if="error">
      <span>数据获取失败</span>
      <Button type="primary" size="small" @click="emits('retry')">重试</Button>
    </template>
    <span v-else>上拉加载更多</span>
  </div>
</template>

<script lang="ts" setup>
  import { Spin, Button } from 'ant-design-vue';

  const {
    loading = false,
    finished = false,
    error = false,
  } = defineProps<{
    /**
     * 是否加载中
     */
    loading?: boolean;
    /**
     * 是否加载完成
     */
    finished?: boolean;
    /**
     * 是否加载错误
     */
    error?: boolean;
  }>();
  const emits = defineEmits<{
    /**
     * 重试
     */
    retry: [];
  }>();

  /**
   * ====================
   *       基本逻辑
   * ====================
   */
</script>

<style lang="less" scoped></style>

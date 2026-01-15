<template>
  <div>
    <Tooltip :title="tip" placement="bottom">
      <Button
        :type="active ? 'primary' : 'text'"
        size="small"
        :disabled="disabled"
      >
        <template v-if="$slots.icon" #icon>
          <div class="t-icon"><slot name="icon" /></div>
        </template>
      </Button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { Button, Tooltip } from "ant-design-vue";

const {
  tip = undefined,
  active,
  disabled,
} = defineProps<{
  /** 提示 */
  tip?: string;
  /** 是否激活 */
  active?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}>();
</script>

<style lang="scss" scoped></style>

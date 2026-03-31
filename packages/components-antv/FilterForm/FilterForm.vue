<!-- 筛选表单 -->
<template>
  <div>
    <Form label-width="auto">
      <div class="flex">
        <div
          ref="itemsBoxRef"
          class="flex-1 flex flex-wrap gap-4 overflow-hidden"
        >
          <div
            v-for="(child, index) in filterFormItems"
            :key="index"
            :style="{ width: formItemWidth }"
          >
            <component :is="child" />
          </div>
        </div>
        <div class="space-x-3 ml-4">
          <Button v-if="showSearch" type="primary" @click="emits('search')">
            <template #icon>
              <CeIconifyIcon
                class="anticon"
                icon="ant-design:search-outlined"
              />
            </template>
            查询
          </Button>
          <Button type="default" @click="reset()">重置</Button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core";
import { Button, Form } from "ant-design-vue";
import { cloneDeep, pick } from "es-toolkit";
import {
  computed,
  Comment,
  nextTick,
  shallowRef,
  useTemplateRef,
  Fragment,
  VNode,
  useSlots,
} from "vue";

import { CeIconifyIcon, FilterFormProps } from "../index";

const formData = defineModel<Record<string, unknown>>("formData", {
  default: {},
});
const {
  showSearch = true,
  itemWidth = 300,
  resetIgnore = [],
} = defineProps<FilterFormProps>();
const emits = defineEmits<{
  /** 查询 */
  search: [];
  /** 重置 */
  reset: [];
}>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const slots = useSlots();
const filterFormItems = computed(() => {
  return getItems(slots.default?.() || []);
});
/**
 * 获取并过滤插槽元素
 * @param items 插槽元素
 */
function getItems(items: VNode[]) {
  const list: VNode[] = [];
  for (const item of items) {
    if (item.type === Fragment) {
      list.push(...getItems((item.children || []) as VNode[]));
    } else if (item.type !== Comment) {
      list.push(item);
    }
  }
  return list;
}
const defaultFormData: Record<string, unknown> = cloneDeep(formData.value);
/** 重置 */
async function reset() {
  if (!resetIgnore || !resetIgnore.length) {
    formData.value = cloneDeep(defaultFormData);
  } else {
    formData.value = {
      ...cloneDeep(defaultFormData),
      ...cloneDeep(pick(formData.value, resetIgnore)),
    };
  }

  await nextTick();
  emits("reset");
}

/**
 * ====================
 *      字段元素尺寸
 * ====================
 */
const gap = 16;
/** 预烘焙宽度范围 */
const columnsNumberMap = computed<[number, number][]>(() => {
  return Array.from({ length: 10 }, (_, index) => {
    const width = itemWidth * (index + 1) + index * gap;
    const nextIdx = index + 1;
    const nextWidth = itemWidth * (nextIdx + 1) + nextIdx * gap;
    const widthRange: [number, number] = [width, nextWidth];
    return widthRange;
  });
});
const itemsBoxRef = useTemplateRef<HTMLDivElement>("itemsBoxRef");
const formItemWidth = shallowRef(`${itemWidth}px`);
useResizeObserver(itemsBoxRef, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;
  const columnIdx = columnsNumberMap.value.findIndex(
    ([start, end]) => width >= start && width <= end,
  );

  // 未找到预定义的宽度，直接输出设定宽度
  if (columnIdx === -1) {
    formItemWidth.value = `${itemWidth}px`;
    return;
  }

  // 动态计算宽度
  const lineNumber = columnIdx + 1;
  formItemWidth.value = `calc(${((1 / lineNumber) * 100).toFixed(2)}% - ${(gap * columnIdx) / lineNumber}px)`;
});

defineExpose({ reset });
</script>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>

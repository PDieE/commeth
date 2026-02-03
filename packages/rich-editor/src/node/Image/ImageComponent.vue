<template>
  <node-view-wrapper class="inline-block relative leading-0">
    <Resizable
      v-if="resizeConfig.enabled"
      v-model:width="width"
      v-model:height="height"
      class="max-w-full"
      :enabled="resizeConfig.enabled"
      :directions="resizeConfig.directions"
      :min-width="resizeConfig.minWidth"
      :min-height="resizeConfig.minHeight"
      :always-preserve-aspect-ratio="resizeConfig.alwaysPreserveAspectRatio"
      @resize-end="onResizeEnd"
    >
      <img
        v-bind="node.attrs"
        class="max-w-full h-auto block"
        :style="imageStyle"
      />
    </Resizable>
    <img
      v-else
      v-bind="node.attrs"
      class="max-w-full h-auto block"
      :style="imageStyle"
    />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { computed, ref } from "vue";

import Resizable from "../../components/Resizable.vue";

const props = defineProps(nodeViewProps);

const width = ref<number | string>(props.node.attrs.width || "auto");
const height = ref<number | string>(props.node.attrs.height || "auto");

const resizeConfig = computed(() => {
  const resize = props.extension.options.resize;
  if (!resize) return { enabled: false };
  if (typeof resize === "object") {
    return {
      enabled: resize.enabled !== false,
      directions: resize.directions,
      minWidth: resize.minWidth,
      minHeight: resize.minHeight,
      alwaysPreserveAspectRatio: resize.alwaysPreserveAspectRatio,
    };
  }
  return { enabled: !!resize };
});

const imageStyle = computed(() => {
  return {
    width: typeof width.value === "number" ? `${width.value}px` : width.value,
    height:
      typeof height.value === "number" ? `${height.value}px` : height.value,
  };
});

const onResizeEnd = (size: { width: number; height: number }) => {
  props.updateAttributes({
    width: size.width,
    height: size.height,
  });
};
</script>

<style lang="scss" scoped>
.node-view-wrapper {
  display: inline-block;
  line-height: 0;
}
</style>

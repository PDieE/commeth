<template>
  <div
    ref="containerRef"
    data-resize-container
    class="relative inline-block leading-0"
    :style="containerStyle"
  >
    <div data-resize-wrapper class="relative h-full w-full">
      <slot />

      <template v-if="enabled">
        <div
          v-for="dir in activeDirections"
          :key="dir"
          :data-resize-handle="dir"
          @pointerdown.stop.prevent="onPointerDown($event, dir)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { computed, ref } from "vue";

const width = defineModel<number | string>("width");
const height = defineModel<number | string>("height");

const props = withDefaults(
  defineProps<{
    enabled?: boolean;
    directions?: string[];
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    alwaysPreserveAspectRatio?: boolean;
  }>(),
  {
    enabled: true,
    directions: () => [
      "top",
      "right",
      "bottom",
      "left",
      "top-right",
      "top-left",
      "bottom-right",
      "bottom-left",
    ],
    minWidth: 30,
    minHeight: 30,
    alwaysPreserveAspectRatio: false,
  },
);

const emit = defineEmits<{
  resizeStart: [];
  resizing: [size: { width: number; height: number }];
  resizeEnd: [size: { width: number; height: number }];
}>();

const containerRef = ref<HTMLElement | null>(null);
const { width: elementWidth, height: elementHeight } =
  useElementSize(containerRef);

const activeDirections = computed(() => {
  const parseSize = (val: string | number | undefined, fallback: number) => {
    if (val === undefined || val === "") return fallback;
    if (typeof val === "number") return val;
    const parsed = parseFloat(val as string);
    return isNaN(parsed) ? fallback : parsed;
  };

  const w = parseSize(width.value, elementWidth.value ?? Infinity);
  const h = parseSize(height.value, elementHeight.value ?? Infinity);

  return props.directions.filter((dir) => {
    if ((dir === "top" || dir === "bottom") && w < 80) {
      return false;
    }
    if ((dir === "left" || dir === "right") && h < 80) {
      return false;
    }
    return true;
  });
});

const containerStyle = computed(() => {
  const style: Record<string, string> = {};
  if (width.value !== undefined) {
    style.width =
      typeof width.value === "number" ? `${width.value}px` : width.value;
  }
  if (height.value !== undefined) {
    style.height =
      typeof height.value === "number" ? `${height.value}px` : height.value;
  }
  return style;
});

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let currentDir = "";
let aspectRatio = 1;

const onPointerDown = (event: PointerEvent, dir: string) => {
  if (!props.enabled || !containerRef.value) return;

  startX = event.clientX;
  startY = event.clientY;
  startWidth = containerRef.value.offsetWidth;
  startHeight = containerRef.value.offsetHeight;
  aspectRatio = startWidth / startHeight;
  currentDir = dir;

  emit("resizeStart");

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  document.body.style.cursor = getCursorForDir(dir);
  document.body.style.userSelect = "none";
};

const onPointerMove = (event: PointerEvent) => {
  if (!currentDir || !containerRef.value) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  let newWidth = startWidth;
  let newHeight = startHeight;

  const isShift = event.shiftKey || props.alwaysPreserveAspectRatio;

  if (currentDir.includes("right")) {
    newWidth = startWidth + dx;
  } else if (currentDir.includes("left")) {
    newWidth = startWidth - dx;
  }

  if (currentDir.includes("bottom")) {
    newHeight = startHeight + dy;
  } else if (currentDir.includes("top")) {
    newHeight = startHeight - dy;
  }

  // Handle aspect ratio
  if (isShift) {
    if (currentDir === "left" || currentDir === "right") {
      newHeight = newWidth / aspectRatio;
    } else if (currentDir === "top" || currentDir === "bottom") {
      newWidth = newHeight * aspectRatio;
    } else {
      // Corner resizing with aspect ratio
      const ratio = Math.max(
        Math.abs(newWidth / startWidth),
        Math.abs(newHeight / startHeight),
      );
      newWidth = startWidth * ratio;
      newHeight = startHeight * ratio;
    }
  }

  // Constraints
  if (props.minWidth !== undefined)
    newWidth = Math.max(props.minWidth, newWidth);
  if (props.minHeight !== undefined)
    newHeight = Math.max(props.minHeight, newHeight);
  if (props.maxWidth !== undefined)
    newWidth = Math.min(props.maxWidth, newWidth);
  if (props.maxHeight !== undefined)
    newHeight = Math.min(props.maxHeight, newHeight);

  width.value = newWidth;
  height.value = newHeight;
  emit("resizing", { width: newWidth, height: newHeight });
};

const onPointerUp = () => {
  if (!currentDir) return;

  const finalWidth = containerRef.value?.offsetWidth || 0;
  const finalHeight = containerRef.value?.offsetHeight || 0;

  emit("resizeEnd", { width: finalWidth, height: finalHeight });

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";

  currentDir = "";
};

const getCursorForDir = (dir: string) => {
  switch (dir) {
    case "top":
    case "bottom":
      return "ns-resize";
    case "left":
    case "right":
      return "ew-resize";
    case "top-left":
    case "bottom-right":
      return "nwse-resize";
    case "top-right":
    case "bottom-left":
      return "nesw-resize";
    default:
      return "default";
  }
};
</script>

<style lang="scss" scoped>
[data-resize-container] {
  line-height: 0;

  &.ProseMirror-selectednode {
    [data-resize-wrapper] {
      border-radius: 3px;
      outline: 3px solid var(--brand-color);
    }
  }

  [data-resize-wrapper] {
    outline: 3px solid transparent;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      outline: 3px solid var(--brand-color);
      border-radius: 3px;

      [data-resize-handle] {
        opacity: 1;
      }
    }
  }
}

/* 图片尺寸控制 */
[data-resize-handle] {
  position: absolute;
  z-index: 10;
  opacity: 0;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--brand-color);
  touch-action: none;

  &:hover {
    background: var(--brand-color-active);
  }

  /* Corner handles */
  &[data-resize-handle="top-left"],
  &[data-resize-handle="top-right"],
  &[data-resize-handle="bottom-left"],
  &[data-resize-handle="bottom-right"] {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 1px solid #fff;
  }

  &[data-resize-handle="top-left"] {
    top: -6px !important;
    left: -6px !important;
    cursor: nwse-resize;
  }

  &[data-resize-handle="top-right"] {
    top: -6px !important;
    right: -6px !important;
    cursor: nesw-resize;
  }

  &[data-resize-handle="bottom-left"] {
    bottom: -6px !important;
    left: -6px !important;
    cursor: nesw-resize;
  }

  &[data-resize-handle="bottom-right"] {
    bottom: -6px !important;
    right: -6px !important;
    cursor: nwse-resize;
  }

  /* Edge handles */
  &[data-resize-handle="top"],
  &[data-resize-handle="bottom"],
  &[data-resize-handle="right"],
  &[data-resize-handle="left"] {
    border-radius: 999px;
  }

  &[data-resize-handle="top"],
  &[data-resize-handle="bottom"] {
    height: 6px;
    left: 20% !important;
    right: 20% !important;
  }

  &[data-resize-handle="top"] {
    top: 10px !important;
    cursor: ns-resize;
  }

  &[data-resize-handle="bottom"] {
    bottom: 10px !important;
    cursor: ns-resize;
  }

  &[data-resize-handle="left"],
  &[data-resize-handle="right"] {
    width: 6px;
    top: 20% !important;
    bottom: 20% !important;
  }

  &[data-resize-handle="left"] {
    left: 10px !important;
    cursor: ew-resize;
  }

  &[data-resize-handle="right"] {
    right: 10px !important;
    cursor: ew-resize;
  }
}
</style>

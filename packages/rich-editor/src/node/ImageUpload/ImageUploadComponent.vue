<template>
  <node-view-wrapper class="w-full max-full">
    <ProgressRoot
      v-model="progress"
      class="relative flex h-16 w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <!-- 进度条背景 -->
      <ProgressIndicator
        class="bg-purple-50 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
        :style="`transform: translateX(-${100 - progress}%)`"
      />
      <div class="absolute inset-0 flex items-center px-4">
        <div
          class="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-[#6b4bf5] text-white"
        >
          <Icon icon="lucide:cloud-upload" class="h-6 w-6" />
        </div>
        <div class="ml-3 flex flex-col justify-center overflow-hidden mr-3">
          <span
            class="truncate text-sm font-medium text-gray-900 leading-tight"
          >
            {{ file?.name || "未知文件" }}
          </span>
          <span
            v-if="errorMessage"
            class="text-xs text-red-500 leading-tight mt-0.5"
          >
            {{ errorMessage }}
          </span>
          <span v-else class="text-xs text-gray-500 leading-tight mt-0.5">
            {{ formatFileSize(file?.size || 0) }}
          </span>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <span v-if="!errorMessage" class="text-sm font-medium text-[#6b4bf5]">
            {{ progress }}%
          </span>
          <button
            v-if="errorMessage && canRetry"
            class="cursor-pointer bg-transparent border-none rounded-0.75 flex items-center justify-center size-6 text-gray-400 hover:text-gray-600"
            title="重试"
            @click="doUpload"
          >
            <Icon icon="tdesign:refresh" class="text-4" />
          </button>
          <button
            class="cursor-pointer bg-transparent border-none rounded-0.75 flex items-center justify-center size-6 text-gray-400 hover:text-gray-600"
            @click="removeNode"
          >
            <Icon icon="tdesign:close" class="text-4" />
          </button>
        </div>
      </div>
    </ProgressRoot>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { useFileValidate } from "@commeth/hooks";
import { Icon } from "@iconify/vue";
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { computed, onBeforeMount, shallowRef } from "vue";

import { useBridgeStore } from "../../injectionState";

const { node, deleteNode, getPos, editor } = defineProps(nodeViewProps);

onBeforeMount(() => {
  doUpload();
});

/**
 * ====================
 *       基本逻辑
 * ====================
 */
const bridgeStore = useBridgeStore();
const file = computed(() => {
  const f = node.attrs.file;
  return f instanceof File ? f : undefined;
});

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const removeNode = () => {
  deleteNode();
};
const { validateFile } = useFileValidate({
  accept: bridgeStore?.imageUpload?.accept || "image/*",
  sizeLimit: bridgeStore?.imageUpload?.sizeLimit,
  minImageSize: bridgeStore?.imageUpload?.minImageSize,
  maxImageSize: bridgeStore?.imageUpload?.maxImageSize,
  imageRatio: bridgeStore?.imageUpload?.imageRatio,
});
const progress = shallowRef(0);
const errorMessage = shallowRef("");
const canRetry = shallowRef(false);
/** 进行上传 */
const doUpload = async () => {
  if (!file.value) {
    errorMessage.value = "文件不存在";
    canRetry.value = false;
    return;
  }
  if (!bridgeStore?.imageUpload?.request) {
    errorMessage.value = "未定义uploadRequest";
    canRetry.value = false;
    return;
  }

  // 校验文件
  const validateResult = await validateFile(file.value);
  if (!validateResult.valid) {
    errorMessage.value = validateResult.message!;
    canRetry.value = false;
    return;
  }

  errorMessage.value = "";
  canRetry.value = true;
  bridgeStore.imageUpload.request({
    file: file.value,
    onProgress: (event) => {
      if (event.percent) {
        progress.value = Math.round(event.percent);
      }
    },
    onSuccess: (url) => {
      progress.value = 100;
      const pos = getPos();
      if (typeof pos === "number") {
        const imageNode = editor.schema.nodes.image.create({
          src: url,
        });
        editor.view.dispatch(
          editor.state.tr.replaceWith(pos, pos + 1, imageNode),
        );
      }
    },
    onError: (error) => {
      errorMessage.value = error.message;
      canRetry.value = true;
      console.warn(error);
    },
  });
};
</script>

<style lang="scss"></style>

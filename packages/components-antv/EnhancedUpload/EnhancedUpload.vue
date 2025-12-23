<!-- 上传组件 -->
<template>
  <Upload
    v-bind="uploadProps"
    v-model:fileList="modelValue"
    :listType="listType"
    :customRequest="customRequest"
    :openFileDialogOnClick="openFileDialogOnClick"
    :maxCount="maxCount"
    :accept="accept"
    :beforeUpload="beforeUpload"
    @preview="previewImage"
  >
    <slot v-if="$slots.default" />
    <Button v-if="listType !== 'picture-card'" :disabled="overMaxCount">
      <template #icon>
        <CeIconifyIcon class="mr-2" icon="ant-design:upload-outlined" />
      </template>
      点我上传
    </Button>
    <div v-else-if="!overMaxCount" class="flex flex-col items-center">
      <CeIconifyIcon icon="ant-design:plus-outlined" />
      <div class="mt-2">点我上传</div>
    </div>
  </Upload>
  <div class="hidden">
    <ImagePreviewGroup :preview="showPreviewImage">
      <Image v-for="(item, i) in previewImages" :key="i" :src="item" />
    </ImagePreviewGroup>
  </div>
</template>

<script setup lang="ts">
import {
  Button,
  Image,
  ImagePreviewGroup,
  message,
  Upload,
  UploadFile,
} from "ant-design-vue";
import { FileType } from "ant-design-vue/es/upload/interface";
import { PreviewGroupPreview } from "ant-design-vue/es/vc-image/src/PreviewGroup";
import { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import { imageDimensionsFromData } from "image-dimensions";
import prettyBytes from "pretty-bytes";
import { computed, ref } from "vue";

import { CeIconifyIcon } from "../IconifyIcon";
import { EnhancedUploadProps } from "./types";

/** accept 属性的对象形式 */
interface Accept {
  value: string;
  type: "mime" | "ext" | "all" | "mistake";
}

const modelValue = defineModel<UploadFile[]>("modelValue");
const {
  request,
  listType,
  openFileDialogOnClick = true,
  maxCount,
  sizeLimit = Infinity,
  accept,
  minImageSize,
  maxImageSize,
  imageRatio,
  ...uploadProps
} = defineProps<EnhancedUploadProps>();

/**
 * ====================
 *       基本逻辑
 * ====================
 */
/** 是否达到或超过最大上传数量 */
const overMaxCount = computed(
  () => modelValue.value && modelValue.value.length >= (maxCount || Infinity),
);
/**
 * 上传前校验
 * @param file 要上传的文件
 */
async function beforeUpload(file: FileType) {
  // 尺寸校验
  if (file.size > sizeLimit) {
    message.warn(
      `${file.name} 超过 ${prettyBytes(sizeLimit, { binary: true }).replace("i", "")}`,
    );
    return Upload.LIST_IGNORE;
  }

  // 格式类型校验
  if (!acceptCheck(file)) {
    message.warn(`${file.name} 的类型不符合要求`);
    return Upload.LIST_IGNORE;
  }

  const imageCheckRes = await imageSizeCheck(file);
  if (!imageCheckRes) {
    return Upload.LIST_IGNORE;
  }

  return true;
}
const acceptList = computed<Accept[]>(() => {
  if (!accept) {
    return [{ value: "*", type: "all" }];
  }

  // 转为数组并去除空格
  const list = accept?.split(",")?.map((v) => {
    const value = v.trim();
    let type: Accept["type"] = "ext";
    if (value === "*") {
      type = "all";
    } else if (value.startsWith(".")) {
      type = "ext";
    } else if (/^[a-zA-Z0-9-]+\/(\*|[a-zA-Z0-9-._]+)$/.test(value)) {
      type = "mime";
    } else {
      type = "mistake";
    }
    const data: Accept = {
      value,
      type,
    };
    return data;
  });
  return list;
});
/**
 * 校验文件格式是否符合要求
 * @param file 要校验的文件
 */
function acceptCheck(file: FileType) {
  const checkGate = {
    all: () => true,
    ext: (v: Accept) => {
      const ext = file.name.split(".").pop() || "";
      return ext === v.value.replace(".", "");
    },
    mime: (v: Accept) => {
      const [type, subtype] = v.value.split("/");
      const [fileType, fileSubtype] = file.type.split("/");
      if (type !== fileType) {
        return false;
      }
      return subtype === "*" || subtype === fileSubtype;
    },
    mistake: () => false,
  };
  for (const item of acceptList.value) {
    if (!checkGate[item.type]) {
      continue;
    }
    if (checkGate[item.type](item)) {
      return true;
    }
  }

  return false;
}
const imageSize = computed(() => {
  if (!minImageSize && !maxImageSize) {
    return undefined;
  }
  let min: { width: number; height: number } | undefined = undefined;
  let max: { width: number; height: number } | undefined = undefined;
  if (typeof minImageSize === "number") {
    min = { width: minImageSize, height: minImageSize };
  }
  if (Array.isArray(minImageSize)) {
    min = { width: minImageSize[0], height: minImageSize[1] };
  }
  if (typeof maxImageSize === "number") {
    max = { width: maxImageSize, height: maxImageSize };
  }
  if (Array.isArray(maxImageSize)) {
    max = { width: maxImageSize[0], height: maxImageSize[1] };
  }
  return { min, max };
});
/**
 * 校验图片尺寸/比例是否符合要求
 * @param file 要校验的文件
 */
async function imageSizeCheck(file: FileType) {
  if (!imageSize.value && !imageRatio) {
    return Promise.resolve(true);
  }

  const arrayBuffer = await file.arrayBuffer();
  const image = imageDimensionsFromData(new Uint8Array(arrayBuffer));
  if (!image) {
    return Promise.resolve(true);
  }

  // 尺寸校验
  const { min, max } = imageSize.value || {};
  if (min && image?.width < min.width) {
    message.warn(`${file.name} 宽度小于 ${min.width}px`);
    return Promise.resolve(false);
  }
  if (min && image?.height < min.height) {
    message.warn(`${file.name} 高度小于 ${min.height}px`);
    return Promise.resolve(false);
  }
  if (max && image?.width > max.width) {
    message.warn(`${file.name} 宽度大于 ${max.width}px`);
    return Promise.resolve(false);
  }
  if (max && image?.height > max.height) {
    message.warn(`${file.name} 高度大于 ${max.height}px`);
    return Promise.resolve(false);
  }

  // 比例校验
  if (
    imageRatio &&
    image.width / image.height !== imageRatio[0] / imageRatio[1]
  ) {
    message.warn(`${file.name} 的比例不符合 ${imageRatio[0]}:${imageRatio[1]}`);
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
}
/**
 * 自定义上传请求
 * @param options 上传选项
 */
function customRequest(options: UploadRequestOption) {
  request({
    ...options,
    onSuccess: async (body) => {
      (options.file as UploadFile).url = body;
      options.onSuccess?.(body);
    },
  });
}

/**
 * ====================
 *       图片预览
 * ====================
 */
const showPreviewImage = ref<PreviewGroupPreview>({
  visible: false,
  current: 0,
  onVisibleChange: (visible) => {
    showPreviewImage.value.visible = visible;
  },
});
const previewImages = computed(() => {
  if (!modelValue.value) {
    return [];
  }
  return modelValue.value.filter((v) => v.url).map((v) => v.url!);
});
/**
 * 预览图片
 * @param image 要预览的图片
 */
function previewImage(image: UploadFile) {
  if (!image.url || !previewImages.value.length) {
    return;
  }

  let current = 0;

  const index = previewImages.value.indexOf(image.url);
  if (index > -1) {
    current = index;
  }

  showPreviewImage.value.current = current;
  showPreviewImage.value.visible = true;
}
</script>

<style scoped></style>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <CeJumpLink>跳转链接</CeJumpLink>
  <CeJumpLink type="circle" />
  <CeJumpLink type="circle">跳转链接</CeJumpLink>
  <CeAMapSelect defaultAddress="紫琅科技城" />
  <div>
    <CeEnhancedUpload
      :size-limit="1024 * 1024 * 2"
      multiple
      accept=".png,.jpg,.jpeg"
      :request="request"
    />
  </div>
  <CeFilterForm
    v-model:form-data="filterFormData"
    class="mb-4"
    :resetIgnore="['status']"
  >
    <input v-model="filterFormData.name" placeholder="服务名称" />
  </CeFilterForm>
  <CeRichEditor
    :imageUpload="{
      request,
      accept: '.png,.jpg,.jpeg',
      sizeLimit: 1024 * 1024,
      minImageSize: 1000,
      maxImageSize: 2000,
      imageRatio: [1280, 1707],
    }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  CeJumpLink,
  CeAMapSelect,
  CeEnhancedUpload,
  CeFilterForm,
} from "../packages/components-antv";
import { CeRichEditor } from "../packages/rich-editor";
import { AMapService } from "../packages/utils";

// 初始化高德地图
AMapService.init({
  key: "6b342ef0a0bc008d7c3831aab7e4f4d1",
  securityJsCode: "8712ec1f8864c180abafddd4616877df",
});
function request(options: {
  onSuccess?: (v: string) => void;
  onProgress?: (v: { percent: number }) => void;
}) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    options.onProgress?.({ percent: progress });
    if (progress >= 100) {
      options.onSuccess?.(
        "https://public.house-keeper.cn/static/dev/0d7e4316879345aa96d9d381e4af109a.jpg",
      );
      clearInterval(interval);
    }
  }, 100);
}
const filterFormData = ref({ name: "" });
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

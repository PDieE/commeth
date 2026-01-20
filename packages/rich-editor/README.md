<p align="center">
  <a href="https://www.npmjs.com/package/@commeth/rich-editor">
    <img src="https://img.shields.io/npm/v/@commeth/rich-editor.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@commeth/rich-editor">
    <img src="https://img.shields.io/npm/dm/@commeth/rich-editor" alt="Downloads">
  </a>
</p>

Commeth Rich Editor 是基于Tiptap实现的富文本组件

# 🎉 Features

- 以 Tiptap 3.x 为基础实现
- UI 采用 Reka 2.7.x
- 基于 Vue 3.5+

# 📦 Installation

```shell
# NPM
npm i @commeth/rich-editor
# PNPM
pnpm add @commeth/rich-editor
```

# 📖 Example

[基础示例](https://stackblitz.com/edit/vitejs-vite-8p4jj3iu)

# 🔨 Usage

```vue
<template>
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
import { CeRichEditor } from "@commeth/rich-editor";

function request(options: {
  onSuccess?: (v: string) => void;
  onProgress?: (v: { percent: number }) => void;
}) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    options.onProgress?.({ percent: progress });
    if (progress >= 100) {
      options.onSuccess?.(URL.createObjectURL(options.file));
      clearInterval(interval);
    }
  }, 100);
}
</script>
```

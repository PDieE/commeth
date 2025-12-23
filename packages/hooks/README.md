<p align="center">
  <a href="https://www.npmjs.com/package/@commeth/hooks">
    <img src="https://img.shields.io/npm/v/@commeth/hooks.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@commeth/hooks">
    <img src="https://img.shields.io/npm/dm/@commeth/hooks" alt="Downloads">
  </a>
</p>

Commeth Hooks 一款业务相关的 Vue 3 钩子函数库

# 🎉 Features

- 基于 Vue 3.5+

# 📦 Installation

```shell
# NPM
npm i @commeth/hooks
# PNPM
pnpm add @commeth/hooks
```

# 🔨 Usage

```js
import { useAsyncData } from "@commeth/hooks";

const { data, status, execute } = useAsyncData(() => api(), {
  // some options
});
```

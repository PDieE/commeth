<script setup lang="ts">
import { CeJumpLink } from "@commeth/components-antv";
import { CeAMapSelect } from "@commeth/components-antv";
import { AMapService } from "@commeth/utils";

// 初始化高德地图
AMapService.init({
  key: "6b342ef0a0bc008d7c3831aab7e4f4d1",
  securityJsCode: "8712ec1f8864c180abafddd4616877df",
});
</script>

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
  <CeAMapSelect />
</template>

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

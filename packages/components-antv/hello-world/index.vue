<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
const {message='Hello, World!'} = defineProps<{
  message?: string
}>()
</script>

<style scoped>
.hello-world {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
}

h1 {
  color: #333;
  font-size: 24px;
  margin: 0;
}
</style>
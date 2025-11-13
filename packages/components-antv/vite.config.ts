import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import  { resolve } from 'path';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'CommethComponentsAntv',
      // 将添加适当的扩展名后缀
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
            format: "es",
            entryFileNames: "[name].js",
            exports: "named",
            name: "CommethComponentsAntv",
            dir: "./dist",
        },
        {
            format: "es",
            entryFileNames: "[name].js",
            exports: "named",
            preserveModules: true,
            preserveModulesRoot: "packages",
            dir: "./dist/es",
        },
        {
            format: "cjs",
            entryFileNames: "[name].js",
            exports: "named",
            preserveModules: true,
            preserveModulesRoot: "packages",
            dir: "./dist/lib",
        },
     ],
    }
  },
  plugins: [vue(),dts()]
});

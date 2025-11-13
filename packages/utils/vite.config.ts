import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite'
import  { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'CommethUtils',
      // 将添加适当的扩展名后缀
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue']
    }
  },
  plugins: [dts()]
});

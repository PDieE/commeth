import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'unplugin-dts/vite'
import { resolve } from 'path';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'main.ts'),
      name: 'CommethComponentsAntv',
      formats: ['es'],
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
            preserveModulesRoot: ".",
            dir: "./dist/es",
        },
        // {
        //     format: "cjs",
        //     entryFileNames: "[name].js",
        //     exports: "named",
        //     preserveModules: true,
        //     preserveModulesRoot: "packages",
        //     dir: "./dist/lib",
        // },
     ],
    }
  },
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.prod.json', processor: 'vue' })]
});
 
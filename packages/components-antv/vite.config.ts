import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "unplugin-dts/vite";
import { resolve } from "path";
import UnoCSS from "unocss/vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "CommethComponentsAntv",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "virtual:uno.css", "ant-design-vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: ".",
          dir: "./dist/es",
        },
      ],
    },
  },
  plugins: [
    vue(),
    UnoCSS({ mode: "vue-scoped" }),
    dts({
      tsconfigPath: "./tsconfig.prod.json",
      processor: "vue",
      outDirs: ["./dist/es"],
    }),
    libInjectCss(),
  ],
});

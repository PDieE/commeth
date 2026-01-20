import vue from "@vitejs/plugin-vue";
import { preview } from "@vitest/browser-preview";
import { resolve } from "path";
import UnoCSS from "unocss/vite";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";
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
      external: [
        "vue",
        "virtual:uno.css",
        "ant-design-vue",
        "@iconify/vue",
        "@vueuse/core",
        "es-toolkit",
        "es-toolkit/compat",
        "@commeth/utils",
        "@commeth/hooks",
        /^@tiptap\//,
        "reka-ui",
        "culori",
        "vue-color",
        "vue-color/style.css",
      ],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: ".",
          dir: "./dist",
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
      outDirs: ["./dist"],
    }),
    libInjectCss(),
  ],
  test: {
    browser: {
      provider: preview(),
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
  },
});

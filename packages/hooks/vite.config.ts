import { resolve } from "path";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "CommethHooks",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core", "pretty-bytes", "image-dimensions"],
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
    dts({
      tsconfigPath: "./tsconfig.prod.json",
      outDirs: ["./dist"],
    }),
  ],
});

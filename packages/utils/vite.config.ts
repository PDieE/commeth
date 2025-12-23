import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "CommethUtils",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "@amap/amap-jsapi-loader"],
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

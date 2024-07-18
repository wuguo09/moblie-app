import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import nodeResolve from "@rollup/plugin-node-resolve";
import * as path from "path";

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      assets: path.resolve("../src/assets"),
      components: path.resolve("../src/components"),
      pages: path.resolve("../src/pages"),
      utils: path.resolve("../src/utils"),
      stores: path.resolve("../src/stores"),
      router: path.resolve("../src/router"),
      config: path.resolve("../src/config"),
    },
  },
  build: {
    outDir: "dist",
    terserOptions: {
      compress: {
        keep_fnames: true, // 保留函数和变量名
        keep_infinity: true,
        drop_console: true,
      },
    },
    target: "esnext",
    minify: "terser", // 混淆器，terser构建后文件体积更小
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    lib: {
      entry: resolve(__dirname, "../src/index.ts"),
      name: "mobile-app",
      formats: ["es"],
      fileName: (format) => `mobile-app.${format}.js`,
    },
    rollupOptions: {
      external: [
        "vue",
        "weixin-js-sdk",
        "pinia",
        "uni-mini-router",
        "pinia-plugin-unistorage",
      ],
      output: {
        /*开启后只打包一个umd*/
        inlineDynamicImports: false,
        //构建外部链接
        paths: {},
        compact: true,
        dir: "dist",
        // 确保外部化处理那些你不想打包进库的依赖
      },
    },
  },
  plugins: [nodeResolve(), dts()],
});

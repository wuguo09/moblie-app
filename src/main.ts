import App from "./App.vue";
import { routes } from "./router";
import { createMobileApp } from "./control";
import uviewPlus from "uview-plus";
// createSSRApp;
export function createApp() {
  const { app } = createMobileApp({
    appCom: App,
    routes: routes,
    env: {
      httpBaseUrl: "https://beijingroad.pre.paramst.cn/api",
      fileBaseUrl: "https://beijingroad.pre.paramst.cn",
      fileUploadUri:
        "/api/resourceApp/resource/uploadFile?uploadPath=beijing-road",
    },
    hooks: {
      onBeforeCreate() {},
      onCreated(app) {
        app.use(uviewPlus);
      },
    },
  });
  return {
    app,
  };
}

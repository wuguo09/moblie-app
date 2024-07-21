import App from "./App.vue";
import { routes } from "./router";
import { createMobileApp } from "./control";
import uviewPlus from "uview-plus";
// import { createSSRApp } from "vue";
export function createApp() {
  const { app } = createMobileApp({
    appCom: App,
    routes: routes,
    env: {
      httpBaseUrl: "",
      fileBaseUrl: "",
      fileUploadUri: "",
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

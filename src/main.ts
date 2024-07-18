import App from "./App.vue";
import { routes } from "./router";
import { createMobileApp } from "./control";
export function createApp() {
  return createMobileApp({
    appCom: App,
    routes: routes,
    env: {
      httpBaseUrl: "",
      fileBaseUrl: "",
      fileUploadUri: "",
    },
    hooks: {
      onBeforeCreate() {},
      onCreated(app) {},
    },
  });
}

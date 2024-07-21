import { createRouter, type Router } from "uni-mini-router";
import type { IMobileAppHooks, IMobileAppOption, TApp } from "./type";
import { createSSRApp } from "vue";


export class MobileApp {
  private _app: TApp;
  private _option: IMobileAppOption;
  private _router: Router;

  constructor(option: IMobileAppOption) {
    this._option = option;
    this.emitHooks("onBeforeCreate");
    this._app = this.createApp();
    this.emitHooks("onCreated", this.app);
    this._router = this.createRouter();
  }

  /**调用钩子 */
  private async emitHooks<
    T extends keyof IMobileAppHooks = keyof IMobileAppHooks
  >(key: T, ...args: Parameters<IMobileAppHooks[T]>) {
    if (!this.hooks) return;
    const fun = this.hooks[key];
    if (!fun) return;
    // @ts-ignore
    return (await fun(...args)) as ReturnType<IFileUploadHooks[T]>;
  }

  /**全局静态实例 */
  static _context: MobileApp;

  static get context() {
    return MobileApp._context;
  }

  /**初始化全局实例 */
  static initInstance(option: IMobileAppOption) {
    MobileApp._context = new MobileApp(option);
    return {
      app: MobileApp.context.app,
    };
  }

  /**创建路由 */
  private createRouter() {
    const router = createRouter({
      routes: [...this.option.routes!], // 路由表信息
    });
    this.app.use(router);
    return router;
  }

  /**创建app */
  private createApp() {
    const app = createSSRApp(this._option.appCom);
    return app;
  }

  public get option() {
    return this._option;
  }

  public get app() {
    return this._app;
  }

  public get router() {
    return this._router;
  }

  public get httpBaseUrl() {
    return this._option.env.httpBaseUrl;
  }

  public get fileBaseUrl() {
    return this._option.env.fileBaseUrl;
  }

  public get fileUploadUri() {
    return this._option.env.fileUploadUri;
  }

  private get hooks() {
    return this._option.hooks;
  }
}

export function useAppContext() {
  return MobileApp.context;
}
export const createMobileApp = MobileApp.initInstance;

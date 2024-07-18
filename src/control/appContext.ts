// import type { Component } from "vue";
// import { createSSRApp } from "vue";
// import wx from "weixin-js-sdk";
import { createRouter, type Router } from "uni-mini-router";

/**钩子函数，可以定义生命周期 */
interface MobileAppHooks {
  /**创建app前 */
  onBeforeCreate(): void;
  /**创建app后 */
  onCreated(app: App): void;
  //其他的按需添加
}

/**app配置项 */
export interface MobileAppOption {
  /**环境变量 */
  env: {
    /**接口请求地址 */
    httpBaseUrl: string;
    /**文件基础地址 */
    fileBaseUrl: string;
    /**文件上传路径 */
    fileUploadUri: string;
    /**其他的环境变量 */
    [x: string]: string;
  };
  /**需要加载的插件 */
  plugins?: AppPlugin[];
  /**路由列表（uni-mini-router的路由） */
  routes?: Record<string, any>[];

  hooks?: Partial<MobileAppHooks>;
  /**app组件 */
  app: any;
}

// type App = ReturnType<typeof createSSRApp>;
type App = any;

/**插件对象 */
export interface AppPlugin {
  (): {
    /**路由列表（uni-mini-router的路由） */
    routes: Record<string, any>[];
  };
}

export class MobileApp {
  // private _app: App;
  private _option: MobileAppOption;
  private _router: Router;

  constructor(option: MobileAppOption) {
    this._option = option;
    this.emitHooks("onBeforeCreate");
    // this._app = this.createApp();
    this.emitHooks("onCreated", this.app);
    this.initallPlugin();
    this._router = this.createRouter();
  }

  /**调用钩子 */
  private async emitHooks<
    T extends keyof MobileAppHooks = keyof MobileAppHooks
  >(key: T, ...args: Parameters<MobileAppHooks[T]>) {
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
  static initInstance(option: MobileAppOption) {
    MobileApp._context = new MobileApp(option);
    return {
      app: MobileApp.context.app,
    };
  }

  /**加载插件 */
  private initallPlugin() {
    if (!this.option.plugins?.length) return;
    this._option.routes = this._option.routes || [];
    this.option.plugins.forEach((plugin) => {
      const res = plugin();
      this._option.routes!.push(...res.routes);
    });
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
  // private createApp() {
  //   const app = createSSRApp(this._option.appCom);
  //   app.config.globalProperties.$wx = wx;
  //   return app;
  // }

  public get option() {
    return this._option;
  }

  public get app() {
    return this.option.app;
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

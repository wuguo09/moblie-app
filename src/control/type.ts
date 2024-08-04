import type { Component, createSSRApp } from "vue";

export type TApp = ReturnType<typeof createSSRApp>;

/**钩子函数，可以定义生命周期 */
export interface IMobileAppHooks {
  /**创建app前 */
  onBeforeCreate(): void;
  /**创建app后 */
  onCreated(app: TApp): void;
  //其他的按需添加
}

/**环境变量 */
interface IMobileAppEnv {
  /**接口请求地址 */
  httpBaseUrl: string;
  /**文件基础地址 */
  fileBaseUrl: string;
  /**文件上传路径 */
  fileUploadUri: string;
  /**其他的环境变量 */
  [x: string]: string;
}

/**系统配置 */
interface IAppConfig {
  /**系统名称 */
  appName: string;
}

/**登录配置 */
interface ILoginConfig {
  themeImg: string | "none";
  bgImg: string | "none";
  afterLoginPage:{
    
  }
}

/**app配置项 */
export interface IMobileAppOption {
  /**环境变量 */
  env: IMobileAppEnv;
  /**路由列表（uni-mini-router的路由） */
  routes?: Record<string, any>[];
  /**钩子函数，定义生命周期 */
  hooks?: Partial<IMobileAppHooks>;
  /**app组件,vue组件 */
  appCom: Component;
  /**系统配置 */
  appConfig: Partial<IAppConfig>;
  //Todo 其他配置待补充，比如系统名称等系统信息
}

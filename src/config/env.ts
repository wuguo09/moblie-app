/**
 * 配置转换函数, 以便于生产环境的项目拿来直接修改部分参数使用
 * 例如修改服务器接口请求地址: VITE_SERVER_API_URL
 */

/** 所有环境变量, 在下面分别导出(其他文件引用时显示vscode提示) */
const _globalConfig = {
  /** 基础接口地址 */
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  /** 当前环境 */
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV as string,
  /**文件上传地址 */
  VITE_FILE_BASE_URL: import.meta.env.VITE_FILE_BASE_URL as string,
  /**文件上传地址前缀*/
  VITE_APP_UPLOAD_URL_PREFIX: import.meta.env.VITE_APP_UPLOAD_URL_PREFIX as string,
  /** ws链接地址 */
  VITE_APP_WS_URL: import.meta.env.VITE_APP_WS_URL as string,
};
export const envVar = _globalConfig


const {
  VITE_API_BASE_URL,
  VITE_NODE_ENV,
  VITE_APP_UPLOAD_URL_PREFIX,
  VITE_FILE_BASE_URL,
  VITE_APP_WS_URL,
} = envVar;
export {
  VITE_API_BASE_URL,
  VITE_NODE_ENV,
  VITE_APP_UPLOAD_URL_PREFIX,
  VITE_FILE_BASE_URL,
  VITE_APP_WS_URL,
};


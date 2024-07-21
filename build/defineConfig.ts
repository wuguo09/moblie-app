/**插件 */
interface IPligin {
  /**插件包含的页面路径 */
  pages: string[];
  /**
   * 插件包含的文件路径（主要是页面依赖到的文件）
   * todo 后面考虑自动检索依赖
   *  */
  files: string[];
  /**如果要分包，定义分包的包名 */
  subpackName?: string;
}

/**应用配置 */
export interface IAppConfig {
  /**项目根路径 */
  base: string;
  /**插件 */
  plugins?: IPligin[];
}

/**定义应用配置，让配置在这里中转，方便以后在这里做一些事情 */
export function defineConfig(config:IAppConfig){
    return config
}
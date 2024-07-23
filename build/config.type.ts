/**插件信息 */
interface IPlugin {
  /**插件名称，只是个名称 */
  name: string;
  /**插件资源基础路径 */
  srcPath: string;
  /**
   * 需要的页面（pages.json里的配置）
   * todo 需要支持分包里的页面
   */
  pages: [];
  /**
   * 需要的文件
   * todo 页面依赖到的文件，后续考虑自动检索依赖
   */
  files: string[];
  /**
   * 是否不安装页面文件，默认为false
   * 是的话自行通过配置files安装
   * 否的话会通过页面路径安装
   */
  isUninstall?: boolean;
  /**
   * 分包名称
   * 若有，会把这些页面单独分宝
   * !推荐分包，可以减少主包提体积，且对含有插件的项目再发布插件也更友好
   *  */
  subpackName?: string;
  /**
   * 需要替换的路径别名(resolve.alias)，分包时有效，用于处理依赖的路径变更
   * 所有路径别名都要以"@"标识符开头，换而言之，只能定义一个‘@’路径别名
   */
  aliasReplace?:string[]
}

/**配置 */
interface IConfig {
  /**插件 */
  plugins: IPlugin[];
  /**src目录路径 */
  srcPath: string;
}

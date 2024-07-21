//将基础的一些页面打入到项目工程中

import path from "path";
import fs from "fs";

/**工程根目录绝对路径 */
const rootPath = process.cwd();

/**配置 */
const config = {};
/**主应用的page.json配置 */
let pageJson = {}

/**读取配置 */
async function readConfig() {
  return new Promise((resolve) => {
    //找到工程根目录下的app.config.ts文件
    import(rootPath + "/app.config.js").then((res) => {
      //返回配置
      resolve(res.default());
    });
  });
}

/**拷贝文件目录 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function fsReadFile(filePath) {
  // 读取文件内容
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        reject(false);
        return;
      }
      resolve(data);
    });
  });
}

/**插件安装方法 */
async function install(plugin) {
  //先安装页面文件
  await installPages(plugin);
}
/**页面安装方法 */
async function installPages(plugin) {
  //先获取到插件的page.json
  const pageJsonStr = await fsReadFile(path.join(plugin.srcPath, "/pages.json"));
  const pluginPageJson = JSON.parse(pageJsonStr)
  console.log('pageJson',pluginPageJson)
  //取出页面列表
  const pages = pluginPageJson.pages
  //映射页面配置，减少循环
  const pageMap = new Map(pages.map(i => [i.path,i]))
  //遍历需要的页面一个一个安装
  for (const pagePath of plugin.pages) {
    const page = pageMap.get(pagePath)
    if (!path) continue
    //先看有没有这个路由
    const index = pageJson.pages.findIndex(i => i.path === pagePath)
    if (index === -1){
      //还没有，push进去
      
    }
  }
}

/**遍历插件序列安装 */
async function installPlugins() {
  console.log("开始安装插件");
  //先获取到项目的page.json的配置
  pageJson = JSON.parse(await fsReadFile(path.join(config.srcPath, "/pages.json")))
  for (const plugin of config.plugins) {
    console.log("开始安装" + plugin.name);
    await install(plugin);
    console.log(plugin.name + "安装完成");
  }
}

async function run() {
  console.log("start");
  //先读取到配置
  const _config = await readConfig();
  console.log("config", _config);
  Object.assign(config, _config);
  //安装插件
  await installPlugins();
}

await run();

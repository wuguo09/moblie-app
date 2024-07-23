#!/usr/bin/env node
//将基础的一些页面打入到项目工程中

import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
// gulpjs是一个前端构建工具,而且gulpjs使用的是nodejs中stream来读取和操作数据，其速度更快。
import gulp from "gulp";
// gulp-replace这是一款gulp3的字符串替换插件
import replace from "gulp-replace";

/**配置 */
let config = {};
/**主应用的page.json配置 */
let pageJson = {};

const reset = () => {
  config = {};
  pageJson = {};
};

/**读取配置 */
async function readConfig() {
  return new Promise((resolve) => {
    console.log(path.join(path.resolve("/app.config.js")));
    //找到工程根目录下的app.config.ts文件
    import(pathToFileURL(path.join(path.resolve(), "/app.config.js"))).then(
      (res) => {
        //返回配置
        resolve(res.default());
      }
    );
  });
}

/**
 * 检查路径是文件还是目录
 * @param {string} filePath 路径
 * @returns
 */
const checkPath = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (stats.isDirectory()) {
        resolve("dir");
      } else if (stats.isFile()) {
        resolve("file");
      } else {
        reject("");
      }
    });
  });
};

/**读取文件方法 */
function fsReadFile(filePath) {
  // 读取文件内容
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(false);
        return;
      }
      resolve(data);
    });
  });
}

/**使用fs写文件 */
function fsWriteFile(filePath, content) {
  // 写入文件内容
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, "utf-8", (err) => {
      if (err) {
        console.error(err);
        reject(false);
        return;
      }
      resolve(true);
    });
  });
}

/**插件安装方法 */
async function install(plugin) {
  /**
   * 拷贝文件
   * @param {string} srcPath 原文件路径
   * @param {string} destPath 目标目录路径
   */
  async function copyFile(srcPath, destPath) {
    const subpackName = plugin.subpackName;
    console.log("copy", srcPath, destPath, subpackName);
    //构建目标目录
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    //分包且需要替换路径别名的情况下用glup工具写入文件，不然直接复制文件
    if (subpackName && plugin.aliasReplace?.length) {
      //用gulp来写入文件
      await new Promise((resolve) => {
        /**gulp文件流实体 */
        let entry = gulp.src([srcPath]);
        //依次把对应的别名替换
        for (const alias of plugin.aliasReplace) {
          entry = entry.pipe(
            replace("@/" + alias, `@/${subpackName}/` + alias)
          );
        }
        //将文件中的 @ 标识符替换

        //将文件写入目标地址
        entry
          .pipe(gulp.dest(path.dirname(destPath)))
          .on("end", () => resolve(true));
      });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  /**
   * 拷贝文件目录
   * @param {string} src 原目录路径
   * @param {string} dest 目标目录路径
   * @param {string} subpackName 分包名，有的话会替换文件中的'@'标识符
   */
  async function copyDir(src, dest) {
    //判断是不是文件，是文件直接复制
    const type = await checkPath(src);
    if (type === "file") {
      await copyFile(src, dest);
      return;
    }
    //构建目标目录
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
  /**页面安装方法 */
  async function installPages() {
    //先获取到插件的page.json
    const pageJsonStr = await fsReadFile(
      path.join(plugin.srcPath, "/pages.json")
    );
    const pluginPageJson = JSON.parse(pageJsonStr);
    //取出项目现有的页面列表
    let pages = pageJson.pages;
    if (plugin.subpackName) {
      //需要分包的情况
      !pageJson.subPackages && (pageJson.subPackages = []);
      const subPackage = pageJson.subPackages.find(
        (i) => i.root === plugin.subpackName
      );
      if (!subPackage) {
        pageJson.subPackages.push({
          root: plugin.subpackName,
          pages: [],
        });
        pages = pageJson.subPackages[pageJson.subPackages.length - 1]["pages"];
      } else {
        pages = subPackage["pages"];
      }
    }
    //映射页面配置，减少循环
    const pageMap = new Map(pluginPageJson.pages.map((i) => [i.path, i]));
    //遍历需要的页面一个一个安装
    for (const pagePath of plugin.pages) {
      const page = pageMap.get(pagePath);
      if (!page) continue;
      //先看有没有这个路由
      const index = pages.findIndex((i) => i.path === pagePath);
      if (index === -1) {
        //还没有，push进去
        pages.push(page);
      } else {
        //已经有了,替换
        pages.splice(index, 1, page);
      }
      //获取页面文件目录路径
      const pathArr = pagePath.split("/");
      //最后一截是vue文件，去掉
      pathArr.pop();
      const dirPath = pathArr.join("/"); //
      //安装页面文件
      !plugin.isUninstall && (await installFiles([dirPath], plugin.srcPath));
    }
  }

  /**文件安装方法 */
  async function installFiles(filePaths, srcPath) {
    for (const _filePath of filePaths) {
      //目标路径
      const destPath = path.join(
        config.srcPath,
        "/",
        plugin.subpackName || "",
        "/",
        _filePath
      );
      //文件目录完整路径
      const filePath = path.join(srcPath, "/", _filePath);
      // console.log("开始复制", filePath, destPath);
      await copyDir(filePath, destPath);
    }
  }
  //先安装页面文件
  await installPages();
  //安装文件
  if (plugin.files?.length) {
    await installFiles(plugin.files, plugin.srcPath);
  }
}

/**遍历插件序列安装 */
async function installPlugins() {
  console.log(">>>开始安装插件");
  //先获取到项目的page.json的配置
  const pageJsonPath = path.join(config.srcPath, "/pages.json");
  pageJson = JSON.parse(await fsReadFile(pageJsonPath));
  for (const plugin of config.plugins) {
    console.log(">>>开始安装" + plugin.name);
    await install(plugin);
    console.log(">>>" + plugin.name + "安装完成");
  }
  console.log(">>>全部安装完成");
  //更新pages.json文件
  await fsWriteFile(pageJsonPath, JSON.stringify(pageJson));
  reset();
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

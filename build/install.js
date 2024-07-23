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
const config = {};
/**主应用的page.json配置 */
let pageJson = {};

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

async function copyFile(srcPath, destPath, subpackName) {
  console.log('copy',srcPath, destPath, subpackName)
  //构建目标目录
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  //复制文件
  if (!subpackName) {
    fs.copyFileSync(srcPath, destPath);
  } else {
    //用gulp来写入文件
    await new Promise((resolve) => {
      gulp
        .src([srcPath])
        //将文件中的 @ 标识符替换
        .pipe(replace("@/", `@/${subpackName}/`))
        //将文件写入目标地址
        .pipe(gulp.dest(path.dirname(destPath)))
        .on("end", () => resolve(true));
    });
  }
}

/**
 * 拷贝文件目录
 * @param {string} src 原目录路径
 * @param {string} dest 目标目录路径
 * @param {string} subpackName 分包名，有的话会替换文件中的'@'标识符
 */
async function copyDir(src, dest, subpackName) {
  //判断是不是文件，是文件直接复制
  const type = await checkPath(src);
  if (type === "file") {
    await copyFile(src, dest, subpackName);
    return;
  }
  //构建目标目录
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, subpackName);
    } else {
      await copyFile(srcPath, destPath, subpackName);
    }
  }
}

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
  //先安装页面文件
  await installPages(plugin);
  //安装文件
  if (plugin.files?.length) {
    await installFiles(plugin.files, plugin.srcPath, plugin.subpackName);
  }
}
/**页面安装方法 */
async function installPages(plugin) {
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
    !plugin.isUninstall &&
      (await installFiles([dirPath], plugin.srcPath, plugin.subpackName));
  }
}

/**文件安装方法 */
async function installFiles(filePaths, srcPath, subpackName) {
  for (const _filePath of filePaths) {
    //目标路径
    const destPath = path.join(
      config.srcPath,
      "/",
      subpackName || "",
      "/",
      _filePath
    );
    //文件目录完整路径
    const filePath = path.join(srcPath, "/", _filePath);
    // console.log("开始复制", filePath, destPath);
    await copyDir(filePath, destPath, subpackName);
  }
}

/**遍历插件序列安装 */
async function installPlugins() {
  console.log("开始安装插件");
  //先获取到项目的page.json的配置
  const pageJsonPath = path.join(config.srcPath, "/pages.json");
  pageJson = JSON.parse(await fsReadFile(pageJsonPath));
  for (const plugin of config.plugins) {
    console.log("开始安装" + plugin.name);
    await install(plugin);
    console.log(plugin.name + "安装完成");
  }
  //更新pages.json文件
  await fsWriteFile(pageJsonPath, JSON.stringify(pageJson));
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

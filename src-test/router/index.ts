//参考文档：https://www.npmjs.com/package/uni-mini-router
// 导入pages.json
import pagesJson from '../pages.json'
// 引入uni-parse-pages
import pagesJsonToRoutes from 'uni-parse-pages'
// 生成路由表
export const routes = pagesJsonToRoutes(pagesJson)

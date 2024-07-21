import { useAppContext } from "./appContext";
import {message} from "./message";
function errorHandle(res: UniApp.RequestSuccessCallbackResult) {
  console.log("请求失败", res);
  if ([600, 602, 610, 620, 401].includes(res.data.code)) {
    //未登录
    //userStore.doLogout();
  }
}

//http.js
export const http = {
  post: (
    path: string,
    params?: Object,
    contentType = "form",
    otherUrl?: string
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      var url = (otherUrl || useAppContext().httpBaseUrl) + path;
      if (!checkUrl(url)) {
        reject("请求失败");
      }
      uni.request({
        method: "POST",
        url,
        header: {
          "Content-Type":
            contentType === "json"
              ? "application/json"
              : "application/x-www-form-urlencoded",
          Authorization: uni.getStorageSync("token"),
        },
        data: params,
        success: (res) => {
          if (res.data.code == 200) {
            console.log(
              "request:POST请求" + useAppContext().httpBaseUrl + path + " 成功",
              res.data
            );
            resolve(res.data);
          } else {
            message.toast(res.data.msg || "请求失败", "err");
            console.error(
              "request:请求" + useAppContext().httpBaseUrl + path + " 失败",
              res.data.msg
            );
            errorHandle(res);
            reject(res.data.msg);
          }
        },
        fail: (err) => {
          message.toast("请求失败", "err");

          console.error(
            "request:请求" + useAppContext().httpBaseUrl + path + " 失败",
            err
          );
          errorHandle(err);
          reject("请求失败");
        },
      });
    });
  },
  put: (
    path: string,
    params?: Object,
    contentType = "json",
    otherUrl?: string
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      var url = (otherUrl || useAppContext().httpBaseUrl) + path;
      if (!checkUrl(url)) {
        reject("请求失败");
      }
      uni.request({
        method: "PUT",
        url,
        header: {
          "Content-Type":
            contentType === "json"
              ? "application/json"
              : "application/x-www-form-urlencoded",
          Authorization: uni.getStorageSync("token"),
        },
        data: params,
        success: (res) => {
          if (res.data.code == 200) {
            console.log(
              "request:PUT请求" + useAppContext().httpBaseUrl + path + " 成功",
              res.data
            );
            resolve(res.data);
          } else {
            errorHandle(res);
            message.toast(res.data.msg || "请求失败", "err");
            console.error(
              "request:请求" + useAppContext().httpBaseUrl + path + " 失败",
              res.data.msg
            );
            reject(res.data.msg);
          }
        },
        fail: (err) => {
          message.toast("请求失败", "err");
          console.error(
            "request:PUT请求" + useAppContext().httpBaseUrl + path + " 失败",
            err
          );
          uni.showToast({
            title: err,
            icon: "error",
          });
          reject("请求失败");
        },
      });
    });
  },

  get: (path: string, params?: Object, otherUrl?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      var url = (otherUrl || useAppContext().httpBaseUrl) + path;
      if (!checkUrl(url)) {
        return;
      }
      uni.request({
        url,
        header: {
          Authorization: uni.getStorageSync("token"),
        },
        data: params,
        success: (res) => {
          if (res.data.code == 200) {
            console.log(
              "request:GET请求" + useAppContext().httpBaseUrl + path + " 成功",
              res.data
            );
            resolve(res.data);
          } else {
            message.toast(res.data.msg || "请求失败", "err");
            console.error(
              "request:请求" + useAppContext().httpBaseUrl + path + " 失败",
              res.data.msg
            );
            errorHandle(res);
            reject(res.data.msg);
          }
        },
        fail: (err) => {
          message.toast("请求失败", "err");
          console.error(
            "request:GET请求" + useAppContext().httpBaseUrl + path + " 失败",
            err
          );
          errorHandle(err);
          reject("请求失败");
        },
      });
    });
  },
  delete: (path: string, params?: Object, otherUrl?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      var url = (otherUrl || useAppContext().httpBaseUrl) + path;
      if (!checkUrl(url)) {
        return;
      }
      uni.request({
        url,
        header: {
          Authorization: uni.getStorageSync("token"),
        },
        data: params,
        method: "DELETE",
        success: (res) => {
          if (res.data.code == 200) {
            console.log(
              "request:DELETE请求" +
                useAppContext().httpBaseUrl +
                path +
                " 成功",
              res.data
            );
            resolve(res.data);
          } else {
            message.toast(res.data.msg || "请求失败", "err");
            console.error(
              "request:请求" + useAppContext().httpBaseUrl + path + " 失败",
              res.data.msg
            );
            reject(res.data.msg);
          }
        },
        fail: (err) => {
          message.toast("请求失败", "err");
          console.error(
            "request:DELETE请求" + useAppContext().httpBaseUrl + path + " 失败",
            err
          );
          reject("请求失败");
        },
      });
    });
  },

  // async upload(path:string, params:Object, otherUrl:string) {

  // 	if (typeof fileArray !== 'object') {
  // 		console.error('request:参数错误,请传入文件数组')
  // 		return
  // 	}
  // 	var url = (otherUrl || useAppContext().httpBaseUrl) + path
  // 	if (!checkUrl(url)) {
  // 		return
  // 	}
  // 	var arr = []
  // 	for (let i in fileArray) {
  // 		const res = await uni.uploadFile({
  // 			url: otherUrl || useAppContext().httpBaseUrl + path,
  // 			filePath: fileArray[i],
  // 			name: 'file'
  // 		})
  // 		console.log(res)
  // 		if (res[0]) {
  // 			console.error('request:上传失败', res[0])
  // 			return
  // 		}
  // 		arr.push(JSON.parse(res[1].data).data)
  // 	}
  // 	return arr
  // },
};

// export default http

function checkUrl(url: string) {
  var urlReg =
    /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
  if (!urlReg.test(url)) {
    console.error("request:请求路径错误" + url);
    return false;
  }
  return true;
}

export interface Response<T> {
  /** 响应编码 */
  code: number;
  /** 当前页 */
  currentPage?: number;
  data: T;
  dictMapping?: { [key: string]: any };
  errors?: Error[];
  header?: { [key: string]: any };
  /** 响应消息 */
  msg?: string;
  pageList?: number[];
  /** 分页大小 */
  pageSize?: number;
  time?: number;
  total?: number;
  totalPage?: number;
}
export interface ListParams {
  /** 当前页面 */
  currentPage?: number;
  /** 排序字段 */
  fixed?: string;
  /** 分页大小 */
  pageSize?: number;
  /** 查询关键字 */
  searchKey?: string;
  /** 排序方式 */
  sort?: string;
  /** 其他参数 */
  [key: string]: any;
}

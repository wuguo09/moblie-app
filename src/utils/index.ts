import dayjs from "dayjs";
import { onUnmounted } from "vue";
import { onBackPress } from "@dcloudio/uni-app";
import { useAppContext } from "mobile-app-test";

export default class Utils {
  public static designSize = {
    width: 375,
    height: 812,
  };
  /** rpx 转换为 px */
  public static rpxTopx(rpx: number) {
    let deviceWidth = uni.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
    let px = (deviceWidth / 750) * Number(rpx);

    return Math.floor(px);
  }
  /** */
  public static getResizePx(px: number) {
    return (
      parseInt(
        (document.body.clientHeight / this.designSize.height) * px + ""
      ) + "px"
    );
  }
  /** 拼接文件路径 */
  public static getFileUrl = (url?: string) => {
    return url ? `${useAppContext().fileBaseUrl}${url}` : null;
  };
  /** 获取 assets 下面的图片 */
  public static getImageUrl = (url: string): string => {
    // #ifdef H5
    return new URL(`../static/imgs/${url}`, import.meta.url).href;
    // #endif

    // #ifdef MP-WEIXIN
    return "/static/imgs/" + url;
    // #endif
  };
  /** 从富文本中提取文字描述 */
  public static getTextByRich = (richText: string) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = richText;
    const text = tempElement.textContent || tempElement.innerText || "";
    return text;
  };
  /** 提取部分时间 当天显示时间，之前显示日期 */
  public static getTimePart = (time: string) => {
    if (!time) return "";

    try {
      const currentDay = dayjs().format("YYYY-MM-DD");
      if (time.includes(currentDay)) {
        return dayjs(time).format("HH:mm:ss");
      } else {
        return dayjs(time).format("YYYY-MM-DD");
      }
    } catch (err) {
      console.error(err);
      return "";
    }
  };
  public static renderOptions = (
    arr: any[],
    params: {
      labelKey: string;
      valueKey: string;
      childrenKey: string;
    }
  ) => {
    const result = [];
    arr.forEach((item) => {
      const p = {
        label: item[params.labelKey],
        value: item[params.valueKey],
      };
      if (item[params.childrenKey] && item[params.childrenKey].length > 0) {
        p.children = Utils.renderOptions(item[params.childrenKey], params);
      }
      result.push(p);
    });
    return result;
  };
  // 获取今天的时间范围
  public static getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }
  // 获取最近一周的时间范围
  public static getLastWeekRange() {
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }
  // 获取最近一个月的时间范围
  // 获取最近一个月的时间范围
  public static getLastMonthRange() {
    const start = new Date();
    const end = new Date();
    start.setMonth(start.getMonth() - 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }

  // 获取最近一年的时间范围
  public static getLastYearRange() {
    const start = new Date();
    const end = new Date();
    start.setFullYear(start.getFullYear() - 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }
  public static routeBack() {
    uni.navigateBack();
  }

  /**处理url传参 */
  public static getUrlQuery(baseUrl: string, query: Record<string, any>) {
    const arr: string[] = [];
    for (const key in query) {
      if (!query[key] && query[key] !== 0) continue;
      arr.push([key, encodeURIComponent(query[key])].join("="));
    }
    return baseUrl + (baseUrl.includes("?") ? "&" : "?") + arr.join("&");
  }
}

export function generateRandomString() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < 13; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}
//监听返回事件
export function useEventListener(fn: Function) {
  onBackPress(() => {
    fn();
  });
  window.addEventListener("popstate", fn);
  onUnmounted(() => {
    window.removeEventListener("popstate", fn);
  });
}

/**根据DictMapping翻译出展示的值 */
export function getLabelByDictMapping(
  data: { [x: string]: any; _dictMapping: any },
  key: string
) {
  const value = data[key];
  if (value && data._dictMapping) {
    if (data._dictMapping[key]) {
      return data._dictMapping[key][value];
    }
  }
  return value;
}

export function enumToMap<T extends Record<string, any>>(
  enumObject: T
): Map<keyof T, T[keyof T]> {
  const enumMap = new Map<keyof T, T[keyof T]>();
  for (const key in enumObject) {
    if (enumObject.hasOwnProperty(key)) {
      enumMap.set(key, enumObject[key]);
    }
  }
  return enumMap;
}

export async function getLocation() {
  try {
    const location = await uni.getLocation({
      isHighAccuracy: true,
      highAccuracyExpireTime: 10000,
      type: "gcj02",
    });
    return {
      lon: location.longitude,
      lat: location.latitude,
    };
  } catch (error) {
    console.log(error);
  }
}

export const formatQuery = (query: Record<string, any>) => {
  const _query: Record<string, any> = {};
  for (const key in query) {
    if (!query[key] && query[key] !== 0) continue;
    Reflect.set(_query, key, query[key]);
  }
  return _query;
};

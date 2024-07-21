import type { LoginRes, UserInfo } from "@/api/user.api";
import { reactive, ref } from "vue";
import userApi from "@/api/user.api";

interface State {
  /** 令牌 */
  token: string | null;
  /** 用户证书:用于下一次登录 */
  userCertificate: string | null;
  /** 过期周期 */
  expires: number | null;
  /** 过期时间 */
  expiresTime: number | null;
  /** 用户信息 */
  userInfo: UserInfo | null;
}

const state: State = reactive({
  token: null,
  userCertificate: null,
  expires: null,
  expiresTime: null,
  userInfo: null,
  personInfo: null,
});

function clearState() {
  for (const key in state) {
    state[key as keyof State] = null;
  }
}

export function useUserStore() {
  function setToken(token: string) {
    state.token = token;
  }
  function getToken() {
    if (state.token) {
      return state.token;
    } else if (uni.getStorageSync("token")) {
      state.token = uni.getStorageSync("token");
      return state.token;
    } else {
      return undefined;
    }
  }
  function isExpired() {
    let currentTime = new Date().getTime();
    if (!state.expiresTime) {
      if (!uni.getStorageSync("expiresTime")) {
        return false;
      } else {
        state.expiresTime = Number(uni.getStorageSync("expiresTime"));
      }
    }
    if (currentTime >= (state.expiresTime as number)) {
      return true;
    }
    return false;
  }
  async function afterLogin(data: LoginRes) {
    setToken(data.token as string);
    uni.setStorageSync("token", data.token);
    state.expires = data.expires as number;
    // 计算过期的时间
    state.expiresTime = (data.expires as number) * 1000 + new Date().getTime();
    uni.setStorageSync("expiresTime", state.expiresTime);
    // 判断是否保存登录状态,有效期7天
    if (data.refreshToken) {
      uni.setStorageSync("RefreshToken", data.refreshToken.token);
    }
    // 获取用户信息
    await fetchUserInfo();
    // 登录后拿到用户信息，进入首页
    uni.navigateTo({ url: "/pages/home/home" });
  }
  async function fetchUserInfo(){
    const res = await userApi.getUserInfo();
    if (res.code == 200) {
      setUserInfo(res.data)
    }
  }
  async function setUserInfo(data:UserInfo) {
    state.userInfo = data;
  }
  async function getUserInfo() {
    if (state.userInfo) {
      return state.userInfo;
    } else if (getToken()) {
      await fetchUserInfo();
      return state.userInfo;
    } else {
      return undefined;
    }
  }
  async function doLogout() {
    // 清空用户相关数据数据
    clearState();
    // 清除cookie
    clearCookie();
    console.log("lv6");
    // 回到登录页
    uni.reLaunch({ url: "/pages/login/login" });
  }
  function clearCookie() {
    uni.removeStorageSync("token");
    uni.removeStorageSync("expiresTime");
    uni.removeStorageSync("RefreshToken");
  }
  return {
    $state: state,
    ...state,
    setToken,
    getToken,
    isExpired,
    afterLogin,
    getUserInfo,
    setUserInfo,
    doLogout,
    clearCookie,
    fetchUserInfo
  };
}

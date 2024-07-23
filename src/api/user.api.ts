import { http as Api } from "mobile-app-test"
import type { Response } from "mobile-app-test";

/** 登录参数 */
interface LoginParams {
  account: string;
  password: string;
  /** 记住登录状态 0 | 1 */
  rememberMe?: number;
  /** 验证码（密码错误两次需携带） */
  verificationCode?: string;
}
/** 登录返回值 */
interface LoginRes {
  /** 过期周期(秒数) */
  expires?: number;
  /** 过期时间戳 */
  expiresTime?: number;
  /** 扩展参数 */
  extended?: { [key: string]: string };
  /** 登录账号 */
  loginAccount?: string;
  /** 令牌 */
  token?: string;
  /** 用户证书:用于下一次登录 */
  userCertificate?: string;
  /** 记住状态的token */
  refreshToken?: {
    token: string;
    expires: string;
    expireTime: string;
  };
}
/** 账号密码登录 */
const login = (
  params: LoginParams,
  loginType?: string
): Promise<Response<LoginRes>> => {
  return Api.post(
    `/AuthApp/user/login/${loginType || "account"}`,
    params,
    "json"
  );
};
/** 用户信息 */
interface UserInfo {
  account?: string;
  accountProperties?: { [key: string]: { [key: string]: any } };
  accountSource?: string;
  admin?: boolean;
  deptCode?: string;
  expiresTime?: number;
  fullDeptCode?: string;
  grantCode?: string;
  headImgAddress?: string;
  ip?: string;
  loginTime?: number;
  loginType?: string;
  nickName?: string;
  roleCodes?: string[];
  sex?: number;
  userId?: number;
  username?: string;
}
/** 获取用户信息 */
const getUserInfo = (): Promise<Response<UserInfo>> => {
  return Api.post("/AuthApp/user/currentUserInfo");
};
/** 退出登录 */
const logout = () => {
  return Api.post("/AuthApp/user/loginOut");
};
interface PageQueryParam {
  currentPage?: number;
  pageSize?: number;
  fixed?: string;
  searchKey?: string;
  sort?: string;
}
interface PageUserQueryParam extends PageQueryParam {
  roleCode?: string;
}
/** 列表查询用户信息 */
interface AuthTBUserPageVo {
  /** 账号 */
  account?: string;
  /** 账号类型 */
  accountType?: string;
  authTbRoleList?: AuthTBRole[];
  createTime?: Date;
  createUserAccount?: string;
  /** 是否删除1是 */
  deleted?: number;
  /** 邮箱 */
  email?: string;
  fkDeptCode?: string;
  fkPostId?: number;
  /** 头像 */
  headImgAddress?: string;
  id?: number;
  /** 身份证号 */
  idCard?: string;
  /** 锁定 */
  isLock?: number;
  /** 登录密码 */
  loginPassword?: string;
  nickName?: string;
  /** 操作密码 */
  operatePassword?: string;
  /** 电话 */
  phone?: string;
  /** 盐 */
  salt?: string;
  /** 性别 */
  sex?: number;
  updateTime?: Date;
  updateUserAccount?: string;
  /** 姓名 */
  username?: string;
}
/** 角色权限 */
interface AuthTBRole {
  /**允许删除 */
  allowDel?: number;
  createTime?: Date;
  createUserAccount?: string;
  /**启用 */
  enabled?: number;
  id?: number;
  /**是否默认 */
  isDefault?: number;
  /**优先级 */
  priorityLevel?: number;
  /**角色编码 */
  roleCode?: string;
  /**角色名称 */
  roleName?: string;
  updateTime?: Date;
  updateUserAccount?: string;
}
/** 查询用户列表 */
const getUserList = (
  params: PageUserQueryParam
): Promise<Response<AuthTBUserPageVo[]>> => {
  return Api.get("/AuthApp/authTbUser/selectPageList", params);
};
/** 带有refreshToken的响应 */
interface LoginAccountResponse {
  token: string;
  expiresTime: number;
  expires: number;
  extended: any;
  refreshToken: any;
}
/**
 * 换取新的token
 * @params account (传refreshToken)
 */
const loginRefreshToken = (data: {
  account?: string;
}): Promise<Response<LoginAccountResponse>> => {
  return Api.post("/AuthApp/user/login/refreshToken", data, "json");
};
/**
 * 请求登录是否需要验证码
 * @params account（账户名）
 */
const isRequireVerificationCode = (params: { account: string }) => {
  return Api.post(
    "/AuthApp/user/isRequireVerificationCode/account",
    params,
    "json"
  );
};
/**
 * 获取验证码图片
 * @params account（账户名）
 */
const selectVerificationCode = (params: { account: string }) => {
  return Api.post(
    "/AuthApp/user/selectVerificationCode/account",
    params,
    "json"
  );
};
/** 修改头像 */
const updateAvatar = (avatarUrl: string) => {
  return Api.get("/AuthApp/user/modifyAvatar", { avatarUrl });
};
/** 修改密码 */
const modifyPwd = (params: { newPassword: string; oldPassword: string }) => {
  return Api.post("/AuthApp/user/modifyPassword", params, "json");
};

export default {
  login,
  getUserInfo,
  logout,
  getUserList,
  loginRefreshToken,
  isRequireVerificationCode,
  selectVerificationCode,
  updateAvatar,
  modifyPwd,
};
export type {
  LoginParams,
  LoginRes,
  UserInfo,
  PageQueryParam,
  PageUserQueryParam,
  AuthTBUserPageVo,
  LoginAccountResponse,
};

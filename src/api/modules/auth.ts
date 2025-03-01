/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 01:53:42
 * @LastEditTime: 2025-03-01 03:20:16
 * @Description: auth
 */
import { request } from "../request"
/**
 * 登录
 */
const login = (params: any) => {
  return request.post("/sys/auth/wxLogin", params)
}
/**
 * 获取信息
 */
const getUserInfo = () => {
  return request.get("/sys/auth/info")
}

export { login, getUserInfo }

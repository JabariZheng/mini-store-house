/*
 * @Author: ZhengJie
 * @Date: 2025-03-03 14:04:10
 * @LastEditTime: 2025-03-03 14:05:46
 * @Description: index
 */
import { CACHE_KEY_MAP } from "./cache-data"

export const checkIsLogin = (): boolean => {
  const getToken = uni.getStorageSync(CACHE_KEY_MAP.TOKEN)
  return !!getToken
}

/*
 * @Author: ZhengJie
 * @Date: 2025-03-03 14:04:10
 * @LastEditTime: 2025-03-08 00:49:54
 * @Description: index
 */
import { useUserStore } from "@/store/user"
import { CACHE_KEY_MAP } from "./cache-data"

export const checkIsLogin = (): boolean => {
  const userStore = useUserStore()
  const getToken = userStore.getToken || uni.getStorageSync(CACHE_KEY_MAP.TOKEN)
  return !!getToken
}

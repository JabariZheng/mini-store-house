/*
 * @Author: ZhengJie
 * @Date: 2025-03-08 00:33:08
 * @LastEditTime: 2025-03-08 01:21:11
 * @Description:
 */
import { getUserInfo } from "@/api/modules/auth"
import { CACHE_KEY_MAP } from "@/utils/cache-data"
import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userInfo: {},
  }),
  getters: {
    getToken: (state) => state.token || "",
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    async userLogin() {
      if (Object.keys(this.userInfo).length > 0 || !this.token) return
      const { data }: any = await getUserInfo()
      this.userInfo = data.info
      uni.setStorageSync(CACHE_KEY_MAP.USER_INFO, data)
    },
    userLogout() {
      this.clearAuth()
    },
    setToken(token: string) {
      this.token = token
      uni.setStorageSync(CACHE_KEY_MAP.TOKEN, token)
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
      uni.setStorageSync(CACHE_KEY_MAP.USER_INFO, userInfo)
    },
    clearAuth() {
      this.token = ""
      this.userInfo = {}
      uni.removeStorageSync(CACHE_KEY_MAP.USER_INFO)
      uni.removeStorageSync(CACHE_KEY_MAP.TOKEN)
    },
  },
})

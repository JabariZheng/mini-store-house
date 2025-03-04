/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 01:49:54
 * @LastEditTime: 2025-03-05 03:21:15
 * @Description: 接口请求封装
 */
import { CACHE_KEY_MAP } from "@/utils/cache-data"

const BASE_API_HOST = import.meta.env.VITE_API_HOST
const BASE_API_URL = import.meta.env.VITE_API_PREFIX_URL
const SUCCESS_CODE = 200

export default (options: any, loading: boolean = true) => {
  if (loading) {
    uni.showLoading({
      title: "加载中",
      mask: true,
    })
  }
  return new Promise((resolve: any, reject: any) => {
    const { url, method, data } = options
    delete options.url
    delete options.method
    delete options.data
    const token = uni.getStorageSync(CACHE_KEY_MAP.TOKEN) || ""
    const header: any = { "content-type": "application/json" }
    if (token) {
      header["Authorization"] = token
    }
    uni.request({
      url: `${getPrefixUrl(url)}`,
      method,
      data,
      header,
      ...options,
      success: (res: any) => {
        if (res.statusCode === 401) {
          uni.showToast({
            icon: "none",
            title: "登录已失效，请重新登录",
          })
          uni.removeStorageSync(CACHE_KEY_MAP.USER_INFO)
          uni.removeStorageSync(CACHE_KEY_MAP.TOKEN)
          reject()
          return
        }

        const data = res.data
        if (url.includes("aiseliying-image.oss")) {
          resolve(data)
          return
        }
        
        const { code, message, msg } = data
        if (SUCCESS_CODE !== code) {
          uni.showToast({
            icon: "none",
            title: message || msg || "出错了",
          })
          reject(data)
        }
        resolve(data)
      },
      fail: (err: any) => {
        uni.showToast({
          icon: "none",
          title: "请求失败",
        })
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  })
}

const getPrefixUrl = (suffixUrl: string) => {
  if (suffixUrl.includes("aiseliying-image.oss")) {
    return suffixUrl
  }
  let url = ""
  // #ifdef H5
  url = `${BASE_API_URL}${suffixUrl}`
  // #endif

  // #ifdef MP-WEIXIN
  url = `${BASE_API_HOST}${BASE_API_URL}${suffixUrl}`
  // #endif

  return url
}

/*
 * @Author: ZhengJie
 * @Date: 2025-03-08 21:15:56
 * @LastEditTime: 2025-03-08 21:16:12
 * @Description: loading
 */
// 加载信息，带遮罩
let needLoadingRequestCount = 0
let loadingTimer: any
export function showLoading(title = "", mask = true) {
  if (needLoadingRequestCount === 0) {
    uni.showLoading({
      title,
      mask,
    })

    // 最长10s自动关闭
    loadingTimer = setTimeout(() => {
      if (needLoadingRequestCount > 0) {
        uni.hideLoading()
      }
    }, 10000)
  }

  needLoadingRequestCount++
}

// 隐藏遮罩
export function hideLoading() {
  if (needLoadingRequestCount <= 0) return

  needLoadingRequestCount--

  if (needLoadingRequestCount === 0) {
    loadingTimer && clearTimeout(loadingTimer)
    uni.hideLoading()
  }
}

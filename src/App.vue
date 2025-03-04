<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-03-05 03:21:29
 * @Description: 
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { getUserInfo } from "./api/modules/auth"
import { CACHE_KEY_MAP } from "./utils/cache-data"

onLaunch(async () => {
  console.log("App Launch")
  await autoLogin()
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})

const autoLogin = async () => {
  const token = uni.getStorageSync(CACHE_KEY_MAP.TOKEN)

  if (token) {
    const { data } = await getUserInfo()
    uni.setStorageSync(CACHE_KEY_MAP.USER_INFO, data)
  }
  // uni.login({
  //   success: async (res) => {
  //     console.log("res", res.code)
  //     try {
  //       const resData = await login({ jsCode: res.code })
  //       console.log("resData", resData)
  //     } catch (error) {
  //       console.log("error", error)
  //     }
  //   },
  // })
}
</script>
<style lang="scss">
// @import url("./uni.scss");
@import url("./globalStyle.scss");
</style>

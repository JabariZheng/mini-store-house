<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-03-08 00:43:43
 * @Description: 
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { useUserStore } from "./store/user"
import { CACHE_KEY_MAP } from "./utils/cache-data"

const userStore = useUserStore()

onLaunch(async () => {
  console.log("App Launch")

  const getStorageToken = uni.getStorageSync(CACHE_KEY_MAP.TOKEN)
  if (getStorageToken) {
    userStore.setToken(getStorageToken)
  }
  await userStore.userLogin()
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})
</script>
<style lang="scss">
// @import url("./uni.scss");
@import url("./globalStyle.scss");
</style>

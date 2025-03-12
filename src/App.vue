<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-03-12 18:02:39
 * @Description: 
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { useUserStore } from "./store/user"
import { CACHE_KEY_MAP } from "./utils/cache-data"

const userStore = useUserStore()

onLaunch(async () => {
  console.log("App Launch")

  const getApiHostStorage = uni.getStorageSync(CACHE_KEY_MAP.FETCH_HOST)
  if (!getApiHostStorage) {
    uni.setStorageSync(CACHE_KEY_MAP.FETCH_HOST, {
      api_host: "http://192.168.31.220:7001",
      api_prefix_url: "",
    })
  }
  console.log("FETCH_HOST", uni.getStorageSync(CACHE_KEY_MAP.FETCH_HOST))

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

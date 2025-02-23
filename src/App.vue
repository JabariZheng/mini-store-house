<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-02-23 02:01:52
 * @Description: 
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
onLaunch(() => {
  console.log("App Launch")
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

<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 02:03:27
 * @LastEditTime: 2025-02-23 03:18:48
 * @Description: 我的
-->
<template>
  <div class="my-page">
    <PageHeader />
    <UserMenu />
    <!-- <div class="logout-btn">
      <button>退出登录</button>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import {} from "vue"
import PageHeader from "./components/header.vue"
import UserMenu from "./components/userMenu.vue"
</script>

<style lang="scss">
page {
  background-color: #fef9ec !important;
}
.my-page {
  // height: 100vh;
  overflow: hidden;
  display: flex;
  flex-flow: column;

  .logout-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    button {
      flex: 1;
      background-color: #6488e4;
      border-radius: 50px;
      color: #fff;
    }
  }
}
</style>

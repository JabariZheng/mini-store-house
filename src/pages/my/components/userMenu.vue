<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 03:11:08
 * @LastEditTime: 2025-02-24 02:23:11
 * @Description: 用户菜单
-->
<template>
  <div class="user-menu-list">
    <div
      v-for="item in menuList"
      :key="item.title"
      class="user-menu-item"
      @click="onMenuClick(item)"
    >
      <img
        class="user-menu-item-img"
        :src="item.icon"
        alt=""
        :style="{ backgroundColor: item.bgColor }"
      />
      <text class="user-menu-item-title">{{ item.title }}</text>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Icon_Cangku from "@/static/cangku.png"
import Icon_Zuhu from "@/static/zuhu.png"
import Icon_Logout from "@/static/logout.png"

const menuList = ref([
  {
    title: "仓库管理",
    icon: Icon_Cangku,
    bgColor: "#F9BE7C",
    link: "/pages/store/index",
  },
  {
    title: "分组管理",
    icon: Icon_Zuhu,
    bgColor: "#309397",
  },
  {
    title: "登出",
    icon: Icon_Logout,
    bgColor: "#E46472",
  },
])

const onMenuClick = (menuItem) => {
  if (menuItem.link) {
    uni.navigateTo({
      url: menuItem.link,
    })
  }
}
</script>

<style lang="less" scoped>
.user-menu-list {
  display: flex;
  flex-flow: column;
  .user-menu-item {
    display: flex;
    align-items: center;
    padding: 20px;
    .user-menu-item-img {
      padding: 10px;
      width: 20px;
      height: 20px;
      margin-right: 20px;
      // background-color: gray;
      border-radius: 100%;
    }
    .user-menu-item-title {
      font-size: 16px;
    }
  }
}
</style>

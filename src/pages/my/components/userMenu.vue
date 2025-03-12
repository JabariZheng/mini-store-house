<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 03:11:08
 * @LastEditTime: 2025-03-12 18:22:19
 * @Description: 用户菜单
-->
<template>
  <div class="user-menu-list">
    <div
      v-for="item in menus"
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
  <uni-popup ref="SettinPgopupRef" background-color="#fff" @change="change">
    <div class="setting-popup-container">
      <div
        v-for="(item, index) in FETCH_HOST"
        :key="index"
        class="host-item"
        :class="{ active: currentFetchHost === item.id }"
        @click="onItemClick(item)"
      >
        <text>{{ item.name }}</text>
      </div>
    </div>
  </uni-popup>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import Icon_Cangku from "@/static/cangku.png"
import Icon_Shangpin from "@/static/shangpin.png"
// import Icon_Zuhu from "@/static/zuhu.png"
import Icon_Logout from "@/static/logout.png"
import Icon_Setting from "@/static/setting.png"
import { logout } from "@/api/modules/auth"
import { CACHE_KEY_MAP } from "@/utils/cache-data"
import { FETCH_HOST } from "@/utils/fetchHost"
import { useUserStore } from "@/store/user"

const emits = defineEmits(["logout"])
const userStore = useUserStore()

const SettinPgopupRef = ref<any>({})

const menuList = ref([
  {
    title: "仓库管理",
    command: "store",
    icon: Icon_Cangku,
    bgColor: "#F9BE7C",
    link: "/pages/store/index",
  },
  {
    title: "商品管理",
    command: "goodsManage",
    icon: Icon_Shangpin,
    bgColor: "#309397",
    link: "/pages/goodsManage/index",
  },
  // {
  //   title: "分组管理",
  //   icon: Icon_Zuhu,
  //   bgColor: "#309397",
  //   link: "/pages/groups/index",
  // },
  {
    title: "登出",
    command: "logout",
    icon: Icon_Logout,
    bgColor: "#E46472",
  },
  {
    title: "设置",
    command: "setting",
    icon: Icon_Setting,
    bgColor: "#309397",
  },
])

const currentFetchHost = ref("")

const hasUserInfo = computed(() => {
  return Object.keys(userStore.getUserInfo).length > 0
})

const menus = computed(() => {
  console.log('Object.keys(userStore.getUserInfo).length', Object.keys(userStore.getUserInfo).length);
  if (Object.keys(userStore.getUserInfo).length > 0) {
    return menuList.value
  }
  return menuList.value.filter((item) => item.command === "setting")
})
// const currentFetchHost = computed(() => {
//   return uni.getStorageSync(CACHE_KEY_MAP.FETCH_HOST).id
// })
const onMenuClick = async (menuItem) => {
  switch (menuItem.command) {
    case "store":
    case "goodsManage":
      uni.navigateTo({
        url: menuItem.link,
      })
      break
    case "logout":
      await logout()
      uni.removeStorageSync(CACHE_KEY_MAP.TOKEN)
      uni.removeStorageSync(CACHE_KEY_MAP.USER_INFO)
      emits("logout")
      break

    case "setting":
      currentFetchHost.value = uni.getStorageSync(CACHE_KEY_MAP.FETCH_HOST).id
      SettinPgopupRef.value.open()
      break

    default:
      break
  }
}

const onItemClick = (data: any) => {
  currentFetchHost.value = data.id
  uni.setStorageSync(CACHE_KEY_MAP.FETCH_HOST, data)
  uni.showToast({
    title: "切换成功，需要登出重新登入（或重新进入）",
    icon: "none",
  })
}
</script>

<style lang="less">
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

.setting-popup-container {
  display: flex;
  flex-flow: column;
  background-color: #fef9ec;
  border-radius: 5px;
  padding: 20px;
  .host-item {
    background-color: #d8d8d8;
    padding: 5px 10px;
    border-radius: 10px;
    color: #696969;
    text-align: center;
    transition: all 0.3s ease;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &.active {
      color: #fff;
      background-color: #6488e4 !important;
    }
  }
}
</style>

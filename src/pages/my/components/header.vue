<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 03:07:55
 * @LastEditTime: 2025-03-08 01:20:27
 * @Description: 用户信息-头部
-->
<template>
  <div class="page-head">
    <div class="user-info">
      <img
        class="user-info-avatar"
        :src="(info && info.avatar) || UserDefaultAvatar"
        alt=""
      />
      <div class="user-info-txt">
        <!-- <button
          v-if="!info"
          class="login-btn"
          open-type="getPhoneNumber"
          @getphonenumber="onGetPhoneNumber"
        >
          登录
        </button> -->
        <button v-if="showLoginBtn" class="login-btn" @click="onLogin">
          登录
        </button>
        <template v-else>
          <div class="user-info-name">{{ info.userName }}</div>
          <!-- <div class="user-info-tag">组：{{ "基础用户" }}</div> -->
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import UserDefaultAvatar from "@/static/default-user.png"
import { getUserInfo, login } from "@/api/modules/auth"
import { onShow } from "@dcloudio/uni-app"
import { useUserStore } from "@/store/user"

const emits = defineEmits(["login"])

let userStore = useUserStore()

const info = computed(() => {
  return userStore.getUserInfo
})

const showLoginBtn = computed(() => {
  return !info.value || Object.keys(info.value).length === 0
})

onShow(() => {
  console.log("onShow")
})

const onGetPhoneNumber = (e: any) => {
  console.log(e)
  const phoneCode = e.detail.code
  uni.login({
    success: async (res) => {
      const jsCode = res.code
      const { data: loginData }: any = await login({ jsCode, phoneCode })
      console.log("resData", loginData.token)
      userStore.setToken(loginData.token)
      const { data: userInfoData }: any = await getUserInfo()
      console.log("userInfoData", userInfoData)
      userStore.setUserInfo(userInfoData.info)
      emits("login")
    },
  })
}
const onLogin = () => {
  uni.login({
    success: async (res) => {
      const jsCode = res.code
      const { data: loginData }: any = await login({ jsCode })
      console.log("resData", loginData.token)
      userStore.setToken(loginData.token)
      const { data: userInfoData }: any = await getUserInfo()
      console.log("userInfoData", userInfoData)
      userStore.setUserInfo(userInfoData.info)
      emits("login")
    },
  })
}
</script>

<style lang="less" scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  // height: 276px;
  background-color: #f9be7c;
  border-bottom-right-radius: 45px;
  border-bottom-left-radius: 45px;
  .user-info {
    flex: 1;
    padding: 0 60px;
    display: flex;
    // justify-content: center;
    align-items: center;
    overflow: hidden;
    padding-top: 72px;
    &-avatar {
      flex-shrink: 0;
      margin-right: 20px;
      width: 80px;
      height: 80px;
      border-radius: 100%;
      // background-color: #6488e4;
    }
    .user-info-txt {
      flex: 1;
      overflow: hidden;
      .user-info-name {
        color: #2d2b2f;
        font-size: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .user-info-tag {
        color: #6f6558;
        font-size: 14px;
      }

      .login-btn {
        background-color: transparent;
        border: none;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>

<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 03:07:55
 * @LastEditTime: 2025-02-23 03:20:15
 * @Description: 用户信息-头部
-->
<template>
  <div class="page-head">
    <div class="user-info">
      <img class="user-info-avatar" :src="info.avatar" alt="" />
      <div class="user-info-txt">
        <div class="user-info-name">{{ info.name }}</div>
        <div class="user-info-tag">组：{{ '基础用户' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import UserAvatar from '/static/微信头像.png'

const info = ref({
  name: "漆黑大枕头",
  avatar: UserAvatar,
})
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
    }
  }
}
</style>

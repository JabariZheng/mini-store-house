<!--
 * @Author: ZhengJie
 * @Date: 2025-02-28 16:19:09
 * @LastEditTime: 2025-02-28 17:10:56
 * @Description: 分组详情
-->
<template>
  <div class="group-detail">
    <div class="detail-name">{{ "分组1" }}</div>
    <div class="info-card">
      <div class="card-container">
        <div class="info-card-item">
          <text class="info-card-item-label">创建人：</text>
          <div class="info-card-item-value">{{ "Zhengjie" }}</div>
        </div>
        <div class="info-card-item">
          <text class="info-card-item-label">创建时间：</text>
          <div class="info-card-item-value">{{ "2025-01-01 10:00:00" }}</div>
        </div>
        <div class="info-card-item">
          <text class="info-card-item-label">组员：</text>
          <div class="info-card-item-value list">
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
              @click="onSelectConfirm({})"
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
            <img
              class="info-card-item-value-img"
              src="@/static/微信头像.png"
              mode="aspectFit"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="info-card-footer">
        <button class="disband-btn" @click="onDisband">解散</button>
        <button class="invite-btn" @click="onAdd">邀请</button>
      </div>
    </div>
  </div>
  <uni-popup ref="DialogRef" type="dialog">
    <uni-popup-dialog
      ref="inputClose"
      mode="input"
      title="用户手机号"
      v-model="userPhone"
      :before-close="true"
      @confirm="dialogInputConfirm"
      @close="dialogInputClose"
    ></uni-popup-dialog>
  </uni-popup>
  <uni-popup ref="ConfirmDialogRef" type="dialog">
    <uni-popup-dialog
      type="warn"
      cancelText="关闭"
      confirmText="同意"
      title="通知"
      :content="`是否删除用户${selectUser.name}？`"
      @confirm="dialogConfirm"
      @close="dialogClose"
    ></uni-popup-dialog>
  </uni-popup>
  <uni-popup ref="ConfirmDisbandDialogRef" type="dialog">
    <uni-popup-dialog
      type="warn"
      cancelText="关闭"
      confirmText="同意"
      title="通知"
      content="确认解散么？"
      @confirm="disbandDialogConfirm"
      @close="disbandDialogClose"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref } from "vue"

const DialogRef = ref<any>({})
const ConfirmDialogRef = ref<any>({})
const ConfirmDisbandDialogRef = ref<any>({})

let userPhone = ref("")
let selectUser = reactive<any>({
  name: "Zhengjie",
})
let safeAreaBottom = ref("0px")

onLoad((options) => {
  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
})

const onAdd = () => {
  DialogRef.value.open()
}

const dialogInputConfirm = () => {
  console.log("userPhone", userPhone.value)
  if (!userPhone.value) {
    DialogRef.value.close()
  }
}
const dialogInputClose = () => {
  DialogRef.value.close()
}

const onSelectConfirm = (userData: any) => {
  for (let item in userData) {
    selectUser[item] = userData[item]
  }
  ConfirmDialogRef.value.open()
}

const dialogConfirm = () => {
  console.log("点击确认")
}
const dialogClose = () => {
  console.log("点击关闭")
}
const onDisband = () => {
  ConfirmDisbandDialogRef.value.open()
}
const disbandDialogConfirm = () => {
  console.log("点击确认")
}
const disbandDialogClose = () => {
  console.log("点击关闭")
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fef9ec;
}
.group-detail {
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 0 10px;

  .detail-name {
    color: #0d253f;
    font-size: 24px;
    margin: 10px 0;
  }

  .info-card {
    border-radius: 10px;
    background-color: #fde4c7;
    padding: 10px;
    .info-card-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 10px;
      &:not(:first-child) {
        padding-top: 10px;
      }

      &:not(:last-child) {
        border-bottom: 1px solid rgba(78, 80, 83, 0.1);
        // padding-bottom: 5px;
        //   margin-bottom: 10px;
      }

      &-label {
        flex-shrink: 0;
        color: #696969;
      }
      &-value {
        color: #0d253f;
        &.list {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          .info-card-item-value-img {
            width: 20px;
            height: 20px;
            border-radius: 100%;
            margin-right: 10px;
            margin-bottom: 5px;
          }
        }
      }
    }

    .info-card-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        flex: 1;
        border-radius: 20px;
        color: #fff;
        &:not(:last-child) {
          margin-right: 10px;
        }
        &.disband-btn {
          background-color: #e46472;
        }
        &.invite-btn {
          background-color: #6488e4;
        }
      }
    }
  }
}
</style>

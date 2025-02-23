<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 02:03:00
 * @LastEditTime: 2025-02-24 02:49:22
 * @Description: 仓库管理
-->
<template>
  <div class="store-manage">
    <div class="store-container">
      <scroll-view :scrollY="true" class="store-list-scroll-view">
        <div v-for="(item, index) in storeList" :key="index" class="store-item">
          <div class="store-item-name">{{ item.name }}</div>
          <div class="store-item-desc">总量：</div>
          <div class="store-item-desc">创建时间：</div>
        </div>
      </scroll-view>
    </div>
    <div class="add-btn" :style="{ marginBottom: safeAreaBottom }">
      <button @click="onAdd">新增</button>
    </div>
  </div>
  <uni-popup ref="DialogRef" type="dialog">
    <uni-popup-dialog
      ref="inputClose"
      mode="input"
      title="仓库名称"
      v-model="storeName"
      :before-close="true"
      @confirm="dialogInputConfirm"
      @close="dialogInputClose"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"

const DialogRef = ref<any>({})

let storeName = ref("")
let storeList = ref([
  { name: "仓库1", id: "1" },
  { name: "仓库2", id: "11" },
  { name: "仓库3", id: "12" },
  { name: "仓库4", id: "13" },
  { name: "仓库5", id: "14" },
  { name: "仓库6", id: "15" },
  { name: "仓库7", id: "16" },
  { name: "仓库8", id: "17" },
  { name: "仓库9", id: "18" },
  { name: "仓库1", id: "19" },
  { name: "仓库2", id: "10" },
  { name: "仓库1", id: "21" },
  { name: "仓库2", id: "211" },
  { name: "仓库3", id: "212" },
  { name: "仓库4", id: "213" },
  { name: "仓库5", id: "214" },
  { name: "仓库6", id: "215" },
  { name: "仓库7", id: "216" },
  { name: "仓库8", id: "217" },
  { name: "仓库9", id: "218" },
  { name: "仓库1", id: "219" },
  { name: "仓库2", id: "210" },
])

let safeAreaBottom = ref("0px")

onLoad((options) => {
  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
})

const onAdd = () => {
  DialogRef.value.open()
}

const dialogInputConfirm = () => {
  console.log("storeName", storeName.value)
  if (!storeName.value) {
    DialogRef.value.close()
  }
}
const dialogInputClose = () => {
  DialogRef.value.close()
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fef9ec;
}
.store-manage {
  height: 100%;
  display: flex;
  flex-flow: column;

  .store-container {
    padding: 0 10px;
    flex: 1;
    overflow: hidden;
    height: 1px;
    margin-bottom: 10px;

    .store-list-scroll-view {
      height: 100%;

      .store-item {
        background-color: #6488e4;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
        transition: all 0.3s;

        .store-item-name {
          font-size: 20px;
          // color: #2d2b2f;
          color: #fff;

          margin-bottom: 5px;
          transition: all 0.3s;
        }

        .store-item-desc {
          font-size: 12px;
          // color: #696969;
          color: #fff;

          transition: all 0.3s;
        }
      }
    }
  }

  .add-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 10px;
    button {
      flex: 1;
      background-color: #6488e4;
      border-radius: 50px;
      color: #fff;
    }
  }
}
</style>

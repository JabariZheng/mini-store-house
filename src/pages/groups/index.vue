<!--
 * @Author: ZhengJie
 * @Date: 2025-02-28 16:19:09
 * @LastEditTime: 2025-02-28 16:38:03
 * @Description: 分组管理
-->
<template>
  <div class="group-manage">
    <div class="group-container">
      <scroll-view :scrollY="true" class="group-list-scroll-view">
        <div
          v-for="(item, index) in groupList"
          :key="index"
          class="group-item"
          @click="onItemClick(item)"
        >
          <div class="group-item-name">{{ item.name }}</div>
          <div class="group-item-desc">创建时间：</div>
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
      title="分组名称"
      v-model="groupName"
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

let groupName = ref("")
let groupList = ref([
  { name: "分组1", id: "1" },
  { name: "分组2", id: "11" },
  { name: "分组3", id: "12" },
  { name: "分组4", id: "13" },
  { name: "分组5", id: "14" },
  { name: "分组6", id: "15" },
  { name: "分组7", id: "16" },
  { name: "分组8", id: "17" },
  { name: "分组9", id: "18" },
  { name: "分组1", id: "19" },
  { name: "分组2", id: "10" },
  { name: "分组1", id: "21" },
  { name: "分组2", id: "211" },
  { name: "分组3", id: "212" },
  { name: "分组4", id: "213" },
  { name: "分组5", id: "214" },
  { name: "分组6", id: "215" },
  { name: "分组7", id: "216" },
  { name: "分组8", id: "217" },
  { name: "分组9", id: "218" },
  { name: "分组1", id: "219" },
  { name: "分组2", id: "210" },
])

let safeAreaBottom = ref("0px")

onLoad((options) => {
  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
})

const onAdd = () => {
  DialogRef.value.open()
}

const dialogInputConfirm = () => {
  console.log("groupName", groupName.value)
  if (!groupName.value) {
    DialogRef.value.close()
  }
}
const dialogInputClose = () => {
  DialogRef.value.close()
}

const onItemClick = (item: any) => {
  uni.navigateTo({
    url: `/pages/groupsDetail/index?id=${item.id}`,
  })
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fef9ec;
}
.group-manage {
  height: 100%;
  display: flex;
  flex-flow: column;

  .group-container {
    padding: 0 10px;
    flex: 1;
    overflow: hidden;
    height: 1px;
    margin-bottom: 10px;

    .group-list-scroll-view {
      height: 100%;

      .group-item {
        background-color: #6488e4;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
        transition: all 0.3s;

        .group-item-name {
          font-size: 20px;
          // color: #2d2b2f;
          color: #fff;

          margin-bottom: 5px;
          transition: all 0.3s;
        }

        .group-item-desc {
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

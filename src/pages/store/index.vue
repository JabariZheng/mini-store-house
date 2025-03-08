<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 02:03:00
 * @LastEditTime: 2025-03-08 21:20:03
 * @Description: 仓库管理
-->
<template>
  <div class="store-manage">
    <div class="store-container">
      <scroll-view :scrollY="true" class="store-list-scroll-view">
        <uni-swipe-action>
          <template v-for="(item, index) in storeList">
            <uni-swipe-action-item
              :show="item.swiperShow"
              :right-options="rightOptions"
              @click="onSwipeActionClick($event, item)"
            >
              <div class="store-item" @click="onItemClick($event, item)">
                <div class="store-item-name">{{ item.warehouseName }}</div>
                <div class="store-item-desc">
                  更新时间：{{ item.updateDate }}
                </div>
                <div class="store-item-desc">
                  创建时间：{{ item.createDate }}
                </div>
              </div>
            </uni-swipe-action-item>
          </template>
        </uni-swipe-action>
        <!-- <div
          v-for="(item, index) in storeList"
          :key="index"
          class="store-item"
          @click="onItemClick(item)"
        >
          <div class="store-item-name">{{ item.warehouseName }}</div>
          <div class="store-item-desc">更新时间：{{ item.updateDate }}</div>
          <div class="store-item-desc">创建时间：{{ item.createDate }}</div>
        </div> -->
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
      :before-close="true"
      @confirm="dialogInputConfirm"
      @close="dialogClose"
    >
      <uni-easyinput
        type="text"
        v-model="currentItem.warehouseName"
        placeholder="请输入"
      />
    </uni-popup-dialog>
  </uni-popup>
  <uni-popup ref="ConfirmDialogRef" type="dialog">
    <uni-popup-dialog
      type="warn"
      cancelText="关闭"
      confirmText="同意"
      title="通知"
      content="确认删除么？"
      @confirm="dialogConfirm"
      @close="dialogConfirmClose"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import {
  addCmsWarehouse,
  delCmsWarehouse,
  getCmsWarehouseList,
  updateCmsWarehouse,
} from "@/api/modules/warehouse"
import type { IWarehouseItem } from "@/types/warehouse"
import { hideLoading, showLoading } from "@/utils/loading"
import { onLoad } from "@dcloudio/uni-app"
import { nextTick, reactive, ref } from "vue"

const DialogRef = ref<any>({})
const ConfirmDialogRef = ref<any>({})

const rightOptions = ref([
  {
    text: "删除",
    style: {
      backgroundColor: "#E46472",
      color: "#fff",
    },
  },
])

let currentItem = ref<IWarehouseItem | any>({})
// let currentItem = reactive<IWarehouseItem | any>({
//   id: undefined,
//   warehouseName: "",
//   swiperShow: "none",
// })
let storeList = ref<IWarehouseItem[] | any[]>([])

let safeAreaBottom = ref("0px")

onLoad((options) => {
  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
  getList()
})

const getList = async () => {
  try {
    storeList.value = []
    showLoading()
    // uni.showLoading({ mask: true })
    const { data }: any = await getCmsWarehouseList()
    storeList.value = data.list.map((item: any) => {
      item.swiperShow = "none"
      return item
    })
    hideLoading()
    // uni.hideLoading()
  } catch (error) {
    console.log("error", error)
    hideLoading()
    // uni.hideLoading()
  }
}

const onAdd = async () => {
  await nextTick()
  currentItem.value = {}
  // currentItem = {
  //   ...currentItem,
  //   id: undefined,
  //   swiperShow: "none",
  //   warehouseName: "",
  // }
  DialogRef.value.open()
}

const dialogInputConfirm = async () => {
  if (!currentItem.value.warehouseName) {
    DialogRef.value.close()
  }
  try {
    showLoading()
    // uni.showLoading({ mask: true })
    if (!currentItem.value.id) {
      await addCmsWarehouse({
        warehouseName: currentItem.value.warehouseName,
      })
      uni.showToast({
        title: "添加成功",
        icon: "none",
      })
    } else {
      await updateCmsWarehouse({
        id: currentItem.value.id,
        warehouseName: currentItem.value.warehouseName,
      })
      uni.showToast({
        title: "修改成功",
        icon: "none",
      })
    }
    await nextTick()
    currentItem.value.warehouseName = ""
    // uni.hideLoading()
    hideLoading()
    dialogClose()
    getList()
  } catch (error: any) {
    uni.showToast({
      title: error.msg,
      icon: "none",
    })
    console.log("error", error)
  }
}
const dialogClose = () => {
  DialogRef.value.close()
}

const onItemClick = async (e: MouseEvent, data: IWarehouseItem | any) => {
  e.stopPropagation()
  await nextTick()
  // for (let item in data) {
  //   currentItem[item] = data[item]
  // }
  currentItem.value = { ...data }
  DialogRef.value.open()
}

const onSwipeActionClick = async (event: any, data: IWarehouseItem | any) => {
  if (event.index === 0) {
    await nextTick()
    // for (let item in data) {
    //   currentItem[item] = data[item]
    // }
    currentItem.value = { ...data }
    ConfirmDialogRef.value.open()
  }
}

const dialogConfirm = async () => {
  try {
    showLoading()
    // uni.showLoading({ mask: true })
    await delCmsWarehouse({
      ids: [currentItem.value.id],
    })
    uni.showToast({
      title: "删除成功",
      icon: "none",
    })
    await nextTick()
    currentItem.value = {}
    // currentItem = {
    //   id: undefined,
    //   swiperShow: "none",
    //   warehouseName: "",
    // }
    getList()
    // uni.hideLoading()
    hideLoading()
  } catch (error) {
    console.log("error")
    hideLoading()
    // uni.hideLoading()
  }
}
const dialogConfirmClose = async () => {
  await nextTick()
  currentItem.value.swiperShow = "none"
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

    .uni-swipe {
      margin-bottom: 10px;
      border-radius: 5px;
      // border-top-left-radius: 5px;
      // border-top-right-radius: 5px;
    }

    .store-list-scroll-view {
      height: 100%;

      .store-item {
        background-color: #6488e4;
        // border-radius: 5px;
        // margin-bottom: 10px;
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

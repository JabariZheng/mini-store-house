<!--
 * @Author: ZhengJie
 * @Date: 2025-02-19 02:03:00
 * @LastEditTime: 2025-03-02 01:17:22
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
              <div class="store-item" @click="onItemClick(item)">
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
import { IWarehouseItem } from "@/types/warehouse.d"
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref } from "vue"

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

let currentItem = reactive<IWarehouseItem | any>({
  id: undefined,
  warehouseName: "",
  swiperShow: "none",
})
let storeList = ref<IWarehouseItem[] | any[]>([])

let safeAreaBottom = ref("0px")

onLoad((options) => {
  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
  getList()
})

const getList = async () => {
  try {
    storeList.value = []
    uni.showLoading({ mask: true })
    const { data }: any = await getCmsWarehouseList()
    storeList.value = data.list.map((item: any) => {
      item.swiperShow = "none"
      return item
    })
  } catch (error) {
    console.log("error", error)
  } finally {
    uni.hideLoading()
  }
}

const onAdd = () => {
  currentItem = {
    id: undefined,
    swiperShow: "none",
    warehouseName: "",
  }
  DialogRef.value.open()
}

const dialogInputConfirm = async () => {
  if (!currentItem.warehouseName) {
    DialogRef.value.close()
  }
  try {
    uni.showLoading({ mask: true })
    if (!currentItem.id) {
      await addCmsWarehouse({
        warehouseName: currentItem.warehouseName,
      })
      uni.showToast({
        title: "添加成功",
        icon: "none",
      })
    } else {
      await updateCmsWarehouse({
        id: currentItem.id,
        warehouseName: currentItem.warehouseName,
      })
      uni.showToast({
        title: "修改成功",
        icon: "none",
      })
    }
    uni.hideLoading()
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

const onItemClick = (data: IWarehouseItem | any) => {
  for (let item in data) {
    currentItem[item] = data[item]
  }
  DialogRef.value.open()
}

const onSwipeActionClick = (event: any, data: IWarehouseItem | any) => {
  if (event.index === 0) {
    for (let item in data) {
      currentItem[item] = data[item]
    }
    ConfirmDialogRef.value.open()
  }
}

const dialogConfirm = async () => {
  console.log("点击确认")
  try {
    uni.showLoading({ mask: true })
    await delCmsWarehouse({
      ids: [currentItem.id],
    })
    uni.showToast({
      title: "删除成功",
      icon: "none",
    })
    currentItem = {
      id: undefined,
      swiperShow: "none",
      warehouseName: "",
    }
    getList()
    uni.hideLoading()
  } catch (error) {
    console.log("error")
    uni.hideLoading()
  }
}
const dialogConfirmClose = () => {
  currentItem.swiperShow = "none"
  console.log("点击关闭")
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

<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-03-12 14:02:34
 * @Description: 首页
-->
<template>
  <div class="index-page" :style="{ paddingTop: safeAreaTop }">
    <uni-nav-bar
      :title="navbarTitle"
      backgroundColor="transparent"
      :border="false"
      :shadow="false"
    >
      <template #left>
        <img
          src="/static/arrowLeft.png"
          alt=""
          class="icon-more"
          @click="openStoreDrawer"
        />
      </template>
    </uni-nav-bar>
    <div class="container">
      <!-- <div class="overview">
        <div
          v-for="(item, value, index) in overviewData"
          :key="index"
          class="overview-item"
          :style="{ backgroundColor: item.bgColor }"
        >
          <div class="overview-item-value">{{ item.value }}</div>
          <div class="overview-item-label">{{ item.label }}</div>
        </div>
      </div> -->
      <div class="tools-grid">
        <div
          v-for="(item, index) in tools"
          :key="index"
          class="tools-grid-item"
          @click="onToolClick(item.commond)"
        >
          <div class="tools-grid-item-icon">
            <img
              class="tools-grid-item-icon-img"
              :src="item.icon"
              alt=""
              :style="{ backgroundColor: item.bgColor }"
            />
          </div>
          <div class="tools-grid-item-label">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
  <uni-drawer ref="DrawerRef" mode="left" :mask-click="true">
    <div
      class="store-drawer__content"
      :style="{
        marginTop: safeAreaTop,
        height: `calc(100% - ${safeAreaTop} - 10px)`,
      }"
    >
      <div class="store-title">切换仓库</div>
      <div class="store-drawer__container">
        <scroll-view style="height: 100%" scroll-y="true">
          <div
            v-for="(item, index) in storeList"
            :key="index"
            class="store-item"
            :class="{ active: currentStore?.id === item.id }"
            @click="onStoreClick(item)"
          >
            <div class="store-item-name">{{ item.warehouseName }}</div>
            <div class="store-item-desc">创建时间：{{ item.createDate }}</div>
          </div>
        </scroll-view>
      </div>
    </div>
  </uni-drawer>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app"
import { computed, reactive, ref } from "vue"
import IconChuku from "@/static/chuku.png"
import IconRuku from "@/static/ruku.png"
import IconPandian from "@/static/pandian.png"
import { getCmsWarehouseList } from "@/api/modules/warehouse"
import type { IWarehouseItem } from "@/types/warehouse"
import { checkIsLogin } from "@/utils"
import {
  getCmsGoodsList,
  getCmsGoodInfo,
  updateCmsGoodsStore,
} from "@/api/modules/goods"
import type { IGoodsListItem } from "@/types/goods"

const DrawerRef = ref<any>({})

let safeAreaTop = ref("0px")

let storeList = ref<IWarehouseItem[] | any[]>([])

let currentStore = ref<IWarehouseItem | any>({})

let overviewData = reactive({
  todayEnter: {
    label: "今日入库",
    value: 0,
    bgColor: "#6488E4",
  },
  todayOut: {
    label: "今日出库",
    value: 0,
    bgColor: "#F9BE7C",
  },
  inventoryAlarm: {
    label: "库存预警",
    value: 0,
    bgColor: "#E46472",
  },
  total: {
    label: "库存总量",
    value: 0,
    bgColor: "#309397",
  },
})

const tools = ref([
  { icon: IconRuku, label: "入库", commond: "in", bgColor: "#6488E4" },
  { icon: IconChuku, label: "出库", commond: "out", bgColor: "#F9BE7C" },
  { icon: IconRuku, label: "库存", commond: "list", bgColor: "#309397" },
  // {
  //   icon: IconPandian,
  //   label: "盘点",
  //   commond: "stocktaking",
  //   bgColor: "#ACBFE0",
  // },
])

const navbarTitle = computed(() => {
  return currentStore.value?.warehouseName || ""
})

onLoad(async () => {
  const windowInfo = uni.getWindowInfo()
  if (windowInfo.safeArea?.top) {
    safeAreaTop.value = windowInfo.safeArea.top + "px"
  }
})

onShow(async () => {
  if (checkIsLogin()) {
    await getList()
    if (Object.keys(currentStore.value || {}).length === 0) {
      currentStore.value = storeList.value[0]
    }
  }
})

/**
 * 获取仓库列表
 */
const getList = async () => {
  try {
    uni.showLoading({ mask: true })
    const { data }: any = await getCmsWarehouseList()
    storeList.value = data.list
    uni.hideLoading()
  } catch (error) {
    console.log("error", error)
    uni.hideLoading()
  }
}

const openStoreDrawer = () => {
  DrawerRef.value.open()
}

const onToolClick = async (commondStr: string) => {
  if (!checkIsLogin()) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    })
    return
  }
  if (!currentStore.value || Object.keys(currentStore.value || {}).length ===0) {
    uni.showToast({
      title: "请先创建仓库",
      icon: "none",
    })
    return
  }
  
  switch (commondStr) {
    case "in":
      uni.navigateTo({
        url: `/pages/goods/index?type=${commondStr}&storeId=${currentStore.value.id}`,
      })
      break
    case "out":
      uni.showLoading({ mask: true })
      uni.scanCode({
        success: async (res) => {
          uni.showLoading({ mask: true })
          const goodsBarCode = res.result
          const { data } = await getCmsGoodInfo({ goodsBarCode })
          if (!data || Object.keys(data).length === 0) {
            uni.showToast({
              title: "暂无该商品",
              icon: "none",
            })
            return
          }
          let currentGood: IGoodsListItem = data
          if (currentGood.inventory.inventoryNumber === 0) {
            uni.showToast({
              title: "该商品已经无库存",
              icon: "none",
            })
            return
          }
          currentGood.inventory.inventoryNumber--
          console.log("currentGood", currentGood)
          // 库存自动减一
          await updateCmsGoodsStore(currentGood)
          uni.showToast({
            title: "出库成功",
            icon: "none",
          })
        },
        fail: () => {
          console.log("fail")
          uni.hideLoading()
        },
      })
      break
    case "list":
      uni.navigateTo({
        url: `/pages/goodsList/index?storeId=${currentStore.value.id}`,
      })
      break
    case "stocktaking":
      uni.navigateTo({
        url: `/pages/stocktaking/index?type=${commondStr}&storeId=${currentStore.value.id}`,
      })
      break

    default:
      break
  }
}

const onStoreClick = (data: IWarehouseItem) => {
  currentStore.value = data
  DrawerRef.value.close()
}
</script>

<style lang="scss">
page {
  // height: 100%;
  background-color: #fef9ec;
}
.uni-drawer__content {
  background-color: #fef9ec !important;

  .store-drawer__content {
    height: calc(100% - 34px);
    padding: 0 10px;
    display: flex;
    flex-flow: column;
    .store-drawer__container {
      flex: 1;
      overflow: hidden;

      .store-item {
        background-color: #d8d8d8;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
        transition: all 0.3s;

        .store-item-name {
          font-size: 20px;
          color: #2d2b2f;
          margin-bottom: 5px;
          transition: all 0.3s;
        }

        .store-item-desc {
          font-size: 12px;
          color: #696969;
          transition: all 0.3s;
        }

        &.active {
          background-color: #6488e4;
          .store-item-name,
          .store-item-desc {
            color: #fff;
          }
        }
      }
    }
  }

  .store-title {
    color: #0d253f;
    font-size: 24px;
    margin-bottom: 20px;
  }
}
.index-page {
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-flow: column;

  // .header {
  //   display: flex;
  //   align-items: center;
  //   height: 44px;
  .icon-more {
    width: 21px;
    height: 16px;
  }
  // }

  .container {
    margin-top: 10px;

    .overview {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .overview-item {
        display: flex;
        flex-flow: column;
        justify-content: center;
        text-align: center;
        flex: 1;
        border-radius: 20px;
        height: 90px;
        color: #fff;
        &:not(:last-child) {
          margin-right: 10px;
        }
        &-value {
          font-size: 26px;
        }
        &-label {
          font-size: 14px;
        }
      }
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;

      .tools-grid-item {
        display: flex;
        flex-flow: column;
        color: #0d253f;
        text-align: center;

        .tools-grid-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          &-img {
            width: 40px;
            height: 40px;
            padding: 20px;
            border-radius: 100%;
          }
        }
      }
    }
  }

  .goods-in {
    flex: 1;
    margin-bottom: 20px;
    background-color: #fde4c7;
    border-radius: 10px;
  }
  .goods-out {
    flex: 1;
    margin-bottom: 20px;
    background-color: #d8e6dc;
    border-radius: 10px;
  }
}
</style>

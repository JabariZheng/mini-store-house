<!--
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-02-24 02:50:05
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
      <div class="overview">
        <div
          v-for="(item, value, index) in overviewData"
          :key="index"
          class="overview-item"
          :style="{ backgroundColor: item.bgColor }"
        >
          <div class="overview-item-value">{{ item.value }}</div>
          <div class="overview-item-label">{{ item.label }}</div>
        </div>
      </div>
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
            :class="{ active: currentStoreId === item.id }"
            @click="onStoreClick(item.id)"
          >
            <div class="store-item-name">{{ item.name }}</div>
            <div class="store-item-desc">总量：</div>
            <div class="store-item-desc">创建时间：</div>
          </div>
        </scroll-view>
      </div>
    </div>
  </uni-drawer>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref } from "vue"
import IconChuku from "@/static/chuku.png"
import IconRuku from "@/static/ruku.png"

const DrawerRef = ref<any>({})

let safeAreaTop = ref("0px")
let navbarTitle = ref("仓库1")
let storeId = ref("1234")

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

let currentStoreId = ref("1")

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
])

onLoad(async () => {
  console.log("onLoad")
  const windowInfo = uni.getWindowInfo()
  if (windowInfo.safeArea?.top) {
    safeAreaTop.value = windowInfo.safeArea.top + "px"
  }
  console.log("windowInfo", windowInfo)
})

const openStoreDrawer = () => {
  DrawerRef.value.open()
}

const onToolClick = (commondStr: string) => {
  switch (commondStr) {
    case "in":
      uni.navigateTo({
        url: `/pages/goods/index?type=${commondStr}&storeId=${storeId.value}`,
      })
      break
    case "out":
      uni.scanCode({
        success: (res) => {
          console.log("res", res)
        },
      })
      break
    case "list":
      uni.navigateTo({
        url: `/pages/goodsList/index?storeId=${storeId.value}`,
      })
      break

    default:
      break
  }
}

const onStoreClick = (storeId: string) => {
  currentStoreId.value = storeId
  // DrawerRef.value.close()
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
      margin-top: 40px;

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

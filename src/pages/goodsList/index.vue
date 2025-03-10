<template>
  <div class="goods-list">
    <div class="head-search">
      <uni-search-bar
        class="uni-mt-10"
        radius="5"
        placeholder="输入商品名称"
        clearButton="auto"
        cancelButton="none"
        @confirm="onSearch"
        @clear="onClear"
      />
    </div>
    <div class="goods-list-container">
      <scroll-view :scrollY="true" class="goods-list-container-scroll-view">
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="goods-item"
          @click="onItemClick(item)"
        >
          <div class="goods-item-img">
            <img
              :src="(item.goodsImg && BASE_API_HOST + item.goodsImg) || ''"
              mode="aspectFit"
              alt=""
            />
          </div>
          <div class="goods-item-info">
            <div class="goods-item-info-title">{{ item.goodsName }}</div>
            <div class="goods-item-info-num">
              库存：{{ item.inventory.inventoryNumber }}
            </div>
            <div class="goods-item-info-date">
              更新时间：{{ item.updateDate }}
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <uni-fab
      ref="fab"
      :pattern="fabPattern"
      horizontal="right"
      :content="fabContent"
      @trigger="fabTrigger"
    />
  </div>
  <uni-popup ref="DetailDialogRef" type="dialog">
    <div class="detail-dialog-container">
      <div class="goods-img">
        <img
          mode="aspectFit"
          :src="
            (currentGood.goodsImg && BASE_API_HOST + currentGood.goodsImg) || ''
          "
          alt=""
        />
      </div>
      <div class="goods-item-info">
        <div class="goods-item-info-item">
          <text class="info-label">名称：</text>
          <uni-easyinput
            v-if="isStocktaking"
            trim="all"
            v-model="currentGood.goodsName"
            :styles="inputStyles"
          ></uni-easyinput>
          <text v-else class="info-value">{{ currentGood.goodsName }}</text>
        </div>
        <div class="goods-item-info-item">
          <text class="info-label">条码：</text>
          <uni-easyinput
            v-if="isStocktaking"
            trim="all"
            type="number"
            :styles="inputStyles"
            v-model="currentGood.goodsBarCode"
          ></uni-easyinput>
          <text v-else class="info-value">{{ currentGood.goodsBarCode }}</text>
        </div>
        <div class="goods-item-info-item">
          <text class="info-label">库存：</text>
          <uni-easyinput
            v-if="isStocktaking"
            trim="all"
            type="number"
            :styles="inputStyles"
            v-model="currentGood.inventory.inventoryNumber"
          ></uni-easyinput>
          <text v-else class="info-value">{{
            currentGood.inventory.inventoryNumber
          }}</text>
        </div>
        <template v-if="!isStocktaking">
          <div class="goods-item-info-item">
            <text class="info-label">创建时间：</text>
            <text class="info-value">{{ currentGood.createDate }}</text>
          </div>
          <div class="goods-item-info-item">
            <text class="info-label">入库时间：</text>
            <text class="info-value">{{
              currentGood.inventory.updateDate
            }}</text>
          </div>
        </template>
      </div>
      <div class="goods-info-save">
        <button @click="onChangeImg">更换图片</button>
        <button v-if="isStocktaking" @click="onSave">保存</button>
      </div>
    </div>
  </uni-popup>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue"
import {
  getCmsGoodsList,
  getCmsGoodInfo,
  updateCmsGoodsStore,
  updateCmsGoods,
} from "@/api/modules/goods"
import type { IGoodsListItem } from "@/types/goods"
import { onLoad } from "@dcloudio/uni-app"
import { BASE_API_HOST } from "@/api/fetch"
import { hideLoading, showLoading } from "@/utils/loading"
import { useUserStore } from "@/store/user"

const DetailDialogRef = ref<any>({})

const userStore = useUserStore()

let searchValue = ref("")
let goodsData = ref<IGoodsListItem[]>([])
let isStocktaking = ref(false)
let currentGood = reactive<IGoodsListItem>({
  id: "",
  goodsName: "",
  goodsBarCode: "",
  goodsImg: "",
  status: "",
  createBy: "",
  createDate: "",
  updateBy: "",
  updateDate: "",
  inventory: {
    goodsId: "",
    inventoryNumber: 0,
    warehouseId: "",
    createBy: "",
    createDate: "",
    updateBy: "",
    updateDate: "",
  },
})
const fabContent = reactive([
  {
    iconPath: "/static/pandian-0D253F.png",
    selectedIconPath: "/static/pandian-0D253F.png",
    text: "盘点",
    active: false,
  },
])
const fabPattern = reactive({
  buttonColor: "#6488E4",
})
const inputStyles = {
  borderColor: "transparent",
  backgroundColor: "transparent",
  textAlign: "right",
}

const listData = computed(() => {
  if (!searchValue.value) return goodsData.value
  return goodsData.value.filter((item) =>
    item.goodsName.includes(searchValue.value)
  )
})

onLoad(() => {
  getList()
})

const getList = async () => {
  try {
    uni.showLoading({ mask: true })
    const { data } = await getCmsGoodsList()
    goodsData.value = data.list.map((item: IGoodsListItem) => {
      // if (item.goodsImg) {
      //   item.goodsImg = `${BASE_API_HOST}${item.goodsImg}`
      // }
      return item
    })
    uni.hideLoading()
  } catch (error) {
    console.log("error:", error)
  }
}
const onSearch = ({ value }: any) => {
  console.log("onSearch:", value)
  searchValue.value = value
}
const onClear = ({ value }: any) => {
  console.log("onClear:", value)
  searchValue.value = value
}

const onItemClick = (data: IGoodsListItem) => {
  for (let item in data) {
    currentGood[item] = data[item]
  }
  isStocktaking.value = false
  DetailDialogRef.value.open()
}

const fabTrigger = async ({ index }: any) => {
  switch (index) {
    case 0:
      // 盘点
      uni.showLoading({ mask: true })
      uni.scanCode({
        success: async (res) => {
          const goodsBarCode = res.result
          const { data } = await getCmsGoodInfo({ goodsBarCode })
          if (!data || Object.keys(data).length === 0) {
            // 库中没有商品，走新增方式
            uni.showToast({
              title: "仓库中没有该商品，去新增入库",
              icon: "none",
            })
            setTimeout(() => {
              uni.navigateTo({
                url: `/pages/goods/index?goodsBarCode=${goodsBarCode}`,
              })
            }, 1000)
            return
          }
          currentGood = data
          isStocktaking.value = true
          DetailDialogRef.value.open()
        },
        complete: () => {
          uni.hideLoading()
        },
      })
      break

    default:
      break
  }
}

const onChangeImg = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      // uni.showLoading({ mask: true })
      showLoading()
      const uploadFileRes = await uni.uploadFile({
        url: BASE_API_HOST + "/sys/upload-images/item",
        filePath: res.tempFilePaths[0],
        header: {
          Authorization: userStore.getToken,
        },
        name: "file",
      })
      try {
        const fileData = JSON.parse(uploadFileRes.data)
        if (uploadFileRes.statusCode !== 201) {
          uni.showToast({
            title: fileData.msg,
            icon: "none",
          })
          return
        }
        currentGood.goodsImg = fileData.data.url
        console.log("currentGood.goodsImg", currentGood.goodsImg)
        // 直接更新商品
        await updateCmsGoods({ ...currentGood, inventory: undefined })
        // 更新list中的值
        const getIndex = goodsData.value.findIndex(
          (item) => item.id === currentGood.id
        )
        goodsData.value[getIndex].goodsImg = currentGood.goodsImg
        hideLoading()
      } catch (error) {
        console.log("JSON.parse error after uploadFile ", error)
        hideLoading()
      }
      return
    },
  })
}

const onSave = async () => {
  console.log("currentGood", currentGood)
  if (isNaN(+currentGood.inventory.inventoryNumber)) {
    uni.showToast({
      title: "请输入正确的库存数量",
      icon: "none",
    })
    return
  }
  if (!currentGood.goodsBarCode) {
    uni.showToast({
      title: "请输入条码",
      icon: "none",
    })
    return
  }
  if (!currentGood.goodsName) {
    uni.showToast({
      title: "请输入商品名称",
      icon: "none",
    })
    return
  }
  try {
    uni.showLoading({ mask: true })
    await updateCmsGoodsStore(currentGood)
    uni.showToast({
      title: "保存成功",
      icon: "none",
    })
    DetailDialogRef.value.close()
    goodsData.value = []
    setTimeout(() => {
      getList()
    }, 500)
  } catch (error) {
    console.log("error", error)
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fef9ec;
}
.goods-list {
  height: 100%;
  display: flex;
  flex-flow: column;

  &-container {
    padding: 0 10px;
    flex: 1;
    overflow: hidden;
    height: 1px;
    margin-bottom: 10px;

    &-scroll-view {
      height: 100%;

      .goods-item {
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 10px;
        min-height: 80px;
        background-color: #fde4c7;
        margin-bottom: 10px;

        .goods-item-img {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          margin-right: 10px;
          image {
            width: 100%;
            height: 100%;
          }
        }

        .goods-item-info {
          flex: 1;
          display: flex;
          flex-flow: column;
          &-title {
            flex: 1;
            color: #2d2b2f;
            margin-bottom: 14px;
          }

          &-num,
          &-date {
            color: #696969;
          }
        }
      }
    }
  }
}
.detail-dialog-container {
  display: flex;
  flex-flow: column;
  background-color: #fef9ec;
  border-radius: 5px;
  padding: 20px;
  .goods-img {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .goods-item-info {
    display: flex;
    flex-flow: column;
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid rgba(70, 80, 83, 0.1);
      .info-label {
        color: #696969;
      }
      .info-value {
        color: #0d253f;
      }
    }

    .uni-easyinput {
      text-align: right;
    }
  }
  .goods-info-save {
    display: flex;
    align-items: center;
    margin-top: 20px;
    button {
      flex: 1;
      background-color: #6488e4;
      color: #fff;
      border-radius: 100px;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
}
</style>

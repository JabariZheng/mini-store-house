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
            <div class="goods-item-info-date">
              创建时间：{{ item.createDate }}
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
        <div v-if="ocrResult.length > 0" class="goods-item-info-item">
          <text class="info-label">识别结果：</text>
          <div class="ocr-result">
            <text
              v-for="(item, index) in ocrResult"
              :key="index"
              class="ocr-result-item"
              @click="onOcrItemClick(item)"
            >
              {{ item.text }}
            </text>
          </div>
        </div>
        <div class="goods-item-info-item">
          <text class="info-label">名称：</text>
          <uni-easyinput
            trim="all"
            v-model="currentGood.goodsName"
            :styles="inputStyles"
          ></uni-easyinput>
        </div>
        <div class="goods-item-info-item">
          <text class="info-label">条码：</text>
          <uni-easyinput
            trim="all"
            type="number"
            :styles="inputStyles"
            v-model="currentGood.goodsBarCode"
          ></uni-easyinput>
        </div>
        <template v-if="!isEdit">
          <div class="goods-item-info-item">
            <text class="info-label">创建时间：</text>
            <text class="info-value">{{ currentGood.createDate }}</text>
          </div>
        </template>
      </div>
      <div class="goods-info-save">
        <button @click="onChangeImg">更换图片</button>
        <button @click="onSave">保存</button>
      </div>
    </div>
  </uni-popup>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, nextTick } from "vue"
import {
  getCmsGoodsList,
  getCmsGoodInfo,
  updateCmsGoodsStore,
  updateCmsGoods,
  addCmsGoods,
} from "@/api/modules/goods"
import type { IGoodsItem, IGoodsListItem } from "@/types/goods"
import { onLoad } from "@dcloudio/uni-app"
import { BASE_API_HOST } from "@/api/fetch"
import { hideLoading, showLoading } from "@/utils/loading"
import { useUserStore } from "@/store/user"
import type { IInventoryListItem } from "@/types/inventory"
import Icon_Upload from "@/static/upload-icon.png"
import { getOcrResultByImgUrl } from "@/api/modules/uploadImg"

const DetailDialogRef = ref<any>({})

const userStore = useUserStore()

let ocrResult = ref([])
let currentStoreId = ref("")
let searchValue = ref("")
let goodsData = ref<IGoodsListItem[]>([])
let isEdit = ref(false)
let currentGood = reactive<IGoodsItem>({
  id: "",
  goodsName: "",
  goodsBarCode: "",
  goodsImg: "",
  status: "",
  createBy: "",
  createDate: "",
  updateBy: "",
  updateDate: "",
})
const fabContent = reactive([
  {
    iconPath: "/static/caigou-0D253F.png",
    selectedIconPath: "/static/caigou-0D253F.png",
    text: "增加",
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

onLoad((options) => {
  getList()
})

const getList = async () => {
  try {
    uni.showLoading({ mask: true })
    const { data } = await getCmsGoodsList({})
    goodsData.value = data.list
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

const onItemClick = (data: IGoodsItem) => {
  for (let item in data) {
    currentGood[item] = data[item]
  }
  isEdit.value = false
  DetailDialogRef.value.open()
}

const fabTrigger = async ({ index }: any) => {
  switch (index) {
    case 0:
      // 增加
      uni.showLoading({ mask: true })
      uni.scanCode({
        success: async (res) => {
          const goodsBarCode = res.result
          let targetData: any = {
            goodsBarCode,
          }
          const { data } = await getCmsGoodInfo({ goodsBarCode })
          if (data && Object.keys(data).length > 0) {
            console.log("存在商品")
            targetData = data
          } else {
            console.log("无商品")
          }
          for (let item in currentGood) {
            currentGood[item] = targetData[item]
          }
          console.log("currentGood", currentGood)
          nextTick(() => {
            isEdit.value = true
            DetailDialogRef.value.open()
          })
        },
        fail(result) {
          uni.showToast({
            title: "请检查条形码",
            icon: "none",
          })
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
        // currentGood = {
        //   ...currentGood,
        //   goodsImg: fileData.data.url,
        // }
        currentGood.goodsImg = fileData.data.url
        // ocr
        console.log('ocr img:', BASE_API_HOST + fileData.data.url);
        const { data: ocrResResult } = await getOcrResultByImgUrl({
          url: BASE_API_HOST + fileData.data.url,
        })
        ocrResult.value = ocrResResult.map((item: string) => {
          return {
            text: item,
          }
        })
        // 直接更新商品
        if (currentGood.id) {
          await updateCmsGoods({ ...currentGood })
          // 更新list中的值
          const getIndex = goodsData.value.findIndex(
            (item) => item.id === currentGood.id
          )
          goodsData.value[getIndex].goodsImg = currentGood.goodsImg
        }
        hideLoading()
      } catch (error) {
        console.log("JSON.parse error after uploadFile ", error)
        hideLoading()
      }
      return
    },
  })
}

const onOcrItemClick = (data: any) => {
  if (!currentGood.goodsName) {
    currentGood.goodsName = ""
  }
  currentGood.goodsName += data.text
}

const onSave = async () => {
  console.log("currentGood", currentGood)
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
    if (currentGood.id) {
      await updateCmsGoods({ ...currentGood })
    } else {
      await addCmsGoods({ ...currentGood })
    }
    uni.showToast({
      title: "保存成功",
      icon: "none",
    })
    DetailDialogRef.value.close()
    goodsData.value = []
    ocrResult.value = []
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
        flex-shrink: 0;
        color: #696969;
      }
      .info-value {
        color: #0d253f;
      }
      .ocr-result {
        display: flex;
        flex-wrap: wrap;
        &-item {
          background-color: #d8d8d8;
          padding: 0 5px;
          border-radius: 10px;
          margin-bottom: 5px;
          margin-right: 5px;
        }
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

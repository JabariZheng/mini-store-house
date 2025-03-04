<!--
 * @Author: ZhengJie
 * @Date: 2025-02-23 03:21:25
 * @LastEditTime: 2025-03-05 03:15:17
 * @Description: 商品出入库
-->
<template>
  <div class="goods-manage-page">
    <div class="goods-img" @click="onChooseImg">
      <img
        v-if="!goodsInfo.goodsImg"
        class="upload-icon"
        src="/static/upload-icon.png"
        alt=""
      />
      <img
        v-else
        class="goods-img-item"
        mode="aspectFit"
        :src="goodsInfo.goodsImg"
        alt=""
      />
    </div>

    <div class="goods-info">
      <uni-forms ref="FormRef" :modelValue="goodsInfo">
        <uni-forms-item label="识别结果" v-if="ocrResult.length > 0">
          <div class="ocr-result">
            <text
              v-for="(item, index) in ocrResult"
              :key="index"
              class="ocr-result-item"
              @click="onItemClick(item)"
            >
              {{ item.text }}
            </text>
          </div>
        </uni-forms-item>
        <uni-forms-item label="条码" name="goodsBarCode">
          <div class="scane-code">
            <uni-easyinput
              type="text"
              :styles="inputStyles"
              v-model="goodsInfo.goodsBarCode"
            />
            <img
              @click="onScaneCode"
              class="tiaoxingma-icon"
              src="/static/tiaoxingma.png"
              alt=""
            />
          </div>
        </uni-forms-item>
        <uni-forms-item label="名称" name="goodsName">
          <uni-easyinput
            type="text"
            v-model="goodsInfo.goodsName"
            :styles="inputStyles"
            placeholder="请输入名称"
          />
        </uni-forms-item>

        <uni-forms-item label="数量" name="goodsNum">
          <uni-easyinput
            type="number"
            :styles="inputStyles"
            v-model="goodsInfo.goodsNum"
            placeholder="请输入数量"
          />
        </uni-forms-item>
      </uni-forms>
    </div>
    <div class="footer" :style="{ marginBottom: safeAreaBottom }">
      <button @click="onSave">入库</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addCmsGoodsToStore, getCmsGoodInfo } from "@/api/modules/goods"
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref } from "vue"

const FormRef = ref<any>({})

let currentStoreId = ref("")

let goodsInfo = reactive({
  goodsId: undefined,
  goodsImg: "",
  goodsName: "",
  goodsBarCode: "",
  goodsNum: 1,
})
let safeAreaBottom = ref("0px")

const inputStyles = reactive({
  backgroundColor: "",
  borderColor: "transparent",
})

let ocrResult = ref<any>([])

onLoad((options) => {
  console.log("options", options)
  const { type, storeId, goodsBarCode } = options

  if (storeId) {
    currentStoreId.value = storeId
  }
  if (goodsBarCode) {
    goodsInfo.goodsBarCode = goodsBarCode
  }

  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
})

/**
 * 重置页面信息
 */
const resetPageInfo = () => {
  goodsInfo = {
    goodsId: undefined,
    goodsImg: "",
    goodsName: "",
    goodsBarCode: "",
    goodsNum: 1,
  }
  ocrResult.value = []
}

/**
 * 选择图片
 */
const onChooseImg = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      console.log("res.tempFilePaths[0]", res.tempFilePaths[0])
      goodsInfo.goodsImg = res.tempFilePaths[0]

      ocrResult.value = []
      uni.showLoading({ mask: true })

      const invokeRes = await uni.serviceMarket.invokeService({
        service: "wx79ac3de8be320b71", //固定的不要动
        api: "OcrAllInOne", //固定的不要动
        data: {
          // 用 CDN 方法标记要上传并转换成 HTTP URL 的文件
          img_url: new uni.serviceMarket.CDN({
            type: "filePath",
            filePath: res.tempFilePaths[0],
          }),
          data_type: 3,
          ocr_type: 8,
        },
      })
      uni.hideLoading()
      if (invokeRes.errMsg.includes(":ok")) {
        // items 数据结构
        // box_confidence: 0.867062032
        // confidence: 0.851171851
        // language: "zh"
        //  pos: {
        // left_bottom: {x: -2.882821655, y: 140.15247345}
        // left_top: {x: -5.908043432, y: 69.059946442}
        // right_bottom: {x: 341.786631775, y: 125.485654449}
        // right_top: {x: 338.761408997, y: 54.393123436}
        // }
        // text: ""
        ocrResult.value = invokeRes.data.ocr_comm_res.items
      }
    },
  })
}

/**
 * 扫码
 */
const onScaneCode = () => {
  uni.showLoading({ mask: true })
  uni.scanCode({
    success: (res: any) => {
      console.log("res", res)
      if (res.errMsg.includes(":ok")) {
        goodsInfo.goodsBarCode = res.result
        getGoodInfoByCode()
      }
    },
    complete: () => {
      uni.hideLoading()
    },
  })
}

const onItemClick = (item: any) => {
  goodsInfo.goodsName += item.text
}

/**
 * 根据条码查询商品信息
 */
const getGoodInfoByCode = async () => {
  try {
    uni.showLoading({ mask: true })
    const { data } = await getCmsGoodInfo({ code: goodsInfo.goodsBarCode })
    console.log("data", data)
    if (Object.keys(data).length > 0) {
      // 已有商品
      goodsInfo = {
        ...data,
        // 默认数量
        goodsNum: 1,
      }
    }
    uni.hideLoading()
  } catch (error) {
    console.log("error")
  }
}

/**
 * 入库
 */
const onSave = async () => {
  try {
    uni.showLoading({ mask: true })
    await addCmsGoodsToStore({
      ...goodsInfo,
      warehouseId: currentStoreId.value,
    })
    uni.showToast({
      title: "入库成功",
      icon: "none",
    })
    resetPageInfo()
  } catch (error) {
    console.log("error", error)
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #fef9ec;
}

.goods-manage-page {
  padding: 0 10px;
  height: 100%;
  display: flex;
  flex-flow: column;
  .goods-img {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-content: center;
    height: 200px;
    border-radius: 20px;
    background-color: #f9be7c;
    margin-bottom: 10px;

    .upload-icon {
      width: 40px;
      height: 40px;
      margin: auto;
    }

    .goods-img-item {
      margin: auto;
    }
  }

  .ocr-result {
    display: flex;
    flex-wrap: wrap;

    .ocr-result-item {
      background-color: #d8d8d8;
      padding: 0 5px;
      border-radius: 10px;
      margin-bottom: 5px;
      margin-right: 5px;
    }
  }

  .goods-info {
    flex: 1;

    .uni-easyinput__content-input {
      text-align: right;
    }

    .uni-forms-item {
      border-bottom: 1px solid rgba(78, 80, 83, 0.1);
    }

    .scane-code {
      display: flex;
      align-items: center;

      .scane-code-btn {
        height: 35px;
        background-color: #6488e4;
        color: #fff;
        border-radius: 100px;
      }
      .tiaoxingma-icon {
        width: 35px;
        height: 35px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

  .footer {
    button {
      // height: 50px;
      background-color: #6488e4;
      color: #fff;
      border-radius: 100px;
    }
  }
}
</style>

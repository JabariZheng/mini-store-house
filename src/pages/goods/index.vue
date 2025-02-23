<!--
 * @Author: ZhengJie
 * @Date: 2025-02-23 03:21:25
 * @LastEditTime: 2025-02-24 01:37:47
 * @Description: 商品出入库
-->
<template>
  <div class="goods-manage-page">
    <div class="goods-img" @click="onChooseImg">
      <img
        v-if="!goodsInfo.img"
        class="upload-icon"
        src="/static/upload-icon.png"
        alt=""
      />
      <img
        v-else
        class="goods-img-item"
        mode="aspectFit"
        :src="goodsInfo.img"
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
        <uni-forms-item label="条码" name="code">
          <div class="scane-code">
            <uni-easyinput
              type="text"
              :styles="inputStyles"
              v-model="goodsInfo.code"
            />
            <img
              @click="onScaneCode"
              class="tiaoxingma-icon"
              src="/static/tiaoxingma.png"
              alt=""
            />
          </div>
        </uni-forms-item>
        <uni-forms-item label="名称" name="name">
          <uni-easyinput
            type="text"
            v-model="goodsInfo.name"
            :styles="inputStyles"
            placeholder="请输入名称"
          />
        </uni-forms-item>

        <uni-forms-item label="数量" name="num">
          <uni-easyinput
            type="number"
            :styles="inputStyles"
            v-model="goodsInfo.num"
            placeholder="请输入数量"
          />
        </uni-forms-item>
      </uni-forms>
    </div>
    <div class="footer" :style="{ marginBottom: safeAreaBottom }">
      <button>入库</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app"
import { reactive, ref } from "vue"

const FormRef = ref<any>({})

let goodsInfo = reactive({
  img: "",
  name: "",
  code: "",
  num: 1,
})
let safeAreaBottom = ref("0px")

const inputStyles = reactive({
  backgroundColor: "",
  borderColor: "transparent",
})

let ocrResult = ref<any>([])

onLoad((options) => {
  console.log("options", options)
  const { type, storeId } = options

  safeAreaBottom.value = uni.getWindowInfo().safeAreaInsets.bottom + "px"
})

const onChooseImg = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      console.log("res.tempFilePaths[0]", res.tempFilePaths[0])
      goodsInfo.img = res.tempFilePaths[0]

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

const onScaneCode = () => {
  uni.showLoading({ mask: true })
  uni.scanCode({
    success: (res) => {
      console.log("res", res)
      if (res.errMsg.includes(":ok")) {
        goodsInfo.code = res.result
      }
    },
    complete: () => {
      uni.hideLoading()
    },
  })
}

const onItemClick = (item: any) => {
  goodsInfo.name += item.text
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

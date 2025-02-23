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
        <div v-for="(item, index) in listData" :key="index" class="goods-item">
          <div class="goods-item-img">
            <img :src="item.img" mode="aspectFit" alt="" />
          </div>
          <div class="goods-item-info">
            <div class="goods-item-info-title">{{ item.name }}</div>
            <div class="goods-item-info-num">库存：{{ item.num }}</div>
            <div class="goods-item-info-date">
              更新时间：{{ item.updateDate }}
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

let searchValue = ref("")
let goodsData = ref([
  {
    id: 1,
    img: "https://img1.baidu.com/it/u=299351885,2499182433&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=543",
    name: "奶酪棒1",
    num: 10,
    updateDate: "2020-01-01",
  },
  {
    id: 1,
    img: "https://img1.baidu.com/it/u=299351885,2499182433&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=543",
    name: "奶酪棒2",
    num: 10,
    updateDate: "2020-01-01",
  },
  {
    id: 1,
    img: "https://img1.baidu.com/it/u=299351885,2499182433&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=543",
    name: "奶酪棒3",
    num: 10,
    updateDate: "2020-01-01",
  },
  {
    id: 1,
    img: "https://img1.baidu.com/it/u=299351885,2499182433&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=543",
    name: "奶酪棒4",
    num: 10,
    updateDate: "2020-01-01",
  },
  {
    id: 1,
    img: "https://img1.baidu.com/it/u=299351885,2499182433&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=543",
    name: "奶酪棒5",
    num: 10,
    updateDate: "2020-01-01",
  },
])

const listData = computed(() => {
  if (!searchValue.value) return goodsData.value
  return goodsData.value.filter((item) => item.name.includes(searchValue.value))
})
const onSearch = ({ value }) => {
  console.log("onSearch:", value)
  searchValue.value = value
}
const onClear = ({ value }) => {
  console.log("onClear:", value)
  searchValue.value = value
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
</style>

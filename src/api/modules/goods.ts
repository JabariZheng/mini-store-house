/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:19:30
 * @LastEditTime: 2025-03-04 18:01:16
 * @Description: 商品管理
 */
import { request } from "../request"
/**
 * 新增
 */
const addCmsGoods = (params: any) => {
  return request.post("/cms/goods/mini/add", params)
}
/**
 * 入库
 */
const addCmsGoodsToStore = (params: any) => {
  return request.post("/cms/goods/mini/toStore", params)
}
/**
 * 删除
 */
const delCmsGoods = (params: any) => {
  return request.delete("/cms/goods/mini/delete", params)
}
/**
 * 更新
 */
const updateCmsGoods = (params: any) => {
  return request.put("/cms/goods/mini/update", params)
}
/**
 * 更新
 */
const updateCmsGoodsStore = (params: any) => {
  return request.put("/cms/goods/mini/updateStore", params)
}
/**
 * 获取列表
 */
const getCmsGoodsList = (): Promise<any> => {
  return request.get("/cms/goods/mini/list")
}

/**
 * 获取详情
 */
const getCmsGoodInfo = (params: any): Promise<any> => {
  return request.get("/cms/goods/mini/info", params)
}

export {
  addCmsGoods,
  addCmsGoodsToStore,
  delCmsGoods,
  updateCmsGoods,
  updateCmsGoodsStore,
  getCmsGoodsList,
  getCmsGoodInfo,
}

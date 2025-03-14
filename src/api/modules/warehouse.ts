/*
 * @Author: ZhengJie
 * @Date: 2025-03-01 16:02:21
 * @LastEditTime: 2025-03-02 02:09:49
 * @Description: 仓库
 */
import { request } from "../request"
/**
 * 新增仓库
 */
const addCmsWarehouse = (params: any) => {
  return request.post("/cms/warehouse/mini/add", params)
}
/**
 * 删除仓库
 */
const delCmsWarehouse = (params: any) => {
  return request.delete("/cms/warehouse/mini/delete", params)
}
/**
 * 更新仓库
 */
const updateCmsWarehouse = (params: any) => {
  return request.put("/cms/warehouse/mini/update", params)
}
/**
 * 获取仓库列表
 */
const getCmsWarehouseList = (): Promise<any> => {
  return request.get("/cms/warehouse/mini/list")
}

export {
  addCmsWarehouse,
  delCmsWarehouse,
  updateCmsWarehouse,
  getCmsWarehouseList,
}

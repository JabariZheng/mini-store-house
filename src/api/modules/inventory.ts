/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:19:30
 * @LastEditTime: 2025-03-02 03:01:25
 * @Description: 库存管理
 */
import { request } from "../request"
/**
 * 更新
 */
const setCmsInventoryIn = (params: any) => {
  return request.put("/cms/inventory/mini/in", params)
}
/**
 * 更新
 */
const setCmsInventoryOut = (params: any) => {
  return request.put("/cms/inventory/mini/out", params)
}
export { setCmsInventoryIn, setCmsInventoryOut }

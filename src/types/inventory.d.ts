/*
 * @Author: ZhengJie
 * @Date: 2025-03-03 14:30:19
 * @LastEditTime: 2025-03-12 00:26:25
 * @Description: inventory.d
 */
import type { IGoodsItem } from "./goods"

export interface IInventoryItem {
  goodsId: string
  inventoryNumber: number
  warehouseId: string
  createBy: string
  createDate: string
  updateBy: string
  updateDate: string
}

declare interface IInventoryListItem extends IInventoryItem {
  [key: string]: any
  goods: IGoodsItem
}
import type { IInventoryItem } from "./inventory"

/*
 * @Author: ZhengJie
 * @Date: 2025-03-03 14:25:44
 * @LastEditTime: 2025-03-12 15:09:01
 * @Description: goods.d
 */
declare interface IGoodsItem {
  [key: string]: any
  id: string
  goodsName: string
  goodsBarCode: string
  goodsImg: string
  status: string
  createBy: string
  createDate: string
  updateBy: string
  updateDate: string
}

declare interface IGoodsListItem extends IGoodsItem {
  [key: string]: any
  inventory: IInventoryItem
}

export type { IGoodsItem, IGoodsListItem }

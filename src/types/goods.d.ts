import type { IInventoryItem } from "./inventory"

/*
 * @Author: ZhengJie
 * @Date: 2025-03-03 14:25:44
 * @LastEditTime: 2025-03-04 15:41:39
 * @Description: goods.d
 */
declare interface IGoodsItem {
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
  inventory: IInventoryItem
}

export type { IGoodsItem, IGoodsListItem }

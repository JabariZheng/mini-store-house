/*
 * @Author: ZhengJie
 * @Date: 2025-03-12 14:28:13
 * @LastEditTime: 2025-03-12 14:29:02
 * @Description: 图片上传
 */
import { request } from "../request"
/**
 * 获取ocr结果
 */
const getOcrResultByImgUrl = (params: any): Promise<any> => {
  return request.get("/sys/upload-images/img-ocr", params)
}

export { getOcrResultByImgUrl }

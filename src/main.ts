/*
 * @Author: ZhengJie
 * @Date: 2024-11-29 20:28:52
 * @LastEditTime: 2025-03-08 01:01:09
 * @Description: Main
 */
import { createSSRApp } from "vue"
import App from "./App.vue"
import * as Pinia from "pinia"
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia,
  }
}

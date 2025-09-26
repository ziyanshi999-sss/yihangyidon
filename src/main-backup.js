/**

* 应用入口文件
 */

import { createSSRApp } from "vue"
import App from "./App.vue"
import "./styles/theme.css"

// 创建应用实例
export function createApp() {
	const app = createSSRApp(App)

	// 全局错误处理
	app.config.errorHandler = (err, vm, info) => {
		console.error('Vue Error:', err)
		console.error('Error Info:', info)
	}

	// 全局属性
	app.config.globalProperties.$app = {
		version: '1.0.0',
		utils: {
			formatTime(date) {
				return new Date(date).toLocaleString()
			}
		}
	}

	return {
		app
	}
}
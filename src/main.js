/**
 * 医院问诊应用入口文件
 * @description 初始化Vue应用，配置全局设置和插件
 */

import { createSSRApp } from "vue"
import App from "./App.vue"
import themeManager from "./utils/simple-theme.js"
import "./styles/theme.css"

// 环境检测函数
function getEnvironment() {
	// 优先使用uni-app的环境变量
	if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
		const systemInfo = uni.getSystemInfoSync()
		// 根据平台判断环境
		if (systemInfo.platform === 'devtools') {
			return 'development'
		}
	}
	
	// 回退到process.env
	if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
		return process.env.NODE_ENV
	}
	
	// 默认返回development
	return 'development'
}

// 创建应用实例
export function createApp() {
	const app = createSSRApp(App)
	const currentEnv = getEnvironment()

	// 全局错误处理
	app.config.errorHandler = (err, vm, info) => {
		console.error('Vue Error:', err)
		console.error('Error Info:', info)

		// 错误上报
		reportError(err, info)

		// 显示用户友好的错误提示
		uni.showToast({
			title: '应用出现错误，请重试',
			icon: 'none',
			duration: 3000
		})
	}

	// 全局警告处理
	app.config.warnHandler = (msg, vm, trace) => {
		console.warn('Vue Warning:', msg)
		console.warn('Warning Trace:', trace)
	}

	// 全局属性
	app.config.globalProperties.$app = {
		// 主题管理器
		theme: themeManager,
		// 应用版本
		version: '1.0.0',

		// 环境信息
		env: currentEnv,

		// 平台信息
		platform: uni.getSystemInfoSync().platform,

		// 工具方法
		utils: {
			// 格式化时间
			formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
				const d = new Date(date)
				const year = d.getFullYear()
				const month = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				const hours = String(d.getHours()).padStart(2, '0')
				const minutes = String(d.getMinutes()).padStart(2, '0')
				const seconds = String(d.getSeconds()).padStart(2, '0')

				return format
					.replace('YYYY', year)
					.replace('MM', month)
					.replace('DD', day)
					.replace('HH', hours)
					.replace('mm', minutes)
					.replace('ss', seconds)
			},

			// 防抖函数
			debounce(func, wait) {
				let timeout
				return function executedFunction(...args) {
					const later = () => {
						clearTimeout(timeout)
						func(...args)
					}
					clearTimeout(timeout)
					timeout = setTimeout(later, wait)
				}
			},

			// 节流函数
			throttle(func, limit) {
				let inThrottle
				return function () {
					const args = arguments
					const context = this
					if (!inThrottle) {
						func.apply(context, args)
						inThrottle = true
						setTimeout(() => inThrottle = false, limit)
					}
				}
			},

			// 深拷贝
			deepClone(obj) {
				if (obj === null || typeof obj !== 'object') return obj
				if (obj instanceof Date) return new Date(obj.getTime())
				if (obj instanceof Array) return obj.map(item => this.deepClone(item))
				if (typeof obj === 'object') {
					const clonedObj = {}
					for (const key in obj) {
						if (obj.hasOwnProperty(key)) {
							clonedObj[key] = this.deepClone(obj[key])
						}
					}
					return clonedObj
				}
			},

			// 生成唯一ID
			generateId() {
				return Date.now().toString(36) + Math.random().toString(36).substr(2)
			},

			// 验证手机号
			validatePhone(phone) {
				const phoneRegex = /^1[3-9]\d{9}$/
				return phoneRegex.test(phone)
			},

			// 验证邮箱
			validateEmail(email) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				return emailRegex.test(email)
			},

			// 验证身份证号
			validateIdCard(idCard) {
				const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				return idCardRegex.test(idCard)
			}
		},

		// 网络请求封装
		request: {
			// 基础配置
			baseURL: currentEnv === 'development'
				? 'http://localhost:3000/api'
				: 'https://api.hospital.com',

			// 请求拦截器
			beforeRequest(config) {
				// 添加token
				const token = uni.getStorageSync('token')
				if (token) {
					config.header = {
						...config.header,
						'Authorization': `Bearer ${token}`
					}
				}

				// 添加时间戳
				config.url += (config.url.includes('?') ? '&' : '?') + `_t=${Date.now()}`

				console.log('Request:', config)
				return config
			},

			// 响应拦截器
			afterResponse(response) {
				console.log('Response:', response)

				// 处理token过期
				if (response.statusCode === 401) {
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/denglu/login'
						})
					}, 1500)
					return Promise.reject(response)
				}

				return response
			},

			// 发起请求
			async request(options) {
				const config = this.beforeRequest(options)

				try {
					const response = await new Promise((resolve, reject) => {
						uni.request({
							...config,
							success: resolve,
							fail: reject
						})
					})

					return this.afterResponse(response)
				} catch (error) {
					console.error('Request Error:', error)

					// 网络错误处理
					if (error.errMsg && error.errMsg.includes('request:fail')) {
						uni.showToast({
							title: '网络连接失败，请检查网络设置',
							icon: 'none'
						})
					}

					return Promise.reject(error)
				}
			},

			// GET请求
			get(url, params = {}) {
				return this.request({
					url,
					method: 'GET',
					data: params
				})
			},

			// POST请求
			post(url, data = {}) {
				return this.request({
					url,
					method: 'POST',
					data
				})
			},

			// PUT请求
			put(url, data = {}) {
				return this.request({
					url,
					method: 'PUT',
					data
				})
			},

			// DELETE请求
			delete(url) {
				return this.request({
					url,
					method: 'DELETE'
				})
			}
		},

		// 存储管理
		storage: {
			// 设置存储
			set(key, value, expire = null) {
				const data = {
					value,
					timestamp: Date.now()
				}

				if (expire) {
					data.expire = expire
				}

				try {
					uni.setStorageSync(key, JSON.stringify(data))
				} catch (error) {
					console.error('Storage Set Error:', error)
				}
			},

			// 获取存储
			get(key, defaultValue = null) {
				try {
					const data = uni.getStorageSync(key)
					if (!data) return defaultValue

					const parsed = JSON.parse(data)

					// 检查是否过期
					if (parsed.expire && Date.now() - parsed.timestamp > parsed.expire) {
						this.remove(key)
						return defaultValue
					}

					return parsed.value
				} catch (error) {
					console.error('Storage Get Error:', error)
					return defaultValue
				}
			},

			// 删除存储
			remove(key) {
				try {
					uni.removeStorageSync(key)
				} catch (error) {
					console.error('Storage Remove Error:', error)
				}
			},

			// 清空存储
			clear() {
				try {
					uni.clearStorageSync()
				} catch (error) {
					console.error('Storage Clear Error:', error)
				}
			}
		}
	}

	// 全局混入
	app.mixin({
		// 页面生命周期
		onLoad(options) {
			console.log('Page Load:', this.$options.name, options)

			// 页面性能监控
			this.pageStartTime = Date.now()
		},

		onShow() {
			console.log('Page Show:', this.$options.name)
		},

		onHide() {
			console.log('Page Hide:', this.$options.name)

			// 页面停留时间统计
			if (this.pageStartTime) {
				const duration = Date.now() - this.pageStartTime
				console.log('Page Duration:', this.$options.name, duration + 'ms')
			}
		},

		onUnload() {
			console.log('Page Unload:', this.$options.name)
		},

		// 错误处理
		onError(error) {
			console.error('Page Error:', this.$options.name, error)
			reportError(error, `Page: ${this.$options.name}`)
		}
	})

	return {
		app
	}
}

/**
 * 错误上报函数
 * @param {Error} error 错误对象
 * @param {string} info 错误信息
 */
function reportError(error, info = '') {
	// 这里可以集成错误上报服务，如Sentry、Bugsnag等
	const errorData = {
		message: error.message || error,
		stack: error.stack,
		info,
		timestamp: new Date().toISOString(),
		userAgent: uni.getSystemInfoSync(),
		url: getCurrentPages().pop()?.route || 'unknown'
	}

	console.error('Error Report:', errorData)

	// 发送错误报告到服务器
	// uni.request({
	//   url: 'https://api.hospital.com/error-report',
	//   method: 'POST',
	//   data: errorData
	// })
}

// 全局异常处理
if (typeof window !== 'undefined') {
	window.addEventListener('error', (event) => {
		console.error('Global Error:', event.error)
		reportError(event.error, 'Global Error')
	})

	window.addEventListener('unhandledrejection', (event) => {
		console.error('Unhandled Promise Rejection:', event.reason)
		reportError(event.reason, 'Unhandled Promise Rejection')
	})
}

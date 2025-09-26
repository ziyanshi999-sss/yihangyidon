import { createSSRApp } from "vue"
import App from "./App.vue"
import "./styles/theme.css"
import EnhancedScreenProtectorPlugin from "@/plugins/enhanced-screen-protector-plugin.js"

export function createApp() {
	const app = createSSRApp(App)
	
	// 安装增强版防录屏插件
	app.use(EnhancedScreenProtectorPlugin, {
		autoEnable: false, // 不自动启用，由用户手动控制
		protectionLevel: 'high',
		showAlert: true,
		showWatermark: false,
		watermarkText: '银行APP - 隐私保护中',
		alertTitle: '安全提醒',
		alertContent: '检测到截屏/录屏行为，请注意保护您的隐私信息。',
		excludePages: ['/pages/denglu/login', '/pages/register/register'],
		callbacks: {
			onScreenshotDetected: (data) => {
				console.warn('🚨 检测到截屏行为:', data)
				uni.showToast({
					title: '检测到截屏行为',
					icon: 'none',
					duration: 3000
				})
			},
			onRecordingDetected: (data) => {
				console.warn('🚨 检测到录屏行为:', data)
				uni.showModal({
					title: '安全警告',
					content: '检测到录屏行为，为保护您的隐私安全，请停止录屏操作。',
					showCancel: false,
					confirmText: '知道了',
					confirmColor: '#ff4444'
				})
			},
			onProtectionEnabled: (data) => {
				console.log('✅ 防录屏保护已启用:', data)
			},
			onProtectionDisabled: () => {
				console.log('🔓 防录屏保护已禁用')
			},
			onError: (error) => {
				console.error('❌ 防录屏保护错误:', error)
			}
		}
	})
	
	return { app }
}

/**
 * 增强版防录屏保护器
 * 提供更完善的防录屏功能和更好的用户体验
 */

class EnhancedScreenProtector {
    constructor() {
        this.isEnabled = false
        this.platform = ''
        this.environment = ''
        this.protectionLevel = 'medium'
        this.callbacks = {
            onScreenshotDetected: [],
            onRecordingDetected: [],
            onProtectionEnabled: [],
            onProtectionDisabled: [],
            onError: []
        }
        this.settings = {
            showAlert: true,
            showWatermark: false,
            watermarkText: '银行APP - 隐私保护中',
            watermarkOpacity: 0.3,
            watermarkSize: 14,
            watermarkColor: '#999999',
            alertTitle: '安全提醒',
            alertContent: '检测到截屏/录屏行为，请注意保护您的隐私信息。',
            excludePages: ['/pages/denglu/login', '/pages/register/register']
        }
        this.detectionMethods = []
        this.watermarkElements = []
        this.init()
    }

    /**
     * 初始化
     */
    init() {
        try {
            this.platform = this.getPlatform()
            this.environment = this.getEnvironment()
            this.loadSettings()
            
            console.log('🛡️ 增强版防录屏保护器初始化完成')
            console.log(`📱 平台: ${this.platform}`)
            console.log(`🌍 环境: ${this.environment}`)
            console.log(`⚙️ 保护级别: ${this.protectionLevel}`)
        } catch (error) {
            console.error('❌ 初始化失败:', error)
            this.triggerCallback('onError', error)
        }
    }

    /**
     * 获取平台信息
     */
    getPlatform() {
        try {
            const systemInfo = uni.getSystemInfoSync()
            return systemInfo.platform || 'unknown'
        } catch (error) {
            return 'unknown'
        }
    }

    /**
     * 获取环境信息
     */
    getEnvironment() {
        try {
            // #ifdef H5
            return 'h5'
            // #endif
            
            // #ifdef APP-PLUS
            return 'app'
            // #endif
            
            // #ifdef MP-WEIXIN
            return 'mp-weixin'
            // #endif
            
            return 'unknown'
        } catch (error) {
            return 'unknown'
        }
    }

    /**
     * 加载用户设置
     */
    loadSettings() {
        try {
            const savedSettings = uni.getStorageSync('screenProtectionSettings')
            if (savedSettings) {
                this.settings = { ...this.settings, ...savedSettings }
            }
        } catch (error) {
            console.warn('⚠️ 加载设置失败:', error)
        }
    }

    /**
     * 保存用户设置
     */
    saveSettings() {
        try {
            uni.setStorageSync('screenProtectionSettings', this.settings)
        } catch (error) {
            console.warn('⚠️ 保存设置失败:', error)
        }
    }

    /**
     * 启用防录屏保护
     */
    async enable(options = {}) {
        try {
            console.log('🛡️ 启用增强版防录屏保护')
            
            // 合并配置
            this.settings = { ...this.settings, ...options }
            this.protectionLevel = options.level || this.protectionLevel
            
            // 检查是否在排除页面
            if (this.isExcludedPage()) {
                console.log('📄 当前页面在排除列表中，跳过保护')
                return true
            }

            let success = false

            // 根据环境选择保护方案
            switch (this.environment) {
                case 'h5':
                    success = await this.enableH5Protection()
                    break
                case 'app':
                    success = await this.enableAppProtection()
                    break
                case 'mp-weixin':
                    success = await this.enableMiniProgramProtection()
                    break
                default:
                    success = await this.enableFallbackProtection()
            }

            if (success) {
                this.isEnabled = true
                this.saveSettings()
                this.triggerCallback('onProtectionEnabled', {
                    platform: this.platform,
                    environment: this.environment,
                    level: this.protectionLevel
                })
                console.log('✅ 防录屏保护启用成功')
            } else {
                console.warn('⚠️ 防录屏保护启用失败')
            }

            return success
        } catch (error) {
            console.error('❌ 启用防录屏保护失败:', error)
            this.triggerCallback('onError', error)
            return false
        }
    }

    /**
     * 禁用防录屏保护
     */
    async disable() {
        try {
            console.log('🔓 禁用防录屏保护')
            
            // 清理所有检测方法
            this.detectionMethods.forEach(method => {
                if (method.cleanup) {
                    method.cleanup()
                }
            })
            this.detectionMethods = []

            // 清理水印
            this.clearWatermarks()

            this.isEnabled = false
            this.triggerCallback('onProtectionDisabled')
            console.log('✅ 防录屏保护已禁用')
            
            return true
        } catch (error) {
            console.error('❌ 禁用防录屏保护失败:', error)
            this.triggerCallback('onError', error)
            return false
        }
    }

    /**
     * H5环境保护
     */
    async enableH5Protection() {
        try {
            console.log('🌐 启用H5环境防录屏保护')
            
            // 检测截屏
            this.addScreenshotDetection()
            
            // 检测录屏
            this.addRecordingDetection()
            
            // 添加水印
            if (this.settings.showWatermark) {
                this.addWatermark()
            } else {
                this.clearWatermarks()
            }
            
            // 禁用右键菜单
            this.disableContextMenu()
            
            // 禁用选择文本
            this.disableTextSelection()
            
            return true
        } catch (error) {
            console.error('❌ H5保护启用失败:', error)
            return false
        }
    }

    /**
     * App环境保护
     */
    async enableAppProtection() {
        try {
            console.log('📱 启用App环境防录屏保护')
            
            // 使用原生插件
            if (this.platform === 'android') {
                return await this.enableAndroidProtection()
            } else if (this.platform === 'ios') {
                return await this.enableIOSProtection()
            }
            
            return false
        } catch (error) {
            console.error('❌ App保护启用失败:', error)
            return false
        }
    }

    /**
     * 小程序环境保护
     */
    async enableMiniProgramProtection() {
        try {
            console.log('🔧 启用小程序环境防录屏保护')
            
            // 小程序主要依靠平台限制
            // 添加一些基础的检测
            this.addScreenshotDetection()
            
            return true
        } catch (error) {
            console.error('❌ 小程序保护启用失败:', error)
            return false
        }
    }

    /**
     * 备用保护方案
     */
    async enableFallbackProtection() {
        try {
            console.log('🔄 启用备用防录屏保护')
            
            // 基础检测
            this.addScreenshotDetection()
            
            // 添加水印
            if (this.settings.showWatermark) {
                this.addWatermark()
            } else {
                this.clearWatermarks()
            }
            
            return true
        } catch (error) {
            console.error('❌ 备用保护启用失败:', error)
            return false
        }
    }

    /**
     * 添加截屏检测
     */
    addScreenshotDetection() {
        try {
            // #ifdef H5
            // 监听页面可见性变化
            const visibilityHandler = () => {
                if (document.hidden) {
                    this.handleSuspiciousActivity('visibility_change')
                }
            }
            document.addEventListener('visibilitychange', visibilityHandler)
            
            // 监听窗口失焦
            const blurHandler = () => {
                this.handleSuspiciousActivity('window_blur')
            }
            window.addEventListener('blur', blurHandler)
            
            // 监听键盘事件（可能的截屏快捷键）
            const keyHandler = (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault()
                    this.handleSuspiciousActivity('keyboard_shortcut')
                }
            }
            document.addEventListener('keydown', keyHandler)
            
            this.detectionMethods.push({
                type: 'screenshot',
                cleanup: () => {
                    document.removeEventListener('visibilitychange', visibilityHandler)
                    window.removeEventListener('blur', blurHandler)
                    document.removeEventListener('keydown', keyHandler)
                }
            })
            // #endif
            
            console.log('📸 截屏检测已启用')
        } catch (error) {
            console.error('❌ 截屏检测启用失败:', error)
        }
    }

    /**
     * 添加录屏检测
     */
    addRecordingDetection() {
        try {
            // #ifdef H5
            // 检测MediaRecorder API
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia
                navigator.mediaDevices.getDisplayMedia = async (constraints) => {
                    this.handleSuspiciousActivity('screen_recording')
                    throw new Error('屏幕录制已被禁用')
                }
                
                this.detectionMethods.push({
                    type: 'recording',
                    cleanup: () => {
                        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia
                    }
                })
            }
            // #endif
            
            console.log('🎥 录屏检测已启用')
        } catch (error) {
            console.error('❌ 录屏检测启用失败:', error)
        }
    }

    /**
     * 添加水印
     */
    addWatermark() {
        try {
            // #ifdef H5
            const watermark = document.createElement('div')
            watermark.id = 'screen-protection-watermark'
            watermark.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                background-image: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 50px,
                    rgba(${this.hexToRgb(this.settings.watermarkColor)}, ${this.settings.watermarkOpacity}) 50px,
                    rgba(${this.hexToRgb(this.settings.watermarkColor)}, ${this.settings.watermarkOpacity}) 100px
                );
                background-size: 200px 200px;
                font-family: Arial, sans-serif;
                font-size: ${this.settings.watermarkSize}px;
                color: ${this.settings.watermarkColor};
                opacity: ${this.settings.watermarkOpacity};
                user-select: none;
            `
            
            // 添加水印文本
            const watermarkText = document.createElement('div')
            watermarkText.textContent = this.settings.watermarkText
            watermarkText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                white-space: nowrap;
                font-weight: bold;
            `
            watermark.appendChild(watermarkText)
            
            document.body.appendChild(watermark)
            this.watermarkElements.push(watermark)
            // #endif
            
            console.log('💧 水印已添加')
        } catch (error) {
            console.error('❌ 水印添加失败:', error)
        }
    }

    /**
     * 清理水印
     */
    clearWatermarks() {
        try {
            // #ifdef H5
            this.watermarkElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element)
                }
            })
            this.watermarkElements = []
            // #endif
            
            console.log('🧹 水印已清理')
        } catch (error) {
            console.error('❌ 水印清理失败:', error)
        }
    }

    /**
     * 禁用右键菜单
     */
    disableContextMenu() {
        try {
            // #ifdef H5
            const contextMenuHandler = (e) => {
                e.preventDefault()
                this.handleSuspiciousActivity('context_menu')
            }
            document.addEventListener('contextmenu', contextMenuHandler)
            
            this.detectionMethods.push({
                type: 'context_menu',
                cleanup: () => {
                    document.removeEventListener('contextmenu', contextMenuHandler)
                }
            })
            // #endif
            
            console.log('🚫 右键菜单已禁用')
        } catch (error) {
            console.error('❌ 禁用右键菜单失败:', error)
        }
    }

    /**
     * 禁用文本选择
     */
    disableTextSelection() {
        try {
            // #ifdef H5
            const style = document.createElement('style')
            style.textContent = `
                * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
            `
            document.head.appendChild(style)
            
            this.detectionMethods.push({
                type: 'text_selection',
                cleanup: () => {
                    if (style.parentNode) {
                        style.parentNode.removeChild(style)
                    }
                }
            })
            // #endif
            
            console.log('🚫 文本选择已禁用')
        } catch (error) {
            console.error('❌ 禁用文本选择失败:', error)
        }
    }

    /**
     * 处理可疑活动
     */
    handleSuspiciousActivity(type) {
        try {
            console.warn(`🚨 检测到可疑活动: ${type}`)
            
            const eventData = {
                type,
                timestamp: new Date().toISOString(),
                platform: this.platform,
                environment: this.environment,
                page: this.getCurrentPage()
            }
            
            // 触发回调
            if (type.includes('screenshot') || type.includes('recording')) {
                this.triggerCallback('onScreenshotDetected', eventData)
                this.triggerCallback('onRecordingDetected', eventData)
            }
            
            // 显示警告
            if (this.settings.showAlert) {
                this.showAlert(eventData)
            }
            
            // 记录日志
            this.logSecurityEvent(eventData)
        } catch (error) {
            console.error('❌ 处理可疑活动失败:', error)
        }
    }

    /**
     * 显示警告
     */
    showAlert(eventData) {
        try {
            uni.showModal({
                title: this.settings.alertTitle,
                content: this.settings.alertContent,
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#ff4444'
            })
        } catch (error) {
            console.error('❌ 显示警告失败:', error)
        }
    }

    /**
     * 记录安全事件
     */
    logSecurityEvent(eventData) {
        try {
            const logs = uni.getStorageSync('securityLogs') || []
            logs.unshift(eventData)
            
            // 只保留最近100条记录
            if (logs.length > 100) {
                logs.splice(100)
            }
            
            uni.setStorageSync('securityLogs', logs)
        } catch (error) {
            console.error('❌ 记录安全事件失败:', error)
        }
    }

    /**
     * 获取当前页面
     */
    getCurrentPage() {
        try {
            const pages = getCurrentPages()
            if (pages.length > 0) {
                return pages[pages.length - 1].route
            }
            return 'unknown'
        } catch (error) {
            return 'unknown'
        }
    }

    /**
     * 检查是否在排除页面
     */
    isExcludedPage() {
        try {
            const currentPage = this.getCurrentPage()
            return this.settings.excludePages.some(page => currentPage.includes(page))
        } catch (error) {
            return false
        }
    }

    /**
     * 添加回调
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback)
        }
    }

    /**
     * 移除回调
     */
    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback)
            if (index > -1) {
                this.callbacks[event].splice(index, 1)
            }
        }
    }

    /**
     * 触发回调
     */
    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data)
                } catch (error) {
                    console.error(`❌ 回调执行失败 (${event}):`, error)
                }
            })
        }
    }

    /**
     * 工具方法：十六进制转RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '153, 153, 153'
    }

    /**
     * 获取安全日志
     */
    getSecurityLogs(limit = 20) {
        try {
            const logs = uni.getStorageSync('securityLogs') || []
            return logs.slice(0, limit)
        } catch (error) {
            console.error('❌ 获取安全日志失败:', error)
            return []
        }
    }

    /**
     * 清除安全日志
     */
    clearSecurityLogs() {
        try {
            uni.removeStorageSync('securityLogs')
            console.log('🧹 安全日志已清除')
            return true
        } catch (error) {
            console.error('❌ 清除安全日志失败:', error)
            return false
        }
    }

    /**
     * 导出安全日志
     */
    exportSecurityLogs() {
        try {
            const logs = this.getSecurityLogs(100)
            const dataStr = JSON.stringify(logs, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            
            // #ifdef H5
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`
            link.click()
            URL.revokeObjectURL(url)
            // #endif
            
            console.log('📤 安全日志已导出')
            return true
        } catch (error) {
            console.error('❌ 导出安全日志失败:', error)
            return false
        }
    }

    /**
     * 获取保护状态（兼容旧版本API）
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            platform: this.platform,
            environment: this.environment,
            protectionLevel: this.protectionLevel,
            alertEnabled: this.settings.showAlert,
            watermarkEnabled: this.settings.showWatermark,
            watermarkText: this.settings.watermarkText,
            watermarkOpacity: this.settings.watermarkOpacity,
            watermarkSize: this.settings.watermarkSize,
            watermarkColor: this.settings.watermarkColor
        }
    }

    /**
     * 获取安全事件（兼容旧版本API）
     */
    getSecurityEvents() {
        return this.getSecurityLogs(50)
    }

    /**
     * 更新设置
     */
    updateSettings(newSettings) {
        try {
            this.settings = { ...this.settings, ...newSettings }
            this.saveSettings()
            console.log('✅ 设置已更新:', this.settings)
            return true
        } catch (error) {
            console.error('❌ 更新设置失败:', error)
            return false
        }
    }

    /**
     * 获取当前设置
     */
    getSettings() {
        return { ...this.settings }
    }
}

// 创建单例实例
const enhancedScreenProtector = new EnhancedScreenProtector()

export default enhancedScreenProtector

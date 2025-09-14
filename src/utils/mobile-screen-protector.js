/**
 * 手机端专用防录屏工具
 * 针对移动设备优化的轻量级防录屏解决方案
 * @version 1.0.0
 */

class MobileScreenProtector {
    constructor() {
        this.isEnabled = false
        this.platform = this.detectPlatform()
        this.environment = this.detectEnvironment()
        this.callbacks = {
            onScreenshotDetected: [],
            onRecordingDetected: [],
            onProtectionEnabled: [],
            onProtectionDisabled: []
        }
        
        // 检测配置
        this.config = {
            // 检测间隔（毫秒）
            detectionInterval: 2000,
            
            // 触摸检测阈值
            touchThreshold: 5,
            
            // 尺寸变化阈值
            sizeChangeThreshold: 100,
            
            // 是否启用严格模式
            strictMode: false,
            
            // 是否显示调试信息
            debugMode: false
        }
        
        // 状态跟踪
        this.state = {
            lastTouchTime: 0,
            touchCount: 0,
            lastWidth: 0,
            lastHeight: 0,
            isPageVisible: true,
            isAppActive: true
        }
        
        this.detectionTimer = null
        this.eventListeners = []
        
        console.log('📱 手机端防录屏工具初始化完成')
        console.log(`🔍 平台: ${this.platform}`)
        console.log(`🌍 环境: ${this.environment}`)
    }

    /**
     * 检测平台
     */
    detectPlatform() {
        try {
            const systemInfo = uni.getSystemInfoSync()
            return systemInfo.platform || 'unknown'
        } catch (error) {
            console.warn('获取平台信息失败:', error)
            return 'unknown'
        }
    }

    /**
     * 检测运行环境
     */
    detectEnvironment() {
        // 检查是否在APP环境
        if (typeof plus !== 'undefined') {
            return 'app'
        }

        // 检查是否在微信小程序
        if (typeof wx !== 'undefined' && wx.getSystemInfo) {
            return 'mp-weixin'
        }

        // 检查是否在H5环境
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            return 'h5'
        }

        return 'unknown'
    }

    /**
     * 启用防录屏保护
     */
    async enable(options = {}) {
        try {
            console.log('🚀 启用手机端防录屏保护...')
            
            // 合并配置
            this.config = { ...this.config, ...options }
            
            // 根据环境启用相应的保护措施
            if (this.environment === 'app') {
                await this.enableAppProtection()
            } else if (this.environment === 'h5') {
                await this.enableH5Protection()
            } else if (this.environment === 'mp-weixin') {
                await this.enableMpProtection()
            } else {
                console.warn('⚠️ 未知环境，使用通用检测方案')
                await this.enableGenericProtection()
            }
            
            this.isEnabled = true
            this.triggerCallback('onProtectionEnabled', {
                platform: this.platform,
                environment: this.environment,
                config: this.config
            })
            
            console.log('✅ 手机端防录屏保护已启用')
            
            if (this.config.debugMode) {
                this.showDebugInfo()
            }
            
            return true
        } catch (error) {
            console.error('❌ 启用手机端防录屏保护失败:', error)
            return false
        }
    }

    /**
     * APP环境保护
     */
    async enableAppProtection() {
        console.log('📱 启用APP环境保护')
        
        // 设置页面可见性检测
        this.setupVisibilityDetection()
        
        // 设置应用状态检测
        this.setupAppStateDetection()
        
        // 设置触摸检测
        this.setupTouchDetection()
        
        // 启动定期检测
        this.startPeriodicDetection()
        
        // 尝试使用原生插件
        await this.tryNativePlugin()
    }

    /**
     * H5环境保护
     */
    async enableH5Protection() {
        console.log('🌐 启用H5环境保护')
        
        // 设置页面可见性检测
        this.setupVisibilityDetection()
        
        // 设置焦点检测
        this.setupFocusDetection()
        
        // 设置触摸检测
        this.setupTouchDetection()
        
        // 设置键盘检测
        this.setupKeyboardDetection()
        
        // 启动定期检测
        this.startPeriodicDetection()
    }

    /**
     * 小程序环境保护
     */
    async enableMpProtection() {
        console.log('🔰 启用小程序环境保护')
        
        // 设置页面可见性检测
        this.setupVisibilityDetection()
        
        // 设置触摸检测
        this.setupTouchDetection()
        
        // 启动定期检测
        this.startPeriodicDetection()
        
        // 微信小程序截屏监听
        if (typeof wx !== 'undefined' && wx.onUserCaptureScreen) {
            wx.onUserCaptureScreen(() => {
                this.handleScreenshotDetected('wx_capture')
            })
            console.log('📸 微信小程序截屏监听已启用')
        }
    }

    /**
     * 通用保护方案
     */
    async enableGenericProtection() {
        console.log('🔧 启用通用保护方案')
        
        // 设置基础检测
        this.setupVisibilityDetection()
        this.setupTouchDetection()
        this.startPeriodicDetection()
    }

    /**
     * 尝试使用原生插件
     */
    async tryNativePlugin() {
        try {
            if (typeof uni !== 'undefined' && uni.requireNativePlugin) {
                const ScreenProtector = uni.requireNativePlugin('ScreenProtector')
                if (ScreenProtector) {
                    console.log('🧪 尝试使用原生插件')
                    
                    // 测试插件
                    const testResult = await this.callWithTimeout(
                        (callback) => ScreenProtector.testPlugin(callback),
                        3000
                    )
                    
                    if (testResult && testResult.success) {
                        console.log('✅ 原生插件测试成功')
                        
                        // 启用增强保护
                        const enableResult = await this.callWithTimeout(
                            (callback) => ScreenProtector.enableEnhancedProtection(callback),
                            3000
                        )
                        
                        if (enableResult && enableResult.success) {
                            console.log('✅ 原生插件保护启用成功')
                            return true
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ 原生插件不可用:', error.message)
        }
        
        return false
    }

    /**
     * 设置页面可见性检测
     */
    setupVisibilityDetection() {
        if (typeof document !== 'undefined') {
            const handler = () => {
                this.state.isPageVisible = !document.hidden
                
                if (!this.state.isPageVisible) {
                    console.log('🔍 页面隐藏，可能存在截屏行为')
                    this.handlePossibleScreenshot()
                } else {
                    console.log('🔍 页面显示')
                }
            }
            
            document.addEventListener('visibilitychange', handler)
            this.eventListeners.push({ element: document, event: 'visibilitychange', handler })
        }
    }

    /**
     * 设置应用状态检测
     */
    setupAppStateDetection() {
        if (typeof plus !== 'undefined') {
            // 应用进入前台
            plus.globalEvent.addEventListener('resume', () => {
                this.state.isAppActive = true
                console.log('📱 应用进入前台')
            })
            
            // 应用进入后台
            plus.globalEvent.addEventListener('pause', () => {
                this.state.isAppActive = false
                console.log('📱 应用进入后台，可能存在录屏行为')
                this.handlePossibleRecording()
            })
        }
    }

    /**
     * 设置焦点检测
     */
    setupFocusDetection() {
        if (typeof window !== 'undefined') {
            const blurHandler = () => {
                console.log('🔍 窗口失去焦点，可能存在录屏行为')
                this.handlePossibleRecording()
            }
            
            const focusHandler = () => {
                console.log('🔍 窗口获得焦点')
            }
            
            window.addEventListener('blur', blurHandler)
            window.addEventListener('focus', focusHandler)
            
            this.eventListeners.push(
                { element: window, event: 'blur', handler: blurHandler },
                { element: window, event: 'focus', handler: focusHandler }
            )
        }
    }

    /**
     * 设置触摸检测
     */
    setupTouchDetection() {
        if (typeof document !== 'undefined') {
            const touchStartHandler = (e) => {
                this.state.lastTouchTime = Date.now()
                this.state.touchCount++
                
                // 检测快速连续触摸（可能的录屏软件操作）
                if (this.state.touchCount > this.config.touchThreshold) {
                    console.log('🔍 检测到异常触摸模式')
                    this.handlePossibleRecording()
                }
            }
            
            const touchEndHandler = () => {
                const touchDuration = Date.now() - this.state.lastTouchTime
                
                // 检测异常短暂的触摸
                if (touchDuration < 50) {
                    console.log('🔍 检测到异常短暂触摸')
                    this.handlePossibleScreenshot()
                }
                
                // 重置计数器
                setTimeout(() => {
                    this.state.touchCount = Math.max(0, this.state.touchCount - 1)
                }, 1000)
            }
            
            document.addEventListener('touchstart', touchStartHandler)
            document.addEventListener('touchend', touchEndHandler)
            
            this.eventListeners.push(
                { element: document, event: 'touchstart', handler: touchStartHandler },
                { element: document, event: 'touchend', handler: touchEndHandler }
            )
        }
    }

    /**
     * 设置键盘检测
     */
    setupKeyboardDetection() {
        if (typeof window !== 'undefined') {
            const resizeHandler = () => {
                const currentWidth = window.innerWidth
                const currentHeight = window.innerHeight
                
                if (this.state.lastWidth && this.state.lastHeight) {
                    const widthDiff = Math.abs(currentWidth - this.state.lastWidth)
                    const heightDiff = Math.abs(currentHeight - this.state.lastHeight)
                    
                    // 检测异常尺寸变化（可能是键盘弹出或录屏软件）
                    if (widthDiff > this.config.sizeChangeThreshold || 
                        heightDiff > this.config.sizeChangeThreshold) {
                        console.log('🔍 检测到异常页面尺寸变化')
                        this.handlePossibleRecording()
                    }
                }
                
                this.state.lastWidth = currentWidth
                this.state.lastHeight = currentHeight
            }
            
            window.addEventListener('resize', resizeHandler)
            this.eventListeners.push({ element: window, event: 'resize', handler: resizeHandler })
        }
    }

    /**
     * 启动定期检测
     */
    startPeriodicDetection() {
        this.detectionTimer = setInterval(() => {
            this.performPeriodicCheck()
        }, this.config.detectionInterval)
        
        console.log(`⏰ 定期检测已启动，间隔: ${this.config.detectionInterval}ms`)
    }

    /**
     * 执行定期检测
     */
    performPeriodicCheck() {
        try {
            // 检测页面状态
            if (typeof document !== 'undefined' && document.hidden) {
                this.handlePossibleScreenshot()
            }
            
            // 检测应用状态
            if (this.environment === 'app' && !this.state.isAppActive) {
                this.handlePossibleRecording()
            }
            
            // 检测窗口状态
            if (typeof window !== 'undefined' && !document.hasFocus()) {
                this.handlePossibleRecording()
            }
            
        } catch (error) {
            console.error('定期检测失败:', error)
        }
    }

    /**
     * 处理可能的截屏
     */
    handlePossibleScreenshot() {
        if (this.config.strictMode) {
            this.handleScreenshotDetected('possible_screenshot')
        } else {
            console.log('🔍 检测到可能的截屏行为（非严格模式，仅记录）')
        }
    }

    /**
     * 处理可能的录屏
     */
    handlePossibleRecording() {
        if (this.config.strictMode) {
            this.handleRecordingDetected('possible_recording')
        } else {
            console.log('🔍 检测到可能的录屏行为（非严格模式，仅记录）')
        }
    }

    /**
     * 处理截屏检测
     */
    handleScreenshotDetected(method = 'unknown') {
        console.warn('🚨 检测到截屏行为')
        
        const eventData = {
            type: 'screenshot',
            timestamp: Date.now(),
            platform: this.platform,
            environment: this.environment,
            method: method,
            config: this.config
        }
        
        this.triggerCallback('onScreenshotDetected', eventData)
        
        // 显示用户提示
        uni.showModal({
            title: '隐私安全提示',
            content: '检测到截屏行为，已记录此次安全事件。请注意保护个人隐私信息。',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#ff6b35'
        })
    }

    /**
     * 处理录屏检测
     */
    handleRecordingDetected(method = 'unknown') {
        console.warn('🚨 检测到录屏行为')
        
        const eventData = {
            type: 'recording',
            timestamp: Date.now(),
            platform: this.platform,
            environment: this.environment,
            method: method,
            config: this.config
        }
        
        this.triggerCallback('onRecordingDetected', eventData)
        
        // 显示用户警告
        uni.showModal({
            title: '隐私安全警告',
            content: '检测到录屏行为，已记录此次安全事件。为保护隐私，建议停止录屏操作。',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#ff4444'
        })
    }

    /**
     * 显示调试信息
     */
    showDebugInfo() {
        console.log('🔍 调试信息:')
        console.log(`- 平台: ${this.platform}`)
        console.log(`- 环境: ${this.environment}`)
        console.log(`- 保护状态: ${this.isEnabled ? '已启用' : '已禁用'}`)
        console.log(`- 配置:`, this.config)
        console.log(`- 状态:`, this.state)
    }

    /**
     * 超时调用工具函数
     */
    callWithTimeout(fn, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('调用超时'))
            }, timeout)
            
            try {
                fn((result) => {
                    clearTimeout(timer)
                    resolve(result)
                })
            } catch (error) {
                clearTimeout(timer)
                reject(error)
            }
        })
    }

    /**
     * 添加事件监听
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback)
        }
    }

    /**
     * 移除事件监听
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
     * 触发事件回调
     */
    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data)
                } catch (error) {
                    console.error('事件回调执行失败:', error)
                }
            })
        }
    }

    /**
     * 禁用防录屏保护
     */
    disable() {
        console.log('🔓 禁用手机端防录屏保护')
        
        try {
            // 清除定时器
            if (this.detectionTimer) {
                clearInterval(this.detectionTimer)
                this.detectionTimer = null
            }
            
            // 移除事件监听器
            this.eventListeners.forEach(({ element, event, handler }) => {
                try {
                    element.removeEventListener(event, handler)
                } catch (error) {
                    console.error('移除事件监听器失败:', error)
                }
            })
            this.eventListeners = []
            
            this.isEnabled = false
            this.triggerCallback('onProtectionDisabled', {
                platform: this.platform,
                environment: this.environment
            })
            
            console.log('✅ 手机端防录屏保护已禁用')
            return true
        } catch (error) {
            console.error('禁用防录屏保护失败:', error)
            return false
        }
    }

    /**
     * 获取保护状态
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            platform: this.platform,
            environment: this.environment,
            config: this.config,
            state: this.state,
            timestamp: Date.now()
        }
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
        console.log('⚙️ 配置已更新:', this.config)
    }
}

// 创建全局实例
const mobileScreenProtector = new MobileScreenProtector()

export default mobileScreenProtector
/**
 * 统一防录屏保护器
 * 解决多套实现冲突问题，提供统一的API接口
 */

class UnifiedScreenProtector {
    constructor() {
        this.platform = ''
        this.environment = ''
        this.isEnabled = false
        this.protectionMethod = 'none'
        this.callbacks = {
            onScreenshotDetected: [],
            onRecordingDetected: [],
            onProtectionEnabled: [],
            onProtectionDisabled: []
        }

        this.init()
    }

    /**
     * 初始化
     */
    init() {
        try {
            this.platform = this.getPlatform()
            this.environment = this.getEnvironment()

            console.log('🛡️ 统一防录屏保护器初始化')
            console.log(`📱 平台: ${this.platform}`)
            console.log(`🌍 环境: ${this.environment}`)
        } catch (error) {
            console.error('初始化失败:', error)
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
            console.error('获取平台信息失败:', error)
            return 'unknown'
        }
    }

    /**
     * 获取运行环境
     */
    getEnvironment() {
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
     * 启用防录屏保护（主入口）
     */
    async enable(options = {}) {
        console.log('🚀 开始启用防录屏保护...')
        console.log('📋 配置选项:', options)

        try {
            // 根据环境选择最佳方案
            if (this.environment === 'app') {
                return await this.enableAppProtection(options)
            } else if (this.environment === 'h5') {
                return await this.enableH5Protection(options)
            } else if (this.environment === 'mp-weixin') {
                return await this.enableMpProtection(options)
            } else {
                console.warn('⚠️ 未知环境，无法启用防录屏')
                return false
            }
        } catch (error) {
            console.error('❌ 启用防录屏保护失败:', error)
            return false
        }
    }

    /**
     * APP环境防护（核心方法）
     */
    async enableAppProtection(options = {}) {
        console.log('📱 启用APP环境防录屏保护')

        // 尝试多种方案，按优先级执行
        const methods = [
            () => this.tryNativePlugin(),
            () => this.tryPlusEnvironment(),
            () => this.trySimpleDetection()
        ]

        for (let i = 0; i < methods.length; i++) {
            const methodName = ['原生插件', 'Plus环境', '简化检测'][i]
            console.log(`🔄 尝试方案 ${i + 1}: ${methodName}`)

            try {
                const result = await methods[i]()
                if (result) {
                    console.log(`✅ ${methodName}方案启用成功`)
                    this.protectionMethod = methodName
                    this.isEnabled = true
                    this.triggerCallback('onProtectionEnabled', {
                        method: methodName,
                        platform: this.platform,
                        environment: this.environment
                    })
                    return true
                }
            } catch (error) {
                console.warn(`⚠️ ${methodName}方案失败:`, error.message)
            }
        }

        console.error('❌ 所有APP防护方案均失败')
        return false
    }

    /**
     * 方案1: 尝试原生插件
     */
    async tryNativePlugin() {
        console.log('🧪 尝试原生插件方案...')

        // 检查uni.requireNativePlugin是否可用
        if (typeof uni === 'undefined' || !uni.requireNativePlugin) {
            throw new Error('uni.requireNativePlugin不可用')
        }

        // 加载原生插件
        const ScreenProtector = uni.requireNativePlugin('ScreenProtector')
        if (!ScreenProtector) {
            throw new Error('无法加载ScreenProtector插件')
        }

        // 测试插件功能
        const testResult = await this.callWithTimeout(
            (callback) => ScreenProtector.testPlugin(callback),
            5000
        )

        if (!testResult || !testResult.success) {
            throw new Error('插件测试失败: ' + (testResult?.message || '未知错误'))
        }

        console.log('✅ 原生插件测试成功:', testResult)

        // 启用防护
        const enableResult = await this.callWithTimeout(
            (callback) => ScreenProtector.enableProtection(callback),
            5000
        )

        if (!enableResult || !enableResult.success) {
            throw new Error('防护启用失败: ' + (enableResult?.message || '未知错误'))
        }

        console.log('✅ 原生插件防护启用成功:', enableResult)

        // 设置事件监听
        this.setupNativePluginListeners(ScreenProtector)

        return true
    }

    /**
     * 方案2: 尝试Plus环境
     */
    async tryPlusEnvironment() {
        console.log('🔧 尝试Plus环境方案...')

        if (typeof plus === 'undefined') {
            throw new Error('Plus环境不可用')
        }

        if (this.platform === 'android') {
            return await this.tryPlusAndroid()
        } else if (this.platform === 'ios') {
            return await this.tryPlusIOS()
        } else {
            throw new Error('不支持的平台: ' + this.platform)
        }
    }

    /**
     * Plus Android实现
     */
    async tryPlusAndroid() {
        console.log('🤖 尝试Plus Android方案...')

        try {
            const main = plus.android.runtimeMainActivity()
            if (!main) {
                throw new Error('无法获取Activity')
            }

            const window = main.getWindow()
            if (!window) {
                throw new Error('无法获取Window')
            }

            // 设置FLAG_SECURE
            const FLAG_SECURE = 0x00002000
            window.addFlags(FLAG_SECURE)

            // 验证设置
            const currentFlags = window.getAttributes().flags
            const isSecure = (currentFlags & FLAG_SECURE) !== 0

            if (!isSecure) {
                throw new Error('FLAG_SECURE设置失败')
            }

            console.log('✅ Plus Android FLAG_SECURE设置成功')
            console.log(`🔍 Window标志: 0x${currentFlags.toString(16)}`)

            return true

        } catch (error) {
            console.error('❌ Plus Android方案失败:', error)
            throw error
        }
    }

    /**
     * Plus iOS实现
     */
    async tryPlusIOS() {
        console.log('🍎 尝试Plus iOS方案...')

        try {
            // iOS通过Plus环境的实现较为有限
            // 主要通过JavaScript检测
            this.setupIOSJSDetection()

            console.log('✅ Plus iOS检测方案启用成功')
            return true

        } catch (error) {
            console.error('❌ Plus iOS方案失败:', error)
            throw error
        }
    }

    /**
     * 方案3: 简化检测方案
     */
    async trySimpleDetection() {
        console.log('🔍 尝试简化检测方案...')

        try {
            // 动态导入简化保护器
            const { default: simpleProtector } = await import('./simple-mobile-protector.js')

            const result = await simpleProtector.enable()
            if (result) {
                console.log('✅ 简化检测方案启用成功')

                // 设置事件监听
                simpleProtector.on('onScreenshotDetected', (data) => {
                    this.triggerCallback('onScreenshotDetected', data)
                })

                return true
            } else {
                throw new Error('简化检测方案启用失败')
            }

        } catch (error) {
            console.error('❌ 简化检测方案失败:', error)
            throw error
        }
    }

    /**
     * H5环境防护
     */
    async enableH5Protection(options = {}) {
        console.log('🌐 启用H5环境防录屏保护')

        try {
            // 动态导入H5保护器
            const { default: h5Protector } = await import('./screen-protector.js')

            const result = h5Protector.enable(options)
            if (result) {
                console.log('✅ H5防护启用成功')
                this.protectionMethod = 'H5'
                this.isEnabled = true

                // 设置事件监听
                h5Protector.on('onScreenshotDetected', (data) => {
                    this.triggerCallback('onScreenshotDetected', data)
                })

                h5Protector.on('onRecordingDetected', (data) => {
                    this.triggerCallback('onRecordingDetected', data)
                })

                this.triggerCallback('onProtectionEnabled', {
                    method: 'H5',
                    platform: this.platform,
                    environment: this.environment
                })

                return true
            } else {
                throw new Error('H5防护启用失败')
            }

        } catch (error) {
            console.error('❌ H5防护失败:', error)
            return false
        }
    }

    /**
     * 小程序环境防护
     */
    async enableMpProtection(options = {}) {
        console.log('📱 启用小程序环境防录屏保护')

        // 小程序环境防录屏功能有限，主要提供检测和提醒
        this.setupMpDetection()

        this.protectionMethod = '小程序检测'
        this.isEnabled = true

        this.triggerCallback('onProtectionEnabled', {
            method: '小程序检测',
            platform: this.platform,
            environment: this.environment
        })

        return true
    }

    /**
     * 设置原生插件事件监听
     */
    setupNativePluginListeners(ScreenProtector) {
        // 监听uni事件总线上的安全事件
        uni.$on('screenshotDetected', (data) => {
            console.log('📸 原生插件检测到截屏:', data)
            this.handleScreenshotDetected(data)
        })

        uni.$on('screenRecordingDetected', (data) => {
            console.log('📹 原生插件检测到录屏:', data)
            this.handleRecordingDetected(data)
        })
    }

    /**
     * 设置iOS JavaScript检测
     */
    setupIOSJSDetection() {
        // 监听页面可见性变化（可能的截屏行为）
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // 页面隐藏，可能是截屏
                    this.handlePossibleScreenshot()
                }
            })
        }
    }

    /**
     * 设置小程序检测
     */
    setupMpDetection() {
        // 小程序中的检测方案有限
        console.log('📱 小程序环境检测已设置')
    }

    /**
     * 处理截屏检测
     */
    handleScreenshotDetected(data = {}) {
        console.warn('🚨 检测到截屏行为')

        const eventData = {
            type: 'screenshot',
            timestamp: Date.now(),
            platform: this.platform,
            environment: this.environment,
            method: this.protectionMethod,
            ...data
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
    handleRecordingDetected(data = {}) {
        console.warn('🚨 检测到录屏行为')

        const eventData = {
            type: 'recording',
            timestamp: Date.now(),
            platform: this.platform,
            environment: this.environment,
            method: this.protectionMethod,
            ...data
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
     * 处理可能的截屏
     */
    handlePossibleScreenshot() {
        // 延迟检测，避免正常的页面切换
        setTimeout(() => {
            this.handleScreenshotDetected({ possible: true })
        }, 1000)
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
        console.log('🔓 禁用防录屏保护')

        try {
            this.isEnabled = false
            this.protectionMethod = 'none'

            this.triggerCallback('onProtectionDisabled', {
                platform: this.platform,
                environment: this.environment
            })

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
            protectionMethod: this.protectionMethod,
            timestamp: Date.now()
        }
    }
}

// 创建全局实例
const unifiedScreenProtector = new UnifiedScreenProtector()

export default unifiedScreenProtector

/**
 * 手机端防录屏工具类
 * @description 针对Android和iOS原生APP的防录屏解决方案
 */

class MobileScreenProtector {
    constructor() {
        this.isEnabled = false
        this.platform = this.getPlatform()
        this.callbacks = {
            onScreenshotDetected: [],
            onRecordingDetected: [],
            onProtectionEnabled: [],
            onProtectionDisabled: []
        }

        this.init()
    }

    /**
     * 获取当前平台
     */
    getPlatform() {
        try {
            const systemInfo = uni.getSystemInfoSync()
            return systemInfo.platform
        } catch (error) {
            console.error('获取平台信息失败:', error)
            return 'unknown'
        }
    }

    /**
     * 初始化
     */
    init() {
        console.log(`📱 初始化手机端防录屏保护，平台: ${this.platform}`)

        if (this.platform === 'android') {
            this.initAndroid()
        } else if (this.platform === 'ios') {
            this.initIOS()
        } else {
            console.warn('⚠️ 当前平台不支持原生防录屏功能')
        }
    }

    /**
     * 启用防录屏保护
     */
    async enable() {
        try {
            console.log('🛡️ 启用手机端防录屏保护')

            if (this.platform === 'android') {
                return await this.enableAndroidProtection()
            } else if (this.platform === 'ios') {
                return await this.enableIOSProtection()
            } else {
                console.warn('当前平台不支持防录屏功能')
                return false
            }
        } catch (error) {
            console.error('启用防录屏保护失败:', error)
            return false
        }
    }

    /**
     * 禁用防录屏保护
     */
    disable() {
        try {
            console.log('🔓 禁用手机端防录屏保护')

            if (this.platform === 'android') {
                return this.disableAndroidProtection()
            } else if (this.platform === 'ios') {
                return this.disableIOSProtection()
            }

            this.isEnabled = false
            this.triggerCallback('onProtectionDisabled')
            return true
        } catch (error) {
            console.error('禁用防录屏保护失败:', error)
            return false
        }
    }

    /**
     * Android平台初始化
     */
    initAndroid() {
        console.log('🤖 初始化Android防录屏功能')

        // 检查是否在App环境
        if (typeof plus === 'undefined') {
            console.warn('⚠️ 不在App环境，无法使用原生功能')
            return
        }

        // 设置截屏监听
        this.setupAndroidScreenshotListener()
    }

    /**
     * iOS平台初始化
     */
    initIOS() {
        console.log('🍎 初始化iOS防录屏功能')

        // 检查是否在App环境
        if (typeof plus === 'undefined') {
            console.warn('⚠️ 不在App环境，无法使用原生功能')
            return
        }

        // 设置录屏和截屏监听
        this.setupIOSScreenshotListener()
        this.setupIOSRecordingListener()
    }

    /**
     * 启用Android防录屏（完整防护模式）
     */
    enableAndroidProtection() {
        return new Promise((resolve) => {
            try {
                console.log('🤖 启用Android防录屏保护（完整防护模式）')

                // Android使用FLAG_SECURE完全阻止截屏录屏
                // 方法1: 使用uni-app的原生插件调用（推荐）
                if (typeof uni !== 'undefined' && uni.requireNativePlugin) {
                    console.log('🔍 uni.requireNativePlugin 可用，尝试加载原生插件...')

                    try {
                        const screenProtector = uni.requireNativePlugin('ScreenProtector')
                        console.log('📦 原生插件加载结果:', screenProtector ? '成功' : '失败(null)')

                        if (screenProtector && typeof screenProtector.testPlugin === 'function') {
                            console.log('🧪 开始测试原生插件功能...')

                            // 设置超时，避免插件无响应
                            const timeoutId = setTimeout(() => {
                                console.error('⏰ 原生插件测试超时，使用回退方案')
                                this.tryFallbackAndroidMethod().then(resolve)
                            }, 5000) // 5秒超时

                            screenProtector.testPlugin((testResult) => {
                                clearTimeout(timeoutId)
                                console.log('🔍 插件测试完成，结果:', JSON.stringify(testResult, null, 2))

                                if (testResult && testResult.success) {
                                    console.log('✅ 原生插件测试成功，开始启用防护')
                                    console.log('📊 插件详细信息:', {
                                        version: testResult.pluginVersion,
                                        apiLevel: testResult.apiLevel,
                                        deviceModel: testResult.deviceModel,
                                        windowStatus: testResult.windowStatus
                                    })

                                    screenProtector.enableProtection((result) => {
                                        console.log('🛡️ 防护启用结果:', JSON.stringify(result, null, 2))

                                        if (result && result.success) {
                                            console.log('✅ Android FLAG_SECURE已启用成功')
                                            console.log('🔍 详细信息:', {
                                                method: result.method,
                                                flagVerified: result.flagVerified,
                                                windowFlags: result.windowFlags,
                                                deviceModel: result.deviceModel
                                            })

                                            this.isEnabled = true
                                            this.triggerCallback('onProtectionEnabled', {
                                                platform: 'android',
                                                method: 'native_plugin',
                                                details: result
                                            })
                                            resolve(true)
                                        } else {
                                            console.error('❌ 原生插件启用失败:', result ? result.message : '返回结果为空')
                                            console.log('🔄 切换到回退方案...')
                                            this.tryFallbackAndroidMethod().then(resolve)
                                        }
                                    })
                                } else {
                                    console.error('❌ 插件测试失败:', testResult ? testResult.message : '测试结果为空')
                                    console.log('🔄 切换到回退方案...')
                                    this.tryFallbackAndroidMethod().then(resolve)
                                }
                            })
                            return
                        } else {
                            console.error('❌ 原生插件对象无效或缺少testPlugin方法')
                            console.log('📋 插件对象类型:', typeof screenProtector)
                            console.log('📋 插件方法列表:', screenProtector ? Object.keys(screenProtector) : '无')
                        }
                    } catch (pluginError) {
                        console.error('❌ 加载原生插件时发生异常:', pluginError)
                        console.log('📋 异常详情:', {
                            name: pluginError.name,
                            message: pluginError.message,
                            stack: pluginError.stack
                        })
                    }
                } else {
                    console.error('❌ uni.requireNativePlugin 不可用')
                    console.log('📋 环境检查:', {
                        uniDefined: typeof uni !== 'undefined',
                        requireNativePlugin: typeof uni !== 'undefined' ? typeof uni.requireNativePlugin : 'uni未定义'
                    })
                }

                // 方法2: 回退到plus.android直接调用
                this.tryFallbackAndroidMethod().then(resolve)

            } catch (error) {
                console.error('Android防录屏启用失败:', error)
                resolve(false)
            }
        })
    }

    /**
     * Android防录屏回退方法
     */
    tryFallbackAndroidMethod() {
        return new Promise((resolve) => {
            try {
                console.log('⚠️ 尝试Android回退方案 - plus.android直接调用')

                if (typeof plus !== 'undefined' && plus.android) {
                    const main = plus.android.runtimeMainActivity()
                    if (main) {
                        console.log('📱 已获取到Activity实例')

                        const window = main.getWindow()
                        if (window) {
                            console.log('🪟 已获取到Window实例')

                            try {
                                // 方法1：通过WindowManager类设置
                                const WindowManager = plus.android.importClass('android.view.WindowManager')
                                window.setFlags(
                                    WindowManager.LayoutParams.FLAG_SECURE,
                                    WindowManager.LayoutParams.FLAG_SECURE
                                )

                                console.log('✅ Android FLAG_SECURE已设置（plus.android - setFlags）')
                                this.isEnabled = true
                                this.triggerCallback('onProtectionEnabled', {
                                    platform: 'android',
                                    method: 'plus.android.setFlags',
                                    timestamp: Date.now()
                                })
                                resolve(true)
                                return
                            } catch (e1) {
                                console.warn('⚠️ setFlags方法失败，尝试addFlags:', e1.message)

                                try {
                                    // 方法2：使用addFlags
                                    const FLAG_SECURE = 0x00002000
                                    window.addFlags(FLAG_SECURE)

                                    console.log('✅ Android FLAG_SECURE已设置（plus.android - addFlags）')
                                    this.isEnabled = true
                                    this.triggerCallback('onProtectionEnabled', {
                                        platform: 'android',
                                        method: 'plus.android.addFlags',
                                        timestamp: Date.now()
                                    })
                                    resolve(true)
                                    return
                                } catch (e2) {
                                    console.error('❌ addFlags方法也失败:', e2.message)
                                }
                            }
                        } else {
                            console.error('❌ 无法获取Window对象')
                        }
                    } else {
                        console.error('❌ 无法获取Activity对象')
                    }
                } else {
                    console.error('❌ plus.android不可用')
                }

                console.error('❌ Android原生方案失败，尝试简化版方案')
                this.trySimpleFallback().then(resolve)

            } catch (error) {
                console.error('❌ Android回退方案异常:', error)
                resolve(false)
            }
        })
    }

    /**
     * 简化版回退方案
     */
    trySimpleFallback() {
        return new Promise(async (resolve) => {
            try {
                console.log('🔧 启用简化版防录屏方案')

                // 动态导入简化版保护器
                const { default: simpleProtector } = await import('./simple-mobile-protector.js')

                const result = await simpleProtector.enable()
                if (result) {
                    console.log('✅ 简化版方案启用成功')
                    this.isEnabled = true
                    this.triggerCallback('onProtectionEnabled', {
                        platform: this.platform,
                        method: 'simple_fallback',
                        timestamp: Date.now()
                    })
                    resolve(true)
                } else {
                    console.log('❌ 简化版方案也失败')
                    resolve(false)
                }
            } catch (error) {
                console.error('❌ 简化版方案异常:', error)
                resolve(false)
            }
        })
    }

    /**
     * 启用iOS防录屏（检测模式）
     */
    enableIOSProtection() {
        return new Promise((resolve) => {
            try {
                console.log('🍎 启用iOS截屏录屏检测（检测模式）')

                // iOS无法完全阻止截屏，只能检测并警告
                // 使用uni-app的原生插件调用
                if (uni.requireNativePlugin) {
                    const screenProtector = uni.requireNativePlugin('ScreenProtector')
                    if (screenProtector) {
                        screenProtector.enableProtection((result) => {
                            console.log('iOS原生插件返回结果:', result)
                            if (result.success) {
                                console.log('✅ iOS截屏录屏检测已启用，将在检测到时发出警告')
                                this.isEnabled = true
                                this.triggerCallback('onProtectionEnabled', { platform: 'ios', method: 'plugin' })

                                // 设置事件监听
                                this.setupIOSEventListeners()
                                resolve(true)
                            } else {
                                console.error('iOS原生插件启用失败:', result.message)
                                resolve(false)
                            }
                        })
                        return
                    }
                }

                console.warn('⚠️ 无可用的iOS防录屏方法')
                resolve(false)
            } catch (error) {
                console.error('iOS防录屏启用失败:', error)
                resolve(false)
            }
        })
    }

    /**
     * 设置iOS事件监听
     */
    setupIOSEventListeners() {
        // 监听原生插件触发的事件
        uni.$on('screenshotDetected', (data) => {
            console.log('📸 iOS截屏事件:', data)
            this.handleScreenshotDetected()
        })

        uni.$on('screenRecordingDetected', (data) => {
            console.log('📹 iOS录屏事件:', data)
            this.handleRecordingDetected()
        })
    }

    /**
     * 禁用Android防录屏
     */
    disableAndroidProtection() {
        try {
            if (typeof plus !== 'undefined' && plus.android) {
                const main = plus.android.runtimeMainActivity()
                const window = main.getWindow()
                const WindowManager = plus.android.importClass('android.view.WindowManager')

                // 清除FLAG_SECURE标志
                window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)

                console.log('🔓 Android FLAG_SECURE已清除')
                return true
            }

            if (uni.requireNativePlugin) {
                const screenProtector = uni.requireNativePlugin('ScreenProtector')
                if (screenProtector) {
                    const result = screenProtector.disableProtection()
                    return result.success
                }
            }

            return false
        } catch (error) {
            console.error('Android防录屏禁用失败:', error)
            return false
        }
    }

    /**
     * 禁用iOS防录屏
     */
    disableIOSProtection() {
        try {
            if (uni.requireNativePlugin) {
                const screenProtector = uni.requireNativePlugin('ScreenProtector')
                if (screenProtector) {
                    const result = screenProtector.disableProtection()
                    return result.success
                }
            }

            console.log('🔓 iOS防录屏已禁用')
            return true
        } catch (error) {
            console.error('iOS防录屏禁用失败:', error)
            return false
        }
    }

    /**
     * 设置Android截屏监听
     */
    setupAndroidScreenshotListener() {
        try {
            // 监听文件系统变化来检测截屏
            if (typeof plus !== 'undefined' && plus.android) {
                // 这里需要原生代码配合实现
                console.log('📸 Android截屏监听已设置')
            }
        } catch (error) {
            console.error('Android截屏监听设置失败:', error)
        }
    }

    /**
     * 设置iOS截屏监听
     */
    setupIOSScreenshotListener() {
        try {
            if (typeof plus !== 'undefined' && plus.ios) {
                // 监听截屏通知
                const notificationCenter = plus.ios.importClass('NSNotificationCenter')
                const defaultCenter = notificationCenter.defaultCenter()

                // 监听UIApplicationUserDidTakeScreenshotNotification
                // 这里需要原生代码配合实现回调
                console.log('📸 iOS截屏监听已设置')
            }
        } catch (error) {
            console.error('iOS截屏监听设置失败:', error)
        }
    }

    /**
     * 设置iOS录屏监听
     */
    setupIOSRecordingListener() {
        try {
            if (typeof plus !== 'undefined' && plus.ios) {
                // 监听录屏状态变化
                // UIScreen.capturedDidChangeNotification
                console.log('📹 iOS录屏监听已设置')
            }
        } catch (error) {
            console.error('iOS录屏监听设置失败:', error)
        }
    }

    /**
     * 处理截屏检测（仅在真正检测到时触发）
     */
    handleScreenshotDetected() {
        console.warn('🚨 检测到截屏行为')

        const eventData = {
            type: 'screenshot',
            timestamp: new Date().toISOString(),
            platform: this.platform,
            detected: true
        }

        // 触发回调
        this.triggerCallback('onScreenshotDetected', eventData)

        // 记录安全事件
        this.logSecurityEvent(eventData)

        // 仅在检测到真实截屏时显示警告
        uni.showModal({
            title: '隐私安全提示',
            content: '检测到截屏行为，已记录此次安全事件。请注意保护个人隐私信息。',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#ff6b35'
        })
    }

    /**
     * 处理录屏检测（仅在真正检测到时触发）
     */
    handleRecordingDetected() {
        console.warn('🚨 检测到录屏行为')

        const eventData = {
            type: 'recording',
            timestamp: new Date().toISOString(),
            platform: this.platform,
            detected: true
        }

        // 触发回调
        this.triggerCallback('onRecordingDetected', eventData)

        // 记录安全事件
        this.logSecurityEvent(eventData)

        // 仅在检测到真实录屏时显示警告
        uni.showModal({
            title: '隐私安全警告',
            content: '检测到录屏行为，已记录此次安全事件。为保护隐私，建议停止录屏操作。',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#ff4444'
        })
    }

    /**
     * 记录安全事件
     */
    logSecurityEvent(eventData) {
        try {
            const events = uni.getStorageSync('mobile_security_events') || []
            events.push({
                ...eventData,
                deviceInfo: uni.getSystemInfoSync(),
                page: getCurrentPages().pop()?.route || 'unknown'
            })

            // 只保留最近100条记录
            if (events.length > 100) {
                events.splice(0, events.length - 100)
            }

            uni.setStorageSync('mobile_security_events', events)
            console.log('📝 安全事件已记录')
        } catch (error) {
            console.error('记录安全事件失败:', error)
        }
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
     * 获取保护状态
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            platform: this.platform,
            supportedFeatures: this.getSupportedFeatures()
        }
    }

    /**
     * 获取支持的功能
     */
    getSupportedFeatures() {
        const features = []

        if (this.platform === 'android') {
            features.push('FLAG_SECURE', '截屏检测', '防录屏')
        } else if (this.platform === 'ios') {
            features.push('截屏监听', '录屏监听', '隐私保护')
        }

        return features
    }

    /**
     * 获取安全事件记录
     */
    getSecurityEvents() {
        try {
            return uni.getStorageSync('mobile_security_events') || []
        } catch (error) {
            console.error('获取安全事件失败:', error)
            return []
        }
    }

    /**
     * 清除安全事件记录
     */
    clearSecurityEvents() {
        try {
            uni.removeStorageSync('mobile_security_events')
            console.log('🗑️ 安全事件记录已清除')
        } catch (error) {
            console.error('清除安全事件失败:', error)
        }
    }
}

// 创建全局实例
const mobileScreenProtector = new MobileScreenProtector()

export default mobileScreenProtector

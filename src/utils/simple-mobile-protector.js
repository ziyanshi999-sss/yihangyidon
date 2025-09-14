/**
 * 简化版手机端防录屏工具
 * @description 当原生插件无法工作时的备用方案
 */

class SimpleMobileProtector {
    constructor() {
        this.isEnabled = false
        this.platform = ''
        this.systemInfo = {}
        this.callbacks = {
            onScreenshotDetected: [],
            onRecordingDetected: [],
            onProtectionEnabled: [],
            onProtectionDisabled: []
        }

        this.init()
    }

    init() {
        try {
            this.systemInfo = uni.getSystemInfoSync()
            this.platform = this.systemInfo.platform
            console.log('🔧 简化版手机防录屏初始化完成')
            console.log(`📱 平台: ${this.platform}`)
            console.log(`🔋 系统版本: ${this.systemInfo.system}`)
        } catch (error) {
            console.error('简化版初始化失败:', error)
        }
    }

    /**
     * 启用防录屏保护
     */
    enable() {
        return new Promise((resolve) => {
            console.log('🛡️ 启用简化版防录屏保护')

            try {
                if (this.platform === 'android') {
                    this.enableAndroidSimple().then(resolve)
                } else if (this.platform === 'ios') {
                    this.enableIOSSimple().then(resolve)
                } else {
                    console.warn('⚠️ 当前平台不支持防录屏功能')
                    resolve(false)
                }
            } catch (error) {
                console.error('❌ 简化版启用失败:', error)
                resolve(false)
            }
        })
    }

    /**
     * Android简化方案
     */
    enableAndroidSimple() {
        return new Promise((resolve) => {
            try {
                console.log('🤖 启用Android简化防录屏方案')

                // 方法1: 检查plus.android环境
                if (typeof plus !== 'undefined' && plus.android) {
                    console.log('✅ plus.android环境可用')

                    const main = plus.android.runtimeMainActivity()
                    if (main) {
                        console.log('📱 获取到Activity实例')

                        const window = main.getWindow()
                        if (window) {
                            console.log('🪟 获取到Window实例')

                            try {
                                // 使用常量值直接设置FLAG_SECURE
                                const FLAG_SECURE = 0x00002000
                                window.addFlags(FLAG_SECURE)

                                console.log('✅ Android FLAG_SECURE设置成功（简化方案）')
                                this.isEnabled = true
                                this.triggerCallback('onProtectionEnabled', {
                                    platform: 'android',
                                    method: 'simple_plus_android',
                                    timestamp: Date.now()
                                })

                                // 显示成功提示
                                uni.showToast({
                                    title: '防录屏已启用',
                                    icon: 'success',
                                    duration: 2000
                                })

                                resolve(true)
                                return
                            } catch (flagError) {
                                console.error('设置FLAG_SECURE失败:', flagError)
                            }
                        } else {
                            console.error('❌ 无法获取Window对象')
                        }
                    } else {
                        console.error('❌ 无法获取Activity对象')
                    }
                } else {
                    console.error('❌ plus.android环境不可用')
                }

                // 如果plus.android方案失败，启用检测模式
                console.log('⚠️ 原生方案失败，启用检测模式')
                this.enableDetectionMode()
                resolve(false)

            } catch (error) {
                console.error('❌ Android简化方案异常:', error)
                this.enableDetectionMode()
                resolve(false)
            }
        })
    }

    /**
     * iOS简化方案
     */
    enableIOSSimple() {
        return new Promise((resolve) => {
            try {
                console.log('🍎 启用iOS简化防录屏方案')

                // iOS只能做检测，无法真正阻止
                this.enableDetectionMode()

                // 尝试监听页面可见性变化（可能的截屏行为）
                if (typeof document !== 'undefined') {
                    document.addEventListener('visibilitychange', () => {
                        if (document.hidden) {
                            console.log('⚠️ 检测到页面隐藏，可能是截屏行为')
                            this.handlePossibleScreenshot()
                        }
                    })
                }

                console.log('✅ iOS检测模式已启用')
                this.isEnabled = true
                this.triggerCallback('onProtectionEnabled', {
                    platform: 'ios',
                    method: 'simple_detection',
                    timestamp: Date.now()
                })

                uni.showToast({
                    title: 'iOS检测模式已启用',
                    icon: 'success',
                    duration: 2000
                })

                resolve(true)

            } catch (error) {
                console.error('❌ iOS简化方案异常:', error)
                resolve(false)
            }
        })
    }

    /**
     * 启用检测模式（当无法阻止时）
     */
    enableDetectionMode() {
        console.log('🔍 启用防录屏检测模式')

        // 检测按键事件
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', (e) => {
                // 检测截屏快捷键
                if (e.key === 'PrintScreen' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'S') ||
                    (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))) {
                    console.log('⚠️ 检测到截屏快捷键')
                    this.handleScreenshotDetected()
                }
            })
        }

        // 定期检查剪贴板（可能的截屏粘贴）
        this.startClipboardMonitoring()
    }

    /**
     * 开始剪贴板监控
     */
    startClipboardMonitoring() {
        // 检测剪贴板图片（可能的截屏）
        setInterval(() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.read) {
                navigator.clipboard.read().then(items => {
                    for (let item of items) {
                        if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                            console.log('⚠️ 检测到剪贴板中的图片')
                            this.handleScreenshotDetected()
                            break
                        }
                    }
                }).catch(() => {
                    // 忽略权限错误
                })
            }
        }, 3000) // 每3秒检查一次
    }

    /**
     * 处理可能的截屏
     */
    handlePossibleScreenshot() {
        console.log('⚠️ 处理可能的截屏行为')

        // 延迟检测，避免正常的页面切换
        setTimeout(() => {
            this.handleScreenshotDetected()
        }, 1000)
    }

    /**
     * 处理截屏检测
     */
    handleScreenshotDetected() {
        console.warn('🚨 检测到截屏行为')

        const eventData = {
            type: 'screenshot',
            timestamp: Date.now(),
            platform: this.platform,
            detected: true,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        }

        this.triggerCallback('onScreenshotDetected', eventData)

        // 显示警告
        uni.showModal({
            title: '安全提醒',
            content: '检测到截屏行为，已记录此次安全事件。请注意保护个人隐私信息。',
            showCancel: false,
            confirmText: '知道了'
        })

        // 记录安全事件
        this.logSecurityEvent('screenshot', eventData)
    }

    /**
     * 触发回调
     */
    triggerCallback(eventName, data) {
        try {
            if (this.callbacks[eventName]) {
                this.callbacks[eventName].forEach(callback => {
                    if (typeof callback === 'function') {
                        callback(data)
                    }
                })
            }
        } catch (error) {
            console.error('触发回调失败:', error)
        }
    }

    /**
     * 记录安全事件
     */
    logSecurityEvent(type, data) {
        try {
            const events = uni.getStorageSync('securityEvents') || []
            events.unshift({
                type,
                data,
                timestamp: Date.now(),
                method: 'simple_protector'
            })

            // 限制记录数量
            if (events.length > 100) {
                events.splice(100)
            }

            uni.setStorageSync('securityEvents', events)
            console.log('📝 安全事件已记录')
        } catch (error) {
            console.error('记录安全事件失败:', error)
        }
    }

    /**
     * 禁用防录屏保护
     */
    disable() {
        console.log('🔓 禁用简化版防录屏保护')

        try {
            if (this.platform === 'android' && typeof plus !== 'undefined' && plus.android) {
                const main = plus.android.runtimeMainActivity()
                if (main) {
                    const window = main.getWindow()
                    if (window) {
                        const FLAG_SECURE = 0x00002000
                        window.clearFlags(FLAG_SECURE)
                        console.log('✅ Android FLAG_SECURE已清除')
                    }
                }
            }

            this.isEnabled = false
            this.triggerCallback('onProtectionDisabled', {
                platform: this.platform,
                timestamp: Date.now()
            })

            uni.showToast({
                title: '防录屏已禁用',
                icon: 'success'
            })

        } catch (error) {
            console.error('禁用失败:', error)
        }
    }

    /**
     * 获取状态
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            platform: this.platform,
            systemInfo: this.systemInfo,
            method: 'simple_protector'
        }
    }

    /**
     * 添加事件监听
     */
    on(eventName, callback) {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName].push(callback)
        }
    }

    /**
     * 测试功能
     */
    test() {
        return {
            success: true,
            message: '简化版防录屏工具加载成功',
            platform: this.platform,
            version: '1.0.0',
            features: {
                plus_android: typeof plus !== 'undefined' && plus.android,
                detection_mode: true,
                clipboard_monitor: typeof navigator !== 'undefined' && navigator.clipboard
            }
        }
    }
}

export default new SimpleMobileProtector()

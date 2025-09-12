/**
 * 防录屏工具类 (修复版)
 * 使用正确的原生插件API调用方式
 */
export default {
    // 初始化防护
    async init() {
        try {
            console.log('🛡️ 初始化防录屏保护...')

            // 检查运行环境
            if (!this.isAppEnvironment()) {
                console.warn('⚠️ 不在APP环境中，无法使用原生防护')
                return false
            }

            const platform = uni.getSystemInfoSync().platform
            console.log(`📱 检测到平台: ${platform}`)

            if (platform === 'android') {
                return await this.enableAndroidProtection()
            } else if (platform === 'ios') {
                return await this.enableIOSProtection()
            } else {
                console.warn('⚠️ 不支持的平台:', platform)
                return false
            }
        } catch (error) {
            console.error('❌ 初始化防录屏失败:', error)
            return false
        }
    },

    // 检查是否在APP环境
    isAppEnvironment() {
        return typeof plus !== 'undefined'
    },

    // Android平台防护 (修复API调用)
    async enableAndroidProtection() {
        try {
            console.log('🤖 启用Android防录屏保护...')

            // 使用正确的API调用方式
            if (uni.requireNativePlugin) {
                const ScreenProtector = uni.requireNativePlugin('ScreenProtector')

                if (ScreenProtector && ScreenProtector.testPlugin) {
                    // 先测试插件
                    const testResult = await this.callWithTimeout(
                        (callback) => ScreenProtector.testPlugin(callback),
                        3000
                    )

                    if (testResult && testResult.success) {
                        console.log('✅ 原生插件测试成功')

                        // 启用防护
                        const enableResult = await this.callWithTimeout(
                            (callback) => ScreenProtector.enableProtection(callback),
                            3000
                        )

                        if (enableResult && enableResult.success) {
                            console.log('✅ Android原生防护启用成功')
                            this.setupEventListeners()
                            return true
                        } else {
                            console.error('❌ 原生防护启用失败:', enableResult?.message)
                        }
                    } else {
                        console.error('❌ 原生插件测试失败:', testResult?.message)
                    }
                } else {
                    console.error('❌ 原生插件不可用')
                }
            }

            // 回退到plus.android方案
            console.log('🔄 尝试plus.android回退方案...')
            return await this.tryPlusAndroidFallback()

        } catch (error) {
            console.error('❌ Android防护启用失败:', error)
            return false
        }
    },

    // iOS平台防护 (修复API调用)
    async enableIOSProtection() {
        try {
            console.log('🍎 启用iOS防录屏保护...')

            if (uni.requireNativePlugin) {
                const ScreenProtector = uni.requireNativePlugin('ScreenProtector')

                if (ScreenProtector && ScreenProtector.enableProtection) {
                    const result = await this.callWithTimeout(
                        (callback) => ScreenProtector.enableProtection(callback),
                        3000
                    )

                    if (result && result.success) {
                        console.log('✅ iOS原生防护启用成功')
                        this.setupEventListeners()
                        return true
                    } else {
                        console.error('❌ iOS原生防护启用失败:', result?.message)
                    }
                } else {
                    console.error('❌ iOS原生插件不可用')
                }
            }

            // iOS回退方案 (JavaScript检测)
            console.log('🔄 使用iOS JavaScript检测方案...')
            this.setupIOSJSDetection()
            return true

        } catch (error) {
            console.error('❌ iOS防护启用失败:', error)
            return false
        }
    },

    // plus.android回退方案
    async tryPlusAndroidFallback() {
        try {
            if (typeof plus !== 'undefined' && plus.android) {
                const main = plus.android.runtimeMainActivity()
                if (main) {
                    const window = main.getWindow()
                    if (window) {
                        const FLAG_SECURE = 0x00002000
                        window.addFlags(FLAG_SECURE)

                        // 验证设置
                        const currentFlags = window.getAttributes().flags
                        const isSecure = (currentFlags & FLAG_SECURE) !== 0

                        if (isSecure) {
                            console.log('✅ plus.android FLAG_SECURE设置成功')
                            return true
                        } else {
                            console.error('❌ FLAG_SECURE验证失败')
                        }
                    }
                }
            }
            return false
        } catch (error) {
            console.error('❌ plus.android回退方案失败:', error)
            return false
        }
    },

    // 设置事件监听
    setupEventListeners() {
        // 监听uni事件总线
        uni.$on('screenshotDetected', (data) => {
            console.log('📸 检测到截屏事件:', data)
            this.handleScreenshot()
        })

        uni.$on('screenRecordingDetected', (data) => {
            console.log('📹 检测到录屏事件:', data)
            this.handleScreenRecording(data.status || true)
        })
    },

    // 设置iOS JavaScript检测
    setupIOSJSDetection() {
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // 可能的截屏行为
                    setTimeout(() => {
                        this.handleScreenshot()
                    }, 1000)
                }
            })
        }
    },

    // 超时调用工具函数
    callWithTimeout(fn, timeout = 3000) {
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
    },

    // 处理截屏事件
    handleScreenshot() {
        uni.showToast({
            title: '检测到截屏行为，敏感信息已隐藏',
            icon: 'none',
            duration: 3000
        })
        // 可添加：清除敏感页面数据/跳转至安全页面
    },

    // 处理录屏状态变化
    handleScreenRecording(isRecording) {
        if (isRecording) {
            uni.showModal({
                title: '警告',
                content: '检测到屏幕录制，为保护您的信息安全，部分功能将受限',
                showCancel: false
            })
            // 可添加：显示水印/模糊敏感区域
        }
    },

    // 销毁防护
    destroy() {
        const ScreenProtector = uni.requireNativePlugin('ScreenProtector')
        ScreenProtector.disable()
        if (uni.getSystemInfoSync().platform === 'ios') {
            ScreenProtector.preventScreenCapture(false)
        }
    }
}
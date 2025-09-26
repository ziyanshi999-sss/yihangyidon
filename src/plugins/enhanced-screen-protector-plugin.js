/**
 * 增强版防录屏插件
 * 为uni-app提供完整的防录屏功能
 */

import enhancedScreenProtector from '@/utils/enhanced-screen-protector.js'

const EnhancedScreenProtectorPlugin = {
    install(app, options = {}) {
        // 默认配置
        const defaultOptions = {
            autoEnable: false,
            protectionLevel: 'medium',
            showAlert: true,
            showWatermark: false,
            watermarkText: '银行APP - 隐私保护中',
            watermarkOpacity: 0.3,
            watermarkSize: 14,
            watermarkColor: '#999999',
            alertTitle: '安全提醒',
            alertContent: '检测到截屏/录屏行为，请注意保护您的隐私信息。',
            excludePages: ['/pages/denglu/login', '/pages/register/register'],
            callbacks: {
                onScreenshotDetected: null,
                onRecordingDetected: null,
                onProtectionEnabled: null,
                onProtectionDisabled: null,
                onError: null
            }
        }

        // 合并配置
        const config = { ...defaultOptions, ...options }

        // 注册全局方法
        app.config.globalProperties.$enableScreenProtection = async (userOptions = {}) => {
            try {
                const finalOptions = { ...config, ...userOptions }
                return await enhancedScreenProtector.enable(finalOptions)
            } catch (error) {
                console.error('启用防录屏保护失败:', error)
                return false
            }
        }

        app.config.globalProperties.$disableScreenProtection = async () => {
            try {
                return await enhancedScreenProtector.disable()
            } catch (error) {
                console.error('禁用防录屏保护失败:', error)
                return false
            }
        }

        app.config.globalProperties.$getScreenProtectionStatus = () => {
            return {
                isEnabled: enhancedScreenProtector.isEnabled,
                platform: enhancedScreenProtector.platform,
                environment: enhancedScreenProtector.environment,
                protectionLevel: enhancedScreenProtector.protectionLevel
            }
        }

        app.config.globalProperties.$getSecurityLogs = (limit = 20) => {
            return enhancedScreenProtector.getSecurityLogs(limit)
        }

        app.config.globalProperties.$clearSecurityLogs = () => {
            return enhancedScreenProtector.clearSecurityLogs()
        }

        app.config.globalProperties.$exportSecurityLogs = () => {
            return enhancedScreenProtector.exportSecurityLogs()
        }

        // 注册回调
        if (config.callbacks.onScreenshotDetected) {
            enhancedScreenProtector.on('onScreenshotDetected', config.callbacks.onScreenshotDetected)
        }

        if (config.callbacks.onRecordingDetected) {
            enhancedScreenProtector.on('onRecordingDetected', config.callbacks.onRecordingDetected)
        }

        if (config.callbacks.onProtectionEnabled) {
            enhancedScreenProtector.on('onProtectionEnabled', config.callbacks.onProtectionEnabled)
        }

        if (config.callbacks.onProtectionDisabled) {
            enhancedScreenProtector.on('onProtectionDisabled', config.callbacks.onProtectionDisabled)
        }

        if (config.callbacks.onError) {
            enhancedScreenProtector.on('onError', config.callbacks.onError)
        }

        // 自动启用
        if (config.autoEnable) {
            app.mixin({
                onShow() {
                    // 延迟启用，确保页面完全加载
                    setTimeout(async () => {
                        try {
                            await enhancedScreenProtector.enable(config)
                        } catch (error) {
                            console.error('自动启用防录屏保护失败:', error)
                        }
                    }, 1000)
                }
            })
        }

        // 提供插件实例
        app.config.globalProperties.$screenProtector = enhancedScreenProtector

        console.log('🛡️ 增强版防录屏插件已安装')
    }
}

export default EnhancedScreenProtectorPlugin

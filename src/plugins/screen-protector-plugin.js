/**
 * 防录屏插件全局配置
 * @description 为uni-app提供全局防录屏功能
 */

import screenProtector from '@/utils/screen-protector.js'

/**
 * 防录屏插件配置
 */
const ScreenProtectorPlugin = {
    // 安装插件
    install(app, options = {}) {
        console.log('🛡️ 安装防录屏插件...')

        // 默认配置
        const defaultConfig = {
            // 是否自动启用
            autoEnable: true,

            // 防护级别: low, medium, high
            protectionLevel: 'high',

            // 是否显示警告
            showAlert: true,

            // 是否显示水印
            showWatermark: true,

            // 需要保护的页面路径 (为空则全局保护)
            protectedPaths: [],

            // 排除的页面路径
            excludePaths: ['/pages/denglu/login', '/pages/register/register'],

            // 自定义水印文本
            watermarkText: '隐私保护中',

            // 事件回调
            callbacks: {
                onScreenshotDetected: null,
                onRecordingDetected: null,
                onProtectionEnabled: null,
                onProtectionDisabled: null
            }
        }

        // 合并配置
        const config = { ...defaultConfig, ...options }

        // 全局属性
        app.config.globalProperties.$screenProtector = screenProtector
        app.config.globalProperties.$screenProtectorConfig = config

        // 提供全局方法
        app.provide('screenProtector', screenProtector)
        app.provide('screenProtectorConfig', config)

        // 注册事件回调
        if (config.callbacks.onScreenshotDetected) {
            screenProtector.on('onScreenshotDetected', config.callbacks.onScreenshotDetected)
        }
        if (config.callbacks.onRecordingDetected) {
            screenProtector.on('onRecordingDetected', config.callbacks.onRecordingDetected)
        }
        if (config.callbacks.onProtectionEnabled) {
            screenProtector.on('onProtectionEnabled', config.callbacks.onProtectionEnabled)
        }
        if (config.callbacks.onProtectionDisabled) {
            screenProtector.on('onProtectionDisabled', config.callbacks.onProtectionDisabled)
        }

        // 全局混入
        app.mixin({
            onLoad() {
                this.$nextTick(() => {
                    this.handleScreenProtection('onLoad')
                })
            },

            onShow() {
                this.$nextTick(() => {
                    this.handleScreenProtection('onShow')
                })
            },

            onHide() {
                this.handleScreenProtection('onHide')
            },

            onUnload() {
                this.handleScreenProtection('onUnload')
            },

            mounted() {
                // 确保DOM准备好后再启用防护
                this.$nextTick(() => {
                    if (config.autoEnable) {
                        this.enableScreenProtection()
                    }
                })
            },

            methods: {
                /**
                 * 处理页面防录屏逻辑
                 */
                handleScreenProtection(lifecycle) {
                    const currentRoute = this.getCurrentRoute()

                    // 检查是否需要保护当前页面
                    if (this.shouldProtectPage(currentRoute)) {
                        if (lifecycle === 'onShow' || lifecycle === 'onLoad') {
                            this.enableScreenProtection()
                        }
                    } else {
                        if (lifecycle === 'onShow' || lifecycle === 'onLoad') {
                            this.disableScreenProtection()
                        }
                    }
                },

                /**
                 * 获取当前路由
                 */
                getCurrentRoute() {
                    const pages = getCurrentPages()
                    return pages.length > 0 ? pages[pages.length - 1].route : ''
                },

                /**
                 * 判断是否需要保护当前页面
                 */
                shouldProtectPage(route) {
                    const { protectedPaths, excludePaths } = config

                    // 如果在排除列表中，不保护
                    if (excludePaths.some(path => route.includes(path))) {
                        return false
                    }

                    // 如果指定了保护路径，只保护指定路径
                    if (protectedPaths.length > 0) {
                        return protectedPaths.some(path => route.includes(path))
                    }

                    // 默认保护所有页面
                    return true
                },

                /**
                 * 启用屏幕保护
                 */
                enableScreenProtection() {
                    if (config.autoEnable) {
                        screenProtector.enable({
                            level: config.protectionLevel,
                            showAlert: config.showAlert,
                            showWatermark: config.showWatermark,
                            watermarkText: config.watermarkText
                        })
                    }
                },

                /**
                 * 禁用屏幕保护
                 */
                disableScreenProtection() {
                    screenProtector.disable()
                },

                /**
                 * 手动启用保护
                 */
                $enableScreenProtection(options = {}) {
                    const mergedOptions = {
                        level: config.protectionLevel,
                        showAlert: config.showAlert,
                        showWatermark: config.showWatermark,
                        watermarkText: config.watermarkText,
                        ...options
                    }
                    return screenProtector.enable(mergedOptions)
                },

                /**
                 * 手动禁用保护
                 */
                $disableScreenProtection() {
                    return screenProtector.disable()
                },

                /**
                 * 获取保护状态
                 */
                $getScreenProtectionStatus() {
                    return screenProtector.getStatus()
                },

                /**
                 * 获取安全事件记录
                 */
                $getSecurityEvents() {
                    return screenProtector.getSecurityEvents()
                },

                /**
                 * 清除安全事件记录
                 */
                $clearSecurityEvents() {
                    return screenProtector.clearSecurityEvents()
                }
            }
        })

        console.log('✅ 防录屏插件安装完成')
        console.log('📋 配置信息:', config)
    }
}

/**
 * 页面防护装饰器
 * @param {Object} options 防护选项
 */
export function withScreenProtection(options = {}) {
    return function (pageConfig) {
        const originalOnShow = pageConfig.onShow
        const originalOnHide = pageConfig.onHide
        const originalOnLoad = pageConfig.onLoad
        const originalOnUnload = pageConfig.onUnload

        // 重写生命周期方法
        pageConfig.onLoad = function (...args) {
            // 启用防护
            if (screenProtector && !screenProtector.isEnabled) {
                screenProtector.enable(options)
            }

            // 调用原始方法
            if (originalOnLoad) {
                originalOnLoad.apply(this, args)
            }
        }

        pageConfig.onShow = function (...args) {
            // 确保防护已启用
            if (screenProtector && !screenProtector.isEnabled) {
                screenProtector.enable(options)
            }

            // 调用原始方法
            if (originalOnShow) {
                originalOnShow.apply(this, args)
            }
        }

        pageConfig.onHide = function (...args) {
            // 调用原始方法
            if (originalOnHide) {
                originalOnHide.apply(this, args)
            }
        }

        pageConfig.onUnload = function (...args) {
            // 根据配置决定是否禁用防护
            if (options.disableOnUnload !== false) {
                if (screenProtector && screenProtector.isEnabled) {
                    screenProtector.disable()
                }
            }

            // 调用原始方法
            if (originalOnUnload) {
                originalOnUnload.apply(this, args)
            }
        }

        return pageConfig
    }
}

/**
 * 防护组件混入
 */
export const screenProtectionMixin = {
    mounted() {
        if (this.$screenProtector && this.$screenProtectorConfig.autoEnable) {
            this.$enableScreenProtection()
        }
    },

    beforeUnmount() {
        if (this.$screenProtector) {
            this.$disableScreenProtection()
        }
    },

    methods: {
        /**
         * 临时禁用防护
         * @param {number} duration 禁用时长(毫秒)
         */
        $temporaryDisableProtection(duration = 5000) {
            this.$disableScreenProtection()

            setTimeout(() => {
                this.$enableScreenProtection()
            }, duration)
        },

        /**
         * 显示安全状态
         */
        $showSecurityStatus() {
            const status = this.$getScreenProtectionStatus()
            const events = this.$getSecurityEvents()

            uni.showModal({
                title: '安全状态',
                content: `
          防护状态: ${status.isEnabled ? '已启用' : '已禁用'}
          防护级别: ${status.protectionLevel}
          平台: ${status.platform}
          安全事件: ${events.length} 条记录
        `,
                showCancel: false
            })
        }
    }
}

export default ScreenProtectorPlugin

/**
 * 应用全局状态管理
 */
import { reactive, computed } from 'vue'

// 应用状态
const state = reactive({
    // 系统信息
    systemInfo: {},
    // 网络状态
    networkType: 'unknown',
    // 是否在线
    isOnline: true,
    // 应用主题
    theme: 'light',
    // 语言设置
    language: 'zh-CN',
    // 字体大小
    fontSize: 'normal',
    // 加载状态
    loading: false,
    // 错误信息
    error: null,
    // 页面栈
    pageStack: [],
    // 底部安全区域高度
    safeAreaBottom: 0,
    // 状态栏高度
    statusBarHeight: 0,
    // 导航栏高度
    navigationBarHeight: 44
})

// 计算属性
const getters = {
    // 获取窗口高度
    windowHeight: computed(() => state.systemInfo.windowHeight || 0),
    // 获取窗口宽度
    windowWidth: computed(() => state.systemInfo.windowWidth || 0),
    // 获取设备像素比
    pixelRatio: computed(() => state.systemInfo.pixelRatio || 1),
    // 是否为iPhone X以上机型
    isIPhoneX: computed(() => {
        if (!state.systemInfo.model) return false
        return /iPhone X|iPhone 1[1-9]|iPhone 2[0-9]/.test(state.systemInfo.model)
    }),
    // 获取平台信息
    platform: computed(() => state.systemInfo.platform || ''),
    // 是否为暗色主题
    isDarkTheme: computed(() => state.theme === 'dark'),
    // 是否有网络
    hasNetwork: computed(() => state.networkType !== 'none' && state.isOnline)
}

// 应用操作方法
const actions = {
    // 初始化应用
    async initApp() {
        try {
            // 获取系统信息
            const systemInfo = uni.getSystemInfoSync()
            state.systemInfo = systemInfo
            state.statusBarHeight = systemInfo.statusBarHeight || 0

            // 计算安全区域
            if (systemInfo.safeAreaInsets) {
                state.safeAreaBottom = systemInfo.safeAreaInsets.bottom || 0
            }

            // 监听网络状态
            this.watchNetworkStatus()

            // 加载用户设置
            this.loadUserSettings()

        } catch (error) {
            console.error('初始化应用失败:', error)
        }
    },

    // 监听网络状态
    watchNetworkStatus() {
        // 获取当前网络状态
        uni.getNetworkType({
            success: (res) => {
                state.networkType = res.networkType
                state.isOnline = res.networkType !== 'none'
            }
        })

        // 监听网络状态变化
        uni.onNetworkStatusChange((res) => {
            state.networkType = res.networkType
            state.isOnline = res.isConnected

            if (!res.isConnected) {
                uni.showToast({
                    title: '网络连接已断开',
                    icon: 'none'
                })
            }
        })
    },

    // 加载用户设置
    loadUserSettings() {
        try {
            const theme = uni.getStorageSync('app_theme') || 'light'
            const language = uni.getStorageSync('app_language') || 'zh-CN'
            const fontSize = uni.getStorageSync('app_fontSize') || 'normal'

            state.theme = theme
            state.language = language
            state.fontSize = fontSize

            // 应用主题
            this.applyTheme(theme)

        } catch (error) {
            console.error('加载用户设置失败:', error)
        }
    },

    // 设置主题
    setTheme(theme) {
        state.theme = theme
        uni.setStorageSync('app_theme', theme)
        this.applyTheme(theme)
    },

    // 应用主题
    applyTheme(theme) {
        // 这里可以设置全局CSS变量或类名
        const pages = getCurrentPages()
        if (pages.length > 0) {
            const currentPage = pages[pages.length - 1]
            if (currentPage.$vm) {
                currentPage.$vm.$el.setAttribute('data-theme', theme)
            }
        }
    },

    // 设置语言
    setLanguage(language) {
        state.language = language
        uni.setStorageSync('app_language', language)
    },

    // 设置字体大小
    setFontSize(fontSize) {
        state.fontSize = fontSize
        uni.setStorageSync('app_fontSize', fontSize)
    },

    // 显示加载
    showLoading(title = '加载中...') {
        state.loading = true
        uni.showLoading({
            title,
            mask: true
        })
    },

    // 隐藏加载
    hideLoading() {
        state.loading = false
        uni.hideLoading()
    },

    // 设置错误
    setError(error) {
        state.error = error
        if (error) {
            uni.showToast({
                title: error.message || '操作失败',
                icon: 'none'
            })
        }
    },

    // 清除错误
    clearError() {
        state.error = null
    },

    // 添加页面到栈
    pushPage(route) {
        state.pageStack.push({
            route,
            timestamp: Date.now()
        })
    },

    // 从栈中移除页面
    popPage() {
        return state.pageStack.pop()
    },

    // 清空页面栈
    clearPageStack() {
        state.pageStack = []
    },

    // 获取当前页面
    getCurrentPage() {
        return state.pageStack[state.pageStack.length - 1] || null
    },

    // 检查更新
    async checkUpdate() {
        try {
            const updateManager = uni.getUpdateManager()

            updateManager.onCheckForUpdate((res) => {
                if (res.hasUpdate) {
                    uni.showModal({
                        title: '发现新版本',
                        content: '发现新版本，是否立即更新？',
                        success: (res) => {
                            if (res.confirm) {
                                updateManager.onUpdateReady(() => {
                                    uni.showModal({
                                        title: '更新完成',
                                        content: '新版本已下载完成，是否立即重启应用？',
                                        success: (res) => {
                                            if (res.confirm) {
                                                updateManager.applyUpdate()
                                            }
                                        }
                                    })
                                })

                                updateManager.onUpdateFailed(() => {
                                    uni.showToast({
                                        title: '更新失败，请稍后重试',
                                        icon: 'none'
                                    })
                                })
                            }
                        }
                    })
                }
            })
        } catch (error) {
            console.error('检查更新失败:', error)
        }
    }
}

// 导出应用store
export const useAppStore = () => {
    return {
        state,
        getters,
        actions
    }
}

export default useAppStore
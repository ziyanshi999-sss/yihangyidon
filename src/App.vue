<script>
import { checkLoginAndRedirect, forceCheckLogin } from '@/utils/auth.js'
import themeManager from '@/utils/theme.js'

/**
 * 中国农业银行应用主入口
 * @description 管理应用全局状态和生命周期
 */
export default {
  name: 'App',

  onLaunch(options) {
    console.log('App Launch', options)

    // 初始化主题
    themeManager.init()

    // 检查更新
    this.checkUpdate()

    // 初始化用户信息
    this.initUserInfo()

    // 设置系统信息
    this.setSystemInfo()

    // 初始化网络状态监听
    this.initNetworkListener()

    // 初始化登录拦截
    this.initLoginInterceptor()
  },

  onShow(options) {
    console.log('App Show', options)

    // 检查登录状态
    this.checkLoginStatus()

    // 恢复应用状态
    this.restoreAppState()

    // 全局登录拦截检查
    this.globalLoginCheck()
  },

  onHide() {
    console.log('App Hide')

    // 保存应用状态
    this.saveAppState()
  },

  onError(error) {
    console.error('App Error:', error)

    // 错误上报
    this.reportError(error)
  },

  onPageNotFound(options) {
    console.log('Page Not Found:', options)

    // 跳转到404页面或首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  },

  methods: {
    /**
     * 检查应用更新
     */
    checkUpdate() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
        console.log('当前应用版本:', widgetInfo.version)
        // 这里可以添加版本检查逻辑
      })
      // #endif
    },

    /**
     * 初始化用户信息
     */
    initUserInfo() {
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          this.globalData.userInfo = userInfo
          console.log('用户信息已恢复:', userInfo)
        }
      } catch (error) {
        console.error('恢复用户信息失败:', error)
      }
    },

    /**
     * 设置系统信息
     */
    setSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.globalData.systemInfo = systemInfo
        console.log('系统信息:', systemInfo)
      } catch (error) {
        console.error('获取系统信息失败:', error)
      }
    },

    /**
     * 初始化网络状态监听
     */
    initNetworkListener() {
      uni.onNetworkStatusChange(res => {
        console.log('网络状态变化:', res)
        this.globalData.networkType = res.networkType
        this.globalData.isConnected = res.isConnected

        if (!res.isConnected) {
          uni.showToast({
            title: '网络连接已断开',
            icon: 'none'
          })
        }
      })
    },

    /**
     * 检查登录状态
     */
    checkLoginStatus() {
      // 使用强制检查登录状态
      if (!forceCheckLogin()) {
        // 如果未登录且不在登录页面，强制跳转到登录页
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        if (currentPage && !currentPage.route.includes('login')) {
          console.log('应用启动时检测到未登录，强制跳转到登录页面')
          uni.reLaunch({
            url: '/pages/denglu/login'
          })
        }
      }
    },

    /**
     * 初始化登录拦截器
     */
    initLoginInterceptor() {
      // 拦截页面跳转
      uni.addInterceptor('navigateTo', {
        invoke(e) {
          console.log('拦截 navigateTo:', e.url)
          
          // 检查是否为登录页面或注册页面
          if (e.url.includes('/pages/denglu/login') || e.url.includes('/pages/register/register')) {
            console.log('跳转到登录页面或注册页面，允许')
            return true
          }
          
          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log('用户未登录，阻止页面跳转')
            return false
          }
          
          return true
        }
      })

      // 拦截tabBar页面跳转
      uni.addInterceptor('switchTab', {
        invoke(e) {
          console.log('拦截 switchTab:', e.url)
          
          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log('用户未登录，阻止tabBar跳转')
            return false
          }
          
          return true
        }
      })

      // 拦截重定向
      uni.addInterceptor('reLaunch', {
        invoke(e) {
          console.log('拦截 reLaunch:', e.url)
          
          // 检查是否为登录页面或注册页面
          if (e.url.includes('/pages/denglu/login') || e.url.includes('/pages/register/register')) {
            console.log('重定向到登录页面或注册页面，允许')
            return true
          }
          
          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log('用户未登录，阻止重定向')
            return false
          }
          
          return true
        }
      })

      // 拦截redirectTo
      uni.addInterceptor('redirectTo', {
        invoke(e) {
          console.log('拦截 redirectTo:', e.url)
          
          // 检查是否为登录页面或注册页面
          if (e.url.includes('/pages/denglu/login') || e.url.includes('/pages/register/register')) {
            console.log('重定向到登录页面或注册页面，允许')
            return true
          }
          
          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log('用户未登录，阻止重定向')
            return false
          }
          
          return true
        }
      })
    },

    /**
     * 全局登录检查
     */
    globalLoginCheck() {
      // 使用强制检查，确保退出后立即生效
      if (!forceCheckLogin()) {
        checkLoginAndRedirect()
      }
    },

    /**
     * 保存应用状态
     */
    saveAppState() {
      try {
        const appState = {
          timestamp: Date.now(),
          userInfo: this.globalData.userInfo
        }
        uni.setStorageSync('appState', appState)
      } catch (error) {
        console.error('保存应用状态失败:', error)
      }
    },

    /**
     * 恢复应用状态
     */
    restoreAppState() {
      try {
        const appState = uni.getStorageSync('appState')
        if (appState) {
          // 检查状态是否过期（24小时）
          const isExpired = Date.now() - appState.timestamp > 24 * 60 * 60 * 1000
          if (!isExpired) {
            this.globalData.userInfo = appState.userInfo
          }
        }
      } catch (error) {
        console.error('恢复应用状态失败:', error)
      }
    },

    /**
     * 错误上报
     */
    reportError(error) {
      // 这里可以集成错误上报服务
      console.error('错误上报:', error)
    }
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    systemInfo: null,
    networkType: 'unknown',
    isConnected: true
  }
}
</script>

<style>
/* 重置默认样式（WXSS兼容写法） */
page, view {
  box-sizing: border-box;
}

page {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 通用容器样式 */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 卡片样式 */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 16px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

/* 输入框样式 */
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 文本样式 */
.text-primary {
  color: #667eea;
}

.text-secondary {
  color: #666;
}

.text-success {
  color: #27ae60;
}

.text-danger {
  color: #e74c3c;
}

.text-warning {
  color: #f39c12;
}

/* 间距工具类 */
.mt-1 {
  margin-top: 8px;
}
.mt-2 {
  margin-top: 16px;
}
.mt-3 {
  margin-top: 24px;
}
.mt-4 {
  margin-top: 32px;
}

.mb-1 {
  margin-bottom: 8px;
}
.mb-2 {
  margin-bottom: 16px;
}
.mb-3 {
  margin-bottom: 24px;
}
.mb-4 {
  margin-bottom: 32px;
}

.ml-1 {
  margin-left: 8px;
}
.ml-2 {
  margin-left: 16px;
}
.ml-3 {
  margin-left: 24px;
}

.mr-1 {
  margin-right: 8px;
}
.mr-2 {
  margin-right: 16px;
}
.mr-3 {
  margin-right: 24px;
}

.pt-1 {
  padding-top: 8px;
}
.pt-2 {
  padding-top: 16px;
}
.pt-3 {
  padding-top: 24px;
}

.pb-1 {
  padding-bottom: 8px;
}
.pb-2 {
  padding-bottom: 16px;
}
.pb-3 {
  padding-bottom: 24px;
}

.px-1 {
  padding-left: 8px;
  padding-right: 8px;
}
.px-2 {
  padding-left: 16px;
  padding-right: 16px;
}
.px-3 {
  padding-left: 24px;
  padding-right: 24px;
}

.py-1 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.py-2 {
  padding-top: 16px;
  padding-bottom: 16px;
}
.py-3 {
  padding-top: 24px;
  padding-bottom: 24px;
}

/* 布局工具类 */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.flex-1 {
  flex: 1;
}

/* 文本对齐 */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

/* 字体大小 */
.text-sm {
  font-size: 14px;
}

.text-base {
  font-size: 16px;
}

.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-2xl {
  font-size: 24px;
}

/* 字体粗细 */
.font-normal {
  font-weight: 400;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

/* 圆角 */
.rounded {
  border-radius: 8px;
}

.rounded-lg {
  border-radius: 12px;
}

.rounded-full {
  border-radius: 50%;
}

/* 阴影 */
.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .card {
    padding: 16px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 加载状态 */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

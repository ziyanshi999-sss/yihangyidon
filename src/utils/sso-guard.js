/**
 * SSO路由守卫
 * 用于保护需要认证的页面和检查用户权限
 */

import BankSSOClient from './sso-client.js'

class SSOGuard {
  constructor() {
    this.ssoClient = null
    this.publicPages = [
      '/pages/denglu/login',
      '/pages/register/register',
      '/pages/help/help-center',
      '/pages/help/help-detail'
    ]
    
    this.init()
  }
  
  init() {
    this.ssoClient = new BankSSOClient({
      authServerUrl: this.getAuthServerUrl(),
      appId: 'bank-mobile-app'
    })
    
    // 监听页面跳转
    this.setupNavigationGuard()
  }
  
  setupNavigationGuard() {
    // 重写uni.navigateTo
    const originalNavigateTo = uni.navigateTo
    uni.navigateTo = async (options) => {
      const result = await this.beforeNavigation(options)
      if (result.allowed) {
        return originalNavigateTo.call(uni, result.options || options)
      }
    }
    
    // 重写uni.redirectTo
    const originalRedirectTo = uni.redirectTo
    uni.redirectTo = async (options) => {
      const result = await this.beforeNavigation(options)
      if (result.allowed) {
        return originalRedirectTo.call(uni, result.options || options)
      }
    }
    
    // 重写uni.reLaunch
    const originalReLaunch = uni.reLaunch
    uni.reLaunch = async (options) => {
      const result = await this.beforeNavigation(options)
      if (result.allowed) {
        return originalReLaunch.call(uni, result.options || options)
      }
    }
    
    // 重写uni.switchTab
    const originalSwitchTab = uni.switchTab
    uni.switchTab = async (options) => {
      const result = await this.beforeNavigation(options)
      if (result.allowed) {
        return originalSwitchTab.call(uni, result.options || options)
      }
    }
  }
  
  async beforeNavigation(options) {
    const url = options.url
    const targetPage = this.extractPagePath(url)
    
    // 检查是否为公开页面
    if (this.isPublicPage(targetPage)) {
      return { allowed: true }
    }
    
    // 检查认证状态
    const authStatus = await this.ssoClient.checkAuthStatus()
    
    if (!authStatus.isAuthenticated) {
      // 未认证，重定向到登录页
      this.redirectToLogin(url)
      return { allowed: false }
    }
    
    // 检查页面权限
    const permissionCheck = await this.checkPagePermission(targetPage, authStatus.user)
    
    if (!permissionCheck.allowed) {
      this.handlePermissionDenied(permissionCheck.reason, targetPage)
      return { allowed: false }
    }
    
    return { allowed: true }
  }
  
  extractPagePath(url) {
    // 提取页面路径，去除参数
    const path = url.split('?')[0]
    return path.startsWith('/') ? path : `/${path}`
  }
  
  isPublicPage(pagePath) {
    return this.publicPages.includes(pagePath)
  }
  
  async checkPagePermission(pagePath, user) {
    // 定义页面权限规则
    const pagePermissions = {
      '/pages/user/security': ['user.security'],
      '/pages/user/security-logs': ['user.security', 'admin'],
      '/pages/loan/loan-application': ['loan.apply'],
      '/pages/wealth/ai-wealth-manager': ['wealth.premium'],
      '/pages/credit-card/credit-card': ['card.manage'],
      '/pages/transfer/transfer': ['transfer.send'],
      '/pages/payment/payment': ['payment.make'],
      '/pages/test/*': ['admin', 'developer']
    }
    
    // 检查是否需要特定权限
    const requiredPermissions = this.getRequiredPermissions(pagePath, pagePermissions)
    
    if (requiredPermissions.length === 0) {
      // 无特殊权限要求，只需登录即可
      return { allowed: true }
    }
    
    // 检查用户权限
    try {
      const userPermissions = await this.ssoClient.getUserPermissions()
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      )
      
      if (hasPermission) {
        return { allowed: true }
      } else {
        return { 
          allowed: false, 
          reason: 'insufficient_permissions',
          required: requiredPermissions
        }
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      return { 
        allowed: false, 
        reason: 'permission_check_failed' 
      }
    }
  }
  
  getRequiredPermissions(pagePath, pagePermissions) {
    // 精确匹配
    if (pagePermissions[pagePath]) {
      return pagePermissions[pagePath]
    }
    
    // 通配符匹配
    for (const [pattern, permissions] of Object.entries(pagePermissions)) {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'))
        if (regex.test(pagePath)) {
          return permissions
        }
      }
    }
    
    return []
  }
  
  redirectToLogin(originalUrl) {
    const loginUrl = `/pages/denglu/login?redirect=${encodeURIComponent(originalUrl)}`
    
    uni.reLaunch({
      url: loginUrl,
      fail: (error) => {
        console.error('Redirect to login failed:', error)
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    })
  }
  
  handlePermissionDenied(reason, targetPage) {
    let message = '访问被拒绝'
    
    switch (reason) {
      case 'insufficient_permissions':
        message = '您没有访问此功能的权限'
        break
      case 'permission_check_failed':
        message = '权限验证失败，请重试'
        break
      default:
        message = '访问被拒绝'
    }
    
    uni.showModal({
      title: '访问限制',
      content: message,
      showCancel: true,
      cancelText: '返回',
      confirmText: '联系客服',
      success: (res) => {
        if (res.confirm) {
          // 跳转到客服页面
          uni.navigateTo({
            url: '/pages/service/chat'
          })
        } else {
          // 返回上一页
          uni.navigateBack({
            fail: () => {
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
        }
      }
    })
  }
  
  getAuthServerUrl() {
    // 根据环境返回不同的认证服务器地址
    // #ifdef H5
    if (location.hostname === 'localhost') {
      return 'http://localhost:3001'
    }
    // #endif
    
    return 'https://auth.bank.com'
  }
  
  // 手动检查当前页面权限
  async checkCurrentPagePermission() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const pagePath = `/${currentPage.route}`
    
    const authStatus = await this.ssoClient.checkAuthStatus()
    
    if (!authStatus.isAuthenticated) {
      this.redirectToLogin(pagePath)
      return false
    }
    
    const permissionCheck = await this.checkPagePermission(pagePath, authStatus.user)
    
    if (!permissionCheck.allowed) {
      this.handlePermissionDenied(permissionCheck.reason, pagePath)
      return false
    }
    
    return true
  }
  
  // 检查特定权限
  async hasPermission(permission) {
    try {
      return await this.ssoClient.hasPermission(permission)
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }
  
  // 获取当前用户信息
  async getCurrentUser() {
    const authStatus = await this.ssoClient.checkAuthStatus()
    return authStatus.isAuthenticated ? authStatus.user : null
  }
  
  // 强制重新认证
  async forceReauth() {
    this.ssoClient.clearAuthData()
    this.redirectToLogin(getCurrentPages()[getCurrentPages().length - 1].route)
  }
}

// 创建全局实例
const ssoGuard = new SSOGuard()

// 页面级守卫混入
export const pageGuardMixin = {
  async onLoad() {
    // 检查当前页面权限
    const hasAccess = await ssoGuard.checkCurrentPagePermission()
    if (!hasAccess) {
      return
    }
    
    // 调用原始的onLoad
    if (this.$options.onLoad && this.$options.onLoad !== pageGuardMixin.onLoad) {
      this.$options.onLoad.call(this, ...arguments)
    }
  }
}

// 权限指令（用于条件显示UI元素）
export const permissionDirective = {
  bind(el, binding) {
    const permission = binding.value
    if (permission) {
      ssoGuard.hasPermission(permission).then(hasPermission => {
        if (!hasPermission) {
          el.style.display = 'none'
        }
      })
    }
  }
}

// 便捷方法
export const requireAuth = async () => {
  const authStatus = await ssoGuard.ssoClient.checkAuthStatus()
  if (!authStatus.isAuthenticated) {
    ssoGuard.redirectToLogin(getCurrentPages()[getCurrentPages().length - 1].route)
    return false
  }
  return true
}

export const requirePermission = async (permission, options = {}) => {
  const hasPermission = await ssoGuard.hasPermission(permission)
  if (!hasPermission) {
    const message = options.message || `您没有 ${permission} 权限`
    uni.showToast({
      title: message,
      icon: 'none'
    })
    return false
  }
  return true
}

export const getCurrentUser = () => ssoGuard.getCurrentUser()

export const logout = () => ssoGuard.ssoClient.logout()

export default ssoGuard

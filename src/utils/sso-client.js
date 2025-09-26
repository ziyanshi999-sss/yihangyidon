/**
 * 银行APP SSO客户端
 * 支持与统一认证中心的集成
 */

class BankSSOClient {
  constructor(options = {}) {
    this.authServerUrl = options.authServerUrl || 'https://auth.bank.com'
    this.appId = options.appId || 'bank-mobile-app'
    this.tokenKey = 'bank_sso_token'
    this.userKey = 'bank_sso_user'
    this.refreshTokenKey = 'bank_sso_refresh_token'
    
    // 配置项
    this.config = {
      tokenExpireBuffer: 5 * 60 * 1000, // 5分钟缓冲时间
      maxRetryCount: 3,
      retryDelay: 1000,
      ...options.config
    }
    
    // 回调函数
    this.onTokenExpired = options.onTokenExpired || null
    this.onLoginSuccess = options.onLoginSuccess || null
    this.onLogout = options.onLogout || null
    
    this.init()
  }
  
  init() {
    // 设置定时检查token过期
    this.setupTokenExpirationCheck()
    
    // 设置跨应用通信监听
    this.setupCrossAppCommunication()
    
    // 页面可见性变化时检查认证状态
    this.setupVisibilityChangeHandler()
  }
  
  /**
   * 检查当前登录状态
   */
  async checkAuthStatus() {
    const token = this.getToken()
    
    if (!token) {
      return { isAuthenticated: false, reason: 'no_token' }
    }
    
    // 检查token是否即将过期
    if (this.isTokenNearExpiration(token)) {
      const refreshed = await this.refreshToken()
      if (!refreshed) {
        return { isAuthenticated: false, reason: 'token_expired' }
      }
    }
    
    try {
      const response = await this.makeAuthenticatedRequest('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token: this.getToken() })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 更新用户信息
        this.setUser(result.user)
        
        return {
          isAuthenticated: true,
          user: result.user,
          permissions: result.permissions || []
        }
      } else {
        this.clearAuthData()
        return { 
          isAuthenticated: false, 
          reason: result.error || 'verification_failed' 
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      return { 
        isAuthenticated: false, 
        reason: 'network_error',
        error: error.message 
      }
    }
  }
  
  /**
   * 用户登录
   */
  async login(credentials) {
    try {
      const response = await fetch(`${this.authServerUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': this.appId
        },
        body: JSON.stringify({
          ...credentials,
          appId: this.appId,
          deviceInfo: this.getDeviceInfo()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 保存认证信息
        this.setToken(result.token)
        this.setRefreshToken(result.refreshToken)
        this.setUser(result.user)
        
        // 触发登录成功回调
        if (this.onLoginSuccess) {
          this.onLoginSuccess(result.user)
        }
        
        // 通知其他应用
        this.notifyOtherApps('login', {
          user: result.user,
          timestamp: Date.now()
        })
        
        return {
          success: true,
          user: result.user,
          permissions: result.permissions || []
        }
      } else {
        return {
          success: false,
          error: result.error,
          code: result.code
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: 'network_error',
        message: error.message
      }
    }
  }
  
  /**
   * 用户登出
   */
  async logout(notifyServer = true) {
    const token = this.getToken()
    
    if (notifyServer && token) {
      try {
        await this.makeAuthenticatedRequest('/auth/logout', {
          method: 'POST'
        })
      } catch (error) {
        console.warn('Server logout notification failed:', error)
      }
    }
    
    // 清除本地认证数据
    this.clearAuthData()
    
    // 触发登出回调
    if (this.onLogout) {
      this.onLogout()
    }
    
    // 通知其他应用
    this.notifyOtherApps('logout', {
      timestamp: Date.now()
    })
  }
  
  /**
   * 刷新访问令牌
   */
  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      return false
    }
    
    try {
      const response = await fetch(`${this.authServerUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': this.appId
        },
        body: JSON.stringify({
          refreshToken,
          appId: this.appId
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        this.setToken(result.token)
        if (result.refreshToken) {
          this.setRefreshToken(result.refreshToken)
        }
        return true
      } else {
        this.clearAuthData()
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearAuthData()
      return false
    }
  }
  
  /**
   * 发起认证请求
   */
  async makeAuthenticatedRequest(endpoint, options = {}) {
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-ID': this.appId
      }
    }
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    }
    
    const response = await fetch(`${this.authServerUrl}${endpoint}`, mergedOptions)
    
    // 处理token过期
    if (response.status === 401) {
      const refreshed = await this.refreshToken()
      if (refreshed) {
        // 重新发起请求
        mergedOptions.headers.Authorization = `Bearer ${this.getToken()}`
        return fetch(`${this.authServerUrl}${endpoint}`, mergedOptions)
      } else {
        throw new Error('Authentication failed')
      }
    }
    
    return response
  }
  
  /**
   * 获取用户权限
   */
  async getUserPermissions() {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/permissions')
      const result = await response.json()
      
      if (result.success) {
        return result.permissions || []
      }
      return []
    } catch (error) {
      console.error('Failed to get user permissions:', error)
      return []
    }
  }
  
  /**
   * 检查用户是否有特定权限
   */
  async hasPermission(permission) {
    const permissions = await this.getUserPermissions()
    return permissions.includes(permission)
  }
  
  // Token 管理方法
  setToken(token) {
    try {
      uni.setStorageSync(this.tokenKey, token)
    } catch (error) {
      localStorage.setItem(this.tokenKey, token)
    }
  }
  
  getToken() {
    try {
      return uni.getStorageSync(this.tokenKey)
    } catch (error) {
      return localStorage.getItem(this.tokenKey)
    }
  }
  
  setRefreshToken(refreshToken) {
    try {
      uni.setStorageSync(this.refreshTokenKey, refreshToken)
    } catch (error) {
      localStorage.setItem(this.refreshTokenKey, refreshToken)
    }
  }
  
  getRefreshToken() {
    try {
      return uni.getStorageSync(this.refreshTokenKey)
    } catch (error) {
      return localStorage.getItem(this.refreshTokenKey)
    }
  }
  
  setUser(user) {
    try {
      uni.setStorageSync(this.userKey, JSON.stringify(user))
    } catch (error) {
      localStorage.setItem(this.userKey, JSON.stringify(user))
    }
  }
  
  getUser() {
    try {
      const userStr = uni.getStorageSync(this.userKey)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      const userStr = localStorage.getItem(this.userKey)
      return userStr ? JSON.parse(userStr) : null
    }
  }
  
  clearAuthData() {
    try {
      uni.removeStorageSync(this.tokenKey)
      uni.removeStorageSync(this.refreshTokenKey)
      uni.removeStorageSync(this.userKey)
    } catch (error) {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.refreshTokenKey)
      localStorage.removeItem(this.userKey)
    }
  }
  
  // 工具方法
  isTokenNearExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()
      
      return (expirationTime - currentTime) < this.config.tokenExpireBuffer
    } catch (error) {
      return true // 如果无法解析，认为已过期
    }
  }
  
  getDeviceInfo() {
    // #ifdef APP-PLUS
    return {
      platform: 'app',
      model: plus.device.model,
      uuid: plus.device.uuid,
      version: plus.runtime.version
    }
    // #endif
    
    // #ifdef H5
    return {
      platform: 'h5',
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`
    }
    // #endif
    
    // #ifdef MP-WEIXIN
    return {
      platform: 'mp-weixin',
      version: wx.getSystemInfoSync().version
    }
    // #endif
    
    return {
      platform: 'unknown'
    }
  }
  
  // 定时检查token过期
  setupTokenExpirationCheck() {
    setInterval(async () => {
      const token = this.getToken()
      if (token && this.isTokenNearExpiration(token)) {
        const refreshed = await this.refreshToken()
        if (!refreshed && this.onTokenExpired) {
          this.onTokenExpired()
        }
      }
    }, 60000) // 每分钟检查一次
  }
  
  // 跨应用通信
  setupCrossAppCommunication() {
    // #ifdef H5
    window.addEventListener('storage', (e) => {
      if (e.key === 'bank_sso_message' && e.newValue) {
        try {
          const message = JSON.parse(e.newValue)
          if (message.appId !== this.appId) {
            this.handleCrossAppMessage(message)
          }
        } catch (error) {
          console.error('Failed to parse cross-app message:', error)
        }
      }
    })
    // #endif
  }
  
  notifyOtherApps(action, data = {}) {
    const message = {
      action,
      data,
      timestamp: Date.now(),
      appId: this.appId
    }
    
    // #ifdef H5
    try {
      localStorage.setItem('bank_sso_message', JSON.stringify(message))
      localStorage.removeItem('bank_sso_message')
    } catch (error) {
      console.error('Failed to notify other apps:', error)
    }
    // #endif
  }
  
  handleCrossAppMessage(message) {
    switch (message.action) {
      case 'logout':
        this.clearAuthData()
        if (this.onLogout) {
          this.onLogout()
        }
        break
      case 'login':
        if (this.onLoginSuccess) {
          this.onLoginSuccess(message.data.user)
        }
        break
    }
  }
  
  // 页面可见性变化处理
  setupVisibilityChangeHandler() {
    // #ifdef H5
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        // 页面变为可见时，检查认证状态
        const authStatus = await this.checkAuthStatus()
        if (!authStatus.isAuthenticated && this.onTokenExpired) {
          this.onTokenExpired()
        }
      }
    })
    // #endif
  }
}

export default BankSSOClient

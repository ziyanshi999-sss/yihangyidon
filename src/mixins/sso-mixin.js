/**
 * SSO认证混入
 * 提供统一的认证状态管理和权限检查
 */

import BankSSOClient from '@/utils/sso-client.js'

export default {
  data() {
    return {
      ssoClient: null,
      isAuthenticated: false,
      currentUser: null,
      userPermissions: [],
      authLoading: true
    }
  },
  
  async created() {
    await this.initSSO()
  },
  
  methods: {
    /**
     * 初始化SSO客户端
     */
    async initSSO() {
      this.ssoClient = new BankSSOClient({
        authServerUrl: this.getAuthServerUrl(),
        appId: 'bank-mobile-app',
        config: {
          tokenExpireBuffer: 5 * 60 * 1000, // 5分钟
          maxRetryCount: 3
        },
        onTokenExpired: this.handleTokenExpired,
        onLoginSuccess: this.handleLoginSuccess,
        onLogout: this.handleLogout
      })
      
      // 检查当前认证状态
      await this.checkAuthenticationStatus()
    },
    
    /**
     * 检查认证状态
     */
    async checkAuthenticationStatus() {
      this.authLoading = true
      
      try {
        const authStatus = await this.ssoClient.checkAuthStatus()
        
        this.isAuthenticated = authStatus.isAuthenticated
        this.currentUser = authStatus.user || null
        this.userPermissions = authStatus.permissions || []
        
        if (!authStatus.isAuthenticated) {
          this.handleAuthenticationFailure(authStatus.reason)
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        this.isAuthenticated = false
        this.currentUser = null
        this.userPermissions = []
      } finally {
        this.authLoading = false
      }
    },
    
    /**
     * 执行登录
     */
    async performLogin(credentials) {
      try {
        uni.showLoading({ title: '登录中...' })
        
        const result = await this.ssoClient.login(credentials)
        
        if (result.success) {
          this.isAuthenticated = true
          this.currentUser = result.user
          this.userPermissions = result.permissions || []
          
          uni.hideLoading()
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          return { success: true, user: result.user }
        } else {
          uni.hideLoading()
          uni.showToast({
            title: result.error || '登录失败',
            icon: 'error'
          })
          
          return { success: false, error: result.error }
        }
      } catch (error) {
        uni.hideLoading()
        console.error('Login error:', error)
        
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        })
        
        return { success: false, error: 'network_error' }
      }
    },
    
    /**
     * 执行登出
     */
    async performLogout(showConfirm = true) {
      if (showConfirm) {
        const result = await new Promise((resolve) => {
          uni.showModal({
            title: '确认登出',
            content: '您确定要退出登录吗？',
            success: (res) => resolve(res.confirm),
            fail: () => resolve(false)
          })
        })
        
        if (!result) return
      }
      
      try {
        uni.showLoading({ title: '退出中...' })
        
        await this.ssoClient.logout(true)
        
        this.isAuthenticated = false
        this.currentUser = null
        this.userPermissions = []
        
        uni.hideLoading()
        
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      } catch (error) {
        uni.hideLoading()
        console.error('Logout error:', error)
        
        // 即使服务器通知失败，也要清除本地状态
        this.ssoClient.clearAuthData()
        this.isAuthenticated = false
        this.currentUser = null
        this.userPermissions = []
        
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      }
    },
    
    /**
     * 检查用户权限
     */
    async checkPermission(permission) {
      if (!this.isAuthenticated) {
        return false
      }
      
      try {
        return await this.ssoClient.hasPermission(permission)
      } catch (error) {
        console.error('Permission check failed:', error)
        return false
      }
    },
    
    /**
     * 检查多个权限（需要全部具备）
     */
    async checkAllPermissions(permissions) {
      for (const permission of permissions) {
        const hasPermission = await this.checkPermission(permission)
        if (!hasPermission) {
          return false
        }
      }
      return true
    },
    
    /**
     * 检查多个权限（具备任一即可）
     */
    async checkAnyPermission(permissions) {
      for (const permission of permissions) {
        const hasPermission = await this.checkPermission(permission)
        if (hasPermission) {
          return true
        }
      }
      return false
    },
    
    /**
     * 权限守卫 - 检查权限，无权限时显示提示或跳转
     */
    async requirePermission(permission, options = {}) {
      const hasPermission = await this.checkPermission(permission)
      
      if (!hasPermission) {
        const message = options.message || '您没有访问此功能的权限'
        const redirectUrl = options.redirectUrl
        
        if (redirectUrl) {
          uni.showModal({
            title: '权限不足',
            content: message,
            showCancel: false,
            success: () => {
              uni.navigateTo({ url: redirectUrl })
            }
          })
        } else {
          uni.showToast({
            title: message,
            icon: 'none',
            duration: 3000
          })
        }
        
        return false
      }
      
      return true
    },
    
    /**
     * 发起认证请求
     */
    async makeAuthenticatedRequest(endpoint, options = {}) {
      try {
        const response = await this.ssoClient.makeAuthenticatedRequest(endpoint, options)
        return response
      } catch (error) {
        if (error.message === 'Authentication failed') {
          this.handleTokenExpired()
        }
        throw error
      }
    },
    
    /**
     * 获取认证服务器地址
     */
    getAuthServerUrl() {
      // 根据环境返回不同的认证服务器地址
      // #ifdef H5
      if (location.hostname === 'localhost') {
        return 'http://localhost:3001'
      }
      // #endif
      
      return 'https://auth.bank.com'
    },
    
    /**
     * Token过期处理
     */
    handleTokenExpired() {
      this.isAuthenticated = false
      this.currentUser = null
      this.userPermissions = []
      
      uni.showModal({
        title: '登录已过期',
        content: '您的登录状态已过期，请重新登录',
        showCancel: false,
        success: () => {
          uni.reLaunch({
            url: '/pages/denglu/login'
          })
        }
      })
    },
    
    /**
     * 登录成功处理
     */
    handleLoginSuccess(user) {
      console.log('User logged in from another app:', user)
      this.isAuthenticated = true
      this.currentUser = user
      
      // 可以在这里刷新当前页面数据
      if (this.onUserLogin) {
        this.onUserLogin(user)
      }
    },
    
    /**
     * 登出处理
     */
    handleLogout() {
      console.log('User logged out from another app')
      this.isAuthenticated = false
      this.currentUser = null
      this.userPermissions = []
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    },
    
    /**
     * 认证失败处理
     */
    handleAuthenticationFailure(reason) {
      console.log('Authentication failed:', reason)
      
      // 根据失败原因进行不同处理
      switch (reason) {
        case 'no_token':
          // 没有token，正常情况，不需要特殊处理
          break
        case 'token_expired':
          this.handleTokenExpired()
          break
        case 'verification_failed':
          uni.showToast({
            title: '身份验证失败',
            icon: 'error'
          })
          break
        case 'network_error':
          uni.showToast({
            title: '网络连接失败',
            icon: 'error'
          })
          break
        default:
          console.warn('Unknown authentication failure reason:', reason)
      }
    },
    
    /**
     * 获取用户信息
     */
    getUserInfo() {
      return this.currentUser
    },
    
    /**
     * 获取用户ID
     */
    getUserId() {
      return this.currentUser ? this.currentUser.id : null
    },
    
    /**
     * 获取用户名
     */
    getUsername() {
      return this.currentUser ? this.currentUser.username : null
    },
    
    /**
     * 检查是否为管理员
     */
    isAdmin() {
      return this.userPermissions.includes('admin') || 
             (this.currentUser && this.currentUser.role === 'admin')
    },
    
    /**
     * 检查是否为VIP用户
     */
    isVIP() {
      return this.userPermissions.includes('vip') || 
             (this.currentUser && this.currentUser.isVIP)
    }
  },
  
  computed: {
    /**
     * 是否已认证
     */
    authenticated() {
      return this.isAuthenticated
    },
    
    /**
     * 用户显示名称
     */
    userDisplayName() {
      if (!this.currentUser) return ''
      return this.currentUser.displayName || this.currentUser.username || this.currentUser.name || ''
    },
    
    /**
     * 用户头像
     */
    userAvatar() {
      if (!this.currentUser) return ''
      return this.currentUser.avatar || '/static/default-avatar.png'
    }
  }
}

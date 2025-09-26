<template>
  <view class="sso-login-container">
    <!-- SSO状态指示器 -->
    <view class="sso-status" v-if="showSSOStatus">
      <view class="status-indicator" :class="ssoStatusClass">
        <text class="status-icon">{{ ssoStatusIcon }}</text>
        <text class="status-text">{{ ssoStatusText }}</text>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="login-form" v-if="!authLoading">
      <!-- 账号密码登录 -->
      <view v-if="loginMethod === 'password'" class="form-section">
        <view class="input-group">
          <view class="input-label">
            <text class="label-icon">👤</text>
            <text class="label-text">账号</text>
          </view>
          <input 
            class="form-input"
            type="text"
            v-model="credentials.username"
            placeholder="请输入用户名/手机号/身份证号"
            maxlength="50"
          />
        </view>
        
        <view class="input-group">
          <view class="input-label">
            <text class="label-icon">🔐</text>
            <text class="label-text">密码</text>
          </view>
          <input 
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="credentials.password"
            placeholder="请输入登录密码"
            maxlength="20"
          />
          <view class="password-toggle" @tap="showPassword = !showPassword">
            <text class="toggle-icon">{{ showPassword ? '👁️' : '🙈' }}</text>
          </view>
        </view>
        
        <!-- 记住登录状态 -->
        <view class="remember-section">
          <view class="remember-item" @tap="rememberMe = !rememberMe">
            <view class="checkbox" :class="{ checked: rememberMe }">
              <text class="check-icon" v-if="rememberMe">✓</text>
            </view>
            <text class="remember-text">记住登录状态</text>
          </view>
          <text class="forgot-password" @tap="handleForgotPassword">忘记密码？</text>
        </view>
      </view>

      <!-- 手机验证码登录 -->
      <view v-if="loginMethod === 'sms'" class="form-section">
        <view class="input-group">
          <view class="input-label">
            <text class="label-icon">📱</text>
            <text class="label-text">手机号</text>
          </view>
          <input 
            class="form-input"
            type="number"
            v-model="credentials.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        
        <view class="input-group">
          <view class="input-label">
            <text class="label-icon">💬</text>
            <text class="label-text">验证码</text>
          </view>
          <input 
            class="form-input code-input"
            type="number"
            v-model="credentials.smsCode"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <button 
            class="send-code-btn" 
            :disabled="!canSendCode || sendingCode"
            @tap="sendSMSCode"
          >
            {{ sendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s` : '获取验证码') }}
          </button>
        </view>
      </view>

      <!-- 生物识别登录 -->
      <view v-if="loginMethod === 'biometric'" class="form-section biometric-section">
        <view class="biometric-container">
          <view class="biometric-icon" @tap="performBiometricLogin">
            <text class="bio-icon">{{ biometricIcon }}</text>
          </view>
          <text class="biometric-text">{{ biometricText }}</text>
          <text class="biometric-hint">轻触图标进行{{ biometricTypeText }}验证</text>
        </view>
        
        <view class="fallback-section">
          <text class="fallback-text" @tap="loginMethod = 'password'">使用密码登录</text>
        </view>
      </view>

      <!-- 登录方式切换 -->
      <view class="method-switch">
        <view 
          class="method-item" 
          :class="{ active: loginMethod === 'password' }"
          @tap="loginMethod = 'password'"
        >
          <text class="method-icon">🔐</text>
          <text class="method-text">密码</text>
        </view>
        <view 
          class="method-item" 
          :class="{ active: loginMethod === 'sms' }"
          @tap="loginMethod = 'sms'"
        >
          <text class="method-icon">📱</text>
          <text class="method-text">短信</text>
        </view>
        <view 
          class="method-item" 
          :class="{ active: loginMethod === 'biometric' }"
          @tap="loginMethod = 'biometric'"
          v-if="biometricAvailable"
        >
          <text class="method-icon">{{ biometricIcon }}</text>
          <text class="method-text">{{ biometricTypeText }}</text>
        </view>
      </view>

      <!-- 登录按钮 -->
      <view class="login-actions">
        <button 
          class="login-btn primary" 
          :disabled="!canLogin || logging"
          @tap="handleLogin"
        >
          {{ logging ? '登录中...' : '登录' }}
        </button>
        
        <!-- 快捷登录选项 -->
        <view class="quick-login" v-if="hasQuickLogin">
          <text class="quick-title">快捷登录</text>
          <view class="quick-options">
            <view class="quick-item" @tap="handleWeChatLogin" v-if="wechatLoginEnabled">
              <text class="quick-icon">💬</text>
              <text class="quick-text">微信</text>
            </view>
            <view class="quick-item" @tap="handleAlipayLogin" v-if="alipayLoginEnabled">
              <text class="quick-icon">💰</text>
              <text class="quick-text">支付宝</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 注册和帮助 -->
      <view class="bottom-actions">
        <text class="action-text" @tap="handleRegister">还没有账号？立即注册</text>
        <text class="action-text" @tap="handleHelp">登录遇到问题？</text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-overlay" v-if="authLoading">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在验证身份...</text>
      </view>
    </view>

    <!-- SSO其他应用快捷入口 -->
    <view class="sso-apps" v-if="ssoApps.length > 0">
      <text class="apps-title">其他应用</text>
      <view class="apps-grid">
        <view 
          class="app-item" 
          v-for="app in ssoApps" 
          :key="app.id"
          @tap="openSSOApp(app)"
        >
          <view class="app-icon">{{ app.icon }}</view>
          <text class="app-name">{{ app.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ssoMixin from '@/mixins/sso-mixin.js'

export default {
  name: 'SSOLogin',
  mixins: [ssoMixin],
  
  data() {
    return {
      loginMethod: 'password', // password, sms, biometric
      credentials: {
        username: '',
        password: '',
        phone: '',
        smsCode: ''
      },
      showPassword: false,
      rememberMe: false,
      logging: false,
      
      // 短信验证码相关
      sendingCode: false,
      countdown: 0,
      countdownTimer: null,
      
      // 生物识别相关
      biometricAvailable: false,
      biometricType: '', // fingerprint, face, none
      
      // 快捷登录
      wechatLoginEnabled: false,
      alipayLoginEnabled: false,
      
      // SSO相关
      showSSOStatus: true,
      ssoApps: [
        { id: 'wealth', name: '财富管理', icon: '💰', url: '/pages/wealth/wealth' },
        { id: 'loan', name: '贷款服务', icon: '🏦', url: '/pages/loan/loan' },
        { id: 'card', name: '信用卡', icon: '💳', url: '/pages/credit-card/credit-card' }
      ]
    }
  },
  
  computed: {
    canLogin() {
      switch (this.loginMethod) {
        case 'password':
          return this.credentials.username && this.credentials.password
        case 'sms':
          return this.credentials.phone && this.credentials.smsCode
        case 'biometric':
          return this.biometricAvailable
        default:
          return false
      }
    },
    
    canSendCode() {
      return this.credentials.phone && this.credentials.phone.length === 11 && this.countdown === 0
    },
    
    hasQuickLogin() {
      return this.wechatLoginEnabled || this.alipayLoginEnabled
    },
    
    ssoStatusClass() {
      if (this.isAuthenticated) return 'success'
      if (this.authLoading) return 'loading'
      return 'idle'
    },
    
    ssoStatusIcon() {
      if (this.isAuthenticated) return '✅'
      if (this.authLoading) return '🔄'
      return '🔐'
    },
    
    ssoStatusText() {
      if (this.isAuthenticated) return '已登录'
      if (this.authLoading) return '验证中...'
      return '未登录'
    },
    
    biometricIcon() {
      switch (this.biometricType) {
        case 'fingerprint': return '👆'
        case 'face': return '👤'
        default: return '🔐'
      }
    },
    
    biometricText() {
      switch (this.biometricType) {
        case 'fingerprint': return '指纹登录'
        case 'face': return '人脸登录'
        default: return '生物识别登录'
      }
    },
    
    biometricTypeText() {
      switch (this.biometricType) {
        case 'fingerprint': return '指纹'
        case 'face': return '人脸'
        default: return '生物识别'
      }
    }
  },
  
  async mounted() {
    await this.initLoginOptions()
    
    // 如果已经登录，直接跳转
    if (this.isAuthenticated) {
      this.redirectToHome()
    }
  },
  
  methods: {
    async initLoginOptions() {
      // 检查生物识别可用性
      await this.checkBiometricAvailability()
      
      // 检查快捷登录选项
      this.checkQuickLoginOptions()
      
      // 恢复上次登录信息
      this.restoreLoginInfo()
    },
    
    async checkBiometricAvailability() {
      try {
        // #ifdef APP-PLUS
        const result = await new Promise((resolve) => {
          plus.fingerprint.isKeyguardSecure((result) => {
            resolve(result)
          }, (error) => {
            resolve(false)
          })
        })
        
        if (result) {
          this.biometricAvailable = true
          this.biometricType = 'fingerprint'
        }
        // #endif
        
        // #ifdef MP-WEIXIN
        // 微信小程序生物识别检查
        // #endif
        
        // #ifdef H5
        // H5环境下的生物识别检查
        // #endif
      } catch (error) {
        console.error('Biometric check failed:', error)
        this.biometricAvailable = false
      }
    },
    
    checkQuickLoginOptions() {
      // #ifdef MP-WEIXIN
      this.wechatLoginEnabled = true
      // #endif
      
      // 根据平台和配置启用相应的快捷登录
      this.alipayLoginEnabled = false // 示例：支付宝登录暂时关闭
    },
    
    restoreLoginInfo() {
      try {
        const savedUsername = uni.getStorageSync('saved_username')
        const rememberMe = uni.getStorageSync('remember_me')
        
        if (savedUsername && rememberMe) {
          this.credentials.username = savedUsername
          this.rememberMe = true
        }
      } catch (error) {
        console.error('Failed to restore login info:', error)
      }
    },
    
    async handleLogin() {
      if (!this.canLogin || this.logging) return
      
      this.logging = true
      
      try {
        let loginCredentials = {}
        
        switch (this.loginMethod) {
          case 'password':
            loginCredentials = {
              type: 'password',
              username: this.credentials.username,
              password: this.credentials.password,
              rememberMe: this.rememberMe
            }
            break
          case 'sms':
            loginCredentials = {
              type: 'sms',
              phone: this.credentials.phone,
              smsCode: this.credentials.smsCode
            }
            break
          case 'biometric':
            const biometricResult = await this.performBiometricAuth()
            if (!biometricResult.success) {
              this.logging = false
              return
            }
            loginCredentials = {
              type: 'biometric',
              biometricToken: biometricResult.token
            }
            break
        }
        
        const result = await this.performLogin(loginCredentials)
        
        if (result.success) {
          // 保存登录信息
          if (this.rememberMe && this.loginMethod === 'password') {
            uni.setStorageSync('saved_username', this.credentials.username)
            uni.setStorageSync('remember_me', true)
          }
          
          // 跳转到首页
          this.redirectToHome()
        }
      } catch (error) {
        console.error('Login failed:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'error'
        })
      } finally {
        this.logging = false
      }
    },
    
    async performBiometricAuth() {
      return new Promise((resolve) => {
        // #ifdef APP-PLUS
        plus.fingerprint.authenticate({
          success: (result) => {
            resolve({ success: true, token: result.token })
          },
          fail: (error) => {
            uni.showToast({
              title: '生物识别验证失败',
              icon: 'error'
            })
            resolve({ success: false })
          }
        })
        // #endif
        
        // 其他平台的生物识别实现
        // #ifndef APP-PLUS
        resolve({ success: false })
        // #endif
      })
    },
    
    async performBiometricLogin() {
      if (!this.biometricAvailable) return
      
      const result = await this.performBiometricAuth()
      if (result.success) {
        this.handleLogin()
      }
    },
    
    async sendSMSCode() {
      if (!this.canSendCode || this.sendingCode) return
      
      this.sendingCode = true
      
      try {
        // 这里应该调用实际的短信发送接口
        const response = await fetch('/api/auth/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: this.credentials.phone })
        })
        
        const result = await response.json()
        
        if (result.success) {
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
          
          this.startCountdown()
        } else {
          uni.showToast({
            title: result.message || '发送失败',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('SMS send failed:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        })
      } finally {
        this.sendingCode = false
      }
    },
    
    startCountdown() {
      this.countdown = 60
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer)
        }
      }, 1000)
    },
    
    async handleWeChatLogin() {
      try {
        // #ifdef MP-WEIXIN
        const result = await new Promise((resolve) => {
          wx.login({
            success: (res) => resolve({ success: true, code: res.code }),
            fail: () => resolve({ success: false })
          })
        })
        
        if (result.success) {
          // 调用后端接口进行微信登录
          const loginResult = await this.performLogin({
            type: 'wechat',
            code: result.code
          })
          
          if (loginResult.success) {
            this.redirectToHome()
          }
        }
        // #endif
      } catch (error) {
        console.error('WeChat login failed:', error)
        uni.showToast({
          title: '微信登录失败',
          icon: 'error'
        })
      }
    },
    
    async handleAlipayLogin() {
      // 支付宝登录实现
      uni.showToast({
        title: '支付宝登录暂未开放',
        icon: 'none'
      })
    },
    
    handleForgotPassword() {
      uni.navigateTo({
        url: '/pages/user/reset-password'
      })
    },
    
    handleRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    },
    
    handleHelp() {
      uni.navigateTo({
        url: '/pages/help/help-center?category=login'
      })
    },
    
    openSSOApp(app) {
      if (this.isAuthenticated) {
        uni.navigateTo({
          url: app.url
        })
      } else {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    },
    
    redirectToHome() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      
      // 如果有重定向参数，跳转到指定页面
      if (currentPage.options.redirect) {
        uni.redirectTo({
          url: decodeURIComponent(currentPage.options.redirect)
        })
      } else {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    }
  },
  
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  }
}
</script>

<style scoped>
.sso-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.sso-status {
  position: fixed;
  top: 40rpx;
  right: 40rpx;
  z-index: 100;
}

.status-indicator {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10rpx);
}

.status-indicator.success {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.status-indicator.loading {
  background: rgba(255, 193, 7, 0.9);
  color: white;
}

.status-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.status-text {
  font-size: 24rpx;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  margin-top: 120rpx;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40rpx;
}

.input-group {
  margin-bottom: 30rpx;
  position: relative;
}

.input-label {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.label-icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.label-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #fff;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.code-input {
  padding-right: 200rpx;
}

.password-toggle {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 10rpx;
}

.toggle-icon {
  font-size: 32rpx;
}

.send-code-btn {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 20rpx 30rpx;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.send-code-btn:disabled {
  background: #ccc;
}

.remember-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.remember-item {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background: #667eea;
  border-color: #667eea;
}

.check-icon {
  color: white;
  font-size: 20rpx;
}

.remember-text {
  font-size: 26rpx;
  color: #666;
}

.forgot-password {
  font-size: 26rpx;
  color: #667eea;
}

.biometric-section {
  text-align: center;
  padding: 60rpx 0;
}

.biometric-container {
  margin-bottom: 40rpx;
}

.biometric-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.biometric-icon:active {
  transform: scale(0.95);
}

.bio-icon {
  font-size: 60rpx;
  color: white;
}

.biometric-text {
  display: block;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.biometric-hint {
  font-size: 24rpx;
  color: #666;
}

.fallback-section {
  margin-top: 40rpx;
}

.fallback-text {
  color: #667eea;
  font-size: 26rpx;
}

.method-switch {
  display: flex;
  justify-content: center;
  margin: 40rpx 0;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 6rpx;
}

.method-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.method-item.active {
  background: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.method-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.method-text {
  font-size: 24rpx;
  color: #666;
}

.method-item.active .method-text {
  color: #333;
  font-weight: 500;
}

.login-actions {
  margin: 40rpx 0;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:disabled {
  background: #ccc;
}

.login-btn:active:not(:disabled) {
  transform: translateY(2rpx);
}

.quick-login {
  margin-top: 40rpx;
  text-align: center;
}

.quick-title {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.quick-options {
  display: flex;
  justify-content: center;
  gap: 40rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.quick-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.quick-text {
  font-size: 24rpx;
  color: #666;
}

.bottom-actions {
  text-align: center;
  margin-top: 40rpx;
}

.action-text {
  display: block;
  font-size: 26rpx;
  color: #667eea;
  margin-bottom: 20rpx;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.sso-apps {
  margin-top: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx;
  backdrop-filter: blur(10rpx);
}

.apps-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 30rpx;
  text-align: center;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  border-radius: 12rpx;
  background: white;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.app-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.app-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.app-name {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}
</style>

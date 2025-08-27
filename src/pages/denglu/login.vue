<template>
  <view class="login-container">
    <!-- 顶部Logo区域 -->
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">农业银行</text>
      <text class="app-slogan">安全便捷的金融服务</text>
    </view>

    <!-- 登录方式选择 -->
    <view class="login-methods">
      <!-- 指纹登录卡片 -->
      <view class="login-card fingerprint-card" @click="handleFingerprintLogin" v-if="isFingerprintSupported">
        <view class="card-icon">👆</view>
        <text class="card-title">指纹登录</text>
        <text class="card-desc">{{ fingerprintMessage }}</text>
      </view>

      <!-- 手机号验证码登录卡片 -->
      <view class="login-card" :class="{ 'active': loginMethod === 'phone' }" @click="switchLoginMethod('phone')">
        <view class="card-icon">📱</view>
        <text class="card-title">手机号登录</text>
        <text class="card-desc">验证码快速登录</text>
      </view>

      <!-- 用户名密码登录卡片 -->
      <view class="login-card" :class="{ 'active': loginMethod === 'password' }" @click="switchLoginMethod('password')">
        <view class="card-icon">🔐</view>
        <text class="card-title">密码登录</text>
        <text class="card-desc">用户名密码登录</text>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="login-form" v-if="loginMethod !== 'fingerprint'">
      <!-- 手机号验证码登录表单 -->
      <view v-if="loginMethod === 'phone'">
        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">📱</text>
            <input 
              class="input-field" 
              type="number" 
              placeholder="请输入手机号" 
              v-model="phoneForm.phone"
              maxlength="11"
              @input="clearError"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">🔢</text>
            <input 
              class="input-field" 
              type="number" 
              placeholder="请输入验证码" 
              v-model="phoneForm.code"
              maxlength="6"
              @input="clearError"
            />
            <button 
              class="send-code-btn" 
              :disabled="codeCountdown > 0"
              @click="sendVerificationCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s` : '发送验证码' }}
            </button>
          </view>
        </view>
      </view>

      <!-- 用户名密码登录表单 -->
      <view v-if="loginMethod === 'password'">
        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">👤</text>
            <input 
              class="input-field" 
              type="text" 
              placeholder="请输入用户名或手机号" 
              v-model="passwordForm.username"
              @input="clearError"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input 
              class="input-field" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="请输入密码" 
              v-model="passwordForm.password"
              @input="clearError"
            />
            <text class="password-toggle" @click="togglePassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </text>
          </view>
        </view>

        <view class="form-item">
          <view class="remember-password">
            <checkbox 
              :checked="rememberPassword" 
              @change="toggleRememberPassword"
              color="#667eea"
            />
            <text class="remember-text">记住密码</text>
          </view>
        </view>
      </view>

      <!-- 错误提示 -->
      <view class="error-message" v-if="errorMessage">
        {{ errorMessage }}
      </view>

      <!-- 登录按钮 -->
      <button 
        class="login-btn" 
        :class="{ 'loading': isLoading }"
        :disabled="isLoading"
        @click="handleLogin"
      >
        <text v-if="!isLoading">登录</text>
        <text v-else>登录中...</text>
      </button>

      <!-- 其他选项 -->
      <view class="other-options">
        <text class="forgot-password" @click="forgotPassword">忘记密码？</text>
        <text class="register-link" @click="goToRegister">注册账号</text>
      </view>
    </view>

    <!-- 测试账号提示 -->
    <view class="test-accounts">
      <text class="test-title">测试账号：</text>
      <text class="test-item">手机号：13800138000，验证码：123456</text>
      <text class="test-item">用户名：admin，密码：123456</text>
      <text class="test-item">用户名：test，密码：test123</text>
    </view>
  </view>
</template>

<script>
import { validateUser, generateVerificationCode, verifyCode } from '@/data/users.js'
import { handleLoginSuccess } from '@/utils/auth.js'
import { isFingerprintSupported, getFingerprintMessage, handleFingerprintLogin } from '@/utils/fingerprint.js'

export default {
  data() {
    return {
      loginMethod: 'password', // 默认密码登录
      phoneForm: {
        phone: '',
        code: ''
      },
      passwordForm: {
        username: '',
        password: ''
      },
      showPassword: false,
      rememberPassword: false,
      isLoading: false,
      errorMessage: '',
      codeCountdown: 0
    }
  },
  
  computed: {
    isFingerprintSupported() {
      return isFingerprintSupported()
    },
    
    fingerprintMessage() {
      return getFingerprintMessage()
    }
  },
  methods: {
    // 切换登录方式
    switchLoginMethod(method) {
      this.loginMethod = method
      this.clearError()
    },

    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    // 切换记住密码
    toggleRememberPassword(e) {
      this.rememberPassword = e.detail.value
    },

    // 清除错误信息
    clearError() {
      this.errorMessage = ''
    },

    // 发送验证码
    async sendVerificationCode() {
      if (!this.phoneForm.phone.trim()) {
        this.errorMessage = '请输入手机号'
        return
      }

      if (!/^1[3-9]\d{9}$/.test(this.phoneForm.phone)) {
        this.errorMessage = '请输入正确的手机号'
        return
      }

      try {
        // 生成验证码
        const code = generateVerificationCode(this.phoneForm.phone)
        
        // 显示验证码（实际项目中应该通过短信发送）
        uni.showToast({
          title: `验证码：${code}`,
          icon: 'none',
          duration: 3000
        })

        // 开始倒计时
        this.codeCountdown = 60
        const timer = setInterval(() => {
          this.codeCountdown--
          if (this.codeCountdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)

      } catch (error) {
        this.errorMessage = '发送验证码失败'
        console.error('发送验证码错误:', error)
      }
    },

    // 表单验证
    validateForm() {
      if (this.loginMethod === 'phone') {
        if (!this.phoneForm.phone.trim()) {
          this.errorMessage = '请输入手机号'
          return false
        }
        if (!/^1[3-9]\d{9}$/.test(this.phoneForm.phone)) {
          this.errorMessage = '请输入正确的手机号'
          return false
        }
        if (!this.phoneForm.code.trim()) {
          this.errorMessage = '请输入验证码'
          return false
        }
        if (!/^\d{6}$/.test(this.phoneForm.code)) {
          this.errorMessage = '请输入6位验证码'
          return false
        }
      } else if (this.loginMethod === 'password') {
        if (!this.passwordForm.username.trim()) {
          this.errorMessage = '请输入用户名或手机号'
          return false
        }
        if (!this.passwordForm.password.trim()) {
          this.errorMessage = '请输入密码'
          return false
        }
      }
      return true
    },

    // 处理登录
    async handleLogin() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        let user = null

        if (this.loginMethod === 'phone') {
          // 验证码登录
                  if (verifyCode(this.phoneForm.phone, this.phoneForm.code)) {
          const { users } = await import('@/data/users.js')
          user = users.find(u => u.phone === this.phoneForm.phone)
          } else {
            this.errorMessage = '验证码错误或已过期'
            return
          }
        } else if (this.loginMethod === 'password') {
          // 密码登录
          user = validateUser(this.passwordForm.username, this.passwordForm.password)
        }

        if (user) {
          // 保存最近登录用户（用于指纹登录）
          uni.setStorageSync('recentUser', user)
          
          // 如果记住密码，保存密码
          if (this.rememberPassword) {
            uni.setStorageSync('rememberedPassword', this.passwordForm.password)
          }

          // 显示成功提示
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })

          // 使用统一的登录成功处理函数
          setTimeout(() => {
            handleLoginSuccess(user)
          }, 1500)
        } else {
          this.errorMessage = this.loginMethod === 'phone' ? '手机号不存在' : '用户名或密码错误'
        }
      } catch (error) {
        this.errorMessage = '登录失败，请重试'
        console.error('登录错误:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 处理指纹登录
    async handleFingerprintLogin() {
      try {
        this.isLoading = true
        this.errorMessage = ''

        const user = await handleFingerprintLogin()
        
        if (user) {
          // 显示成功提示
          uni.showToast({
            title: '指纹登录成功',
            icon: 'success',
            duration: 1500
          })

          // 使用统一的登录成功处理函数
          setTimeout(() => {
            handleLoginSuccess(user)
          }, 1500)
        }
      } catch (error) {
        this.errorMessage = error.message || '指纹登录失败'
        console.error('指纹登录错误:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 忘记密码
    forgotPassword() {
      uni.showToast({
        title: '请联系客服重置密码',
        icon: 'none'
      })
    },

    // 注册账号
    goToRegister() {
      uni.showToast({
        title: '请到银行网点办理开户',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-methods {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60rpx;
  gap: 20rpx;
}

.login-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.login-card.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-4rpx);
}

.fingerprint-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.3);
}

.card-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
  display: block;
}

.card-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.card-desc {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.app-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.app-slogan {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 40rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.input-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #666;
}

.input-field {
  flex: 1;
  font-size: 32rpx;
  color: #333;
  background: transparent;
}

.password-toggle {
  font-size: 32rpx;
  color: #666;
  padding: 10rpx;
  cursor: pointer;
}

.send-code-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  margin-left: 20rpx;
  white-space: nowrap;
}

.send-code-btn:disabled {
  background: #ccc;
  color: #999;
}

.remember-password {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.remember-text {
  font-size: 28rpx;
  color: #666;
  margin-left: 16rpx;
}

.error-message {
  color: #e74c3c;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  text-align: center;
  background: #fdf2f2;
  padding: 20rpx;
  border-radius: 8rpx;
  border: 1rpx solid #fecaca;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: scale(0.98);
}

.login-btn.loading {
  opacity: 0.7;
}

.other-options {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
}

.forgot-password,
.register-link {
  color: #667eea;
  text-decoration: underline;
}

.test-accounts {
  margin-top: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 30rpx;
}

.test-title {
  display: block;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.test-item {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  margin-bottom: 10rpx;
}
</style>

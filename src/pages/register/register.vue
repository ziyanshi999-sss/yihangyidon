<template>
  <view class="register-page">
    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
      <view class="decoration-wave"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="nav-title">创建账户</view>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 欢迎区域 -->
      <view class="welcome-section">
        <view class="welcome-icon">🚀</view>
        <view class="welcome-title">欢迎加入我们</view>
        <view class="welcome-subtitle">开启您的财富管理之旅</view>
      </view>

      <!-- 注册表单 -->
      <view class="form-container">
        <form @submit="handleRegister">
          <!-- 用户名输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">👤</text>
              <text class="label-text">用户名</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'username', 'error': errors.username }">
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="请输入用户名" 
                maxlength="20"
                @focus="focusedField = 'username'"
                @blur="focusedField = ''"
                required
              />
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.username">{{ errors.username }}</view>
          </view>

          <!-- 手机号输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">📱</text>
              <text class="label-text">手机号</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'phone', 'error': errors.phone }">
              <input 
                type="number" 
                v-model="form.phone" 
                placeholder="请输入手机号" 
                maxlength="11"
                @focus="focusedField = 'phone'"
                @blur="focusedField = ''"
                required
              />
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.phone">{{ errors.phone }}</view>
          </view>

          <!-- 验证码输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">🔐</text>
              <text class="label-text">验证码</text>
            </view>
            <view class="input-wrapper verification-wrapper" :class="{ 'focused': focusedField === 'code', 'error': errors.code }">
              <input 
                type="number" 
                v-model="form.code" 
                placeholder="请输入验证码" 
                maxlength="6"
                @focus="focusedField = 'code'"
                @blur="focusedField = ''"
                required
              />
              <button 
                class="verification-btn" 
                @click.stop="getCode" 
                :disabled="countdown > 0"
                :class="{ 'disabled': countdown > 0 }"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.code">{{ errors.code }}</view>
          </view>

          <!-- 密码输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">🔒</text>
              <text class="label-text">登录密码</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'password', 'error': errors.password }">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.password" 
                placeholder="请输入登录密码" 
                @focus="focusedField = 'password'"
                @blur="focusedField = ''"
                required
              />
              <button 
                class="password-toggle" 
                @click.stop="togglePassword"
              >
                <text class="toggle-icon">{{ showPassword ? '🙈' : '👁️' }}</text>
              </button>
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.password">{{ errors.password }}</view>
          </view>

          <!-- 确认密码输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">🔒</text>
              <text class="label-text">确认密码</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'confirmPassword', 'error': errors.confirmPassword }">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="form.confirmPassword" 
                placeholder="请再次输入密码" 
                @focus="focusedField = 'confirmPassword'"
                @blur="focusedField = ''"
                required
              />
              <button 
                class="password-toggle" 
                @click.stop="toggleConfirmPassword"
              >
                <text class="toggle-icon">{{ showConfirmPassword ? '🙈' : '👁️' }}</text>
              </button>
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</view>
          </view>

          <!-- 邮箱输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">📧</text>
              <text class="label-text">邮箱地址</text>
              <text class="optional-tag">选填</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'email', 'error': errors.email }">
              <input 
                type="email" 
                v-model="form.email" 
                placeholder="请输入邮箱地址" 
                @focus="focusedField = 'email'"
                @blur="focusedField = ''"
              />
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.email">{{ errors.email }}</view>
          </view>

          <!-- 昵称输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">🎭</text>
              <text class="label-text">昵称</text>
              <text class="optional-tag">选填</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'nickname', 'error': errors.nickname }">
              <input 
                type="text" 
                v-model="form.nickname" 
                placeholder="请输入昵称" 
                maxlength="20"
                @focus="focusedField = 'nickname'"
                @blur="focusedField = ''"
              />
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.nickname">{{ errors.nickname }}</view>
          </view>

          <!-- 身份证号输入 -->
          <view class="form-group">
            <view class="input-label">
              <text class="label-icon">🆔</text>
              <text class="label-text">身份证号</text>
            </view>
            <view class="input-wrapper" :class="{ 'focused': focusedField === 'idCard', 'error': errors.idCard }">
              <input 
                type="text" 
                v-model="form.idCard" 
                placeholder="请输入身份证号" 
                maxlength="18"
                @focus="focusedField = 'idCard'"
                @blur="focusedField = ''"
                required
              />
              <view class="input-border"></view>
            </view>
            <view class="error-message" v-if="errors.idCard">{{ errors.idCard }}</view>
          </view>

          <!-- 注册按钮 -->
          <button 
            class="register-btn" 
            form-type="submit"
            :class="{ 'loading': loading, 'disabled': loading }"
            :disabled="loading"
          >
            <view class="btn-content">
              <view class="btn-icon" v-if="!loading">✨</view>
              <view class="btn-loading" v-if="loading">
                <view class="loading-spinner"></view>
              </view>
              <text class="btn-text">{{ loading ? '注册中...' : '立即注册' }}</text>
            </view>
          </button>
        </form>
      </view>

      <!-- 快速登录 -->
      <view class="quick-login">
        <text class="quick-login-text">已有账户？</text>
        <navigator url="/pages/denglu/login" open-type="navigate" class="quick-login-link">
          <text class="link-text">立即登录</text>
        </navigator>
      </view>

      <!-- 服务条款 -->
      <view class="terms-section">
        <view class="terms-checkbox" @click="toggleTerms">
          <view class="checkbox" :class="{ 'checked': agreeTerms }">
            <text class="checkbox-icon" v-if="agreeTerms">✓</text>
          </view>
          <text class="terms-text">我已阅读并同意</text>
          <text class="terms-link">《服务条款》</text>
          <text class="terms-text">和</text>
          <text class="terms-link">《隐私政策》</text>
        </view>
      </view>
    </view>

    <!-- 调试信息（开发环境） -->
    <view class="debug-panel" v-if="showDebug">
      <view class="debug-header" @click="toggleDebugPanel">
        <text class="debug-title">调试信息</text>
        <text class="debug-toggle">{{ debugExpanded ? '−' : '+' }}</text>
      </view>
      <view class="debug-content" v-if="debugExpanded">
        <view class="debug-item">
          <text class="debug-label">当前用户总数：</text>
          <text class="debug-value">{{ userCount }}</text>
        </view>
        <view class="debug-actions">
          <button class="debug-btn" @click="refreshUserCount">刷新用户数</button>
          <button class="debug-btn" @click="showAllUsers">查看所有用户</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { generateVerificationCode, verifyCode, registerUser, checkUserExists, getUsersData } from '@/data/users.js'
import { handleLoginSuccess } from '@/utils/auth.js'

export default {
  data() {
    return {
      form: {
        username: '',
        phone: '',
        code: '',
        password: '',
        confirmPassword: '',
        email: '',
        nickname: '',
        idCard: ''
      },
      errors: {},
      countdown: 0,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      focusedField: '',
      agreeTerms: false,
      showDebug: true, // 开发环境显示调试信息
      debugExpanded: false,
      userCount: 0
    };
  },
  
  onLoad() {
    console.log('注册页面加载完成');
    this.refreshUserCount();
  },
  
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },

    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    
    // 切换确认密码显示
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    // 切换服务条款同意状态
    toggleTerms() {
      this.agreeTerms = !this.agreeTerms;
    },

    // 切换调试面板
    toggleDebugPanel() {
      this.debugExpanded = !this.debugExpanded;
    },
    
    // 获取验证码
    getCode() {
      if (!this.validatePhone()) {
        return;
      }
      
      try {
        // 生成验证码
        const code = generateVerificationCode(this.form.phone)
        
        // 显示验证码（实际项目中应该通过短信发送）
        uni.showToast({
          title: `验证码：${code}`,
          icon: 'none',
          duration: 3000
        })

        // 开始倒计时
        this.countdown = 60;
        const timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) clearInterval(timer);
        }, 1000);
      } catch (error) {
        uni.showToast({ title: '发送验证码失败', icon: 'none' });
      }
    },
    
    // 注册处理
    handleRegister() {
      this.loading = true;
      this.clearErrors();
      
      // 表单验证
      if (!this.validateForm()) {
        this.loading = false;
        return;
      }
      
      // 模拟网络延迟
      setTimeout(() => {
        try {
          // 验证验证码
          if (!verifyCode(this.form.phone, this.form.code)) {
            this.setError('code', '验证码错误或已过期');
            this.loading = false;
            return;
          }
          
          // 检查用户是否已存在
          if (checkUserExists(this.form.username, this.form.phone)) {
            this.setError('username', '用户名或手机号已存在');
            this.loading = false;
            return;
          }
          
          // 注册用户
          const user = registerUser({
            username: this.form.username,
            phone: this.form.phone,
            password: this.form.password,
            email: this.form.email,
            nickname: this.form.nickname || this.form.username,
            idCard: this.form.idCard
          });
          
          // 显示成功提示
          uni.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000
          });
          
          // 显示用户信息
          console.log('注册成功，用户信息:', user);
          console.log('当前系统用户总数:', getUsersData().length);
          
          // 更新用户数量显示
          this.refreshUserCount();
          
          // 自动登录
          setTimeout(() => {
            handleLoginSuccess(user);
          }, 2000);
          
        } catch (error) {
          uni.showToast({ title: '注册失败，请重试', icon: 'none' });
          console.error('注册错误:', error);
        } finally {
          this.loading = false;
        }
      }, 1000);
    },

    // 设置错误信息
    setError(field, message) {
      this.errors[field] = message;
    },

    // 清除错误信息
    clearErrors() {
      this.errors = {};
    },
    
    // 验证手机号
    validatePhone() {
      if (!this.form.phone.trim()) {
        this.setError('phone', '请输入手机号');
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        this.setError('phone', '请输入正确的手机号');
        return false;
      }
      return true;
    },
    
    // 身份证号验证
    validateIdCard(idCard) {
      // 18位身份证号正则
      const idCardRegex = /^\d{17}[\dXx]$/;
      if (!idCardRegex.test(idCard)) {
        return false;
      }
      
      // 测试环境：允许特殊测试身份证号
      const testIdCards = [
        '111111111111111111',
        '222222222222222222', 
        '333333333333333333',
        '123456789012345678'
      ];
      
      if (testIdCards.includes(idCard)) {
        console.log('使用测试身份证号:', idCard);
        return true;
      }
      
      // 正式环境：校验位验证
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(idCard[i]) * weights[i];
      }
      
      const checkCode = checkCodes[sum % 11];
      const isValid = checkCode === idCard[17].toUpperCase();
      
      if (!isValid) {
        console.log('身份证校验失败:', {
          输入: idCard,
          计算校验位: checkCode,
          实际最后一位: idCard[17]
        });
      }
      
      return isValid;
    },
    
    // 表单验证
    validateForm() {
      this.clearErrors();
      let isValid = true;

      // 用户名验证
      if (!this.form.username.trim()) {
        this.setError('username', '请输入用户名');
        isValid = false;
      } else if (this.form.username.length < 3 || this.form.username.length > 20) {
        this.setError('username', '用户名长度应为3-20个字符');
        isValid = false;
      }
      
      // 手机号验证
      if (!this.validatePhone()) {
        isValid = false;
      }
      
      // 验证码验证
      if (!this.form.code.trim()) {
        this.setError('code', '请输入验证码');
        isValid = false;
      } else if (!/^\d{6}$/.test(this.form.code)) {
        this.setError('code', '请输入6位验证码');
        isValid = false;
      }
      
      // 密码验证
      if (!this.form.password.trim()) {
        this.setError('password', '请输入密码');
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.setError('password', '密码长度至少6位');
        isValid = false;
      }
      
      // 确认密码验证
      if (!this.form.confirmPassword.trim()) {
        this.setError('confirmPassword', '请再次输入密码');
        isValid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.setError('confirmPassword', '两次输入的密码不一致');
        isValid = false;
      }
      
      // 邮箱验证（选填）
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.setError('email', '请输入正确的邮箱地址');
        isValid = false;
      }
      
      // 身份证号验证
      if (!this.form.idCard.trim()) {
        this.setError('idCard', '请输入身份证号');
        isValid = false;
      } else if (!this.validateIdCard(this.form.idCard)) {
        this.setError('idCard', '请输入正确的身份证号');
        isValid = false;
      }

      // 服务条款验证
      if (!this.agreeTerms) {
        uni.showToast({ title: '请先同意服务条款', icon: 'none' });
        isValid = false;
      }
      
      return isValid;
    },
    
    // 刷新用户数量
    refreshUserCount() {
      this.userCount = getUsersData().length;
    },
    
    // 显示所有用户
    showAllUsers() {
      const users = getUsersData();
      console.log('所有用户数据:', users);
      uni.showModal({
        title: '用户数据',
        content: `当前共有 ${users.length} 个用户\n最新用户: ${users[users.length - 1]?.username || '无'}`,
        showCancel: false
      });
    }
  }
};
</script>

<style scoped>
/* 页面整体样式 */
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: 10%;
  right: -50rpx;
  animation-delay: 0s;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  top: 30%;
  left: -30rpx;
  animation-delay: 2s;
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 60%;
  right: 20rpx;
  animation-delay: 4s;
}

.decoration-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform: skewY(-3deg);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 顶部导航 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60rpx 40rpx 20rpx;
  position: relative;
  z-index: 10;
}

.nav-back {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.back-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.nav-title {
  color: white;
  font-size: 36rpx;
  font-weight: 600;
}

.nav-placeholder {
  width: 80rpx;
}

/* 主要内容区域 */
.main-content {
  position: relative;
  z-index: 10;
  padding: 0 40rpx 40rpx;
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  margin-bottom: 60rpx;
}

.welcome-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  animation: bounce 2s infinite;
}

.welcome-title {
  color: white;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* 表单容器 */
.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  backdrop-filter: blur(20px);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

/* 表单组 */
.form-group {
  margin-bottom: 32rpx;
}

.input-label {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.label-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.label-text {
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.optional-tag {
  background: #f0f0f0;
  color: #999;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  margin-left: 12rpx;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  background: #f8f9fa;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper.focused {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
}

.input-wrapper.error {
  border-color: #ff4757;
  background: #fff5f5;
}

.input-wrapper input {
  width: 100%;
  padding: 24rpx 20rpx;
  font-size: 32rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-wrapper.focused .input-border {
  transform: scaleX(1);
}

/* 验证码输入特殊样式 */
.verification-wrapper {
  display: flex;
  align-items: center;
  padding: 0;
}

.verification-wrapper input {
  flex: 1;
  padding: 24rpx 20rpx;
}

.verification-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  border: none;
  margin: 12rpx;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.verification-btn.disabled {
  background: #ccc;
  color: #999;
}

/* 密码切换按钮 */
.password-toggle {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 8rpx;
}

.toggle-icon {
  font-size: 32rpx;
  color: #999;
}

/* 错误信息 */
.error-message {
  color: #ff4757;
  font-size: 24rpx;
  margin-top: 8rpx;
  padding-left: 8rpx;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 20rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.register-btn:active {
  transform: scale(0.98);
}

.register-btn.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.btn-icon {
  font-size: 28rpx;
}

.btn-loading {
  width: 32rpx;
  height: 32rpx;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top: 3rpx solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 快速登录 */
.quick-login {
  text-align: center;
  margin-bottom: 40rpx;
}

.quick-login-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
}

.quick-login-link {
  display: inline;
}

.link-text {
  color: white;
  font-size: 28rpx;
  font-weight: 600;
  text-decoration: underline;
}

/* 服务条款 */
.terms-section {
  margin-bottom: 40rpx;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.6);
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background: white;
  border-color: white;
}

.checkbox-icon {
  color: #667eea;
  font-size: 20rpx;
  font-weight: bold;
}

.terms-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.terms-link {
  color: white;
  font-size: 24rpx;
  text-decoration: underline;
}

/* 调试面板 */
.debug-panel {
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
  right: 40rpx;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16rpx;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

.debug-title {
  color: #ff9800;
  font-size: 28rpx;
  font-weight: 600;
}

.debug-toggle {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
}

.debug-content {
  padding: 20rpx;
}

.debug-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.debug-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.debug-value {
  color: #ff9800;
  font-size: 24rpx;
  font-weight: 600;
  margin-left: 12rpx;
}

.debug-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.debug-btn {
  background: #ff9800;
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: none;
  flex: 1;
}
</style>
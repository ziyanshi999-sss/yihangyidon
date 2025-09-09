<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-circle circle-1"></view>
      <view class="bg-circle circle-2"></view>
      <view class="bg-circle circle-3"></view>
      <view class="bg-wave wave-1"></view>
      <view class="bg-wave wave-2"></view>
    </view>
    
    <!-- 头部区域 -->
    <view class="header-section">
      <view class="logo-container">
        <view class="logo-icon">🏦</view>
        <view class="logo-text">
          <text class="bank-name">中国农业银行</text>
          <text class="bank-subtitle">Agricultural Bank of China</text>
        </view>
      </view>
      <view class="welcome-text">
        <text class="welcome-title">欢迎使用</text>
        <text class="welcome-desc">安全便捷的移动银行服务</text>
      </view>
    </view>
    
    <!-- 登录卡片 -->
    <view class="login-card">
      <!-- 登录方式切换 -->
      <view class="tab-container">
        <view 
          :class="['tab-item', loginType === 'password' ? 'active' : '']" 
          @click="loginType = 'password'"
        >
          <text class="tab-icon">🔐</text>
          <text class="tab-text">密码登录</text>
        </view>
        <view 
          :class="['tab-item', loginType === 'code' ? 'active' : '']" 
          @click="loginType = 'code'"
        >
          <text class="tab-icon">📱</text>
          <text class="tab-text">验证码登录</text>
        </view>
        <view 
          :class="['tab-item', loginType === 'fingerprint' ? 'active' : '']" 
          @click="loginType = 'fingerprint'"
        >
          <text class="tab-icon">👆</text>
          <text class="tab-text">指纹登录</text>
        </view>
      </view>
    
      <!-- 登录表单 -->
      <form @submit="handleLogin" class="login-form">
        <!-- 用户名/手机号输入 -->
        <view class="input-group" v-if="loginType !== 'fingerprint'">
          <view class="input-wrapper">
            <view class="input-icon">👤</view>
            <input 
              type="text" 
              v-model="phone" 
              placeholder="请输入用户名（仅中文）或手机号" 
              maxlength="20"
              required
              class="modern-input"
            />
          </view>
        </view>
        
        <!-- 指纹登录区域 -->
        <view class="fingerprint-section" v-if="loginType === 'fingerprint'">
          <view class="fingerprint-container">
            <view class="fingerprint-icon" :class="{ 'scanning': isFingerprintScanning }">
              <text class="fingerprint-symbol">👆</text>
            </view>
            <text class="fingerprint-title">指纹登录</text>
            <text class="fingerprint-desc">请将手指放在指纹识别器上</text>
            <view class="fingerprint-status">
              <text v-if="fingerprintStatus === 'ready'" class="status-text ready">准备就绪</text>
              <text v-if="fingerprintStatus === 'scanning'" class="status-text scanning">正在识别...</text>
              <text v-if="fingerprintStatus === 'success'" class="status-text success">识别成功</text>
              <text v-if="fingerprintStatus === 'failed'" class="status-text failed">识别失败，请重试</text>
              <text v-if="fingerprintStatus === 'notSupport'" class="status-text not-support">设备不支持指纹识别</text>
            </view>
          </view>
        </view>
        
        <!-- 密码/验证码输入 -->
        <view class="input-group" v-if="loginType === 'password'">
          <view class="input-wrapper">
            <view class="input-icon">🔒</view>
            <input 
              type="password" 
              v-model="password" 
              placeholder="请输入密码" 
              maxlength="20"
              required
              class="modern-input"
            />
          </view>
        </view>
        
        <view class="input-group" v-if="loginType === 'code'">
          <view class="input-wrapper">
            <view class="input-icon">📱</view>
            <input 
              type="number" 
              v-model="code" 
              placeholder="请输入验证码" 
              maxlength="6"
              required
              class="modern-input"
            />
            <button 
              class="get-code-btn" 
              @click.stop="getCode" 
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
            </button>
          </view>
        </view>
        
        <!-- 登录按钮 -->
        <button 
          class="modern-login-btn" 
          form-type="submit"
          :loading="loading"
          v-if="loginType !== 'fingerprint'"
        >
          <text class="btn-text">立即登录</text>
          <text class="btn-arrow">→</text>
        </button>
        
        <!-- 指纹登录按钮 -->
        <button 
          class="modern-fingerprint-btn" 
          @click="startFingerprintLogin"
          :disabled="!fingerprintSupport || isFingerprintScanning"
          v-if="loginType === 'fingerprint'"
        >
          <text class="btn-icon">👆</text>
          <text class="btn-text">{{ getFingerprintButtonText() }}</text>
        </button>
      </form>
    </view>
    
    <!-- 底部操作区域 -->
    <view class="bottom-section">
      <!-- 快速注册 -->
      <view class="register-section">
        <navigator url="/pages/register/register" open-type="navigate">
          <button class="register-btn">
            <text class="register-text">还没有账户？</text>
            <text class="register-link">立即注册</text>
          </button>
        </navigator>
      </view>
      
      <!-- 辅助链接 -->
      <view class="help-links">
        <navigator url="/pages/forget/forget" class="help-link">
          <text class="link-text">忘记密码</text>
        </navigator>
        <text class="divider">|</text>
        <navigator url="/pages/help/help" class="help-link">
          <text class="link-text">帮助中心</text>
        </navigator>
      </view>
      
      <!-- 安全提示 -->
      <view class="security-tips">
        <text class="tips-title">🔒 安全提示</text>
        <text class="tips-item">• 请确保在安全环境下登录</text>
        <text class="tips-item">• 定期更换登录密码</text>
        <text class="tips-item">• 客服热线：95599</text>
      </view>
    </view>
  </view>
</template>

<script>
import { validateUser, generateVerificationCode, verifyCode, users } from '@/data/users.js'
import { handleLoginSuccess } from '@/utils/auth.js'

export default {
  data() {
    return {
      loginType: 'password', // 登录方式：password/code/fingerprint
      phone: '',
      password: '',
      code: '',
      countdown: 0,
      loading: false,
      // 指纹登录相关
      fingerprintSupport: false,
      isFingerprintScanning: false,
      fingerprintStatus: 'ready', // ready/scanning/success/failed/notSupport
      lastFingerprintUser: null // 上次使用指纹登录的用户
    };
  },
  
  onLoad() {
    console.log('页面加载完成');
    // 测试用户数据加载
    console.log('加载的用户数据:', users);
    console.log('用户数量:', users.length);
    
    // 检查指纹支持情况
    this.checkFingerprintSupport();
    
    // 获取上次使用指纹登录的用户
    this.getLastFingerprintUser();
  },
  
  methods: {
    
    // 检查设备指纹支持情况
    checkFingerprintSupport() {
      // 首先检查用户是否禁用了指纹登录
      const fingerprintEnabled = uni.getStorageSync('fingerprintLoginEnabled');
      if (fingerprintEnabled === false) {
        this.fingerprintSupport = false;
        this.fingerprintStatus = 'notSupport';
        console.log('用户已禁用指纹登录');
        return;
      }

      uni.checkIsSupportSoterAuthentication({
        success: (res) => {
          console.log('指纹支持检查结果:', res);
          if (res.supportMode && res.supportMode.includes('fingerPrint')) {
            this.fingerprintSupport = true;
            this.fingerprintStatus = 'ready';
            console.log('设备支持指纹识别');
          } else {
            this.fingerprintSupport = false;
            this.fingerprintStatus = 'notSupport';
            console.log('设备不支持指纹识别');
          }
        },
        fail: (err) => {
          console.error('检查指纹支持失败:', err);
          this.fingerprintSupport = false;
          this.fingerprintStatus = 'notSupport';
        }
      });
    },
    
    // 获取上次使用指纹登录的用户
    getLastFingerprintUser() {
      try {
        const lastUser = uni.getStorageSync('lastFingerprintUser');
        if (lastUser) {
          this.lastFingerprintUser = lastUser;
          console.log('上次指纹登录用户:', lastUser);
        }
      } catch (error) {
        console.error('获取上次指纹登录用户失败:', error);
      }
    },
    
    // 开始指纹登录
    startFingerprintLogin() {
      // 检查用户是否禁用了指纹登录
      const fingerprintEnabled = uni.getStorageSync('fingerprintLoginEnabled');
      if (fingerprintEnabled === false) {
        uni.showToast({
          title: '指纹登录已被禁用，请在安全设置中开启',
          icon: 'none',
          duration: 3000
        });
        return;
      }

      if (!this.fingerprintSupport) {
        uni.showToast({
          title: '设备不支持指纹识别',
          icon: 'none'
        });
        return;
      }
      
      if (!this.lastFingerprintUser) {
        uni.showToast({
          title: '请先使用密码登录一次',
          icon: 'none'
        });
        return;
      }
      
      this.isFingerprintScanning = true;
      this.fingerprintStatus = 'scanning';
      
      // 生成随机挑战字符串
      const challenge = Math.random().toString(36).substring(2, 15);
      
      uni.startSoterAuthentication({
        requestAuthModes: ['fingerPrint'],
        challenge: challenge,
        authContent: '请用指纹解锁',
        success: (res) => {
          console.log('指纹认证成功:', res);
          this.fingerprintStatus = 'success';
          this.isFingerprintScanning = false;
          
          // 指纹认证成功，使用上次登录的用户信息
          this.handleFingerprintLoginSuccess();
        },
        fail: (err) => {
          console.error('指纹认证失败:', err);
          this.fingerprintStatus = 'failed';
          this.isFingerprintScanning = false;
          
          if (err.errCode === 1) {
            uni.showToast({
              title: '指纹识别失败，请重试',
              icon: 'none'
            });
          } else if (err.errCode === 2) {
            uni.showToast({
              title: '用户取消指纹识别',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: '指纹识别失败',
              icon: 'none'
            });
          }
          
          // 3秒后重置状态
          setTimeout(() => {
            this.fingerprintStatus = 'ready';
          }, 3000);
        }
      });
    },
    
    // 指纹登录成功处理
    handleFingerprintLoginSuccess() {
      if (!this.lastFingerprintUser) {
        uni.showToast({
          title: '用户信息错误',
          icon: 'none'
        });
        return;
      }
      
      // 显示成功提示
      uni.showToast({
        title: '指纹登录成功',
        icon: 'success',
        duration: 1500
      });
      
      // 更新用户最后登录时间
      this.lastFingerprintUser.lastLoginTime = new Date().toISOString();
      
      // 使用统一的登录成功处理函数
      setTimeout(() => {
        handleLoginSuccess(this.lastFingerprintUser);
      }, 1500);
    },
    
    // 保存用户信息用于指纹登录
    saveUserForFingerprint(user) {
      try {
        // 保存用户信息到本地存储，用于下次指纹登录
        uni.setStorageSync('lastFingerprintUser', user);
        console.log('用户信息已保存用于指纹登录:', user.username);
      } catch (error) {
        console.error('保存用户信息失败:', error);
      }
    },

    // 获取指纹按钮文本
    getFingerprintButtonText() {
      const fingerprintEnabled = uni.getStorageSync('fingerprintLoginEnabled');
      if (fingerprintEnabled === false) {
        return '指纹登录已禁用';
      }
      if (!this.fingerprintSupport) {
        return '设备不支持指纹';
      }
      return '开始指纹识别';
    },
    
    // 获取验证码
    getCode() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '请输入正确手机号', icon: 'none' });
        return;
      }
      
      try {
        // 生成验证码
        const code = generateVerificationCode(this.phone)
        
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
    
    // 密码/验证码登录
    handleLogin() {
      this.loading = true;
      
      // 表单验证
      if (!this.validateForm()) {
        this.loading = false;
        return;
      }
      
      // 模拟网络延迟
      setTimeout(() => {
        let user = null;
        
        if (this.loginType === 'password') {
          // 密码登录
          user = validateUser(this.phone, this.password);
        } else {
          // 验证码登录
          if (verifyCode(this.phone, this.code)) {
            user = users.find(u => u.phone === this.phone);
            if (user) {
              // 更新最后登录时间
              user.lastLoginTime = new Date().toISOString();
            }
          } else {
            uni.showToast({ title: '验证码错误或已过期', icon: 'none' });
            this.loading = false;
            return;
          }
        }
        
        if (user) {
          // 记录设备信息
          // this.recordDeviceInfo(); // Removed as per edit hint
          
          // 保存用户信息用于指纹登录
          this.saveUserForFingerprint(user);
          
          // 显示成功提示
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          
          // 使用统一的登录成功处理函数
          setTimeout(() => {
            handleLoginSuccess(user);
          }, 1500);
        } else {
          uni.showToast({ 
            title: this.loginType === 'password' ? '用户名或密码错误' : '手机号不存在', 
            icon: 'none' 
          });
        }
        
        this.loading = false;
      }, 1000);
    },
    
    // 表单验证
    validateForm() {
      // 指纹登录不需要验证表单
      if (this.loginType === 'fingerprint') {
        return true;
      }
      
      if (!this.phone.trim()) {
        uni.showToast({ title: '请输入用户名或手机号', icon: 'none' });
        return false;
      }
      
      // 判断输入的是用户名还是手机号
      const isPhone = /^1[3-9]\d{9}$/.test(this.phone);
      const isUsername = /^[\u4e00-\u9fa5]+$/.test(this.phone);
      
      if (!isPhone && !isUsername) {
        uni.showToast({ title: '用户名仅支持中文字符，或输入正确的手机号', icon: 'none' });
        return false;
      }
      
      // 验证码登录只支持手机号
      if (this.loginType === 'code' && !isPhone) {
        uni.showToast({ title: '验证码登录仅支持手机号', icon: 'none' });
        return false;
      }
      
      if (this.loginType === 'password') {
        if (!this.password.trim()) {
          uni.showToast({ title: '请输入密码', icon: 'none' });
          return false;
        }
      } else {
        if (!this.code.trim()) {
          uni.showToast({ title: '请输入验证码', icon: 'none' });
          return false;
        }
        if (!/^\d{6}$/.test(this.code)) {
          uni.showToast({ title: '请输入6位验证码', icon: 'none' });
          return false;
        }
      }
      return true;
    },
    
  }
};
</script>

<style scoped>
/* 现代化中国农业银行登录页面样式 */

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 30%;
  right: 30%;
  animation-delay: 4s;
}

.bg-wave {
  position: absolute;
  width: 200%;
  height: 100rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: wave 8s linear infinite;
}

.wave-1 {
  top: 20%;
  animation-delay: 0s;
}

.wave-2 {
  top: 70%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 头部区域 */
.header-section {
  padding: 80rpx 40rpx 60rpx;
  text-align: center;
  position: relative;
  z-index: 2;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.logo-icon {
  font-size: 80rpx;
  margin-right: 20rpx;
  animation: logoGlow 2s ease-in-out infinite alternate;
}

@keyframes logoGlow {
  0% {
    text-shadow: 0 0 20rpx rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 30rpx rgba(255, 255, 255, 0.8);
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bank-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.bank-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 1rpx;
}

.welcome-text {
  margin-top: 20rpx;
}

.welcome-title {
  display: block;
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.welcome-desc {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  margin: 0 30rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10rpx);
  position: relative;
  z-index: 2;
  margin-bottom: 40rpx;
}

/* 标签页容器 */
.tab-container {
  display: flex;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
  border-radius: 12rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transform: translateY(-2rpx);
}

.tab-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
  transition: all 0.3s ease;
}

.tab-item.active .tab-icon {
  transform: scale(1.1);
}

.tab-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-item.active .tab-text {
  color: #1e40af;
  font-weight: 600;
}

/* 登录表单 */
.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 30rpx;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 0 20rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1);
  transform: translateY(-2rpx);
}

.input-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: #6b7280;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #3b82f6;
  transform: scale(1.1);
}

.modern-input {
  flex: 1;
  height: 88rpx;
  border: none;
  outline: none;
  background: transparent;
  font-size: 32rpx;
  color: #1f2937;
  font-weight: 400;
}

.modern-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.get-code-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  border: none;
  margin-left: 16rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.get-code-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: none;
  transform: none;
}

.get-code-btn:active:not(:disabled) {
  transform: scale(0.95);
}

/* 指纹登录区域 */
.fingerprint-section {
  padding: 60rpx 0;
  text-align: center;
}

.fingerprint-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.fingerprint-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fingerprint-icon.scanning {
  animation: fingerprintPulse 2s ease-in-out infinite;
}

.fingerprint-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.fingerprint-icon.scanning::before {
  animation: fingerprintScan 2s infinite;
}

@keyframes fingerprintPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12rpx 40rpx rgba(59, 130, 246, 0.5);
  }
}

@keyframes fingerprintScan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.fingerprint-symbol {
  font-size: 64rpx;
  color: #ffffff;
}

.fingerprint-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 16rpx;
}

.fingerprint-desc {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 30rpx;
  line-height: 1.5;
}

.fingerprint-status {
  min-height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  border-radius: 25rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-text.ready {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.status-text.scanning {
  color: #d97706;
  background: rgba(217, 119, 6, 0.1);
  animation: statusBlink 1.5s infinite;
}

.status-text.success {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.status-text.failed {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.status-text.not-support {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}

@keyframes statusBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 登录按钮 */
.modern-login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 700;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.modern-login-btn:active::before {
  left: 100%;
}

.modern-login-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.3);
}

.btn-text {
  font-size: 32rpx;
  font-weight: 700;
}

.btn-arrow {
  font-size: 28rpx;
  transition: transform 0.3s ease;
}

.modern-login-btn:active .btn-arrow {
  transform: translateX(4rpx);
}

/* 指纹登录按钮 */
.modern-fingerprint-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 700;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(16, 185, 129, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-fingerprint-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: none;
  transform: none;
}

.modern-fingerprint-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.3);
}

.btn-icon {
  font-size: 32rpx;
}

/* 底部区域 */
.bottom-section {
  padding: 0 30rpx 40rpx;
  position: relative;
  z-index: 2;
}

.register-section {
  margin-bottom: 30rpx;
}

.register-btn {
  width: 100%;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10rpx);
}

.register-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.98);
}

.register-text {
  color: rgba(255, 255, 255, 0.8);
}

.register-link {
  color: #ffffff;
  font-weight: 600;
}

.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.help-link {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  text-decoration: none;
  transition: all 0.3s ease;
}

.help-link:active {
  color: #ffffff;
  transform: scale(1.05);
}

.divider {
  color: rgba(255, 255, 255, 0.5);
  font-size: 24rpx;
}

.security-tips {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.tips-title {
  display: block;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
  text-align: center;
}

.tips-item {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  margin-bottom: 8rpx;
  line-height: 1.5;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .login-card {
    margin: 0 20rpx;
    padding: 30rpx;
  }
  
  .header-section {
    padding: 60rpx 30rpx 40rpx;
  }
  
  .bank-name {
    font-size: 42rpx;
  }
  
  .bank-subtitle {
    font-size: 22rpx;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  }
  
  .login-card {
    background: rgba(15, 23, 42, 0.95);
    color: #f1f5f9;
  }
  
  .tab-container {
    background: #1e293b;
  }
  
  .tab-item.active {
    background: #334155;
  }
  
  .input-wrapper {
    background: #1e293b;
  }
  
  .input-wrapper:focus-within {
    background: #334155;
  }
  
  .modern-input {
    color: #f1f5f9;
  }
  
  .modern-input::placeholder {
    color: #94a3b8;
  }
}

</style>

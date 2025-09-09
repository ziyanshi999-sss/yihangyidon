<template>
  <view class="login-container">
    <!-- 标题 -->
    <view class="title">银行系统</view>
    
    <!-- 登录方式切换 -->
    <view class="tab-bar">
      <view 
        :class="['tab-item', loginType === 'password' ? 'active' : '']" 
        @click="loginType = 'password'"
      >
        密码登录
      </view>
      <view 
        :class="['tab-item', loginType === 'code' ? 'active' : '']" 
        @click="loginType = 'code'"
      >
        验证码登录
      </view>
      <view 
        :class="['tab-item', loginType === 'fingerprint' ? 'active' : '']" 
        @click="loginType = 'fingerprint'"
      >
        指纹登录
      </view>
    </view>
    
    <!-- 登录表单 -->
    <form @submit="handleLogin">
      <!-- 用户名/手机号输入 -->
      <view class="input-item" v-if="loginType !== 'fingerprint'">
        <input 
          type="text" 
          v-model="phone" 
          placeholder="请输入用户名（仅中文）或手机号" 
          maxlength="20"
          required
        />
      </view>
      
      <!-- 指纹登录区域 -->
      <view class="fingerprint-section" v-if="loginType === 'fingerprint'">
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
      
      <!-- 密码/验证码输入 -->
      <view class="input-item" v-if="loginType === 'password'">
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
          maxlength="20"
          required
        />
      </view>
      <view class="input-item" v-if="loginType === 'code'">
        <input 
          type="number" 
          v-model="code" 
          placeholder="请输入验证码" 
          maxlength="6"
          required
        />
        <button 
          class="get-code-btn" 
          @click.stop="getCode" 
          :disabled="countdown > 0"
        >
          {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
        </button>
      </view>
      
      <!-- 登录按钮 -->
      <button 
        class="login-btn" 
        form-type="submit"
        :loading="loading"
        v-if="loginType !== 'fingerprint'"
      >
        登录
      </button>
      
      <!-- 指纹登录按钮 -->
      <button 
        class="fingerprint-login-btn" 
        @click="startFingerprintLogin"
        :disabled="!fingerprintSupport || isFingerprintScanning"
        v-if="loginType === 'fingerprint'"
      >
        <text class="btn-icon">👆</text>
        <text class="btn-text">{{ fingerprintSupport ? '开始指纹识别' : '设备不支持指纹' }}</text>
      </button>
    </form>
    
    <!-- 快速注册按钮 -->
    <view class="quick-register">
      <navigator url="/pages/register/register" open-type="navigate">
        <button class="quick-register-btn">
          还没有账户？立即注册
        </button>
      </navigator>
    </view>
    
    <!-- 辅助链接 -->
    <view class="links">
      <navigator url="/pages/forget/forget">忘记密码</navigator>
    </view>

    <!-- 登录注意事项 -->
    <view class="login-notice">
      <text class="notice-title">登录注意事项：</text>
      <text class="notice-item">• 请确保在安全环境下登录，避免在公共场所输入密码</text>
      <text class="notice-item">• 密码登录支持用户名或手机号，验证码登录仅支持手机号</text>
      <text class="notice-item">• 如遇登录问题，请联系客服热线：95599</text>
      <text class="notice-item">• 为保障账户安全，建议定期更换登录密码</text>
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
.login-container {
  padding: 50rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.title {
  font-size: 56rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
  color: #2e7d32; /* 深绿色 */
}

.tab-bar {
  display: flex;
  width: 100%;
  margin-bottom: 40rpx;
  border-bottom: 2px solid #eee;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 4rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 36rpx;
  color: #666;
  position: relative;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #2e7d32;
  font-weight: bold;
  background: rgba(46, 125, 50, 0.1);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4rpx;
  background-color: #2e7d32;
  border-radius: 2rpx;
}

.input-item {
  width: 100%;
  height: 80rpx;
  border: 2px solid #eee;
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 25rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-item:focus-within {
  border-color: #2e7d32;
  box-shadow: 0 0 0 4rpx rgba(46, 125, 50, 0.1);
}

.input-item input {
  flex: 1;
  font-size: 34rpx;
  color: #333;
  height: 40rpx;
  line-height: 40rpx;
  border: none;
  outline: none;
  background: transparent;
}

.get-code-btn {
  background-color: #2e7d32;
  color: white;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
  margin-left: 20rpx;
  transition: all 0.3s ease;
  height: 40rpx;
  line-height: 40rpx;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.get-code-btn:disabled {
  background-color: #ccc;
  color: #999;
}

.login-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  padding: 20rpx 30rpx;
  border-radius: 12rpx;
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 30rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:active {
  transform: scale(0.98);
}

.quick-register {
  width: 100%;
  margin-top: 20rpx;
}

.quick-register-btn {
  width: 100%;
  height: 80rpx;
  background: transparent;
  color: #2e7d32;
  padding: 20rpx 30rpx;
  border: 2rpx solid #2e7d32;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: normal;
  margin: 0;
  box-shadow: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-register-btn:active {
  background: rgba(46, 125, 50, 0.1);
  transform: scale(0.98);
}

.links {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 40rpx;
}

.links navigator {
  color: #666;
  font-size: 32rpx;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links navigator:hover {
  color: #2e7d32;
}

.login-notice {
  margin-top: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12rpx;
  padding: 30rpx;
  width: 100%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.notice-title {
  display: block;
  color: #2e7d32;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.notice-item {
  display: block;
  color: #666;
  font-size: 28rpx;
  margin-bottom: 10rpx;
  line-height: 1.5;
}

/* 密码占位符，保持与验证码按钮宽度一致 */
.password-placeholder {
  width: 90rpx;
  height: 40rpx;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.debug-info {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  border: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.debug-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 10rpx;
}

.debug-item {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.debug-btn {
  background-color: #2e7d32;
  color: white;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
  margin-top: 10rpx;
}

/* 指纹登录样式 */
.fingerprint-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.fingerprint-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.fingerprint-icon.scanning {
  animation: fingerprintPulse 1.5s infinite;
}

.fingerprint-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.fingerprint-icon.scanning::before {
  animation: fingerprintScan 2s infinite;
}

@keyframes fingerprintPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20rpx rgba(46, 125, 50, 0);
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
  font-size: 60rpx;
  color: white;
}

.fingerprint-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 15rpx;
}

.fingerprint-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
  text-align: center;
}

.fingerprint-status {
  min-height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 26rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.status-text.ready {
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.1);
}

.status-text.scanning {
  color: #ff9800;
  background: rgba(255, 152, 0, 0.1);
  animation: statusBlink 1s infinite;
}

.status-text.success {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.status-text.failed {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.status-text.not-support {
  color: #9e9e9e;
  background: rgba(158, 158, 158, 0.1);
}

@keyframes statusBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fingerprint-login-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  padding: 20rpx 30rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 30rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
}

.fingerprint-login-btn:disabled {
  background: #ccc;
  color: #999;
  box-shadow: none;
}

.fingerprint-login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 32rpx;
}

</style>

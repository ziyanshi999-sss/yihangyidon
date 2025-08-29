<template>
  <view class="login-container">
    <!-- 标题 -->
    <view class="title">中国农业银行</view>
    
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
    </view>
    
    <!-- 登录表单 -->
    <form @submit="handleLogin">
      <!-- 手机号输入 -->
      <view class="input-item">
        <input 
          type="number" 
          v-model="phone" 
          placeholder="请输入用户名/手机号" 
          maxlength="11"
          required
        />
      </view>
      
      <!-- 密码/验证码输入 -->
      <view class="input-item" v-if="loginType === 'password'">
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入登录密码" 
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
      >
        登录
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
import { validateUser, generateVerificationCode, verifyCode } from '@/data/users.js'
import { handleLoginSuccess } from '@/utils/auth.js'

export default {
  data() {
    return {
      loginType: 'password', // 登录方式：password/code
      phone: '',
      password: '',
      code: '',
      countdown: 0,
      loading: false
    };
  },
  
  onLoad() {
    console.log('页面加载完成');
  },
  
  methods: {
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
            const { users } = require('@/data/users.js');
            user = users.find(u => u.phone === this.phone);
          } else {
            uni.showToast({ title: '验证码错误或已过期', icon: 'none' });
            this.loading = false;
            return;
          }
        }
        
        if (user) {
          // 记录设备信息
          // this.recordDeviceInfo(); // Removed as per edit hint
          
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
      if (!this.phone.trim()) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
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
  border-bottom: 1px solid #eee;
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
  border: 1px solid #eee;
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 25rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  min-height: 80rpx;
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
  height: 60rpx;
  line-height: 60rpx;
  border: none;
  outline: none;
  background: transparent;
}

.get-code-btn {
  background-color: #2e7d32;
  color: white;
  padding: 20rpx 25rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
  border: none;
  margin-left: 20rpx;
  transition: all 0.3s ease;
  height: 60rpx;
  line-height: 20rpx;
  white-space: nowrap;
  flex-shrink: 0;
}

.get-code-btn:disabled {
  background-color: #ccc;
  color: #999;
}

.login-btn {
  width: 100%;
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
  min-height: 80rpx;
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
  min-height: 80rpx;
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
</style>

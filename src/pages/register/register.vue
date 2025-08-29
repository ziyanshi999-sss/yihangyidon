<template>
  <view class="register-container">
    <!-- 标题 -->
    <view class="title">注册账户</view>
    <view class="subtitle">创建您的农业银行账户</view>
    
    <!-- 注册表单 -->
    <form @submit="handleRegister">
      <!-- 用户名输入 -->
      <view class="input-item">
        <input 
          type="text" 
          v-model="form.username" 
          placeholder="请输入用户名" 
          maxlength="20"
          required
        />
      </view>
      
      <!-- 手机号输入 -->
      <view class="input-item">
        <input 
          type="number" 
          v-model="form.phone" 
          placeholder="请输入手机号" 
          maxlength="11"
          required
        />
      </view>
      
      <!-- 验证码输入 -->
      <view class="input-item">
        <input 
          type="number" 
          v-model="form.code" 
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
      
      <!-- 密码输入 -->
      <view class="input-item">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="form.password" 
          placeholder="请输入登录密码" 
          required
        />
        <button 
          class="password-toggle" 
          @click.stop="togglePassword"
        >
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </view>
      
      <!-- 确认密码输入 -->
      <view class="input-item">
        <input 
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="form.confirmPassword" 
          placeholder="请再次输入密码" 
          required
        />
        <button 
          class="password-toggle" 
          @click.stop="toggleConfirmPassword"
        >
          {{ showConfirmPassword ? '🙈' : '👁️' }}
        </button>
      </view>
      
      <!-- 邮箱输入 -->
      <view class="input-item">
        <input 
          type="email" 
          v-model="form.email" 
          placeholder="请输入邮箱地址（选填）" 
        />
      </view>
      
      <!-- 昵称输入 -->
      <view class="input-item">
        <input 
          type="text" 
          v-model="form.nickname" 
          placeholder="请输入昵称（选填）" 
          maxlength="20"
        />
      </view>
      
      <!-- 注册按钮 -->
      <button 
        class="register-btn" 
        form-type="submit"
        :loading="loading"
      >
        立即注册
      </button>
    </form>
    
    <!-- 快速登录按钮 -->
    <view class="quick-login">
      <navigator url="/pages/denglu/login" open-type="navigate">
        <button class="quick-login-btn">
          已有账户？立即登录
        </button>
      </navigator>
    </view>

    <!-- 注册须知 -->
    <view class="register-notice">
      <text class="notice-title">注册须知：</text>
      <text class="notice-item">• 用户名支持中文、英文、数字，长度3-20个字符</text>
      <text class="notice-item">• 密码长度至少6位，建议包含字母和数字</text>
      <text class="notice-item">• 手机号用于接收验证码和安全提醒</text>
      <text class="notice-item">• 注册即表示同意相关服务条款和隐私政策</text>
    </view>
  </view>
</template>

<script>
import { generateVerificationCode, verifyCode, registerUser, checkUserExists } from '@/data/users.js'
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
        nickname: ''
      },
      countdown: 0,
      loading: false,
      showPassword: false,
      showConfirmPassword: false
    };
  },
  
  onLoad() {
    console.log('注册页面加载完成');
  },
  
  methods: {
    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    
    // 切换确认密码显示
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
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
            uni.showToast({ title: '验证码错误或已过期', icon: 'none' });
            this.loading = false;
            return;
          }
          
          // 检查用户是否已存在
          if (checkUserExists(this.form.username, this.form.phone)) {
            uni.showToast({ title: '用户名或手机号已存在', icon: 'none' });
            this.loading = false;
            return;
          }
          
          // 注册用户
          const user = registerUser({
            username: this.form.username,
            phone: this.form.phone,
            password: this.form.password,
            email: this.form.email,
            nickname: this.form.nickname || this.form.username
          });
          
          // 显示成功提示
          uni.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 1500
          });
          
          // 自动登录
          setTimeout(() => {
            handleLoginSuccess(user);
          }, 1500);
          
        } catch (error) {
          uni.showToast({ title: '注册失败，请重试', icon: 'none' });
          console.error('注册错误:', error);
        } finally {
          this.loading = false;
        }
      }, 1000);
    },
    
    // 验证手机号
    validatePhone() {
      if (!this.form.phone.trim()) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return false;
      }
      return true;
    },
    
    // 表单验证
    validateForm() {
      // 用户名验证
      if (!this.form.username.trim()) {
        uni.showToast({ title: '请输入用户名', icon: 'none' });
        return false;
      }
      if (this.form.username.length < 3 || this.form.username.length > 20) {
        uni.showToast({ title: '用户名长度应为3-20个字符', icon: 'none' });
        return false;
      }
      
      // 手机号验证
      if (!this.validatePhone()) {
        return false;
      }
      
      // 验证码验证
      if (!this.form.code.trim()) {
        uni.showToast({ title: '请输入验证码', icon: 'none' });
        return false;
      }
      if (!/^\d{6}$/.test(this.form.code)) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' });
        return false;
      }
      
      // 密码验证
      if (!this.form.password.trim()) {
        uni.showToast({ title: '请输入密码', icon: 'none' });
        return false;
      }
      if (this.form.password.length < 6) {
        uni.showToast({ title: '密码长度至少6位', icon: 'none' });
        return false;
      }
      
      // 确认密码验证
      if (!this.form.confirmPassword.trim()) {
        uni.showToast({ title: '请再次输入密码', icon: 'none' });
        return false;
      }
      if (this.form.password !== this.form.confirmPassword) {
        uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
        return false;
      }
      
      // 邮箱验证（选填）
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        uni.showToast({ title: '请输入正确的邮箱地址', icon: 'none' });
        return false;
      }
      
      return true;
    }
  }
};
</script>

<style scoped>
.register-container {
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
  margin-bottom: 20rpx;
  color: #2e7d32; /* 深绿色 */
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 60rpx;
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

.password-toggle {
  background: none;
  border: none;
  font-size: 32rpx;
  color: #666;
  padding: 10rpx;
  margin-left: 10rpx;
  flex-shrink: 0;
}

.register-btn {
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

.register-btn:active {
  transform: scale(0.98);
}

.quick-login {
  width: 100%;
  margin-top: 20rpx;
}

.quick-login-btn {
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

.quick-login-btn:active {
  background: rgba(46, 125, 50, 0.1);
  transform: scale(0.98);
}

.register-notice {
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
</style>

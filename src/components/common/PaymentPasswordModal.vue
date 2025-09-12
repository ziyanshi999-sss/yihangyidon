<template>
  <view class="payment-password-modal" v-if="visible" @click="handleMaskClick">
    <view class="modal-content" @click.stop>
      <!-- 弹窗头部 -->
      <view class="modal-header">
        <view class="header-left">
          <text class="close-btn" @click="closeModal">×</text>
        </view>
        <view class="header-title">交易密码验证</view>
        <view class="header-right"></view>
      </view>

      <!-- 弹窗内容 -->
      <view class="modal-body">
        <view class="payment-info">
          <view class="info-item">
            <text class="info-label">支付金额：</text>
            <text class="info-value amount">¥{{ amount.toFixed(2) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">收款方：</text>
            <text class="info-value">{{ payee }}</text>
          </view>
          <view class="info-item" v-if="description">
            <text class="info-label">交易说明：</text>
            <text class="info-value">{{ description }}</text>
          </view>
        </view>

        <!-- 密码输入区域 -->
        <view class="password-input-section">
          <view class="input-label">请输入交易密码</view>
          <view class="password-dots" @click="focusInput">
            <view 
              v-for="(dot, index) in passwordDots" 
              :key="index"
              class="password-dot"
              :class="{ 'filled': index < currentPassword.length }"
            >
              <text v-if="index < currentPassword.length">●</text>
            </view>
          </view>
          
          <!-- 隐藏的输入框 -->
          <input
            ref="passwordInput"
            type="password"
            v-model="currentPassword"
            maxlength="6"
            class="hidden-input"
            @input="onPasswordInput"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @keyup="onPasswordInput"
            @keydown="onPasswordInput"
            inputmode="numeric"
            pattern="[0-9]*"
          />
          
          <!-- 备用输入框（用于移动端） -->
          <input
            ref="passwordInputMobile"
            type="tel"
            v-model="currentPassword"
            maxlength="6"
            class="mobile-input"
            @input="onPasswordInput"
            @focus="onInputFocus"
            @blur="onInputBlur"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="请输入6位数字密码"
          />
        </view>

        <!-- 错误提示 -->
        <view class="error-message" v-if="errorMessage">
          <text class="error-text">{{ errorMessage }}</text>
        </view>

        <!-- 操作按钮 -->
        <view class="modal-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button 
            class="confirm-btn" 
            @click="confirmPayment"
            :disabled="currentPassword.length !== 6 || loading"
          >
            {{ loading ? '验证中...' : '确认支付' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '@/utils/auth.js'

export default {
  name: 'PaymentPasswordModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      required: true
    },
    payee: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentPassword: '',
      passwordDots: [1, 2, 3, 4, 5, 6], // 6个密码点
      errorMessage: '',
      loading: false,
      userInfo: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetModal()
        this.loadUserInfo()
        this.$nextTick(() => {
          this.focusInput()
        })
      }
    }
  },
  methods: {
    loadUserInfo() {
      this.userInfo = getUserInfo()
    },
    
    resetModal() {
      this.currentPassword = ''
      this.errorMessage = ''
      this.loading = false
    },
    
    focusInput() {
      console.log('尝试获得输入框焦点')
      
      // 优先尝试移动端输入框
      if (this.$refs.passwordInputMobile) {
        try {
          this.$refs.passwordInputMobile.focus()
          console.log('移动端输入框焦点设置成功')
          return
        } catch (error) {
          console.error('设置移动端输入框焦点失败:', error)
        }
      }
      
      // 备用：尝试隐藏输入框
      if (this.$refs.passwordInput) {
        try {
          this.$refs.passwordInput.focus()
          console.log('隐藏输入框焦点设置成功')
        } catch (error) {
          console.error('设置隐藏输入框焦点失败:', error)
        }
      } else {
        console.error('输入框引用不存在')
      }
    },
    
    onInputFocus() {
      console.log('输入框获得焦点')
    },
    
    onInputBlur() {
      console.log('输入框失去焦点')
    },
    
    onPasswordInput() {
      console.log('密码输入:', this.currentPassword)
      this.errorMessage = ''
      
      // 如果输入了6位密码，自动验证
      if (this.currentPassword.length === 6) {
        console.log('密码输入完成，开始验证')
        this.verifyPassword()
      }
    },
    
    async verifyPassword() {
      if (!this.userInfo || !this.userInfo.transactionPassword) {
        this.errorMessage = '未设置交易密码，请先设置'
        return false
      }
      
      if (this.currentPassword === this.userInfo.transactionPassword) {
        return true
      } else {
        this.errorMessage = '交易密码错误，请重新输入'
        this.currentPassword = ''
        return false
      }
    },
    
    async confirmPayment() {
      if (this.currentPassword.length !== 6) {
        this.errorMessage = '请输入6位交易密码'
        return
      }
      
      this.loading = true
      
      try {
        const isValid = await this.verifyPassword()
        
        if (isValid) {
          // 密码验证成功，触发支付确认事件
          this.$emit('payment-confirmed', {
            amount: this.amount,
            payee: this.payee,
            description: this.description,
            password: this.currentPassword
          })
          
          // 记录安全事件
          this.addSecurityEvent('payment', `支付¥${this.amount.toFixed(2)}给${this.payee}`)
          
          this.closeModal()
        } else {
          this.loading = false
        }
      } catch (error) {
        console.error('支付验证失败:', error)
        this.errorMessage = '验证失败，请重试'
        this.loading = false
      }
    },
    
    closeModal() {
      this.$emit('close')
    },
    
    handleMaskClick() {
      // 点击遮罩层关闭弹窗
      this.closeModal()
    },
    
    addSecurityEvent(type, description) {
      const userInfo = uni.getStorageSync('userInfo') || uni.getStorageSync('currentUser')
      if (userInfo && userInfo.securitySettings) {
        if (!userInfo.securitySettings.securityEvents) {
          userInfo.securitySettings.securityEvents = []
        }
        const newEvent = {
          id: Date.now(),
          type: type,
          description: description,
          timestamp: new Date().toISOString(),
          location: '当前位置',
          ip: '192.168.1.100',
          status: 'success'
        }
        userInfo.securitySettings.securityEvents.unshift(newEvent)
        if (userInfo.securitySettings.securityEvents.length > 50) {
          userInfo.securitySettings.securityEvents = userInfo.securitySettings.securityEvents.slice(0, 50)
        }
        uni.setStorageSync('userInfo', userInfo)
        uni.setStorageSync('currentUser', userInfo)
      }
    }
  }
}
</script>

<style scoped>
.payment-password-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20rpx;
}

.modal-content {
  background: #ffffff;
  border-radius: 24rpx;
  width: 100%;
  max-width: 640rpx;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 50rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-left, .header-right {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  font-size: 48rpx;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close-btn:active {
  opacity: 0.7;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.modal-body {
  padding: 50rpx;
}

.payment-info {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 50rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.amount {
  color: #e53e3e;
  font-weight: bold;
  font-size: 36rpx;
}

.password-input-section {
  margin-bottom: 40rpx;
}

.input-label {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 30rpx;
  text-align: center;
  font-weight: 500;
}

.password-dots {
  display: flex;
  justify-content: center;
  gap: 25rpx;
  margin-bottom: 30rpx;
  position: relative;
  cursor: pointer;
  padding: 20rpx;
  min-height: 120rpx;
}

.password-dot {
  width: 80rpx;
  height: 80rpx;
  border: 3rpx solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  transition: all 0.3s ease;
}

.password-dot.filled {
  border-color: #667eea;
  background: #667eea;
}

.password-dot.filled text {
  color: white;
  font-size: 32rpx;
}

.hidden-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  z-index: 10;
}

.mobile-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  text-align: center;
  background: #ffffff;
  margin-top: 20rpx;
  box-sizing: border-box;
}

.mobile-input:focus {
  border-color: #667eea;
  outline: none;
}

.error-message {
  text-align: center;
  margin-bottom: 30rpx;
}

.error-text {
  color: #e53e3e;
  font-size: 24rpx;
}

.modal-actions {
  display: flex;
  gap: 25rpx;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  height: 90rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666666;
}

.cancel-btn:active {
  background: #e0e0e0;
  transform: scale(0.98);
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.confirm-btn:disabled {
  background: #cccccc;
  color: #999;
  box-shadow: none;
}

.confirm-btn:active:not(:disabled) {
  transform: scale(0.98);
}
</style>

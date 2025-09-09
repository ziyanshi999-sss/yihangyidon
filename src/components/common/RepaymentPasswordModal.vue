<template>
  <view v-if="visible" class="modal-overlay" @click="closeModal">
    <view class="modal-container" @click.stop>
      <view class="modal-header">
        <text class="modal-title">还款确认</text>
        <text class="close-btn" @click="closeModal">×</text>
      </view>
      
      <view class="modal-content">
        <view class="repayment-info">
          <view class="card-info-header">
            <view class="card-icon">💳</view>
            <view class="card-details">
              <text class="card-type">信用卡还款</text>
              <text class="card-number">**** **** **** {{ cardNumber.slice(-4) }}</text>
            </view>
          </view>
          
          <view class="info-row">
            <text class="info-label">当前欠款</text>
            <text class="info-value amount">¥{{ cardInfo.currentBalance.toFixed(2) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">还款金额</text>
            <text class="info-value amount primary">¥{{ repaymentAmount.toFixed(2) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">还款后余额</text>
            <text class="info-value">¥{{ (cardInfo.currentBalance - repaymentAmount).toFixed(2) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">账户余额</text>
            <text class="info-value">¥{{ accountBalance.toFixed(2) }}</text>
          </view>
        </view>

        <view class="password-section">
          <text class="password-title">请输入支付密码</text>
          <view class="password-input-container">
            <input 
              ref="passwordInput"
              class="password-input" 
              type="password" 
              v-model="password" 
              maxlength="6"
              @input="onPasswordInput"
              @focus="onPasswordFocus"
              @blur="onPasswordBlur"
            />
            <view class="password-dots">
              <view 
                v-for="(dot, index) in 6" 
                :key="index"
                class="password-dot"
                :class="{ filled: index < password.length }"
              ></view>
            </view>
          </view>
          
          <view v-if="errorMessage" class="error-message">
            <text class="error-text">{{ errorMessage }}</text>
          </view>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="btn-cancel" @click="closeModal">取消</button>
        <button 
          class="btn-confirm" 
          :disabled="password.length !== 6 || isProcessing"
          @click="confirmRepayment"
        >
          {{ isProcessing ? '处理中...' : '确认还款' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { verifyPaymentPassword, repayCreditCard } from '@/api/balance'

export default {
  name: 'RepaymentPasswordModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cardNumber: {
      type: String,
      default: ''
    },
    repaymentAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      password: '',
      errorMessage: '',
      isProcessing: false,
      cardInfo: {
        currentBalance: 0
      },
      accountBalance: 0
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm()
        this.loadCardInfo()
        this.loadAccountBalance()
        this.$nextTick(() => {
          this.focusPasswordInput()
        })
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    resetForm() {
      this.password = ''
      this.errorMessage = ''
      this.isProcessing = false
    },
    async loadCardInfo() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        if (currentUser && currentUser.creditCards) {
          const card = currentUser.creditCards.find(c => c.cardNumber === this.cardNumber)
          if (card) {
            this.cardInfo = card
          }
        }
      } catch (error) {
        console.error('加载卡片信息失败:', error)
      }
    },
    async loadAccountBalance() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        if (currentUser) {
          this.accountBalance = currentUser.balance || 0
        }
      } catch (error) {
        console.error('加载账户余额失败:', error)
      }
    },
    focusPasswordInput() {
      if (this.$refs.passwordInput) {
        this.$refs.passwordInput.focus()
      }
    },
    onPasswordInput(e) {
      const value = e.detail.value
      // 只允许数字
      if (!/^\d*$/.test(value)) {
        this.password = value.replace(/\D/g, '')
        return
      }
      this.password = value
      this.errorMessage = ''
    },
    onPasswordFocus() {
      // 密码输入框获得焦点时的处理
    },
    onPasswordBlur() {
      // 密码输入框失去焦点时的处理
    },
    async confirmRepayment() {
      if (this.password.length !== 6) {
        this.errorMessage = '请输入6位支付密码'
        return
      }

      this.isProcessing = true
      this.errorMessage = ''

      try {
        // 验证支付密码
        const passwordValid = await verifyPaymentPassword(this.password)
        if (!passwordValid) {
          this.errorMessage = '支付密码错误'
          this.isProcessing = false
          return
        }

        // 检查账户余额
        if (this.accountBalance < this.repaymentAmount) {
          this.errorMessage = '账户余额不足'
          this.isProcessing = false
          return
        }

        // 执行还款
        const result = await repayCreditCard({
          cardNumber: this.cardNumber,
          amount: this.repaymentAmount,
          password: this.password
        })

        if (result.success) {
          this.$emit('repayment-success', result)
          this.closeModal()
        } else {
          this.errorMessage = result.message || '还款失败'
        }
      } catch (error) {
        console.error('还款失败:', error)
        this.errorMessage = '还款失败，请重试'
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>

<style scoped>
/* 🎨 清新简约风设计 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10rpx);
}

.modal-container {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  border: 1rpx solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 20rpx 60rpx rgba(59, 130, 246, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(59, 130, 246, 0.1);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e40af;
}

.close-btn {
  font-size: 40rpx;
  color: #3b82f6;
  cursor: pointer;
}

.modal-content {
  padding: 30rpx;
}

.repayment-info {
  background: rgba(240, 249, 255, 0.8);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
}

.card-info-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid rgba(59, 130, 246, 0.1);
}

.card-icon {
  font-size: 40rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12rpx;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.card-details {
  flex: 1;
}

.card-type {
  font-size: 26rpx;
  font-weight: 600;
  color: #1e40af;
  display: block;
  margin-bottom: 6rpx;
}

.card-number {
  font-size: 22rpx;
  color: #3b82f6;
  font-family: 'Courier New', monospace;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 24rpx;
  color: #3b82f6;
}

.info-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e40af;
}

.info-value.amount {
  font-size: 26rpx;
}

.info-value.primary {
  color: #3b82f6;
}

.password-section {
  margin-bottom: 30rpx;
}

.password-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 20rpx;
  display: block;
}

.password-input-container {
  position: relative;
}

.password-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
}

.password-dots {
  display: flex;
  justify-content: space-between;
  height: 80rpx;
  background: rgba(240, 249, 255, 0.8);
  border-radius: 16rpx;
  padding: 0 20rpx;
  border: 2rpx solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.password-dots:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1);
}

.password-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  margin: auto 0;
  transition: all 0.3s ease;
  border: 1rpx solid rgba(59, 130, 246, 0.3);
}

.password-dot.filled {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
  transform: scale(1.1);
}

.error-message {
  margin-top: 20rpx;
  padding: 16rpx;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12rpx;
  border: 1rpx solid rgba(239, 68, 68, 0.3);
}

.error-text {
  font-size: 24rpx;
  color: #dc2626;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid rgba(59, 130, 246, 0.1);
}

.btn-cancel, .btn-confirm {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1rpx solid rgba(107, 114, 128, 0.2);
}

.btn-cancel:hover {
  background: rgba(107, 114, 128, 0.2);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.btn-confirm:hover {
  box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.4);
  transform: translateY(-2rpx);
}

.btn-confirm:disabled {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  box-shadow: none;
  border: 1rpx solid rgba(107, 114, 128, 0.2);
}

/* 🎨 新增样式内容 - 动画效果和交互增强 */

/* 模态框进入动画 */
.modal-container {
  animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: translateY(50rpx) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 还款信息区域进入动画 */
.repayment-info {
  animation: infoSlideIn 0.6s ease-out 0.1s both;
}

@keyframes infoSlideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 密码区域进入动画 */
.password-section {
  animation: passwordSlideIn 0.6s ease-out 0.2s both;
}

@keyframes passwordSlideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片信息头部增强效果 */
.card-info-header {
  position: relative;
  overflow: hidden;
}

.card-info-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.card-info-header:hover::before {
  left: 100%;
}

/* 密码圆点增强效果 */
.password-dot {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.password-dot.filled {
  animation: dotFill 0.3s ease-out;
}

@keyframes dotFill {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* 密码输入框增强效果 */
.password-dots {
  transition: all 0.3s ease;
}

.password-dots:focus-within {
  animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 错误消息增强效果 */
.error-message {
  animation: errorShake 0.5s ease-in-out;
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5rpx);
  }
  75% {
    transform: translateX(5rpx);
  }
}

/* 按钮增强效果 */
.btn-confirm {
  position: relative;
  overflow: hidden;
}

.btn-confirm::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-confirm:hover::before {
  left: 100%;
}

/* 脉冲效果 */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10rpx rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 摇摆效果 */
.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5rpx);
  }
  75% {
    transform: translateX(5rpx);
  }
}

/* 弹跳效果 */
.bounce {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-10rpx);
  }
  70% {
    transform: translateY(-5rpx);
  }
  90% {
    transform: translateY(-2rpx);
  }
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 发光文字效果 */
.glow-text {
  text-shadow: 0 0 10rpx rgba(59, 130, 246, 0.5);
}

/* 3D效果 */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.card-3d:hover {
  transform: rotateY(5deg) rotateX(5deg);
}

/* 悬浮效果 */
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

/* 波浪效果 */
.wave {
  position: relative;
  overflow: hidden;
}

.wave::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: waveMove 2s infinite;
}

@keyframes waveMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 粒子效果 */
.particles {
  position: relative;
}

.particles::before,
.particles::after {
  content: '';
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: particleFloat 4s infinite;
}

.particles::before {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particles::after {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20rpx) scale(1.2);
    opacity: 1;
  }
}

/* 加载状态效果 */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  animation: loadingShimmer 1.5s infinite;
}

@keyframes loadingShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: rgba(255, 255, 255, 0.98);
    border: 1rpx solid rgba(59, 130, 246, 0.2);
  }
  
  .repayment-info {
    background: rgba(30, 41, 59, 0.8);
    border: 1rpx solid rgba(59, 130, 246, 0.2);
  }
  
  .password-dots {
    background: rgba(30, 41, 59, 0.8);
    border: 2rpx solid rgba(59, 130, 246, 0.3);
  }
  
  .error-message {
    background: rgba(239, 68, 68, 0.2);
    border: 1rpx solid rgba(239, 68, 68, 0.4);
  }
}
</style>
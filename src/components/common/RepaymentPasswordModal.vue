<template>
  <view v-if="visible" class="modal-overlay" @click="closeModal">
    <view class="modal-container" @click.stop>
      <!-- 模态框头部 -->
      <view class="modal-header">
        <text class="modal-title">还款确认</text>
        <text class="close-btn" @click="closeModal">×</text>
      </view>
      
      <!-- 模态框内容 -->
      <view class="modal-content">
        <!-- 还款信息 -->
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

        <!-- 密码输入区域 -->
        <view class="password-section">
          <text class="password-title">请输入支付密码</text>
          
          <!-- 密码输入框 -->
          <view class="password-input-wrapper">
            <input 
              ref="passwordInput"
              class="password-input" 
              type="number"
              v-model="passwordValue" 
              maxlength="6"
              placeholder="请输入6位数字密码"
              @input="handlePasswordInput"
              @focus="handlePasswordFocus"
              @blur="handlePasswordBlur"
            />
            
            <!-- 密码圆点显示 -->
            <view class="password-dots">
              <view 
                v-for="(dot, index) in 6" 
                :key="index"
                class="password-dot"
                :class="{ 
                  filled: index < passwordValue.length,
                  active: index === passwordValue.length
                }"
              ></view>
            </view>
          </view>
          
          <!-- 错误提示 -->
          <view v-if="errorMessage" class="error-message">
            <text class="error-text">{{ errorMessage }}</text>
          </view>
          
          <!-- 密码提示 -->
          <view class="password-hint">
            <text class="hint-text">请输入6位数字支付密码</text>
          </view>
        </view>
      </view>
      
      <!-- 模态框底部 -->
      <view class="modal-footer">
        <button class="btn-cancel" @click="closeModal">取消</button>
        <button 
          class="btn-confirm" 
          :disabled="!canConfirm || isProcessing"
          @click="handleConfirmRepayment"
        >
          {{ isProcessing ? '处理中...' : '确认还款' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { verifyPaymentPassword, executeCreditCardRepayment } from '@/api/payment'

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
      passwordValue: '', // 密码输入值
      errorMessage: '', // 错误信息
      isProcessing: false, // 处理状态
      cardInfo: {
        currentBalance: 0
      },
      accountBalance: 0
    }
  },
  computed: {
    // 是否可以确认还款
    canConfirm() {
      return this.passwordValue && 
             this.passwordValue.length === 6 && 
             !this.isProcessing &&
             !this.errorMessage
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initModal()
      } else {
        this.resetModal()
      }
    }
  },
  methods: {
    // 初始化模态框
    initModal() {
      console.log('初始化还款密码模态框')
      this.resetModal()
      this.loadCardInfo()
      this.loadAccountBalance()
      
      // 延迟聚焦输入框
      this.$nextTick(() => {
        setTimeout(() => {
          this.focusPasswordInput()
        }, 300)
      })
    },
    
    // 重置模态框
    resetModal() {
      this.passwordValue = ''
      this.errorMessage = ''
      this.isProcessing = false
    },
    
    // 加载卡片信息
    async loadCardInfo() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        if (currentUser && currentUser.creditCards) {
          const card = currentUser.creditCards.find(c => c.cardNumber === this.cardNumber)
          if (card) {
            this.cardInfo = { ...card }
            console.log('卡片信息加载成功:', this.cardInfo)
          }
        }
      } catch (error) {
        console.error('加载卡片信息失败:', error)
      }
    },
    
    // 加载账户余额
    async loadAccountBalance() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        if (currentUser) {
          this.accountBalance = currentUser.balance || 0
          console.log('账户余额加载成功:', this.accountBalance)
        }
      } catch (error) {
        console.error('加载账户余额失败:', error)
      }
    },
    
    // 聚焦密码输入框
    focusPasswordInput() {
      this.$nextTick(() => {
        if (this.$refs.passwordInput) {
          try {
            this.$refs.passwordInput.focus()
            console.log('密码输入框聚焦成功')
          } catch (error) {
            console.log('密码输入框聚焦失败:', error)
          }
        }
      })
    },
    
    // 处理密码输入
    handlePasswordInput(e) {
      console.log('密码输入事件:', e)
      
      // 获取输入值
      let value = ''
      if (e && e.detail && e.detail.value !== undefined) {
        value = e.detail.value
      } else if (e && e.target && e.target.value !== undefined) {
        value = e.target.value
      } else if (typeof e === 'string') {
        value = e
      }
      
      console.log('原始输入值:', value, '类型:', typeof value)
      
      // 只保留数字
      const numericValue = value.replace(/\D/g, '')
      
      // 限制长度为6位
      if (numericValue.length > 6) {
        this.passwordValue = numericValue.slice(0, 6)
      } else {
        this.passwordValue = numericValue
      }
      
      // 清除错误信息
      if (this.errorMessage) {
        this.errorMessage = ''
      }
      
      console.log('密码更新:', {
        original: value,
        numeric: numericValue,
        final: this.passwordValue,
        length: this.passwordValue.length
      })
    },
    
    // 处理密码输入框获得焦点
    handlePasswordFocus() {
      console.log('密码输入框获得焦点')
    },
    
    // 处理密码输入框失去焦点
    handlePasswordBlur() {
      console.log('密码输入框失去焦点')
    },
    
    // 处理确认还款
    async handleConfirmRepayment() {
      console.log('开始确认还款流程')
      
      // 验证密码长度
      if (!this.passwordValue || this.passwordValue.length !== 6) {
        this.errorMessage = '请输入6位支付密码'
        console.log('密码长度验证失败:', this.passwordValue?.length)
        return
      }
      
      // 验证密码格式（只允许数字）
      if (!/^\d{6}$/.test(this.passwordValue)) {
        this.errorMessage = '支付密码必须为6位数字'
        console.log('密码格式验证失败:', this.passwordValue)
        return
      }
      
      this.isProcessing = true
      this.errorMessage = ''
      
      console.log('开始验证支付密码:', {
        password: this.passwordValue,
        type: typeof this.passwordValue,
        length: this.passwordValue.length
      })
      
      try {
        // 验证支付密码
        const passwordValid = await this.verifyPassword(this.passwordValue)
        console.log('支付密码验证结果:', passwordValid)
        
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
        const result = await executeCreditCardRepayment({
          cardNumber: this.cardNumber,
          amount: this.repaymentAmount,
          password: this.passwordValue
        })
        console.log('还款执行结果:', result)
        
        if (result.success) {
          this.$emit('repayment-success', result)
          this.closeModal()
        } else {
          this.errorMessage = result.message || '还款失败'
        }
        
      } catch (error) {
        console.error('还款处理失败:', error)
        this.errorMessage = '还款失败，请重试'
      } finally {
        this.isProcessing = false
      }
    },
    
    // 验证支付密码
    async verifyPassword(password) {
      try {
        console.log('开始验证支付密码:', password)
        
        // 获取用户信息
        const userInfo = uni.getStorageSync('userInfo') || uni.getStorageSync('currentUser')
        if (!userInfo) {
          console.error('用户未登录')
          return false
        }
        
        console.log('用户信息:', {
          id: userInfo.id,
          username: userInfo.username,
          phone: userInfo.phone,
          hasTransactionPassword: !!userInfo.transactionPassword,
          storedPassword: userInfo.transactionPassword
        })
        
        // 验证密码
        const isValid = userInfo.transactionPassword === password
        console.log('密码验证结果:', {
          stored: userInfo.transactionPassword,
          input: password,
          match: isValid
        })
        
        return isValid
        
      } catch (error) {
        console.error('验证支付密码失败:', error)
        return false
      }
    },
    
    
    // 关闭模态框
    closeModal() {
      console.log('关闭还款密码模态框')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* 🎨 现代化设计风格 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8rpx);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: #ffffff;
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 模态框头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
}

.close-btn {
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 模态框内容 */
.modal-content {
  padding: 32rpx;
}

/* 还款信息 */
.repayment-info {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid #e0e7ff;
}

.card-info-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #d0d7ff;
}

.card-icon {
  font-size: 48rpx;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.card-details {
  flex: 1;
}

.card-type {
  font-size: 28rpx;
  font-weight: 600;
  color: #4a5568;
  display: block;
  margin-bottom: 8rpx;
}

.card-number {
  font-size: 24rpx;
  color: #667eea;
  font-family: 'Courier New', monospace;
  letter-spacing: 2rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 26rpx;
  color: #718096;
  font-weight: 500;
}

.info-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #2d3748;
}

.info-value.amount {
  font-size: 28rpx;
}

.info-value.primary {
  color: #667eea;
}

/* 密码输入区域 */
.password-section {
  margin-bottom: 32rpx;
}

.password-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 24rpx;
  display: block;
}

.password-input-wrapper {
  position: relative;
  margin-bottom: 20rpx;
}

.password-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  font-size: 32rpx;
  letter-spacing: 8rpx;
}

.password-dots {
  display: flex;
  justify-content: space-between;
  height: 88rpx;
  background: #f7fafc;
  border-radius: 16rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e2e8f0;
  transition: all 0.3s ease;
}

.password-dots:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  background: #ffffff;
}

.password-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin: auto 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2rpx solid #cbd5e0;
}

.password-dot.filled {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  transform: scale(1.1);
}

.password-dot.active {
  border-color: #667eea;
  background: #f0f4ff;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* 错误提示 */
.error-message {
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #fed7d7;
  border-radius: 12rpx;
  border: 1rpx solid #feb2b2;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5rpx); }
  75% { transform: translateX(5rpx); }
}

.error-text {
  font-size: 24rpx;
  color: #c53030;
  font-weight: 500;
}

/* 密码提示 */
.password-hint {
  margin-top: 12rpx;
  text-align: center;
}

.hint-text {
  font-size: 22rpx;
  color: #a0aec0;
}

/* 模态框底部 */
.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx 32rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fafafa;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-cancel {
  background: #ffffff;
  color: #718096;
  border: 2rpx solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  box-shadow: 0 12rpx 24rpx rgba(102, 126, 234, 0.4);
  transform: translateY(-2rpx);
}

.btn-confirm:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  box-shadow: none;
  cursor: not-allowed;
}

/* 按钮光效 */
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

/* 响应式设计 */
@media (max-width: 750rpx) {
  .modal-container {
    width: 95%;
    margin: 0 20rpx;
  }
  
  .modal-content {
    padding: 24rpx;
  }
  
  .repayment-info {
    padding: 20rpx;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #2d3748;
    color: #e2e8f0;
  }
  
  .repayment-info {
    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
    border-color: #4a5568;
  }
  
  .password-dots {
    background: #4a5568;
    border-color: #718096;
  }
  
  .password-dots:focus-within {
    background: #2d3748;
  }
  
  .error-message {
    background: #742a2a;
    border-color: #9b2c2c;
  }
  
  .modal-footer {
    background: #1a202c;
    border-color: #4a5568;
  }
}
</style>
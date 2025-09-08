<template>
  <view v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <view class="modal-container" @click.stop>
      <view class="modal-header">
        <text class="modal-title">信用卡还款</text>
        <text class="close-btn" @click="closeModal">×</text>
      </view>
      
      <view class="modal-content">
        <!-- 还款信息 -->
        <view class="repayment-info">
          <view class="info-row">
            <text class="info-label">信用卡</text>
            <text class="info-value">{{ cardInfo.cardType }} ****{{ cardInfo.cardNumber.slice(-4) }}</text>
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
            <text class="info-label">账户余额</text>
            <text class="info-value">¥{{ accountBalance.toFixed(2) }}</text>
          </view>
        </view>
        
        <!-- 支付密码输入 -->
        <view class="password-section">
          <text class="password-label">请输入支付密码</text>
          <view class="password-input-container">
            <input 
              v-model="password" 
              type="password" 
              class="password-input"
              placeholder="请输入6位支付密码"
              maxlength="6"
              :focus="inputFocus"
              @input="onPasswordInput"
              @blur="inputFocus = false"
            />
            <view class="password-dots">
              <view 
                v-for="(dot, index) in 6" 
                :key="index"
                class="password-dot"
                :class="{ filled: password.length > index }"
              ></view>
            </view>
          </view>
        </view>
        
        <!-- 错误提示 -->
        <view v-if="errorMessage" class="error-message">
          <text class="error-text">{{ errorMessage }}</text>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="btn-cancel" @click="closeModal">取消</button>
        <button 
          class="btn-confirm" 
          :class="{ disabled: password.length !== 6 || loading }"
          :disabled="password.length !== 6 || loading"
          @click="confirmRepayment"
        >
          {{ loading ? '处理中...' : '确认还款' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { repayCreditCard, getCreditCards, getUserBalance } from '@/api/balance.js'

export default {
  name: 'RepaymentPasswordModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cardNumber: {
      type: String,
      required: true
    },
    repaymentAmount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      password: '',
      inputFocus: false,
      loading: false,
      errorMessage: '',
      cardInfo: {},
      accountBalance: 0
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
    async initModal() {
      try {
        this.loading = true
        this.errorMessage = ''
        
        // 获取信用卡信息
        const card = await getCreditCards(this.cardNumber)
        if (!card) {
          this.errorMessage = '未找到信用卡信息'
          return
        }
        this.cardInfo = card
        
        // 获取账户余额
        const balance = await getUserBalance()
        this.accountBalance = balance
        
        // 检查余额是否足够
        if (balance < this.repaymentAmount) {
          this.errorMessage = '账户余额不足，无法完成还款'
          return
        }
        
        // 检查还款金额是否超过欠款
        if (this.repaymentAmount > card.currentBalance) {
          this.errorMessage = '还款金额不能超过当前欠款'
          return
        }
        
        // 聚焦密码输入框
        this.$nextTick(() => {
          this.inputFocus = true
        })
        
      } catch (error) {
        console.error('初始化还款模态框失败:', error)
        this.errorMessage = '获取信息失败，请重试'
      } finally {
        this.loading = false
      }
    },
    
    resetModal() {
      this.password = ''
      this.inputFocus = false
      this.loading = false
      this.errorMessage = ''
      this.cardInfo = {}
      this.accountBalance = 0
    },
    
    onPasswordInput(e) {
      this.password = e.detail.value
      this.errorMessage = ''
      
      // 自动提交（当输入6位密码时）
      if (this.password.length === 6) {
        this.$nextTick(() => {
          this.confirmRepayment()
        })
      }
    },
    
    async confirmRepayment() {
      if (this.password.length !== 6) {
        this.errorMessage = '请输入6位支付密码'
        return
      }
      
      try {
        this.loading = true
        this.errorMessage = ''
        
        const result = await repayCreditCard(this.cardNumber, this.repaymentAmount, this.password)
        
        if (result.success) {
          uni.showToast({
            title: '还款成功',
            icon: 'success',
            duration: 2000
          })
          
          // 通知父组件还款成功
          this.$emit('repayment-success', {
            cardNumber: this.cardNumber,
            amount: this.repaymentAmount,
            newBalance: result.newBalance,
            newCardBalance: result.newCardBalance,
            newAvailableCredit: result.newAvailableCredit
          })
          
          this.closeModal()
        } else {
          this.errorMessage = result.message
        }
        
      } catch (error) {
        console.error('还款失败:', error)
        this.errorMessage = '还款失败，请重试'
      } finally {
        this.loading = false
      }
    },
    
    closeModal() {
      this.$emit('close')
    },
    
    handleOverlayClick() {
      if (!this.loading) {
        this.closeModal()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 16rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  padding: 30rpx;
}

.repayment-info {
  background-color: #f8f9fa;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.info-value.amount {
  font-weight: bold;
}

.info-value.primary {
  color: #ff6b35;
}

.password-section {
  margin-bottom: 30rpx;
}

.password-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
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
  background-color: #f8f9fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e9ecef;
}

.password-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #e9ecef;
  margin: auto 0;
  transition: all 0.3s ease;
}

.password-dot.filled {
  background-color: #333;
}

.error-message {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff5f5;
  border-radius: 8rpx;
  border: 1rpx solid #fed7d7;
}

.error-text {
  color: #e53e3e;
  font-size: 26rpx;
}

.modal-footer {
  display: flex;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  gap: 20rpx;
}

.btn-cancel {
  flex: 1;
  height: 80rpx;
  background-color: #f8f9fa;
  color: #666;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.btn-confirm {
  flex: 1;
  height: 80rpx;
  background-color: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.btn-confirm.disabled {
  background-color: #ccc;
  color: #999;
}

.btn-confirm:not(.disabled):active {
  background-color: #e55a2b;
}
</style>

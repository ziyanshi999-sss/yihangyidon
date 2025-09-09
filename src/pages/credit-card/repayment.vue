<template>
  <view class="repayment-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="header-title">信用卡还款</text>
        <text class="header-subtitle">安全便捷的还款服务</text>
      </view>
      <view class="header-decoration"></view>
    </view>

    <!-- 信用卡列表 -->
    <view class="cards-section">
      <view class="section-header">
        <text class="section-title">选择信用卡</text>
        <view class="section-badge">{{ creditCards.length }}张卡片</view>
      </view>
      <view class="cards-list">
        <view 
          v-for="card in creditCards" 
          :key="card.cardNumber"
          class="card-item"
          :class="{ selected: selectedCard && selectedCard.cardNumber === card.cardNumber }"
          @click="selectCard(card)"
        >
          <view class="card-gradient"></view>
          <view class="card-content">
            <view class="card-header">
              <view class="card-info">
                <text class="card-type">{{ card.cardType }}</text>
                <text class="card-number">**** **** **** {{ card.cardNumber.slice(-4) }}</text>
              </view>
              <view class="card-status" :class="card.cardStatus">
                <view class="status-dot"></view>
                <text>{{ card.cardStatus === 'active' ? '正常' : '异常' }}</text>
              </view>
            </view>
            
            <view class="card-details">
              <view class="detail-row">
                <text class="detail-label">信用额度</text>
                <text class="detail-value">¥{{ card.creditLimit.toLocaleString() }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">可用额度</text>
                <text class="detail-value">¥{{ card.availableCredit.toLocaleString() }}</text>
              </view>
              <view class="detail-row highlight">
                <text class="detail-label">当前欠款</text>
                <text class="detail-value amount">¥{{ card.currentBalance.toLocaleString() }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">最低还款</text>
                <text class="detail-value">¥{{ card.minPayment.toLocaleString() }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 还款金额输入 -->
    <view v-if="selectedCard" class="amount-section">
      <view class="section-header">
        <text class="section-title">还款金额</text>
        <text class="section-desc">请输入或选择还款金额</text>
      </view>
      
      <view class="amount-input-wrapper">
        <view class="amount-input-container">
          <text class="currency-symbol">¥</text>
          <input 
            v-model="repaymentAmount" 
            type="digit" 
            class="amount-input"
            placeholder="请输入还款金额"
            @input="onAmountInput"
            @focus="onAmountFocus"
            @blur="onAmountBlur"
          />
          <view v-if="repaymentAmount" class="clear-btn" @click="clearAmount">
            <text class="clear-icon">×</text>
          </view>
        </view>
        <view class="input-underline" :class="{ active: isAmountFocused }"></view>
      </view>
      
      <!-- 快捷金额按钮 -->
      <view class="quick-amounts">
        <view class="quick-amounts-title">快捷选择</view>
        <view class="quick-amounts-grid">
          <!-- 金额按钮行 -->
          <view class="quick-amounts-row">
            <button 
              v-for="amount in [100, 500, 1000, 5000]" 
              :key="amount"
              class="quick-amount-btn"
              :class="{ active: repaymentAmount === amount.toString() }"
              @click="setQuickAmount(amount)"
            >
              <text class="btn-text">¥{{ amount }}</text>
              <view class="btn-ripple"></view>
            </button>
          </view>
          <!-- 全额还款按钮 -->
          <view class="quick-amounts-full">
            <button 
              class="quick-amount-btn full-repayment-btn"
              :class="{ active: repaymentAmount === 'all' }"
              @click="setQuickAmount('all')"
            >
              <text class="btn-text">全额还款</text>
              <view class="btn-ripple"></view>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 还款信息确认 -->
    <view v-if="selectedCard && repaymentAmount" class="confirm-section">
      <view class="confirm-card">
        <view class="confirm-header">
          <text class="confirm-title">还款确认</text>
          <view class="confirm-icon">💳</view>
        </view>
        <view class="confirm-details">
          <view class="confirm-row">
            <view class="confirm-item">
              <text class="confirm-label">信用卡</text>
              <text class="confirm-value">{{ selectedCard.cardType }} ****{{ selectedCard.cardNumber.slice(-4) }}</text>
            </view>
          </view>
          <view class="confirm-row highlight">
            <view class="confirm-item">
              <text class="confirm-label">还款金额</text>
              <text class="confirm-value amount">¥{{ parseFloat(repaymentAmount || 0).toFixed(2) }}</text>
            </view>
          </view>
          <view class="confirm-row">
            <view class="confirm-item">
              <text class="confirm-label">还款后余额</text>
              <text class="confirm-value">¥{{ (selectedCard.currentBalance - parseFloat(repaymentAmount || 0)).toFixed(2) }}</text>
            </view>
          </view>
        </view>
        <view class="confirm-footer">
          <text class="confirm-tip">请确认信息无误后点击还款</text>
        </view>
      </view>
    </view>

    <!-- 还款按钮 -->
    <view class="action-section">
      <button 
        class="repayment-btn"
        :class="{ disabled: !canRepay, loading: isProcessing }"
        :disabled="!canRepay || isProcessing"
        @click="showRepaymentModal"
      >
        <view v-if="isProcessing" class="btn-loading">
          <view class="loading-spinner"></view>
          <text>处理中...</text>
        </view>
        <view v-else class="btn-content">
          <text class="btn-text">确认还款</text>
          <view class="btn-icon">→</view>
        </view>
      </button>
    </view>

    <!-- 还款记录 -->
    <view class="records-section">
      <view class="records-header">
        <view class="section-header">
          <text class="section-title">最近还款记录</text>
          <view class="records-count">{{ repaymentRecords.length }}条记录</view>
        </view>
        <view class="view-all" @click="viewAllRecords">
          <text>查看全部</text>
          <view class="arrow-icon">→</view>
        </view>
      </view>
      <view class="records-list">
        <view v-if="repaymentRecords.length === 0" class="empty-records">
          <view class="empty-icon">📋</view>
          <text class="empty-text">暂无还款记录</text>
          <text class="empty-desc">完成首次还款后记录将显示在这里</text>
        </view>
        <view v-else>
          <view 
            v-for="record in repaymentRecords.slice(0, 5)" 
            :key="record.id"
            class="record-item"
          >
            <view class="record-icon">
              <text>💳</text>
            </view>
            <view class="record-info">
              <text class="record-title">{{ record.title }}</text>
              <text class="record-desc">{{ record.description }}</text>
              <text class="record-time">{{ formatTime(record.timestamp) }}</text>
            </view>
            <view class="record-amount">
              <text class="amount-text">-¥{{ record.amount.toFixed(2) }}</text>
              <view class="amount-status success">成功</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 还款密码模态框 -->
    <RepaymentPasswordModal
      :visible="showPasswordModal"
      :card-number="selectedCard ? selectedCard.cardNumber : ''"
      :repayment-amount="parseFloat(repaymentAmount || 0)"
      @close="closeRepaymentModal"
      @repayment-success="onRepaymentSuccess"
    />
  </view>
</template>

<script>
import { getCreditCards, getRepaymentRecords, getUserBalance } from '@/api/balance.js'
import RepaymentPasswordModal from '@/components/common/RepaymentPasswordModal.vue'

export default {
  name: 'CreditCardRepayment',
  components: {
    RepaymentPasswordModal
  },
  data() {
    return {
      creditCards: [],
      selectedCard: null,
      repaymentAmount: '',
      showPasswordModal: false,
      repaymentRecords: [],
      accountBalance: 0,
      quickAmounts: [100, 500, 1000, 5000, 'all'],
      isAmountFocused: false,
      isProcessing: false
    }
  },
  computed: {
    canRepay() {
      if (!this.selectedCard || !this.repaymentAmount) {
        return false
      }
      
      const amount = parseFloat(this.repaymentAmount)
      return amount > 0 && 
             amount <= this.selectedCard.currentBalance && 
             amount <= this.accountBalance
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        // 加载信用卡列表
        const cards = await getCreditCards()
        this.creditCards = cards.filter(card => card.cardStatus === 'active')
        
        // 加载账户余额
        this.accountBalance = await getUserBalance()
        
        // 加载还款记录
        const records = await getRepaymentRecords()
        this.repaymentRecords = records
        
        // 默认选择第一张卡
        if (this.creditCards.length > 0) {
          this.selectedCard = this.creditCards[0]
        }
        
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
      }
    },
    
    selectCard(card) {
      this.selectedCard = card
      this.repaymentAmount = ''
    },
    
    onAmountInput(e) {
      this.repaymentAmount = e.detail.value
    },
    
    onAmountFocus() {
      this.isAmountFocused = true
    },
    
    onAmountBlur() {
      this.isAmountFocused = false
    },
    
    clearAmount() {
      this.repaymentAmount = ''
    },
    
    setQuickAmount(amount) {
      if (amount === 'all') {
        this.repaymentAmount = this.selectedCard.currentBalance.toString()
      } else {
        this.repaymentAmount = amount.toString()
      }
    },
    
    showRepaymentModal() {
      if (!this.canRepay) {
        if (!this.repaymentAmount) {
          uni.showToast({
            title: '请输入还款金额',
            icon: 'none'
          })
        } else if (parseFloat(this.repaymentAmount) > this.selectedCard.currentBalance) {
          uni.showToast({
            title: '还款金额不能超过欠款',
            icon: 'none'
          })
        } else if (parseFloat(this.repaymentAmount) > this.accountBalance) {
          uni.showToast({
            title: '账户余额不足',
            icon: 'none'
          })
        }
        return
      }
      
      this.showPasswordModal = true
    },
    
    closeRepaymentModal() {
      this.showPasswordModal = false
    },
    
    async onRepaymentSuccess(result) {
      console.log('还款成功:', result)
      
      // 更新选中卡片信息
      if (this.selectedCard) {
        this.selectedCard.currentBalance = result.newCardBalance
        this.selectedCard.availableCredit = result.newAvailableCredit
      }
      
      // 更新账户余额
      this.accountBalance = result.newBalance
      
      // 重新加载还款记录
      const records = await getRepaymentRecords()
      this.repaymentRecords = records
      
      // 清空还款金额
      this.repaymentAmount = ''
      
      uni.showToast({
        title: '还款成功',
        icon: 'success'
      })
    },
    
    viewAllRecords() {
      uni.navigateTo({
        url: '/pages/balance/balance?type=repayment'
      })
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return Math.floor(diff / 60000) + '分钟前'
      } else if (diff < 86400000) { // 1天内
        return Math.floor(diff / 3600000) + '小时前'
      } else {
        return date.toLocaleDateString('zh-CN')
      }
    }
  }
}
</script>

<style scoped>
.repayment-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 30rpx 40rpx;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-title {
  font-size: 48rpx;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.header-subtitle {
  font-size: 28rpx;
  color: rgba(255,255,255,0.8);
  font-weight: 400;
}

.header-decoration {
  position: absolute;
  top: -50rpx;
  right: -50rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  z-index: 1;
}

.cards-section {
  background-color: #fff;
  margin: 30rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.section-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.section-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card-item {
  position: relative;
  border: 2rpx solid #f0f0f0;
  border-radius: 20rpx;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: #fff;
}

.card-item.selected {
  border-color: #667eea;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.2);
  transform: translateY(-4rpx);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-item.selected .card-gradient {
  opacity: 1;
}

.card-content {
  padding: 32rpx;
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-type {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.card-number {
  font-size: 26rpx;
  color: #666;
  font-family: 'Courier New', monospace;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.card-status.active {
  background: linear-gradient(135deg, #e8f5e8, #f0f9f0);
  color: #52c41a;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #52c41a;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-radius: 8rpx;
  transition: background-color 0.2s ease;
}

.detail-row.highlight {
  background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
  padding: 16rpx 20rpx;
  margin: 0 -20rpx;
  border-radius: 12rpx;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 28rpx;
  color: #1a1a1a;
  font-weight: 600;
}

.detail-value.amount {
  color: #667eea;
  font-weight: 700;
  font-size: 32rpx;
}

.amount-section {
  background-color: #fff;
  margin: 30rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
}

.amount-input-wrapper {
  position: relative;
  margin-bottom: 40rpx;
}

.amount-input-container {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
  border: 2rpx solid #e8ecf0;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.amount-input-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  background: #fff;
}

.currency-symbol {
  font-size: 40rpx;
  color: #667eea;
  margin-right: 16rpx;
  font-weight: 700;
}

.amount-input {
  flex: 1;
  font-size: 40rpx;
  color: #1a1a1a;
  border: none;
  background: transparent;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.amount-input::placeholder {
  color: #999;
  font-weight: 400;
}

.clear-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  transition: all 0.2s ease;
}

.clear-btn:active {
  background: #e0e0e0;
  transform: scale(0.95);
}

.clear-icon {
  font-size: 32rpx;
  color: #666;
  font-weight: 600;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-underline.active {
  transform: scaleX(1);
}

.quick-amounts {
  margin-top: 20rpx;
}

.quick-amounts-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 24rpx;
  font-weight: 600;
}

.quick-amounts-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.quick-amounts-row {
  display: grid;
  grid-template-columns: 120rpx 120rpx;
  gap: 16rpx;
  justify-content: center;
}

.quick-amounts-full {
  display: flex;
  justify-content: center;
  margin-top: 8rpx;
}

.quick-amount-btn {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  padding: 0;
  background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
  color: #667eea;
  border: 2rpx solid #e8ecf0;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-amount-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-color: #667eea;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transform: translateY(-2rpx);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.quick-amount-btn:active .btn-ripple {
  width: 200rpx;
  height: 200rpx;
}

.full-repayment-btn {
  width: 260rpx;
  height: 120rpx;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-section {
  margin: 30rpx 20rpx;
}

.confirm-card {
  background: linear-gradient(135deg, #fff, #f8f9ff);
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
  border: 2rpx solid #f0f4ff;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.confirm-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.confirm-icon {
  font-size: 32rpx;
  opacity: 0.8;
}

.confirm-details {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.confirm-row {
  padding: 16rpx 0;
  border-radius: 12rpx;
  transition: background-color 0.2s ease;
}

.confirm-row.highlight {
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  padding: 20rpx 24rpx;
  margin: 0 -24rpx;
  border-radius: 16rpx;
}

.confirm-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirm-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.confirm-value {
  font-size: 28rpx;
  color: #1a1a1a;
  font-weight: 600;
}

.confirm-value.amount {
  color: #667eea;
  font-weight: 700;
  font-size: 32rpx;
}

.confirm-footer {
  margin-top: 24rpx;
  text-align: center;
}

.confirm-tip {
  font-size: 24rpx;
  color: #999;
  font-style: italic;
}

.action-section {
  padding: 30rpx 20rpx;
}

.repayment-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.repayment-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
}

.repayment-btn.disabled {
  background: linear-gradient(135deg, #ccc, #bbb);
  color: #999;
  box-shadow: none;
  transform: none;
}

.repayment-btn.loading {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.loading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid rgba(255,255,255,0.3);
  border-top: 4rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 700;
}

.btn-icon {
  font-size: 28rpx;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.repayment-btn:active .btn-icon {
  transform: translateX(4rpx);
}

.records-section {
  background-color: #fff;
  margin: 30rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.records-count {
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  color: #667eea;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #667eea;
  font-weight: 600;
  transition: all 0.2s ease;
}

.view-all:active {
  transform: translateX(4rpx);
}

.arrow-icon {
  font-size: 24rpx;
  transition: transform 0.2s ease;
}

.view-all:active .arrow-icon {
  transform: translateX(4rpx);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.empty-records {
  text-align: center;
  padding: 80rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.2s ease;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:active {
  background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
  margin: 0 -24rpx;
  padding: 24rpx;
  border-radius: 16rpx;
}

.record-icon {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.record-title {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
}

.record-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.amount-text {
  font-size: 32rpx;
  color: #667eea;
  font-weight: 700;
}

.amount-status {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.amount-status.success {
  background: linear-gradient(135deg, #e8f5e8, #f0f9f0);
  color: #52c41a;
}
</style>

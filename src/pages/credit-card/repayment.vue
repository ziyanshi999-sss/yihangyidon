<template>
  <view class="repayment-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">信用卡还款</text>
    </view>

    <!-- 信用卡列表 -->
    <view class="cards-section">
      <text class="section-title">选择信用卡</text>
      <view class="cards-list">
        <view 
          v-for="card in creditCards" 
          :key="card.cardNumber"
          class="card-item"
          :class="{ selected: selectedCard && selectedCard.cardNumber === card.cardNumber }"
          @click="selectCard(card)"
        >
          <view class="card-header">
            <view class="card-info">
              <text class="card-type">{{ card.cardType }}</text>
              <text class="card-number">**** **** **** {{ card.cardNumber.slice(-4) }}</text>
            </view>
            <view class="card-status" :class="card.cardStatus">
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
            <view class="detail-row">
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

    <!-- 还款金额输入 -->
    <view v-if="selectedCard" class="amount-section">
      <text class="section-title">还款金额</text>
      <view class="amount-input-container">
        <text class="currency-symbol">¥</text>
        <input 
          v-model="repaymentAmount" 
          type="digit" 
          class="amount-input"
          placeholder="请输入还款金额"
          @input="onAmountInput"
        />
      </view>
      
      <!-- 快捷金额按钮 -->
      <view class="quick-amounts">
        <button 
          v-for="amount in quickAmounts" 
          :key="amount"
          class="quick-amount-btn"
          :class="{ active: repaymentAmount === amount }"
          @click="setQuickAmount(amount)"
        >
          {{ amount === 'all' ? '全额还款' : `¥${amount}` }}
        </button>
      </view>
    </view>

    <!-- 还款信息确认 -->
    <view v-if="selectedCard && repaymentAmount" class="confirm-section">
      <view class="confirm-card">
        <text class="confirm-title">还款确认</text>
        <view class="confirm-details">
          <view class="confirm-row">
            <text class="confirm-label">信用卡</text>
            <text class="confirm-value">{{ selectedCard.cardType }} ****{{ selectedCard.cardNumber.slice(-4) }}</text>
          </view>
          <view class="confirm-row">
            <text class="confirm-label">还款金额</text>
            <text class="confirm-value amount">¥{{ parseFloat(repaymentAmount || 0).toFixed(2) }}</text>
          </view>
          <view class="confirm-row">
            <text class="confirm-label">还款后余额</text>
            <text class="confirm-value">¥{{ (selectedCard.currentBalance - parseFloat(repaymentAmount || 0)).toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 还款按钮 -->
    <view class="action-section">
      <button 
        class="repayment-btn"
        :class="{ disabled: !canRepay }"
        :disabled="!canRepay"
        @click="showRepaymentModal"
      >
        确认还款
      </button>
    </view>

    <!-- 还款记录 -->
    <view class="records-section">
      <view class="records-header">
        <text class="section-title">最近还款记录</text>
        <text class="view-all" @click="viewAllRecords">查看全部</text>
      </view>
      <view class="records-list">
        <view v-if="repaymentRecords.length === 0" class="empty-records">
          <text class="empty-text">暂无还款记录</text>
        </view>
        <view v-else>
          <view 
            v-for="record in repaymentRecords.slice(0, 5)" 
            :key="record.id"
            class="record-item"
          >
            <view class="record-info">
              <text class="record-title">{{ record.title }}</text>
              <text class="record-desc">{{ record.description }}</text>
              <text class="record-time">{{ formatTime(record.timestamp) }}</text>
            </view>
            <text class="record-amount">-¥{{ record.amount.toFixed(2) }}</text>
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
      quickAmounts: [100, 500, 1000, 5000, 'all']
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
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.page-header {
  background-color: #fff;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.cards-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.card-item {
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.card-item.selected {
  border-color: #ff6b35;
  background-color: #fff5f2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.card-number {
  font-size: 24rpx;
  color: #666;
}

.card-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.card-status.active {
  background-color: #e8f5e8;
  color: #52c41a;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.detail-value.amount {
  color: #ff6b35;
  font-weight: bold;
}

.amount-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.amount-input-container {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.currency-symbol {
  font-size: 32rpx;
  color: #333;
  margin-right: 10rpx;
}

.amount-input {
  flex: 1;
  font-size: 32rpx;
  color: #333;
  border: none;
  background: transparent;
}

.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.quick-amount-btn {
  padding: 15rpx 25rpx;
  background-color: #f8f9fa;
  color: #666;
  border: 1rpx solid #e9ecef;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.quick-amount-btn.active {
  background-color: #ff6b35;
  color: #fff;
  border-color: #ff6b35;
}

.confirm-section {
  margin: 20rpx;
}

.confirm-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.confirm-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.confirm-details {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.confirm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirm-label {
  font-size: 26rpx;
  color: #666;
}

.confirm-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.confirm-value.amount {
  color: #ff6b35;
  font-weight: bold;
}

.action-section {
  padding: 30rpx;
}

.repayment-btn {
  width: 100%;
  height: 88rpx;
  background-color: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.repayment-btn.disabled {
  background-color: #ccc;
  color: #999;
}

.records-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.view-all {
  font-size: 26rpx;
  color: #ff6b35;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.empty-records {
  text-align: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.record-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.record-desc {
  font-size: 24rpx;
  color: #666;
}

.record-time {
  font-size: 22rpx;
  color: #999;
}

.record-amount {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}
</style>

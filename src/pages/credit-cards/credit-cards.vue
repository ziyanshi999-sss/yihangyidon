<template>
  <view class="credit-cards-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-icon" @click="goBack">←</text>
        <text class="nav-title">信用卡管理</text>
      </view>
      <view class="nav-right">
        <text class="eye-icon" @click="toggleBalanceVisibility">👁</text>
        <text class="add-icon" @click="showAddCardModal">+</text>
      </view>
    </view>

    <!-- 卡片统计信息 -->
    <view class="cards-summary-section">
      <view class="summary-card">
        <view class="summary-header">
          <text class="summary-title">信用卡概览</text>
          <text class="summary-subtitle">共 {{ creditCards.length }} 张卡片</text>
        </view>
        <view class="summary-stats">
          <view class="stat-item">
            <text class="stat-value">{{ formatCurrency(totalCreditLimit) }}</text>
            <text class="stat-label">总授信额度</text>
          </view>
          <view class="stat-item">
            <text class="stat-value available">{{ formatCurrency(totalAvailableCredit) }}</text>
            <text class="stat-label">可用额度</text>
          </view>
          <view class="stat-item">
            <text class="stat-value debt">{{ formatCurrency(totalCurrentBalance) }}</text>
            <text class="stat-label">当前欠款</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 信用卡列表 -->
    <view class="credit-cards-list-section">
      <view class="section-header" @click="toggleCardsVisibility">
        <text class="section-title">我的信用卡</text>
        <text class="section-subtitle">{{ showCards ? '点击隐藏详情' : '点击查看详情' }}</text>
        <text class="expand-icon" :class="{ 'expanded': showCards }">▼</text>
      </view>
      <view class="cards-list" :class="{ 'show': showCards }" v-show="showCards">
        <view 
          v-for="card in creditCards" 
          :key="card.id"
          class="card-item"
          :style="{ background: card.cardColor }"
          @click="viewCardDetail(card)"
        >
          <view class="card-header">
            <view class="card-brand">
              <text class="brand-text">{{ card.bankName }}</text>
            </view>
            <view class="card-type">
              <text class="type-text">{{ card.cardType }}</text>
            </view>
            <view class="card-status">
              <text class="status-text">{{ getStatusText(card.status) }}</text>
            </view>
          </view>
          
          <view class="card-number">
            <text class="number-text">{{ formatCardNumber(card.cardNumber) }}</text>
          </view>
          
          <view class="card-info">
            <view class="info-row">
              <text class="info-label">授信额度</text>
              <text class="info-value">{{ formatCurrency(card.creditLimit) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">可用额度</text>
              <text class="info-value available">{{ formatCurrency(card.availableCredit) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">当前欠款</text>
              <text class="info-value debt">{{ formatCurrency(card.currentBalance) }}</text>
            </view>
          </view>
          
          <view class="card-actions">
            <button class="action-btn" @click.stop="handleRepay(card)">
              <text class="btn-icon">💳</text>
              <text class="btn-text">还款</text>
            </button>
            <button class="action-btn" @click.stop="viewCardDetail(card)">
              <text class="btn-icon">📊</text>
              <text class="btn-text">详情</text>
            </button>
            <button class="action-btn" @click.stop="handleManageCard(card)">
              <text class="btn-icon">⚙️</text>
              <text class="btn-text">管理</text>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能区 -->
    <view class="quick-actions-section">
      <view class="section-header">
        <text class="section-title">快捷功能</text>
      </view>
      <view class="actions-grid">
        <view class="action-item" @click="showAddCardModal">
          <text class="action-icon">➕</text>
          <text class="action-text">添加卡片</text>
        </view>
        <view class="action-item" @click="goToRepayment">
          <text class="action-icon">💳</text>
          <text class="action-text">快速还款</text>
        </view>
        <view class="action-item" @click="showBillReminder">
          <text class="action-icon">📅</text>
          <text class="action-text">账单提醒</text>
        </view>
        <view class="action-item" @click="showCreditReport">
          <text class="action-icon">📈</text>
          <text class="action-text">信用报告</text>
        </view>
      </view>
    </view>

    <!-- 信用卡优惠活动 -->
    <view class="promotions-section">
      <view class="section-header">
        <text class="section-title">优惠活动</text>
        <text class="section-subtitle">更多优惠</text>
      </view>
      <view class="promotions-list">
        <view class="promotion-item">
          <view class="promotion-icon">🎉</view>
          <view class="promotion-content">
            <text class="promotion-title">新用户专享</text>
            <text class="promotion-desc">首年免年费，积分翻倍</text>
          </view>
          <view class="promotion-action">
            <text class="action-text">立即申请</text>
          </view>
        </view>
        <view class="promotion-item">
          <view class="promotion-icon">💰</view>
          <view class="promotion-content">
            <text class="promotion-title">消费返现</text>
            <text class="promotion-desc">指定商户消费返现5%</text>
          </view>
          <view class="promotion-action">
            <text class="action-text">查看详情</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 卡片详情模态框 -->
    <CardDetailModal 
      :visible="showCardDetailModal"
      :card-info="selectedCard"
      :balance-visible="balanceVisible"
      @close="closeCardDetailModal"
      @repay="handleRepayFromDetail"
      @manage="handleManageCard"
    />

    <!-- 还款密码模态框 -->
    <RepaymentPasswordModal
      :visible="showRepaymentPasswordModal"
      :card-number="selectedCard ? selectedCard.cardNumber : ''"
      :repayment-amount="repaymentAmountForModal"
      @close="closeRepaymentPasswordModal"
      @repayment-success="onRepaymentSuccess"
    />

    <!-- 添加卡片模态框 -->
    <view v-if="showAddCardModalFlag" class="modal-overlay" @click="closeAddCardModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加信用卡</text>
          <text class="close-btn" @click="closeAddCardModal">×</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">银行名称</text>
            <input class="form-input" v-model="newCard.bankName" placeholder="请输入银行名称" />
          </view>
          <view class="form-group">
            <text class="form-label">卡片类型</text>
            <input class="form-input" v-model="newCard.cardType" placeholder="请输入卡片类型" />
          </view>
          <view class="form-group">
            <text class="form-label">卡号</text>
            <input class="form-input" v-model="newCard.cardNumber" placeholder="请输入卡号" />
          </view>
          <view class="form-group">
            <text class="form-label">授信额度</text>
            <input class="form-input" v-model="newCard.creditLimit" placeholder="请输入授信额度" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="closeAddCardModal">取消</button>
          <button class="btn-confirm" @click="confirmAddCard">确认添加</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CardDetailModal from '@/components/common/CardDetailModal.vue'
import RepaymentPasswordModal from '@/components/common/RepaymentPasswordModal.vue'

export default {
  name: 'CreditCards',
  components: {
    CardDetailModal,
    RepaymentPasswordModal
  },
  data() {
    return {
      creditCards: [],
      showCardDetailModal: false,
      showRepaymentPasswordModal: false,
      showAddCardModalFlag: false,
      selectedCard: null,
      repaymentAmountForModal: 0,
      balanceVisible: true,
      showCards: false, // 控制卡片列表的显示/隐藏
      totalCreditLimit: 0,
      totalAvailableCredit: 0,
      totalCurrentBalance: 0,
      newCard: {
        bankName: '',
        cardType: '',
        cardNumber: '',
        creditLimit: ''
      }
    }
  },
  onLoad() {
    this.loadCreditCards()
  },
  onShow() {
    this.loadCreditCards()
  },
  methods: {
    goBack() {
      uni.switchTab({ url: '/pages/user/user' })
    },
    
    // 切换卡片列表的显示/隐藏
    toggleCardsVisibility() {
      this.showCards = !this.showCards
    },
    async loadCreditCards() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        if (currentUser && currentUser.creditCards) {
          this.creditCards = currentUser.creditCards
          this.calculateSummary()
        } else {
          this.creditCards = []
          this.resetSummary()
        }
      } catch (error) {
        console.error('加载信用卡信息失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    calculateSummary() {
      this.totalCreditLimit = this.creditCards.reduce((sum, card) => sum + (card.creditLimit || 0), 0)
      this.totalAvailableCredit = this.creditCards.reduce((sum, card) => sum + (card.availableCredit || 0), 0)
      this.totalCurrentBalance = this.creditCards.reduce((sum, card) => sum + (card.currentBalance || 0), 0)
    },
    resetSummary() {
      this.totalCreditLimit = 0
      this.totalAvailableCredit = 0
      this.totalCurrentBalance = 0
    },
    formatCurrency(amount) {
      if (!this.balanceVisible) return '****'
      return `¥${(amount || 0).toLocaleString()}`
    },
    formatCardNumber(cardNumber) {
      if (!this.balanceVisible) {
        return '**** **** **** ****'
      }
      // 显示完整卡号，每4位用空格分隔
      return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible
    },
    viewCardDetail(card) {
      this.selectedCard = card
      this.showCardDetailModal = true
    },
    closeCardDetailModal() {
      this.showCardDetailModal = false
      this.selectedCard = null
    },
    handleRepay(card) {
      this.selectedCard = card
      this.repaymentAmountForModal = card.currentBalance // 默认全额还款
      this.showRepaymentPasswordModal = true
    },
    handleRepayFromDetail(card) {
      this.selectedCard = card
      this.repaymentAmountForModal = card.currentBalance // 默认全额还款
      this.showCardDetailModal = false // 先关闭详情弹窗
      this.showRepaymentPasswordModal = true // 再打开还款密码弹窗
    },
    closeRepaymentPasswordModal() {
      this.showRepaymentPasswordModal = false
      // 如果是从详情弹窗进入的还款，取消时应该返回详情弹窗
      const wasFromDetail = !!this.selectedCard
      this.selectedCard = null
      this.repaymentAmountForModal = 0
      
      if (wasFromDetail) {
        this.showCardDetailModal = true
      }
    },
    async onRepaymentSuccess(result) {
      console.log('还款成功，更新数据:', result)
      await this.loadCreditCards() // 重新加载所有卡片以反映变化
      this.closeRepaymentPasswordModal()
      uni.showToast({ title: '还款成功', icon: 'success' })
    },
    handleManageCard(card) {
      uni.showToast({ title: '管理功能开发中', icon: 'none' })
    },
    showAddCardModal() {
      this.showAddCardModalFlag = true
    },
    closeAddCardModal() {
      this.showAddCardModalFlag = false
      this.newCard = {
        bankName: '',
        cardType: '',
        cardNumber: '',
        creditLimit: ''
      }
    },
    async confirmAddCard() {
      if (!this.newCard.bankName || !this.newCard.cardType || !this.newCard.cardNumber) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      
      try {
        const users = uni.getStorageSync('users') || []
        const currentUserIndex = users.findIndex(user => user.isLoggedIn)
        
        if (currentUserIndex !== -1) {
          const newCardData = {
            id: Date.now().toString(),
            bankName: this.newCard.bankName,
            cardType: this.newCard.cardType,
            cardNumber: this.newCard.cardNumber,
            creditLimit: parseFloat(this.newCard.creditLimit) || 0,
            availableCredit: parseFloat(this.newCard.creditLimit) || 0,
            currentBalance: 0,
            status: 'active',
            cardColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            createTime: new Date().toISOString(),
            lastUsedTime: new Date().toISOString(),
            monthlySpending: 0,
            transactionCount: 0,
            topCategory: '其他',
            securityFeatures: {
              smsNotification: true,
              emailNotification: false,
              biometricAuth: false,
              transactionLimit: 5000
            }
          }
          
          users[currentUserIndex].creditCards.push(newCardData)
          uni.setStorageSync('users', users)
          
          this.closeAddCardModal()
          await this.loadCreditCards()
          uni.showToast({ title: '添加成功', icon: 'success' })
        }
      } catch (error) {
        console.error('添加卡片失败:', error)
        uni.showToast({ title: '添加失败', icon: 'none' })
      }
    },
    goToRepayment() {
      uni.navigateTo({ url: '/pages/credit-card/repayment' })
    },
    showBillReminder() {
      uni.showToast({ title: '账单提醒功能开发中', icon: 'none' })
    },
    showCreditReport() {
      uni.showToast({ title: '信用报告功能开发中', icon: 'none' })
    },
    getStatusText(status) {
      const statusMap = {
        'active': '正常',
        'frozen': '冻结',
        'expired': '过期',
        'cancelled': '注销'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
/* 🎨 全新设计风格 - 清新简约风 */
.credit-cards-page {
  min-height: 100vh;
  background: #ffffff;
  position: relative;
}

/* 导航栏 - 清新设计 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  border-bottom: 1rpx solid rgba(59, 130, 246, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 36rpx;
  color: #3b82f6;
  margin-right: 20rpx;
  cursor: pointer;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e40af;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.eye-icon, .add-icon {
  font-size: 32rpx;
  color: #3b82f6;
  cursor: pointer;
}

/* 卡片统计信息 - 清新卡片 */
.cards-summary-section {
  padding: 30rpx;
}

.summary-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 30rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.1);
}

.summary-header {
  margin-bottom: 30rpx;
}

.summary-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e40af;
  display: block;
  margin-bottom: 8rpx;
}

.summary-subtitle {
  font-size: 24rpx;
  color: #3b82f6;
}

.summary-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e40af;
  display: block;
  margin-bottom: 8rpx;
}

.stat-value.available {
  color: #059669;
}

.stat-value.debt {
  color: #dc2626;
}

.stat-label {
  font-size: 22rpx;
  color: #3b82f6;
}

/* 卡片区域 - 清新风格 */
.cards-list-section {
  padding: 0 30rpx 30rpx;
}

.section-header {
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
}

.section-header:hover {
  background: #e2e8f0;
  border-color: #3b82f6;
}

.section-header .section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0;
}

.section-header .section-subtitle {
  font-size: 24rpx;
  color: #3b82f6;
  margin-left: 20rpx;
  flex: 1;
}

.expand-icon {
  font-size: 24rpx;
  color: #3b82f6;
  transition: transform 0.3s ease;
  margin-left: 20rpx;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  opacity: 0;
  transform: translateY(-20rpx);
  transition: all 0.3s ease;
  max-height: 0;
  overflow: hidden;
}

.cards-list.show {
  opacity: 1;
  transform: translateY(0);
  max-height: 2000rpx;
}

.card-item {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  color: white;
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 40rpx rgba(59, 130, 246, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-brand, .card-type {
  display: flex;
  flex-direction: column;
}

.brand-text, .type-text {
  font-size: 24rpx;
  font-weight: 500;
  opacity: 0.9;
}

.card-status {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.2);
}

.status-text {
  font-size: 20rpx;
  color: white;
  font-weight: 600;
}

.card-number {
  margin-bottom: 20rpx;
  text-align: center;
}

.number-text {
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.card-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.info-label {
  font-size: 22rpx;
  opacity: 0.8;
}

.info-value {
  font-size: 22rpx;
  font-weight: 600;
}

.info-value.available {
  color: #10b981;
}

.info-value.debt {
  color: #f87171;
}

.card-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx 10rpx;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12rpx;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 24rpx;
  margin-bottom: 6rpx;
}

.btn-text {
  font-size: 20rpx;
  font-weight: 500;
}

/* 快捷功能区 - 清新网格 */
.quick-actions-section {
  padding: 0 30rpx 30rpx;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.2);
}

.action-icon {
  font-size: 32rpx;
  margin-bottom: 12rpx;
  color: #3b82f6;
}

.action-text {
  font-size: 22rpx;
  color: #1e40af;
  text-align: center;
}

/* 优惠活动 - 清新卡片 */
.promotions-section {
  padding: 0 30rpx 30rpx;
}

.promotions-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.promotion-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.promotion-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.2);
}

.promotion-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #3b82f6;
}

.promotion-content {
  flex: 1;
}

.promotion-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #1e40af;
  display: block;
  margin-bottom: 6rpx;
}

.promotion-desc {
  font-size: 22rpx;
  color: #3b82f6;
}

.promotion-action {
  padding: 8rpx 16rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.promotion-action .action-text {
  font-size: 20rpx;
  color: white;
  font-weight: 500;
}

/* 模态框 - 清新风格 */
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

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 90vh;
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

.modal-body {
  padding: 30rpx;
  max-height: calc(90vh - 200rpx);
  overflow-y: auto;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 26rpx;
  color: #1e40af;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.2);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #1e40af;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10rpx);
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1);
  outline: none;
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

/* 响应式设计 */
@media (max-width: 768rpx) {
  .nav-bar {
    padding: 30rpx 20rpx 15rpx 20rpx;
  }
  
  .summary-card, .modal-content {
    padding: 30rpx 20rpx;
  }
  
  .card-item {
    padding: 30rpx 20rpx;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 🎨 新增样式内容 - 动画效果和交互增强 */

/* 页面进入动画 */
.credit-cards-page {
  animation: pageFadeIn 0.6s ease-out;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片进入动画 */
.summary-card {
  animation: cardSlideIn 0.8s ease-out 0.2s both;
}

.card-item {
  animation: cardSlideIn 0.8s ease-out both;
}

.card-item:nth-child(1) { animation-delay: 0.3s; }
.card-item:nth-child(2) { animation-delay: 0.4s; }
.card-item:nth-child(3) { animation-delay: 0.5s; }
.card-item:nth-child(4) { animation-delay: 0.6s; }

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 快捷功能进入动画 */
.action-item {
  animation: actionItemFadeIn 0.6s ease-out both;
}

.action-item:nth-child(1) { animation-delay: 0.7s; }
.action-item:nth-child(2) { animation-delay: 0.8s; }
.action-item:nth-child(3) { animation-delay: 0.9s; }
.action-item:nth-child(4) { animation-delay: 1.0s; }

@keyframes actionItemFadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优惠活动进入动画 */
.promotion-item {
  animation: promotionSlideIn 0.6s ease-out both;
}

.promotion-item:nth-child(1) { animation-delay: 1.1s; }
.promotion-item:nth-child(2) { animation-delay: 1.2s; }

@keyframes promotionSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 增强的悬停效果 */
.nav-bar {
  transition: all 0.3s ease;
}

.nav-bar:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4rpx 20rpx rgba(59, 130, 246, 0.1);
}

/* 统计卡片增强效果 */
.summary-card {
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.summary-card:hover::before {
  left: 100%;
}

/* 信用卡卡片增强效果 */
.card-item {
  position: relative;
  overflow: hidden;
}

.card-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.card-item:hover::after {
  transform: translateX(100%);
}

/* 按钮增强效果 */
.action-btn {
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.action-btn:hover::before {
  width: 200rpx;
  height: 200rpx;
}

/* 快捷功能增强效果 */
.action-item {
  position: relative;
  overflow: hidden;
}

.action-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-item:hover::before {
  opacity: 1;
}

/* 优惠活动增强效果 */
.promotion-item {
  position: relative;
  overflow: hidden;
}

.promotion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(29, 78, 216, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.promotion-item:hover::before {
  opacity: 1;
}

/* 模态框增强效果 */
.modal-content {
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

/* 表单输入增强效果 */
.form-input {
  transition: all 0.3s ease;
}

.form-input:focus {
  transform: translateY(-2rpx);
  box-shadow: 
    0 0 0 4rpx rgba(59, 130, 246, 0.1),
    0 8rpx 25rpx rgba(59, 130, 246, 0.15);
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

/* 脉冲动画效果 */
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

/* 摇摆动画效果 */
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

/* 弹跳动画效果 */
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

/* 淡入淡出效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.fade-out {
  animation: fadeOut 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 滑动效果 */
.slide-up {
  animation: slideUp 0.5s ease-out;
}

.slide-down {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 缩放效果 */
.scale-in {
  animation: scaleIn 0.3s ease-out;
}

.scale-out {
  animation: scaleOut 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}

/* 旋转效果 */
.rotate {
  animation: rotate 0.5s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 闪烁效果 */
.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 毛玻璃文字效果 */
.glass-text {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
}

/* 阴影文字效果 */
.shadow-text {
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
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

/* 响应式增强 */
@media (max-width: 768rpx) {
  .card-item {
    animation-delay: 0.1s !important;
  }
  
  .action-item {
    animation-delay: 0.1s !important;
  }
  
  .promotion-item {
    animation-delay: 0.1s !important;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .credit-cards-page {
    background: #ffffff;
  }
  
  .summary-card {
    background: rgba(30, 41, 59, 0.95);
    border: 1rpx solid rgba(59, 130, 246, 0.3);
  }
  
  .card-item {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  }
  
  .action-item {
    background: rgba(30, 41, 59, 0.9);
    border: 1rpx solid rgba(59, 130, 246, 0.3);
  }
  
  .promotion-item {
    background: rgba(30, 41, 59, 0.9);
    border: 1rpx solid rgba(59, 130, 246, 0.3);
  }
}
</style>
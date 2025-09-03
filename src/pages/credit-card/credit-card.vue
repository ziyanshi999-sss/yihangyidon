<template>
  <view class="credit-card-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">信用卡</text>
    </view>

    <!-- 信用卡卡片区域 -->
    <view class="credit-cards">
      <view v-if="creditCards.length === 0" class="no-card-tip">
        <text class="tip-icon">💳</text>
        <text class="tip-text">您还没有绑定信用卡</text>
        <button class="apply-btn" @tap="applyForCreditCard">立即申请</button>
      </view>
      
      <view v-else class="cards-list">
        <view v-for="(card, index) in creditCards" :key="index" class="card-wrapper">
          <BankCard 
            :cardInfo="card"
            :showActions="true"
            :hideCardNumber="hideCardNumber"
            @card-tap="viewCardDetails(card)"
            @edit="editCard(card)"
            @delete="deleteCard(card)"
          />
        </view>
      </view>
    </view>

    <!-- 账单信息 -->
    <view class="bill-section" v-if="creditCards.length > 0">
      <view class="bill-header">
        <text class="bill-title">本期账单</text>
        <text class="bill-date">账单日: {{ billDate }} | 还款日: {{ dueDate }}</text>
      </view>
      
      <view class="bill-summary">
        <view class="summary-item">
          <text class="summary-label">账单金额</text>
          <text class="summary-value">¥{{ billAmount.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">最低还款</text>
          <text class="summary-value">¥{{ minPayment.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">已还金额</text>
          <text class="summary-value">¥{{ paidAmount.toFixed(2) }}</text>
        </view>
      </view>
      
      <view class="bill-actions">
        <button class="action-btn primary" @tap="repayFull">全额还款</button>
        <button class="action-btn secondary" @tap="repayMin">最低还款</button>
      </view>
    </view>

    <!-- 信用卡功能区 -->
    <view class="credit-functions" v-if="creditCards.length > 0">
      <view class="function-grid">
        <view class="function-item" @tap="viewTransactions">
          <view class="function-icon">📝</view>
          <text class="function-text">账单明细</text>
        </view>
        <view class="function-item" @tap="applyForCash">
          <view class="function-icon">💸</view>
          <text class="function-text">现金分期</text>
        </view>
        <view class="function-item" @tap="creditInstallment">
          <view class="function-icon">🔄</view>
          <text class="function-text">账单分期</text>
        </view>
        <view class="function-item" @tap="creditLimit">
          <view class="function-icon">📊</view>
          <text class="function-text">额度管理</text>
        </view>
      </view>
    </view>

    <!-- 信用卡优惠活动 -->
    <view class="promotions-section" v-if="promotions.length > 0">
      <view class="section-header">
        <text class="section-title">信用卡优惠</text>
        <text class="view-all" @tap="viewAllPromotions">查看全部</text>
      </view>
      
      <view class="promotions-list">
        <view class="promotion-item" v-for="(promo, index) in promotions" :key="index" @tap="viewPromotionDetail(promo)">
          <image class="promo-image" :src="promo.image" mode="aspectFill"></image>
          <text class="promo-title">{{ promo.title }}</text>
          <text class="promo-desc">{{ promo.desc }}</text>
          <text class="promo-date">有效期至：{{ promo.endDate }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'
import BankCard from '@/components/common/BankCard.vue'

// 模拟API调用
const getCreditCards = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cards = uni.getStorageSync('creditCards') || [
        {
          id: '1',
          cardNumber: '6228481234567890123',
          bankName: '中国农业银行',
          bankType: 'abc',
          cardType: 'credit',
          holderName: '张三',
          expiryDate: '06/26',
          isDefault: true,
          limit: 30000,
          used: 12345.67
        }
      ]
      resolve(cards)
    }, 300)
  })
}

export default {
  components: {
    BankCard
  },
  data() {
    return {
      creditCards: [],
      hideCardNumber: true,
      billAmount: 0,
      minPayment: 0,
      paidAmount: 0,
      billDate: '每月10日',
      dueDate: '每月28日',
      promotions: [
        {
          id: '1',
          title: '餐饮消费满200减50',
          desc: '指定餐厅刷卡消费享优惠',
          image: 'https://thafd.bing.com/th/id/OIP.Qasbo_B7CgQZgQbJZQs43QHaCI?o=7rm=3&rs=1&pid=ImgDetMain',
          endDate: '2024-12-31'
        },
        {
          id: '2',
          title: '周末加油9折优惠',
          desc: '指定加油站刷卡加油享折扣',
          image: 'https://thafd.bing.com/th/id/OIP.h5Dnm2eV7jzm2z8-1ig0iAHaDJ?o=7rm=3&rs=1&pid=ImgDetMain',
          endDate: '2024-11-30'
        }
      ]
    }
  },
  onLoad() {
    this.checkLoginStatus()
    this.loadCreditCardInfo()
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      if (!forceCheckLogin()) {
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 加载信用卡信息
    async loadCreditCardInfo() {
      try {
        uni.showLoading({ title: '加载中...' })
        this.creditCards = await getCreditCards()
        
        // 模拟账单数据
        this.billAmount = 12345.67
        this.minPayment = this.billAmount * 0.1
        this.paidAmount = 5000.00
        
      } catch (error) {
        uni.showToast({
          title: '加载失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 申请信用卡
    applyForCreditCard() {
      uni.showToast({
        title: '前往信用卡申请页面',
        icon: 'none'
      })
    },
    
    // 查看卡片详情
    viewCardDetails(card) {
      this.hideCardNumber = !this.hideCardNumber
    },
    
    // 编辑卡片
    editCard(card) {
      uni.showToast({
        title: '编辑卡片信息',
        icon: 'none'
      })
    },
    
    // 删除卡片
    deleteCard(card) {
      // 在实际项目中应调用API删除
      const index = this.creditCards.findIndex(item => item.id === card.id)
      if (index > -1) {
        this.creditCards.splice(index, 1)
        uni.setStorageSync('creditCards', this.creditCards)
        uni.showToast({
          title: '卡片已删除',
          icon: 'success'
        })
      }
    },
    
    // 全额还款
    repayFull() {
      uni.showModal({
        title: '确认还款',
        content: `确定要全额还款 ¥${this.billAmount.toFixed(2)} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 模拟还款成功
            this.paidAmount = this.billAmount
            uni.showToast({
              title: '还款成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 最低还款
    repayMin() {
      uni.showModal({
        title: '确认还款',
        content: `确定要最低还款 ¥${this.minPayment.toFixed(2)} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 模拟还款成功
            this.paidAmount += this.minPayment
            uni.showToast({
              title: '还款成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 查看交易明细
    viewTransactions() {
      uni.navigateTo({
        url: '/pages/balance/balance?type=credit'
      })
    },
    
    // 现金分期
    applyForCash() {
      uni.showToast({
        title: '前往现金分期页面',
        icon: 'none'
      })
    },
    
    // 账单分期
    creditInstallment() {
      uni.showToast({
        title: '前往账单分期页面',
        icon: 'none'
      })
    },
    
    // 额度管理
    creditLimit() {
      uni.showToast({
        title: '前往额度管理页面',
        icon: 'none'
      })
    },
    
    // 查看所有优惠活动
    viewAllPromotions() {
      uni.showToast({
        title: '查看所有信用卡优惠',
        icon: 'none'
      })
    },
    
    // 查看优惠详情
    viewPromotionDetail(promo) {
      uni.showToast({
        title: `查看${promo.title}详情`,
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.credit-card-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.credit-cards {
  padding: 30rpx;
}

.no-card-tip {
  text-align: center;
  padding: 100rpx 0;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.tip-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 30rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.apply-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 100rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;
  border: none;
}

.cards-list {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-wrapper {
  margin-bottom: 20rpx;
}

.card-wrapper:last-child {
  margin-bottom: 0;
}

.bill-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.bill-header {
  margin-bottom: 30rpx;
}

.bill-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.bill-date {
  font-size: 24rpx;
  color: #999;
}

.bill-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.summary-item {
  text-align: center;
  flex: 1;
}

.summary-label {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.summary-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.bill-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.credit-functions {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
}

.function-icon {
  font-size: 50rpx;
  margin-bottom: 10rpx;
}

.function-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.promotions-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.view-all {
  font-size: 24rpx;
  color: #999;
}

.promotions-list {
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
}

.promotion-item {
  width: 400rpx;
  flex-shrink: 0;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f8f8f8;
  padding: 20rpx;
}

.promo-image {
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

.promo-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promo-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promo-date {
  font-size: 22rpx;
  color: #999;
}
</style>
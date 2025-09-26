<template>
  <view class="loan-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">贷款服务</text>
    </view>

    <!-- 贷款概览 -->
    <view class="loan-overview" v-if="hasLoan">
      <view class="overview-content">
        <text class="overview-label">您有一笔贷款</text>
        <text class="overview-amount">¥{{ safeToFixed(loanInfo.amount, 2) }}</text>
        <text class="overview-status">{{ loanInfo.status }}</text>
        <view class="loan-details">
          <text class="detail-item">贷款类型: {{ loanInfo.type }}</text>
          <text class="detail-item">贷款期限: {{ loanInfo.term }} 个月</text>
          <text class="detail-item">贷款利率: {{ loanInfo.rate }}%</text>
          <text class="detail-item">已还期数: {{ loanInfo.paidInstallments }}/{{ loanInfo.totalInstallments }}</text>
          <text class="detail-item">下次还款日: {{ loanInfo.nextPaymentDate }}</text>
          <text class="detail-item">下次还款金额: ¥{{ safeToFixed(loanInfo.nextPaymentAmount, 2) }}</text>
        </view>
        <view class="overview-actions">
          <button class="action-btn primary" @tap="makePayment">立即还款</button>
          <button class="action-btn secondary" @tap="viewLoanDetails">查看详情</button>
        </view>
      </view>
    </view>

    <!-- 无贷款状态 -->
    <view class="no-loan" v-else>
      <text class="no-loan-icon">💸</text>
      <text class="no-loan-text">您当前没有贷款记录</text>
      <button class="apply-btn" @tap="applyForLoan">立即申请</button>
    </view>

    <!-- 贷款产品 -->
    <view class="loan-products">
      <view class="section-header">
        <text class="section-title">热门贷款产品</text>
        <text class="view-all" @tap="viewAllProducts">查看全部</text>
      </view>
      
      <view class="products-list">
        <view class="product-card" v-for="(product, index) in loanProducts" :key="index" @tap="viewProductDetail(product)">
          <view class="product-header">
            <text class="product-title">{{ product.name }}</text>
            <text class="product-rate">{{ product.rate }}%</text>
            <text class="rate-label">年利率</text>
          </view>
          <view class="product-info">
            <text class="info-item">{{ product.amountRange }}</text>
            <text class="info-item">{{ product.termRange }}</text>
            <text class="info-item">{{ product.features }}</text>
          </view>
          <button class="apply-product-btn" @tap.stop="applyForProduct(product)">立即申请</button>
        </view>
      </view>
    </view>

    <!-- 贷款工具 -->
    <view class="loan-tools">
      <view class="section-header">
        <text class="section-title">贷款工具</text>
      </view>
      
      <view class="tools-grid">
        <view class="tool-item" @tap="openCalculator">
          <view class="tool-icon">🧮</view>
          <text class="tool-text">贷款计算器</text>
        </view>
        <view class="tool-item" @tap="openRateQuery">
          <view class="tool-icon">📊</view>
          <text class="tool-text">利率查询</text>
        </view>
        <view class="tool-item" @tap="openRepaymentPlan">
          <view class="tool-icon">📝</view>
          <text class="tool-text">还款计划</text>
        </view>
        <view class="tool-item" @tap="openLoanFAQ">
          <view class="tool-icon">❓</view>
          <text class="tool-text">常见问题</text>
        </view>
      </view>
    </view>

    <!-- 贷款资讯 -->
    <view class="loan-news">
      <view class="section-header">
        <text class="section-title">贷款资讯</text>
        <text class="view-all" @tap="viewAllNews">查看全部</text>
      </view>
      
      <view class="news-list">
        <view class="news-item" v-for="(news, index) in loanNews" :key="index" @tap="viewNewsDetail(news)">
          <text class="news-title">{{ news.title }}</text>
          <text class="news-date">{{ news.date }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'

export default {
  data() {
    return {
      hasLoan: true, // 模拟用户有贷款
      loanInfo: {
        amount: 0,
        status: '',
        type: '',
        term: 0,
        rate: 0,
        paidInstallments: 0,
        totalInstallments: 0,
        nextPaymentDate: '',
        nextPaymentAmount: 0
      },
      loanProducts: [],
      loanNews: []
    }
  },
  onLoad() {
    this.checkLoginStatus()
    this.loadLoanData()
  },
  methods: {
    // 安全的数值格式化方法
    safeToFixed(value, digits = 2) {
      if (value === null || value === undefined || isNaN(value)) {
        return '0.00'
      }
      return Number(value).toFixed(digits)
    },

    // 加载贷款数据
    loadLoanData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser && currentUser.loanInfo) {
          this.loanInfo = currentUser.loanInfo
        } else {
          // 如果没有贷款数据，使用默认数据
          this.loanInfo = {
            amount: 100000,
            status: '还款中',
            type: '个人消费贷',
            term: 36,
            rate: 4.5,
            paidInstallments: 12,
            totalInstallments: 36,
            nextPaymentDate: '2024-06-10',
            nextPaymentAmount: 3200.50
          }
          
          // 保存到用户数据中
          if (currentUser) {
            currentUser.loanInfo = this.loanInfo
            uni.setStorageSync('users', users)
          }
        }
        
        // 加载贷款产品数据
        this.loanProducts = [
          {
            id: '1',
            name: '个人消费贷',
            rate: 4.5,
            amountRange: '1万-50万',
            termRange: '6-60期',
            features: '无需抵押，快速审批',
            minRate: 4.2,
            maxRate: 5.8
          },
          {
            id: '2',
            name: '房贷',
            rate: 3.8,
            amountRange: '50万-500万',
            termRange: '12-360期',
            features: '利率优惠，长期稳定',
            minRate: 3.6,
            maxRate: 4.8
          },
          {
            id: '3',
            name: '经营贷',
            rate: 5.2,
            amountRange: '10万-100万',
            termRange: '12-60期',
            features: '助力创业，灵活还款',
            minRate: 4.8,
            maxRate: 6.5
          }
        ]
        
        // 加载贷款新闻数据
        this.loanNews = [
          {
            id: '1',
            title: '央行降准0.5个百分点，贷款市场利率有望下行',
            date: '2024-05-15',
            content: '中国人民银行决定下调金融机构存款准备金率0.5个百分点，预计将释放长期资金约1万亿元，有助于降低社会融资成本...'
          },
          {
            id: '2',
            title: '个人消费贷新政策解读：这些变化你需要了解',
            date: '2024-05-10',
            content: '近日，银保监会发布了关于调整个人消费贷款政策的通知，新政策对贷款额度、期限、利率等方面做出了调整...'
          },
          {
            id: '3',
            title: '如何提高贷款审批通过率？这些技巧很重要',
            date: '2024-05-05',
            content: '在申请贷款时，很多人会遇到审批不通过的情况。本文将为您介绍几个提高贷款审批通过率的实用技巧...'
          }
        ]
      } catch (error) {
        console.error('加载贷款数据失败:', error)
      }
    },

    // 检查登录状态
    checkLoginStatus() {
      if (!forceCheckLogin()) {
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 立即还款
    makePayment() {
      uni.showModal({
        title: '确认还款',
        content: `确定要偿还本期贷款 ¥${this.safeToFixed(this.loanInfo.nextPaymentAmount, 2)} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 模拟还款成功
            uni.showLoading({ title: '还款处理中...' })
            
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '还款成功',
                icon: 'success'
              })
              
              // 更新贷款信息
              this.loanInfo.paidInstallments++
              this.loanInfo.nextPaymentDate = '2024-07-10'
              
            }, 1500)
          }
        }
      })
    },
    
    // 查看贷款详情 - 修改为提示功能
    viewLoanDetails() {
      uni.showModal({
        title: '提示',
        content: '贷款详情功能正在开发中',
        showCancel: false
      })
    },
    
    // 申请新贷款
    applyForLoan() {
      uni.navigateTo({
        url: '/pages/loan/loan-application'
      })
    },
    
    // 查看所有贷款产品 - 修改为提示功能
    viewAllProducts() {
      uni.showModal({
        title: '提示',
        content: '查看全部产品功能正在开发中',
        showCancel: false
      })
    },
    
    // 查看产品详情 - 修改为提示功能
    viewProductDetail(product) {
      uni.showModal({
        title: '提示',
        content: '产品详情功能正在开发中',
        showCancel: false
      })
    },
    
    // 申请特定产品
    applyForProduct(product) {
      uni.navigateTo({
        url: `/pages/loan/loan-application?productId=${product.id}`
      })
    },
    
    // 打开贷款计算器 - 修改为提示功能
    openCalculator() {
      uni.showModal({
        title: '提示',
        content: '贷款计算器功能正在开发中',
        showCancel: false
      })
    },
    
    // 打开利率查询 - 修改为提示功能
    openRateQuery() {
      uni.showModal({
        title: '提示',
        content: '利率查询功能正在开发中',
        showCancel: false
      })
    },
    
    // 打开还款计划 - 修改为提示功能
    openRepaymentPlan() {
      uni.showModal({
        title: '提示',
        content: '还款计划功能正在开发中',
        showCancel: false
      })
    },
    
    // 打开常见问题 - 修改为提示功能
    openLoanFAQ() {
      uni.showModal({
        title: '提示',
        content: '贷款常见问题功能正在开发中',
        showCancel: false
      })
    },
    
    // 查看所有资讯 - 修改为提示功能
    viewAllNews() {
      uni.showModal({
        title: '提示',
        content: '查看全部资讯功能正在开发中',
        showCancel: false
      })
    },
    
    // 查看资讯详情 - 修改为提示功能
    viewNewsDetail(news) {
      uni.showModal({
        title: '提示',
        content: '资讯详情功能正在开发中',
        showCancel: false
      })
    }
  }
}
</script>

<style scoped>
.loan-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.loan-overview {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.overview-content {
  padding: 30rpx;
}

.overview-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.overview-amount {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.overview-status {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  margin-bottom: 30rpx;
}

.loan-details {
  margin-bottom: 30rpx;
}

.detail-item {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.overview-actions {
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
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.no-loan {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 100rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.no-loan-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 30rpx;
}

.no-loan-text {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.apply-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
  border-radius: 100rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;
  border: none;
}

.loan-products {
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
  margin-bottom: 30rpx;
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

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-card {
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  padding: 30rpx;
  position: relative;
}

.product-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.product-rate {
  font-size: 40rpx;
  font-weight: bold;
  color: #f44336;
  margin-right: 10rpx;
}

.rate-label {
  font-size: 24rpx;
  color: #999;
}

.product-info {
  margin-bottom: 20rpx;
}

.info-item {
  display: inline-block;
  font-size: 24rpx;
  color: #666;
  margin-right: 30rpx;
  margin-bottom: 10rpx;
  padding: 6rpx 16rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
}

.apply-product-btn {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  background: #2196f3;
  color: #fff;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  border: none;
}

.loan-tools {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
}

.tool-icon {
  font-size: 50rpx;
  margin-bottom: 10rpx;
}

.tool-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.loan-news {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.news-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.news-item:last-child {
  border-bottom: none;
}

.news-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.news-date {
  display: block;
  font-size: 24rpx;
  color: #999;
}
</style>
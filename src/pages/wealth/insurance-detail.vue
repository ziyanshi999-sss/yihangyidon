<template>
  <view class="insurance-detail-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">‹</text>
        </view>
        <text class="nav-title">保险详情</text>
        <view class="nav-right">
          <text class="nav-icon" @click="onShare">⤴</text>
        </view>
      </view>
    </view>

    <!-- 产品基本信息 -->
    <view class="product-info">
      <view class="product-header">
        <view class="product-icon">{{ product.icon || '🛡️' }}</view>
        <view class="product-basic">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-type">{{ product.type }}</text>
          <view class="product-tags">
            <text class="tag" :class="'tag-' + product.riskLevel">{{ product.riskLevel }}</text>
            <text class="tag tag-status">{{ product.status }}</text>
          </view>
        </view>
      </view>
      
      <view class="product-highlights">
        <view class="highlight-item">
          <text class="highlight-label">保费</text>
          <text class="highlight-value">¥{{ product.premium }}/年</text>
        </view>
        <view class="highlight-item">
          <text class="highlight-label">保额</text>
          <text class="highlight-value">¥{{ formatNumber(product.coverage) }}</text>
        </view>
        <view class="highlight-item">
          <text class="highlight-label">保障期限</text>
          <text class="highlight-value">{{ product.term }}</text>
        </view>
      </view>
    </view>

    <!-- 产品特色 -->
    <view class="product-features">
      <view class="section-title">产品特色</view>
      <view class="features-list">
        <view class="feature-item" v-for="(feature, index) in product.features" :key="index">
          <text class="feature-icon">✓</text>
          <text class="feature-text">{{ feature }}</text>
        </view>
      </view>
    </view>

    <!-- 保障内容 -->
    <view class="coverage-details">
      <view class="section-title">保障内容</view>
      <view class="coverage-list">
        <view class="coverage-item" v-for="(coverage, index) in coverageDetails" :key="index">
          <view class="coverage-header">
            <text class="coverage-name">{{ coverage.name }}</text>
            <text class="coverage-amount">¥{{ formatNumber(coverage.amount) }}</text>
          </view>
          <text class="coverage-desc">{{ coverage.description }}</text>
        </view>
      </view>
    </view>

    <!-- 投保须知 -->
    <view class="notice-section">
      <view class="section-title">投保须知</view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in notices" :key="index">
          <text class="notice-number">{{ index + 1 }}</text>
          <text class="notice-text">{{ notice }}</text>
        </view>
      </view>
    </view>

    <!-- 风险提示 -->
    <view class="risk-warning">
      <view class="section-title">风险提示</view>
      <view class="warning-content">
        <text class="warning-text">• 保险产品存在投资风险，请根据自身风险承受能力谨慎选择</text>
        <text class="warning-text">• 投保前请仔细阅读保险条款，了解产品特性和风险</text>
        <text class="warning-text">• 保险收益不保证，实际收益可能低于预期</text>
        <text class="warning-text">• 请确保投保信息的真实性和完整性</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view class="action-left">
        <button class="action-btn secondary" @click="onConsult">咨询客服</button>
      </view>
      <view class="action-right">
        <button class="action-btn primary" @click="onPurchase">立即投保</button>
      </view>
    </view>
  </view>
</template>

<script>
import { purchaseInsuranceProduct, getCurrentUserId } from '@/api/wealth.js'

export default {
  data() {
    return {
      product: {},
      coverageDetails: [],
      notices: []
    }
  },
  
  onLoad(options) {
    this.loadProductDetail(options)
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onShare() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },
    
    loadProductDetail(options) {
      // 模拟产品详情数据
      const productId = options.id || 'health001'
      const productName = options.name || '重疾保险'
      
      this.product = {
        id: productId,
        name: productName,
        type: '健康保险',
        premium: 3000,
        coverage: 200000,
        term: '终身',
        features: ['重疾保障', '轻症赔付', '豁免保费', '现金价值'],
        riskLevel: '中风险',
        status: '在售',
        icon: '🏥'
      }
      
      // 根据产品类型设置保障详情
      this.setCoverageDetails()
      this.setNotices()
    },
    
    setCoverageDetails() {
      if (this.product.type === '健康保险') {
        this.coverageDetails = [
          {
            name: '重大疾病保障',
            amount: 200000,
            description: '涵盖100种重大疾病，确诊即赔'
          },
          {
            name: '轻症疾病保障',
            amount: 40000,
            description: '涵盖50种轻症疾病，按保额20%赔付'
          },
          {
            name: '身故保障',
            amount: 200000,
            description: '因疾病或意外导致身故，按保额赔付'
          },
          {
            name: '保费豁免',
            amount: 0,
            description: '确诊轻症或重疾后，后续保费免交'
          }
        ]
      } else if (this.product.type === '人寿保险') {
        this.coverageDetails = [
          {
            name: '身故保障',
            amount: this.product.coverage,
            description: '因疾病或意外导致身故，按保额赔付'
          },
          {
            name: '全残保障',
            amount: this.product.coverage,
            description: '因疾病或意外导致全残，按保额赔付'
          },
          {
            name: '现金价值',
            amount: 0,
            description: '保单具有现金价值，可申请保单贷款'
          }
        ]
      } else {
        this.coverageDetails = [
          {
            name: '意外身故',
            amount: this.product.coverage,
            description: '因意外导致身故，按保额赔付'
          },
          {
            name: '意外伤残',
            amount: this.product.coverage,
            description: '因意外导致伤残，按伤残等级赔付'
          },
          {
            name: '意外医疗',
            amount: 10000,
            description: '因意外产生的医疗费用，实报实销'
          }
        ]
      }
    },
    
    setNotices() {
      this.notices = [
        '投保年龄：18-60周岁',
        '缴费方式：年缴/月缴可选',
        '等待期：90天（意外伤害无等待期）',
        '健康告知：请如实告知健康状况',
        '犹豫期：15天，犹豫期内可全额退保',
        '理赔时效：资料齐全后10个工作日内赔付'
      ]
    },
    
    onConsult() {
      uni.navigateTo({
        url: '/pages/service/chat'
      })
    },
    
    onPurchase() {
      uni.showModal({
        title: '确认投保',
        content: `确定要购买${this.product.name}吗？\n保费：¥${this.product.premium}/年`,
        success: (res) => {
          if (res.confirm) {
            this.processPurchase()
          }
        }
      })
    },
    
    async processPurchase() {
      uni.showLoading({ title: '投保处理中...' })
      
      try {
        const userId = getCurrentUserId()
        const success = purchaseInsuranceProduct(userId, this.product)
        
        setTimeout(() => {
          uni.hideLoading()
          
          if (success) {
            uni.showToast({
              title: '投保成功',
              icon: 'success'
            })
            
            // 延迟跳转到投保成功页面
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/wealth/insurance-success?productName=' + this.product.name
              })
            }, 1500)
          } else {
            uni.showToast({
              title: '投保失败，请重试',
              icon: 'none'
            })
          }
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '投保失败，请重试',
          icon: 'none'
        })
        console.error('投保处理失败:', error)
      }
    },
    
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      }
      return num.toString()
    }
  }
}
</script>

<style scoped>
.insurance-detail-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 头部导航 */
.header {
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  height: 88rpx;
}

.nav-left, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 产品信息 */
.product-info {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.product-header {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.product-icon {
  font-size: 80rpx;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.product-basic {
  flex: 1;
}

.product-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.product-type {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
}

.product-tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #fff;
}

.tag-低风险 {
  background: #34C759;
}

.tag-中风险 {
  background: #FF9500;
}

.tag-高风险 {
  background: #FF3B30;
}

.tag-status {
  background: #007AFF;
}

.product-highlights {
  display: flex;
  justify-content: space-between;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.highlight-item {
  text-align: center;
  flex: 1;
}

.highlight-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.highlight-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

/* 产品特色 */
.product-features {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.feature-icon {
  color: #34C759;
  font-size: 24rpx;
  font-weight: bold;
}

.feature-text {
  font-size: 28rpx;
  color: #333;
}

/* 保障内容 */
.coverage-details {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.coverage-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.coverage-item {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.coverage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.coverage-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.coverage-amount {
  font-size: 28rpx;
  font-weight: 600;
  color: #FF6B35;
}

.coverage-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 投保须知 */
.notice-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
}

.notice-number {
  width: 40rpx;
  height: 40rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.notice-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  flex: 1;
}

/* 风险提示 */
.risk-warning {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.warning-text {
  font-size: 24rpx;
  color: #FF6B35;
  line-height: 1.5;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  z-index: 100;
}

.action-left {
  flex: 1;
}

.action-right {
  flex: 2;
}

.action-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.action-btn.primary {
  background: #007AFF;
  color: #fff;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #333;
  border: 1rpx solid #ddd;
}
</style>


<template>
  <view class="insurance-success-page">
    <!-- 成功状态 -->
    <view class="success-status">
      <view class="success-icon">✅</view>
      <text class="success-title">投保成功</text>
      <text class="success-subtitle">您的保险申请已提交，请耐心等待审核</text>
    </view>

    <!-- 投保信息 -->
    <view class="policy-info">
      <view class="info-header">
        <text class="info-title">投保信息</text>
        <text class="policy-number">保单号：{{ policyNumber }}</text>
      </view>
      
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">产品名称</text>
          <text class="info-value">{{ productName }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">投保金额</text>
          <text class="info-value">¥{{ premium }}/年</text>
        </view>
        <view class="info-item">
          <text class="info-label">保障期限</text>
          <text class="info-value">{{ term }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">投保时间</text>
          <text class="info-value">{{ purchaseTime }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">审核状态</text>
          <text class="info-value status-pending">审核中</text>
        </view>
      </view>
    </view>

    <!-- 后续步骤 -->
    <view class="next-steps">
      <view class="section-title">后续步骤</view>
      <view class="steps-list">
        <view class="step-item">
          <view class="step-number">1</view>
          <view class="step-content">
            <text class="step-title">等待审核</text>
            <text class="step-desc">我们将在1-3个工作日内完成审核</text>
          </view>
        </view>
        <view class="step-item">
          <view class="step-number">2</view>
          <view class="step-content">
            <text class="step-title">签署合同</text>
            <text class="step-desc">审核通过后，请签署电子保险合同</text>
          </view>
        </view>
        <view class="step-item">
          <view class="step-number">3</view>
          <view class="step-content">
            <text class="step-title">保单生效</text>
            <text class="step-desc">合同签署后，保单正式生效</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 重要提醒 -->
    <view class="important-notice">
      <view class="section-title">重要提醒</view>
      <view class="notice-content">
        <text class="notice-text">• 请保持手机畅通，我们会及时通知您审核结果</text>
        <text class="notice-text">• 如有疑问，可随时联系客服：400-123-4567</text>
        <text class="notice-text">• 保单生效后，您可在"我的保单"中查看详情</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @click="onViewPolicy">查看保单</button>
      <button class="action-btn primary" @click="onBackHome">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      productName: '',
      premium: 0,
      term: '',
      policyNumber: '',
      purchaseTime: ''
    }
  },
  
  onLoad(options) {
    this.initData(options)
  },
  
  methods: {
    initData(options) {
      this.productName = options.productName || '重疾保险'
      this.premium = options.premium || 3000
      this.term = options.term || '终身'
      this.policyNumber = this.generatePolicyNumber()
      this.purchaseTime = this.formatTime(new Date())
    },
    
    generatePolicyNumber() {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      return `IC${timestamp}${random.toString().padStart(3, '0')}`
    },
    
    formatTime(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    
    onViewPolicy() {
      uni.showToast({
        title: '保单功能开发中',
        icon: 'none'
      })
    },
    
    onBackHome() {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.insurance-success-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 40rpx 30rpx 120rpx;
}

/* 成功状态 */
.success-status {
  text-align: center;
  margin-bottom: 40rpx;
}

.success-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.success-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.success-subtitle {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 投保信息 */
.policy-info {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.policy-number {
  font-size: 24rpx;
  color: #666;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 26rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.status-pending {
  color: #FF9500;
}

/* 后续步骤 */
.next-steps {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 5rpx;
}

.step-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.step-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 重要提醒 */
.important-notice {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.notice-text {
  font-size: 24rpx;
  color: #FF6B35;
  line-height: 1.5;
}

/* 底部操作 */
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

.action-btn {
  flex: 1;
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


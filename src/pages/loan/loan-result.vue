<template>
  <view class="loan-result-container">
    <!-- 结果状态 -->
    <view class="result-header">
      <view class="result-icon" :class="{ success: isSuccess, error: !isSuccess }">
        <text class="icon-text">{{ isSuccess ? '✓' : '✕' }}</text>
      </view>
      <text class="result-title">{{ isSuccess ? '申请提交成功' : '申请提交失败' }}</text>
      <text class="result-subtitle">{{ resultMessage }}</text>
    </view>

    <!-- 申请信息 -->
    <view class="application-info" v-if="applicationData">
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">申请信息</text>
          <text class="application-id">申请编号：{{ applicationData.id }}</text>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">贷款产品</text>
            <text class="info-value">{{ applicationData.productName }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">申请金额</text>
            <text class="info-value highlight">¥{{ applicationData.amount }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">贷款期限</text>
            <text class="info-value">{{ applicationData.term }}个月</text>
          </view>
          <view class="info-item">
            <text class="info-label">预计月供</text>
            <text class="info-value">¥{{ applicationData.monthlyPayment }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">申请状态</text>
            <text class="info-value status" :class="getStatusClass()">{{ applicationData.statusText }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">提交时间</text>
            <text class="info-value">{{ formatTime(applicationData.submitTime) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 审核进度 -->
    <view class="progress-section" v-if="isSuccess">
      <view class="section-title">审核进度</view>
      <view class="progress-steps">
        <view class="progress-step completed">
          <view class="step-icon">✓</view>
          <view class="step-content">
            <text class="step-title">申请提交</text>
            <text class="step-desc">已完成</text>
          </view>
        </view>
        <view class="progress-step active">
          <view class="step-icon">⏳</view>
          <view class="step-content">
            <text class="step-title">资料审核</text>
            <text class="step-desc">进行中</text>
          </view>
        </view>
        <view class="progress-step">
          <view class="step-icon">📋</view>
          <view class="step-content">
            <text class="step-title">风险评估</text>
            <text class="step-desc">待进行</text>
          </view>
        </view>
        <view class="progress-step">
          <view class="step-icon">✅</view>
          <view class="step-content">
            <text class="step-title">审核完成</text>
            <text class="step-desc">待进行</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="tips-section">
      <view class="section-title">温馨提示</view>
      <view class="tips-content">
        <text class="tip-item" v-if="isSuccess">• 审核结果将在1-3个工作日内通知您</text>
        <text class="tip-item" v-if="isSuccess">• 请保持手机畅通，注意接听银行电话</text>
        <text class="tip-item" v-if="isSuccess">• 您可以在"我的贷款"中查看申请进度</text>
        <text class="tip-item" v-if="!isSuccess">• 请检查申请信息是否正确</text>
        <text class="tip-item" v-if="!isSuccess">• 如有疑问，请联系客服</text>
        <text class="tip-item">• 请勿向他人透露个人信息和验证码</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn secondary" @tap="viewApplications">查看申请记录</button>
      <button class="action-btn primary" @tap="backToHome">返回首页</button>
    </view>

    <!-- 重新申请按钮 -->
    <view class="retry-section" v-if="!isSuccess">
      <button class="retry-btn" @tap="retryApplication">重新申请</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isSuccess: false,
      applicationId: '',
      applicationData: null,
      resultMessage: ''
    }
  },
  onLoad(options) {
    this.isSuccess = options.success === 'true'
    this.applicationId = options.applicationId || ''
    
    if (this.isSuccess) {
      this.resultMessage = '您的贷款申请已成功提交，我们将尽快为您审核'
      this.loadApplicationData()
    } else {
      this.resultMessage = '申请提交失败，请检查网络连接后重试'
    }
  },
  methods: {
    // 加载申请数据
    loadApplicationData() {
      try {
        const applications = uni.getStorageSync('loanApplications') || []
        this.applicationData = applications.find(app => app.id === this.applicationId)
        
        if (!this.applicationData) {
          console.error('未找到申请数据')
        }
      } catch (error) {
        console.error('加载申请数据失败:', error)
      }
    },

    // 获取状态样式类
    getStatusClass() {
      if (!this.applicationData) return ''
      
      switch (this.applicationData.status) {
        case 'pending':
          return 'pending'
        case 'approved':
          return 'approved'
        case 'rejected':
          return 'rejected'
        default:
          return ''
      }
    },

    // 格式化时间
    formatTime(timeString) {
      if (!timeString) return ''
      
      const date = new Date(timeString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    // 查看申请记录
    viewApplications() {
      uni.navigateTo({
        url: '/pages/loan/loan-applications'
      })
    },

    // 返回首页
    backToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },

    // 重新申请
    retryApplication() {
      uni.redirectTo({
        url: '/pages/loan/loan-application'
      })
    }
  }
}
</script>

<style scoped>
.loan-result-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 60rpx 30rpx;
}

.result-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.result-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.result-icon.success {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.result-icon.error {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}

.icon-text {
  font-size: 60rpx;
  font-weight: bold;
  color: #fff;
}

.result-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.result-subtitle {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.application-info {
  margin-bottom: 40rpx;
}

.info-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.application-id {
  font-size: 24rpx;
  color: #999;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
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

.info-value.highlight {
  color: #f44336;
  font-weight: bold;
  font-size: 32rpx;
}

.info-value.status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.info-value.status.pending {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.info-value.status.approved {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.info-value.status.rejected {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.progress-section, .tips-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.progress-step {
  display: flex;
  align-items: center;
  position: relative;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 25rpx;
  top: 70rpx;
  width: 2rpx;
  height: 50rpx;
  background: #e0e0e0;
}

.progress-step.completed::after {
  background: #4caf50;
}

.progress-step.active::after {
  background: linear-gradient(to bottom, #4caf50 50%, #e0e0e0 50%);
}

.step-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.progress-step.completed .step-icon {
  background: #4caf50;
  color: #fff;
}

.progress-step.active .step-icon {
  background: #2196f3;
  color: #fff;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.step-desc {
  font-size: 24rpx;
  color: #999;
}

.progress-step.completed .step-desc {
  color: #4caf50;
}

.progress-step.active .step-desc {
  color: #2196f3;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-btn {
  flex: 1;
  height: 90rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
}

.action-btn.secondary {
  background: #f5f5f5;
  color: #666;
}

.retry-section {
  text-align: center;
}

.retry-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

button:active {
  transform: scale(0.98);
}
</style>


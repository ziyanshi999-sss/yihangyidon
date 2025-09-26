<template>
  <view class="water-history-page">
    <!-- 顶部标题 -->
    <view class="header-section">
      <view class="header-content">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="page-title">水费缴费记录</text>
        <view class="header-right"></view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-value">{{ paymentHistory.length }}</text>
          <text class="stat-label">缴费次数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">¥{{ totalAmount }}</text>
          <text class="stat-label">累计金额</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ lastPaymentDate }}</text>
          <text class="stat-label">最近缴费</text>
        </view>
      </view>
    </view>

    <!-- 缴费记录列表 -->
    <view class="history-section">
      <view class="section-header">
        <text class="section-title">缴费记录</text>
        <text class="record-count">{{ paymentHistory.length }}条记录</text>
      </view>

      <view class="history-list" v-if="paymentHistory.length > 0">
        <view 
          class="history-item" 
          v-for="record in paymentHistory" 
          :key="record.id"
          @tap="viewRecordDetail(record)"
        >
          <view class="record-left">
            <view class="company-info">
              <text class="company-name">{{ record.company }}</text>
              <text class="user-number">用户号: {{ record.userNumber }}</text>
            </view>
            <view class="bill-info">
              <text class="bill-period">{{ record.billPeriod }}</text>
              <text class="payment-date">{{ formatDate(record.paymentDate) }}</text>
            </view>
          </view>
          <view class="record-right">
            <view class="amount-info">
              <text class="amount">¥{{ formatNumber(record.amount) }}</text>
              <view class="status-badge" :class="record.status">
                <text class="status-text">{{ getStatusText(record.status) }}</text>
              </view>
            </view>
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-icon">💧</view>
        <text class="empty-title">暂无缴费记录</text>
        <text class="empty-desc">您还没有水费缴费记录</text>
        <button class="go-payment-btn" @tap="goToWaterPayment">
          <text class="btn-text">去缴费</text>
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-section" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'WaterHistory',
  data() {
    return {
      paymentHistory: [],
      isLoading: true,
      totalAmount: 0,
      lastPaymentDate: '暂无'
    }
  },

  async onLoad() {
    await this.loadPaymentHistory()
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 加载缴费历史
    async loadPaymentHistory() {
      try {
        this.isLoading = true
        
        // 使用数据连接器获取缴费历史
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        const users = await connector.getUsers()
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser) {
          // 获取当前用户的水费缴费历史
          const allHistory = await connector.getWaterPaymentHistory()
          this.paymentHistory = allHistory.filter(record => record.userId === currentUser.id)
          
          // 计算统计数据
          this.calculateStats()
          
          console.log('✅ 水费缴费历史加载成功:', this.paymentHistory.length, '条记录')
        } else {
          console.warn('⚠️ 未找到登录用户')
          this.paymentHistory = []
        }
      } catch (error) {
        console.error('❌ 加载缴费历史失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 计算统计数据
    calculateStats() {
      if (this.paymentHistory.length === 0) {
        this.totalAmount = 0
        this.lastPaymentDate = '暂无'
        return
      }

      // 计算总金额
      this.totalAmount = this.paymentHistory.reduce((sum, record) => {
        return sum + (record.amount || 0)
      }, 0)

      // 获取最近缴费日期
      const latestRecord = this.paymentHistory[0] // 已按时间排序
      if (latestRecord && latestRecord.paymentDate) {
        this.lastPaymentDate = this.formatDate(latestRecord.paymentDate)
      }
    },

    // 查看记录详情
    viewRecordDetail(record) {
      console.log('查看缴费记录详情:', record)
      
      // 显示详情弹窗或跳转到详情页
      uni.showModal({
        title: '缴费详情',
        content: `公司: ${record.company}\n用户号: ${record.userNumber}\n账单期: ${record.billPeriod}\n金额: ¥${this.formatNumber(record.amount)}\n缴费时间: ${this.formatDate(record.paymentDate)}`,
        showCancel: false,
        confirmText: '确定'
      })
    },

    // 去缴费
    goToWaterPayment() {
      uni.navigateTo({
        url: '/pages/water/water'
      })
    },

    // 格式化数字
    formatNumber(num) {
      if (num === null || num === undefined || isNaN(num)) {
        return '0.00'
      }
      return parseFloat(num).toLocaleString('zh-CN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '未知'
      
      try {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        
        return `${year}-${month}-${day} ${hours}:${minutes}`
      } catch (error) {
        console.error('日期格式化失败:', error)
        return '未知'
      }
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'success': '成功',
        'pending': '处理中',
        'failed': '失败',
        'cancelled': '已取消'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.water-history-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* 顶部标题 */
.header-section {
  position: relative;
  z-index: 10;
  padding: 60rpx 40rpx 40rpx;
  background: transparent;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  padding: 24rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.back-btn {
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

.page-title {
  font-size: 32rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.header-right {
  width: 56rpx;
}

/* 统计信息 */
.stats-section {
  margin: 24rpx;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.1);
}

/* 历史记录 */
.history-section {
  margin: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: white;
}

.record-count {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.history-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.history-item:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.record-left {
  flex: 1;
}

.company-info {
  margin-bottom: 8rpx;
}

.company-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.user-number {
  font-size: 20rpx;
  color: #666;
}

.bill-info {
  display: flex;
  gap: 16rpx;
}

.bill-period {
  font-size: 22rpx;
  color: #333;
  font-weight: 500;
}

.payment-date {
  font-size: 20rpx;
  color: #999;
}

.record-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.amount-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.amount {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
}

.status-badge {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 18rpx;
}

.status-badge.success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.arrow-icon {
  font-size: 20rpx;
  color: #999;
}

/* 空状态 */
.empty-state {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 32rpx;
}

.go-payment-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 16rpx;
  padding: 16rpx 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.btn-text {
  color: white;
  font-size: 24rpx;
  font-weight: 600;
}

/* 加载状态 */
.loading-section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.95);
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 22rpx;
  color: #666;
}
</style>

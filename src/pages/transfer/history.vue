<template>
  <view class="transfer-history-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">转账记录</text>
      <view class="nav-right" @click="refreshData">
        <text class="refresh-icon">🔄</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ totalTransfers }}</text>
        <text class="stats-label">总笔数</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">¥{{ totalAmount.toFixed(2) }}</text>
        <text class="stats-label">总金额</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ thisMonthTransfers }}</text>
        <text class="stats-label">本月</text>
      </view>
    </view>

    <!-- 筛选器 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view 
          class="filter-tab" 
          :class="{ active: currentFilter === 'all' }" 
          @click="setFilter('all')"
        >
          全部
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: currentFilter === 'outgoing' }" 
          @click="setFilter('outgoing')"
        >
          转出
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: currentFilter === 'incoming' }" 
          @click="setFilter('incoming')"
        >
          转入
        </view>
      </view>
    </view>

    <!-- 转账记录列表 -->
    <view class="transfer-list">
      <view 
        class="transfer-item" 
        v-for="record in filteredRecords" 
        :key="record.id"
        @click="showTransferDetail(record)"
      >
        <view class="transfer-left">
          <view class="transfer-icon" :class="record.type">
            <text class="icon-text">{{ record.type === 'outgoing' ? '↗️' : '↙️' }}</text>
          </view>
          <view class="transfer-info">
            <text class="transfer-name">{{ record.recipient || record.sender }}</text>
            <text class="transfer-desc">{{ record.description }}</text>
            <text class="transfer-time">{{ formatTime(record.timestamp) }}</text>
          </view>
        </view>
        <view class="transfer-right">
          <text class="transfer-amount" :class="record.type">
            {{ record.type === 'outgoing' ? '-' : '+' }}¥{{ record.amount.toFixed(2) }}
          </text>
          <text class="transfer-status" :class="record.status">{{ getStatusText(record.status) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="filteredRecords.length === 0">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无转账记录</text>
      <text class="empty-desc">开始您的第一笔转账吧</text>
    </view>

    <!-- 转账详情弹窗 -->
    <view class="detail-modal" v-if="showDetailModal" @click="closeDetailModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">转账详情</text>
          <text class="close-btn" @click="closeDetailModal">×</text>
        </view>
        <view class="modal-body" v-if="selectedRecord">
          <view class="detail-item">
            <text class="detail-label">交易类型</text>
            <text class="detail-value">{{ selectedRecord.type === 'outgoing' ? '转出' : '转入' }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易金额</text>
            <text class="detail-value amount">¥{{ selectedRecord.amount.toFixed(2) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">{{ selectedRecord.type === 'outgoing' ? '收款方' : '付款方' }}</text>
            <text class="detail-value">{{ selectedRecord.recipient || selectedRecord.sender }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">账户信息</text>
            <text class="detail-value">{{ selectedRecord.recipientAccount || selectedRecord.senderAccount }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易说明</text>
            <text class="detail-value">{{ selectedRecord.description }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易时间</text>
            <text class="detail-value">{{ formatFullTime(selectedRecord.timestamp) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易状态</text>
            <text class="detail-value status" :class="selectedRecord.status">{{ getStatusText(selectedRecord.status) }}</text>
          </view>
          <view class="detail-item" v-if="selectedRecord.fee > 0">
            <text class="detail-label">手续费</text>
            <text class="detail-value">¥{{ selectedRecord.fee.toFixed(2) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易流水号</text>
            <text class="detail-value">{{ selectedRecord.id }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import unifiedDataManager from '@/utils/unified-data-manager.js'

export default {
  data() {
    return {
      transferRecords: [],
      currentFilter: 'all',
      showDetailModal: false,
      selectedRecord: null
    }
  },
  
  computed: {
    // 过滤后的记录
    filteredRecords() {
      if (this.currentFilter === 'all') {
        return this.transferRecords
      }
      return this.transferRecords.filter(record => record.type === this.currentFilter)
    },
    
    // 总笔数
    totalTransfers() {
      return this.transferRecords.length
    },
    
    // 总金额
    totalAmount() {
      return this.transferRecords.reduce((sum, record) => {
        return sum + (record.type === 'outgoing' ? record.amount : 0)
      }, 0)
    },
    
    // 本月笔数
    thisMonthTransfers() {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      return this.transferRecords.filter(record => {
        const recordDate = new Date(record.timestamp)
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
      }).length
    }
  },
  
  onLoad() {
    this.loadTransferRecords()
    this.initDataSync()
  },
  
  onShow() {
    this.loadTransferRecords()
  },
  
  methods: {
    // 加载转账记录
    async loadTransferRecords() {
      try {
        // 初始化统一数据管理器
        await unifiedDataManager.init()
        
        // 从统一数据管理器获取当前用户数据
        const currentUser = unifiedDataManager.getCurrentUser()
        
        if (currentUser && currentUser.transferRecords) {
          this.transferRecords = currentUser.transferRecords
          console.log('从统一数据管理器加载转账记录:', this.transferRecords.length)
        } else {
          // 如果统一数据管理器没有数据，尝试从本地存储获取
          const users = uni.getStorageSync('users') || []
          const currentUserId = uni.getStorageSync('currentUserId')
          let fallbackUser = null
          
          if (currentUserId) {
            fallbackUser = users.find(user => user.id === currentUserId)
          } else {
            fallbackUser = users.find(user => user.isLoggedIn)
          }
          
          if (fallbackUser && fallbackUser.transferRecords) {
            this.transferRecords = fallbackUser.transferRecords
            console.log('从本地存储加载转账记录:', this.transferRecords.length)
          } else {
            this.transferRecords = []
            console.log('没有找到转账记录')
          }
        }
      } catch (error) {
        console.error('加载转账记录失败:', error)
        this.transferRecords = []
      }
    },

    // 初始化数据同步
    initDataSync() {
      try {
        // 监听统一数据管理器变化
        unifiedDataManager.onDataChange((data) => {
          console.log('转账记录页面收到数据更新事件:', data)
          this.loadTransferRecords() // 重新加载转账记录
        })

        // 监听转账记录更新事件
        uni.$on('transferRecordUpdated', (data) => {
          console.log('转账记录页面收到转账记录更新事件:', data)
          this.loadTransferRecords() // 重新加载转账记录
        })

        console.log('✅ 转账记录页面数据同步已初始化')
      } catch (error) {
        console.error('❌ 转账记录页面数据同步初始化失败:', error)
      }
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 刷新数据
    refreshData() {
      uni.showLoading({ title: '刷新中...' })
      setTimeout(() => {
        this.loadTransferRecords()
        uni.hideLoading()
        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        })
      }, 1000)
    },
    
    // 设置筛选器
    setFilter(filter) {
      this.currentFilter = filter
    },
    
    // 显示转账详情
    showTransferDetail(record) {
      this.selectedRecord = record
      this.showDetailModal = true
    },
    
    // 关闭详情弹窗
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedRecord = null
    },
    
    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚'
      }
      
      // 小于1小时
      if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
      }
      
      // 小于1天
      if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
      }
      
      // 小于7天
      if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前'
      }
      
      // 超过7天显示具体日期
      return date.toLocaleDateString()
    },
    
    // 格式化完整时间
    formatFullTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'completed': '已完成',
        'processing': '处理中',
        'failed': '失败',
        'pending': '待处理',
        'cancelled': '已取消'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.transfer-history-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 顶部导航 */
.nav-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-left, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.nav-left:active, .nav-right:active {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(0.95);
}

.back-icon, .refresh-icon {
  font-size: 32rpx;
  color: #667eea;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  flex: 1;
  text-align: center;
  color: #333;
}

/* 统计卡片 */
.stats-card {
  background: rgba(255, 255, 255, 0.95);
  margin: 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 24rpx;
  color: #666;
}

/* 筛选器 */
.filter-section {
  background: rgba(255, 255, 255, 0.95);
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 8rpx;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  font-weight: 600;
}

/* 转账记录列表 */
.transfer-list {
  background: rgba(255, 255, 255, 0.95);
  margin: 0 20rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.transfer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.transfer-item:last-child {
  border-bottom: none;
}

.transfer-item:active {
  background: #f8f9ff;
}

.transfer-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.transfer-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.transfer-icon.outgoing {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.transfer-icon.incoming {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
}

.icon-text {
  font-size: 32rpx;
}

.transfer-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.transfer-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.transfer-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 6rpx;
}

.transfer-time {
  font-size: 22rpx;
  color: #999;
}

.transfer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.transfer-amount {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.transfer-amount.outgoing {
  color: #ff6b6b;
}

.transfer-amount.incoming {
  color: #51cf66;
}

.transfer-status {
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  color: #666;
}

.transfer-status.completed {
  background: #e8f5e8;
  color: #51cf66;
}

.transfer-status.processing {
  background: #fff3cd;
  color: #856404;
}

.transfer-status.failed {
  background: #f8d7da;
  color: #721c24;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  background: rgba(255, 255, 255, 0.95);
  margin: 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #666;
}

/* 详情弹窗 */
.detail-modal {
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
  padding: 40rpx;
}

.modal-content {
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  font-size: 32rpx;
  font-weight: bold;
}

.modal-body {
  padding: 32rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f8f9fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 20rpx;
}

.detail-value.amount {
  font-weight: bold;
  color: #667eea;
}

.detail-value.status {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: #e8f5e8;
  color: #51cf66;
  display: inline-block;
}
</style>
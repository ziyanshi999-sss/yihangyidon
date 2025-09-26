<template>
  <view class="transaction-page">
    <!-- 顶部标题栏 -->
    <view class="header-section">
      <view class="header-content">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="page-title">交易记录</text>
        <button class="filter-btn" @tap="showFilterModal">
          <text class="filter-icon">🔍</text>
        </button>
      </view>
    </view>

    <!-- 统计概览 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-value">{{ totalTransactions }}</text>
          <text class="stat-label">总交易</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value income">+¥{{ formatNumber(totalIncome) }}</text>
          <text class="stat-label">总收入</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value expense">-¥{{ formatNumber(totalExpense) }}</text>
          <text class="stat-label">总支出</text>
        </view>
      </view>
    </view>

    <!-- 筛选器 -->
    <view class="filter-section" v-if="showFilters">
      <view class="filter-row">
        <view class="filter-group">
          <text class="filter-label">类型</text>
          <view class="filter-options">
            <button 
              class="filter-option" 
              :class="{ active: selectedType === 'all' }"
              @tap="setFilter('type', 'all')"
            >
              全部
            </button>
            <button 
              class="filter-option" 
              :class="{ active: selectedType === 'income' }"
              @tap="setFilter('type', 'income')"
            >
              收入
            </button>
            <button 
              class="filter-option" 
              :class="{ active: selectedType === 'expense' }"
              @tap="setFilter('type', 'expense')"
            >
              支出
            </button>
          </view>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-group">
          <text class="filter-label">分类</text>
          <view class="filter-options">
            <button 
              class="filter-option" 
              :class="{ active: selectedCategory === 'all' }"
              @tap="setFilter('category', 'all')"
            >
              全部
            </button>
            <button 
              class="filter-option" 
              v-for="category in categories" 
              :key="category"
              :class="{ active: selectedCategory === category }"
              @tap="setFilter('category', category)"
            >
              {{ getCategoryName(category) }}
            </button>
          </view>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-group">
          <text class="filter-label">时间</text>
          <view class="filter-options">
            <button 
              class="filter-option" 
              :class="{ active: selectedPeriod === 'all' }"
              @tap="setFilter('period', 'all')"
            >
              全部
            </button>
            <button 
              class="filter-option" 
              :class="{ active: selectedPeriod === 'today' }"
              @tap="setFilter('period', 'today')"
            >
              今天
            </button>
            <button 
              class="filter-option" 
              :class="{ active: selectedPeriod === 'week' }"
              @tap="setFilter('period', 'week')"
            >
              本周
            </button>
            <button 
              class="filter-option" 
              :class="{ active: selectedPeriod === 'month' }"
              @tap="setFilter('period', 'month')"
            >
              本月
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 交易记录列表 -->
    <view class="transaction-section">
      <view class="section-header">
        <text class="section-title">交易记录</text>
        <text class="record-count">{{ filteredTransactions.length }}条记录</text>
      </view>

      <view class="transaction-list" v-if="filteredTransactions.length > 0">
        <view 
          class="transaction-item" 
          v-for="transaction in filteredTransactions" 
          :key="transaction.id"
          @tap="viewTransactionDetail(transaction)"
        >
          <view class="transaction-left">
            <view class="transaction-icon" :class="transaction.type">
              <text class="icon">{{ transaction.icon }}</text>
            </view>
            <view class="transaction-info">
              <text class="transaction-title">{{ transaction.title }}</text>
              <text class="transaction-desc">{{ transaction.description }}</text>
              <text class="transaction-source">{{ transaction.source }}</text>
            </view>
          </view>
          <view class="transaction-right">
            <view class="amount-info">
              <text class="amount" :class="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}¥{{ formatNumber(transaction.amount) }}
              </text>
              <text class="balance">余额: ¥{{ formatNumber(transaction.balance) }}</text>
            </view>
            <view class="time-info">
              <text class="time">{{ formatTime(transaction.timestamp) }}</text>
              <view class="status-badge" :class="transaction.status">
                <text class="status-text">{{ getStatusText(transaction.status) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-icon">📊</view>
        <text class="empty-title">暂无交易记录</text>
        <text class="empty-desc">当前筛选条件下没有找到交易记录</text>
        <button class="clear-filter-btn" @tap="clearFilters">
          <text class="btn-text">清除筛选</text>
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-section" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 交易详情弹窗 -->
    <view class="detail-modal" v-if="showDetailModal" @tap="hideDetailModal">
      <view class="modal-backdrop"></view>
      <view class="modal-container" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">交易详情</text>
          <button class="close-btn" @tap="hideDetailModal">
            <text class="close-icon">×</text>
          </button>
        </view>
        <view class="modal-content" v-if="selectedTransaction">
          <view class="detail-item">
            <text class="detail-label">交易类型</text>
            <text class="detail-value">{{ getTypeText(selectedTransaction.type) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易分类</text>
            <text class="detail-value">{{ getCategoryName(selectedTransaction.category) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易金额</text>
            <text class="detail-value amount" :class="selectedTransaction.type">
              {{ selectedTransaction.type === 'income' ? '+' : '-' }}¥{{ formatNumber(selectedTransaction.amount) }}
            </text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易描述</text>
            <text class="detail-value">{{ selectedTransaction.description }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易来源</text>
            <text class="detail-value">{{ selectedTransaction.source }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易时间</text>
            <text class="detail-value">{{ formatDateTime(selectedTransaction.timestamp) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易状态</text>
            <text class="detail-value">{{ getStatusText(selectedTransaction.status) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">交易编号</text>
            <text class="detail-value">{{ selectedTransaction.reference }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">余额</text>
            <text class="detail-value">¥{{ formatNumber(selectedTransaction.balance) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TransactionPage',
  data() {
    return {
      transactions: [],
      filteredTransactions: [],
      isLoading: true,
      showFilters: false,
      showDetailModal: false,
      selectedTransaction: null,
      
      // 筛选条件
      selectedType: 'all',
      selectedCategory: 'all',
      selectedPeriod: 'all',
      
      // 统计数据
      totalTransactions: 0,
      totalIncome: 0,
      totalExpense: 0,
      
      // 分类映射
      categories: ['salary', 'utility', 'transfer', 'investment', 'shopping', 'food', 'refund', 'transport'],
      categoryNames: {
        'salary': '工资',
        'utility': '生活缴费',
        'transfer': '转账',
        'investment': '投资理财',
        'shopping': '购物',
        'food': '餐饮',
        'refund': '退款',
        'transport': '交通'
      }
    }
  },

  async onLoad() {
    await this.loadTransactions()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadTransactions()
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 加载交易记录
    async loadTransactions() {
      try {
        this.isLoading = true
        console.log('🔄 开始加载交易记录...')
        
        // 使用数据连接器获取用户数据
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        if (!connector.isInitialized) {
          console.log('⚠️ 数据连接器未初始化，正在初始化...')
          await connector.init()
        }
        
        const users = await connector.getUsers()
        console.log('👥 获取到的用户数据:', users.length, '个用户')
        
        const currentUser = users.find(user => user.isLoggedIn)
        console.log('🔍 查找当前登录用户...')
        
        if (currentUser) {
          console.log('✅ 找到当前用户:', currentUser.username)
          console.log('📋 用户交易记录:', currentUser.transactionRecords?.length || 0, '条')
          
          if (currentUser.transactionRecords && currentUser.transactionRecords.length > 0) {
            this.transactions = currentUser.transactionRecords.sort((a, b) => 
              new Date(b.timestamp) - new Date(a.timestamp)
            )
            
            this.calculateStats()
            this.applyFilters()
            
            console.log('✅ 交易记录加载成功:', this.transactions.length, '条记录')
          } else {
            console.warn('⚠️ 用户没有交易记录数据')
            this.transactions = []
            this.filteredTransactions = []
          }
        } else {
          console.warn('⚠️ 未找到当前登录用户')
          console.log('🔍 所有用户登录状态:')
          users.forEach(user => {
            console.log(`   - ${user.username}: isLoggedIn=${user.isLoggedIn}`)
          })
          this.transactions = []
          this.filteredTransactions = []
        }
      } catch (error) {
        console.error('❌ 加载交易记录失败:', error)
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
      this.totalTransactions = this.transactions.length
      
      this.totalIncome = this.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      this.totalExpense = this.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    },

    // 应用筛选条件
    applyFilters() {
      let filtered = [...this.transactions]
      
      // 按类型筛选
      if (this.selectedType !== 'all') {
        filtered = filtered.filter(t => t.type === this.selectedType)
      }
      
      // 按分类筛选
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(t => t.category === this.selectedCategory)
      }
      
      // 按时间筛选
      if (this.selectedPeriod !== 'all') {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.timestamp)
          switch (this.selectedPeriod) {
            case 'today':
              return transactionDate >= today
            case 'week':
              return transactionDate >= weekAgo
            case 'month':
              return transactionDate >= monthAgo
            default:
              return true
          }
        })
      }
      
      this.filteredTransactions = filtered
    },

    // 设置筛选条件
    setFilter(type, value) {
      switch (type) {
        case 'type':
          this.selectedType = value
          break
        case 'category':
          this.selectedCategory = value
          break
        case 'period':
          this.selectedPeriod = value
          break
      }
      this.applyFilters()
    },

    // 显示筛选器
    showFilterModal() {
      this.showFilters = !this.showFilters
    },

    // 清除筛选条件
    clearFilters() {
      this.selectedType = 'all'
      this.selectedCategory = 'all'
      this.selectedPeriod = 'all'
      this.applyFilters()
    },

    // 查看交易详情
    viewTransactionDetail(transaction) {
      this.selectedTransaction = transaction
      this.showDetailModal = true
    },

    // 隐藏详情弹窗
    hideDetailModal() {
      this.showDetailModal = false
      this.selectedTransaction = null
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

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '未知'
      
      try {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date
        
        // 今天
        if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
          return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
        
        // 昨天
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        if (date.getDate() === yesterday.getDate()) {
          return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
        
        // 其他日期
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
      } catch (error) {
        console.error('时间格式化失败:', error)
        return '未知'
      }
    },

    // 格式化日期时间
    formatDateTime(timestamp) {
      if (!timestamp) return '未知'
      
      try {
        const date = new Date(timestamp)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error('日期时间格式化失败:', error)
        return '未知'
      }
    },

    // 获取分类名称
    getCategoryName(category) {
      return this.categoryNames[category] || category
    },

    // 获取类型文本
    getTypeText(type) {
      return type === 'income' ? '收入' : '支出'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'completed': '已完成',
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
.transaction-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* 顶部标题栏 */
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

.back-btn, .filter-btn {
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

.back-btn:active, .filter-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.back-icon, .filter-icon {
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

/* 统计概览 */
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

.stat-value.income {
  color: #22c55e;
}

.stat-value.expense {
  color: #ef4444;
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

/* 筛选器 */
.filter-section {
  margin: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.filter-row {
  margin-bottom: 24rpx;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.filter-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #333;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.filter-option {
  padding: 12rpx 20rpx;
  background: #f5f5f5;
  border: none;
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #666;
  transition: all 0.3s ease;
}

.filter-option.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.filter-option:active {
  transform: scale(0.95);
}

/* 交易记录 */
.transaction-section {
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

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.transaction-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.transaction-item:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.transaction-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.transaction-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.transaction-icon.income {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.transaction-icon.expense {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.transaction-desc {
  font-size: 20rpx;
  color: #666;
  display: block;
  margin-bottom: 4rpx;
}

.transaction-source {
  font-size: 18rpx;
  color: #999;
}

.transaction-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.amount {
  font-size: 28rpx;
  font-weight: 700;
}

.amount.income {
  color: #22c55e;
}

.amount.expense {
  color: #ef4444;
}

.balance {
  font-size: 20rpx;
  color: #999;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.time {
  font-size: 20rpx;
  color: #999;
}

.status-badge {
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  font-size: 16rpx;
}

.status-badge.completed {
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

.clear-filter-btn {
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

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10rpx);
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
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
  font-weight: 700;
  color: #333;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  background: #f5f5f5;
  border: none;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 24rpx;
  color: #666;
}

.modal-content {
  padding: 32rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
  text-align: right;
  flex: 1;
  margin-left: 16rpx;
}

.detail-value.amount.income {
  color: #22c55e;
}

.detail-value.amount.expense {
  color: #ef4444;
}
</style>

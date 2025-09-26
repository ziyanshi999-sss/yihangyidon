<template>
  <view class="security-logs-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-icon">←</text>
      </view>
      <view class="nav-title">安全日志</view>
      <view class="nav-right">
        <text class="nav-icon" @click="refreshLogs">🔄</text>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stats-card card">
        <view class="stats-header">
          <text class="stats-title">安全统计</text>
          <text class="stats-time">最近7天</text>
        </view>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-number">{{ stats.total }}</text>
            <text class="stat-label">总事件</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ stats.screenshots }}</text>
            <text class="stat-label">截屏</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ stats.recordings }}</text>
            <text class="stat-label">录屏</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ stats.others }}</text>
            <text class="stat-label">其他</text>
          </view>
        </view>
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
          :class="{ active: currentFilter === 'screenshot' }"
          @click="setFilter('screenshot')"
        >
          截屏
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: currentFilter === 'recording' }"
          @click="setFilter('recording')"
        >
          录屏
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: currentFilter === 'other' }"
          @click="setFilter('other')"
        >
          其他
        </view>
      </view>
    </view>

    <!-- 日志列表 -->
    <view class="logs-section">
      <view v-if="filteredLogs.length === 0" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无安全事件记录</text>
        <text class="empty-desc">当检测到可疑活动时，记录会显示在这里</text>
      </view>
      
      <view v-else class="logs-list">
        <view 
          class="log-item card" 
          v-for="(log, index) in filteredLogs" 
          :key="index"
          @click="showLogDetail(log)"
        >
          <view class="log-header">
            <view class="log-icon" :class="getLogTypeClass(log.type)">
              <text class="icon">{{ getLogTypeIcon(log.type) }}</text>
            </view>
            <view class="log-info">
              <text class="log-type">{{ getLogTypeText(log.type) }}</text>
              <text class="log-time">{{ formatTime(log.timestamp) }}</text>
            </view>
            <view class="log-status">
              <text class="status-dot" :class="getLogTypeClass(log.type)"></text>
            </view>
          </view>
          
          <view class="log-details">
            <view class="detail-row">
              <text class="detail-label">页面:</text>
              <text class="detail-value">{{ log.page || '未知' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">平台:</text>
              <text class="detail-value">{{ getPlatformText(log.platform) }}</text>
            </view>
            <view class="detail-row" v-if="log.environment">
              <text class="detail-label">环境:</text>
              <text class="detail-value">{{ getEnvironmentText(log.environment) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="action-btn secondary" @click="clearAllLogs">清除所有记录</button>
      <button class="action-btn primary" @click="exportLogs">导出记录</button>
    </view>

    <!-- 日志详情弹窗 -->
    <view class="log-detail-modal" v-if="showDetailModal" @click="hideLogDetail">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">事件详情</text>
          <text class="modal-close" @click="hideLogDetail">✕</text>
        </view>
        <view class="modal-body" v-if="selectedLog">
          <view class="detail-section">
            <text class="section-title">基本信息</text>
            <view class="detail-item">
              <text class="item-label">事件类型:</text>
              <text class="item-value">{{ getLogTypeText(selectedLog.type) }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">发生时间:</text>
              <text class="item-value">{{ formatDetailTime(selectedLog.timestamp) }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">所在页面:</text>
              <text class="item-value">{{ selectedLog.page || '未知' }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">设备平台:</text>
              <text class="item-value">{{ getPlatformText(selectedLog.platform) }}</text>
            </view>
            <view class="detail-item" v-if="selectedLog.environment">
              <text class="item-label">运行环境:</text>
              <text class="item-value">{{ getEnvironmentText(selectedLog.environment) }}</text>
            </view>
          </view>
          
          <view class="detail-section" v-if="selectedLog.userAgent">
            <text class="section-title">设备信息</text>
            <view class="detail-item">
              <text class="item-label">用户代理:</text>
              <text class="item-value">{{ selectedLog.userAgent }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SecurityLogs',
  data() {
    return {
      logs: [],
      filteredLogs: [],
      currentFilter: 'all',
      showDetailModal: false,
      selectedLog: null,
      stats: {
        total: 0,
        screenshots: 0,
        recordings: 0,
        others: 0
      }
    }
  },

  onLoad() {
    this.loadLogs()
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 刷新日志
    refreshLogs() {
      this.loadLogs()
      uni.showToast({
        title: '已刷新',
        icon: 'success'
      })
    },

    // 加载日志
    loadLogs() {
      try {
        if (this.$getSecurityLogs) {
          this.logs = this.$getSecurityLogs(100)
          this.calculateStats()
          this.filterLogs()
        }
      } catch (error) {
        console.error('加载日志失败:', error)
      }
    },

    // 计算统计信息
    calculateStats() {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const recentLogs = this.logs.filter(log => {
        const logTime = new Date(log.timestamp)
        return logTime >= sevenDaysAgo
      })

      this.stats.total = recentLogs.length
      this.stats.screenshots = recentLogs.filter(log => 
        log.type.includes('screenshot') || log.type.includes('截屏')
      ).length
      this.stats.recordings = recentLogs.filter(log => 
        log.type.includes('recording') || log.type.includes('录屏')
      ).length
      this.stats.others = this.stats.total - this.stats.screenshots - this.stats.recordings
    },

    // 设置筛选器
    setFilter(filter) {
      this.currentFilter = filter
      this.filterLogs()
    },

    // 筛选日志
    filterLogs() {
      if (this.currentFilter === 'all') {
        this.filteredLogs = this.logs
      } else if (this.currentFilter === 'screenshot') {
        this.filteredLogs = this.logs.filter(log => 
          log.type.includes('screenshot') || log.type.includes('截屏')
        )
      } else if (this.currentFilter === 'recording') {
        this.filteredLogs = this.logs.filter(log => 
          log.type.includes('recording') || log.type.includes('录屏')
        )
      } else if (this.currentFilter === 'other') {
        this.filteredLogs = this.logs.filter(log => 
          !log.type.includes('screenshot') && 
          !log.type.includes('recording') && 
          !log.type.includes('截屏') && 
          !log.type.includes('录屏')
        )
      }
    },

    // 显示日志详情
    showLogDetail(log) {
      this.selectedLog = log
      this.showDetailModal = true
    },

    // 隐藏日志详情
    hideLogDetail() {
      this.showDetailModal = false
      this.selectedLog = null
    },

    // 清除所有日志
    clearAllLogs() {
      uni.showModal({
        title: '清除记录',
        content: '确定要清除所有安全记录吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            if (this.$clearSecurityLogs) {
              const success = this.$clearSecurityLogs()
              if (success) {
                this.logs = []
                this.filteredLogs = []
                this.calculateStats()
                uni.showToast({
                  title: '记录已清除',
                  icon: 'success'
                })
              }
            }
          }
        }
      })
    },

    // 导出日志
    exportLogs() {
      if (this.$exportSecurityLogs) {
        const success = this.$exportSecurityLogs()
        if (success) {
          uni.showToast({
            title: '导出成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '导出失败',
            icon: 'error'
          })
        }
      }
    },

    // 获取日志类型图标
    getLogTypeIcon(type) {
      if (type.includes('screenshot') || type.includes('截屏')) {
        return '📸'
      } else if (type.includes('recording') || type.includes('录屏')) {
        return '🎥'
      } else if (type.includes('context_menu')) {
        return '🖱️'
      } else if (type.includes('keyboard')) {
        return '⌨️'
      } else {
        return '⚠️'
      }
    },

    // 获取日志类型文本
    getLogTypeText(type) {
      if (type.includes('screenshot') || type.includes('截屏')) {
        return '截屏检测'
      } else if (type.includes('recording') || type.includes('录屏')) {
        return '录屏检测'
      } else if (type.includes('context_menu')) {
        return '右键菜单'
      } else if (type.includes('keyboard')) {
        return '键盘快捷键'
      } else if (type.includes('visibility_change')) {
        return '页面切换'
      } else if (type.includes('window_blur')) {
        return '窗口失焦'
      } else {
        return '其他活动'
      }
    },

    // 获取日志类型样式类
    getLogTypeClass(type) {
      if (type.includes('screenshot') || type.includes('截屏')) {
        return 'screenshot'
      } else if (type.includes('recording') || type.includes('录屏')) {
        return 'recording'
      } else {
        return 'other'
      }
    },

    // 获取平台文本
    getPlatformText(platform) {
      const platformMap = {
        android: 'Android',
        ios: 'iOS',
        windows: 'Windows',
        mac: 'macOS',
        unknown: '未知'
      }
      return platformMap[platform] || '未知'
    },

    // 获取环境文本
    getEnvironmentText(environment) {
      const envMap = {
        h5: 'H5浏览器',
        app: 'App应用',
        'mp-weixin': '微信小程序',
        unknown: '未知'
      }
      return envMap[environment] || '未知'
    },

    // 格式化时间
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
        return date.toLocaleDateString()
      }
    },

    // 格式化详细时间
    formatDetailTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.security-logs-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back-icon, .nav-icon {
  font-size: 40rpx;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

/* 统计信息 */
.stats-card {
  margin-top: 20rpx;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.stats-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.stats-time {
  font-size: 24rpx;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

/* 筛选器 */
.filter-section {
  margin: 20rpx 30rpx;
}

.filter-tabs {
  display: flex;
  background: white;
  border-radius: 12rpx;
  padding: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 日志列表 */
.logs-section {
  margin-top: 20rpx;
}

.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.log-item {
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.log-item:active {
  transform: scale(0.98);
}

.log-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.log-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-icon.screenshot {
  background: #fff3cd;
}

.log-icon.recording {
  background: #f8d7da;
}

.log-icon.other {
  background: #d1ecf1;
}

.log-icon .icon {
  font-size: 28rpx;
}

.log-info {
  flex: 1;
}

.log-type {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

.log-time {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.log-status {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.status-dot.screenshot {
  background: #ffc107;
}

.status-dot.recording {
  background: #dc3545;
}

.status-dot.other {
  background: #17a2b8;
}

.log-details {
  padding-left: 80rpx;
}

.detail-row {
  display: flex;
  margin-bottom: 8rpx;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
  width: 120rpx;
}

.detail-value {
  font-size: 24rpx;
  color: #333;
  flex: 1;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 20rpx;
  margin: 40rpx 30rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1rpx solid #e0e0e0;
}

/* 详情弹窗 */
.log-detail-modal {
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
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  margin: 60rpx;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 32rpx;
  color: #999;
  padding: 10rpx;
}

.modal-body {
  padding: 30rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30rpx;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.detail-item {
  display: flex;
  margin-bottom: 16rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 26rpx;
  color: #666;
  width: 160rpx;
}

.item-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  word-break: break-all;
}
</style>

<template>
  <view class="allocation-detail" :class="getThemeClass()" :style="getThemeStyle()">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>
    
    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-content">
        <button class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <view class="nav-info">
          <text class="nav-title">资产配置详情</text>
          <text class="nav-subtitle">Asset Allocation Details</text>
        </view>
      </view>
    </view>
    
    <!-- 当前配置概览 -->
    <view class="current-allocation theme-card">
      <view class="section-header">
        <text class="section-title">当前资产配置</text>
        <text class="section-subtitle">基于您的风险偏好：{{ riskProfile }}</text>
      </view>
      
      <view class="allocation-overview">
        <view class="pie-chart-container">
          <view class="pie-chart" ref="pieChart"></view>
          <view class="chart-center">
            <text class="center-text">总资产</text>
            <text class="center-amount">¥{{ formatNumber(totalAssets) }}</text>
          </view>
        </view>
        
        <view class="allocation-stats">
          <view class="stat-item">
            <text class="stat-label">风险等级</text>
            <text class="stat-value" :class="riskLevelClass">{{ riskLevel }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">预期年化收益</text>
            <text class="stat-value">{{ expectedReturn }}%</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">最大回撤</text>
            <text class="stat-value">{{ maxDrawdown }}%</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">夏普比率</text>
            <text class="stat-value">{{ sharpeRatio }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 详细配置列表 -->
    <view class="allocation-breakdown theme-card">
      <view class="section-header">
        <text class="section-title">详细配置</text>
        <text class="section-subtitle">各类资产的具体配置情况</text>
      </view>
      
      <view class="breakdown-list">
        <view class="breakdown-item" v-for="(item, index) in allocationDetails" :key="index">
          <view class="item-header">
            <view class="item-icon" :style="{ backgroundColor: item.color }">
              <text class="icon">{{ item.icon }}</text>
            </view>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-category">{{ item.category }}</text>
            </view>
            <view class="item-actions">
              <button class="action-btn" @click="viewDetails(item)">详情</button>
            </view>
          </view>
          
          <view class="item-content">
            <view class="allocation-bar">
              <view class="bar-bg">
                <view class="bar-fill" :style="{ width: item.currentPercent + '%', backgroundColor: item.color }"></view>
              </view>
              <text class="bar-text">{{ item.currentPercent }}%</text>
            </view>
            
            <view class="allocation-details">
              <view class="detail-row">
                <text class="detail-label">当前金额</text>
                <text class="detail-value">¥{{ formatNumber(item.currentAmount) }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">目标配置</text>
                <text class="detail-value">{{ item.targetPercent }}%</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">偏离度</text>
                <text class="detail-value" :class="item.deviation > 0 ? 'positive' : 'negative'">
                  {{ item.deviation > 0 ? '+' : '' }}{{ item.deviation }}%
                </text>
              </view>
              <view class="detail-row">
                <text class="detail-label">预期收益</text>
                <text class="detail-value">{{ item.expectedReturn }}%</text>
              </view>
            </view>
            
            <view class="item-recommendation" v-if="item.recommendation">
              <text class="recommendation-text">{{ item.recommendation }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 调仓建议 -->
    <view class="rebalance-suggestions theme-card">
      <view class="section-header">
        <text class="section-title">调仓建议</text>
        <text class="section-subtitle">基于市场分析和风险模型</text>
      </view>
      
      <view class="suggestions-list">
        <view class="suggestion-item" v-for="(suggestion, index) in rebalanceSuggestions" :key="index">
          <view class="suggestion-header">
            <view class="suggestion-priority" :class="suggestion.priority">
              <text class="priority-text">{{ suggestion.priorityText }}</text>
            </view>
            <text class="suggestion-title">{{ suggestion.title }}</text>
          </view>
          
          <view class="suggestion-content">
            <text class="suggestion-desc">{{ suggestion.description }}</text>
            
            <view class="suggestion-details">
              <view class="detail-item">
                <text class="detail-label">操作类型</text>
                <text class="detail-value">{{ suggestion.operation }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">调整金额</text>
                <text class="detail-value">¥{{ formatNumber(suggestion.amount) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">预期收益</text>
                <text class="detail-value">{{ suggestion.expectedReturn }}%</text>
              </view>
            </view>
            
            <view class="suggestion-actions">
              <button class="suggestion-btn primary" @click="executeSuggestion(suggestion)">执行建议</button>
              <button class="suggestion-btn secondary" @click="viewAnalysis(suggestion)">查看分析</button>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 历史表现 -->
    <view class="historical-performance theme-card">
      <view class="section-header">
        <text class="section-title">历史表现</text>
        <text class="section-subtitle">过去12个月的配置表现</text>
      </view>
      
      <view class="performance-chart">
        <view class="chart-container">
          <view class="chart-placeholder">
            <text class="chart-text">收益率曲线图</text>
            <text class="chart-desc">过去12个月累计收益率：{{ historicalReturn }}%</text>
          </view>
        </view>
      </view>
      
      <view class="performance-metrics">
        <view class="metric-item">
          <text class="metric-label">年化收益率</text>
          <text class="metric-value positive">{{ annualReturn }}%</text>
        </view>
        <view class="metric-item">
          <text class="metric-label">波动率</text>
          <text class="metric-value">{{ volatility }}%</text>
        </view>
        <view class="metric-item">
          <text class="metric-label">最大回撤</text>
          <text class="metric-value negative">{{ maxDrawdown }}%</text>
        </view>
        <view class="metric-item">
          <text class="metric-label">夏普比率</text>
          <text class="metric-value">{{ sharpeRatio }}</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="theme-btn-primary" @click="autoRebalance">一键调仓</button>
      <button class="theme-btn-secondary" @click="manualAdjust">手动调整</button>
      <button class="theme-btn-secondary" @click="exportReport">导出报告</button>
    </view>
  </view>
</template>

<script>
import themeMixin from '@/mixins/theme-mixin.js'

export default {
  name: 'AssetAllocationDetail',
  mixins: [themeMixin],
  data() {
    return {
      riskProfile: '平衡型',
      riskLevel: '中等',
      riskLevelClass: 'medium',
      totalAssets: 125689.23,
      expectedReturn: 6.8,
      maxDrawdown: 8.5,
      sharpeRatio: 1.2,
      annualReturn: 7.2,
      volatility: 12.5,
      historicalReturn: 8.6,
      allocationDetails: [
        {
          name: '现金及货币基金',
          category: '现金类',
          icon: '💰',
          color: '#4CAF50',
          currentPercent: 30,
          targetPercent: 25,
          currentAmount: 37706.77,
          deviation: 5,
          expectedReturn: 2.5,
          recommendation: '建议减少5%现金配置，转入债券类产品'
        },
        {
          name: '债券基金',
          category: '债券类',
          icon: '🏦',
          color: '#2196F3',
          currentPercent: 35,
          targetPercent: 40,
          currentAmount: 43991.23,
          deviation: -5,
          expectedReturn: 4.2,
          recommendation: '建议增加5%债券配置，提高收益稳定性'
        },
        {
          name: '股票基金',
          category: '股票类',
          icon: '📈',
          color: '#FF9800',
          currentPercent: 25,
          targetPercent: 25,
          currentAmount: 31422.31,
          deviation: 0,
          expectedReturn: 8.5,
          recommendation: '当前配置合理，建议保持'
        },
        {
          name: '另类投资',
          category: '另类投资',
          icon: '💎',
          color: '#9C27B0',
          currentPercent: 10,
          targetPercent: 10,
          currentAmount: 12568.92,
          deviation: 0,
          expectedReturn: 6.8,
          recommendation: '当前配置合理，建议保持'
        }
      ],
      rebalanceSuggestions: [
        {
          priority: 'high',
          priorityText: '高优先级',
          title: '优化现金配置',
          description: '当前现金配置过高，建议将部分资金转入债券基金，提高整体收益',
          operation: '减仓现金，增仓债券',
          amount: 6284.46,
          expectedReturn: 1.7
        },
        {
          priority: 'medium',
          priorityText: '中优先级',
          title: '平衡风险收益',
          description: '建议微调股票和债券比例，在控制风险的同时提升收益潜力',
          operation: '微调股债比例',
          amount: 2513.78,
          expectedReturn: 0.8
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    formatNumber(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    viewDetails(item) {
      uni.showModal({
        title: item.name,
        content: `类别：${item.category}\n当前配置：${item.currentPercent}%\n目标配置：${item.targetPercent}%\n预期收益：${item.expectedReturn}%`,
        showCancel: false
      })
    },
    executeSuggestion(suggestion) {
      uni.showModal({
        title: '执行调仓建议',
        content: suggestion.description,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '调仓指令已发送',
              icon: 'success'
            })
          }
        }
      })
    },
    viewAnalysis(suggestion) {
      uni.navigateTo({
        url: '/pages/wealth/allocation-analysis'
      })
    },
    autoRebalance() {
      uni.showModal({
        title: '一键调仓',
        content: '系统将根据您的风险偏好自动调整资产配置，是否继续？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '调仓指令已发送',
              icon: 'success'
            })
          }
        }
      })
    },
    manualAdjust() {
      uni.navigateTo({
        url: '/pages/wealth/manual-allocation'
      })
    },
    exportReport() {
      uni.showToast({
        title: '报告导出中...',
        icon: 'loading'
      })
      setTimeout(() => {
        uni.showToast({
          title: '报告已导出',
          icon: 'success'
        })
      }, 2000)
    }
  }
}
</script>

<style scoped>
.allocation-detail {
  min-height: 100vh;
  background: #ffffff;
  padding: 0 0 40rpx 0;
  transition: background-color 0.3s ease;
  position: relative;
}

/* 顶部背景 */
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  z-index: 1;
}

/* 顶部导航 */
.top-nav {
  position: relative;
  z-index: 2;
  padding: 40rpx 30rpx;
  background: transparent;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 28rpx;
  color: white;
  font-weight: bold;
}

.nav-info {
  flex: 1;
  text-align: left;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.nav-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 主要内容 */
.main-content {
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 区域标题 */
.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.section-subtitle {
  font-size: 22rpx;
  color: #666666;
  opacity: 0.8;
}

/* 当前配置概览 */
.current-allocation {
  position: relative;
  z-index: 2;
  margin: 40rpx 30rpx 0;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.allocation-overview {
  display: flex;
  gap: 40rpx;
}

.pie-chart-container {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  flex-shrink: 0;
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 0deg 108deg,
    #2196F3 108deg 252deg,
    #FF9800 252deg 324deg,
    #9C27B0 324deg 360deg
  );
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-text {
  font-size: 20rpx;
  color: #666666;
  display: block;
  margin-bottom: 8rpx;
}

.center-amount {
  font-size: 24rpx;
  font-weight: bold;
  color: #333333;
}

.allocation-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 12rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

.stat-value {
  font-size: 24rpx;
  font-weight: bold;
  color: #333333;
}

.stat-value.positive {
  color: var(--theme-success, #10B981);
}

.stat-value.negative {
  color: var(--theme-error, #EF4444);
}

/* 详细配置列表 */
.allocation-breakdown {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.breakdown-item {
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  overflow: hidden;
}

.item-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.item-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-icon .icon {
  font-size: 28rpx;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.item-category {
  font-size: 22rpx;
  color: #666666;
}

.action-btn {
  padding: 12rpx 24rpx;
  background: var(--theme-primary, #6366F1);
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.item-content {
  padding: 24rpx;
}

.allocation-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.bar-bg {
  flex: 1;
  height: 12rpx;
  background: var(--theme-border-color, #e0e0e0);
  border-radius: 6rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.bar-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #333333;
  min-width: 60rpx;
  text-align: right;
}

.allocation-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 16rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 8rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.detail-label {
  font-size: 22rpx;
  color: #666666;
}

.detail-value {
  font-size: 22rpx;
  font-weight: bold;
  color: #333333;
}

.detail-value.positive {
  color: var(--theme-success, #10B981);
}

.detail-value.negative {
  color: var(--theme-error, #EF4444);
}

.item-recommendation {
  padding: 16rpx;
  background: rgba(99, 102, 241, 0.1);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 8rpx;
}

.recommendation-text {
  font-size: 22rpx;
  color: var(--theme-primary, #6366F1);
  line-height: 1.4;
}

/* 调仓建议 */
.rebalance-suggestions {
  margin: 0 40rpx;
  padding: 40rpx;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.suggestion-item {
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  overflow: hidden;
}

.suggestion-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.suggestion-priority {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: rgba(239, 68, 68, 0.2);
  color: var(--theme-error, #EF4444);
}

.suggestion-priority.medium {
  background: rgba(245, 158, 11, 0.2);
  color: var(--theme-warning, #F59E0B);
}

.priority-text {
  font-size: 20rpx;
  font-weight: bold;
}

.suggestion-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.suggestion-content {
  padding: 24rpx;
}

.suggestion-desc {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.4;
  display: block;
  margin-bottom: 20rpx;
}

.suggestion-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 16rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 8rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.suggestion-actions {
  display: flex;
  gap: 16rpx;
}

.suggestion-btn {
  flex: 1;
  padding: 16rpx 24rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.suggestion-btn.primary {
  background: var(--theme-primary, #6366F1);
  color: white;
}

.suggestion-btn.secondary {
  background: var(--theme-card-background, #ffffff);
  color: #333333;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

/* 历史表现 */
.historical-performance {
  margin: 0 40rpx;
  padding: 40rpx;
}

.performance-chart {
  margin-bottom: 40rpx;
}

.chart-container {
  height: 300rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
}

.chart-text {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 12rpx;
}

.chart-desc {
  font-size: 22rpx;
  color: #666666;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 12rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.metric-label {
  font-size: 24rpx;
  color: #666666;
}

.metric-value {
  font-size: 24rpx;
  font-weight: bold;
  color: #333333;
}

.metric-value.positive {
  color: var(--theme-success, #10B981);
}

.metric-value.negative {
  color: var(--theme-error, #EF4444);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 0 40rpx;
  margin-top: 40rpx;
}

.theme-btn-primary,
.theme-btn-secondary {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.theme-btn-primary {
  background: linear-gradient(135deg, var(--theme-btn-primary-bg, #6366F1) 0%, var(--theme-accent, #06B6D4) 100%);
  color: white;
  box-shadow: var(--theme-shadow-sm, 0 2rpx 4rpx rgba(0, 0, 0, 0.8));
}

.theme-btn-secondary {
  background: var(--theme-background, #f5f5f5);
  color: #333333;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

/* 暗黑主题专用样式 */
.theme-dark .top-nav,
.dark .top-nav {
  background: var(--theme-glass-bg, rgba(22, 22, 22, 0.8));
  border-bottom: 1rpx solid var(--theme-glass-border, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20rpx);
}

.theme-dark .current-allocation,
.dark .current-allocation,
.theme-dark .allocation-breakdown,
.dark .allocation-breakdown,
.theme-dark .rebalance-suggestions,
.dark .rebalance-suggestions,
.theme-dark .historical-performance,
.dark .historical-performance {
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  box-shadow: var(--theme-shadow-md, 0 4rpx 12rpx rgba(0, 0, 0, 0.9));
}

.theme-dark .stat-item,
.dark .stat-item,
.theme-dark .breakdown-item,
.dark .breakdown-item,
.theme-dark .suggestion-item,
.dark .suggestion-item,
.theme-dark .chart-container,
.dark .chart-container,
.theme-dark .metric-item,
.dark .metric-item {
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}
</style>

<template>
  <view class="advice-detail-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">智能建议详情</text>
      </view>
    </view>

    <!-- 建议概览 -->
    <view class="overview-section">
      <view class="advice-header">
        <text class="advice-title">{{ adviceData.title }}</text>
        <text class="advice-summary">{{ adviceData.summary }}</text>
      </view>
    </view>

    <!-- 风险评估 -->
    <view class="risk-section" v-if="adviceData.riskAssessment">
      <view class="section-title">风险评估</view>
      <view class="risk-content">
        <view class="risk-card">
          <view class="risk-icon">🛡️</view>
          <text class="risk-text">{{ adviceData.riskAssessment }}</text>
        </view>
      </view>
    </view>

    <!-- 具体建议 -->
    <view class="recommendations-section">
      <view class="section-title">具体建议</view>
      <view class="recommendations-list">
        <view class="recommendation-item" v-for="(rec, index) in adviceData.recommendations" :key="index">
          <view class="rec-header">
            <view class="rec-icon" :style="{ backgroundColor: getPriorityColor(rec.priority) }">
              <text class="icon">{{ getTypeIcon(rec.type) }}</text>
            </view>
            <view class="rec-info">
              <text class="rec-title">{{ rec.title }}</text>
              <text class="rec-priority" :class="rec.priority">{{ getPriorityText(rec.priority) }}</text>
            </view>
          </view>
          <text class="rec-description">{{ rec.description }}</text>
          <view class="rec-action">
            <text class="action-label">建议行动：</text>
            <text class="action-text">{{ rec.action }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 下一步计划 -->
    <view class="next-steps-section" v-if="adviceData.nextSteps && adviceData.nextSteps.length > 0">
      <view class="section-title">下一步计划</view>
      <view class="steps-list">
        <view class="step-item" v-for="(step, index) in adviceData.nextSteps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <text class="step-text">{{ step }}</text>
        </view>
      </view>
    </view>

    <!-- 市场洞察 -->
    <view class="market-insights-section">
      <view class="section-title">市场洞察</view>
      <view class="insights-grid">
        <view class="insight-card">
          <text class="insight-label">市场趋势</text>
          <text class="insight-value bullish">看涨</text>
        </view>
        <view class="insight-card">
          <text class="insight-label">波动率</text>
          <text class="insight-value">中等</text>
        </view>
        <view class="insight-card">
          <text class="insight-label">利率水平</text>
          <text class="insight-value">3.5%</text>
        </view>
        <view class="insight-card">
          <text class="insight-label">通胀率</text>
          <text class="insight-value">2.1%</text>
        </view>
      </view>
    </view>

    <!-- 推荐配置 -->
    <view class="allocation-section">
      <view class="section-title">推荐资产配置</view>
      <view class="allocation-chart">
        <view class="chart-container">
          <view class="pie-chart">
            <view class="chart-center">
              <text class="center-label">推荐配置</text>
            </view>
          </view>
          <view class="allocation-legend">
            <view class="legend-item">
              <view class="legend-color" style="background-color: #FF9800;"></view>
              <text class="legend-name">股票类</text>
              <text class="legend-percent">25%</text>
            </view>
            <view class="legend-item">
              <view class="legend-color" style="background-color: #2196F3;"></view>
              <text class="legend-name">债券类</text>
              <text class="legend-percent">35%</text>
            </view>
            <view class="legend-item">
              <view class="legend-color" style="background-color: #4CAF50;"></view>
              <text class="legend-name">现金类</text>
              <text class="legend-percent">25%</text>
            </view>
            <view class="legend-item">
              <view class="legend-color" style="background-color: #9C27B0;"></view>
              <text class="legend-name">另类投资</text>
              <text class="legend-percent">15%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="action-btn primary" @tap="applyRecommendations">应用建议</button>
      <button class="action-btn secondary" @tap="saveAdvice">保存建议</button>
      <button class="action-btn tertiary" @tap="shareAdvice">分享建议</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      adviceData: {
        title: '个性化财富建议',
        summary: '基于您的财务状况分析，我们为您提供了个性化建议',
        recommendations: [],
        riskAssessment: '',
        nextSteps: []
      }
    }
  },
  
  onLoad() {
    this.loadAdviceData()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    loadAdviceData() {
      const storedAdvice = uni.getStorageSync('currentAdvice')
      if (storedAdvice) {
        this.adviceData = storedAdvice
      } else {
        // 默认建议数据
        this.adviceData = {
          title: '个性化财富建议',
          summary: '基于您的财务状况分析，我们为您提供了4项个性化建议',
          recommendations: [
            {
              type: 'savings',
              title: '提高储蓄率',
              description: '当前储蓄率46.7%，建议提升至20%以上',
              priority: 'high',
              action: '制定预算计划，减少非必要支出'
            },
            {
              type: 'emergency',
              title: '建立应急基金',
              description: '建议储备6个月的生活费用作为应急基金',
              priority: 'high',
              action: '将部分资金转入货币基金'
            },
            {
              type: 'investment',
              title: '优化投资组合',
              description: '基于您的风险承受能力，建议增加股票类资产配置',
              priority: 'medium',
              action: '考虑定投指数基金'
            },
            {
              type: 'market',
              title: '把握市场机会',
              description: '当前市场趋势向好，适合适度增加权益类投资',
              priority: 'medium',
              action: '关注优质成长股和指数基金'
            }
          ],
          riskAssessment: '您的风险承受能力为medium，建议采用稳健型投资策略',
          nextSteps: ['制定详细投资计划', '设置自动定投', '定期评估投资表现']
        }
      }
    },
    
    getPriorityColor(priority) {
      const colors = {
        high: '#F44336',
        medium: '#FF9800',
        low: '#4CAF50'
      }
      return colors[priority] || '#2196F3'
    },
    
    getPriorityText(priority) {
      const texts = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      }
      return texts[priority] || '中优先级'
    },
    
    getTypeIcon(type) {
      const icons = {
        savings: '💰',
        emergency: '🛡️',
        investment: '📈',
        market: '📊',
        debt: '💳',
        insurance: '🏥'
      }
      return icons[type] || '💡'
    },
    
    applyRecommendations() {
      uni.showModal({
        title: '应用建议',
        content: '确定要应用这些建议吗？系统将为您自动调整投资配置。',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '正在应用建议...' })
            
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '建议已应用',
                icon: 'success'
              })
              
              // 跳转到资产配置页面
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/wealth/asset-allocation-detail'
                })
              }, 1500)
            }, 2000)
          }
        }
      })
    },
    
    saveAdvice() {
      // 保存建议到本地
      const savedAdvice = uni.getStorageSync('savedAdvice') || []
      savedAdvice.unshift({
        ...this.adviceData,
        saveTime: new Date().toISOString(),
        id: Date.now()
      })
      
      // 只保留最近10条建议
      if (savedAdvice.length > 10) {
        savedAdvice.splice(10)
      }
      
      uni.setStorageSync('savedAdvice', savedAdvice)
      
      uni.showToast({
        title: '建议已保存',
        icon: 'success'
      })
    },
    
    shareAdvice() {
      uni.showActionSheet({
        itemList: ['分享给朋友', '生成报告', '导出PDF'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
          } else if (res.tapIndex === 1) {
            uni.showToast({
              title: '报告生成中...',
              icon: 'loading'
            })
          } else if (res.tapIndex === 2) {
            uni.showToast({
              title: 'PDF导出功能开发中',
              icon: 'none'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.advice-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  color: white;
  font-weight: 600;
}

/* 通用样式 */
.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 30rpx;
}

/* 建议概览 */
.overview-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.advice-header {
  text-align: center;
}

.advice-title {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.advice-summary {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 风险评估 */
.risk-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.risk-content {
  display: flex;
  justify-content: center;
}

.risk-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border-left: 6rpx solid #2196F3;
}

.risk-icon {
  font-size: 40rpx;
}

.risk-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

/* 具体建议 */
.recommendations-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.recommendation-item {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border-left: 6rpx solid #2196F3;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.rec-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rec-icon .icon {
  font-size: 28rpx;
  color: white;
}

.rec-info {
  flex: 1;
}

.rec-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.rec-priority {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  display: inline-block;
}

.rec-priority.high {
  background: #FFEBEE;
  color: #F44336;
}

.rec-priority.medium {
  background: #FFF3E0;
  color: #FF9800;
}

.rec-priority.low {
  background: #E8F5E8;
  color: #4CAF50;
}

.rec-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: block;
}

.rec-action {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
}

.action-label {
  font-size: 24rpx;
  color: #666;
  flex-shrink: 0;
}

.action-text {
  font-size: 24rpx;
  color: #2196F3;
  font-weight: 500;
}

/* 下一步计划 */
.next-steps-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.step-number {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #2196F3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.step-text {
  font-size: 26rpx;
  color: #333;
}

/* 市场洞察 */
.market-insights-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.insight-card {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  text-align: center;
}

.insight-label {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.insight-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.insight-value.bullish {
  color: #4CAF50;
}

/* 推荐配置 */
.allocation-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.allocation-chart {
  display: flex;
  justify-content: center;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.pie-chart {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: conic-gradient(
    #FF9800 0deg 90deg,
    #2196F3 90deg 216deg,
    #4CAF50 216deg 306deg,
    #9C27B0 306deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chart-center {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-label {
  font-size: 20rpx;
  color: #666;
}

.allocation-legend {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.legend-color {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.legend-name {
  font-size: 24rpx;
  color: #333;
  width: 100rpx;
}

.legend-percent {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

/* 操作按钮 */
.action-section {
  margin: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.action-btn.primary {
  background: #2196F3;
  color: white;
}

.action-btn.secondary {
  background: #4CAF50;
  color: white;
}

.action-btn.tertiary {
  background: #f0f0f0;
  color: #666;
}
</style>

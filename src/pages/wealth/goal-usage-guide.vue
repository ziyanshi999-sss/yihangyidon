<template>
  <view class="goal-usage-guide-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">目标管理使用指南</text>
      </view>
    </view>

    <!-- 功能概览 -->
    <view class="overview-section">
      <view class="section-title">🎯 目标管理功能概览</view>
      <view class="overview-content">
        <text class="overview-text">目标管理功能帮助您设定、跟踪和实现财务目标，让理财更有计划性和成就感。</text>
      </view>
    </view>

    <!-- 当前目标状态 -->
    <view class="current-goals-section">
      <view class="section-title">📊 您当前的目标状态</view>
      <view class="goals-stats">
        <view class="stat-card">
          <text class="stat-number">{{ totalGoals }}</text>
          <text class="stat-label">总目标数</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ activeGoals }}</text>
          <text class="stat-label">进行中</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ completedGoals }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ completionRate }}%</text>
          <text class="stat-label">完成率</text>
        </view>
      </view>
    </view>

    <!-- 目标类型说明 -->
    <view class="goal-types-section">
      <view class="section-title">🏷️ 支持的目标类型</view>
      <view class="types-grid">
        <view class="type-card" v-for="category in goalCategories" :key="category.id">
          <view class="type-icon" :style="{ backgroundColor: category.color }">
            <text class="icon">{{ category.icon }}</text>
          </view>
          <text class="type-name">{{ category.name }}</text>
          <text class="type-desc">{{ getCategoryDescription(category.name) }}</text>
        </view>
      </view>
    </view>

    <!-- 使用步骤 -->
    <view class="usage-steps-section">
      <view class="section-title">📋 使用步骤</view>
      <view class="steps-list">
        <view class="step-item" v-for="(step, index) in usageSteps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <view class="step-content">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-desc">{{ step.description }}</text>
            <view class="step-tips" v-if="step.tips">
              <text class="tips-label">💡 小贴士：</text>
              <text class="tips-text">{{ step.tips }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能详解 -->
    <view class="features-section">
      <view class="section-title">⚙️ 功能详解</view>
      <view class="features-list">
        <view class="feature-item" v-for="(feature, index) in features" :key="index">
          <view class="feature-header">
            <view class="feature-icon">{{ feature.icon }}</view>
            <text class="feature-title">{{ feature.title }}</text>
          </view>
          <text class="feature-desc">{{ feature.description }}</text>
          <view class="feature-example" v-if="feature.example">
            <text class="example-label">示例：</text>
            <text class="example-text">{{ feature.example }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 最佳实践 -->
    <view class="best-practices-section">
      <view class="section-title">🌟 最佳实践建议</view>
      <view class="practices-list">
        <view class="practice-item" v-for="(practice, index) in bestPractices" :key="index">
          <view class="practice-icon">{{ practice.icon }}</view>
          <view class="practice-content">
            <text class="practice-title">{{ practice.title }}</text>
            <text class="practice-desc">{{ practice.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="quick-actions-section">
      <view class="section-title">🚀 快速操作</view>
      <view class="actions-grid">
        <button class="action-card" @tap="goToGoalManagement">
          <view class="action-icon">📝</view>
          <text class="action-title">管理目标</text>
          <text class="action-desc">查看和编辑您的目标</text>
        </button>
        <button class="action-card" @tap="createNewGoal">
          <view class="action-icon">➕</view>
          <text class="action-title">创建目标</text>
          <text class="action-desc">设定新的财务目标</text>
        </button>
        <button class="action-card" @tap="viewProgress">
          <view class="action-icon">📊</view>
          <text class="action-title">查看进度</text>
          <text class="action-desc">跟踪目标完成情况</text>
        </button>
        <button class="action-card" @tap="getAdvice">
          <view class="action-icon">💡</view>
          <text class="action-title">获取建议</text>
          <text class="action-desc">AI智能理财建议</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      totalGoals: 4,
      activeGoals: 3,
      completedGoals: 1,
      goalCategories: [
        { id: 1, name: '购房', icon: '🏠', color: '#4CAF50' },
        { id: 2, name: '教育', icon: '🎓', color: '#2196F3' },
        { id: 3, name: '退休', icon: '🌴', color: '#FF9800' },
        { id: 4, name: '旅行', icon: '✈️', color: '#9C27B0' },
        { id: 5, name: '购车', icon: '🚗', color: '#F44336' },
        { id: 6, name: '其他', icon: '💰', color: '#607D8B' }
      ],
      usageSteps: [
        {
          title: '设定目标',
          description: '点击右上角"+"按钮，选择目标类型，输入目标金额和完成时间',
          tips: '建议设定SMART目标：具体、可衡量、可实现、相关、有时限'
        },
        {
          title: '定期存入',
          description: '点击目标卡片上的"存入"按钮，定期向目标账户存入资金',
          tips: '建议设置自动定投，让储蓄成为习惯'
        },
        {
          title: '跟踪进度',
          description: '在目标列表中查看进度条，了解完成情况',
          tips: '定期检查进度，必要时调整目标或策略'
        },
        {
          title: '完成目标',
          description: '当存入金额达到目标时，系统会自动标记为已完成',
          tips: '完成目标后，可以设定新的目标继续理财规划'
        }
      ],
      features: [
        {
          icon: '📊',
          title: '进度跟踪',
          description: '实时显示目标完成进度，让您清楚了解距离目标还有多远',
          example: '购房首付目标50万，已存32.5万，完成进度65%'
        },
        {
          icon: '💰',
          title: '快速存入',
          description: '支持快速金额选择和自定义金额存入，操作简单便捷',
          example: '点击1000、5000、10000等快速金额，或输入自定义金额'
        },
        {
          icon: '🏷️',
          title: '分类管理',
          description: '按购房、教育、退休等类型分类管理，让目标更有条理',
          example: '购房目标、教育基金、退休规划分别管理'
        },
        {
          icon: '📅',
          title: '时间规划',
          description: '设定目标完成时间，帮助您合理安排资金规划',
          example: '2026年8月完成购房首付，2028年6月完成教育基金'
        },
        {
          icon: '📝',
          title: '备注记录',
          description: '为目标添加备注信息，记录重要细节和计划',
          example: '购买三居室首付、孩子大学教育基金等'
        },
        {
          icon: '🔄',
          title: '状态管理',
          description: '支持进行中、已完成等状态管理，清晰了解目标状态',
          example: '进行中的目标显示绿色，已完成的目标显示灰色'
        }
      ],
      bestPractices: [
        {
          icon: '🎯',
          title: '设定合理目标',
          description: '根据收入情况设定可实现的目标，避免过高或过低'
        },
        {
          icon: '⏰',
          title: '定期检查',
          description: '每月检查一次目标进度，及时调整策略'
        },
        {
          icon: '💪',
          title: '坚持执行',
          description: '设定目标后要坚持执行，养成定期储蓄的习惯'
        },
        {
          icon: '📈',
          title: '动态调整',
          description: '根据收入变化和市场情况，适时调整目标金额和时间'
        },
        {
          icon: '🎉',
          title: '庆祝完成',
          description: '完成目标后给自己一些奖励，保持理财的积极性'
        }
      ]
    }
  },
  
  computed: {
    completionRate() {
      if (this.totalGoals === 0) return 0
      return Math.round((this.completedGoals / this.totalGoals) * 100)
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    getCategoryDescription(categoryName) {
      const descriptions = {
        '购房': '买房首付、装修等',
        '教育': '子女教育、培训等',
        '退休': '养老规划、退休金',
        '旅行': '旅游、度假等',
        '购车': '买车、换车等',
        '其他': '其他财务目标'
      }
      return descriptions[categoryName] || '其他财务目标'
    },
    
    goToGoalManagement() {
      uni.navigateTo({
        url: '/pages/wealth/goal-management'
      })
    },
    
    createNewGoal() {
      uni.navigateTo({
        url: '/pages/wealth/goal-management'
      })
    },
    
    viewProgress() {
      uni.navigateTo({
        url: '/pages/wealth/goal-management'
      })
    },
    
    getAdvice() {
      uni.navigateTo({
        url: '/pages/wealth/ai-wealth-manager'
      })
    }
  }
}
</script>

<style scoped>
.goal-usage-guide-page {
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

/* 功能概览 */
.overview-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.overview-content {
  text-align: center;
}

.overview-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 当前目标状态 */
.current-goals-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.goals-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-card {
  text-align: center;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.stat-number {
  font-size: 48rpx;
  color: #2196F3;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

/* 目标类型说明 */
.goal-types-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.type-card {
  text-align: center;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16rpx;
}

.type-icon .icon {
  font-size: 28rpx;
  color: white;
}

.type-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.type-desc {
  font-size: 22rpx;
  color: #666;
}

/* 使用步骤 */
.usage-steps-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.step-item {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
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

.step-content {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.step-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
}

.step-tips {
  padding: 16rpx;
  background: #E3F2FD;
  border-radius: 12rpx;
  border-left: 4rpx solid #2196F3;
}

.tips-label {
  font-size: 22rpx;
  color: #2196F3;
  font-weight: 500;
}

.tips-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}

/* 功能详解 */
.features-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.feature-item {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border-left: 6rpx solid #2196F3;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.feature-icon {
  font-size: 32rpx;
}

.feature-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.feature-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
}

.feature-example {
  padding: 16rpx;
  background: #E8F5E8;
  border-radius: 8rpx;
}

.example-label {
  font-size: 22rpx;
  color: #4CAF50;
  font-weight: 500;
}

.example-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}

/* 最佳实践 */
.best-practices-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.practices-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.practice-item {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.practice-icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.practice-content {
  flex: 1;
}

.practice-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.practice-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 快速操作 */
.quick-actions-section {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.action-card {
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border: none;
  text-align: center;
  transition: all 0.3s ease;
}

.action-card:active {
  transform: scale(0.98);
  background: #e9ecef;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 16rpx;
}

.action-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.action-desc {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}
</style>

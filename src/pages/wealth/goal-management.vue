<template>
  <view class="goal-management" :class="getThemeClass()" :style="getThemeStyle()">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>
    
    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-content">
        <button class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <view class="nav-info">
          <text class="nav-title">目标管理</text>
          <text class="nav-subtitle">Goal Management</text>
        </view>
      </view>
    </view>
    
    <!-- 目标概览 -->
    <view class="goals-overview">
      <view class="overview-header">
        <view class="overview-stats">
          <view class="stat-item">
            <text class="stat-number">{{ activeGoals.length }}</text>
            <text class="stat-label">进行中</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ completedGoals.length }}</text>
            <text class="stat-label">已完成</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">¥{{ formatNumber(totalTargetAmount) }}</text>
            <text class="stat-label">总目标金额</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 快速添加目标 -->
    <view class="quick-add">
      <view class="section-header">
        <text class="section-title">快速添加目标</text>
        <text class="section-subtitle">选择常见目标类型快速创建</text>
      </view>
      
      <view class="quick-goals-grid">
        <view 
          v-for="goal in quickGoals" 
          :key="goal.id"
          class="quick-goal-item"
          @click="addQuickGoal(goal)"
        >
          <view class="goal-icon" :style="{ backgroundColor: goal.color }">
            <text class="icon-text">{{ goal.icon }}</text>
          </view>
          <text class="goal-name">{{ goal.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 进行中的目标 -->
    <view class="active-goals">
      <view class="section-header">
        <text class="section-title">进行中的目标</text>
        <text class="section-subtitle">查看和管理您的理财目标</text>
      </view>
      
      <view class="goals-list">
        <view 
          v-for="goal in activeGoals" 
          :key="goal.id"
          class="goal-item"
          @click="viewGoalDetail(goal)"
        >
          <view class="goal-header">
            <view class="goal-info">
              <view class="goal-icon" :style="{ backgroundColor: goal.color }">
                <text class="icon-text">{{ goal.icon }}</text>
              </view>
              <view class="goal-details">
                <text class="goal-name">{{ goal.name }}</text>
                <text class="goal-amount">目标: ¥{{ formatNumber(goal.target) }}</text>
              </view>
            </view>
            <view class="goal-actions">
              <text class="goal-deadline">{{ goal.deadline }}</text>
              <text class="arrow">></text>
            </view>
          </view>
          
          <view class="goal-progress">
            <view class="progress-bar">
              <view 
                class="progress-fill" 
                :style="{ 
                  width: goal.progress + '%', 
                  backgroundColor: goal.color 
                }"
              ></view>
            </view>
            <text class="progress-text">{{ goal.progress }}%</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <button class="action-btn primary" @click="addNewGoal">添加新目标</button>
      <button class="action-btn secondary" @click="viewAllGoals">查看所有目标</button>
    </view>
  </view>
</template>

<script>
import themeMixin from '@/mixins/theme-mixin.js'

export default {
  name: 'GoalManagement',
  mixins: [themeMixin],
  data() {
    return {
      activeGoals: [
        {
          id: 1,
          name: '购房首付',
          target: 500000,
          current: 325000,
          progress: 65,
          deadline: '2026年8月',
          icon: '🏠',
          color: '#4caf50'
        },
        {
          id: 2,
          name: '教育基金',
          target: 150000,
          current: 60000,
          progress: 40,
          deadline: '2028年6月',
          icon: '🎓',
          color: '#2196f3'
        },
        {
          id: 3,
          name: '退休规划',
          target: 1000000,
          current: 250000,
          progress: 25,
          deadline: '2040年12月',
          icon: '🌴',
          color: '#ff9800'
        }
      ],
      completedGoals: [
        {
          id: 4,
          name: '应急基金',
          target: 50000,
          current: 50000,
          progress: 100,
          deadline: '2024年12月',
          icon: '🛡️',
          color: '#9c27b0'
        }
      ],
      quickGoals: [
        { id: 1, name: '购房首付', icon: '🏠', color: '#4caf50', target: 500000 },
        { id: 2, name: '教育基金', icon: '🎓', color: '#2196f3', target: 150000 },
        { id: 3, name: '退休规划', icon: '🌴', color: '#ff9800', target: 1000000 },
        { id: 4, name: '旅行基金', icon: '✈️', color: '#e91e63', target: 30000 },
        { id: 5, name: '购车基金', icon: '🚗', color: '#f44336', target: 200000 },
        { id: 6, name: '应急基金', icon: '🛡️', color: '#9c27b0', target: 50000 }
      ]
    }
  },
  computed: {
    totalTargetAmount() {
      return this.activeGoals.reduce((total, goal) => total + goal.target, 0)
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    formatNumber(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    },
    addQuickGoal(goal) {
      uni.showModal({
        title: '添加目标',
        content: `确定要添加"${goal.name}"目标吗？\n目标金额：¥${this.formatNumber(goal.target)}`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '目标添加成功',
              icon: 'success'
            })
          }
        }
      })
    },
    viewGoalDetail(goal) {
      uni.showModal({
        title: goal.name,
        content: `目标金额：¥${this.formatNumber(goal.target)}\n当前进度：${goal.progress}%\n完成时间：${goal.deadline}`,
        showCancel: false
      })
    },
    addNewGoal() {
      uni.showToast({
        title: '跳转到添加目标页面',
        icon: 'none'
      })
    },
    viewAllGoals() {
      uni.showToast({
        title: '查看所有目标',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.goal-management {
  min-height: 100vh;
  background: var(--theme-background, #f5f5f5);
  padding: 0 0 40rpx 0;
  transition: background-color 0.3s ease;
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

/* 区域标题 */
.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 8rpx;
}

.section-subtitle {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
  opacity: 0.8;
}

/* 目标概览 */
.goals-overview {
  position: relative;
  z-index: 2;
  margin: 40rpx 30rpx 0;
  background: var(--theme-card-background, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.overview-stats {
  display: flex;
  justify-content: space-around;
  gap: 40rpx;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: var(--theme-text-secondary, #666666);
}

/* 快速添加目标 */
.quick-add {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.quick-goals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.quick-goal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  transition: all 0.3s ease;
}

.quick-goal-item:active {
  transform: scale(0.95);
  background: var(--theme-background, #f5f5f5);
}

.goal-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-text {
  font-size: 32rpx;
}

.goal-name {
  font-size: 24rpx;
  color: var(--theme-text-color, #333333);
  text-align: center;
}

/* 进行中的目标 */
.active-goals {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.goal-item {
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  padding: 24rpx;
  transition: all 0.3s ease;
}

.goal-item:active {
  transform: scale(0.98);
  background: var(--theme-background, #f5f5f5);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.goal-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text-color, #333333);
}

.goal-amount {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
}

.goal-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.goal-deadline {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
}

.arrow {
  font-size: 24rpx;
  color: var(--theme-text-secondary, #999999);
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background: var(--theme-background, #f5f5f5);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 20rpx;
  color: var(--theme-text-secondary, #666666);
  min-width: 60rpx;
  text-align: right;
}

/* 底部操作按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--theme-card-background, #ffffff);
  padding: 24rpx 30rpx;
  border-top: 1rpx solid var(--theme-border-color, #e0e0e0);
  display: flex;
  gap: 20rpx;
  z-index: 100;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
}

.action-btn.primary:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.action-btn.secondary {
  background: var(--theme-background, #f5f5f5);
  color: var(--theme-text-color, #333333);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.action-btn.secondary:active {
  transform: scale(0.98);
  background: var(--theme-border-color, #e0e0e0);
}
</style>
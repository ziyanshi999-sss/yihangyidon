<template>
  <view class="goal-list-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">所有目标</text>
      </view>
      <view class="nav-right">
        <button class="add-btn" @tap="addNewGoal">
          <text class="add-icon">+</text>
        </button>
      </view>
    </view>

    <!-- 筛选和搜索 -->
    <view class="filter-section">
      <view class="search-box">
        <input 
          class="search-input" 
          placeholder="搜索目标..." 
          v-model="searchKeyword"
          @input="filterGoals"
        />
        <text class="search-icon">🔍</text>
      </view>
      
      <view class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'all' }"
          @tap="setFilter('all')"
        >
          全部
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'active' }"
          @tap="setFilter('active')"
        >
          进行中
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'completed' }"
          @tap="setFilter('completed')"
        >
          已完成
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'overdue' }"
          @tap="setFilter('overdue')"
        >
          已逾期
        </button>
      </view>
    </view>

    <!-- 目标统计 -->
    <view class="stats-section">
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
        <text class="stat-number">¥{{ formatNumber(totalTargetAmount) }}</text>
        <text class="stat-label">目标总额</text>
      </view>
    </view>

    <!-- 目标列表 -->
    <view class="goals-container">
      <view class="goals-list">
        <view 
          class="goal-item" 
          v-for="goal in filteredGoals" 
          :key="goal.id"
          @tap="viewGoalDetail(goal)"
        >
          <view class="goal-header">
            <view class="goal-icon" :style="{ backgroundColor: goal.color }">
              <text class="icon">{{ goal.icon }}</text>
            </view>
            <view class="goal-info">
              <text class="goal-title">{{ goal.title }}</text>
              <text class="goal-category">{{ goal.category }}</text>
            </view>
            <view class="goal-status" :class="goal.status">
              <text class="status-text">{{ getStatusText(goal.status) }}</text>
            </view>
          </view>
          
          <view class="goal-progress">
            <view class="progress-info">
              <text class="progress-text">进度: {{ goal.progress }}%</text>
              <text class="amount-text">¥{{ formatNumber(goal.currentAmount) }} / ¥{{ formatNumber(goal.targetAmount) }}</text>
            </view>
            <view class="progress-bar">
              <view 
                class="progress-fill" 
                :style="{ 
                  width: goal.progress + '%', 
                  backgroundColor: goal.color 
                }"
              ></view>
            </view>
          </view>
          
          <view class="goal-details">
            <view class="detail-item">
              <text class="detail-label">目标日期:</text>
              <text class="detail-value">{{ goal.targetDate }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">月投入:</text>
              <text class="detail-value">¥{{ formatNumber(goal.monthlyContribution) }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">剩余时间:</text>
              <text class="detail-value">{{ getRemainingTime(goal.targetDate) }}</text>
            </view>
          </view>
          
          <view class="goal-actions">
            <button class="action-btn secondary" @tap.stop="editGoal(goal)">
              <text class="btn-text">编辑</text>
            </button>
            <button class="action-btn primary" @tap.stop="quickDeposit(goal)">
              <text class="btn-text">快速存入</text>
            </button>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredGoals.length === 0">
        <text class="empty-icon">🎯</text>
        <text class="empty-title">暂无目标</text>
        <text class="empty-desc">{{ getEmptyMessage() }}</text>
        <button class="empty-btn" @tap="addNewGoal">
          <text class="btn-text">创建新目标</text>
        </button>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="exportGoals">
        <text class="btn-text">导出目标</text>
      </button>
      <button class="action-btn primary" @tap="addNewGoal">
        <text class="btn-text">添加新目标</text>
      </button>
    </view>

    <!-- 自定义存入弹窗 -->
    <view class="deposit-modal" v-if="showDepositModal" @tap="closeDepositModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">快速存入</text>
          <button class="close-btn" @tap="closeDepositModal">
            <text class="close-icon">×</text>
          </button>
        </view>
        
        <view class="modal-body">
          <view class="goal-info">
            <view class="goal-icon" :style="{ backgroundColor: currentGoal.color }">
              <text class="icon">{{ currentGoal.icon }}</text>
            </view>
            <view class="goal-details">
              <text class="goal-name">{{ currentGoal.title }}</text>
              <text class="goal-amount">目标：¥{{ formatNumber(currentGoal.targetAmount) }}</text>
            </view>
          </view>
          
          <view class="input-section">
            <text class="input-label">存入金额</text>
            <view class="amount-input-wrapper">
              <text class="currency-symbol">¥</text>
              <input 
                class="amount-input" 
                type="number" 
                v-model="depositAmount"
                placeholder="请输入金额"
                @input="onAmountInput"
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
            </view>
            <text class="input-hint">当前进度：{{ currentGoal.progress }}%</text>
          </view>
          
          <view class="quick-amounts">
            <text class="quick-label">快速选择：</text>
            <view class="amount-buttons">
              <button 
                class="amount-btn" 
                v-for="amount in quickAmounts" 
                :key="amount"
                @tap="selectQuickAmount(amount)"
              >
                ¥{{ formatNumber(amount) }}
              </button>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeDepositModal">
            <text class="btn-text">取消</text>
          </button>
          <button class="modal-btn confirm" @tap="confirmDeposit" :disabled="!depositAmount || depositAmount <= 0">
            <text class="btn-text">确认存入</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      currentFilter: 'all',
      showDepositModal: false,
      currentGoal: {},
      depositAmount: '',
      quickAmounts: [1000, 5000, 10000, 20000, 50000],
      goals: [
        {
          id: 1,
          title: '购房首付',
          category: '住房',
          icon: '🏠',
          color: '#4CAF50',
          targetAmount: 500000,
          currentAmount: 325000,
          progress: 65,
          targetDate: '2026年8月',
          monthlyContribution: 15000,
          status: 'active',
          description: '为购买首套房准备首付款',
          priority: 'high'
        },
        {
          id: 2,
          title: '教育基金',
          category: '教育',
          icon: '🎓',
          color: '#2196F3',
          targetAmount: 150000,
          currentAmount: 60000,
          progress: 40,
          targetDate: '2028年6月',
          monthlyContribution: 5000,
          status: 'active',
          description: '为孩子高等教育准备资金',
          priority: 'medium'
        },
        {
          id: 3,
          title: '退休规划',
          category: '养老',
          icon: '🌴',
          color: '#FF9800',
          targetAmount: 1000000,
          currentAmount: 250000,
          progress: 25,
          targetDate: '2040年12月',
          monthlyContribution: 8000,
          status: 'active',
          description: '为退休生活准备充足资金',
          priority: 'high'
        },
        {
          id: 4,
          title: '旅行基金',
          category: '娱乐',
          icon: '✈️',
          color: '#9C27B0',
          targetAmount: 50000,
          currentAmount: 50000,
          progress: 100,
          targetDate: '2024年12月',
          monthlyContribution: 3000,
          status: 'completed',
          description: '欧洲旅行资金',
          priority: 'low'
        },
        {
          id: 5,
          title: '应急基金',
          category: '应急',
          icon: '🛡️',
          color: '#F44336',
          targetAmount: 100000,
          currentAmount: 80000,
          progress: 80,
          targetDate: '2024年6月',
          monthlyContribution: 5000,
          status: 'overdue',
          description: '6个月生活费用应急资金',
          priority: 'high'
        }
      ]
    }
  },
  
  computed: {
    filteredGoals() {
      let filtered = this.goals
      
      // 按状态筛选
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(goal => goal.status === this.currentFilter)
      }
      
      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(goal => 
          goal.title.toLowerCase().includes(keyword) ||
          goal.category.toLowerCase().includes(keyword) ||
          goal.description.toLowerCase().includes(keyword)
        )
      }
      
      return filtered
    },
    
    totalGoals() {
      return this.goals.length
    },
    
    activeGoals() {
      return this.goals.filter(goal => goal.status === 'active').length
    },
    
    completedGoals() {
      return this.goals.filter(goal => goal.status === 'completed').length
    },
    
    totalTargetAmount() {
      return this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    }
  },
  
  onLoad() {
    this.loadGoals()
  },
  
  methods: {
    goBack() {
      // 直接返回到AI财富管理页面
      uni.navigateTo({
        url: '/pages/wealth/ai-wealth-manager',
        success: () => {
          console.log('返回AI财富管理页面成功')
        },
        fail: (err) => {
          console.log('返回AI财富管理页面失败:', err)
          // 如果失败，使用switchTab返回财富首页
          uni.switchTab({
            url: '/pages/wealth/wealth'
          })
        }
      })
    },
    
    loadGoals() {
      // 从本地存储加载目标数据
      const storedGoals = uni.getStorageSync('userGoals')
      if (storedGoals && storedGoals.length > 0) {
        this.goals = storedGoals
      }
    },
    
    setFilter(filter) {
      this.currentFilter = filter
    },
    
    filterGoals() {
      // 搜索功能已通过computed属性实现
    },
    
    getStatusText(status) {
      const statusMap = {
        active: '进行中',
        completed: '已完成',
        overdue: '已逾期',
        paused: '已暂停'
      }
      return statusMap[status] || '未知'
    },
    
    getRemainingTime(targetDate) {
      // 简单的剩余时间计算
      const now = new Date()
      const target = new Date(targetDate)
      const diffTime = target - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) {
        return '已逾期'
      } else if (diffDays < 30) {
        return `${diffDays}天`
      } else if (diffDays < 365) {
        return `${Math.ceil(diffDays / 30)}个月`
      } else {
        return `${Math.ceil(diffDays / 365)}年`
      }
    },
    
    getEmptyMessage() {
      const messages = {
        all: '还没有创建任何目标',
        active: '没有进行中的目标',
        completed: '没有已完成的目标',
        overdue: '没有逾期的目标'
      }
      return messages[this.currentFilter] || '暂无数据'
    },
    
    formatNumber(num) {
      return Number(num).toLocaleString('zh-CN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      })
    },
    
    viewGoalDetail(goal) {
      // 存储目标数据并跳转到详情页
      uni.setStorageSync('currentGoal', goal)
      uni.navigateTo({
        url: '/pages/wealth/goal-detail'
      })
    },
    
    editGoal(goal) {
      // 存储目标数据并跳转到编辑页
      uni.setStorageSync('editingGoal', goal)
      uni.navigateTo({
        url: '/pages/wealth/goal-edit'
      })
    },
    
    quickDeposit(goal) {
      // 显示自定义存入弹窗
      this.currentGoal = goal
      this.depositAmount = ''
      this.showDepositModal = true
    },
    
    closeDepositModal() {
      this.showDepositModal = false
      this.depositAmount = ''
      this.currentGoal = {}
    },
    
    onAmountInput(e) {
      this.depositAmount = e.detail.value
    },
    
    onInputFocus() {
      // 输入框获得焦点时的处理
    },
    
    onInputBlur() {
      // 输入框失去焦点时的处理
    },
    
    selectQuickAmount(amount) {
      this.depositAmount = amount.toString()
    },
    
    confirmDeposit() {
      if (!this.depositAmount || this.depositAmount <= 0) {
        uni.showToast({
          title: '请输入有效金额',
          icon: 'none'
        })
        return
      }
      
      const amount = parseFloat(this.depositAmount)
      if (isNaN(amount) || amount <= 0) {
        uni.showToast({
          title: '请输入有效的数字金额',
          icon: 'none'
        })
        return
      }
      
      this.closeDepositModal()
      this.depositToGoal(this.currentGoal, amount)
    },
    
    depositToGoal(goal, amount) {
      uni.showLoading({ title: '正在存入...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        // 更新目标金额
        goal.currentAmount += amount
        goal.progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
        
        // 检查是否完成
        if (goal.progress >= 100) {
          goal.status = 'completed'
        }
        
        // 保存到本地存储
        uni.setStorageSync('userGoals', this.goals)
        
        uni.showToast({
          title: '存入成功',
          icon: 'success'
        })
      }, 1500)
    },
    
    addNewGoal() {
      uni.navigateTo({
        url: '/pages/wealth/goal-create'
      })
    },
    
    exportGoals() {
      uni.showLoading({ title: '正在导出...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        const exportData = this.goals.map(goal => ({
          目标名称: goal.title,
          类别: goal.category,
          目标金额: `¥${this.formatNumber(goal.targetAmount)}`,
          当前金额: `¥${this.formatNumber(goal.currentAmount)}`,
          进度: `${goal.progress}%`,
          目标日期: goal.targetDate,
          月投入: `¥${this.formatNumber(goal.monthlyContribution)}`,
          状态: this.getStatusText(goal.status)
        }))
        
        const content = JSON.stringify(exportData, null, 2)
        
        uni.setClipboardData({
          data: content,
          success: () => {
            uni.showToast({
              title: '目标数据已复制到剪贴板',
              icon: 'success'
            })
          }
        })
      }, 2000)
    }
  }
}
</script>

<style scoped>
/* 全新现代化设计 - 目标列表页面 */
.goal-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
  padding-bottom: 140rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.goal-list-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 导航栏 - 玻璃拟态设计 */
.nav-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx 35rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30rpx);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 25rpx;
}

.back-btn {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 90rpx;
  min-width: 90rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.back-btn:active {
  transform: scale(0.92) translateY(2rpx);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.back-icon {
  font-size: 36rpx;
  color: white;
  font-weight: 700;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.nav-title {
  font-size: 40rpx;
  color: white;
  font-weight: 700;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  letter-spacing: 1rpx;
}

.add-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6rpx 20rpx rgba(238, 90, 36, 0.4);
}

.add-btn:active {
  transform: scale(0.92) translateY(2rpx);
  box-shadow: 0 3rpx 10rpx rgba(238, 90, 36, 0.6);
}

.add-icon {
  font-size: 32rpx;
  color: white;
  font-weight: 700;
}

/* 筛选和搜索 - 卡片式设计 */
.filter-section {
  position: relative;
  z-index: 5;
  padding: 35rpx;
}

.search-box {
  position: relative;
  margin-bottom: 25rpx;
}

.search-input {
  width: 100%;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 45rpx;
  padding: 0 70rpx 0 35rpx;
  font-size: 30rpx;
  color: #2c3e50;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 
    0 12rpx 40rpx rgba(102, 126, 234, 0.2),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.5);
}

.search-icon {
  position: absolute;
  right: 35rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #7f8c8d;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20rpx);
  border-radius: 25rpx;
  padding: 8rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.filter-tab {
  flex: 1;
  height: 70rpx;
  background: transparent;
  border: none;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.filter-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.filter-tab:active {
  transform: scale(0.96);
}

/* 统计卡片 - 3D效果 */
.stats-section {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 35rpx 35rpx;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30rpx);
  border-radius: 25rpx;
  padding: 30rpx;
  text-align: center;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:active {
  transform: translateY(-4rpx) scale(1.02);
  box-shadow: 
    0 16rpx 48rpx rgba(0, 0, 0, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
}

.stat-card:active::before {
  opacity: 1;
}

.stat-number {
  font-size: 32rpx;
  color: white;
  font-weight: 800;
  display: block;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 目标列表 - 卡片瀑布流 */
.goals-container {
  position: relative;
  z-index: 5;
  padding: 0 35rpx;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.goal-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30rpx);
  border-radius: 30rpx;
  padding: 35rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12rpx 40rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.goal-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.goal-item:active {
  transform: translateY(-6rpx) scale(1.02);
  box-shadow: 
    0 20rpx 60rpx rgba(0, 0, 0, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.6);
}

.goal-item:active::before {
  opacity: 1;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 25rpx;
  margin-bottom: 25rpx;
  position: relative;
  z-index: 2;
}

.goal-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.goal-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50%;
}

.goal-icon .icon {
  font-size: 32rpx;
  color: white;
  position: relative;
  z-index: 1;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.goal-info {
  flex: 1;
}

.goal-title {
  font-size: 32rpx;
  color: #2c3e50;
  font-weight: 700;
  display: block;
  margin-bottom: 6rpx;
  letter-spacing: 0.5rpx;
}

.goal-category {
  font-size: 24rpx;
  color: #7f8c8d;
  font-weight: 500;
}

.goal-status {
  padding: 12rpx 20rpx;
  border-radius: 25rpx;
  font-size: 22rpx;
  font-weight: 600;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.goal-status.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
  color: #27ae60;
  border-color: rgba(76, 175, 80, 0.3);
}

.goal-status.completed {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.1));
  color: #2980b9;
  border-color: rgba(33, 150, 243, 0.3);
}

.goal-status.overdue {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1));
  color: #e74c3c;
  border-color: rgba(244, 67, 54, 0.3);
}

.goal-progress {
  margin-bottom: 25rpx;
  position: relative;
  z-index: 2;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.progress-text {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 700;
}

.amount-text {
  font-size: 24rpx;
  color: #7f8c8d;
  font-weight: 500;
}

.progress-bar {
  height: 12rpx;
  background: rgba(236, 240, 241, 0.8);
  border-radius: 6rpx;
  overflow: hidden;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 6rpx;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 25rpx;
  position: relative;
  z-index: 2;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
}

.detail-label {
  font-size: 24rpx;
  color: #7f8c8d;
  font-weight: 500;
}

.detail-value {
  font-size: 24rpx;
  color: #2c3e50;
  font-weight: 600;
}

.goal-actions {
  display: flex;
  gap: 20rpx;
  position: relative;
  z-index: 2;
}

.action-btn {
  flex: 1;
  height: 70rpx;
  border-radius: 35rpx;
  border: none;
  font-size: 26rpx;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #7f8c8d;
  border: 2rpx solid rgba(127, 140, 141, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: scale(0.96) translateY(2rpx);
}

.action-btn:active::before {
  opacity: 1;
}

/* 空状态 - 艺术化设计 */
.empty-state {
  text-align: center;
  padding: 100rpx 50rpx;
  position: relative;
  z-index: 5;
}

.empty-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 30rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
}

.empty-title {
  font-size: 36rpx;
  color: white;
  font-weight: 700;
  display: block;
  margin-bottom: 15rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.empty-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 50rpx;
  line-height: 1.5;
}

.empty-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 35rpx;
  padding: 25rpx 50rpx;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(238, 90, 36, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-btn:active {
  transform: scale(0.96) translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(238, 90, 36, 0.6);
}

/* 底部操作栏 - 浮动设计 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25rpx 35rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  gap: 25rpx;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

/* 响应式优化 */
@media (max-width: 750rpx) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nav-title {
    font-size: 36rpx;
  }
  
  .goal-title {
    font-size: 30rpx;
  }
}

/* 动画增强 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.goal-item {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.goal-item:nth-child(1) { animation-delay: 0.1s; }
.goal-item:nth-child(2) { animation-delay: 0.2s; }
.goal-item:nth-child(3) { animation-delay: 0.3s; }
.goal-item:nth-child(4) { animation-delay: 0.4s; }
.goal-item:nth-child(5) { animation-delay: 0.5s; }

/* 自定义存入弹窗 */
.deposit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 30rpx;
  width: 100%;
  max-width: 600rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 35rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.modal-title {
  font-size: 32rpx;
  color: white;
  font-weight: 700;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.close-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:active {
  transform: scale(0.9);
  background: rgba(255, 255, 255, 0.3);
}

.close-icon {
  font-size: 28rpx;
  color: white;
  font-weight: 700;
}

.modal-body {
  padding: 35rpx;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 20rpx;
}

.goal-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.goal-icon .icon {
  font-size: 28rpx;
  color: white;
}

.goal-details {
  flex: 1;
}

.goal-name {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 700;
  display: block;
  margin-bottom: 4rpx;
}

.goal-amount {
  font-size: 24rpx;
  color: #7f8c8d;
  font-weight: 500;
}

.input-section {
  margin-bottom: 30rpx;
}

.input-label {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 600;
  display: block;
  margin-bottom: 15rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
  margin-bottom: 10rpx;
}

.amount-input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.currency-symbol {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 700;
  margin-right: 10rpx;
}

.amount-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 600;
  border: none;
  background: transparent;
  outline: none;
}

.amount-input::placeholder {
  color: #adb5bd;
  font-weight: 400;
}

.input-hint {
  font-size: 22rpx;
  color: #6c757d;
  font-weight: 500;
}

.quick-amounts {
  margin-bottom: 20rpx;
}

.quick-label {
  font-size: 24rpx;
  color: #6c757d;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.amount-buttons {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.amount-btn {
  flex: 1;
  min-width: 100rpx;
  height: 60rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  font-size: 24rpx;
  color: #495057;
  font-weight: 600;
  transition: all 0.3s ease;
}

.amount-btn:active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(0.95);
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx 35rpx;
  background: #f8f9fa;
  border-top: 1rpx solid #e9ecef;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 20rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 700;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: #e9ecef;
  color: #6c757d;
}

.modal-btn.cancel:active {
  background: #dee2e6;
  transform: scale(0.98);
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.modal-btn.confirm:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
}

.modal-btn.confirm:disabled {
  background: #adb5bd;
  color: #6c757d;
  box-shadow: none;
  transform: none;
}
</style>

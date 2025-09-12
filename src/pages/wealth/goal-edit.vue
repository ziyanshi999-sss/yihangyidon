<template>
  <view class="goal-edit-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">编辑目标</text>
      </view>
      <view class="nav-right">
        <button class="save-btn" @tap="saveGoal" :disabled="!isFormValid">
          <text class="save-text">保存</text>
        </button>
      </view>
    </view>

    <!-- 编辑表单 -->
    <view class="edit-form">
      <!-- 目标基本信息 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">基本信息</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">目标名称</text>
          <input 
            class="form-input" 
            v-model="goalData.title"
            placeholder="请输入目标名称"
            @input="validateForm"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">目标类别</text>
          <view class="category-selector">
            <button 
              class="category-btn" 
              v-for="category in categories" 
              :key="category.value"
              :class="{ active: goalData.category === category.value }"
              @tap="selectCategory(category.value)"
            >
              <text class="category-icon">{{ category.icon }}</text>
              <text class="category-name">{{ category.name }}</text>
            </button>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">目标描述</text>
          <textarea 
            class="form-textarea" 
            v-model="goalData.description"
            placeholder="请输入目标描述（可选）"
            maxlength="200"
          />
        </view>
      </view>

      <!-- 目标金额 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">目标金额</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">目标总金额</text>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input 
              class="amount-input" 
              type="number"
              v-model="goalData.targetAmount"
              placeholder="请输入目标金额"
              @input="validateForm"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">当前已存金额</text>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input 
              class="amount-input" 
              type="number"
              v-model="goalData.currentAmount"
              placeholder="请输入当前金额"
              @input="validateForm"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">月投入金额</text>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input 
              class="amount-input" 
              type="number"
              v-model="goalData.monthlyContribution"
              placeholder="请输入月投入金额"
              @input="validateForm"
            />
          </view>
        </view>
      </view>

      <!-- 时间设置 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">时间设置</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">目标完成日期</text>
          <view class="date-picker" @tap="showDatePicker">
            <text class="date-text">{{ goalData.targetDate || '请选择目标日期' }}</text>
            <text class="date-icon">📅</text>
          </view>
        </view>
      </view>

      <!-- 优先级设置 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">优先级</text>
        </view>
        
        <view class="priority-selector">
          <button 
            class="priority-btn" 
            v-for="priority in priorities" 
            :key="priority.value"
            :class="{ active: goalData.priority === priority.value }"
            @tap="selectPriority(priority.value)"
          >
            <text class="priority-icon">{{ priority.icon }}</text>
            <text class="priority-name">{{ priority.name }}</text>
          </button>
        </view>
      </view>

      <!-- 删除目标 -->
      <view class="form-section danger-section">
        <view class="section-title">
          <text class="title-text danger">危险操作</text>
        </view>
        
        <button class="delete-btn" @tap="deleteGoal">
          <text class="delete-icon">🗑️</text>
          <text class="delete-text">删除此目标</text>
        </button>
      </view>
    </view>

    <!-- 日期选择器 -->
    <view class="date-picker-modal" v-if="showDatePickerModal" @tap="closeDatePicker">
      <view class="date-picker-content" @tap.stop>
        <view class="date-picker-header">
          <text class="date-picker-title">选择目标日期</text>
          <button class="close-btn" @tap="closeDatePicker">
            <text class="close-icon">×</text>
          </button>
        </view>
        
        <view class="date-picker-body">
          <picker-view class="date-picker-view" :value="pickerValue" @change="onDateChange">
            <picker-view-column>
              <view class="picker-item" v-for="year in years" :key="year">
                <text class="picker-text">{{ year }}年</text>
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="picker-item" v-for="month in months" :key="month">
                <text class="picker-text">{{ month }}月</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>
        
        <view class="date-picker-footer">
          <button class="date-btn cancel" @tap="closeDatePicker">
            <text class="btn-text">取消</text>
          </button>
          <button class="date-btn confirm" @tap="confirmDate">
            <text class="btn-text">确定</text>
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
      goalData: {
        id: null,
        title: '',
        category: '住房',
        icon: '🏠',
        color: '#4CAF50',
        targetAmount: '',
        currentAmount: '',
        monthlyContribution: '',
        targetDate: '',
        description: '',
        priority: 'medium'
      },
      categories: [
        { value: '住房', name: '住房', icon: '🏠', color: '#4CAF50' },
        { value: '教育', name: '教育', icon: '🎓', color: '#2196F3' },
        { value: '养老', name: '养老', icon: '🌴', color: '#FF9800' },
        { value: '娱乐', name: '娱乐', icon: '✈️', color: '#9C27B0' },
        { value: '应急', name: '应急', icon: '🛡️', color: '#F44336' },
        { value: '投资', name: '投资', icon: '📈', color: '#00BCD4' }
      ],
      priorities: [
        { value: 'high', name: '高', icon: '🔴' },
        { value: 'medium', name: '中', icon: '🟡' },
        { value: 'low', name: '低', icon: '🟢' }
      ],
      showDatePickerModal: false,
      pickerValue: [0, 0],
      years: [],
      months: [],
      isFormValid: false
    }
  },
  
  onLoad() {
    this.loadGoalData()
    this.initDatePicker()
  },
  
  methods: {
    goBack() {
      // 直接返回到目标列表页面
      uni.navigateTo({
        url: '/pages/wealth/goal-list',
        success: () => {
          console.log('返回目标列表页面成功')
        },
        fail: (err) => {
          console.log('返回目标列表页面失败:', err)
          // 如果失败，直接返回AI财富管理页面
          uni.navigateTo({
            url: '/pages/wealth/ai-wealth-manager',
            fail: () => {
              // 最终备用方案：返回财富首页
              uni.switchTab({
                url: '/pages/wealth/wealth'
              })
            }
          })
        }
      })
    },
    
    loadGoalData() {
      const editingGoal = uni.getStorageSync('editingGoal')
      if (editingGoal) {
        this.goalData = { ...editingGoal }
        // 确保数值字段是字符串格式，用于输入框显示，并处理undefined情况
        this.goalData.targetAmount = (this.goalData.targetAmount || 0).toString()
        this.goalData.currentAmount = (this.goalData.currentAmount || 0).toString()
        this.goalData.monthlyContribution = (this.goalData.monthlyContribution || 0).toString()
        
        // 确保其他字段也有默认值
        this.goalData.title = this.goalData.title || ''
        this.goalData.category = this.goalData.category || '住房'
        this.goalData.description = this.goalData.description || ''
        this.goalData.targetDate = this.goalData.targetDate || ''
        this.goalData.priority = this.goalData.priority || 'medium'
        this.goalData.icon = this.goalData.icon || '🏠'
        this.goalData.color = this.goalData.color || '#4CAF50'
      } else {
        // 如果没有编辑数据，使用默认值
        console.log('没有找到编辑数据，使用默认值')
        this.goalData = {
          id: null,
          title: '',
          category: '住房',
          icon: '🏠',
          color: '#4CAF50',
          targetAmount: '',
          currentAmount: '',
          monthlyContribution: '',
          targetDate: '',
          description: '',
          priority: 'medium'
        }
      }
      this.validateForm()
    },
    
    initDatePicker() {
      // 初始化年份（当前年份到10年后）
      const currentYear = new Date().getFullYear()
      for (let i = 0; i < 10; i++) {
        this.years.push(currentYear + i)
      }
      
      // 初始化月份
      for (let i = 1; i <= 12; i++) {
        this.months.push(i)
      }
    },
    
    selectCategory(category) {
      const selectedCategory = this.categories.find(cat => cat.value === category)
      this.goalData.category = category
      this.goalData.icon = selectedCategory.icon
      this.goalData.color = selectedCategory.color
      this.validateForm()
    },
    
    selectPriority(priority) {
      this.goalData.priority = priority
      this.validateForm()
    },
    
    showDatePicker() {
      this.showDatePickerModal = true
    },
    
    closeDatePicker() {
      this.showDatePickerModal = false
    },
    
    onDateChange(e) {
      this.pickerValue = e.detail.value
    },
    
    confirmDate() {
      const year = this.years[this.pickerValue[0]]
      const month = this.months[this.pickerValue[1]]
      this.goalData.targetDate = `${year}年${month}月`
      this.closeDatePicker()
      this.validateForm()
    },
    
    validateForm() {
      this.isFormValid = !!(
        this.goalData.title &&
        this.goalData.targetAmount &&
        this.goalData.currentAmount &&
        this.goalData.monthlyContribution &&
        this.goalData.targetDate
      )
    },
    
    saveGoal() {
      if (!this.isFormValid) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      // 转换数值字段，确保安全转换
      const targetAmount = parseFloat(this.goalData.targetAmount) || 0
      const currentAmount = parseFloat(this.goalData.currentAmount) || 0
      const monthlyContribution = parseFloat(this.goalData.monthlyContribution) || 0
      
      const updatedGoal = {
        ...this.goalData,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        monthlyContribution: monthlyContribution,
        progress: targetAmount > 0 ? Math.min(100, (currentAmount / targetAmount) * 100) : 0
      }
      
      uni.showLoading({ title: '正在保存...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        // 更新本地存储的目标数据
        const goals = uni.getStorageSync('userGoals') || []
        const goalIndex = goals.findIndex(goal => goal.id === updatedGoal.id)
        
        if (goalIndex !== -1) {
          goals[goalIndex] = updatedGoal
          uni.setStorageSync('userGoals', goals)
          
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          
          setTimeout(() => {
            // 保存成功后直接返回
            this.goBack()
          }, 1500)
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      }, 1500)
    },
    
    deleteGoal() {
      uni.showModal({
        title: '删除目标',
        content: `确定要删除"${this.goalData.title}"这个目标吗？\n\n删除后无法恢复！`,
        confirmText: '删除',
        confirmColor: '#F44336',
        success: (res) => {
          if (res.confirm) {
            this.confirmDelete()
          }
        }
      })
    },
    
    confirmDelete() {
      uni.showLoading({ title: '正在删除...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        // 从本地存储中删除目标
        const goals = uni.getStorageSync('userGoals') || []
        const filteredGoals = goals.filter(goal => goal.id !== this.goalData.id)
        uni.setStorageSync('userGoals', filteredGoals)
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          // 删除成功后直接返回
          this.goBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style scoped>
/* 目标编辑页面样式 */
.goal-edit-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
  padding-bottom: 40rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.goal-edit-page::before {
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

/* 导航栏 */
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

.save-btn {
  padding: 15rpx 30rpx;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25rpx;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.4);
}

.save-btn:active {
  transform: scale(0.95) translateY(2rpx);
  box-shadow: 0 3rpx 10rpx rgba(76, 175, 80, 0.6);
}

.save-btn:disabled {
  background: #adb5bd;
  box-shadow: none;
  transform: none;
}

.save-text {
  font-size: 28rpx;
  color: white;
  font-weight: 700;
}

/* 编辑表单 */
.edit-form {
  position: relative;
  z-index: 5;
  padding: 35rpx;
}

.form-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30rpx);
  border-radius: 25rpx;
  padding: 30rpx;
  margin-bottom: 25rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  margin-bottom: 25rpx;
  padding-bottom: 15rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.title-text {
  font-size: 30rpx;
  color: #2c3e50;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

.title-text.danger {
  color: #F44336;
}

.form-item {
  margin-bottom: 25rpx;
}

.form-label {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 600;
  display: block;
  margin-bottom: 12rpx;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 20rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  font-size: 28rpx;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  background: white;
}

.form-textarea {
  height: 120rpx;
  resize: none;
}

/* 类别选择器 */
.category-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  transition: all 0.3s ease;
}

.category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.05);
}

.category-btn:active {
  transform: scale(0.95);
}

.category-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.category-name {
  font-size: 22rpx;
  font-weight: 600;
}

/* 金额输入 */
.amount-input-wrapper {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  padding: 0 20rpx;
  transition: all 0.3s ease;
}

.amount-input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  background: white;
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

/* 日期选择器 */
.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  transition: all 0.3s ease;
}

.date-picker:active {
  border-color: #667eea;
  background: white;
}

.date-text {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 500;
}

.date-icon {
  font-size: 24rpx;
}

/* 优先级选择器 */
.priority-selector {
  display: flex;
  gap: 15rpx;
}

.priority-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 15rpx;
  transition: all 0.3s ease;
}

.priority-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.05);
}

.priority-btn:active {
  transform: scale(0.95);
}

.priority-icon {
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.priority-name {
  font-size: 22rpx;
  font-weight: 600;
}

/* 删除按钮 */
.danger-section {
  border: 2rpx solid rgba(244, 67, 54, 0.2);
  background: rgba(244, 67, 54, 0.05);
}

.delete-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  padding: 25rpx;
  background: #F44336;
  border: none;
  border-radius: 15rpx;
  transition: all 0.3s ease;
}

.delete-btn:active {
  transform: scale(0.98);
  background: #d32f2f;
}

.delete-icon {
  font-size: 28rpx;
}

.delete-text {
  font-size: 28rpx;
  color: white;
  font-weight: 700;
}

/* 日期选择器弹窗 */
.date-picker-modal {
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
}

.date-picker-content {
  background: white;
  border-radius: 30rpx;
  width: 100%;
  max-width: 500rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 35rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.date-picker-title {
  font-size: 32rpx;
  color: white;
  font-weight: 700;
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

.date-picker-body {
  padding: 30rpx;
}

.date-picker-view {
  height: 300rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 500;
}

.date-picker-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx 35rpx;
  background: #f8f9fa;
  border-top: 1rpx solid #e9ecef;
}

.date-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 20rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 700;
  transition: all 0.3s ease;
}

.date-btn.cancel {
  background: #e9ecef;
  color: #6c757d;
}

.date-btn.confirm {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.date-btn:active {
  transform: scale(0.98);
}
</style>

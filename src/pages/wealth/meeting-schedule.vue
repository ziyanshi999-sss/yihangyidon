<template>
  <view class="meeting-schedule-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">预约面谈</text>
      </view>
    </view>

    <!-- 客户经理信息 -->
    <view class="advisor-info-card">
      <view class="advisor-header">
        <image class="advisor-avatar" :src="advisorInfo.avatar" mode="aspectFill"></image>
        <view class="advisor-details">
          <text class="advisor-name">{{ advisorInfo.name }}</text>
          <text class="advisor-title">{{ advisorInfo.title }}</text>
          <view class="advisor-rating">
            <text class="rating-stars">★★★★★</text>
            <text class="rating-text">{{ advisorInfo.rating }}/5.0</text>
          </view>
        </view>
      </view>
      <view class="advisor-stats">
        <view class="stat-item">
          <text class="stat-value">{{ advisorInfo.experience }}</text>
          <text class="stat-label">从业经验</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ advisorInfo.clients }}</text>
          <text class="stat-label">服务客户</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ advisorInfo.successRate }}%</text>
          <text class="stat-label">成功率</text>
        </view>
      </view>
    </view>

    <!-- 预约表单 -->
    <view class="schedule-form">
      <view class="form-section">
        <text class="section-title">选择面谈时间</text>
        <view class="time-selector">
          <view class="date-picker" @tap="showDatePicker">
            <text class="picker-label">日期</text>
            <text class="picker-value">{{ selectedDate || '请选择日期' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
          <view class="time-picker" @tap="showTimePicker">
            <text class="picker-label">时间</text>
            <text class="picker-value">{{ selectedTime || '请选择时间' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <text class="section-title">选择面谈地点</text>
        <view class="location-options">
          <view 
            v-for="location in locationOptions" 
            :key="location.id"
            class="location-option"
            :class="{ active: selectedLocation === location.id }"
            @tap="selectLocation(location.id)"
          >
            <view class="location-icon">{{ location.icon }}</view>
            <view class="location-info">
              <text class="location-name">{{ location.name }}</text>
              <text class="location-address">{{ location.address }}</text>
            </view>
            <view class="location-status" v-if="selectedLocation === location.id">✓</view>
          </view>
        </view>
      </view>

      <view class="form-section">
        <text class="section-title">面谈主题</text>
        <view class="topic-options">
          <view 
            v-for="topic in topicOptions" 
            :key="topic.id"
            class="topic-option"
            :class="{ active: selectedTopics.includes(topic.id) }"
            @tap="toggleTopic(topic.id)"
          >
            <text class="topic-text">{{ topic.name }}</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <text class="section-title">备注信息</text>
        <textarea 
          class="remark-input" 
          v-model="remark"
          placeholder="请简要描述您的需求或问题..."
          maxlength="200"
        ></textarea>
        <text class="char-count">{{ remark.length }}/200</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="submit-btn" @tap="submitSchedule" :disabled="!canSubmit">
        确认预约
      </button>
    </view>

    <!-- 日期选择器 -->
    <view class="date-picker-modal" v-if="showDateModal" @tap="closeDatePicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">选择日期</text>
          <button class="close-btn" @tap="closeDatePicker">×</button>
        </view>
        <view class="date-grid">
          <view 
            v-for="date in availableDates" 
            :key="date.value"
            class="date-item"
            :class="{ active: selectedDate === date.value }"
            @tap="selectDate(date.value)"
          >
            <text class="date-day">{{ date.day }}</text>
            <text class="date-week">{{ date.week }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间选择器 -->
    <view class="time-picker-modal" v-if="showTimeModal" @tap="closeTimePicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">选择时间</text>
          <button class="close-btn" @tap="closeTimePicker">×</button>
        </view>
        <view class="time-grid">
          <view 
            v-for="time in availableTimes" 
            :key="time.value"
            class="time-item"
            :class="{ active: selectedTime === time.value }"
            @tap="selectTime(time.value)"
          >
            <text class="time-text">{{ time.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MeetingSchedule',
  data() {
    return {
      advisorInfo: {
        name: '张经理',
        title: '高级理财顾问',
        avatar: '/static/wealth/advisor-avatar.jpg',
        rating: 4.8,
        experience: '8年',
        clients: '500+',
        successRate: 95
      },
      selectedDate: '',
      selectedTime: '',
      selectedLocation: '',
      selectedTopics: [],
      remark: '',
      showDateModal: false,
      showTimeModal: false,
      locationOptions: [
        {
          id: 'office',
          name: '银行营业厅',
          address: '北京市朝阳区建国门外大街1号',
          icon: '🏦'
        },
        {
          id: 'online',
          name: '在线视频',
          address: '腾讯会议/钉钉视频',
          icon: '💻'
        },
        {
          id: 'client',
          name: '客户指定地点',
          address: '您方便的地点',
          icon: '📍'
        }
      ],
      topicOptions: [
        { id: 'investment', name: '投资理财规划' },
        { id: 'insurance', name: '保险配置建议' },
        { id: 'retirement', name: '退休养老规划' },
        { id: 'education', name: '子女教育基金' },
        { id: 'tax', name: '税务优化策略' },
        { id: 'estate', name: '财富传承规划' },
        { id: 'other', name: '其他咨询' }
      ],
      availableDates: [],
      availableTimes: [
        { value: '09:00', label: '09:00-10:00' },
        { value: '10:00', label: '10:00-11:00' },
        { value: '11:00', label: '11:00-12:00' },
        { value: '14:00', label: '14:00-15:00' },
        { value: '15:00', label: '15:00-16:00' },
        { value: '16:00', label: '16:00-17:00' }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.selectedDate && this.selectedTime && this.selectedLocation && this.selectedTopics.length > 0
    }
  },
  onLoad() {
    this.generateAvailableDates()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    generateAvailableDates() {
      const dates = []
      const today = new Date()
      const weekDays = ['日', '一', '二', '三', '四', '五', '六']
      
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        // 排除周末
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push({
            value: this.formatDate(date),
            day: date.getDate(),
            week: weekDays[date.getDay()]
          })
        }
      }
      
      this.availableDates = dates
    },
    
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    showDatePicker() {
      console.log('showDatePicker 被调用')
      this.showDateModal = true
    },
    
    closeDatePicker() {
      this.showDateModal = false
    },
    
    selectDate(date) {
      this.selectedDate = date
      this.closeDatePicker()
    },
    
    showTimePicker() {
      console.log('showTimePicker 被调用')
      this.showTimeModal = true
    },
    
    closeTimePicker() {
      this.showTimeModal = false
    },
    
    selectTime(time) {
      this.selectedTime = time
      this.closeTimePicker()
    },
    
    selectLocation(locationId) {
      console.log('selectLocation 被调用:', locationId)
      this.selectedLocation = locationId
    },
    
    toggleTopic(topicId) {
      const index = this.selectedTopics.indexOf(topicId)
      if (index > -1) {
        this.selectedTopics.splice(index, 1)
      } else {
        this.selectedTopics.push(topicId)
      }
    },
    
    submitSchedule() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请完善预约信息',
          icon: 'none'
        })
        return
      }
      
      const scheduleData = {
        advisor: this.advisorInfo.name,
        date: this.selectedDate,
        time: this.selectedTime,
        location: this.locationOptions.find(l => l.id === this.selectedLocation),
        topics: this.selectedTopics.map(id => 
          this.topicOptions.find(t => t.id === id).name
        ),
        remark: this.remark
      }
      
      // 显示确认信息
      const locationName = scheduleData.location.name
      const topicsText = scheduleData.topics.join('、')
      
      uni.showModal({
        title: '确认预约信息',
        content: `客户经理：${scheduleData.advisor}\n面谈时间：${scheduleData.date} ${scheduleData.time}\n面谈地点：${locationName}\n面谈主题：${topicsText}`,
        confirmText: '确认预约',
        cancelText: '修改',
        success: (res) => {
          if (res.confirm) {
            this.submitToServer(scheduleData)
          }
        }
      })
    },
    
    async submitToServer(scheduleData) {
      try {
        uni.showLoading({
          title: '提交中...'
        })
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 保存到本地存储
        const schedules = uni.getStorageSync('meetingSchedules') || []
        schedules.push({
          id: Date.now(),
          ...scheduleData,
          status: 'pending',
          createTime: new Date().toISOString()
        })
        uni.setStorageSync('meetingSchedules', schedules)
        
        uni.hideLoading()
        
        uni.showModal({
          title: '预约成功',
          content: '您的面谈预约已提交，客户经理将在24小时内与您确认具体安排。',
          showCancel: false,
          confirmText: '确定',
          success: () => {
            uni.navigateBack()
          }
        })
        
      } catch (error) {
        uni.hideLoading()
        console.error('提交预约失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.meeting-schedule-page {
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
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 28rpx;
  color: white;
  font-weight: bold;
}

.nav-title {
  font-size: 32rpx;
  color: white;
  font-weight: 600;
}

/* 客户经理信息卡片 */
.advisor-info-card {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.advisor-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.advisor-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #f0f0f0;
}

.advisor-details {
  flex: 1;
}

.advisor-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.advisor-title {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.advisor-rating {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.rating-stars {
  color: #ffd700;
  font-size: 24rpx;
}

.rating-text {
  font-size: 22rpx;
  color: #666;
}

.advisor-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

/* 预约表单 */
.schedule-form {
  margin: 0 30rpx;
}

.form-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

/* 时间选择器 */
.time-selector {
  display: flex;
  gap: 20rpx;
}

.date-picker, .time-picker {
  flex: 1;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-picker:active, .time-picker:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.picker-label {
  font-size: 24rpx;
  color: #666;
}

.picker-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  text-align: center;
}

.picker-arrow {
  font-size: 20rpx;
  color: #999;
}

/* 地点选择 */
.location-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.location-option {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  min-height: 100rpx;
  cursor: pointer;
}

.location-option:active {
  transform: scale(0.98);
}

.location-option.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.location-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.location-address {
  font-size: 22rpx;
  color: #666;
}

.location-status {
  font-size: 24rpx;
  color: #2196f3;
  font-weight: bold;
}

/* 主题选择 */
.topic-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.topic-option {
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  min-height: 60rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topic-option:active {
  transform: scale(0.95);
}

.topic-option.active {
  background: #e8f5e8;
  border-color: #4caf50;
}

.topic-text {
  font-size: 24rpx;
  color: #333;
}

/* 备注输入 */
.remark-input {
  width: 100%;
  min-height: 120rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  box-sizing: border-box;
}

.char-count {
  font-size: 22rpx;
  color: #999;
  text-align: right;
  margin-top: 8rpx;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.submit-btn:disabled {
  background: #ccc;
}

/* 模态框 */
.date-picker-modal, .time-picker-modal {
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
  margin: 40rpx;
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
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  font-size: 32rpx;
  color: #666;
}

/* 日期网格 */
.date-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 16rpx;
}

.date-item {
  width: 120rpx;
  height: 100rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.date-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.date-day {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.date-week {
  font-size: 20rpx;
  color: #666;
}

/* 时间网格 */
.time-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 16rpx;
}

.time-item {
  flex: 1;
  min-width: 200rpx;
  height: 80rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.time-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.time-text {
  font-size: 24rpx;
  color: #333;
}
</style>

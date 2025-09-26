<template>
  <view class="theme-test-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">主题切换测试</text>
      <text class="page-subtitle">测试白天/黑夜主题切换功能</text>
    </view>

    <!-- 主题切换控制 -->
    <view class="theme-controls">
      <view class="control-section">
        <text class="section-title">主题选择</text>
        <view class="theme-buttons">
          <button 
            class="theme-btn" 
            :class="{ active: currentTheme === 'light' }"
            @click="switchTheme('light')"
          >
            ☀️ 白天主题
          </button>
          <button 
            class="theme-btn" 
            :class="{ active: currentTheme === 'dark' }"
            @click="switchTheme('dark')"
          >
            🌙 黑夜主题
          </button>
        </view>
      </view>

      <!-- 主题切换开关 -->
      <view class="control-section">
        <text class="section-title">快速切换</text>
        <view class="theme-switch-container">
          <text class="switch-label">主题切换</text>
          <view class="theme-switch" @click="toggleTheme">
            <view class="theme-switch-track" :class="{ 'active': currentTheme === 'dark' }">
              <view class="theme-switch-thumb"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 主题信息 -->
    <view class="theme-info">
      <text class="section-title">当前主题信息</text>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">当前主题:</text>
          <text class="info-value">{{ currentTheme === 'dark' ? '黑夜主题' : '白天主题' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">切换次数:</text>
          <text class="info-value">{{ switchCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import themeManager from '@/utils/theme.js'
import { useAppStore } from '@/stores/app.js'

export default {
  name: 'ThemeSwitchTest',
  data() {
    return {
      currentTheme: 'light',
      switchCount: 0
    }
  },
  
  onLoad() {
    this.initTheme()
  },
  
  methods: {
    // 初始化主题
    initTheme() {
      try {
        this.currentTheme = themeManager.getCurrentTheme()
        console.log('测试页面初始化主题:', this.currentTheme)
      } catch (error) {
        console.error('初始化主题失败:', error)
      }
    },
    
    // 切换主题
    switchTheme(theme) {
      try {
        if (theme === this.currentTheme) return
        
        // 使用主题管理器切换主题
        themeManager.switchTheme(theme)
        
        // 更新当前主题状态
        this.currentTheme = theme
        
        // 使用应用状态管理更新主题
        const appStore = useAppStore()
        appStore.actions.setTheme(theme)
        
        // 更新统计信息
        this.switchCount++
        
        // 显示切换成功提示
        uni.showToast({
          title: `已切换到${theme === 'dark' ? '黑夜' : '白天'}主题`,
          icon: 'success',
          duration: 1500
        })
        
        console.log('主题已切换:', theme)
      } catch (error) {
        console.error('切换主题失败:', error)
        uni.showToast({
          title: '切换主题失败',
          icon: 'none'
        })
      }
    },
    
    // 快速切换主题
    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.switchTheme(newTheme)
    }
  }
}
</script>

<style scoped>
.theme-test-page {
  min-height: 100vh;
  background: var(--theme-background, #f5f5f5);
  padding: 30rpx;
  transition: background-color 0.3s ease;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: bold;
  color: var(--theme-text-primary, #333);
  display: block;
  margin-bottom: 20rpx;
  transition: color 0.3s ease;
}

.page-subtitle {
  font-size: 28rpx;
  color: var(--theme-text-secondary, #666);
  display: block;
  transition: color 0.3s ease;
}

/* 主题控制区域 */
.theme-controls {
  background: var(--theme-card-background, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.08));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.control-section {
  margin-bottom: 40rpx;
}

.control-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--theme-text-primary, #333);
  display: block;
  margin-bottom: 20rpx;
  transition: color 0.3s ease;
}

/* 主题按钮 */
.theme-buttons {
  display: flex;
  gap: 20rpx;
}

.theme-btn {
  flex: 1;
  padding: 25rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: 2rpx solid var(--theme-border, #e0e0e0);
  background: var(--theme-surface, #ffffff);
  color: var(--theme-text-primary, #333);
  transition: all 0.3s ease;
}

.theme-btn.active {
  background: var(--theme-primary, #4caf50);
  color: #ffffff;
  border-color: var(--theme-primary, #4caf50);
}

/* 主题切换开关 */
.theme-switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  font-size: 30rpx;
  color: var(--theme-text-primary, #333);
  transition: color 0.3s ease;
}

.theme-switch {
  display: flex;
  align-items: center;
}

.theme-switch-track {
  width: 100rpx;
  height: 50rpx;
  background: var(--theme-border, #e0e0e0);
  border-radius: 25rpx;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.theme-switch-track.active {
  background: var(--theme-primary, #4caf50);
}

.theme-switch-thumb {
  width: 44rpx;
  height: 44rpx;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 3rpx;
  left: 3rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 4rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.2));
}

.theme-switch-track.active .theme-switch-thumb {
  transform: translateX(50rpx);
}

/* 主题信息 */
.theme-info {
  background: var(--theme-card-background, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.08));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--theme-border, #f0f0f0);
  transition: border-color 0.3s ease;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: var(--theme-text-secondary, #666);
  transition: color 0.3s ease;
}

.info-value {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--theme-text-primary, #333);
  transition: color 0.3s ease;
}
</style>
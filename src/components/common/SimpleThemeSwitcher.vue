<template>
  <view class="theme-switcher">
    <!-- 主题切换按钮 -->
    <view class="theme-button" @click="showSelector = true">
      <text class="theme-icon">🎨</text>
      <text class="theme-text">主题</text>
    </view>

    <!-- 主题选择弹窗 -->
    <view class="theme-modal" v-if="showSelector" @click="closeModal">
      <view class="modal-content" @click.stop>
        <!-- 弹窗头部 -->
        <view class="modal-header">
          <text class="modal-title">选择主题</text>
          <text class="close-btn" @click="closeModal">×</text>
        </view>

        <!-- 主题列表 -->
        <view class="theme-list">
          <view 
            v-for="theme in availableThemes" 
            :key="theme.id"
            class="theme-item"
            :class="{ active: currentThemeId === theme.id }"
            @click="selectTheme(theme.id)"
          >
            <view class="theme-preview">
              <view class="preview-colors">
                <view 
                  class="color-dot" 
                  :style="{ backgroundColor: theme.colors.primary }"
                ></view>
                <view 
                  class="color-dot" 
                  :style="{ backgroundColor: theme.colors.background }"
                ></view>
                <view 
                  class="color-dot" 
                  :style="{ backgroundColor: theme.colors.surface }"
                ></view>
              </view>
            </view>
            <view class="theme-info">
              <text class="theme-name">{{ theme.name }}</text>
              <text class="theme-status" v-if="currentThemeId === theme.id">当前</text>
            </view>
            <view class="theme-check" v-if="currentThemeId === theme.id">
              <text class="check-icon">✓</text>
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="modal-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="apply-btn" @click="applyTheme">应用</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import themeManager, { themes } from '@/utils/simple-theme.js'

export default {
  name: 'SimpleThemeSwitcher',
  data() {
    return {
      showSelector: false,
      selectedThemeId: null,
      currentThemeId: themeManager.getCurrentThemeId(),
      availableThemes: Object.values(themes)
    }
  },
  mounted() {
    themeManager.addThemeListener(this.onThemeChanged)
  },
  beforeDestroy() {
    themeManager.removeThemeListener(this.onThemeChanged)
  },
  methods: {
    onThemeChanged(theme) {
      this.currentThemeId = theme.id
    },
    
    selectTheme(themeId) {
      this.selectedThemeId = themeId
    },
    
    applyTheme() {
      if (this.selectedThemeId) {
        themeManager.switchTheme(this.selectedThemeId)
        uni.showToast({
          title: '主题已切换',
          icon: 'success',
          duration: 1500
        })
      }
      this.closeModal()
    },
    
    closeModal() {
      this.showSelector = false
      this.selectedThemeId = null
    }
  }
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx;
  cursor: pointer;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.theme-button:active {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(0.95);
}

.theme-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.theme-text {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
}

/* 弹窗样式 */
.theme-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  width: 100%;
  max-width: 500rpx;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  font-weight: bold;
  cursor: pointer;
}

.theme-list {
  padding: 30rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.theme-item {
  display: flex;
  align-items: center;
  padding: 25rpx;
  margin-bottom: 15rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.theme-item:last-child {
  margin-bottom: 0;
}

.theme-item.active {
  border-color: #4caf50;
  background: #f8f9fa;
}

.theme-item:active {
  transform: scale(0.98);
}

.theme-preview {
  margin-right: 20rpx;
}

.preview-colors {
  display: flex;
  flex-direction: column;
}

.color-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  margin-bottom: 6rpx;
  border: 1rpx solid rgba(0, 0, 0, 0.1);
}

.color-dot:last-child {
  margin-bottom: 0;
}

.theme-info {
  flex: 1;
}

.theme-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.theme-status {
  display: block;
  font-size: 22rpx;
  color: #4caf50;
  font-weight: 500;
}

.theme-check {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4caf50;
  border-radius: 50%;
}

.check-icon {
  color: white;
  font-size: 22rpx;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  gap: 15rpx;
  padding: 25rpx 30rpx;
  background: #f8f9fa;
}

.cancel-btn, .apply-btn {
  flex: 1;
  height: 70rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:active {
  background: #e0e0e0;
  transform: scale(0.98);
}

.apply-btn {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.apply-btn:active {
  transform: scale(0.98);
}
</style>

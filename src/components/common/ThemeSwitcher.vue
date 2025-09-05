<template>
  <view class="theme-switcher">
    <!-- 主题切换按钮 -->
    <view class="theme-toggle-btn" @click="showThemeSelector = true">
      <view class="theme-icon">
        <text class="icon">🎨</text>
      </view>
      <text class="theme-text">主题</text>
    </view>

    <!-- 主题选择弹窗 -->
    <view class="theme-selector-modal" v-if="showThemeSelector" @click="closeModal">
      <view class="modal-content" @click.stop>
        <!-- 弹窗头部 -->
        <view class="modal-header">
          <view class="header-title">选择主题</view>
          <view class="close-btn" @click="closeModal">×</view>
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
                  class="color-dot primary" 
                  :style="{ backgroundColor: theme.colors.primary }"
                ></view>
                <view 
                  class="color-dot secondary" 
                  :style="{ backgroundColor: theme.colors.secondary }"
                ></view>
                <view 
                  class="color-dot background" 
                  :style="{ backgroundColor: theme.colors.background }"
                ></view>
              </view>
              <view class="preview-card">
                <view class="card-header" :style="{ background: theme.gradients.primary }"></view>
                <view class="card-content" :style="{ backgroundColor: theme.colors.surface }">
                  <view class="content-line" :style="{ backgroundColor: theme.colors.text }"></view>
                  <view class="content-line short" :style="{ backgroundColor: theme.colors.textSecondary }"></view>
                </view>
              </view>
            </view>
            <view class="theme-info">
              <text class="theme-name">{{ theme.name }}</text>
              <text class="theme-status" v-if="currentThemeId === theme.id">当前主题</text>
            </view>
            <view class="theme-check" v-if="currentThemeId === theme.id">
              <text class="check-icon">✓</text>
            </view>
          </view>
        </view>

        <!-- 弹窗底部 -->
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="apply-btn" @click="applySelectedTheme">应用</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniThemeManager, { themes } from '@/utils/uni-theme.js'
import { getCurrentThemeStyles } from '@/utils/theme-styles.js'

export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      showThemeSelector: false,
      selectedThemeId: null,
      currentThemeId: uniThemeManager.getCurrentThemeId(),
      availableThemes: Object.values(themes),
      currentThemeStyles: getCurrentThemeStyles()
    }
  },
  mounted() {
    // 监听主题变化
    uniThemeManager.addThemeListener(this.onThemeChanged)
  },
  beforeDestroy() {
    // 移除主题监听器
    uniThemeManager.removeThemeListener(this.onThemeChanged)
  },
  methods: {
    // 主题变化回调
    onThemeChanged(theme) {
      this.currentThemeId = theme.id
      this.currentThemeStyles = getCurrentThemeStyles()
    },

    // 选择主题
    selectTheme(themeId) {
      this.selectedThemeId = themeId
    },

    // 应用选中的主题
    applySelectedTheme() {
      if (this.selectedThemeId) {
        uniThemeManager.switchTheme(this.selectedThemeId)
        uni.showToast({
          title: '主题已切换',
          icon: 'success',
          duration: 1500
        })
      }
      this.closeModal()
    },

    // 关闭弹窗
    closeModal() {
      this.showThemeSelector = false
      this.selectedThemeId = null
    }
  }
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12rpx;
}

.theme-toggle-btn:active {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(0.95);
}

.theme-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.icon {
  font-size: 32rpx;
}

.theme-text {
  font-size: 24rpx;
  color: var(--color-textSecondary);
  font-weight: 500;
}

/* 主题选择弹窗 */
.theme-selector-modal {
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
  background: var(--color-surface);
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx var(--color-shadowDark);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 50rpx;
  background: var(--gradient-primary);
  color: white;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 48rpx;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close-btn:active {
  opacity: 0.7;
}

.theme-list {
  padding: 40rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.theme-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid var(--color-border);
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-surface);
}

.theme-item:last-child {
  margin-bottom: 0;
}

.theme-item.active {
  border-color: var(--color-primary);
  background: var(--color-surfaceVariant);
}

.theme-item:active {
  transform: scale(0.98);
}

.theme-preview {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.preview-colors {
  display: flex;
  flex-direction: column;
  margin-right: 20rpx;
}

.color-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
  border: 1rpx solid rgba(0, 0, 0, 0.1);
}

.color-dot:last-child {
  margin-bottom: 0;
}

.preview-card {
  width: 80rpx;
  height: 60rpx;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  height: 20rpx;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.card-content {
  height: 40rpx;
  padding: 8rpx;
  background: var(--color-surface);
}

.content-line {
  height: 4rpx;
  background: var(--color-text);
  border-radius: 2rpx;
  margin-bottom: 4rpx;
}

.content-line.short {
  width: 60%;
  margin-bottom: 0;
}

.theme-info {
  flex: 1;
}

.theme-name {
  display: block;
  font-size: 28rpx;
  color: var(--color-text);
  font-weight: 500;
  margin-bottom: 8rpx;
}

.theme-status {
  display: block;
  font-size: 24rpx;
  color: var(--color-primary);
  font-weight: 500;
}

.theme-check {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: 50%;
}

.check-icon {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx 40rpx;
  background: #f8f9fa;
}

.cancel-btn, .apply-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: var(--color-surfaceVariant);
  color: var(--color-textSecondary);
}

.cancel-btn:active {
  background: var(--color-border);
  transform: scale(0.98);
}

.apply-btn {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4rpx 12rpx var(--color-shadowDark);
}

.apply-btn:active {
  transform: scale(0.98);
}
</style>

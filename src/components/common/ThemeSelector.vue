<template>
  <view class="theme-selector">
    <view class="theme-header">
      <text class="theme-title">主题设置</text>
      <text class="theme-subtitle">选择您喜欢的主题风格</text>
    </view>
    
    <view class="theme-options">
      <view 
        v-for="theme in themeList" 
        :key="theme.key"
        class="theme-option"
        :class="{ active: theme.isActive }"
        @click="selectTheme(theme.key)"
      >
        <view class="theme-option-left">
          <text class="theme-option-icon">{{ theme.icon }}</text>
          <text class="theme-option-name">{{ theme.name }}</text>
        </view>
        <view class="theme-option-right">
          <view class="theme-radio" :class="{ checked: theme.isActive }">
            <view v-if="theme.isActive" class="theme-radio-dot"></view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="theme-preview">
      <text class="preview-title">预览效果</text>
      <view class="preview-card" :class="getThemeClass()" :style="getThemeStyle()">
        <view class="preview-header">
          <text class="preview-text">示例卡片</text>
        </view>
        <view class="preview-content">
          <text class="preview-text">这是主题预览效果</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import themeManager from '@/utils/theme.js'

export default {
  name: 'ThemeSelector',
  data() {
    return {
      currentTheme: themeManager.getCurrentTheme(),
      themeColors: themeManager.getThemeConfig(themeManager.getCurrentTheme()).colors
    }
  },
  computed: {
    themeList() {
      return themeManager.getThemeList()
    }
  },
  mounted() {
    // 监听主题变化
    themeManager.addListener(this.updateTheme)
  },
  beforeDestroy() {
    // 移除监听器
    themeManager.removeListener(this.updateTheme)
  },
  methods: {
    selectTheme(themeKey) {
      themeManager.setTheme(themeKey)
    },
    updateTheme(theme) {
      this.currentTheme = theme
      this.themeColors = themeManager.getThemeConfig(theme).colors
    },
    getThemeClass() {
      return `theme-${this.currentTheme}`
    },
    getThemeStyle() {
      return {
        '--theme-primary': this.themeColors.primary,
        '--theme-secondary': this.themeColors.secondary,
        '--theme-background': this.themeColors.background,
        '--theme-card-background': this.themeColors.cardBackground,
        '--theme-text-color': this.themeColors.textColor,
        '--theme-text-secondary': this.themeColors.textSecondary,
        '--theme-border-color': this.themeColors.borderColor,
        '--theme-shadow-color': this.themeColors.shadowColor
      }
    }
  }
}
</script>

<style scoped>
.theme-selector {
  padding: 40rpx;
  background: var(--theme-background, #f5f5f5);
  min-height: 100vh;
}

.theme-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.theme-title {
  font-size: 48rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 16rpx;
}

.theme-subtitle {
  font-size: 28rpx;
  color: var(--theme-text-secondary, #666666);
}

.theme-options {
  margin-bottom: 60rpx;
}

.theme-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--theme-card-background, #ffffff);
  border: 2rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.theme-option:hover {
  border-color: var(--theme-primary, #0066B2);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
}

.theme-option.active {
  border-color: var(--theme-primary, #0066B2);
  background: rgba(0, 102, 178, 0.05);
}

.theme-option-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.theme-option-icon {
  font-size: 48rpx;
}

.theme-option-name {
  font-size: 32rpx;
  font-weight: 500;
  color: var(--theme-text-color, #333333);
}

.theme-option-right {
  display: flex;
  align-items: center;
}

.theme-radio {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-radio.checked {
  border-color: var(--theme-primary, #0066B2);
  background: var(--theme-primary, #0066B2);
}

.theme-radio-dot {
  width: 16rpx;
  height: 16rpx;
  background: white;
  border-radius: 50%;
}

.theme-preview {
  margin-top: 40rpx;
}

.preview-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 24rpx;
}

.preview-card {
  background: var(--theme-card-background, #ffffff);
  border: 2rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.preview-header {
  margin-bottom: 16rpx;
}

.preview-content {
  margin-bottom: 16rpx;
}

.preview-text {
  color: var(--theme-text-color, #333333);
  font-size: 28rpx;
}

/* 暗黑主题样式 */
.theme-dark .theme-selector,
.dark .theme-selector {
  background: var(--theme-background, #0A0A0A);
}

.theme-dark .theme-title,
.dark .theme-title {
  color: var(--theme-text-color, #FAFAFA);
}

.theme-dark .theme-subtitle,
.dark .theme-subtitle {
  color: var(--theme-text-secondary, #A1A1AA);
}

.theme-dark .theme-option,
.dark .theme-option {
  background: var(--theme-card-background, #161616);
  border-color: var(--theme-border-color, #000000);
}

.theme-dark .theme-option:hover,
.dark .theme-option:hover {
  border-color: var(--theme-primary, #6366F1);
  box-shadow: var(--theme-shadow-md, 0 4rpx 12rpx rgba(0, 0, 0, 0.9));
}

.theme-dark .theme-option.active,
.dark .theme-option.active {
  border-color: var(--theme-primary, #6366F1);
  background: rgba(99, 102, 241, 0.1);
}

.theme-dark .theme-option-name,
.dark .theme-option-name {
  color: var(--theme-text-color, #FAFAFA);
}

.theme-dark .theme-radio,
.dark .theme-radio {
  border-color: var(--theme-border-color, #000000);
}

.theme-dark .theme-radio.checked,
.dark .theme-radio.checked {
  border-color: var(--theme-primary, #6366F1);
  background: var(--theme-primary, #6366F1);
}

.theme-dark .preview-title,
.dark .preview-title {
  color: var(--theme-text-color, #FAFAFA);
}

.theme-dark .preview-card,
.dark .preview-card {
  background: var(--theme-card-background, #161616);
  border-color: var(--theme-border-color, #000000);
  box-shadow: var(--theme-shadow-md, 0 4rpx 12rpx rgba(0, 0, 0, 0.9));
}

.theme-dark .preview-text,
.dark .preview-text {
  color: var(--theme-text-color, #FAFAFA);
}
</style>

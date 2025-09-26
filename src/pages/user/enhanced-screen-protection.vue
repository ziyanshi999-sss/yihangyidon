<template>
  <view class="enhanced-screen-protection-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-icon">←</text>
      </view>
      <view class="nav-title">隐私保护设置</view>
      <view class="nav-right">
        <text class="nav-icon" @click="showHelp">❓</text>
      </view>
    </view>

    <!-- 保护状态卡片 -->
    <view class="status-card card">
      <view class="status-header">
        <view class="status-icon" :class="{ active: protectionStatus.isEnabled }">
          <text class="icon">🛡️</text>
        </view>
        <view class="status-info">
          <text class="status-title">防录屏保护</text>
          <text class="status-subtitle">
            {{ protectionStatus.isEnabled ? "已启用" : "已禁用" }}
          </text>
        </view>
        <switch
          :checked="protectionStatus.isEnabled"
          @change="toggleProtection"
          color="#667eea"
        />
      </view>

      <view class="status-details" v-if="protectionStatus.isEnabled">
        <view class="detail-item">
          <text class="detail-label">防护级别</text>
          <text class="detail-value">{{ getLevelText(protectionStatus.protectionLevel) }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">当前平台</text>
          <text class="detail-value">{{ getPlatformText(protectionStatus.platform) }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">运行环境</text>
          <text class="detail-value">{{ getEnvironmentText(protectionStatus.environment) }}</text>
        </view>
      </view>
    </view>

    <!-- 防护设置 -->
    <view class="settings-section">
      <view class="section-title">防护设置</view>
      
      <!-- 防护级别 -->
      <view class="setting-item card" @click="showLevelSelector">
        <view class="setting-info">
          <text class="setting-title">防护级别</text>
          <text class="setting-desc">控制防护功能的严格程度</text>
        </view>
        <view class="setting-value">
          <text class="value-text">{{ getLevelText(currentSettings.level) }}</text>
          <text class="arrow">→</text>
        </view>
      </view>

      <!-- 警告提示 -->
      <view class="setting-item card">
        <view class="setting-info">
          <text class="setting-title">警告提示</text>
          <text class="setting-desc">检测到可疑行为时显示警告</text>
        </view>
        <switch
          :checked="currentSettings.showAlert"
          @change="toggleAlert"
          color="#667eea"
        />
      </view>

      <!-- 水印保护 -->
      <view class="setting-item card">
        <view class="setting-info">
          <text class="setting-title">水印保护</text>
          <text class="setting-desc">{{ currentSettings.showWatermark ? '已启用' : '已禁用' }}, 保持页面美观</text>
        </view>
        <switch
          :checked="currentSettings.showWatermark"
          @change="toggleWatermark"
          color="#667eea"
        />
      </view>

      <!-- 水印设置 -->
      <view class="watermark-settings" v-if="currentSettings.showWatermark">
        <view class="setting-item card">
          <view class="setting-info">
            <text class="setting-title">水印文本</text>
            <text class="setting-desc">自定义水印显示内容</text>
          </view>
          <input
            v-model="currentSettings.watermarkText"
            @blur="saveSettings"
            class="watermark-input"
            placeholder="请输入水印文本"
          />
        </view>
        
        <view class="setting-item card">
          <view class="setting-info">
            <text class="setting-title">水印透明度</text>
            <text class="setting-desc">调整水印的可见程度</text>
          </view>
          <view class="slider-container">
            <slider
              :value="currentSettings.watermarkOpacity * 100"
              @change="onOpacityChange"
              min="10"
              max="80"
              step="10"
              activeColor="#667eea"
              backgroundColor="#e0e0e0"
            />
            <text class="slider-value">{{ Math.round(currentSettings.watermarkOpacity * 100) }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 安全记录 -->
    <view class="security-section">
      <view class="section-title">安全记录 ({{ securityLogs.length }})</view>
      
      <view class="setting-item card" @click="viewSecurityLogs">
        <view class="setting-info">
          <text class="setting-title">查看安全事件</text>
          <text class="setting-desc">最近记录: {{ getLatestRecord() }}</text>
        </view>
        <text class="arrow">→</text>
      </view>

      <view class="action-buttons">
        <button class="action-btn secondary" @click="clearLogs">清除记录</button>
        <button class="action-btn primary" @click="exportLogs">导出记录</button>
      </view>
    </view>

    <!-- 高级设置 -->
    <view class="advanced-section">
      <view class="section-title">高级设置</view>
      
      <view class="setting-item card" @click="showExcludePages">
        <view class="setting-info">
          <text class="setting-title">排除页面</text>
          <text class="setting-desc">设置不需要保护的页面</text>
        </view>
        <text class="arrow">→</text>
      </view>

      <view class="setting-item card" @click="testProtection">
        <view class="setting-info">
          <text class="setting-title">测试保护</text>
          <text class="setting-desc">测试防录屏功能是否正常</text>
        </view>
        <text class="arrow">→</text>
      </view>
    </view>

    <!-- 帮助说明 -->
    <view class="help-section">
      <view class="section-title">帮助说明</view>
      <view class="help-content card">
        <text class="help-text">• 防录屏保护可以有效防止他人截屏或录屏您的敏感信息</text>
        <text class="help-text">• 建议在查看重要信息时启用此功能</text>
        <text class="help-text">• 水印功能可以在页面上添加半透明标识</text>
        <text class="help-text">• 所有安全事件都会被记录，您可以随时查看</text>
      </view>
    </view>

    <!-- 防护级别选择器 -->
    <view class="level-selector" v-if="showLevelModal" @click="hideLevelSelector">
      <view class="selector-content" @click.stop>
        <view class="selector-header">
          <text class="selector-title">选择防护级别</text>
          <text class="selector-close" @click="hideLevelSelector">✕</text>
        </view>
        <view class="level-options">
          <view 
            class="level-option" 
            :class="{ active: currentSettings.level === 'low' }"
            @click="selectLevel('low')"
          >
            <view class="level-info">
              <text class="level-name">基础防护</text>
              <text class="level-desc">基本的截屏检测</text>
            </view>
            <text class="level-icon">🟢</text>
          </view>
          <view 
            class="level-option" 
            :class="{ active: currentSettings.level === 'medium' }"
            @click="selectLevel('medium')"
          >
            <view class="level-info">
              <text class="level-name">标准防护</text>
              <text class="level-desc">截屏检测 + 录屏检测</text>
            </view>
            <text class="level-icon">🟡</text>
          </view>
          <view 
            class="level-option" 
            :class="{ active: currentSettings.level === 'high' }"
            @click="selectLevel('high')"
          >
            <view class="level-info">
              <text class="level-name">高级防护</text>
              <text class="level-desc">全面保护 + 水印 + 警告</text>
            </view>
            <text class="level-icon">🔴</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EnhancedScreenProtection',
  data() {
    return {
      protectionStatus: {
        isEnabled: false,
        platform: '',
        environment: '',
        protectionLevel: 'medium'
      },
      currentSettings: {
        level: 'medium',
        showAlert: true,
        showWatermark: false,
        watermarkText: '银行APP - 隐私保护中',
        watermarkOpacity: 0.3,
        watermarkSize: 14,
        watermarkColor: '#999999',
        alertTitle: '安全提醒',
        alertContent: '检测到截屏/录屏行为，请注意保护您的隐私信息。',
        excludePages: ['/pages/denglu/login', '/pages/register/register']
      },
      securityLogs: [],
      showLevelModal: false,
      isLoading: false
    }
  },

  onLoad() {
    this.loadSettings()
    this.loadProtectionStatus()
    this.loadSecurityLogs()
  },

  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 显示帮助
    showHelp() {
      uni.showModal({
        title: '使用帮助',
        content: '防录屏保护功能可以防止他人截屏或录屏您的敏感信息。建议在查看重要信息时启用此功能。',
        showCancel: false
      })
    },

    // 加载设置
    loadSettings() {
      try {
        const savedSettings = uni.getStorageSync('screenProtectionSettings')
        if (savedSettings) {
          this.currentSettings = { ...this.currentSettings, ...savedSettings }
        }
        console.log('已加载用户设置:', this.currentSettings)
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    },

    // 保存设置
    saveSettings() {
      try {
        uni.setStorageSync('screenProtectionSettings', this.currentSettings)
        console.log('设置已保存:', this.currentSettings)
      } catch (error) {
        console.error('保存设置失败:', error)
      }
    },

    // 加载保护状态
    loadProtectionStatus() {
      try {
        if (this.$getScreenProtectionStatus) {
          this.protectionStatus = this.$getScreenProtectionStatus()
        }
      } catch (error) {
        console.error('加载保护状态失败:', error)
      }
    },

    // 加载安全日志
    loadSecurityLogs() {
      try {
        if (this.$getSecurityLogs) {
          this.securityLogs = this.$getSecurityLogs(50)
        }
      } catch (error) {
        console.error('加载安全日志失败:', error)
      }
    },

    // 切换保护状态
    async toggleProtection(e) {
      const enabled = e.detail.value

      try {
        this.isLoading = true

        if (enabled) {
          if (typeof this.$enableScreenProtection === 'function') {
            const success = await this.$enableScreenProtection(this.currentSettings)
            if (success) {
              this.protectionStatus.isEnabled = true
              uni.showToast({
                title: '防护已启用',
                icon: 'success'
              })
            } else {
              uni.showToast({
                title: '启用失败',
                icon: 'error'
              })
            }
          } else {
            console.log('防录屏功能暂不可用')
            uni.showToast({
              title: '功能暂不可用',
              icon: 'none'
            })
          }
        } else {
          if (typeof this.$disableScreenProtection === 'function') {
            const success = await this.$disableScreenProtection()
            if (success) {
              this.protectionStatus.isEnabled = false
              uni.showToast({
                title: '防护已禁用',
                icon: 'success'
              })
            }
          }
        }

        this.saveSettings()
        this.loadProtectionStatus()
      } catch (error) {
        console.error('切换保护状态失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 切换警告提示
    toggleAlert(e) {
      this.currentSettings.showAlert = e.detail.value
      this.saveSettings()
    },

    // 切换水印
    toggleWatermark(e) {
      this.currentSettings.showWatermark = e.detail.value
      this.saveSettings()
    },

    // 透明度变化
    onOpacityChange(e) {
      this.currentSettings.watermarkOpacity = e.detail.value / 100
      this.saveSettings()
    },

    // 显示级别选择器
    showLevelSelector() {
      this.showLevelModal = true
    },

    // 隐藏级别选择器
    hideLevelSelector() {
      this.showLevelModal = false
    },

    // 选择级别
    selectLevel(level) {
      this.currentSettings.level = level
      this.saveSettings()
      this.hideLevelSelector()
      
      // 如果保护已启用，重新启用以应用新设置
      if (this.protectionStatus.isEnabled) {
        this.toggleProtection({ detail: { value: true } })
      }
    },

    // 查看安全日志
    viewSecurityLogs() {
      uni.navigateTo({
        url: '/pages/user/security-logs'
      })
    },

    // 清除日志
    clearLogs() {
      uni.showModal({
        title: '清除记录',
        content: '确定要清除所有安全记录吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            if (this.$clearSecurityLogs) {
              const success = this.$clearSecurityLogs()
              if (success) {
                this.securityLogs = []
                uni.showToast({
                  title: '记录已清除',
                  icon: 'success'
                })
              }
            }
          }
        }
      })
    },

    // 导出日志
    exportLogs() {
      if (this.$exportSecurityLogs) {
        const success = this.$exportSecurityLogs()
        if (success) {
          uni.showToast({
            title: '导出成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '导出失败',
            icon: 'error'
          })
        }
      }
    },

    // 显示排除页面
    showExcludePages() {
      uni.showModal({
        title: '排除页面',
        content: '当前排除的页面：\n' + this.currentSettings.excludePages.join('\n'),
        showCancel: false
      })
    },

    // 测试保护
    testProtection() {
      uni.showModal({
        title: '测试保护',
        content: '请尝试截屏或录屏，测试防录屏功能是否正常工作。',
        success: (res) => {
          if (res.confirm) {
            // 模拟触发保护
            if (this.$screenProtector) {
              this.$screenProtector.handleSuspiciousActivity('test')
            }
          }
        }
      })
    },

    // 获取级别文本
    getLevelText(level) {
      const levelMap = {
        low: '基础防护',
        medium: '标准防护',
        high: '高级防护'
      }
      return levelMap[level] || '未知'
    },

    // 获取平台文本
    getPlatformText(platform) {
      const platformMap = {
        android: 'Android',
        ios: 'iOS',
        windows: 'Windows',
        mac: 'macOS',
        unknown: '未知'
      }
      return platformMap[platform] || '未知'
    },

    // 获取环境文本
    getEnvironmentText(environment) {
      const envMap = {
        h5: 'H5浏览器',
        app: 'App应用',
        'mp-weixin': '微信小程序',
        unknown: '未知'
      }
      return envMap[environment] || '未知'
    },

    // 获取最新记录
    getLatestRecord() {
      if (this.securityLogs.length === 0) {
        return '暂无记录'
      }
      const latest = this.securityLogs[0]
      const time = new Date(latest.timestamp).toLocaleString()
      return time
    }
  }
}
</script>

<style scoped>
.enhanced-screen-protection-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back-icon, .nav-icon {
  font-size: 40rpx;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

/* 状态卡片 */
.status-card {
  margin-top: 20rpx;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.status-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-icon.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-icon .icon {
  font-size: 40rpx;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.status-subtitle {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.status-details {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

/* 设置项 */
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin: 40rpx 30rpx 20rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.setting-item:active {
  transform: scale(0.98);
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

.setting-desc {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.value-text {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.arrow {
  font-size: 24rpx;
  color: #999;
}

/* 水印设置 */
.watermark-settings {
  margin-top: 20rpx;
}

.watermark-input {
  background: #f8f9fa;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  width: 300rpx;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 300rpx;
}

.slider-value {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
  min-width: 60rpx;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1rpx solid #e0e0e0;
}

/* 帮助内容 */
.help-content {
  margin-top: 20rpx;
}

.help-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.help-text:last-child {
  margin-bottom: 0;
}

/* 级别选择器 */
.level-selector {
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

.selector-content {
  background: white;
  border-radius: 20rpx;
  margin: 60rpx;
  max-height: 80vh;
  overflow: hidden;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.selector-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.selector-close {
  font-size: 32rpx;
  color: #999;
  padding: 10rpx;
}

.level-options {
  padding: 20rpx 0;
}

.level-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.level-option:active {
  background: #f8f9fa;
}

.level-option.active {
  background: #f0f4ff;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

.level-desc {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.level-icon {
  font-size: 32rpx;
}
</style>

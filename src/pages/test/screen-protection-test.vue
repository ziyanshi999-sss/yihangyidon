<template>
  <view class="screen-protection-test">
    <view class="header">
      <text class="title">🛡️ 防录屏功能测试</text>
      <text class="subtitle">测试和调试防录屏功能</text>
    </view>

    <!-- 保护状态 -->
    <view class="status-card">
      <view class="status-header">
        <text class="status-title">保护状态</text>
        <view class="status-indicator" :class="{ active: protectionStatus.isEnabled }">
          <text class="status-text">{{ protectionStatus.isEnabled ? '已启用' : '已禁用' }}</text>
        </view>
      </view>
      
      <view class="status-info">
        <text class="info-item">平台: {{ protectionStatus.platform }}</text>
        <text class="info-item">环境: {{ protectionStatus.environment }}</text>
        <text class="info-item">方法: {{ protectionStatus.protectionMethod }}</text>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="control-section">
      <view class="section-title">控制面板</view>
      
      <view class="button-group">
        <button class="control-btn primary" @click="enableProtection">
          <text class="btn-icon">🛡️</text>
          <text class="btn-text">启用保护</text>
        </button>
        
        <button class="control-btn danger" @click="disableProtection">
          <text class="btn-icon">🔓</text>
          <text class="btn-text">禁用保护</text>
        </button>
      </view>

      <view class="button-group">
        <button class="control-btn secondary" @click="testNativePlugin">
          <text class="btn-icon">🧪</text>
          <text class="btn-text">测试原生插件</text>
        </button>
        
        <button class="control-btn secondary" @click="detectSecurityThreats">
          <text class="btn-icon">🔍</text>
          <text class="btn-text">安全威胁检测</text>
        </button>
      </view>

      <view class="button-group">
        <button class="control-btn warning" @click="simulateScreenshot">
          <text class="btn-icon">📸</text>
          <text class="btn-text">模拟截屏</text>
        </button>
        
        <button class="control-btn warning" @click="simulateRecording">
          <text class="btn-icon">📹</text>
          <text class="btn-text">模拟录屏</text>
        </button>
      </view>
    </view>

    <!-- 配置选项 -->
    <view class="config-section">
      <view class="section-title">配置选项</view>
      
      <view class="config-item">
        <text class="config-label">严格模式</text>
        <switch :checked="config.strictMode" @change="updateConfig('strictMode', $event.detail.value)" />
      </view>
      
      <view class="config-item">
        <text class="config-label">调试模式</text>
        <switch :checked="config.debugMode" @change="updateConfig('debugMode', $event.detail.value)" />
      </view>
      
      <view class="config-item">
        <text class="config-label">检测间隔: {{ config.detectionInterval }}ms</text>
        <slider 
          :value="config.detectionInterval" 
          min="1000" 
          max="10000" 
          step="500"
          @change="updateConfig('detectionInterval', $event.detail.value)"
          activeColor="#007AFF"
        />
      </view>
    </view>

    <!-- 事件日志 -->
    <view class="log-section">
      <view class="section-header">
        <text class="section-title">事件日志</text>
        <button class="clear-btn" @click="clearLogs">
          <text class="btn-text">清空</text>
        </button>
      </view>
      
      <scroll-view class="log-container" scroll-y>
        <view 
          v-for="(log, index) in eventLogs" 
          :key="index" 
          class="log-item"
          :class="log.type"
        >
          <view class="log-header">
            <text class="log-time">{{ formatTime(log.timestamp) }}</text>
            <text class="log-type">{{ getLogTypeText(log.type) }}</text>
          </view>
          <text class="log-message">{{ log.message }}</text>
          <text class="log-details" v-if="log.details">{{ log.details }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 安全事件统计 -->
    <view class="stats-section">
      <view class="section-title">安全事件统计</view>
      
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ stats.screenshotCount }}</text>
          <text class="stat-label">截屏事件</text>
        </view>
        
        <view class="stat-item">
          <text class="stat-number">{{ stats.recordingCount }}</text>
          <text class="stat-label">录屏事件</text>
        </view>
        
        <view class="stat-item">
          <text class="stat-number">{{ stats.totalEvents }}</text>
          <text class="stat-label">总事件数</text>
        </view>
        
        <view class="stat-item">
          <text class="stat-number">{{ stats.riskLevel }}</text>
          <text class="stat-label">风险等级</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import unifiedScreenProtector from '@/utils/unified-screen-protector.js'
import mobileScreenProtector from '@/utils/mobile-screen-protector.js'

export default {
  data() {
    return {
      protectionStatus: {
        isEnabled: false,
        platform: 'unknown',
        environment: 'unknown',
        protectionMethod: 'none'
      },
      config: {
        strictMode: false,
        debugMode: true,
        detectionInterval: 2000
      },
      eventLogs: [],
      stats: {
        screenshotCount: 0,
        recordingCount: 0,
        totalEvents: 0,
        riskLevel: 'LOW'
      }
    }
  },

  onLoad() {
    this.initProtection()
    this.loadSecurityEvents()
  },

  onUnload() {
    this.cleanup()
  },

  methods: {
    /**
     * 初始化防录屏保护
     */
    async initProtection() {
      try {
        // 获取当前状态
        this.protectionStatus = unifiedScreenProtector.getStatus()
        
        // 设置事件监听
        unifiedScreenProtector.on('onScreenshotDetected', (data) => {
          this.handleScreenshotDetected(data)
        })
        
        unifiedScreenProtector.on('onRecordingDetected', (data) => {
          this.handleRecordingDetected(data)
        })
        
        unifiedScreenProtector.on('onProtectionEnabled', (data) => {
          this.addLog('protection_enabled', '防录屏保护已启用', JSON.stringify(data))
          this.updateStatus()
        })
        
        unifiedScreenProtector.on('onProtectionDisabled', (data) => {
          this.addLog('protection_disabled', '防录屏保护已禁用', JSON.stringify(data))
          this.updateStatus()
        })
        
        this.addLog('init', '防录屏测试页面初始化完成')
        
      } catch (error) {
        console.error('初始化防录屏保护失败:', error)
        this.addLog('error', '初始化失败: ' + error.message)
      }
    },

    /**
     * 启用保护
     */
    async enableProtection() {
      try {
        this.addLog('action', '正在启用防录屏保护...')
        
        const result = await unifiedScreenProtector.enable({
          level: 'high',
          showAlert: true,
          showWatermark: false
        })
        
        if (result) {
          this.addLog('success', '防录屏保护启用成功')
          this.updateStatus()
        } else {
          this.addLog('error', '防录屏保护启用失败')
        }
        
      } catch (error) {
        console.error('启用防录屏保护失败:', error)
        this.addLog('error', '启用失败: ' + error.message)
      }
    },

    /**
     * 禁用保护
     */
    disableProtection() {
      try {
        this.addLog('action', '正在禁用防录屏保护...')
        
        const result = unifiedScreenProtector.disable()
        
        if (result) {
          this.addLog('success', '防录屏保护禁用成功')
          this.updateStatus()
        } else {
          this.addLog('error', '防录屏保护禁用失败')
        }
        
      } catch (error) {
        console.error('禁用防录屏保护失败:', error)
        this.addLog('error', '禁用失败: ' + error.message)
      }
    },

    /**
     * 测试原生插件
     */
    async testNativePlugin() {
      try {
        this.addLog('action', '正在测试原生插件...')
        
        if (typeof uni !== 'undefined' && uni.requireNativePlugin) {
          const ScreenProtector = uni.requireNativePlugin('ScreenProtector')
          
          if (ScreenProtector) {
            const result = await new Promise((resolve) => {
              ScreenProtector.testPlugin(resolve)
            })
            
            if (result && result.success) {
              this.addLog('success', '原生插件测试成功', JSON.stringify(result))
            } else {
              this.addLog('error', '原生插件测试失败', JSON.stringify(result))
            }
          } else {
            this.addLog('error', '无法加载原生插件')
          }
        } else {
          this.addLog('error', '原生插件环境不可用')
        }
        
      } catch (error) {
        console.error('测试原生插件失败:', error)
        this.addLog('error', '测试失败: ' + error.message)
      }
    },

    /**
     * 检测安全威胁
     */
    async detectSecurityThreats() {
      try {
        this.addLog('action', '正在检测安全威胁...')
        
        if (typeof uni !== 'undefined' && uni.requireNativePlugin) {
          const ScreenProtector = uni.requireNativePlugin('ScreenProtector')
          
          if (ScreenProtector) {
            const result = await new Promise((resolve) => {
              ScreenProtector.detectSecurityThreats(resolve)
            })
            
            if (result && result.success) {
              this.addLog('success', '安全威胁检测完成', JSON.stringify(result))
              this.updateSecurityStats(result.securityChecks)
            } else {
              this.addLog('error', '安全威胁检测失败', JSON.stringify(result))
            }
          } else {
            this.addLog('error', '无法加载原生插件')
          }
        } else {
          this.addLog('error', '原生插件环境不可用')
        }
        
      } catch (error) {
        console.error('检测安全威胁失败:', error)
        this.addLog('error', '检测失败: ' + error.message)
      }
    },

    /**
     * 模拟截屏
     */
    simulateScreenshot() {
      this.addLog('action', '模拟截屏事件...')
      this.handleScreenshotDetected({ method: 'simulation' })
    },

    /**
     * 模拟录屏
     */
    simulateRecording() {
      this.addLog('action', '模拟录屏事件...')
      this.handleRecordingDetected({ method: 'simulation' })
    },

    /**
     * 更新配置
     */
    updateConfig(key, value) {
      this.config[key] = value
      this.addLog('config', `配置已更新: ${key} = ${value}`)
      
      // 如果保护已启用，重新启用以应用新配置
      if (this.protectionStatus.isEnabled) {
        this.enableProtection()
      }
    },

    /**
     * 处理截屏检测
     */
    handleScreenshotDetected(data) {
      this.stats.screenshotCount++
      this.stats.totalEvents++
      this.addLog('screenshot', '检测到截屏行为', JSON.stringify(data))
    },

    /**
     * 处理录屏检测
     */
    handleRecordingDetected(data) {
      this.stats.recordingCount++
      this.stats.totalEvents++
      this.addLog('recording', '检测到录屏行为', JSON.stringify(data))
    },

    /**
     * 更新状态
     */
    updateStatus() {
      this.protectionStatus = unifiedScreenProtector.getStatus()
    },

    /**
     * 更新安全统计
     */
    updateSecurityStats(securityChecks) {
      if (securityChecks) {
        this.stats.riskLevel = securityChecks.riskLevel || 'UNKNOWN'
      }
    },

    /**
     * 添加日志
     */
    addLog(type, message, details = '') {
      const log = {
        type,
        message,
        details,
        timestamp: Date.now()
      }
      
      this.eventLogs.unshift(log)
      
      // 限制日志数量
      if (this.eventLogs.length > 100) {
        this.eventLogs = this.eventLogs.slice(0, 100)
      }
    },

    /**
     * 清空日志
     */
    clearLogs() {
      this.eventLogs = []
      this.addLog('action', '日志已清空')
    },

    /**
     * 加载安全事件
     */
    loadSecurityEvents() {
      try {
        const events = uni.getStorageSync('security_events') || []
        this.stats.totalEvents = events.length
        this.stats.screenshotCount = events.filter(e => e.type === 'screenshot').length
        this.stats.recordingCount = events.filter(e => e.type === 'recording').length
      } catch (error) {
        console.error('加载安全事件失败:', error)
      }
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    },

    /**
     * 获取日志类型文本
     */
    getLogTypeText(type) {
      const typeMap = {
        'screenshot': '📸 截屏',
        'recording': '📹 录屏',
        'protection_enabled': '🛡️ 启用',
        'protection_disabled': '🔓 禁用',
        'action': '⚡ 操作',
        'success': '✅ 成功',
        'error': '❌ 错误',
        'config': '⚙️ 配置',
        'init': '🚀 初始化'
      }
      return typeMap[type] || '📝 信息'
    },

    /**
     * 清理资源
     */
    cleanup() {
      // 移除事件监听
      unifiedScreenProtector.off('onScreenshotDetected')
      unifiedScreenProtector.off('onRecordingDetected')
      unifiedScreenProtector.off('onProtectionEnabled')
      unifiedScreenProtector.off('onProtectionDisabled')
    }
  }
}
</script>

<style scoped>
.screen-protection-test {
  padding: 20rpx;
  background: #f5f7fb;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.status-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.status-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.status-indicator {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  background: #f0f0f0;
}

.status-indicator.active {
  background: #e8f5e8;
}

.status-text {
  font-size: 24rpx;
  color: #666;
}

.status-indicator.active .status-text {
  color: #52c41a;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-item {
  font-size: 24rpx;
  color: #666;
}

.control-section, .config-section, .log-section, .stats-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.button-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 24rpx;
}

.control-btn.primary {
  background: #007AFF;
  color: #fff;
}

.control-btn.danger {
  background: #ff4444;
  color: #fff;
}

.control-btn.secondary {
  background: #f0f0f0;
  color: #333;
}

.control-btn.warning {
  background: #ff9500;
  color: #fff;
}

.btn-icon {
  margin-right: 10rpx;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.config-item:last-child {
  border-bottom: none;
}

.config-label {
  font-size: 24rpx;
  color: #333;
}

.clear-btn {
  padding: 10rpx 20rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  border: none;
  font-size: 22rpx;
  color: #666;
}

.log-container {
  height: 400rpx;
  border: 1rpx solid #f0f0f0;
  border-radius: 12rpx;
  padding: 20rpx;
}

.log-item {
  padding: 15rpx;
  margin-bottom: 15rpx;
  border-radius: 8rpx;
  border-left: 4rpx solid #ddd;
}

.log-item.screenshot {
  background: #fff2f0;
  border-left-color: #ff4d4f;
}

.log-item.recording {
  background: #fff7e6;
  border-left-color: #faad14;
}

.log-item.success {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.log-item.error {
  background: #fff2f0;
  border-left-color: #ff4d4f;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.log-time {
  font-size: 20rpx;
  color: #999;
}

.log-type {
  font-size: 20rpx;
  font-weight: 600;
}

.log-message {
  display: block;
  font-size: 24rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.log-details {
  display: block;
  font-size: 20rpx;
  color: #666;
  font-family: monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #007AFF;
  margin-bottom: 8rpx;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: #666;
}
</style>


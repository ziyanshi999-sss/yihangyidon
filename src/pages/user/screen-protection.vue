<template>
  <view class="screen-protection-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-icon">←</text>
      </view>
      <view class="nav-title">隐私保护设置</view>
      <view class="nav-right"></view>
    </view>

    <!-- 保护状态卡片 -->
    <view class="status-card card">
      <view class="status-header">
        <view
          class="status-icon"
          :class="{ active: protectionStatus.isEnabled }"
        >
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
          <text class="detail-value">{{
            getLevelText(protectionStatus.protectionLevel)
          }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">当前平台</text>
          <text class="detail-value">{{
            getPlatformText(protectionStatus.platform)
          }}</text>
        </view>
      </view>
    </view>

    <!-- 设置选项 -->
    <view class="settings-section">
      <view class="section-title">防护设置</view>

      <!-- 防护级别 -->
      <view class="setting-card card">
        <view class="setting-header" @click="showLevelPicker">
          <view class="setting-info">
            <text class="setting-title">防护级别</text>
            <text class="setting-subtitle">控制防护功能的严格程度</text>
          </view>
          <view class="setting-value">
            <text>{{ getLevelText(currentLevel) }}</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>

      <!-- 警告提示 -->
      <view class="setting-card card">
        <view class="setting-header">
          <view class="setting-info">
            <text class="setting-title">警告提示</text>
            <text class="setting-subtitle">检测到可疑行为时显示警告</text>
          </view>
          <switch
            :checked="alertEnabled"
            @change="toggleAlert"
            color="#667eea"
          />
        </view>
      </view>

      <!-- 水印显示（已禁用） -->
      <view class="setting-card card disabled">
        <view class="setting-header">
          <view class="setting-info">
            <text class="setting-title">水印保护</text>
            <text class="setting-subtitle">已禁用，保持页面美观</text>
          </view>
          <switch :checked="false" disabled color="#cccccc" />
        </view>
      </view>
    </view>

    <!-- 安全记录 -->
    <view class="security-section">
      <view class="section-title">
        <text>安全记录</text>
        <text class="event-count">({{ securityEvents.length }})</text>
      </view>

      <view class="security-card card">
        <view class="security-header" @click="showSecurityEvents">
          <view class="security-info">
            <text class="security-title">查看安全事件</text>
            <text class="security-subtitle">
              最近记录: {{ getLastEventTime() }}
            </text>
          </view>
          <text class="arrow">→</text>
        </view>
      </view>

      <view class="action-buttons">
        <button class="btn btn-secondary" @click="clearEvents">清除记录</button>
        <button class="btn btn-primary" @click="exportEvents">导出记录</button>
      </view>
    </view>

    <!-- 帮助说明 -->
    <view class="help-section">
      <view class="section-title">帮助说明</view>

      <view class="help-card card" @click="showHelp">
        <view class="help-header">
          <view class="help-icon">
            <text class="icon">❓</text>
          </view>
          <view class="help-info">
            <text class="help-title">防录屏功能说明</text>
            <text class="help-subtitle">了解各项功能的作用和使用方法</text>
          </view>
          <text class="arrow">→</text>
        </view>
      </view>
    </view>

    <!-- 防护级别选择器 -->
    <picker
      v-if="showPicker"
      :value="levelIndex"
      :range="levelOptions"
      range-key="text"
      @change="onLevelChange"
      @cancel="showPicker = false"
    >
      <view></view>
    </picker>
  </view>
</template>

<script>
export default {
  name: "ScreenProtection",

  data() {
    return {
      protectionStatus: {
        isEnabled: false,
        protectionLevel: "high",
        platform: "unknown",
        alertEnabled: true,
      },
      currentLevel: "high",
      alertEnabled: true,
      watermarkEnabled: true,
      securityEvents: [],
      showPicker: false,
      levelIndex: 2,
      levelOptions: [
        { value: "low", text: "低级防护", desc: "基础保护功能" },
        { value: "medium", text: "中级防护", desc: "增强保护功能" },
        { value: "high", text: "高级防护", desc: "最严格保护" },
      ],
    };
  },

  onLoad() {
    this.loadUserSettings();
    this.loadProtectionStatus();
    this.loadSecurityEvents();
  },

  onShow() {
    this.refreshStatus();
  },

  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack();
    },

    /**
     * 加载保护状态
     */
    loadProtectionStatus() {
      try {
        // 首先尝试从增强版防录屏保护器获取状态
        if (this.$screenProtector && typeof this.$screenProtector.getStatus === 'function') {
          this.protectionStatus = this.$screenProtector.getStatus();
          this.currentLevel = this.protectionStatus.protectionLevel;
          this.alertEnabled = this.protectionStatus.alertEnabled;
          this.watermarkEnabled = this.protectionStatus.watermarkEnabled;

          // 设置级别选择器的索引
          this.levelIndex = this.levelOptions.findIndex(
            (item) => item.value === this.currentLevel
          );
        } else {
          // 备用方案：从本地存储加载状态
          const savedSettings = uni.getStorageSync('screenProtectionSettings');
          if (savedSettings) {
            this.currentLevel = savedSettings.level || 'medium';
            this.alertEnabled = savedSettings.showAlert !== false;
            this.watermarkEnabled = savedSettings.showWatermark || false;
            
            this.protectionStatus = {
              isEnabled: uni.getStorageSync('screenProtectionEnabled') || false,
              protectionLevel: this.currentLevel,
              alertEnabled: this.alertEnabled,
              watermarkEnabled: this.watermarkEnabled
            };
            
            this.levelIndex = this.levelOptions.findIndex(
              (item) => item.value === this.currentLevel
            );
          }
        }
      } catch (error) {
        console.error("加载保护状态失败:", error);
      }
    },

    /**
     * 加载安全事件
     */
    loadSecurityEvents() {
      try {
        // 首先尝试从增强版防录屏保护器获取事件
        if (this.$screenProtector && typeof this.$screenProtector.getSecurityEvents === 'function') {
          this.securityEvents = this.$screenProtector.getSecurityEvents();
        } else {
          // 备用方案：从本地存储加载安全日志
          const logs = uni.getStorageSync('securityLogs') || [];
          this.securityEvents = logs.slice(0, 50); // 只显示最近50条
        }
      } catch (error) {
        console.error("加载安全事件失败:", error);
        this.securityEvents = [];
      }
    },

    /**
     * 刷新状态
     */
    refreshStatus() {
      this.loadProtectionStatus();
      this.loadSecurityEvents();
    },

    /**
     * 切换保护状态
     */
    toggleProtection(e) {
      const enabled = e.detail.value;

      try {
        // 检查防录屏方法是否存在
        if (enabled) {
          if (typeof this.$enableScreenProtection === 'function') {
            this.$enableScreenProtection({
              level: this.currentLevel,
              showAlert: this.alertEnabled,
              showWatermark: this.watermarkEnabled,
            });
          } else {
            console.log('防录屏功能暂不可用');
          }
        } else {
          if (typeof this.$disableScreenProtection === 'function') {
            this.$disableScreenProtection();
          } else {
            console.log('防录屏功能暂不可用');
          }
        }

        // 保存用户设置
        this.saveSettings(enabled);

        this.loadProtectionStatus();

        uni.showToast({
          title: enabled ? "防护已启用" : "防护已禁用",
          icon: "success",
        });
      } catch (error) {
        console.error("切换保护状态失败:", error);
        uni.showToast({
          title: "操作失败",
          icon: "error",
        });
      }
    },

    /**
     * 切换警告提示
     */
    toggleAlert(e) {
      this.alertEnabled = e.detail.value;

      // 如果当前已启用保护，重新启用以应用新设置
      if (this.protectionStatus.isEnabled) {
        this.$enableScreenProtection({
          level: this.currentLevel,
          showAlert: this.alertEnabled,
          showWatermark: this.watermarkEnabled,
        });
      }

      // 保存设置
      this.saveSettings();
    },

    /**
     * 切换水印显示
     */
    toggleWatermark(e) {
      this.watermarkEnabled = e.detail.value;

      // 如果当前已启用保护，重新启用以应用新设置
      if (this.protectionStatus.isEnabled) {
        this.$enableScreenProtection({
          level: this.currentLevel,
          showAlert: this.alertEnabled,
          showWatermark: this.watermarkEnabled,
        });
      }

      // 保存设置
      this.saveSettings();
      
      // 显示状态提示
      uni.showToast({
        title: this.watermarkEnabled ? "水印已启用" : "水印已禁用",
        icon: "success",
        duration: 1500,
      });
    },

    /**
     * 显示级别选择器
     */
    showLevelPicker() {
      this.showPicker = true;
    },

    /**
     * 级别选择变化
     */
    onLevelChange(e) {
      const index = e.detail.value;
      this.levelIndex = index;
      this.currentLevel = this.levelOptions[index].value;
      this.showPicker = false;

      // 如果当前已启用保护，重新启用以应用新设置
      if (this.protectionStatus.isEnabled) {
        this.$enableScreenProtection({
          level: this.currentLevel,
          showAlert: this.alertEnabled,
          showWatermark: this.watermarkEnabled,
        });
      }

      // 保存设置
      this.saveSettings();

      uni.showToast({
        title: `已设置为${this.levelOptions[index].text}`,
        icon: "success",
      });
    },

    /**
     * 获取级别文本
     */
    getLevelText(level) {
      const option = this.levelOptions.find((item) => item.value === level);
      return option ? option.text : "未知";
    },

    /**
     * 获取平台文本
     */
    getPlatformText(platform) {
      const platformMap = {
        android: "Android",
        ios: "iOS",
        devtools: "开发工具",
        h5: "网页版",
        "mp-weixin": "微信小程序",
        "mp-alipay": "支付宝小程序",
      };
      return platformMap[platform] || platform;
    },

    /**
     * 获取最后事件时间
     */
    getLastEventTime() {
      if (this.securityEvents.length === 0) {
        return "暂无记录";
      }

      const lastEvent = this.securityEvents[this.securityEvents.length - 1];
      const date = new Date(lastEvent.timestamp);
      return `${
        date.getMonth() + 1
      }月${date.getDate()}日 ${date.getHours()}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    },

    /**
     * 显示安全事件详情
     */
    showSecurityEvents() {
      if (this.securityEvents.length === 0) {
        uni.showToast({
          title: "暂无安全记录",
          icon: "none",
        });
        return;
      }

      // 格式化事件列表
      const eventList = this.securityEvents
        .map((event) => {
          const date = new Date(event.timestamp);
          const typeMap = {
            screenshot: "截屏",
            recording: "录屏",
            devtools: "开发者工具",
          };
          return `${
            typeMap[event.type] || event.type
          } - ${date.toLocaleString()}`;
        })
        .join("\n");

      uni.showModal({
        title: `安全事件记录 (${this.securityEvents.length}条)`,
        content: eventList,
        showCancel: false,
        confirmText: "知道了",
      });
    },

    /**
     * 清除安全事件
     */
    clearEvents() {
      uni.showModal({
        title: "确认清除",
        content: "确定要清除所有安全事件记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.$clearSecurityEvents();
            this.securityEvents = [];
            uni.showToast({
              title: "记录已清除",
              icon: "success",
            });
          }
        },
      });
    },

    /**
     * 保存用户设置
     */
    saveSettings(enabled = null) {
      try {
        const settings = {
          enabled: enabled !== null ? enabled : this.protectionStatus.isEnabled,
          level: this.currentLevel,
          showAlert: this.alertEnabled,
          showWatermark: this.watermarkEnabled,
          lastModified: new Date().toISOString(),
        };

        // 保存到本地存储
        uni.setStorageSync("screenProtectionSettings", settings);
        uni.setStorageSync("screenProtectionEnabled", settings.enabled);
        
        // 同时更新增强版防录屏保护器的设置
        if (this.$screenProtector && typeof this.$screenProtector.updateSettings === 'function') {
          this.$screenProtector.updateSettings({
            level: this.currentLevel,
            showAlert: this.alertEnabled,
            showWatermark: this.watermarkEnabled
          });
        }
        
        console.log("💾 防录屏设置已保存:", settings);
      } catch (error) {
        console.error("保存设置失败:", error);
      }
    },

    /**
     * 加载用户设置
     */
    loadUserSettings() {
      try {
        const settings = uni.getStorageSync("screenProtectionSettings");
        if (settings) {
          this.currentLevel = settings.level || "high";
          this.alertEnabled = settings.showAlert !== false;
          this.watermarkEnabled = settings.showWatermark !== false;

          // 更新级别选择器索引
          this.levelIndex = this.levelOptions.findIndex(
            (item) => item.value === this.currentLevel
          );

          console.log("📥 已加载用户设置:", settings);
        }
      } catch (error) {
        console.error("加载用户设置失败:", error);
      }
    },

    /**
     * 导出安全事件
     */
    exportEvents() {
      if (this.securityEvents.length === 0) {
        uni.showToast({
          title: "暂无记录可导出",
          icon: "none",
        });
        return;
      }

      // 生成导出内容
      const exportData = {
        timestamp: new Date().toISOString(),
        total: this.securityEvents.length,
        events: this.securityEvents,
      };

      // 在实际项目中，这里可以实现文件导出功能
      uni.showModal({
        title: "导出功能",
        content: `共${this.securityEvents.length}条记录，导出功能正在开发中...`,
        showCancel: false,
      });
    },

    /**
     * 显示帮助信息
     */
    showHelp() {
      const helpContent = `
防录屏功能说明：

🛡️ 低级防护：
- 基础的截屏检测
- 简单的用户提示

🛡️ 中级防护：
- 增强的截屏检测
- 禁用右键菜单
- 防止文本选择

🛡️ 高级防护：
- 最严格的保护措施
- 开发者工具检测
- 防护水印显示
- 全面的快捷键拦截

⚠️ 注意事项：
- 不同平台支持的功能有所差异
- Web端功能相对完整
- 小程序受平台限制较多
      `;

      uni.showModal({
        title: "功能说明",
        content: helpContent,
        showCancel: false,
        confirmText: "知道了",
      });
    },
  },
};
</script>

<style scoped>
.screen-protection-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 40px;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44px 20px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-back {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.nav-back-icon {
  font-size: 20px;
  font-weight: bold;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-right {
  width: 40px;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 12px;
  margin: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card.disabled {
  background: #f5f5f5;
  opacity: 0.7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 状态卡片 */
.status-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  transition: all 0.3s ease;
}

.status-icon.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-icon .icon {
  font-size: 28px;
}

.status-info {
  flex: 1;
}

.status-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.status-subtitle {
  display: block;
  font-size: 14px;
  color: #666;
}

.status-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 设置区域 */
.settings-section,
.security-section,
.help-section {
  margin-top: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 16px 8px;
}

.event-count {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

/* 设置卡片 */
.setting-header,
.security-header,
.help-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.setting-info,
.security-info,
.help-info {
  flex: 1;
}

.setting-title,
.security-title,
.help-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.setting-subtitle,
.security-subtitle,
.help-subtitle {
  display: block;
  font-size: 14px;
  color: #666;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-size: 14px;
}

.arrow {
  font-size: 16px;
  color: #ccc;
}

/* 帮助图标 */
.help-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f8ff;
}

.help-icon .icon {
  font-size: 20px;
}

/* 按钮组 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin: 16px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn:active {
  transform: scale(0.98);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card {
    margin: 12px;
    padding: 16px;
  }

  .navbar {
    padding: 44px 16px 16px;
  }

  .action-buttons {
    margin: 12px;
    flex-direction: column;
  }
}
</style>

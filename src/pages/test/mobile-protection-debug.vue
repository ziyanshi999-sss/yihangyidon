<template>
  <view class="container">
    <view class="header">
      <text class="title">🛡️ 手机防录屏调试</text>
      <text class="subtitle">检测原生插件状态</text>
    </view>

    <!-- 插件状态 -->
    <view class="section">
      <view class="section-title">📱 插件状态</view>
      <view class="status-card" :class="pluginStatus.class">
        <text class="status-text">{{ pluginStatus.text }}</text>
      </view>
    </view>

    <!-- 测试按钮 -->
    <view class="section">
      <view class="section-title">🔧 功能测试</view>
      <button @click="testPlugin" class="test-btn">测试原生插件</button>
      <button @click="testSimpleProtector" class="test-btn">测试简化版</button>
      <button @click="enableProtection" class="test-btn primary">
        启用防录屏（原生）
      </button>
      <button @click="enableSimpleProtection" class="test-btn primary">
        启用防录屏（简化）
      </button>
      <button @click="disableProtection" class="test-btn">禁用防录屏</button>
      <button @click="checkStatus" class="test-btn">检查状态</button>
    </view>

    <!-- 日志区域 -->
    <view class="section">
      <view class="section-title">📝 调试日志</view>
      <view class="log-container">
        <text
          v-for="(log, index) in logs"
          :key="index"
          class="log-item"
          :class="log.type"
        >
          {{ log.time }} {{ log.message }}
        </text>
      </view>
      <button @click="clearLogs" class="clear-btn">清空日志</button>
    </view>

    <!-- 环境信息 -->
    <view class="section">
      <view class="section-title">ℹ️ 环境信息</view>
      <view class="info-item">
        <text class="info-label">平台:</text>
        <text class="info-value">{{ systemInfo.platform }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">系统版本:</text>
        <text class="info-value">{{ systemInfo.system }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">应用版本:</text>
        <text class="info-value">{{ systemInfo.version }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">plus环境:</text>
        <text class="info-value">{{ plusAvailable ? "可用" : "不可用" }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import simpleProtector from "@/utils/simple-mobile-protector.js";

export default {
  name: "MobileProtectionDebug",
  data() {
    return {
      pluginStatus: {
        class: "unknown",
        text: "未知状态",
      },
      logs: [],
      systemInfo: {},
      plusAvailable: false,
      protectionEnabled: false,
    };
  },

  onLoad() {
    this.initDebug();
  },

  methods: {
    initDebug() {
      this.log("🔍 开始调试手机防录屏功能", "info");

      // 获取系统信息
      this.systemInfo = uni.getSystemInfoSync();
      this.plusAvailable = typeof plus !== "undefined";

      this.log(`📱 平台: ${this.systemInfo.platform}`, "info");
      this.log(
        `🔧 plus环境: ${this.plusAvailable ? "可用" : "不可用"}`,
        this.plusAvailable ? "success" : "error"
      );

      // 自动测试插件
      this.testPlugin();
    },

    async testPlugin() {
      this.log("🧪 测试原生插件...", "info");

      try {
        if (uni.requireNativePlugin) {
          const screenProtector = uni.requireNativePlugin("ScreenProtector");
          if (screenProtector && screenProtector.testPlugin) {
            screenProtector.testPlugin((result) => {
              if (result.success) {
                this.pluginStatus = {
                  class: "success",
                  text: "✅ 插件加载成功",
                };
                this.log(`✅ 插件测试成功: ${result.message}`, "success");
                this.log(`📊 API Level: ${result.apiLevel}`, "info");
              } else {
                this.pluginStatus = {
                  class: "error",
                  text: "❌ 插件测试失败",
                };
                this.log(`❌ 插件测试失败: ${result.message}`, "error");
              }
            });
          } else {
            this.pluginStatus = {
              class: "error",
              text: "❌ 插件不可用",
            };
            this.log("❌ 无法获取ScreenProtector插件", "error");
          }
        } else {
          this.pluginStatus = {
            class: "error",
            text: "❌ requireNativePlugin不可用",
          };
          this.log("❌ uni.requireNativePlugin不可用", "error");
        }
      } catch (error) {
        this.pluginStatus = {
          class: "error",
          text: "❌ 插件异常",
        };
        this.log(`❌ 插件测试异常: ${error.message}`, "error");
      }
    },

    async enableProtection() {
      this.log("🛡️ 开始启用防录屏保护...", "info");

      try {
        if (this.$screenProtector) {
          const result = await this.$screenProtector.enable();
          if (result) {
            this.protectionEnabled = true;
            this.log("✅ 防录屏保护已启用", "success");

            uni.showToast({
              title: "防录屏已启用",
              icon: "success",
            });
          } else {
            this.log("❌ 防录屏保护启用失败", "error");
          }
        } else {
          this.log("❌ $screenProtector不可用", "error");
        }
      } catch (error) {
        this.log(`❌ 启用异常: ${error.message}`, "error");
      }
    },

    async disableProtection() {
      this.log("🔓 开始禁用防录屏保护...", "info");

      try {
        if (this.$screenProtector) {
          this.$screenProtector.disable();
          this.protectionEnabled = false;
          this.log("✅ 防录屏保护已禁用", "success");

          uni.showToast({
            title: "防录屏已禁用",
            icon: "success",
          });
        } else {
          this.log("❌ $screenProtector不可用", "error");
        }
      } catch (error) {
        this.log(`❌ 禁用异常: ${error.message}`, "error");
      }
    },

    checkStatus() {
      this.log("📊 检查防录屏状态...", "info");

      try {
        if (this.$screenProtector) {
          const status = this.$screenProtector.getStatus();
          this.log(`📊 状态: ${JSON.stringify(status)}`, "info");
        } else {
          this.log("❌ $screenProtector不可用", "error");
        }
      } catch (error) {
        this.log(`❌ 状态检查异常: ${error.message}`, "error");
      }
    },

    log(message, type = "info") {
      const time = new Date().toLocaleTimeString();
      this.logs.unshift({
        time,
        message,
        type,
      });

      // 限制日志数量
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50);
      }

      console.log(`[${time}] ${message}`);
    },

    clearLogs() {
      this.logs = [];
      this.log("📝 日志已清空", "info");
    },

    // 测试简化版保护器
    async testSimpleProtector() {
      this.log("🧪 测试简化版保护器...", "info");

      try {
        const result = simpleProtector.test();
        if (result.success) {
          this.log(`✅ 简化版测试成功: ${result.message}`, "success");
          this.log(`📊 平台: ${result.platform}`, "info");
          this.log(
            `🔧 plus.android: ${
              result.features.plus_android ? "可用" : "不可用"
            }`,
            result.features.plus_android ? "success" : "error"
          );
          this.log(
            `🔍 检测模式: ${
              result.features.detection_mode ? "支持" : "不支持"
            }`,
            "info"
          );
        } else {
          this.log(`❌ 简化版测试失败: ${result.message}`, "error");
        }
      } catch (error) {
        this.log(`❌ 简化版测试异常: ${error.message}`, "error");
      }
    },

    // 启用简化版防录屏
    async enableSimpleProtection() {
      this.log("🛡️ 开始启用简化版防录屏保护...", "info");

      try {
        const result = await simpleProtector.enable();
        if (result) {
          this.protectionEnabled = true;
          this.log("✅ 简化版防录屏保护已启用", "success");

          // 监听事件
          simpleProtector.on("onScreenshotDetected", (data) => {
            this.log(`🚨 检测到截屏: ${JSON.stringify(data)}`, "error");
          });

          uni.showToast({
            title: "简化版防录屏已启用",
            icon: "success",
          });
        } else {
          this.log("❌ 简化版防录屏保护启用失败", "error");
        }
      } catch (error) {
        this.log(`❌ 简化版启用异常: ${error.message}`, "error");
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.status-card {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.status-card.success {
  background: #f0f9ff;
  border: 1px solid #10b981;
}

.status-card.error {
  background: #fef2f2;
  border: 1px solid #ef4444;
}

.status-card.unknown {
  background: #f9fafb;
  border: 1px solid #6b7280;
}

.status-text {
  font-weight: bold;
  font-size: 16px;
}

.test-btn {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.test-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.log-container {
  background: #1f2937;
  border-radius: 8px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.log-item {
  display: block;
  font-size: 12px;
  font-family: monospace;
  margin-bottom: 5px;
  color: #d1d5db;
}

.log-item.success {
  color: #10b981;
}

.log-item.error {
  color: #ef4444;
}

.log-item.info {
  color: #3b82f6;
}

.clear-btn {
  width: 100%;
  padding: 8px;
  background: #6b7280;
  color: white;
  border-radius: 6px;
  font-size: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-label {
  font-weight: bold;
  color: #374151;
}

.info-value {
  color: #6b7280;
}
</style>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from "@/utils/auth.js";
import { initWealthDataSync } from "@/api/wealth.js";
import { checkAndFixUserDataConsistency } from "@/utils/data-consistency.js";

/**
 * 中国农业银行应用主入口
 * @description 管理应用全局状态和生命周期
 */
export default {
  name: "App",

  onLaunch(options) {
    console.log("App Launch", options);

    // 检查更新
    this.checkUpdate();

    // 初始化用户信息
    this.initUserInfo();

    // 设置系统信息
    this.setSystemInfo();

    // 初始化网络状态监听
    this.initNetworkListener();

    // 初始化登录拦截
    this.initLoginInterceptor();

    // 初始化财富数据同步
    initWealthDataSync();

    // 初始化防录屏保护
    this.$nextTick(() => {
      setTimeout(() => {
        this.initScreenProtection();
      }, 100);
    });
  },

  onShow(options) {
    console.log("App Show", options);

    // 检查登录状态
    this.checkLoginStatus();

    // 恢复应用状态
    this.restoreAppState();

    // 全局登录拦截检查
    this.globalLoginCheck();
  },

  onHide() {
    console.log("App Hide");

    // 保存应用状态
    this.saveAppState();
  },

  onError(error) {
    console.error("App Error:", error);

    // 错误上报
    this.reportError(error);
  },

  onPageNotFound(options) {
    console.log("Page Not Found:", options);

    // 跳转到404页面或首页
    uni.switchTab({
      url: "/pages/index/index",
    });
  },

  methods: {
    /**
     * 检查应用更新
     */
    checkUpdate() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
        console.log("当前应用版本:", widgetInfo.version);
        // 这里可以添加版本检查逻辑
      });
      // #endif
    },

    /**
     * 初始化用户信息
     */
    initUserInfo() {
      try {
        // 使用数据一致性检查确保用户信息正确
        const consistentUserInfo = checkAndFixUserDataConsistency();

        if (consistentUserInfo) {
          this.globalData.userInfo = consistentUserInfo;
          console.log(
            "用户信息已恢复并验证:",
            consistentUserInfo.username,
            "余额:",
            consistentUserInfo.balance
          );
        } else {
          console.warn("⚠️ 无法恢复用户信息");
        }
      } catch (error) {
        console.error("恢复用户信息失败:", error);
      }
    },

    /**
     * 设置系统信息
     */
    setSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        this.globalData.systemInfo = systemInfo;
        console.log("系统信息:", systemInfo);
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    /**
     * 初始化网络状态监听
     */
    initNetworkListener() {
      uni.onNetworkStatusChange((res) => {
        console.log("网络状态变化:", res);
        this.globalData.networkType = res.networkType;
        this.globalData.isConnected = res.isConnected;

        if (!res.isConnected) {
          uni.showToast({
            title: "网络连接已断开",
            icon: "none",
          });
        }
      });
    },

    /**
     * 检查登录状态
     */
    checkLoginStatus() {
      // 使用强制检查登录状态
      if (!forceCheckLogin()) {
        // 如果未登录且不在登录页面，强制跳转到登录页
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage && !currentPage.route.includes("login")) {
          console.log("应用启动时检测到未登录，强制跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login",
          });
        }
      }
    },

    /**
     * 初始化登录拦截器
     */
    initLoginInterceptor() {
      // 拦截页面跳转
      uni.addInterceptor("navigateTo", {
        invoke(e) {
          console.log("拦截 navigateTo:", e.url);

          // 检查是否为登录页面或注册页面
          if (
            e.url.includes("/pages/denglu/login") ||
            e.url.includes("/pages/register/register")
          ) {
            console.log("跳转到登录页面或注册页面，允许");
            return true;
          }

          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log("用户未登录，阻止页面跳转");
            // 如果是财富相关页面，允许跳转但显示登录提示
            if (e.url.includes("/pages/wealth/")) {
              console.log("财富页面，允许跳转但需要登录检查");
              return true;
            }
            return false;
          }

          return true;
        },
      });

      // 拦截tabBar页面跳转
      uni.addInterceptor("switchTab", {
        invoke(e) {
          console.log("拦截 switchTab:", e.url);

          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log("用户未登录，阻止tabBar跳转");
            return false;
          }

          return true;
        },
      });

      // 拦截重定向
      uni.addInterceptor("reLaunch", {
        invoke(e) {
          console.log("拦截 reLaunch:", e.url);

          // 检查是否为登录页面或注册页面
          if (
            e.url.includes("/pages/denglu/login") ||
            e.url.includes("/pages/register/register")
          ) {
            console.log("重定向到登录页面或注册页面，允许");
            return true;
          }

          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log("用户未登录，阻止重定向");
            return false;
          }

          return true;
        },
      });

      // 拦截redirectTo
      uni.addInterceptor("redirectTo", {
        invoke(e) {
          console.log("拦截 redirectTo:", e.url);

          // 检查是否为登录页面或注册页面
          if (
            e.url.includes("/pages/denglu/login") ||
            e.url.includes("/pages/register/register")
          ) {
            console.log("重定向到登录页面或注册页面，允许");
            return true;
          }

          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log("用户未登录，阻止重定向");
            return false;
          }

          return true;
        },
      });
    },

    /**
     * 全局登录检查
     */
    globalLoginCheck() {
      // 使用强制检查，确保退出后立即生效
      if (!forceCheckLogin()) {
        checkLoginAndRedirect();
      }
    },

    /**
     * 保存应用状态
     */
    saveAppState() {
      try {
        const appState = {
          timestamp: Date.now(),
          userInfo: this.globalData.userInfo,
        };
        uni.setStorageSync("appState", appState);
      } catch (error) {
        console.error("保存应用状态失败:", error);
      }
    },

    /**
     * 恢复应用状态
     */
    restoreAppState() {
      try {
        const appState = uni.getStorageSync("appState");
        if (appState) {
          // 检查状态是否过期（24小时）
          const isExpired =
            Date.now() - appState.timestamp > 24 * 60 * 60 * 1000;
          if (!isExpired) {
            this.globalData.userInfo = appState.userInfo;
          }
        }
      } catch (error) {
        console.error("恢复应用状态失败:", error);
      }
    },

    /**
     * 初始化防录屏保护 (修复版)
     */
    async initScreenProtection() {
      try {
        console.log("🛡️ 初始化防录屏保护...");

        // 获取用户设置的防护级别
        const protectionSettings = uni.getStorageSync(
          "screenProtectionSettings"
        ) || {
          enabled: true,
          level: "high",
          showAlert: true,
          showWatermark: false, // 默认关闭水印，避免影响体验
        };

        console.log("📋 防护设置:", protectionSettings);

        // 如果用户禁用了防录屏功能
        if (!protectionSettings.enabled) {
          console.log("⚪ 防录屏保护已被用户禁用");
          return;
        }

        // 尝试多种防护方案
        let protectionEnabled = false;

        // 方案1: 使用统一防录屏保护器
        try {
          const { default: unifiedProtector } = await import(
            "@/utils/unified-screen-protector.js"
          );

          const result = await unifiedProtector.enable({
            level: protectionSettings.level,
            showAlert: protectionSettings.showAlert,
            showWatermark: protectionSettings.showWatermark,
            watermarkText: "银行APP - 隐私保护中",
          });

          if (result) {
            console.log("✅ 统一防录屏保护启用成功");
            protectionEnabled = true;

            // 设置事件监听
            unifiedProtector.on("onScreenshotDetected", (data) => {
              console.warn("🚨 统一保护器检测到截屏:", data);
              this.handleSecurityEvent("screenshot", data);
            });

            unifiedProtector.on("onRecordingDetected", (data) => {
              console.warn("🚨 统一保护器检测到录屏:", data);
              this.handleSecurityEvent("recording", data);
            });

            unifiedProtector.on("onProtectionEnabled", (data) => {
              console.log("✅ 防护启用成功:", data);
            });
          }
        } catch (error) {
          console.warn("⚠️ 统一防录屏保护器加载失败:", error);
        }

        // 方案2: 回退到插件方案 (如果统一保护器失败)
        if (
          !protectionEnabled &&
          typeof this.$screenProtector !== "undefined"
        ) {
          try {
            const result = this.$screenProtector.enable({
              level: protectionSettings.level,
              showAlert: protectionSettings.showAlert,
              showWatermark: protectionSettings.showWatermark,
              watermarkText: "银行APP - 隐私保护中",
            });

            if (result) {
              console.log("✅ 插件防录屏保护启用成功");
              protectionEnabled = true;

              // 监听安全事件
              this.$screenProtector.on("onScreenshotDetected", (data) => {
                console.warn("🚨 插件检测到截屏:", data);
                this.handleSecurityEvent("screenshot", data);
              });

              this.$screenProtector.on("onRecordingDetected", (data) => {
                console.warn("🚨 插件检测到录屏:", data);
                this.handleSecurityEvent("recording", data);
              });
            }
          } catch (error) {
            console.warn("⚠️ 插件防录屏保护失败:", error);
          }
        }

        // 方案3: 最后的回退方案 (简化检测)
        if (!protectionEnabled) {
          try {
            const { default: simpleProtector } = await import(
              "@/utils/simple-mobile-protector.js"
            );
            const result = await simpleProtector.enable();

            if (result) {
              console.log("✅ 简化防录屏保护启用成功");
              protectionEnabled = true;

              simpleProtector.on("onScreenshotDetected", (data) => {
                console.warn("🚨 简化保护器检测到截屏:", data);
                this.handleSecurityEvent("screenshot", data);
              });
            }
          } catch (error) {
            console.warn("⚠️ 简化防录屏保护失败:", error);
          }
        }

        // 最终状态报告
        if (protectionEnabled) {
          console.log("🎉 防录屏保护已成功启用");

          // 显示启用成功提示 (可选)
          if (protectionSettings.showAlert) {
            uni.showToast({
              title: "隐私保护已启用",
              icon: "success",
              duration: 2000,
            });
          }
        } else {
          console.error("❌ 所有防录屏方案均失败");

          // 记录失败事件
          this.logProtectionFailure();
        }
      } catch (error) {
        console.error("❌ 初始化防录屏保护失败:", error);
        this.logProtectionFailure(error);
      }
    },

    /**
     * 记录防护失败事件
     */
    logProtectionFailure(error = null) {
      try {
        const failureLog = {
          timestamp: new Date().toISOString(),
          platform: uni.getSystemInfoSync().platform,
          error: error ? error.message : "未知错误",
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          page: getCurrentPages().pop()?.route || "unknown",
        };

        const failures = uni.getStorageSync("protectionFailures") || [];
        failures.push(failureLog);

        // 只保留最近10条失败记录
        if (failures.length > 10) {
          failures.splice(0, failures.length - 10);
        }

        uni.setStorageSync("protectionFailures", failures);

        console.log("📝 防护失败日志已记录:", failureLog);
      } catch (logError) {
        console.error("记录防护失败日志失败:", logError);
      }
    },

    /**
     * 处理安全事件
     */
    handleSecurityEvent(type, data) {
      try {
        // 记录到全局安全日志
        const securityLog = {
          type,
          timestamp: new Date().toISOString(),
          data,
          userInfo: this.globalData.userInfo
            ? {
                username: this.globalData.userInfo.username,
                userId: this.globalData.userInfo.id,
              }
            : null,
          page: getCurrentPages().pop()?.route || "unknown",
        };

        // 保存到全局安全日志
        const globalSecurityLogs =
          uni.getStorageSync("globalSecurityLogs") || [];
        globalSecurityLogs.push(securityLog);

        // 只保留最近200条记录
        if (globalSecurityLogs.length > 200) {
          globalSecurityLogs.splice(0, globalSecurityLogs.length - 200);
        }

        uni.setStorageSync("globalSecurityLogs", globalSecurityLogs);

        // 发送到服务器（可选）
        this.reportSecurityEventToServer(securityLog);

        // 根据事件类型显示不同的提示
        const messages = {
          screenshot: "检测到截屏行为，已记录该操作",
          recording: "检测到录屏行为，为保护隐私已阻止",
        };

        uni.showToast({
          title: messages[type] || "检测到可疑操作",
          icon: "none",
          duration: 3000,
        });
      } catch (error) {
        console.error("处理安全事件失败:", error);
      }
    },

    /**
     * 上报安全事件到服务器
     */
    async reportSecurityEventToServer(securityLog) {
      try {
        // 这里可以发送到您的后端服务器
        console.log("📤 上报安全事件:", securityLog);

        // 示例：使用uni.request发送到服务器
        // await uni.request({
        //   url: 'https://your-api.com/security-events',
        //   method: 'POST',
        //   data: securityLog,
        //   header: {
        //     'Content-Type': 'application/json'
        //   }
        // })
      } catch (error) {
        console.error("上报安全事件失败:", error);
      }
    },

    /**
     * 错误上报
     */
    reportError(error) {
      // 这里可以集成错误上报服务
      console.error("错误上报:", error);
    },
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    systemInfo: null,
    networkType: "unknown",
    isConnected: true,
  },
};
</script>

<style>
/* 重置默认样式（WXSS兼容写法） */
page,
view {
  box-sizing: border-box;
}

page {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 通用容器样式 */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 卡片样式 */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 16px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

/* 输入框样式 */
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 文本样式 */
.text-primary {
  color: #667eea;
}

.text-secondary {
  color: #666;
}

.text-success {
  color: #27ae60;
}

.text-danger {
  color: #e74c3c;
}

.text-warning {
  color: #f39c12;
}

/* 间距工具类 */
.mt-1 {
  margin-top: 8px;
}
.mt-2 {
  margin-top: 16px;
}
.mt-3 {
  margin-top: 24px;
}
.mt-4 {
  margin-top: 32px;
}

.mb-1 {
  margin-bottom: 8px;
}
.mb-2 {
  margin-bottom: 16px;
}
.mb-3 {
  margin-bottom: 24px;
}
.mb-4 {
  margin-bottom: 32px;
}

.ml-1 {
  margin-left: 8px;
}
.ml-2 {
  margin-left: 16px;
}
.ml-3 {
  margin-left: 24px;
}

.mr-1 {
  margin-right: 8px;
}
.mr-2 {
  margin-right: 16px;
}
.mr-3 {
  margin-right: 24px;
}

.pt-1 {
  padding-top: 8px;
}
.pt-2 {
  padding-top: 16px;
}
.pt-3 {
  padding-top: 24px;
}

.pb-1 {
  padding-bottom: 8px;
}
.pb-2 {
  padding-bottom: 16px;
}
.pb-3 {
  padding-bottom: 24px;
}

.px-1 {
  padding-left: 8px;
  padding-right: 8px;
}
.px-2 {
  padding-left: 16px;
  padding-right: 16px;
}
.px-3 {
  padding-left: 24px;
  padding-right: 24px;
}

.py-1 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.py-2 {
  padding-top: 16px;
  padding-bottom: 16px;
}
.py-3 {
  padding-top: 24px;
  padding-bottom: 24px;
}

/* 布局工具类 */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.flex-1 {
  flex: 1;
}

/* 文本对齐 */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

/* 字体大小 */
.text-sm {
  font-size: 14px;
}

.text-base {
  font-size: 16px;
}

.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-2xl {
  font-size: 24px;
}

/* 字体粗细 */
.font-normal {
  font-weight: 400;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

/* 圆角 */
.rounded {
  border-radius: 8px;
}

.rounded-lg {
  border-radius: 12px;
}

.rounded-full {
  border-radius: 50%;
}

/* 阴影 */
.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .card {
    padding: 16px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 加载状态 */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

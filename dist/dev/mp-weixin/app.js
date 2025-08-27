"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/user.js";
  "./pages/wealth/wealth.js";
  "./pages/life/life.js";
}
const _sfc_main = {
  name: "App",
  onLaunch(options) {
    common_vendor.index.__f__("log", "at App.vue:10", "App Launch", options);
    this.checkUpdate();
    this.initUserInfo();
    this.setSystemInfo();
    this.initNetworkListener();
  },
  onShow(options) {
    common_vendor.index.__f__("log", "at App.vue:26", "App Show", options);
    this.checkLoginStatus();
    this.restoreAppState();
  },
  onHide() {
    common_vendor.index.__f__("log", "at App.vue:36", "App Hide");
    this.saveAppState();
  },
  onError(error) {
    common_vendor.index.__f__("error", "at App.vue:43", "App Error:", error);
    this.reportError(error);
  },
  onPageNotFound(options) {
    common_vendor.index.__f__("log", "at App.vue:50", "Page Not Found:", options);
    common_vendor.index.switchTab({
      url: "/pages/index/index"
    });
  },
  methods: {
    /**
     * 检查应用更新
     */
    checkUpdate() {
    },
    /**
     * 初始化用户信息
     */
    initUserInfo() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          this.globalData.userInfo = userInfo;
          common_vendor.index.__f__("log", "at App.vue:79", "用户信息已恢复:", userInfo);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:82", "恢复用户信息失败:", error);
      }
    },
    /**
     * 设置系统信息
     */
    setSystemInfo() {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.globalData.systemInfo = systemInfo;
        common_vendor.index.__f__("log", "at App.vue:93", "系统信息:", systemInfo);
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:95", "获取系统信息失败:", error);
      }
    },
    /**
     * 初始化网络状态监听
     */
    initNetworkListener() {
      common_vendor.index.onNetworkStatusChange((res) => {
        common_vendor.index.__f__("log", "at App.vue:104", "网络状态变化:", res);
        this.globalData.networkType = res.networkType;
        this.globalData.isConnected = res.isConnected;
        if (!res.isConnected) {
          common_vendor.index.showToast({
            title: "网络连接已断开",
            icon: "none"
          });
        }
      });
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage && !currentPage.route.includes("login")) {
          common_vendor.index.navigateTo({
            url: "/login/login"
          });
        }
      }
    },
    /**
     * 保存应用状态
     */
    saveAppState() {
      try {
        const appState = {
          timestamp: Date.now(),
          userInfo: this.globalData.userInfo
        };
        common_vendor.index.setStorageSync("appState", appState);
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:145", "保存应用状态失败:", error);
      }
    },
    /**
     * 恢复应用状态
     */
    restoreAppState() {
      try {
        const appState = common_vendor.index.getStorageSync("appState");
        if (appState) {
          const isExpired = Date.now() - appState.timestamp > 24 * 60 * 60 * 1e3;
          if (!isExpired) {
            this.globalData.userInfo = appState.userInfo;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:163", "恢复应用状态失败:", error);
      }
    },
    /**
     * 错误上报
     */
    reportError(error) {
      common_vendor.index.__f__("error", "at App.vue:172", "错误上报:", error);
    }
  },
  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    systemInfo: null,
    networkType: "unknown",
    isConnected: true
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.errorHandler = (err, vm, info) => {
    common_vendor.index.__f__("error", "at main.js:15", "Vue Error:", err);
    common_vendor.index.__f__("error", "at main.js:16", "Error Info:", info);
    reportError(err, info);
    common_vendor.index.showToast({
      title: "应用出现错误，请重试",
      icon: "none",
      duration: 3e3
    });
  };
  app.config.warnHandler = (msg, vm, trace) => {
    common_vendor.index.__f__("warn", "at main.js:31", "Vue Warning:", msg);
    common_vendor.index.__f__("warn", "at main.js:32", "Warning Trace:", trace);
  };
  app.config.globalProperties.$app = {
    // 应用版本
    version: "1.0.0",
    // 环境信息
    env: "development",
    // 平台信息
    platform: common_vendor.index.getSystemInfoSync().platform,
    // 工具方法
    utils: {
      // 格式化时间
      formatTime(date, format = "YYYY-MM-DD HH:mm:ss") {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return format.replace("YYYY", year).replace("MM", month).replace("DD", day).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);
      },
      // 防抖函数
      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },
      // 节流函数
      throttle(func, limit) {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      },
      // 深拷贝
      deepClone(obj) {
        if (obj === null || typeof obj !== "object")
          return obj;
        if (obj instanceof Date)
          return new Date(obj.getTime());
        if (obj instanceof Array)
          return obj.map((item) => this.deepClone(item));
        if (typeof obj === "object") {
          const clonedObj = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              clonedObj[key] = this.deepClone(obj[key]);
            }
          }
          return clonedObj;
        }
      },
      // 生成唯一ID
      generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      },
      // 验证手机号
      validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
      },
      // 验证邮箱
      validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      // 验证身份证号
      validateIdCard(idCard) {
        const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return idCardRegex.test(idCard);
      }
    },
    // 网络请求封装
    request: {
      // 基础配置
      baseURL: "http://localhost:3000/api",
      // 请求拦截器
      beforeRequest(config) {
        const token = common_vendor.index.getStorageSync("token");
        if (token) {
          config.header = {
            ...config.header,
            "Authorization": `Bearer ${token}`
          };
        }
        config.url += (config.url.includes("?") ? "&" : "?") + `_t=${Date.now()}`;
        common_vendor.index.__f__("log", "at main.js:155", "Request:", config);
        return config;
      },
      // 响应拦截器
      afterResponse(response) {
        common_vendor.index.__f__("log", "at main.js:161", "Response:", response);
        if (response.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.showToast({
            title: "登录已过期，请重新登录",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/login/login"
            });
          }, 1500);
          return Promise.reject(response);
        }
        return response;
      },
      // 发起请求
      async request(options) {
        const config = this.beforeRequest(options);
        try {
          const response = await new Promise((resolve, reject) => {
            common_vendor.index.request({
              ...config,
              success: resolve,
              fail: reject
            });
          });
          return this.afterResponse(response);
        } catch (error) {
          common_vendor.index.__f__("error", "at main.js:197", "Request Error:", error);
          if (error.errMsg && error.errMsg.includes("request:fail")) {
            common_vendor.index.showToast({
              title: "网络连接失败，请检查网络设置",
              icon: "none"
            });
          }
          return Promise.reject(error);
        }
      },
      // GET请求
      get(url, params = {}) {
        return this.request({
          url,
          method: "GET",
          data: params
        });
      },
      // POST请求
      post(url, data = {}) {
        return this.request({
          url,
          method: "POST",
          data
        });
      },
      // PUT请求
      put(url, data = {}) {
        return this.request({
          url,
          method: "PUT",
          data
        });
      },
      // DELETE请求
      delete(url) {
        return this.request({
          url,
          method: "DELETE"
        });
      }
    },
    // 存储管理
    storage: {
      // 设置存储
      set(key, value, expire = null) {
        const data = {
          value,
          timestamp: Date.now()
        };
        if (expire) {
          data.expire = expire;
        }
        try {
          common_vendor.index.setStorageSync(key, JSON.stringify(data));
        } catch (error) {
          common_vendor.index.__f__("error", "at main.js:263", "Storage Set Error:", error);
        }
      },
      // 获取存储
      get(key, defaultValue = null) {
        try {
          const data = common_vendor.index.getStorageSync(key);
          if (!data)
            return defaultValue;
          const parsed = JSON.parse(data);
          if (parsed.expire && Date.now() - parsed.timestamp > parsed.expire) {
            this.remove(key);
            return defaultValue;
          }
          return parsed.value;
        } catch (error) {
          common_vendor.index.__f__("error", "at main.js:283", "Storage Get Error:", error);
          return defaultValue;
        }
      },
      // 删除存储
      remove(key) {
        try {
          common_vendor.index.removeStorageSync(key);
        } catch (error) {
          common_vendor.index.__f__("error", "at main.js:293", "Storage Remove Error:", error);
        }
      },
      // 清空存储
      clear() {
        try {
          common_vendor.index.clearStorageSync();
        } catch (error) {
          common_vendor.index.__f__("error", "at main.js:302", "Storage Clear Error:", error);
        }
      }
    }
  };
  app.mixin({
    // 页面生命周期
    onLoad(options) {
      common_vendor.index.__f__("log", "at main.js:312", "Page Load:", this.$options.name, options);
      this.pageStartTime = Date.now();
    },
    onShow() {
      common_vendor.index.__f__("log", "at main.js:319", "Page Show:", this.$options.name);
    },
    onHide() {
      common_vendor.index.__f__("log", "at main.js:323", "Page Hide:", this.$options.name);
      if (this.pageStartTime) {
        const duration = Date.now() - this.pageStartTime;
        common_vendor.index.__f__("log", "at main.js:328", "Page Duration:", this.$options.name, duration + "ms");
      }
    },
    onUnload() {
      common_vendor.index.__f__("log", "at main.js:333", "Page Unload:", this.$options.name);
    },
    // 错误处理
    onError(error) {
      common_vendor.index.__f__("error", "at main.js:338", "Page Error:", this.$options.name, error);
      reportError(error, `Page: ${this.$options.name}`);
    }
  });
  return {
    app
  };
}
function reportError(error, info = "") {
  var _a;
  const errorData = {
    message: error.message || error,
    stack: error.stack,
    info,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    userAgent: common_vendor.index.getSystemInfoSync(),
    url: ((_a = getCurrentPages().pop()) == null ? void 0 : _a.route) || "unknown"
  };
  common_vendor.index.__f__("error", "at main.js:364", "Error Report:", errorData);
}
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    common_vendor.index.__f__("error", "at main.js:377", "Global Error:", event.error);
    reportError(event.error, "Global Error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    common_vendor.index.__f__("error", "at main.js:382", "Unhandled Promise Rejection:", event.reason);
    reportError(event.reason, "Unhandled Promise Rejection");
  });
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map

if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const scriptRel = "modulepreload";
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (false) {
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = Promise.all(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen)
          return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
          link.crossOrigin = "";
        }
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
          });
        }
      }));
    }
    return promise.then(() => baseModule()).catch((err) => {
      const e = new Event("vite:preloadError", { cancelable: true });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    });
  };
  const users = [
    {
      id: 1,
      username: "admin",
      password: "123456",
      phone: "13800138000",
      nickname: "管理员",
      avatar: "/static/logo.png",
      email: "admin@example.com"
    },
    {
      id: 2,
      username: "user001",
      password: "123456",
      phone: "13800138001",
      nickname: "张三",
      avatar: "/static/logo.png",
      email: "user001@example.com"
    },
    {
      id: 3,
      username: "user002",
      password: "123456",
      phone: "13800138002",
      nickname: "李四",
      avatar: "/static/logo.png",
      email: "user002@example.com"
    },
    {
      id: 4,
      username: "test",
      password: "test123",
      phone: "13800138003",
      nickname: "测试用户",
      avatar: "/static/logo.png",
      email: "test@example.com"
    }
  ];
  const verificationCodes = /* @__PURE__ */ new Map();
  function generateVerificationCode(phone) {
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    verificationCodes.set(phone, {
      code,
      expireTime: Date.now() + 5 * 60 * 1e3
      // 5分钟过期
    });
    return code;
  }
  function verifyCode(phone, code) {
    const stored = verificationCodes.get(phone);
    if (!stored)
      return false;
    if (Date.now() > stored.expireTime) {
      verificationCodes.delete(phone);
      return false;
    }
    if (stored.code === code) {
      verificationCodes.delete(phone);
      return true;
    }
    return false;
  }
  function validateUser(username, password) {
    return users.find(
      (user) => (user.username === username || user.phone === username) && user.password === password
    );
  }
  function findUserByUsername(username) {
    return users.find(
      (user) => user.username === username || user.phone === username
    );
  }
  const users$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    findUserByUsername,
    generateVerificationCode,
    users,
    validateUser,
    verifyCode
  }, Symbol.toStringTag, { value: "Module" }));
  const WHITE_LIST = [
    "/pages/denglu/login",
    "/pages/denglu/register",
    "/pages/common/404",
    "/pages/common/error"
  ];
  function isLoggedIn() {
    try {
      const userInfo = uni.getStorageSync("userInfo");
      const isLoggedIn2 = uni.getStorageSync("isLoggedIn");
      return !!(userInfo && isLoggedIn2);
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:24", "检查登录状态失败:", error);
      return false;
    }
  }
  function getCurrentPagePath() {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return "/" + currentPage.route;
    }
    return "";
  }
  function isWhiteListPage(pagePath = "") {
    try {
      const path = pagePath || getCurrentPagePath();
      if (!path) {
        formatAppLog("log", "at utils/auth.js:51", "无法获取页面路径，默认允许访问");
        return true;
      }
      const isWhiteList = WHITE_LIST.some((whitePath) => {
        return path === whitePath || path.includes(whitePath.replace("/pages/", ""));
      });
      formatAppLog("log", "at utils/auth.js:60", `页面路径: ${path}, 是否在白名单: ${isWhiteList}`);
      return isWhiteList;
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:63", "检查白名单页面失败:", error);
      return true;
    }
  }
  function redirectToLogin(redirectUrl = "") {
    const currentPath = getCurrentPagePath();
    if (!isWhiteListPage(currentPath)) {
      redirectUrl = currentPath;
    }
    if (redirectUrl) {
      uni.setStorageSync("redirectUrl", redirectUrl);
    }
    uni.navigateTo({
      url: "/pages/denglu/login",
      fail: (error) => {
        formatAppLog("error", "at utils/auth.js:89", "跳转登录页面失败:", error);
        uni.switchTab({
          url: "/pages/denglu/login"
        });
      }
    });
  }
  function checkLoginAndRedirect(redirectUrl = "") {
    if (!isLoggedIn()) {
      if (!isWhiteListPage()) {
        formatAppLog("log", "at utils/auth.js:107", "用户未登录，强制跳转到登录页面");
        redirectToLogin(redirectUrl);
        return false;
      }
    }
    return true;
  }
  function forceCheckLogin() {
    try {
      const isLoggedIn2 = uni.getStorageSync("isLoggedIn");
      const userInfo = uni.getStorageSync("userInfo");
      if (!isLoggedIn2 || !userInfo) {
        formatAppLog("log", "at utils/auth.js:125", "强制检查：用户未登录，清除所有状态");
        clearAllUserData();
        return false;
      }
      return true;
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:132", "强制检查登录状态时发生错误:", error);
      try {
        clearAllUserData();
      } catch (clearError) {
        formatAppLog("error", "at utils/auth.js:137", "清除数据失败:", clearError);
      }
      return false;
    }
  }
  function handleLoginSuccess(userInfo) {
    uni.setStorageSync("userInfo", userInfo);
    uni.setStorageSync("isLoggedIn", true);
    const redirectUrl = uni.getStorageSync("redirectUrl");
    if (redirectUrl) {
      uni.removeStorageSync("redirectUrl");
      if (redirectUrl.includes("/pages/")) {
        if (isTabBarPage(redirectUrl)) {
          uni.switchTab({
            url: redirectUrl
          });
        } else {
          uni.navigateTo({
            url: redirectUrl
          });
        }
      }
    } else {
      uni.switchTab({
        url: "/pages/index/index"
      });
    }
  }
  function logout(options = {}) {
    const {
      showConfirm = true,
      syncToServer = true,
      reason = "用户主动退出"
    } = options;
    const performLogout = async () => {
      try {
        formatAppLog("log", "at utils/auth.js:196", "开始退出登录流程");
        logLogoutEvent(reason);
        clearAllUserData();
        formatAppLog("log", "at utils/auth.js:203", "用户数据已清除");
        if (syncToServer) {
          try {
            await syncLogoutToServer(reason);
            formatAppLog("log", "at utils/auth.js:209", "服务器同步完成");
          } catch (syncError) {
            formatAppLog("warn", "at utils/auth.js:211", "服务器同步失败，但继续退出流程:", syncError);
          }
        }
        uni.showToast({
          title: "已安全退出登录",
          icon: "success",
          duration: 1500
        });
        formatAppLog("log", "at utils/auth.js:223", "跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
          success: () => {
            formatAppLog("log", "at utils/auth.js:227", "已成功跳转到登录页面");
          },
          fail: (error) => {
            formatAppLog("error", "at utils/auth.js:230", "跳转失败:", error);
            uni.navigateTo({
              url: "/pages/denglu/login",
              fail: () => {
                formatAppLog("error", "at utils/auth.js:235", "所有跳转方式都失败");
                uni.showToast({
                  title: "跳转失败，请手动返回登录页面",
                  icon: "none"
                });
              }
            });
          }
        });
      } catch (error) {
        formatAppLog("error", "at utils/auth.js:246", "退出登录过程中发生错误:", error);
        try {
          clearAllUserData();
        } catch (clearError) {
          formatAppLog("error", "at utils/auth.js:252", "清除数据失败:", clearError);
        }
        uni.showToast({
          title: "退出登录失败，请重试",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/denglu/login",
            fail: () => {
              uni.navigateTo({ url: "/pages/denglu/login" });
            }
          });
        }, 1e3);
      }
    };
    if (showConfirm) {
      uni.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？退出后将清除所有登录信息。",
        confirmText: "确认退出",
        cancelText: "取消",
        confirmColor: "#e74c3c",
        success: (res) => {
          if (res.confirm) {
            performLogout();
          }
        }
      });
    } else {
      performLogout();
    }
  }
  function clearAllUserData() {
    const keysToRemove = [
      "userInfo",
      "isLoggedIn",
      "redirectUrl",
      "recentUser",
      "rememberedPassword",
      "token",
      "refreshToken",
      "userPreferences",
      "lastLoginTime",
      "sessionData"
    ];
    keysToRemove.forEach((key) => {
      try {
        uni.removeStorageSync(key);
      } catch (error) {
        formatAppLog("warn", "at utils/auth.js:315", `清除存储键 ${key} 失败:`, error);
      }
    });
    try {
      const allKeys = uni.getStorageInfoSync().keys;
      allKeys.forEach((key) => {
        if (key.startsWith("user_") || key.startsWith("auth_") || key.includes("login")) {
          uni.removeStorageSync(key);
        }
      });
    } catch (error) {
      formatAppLog("warn", "at utils/auth.js:328", "清除用户相关数据失败:", error);
    }
  }
  function logLogoutEvent(reason) {
    const logoutData = {
      timestamp: Date.now(),
      reason,
      platform: uni.getSystemInfoSync().platform,
      version: "1.0.0"
    };
    try {
      const logoutLogs = uni.getStorageSync("logoutLogs") || [];
      logoutLogs.push(logoutData);
      if (logoutLogs.length > 10) {
        logoutLogs.splice(0, logoutLogs.length - 10);
      }
      uni.setStorageSync("logoutLogs", logoutLogs);
      formatAppLog("log", "at utils/auth.js:357", "用户退出登录:", logoutData);
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:359", "记录退出日志失败:", error);
    }
  }
  async function syncLogoutToServer(reason) {
    try {
      const userInfo = getUserInfo();
      if (!userInfo) {
        formatAppLog("log", "at utils/auth.js:372", "用户信息不存在，跳过服务器同步");
        return;
      }
      const logoutData = {
        userId: userInfo.id,
        username: userInfo.username,
        phone: userInfo.phone,
        reason,
        timestamp: Date.now(),
        platform: uni.getSystemInfoSync().platform,
        deviceId: getDeviceId()
      };
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.1;
          if (success) {
            resolve();
          } else {
            reject(new Error("网络请求失败"));
          }
        }, 500);
      });
      formatAppLog("log", "at utils/auth.js:403", "退出登录已同步到服务器:", logoutData);
      saveLogoutRecord(logoutData);
    } catch (error) {
      formatAppLog("warn", "at utils/auth.js:409", "同步退出到服务器失败:", error);
    }
  }
  function getDeviceId() {
    try {
      const systemInfo = uni.getSystemInfoSync();
      return `${systemInfo.platform}_${systemInfo.model}_${systemInfo.system}`;
    } catch (error) {
      return "unknown_device";
    }
  }
  function saveLogoutRecord(logoutData) {
    try {
      const logoutRecords = uni.getStorageSync("logoutRecords") || [];
      logoutRecords.push(logoutData);
      if (logoutRecords.length > 20) {
        logoutRecords.splice(0, logoutRecords.length - 20);
      }
      uni.setStorageSync("logoutRecords", logoutRecords);
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:443", "保存退出记录失败:", error);
    }
  }
  function isTabBarPage(pagePath) {
    const tabBarPages = [
      "/pages/index/index",
      "/pages/wealth/wealth",
      "/pages/life/life",
      "/pages/user/user"
    ];
    return tabBarPages.some((tabPath) => pagePath.includes(tabPath));
  }
  function getUserInfo() {
    try {
      return uni.getStorageSync("userInfo");
    } catch (error) {
      formatAppLog("error", "at utils/auth.js:484", "获取用户信息失败:", error);
      return null;
    }
  }
  function quickLogout(reason = "快速退出") {
    logout({
      showConfirm: false,
      syncToServer: true,
      reason
    });
  }
  function forceLogout(reason = "强制退出") {
    logout({
      showConfirm: false,
      syncToServer: false,
      reason
    });
  }
  const _imports_0$1 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$9 = {
    data() {
      return {
        loginMethod: "password",
        // 默认密码登录
        phoneForm: {
          phone: "",
          code: ""
        },
        passwordForm: {
          username: "",
          password: ""
        },
        showPassword: false,
        rememberPassword: false,
        isLoading: false,
        errorMessage: "",
        codeCountdown: 0
      };
    },
    computed: {},
    methods: {
      // 切换登录方式
      switchLoginMethod(method) {
        this.loginMethod = method;
        this.clearError();
      },
      // 切换密码显示
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      // 切换记住密码
      toggleRememberPassword(e) {
        this.rememberPassword = e.detail.value;
      },
      // 清除错误信息
      clearError() {
        this.errorMessage = "";
      },
      // 发送验证码
      async sendVerificationCode() {
        if (!this.phoneForm.phone.trim()) {
          this.errorMessage = "请输入手机号";
          return;
        }
        if (!/^1[3-9]\d{9}$/.test(this.phoneForm.phone)) {
          this.errorMessage = "请输入正确的手机号";
          return;
        }
        try {
          const code = generateVerificationCode(this.phoneForm.phone);
          uni.showToast({
            title: `验证码：${code}`,
            icon: "none",
            duration: 3e3
          });
          this.codeCountdown = 60;
          const timer = setInterval(() => {
            this.codeCountdown--;
            if (this.codeCountdown <= 0) {
              clearInterval(timer);
            }
          }, 1e3);
        } catch (error) {
          this.errorMessage = "发送验证码失败";
          formatAppLog("error", "at pages/denglu/login.vue:230", "发送验证码错误:", error);
        }
      },
      // 表单验证
      validateForm() {
        if (this.loginMethod === "phone") {
          if (!this.phoneForm.phone.trim()) {
            this.errorMessage = "请输入手机号";
            return false;
          }
          if (!/^1[3-9]\d{9}$/.test(this.phoneForm.phone)) {
            this.errorMessage = "请输入正确的手机号";
            return false;
          }
          if (!this.phoneForm.code.trim()) {
            this.errorMessage = "请输入验证码";
            return false;
          }
          if (!/^\d{6}$/.test(this.phoneForm.code)) {
            this.errorMessage = "请输入6位验证码";
            return false;
          }
        } else if (this.loginMethod === "password") {
          if (!this.passwordForm.username.trim()) {
            this.errorMessage = "请输入用户名或手机号";
            return false;
          }
          if (!this.passwordForm.password.trim()) {
            this.errorMessage = "请输入密码";
            return false;
          }
        }
        return true;
      },
      // 处理登录
      async handleLogin() {
        if (!this.validateForm()) {
          return;
        }
        this.isLoading = true;
        this.errorMessage = "";
        try {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          let user = null;
          if (this.loginMethod === "phone") {
            if (verifyCode(this.phoneForm.phone, this.phoneForm.code)) {
              const { users: users2 } = await __vitePreload(() => Promise.resolve().then(() => users$1), false ? "__VITE_PRELOAD__" : void 0);
              user = users2.find((u) => u.phone === this.phoneForm.phone);
            } else {
              this.errorMessage = "验证码错误或已过期";
              return;
            }
          } else if (this.loginMethod === "password") {
            user = validateUser(this.passwordForm.username, this.passwordForm.password);
          }
          if (user) {
            uni.setStorageSync("recentUser", user);
            if (this.rememberPassword) {
              uni.setStorageSync("rememberedPassword", this.passwordForm.password);
            }
            uni.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              handleLoginSuccess(user);
            }, 1500);
            this.$forceUpdate();
          } else {
            this.errorMessage = this.loginMethod === "phone" ? "手机号不存在" : "用户名或密码错误";
          }
        } catch (error) {
          this.errorMessage = "登录失败，请重试";
          formatAppLog("error", "at pages/denglu/login.vue:323", "登录错误:", error);
        } finally {
          this.isLoading = false;
        }
      },
      // 忘记密码
      forgotPassword() {
        uni.showToast({
          title: "请联系客服重置密码",
          icon: "none"
        });
      },
      // 注册账号
      goToRegister() {
        uni.showToast({
          title: "请到银行网点办理开户",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" 顶部Logo区域 "),
      vue.createElementVNode("view", { class: "logo-section" }, [
        vue.createElementVNode("image", {
          class: "logo",
          src: _imports_0$1,
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "app-name" }, "农业银行"),
        vue.createElementVNode("text", { class: "app-slogan" }, "安全便捷的金融服务")
      ]),
      vue.createCommentVNode(" 登录方式选择 "),
      vue.createElementVNode("view", { class: "login-methods" }, [
        vue.createCommentVNode(" 手机号验证码登录卡片 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["login-card", { "active": $data.loginMethod === "phone" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.switchLoginMethod("phone"))
          },
          [
            vue.createElementVNode("view", { class: "card-icon" }, "📱"),
            vue.createElementVNode("text", { class: "card-title" }, "手机号登录"),
            vue.createElementVNode("text", { class: "card-desc" }, "验证码快速登录")
          ],
          2
          /* CLASS */
        ),
        vue.createCommentVNode(" 用户名密码登录卡片 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["login-card", { "active": $data.loginMethod === "password" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.switchLoginMethod("password"))
          },
          [
            vue.createElementVNode("view", { class: "card-icon" }, "🔐"),
            vue.createElementVNode("text", { class: "card-title" }, "密码登录"),
            vue.createElementVNode("text", { class: "card-desc" }, "用户名密码登录")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 登录表单 "),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createCommentVNode(" 手机号验证码登录表单 "),
        $data.loginMethod === "phone" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "📱"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-field",
                  type: "number",
                  placeholder: "请输入手机号",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.phoneForm.phone = $event),
                  maxlength: "11",
                  onInput: _cache[3] || (_cache[3] = (...args) => $options.clearError && $options.clearError(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.phoneForm.phone]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔢"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-field",
                  type: "number",
                  placeholder: "请输入验证码",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.phoneForm.code = $event),
                  maxlength: "6",
                  onInput: _cache[5] || (_cache[5] = (...args) => $options.clearError && $options.clearError(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.phoneForm.code]
              ]),
              vue.createElementVNode("button", {
                class: "send-code-btn",
                disabled: $data.codeCountdown > 0,
                onClick: _cache[6] || (_cache[6] = (...args) => $options.sendVerificationCode && $options.sendVerificationCode(...args))
              }, vue.toDisplayString($data.codeCountdown > 0 ? `${$data.codeCountdown}s` : "发送验证码"), 9, ["disabled"])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 用户名密码登录表单 "),
        $data.loginMethod === "password" ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "👤"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-field",
                  type: "text",
                  placeholder: "请输入用户名或手机号",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.passwordForm.username = $event),
                  onInput: _cache[8] || (_cache[8] = (...args) => $options.clearError && $options.clearError(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.passwordForm.username]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "input-field",
                type: $data.showPassword ? "text" : "password",
                placeholder: "请输入密码",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.passwordForm.password = $event),
                onInput: _cache[10] || (_cache[10] = (...args) => $options.clearError && $options.clearError(...args))
              }, null, 40, ["type"]), [
                [vue.vModelDynamic, $data.passwordForm.password]
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "password-toggle",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.togglePassword && $options.togglePassword(...args))
                },
                vue.toDisplayString($data.showPassword ? "👁️" : "👁️‍🗨️"),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "remember-password" }, [
              vue.createElementVNode("checkbox", {
                checked: $data.rememberPassword,
                onChange: _cache[12] || (_cache[12] = (...args) => $options.toggleRememberPassword && $options.toggleRememberPassword(...args)),
                color: "#667eea"
              }, null, 40, ["checked"]),
              vue.createElementVNode("text", { class: "remember-text" }, "记住密码")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 错误提示 "),
        $data.errorMessage ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 2,
            class: "error-message"
          },
          vue.toDisplayString($data.errorMessage),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 登录按钮 "),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["login-btn", { "loading": $data.isLoading }]),
          disabled: $data.isLoading,
          onClick: _cache[13] || (_cache[13] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        }, [
          !$data.isLoading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "登录")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "登录中..."))
        ], 10, ["disabled"]),
        vue.createCommentVNode(" 其他选项 "),
        vue.createElementVNode("view", { class: "other-options" }, [
          vue.createElementVNode("text", {
            class: "forgot-password",
            onClick: _cache[14] || (_cache[14] = (...args) => $options.forgotPassword && $options.forgotPassword(...args))
          }, "忘记密码？"),
          vue.createElementVNode("text", {
            class: "register-link",
            onClick: _cache[15] || (_cache[15] = (...args) => $options.goToRegister && $options.goToRegister(...args))
          }, "注册账号")
        ])
      ]),
      vue.createCommentVNode(" 测试账号提示 "),
      vue.createElementVNode("view", { class: "test-accounts" }, [
        vue.createElementVNode("text", { class: "test-title" }, "测试账号："),
        vue.createElementVNode("text", { class: "test-item" }, "手机号：13800138000，验证码：123456"),
        vue.createElementVNode("text", { class: "test-item" }, "用户名：admin，密码：123456"),
        vue.createElementVNode("text", { class: "test-item" }, "用户名：test，密码：test123")
      ])
    ]);
  }
  const PagesDengluLogin = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-6f56e16f"], ["__file", "E:/项目/yihangyidon/src/pages/denglu/login.vue"]]);
  const _sfc_main$8 = {
    name: "Index",
    onLoad(options) {
      formatAppLog("log", "at pages/index/index.vue:14", "首页加载", options);
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/index/index.vue:21", "首页：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/index/index.vue:29", "首页显示");
      } catch (error) {
        formatAppLog("error", "at pages/index/index.vue:31", "首页onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "home-container" }, [
      vue.createElementVNode("h1", null, "首页")
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "E:/项目/yihangyidon/src/pages/index/index.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        userInfo: null
      };
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/user/user.vue:59", "个人中心：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login",
            fail: (error) => {
              formatAppLog("error", "at pages/user/user.vue:63", "个人中心跳转失败:", error);
              uni.navigateTo({ url: "/pages/denglu/login" });
            }
          });
          return;
        }
        this.checkLoginStatus();
      } catch (error) {
        formatAppLog("error", "at pages/user/user.vue:72", "个人中心onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login",
          fail: () => {
            uni.navigateTo({ url: "/pages/denglu/login" });
          }
        });
      }
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        const userInfo = getUserInfo();
        if (userInfo) {
          this.userInfo = userInfo;
        } else {
          this.userInfo = null;
        }
      },
      // 跳转到登录页面
      goToLogin() {
        uni.navigateTo({
          url: "/pages/denglu/login"
        });
      },
      // 查看退出记录
      viewLogoutHistory() {
        try {
          const logoutLogs = uni.getStorageSync("logoutLogs") || [];
          if (logoutLogs.length === 0) {
            uni.showToast({
              title: "暂无退出记录",
              icon: "none"
            });
            return;
          }
          const formattedLogs = logoutLogs.map((log) => {
            const date = new Date(log.timestamp);
            return `${date.toLocaleString()}
原因：${log.reason}
平台：${log.platform}`;
          }).join("\n\n");
          uni.showModal({
            title: "退出记录",
            content: formattedLogs,
            showCancel: false,
            confirmText: "确定"
          });
        } catch (error) {
          formatAppLog("error", "at pages/user/user.vue:126", "查看退出记录失败:", error);
          uni.showToast({
            title: "查看记录失败",
            icon: "none"
          });
        }
      },
      // 退出登录
      handleLogout() {
        uni.showActionSheet({
          itemList: ["普通退出", "快速退出", "强制退出"],
          success: (res) => {
            switch (res.tapIndex) {
              case 0:
                logout({
                  showConfirm: true,
                  syncToServer: true,
                  reason: "用户从个人中心退出"
                });
                break;
              case 1:
                quickLogout("用户快速退出");
                break;
              case 2:
                uni.showModal({
                  title: "强制退出确认",
                  content: "强制退出将清除所有数据且不同步服务器，确定继续吗？",
                  confirmText: "确定",
                  cancelText: "取消",
                  confirmColor: "#e74c3c",
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      forceLogout("用户强制退出");
                    }
                  }
                });
                break;
            }
          }
        });
      },
      goToProfile() {
        uni.showToast({
          title: "个人资料",
          icon: "none"
        });
      },
      goToSettings() {
        uni.showToast({
          title: "设置",
          icon: "none"
        });
      },
      goToHelp() {
        uni.showToast({
          title: "帮助中心",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "user-page" }, [
      vue.createCommentVNode(" 用户信息头部 "),
      $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "user-header"
      }, [
        vue.createElementVNode("view", { class: "avatar" }, [
          vue.createElementVNode("image", {
            src: $data.userInfo.avatar,
            mode: "aspectFill"
          }, null, 8, ["src"])
        ]),
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode(
            "text",
            { class: "username" },
            vue.toDisplayString($data.userInfo.nickname),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "user-desc" },
            vue.toDisplayString($data.userInfo.phone),
            1
            /* TEXT */
          )
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 未登录状态 "),
          vue.createElementVNode("view", { class: "login-prompt" }, [
            vue.createElementVNode("text", { class: "prompt-text" }, "请先登录"),
            vue.createElementVNode("button", {
              class: "login-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
            }, "立即登录")
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 功能菜单 "),
      $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "menu-list"
      }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.goToProfile && $options.goToProfile(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-text" }, "个人资料"),
          vue.createElementVNode("text", { class: "arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.goToSettings && $options.goToSettings(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-text" }, "设置"),
          vue.createElementVNode("text", { class: "arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.goToHelp && $options.goToHelp(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-text" }, "帮助中心"),
          vue.createElementVNode("text", { class: "arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.viewLogoutHistory && $options.viewLogoutHistory(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-text" }, "退出记录"),
          vue.createElementVNode("text", { class: "arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-text logout-text" }, "退出登录"),
          vue.createElementVNode("text", { class: "arrow" }, ">")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-99b0ba47"], ["__file", "E:/项目/yihangyidon/src/pages/user/user.vue"]]);
  const _sfc_main$6 = {
    name: "Wealth",
    onLoad(options) {
      formatAppLog("log", "at pages/wealth/wealth.vue:14", "财富页面加载", options);
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/wealth/wealth.vue:21", "财富页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/wealth/wealth.vue:29", "财富页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/wealth/wealth.vue:31", "财富页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "doctor-page" }, [
      vue.createElementVNode("h1", null, "财富")
    ]);
  }
  const PagesWealthWealth = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "E:/项目/yihangyidon/src/pages/wealth/wealth.vue"]]);
  const _imports_0 = "/static/banner1.png";
  const _imports_1 = "/static/banner2.png";
  const _imports_2 = "/static/frog-mascot.png";
  const _imports_3 = "/static/train-bg.png";
  const _imports_4 = "/static/tea-bg.png";
  const _sfc_main$5 = {
    name: "LifePage",
    data() {
      return {
        activeCategory: 0,
        categories: ["精选", "活动", "折扣", "品牌"],
        quickServices: [
          {
            icon: "⚡",
            label: "生活缴费",
            bgColor: "#00D4AA",
            action: "payment"
          },
          {
            icon: "¥",
            label: "手机充值",
            bgColor: "#FF9500",
            action: "recharge"
          },
          {
            icon: "👥",
            label: "政务民生",
            bgColor: "#34C759",
            action: "government"
          },
          { icon: "🎯", label: "小豆乐园", bgColor: "#FF6B35", action: "games" }
        ],
        allServices: [
          { icon: "🏫", label: "校园", bgColor: "#5AC8FA", action: "campus" },
          { icon: "⚡", label: "食堂", bgColor: "#30D158", action: "canteen" },
          { icon: "🎉", label: "党费", bgColor: "#FF3B30", action: "party" },
          {
            icon: "👨‍⚕️",
            label: "养老服务",
            bgColor: "#007AFF",
            action: "elderly"
          },
          {
            icon: "📄",
            label: "社保医保",
            bgColor: "#34C759",
            action: "insurance"
          },
          { icon: "🌿", label: "低碳空间", bgColor: "#32D74B", action: "carbon" },
          {
            icon: "🎫",
            label: "优惠卡券",
            bgColor: "#AF52DE",
            action: "coupons"
          },
          { icon: "🎁", label: "京东特惠", bgColor: "#FF9500", action: "jd" },
          { icon: "🏪", label: "城市专区", bgColor: "#5856D6", action: "city" },
          { icon: "🎊", label: "热门活动", bgColor: "#FF2D92", action: "events" }
        ]
      };
    },
    onLoad() {
      this.initPage();
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/life/life.vue:233", "生活页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/life/life.vue:241", "生活页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/life/life.vue:243", "生活页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      initPage() {
        formatAppLog("log", "at pages/life/life.vue:253", "生活页面初始化");
      },
      handleServiceTap(service) {
        formatAppLog("log", "at pages/life/life.vue:257", "点击服务:", service);
        switch (service.action) {
          case "payment":
            this.goToPayment();
            break;
          case "recharge":
            this.goToRecharge();
            break;
          case "government":
            this.goToGovernment();
            break;
          case "games":
            this.goToGames();
            break;
          default:
            uni.showToast({
              title: `即将跳转到${service.label}`,
              icon: "none"
            });
        }
      },
      switchCategory(index) {
        this.activeCategory = index;
        formatAppLog("log", "at pages/life/life.vue:282", "切换分类:", this.categories[index]);
      },
      goToPayment() {
        formatAppLog("log", "at pages/life/life.vue:286", "跳转到生活缴费页面");
        uni.navigateTo({
          url: "/pages/payment/payment",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:290", "成功跳转到生活缴费页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:293", "跳转失败:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      },
      goToRecharge() {
        formatAppLog("log", "at pages/life/life.vue:303", "跳转到手机充值页面");
        uni.navigateTo({
          url: "/pages/recharge/recharge",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:307", "成功跳转到手机充值页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:310", "跳转失败:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      },
      goToGovernment() {
        uni.navigateTo({
          url: "/pages/government/government"
        });
      },
      goToGames() {
        uni.navigateTo({
          url: "/pages/games/games"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "life-page" }, [
      vue.createCommentVNode(" 头部搜索区域 "),
      vue.createElementVNode("view", { class: "header-section" }, [
        vue.createElementVNode("view", { class: "location-info" }, [
          vue.createElementVNode("view", { class: "location-icon" }, "📍"),
          vue.createElementVNode("text", { class: "location-text" }, "牡丹江")
        ]),
        vue.createElementVNode("view", { class: "search-container" }, [
          vue.createElementVNode("view", { class: "search-box" }, [
            vue.createElementVNode("view", { class: "search-icon" }, "🔍"),
            vue.createElementVNode("input", {
              class: "search-input",
              placeholder: "本地优惠",
              "placeholder-style": "color: rgba(255,255,255,0.7)"
            }),
            vue.createElementVNode("view", { class: "voice-icon" }, "🎤")
          ])
        ]),
        vue.createElementVNode("view", { class: "header-actions" }, [
          vue.createElementVNode("view", { class: "action-item" }, [
            vue.createElementVNode("text", { class: "action-icon" }, "📝"),
            vue.createElementVNode("text", { class: "action-text" }, "记事")
          ]),
          vue.createElementVNode("view", { class: "action-item" }, [
            vue.createElementVNode("text", { class: "action-icon" }, "🗂️"),
            vue.createElementVNode("text", { class: "action-text" }, "卡券")
          ])
        ])
      ]),
      vue.createCommentVNode(" 轮播广告 "),
      vue.createElementVNode("view", { class: "banner-section" }, [
        vue.createElementVNode("swiper", {
          class: "banner-swiper",
          "indicator-dots": true,
          autoplay: true,
          interval: 3e3,
          "indicator-color": "rgba(255,255,255,0.5)",
          "indicator-active-color": "#fff"
        }, [
          vue.createElementVNode("swiper-item", null, [
            vue.createElementVNode("view", { class: "banner-item" }, [
              vue.createElementVNode("text", { class: "banner-title" }, "京东购物用农行信用卡"),
              vue.createElementVNode("text", { class: "banner-subtitle" }, "积分抵现至高10%"),
              vue.createElementVNode("image", {
                class: "banner-image",
                src: _imports_0,
                mode: "aspectFit"
              })
            ])
          ]),
          vue.createElementVNode("swiper-item", null, [
            vue.createElementVNode("view", { class: "banner-item" }, [
              vue.createElementVNode("text", { class: "banner-title" }, "生活缴费享优惠"),
              vue.createElementVNode("text", { class: "banner-subtitle" }, "水电燃气一键支付"),
              vue.createElementVNode("image", {
                class: "banner-image",
                src: _imports_1,
                mode: "aspectFit"
              })
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 快捷服务 "),
      vue.createElementVNode("view", { class: "quick-services" }, [
        vue.createElementVNode("view", { class: "services-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.quickServices, (service, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "service-item",
                key: index,
                onClick: ($event) => $options.handleServiceTap(service)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "service-icon",
                    style: vue.normalizeStyle({ backgroundColor: service.bgColor })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "icon-text" },
                      vue.toDisplayString(service.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "service-label" },
                  vue.toDisplayString(service.label),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 全部服务 "),
      vue.createElementVNode("view", { class: "all-services" }, [
        vue.createElementVNode("view", { class: "services-grid-large" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.allServices, (service, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "service-item-large",
                key: index,
                onClick: ($event) => $options.handleServiceTap(service)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "service-icon-large",
                    style: vue.normalizeStyle({ backgroundColor: service.bgColor })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "icon-text-large" },
                      vue.toDisplayString(service.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "service-label-large" },
                  vue.toDisplayString(service.label),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 分类导航 "),
      vue.createElementVNode("view", { class: "category-nav" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.categories, (category, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["nav-item", { active: $data.activeCategory === index }]),
              key: index,
              onClick: ($event) => $options.switchCategory(index)
            }, [
              vue.createElementVNode(
                "text",
                { class: "nav-text" },
                vue.toDisplayString(category),
                1
                /* TEXT */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 优惠活动卡片 "),
      vue.createElementVNode("view", { class: "promotion-section" }, [
        vue.createElementVNode("view", { class: "promotion-cards" }, [
          vue.createElementVNode("view", { class: "promotion-card large" }, [
            vue.createElementVNode("view", { class: "card-content" }, [
              vue.createElementVNode("text", { class: "card-title" }, "积分当钱花"),
              vue.createElementVNode("text", { class: "card-subtitle" }, "至高抵现50%"),
              vue.createElementVNode("text", { class: "card-desc" }, "积分当钱花优惠手不..."),
              vue.createElementVNode("text", { class: "card-detail" }, "至高抵现50%"),
              vue.createElementVNode("image", {
                class: "card-mascot",
                src: _imports_2,
                mode: "aspectFit"
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "promotion-cards-right" }, [
            vue.createElementVNode("view", { class: "promotion-card small" }, [
              vue.createElementVNode("text", { class: "card-title-small" }, "车票优惠享"),
              vue.createElementVNode("text", { class: "card-subtitle-small" }, "最高88元12306立减金"),
              vue.createElementVNode("image", {
                class: "card-bg",
                src: _imports_3,
                mode: "aspectFill"
              })
            ]),
            vue.createElementVNode("view", { class: "promotion-card small" }, [
              vue.createElementVNode("text", { class: "card-title-small" }, "茶颜优惠券"),
              vue.createElementVNode("text", { class: "card-subtitle-small" }, "新用户专享首杯至5.9元"),
              vue.createElementVNode("image", {
                class: "card-bg",
                src: _imports_4,
                mode: "aspectFill"
              })
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesLifeLife = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-980f0516"], ["__file", "E:/项目/yihangyidon/src/pages/life/life.vue"]]);
  const BASE_URL = "https://api.abchina.com";
  const TIMEOUT = 1e4;
  const requestInterceptor = (config) => {
    const token = uni.getStorageSync("token");
    if (token) {
      config.header = {
        ...config.header,
        "Authorization": `Bearer ${token}`
      };
    }
    config.header = {
      "Content-Type": "application/json",
      "X-Client-Type": "uni-app",
      ...config.header
    };
    return config;
  };
  const responseInterceptor = (response) => {
    const { statusCode, data } = response;
    if (statusCode === 200) {
      if (data.code === 0) {
        return data.data;
      } else {
        uni.showToast({
          title: data.message || "请求失败",
          icon: "none"
        });
        return Promise.reject(data);
      }
    } else if (statusCode === 401) {
      uni.removeStorageSync("token");
      uni.removeStorageSync("userInfo");
      uni.navigateTo({
        url: "/login/login"
      });
      return Promise.reject("登录已过期");
    } else {
      uni.showToast({
        title: "网络错误，请稍后重试",
        icon: "none"
      });
      return Promise.reject("网络错误");
    }
  };
  const request = (options) => {
    return new Promise((resolve, reject) => {
      let config = {
        url: BASE_URL + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: options.header || {},
        timeout: options.timeout || TIMEOUT
      };
      config = requestInterceptor(config);
      uni.request({
        ...config,
        success: (response) => {
          try {
            const result = responseInterceptor(response);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (error) => {
          formatAppLog("error", "at utils/request.js:98", "请求失败:", error);
          uni.showToast({
            title: "网络连接失败",
            icon: "none"
          });
          reject(error);
        }
      });
    });
  };
  const http = {
    get: (url, params = {}) => {
      return request({
        url: url + (Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : ""),
        method: "GET"
      });
    },
    post: (url, data = {}) => {
      return request({
        url,
        method: "POST",
        data
      });
    },
    put: (url, data = {}) => {
      return request({
        url,
        method: "PUT",
        data
      });
    },
    delete: (url) => {
      return request({
        url,
        method: "DELETE"
      });
    }
  };
  const payLifeBill = (paymentInfo) => {
    return http.post("/life/payment", paymentInfo);
  };
  const mobileRecharge = (rechargeInfo) => {
    return http.post("/life/recharge", rechargeInfo);
  };
  const getPaymentHistory = (params) => {
    return http.get("/life/payment-history", params);
  };
  const queryUtilityBill = (queryInfo) => {
    return http.post("/life/utility/query", queryInfo);
  };
  const _sfc_main$4 = {
    name: "PaymentPage",
    data() {
      return {
        selectedType: null,
        paymentForm: {
          number: "",
          address: "",
          amount: ""
        },
        paymentTypes: [
          {
            icon: "💡",
            label: "电费",
            bgColor: "#FFD700",
            type: "electric",
            numberLabel: "电费户号",
            showAddress: true
          },
          {
            icon: "💧",
            label: "水费",
            bgColor: "#1E90FF",
            type: "water",
            numberLabel: "水费户号",
            showAddress: true
          },
          {
            icon: "🔥",
            label: "燃气费",
            bgColor: "#FF6347",
            type: "gas",
            numberLabel: "燃气户号",
            showAddress: true
          },
          {
            icon: "📱",
            label: "话费",
            bgColor: "#32CD32",
            type: "phone",
            numberLabel: "手机号码",
            showAddress: false
          },
          {
            icon: "📺",
            label: "有线电视",
            bgColor: "#9370DB",
            type: "tv",
            numberLabel: "用户编号",
            showAddress: true
          },
          {
            icon: "🌐",
            label: "宽带费",
            bgColor: "#FF1493",
            type: "internet",
            numberLabel: "宽带账号",
            showAddress: true
          }
        ],
        paymentHistory: [
          {
            typeIcon: "💡",
            title: "电费缴费",
            detail: "户号: 123456789",
            amount: "156.80",
            status: "成功"
          },
          {
            typeIcon: "💧",
            title: "水费缴费",
            detail: "户号: 987654321",
            amount: "89.50",
            status: "成功"
          },
          {
            typeIcon: "📱",
            title: "话费充值",
            detail: "手机: 138****8888",
            amount: "100.00",
            status: "成功"
          }
        ]
      };
    },
    computed: {
      canSubmit() {
        return this.paymentForm.number && this.paymentForm.amount && (!this.selectedType.showAddress || this.paymentForm.address);
      }
    },
    onLoad() {
      this.loadPaymentHistory();
    },
    methods: {
      selectPaymentType(type) {
        this.selectedType = type;
        this.paymentForm = {
          number: "",
          address: "",
          amount: ""
        };
      },
      async queryBill() {
        if (!this.paymentForm.number) {
          uni.showToast({
            title: `请输入${this.selectedType.numberLabel}`,
            icon: "none"
          });
          return;
        }
        try {
          uni.showLoading({ title: "查询中..." });
          const result = await queryUtilityBill({
            type: this.selectedType.type,
            number: this.paymentForm.number,
            address: this.paymentForm.address
          });
          if (result.amount) {
            this.paymentForm.amount = result.amount.toString();
            uni.showToast({
              title: "查询成功",
              icon: "success"
            });
          } else {
            uni.showToast({
              title: "暂无待缴费用",
              icon: "none"
            });
          }
        } catch (error) {
          uni.showToast({
            title: "查询失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      async submitPayment() {
        if (!this.canSubmit)
          return;
        try {
          uni.showLoading({ title: "缴费中..." });
          await payLifeBill({
            type: this.selectedType.type,
            number: this.paymentForm.number,
            address: this.paymentForm.address,
            amount: parseFloat(this.paymentForm.amount)
          });
          uni.showToast({
            title: "缴费成功",
            icon: "success"
          });
          this.loadPaymentHistory();
          this.paymentForm = {
            number: "",
            address: "",
            amount: ""
          };
        } catch (error) {
          uni.showToast({
            title: "缴费失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      async loadPaymentHistory() {
        try {
          const history = await getPaymentHistory({ limit: 3 });
          this.paymentHistory = history;
        } catch (error) {
          formatAppLog("error", "at pages/payment/payment.vue:298", "加载缴费记录失败:", error);
        }
      },
      viewAllHistory() {
        uni.navigateTo({
          url: "/pages/payment-history/payment-history"
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "payment-page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "生活缴费"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "水电燃气一键支付")
      ]),
      vue.createCommentVNode(" 缴费类型选择 "),
      vue.createElementVNode("view", { class: "payment-types" }, [
        vue.createElementVNode("view", { class: "types-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.paymentTypes, (type, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "type-item",
                key: index,
                onClick: ($event) => $options.selectPaymentType(type)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "type-icon",
                    style: vue.normalizeStyle({ backgroundColor: type.bgColor })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "icon-text" },
                      vue.toDisplayString(type.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "type-label" },
                  vue.toDisplayString(type.label),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 缴费表单 "),
      $data.selectedType ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "payment-form"
      }, [
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.selectedType.label) + "缴费",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode(
              "text",
              { class: "form-label" },
              vue.toDisplayString($data.selectedType.numberLabel),
              1
              /* TEXT */
            ),
            vue.withDirectives(vue.createElementVNode("input", {
              class: "form-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.paymentForm.number = $event),
              placeholder: `请输入${$data.selectedType.numberLabel}`,
              type: "text"
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.paymentForm.number]
            ])
          ]),
          $data.selectedType.showAddress ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "form-label" }, "缴费地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.paymentForm.address = $event),
                placeholder: "请输入详细地址",
                type: "text"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.paymentForm.address]
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "缴费金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input amount-input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.paymentForm.amount = $event),
                placeholder: "请输入缴费金额",
                type: "digit"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.paymentForm.amount]
            ])
          ])
        ]),
        vue.createCommentVNode(" 缴费按钮 "),
        vue.createElementVNode("view", { class: "payment-actions" }, [
          vue.createElementVNode("button", {
            class: "query-btn",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.queryBill && $options.queryBill(...args))
          }, "查询账单"),
          vue.createElementVNode("button", {
            class: "pay-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.submitPayment && $options.submitPayment(...args)),
            disabled: !$options.canSubmit
          }, " 立即缴费 ", 8, ["disabled"])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 缴费记录 "),
      vue.createElementVNode("view", { class: "payment-history" }, [
        vue.createElementVNode("view", { class: "history-header" }, [
          vue.createElementVNode("text", { class: "history-title" }, "最近缴费记录"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.viewAllHistory && $options.viewAllHistory(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "history-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.paymentHistory, (record, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "history-item",
                key: index
              }, [
                vue.createElementVNode("view", { class: "record-icon" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(record.typeIcon),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "record-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-title" },
                    vue.toDisplayString(record.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "record-detail" },
                    vue.toDisplayString(record.detail),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "record-amount" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "amount" },
                    "-¥" + vue.toDisplayString(record.amount),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "status" },
                    vue.toDisplayString(record.status),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesPaymentPayment = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-6e0fac4f"], ["__file", "E:/项目/yihangyidon/src/pages/payment/payment.vue"]]);
  const _sfc_main$3 = {
    name: "RechargePage",
    data() {
      return {
        activeType: 0,
        selectedAmount: null,
        customAmount: "",
        rechargeForm: {
          phone: ""
        },
        carrierInfo: {
          name: "",
          location: ""
        },
        rechargeTypes: [
          { label: "话费充值", type: "phone" },
          { label: "流量充值", type: "data" }
        ],
        phoneAmounts: [
          { value: 10, desc: "话费" },
          { value: 20, desc: "话费" },
          { value: 30, desc: "话费" },
          { value: 50, desc: "话费", discount: "95折" },
          { value: 100, desc: "话费", discount: "95折" },
          { value: 200, desc: "话费", discount: "9折" }
        ],
        dataAmounts: [
          { value: 10, desc: "1GB流量包" },
          { value: 20, desc: "3GB流量包" },
          { value: 30, desc: "5GB流量包" },
          { value: 50, desc: "10GB流量包", discount: "送2GB" },
          { value: 100, desc: "30GB流量包", discount: "送10GB" },
          { value: 150, desc: "50GB流量包", discount: "送20GB" }
        ],
        rechargeHistory: [
          {
            phone: "138****8888",
            amount: "50",
            time: "2024-01-15 14:30",
            status: "成功"
          },
          {
            phone: "139****9999",
            amount: "100",
            time: "2024-01-10 09:15",
            status: "成功"
          }
        ]
      };
    },
    computed: {
      currentAmounts() {
        return this.activeType === 0 ? this.phoneAmounts : this.dataAmounts;
      },
      finalAmount() {
        return this.selectedAmount || this.customAmount || 0;
      },
      canSubmit() {
        return this.rechargeForm.phone.length === 11 && this.finalAmount > 0;
      }
    },
    methods: {
      onPhoneInput() {
        if (this.rechargeForm.phone.length === 11) {
          this.getCarrierInfo();
        } else {
          this.carrierInfo = { name: "", location: "" };
        }
      },
      getCarrierInfo() {
        const phone = this.rechargeForm.phone;
        const prefix = phone.substring(0, 3);
        let carrier = "";
        if (["130", "131", "132", "155", "156", "185", "186"].includes(prefix)) {
          carrier = "中国联通";
        } else if (["134", "135", "136", "137", "138", "139", "150", "151", "152", "157", "158", "159", "182", "183", "184", "187", "188"].includes(prefix)) {
          carrier = "中国移动";
        } else if (["133", "153", "180", "181", "189"].includes(prefix)) {
          carrier = "中国电信";
        }
        this.carrierInfo = {
          name: carrier,
          location: "黑龙江 牡丹江"
        };
      },
      switchType(index) {
        this.activeType = index;
        this.selectedAmount = null;
        this.customAmount = "";
      },
      selectAmount(amount) {
        this.selectedAmount = amount.value;
        this.customAmount = "";
      },
      onCustomAmountInput() {
        this.selectedAmount = null;
      },
      selectFromContacts() {
        uni.showActionSheet({
          itemList: ["138****8888", "139****9999", "137****7777"],
          success: (res) => {
            const phones = ["13812348888", "13912349999", "13712347777"];
            this.rechargeForm.phone = phones[res.tapIndex];
            this.getCarrierInfo();
          }
        });
      },
      async submitRecharge() {
        if (!this.canSubmit)
          return;
        try {
          uni.showLoading({ title: "充值中..." });
          await mobileRecharge({
            phone: this.rechargeForm.phone,
            amount: this.finalAmount,
            type: this.rechargeTypes[this.activeType].type
          });
          uni.showToast({
            title: "充值成功",
            icon: "success"
          });
          this.rechargeHistory.unshift({
            phone: this.rechargeForm.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
            amount: this.finalAmount.toString(),
            time: (/* @__PURE__ */ new Date()).toLocaleString(),
            status: "成功"
          });
          this.rechargeForm.phone = "";
          this.selectedAmount = null;
          this.customAmount = "";
          this.carrierInfo = { name: "", location: "" };
        } catch (error) {
          uni.showToast({
            title: "充值失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      viewAllHistory() {
        uni.navigateTo({
          url: "/pages/recharge-history/recharge-history"
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "recharge-page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "手机充值"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "话费流量一键充值")
      ]),
      vue.createCommentVNode(" 充值表单 "),
      vue.createElementVNode("view", { class: "recharge-form" }, [
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "phone-input-section" }, [
            vue.createElementVNode("view", { class: "input-row" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "phone-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.rechargeForm.phone = $event),
                  placeholder: "请输入手机号码",
                  type: "number",
                  maxlength: "11",
                  onInput: _cache[1] || (_cache[1] = (...args) => $options.onPhoneInput && $options.onPhoneInput(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.rechargeForm.phone]
              ]),
              vue.createElementVNode("button", {
                class: "contacts-btn",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.selectFromContacts && $options.selectFromContacts(...args))
              }, "📞")
            ]),
            $data.carrierInfo.name ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "carrier-info"
            }, [
              vue.createElementVNode(
                "text",
                { class: "carrier-name" },
                vue.toDisplayString($data.carrierInfo.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "carrier-location" },
                vue.toDisplayString($data.carrierInfo.location),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 充值类型选择 "),
          vue.createElementVNode("view", { class: "recharge-types" }, [
            vue.createElementVNode("view", { class: "type-tabs" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.rechargeTypes, (type, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["tab-item", { active: $data.activeType === index }]),
                    key: index,
                    onClick: ($event) => $options.switchType(index)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "tab-text" },
                      vue.toDisplayString(type.label),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 金额选择 "),
          vue.createElementVNode("view", { class: "amount-section" }, [
            vue.createElementVNode("view", { class: "amount-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.currentAmounts, (amount, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["amount-item", { selected: $data.selectedAmount === amount.value }]),
                    key: index,
                    onClick: ($event) => $options.selectAmount(amount)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "amount-value" },
                      "¥" + vue.toDisplayString(amount.value),
                      1
                      /* TEXT */
                    ),
                    amount.desc ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "amount-desc"
                      },
                      vue.toDisplayString(amount.desc),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    amount.discount ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "discount-tag"
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "discount-text" },
                        vue.toDisplayString(amount.discount),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 自定义金额 "),
          vue.createElementVNode("view", { class: "custom-amount" }, [
            vue.createElementVNode("text", { class: "custom-label" }, "自定义金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "custom-input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.customAmount = $event),
                placeholder: "输入其他金额",
                type: "digit",
                onInput: _cache[4] || (_cache[4] = (...args) => $options.onCustomAmountInput && $options.onCustomAmountInput(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.customAmount]
            ])
          ])
        ]),
        vue.createCommentVNode(" 充值按钮 "),
        vue.createElementVNode("view", { class: "recharge-actions" }, [
          vue.createElementVNode("button", {
            class: "recharge-btn",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.submitRecharge && $options.submitRecharge(...args)),
            disabled: !$options.canSubmit
          }, " 立即充值 ¥" + vue.toDisplayString($options.finalAmount), 9, ["disabled"])
        ])
      ]),
      vue.createCommentVNode(" 充值记录 "),
      vue.createElementVNode("view", { class: "recharge-history" }, [
        vue.createElementVNode("view", { class: "history-header" }, [
          vue.createElementVNode("text", { class: "history-title" }, "最近充值记录"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.viewAllHistory && $options.viewAllHistory(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "history-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.rechargeHistory, (record, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "history-item",
                key: index
              }, [
                vue.createElementVNode("view", { class: "record-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-phone" },
                    vue.toDisplayString(record.phone),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "record-time" },
                    vue.toDisplayString(record.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "record-amount" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "amount" },
                    "¥" + vue.toDisplayString(record.amount),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "status" },
                    vue.toDisplayString(record.status),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesRechargeRecharge = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-d370def1"], ["__file", "E:/项目/yihangyidon/src/pages/recharge/recharge.vue"]]);
  const _sfc_main$2 = {
    name: "GovernmentPage",
    data() {
      return {
        activeCategory: 0,
        categories: [
          { name: "证件办理", type: "certificate" },
          { name: "社会保障", type: "social" },
          { name: "税务服务", type: "tax" },
          { name: "公积金", type: "fund" }
        ],
        certificateServices: [
          {
            icon: "🆔",
            label: "身份证",
            desc: "身份证办理",
            bgColor: "#007AFF",
            action: "id_card"
          },
          {
            icon: "📄",
            label: "户口本",
            desc: "户籍证明",
            bgColor: "#34C759",
            action: "household"
          },
          {
            icon: "🚗",
            label: "驾驶证",
            desc: "驾照服务",
            bgColor: "#FF9500",
            action: "license"
          },
          {
            icon: "🏠",
            label: "房产证",
            desc: "不动产证",
            bgColor: "#AF52DE",
            action: "property"
          }
        ],
        socialServices: [
          {
            icon: "🏥",
            label: "医保查询",
            desc: "医保信息",
            bgColor: "#FF3B30",
            action: "medical"
          },
          {
            icon: "👴",
            label: "养老保险",
            desc: "养老服务",
            bgColor: "#5AC8FA",
            action: "pension"
          },
          {
            icon: "💼",
            label: "失业保险",
            desc: "失业金",
            bgColor: "#FFCC02",
            action: "unemployment"
          },
          {
            icon: "👶",
            label: "生育保险",
            desc: "生育津贴",
            bgColor: "#FF2D92",
            action: "maternity"
          }
        ],
        taxServices: [
          {
            icon: "💰",
            label: "个税查询",
            desc: "个人所得税",
            bgColor: "#32D74B",
            action: "personal_tax"
          },
          {
            icon: "🏢",
            label: "企业税务",
            desc: "企业纳税",
            bgColor: "#5856D6",
            action: "enterprise_tax"
          },
          {
            icon: "📊",
            label: "纳税证明",
            desc: "完税证明",
            bgColor: "#FF6B35",
            action: "tax_proof"
          },
          {
            icon: "📋",
            label: "税务登记",
            desc: "税务注册",
            bgColor: "#64D2FF",
            action: "tax_register"
          }
        ],
        fundServices: [
          {
            icon: "🏦",
            label: "公积金查询",
            desc: "账户查询",
            bgColor: "#007AFF",
            action: "fund_query"
          },
          {
            icon: "💸",
            label: "公积金提取",
            desc: "提取申请",
            bgColor: "#34C759",
            action: "fund_withdraw"
          },
          {
            icon: "🏠",
            label: "公积金贷款",
            desc: "贷款申请",
            bgColor: "#FF9500",
            action: "fund_loan"
          },
          {
            icon: "📝",
            label: "缴存证明",
            desc: "缴存证明",
            bgColor: "#AF52DE",
            action: "fund_proof"
          }
        ],
        hotServices: [
          {
            icon: "🆔",
            title: "身份证办理进度查询",
            subtitle: "实时查看办证进度",
            action: "id_progress"
          },
          {
            icon: "🏥",
            title: "医保电子凭证",
            subtitle: "医保卡电子化服务",
            action: "medical_card"
          },
          {
            icon: "💰",
            title: "个税年度汇算",
            subtitle: "个人所得税汇算清缴",
            action: "tax_settlement"
          },
          {
            icon: "🏠",
            title: "不动产登记查询",
            subtitle: "房产信息查询服务",
            action: "property_query"
          }
        ],
        guides: [
          {
            title: "身份证首次申领",
            tag: "常用",
            desc: "16周岁以上首次申请身份证办理流程",
            steps: 3
          },
          {
            title: "医保异地就医备案",
            tag: "热门",
            desc: "异地就医前的备案登记办理指南",
            steps: 4
          },
          {
            title: "公积金贷款申请",
            tag: "推荐",
            desc: "购房公积金贷款申请条件及流程",
            steps: 5
          }
        ]
      };
    },
    computed: {
      currentServices() {
        switch (this.activeCategory) {
          case 0:
            return this.certificateServices;
          case 1:
            return this.socialServices;
          case 2:
            return this.taxServices;
          case 3:
            return this.fundServices;
          default:
            return this.certificateServices;
        }
      }
    },
    methods: {
      switchCategory(index) {
        this.activeCategory = index;
      },
      handleServiceTap(service) {
        formatAppLog("log", "at pages/government/government.vue:300", "点击政务服务:", service);
        uni.showToast({
          title: `即将跳转到${service.label || service.title}`,
          icon: "none"
        });
      },
      viewGuide(guide) {
        formatAppLog("log", "at pages/government/government.vue:308", "查看办事指南:", guide);
        uni.showToast({
          title: `查看${guide.title}指南`,
          icon: "none"
        });
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "government-page" }, [
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "政务民生"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "便民服务 一键办理")
      ]),
      vue.createCommentVNode(" 服务分类 "),
      vue.createElementVNode("view", { class: "service-categories" }, [
        vue.createElementVNode("view", { class: "category-tabs" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.categories, (category, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["tab-item", { active: $data.activeCategory === index }]),
                key: index,
                onClick: ($event) => $options.switchCategory(index)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "tab-text" },
                  vue.toDisplayString(category.name),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 政务服务列表 "),
      vue.createElementVNode("view", { class: "government-services" }, [
        vue.createElementVNode("view", { class: "services-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.currentServices, (service, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "service-item",
                key: index,
                onClick: ($event) => $options.handleServiceTap(service)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "service-icon",
                    style: vue.normalizeStyle({ backgroundColor: service.bgColor })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "icon-text" },
                      vue.toDisplayString(service.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "service-label" },
                  vue.toDisplayString(service.label),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "service-desc" },
                  vue.toDisplayString(service.desc),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 热门服务 "),
      vue.createElementVNode("view", { class: "hot-services" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "🔥 热门服务")
        ]),
        vue.createElementVNode("view", { class: "hot-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.hotServices, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "hot-item",
                key: index,
                onClick: ($event) => $options.handleServiceTap(item)
              }, [
                vue.createElementVNode("view", { class: "hot-icon" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.icon),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "hot-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "hot-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "hot-subtitle" },
                    vue.toDisplayString(item.subtitle),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "hot-arrow" }, ">")
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 办事指南 "),
      vue.createElementVNode("view", { class: "guide-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "📋 办事指南")
        ]),
        vue.createElementVNode("view", { class: "guide-cards" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.guides, (guide, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "guide-card",
                key: index,
                onClick: ($event) => $options.viewGuide(guide)
              }, [
                vue.createElementVNode("view", { class: "guide-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "guide-title" },
                    vue.toDisplayString(guide.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "guide-tag" },
                    vue.toDisplayString(guide.tag),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "guide-desc" },
                  vue.toDisplayString(guide.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "guide-steps" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "steps-text" },
                    vue.toDisplayString(guide.steps) + "个步骤",
                    1
                    /* TEXT */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesGovernmentGovernment = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-55002ac7"], ["__file", "E:/项目/yihangyidon/src/pages/government/government.vue"]]);
  const _sfc_main$1 = {
    name: "GamesPage",
    data() {
      return {
        userPoints: 1580,
        activeCategory: 0,
        gameCategories: ["答题闯关", "趣味游戏", "签到任务", "分享赚积分"],
        quizGames: [
          {
            icon: "🧠",
            title: "金融知识问答",
            desc: "答对10题获得积分",
            reward: 50,
            badge: "热门"
          },
          {
            icon: "📚",
            title: "理财小课堂",
            desc: "学习理财知识",
            reward: 30,
            badge: ""
          },
          {
            icon: "💰",
            title: "投资达人",
            desc: "投资知识竞答",
            reward: 100,
            badge: "高分"
          }
        ],
        funGames: [
          {
            icon: "🎮",
            title: "农行大富翁",
            desc: "虚拟理财游戏",
            reward: 80,
            badge: "新游戏"
          },
          {
            icon: "🎯",
            title: "幸运转盘",
            desc: "每日一次免费转",
            reward: 20,
            badge: ""
          },
          {
            icon: "🎲",
            title: "财富密码",
            desc: "猜数字赢积分",
            reward: 60,
            badge: ""
          }
        ],
        checkInGames: [
          {
            icon: "📅",
            title: "每日签到",
            desc: "连续签到奖励更多",
            reward: 10,
            badge: "每日"
          },
          {
            icon: "📱",
            title: "APP使用",
            desc: "使用APP功能",
            reward: 5,
            badge: ""
          },
          {
            icon: "💳",
            title: "绑定银行卡",
            desc: "绑卡获得积分",
            reward: 200,
            badge: "一次性"
          }
        ],
        shareGames: [
          {
            icon: "📤",
            title: "分享好友",
            desc: "邀请好友注册",
            reward: 500,
            badge: "高奖励"
          },
          {
            icon: "📢",
            title: "朋友圈分享",
            desc: "分享优惠信息",
            reward: 20,
            badge: ""
          },
          {
            icon: "👥",
            title: "推荐产品",
            desc: "推荐理财产品",
            reward: 100,
            badge: ""
          }
        ],
        activities: [
          {
            title: "新春积分翻倍",
            desc: "春节期间所有游戏积分翻倍",
            status: "进行中",
            time: "2024.01.01-2024.02.15",
            reward: "双倍积分"
          },
          {
            title: "理财达人挑战",
            desc: "连续30天完成理财任务",
            status: "即将开始",
            time: "2024.02.01-2024.02.29",
            reward: "1000积分+理财券"
          }
        ],
        exchangeItems: [
          {
            icon: "☕",
            name: "星巴克咖啡券",
            points: 2e3
          },
          {
            icon: "🎬",
            name: "电影票",
            points: 1500
          },
          {
            icon: "📱",
            name: "话费充值券",
            points: 1e3
          },
          {
            icon: "🎁",
            name: "京东购物券",
            points: 800
          }
        ]
      };
    },
    computed: {
      currentGames() {
        switch (this.activeCategory) {
          case 0:
            return this.quizGames;
          case 1:
            return this.funGames;
          case 2:
            return this.checkInGames;
          case 3:
            return this.shareGames;
          default:
            return this.quizGames;
        }
      }
    },
    methods: {
      switchCategory(index) {
        this.activeCategory = index;
      },
      signIn() {
        uni.showModal({
          title: "签到成功",
          content: "恭喜您获得10积分！连续签到7天可获得额外奖励",
          showCancel: false
        });
        this.userPoints += 10;
      },
      viewPointsRule() {
        uni.showModal({
          title: "积分规则",
          content: "1. 每日签到获得10积分\n2. 完成游戏任务获得相应积分\n3. 积分可用于兑换礼品\n4. 积分有效期为1年",
          showCancel: false
        });
      },
      viewPointsHistory() {
        uni.showToast({
          title: "跳转到积分明细页面",
          icon: "none"
        });
      },
      playGame(game) {
        formatAppLog("log", "at pages/games/games.vue:311", "开始游戏:", game);
        uni.showModal({
          title: game.title,
          content: `即将开始${game.title}，完成后可获得${game.reward}积分`,
          confirmText: "开始游戏",
          success: (res) => {
            if (res.confirm) {
              setTimeout(() => {
                uni.showToast({
                  title: `恭喜获得${game.reward}积分！`,
                  icon: "success"
                });
                this.userPoints += game.reward;
              }, 2e3);
            }
          }
        });
      },
      joinActivity(activity) {
        formatAppLog("log", "at pages/games/games.vue:332", "参加活动:", activity);
        uni.showToast({
          title: `参加${activity.title}活动`,
          icon: "none"
        });
      },
      viewAllActivities() {
        uni.showToast({
          title: "查看全部活动",
          icon: "none"
        });
      },
      exchangeItem(item) {
        if (this.userPoints < item.points) {
          uni.showToast({
            title: "积分不足，无法兑换",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "确认兑换",
          content: `确定使用${item.points}积分兑换${item.name}吗？`,
          success: (res) => {
            if (res.confirm) {
              this.userPoints -= item.points;
              uni.showToast({
                title: "兑换成功！",
                icon: "success"
              });
            }
          }
        });
      },
      viewExchangeMall() {
        uni.showToast({
          title: "跳转到积分商城",
          icon: "none"
        });
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "games-page" }, [
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "小豆乐园"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "趣味游戏 积分奖励")
      ]),
      vue.createCommentVNode(" 积分信息 "),
      vue.createElementVNode("view", { class: "points-info" }, [
        vue.createElementVNode("view", { class: "points-card" }, [
          vue.createElementVNode("view", { class: "points-header" }, [
            vue.createElementVNode("text", { class: "points-title" }, "我的积分"),
            vue.createElementVNode("text", {
              class: "points-rule",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.viewPointsRule && $options.viewPointsRule(...args))
            }, "积分规则 >")
          ]),
          vue.createElementVNode("view", { class: "points-content" }, [
            vue.createElementVNode(
              "text",
              { class: "points-number" },
              vue.toDisplayString($data.userPoints),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "points-unit" }, "分")
          ]),
          vue.createElementVNode("view", { class: "points-actions" }, [
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.signIn && $options.signIn(...args))
            }, "每日签到"),
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.viewPointsHistory && $options.viewPointsHistory(...args))
            }, " 积分明细 ")
          ])
        ])
      ]),
      vue.createCommentVNode(" 游戏分类 "),
      vue.createElementVNode("view", { class: "game-categories" }, [
        vue.createElementVNode("view", { class: "category-tabs" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.gameCategories, (category, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["tab-item", { active: $data.activeCategory === index }]),
                key: index,
                onClick: ($event) => $options.switchCategory(index)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "tab-text" },
                  vue.toDisplayString(category),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 游戏列表 "),
      vue.createElementVNode("view", { class: "games-grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($options.currentGames, (game, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "game-item",
              key: index,
              onClick: ($event) => $options.playGame(game)
            }, [
              vue.createElementVNode("view", { class: "game-cover" }, [
                vue.createElementVNode(
                  "text",
                  { class: "game-icon" },
                  vue.toDisplayString(game.icon),
                  1
                  /* TEXT */
                ),
                game.badge ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "game-badge"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge-text" },
                    vue.toDisplayString(game.badge),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "game-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "game-title" },
                  vue.toDisplayString(game.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "game-desc" },
                  vue.toDisplayString(game.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "game-reward" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "reward-text" },
                    "+" + vue.toDisplayString(game.reward) + "积分",
                    1
                    /* TEXT */
                  )
                ])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 活动专区 "),
      vue.createElementVNode("view", { class: "activity-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "🎉 活动专区"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.viewAllActivities && $options.viewAllActivities(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "activity-cards" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.activities, (activity, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "activity-card",
                key: index,
                onClick: ($event) => $options.joinActivity(activity)
              }, [
                vue.createElementVNode("view", { class: "activity-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "activity-title" },
                    vue.toDisplayString(activity.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "activity-status" },
                    vue.toDisplayString(activity.status),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "activity-desc" },
                  vue.toDisplayString(activity.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "activity-footer" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "activity-time" },
                    vue.toDisplayString(activity.time),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "activity-reward" },
                    "奖励: " + vue.toDisplayString(activity.reward),
                    1
                    /* TEXT */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 兑换商城 "),
      vue.createElementVNode("view", { class: "exchange-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "🎁 积分商城"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.viewExchangeMall && $options.viewExchangeMall(...args))
          }, "更多好礼")
        ]),
        vue.createElementVNode("view", { class: "exchange-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.exchangeItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "exchange-item",
                key: index,
                onClick: ($event) => $options.exchangeItem(item)
              }, [
                vue.createElementVNode("view", { class: "item-image" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "item-icon" },
                    vue.toDisplayString(item.icon),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "item-name" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "item-points" },
                  vue.toDisplayString(item.points) + "积分",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("button", {
                  class: "exchange-btn",
                  disabled: $data.userPoints < item.points
                }, vue.toDisplayString($data.userPoints >= item.points ? "立即兑换" : "积分不足"), 9, ["disabled"])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesGamesGames = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-5e0e9dd0"], ["__file", "E:/项目/yihangyidon/src/pages/games/games.vue"]]);
  __definePage("pages/denglu/login", PagesDengluLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/user/user", PagesUserUser);
  __definePage("pages/wealth/wealth", PagesWealthWealth);
  __definePage("pages/life/life", PagesLifeLife);
  __definePage("pages/payment/payment", PagesPaymentPayment);
  __definePage("pages/recharge/recharge", PagesRechargeRecharge);
  __definePage("pages/government/government", PagesGovernmentGovernment);
  __definePage("pages/games/games", PagesGamesGames);
  function initPushNotification() {
    if (typeof plus !== "undefined" && plus.push) {
      plus.globalEvent.addEventListener("newPath", ({ path }) => {
        if (!path) {
          return;
        }
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.$page && currentPage.$page.fullPath === path) {
          return;
        }
        uni.navigateTo({
          url: path,
          fail(res) {
            if (res.errMsg.indexOf("tabbar") > -1) {
              uni.switchTab({
                url: path,
                fail(res2) {
                  console.error(res2.errMsg);
                }
              });
            } else {
              console.error(res.errMsg);
            }
          }
        });
      });
    }
  }
  uni.invokePushCallback({
    type: "enabled",
    offline: true
  });
  Promise.resolve().then(() => {
    initPushNotification();
  });
  const _sfc_main = {
    name: "App",
    onLaunch(options) {
      formatAppLog("log", "at App.vue:12", "App Launch", options);
      this.checkUpdate();
      this.initUserInfo();
      this.setSystemInfo();
      this.initNetworkListener();
      this.initLoginInterceptor();
    },
    onShow(options) {
      formatAppLog("log", "at App.vue:31", "App Show", options);
      this.checkLoginStatus();
      this.restoreAppState();
      this.globalLoginCheck();
    },
    onHide() {
      formatAppLog("log", "at App.vue:44", "App Hide");
      this.saveAppState();
    },
    onError(error) {
      formatAppLog("error", "at App.vue:51", "App Error:", error);
      this.reportError(error);
    },
    onPageNotFound(options) {
      formatAppLog("log", "at App.vue:58", "Page Not Found:", options);
      uni.switchTab({
        url: "/pages/index/index"
      });
    },
    methods: {
      /**
       * 检查应用更新
       */
      checkUpdate() {
        plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
          formatAppLog("log", "at App.vue:73", "当前应用版本:", widgetInfo.version);
        });
      },
      /**
       * 初始化用户信息
       */
      initUserInfo() {
        try {
          const userInfo = uni.getStorageSync("userInfo");
          if (userInfo) {
            this.globalData.userInfo = userInfo;
            formatAppLog("log", "at App.vue:87", "用户信息已恢复:", userInfo);
          }
        } catch (error) {
          formatAppLog("error", "at App.vue:90", "恢复用户信息失败:", error);
        }
      },
      /**
       * 设置系统信息
       */
      setSystemInfo() {
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.globalData.systemInfo = systemInfo;
          formatAppLog("log", "at App.vue:101", "系统信息:", systemInfo);
        } catch (error) {
          formatAppLog("error", "at App.vue:103", "获取系统信息失败:", error);
        }
      },
      /**
       * 初始化网络状态监听
       */
      initNetworkListener() {
        uni.onNetworkStatusChange((res) => {
          formatAppLog("log", "at App.vue:112", "网络状态变化:", res);
          this.globalData.networkType = res.networkType;
          this.globalData.isConnected = res.isConnected;
          if (!res.isConnected) {
            uni.showToast({
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
        if (!forceCheckLogin()) {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage && !currentPage.route.includes("login")) {
            formatAppLog("log", "at App.vue:135", "应用启动时检测到未登录，强制跳转到登录页面");
            uni.reLaunch({
              url: "/pages/denglu/login"
            });
          }
        }
      },
      /**
       * 初始化登录拦截器
       */
      initLoginInterceptor() {
        uni.addInterceptor("navigateTo", {
          invoke(e) {
            formatAppLog("log", "at App.vue:150", "拦截 navigateTo:", e.url);
            if (e.url.includes("/pages/denglu/login")) {
              formatAppLog("log", "at App.vue:154", "跳转到登录页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:160", "用户未登录，阻止页面跳转");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("switchTab", {
          invoke(e) {
            formatAppLog("log", "at App.vue:171", "拦截 switchTab:", e.url);
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:175", "用户未登录，阻止tabBar跳转");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("reLaunch", {
          invoke(e) {
            formatAppLog("log", "at App.vue:186", "拦截 reLaunch:", e.url);
            if (e.url.includes("/pages/denglu/login")) {
              formatAppLog("log", "at App.vue:190", "重定向到登录页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:196", "用户未登录，阻止重定向");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("redirectTo", {
          invoke(e) {
            formatAppLog("log", "at App.vue:207", "拦截 redirectTo:", e.url);
            if (e.url.includes("/pages/denglu/login")) {
              formatAppLog("log", "at App.vue:211", "重定向到登录页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:217", "用户未登录，阻止重定向");
              return false;
            }
            return true;
          }
        });
      },
      /**
       * 全局登录检查
       */
      globalLoginCheck() {
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
            userInfo: this.globalData.userInfo
          };
          uni.setStorageSync("appState", appState);
        } catch (error) {
          formatAppLog("error", "at App.vue:247", "保存应用状态失败:", error);
        }
      },
      /**
       * 恢复应用状态
       */
      restoreAppState() {
        try {
          const appState = uni.getStorageSync("appState");
          if (appState) {
            const isExpired = Date.now() - appState.timestamp > 24 * 60 * 60 * 1e3;
            if (!isExpired) {
              this.globalData.userInfo = appState.userInfo;
            }
          }
        } catch (error) {
          formatAppLog("error", "at App.vue:265", "恢复应用状态失败:", error);
        }
      },
      /**
       * 错误上报
       */
      reportError(error) {
        formatAppLog("error", "at App.vue:274", "错误上报:", error);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/项目/yihangyidon/src/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.errorHandler = (err, vm, info) => {
      formatAppLog("error", "at main.js:15", "Vue Error:", err);
      formatAppLog("error", "at main.js:16", "Error Info:", info);
      reportError(err, info);
      uni.showToast({
        title: "应用出现错误，请重试",
        icon: "none",
        duration: 3e3
      });
    };
    app.config.warnHandler = (msg, vm, trace) => {
      formatAppLog("warn", "at main.js:31", "Vue Warning:", msg);
      formatAppLog("warn", "at main.js:32", "Warning Trace:", trace);
    };
    app.config.globalProperties.$app = {
      // 应用版本
      version: "1.0.0",
      // 环境信息
      env: "development",
      // 平台信息
      platform: uni.getSystemInfoSync().platform,
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
          const token = uni.getStorageSync("token");
          if (token) {
            config.header = {
              ...config.header,
              "Authorization": `Bearer ${token}`
            };
          }
          config.url += (config.url.includes("?") ? "&" : "?") + `_t=${Date.now()}`;
          formatAppLog("log", "at main.js:155", "Request:", config);
          return config;
        },
        // 响应拦截器
        afterResponse(response) {
          formatAppLog("log", "at main.js:161", "Response:", response);
          if (response.statusCode === 401) {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
            uni.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateTo({
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
              uni.request({
                ...config,
                success: resolve,
                fail: reject
              });
            });
            return this.afterResponse(response);
          } catch (error) {
            formatAppLog("error", "at main.js:197", "Request Error:", error);
            if (error.errMsg && error.errMsg.includes("request:fail")) {
              uni.showToast({
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
            uni.setStorageSync(key, JSON.stringify(data));
          } catch (error) {
            formatAppLog("error", "at main.js:263", "Storage Set Error:", error);
          }
        },
        // 获取存储
        get(key, defaultValue = null) {
          try {
            const data = uni.getStorageSync(key);
            if (!data)
              return defaultValue;
            const parsed = JSON.parse(data);
            if (parsed.expire && Date.now() - parsed.timestamp > parsed.expire) {
              this.remove(key);
              return defaultValue;
            }
            return parsed.value;
          } catch (error) {
            formatAppLog("error", "at main.js:283", "Storage Get Error:", error);
            return defaultValue;
          }
        },
        // 删除存储
        remove(key) {
          try {
            uni.removeStorageSync(key);
          } catch (error) {
            formatAppLog("error", "at main.js:293", "Storage Remove Error:", error);
          }
        },
        // 清空存储
        clear() {
          try {
            uni.clearStorageSync();
          } catch (error) {
            formatAppLog("error", "at main.js:302", "Storage Clear Error:", error);
          }
        }
      }
    };
    app.mixin({
      // 页面生命周期
      onLoad(options) {
        formatAppLog("log", "at main.js:312", "Page Load:", this.$options.name, options);
        this.pageStartTime = Date.now();
      },
      onShow() {
        formatAppLog("log", "at main.js:319", "Page Show:", this.$options.name);
      },
      onHide() {
        formatAppLog("log", "at main.js:323", "Page Hide:", this.$options.name);
        if (this.pageStartTime) {
          const duration = Date.now() - this.pageStartTime;
          formatAppLog("log", "at main.js:328", "Page Duration:", this.$options.name, duration + "ms");
        }
      },
      onUnload() {
        formatAppLog("log", "at main.js:333", "Page Unload:", this.$options.name);
      },
      // 错误处理
      onError(error) {
        formatAppLog("error", "at main.js:338", "Page Error:", this.$options.name, error);
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
      userAgent: uni.getSystemInfoSync(),
      url: ((_a = getCurrentPages().pop()) == null ? void 0 : _a.route) || "unknown"
    };
    formatAppLog("error", "at main.js:364", "Error Report:", errorData);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      formatAppLog("error", "at main.js:377", "Global Error:", event.error);
      reportError(event.error, "Global Error");
    });
    window.addEventListener("unhandledrejection", (event) => {
      formatAppLog("error", "at main.js:382", "Unhandled Promise Rejection:", event.reason);
      reportError(event.reason, "Unhandled Promise Rejection");
    });
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);

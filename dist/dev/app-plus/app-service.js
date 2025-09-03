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
  const userDataJson = [
    {
      id: "u001",
      username: null,
      phone: "13888888888",
      password: "123456",
      nickname: "手机用户",
      email: "phone@example.com",
      idCard: "110101199001011234",
      avatar: "",
      status: "active",
      createTime: "2024-01-01T08:00:00.000Z",
      lastLoginTime: "2024-01-15T10:30:00.000Z"
    },
    {
      id: "u002",
      username: "张小明",
      phone: "13999999999",
      password: "abc123",
      nickname: "小明",
      email: "zhangxiaoming@example.com",
      idCard: "110101199202021456",
      avatar: "",
      status: "active",
      createTime: "2024-01-02T09:15:00.000Z",
      lastLoginTime: "2024-01-15T14:20:00.000Z"
    },
    {
      id: "u003",
      username: "李小红",
      phone: "13777777777",
      password: "password123",
      nickname: "小红",
      email: "lixiaohong@example.com",
      idCard: "110101199303031789",
      avatar: "",
      status: "active",
      createTime: "2024-01-03T16:45:00.000Z",
      lastLoginTime: "2024-01-14T11:10:00.000Z"
    }
  ];
  const users = userDataJson || [];
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
  function validateUser(usernameOrPhone, password) {
    formatAppLog("log", "at data/users.js:40", "登录验证:", { usernameOrPhone, password, totalUsers: users.length });
    const user = users.find((user2) => {
      const matchUsername = user2.username && user2.username === usernameOrPhone;
      const matchPhone = user2.phone && user2.phone === usernameOrPhone;
      const matchPassword = user2.password === password;
      formatAppLog("log", "at data/users.js:48", "检查用户:", {
        userId: user2.id,
        username: user2.username,
        phone: user2.phone,
        matchUsername,
        matchPhone,
        matchPassword
      });
      return (matchUsername || matchPhone) && matchPassword;
    });
    if (user) {
      formatAppLog("log", "at data/users.js:61", "登录成功:", user.id);
      user.lastLoginTime = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      formatAppLog("log", "at data/users.js:65", "登录失败: 用户名/手机号或密码错误");
    }
    return user;
  }
  function checkUserExists(username, phone) {
    return users.some(
      (user) => user.username === username || user.phone === phone
    );
  }
  function registerUser(userData) {
    const maxId = users.length > 0 ? Math.max(...users.map((u) => parseInt(u.id.replace("u", "")))) : 0;
    const newId = `u${String(maxId + 1).padStart(3, "0")}`;
    const newUser = {
      id: newId,
      username: userData.username,
      password: userData.password,
      phone: userData.phone,
      nickname: userData.nickname || userData.username,
      avatar: "",
      email: userData.email || "",
      idCard: userData.idCard || "",
      createTime: (/* @__PURE__ */ new Date()).toISOString(),
      lastLoginTime: null,
      status: "active"
    };
    users.push(newUser);
    formatAppLog("log", "at data/users.js:108", "新用户注册成功:", newUser);
    return newUser;
  }
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$d = {
    data() {
      return {
        loginType: "password",
        // 登录方式：password/code
        phone: "",
        password: "",
        code: "",
        countdown: 0,
        loading: false
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/denglu/login.vue:114", "页面加载完成");
      formatAppLog("log", "at pages/denglu/login.vue:116", "加载的用户数据:", users);
      formatAppLog("log", "at pages/denglu/login.vue:117", "用户数量:", users.length);
    },
    methods: {
      // 获取验证码
      getCode() {
        if (!/^1[3-9]\d{9}$/.test(this.phone)) {
          uni.showToast({ title: "请输入正确手机号", icon: "none" });
          return;
        }
        try {
          const code = generateVerificationCode(this.phone);
          uni.showToast({
            title: `验证码：${code}`,
            icon: "none",
            duration: 3e3
          });
          this.countdown = 60;
          const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0)
              clearInterval(timer);
          }, 1e3);
        } catch (error) {
          uni.showToast({ title: "发送验证码失败", icon: "none" });
        }
      },
      // 密码/验证码登录
      handleLogin() {
        this.loading = true;
        if (!this.validateForm()) {
          this.loading = false;
          return;
        }
        setTimeout(() => {
          let user = null;
          if (this.loginType === "password") {
            user = validateUser(this.phone, this.password);
          } else {
            if (verifyCode(this.phone, this.code)) {
              user = users.find((u) => u.phone === this.phone);
              if (user) {
                user.lastLoginTime = (/* @__PURE__ */ new Date()).toISOString();
              }
            } else {
              uni.showToast({ title: "验证码错误或已过期", icon: "none" });
              this.loading = false;
              return;
            }
          }
          if (user) {
            uni.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              handleLoginSuccess(user);
            }, 1500);
          } else {
            uni.showToast({
              title: this.loginType === "password" ? "用户名或密码错误" : "手机号不存在",
              icon: "none"
            });
          }
          this.loading = false;
        }, 1e3);
      },
      // 表单验证
      validateForm() {
        if (!this.phone.trim()) {
          uni.showToast({ title: "请输入用户名或手机号", icon: "none" });
          return false;
        }
        const isPhone = /^1[3-9]\d{9}$/.test(this.phone);
        const isUsername = /^[\u4e00-\u9fa5]+$/.test(this.phone);
        if (!isPhone && !isUsername) {
          uni.showToast({ title: "用户名仅支持中文字符，或输入正确的手机号", icon: "none" });
          return false;
        }
        if (this.loginType === "code" && !isPhone) {
          uni.showToast({ title: "验证码登录仅支持手机号", icon: "none" });
          return false;
        }
        if (this.loginType === "password") {
          if (!this.password.trim()) {
            uni.showToast({ title: "请输入密码", icon: "none" });
            return false;
          }
        } else {
          if (!this.code.trim()) {
            uni.showToast({ title: "请输入验证码", icon: "none" });
            return false;
          }
          if (!/^\d{6}$/.test(this.code)) {
            uni.showToast({ title: "请输入6位验证码", icon: "none" });
            return false;
          }
        }
        return true;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" 标题 "),
      vue.createElementVNode("view", { class: "title" }, "中国农业银行"),
      vue.createCommentVNode(" 登录方式切换 "),
      vue.createElementVNode("view", { class: "tab-bar" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", $data.loginType === "password" ? "active" : ""]),
            onClick: _cache[0] || (_cache[0] = ($event) => $data.loginType = "password")
          },
          " 密码登录 ",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", $data.loginType === "code" ? "active" : ""]),
            onClick: _cache[1] || (_cache[1] = ($event) => $data.loginType = "code")
          },
          " 验证码登录 ",
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 登录表单 "),
      vue.createElementVNode(
        "form",
        {
          onSubmit: _cache[6] || (_cache[6] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        },
        [
          vue.createCommentVNode(" 用户名/手机号输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.phone = $event),
                placeholder: "请输入用户名（仅中文）或手机号",
                maxlength: "20",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.phone]
            ])
          ]),
          vue.createCommentVNode(" 密码/验证码输入 "),
          $data.loginType === "password" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "input-item"
          }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.password = $event),
                placeholder: "请输入登录密码",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.password]
            ]),
            vue.createElementVNode("view", { class: "password-placeholder" })
          ])) : vue.createCommentVNode("v-if", true),
          $data.loginType === "code" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "input-item"
          }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.code = $event),
                placeholder: "请输入验证码",
                maxlength: "6",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.code]
            ]),
            vue.createElementVNode("button", {
              class: "get-code-btn",
              onClick: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.getCode && $options.getCode(...args), ["stop"])),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}s后重发` : "获取验证码"), 9, ["disabled"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 登录按钮 "),
          vue.createElementVNode("button", {
            class: "login-btn",
            "form-type": "submit",
            loading: $data.loading
          }, " 登录 ", 8, ["loading"])
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createCommentVNode(" 快速注册按钮 "),
      vue.createElementVNode("view", { class: "quick-register" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/register/register",
          "open-type": "navigate"
        }, [
          vue.createElementVNode("button", { class: "quick-register-btn" }, " 还没有账户？立即注册 ")
        ])
      ]),
      vue.createCommentVNode(" 辅助链接 "),
      vue.createElementVNode("view", { class: "links" }, [
        vue.createElementVNode("navigator", { url: "/pages/forget/forget" }, "忘记密码")
      ]),
      vue.createCommentVNode(" 登录注意事项 "),
      vue.createElementVNode("view", { class: "login-notice" }, [
        vue.createElementVNode("text", { class: "notice-title" }, "登录注意事项："),
        vue.createElementVNode("text", { class: "notice-item" }, "• 请确保在安全环境下登录，避免在公共场所输入密码"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 密码登录支持用户名或手机号，验证码登录仅支持手机号"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 如遇登录问题，请联系客服热线：95599"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 为保障账户安全，建议定期更换登录密码")
      ])
    ]);
  }
  const PagesDengluLogin = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-6f56e16f"], ["__file", "E:/项目/yihangyidon/src/pages/denglu/login.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        form: {
          username: "",
          phone: "",
          code: "",
          password: "",
          confirmPassword: "",
          email: "",
          nickname: "",
          idCard: ""
        },
        countdown: 0,
        loading: false,
        showPassword: false,
        showConfirmPassword: false
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/register/register.vue:166", "注册页面加载完成");
    },
    methods: {
      // 切换密码显示
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      // 切换确认密码显示
      toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
      },
      // 获取验证码
      getCode() {
        if (!this.validatePhone()) {
          return;
        }
        try {
          const code = generateVerificationCode(this.form.phone);
          uni.showToast({
            title: `验证码：${code}`,
            icon: "none",
            duration: 3e3
          });
          this.countdown = 60;
          const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0)
              clearInterval(timer);
          }, 1e3);
        } catch (error) {
          uni.showToast({ title: "发送验证码失败", icon: "none" });
        }
      },
      // 注册处理
      handleRegister() {
        this.loading = true;
        if (!this.validateForm()) {
          this.loading = false;
          return;
        }
        setTimeout(() => {
          try {
            if (!verifyCode(this.form.phone, this.form.code)) {
              uni.showToast({ title: "验证码错误或已过期", icon: "none" });
              this.loading = false;
              return;
            }
            if (checkUserExists(this.form.username, this.form.phone)) {
              uni.showToast({ title: "用户名或手机号已存在", icon: "none" });
              this.loading = false;
              return;
            }
            const user = registerUser({
              username: this.form.username,
              phone: this.form.phone,
              password: this.form.password,
              email: this.form.email,
              nickname: this.form.nickname || this.form.username,
              idCard: this.form.idCard
            });
            uni.showToast({
              title: "注册成功！",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              handleLoginSuccess(user);
            }, 1500);
          } catch (error) {
            uni.showToast({ title: "注册失败，请重试", icon: "none" });
            formatAppLog("error", "at pages/register/register.vue:259", "注册错误:", error);
          } finally {
            this.loading = false;
          }
        }, 1e3);
      },
      // 验证手机号
      validatePhone() {
        if (!this.form.phone.trim()) {
          uni.showToast({ title: "请输入手机号", icon: "none" });
          return false;
        }
        if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
          uni.showToast({ title: "请输入正确的手机号", icon: "none" });
          return false;
        }
        return true;
      },
      // 身份证号验证
      validateIdCard(idCard) {
        const idCardRegex = /^\d{17}[\dXx]$/;
        if (!idCardRegex.test(idCard)) {
          return false;
        }
        const testIdCards = [
          "111111111111111111",
          "222222222222222222",
          "333333333333333333",
          "123456789012345678"
        ];
        if (testIdCards.includes(idCard)) {
          formatAppLog("log", "at pages/register/register.vue:296", "使用测试身份证号:", idCard);
          return true;
        }
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(idCard[i]) * weights[i];
        }
        const checkCode = checkCodes[sum % 11];
        const isValid = checkCode === idCard[17].toUpperCase();
        if (!isValid) {
          formatAppLog("log", "at pages/register/register.vue:313", "身份证校验失败:", {
            输入: idCard,
            计算校验位: checkCode,
            实际最后一位: idCard[17]
          });
        }
        return isValid;
      },
      // 表单验证
      validateForm() {
        if (!this.form.username.trim()) {
          uni.showToast({ title: "请输入用户名", icon: "none" });
          return false;
        }
        if (this.form.username.length < 3 || this.form.username.length > 20) {
          uni.showToast({ title: "用户名长度应为3-20个字符", icon: "none" });
          return false;
        }
        if (!this.validatePhone()) {
          return false;
        }
        if (!this.form.code.trim()) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return false;
        }
        if (!/^\d{6}$/.test(this.form.code)) {
          uni.showToast({ title: "请输入6位验证码", icon: "none" });
          return false;
        }
        if (!this.form.password.trim()) {
          uni.showToast({ title: "请输入密码", icon: "none" });
          return false;
        }
        if (this.form.password.length < 6) {
          uni.showToast({ title: "密码长度至少6位", icon: "none" });
          return false;
        }
        if (!this.form.confirmPassword.trim()) {
          uni.showToast({ title: "请再次输入密码", icon: "none" });
          return false;
        }
        if (this.form.password !== this.form.confirmPassword) {
          uni.showToast({ title: "两次输入的密码不一致", icon: "none" });
          return false;
        }
        if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          uni.showToast({ title: "请输入正确的邮箱地址", icon: "none" });
          return false;
        }
        if (!this.form.idCard.trim()) {
          uni.showToast({ title: "请输入身份证号", icon: "none" });
          return false;
        }
        if (!this.validateIdCard(this.form.idCard)) {
          uni.showToast({ title: "请输入正确的身份证号", icon: "none" });
          return false;
        }
        return true;
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "register-container" }, [
      vue.createCommentVNode(" 标题 "),
      vue.createElementVNode("view", { class: "title" }, "注册账户"),
      vue.createElementVNode("view", { class: "subtitle" }, "创建您的农业银行账户"),
      vue.createCommentVNode(" 注册表单 "),
      vue.createElementVNode(
        "form",
        {
          onSubmit: _cache[11] || (_cache[11] = (...args) => $options.handleRegister && $options.handleRegister(...args))
        },
        [
          vue.createCommentVNode(" 用户名输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.username = $event),
                placeholder: "请输入用户名",
                maxlength: "20",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.username]
            ])
          ]),
          vue.createCommentVNode(" 手机号输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.phone = $event),
                placeholder: "请输入手机号",
                maxlength: "11",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.phone]
            ])
          ]),
          vue.createCommentVNode(" 验证码输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.code = $event),
                placeholder: "请输入验证码",
                maxlength: "6",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.code]
            ]),
            vue.createElementVNode("button", {
              class: "get-code-btn",
              onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.getCode && $options.getCode(...args), ["stop"])),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}s后重发` : "获取验证码"), 9, ["disabled"])
          ]),
          vue.createCommentVNode(" 密码输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              type: $data.showPassword ? "text" : "password",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.password = $event),
              placeholder: "请输入登录密码",
              required: ""
            }, null, 8, ["type"]), [
              [vue.vModelDynamic, $data.form.password]
            ]),
            vue.createElementVNode(
              "button",
              {
                class: "password-toggle",
                onClick: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.togglePassword && $options.togglePassword(...args), ["stop"]))
              },
              vue.toDisplayString($data.showPassword ? "🙈" : "👁️"),
              1
              /* TEXT */
            )
          ]),
          vue.createCommentVNode(" 确认密码输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              type: $data.showConfirmPassword ? "text" : "password",
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.confirmPassword = $event),
              placeholder: "请再次输入密码",
              required: ""
            }, null, 8, ["type"]), [
              [vue.vModelDynamic, $data.form.confirmPassword]
            ]),
            vue.createElementVNode(
              "button",
              {
                class: "password-toggle",
                onClick: _cache[7] || (_cache[7] = vue.withModifiers((...args) => $options.toggleConfirmPassword && $options.toggleConfirmPassword(...args), ["stop"]))
              },
              vue.toDisplayString($data.showConfirmPassword ? "🙈" : "👁️"),
              1
              /* TEXT */
            )
          ]),
          vue.createCommentVNode(" 邮箱输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "email",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.email = $event),
                placeholder: "请输入邮箱地址（选填）"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.email]
            ])
          ]),
          vue.createCommentVNode(" 昵称输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.nickname = $event),
                placeholder: "请输入昵称（选填）",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.nickname]
            ])
          ]),
          vue.createCommentVNode(" 身份证号输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.form.idCard = $event),
                placeholder: "请输入身份证号",
                maxlength: "18",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.idCard]
            ])
          ]),
          vue.createCommentVNode(" 注册按钮 "),
          vue.createElementVNode("button", {
            class: "register-btn",
            "form-type": "submit",
            loading: $data.loading
          }, " 立即注册 ", 8, ["loading"])
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createCommentVNode(" 快速登录按钮 "),
      vue.createElementVNode("view", { class: "quick-login" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/denglu/login",
          "open-type": "navigate"
        }, [
          vue.createElementVNode("button", { class: "quick-login-btn" }, " 已有账户？立即登录 ")
        ])
      ]),
      vue.createCommentVNode(" 注册须知 "),
      vue.createElementVNode("view", { class: "register-notice" }, [
        vue.createElementVNode("text", { class: "notice-title" }, "注册须知："),
        vue.createElementVNode("text", { class: "notice-item" }, "• 用户名支持中文、英文、数字，长度3-20个字符"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 密码长度至少6位，建议包含字母和数字"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 手机号用于接收验证码和安全提醒"),
        vue.createElementVNode("text", { class: "notice-item" }, "• 注册即表示同意相关服务条款和隐私政策")
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-97bb96ad"], ["__file", "E:/项目/yihangyidon/src/pages/register/register.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        isLoggedIn: false
      };
    },
    // 页面加载时检查登录状态
    onLoad() {
      this.checkLoginStatus();
    },
    // 页面显示时检查登录状态
    onShow() {
      this.checkLoginStatus();
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/index/index.vue:173", "首页：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        this.isLoggedIn = true;
      },
      // 处理转账按钮点击事件
      handleTransferClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/transfer/transfer"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      },
      // 处理我的账户点击事件
      handleAccountClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/account/account"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "home-container" }, [
      vue.createCommentVNode(" 顶部搜索栏 "),
      vue.createElementVNode("view", { class: "search-header" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "icon-search" }, "🔍"),
          vue.createElementVNode("text", { class: "search-text" }, "热门资讯")
        ]),
        vue.createElementVNode("view", { class: "header-icons" }, [
          vue.createElementVNode("text", { class: "icon" }, "📱"),
          vue.createElementVNode("text", { class: "icon" }, "👥"),
          vue.createElementVNode("text", { class: "icon" }, "✉️")
        ])
      ]),
      vue.createCommentVNode(" 广告横幅 "),
      vue.createElementVNode("view", { class: "banner" }, [
        vue.createElementVNode("text", { class: "banner-text" }, "您有5元掌银支付立减金"),
        vue.createElementVNode("button", { class: "banner-btn" }, "去查看")
      ]),
      vue.createCommentVNode(" 主要功能区 "),
      vue.createElementVNode("view", { class: "function-area" }, [
        vue.createElementVNode("view", { class: "function-grid" }, [
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleAccountClick && $options.handleAccountClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-account" }, "👤"),
            vue.createElementVNode("text", { class: "function-text" }, "我的账户")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.handleTransferClick && $options.handleTransferClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-transfer" }, "↔️"),
            vue.createElementVNode("text", { class: "function-text" }, "转账")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-balance" }, "📊"),
            vue.createElementVNode("text", { class: "function-text" }, "收支")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-scan" }, "🔍"),
            vue.createElementVNode("text", { class: "function-text" }, "扫一扫")
          ])
        ]),
        vue.createElementVNode("view", { class: "function-grid" }, [
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-card" }, "💳"),
            vue.createElementVNode("text", { class: "function-text" }, "信用卡")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-deposit" }, "💰"),
            vue.createElementVNode("text", { class: "function-text" }, "存款")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-activity" }, "🎉"),
            vue.createElementVNode("text", { class: "function-text" }, "热门活动")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-branch" }, "🏦"),
            vue.createElementVNode("text", { class: "function-text" }, "网点查询")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-electronic" }, "📱"),
            vue.createElementVNode("text", { class: "function-text" }, "开通电子")
          ])
        ]),
        vue.createElementVNode("view", { class: "function-grid" }, [
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-loan" }, "💸"),
            vue.createElementVNode("text", { class: "function-text" }, "贷款")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-topup" }, "📱"),
            vue.createElementVNode("text", { class: "function-text" }, "手机充值")
          ]),
          vue.createElementVNode("view", { class: "function-item" }, [
            vue.createElementVNode("view", { class: "function-icon icon-more" }, "•••"),
            vue.createElementVNode("text", { class: "function-text" }, "全部")
          ])
        ])
      ]),
      vue.createCommentVNode(" 待办事项 "),
      vue.createElementVNode("view", { class: "todo-section" }, [
        vue.createElementVNode("text", { class: "section-title" }, "待办"),
        vue.createElementVNode("text", { class: "todo-content" }, "快来试试智能提醒吧~"),
        vue.createElementVNode("text", { class: "arrow-right" }, "➡️")
      ]),
      vue.createCommentVNode(" 头条新闻 "),
      vue.createElementVNode("view", { class: "news-section" }, [
        vue.createElementVNode("text", { class: "section-title" }, "头条"),
        vue.createElementVNode("text", { class: "news-content" }, "中信建投：REITs市场拐点已至 看好后..."),
        vue.createElementVNode("text", { class: "arrow-right" }, "➡️")
      ]),
      vue.createCommentVNode(" 轮播图 "),
      vue.createElementVNode("view", { class: "swiper-container" }, [
        vue.createElementVNode("swiper", {
          class: "swiper",
          "indicator-dots": "true",
          autoplay: "true",
          interval: "3000",
          duration: "500"
        }, [
          vue.createElementVNode("swiper-item", null, [
            vue.createElementVNode("view", { class: "swiper-item" }, [
              vue.createElementVNode("image", {
                src: "https://thafd.bing.com/th/id/OIP.h5Dnm2eV7jzm2z8-1ig0iAHaDJ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
                class: "swiper-image",
                mode: "aspectFill"
              }),
              vue.createElementVNode("text", { class: "swiper-desc" }, "信用卡优惠活动")
            ])
          ]),
          vue.createElementVNode("swiper-item", null, [
            vue.createElementVNode("view", { class: "swiper-item" }, [
              vue.createElementVNode("image", {
                src: "https://thafd.bing.com/th/id/OIP.ShhOt-72lWZa7qJGwxoRBwHaDs?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
                class: "swiper-image",
                mode: "aspectFill"
              }),
              vue.createElementVNode("text", { class: "swiper-desc" }, "新客专享礼遇")
            ])
          ]),
          vue.createElementVNode("swiper-item", null, [
            vue.createElementVNode("view", { class: "swiper-item" }, [
              vue.createElementVNode("image", {
                src: "https://thafd.bing.com/th/id/OIP.Qasbo_B7CgQZgQbJZQs43QHaCI?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
                class: "swiper-image",
                mode: "aspectFill"
              }),
              vue.createElementVNode("text", { class: "swiper-desc" }, "理财知识讲座")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 广告区域 "),
      vue.createElementVNode("view", { class: "ad-section" }, [
        vue.createElementVNode("view", { class: "ad-content" }, [
          vue.createElementVNode("text", { class: "ad-title" }, "一键绑卡"),
          vue.createElementVNode("text", { class: "ad-desc" }, "美好生活 乐享便捷支付"),
          vue.createElementVNode("button", { class: "ad-btn" }, "GO")
        ])
      ]),
      vue.createCommentVNode(" 热门活动 "),
      vue.createElementVNode("view", { class: "hot-activities" }, [
        vue.createElementVNode("text", { class: "activities-title" }, "热门活动"),
        vue.createElementVNode("text", { class: "arrow-right" }, "➡️")
      ]),
      vue.createCommentVNode(" 活动卡片 "),
      vue.createElementVNode("view", { class: "activity-cards" }, [
        vue.createElementVNode("view", { class: "activity-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "星级福利"),
          vue.createElementVNode("text", { class: "card-desc" }, "月度福利领取活动")
        ]),
        vue.createElementVNode("view", { class: "activity-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "超多彩品牌优惠券"),
          vue.createElementVNode("text", { class: "card-desc" }, "折扣低至5.5折")
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-83a5a03c"], ["__file", "E:/项目/yihangyidon/src/pages/index/index.vue"]]);
  class ThemeManager {
    constructor() {
      this.currentTheme = "light";
      this.themeList = [
        "light",
        "dark",
        "blue",
        "green",
        "purple",
        "orange",
        "pink",
        "red",
        "teal",
        "indigo",
        "amber",
        "cyan"
      ];
      this.themes = {
        light: {
          "--bg-color": "#f5f5f5",
          "--text-color": "#333333",
          "--card-bg": "#ffffff",
          "--border-color": "#eeeeee",
          "--primary-color": "#2e7d32",
          "--secondary-color": "#4caf50",
          "--danger-color": "#e74c3c",
          "--warning-color": "#f39c12",
          "--success-color": "#27ae60"
        },
        dark: {
          "--bg-color": "#1a1a1a",
          "--text-color": "#ffffff",
          "--card-bg": "#2d2d2d",
          "--border-color": "#404040",
          "--primary-color": "#4caf50",
          "--secondary-color": "#66bb6a",
          "--danger-color": "#ef5350",
          "--warning-color": "#ffa726",
          "--success-color": "#66bb6a"
        },
        blue: {
          "--bg-color": "#e3f2fd",
          "--text-color": "#1565c0",
          "--card-bg": "#ffffff",
          "--border-color": "#bbdefb",
          "--primary-color": "#1976d2",
          "--secondary-color": "#42a5f5",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        green: {
          "--bg-color": "#e8f5e8",
          "--text-color": "#2e7d32",
          "--card-bg": "#ffffff",
          "--border-color": "#c8e6c9",
          "--primary-color": "#4caf50",
          "--secondary-color": "#66bb6a",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        purple: {
          "--bg-color": "#f3e5f5",
          "--text-color": "#7b1fa2",
          "--card-bg": "#ffffff",
          "--border-color": "#e1bee7",
          "--primary-color": "#9c27b0",
          "--secondary-color": "#ba68c8",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        orange: {
          "--bg-color": "#fff3e0",
          "--text-color": "#e65100",
          "--card-bg": "#ffffff",
          "--border-color": "#ffcc02",
          "--primary-color": "#ff9800",
          "--secondary-color": "#ffb74d",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        pink: {
          "--bg-color": "#fce4ec",
          "--text-color": "#c2185b",
          "--card-bg": "#ffffff",
          "--border-color": "#f8bbd9",
          "--primary-color": "#e91e63",
          "--secondary-color": "#f06292",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        red: {
          "--bg-color": "#ffebee",
          "--text-color": "#c62828",
          "--card-bg": "#ffffff",
          "--border-color": "#ffcdd2",
          "--primary-color": "#f44336",
          "--secondary-color": "#ef5350",
          "--danger-color": "#d32f2f",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        teal: {
          "--bg-color": "#e0f2f1",
          "--text-color": "#00695c",
          "--card-bg": "#ffffff",
          "--border-color": "#b2dfdb",
          "--primary-color": "#009688",
          "--secondary-color": "#4db6ac",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        indigo: {
          "--bg-color": "#e8eaf6",
          "--text-color": "#283593",
          "--card-bg": "#ffffff",
          "--border-color": "#c5cae9",
          "--primary-color": "#3f51b5",
          "--secondary-color": "#7986cb",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        amber: {
          "--bg-color": "#fff8e1",
          "--text-color": "#f57f17",
          "--card-bg": "#ffffff",
          "--border-color": "#ffecb3",
          "--primary-color": "#ffc107",
          "--secondary-color": "#ffd54f",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        },
        cyan: {
          "--bg-color": "#e0f7fa",
          "--text-color": "#006064",
          "--card-bg": "#ffffff",
          "--border-color": "#b2ebf2",
          "--primary-color": "#00bcd4",
          "--secondary-color": "#4dd0e1",
          "--danger-color": "#f44336",
          "--warning-color": "#ff9800",
          "--success-color": "#4caf50"
        }
      };
    }
    // 初始化主题
    init() {
      try {
        const savedTheme = uni.getStorageSync("appTheme");
        if (savedTheme && this.themes[savedTheme]) {
          this.currentTheme = savedTheme;
          this.applyTheme(savedTheme);
        }
      } catch (error) {
        formatAppLog("error", "at utils/theme.js:154", "初始化主题失败:", error);
      }
    }
    // 获取当前主题
    getCurrentTheme() {
      return this.currentTheme;
    }
    // 切换主题
    toggleTheme() {
      const currentIndex = this.themeList.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.themeList.length;
      const newTheme = this.themeList[nextIndex];
      this.setTheme(newTheme);
      return newTheme;
    }
    // 设置主题
    setTheme(theme) {
      if (!this.themes[theme]) {
        formatAppLog("error", "at utils/theme.js:175", "不支持的主题:", theme);
        return false;
      }
      this.currentTheme = theme;
      try {
        uni.setStorageSync("appTheme", theme);
      } catch (error) {
        formatAppLog("error", "at utils/theme.js:185", "保存主题失败:", error);
      }
      this.applyTheme(theme);
      uni.$emit("themeChanged", theme);
      return true;
    }
    // 应用主题
    applyTheme(theme) {
      this.themes[theme];
    }
    // 获取主题变量
    getThemeVar(varName) {
      const themeVars = this.themes[this.currentTheme];
      return themeVars[varName] || "";
    }
    // 获取所有主题变量
    getThemeVars() {
      return this.themes[this.currentTheme];
    }
  }
  const themeManager = new ThemeManager();
  const _sfc_main$a = {
    data() {
      return {
        userInfo: null,
        currentTheme: "light"
        // 默认浅色主题
      };
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/user/user.vue:168", "个人中心：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login",
            fail: (error) => {
              formatAppLog("error", "at pages/user/user.vue:172", "个人中心跳转失败:", error);
              uni.navigateTo({ url: "/pages/denglu/login" });
            }
          });
          return;
        }
        this.checkLoginStatus();
        this.loadTheme();
      } catch (error) {
        formatAppLog("error", "at pages/user/user.vue:182", "个人中心onShow检查失败:", error);
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
      // 快捷功能
      goToTransfer() {
        uni.showToast({
          title: "转账功能",
          icon: "none"
        });
      },
      goToPayment() {
        uni.showToast({
          title: "缴费功能",
          icon: "none"
        });
      },
      goToInvestment() {
        uni.showToast({
          title: "理财功能",
          icon: "none"
        });
      },
      goToCredit() {
        uni.showToast({
          title: "信用卡功能",
          icon: "none"
        });
      },
      // 菜单功能
      goToAccount() {
        uni.showToast({
          title: "我的账户",
          icon: "none"
        });
      },
      goToCards() {
        uni.showToast({
          title: "我的卡片",
          icon: "none"
        });
      },
      goToTransactions() {
        uni.showToast({
          title: "交易记录",
          icon: "none"
        });
      },
      goToSecurity() {
        uni.showToast({
          title: "安全设置",
          icon: "none"
        });
      },
      goToContact() {
        uni.showToast({
          title: "联系客服",
          icon: "none"
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
          formatAppLog("error", "at pages/user/user.vue:294", "查看退出记录失败:", error);
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
      goToHelp() {
        uni.showToast({
          title: "帮助中心",
          icon: "none"
        });
      },
      // 加载主题设置
      loadTheme() {
        themeManager.init();
        this.currentTheme = themeManager.getCurrentTheme();
      },
      // 获取主题显示名称
      getThemeDisplayName(theme) {
        const themeNames = {
          "light": "浅色主题",
          "dark": "深色主题",
          "blue": "蓝色主题",
          "green": "绿色主题",
          "purple": "紫色主题",
          "orange": "橙色主题",
          "pink": "粉色主题",
          "red": "红色主题",
          "teal": "青色主题",
          "indigo": "靛蓝主题",
          "amber": "琥珀主题",
          "cyan": "青色主题"
        };
        return themeNames[theme] || theme;
      },
      // 切换主题
      toggleTheme() {
        const newTheme = themeManager.toggleTheme();
        this.currentTheme = newTheme;
        uni.showToast({
          title: `已切换到${this.getThemeDisplayName(newTheme)}`,
          icon: "success",
          duration: 1500
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "user-page" }, [
      vue.createCommentVNode(" 顶部背景 "),
      vue.createElementVNode("view", { class: "header-bg" }),
      vue.createCommentVNode(" 用户信息卡片 "),
      $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "user-card"
      }, [
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("view", { class: "avatar-section" }, [
            vue.createElementVNode("view", { class: "avatar" }, [
              vue.createElementVNode("image", {
                src: $data.userInfo.avatar || "/static/default-avatar.png",
                mode: "aspectFill"
              }, null, 8, ["src"])
            ]),
            vue.createElementVNode("view", { class: "user-details" }, [
              vue.createElementVNode(
                "text",
                { class: "username" },
                vue.toDisplayString($data.userInfo.nickname || $data.userInfo.username),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "user-level" }, "VIP客户")
            ])
          ]),
          vue.createElementVNode("view", { class: "account-info" }, [
            vue.createElementVNode("text", { class: "account-label" }, "账户余额"),
            vue.createElementVNode("text", { class: "account-balance" }, "¥ 12,580.00")
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 未登录状态 "),
          vue.createElementVNode("view", { class: "login-card" }, [
            vue.createElementVNode("view", { class: "login-content" }, [
              vue.createElementVNode("text", { class: "login-title" }, "欢迎使用农业银行"),
              vue.createElementVNode("text", { class: "login-subtitle" }, "请登录您的账户"),
              vue.createElementVNode("button", {
                class: "login-btn",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
              }, "立即登录")
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 快捷功能 "),
      $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "quick-functions"
      }, [
        vue.createElementVNode("view", { class: "function-grid" }, [
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goToTransfer && $options.goToTransfer(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon transfer-icon" }, "💳"),
            vue.createElementVNode("text", { class: "function-text" }, "转账")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.goToPayment && $options.goToPayment(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon payment-icon" }, "💰"),
            vue.createElementVNode("text", { class: "function-text" }, "缴费")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goToInvestment && $options.goToInvestment(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon investment-icon" }, "📈"),
            vue.createElementVNode("text", { class: "function-text" }, "理财")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goToCredit && $options.goToCredit(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon credit-icon" }, "💳"),
            vue.createElementVNode("text", { class: "function-text" }, "信用卡")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 功能菜单 "),
      $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "menu-sections"
      }, [
        vue.createCommentVNode(" 账户管理 "),
        vue.createElementVNode("view", { class: "menu-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "账户管理"),
          vue.createElementVNode("view", { class: "menu-list" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.goToAccount && $options.goToAccount(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "🏦"),
                vue.createElementVNode("text", { class: "menu-text" }, "我的账户")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.goToCards && $options.goToCards(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "💳"),
                vue.createElementVNode("text", { class: "menu-text" }, "我的卡片")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.goToTransactions && $options.goToTransactions(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "📊"),
                vue.createElementVNode("text", { class: "menu-text" }, "交易记录")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ])
          ])
        ]),
        vue.createCommentVNode(" 个人设置 "),
        vue.createElementVNode("view", { class: "menu-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "个人设置"),
          vue.createElementVNode("view", { class: "menu-list" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.goToProfile && $options.goToProfile(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "👤"),
                vue.createElementVNode("text", { class: "menu-text" }, "个人资料")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.goToSecurity && $options.goToSecurity(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "🔒"),
                vue.createElementVNode("text", { class: "menu-text" }, "安全设置")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item theme-item",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.toggleTheme && $options.toggleTheme(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "🎨"),
                vue.createElementVNode("text", { class: "menu-text" }, "主题切换")
              ]),
              vue.createElementVNode("view", { class: "theme-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "theme-desc" },
                  vue.toDisplayString($options.getThemeDisplayName($data.currentTheme)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 客户服务 "),
        vue.createElementVNode("view", { class: "menu-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "客户服务"),
          vue.createElementVNode("view", { class: "menu-list" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.goToHelp && $options.goToHelp(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "❓"),
                vue.createElementVNode("text", { class: "menu-text" }, "帮助中心")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.goToContact && $options.goToContact(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "📞"),
                vue.createElementVNode("text", { class: "menu-text" }, "联系客服")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[13] || (_cache[13] = (...args) => $options.viewLogoutHistory && $options.viewLogoutHistory(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-left" }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "📋"),
                vue.createElementVNode("text", { class: "menu-text" }, "退出记录")
              ]),
              vue.createElementVNode("text", { class: "arrow" }, ">")
            ])
          ])
        ]),
        vue.createCommentVNode(" 退出登录 "),
        vue.createElementVNode("view", { class: "logout-section" }, [
          vue.createElementVNode("button", {
            class: "logout-btn",
            onClick: _cache[14] || (_cache[14] = (...args) => $options.handleLogout && $options.handleLogout(...args))
          }, "退出登录")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-99b0ba47"], ["__file", "E:/项目/yihangyidon/src/pages/user/user.vue"]]);
  const _imports_0$1 = "/static/tabbar/service.png";
  const _sfc_main$9 = {
    data() {
      return {
        hideAmount: false,
        activeTab: "deposit",
        tabs: [
          { key: "deposit", name: "存款" },
          { key: "product", name: "理财产品" },
          { key: "insurance", name: "保险" },
          { key: "forex", name: "外汇" }
        ],
        // 顶部轮播图片（本地）
        swiperImages: [
          "/static/wealth/swip1.jpg",
          "/static/wealth/swip2.jpg",
          "/static/wealth/swip3.jpg"
        ],
        // 客服
        serviceHotline: "95599",
        serviceHours: "7×24小时在线",
        totalAssets: "125,438.52",
        yesterdayProfit: "+35.78",
        depositSummary: {
          current: "23,560.20",
          fixed: "80,000.00",
          smart: "8,520.32"
        },
        depositProducts: [
          { id: "d1", name: "整存整取", term: "3个月", minAmount: 1e3, rate: 1.85 },
          { id: "d2", name: "整存整取", term: "1年", minAmount: 1e3, rate: 2.1 },
          { id: "d3", name: "大额存单", term: "3年", minAmount: 2e5, rate: 2.95 }
        ],
        wealthProducts: [
          { id: "w1", name: "稳健优选第68期", risk: "低", term: "90天", minAmount: 1e4, yield: 3.2 },
          { id: "w2", name: "灵活理财T+1", risk: "低", term: "开放式", minAmount: 1e3, yield: 2.65 },
          { id: "w3", name: "进取增强半年期", risk: "中", term: "180天", minAmount: 1e4, yield: 4.1 }
        ],
        insuranceList: [
          { id: "i1", name: "安心医疗险", type: "health", typeText: "医疗险", desc: "百万保额·报销广", premium: 268 },
          { id: "i2", name: "家庭意外险", type: "accident", typeText: "意外险", desc: "全家保障·一年期", premium: 199 },
          { id: "i3", name: "重疾守护", type: "critical", typeText: "重疾险", desc: "重大疾病全面保障", premium: 860 }
        ],
        forexList: [
          { code: "USD/CNY", price: "7.2375", change: 0.12 },
          { code: "EUR/CNY", price: "7.8801", change: -0.08 },
          { code: "JPY/CNY", price: "0.0468", change: 0.02 }
        ]
      };
    },
    methods: {
      onSwiperClick(idx) {
        uni.showToast({ title: `轮播图第${idx + 1}张`, icon: "none" });
      },
      onOnlineService() {
        uni.navigateTo({ url: "/pages/service/chat" });
      },
      onCallHotline() {
        uni.makePhoneCall({ phoneNumber: this.serviceHotline });
      },
      onRecharge() {
        uni.showToast({ title: "充值功能开发中", icon: "none" });
      },
      onWithdraw() {
        uni.showToast({ title: "提现功能开发中", icon: "none" });
      },
      onViewAll(type) {
        uni.showToast({ title: `查看全部(${type})`, icon: "none" });
      },
      onDepositDetail(item) {
        uni.showToast({ title: `${item.name} · ${item.term}`, icon: "none" });
      },
      onDepositBuy(item) {
        uni.showToast({ title: `存入：${item.name}`, icon: "none" });
      },
      onProductDetail(p) {
        uni.showToast({ title: `${p.name}`, icon: "none" });
      },
      onProductBuy(p) {
        uni.showToast({ title: `申购：${p.name}`, icon: "none" });
      },
      onInsuranceDetail(ins) {
        uni.showToast({ title: `${ins.name}`, icon: "none" });
      },
      onInsuranceBuy(ins) {
        uni.showToast({ title: `投保：${ins.name}`, icon: "none" });
      },
      onForexTrade(fx) {
        uni.showToast({ title: `外汇交易：${fx.code}`, icon: "none" });
      },
      onOpenTool(tool) {
        const map = { calc: "收益计算器", calendar: "产品日历", risk: "风险评测" };
        uni.showToast({ title: `${map[tool]}(开发中)`, icon: "none" });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "wealth-container" }, [
      vue.createCommentVNode(" 资产概览轮播（图片版） "),
      vue.createElementVNode("view", { class: "asset-swiper-wrap" }, [
        vue.createElementVNode("swiper", {
          class: "asset-swiper",
          circular: true,
          autoplay: true,
          interval: 4e3,
          duration: 500,
          "indicator-dots": "",
          "indicator-active-color": "#2e7d32"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.swiperImages, (img, idx) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: idx }, [
                vue.createElementVNode("image", {
                  class: "swiper-image",
                  src: img,
                  mode: "aspectFill",
                  onClick: ($event) => $options.onSwiperClick(idx)
                }, null, 8, ["src", "onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 客服模块 "),
      vue.createElementVNode("view", {
        class: "service-card",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.onOnlineService && $options.onOnlineService(...args))
      }, [
        vue.createElementVNode("image", {
          class: "service-icon",
          src: _imports_0$1,
          mode: "aspectFit"
        }),
        vue.createElementVNode("view", { class: "service-info" }, [
          vue.createElementVNode("text", { class: "service-title" }, "专属客服"),
          vue.createElementVNode(
            "text",
            { class: "service-sub" },
            vue.toDisplayString($data.serviceHours) + " · 为您解答理财问题",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "service-actions" }, [
          vue.createElementVNode("button", {
            class: "mini-btn ghost",
            onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.onOnlineService && $options.onOnlineService(...args), ["stop"]))
          }, "在线客服"),
          vue.createElementVNode(
            "button",
            {
              class: "mini-btn call",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.onCallHotline && $options.onCallHotline(...args), ["stop"]))
            },
            "拨打 " + vue.toDisplayString($data.serviceHotline),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 四宫格入口 "),
      vue.createElementVNode("view", { class: "entry-grid" }, [
        vue.createElementVNode("view", {
          class: "entry-item",
          onClick: _cache[3] || (_cache[3] = ($event) => $data.activeTab = "deposit")
        }, [
          vue.createElementVNode("view", { class: "entry-icon" }, "🏦"),
          vue.createElementVNode("text", { class: "entry-text" }, "存款")
        ]),
        vue.createElementVNode("view", {
          class: "entry-item",
          onClick: _cache[4] || (_cache[4] = ($event) => $data.activeTab = "product")
        }, [
          vue.createElementVNode("view", { class: "entry-icon" }, "📈"),
          vue.createElementVNode("text", { class: "entry-text" }, "理财产品")
        ]),
        vue.createElementVNode("view", {
          class: "entry-item",
          onClick: _cache[5] || (_cache[5] = ($event) => $data.activeTab = "insurance")
        }, [
          vue.createElementVNode("view", { class: "entry-icon" }, "🛡️"),
          vue.createElementVNode("text", { class: "entry-text" }, "保险")
        ]),
        vue.createElementVNode("view", {
          class: "entry-item",
          onClick: _cache[6] || (_cache[6] = ($event) => $data.activeTab = "forex")
        }, [
          vue.createElementVNode("view", { class: "entry-icon" }, "💱"),
          vue.createElementVNode("text", { class: "entry-text" }, "外汇")
        ])
      ]),
      vue.createCommentVNode(" Tabs "),
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabs, (t) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: t.key,
              class: vue.normalizeClass(["tab-item", { active: $data.activeTab === t.key }]),
              onClick: ($event) => $data.activeTab = t.key
            }, vue.toDisplayString(t.name), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 内容区 "),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "content"
      }, [
        vue.createCommentVNode(" 存款 "),
        $data.activeTab === "deposit" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          vue.createElementVNode("view", { class: "section-card highlight" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "我的存款"),
              vue.createElementVNode("text", {
                class: "link",
                onClick: _cache[7] || (_cache[7] = ($event) => $options.onViewAll("deposit"))
              }, "查看明细")
            ]),
            vue.createElementVNode("view", { class: "deposit-stats" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("text", { class: "stat-label" }, "活期(元)"),
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($data.hideAmount ? "****" : $data.depositSummary.current),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "divider" }),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("text", { class: "stat-label" }, "定期(元)"),
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($data.hideAmount ? "****" : $data.depositSummary.fixed),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "divider" }),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("text", { class: "stat-label" }, "智能存款(元)"),
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($data.hideAmount ? "****" : $data.depositSummary.smart),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section-card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "热门定期存款"),
              vue.createElementVNode("text", { class: "sub" }, "优选期限 · 灵活到期")
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.depositProducts, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "list-item",
                    key: item.id,
                    onClick: ($event) => $options.onDepositDetail(item)
                  }, [
                    vue.createElementVNode("view", { class: "li-left" }, [
                      vue.createElementVNode("view", { class: "title-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "li-title" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "tag" },
                          vue.toDisplayString(item.term),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "li-sub" },
                        "起存金额 " + vue.toDisplayString(item.minAmount) + " 元",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "li-right" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "rate" },
                        vue.toDisplayString(item.rate) + "%",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "rate-sub" }, "年化利率"),
                      vue.createElementVNode("button", {
                        class: "mini-btn",
                        onClick: vue.withModifiers(($event) => $options.onDepositBuy(item), ["stop"])
                      }, "存入", 8, ["onClick"])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 理财产品 "),
        $data.activeTab === "product" ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
          vue.createElementVNode("view", { class: "section-card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "精选理财"),
              vue.createElementVNode("text", { class: "sub" }, "稳健优选 · 风险匹配")
            ]),
            vue.createElementVNode("view", { class: "list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.wealthProducts, (p) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "list-item",
                    key: p.id,
                    onClick: ($event) => $options.onProductDetail(p)
                  }, [
                    vue.createElementVNode("view", { class: "li-left" }, [
                      vue.createElementVNode("view", { class: "title-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "li-title" },
                          vue.toDisplayString(p.name),
                          1
                          /* TEXT */
                        ),
                        p.risk === "中" ? (vue.openBlock(), vue.createElementBlock("text", {
                          key: 0,
                          class: "tag warn"
                        }, "中风险")) : vue.createCommentVNode("v-if", true),
                        p.risk === "低" ? (vue.openBlock(), vue.createElementBlock("text", {
                          key: 1,
                          class: "tag safe"
                        }, "低风险")) : vue.createCommentVNode("v-if", true)
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "li-sub" },
                        vue.toDisplayString(p.term) + " · 起投 " + vue.toDisplayString(p.minAmount) + " 元",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "li-right" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "rate strong" },
                        vue.toDisplayString(p.yield) + "%",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "rate-sub" }, "近七日年化"),
                      vue.createElementVNode("button", {
                        class: "mini-btn primary",
                        onClick: vue.withModifiers(($event) => $options.onProductBuy(p), ["stop"])
                      }, "申购", 8, ["onClick"])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 保险 "),
        $data.activeTab === "insurance" ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
          vue.createElementVNode("view", { class: "section-card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "热门保险"),
              vue.createElementVNode("text", { class: "sub" }, "健康/意外/重疾 全面覆盖")
            ]),
            vue.createElementVNode("view", { class: "ins-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.insuranceList, (ins) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "ins-card",
                    key: ins.id,
                    onClick: ($event) => $options.onInsuranceDetail(ins)
                  }, [
                    vue.createElementVNode("view", { class: "ins-head" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "ins-name" },
                        vue.toDisplayString(ins.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["ins-tag", ins.type])
                        },
                        vue.toDisplayString(ins.typeText),
                        3
                        /* TEXT, CLASS */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "ins-desc" },
                      vue.toDisplayString(ins.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "ins-foot" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "ins-prem" },
                        "￥" + vue.toDisplayString(ins.premium) + "/年起",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("button", {
                        class: "mini-btn",
                        onClick: vue.withModifiers(($event) => $options.onInsuranceBuy(ins), ["stop"])
                      }, "投保", 8, ["onClick"])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 外汇 "),
        $data.activeTab === "forex" ? (vue.openBlock(), vue.createElementBlock("view", { key: 3 }, [
          vue.createElementVNode("view", { class: "section-card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "外汇行情"),
              vue.createElementVNode("text", { class: "sub" }, "实时汇率 · 支持结售汇")
            ]),
            vue.createElementVNode("view", { class: "fx-table" }, [
              vue.createElementVNode("view", { class: "fx-row fx-head" }, [
                vue.createElementVNode("text", { class: "fx-col code" }, "币种"),
                vue.createElementVNode("text", { class: "fx-col price" }, "现价"),
                vue.createElementVNode("text", { class: "fx-col change" }, "涨跌"),
                vue.createElementVNode("text", { class: "fx-col op" }, "操作")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.forexList, (fx) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "fx-row",
                    key: fx.code
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "fx-col code" },
                      vue.toDisplayString(fx.code),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "fx-col price" },
                      vue.toDisplayString(fx.price),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["fx-col change", { up: fx.change > 0, down: fx.change < 0 }])
                      },
                      vue.toDisplayString(fx.change > 0 ? "+" + fx.change : fx.change) + "% ",
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode("view", { class: "fx-col op" }, [
                      vue.createElementVNode("button", {
                        class: "mini-btn",
                        onClick: vue.withModifiers(($event) => $options.onForexTrade(fx), ["stop"])
                      }, "交易", 8, ["onClick"])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "section-card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "常用工具")
            ]),
            vue.createElementVNode("view", { class: "tool-grid" }, [
              vue.createElementVNode("view", {
                class: "tool-item",
                onClick: _cache[8] || (_cache[8] = ($event) => $options.onOpenTool("calc"))
              }, [
                vue.createElementVNode("text", { class: "tool-icon" }, "🧮"),
                vue.createElementVNode("text", { class: "tool-text" }, "收益计算器")
              ]),
              vue.createElementVNode("view", {
                class: "tool-item",
                onClick: _cache[9] || (_cache[9] = ($event) => $options.onOpenTool("calendar"))
              }, [
                vue.createElementVNode("text", { class: "tool-icon" }, "📅"),
                vue.createElementVNode("text", { class: "tool-text" }, "产品日历")
              ]),
              vue.createElementVNode("view", {
                class: "tool-item",
                onClick: _cache[10] || (_cache[10] = ($event) => $options.onOpenTool("risk"))
              }, [
                vue.createElementVNode("text", { class: "tool-icon" }, "⚖️"),
                vue.createElementVNode("text", { class: "tool-text" }, "风险评测")
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesWealthWealth = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-a00d3a3e"], ["__file", "E:/项目/yihangyidon/src/pages/wealth/wealth.vue"]]);
  const _sfc_main$8 = {
    name: "LifePage",
    data() {
      return {
        activeCategory: 0,
        categories: ["精选", "活动", "折扣", "品牌"],
        // 轮播图数据
        bannerData: [
          {
            id: 1,
            title: "生活缴费优惠",
            subtitle: "水电燃气一键支付",
            discount: "立减10元",
            icon: "💳",
            action: "payment",
            // 跳转到生活缴费页面
            url: "/pages/payment/payment"
          },
          {
            id: 2,
            title: "手机充值特惠",
            subtitle: "充值满100送20",
            discount: "限时优惠",
            icon: "📱",
            action: "recharge",
            // 跳转到手机充值页面
            url: "/pages/recharge/recharge"
          },
          {
            id: 3,
            title: "政务服务大厅",
            subtitle: "在线办事更便民",
            discount: "免费办理",
            icon: "🏛️",
            action: "government",
            // 跳转到政务服务页面
            url: "/pages/government/government"
          },
          {
            id: 4,
            title: "小豆乐园",
            subtitle: "趣味游戏赢积分",
            discount: "每日签到",
            icon: "🎮",
            action: "games",
            // 跳转到游戏页面
            url: "/pages/games/games"
          }
        ],
        quickServices: [
          {
            icon: "💧",
            label: "生活缴费",
            bgColor: "#00D4AA",
            action: "payment"
          },
          {
            icon: "📱",
            label: "手机充值",
            bgColor: "#FF9500",
            action: "recharge"
          },
          {
            icon: "🏛️",
            label: "政务民生",
            bgColor: "#34C759",
            action: "government"
          },
          { icon: "🎮", label: "小豆乐园", bgColor: "#FF6B35", action: "games" }
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
        ],
        // 不同分类的卡片数据
        promotionCards: {
          0: {
            // 精选
            main: {
              title: "积分当钱花",
              subtitle: "至高抵现50%",
              desc: "积分当钱花优惠手不停",
              buttonText: "立即使用",
              icon: "🎁"
            },
            small: [
              {
                title: "车票优惠享",
                subtitle: "最高88元立减金",
                icon: "🚄",
                type: "blue"
              },
              {
                title: "美食优惠券",
                subtitle: "新用户专享优惠",
                icon: "🍔",
                type: "orange"
              },
              {
                title: "话费充值",
                subtitle: "充100送20话费",
                icon: "📱",
                type: "green"
              },
              {
                title: "电影票特惠",
                subtitle: "周末观影5折起",
                icon: "🎬",
                type: "purple"
              },
              {
                title: "外卖红包",
                subtitle: "满30减15元",
                icon: "🥘",
                type: "red"
              },
              {
                title: "购物返现",
                subtitle: "消费满100返20",
                icon: "🛍️",
                type: "pink"
              },
              {
                title: "加油优惠",
                subtitle: "95号汽油9.5折",
                icon: "⛽",
                type: "yellow"
              },
              {
                title: "咖啡买一送一",
                subtitle: "指定门店限时优惠",
                icon: "☕",
                type: "gray"
              }
            ]
          },
          1: {
            // 活动
            main: {
              title: "限时秒杀",
              subtitle: "每日10点开抢",
              desc: "超值商品限量抢购",
              buttonText: "立即抢购",
              icon: "⚡"
            },
            small: [
              {
                title: "双11狂欢",
                subtitle: "全场商品5折起",
                icon: "🛒",
                type: "red"
              },
              {
                title: "签到有礼",
                subtitle: "连续签到送好礼",
                icon: "📅",
                type: "blue"
              },
              {
                title: "新人专享",
                subtitle: "注册即送50元券",
                icon: "🎊",
                type: "orange"
              },
              {
                title: "邀请好友",
                subtitle: "邀请1人得10元",
                icon: "👥",
                type: "green"
              },
              {
                title: "抽奖大转盘",
                subtitle: "每日免费3次机会",
                icon: "🎰",
                type: "purple"
              },
              {
                title: "满减活动",
                subtitle: "满199减50元",
                icon: "💸",
                type: "pink"
              },
              {
                title: "积分翻倍",
                subtitle: "本周积分双倍返还",
                icon: "⭐",
                type: "yellow"
              },
              {
                title: "会员专场",
                subtitle: "VIP专享8折优惠",
                icon: "👑",
                type: "gray"
              }
            ]
          },
          2: {
            // 折扣
            main: {
              title: "超级折扣日",
              subtitle: "全场最低3折",
              desc: "品牌商品超低折扣",
              buttonText: "查看折扣",
              icon: "💰"
            },
            small: [
              {
                title: "服装鞋帽",
                subtitle: "春季新品5折起",
                icon: "👕",
                type: "pink"
              },
              {
                title: "数码家电",
                subtitle: "爆款产品直降",
                icon: "📱",
                type: "blue"
              },
              {
                title: "母婴用品",
                subtitle: "进口奶粉8折",
                icon: "🍼",
                type: "orange"
              },
              {
                title: "美妆护肤",
                subtitle: "大牌化妆品6折",
                icon: "💄",
                type: "purple"
              },
              {
                title: "家居用品",
                subtitle: "家具家纺7折起",
                icon: "🏠",
                type: "green"
              },
              {
                title: "图书文具",
                subtitle: "学习用品5折起",
                icon: "📚",
                type: "red"
              },
              {
                title: "运动户外",
                subtitle: "健身装备6折起",
                icon: "🏃‍♂️",
                type: "yellow"
              },
              {
                title: "食品生鲜",
                subtitle: "进口食品8折起",
                icon: "🥗",
                type: "gray"
              }
            ]
          },
          3: {
            // 品牌
            main: {
              title: "品牌联盟",
              subtitle: "知名品牌集结",
              desc: "精选品牌特惠专区",
              buttonText: "进入专区",
              icon: "⭐"
            },
            small: [
              {
                title: "苹果专区",
                subtitle: "iPhone新品上市",
                icon: "📱",
                type: "gray"
              },
              {
                title: "耐克运动",
                subtitle: "运动装备8折起",
                icon: "👟",
                type: "red"
              },
              {
                title: "星巴克",
                subtitle: "咖啡买二送一",
                icon: "☕",
                type: "green"
              },
              {
                title: "麦当劳",
                subtitle: "套餐优惠券",
                icon: "🍟",
                type: "yellow"
              },
              {
                title: "华为商城",
                subtitle: "智能设备新品",
                icon: "📟",
                type: "blue"
              },
              {
                title: "优衣库",
                subtitle: "基础款服饰特价",
                icon: "👔",
                type: "orange"
              },
              {
                title: "肯德基",
                subtitle: "全家桶特惠价",
                icon: "🍗",
                type: "purple"
              },
              {
                title: "小米有品",
                subtitle: "智能家居9折",
                icon: "🏡",
                type: "pink"
              }
            ]
          }
        }
      };
    },
    computed: {
      // 当前分类的推广卡片数据
      currentPromotionData() {
        return this.promotionCards[this.activeCategory] || this.promotionCards[0];
      }
    },
    onLoad() {
      this.initPage();
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/life/life.vue:525", "生活页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/life/life.vue:533", "生活页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/life/life.vue:535", "生活页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      initPage() {
        formatAppLog("log", "at pages/life/life.vue:545", "生活页面初始化");
      },
      handleServiceTap(service) {
        formatAppLog("log", "at pages/life/life.vue:549", "点击服务:", service);
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
        formatAppLog("log", "at pages/life/life.vue:574", "切换分类:", this.categories[index]);
        uni.showToast({
          title: `切换到${this.categories[index]}`,
          icon: "none",
          duration: 1e3
        });
      },
      // 获取小卡片的样式类
      getCardClass(type) {
        const classMap = {
          blue: "card-blue",
          orange: "card-orange",
          green: "card-green",
          purple: "card-purple",
          red: "card-red",
          pink: "card-pink",
          gray: "card-gray",
          yellow: "card-yellow"
        };
        return classMap[type] || "card-blue";
      },
      // 处理主卡片点击
      handleMainCardTap() {
        const currentCard = this.currentPromotionData.main;
        formatAppLog("log", "at pages/life/life.vue:601", "点击主卡片:", currentCard);
        uni.showToast({
          title: `点击了${currentCard.title}`,
          icon: "none"
        });
      },
      // 处理小卡片点击
      handleSmallCardTap(card, index) {
        formatAppLog("log", "at pages/life/life.vue:610", "点击小卡片:", card, index);
        uni.showToast({
          title: `点击了${card.title}`,
          icon: "none"
        });
      },
      // 处理轮播图点击
      handleBannerTap(banner) {
        formatAppLog("log", "at pages/life/life.vue:619", "点击轮播图:", banner);
        switch (banner.action) {
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
            if (banner.url) {
              uni.navigateTo({
                url: banner.url,
                success: () => {
                  formatAppLog("log", "at pages/life/life.vue:641", `成功跳转到: ${banner.url}`);
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/life/life.vue:644", "跳转失败:", err);
                  uni.showToast({
                    title: "页面跳转失败",
                    icon: "none"
                  });
                }
              });
            } else {
              uni.showToast({
                title: `点击了${banner.title}`,
                icon: "none"
              });
            }
        }
      },
      goToPayment() {
        formatAppLog("log", "at pages/life/life.vue:661", "跳转到生活缴费页面");
        uni.navigateTo({
          url: "/pages/payment/payment",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:665", "成功跳转到生活缴费页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:668", "跳转失败:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      },
      goToRecharge() {
        formatAppLog("log", "at pages/life/life.vue:678", "跳转到手机充值页面");
        uni.navigateTo({
          url: "/pages/recharge/recharge",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:682", "成功跳转到手机充值页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:685", "跳转失败:", err);
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "life-page" }, [
      vue.createCommentVNode(" 头部标题区域 "),
      vue.createElementVNode("view", { class: "header-section" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("view", { class: "greeting-section" }, [
            vue.createElementVNode("text", { class: "greeting-text" }, "你好，欢迎使用"),
            vue.createElementVNode("text", { class: "app-name" }, "生活服务")
          ]),
          vue.createElementVNode("view", { class: "user-avatar" }, [
            vue.createElementVNode("text", { class: "avatar-icon" }, "👤")
          ])
        ]),
        vue.createElementVNode("view", { class: "header-decoration" }, [
          vue.createElementVNode("view", { class: "decoration-circle circle-1" }),
          vue.createElementVNode("view", { class: "decoration-circle circle-2" }),
          vue.createElementVNode("view", { class: "decoration-circle circle-3" })
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
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.bannerData, (banner, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", {
                key: banner.id
              }, [
                vue.createElementVNode("view", {
                  class: vue.normalizeClass(["banner-item", `banner-item-${index + 1}`]),
                  onClick: ($event) => $options.handleBannerTap(banner)
                }, [
                  vue.createElementVNode("view", { class: "banner-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "banner-title" },
                      vue.toDisplayString(banner.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "banner-subtitle" },
                      vue.toDisplayString(banner.subtitle),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "banner-discount" },
                      vue.toDisplayString(banner.discount),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "banner-decoration" }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["decoration-shape", `shape-${index + 1}`])
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "decoration-icon" },
                      vue.toDisplayString(banner.icon),
                      1
                      /* TEXT */
                    )
                  ])
                ], 10, ["onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 快捷服务 "),
      vue.createElementVNode("view", { class: "quick-services" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "快捷服务"),
          vue.createElementVNode("text", { class: "section-subtitle" }, "常用功能一键直达")
        ]),
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
                    ),
                    vue.createElementVNode("view", { class: "icon-glow" })
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
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "全部服务"),
          vue.createElementVNode("text", { class: "section-subtitle" }, "更多精彩功能等你发现")
        ]),
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
                    ),
                    vue.createElementVNode("view", { class: "icon-glow-large" })
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
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "精选优惠"),
          vue.createElementVNode("text", { class: "section-subtitle" }, "专享福利等你来领")
        ]),
        vue.createElementVNode("view", { class: "promotion-cards" }, [
          vue.createElementVNode("view", { class: "promotion-card large" }, [
            vue.createElementVNode("view", { class: "card-content" }, [
              vue.createElementVNode(
                "text",
                { class: "card-title" },
                vue.toDisplayString($options.currentPromotionData.main.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "card-subtitle" },
                vue.toDisplayString($options.currentPromotionData.main.subtitle),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "card-desc" },
                vue.toDisplayString($options.currentPromotionData.main.desc),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", {
                class: "card-button",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleMainCardTap && $options.handleMainCardTap(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "button-text" },
                  vue.toDisplayString($options.currentPromotionData.main.buttonText),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "card-decoration" }, [
              vue.createElementVNode("view", { class: "decoration-element element-1" }),
              vue.createElementVNode("view", { class: "decoration-element element-2" }),
              vue.createElementVNode(
                "text",
                { class: "card-icon" },
                vue.toDisplayString($options.currentPromotionData.main.icon),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "promotion-cards-right" }, [
            vue.createElementVNode("view", { class: "cards-scroll-container" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.currentPromotionData.small, (card, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["promotion-card small", $options.getCardClass(card.type)]),
                    key: index,
                    onClick: ($event) => $options.handleSmallCardTap(card, index)
                  }, [
                    vue.createElementVNode("view", { class: "small-card-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "card-title-small" },
                        vue.toDisplayString(card.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "card-subtitle-small" },
                        vue.toDisplayString(card.subtitle),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "small-card-icon" },
                        vue.toDisplayString(card.icon),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesLifeLife = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-980f0516"], ["__file", "E:/项目/yihangyidon/src/pages/life/life.vue"]]);
  const _imports_0 = "/static/wealth/aiavatar.png";
  const _imports_1 = "/static/wealth/useravatar.jpg";
  const AI_BASE = "http://127.0.0.1:5000";
  const _sfc_main$7 = {
    data() {
      return {
        draft: "",
        sending: false,
        recording: false,
        scrollIntoId: "",
        placeholder: "请输入您的问题，如“我要查询理财收益”",
        sessionId: "default",
        pendingImageBase64: "",
        pendingImageLocalPath: "",
        showEmoji: false,
        emojiList: ["😀", "😁", "😂", "🤣", "😊", "😍", "😎", "👍", "🙏", "💰", "📈", "🏦", "🛡️", "💱"],
        // 与 mobile.html 一致的表情清单（含短码与图片URL），用于渲染替换
        EMOJI_ITEMS: [
          { code: ":grinning:", char: "😀", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png" },
          { code: ":smiley:", char: "😃", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f603.png" },
          { code: ":smile:", char: "😄", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f604.png" },
          { code: ":grin:", char: "😁", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f601.png" },
          { code: ":joy:", char: "😂", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f602.png" },
          { code: ":sweat_smile:", char: "😅", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f605.png" },
          { code: ":wink:", char: "😉", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f609.png" },
          { code: ":blush:", char: "😊", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60a.png" },
          { code: ":heart_eyes:", char: "😍", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60d.png" },
          { code: ":thinking:", char: "🤔", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f914.png" },
          { code: ":sunglasses:", char: "😎", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60e.png" },
          { code: ":cry:", char: "😢", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f622.png" },
          { code: ":sob:", char: "😭", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f62d.png" },
          { code: ":angry:", char: "😠", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f620.png" },
          { code: ":thumbsup:", char: "👍", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44d.png" },
          { code: ":clap:", char: "👏", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44f.png" },
          { code: ":ok_hand:", char: "👌", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44c.png" },
          { code: ":heart:", char: "❤️", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png" }
        ],
        messages: [
          {
            id: "hello",
            role: "bot",
            html: "您好，我是农业银行AI客服。可为您解答存款、理财、保险、外汇等问题。",
            time: ""
          }
        ],
        recorder: null,
        audioCtx: null
      };
    },
    onLoad() {
      try {
        this.recorder = uni.getRecorderManager && uni.getRecorderManager();
        if (this.recorder) {
          this.recorder.onStop((res) => {
            this.recording = false;
            const tempFilePath = res.tempFilePath;
            this.uploadAudio(tempFilePath);
          });
        }
        this.audioCtx = uni.createInnerAudioContext && uni.createInnerAudioContext();
      } catch (e) {
      }
    },
    methods: {
      // 渲染：安全转义 + 基础Markdown + 表情替换（与 mobile.html 对齐）
      renderMarkdownAndEmojis(text = "") {
        let html = this.escapeHtml(text);
        html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\n/g, "<br/>");
        for (const item of this.EMOJI_ITEMS || []) {
          const img = `<img src="${item.url}" alt="${item.code}" style="height:1.2em;vertical-align:-0.2em"/>`;
          html = html.split(item.code).join(img);
          html = html.split(item.char).join(img);
        }
        return html;
      },
      playAudio(url) {
        try {
          if (!this.audioCtx)
            this.audioCtx = uni.createInnerAudioContext();
          this.audioCtx.src = url;
          this.audioCtx.play();
        } catch (e) {
          uni.showToast({ title: "无法播放语音", icon: "none" });
        }
      },
      toggleEmoji() {
        this.showEmoji = !this.showEmoji;
      },
      appendEmoji(item) {
        const ch = item && item.char ? item.char : "";
        this.draft += (this.draft && !/\s$/.test(this.draft) ? " " : "") + ch + " ";
        this.showEmoji = false;
      },
      toggleRecord() {
        if (!this.recorder) {
          uni.showToast({ title: "当前平台不支持录音", icon: "none" });
          return;
        }
        if (this.recording) {
          this.recorder.stop();
        } else {
          this.recording = true;
          this.recorder.start({
            duration: 6e4,
            sampleRate: 16e3,
            numberOfChannels: 1,
            encodeBitRate: 48e3,
            format: "mp3"
          });
        }
      },
      uploadAudio(filePath) {
        uni.showLoading({ title: "识别中" });
        uni.uploadFile({
          url: `${AI_BASE}/api/speech-to-text`,
          name: "audio",
          filePath,
          success: (res) => {
            uni.hideLoading();
            try {
              const data = JSON.parse(res.data);
              if (data.success && data.text) {
                this.draft = data.text;
                this.send();
              } else {
                uni.showToast({ title: data.error || "识别失败", icon: "none" });
              }
            } catch (e) {
              uni.showToast({ title: "解析失败", icon: "none" });
            }
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({ title: "上传失败", icon: "none" });
          }
        });
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const path = res.tempFilePaths[0];
            this.pendingImageLocalPath = path;
            try {
              this.pendingImageBase64 = "";
              uni.showToast({ title: "H5预览模式：不进行图片转换", icon: "none" });
            } catch (e) {
              formatAppLog("warn", "at pages/service/chat.vue:221", "图片转base64失败:", e);
              this.pendingImageBase64 = "";
              this.pendingImageLocalPath = "";
            }
            uni.showToast({ title: "已选择图片，可继续输入文字后发送", icon: "none" });
          },
          fail: () => {
            uni.showToast({ title: "选择图片取消", icon: "none" });
          }
        });
      },
      clearPendingImage() {
        this.pendingImageLocalPath = "";
        this.pendingImageBase64 = "";
      },
      async send() {
        const content = this.draft.trim();
        if (!content && !this.pendingImageBase64) {
          return;
        }
        if (this.sending)
          return;
        await this.sendMessage(content);
      },
      async sendMessage(content) {
        const renderedUser = this.renderMarkdownAndEmojis(content);
        const userMsg = { id: Date.now() + "-u", role: "user", html: renderedUser, time: this.nowTime() };
        if (this.pendingImageLocalPath) {
          userMsg.image = this.pendingImageLocalPath;
        }
        this.messages.push(userMsg);
        this.draft = "";
        this.showEmoji = false;
        this.toBottom();
        this.sending = true;
        try {
          const [err, res] = await new Promise((resolve) => {
            uni.request({
              url: `${AI_BASE}/api/chat`,
              method: "POST",
              header: { "Content-Type": "application/json" },
              data: { message: content, session_id: this.sessionId, image: this.pendingImageBase64 || null },
              success: (r) => resolve([null, r]),
              fail: (e) => resolve([e, null])
            });
          });
          this.pendingImageBase64 = "";
          this.pendingImageLocalPath = "";
          if (err)
            throw err;
          if (!res || res.statusCode < 200 || res.statusCode >= 300 || !res.data)
            throw new Error("接口异常");
          const data = res.data;
          if (!(data.success && data.reply) && !data.reply) {
            throw new Error(data.error || "无有效应答");
          }
          let replyText = Array.isArray(data.reply) ? data.reply.map((p) => p && p.text ? p.text : "").join("") : typeof data.reply === "string" ? data.reply : "";
          const renderedReply = this.renderMarkdownAndEmojis(replyText || "");
          const botId = Date.now() + "-b";
          this.messages.push({ id: botId, role: "bot", html: renderedReply, time: data.timestamp || this.nowTime() });
          this.toBottom();
          const [tErr, tRes] = await new Promise((resolve) => {
            uni.request({
              url: `${AI_BASE}/api/text-to-speech`,
              method: "POST",
              header: { "Content-Type": "application/json" },
              data: { text: replyText || "" },
              success: (r) => resolve([null, r]),
              fail: (e) => resolve([e, null])
            });
          });
          if (!tErr && tRes && tRes.statusCode >= 200 && tRes.statusCode < 300 && tRes.data && tRes.data.success && tRes.data.audio_file) {
            const url = `${AI_BASE}/api/audio/${tRes.data.audio_file}`;
            const lastIdx = this.messages.length - 1;
            if (lastIdx >= 0 && this.messages[lastIdx].role === "bot") {
              this.$set(this.messages[lastIdx], "audio", url);
            }
          }
        } catch (e) {
          const reply = this.generateReply(content);
          const rendered = this.renderMarkdownAndEmojis(reply);
          this.messages.push({ id: Date.now() + "-b", role: "bot", html: rendered, time: this.nowTime() });
          uni.showToast({ title: "AI服务不可用，已使用本地回复", icon: "none" });
        } finally {
          this.sending = false;
          this.toBottom();
        }
      },
      generateReply(text) {
        const t = text.toLowerCase();
        if (t.includes("存款") || t.includes("定期") || t.includes("利率")) {
          return "存款业务：活期按日计息，定期支持3个月/6个月/1年/3年等档，起存金额1000元起。可通过“财富-存款”进行办理。";
        }
        if (t.includes("理财") || t.includes("收益") || t.includes("申购")) {
          return "理财产品分为低/中风险，起投金额1000-10000元不等，支持T+1灵活赎回与封闭期产品，详情见“财富-理财产品”。";
        }
        if (t.includes("保险") || t.includes("意外") || t.includes("重疾")) {
          return "保险服务：提供医疗险、意外险、重疾险等多品类方案，支持在线投保与电子保单。可在“财富-保险”查看。";
        }
        if (t.includes("外汇") || t.includes("汇率") || t.includes("结售汇")) {
          return "外汇业务：支持主要币种实时汇率查询与结售汇，您可在“财富-外汇”查看行情并发起交易。";
        }
        if (t.includes("人工") || t.includes("转接") || t.includes("客服")) {
          return "需要人工服务吗？您可以拨打客服热线 95599，我们将尽快为您安排专属服务。";
        }
        return "已收到您的问题。我将为您查找相关信息，您也可以具体描述业务类型（如：存款/理财/保险/外汇）。";
      },
      toBottom() {
        this.$nextTick(() => {
          this.scrollIntoId = "msg-" + (this.messages.length - 1);
        });
      },
      escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      },
      nowTime() {
        const d = /* @__PURE__ */ new Date();
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-page" }, [
      vue.createElementVNode("view", { class: "chat-header" }, [
        vue.createElementVNode("text", { class: "title" }, "AI 智能客服"),
        vue.createElementVNode("text", { class: "sub" }, "24小时为您服务")
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "chat-body",
        "scroll-into-view": $data.scrollIntoId
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.messages, (m, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: m.id,
              id: "msg-" + i,
              class: vue.normalizeClass(["msg-row", m.role])
            }, [
              m.role === "bot" ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "avatar",
                src: _imports_0,
                mode: "aspectFit"
              })) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "bubble" }, [
                m.html ? (vue.openBlock(), vue.createElementBlock("rich-text", {
                  key: 0,
                  nodes: m.html
                }, null, 8, ["nodes"])) : vue.createCommentVNode("v-if", true),
                m.image ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: m.image,
                  style: { "max-width": "100%", "border-radius": "8rpx" },
                  mode: "widthFix"
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                m.audio ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "audio-row"
                }, [
                  vue.createElementVNode("button", {
                    class: "mini-btn ghost",
                    onClick: ($event) => $options.playAudio(m.audio)
                  }, "▶ 播放语音", 8, ["onClick"])
                ])) : vue.createCommentVNode("v-if", true),
                m.time ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 3,
                    class: "time"
                  },
                  vue.toDisplayString(m.time),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              m.role === "user" ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                class: "avatar",
                src: _imports_1,
                mode: "aspectFit"
              })) : vue.createCommentVNode("v-if", true)
            ], 10, ["id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 8, ["scroll-into-view"]),
      vue.createCommentVNode(" 待发送图片预览（不改变原布局，仅在输入栏上方增加一行） "),
      $data.pendingImageLocalPath ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "pending-preview"
      }, [
        vue.createElementVNode("image", {
          src: $data.pendingImageLocalPath,
          class: "pending-img",
          mode: "aspectFit"
        }, null, 8, ["src"]),
        vue.createElementVNode("button", {
          class: "mini-btn ghost",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.clearPendingImage && $options.clearPendingImage(...args))
        }, "移除")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 表情面板（与 mobile.html 一致：图片表情选择） "),
      $data.showEmoji ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "emoji-panel"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.EMOJI_ITEMS, (item, idx) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "emoji-item",
              key: idx,
              onClick: ($event) => $options.appendEmoji(item),
              title: item.code
            }, [
              vue.createElementVNode("image", {
                src: item.url,
                alt: item.code,
                style: { "width": "24px", "height": "24px" },
                mode: "aspectFit"
              }, null, 8, ["src", "alt"])
            ], 8, ["onClick", "title"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "chat-input" }, [
        vue.createElementVNode("view", { class: "tools" }, [
          vue.createElementVNode("button", {
            class: "tool-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.chooseImage && $options.chooseImage(...args)),
            "hover-class": "btn-hover",
            "hover-stay-time": "50"
          }, "🖼️"),
          vue.createElementVNode("button", {
            class: "tool-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleEmoji && $options.toggleEmoji(...args)),
            "hover-class": "btn-hover",
            "hover-stay-time": "50"
          }, "😀"),
          vue.createElementVNode(
            "button",
            {
              class: "tool-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.toggleRecord && $options.toggleRecord(...args)),
              "hover-class": "btn-hover",
              "hover-stay-time": "50"
            },
            vue.toDisplayString($data.recording ? "■" : "🎤"),
            1
            /* TEXT */
          )
        ]),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "input",
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.draft = $event),
          placeholder: $data.placeholder,
          "confirm-type": "send",
          onConfirm: _cache[5] || (_cache[5] = (...args) => $options.send && $options.send(...args))
        }, null, 40, ["placeholder"]), [
          [vue.vModelText, $data.draft]
        ]),
        vue.createElementVNode("button", {
          class: "send",
          disabled: !$data.draft.trim() || $data.sending,
          onClick: _cache[6] || (_cache[6] = (...args) => $options.send && $options.send(...args))
        }, vue.toDisplayString($data.sending ? "发送中..." : "发送"), 9, ["disabled"])
      ])
    ]);
  }
  const PagesServiceChat = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-e19cce9b"], ["__file", "E:/项目/yihangyidon/src/pages/service/chat.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        currentTab: "account",
        // 默认选择账号转账
        accountForm: {
          account: "",
          name: "",
          amount: "",
          remark: ""
        },
        phoneForm: {
          phone: "",
          amount: "",
          remark: ""
        }
      };
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/transfer/transfer.vue:99", "转账页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/transfer/transfer.vue:107", "转账页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/transfer/transfer.vue:109", "转账页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      // 切换转账类型
      switchTab(tab) {
        this.currentTab = tab;
      },
      // 提交转账
      submitTransfer() {
        if (this.currentTab === "account") {
          if (!this.accountForm.account || !this.accountForm.name || !this.accountForm.amount) {
            uni.showToast({
              title: "请填写完整信息",
              icon: "none"
            });
            return;
          }
          uni.showModal({
            title: "转账确认",
            content: `向 ${this.accountForm.name}（账号：${this.accountForm.account}）转账 ${this.accountForm.amount} 元`,
            success: (res) => {
              if (res.confirm) {
                uni.showToast({
                  title: "转账成功",
                  icon: "success"
                });
                this.accountForm = {
                  account: "",
                  name: "",
                  amount: "",
                  remark: ""
                };
              }
            }
          });
        } else {
          if (!this.phoneForm.phone || !this.phoneForm.amount) {
            uni.showToast({
              title: "请填写完整信息",
              icon: "none"
            });
            return;
          }
          uni.showModal({
            title: "转账确认",
            content: `向手机号 ${this.phoneForm.phone} 转账 ${this.phoneForm.amount} 元`,
            success: (res) => {
              if (res.confirm) {
                uni.showToast({
                  title: "转账成功",
                  icon: "success"
                });
                this.phoneForm = {
                  phone: "",
                  amount: "",
                  remark: ""
                };
              }
            }
          });
        }
      },
      // 跳转到转账记录
      goToTransferHistory() {
        uni.showToast({
          title: "跳转到转账记录页面",
          icon: "none"
        });
      },
      // 跳转到转账设置
      goToTransferSettings() {
        uni.showToast({
          title: "跳转到转账设置页面",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "transfer-page" }, [
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", { class: "nav-title" }, "转账")
      ]),
      vue.createCommentVNode(" 转账类型选择 "),
      vue.createElementVNode("view", { class: "transfer-types" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["type-item", { active: $data.currentTab === "account" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.switchTab("account"))
          },
          [
            vue.createElementVNode("text", { class: "type-text" }, "账号转账")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["type-item", { active: $data.currentTab === "phone" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab("phone"))
          },
          [
            vue.createElementVNode("text", { class: "type-text" }, "手机号转账")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 转账表单 "),
      vue.createElementVNode("view", { class: "transfer-form" }, [
        vue.createCommentVNode(" 账号转账表单 "),
        $data.currentTab === "account" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "收款方账号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "请输入收款方账号",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.accountForm.account = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.accountForm.account]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "收款人姓名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "请输入收款人姓名",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.accountForm.name = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.accountForm.name]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "转账金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                type: "digit",
                placeholder: "请输入转账金额",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.accountForm.amount = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.accountForm.amount]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "转账附言"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "选填，不超过20个字",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.accountForm.remark = $event),
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.accountForm.remark]
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 手机号转账表单 "),
        $data.currentTab === "phone" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "收款人手机号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                type: "number",
                placeholder: "请输入收款人手机号",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.phoneForm.phone = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.phoneForm.phone]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "转账金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                type: "digit",
                placeholder: "请输入转账金额",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.phoneForm.amount = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.phoneForm.amount]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "转账附言"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "选填，不超过20个字",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.phoneForm.remark = $event),
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.phoneForm.remark]
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 转账按钮 "),
        vue.createElementVNode("button", {
          class: "transfer-btn",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.submitTransfer && $options.submitTransfer(...args))
        }, "确认转账")
      ]),
      vue.createCommentVNode(" 其他功能 "),
      vue.createElementVNode("view", { class: "other-functions" }, [
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[10] || (_cache[10] = (...args) => $options.goToTransferHistory && $options.goToTransferHistory(...args))
        }, [
          vue.createElementVNode("text", { class: "function-text" }, "转账记录"),
          vue.createElementVNode("text", { class: "arrow-right" }, "➡️")
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.goToTransferSettings && $options.goToTransferSettings(...args))
        }, [
          vue.createElementVNode("text", { class: "function-text" }, "转账设置"),
          vue.createElementVNode("text", { class: "arrow-right" }, "➡️")
        ])
      ])
    ]);
  }
  const PagesTransferTransfer = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-d303ad3d"], ["__file", "E:/项目/yihangyidon/src/pages/transfer/transfer.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        isVerified: true,
        // 默认已实名认证
        hasBankCard: true,
        // 默认有银行卡
        verifyInfo: {
          name: "",
          idCard: ""
        },
        cardInfo: {
          cardNumber: "",
          bankName: ""
        },
        accountInfo: {
          balance: "12,345.67"
        }
      };
    },
    onLoad() {
      this.checkVerificationStatus();
      this.checkBankCardStatus();
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/account/account.vue:140", "账户页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/account/account.vue:148", "账户页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/account/account.vue:150", "账户页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      // 检查实名认证状态
      checkVerificationStatus() {
        const verified = uni.getStorageSync("userVerified");
        if (verified !== null) {
          this.isVerified = verified;
        }
      },
      // 检查银行卡绑定状态
      checkBankCardStatus() {
        const hasCard = uni.getStorageSync("hasBankCard");
        if (hasCard !== null) {
          this.hasBankCard = hasCard;
        }
      },
      // 提交实名认证
      submitVerify() {
        if (!this.verifyInfo.name || !this.verifyInfo.idCard) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!idCardRegex.test(this.verifyInfo.idCard)) {
          uni.showToast({
            title: "请输入有效的身份证号",
            icon: "none"
          });
          return;
        }
        this.isVerified = true;
        uni.setStorageSync("userVerified", true);
        uni.showToast({
          title: "实名认证成功",
          icon: "success"
        });
      },
      // 提交银行卡绑定
      submitBankCard() {
        if (!this.cardInfo.cardNumber || !this.cardInfo.bankName) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        this.hasBankCard = true;
        uni.setStorageSync("hasBankCard", true);
        uni.showToast({
          title: "银行卡绑定成功",
          icon: "success"
        });
      },
      // 去认证
      goToVerify() {
        uni.showToast({
          title: "前往认证页面",
          icon: "none"
        });
      },
      // 添加银行卡
      addBankCard() {
        uni.showToast({
          title: "前往添加银行卡页面",
          icon: "none"
        });
      },
      // 显示取款弹窗
      showWithdraw() {
        uni.showToast({
          title: "取款功能",
          icon: "none"
        });
      },
      // 显示存款弹窗
      showDeposit() {
        uni.showToast({
          title: "存款功能",
          icon: "none"
        });
      },
      // 跳转到转账页面
      goToTransfer() {
        uni.navigateTo({
          url: "/pages/transfer/transfer"
        });
      },
      // 跳转到付款页面
      goToPayment() {
        uni.showToast({
          title: "付款功能",
          icon: "none"
        });
      },
      // 跳转到收款页面
      goToReceive() {
        uni.showToast({
          title: "收款功能",
          icon: "none"
        });
      },
      // 跳转到信用卡还款页面
      goToCreditCard() {
        uni.showToast({
          title: "信用卡还款功能",
          icon: "none"
        });
      },
      // 跳转到理财通页面
      goToWealth() {
        uni.navigateTo({
          url: "/pages/wealth/wealth"
        });
      },
      // 跳转到手机充值页面
      goToTopup() {
        uni.showToast({
          title: "手机充值功能",
          icon: "none"
        });
      },
      // 跳转到生活缴费页面
      goToBill() {
        uni.showToast({
          title: "生活缴费功能",
          icon: "none"
        });
      },
      // 跳转到慈善乐捐页面
      goToDonation() {
        uni.showToast({
          title: "慈善乐捐功能",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "account-page" }, [
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", { class: "nav-title" }, "我的账户")
      ]),
      vue.createCommentVNode(" 未实名认证页面 "),
      !$data.isVerified ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "verify-section"
      }, [
        vue.createElementVNode("view", { class: "verify-icon" }, "🔍"),
        vue.createElementVNode("text", { class: "verify-title" }, "请完成实名认证"),
        vue.createElementVNode("text", { class: "verify-desc" }, "完成实名认证后可享受更多金融服务"),
        vue.createElementVNode("button", {
          class: "verify-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goToVerify && $options.goToVerify(...args))
        }, "去认证"),
        vue.createElementVNode("view", { class: "verify-form" }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "姓名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "请输入真实姓名",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.verifyInfo.name = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verifyInfo.name]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "身份证号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                placeholder: "请输入18位身份证号",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.verifyInfo.idCard = $event),
                maxlength: "18"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verifyInfo.idCard]
            ])
          ]),
          vue.createElementVNode("button", {
            class: "submit-btn",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.submitVerify && $options.submitVerify(...args))
          }, "提交认证")
        ])
      ])) : $data.isVerified && !$data.hasBankCard ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 未绑定银行卡页面 "),
          vue.createElementVNode("view", { class: "bankcard-section" }, [
            vue.createElementVNode("view", { class: "bankcard-icon" }, "💳"),
            vue.createElementVNode("text", { class: "bankcard-title" }, "请绑定银行卡"),
            vue.createElementVNode("text", { class: "bankcard-desc" }, "绑定银行卡后可进行存取款和转账等操作"),
            vue.createElementVNode("button", {
              class: "bankcard-btn",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.addBankCard && $options.addBankCard(...args))
            }, "添加银行卡"),
            vue.createElementVNode("view", { class: "card-form" }, [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "银行卡号"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    placeholder: "请输入银行卡号",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.cardInfo.cardNumber = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.cardInfo.cardNumber]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "开户行"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    placeholder: "请输入开户银行",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.cardInfo.bankName = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.cardInfo.bankName]
                ])
              ]),
              vue.createElementVNode("button", {
                class: "submit-btn",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.submitBankCard && $options.submitBankCard(...args))
              }, "提交绑定")
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        [
          vue.createCommentVNode(" 账户主页面 "),
          vue.createElementVNode("view", { class: "account-main" }, [
            vue.createCommentVNode(" 账户余额 "),
            vue.createElementVNode("view", { class: "balance-section" }, [
              vue.createElementVNode("text", { class: "balance-title" }, "账户余额"),
              vue.createElementVNode(
                "text",
                { class: "balance-amount" },
                "¥" + vue.toDisplayString($data.accountInfo.balance),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "balance-actions" }, [
                vue.createElementVNode("button", {
                  class: "action-btn",
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.showWithdraw && $options.showWithdraw(...args))
                }, "取款"),
                vue.createElementVNode("button", {
                  class: "action-btn",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.showDeposit && $options.showDeposit(...args))
                }, "存款")
              ])
            ]),
            vue.createCommentVNode(" 功能菜单 "),
            vue.createElementVNode("view", { class: "account-functions" }, [
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.goToTransfer && $options.goToTransfer(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "↔️"),
                  vue.createElementVNode("text", { class: "function-text" }, "转账")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.goToPayment && $options.goToPayment(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💸"),
                  vue.createElementVNode("text", { class: "function-text" }, "付款")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.goToReceive && $options.goToReceive(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📲"),
                  vue.createElementVNode("text", { class: "function-text" }, "收款")
                ])
              ]),
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[13] || (_cache[13] = (...args) => $options.goToCreditCard && $options.goToCreditCard(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💳"),
                  vue.createElementVNode("text", { class: "function-text" }, "信用卡还款")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.goToWealth && $options.goToWealth(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💰"),
                  vue.createElementVNode("text", { class: "function-text" }, "理财通")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[15] || (_cache[15] = (...args) => $options.goToTopup && $options.goToTopup(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📱"),
                  vue.createElementVNode("text", { class: "function-text" }, "手机充值")
                ])
              ]),
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[16] || (_cache[16] = (...args) => $options.goToBill && $options.goToBill(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📊"),
                  vue.createElementVNode("text", { class: "function-text" }, "生活缴费")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[17] || (_cache[17] = (...args) => $options.goToDonation && $options.goToDonation(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "❤️"),
                  vue.createElementVNode("text", { class: "function-text" }, "慈善乐捐")
                ])
              ])
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      ))
    ]);
  }
  const PagesAccountAccount = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-f7e9057f"], ["__file", "E:/项目/yihangyidon/src/pages/account/account.vue"]]);
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
  const mobileRecharge = (rechargeInfo) => {
    return http.post("/life/recharge", rechargeInfo);
  };
  const getPaymentHistory = (params) => {
    return http.get("/life/payment-history", params);
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
        formErrors: {
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
            showAddress: true,
            description: "支持国家电网、南方电网等",
            placeholder: "请输入10-12位电费户号",
            pattern: /^\d{10,12}$/,
            errorMsg: "电费户号格式不正确",
            avgAmount: "150-300",
            tips: [
              "查看电费单上的户号",
              "户号通常为10-12位数字",
              "支持预付费和后付费"
            ]
          },
          {
            icon: "💧",
            label: "水费",
            bgColor: "#1E90FF",
            type: "water",
            numberLabel: "水费户号",
            showAddress: true,
            description: "支持自来水公司缴费",
            placeholder: "请输入8-10位水费户号",
            pattern: /^\d{8,10}$/,
            errorMsg: "水费户号格式不正确",
            avgAmount: "50-150",
            tips: [
              "查看水费单上的用户编号",
              "户号通常为8-10位数字",
              "支持阶梯水价计费"
            ]
          },
          {
            icon: "🔥",
            label: "燃气费",
            bgColor: "#FF6347",
            type: "gas",
            numberLabel: "燃气户号",
            showAddress: true,
            description: "支持天然气公司缴费",
            placeholder: "请输入燃气用户号",
            pattern: /^\d{6,12}$/,
            errorMsg: "燃气户号格式不正确",
            avgAmount: "80-200",
            tips: [
              "查看燃气费单上的用户号",
              "户号格式因地区而异",
              "支持IC卡和直供用户"
            ]
          },
          {
            icon: "📱",
            label: "话费",
            bgColor: "#32CD32",
            type: "phone",
            numberLabel: "手机号码",
            showAddress: false,
            description: "支持三大运营商话费充值",
            placeholder: "请输入11位手机号码",
            pattern: /^1[3-9]\d{9}$/,
            errorMsg: "手机号码格式不正确",
            avgAmount: "30-100",
            tips: ["支持移动、联通、电信", "充值后即时到账", "可设置自动充值"]
          },
          {
            icon: "📺",
            label: "有线电视",
            bgColor: "#9370DB",
            type: "tv",
            numberLabel: "用户编号",
            showAddress: true,
            description: "支持有线电视费缴纳",
            placeholder: "请输入有线电视用户编号",
            pattern: /^\d{8,15}$/,
            errorMsg: "用户编号格式不正确",
            avgAmount: "20-50",
            tips: [
              "查看有线电视缴费单",
              "用户编号在机顶盒上",
              "支持数字电视和高清频道"
            ]
          },
          {
            icon: "🌐",
            label: "宽带费",
            bgColor: "#FF1493",
            type: "internet",
            numberLabel: "宽带账号",
            showAddress: true,
            description: "支持宽带费用缴纳",
            placeholder: "请输入宽带账号",
            pattern: /^[a-zA-Z0-9]{6,20}$/,
            errorMsg: "宽带账号格式不正确",
            avgAmount: "50-200",
            tips: [
              "查看宽带缴费单上的账号",
              "账号可能包含字母和数字",
              "支持包年包月套餐"
            ]
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
        this.formErrors = {
          number: "",
          address: "",
          amount: ""
        };
      },
      // 验证号码格式
      validateNumber() {
        if (!this.paymentForm.number) {
          this.formErrors.number = `请输入${this.selectedType.numberLabel}`;
          return false;
        }
        if (!this.selectedType.pattern.test(this.paymentForm.number)) {
          this.formErrors.number = this.selectedType.errorMsg;
          return false;
        }
        this.formErrors.number = "";
        return true;
      },
      // 验证金额
      validateAmount() {
        if (!this.paymentForm.amount) {
          this.formErrors.amount = "请输入缴费金额";
          return false;
        }
        const amount = parseFloat(this.paymentForm.amount);
        if (isNaN(amount) || amount <= 0) {
          this.formErrors.amount = "请输入有效的金额";
          return false;
        }
        if (amount > 1e4) {
          this.formErrors.amount = "单次缴费金额不能超过10000元";
          return false;
        }
        this.formErrors.amount = "";
        return true;
      },
      // 验证地址
      validateAddress() {
        if (this.selectedType.showAddress && !this.paymentForm.address) {
          this.formErrors.address = "请输入缴费地址";
          return false;
        }
        this.formErrors.address = "";
        return true;
      },
      // 验证所有表单字段
      validateForm() {
        const isNumberValid = this.validateNumber();
        const isAmountValid = this.validateAmount();
        const isAddressValid = this.validateAddress();
        return isNumberValid && isAmountValid && isAddressValid;
      },
      // 输入事件处理
      onNumberInput(e) {
        this.paymentForm.number = e.detail.value;
        if (this.formErrors.number) {
          this.formErrors.number = "";
        }
      },
      onAddressInput(e) {
        this.paymentForm.address = e.detail.value;
        if (this.formErrors.address) {
          this.formErrors.address = "";
        }
      },
      onAmountInput(e) {
        this.paymentForm.amount = e.detail.value;
        if (this.formErrors.amount) {
          this.formErrors.amount = "";
        }
      },
      // 清除错误提示
      clearNumberError() {
        this.formErrors.number = "";
      },
      clearAddressError() {
        this.formErrors.address = "";
      },
      clearAmountError() {
        this.formErrors.amount = "";
      },
      async queryBill() {
        if (!this.validateNumber()) {
          return;
        }
        if (!this.validateAddress()) {
          return;
        }
        try {
          uni.showLoading({ title: "查询中..." });
          const result = await this.mockQueryBill({
            type: this.selectedType.type,
            number: this.paymentForm.number,
            address: this.paymentForm.address
          });
          if (result.success && result.amount) {
            this.paymentForm.amount = result.amount.toString();
            uni.showModal({
              title: "查询成功",
              content: `查询到待缴费用：${result.amount}元
账期：${result.period}
地址：${result.address || this.paymentForm.address}`,
              confirmText: "确定",
              showCancel: false
            });
          } else {
            uni.showModal({
              title: "查询结果",
              content: result.message || "暂无待缴费用",
              confirmText: "确定",
              showCancel: false
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
        if (!this.validateForm()) {
          uni.showToast({
            title: "请检查输入信息",
            icon: "none"
          });
          return;
        }
        const confirmResult = await new Promise((resolve) => {
          uni.showModal({
            title: "确认缴费",
            content: `${this.selectedType.label}缴费
${this.selectedType.numberLabel}：${this.paymentForm.number}
缴费金额：${this.paymentForm.amount}元`,
            confirmText: "确认缴费",
            cancelText: "取消",
            success: (res) => resolve(res.confirm)
          });
        });
        if (!confirmResult)
          return;
        try {
          uni.showLoading({ title: "缴费中..." });
          const result = await this.mockPayment({
            type: this.selectedType.type,
            number: this.paymentForm.number,
            address: this.paymentForm.address,
            amount: parseFloat(this.paymentForm.amount)
          });
          if (result.success) {
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
            this.formErrors = {
              number: "",
              address: "",
              amount: ""
            };
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          uni.showToast({
            title: error.message || "缴费失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      // 模拟查询账单API
      async mockQueryBill(params) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockData = {
              electric: {
                success: true,
                amount: 156.8,
                period: "2024年1月",
                address: "XX小区XX号楼"
              },
              water: {
                success: true,
                amount: 89.5,
                period: "2024年1月",
                address: "XX小区XX号楼"
              },
              gas: {
                success: true,
                amount: 125.3,
                period: "2024年1月",
                address: "XX小区XX号楼"
              },
              phone: {
                success: true,
                amount: 50,
                period: "当前余额",
                address: null
              },
              tv: {
                success: true,
                amount: 25,
                period: "2024年1月",
                address: "XX小区XX号楼"
              },
              internet: {
                success: true,
                amount: 100,
                period: "2024年1月",
                address: "XX小区XX号楼"
              }
            };
            resolve(
              mockData[params.type] || { success: false, message: "查询失败" }
            );
          }, 1500);
        });
      },
      // 模拟缴费API
      async mockPayment(params) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              orderId: `PAY${Date.now()}`,
              message: "缴费成功"
            });
          }, 2e3);
        });
      },
      async loadPaymentHistory() {
        try {
          const history = await getPaymentHistory({ limit: 3 });
          this.paymentHistory = history;
        } catch (error) {
          formatAppLog("error", "at pages/payment/payment.vue:622", "加载缴费记录失败:", error);
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
        class: "payment-form",
        onClick: _cache[14] || (_cache[14] = vue.withModifiers(() => {
        }, ["stop"]))
      }, [
        vue.createCommentVNode(" 缴费类型信息 "),
        vue.createElementVNode("view", { class: "type-info" }, [
          vue.createElementVNode("view", { class: "info-header" }, [
            vue.createElementVNode(
              "view",
              {
                class: "type-icon-large",
                style: vue.normalizeStyle({ backgroundColor: $data.selectedType.bgColor })
              },
              [
                vue.createElementVNode(
                  "text",
                  { class: "icon-text-large" },
                  vue.toDisplayString($data.selectedType.icon),
                  1
                  /* TEXT */
                )
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", { class: "type-details" }, [
              vue.createElementVNode(
                "text",
                { class: "type-title" },
                vue.toDisplayString($data.selectedType.label) + "缴费",
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "type-desc" },
                vue.toDisplayString($data.selectedType.description),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "avg-amount" },
                "常见金额: " + vue.toDisplayString($data.selectedType.avgAmount) + "元",
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", {
          class: "form-section",
          onClick: _cache[11] || (_cache[11] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
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
              placeholder: $data.selectedType.placeholder,
              type: "text",
              onInput: _cache[1] || (_cache[1] = (...args) => $options.onNumberInput && $options.onNumberInput(...args)),
              onBlur: _cache[2] || (_cache[2] = (...args) => $options.validateNumber && $options.validateNumber(...args)),
              onFocus: _cache[3] || (_cache[3] = (...args) => $options.clearNumberError && $options.clearNumberError(...args)),
              maxlength: 20,
              "confirm-type": "done"
            }, null, 40, ["placeholder"]), [
              [vue.vModelText, $data.paymentForm.number]
            ]),
            $data.formErrors.number ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "input-error"
            }, [
              vue.createElementVNode(
                "text",
                { class: "error-text" },
                vue.toDisplayString($data.formErrors.number),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
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
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.paymentForm.address = $event),
                placeholder: "请输入详细地址（如：XX小区XX号楼XX室）",
                type: "text",
                onInput: _cache[5] || (_cache[5] = (...args) => $options.onAddressInput && $options.onAddressInput(...args)),
                onFocus: _cache[6] || (_cache[6] = (...args) => $options.clearAddressError && $options.clearAddressError(...args)),
                maxlength: 100,
                "confirm-type": "done"
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.paymentForm.address]
            ]),
            $data.formErrors.address ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "input-error"
            }, [
              vue.createElementVNode(
                "text",
                { class: "error-text" },
                vue.toDisplayString($data.formErrors.address),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "缴费金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input amount-input",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.paymentForm.amount = $event),
                placeholder: "请输入缴费金额或点击查询账单",
                type: "digit",
                onInput: _cache[8] || (_cache[8] = (...args) => $options.onAmountInput && $options.onAmountInput(...args)),
                onBlur: _cache[9] || (_cache[9] = (...args) => $options.validateAmount && $options.validateAmount(...args)),
                onFocus: _cache[10] || (_cache[10] = (...args) => $options.clearAmountError && $options.clearAmountError(...args)),
                maxlength: 8,
                "confirm-type": "done"
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.paymentForm.amount]
            ]),
            $data.formErrors.amount ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "input-error"
            }, [
              vue.createElementVNode(
                "text",
                { class: "error-text" },
                vue.toDisplayString($data.formErrors.amount),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 温馨提示 "),
          vue.createElementVNode("view", { class: "tips-section" }, [
            vue.createElementVNode("text", { class: "tips-title" }, "💡 温馨提示"),
            vue.createElementVNode("view", { class: "tips-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.selectedType.tips, (tip, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      class: "tip-item",
                      key: index
                    },
                    " • " + vue.toDisplayString(tip),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createCommentVNode(" 缴费按钮 "),
        vue.createElementVNode("view", { class: "payment-actions" }, [
          vue.createElementVNode("button", {
            class: "query-btn",
            onClick: _cache[12] || (_cache[12] = (...args) => $options.queryBill && $options.queryBill(...args)),
            disabled: !$data.paymentForm.number
          }, " 查询账单 ", 8, ["disabled"]),
          vue.createElementVNode("button", {
            class: "pay-btn",
            onClick: _cache[13] || (_cache[13] = (...args) => $options.submitPayment && $options.submitPayment(...args)),
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
            onClick: _cache[15] || (_cache[15] = (...args) => $options.viewAllHistory && $options.viewAllHistory(...args))
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
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/user/user", PagesUserUser);
  __definePage("pages/wealth/wealth", PagesWealthWealth);
  __definePage("pages/life/life", PagesLifeLife);
  __definePage("pages/service/chat", PagesServiceChat);
  __definePage("pages/transfer/transfer", PagesTransferTransfer);
  __definePage("pages/account/account", PagesAccountAccount);
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
      formatAppLog("log", "at App.vue:13", "App Launch", options);
      themeManager.init();
      this.checkUpdate();
      this.initUserInfo();
      this.setSystemInfo();
      this.initNetworkListener();
      this.initLoginInterceptor();
    },
    onShow(options) {
      formatAppLog("log", "at App.vue:35", "App Show", options);
      this.checkLoginStatus();
      this.restoreAppState();
      this.globalLoginCheck();
    },
    onHide() {
      formatAppLog("log", "at App.vue:48", "App Hide");
      this.saveAppState();
    },
    onError(error) {
      formatAppLog("error", "at App.vue:55", "App Error:", error);
      this.reportError(error);
    },
    onPageNotFound(options) {
      formatAppLog("log", "at App.vue:62", "Page Not Found:", options);
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
          formatAppLog("log", "at App.vue:77", "当前应用版本:", widgetInfo.version);
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
            formatAppLog("log", "at App.vue:91", "用户信息已恢复:", userInfo);
          }
        } catch (error) {
          formatAppLog("error", "at App.vue:94", "恢复用户信息失败:", error);
        }
      },
      /**
       * 设置系统信息
       */
      setSystemInfo() {
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.globalData.systemInfo = systemInfo;
          formatAppLog("log", "at App.vue:105", "系统信息:", systemInfo);
        } catch (error) {
          formatAppLog("error", "at App.vue:107", "获取系统信息失败:", error);
        }
      },
      /**
       * 初始化网络状态监听
       */
      initNetworkListener() {
        uni.onNetworkStatusChange((res) => {
          formatAppLog("log", "at App.vue:116", "网络状态变化:", res);
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
            formatAppLog("log", "at App.vue:139", "应用启动时检测到未登录，强制跳转到登录页面");
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
            formatAppLog("log", "at App.vue:154", "拦截 navigateTo:", e.url);
            if (e.url.includes("/pages/denglu/login") || e.url.includes("/pages/register/register")) {
              formatAppLog("log", "at App.vue:158", "跳转到登录页面或注册页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:164", "用户未登录，阻止页面跳转");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("switchTab", {
          invoke(e) {
            formatAppLog("log", "at App.vue:175", "拦截 switchTab:", e.url);
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:179", "用户未登录，阻止tabBar跳转");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("reLaunch", {
          invoke(e) {
            formatAppLog("log", "at App.vue:190", "拦截 reLaunch:", e.url);
            if (e.url.includes("/pages/denglu/login") || e.url.includes("/pages/register/register")) {
              formatAppLog("log", "at App.vue:194", "重定向到登录页面或注册页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:200", "用户未登录，阻止重定向");
              return false;
            }
            return true;
          }
        });
        uni.addInterceptor("redirectTo", {
          invoke(e) {
            formatAppLog("log", "at App.vue:211", "拦截 redirectTo:", e.url);
            if (e.url.includes("/pages/denglu/login") || e.url.includes("/pages/register/register")) {
              formatAppLog("log", "at App.vue:215", "重定向到登录页面或注册页面，允许");
              return true;
            }
            if (!forceCheckLogin()) {
              formatAppLog("log", "at App.vue:221", "用户未登录，阻止重定向");
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
          formatAppLog("error", "at App.vue:251", "保存应用状态失败:", error);
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
          formatAppLog("error", "at App.vue:269", "恢复应用状态失败:", error);
        }
      },
      /**
       * 错误上报
       */
      reportError(error) {
        formatAppLog("error", "at App.vue:278", "错误上报:", error);
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
  var define_process_env_default = {};
  function getEnvironment() {
    if (typeof uni !== "undefined" && uni.getSystemInfoSync) {
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.platform === "devtools") {
        return "development";
      }
    }
    if (typeof process !== "undefined" && define_process_env_default && "development") {
      return "development";
    }
    return "development";
  }
  function createApp() {
    const app = vue.createVueApp(App);
    const currentEnv = getEnvironment();
    app.config.errorHandler = (err, vm, info) => {
      formatAppLog("error", "at main.js:36", "Vue Error:", err);
      formatAppLog("error", "at main.js:37", "Error Info:", info);
      reportError(err, info);
      uni.showToast({
        title: "应用出现错误，请重试",
        icon: "none",
        duration: 3e3
      });
    };
    app.config.warnHandler = (msg, vm, trace) => {
      formatAppLog("warn", "at main.js:52", "Vue Warning:", msg);
      formatAppLog("warn", "at main.js:53", "Warning Trace:", trace);
    };
    app.config.globalProperties.$app = {
      // 应用版本
      version: "1.0.0",
      // 环境信息
      env: currentEnv,
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
        baseURL: currentEnv === "development" ? "http://localhost:3000/api" : "https://api.hospital.com",
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
          formatAppLog("log", "at main.js:176", "Request:", config);
          return config;
        },
        // 响应拦截器
        afterResponse(response) {
          formatAppLog("log", "at main.js:182", "Response:", response);
          if (response.statusCode === 401) {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
            uni.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/denglu/login"
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
            formatAppLog("error", "at main.js:218", "Request Error:", error);
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
            formatAppLog("error", "at main.js:284", "Storage Set Error:", error);
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
            formatAppLog("error", "at main.js:304", "Storage Get Error:", error);
            return defaultValue;
          }
        },
        // 删除存储
        remove(key) {
          try {
            uni.removeStorageSync(key);
          } catch (error) {
            formatAppLog("error", "at main.js:314", "Storage Remove Error:", error);
          }
        },
        // 清空存储
        clear() {
          try {
            uni.clearStorageSync();
          } catch (error) {
            formatAppLog("error", "at main.js:323", "Storage Clear Error:", error);
          }
        }
      }
    };
    app.mixin({
      // 页面生命周期
      onLoad(options) {
        formatAppLog("log", "at main.js:333", "Page Load:", this.$options.name, options);
        this.pageStartTime = Date.now();
      },
      onShow() {
        formatAppLog("log", "at main.js:340", "Page Show:", this.$options.name);
      },
      onHide() {
        formatAppLog("log", "at main.js:344", "Page Hide:", this.$options.name);
        if (this.pageStartTime) {
          const duration = Date.now() - this.pageStartTime;
          formatAppLog("log", "at main.js:349", "Page Duration:", this.$options.name, duration + "ms");
        }
      },
      onUnload() {
        formatAppLog("log", "at main.js:354", "Page Unload:", this.$options.name);
      },
      // 错误处理
      onError(error) {
        formatAppLog("error", "at main.js:359", "Page Error:", this.$options.name, error);
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
    formatAppLog("error", "at main.js:385", "Error Report:", errorData);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      formatAppLog("error", "at main.js:398", "Global Error:", event.error);
      reportError(event.error, "Global Error");
    });
    window.addEventListener("unhandledrejection", (event) => {
      formatAppLog("error", "at main.js:403", "Unhandled Promise Rejection:", event.reason);
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

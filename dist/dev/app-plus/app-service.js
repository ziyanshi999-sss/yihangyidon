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
      transactionPassword: "123456",
      balance: 5e4,
      nickname: "手机用户",
      email: "phone@example.com",
      idCard: "110101199001011234",
      avatar: "/static/avatars/phone_user_avatar.jpg",
      status: "active",
      createTime: "2024-01-01T08:00:00.000Z",
      lastLoginTime: "2024-01-15T10:30:00.000Z",
      realName: "张三",
      gender: "男",
      birthDate: "1990-01-01",
      address: "北京市朝阳区建国门外大街1号",
      avatarUpdateTime: "2024-01-15T10:30:00.000Z",
      lastUpdateTime: "2024-01-15T10:30:00.000Z",
      securitySettings: {
        biometricEnabled: true,
        smsVerificationEnabled: true,
        accountLockEnabled: true,
        twoFactorEnabled: false,
        securityNotificationsEnabled: true,
        transactionLimit: 5e4,
        passwordUpdateTime: "2024-01-01T00:00:00.000Z",
        transactionPasswordUpdateTime: "2024-01-01T00:00:00.000Z",
        securityQuestionsSet: false,
        emergencyContactSet: false,
        loginDevices: [
          {
            id: 1,
            name: "iPhone 14",
            lastLogin: "2024-01-15T14:30:00.000Z",
            location: "北京市",
            status: "active",
            ip: "192.168.1.100",
            deviceType: "mobile"
          }
        ],
        securityEvents: [
          {
            id: 1,
            type: "login",
            description: "账户登录",
            timestamp: "2024-01-15T14:30:00.000Z",
            location: "北京市",
            ip: "192.168.1.100",
            status: "success"
          }
        ],
        securityQuestions: [],
        emergencyContact: null,
        twoFactorSecret: null
      },
      creditCards: [
        {
          cardNumber: "6222 8888 8888 8888",
          cardType: "金卡",
          cardBrand: "银联",
          creditLimit: 5e4,
          availableCredit: 45e3,
          currentBalance: 5e3,
          minPayment: 500,
          statementDate: "15",
          dueDate: "2024-02-05",
          lastStatementDate: "2024-01-15",
          cardStatus: "active",
          cardHolder: "手机用户",
          expiryDate: "2028-12-31",
          cvv: "123",
          annualFee: 200,
          interestRate: 5e-4,
          cashAdvanceLimit: 25e3,
          rewardsPoints: 1250,
          cardColor: "#FFD700"
        }
      ]
    },
    {
      id: "u002",
      username: "张小明",
      phone: "13999999999",
      password: "abc123",
      transactionPassword: "654321",
      balance: 12e4,
      nickname: "小明",
      email: "zhangxiaoming@example.com",
      idCard: "110101199202021456",
      avatar: "/static/avatars/zhangxiaoming_avatar.jpg",
      status: "active",
      createTime: "2024-01-02T09:15:00.000Z",
      lastLoginTime: "2024-01-15T14:20:00.000Z",
      realName: "张小明",
      gender: "男",
      birthDate: "1992-02-02",
      address: "上海市浦东新区陆家嘴环路1000号",
      avatarUpdateTime: "2024-01-15T14:20:00.000Z",
      lastUpdateTime: "2024-01-15T14:20:00.000Z",
      securitySettings: {
        biometricEnabled: true,
        smsVerificationEnabled: true,
        accountLockEnabled: true,
        twoFactorEnabled: true,
        securityNotificationsEnabled: true,
        transactionLimit: 1e5,
        passwordUpdateTime: "2024-01-10T00:00:00.000Z",
        transactionPasswordUpdateTime: "2024-01-10T00:00:00.000Z",
        securityQuestionsSet: true,
        emergencyContactSet: true,
        loginDevices: [
          {
            id: 1,
            name: "iPhone 15 Pro",
            lastLogin: "2024-01-15T14:20:00.000Z",
            location: "上海市",
            status: "active",
            ip: "192.168.1.200",
            deviceType: "mobile"
          },
          {
            id: 2,
            name: "MacBook Pro",
            lastLogin: "2024-01-14T09:15:00.000Z",
            location: "上海市",
            status: "active",
            ip: "192.168.1.201",
            deviceType: "desktop"
          }
        ],
        securityEvents: [
          {
            id: 1,
            type: "login",
            description: "账户登录",
            timestamp: "2024-01-15T14:20:00.000Z",
            location: "上海市",
            ip: "192.168.1.200",
            status: "success"
          },
          {
            id: 2,
            type: "password_change",
            description: "修改登录密码",
            timestamp: "2024-01-10T10:30:00.000Z",
            location: "上海市",
            ip: "192.168.1.201",
            status: "success"
          }
        ],
        securityQuestions: [
          {
            question: "您的小学名称是什么？",
            answer: "实验小学"
          },
          {
            question: "您的第一个宠物的名字是什么？",
            answer: "小白"
          },
          {
            question: "您最喜欢的颜色是什么？",
            answer: "蓝色"
          }
        ],
        emergencyContact: {
          name: "张大明",
          phone: "13800138000",
          relationship: "父亲"
        },
        twoFactorSecret: "JBSWY3DPEHPK3PXP"
      },
      creditCards: [
        {
          cardNumber: "6222 9999 9999 9999",
          cardType: "白金卡",
          cardBrand: "银联",
          creditLimit: 1e5,
          availableCredit: 85e3,
          currentBalance: 15e3,
          minPayment: 1500,
          statementDate: "20",
          dueDate: "2024-02-10",
          lastStatementDate: "2024-01-20",
          cardStatus: "active",
          cardHolder: "张小明",
          expiryDate: "2029-09-30",
          cvv: "456",
          annualFee: 500,
          interestRate: 4e-4,
          cashAdvanceLimit: 5e4,
          rewardsPoints: 3200,
          cardColor: "#C0C0C0"
        },
        {
          cardNumber: "6222 7777 7777 7777",
          cardType: "普卡",
          cardBrand: "银联",
          creditLimit: 3e4,
          availableCredit: 28e3,
          currentBalance: 2e3,
          minPayment: 200,
          statementDate: "25",
          dueDate: "2024-02-15",
          lastStatementDate: "2024-01-25",
          cardStatus: "active",
          cardHolder: "张小明",
          expiryDate: "2027-06-30",
          cvv: "789",
          annualFee: 100,
          interestRate: 6e-4,
          cashAdvanceLimit: 15e3,
          rewardsPoints: 800,
          cardColor: "#87CEEB"
        }
      ]
    },
    {
      id: "u003",
      username: "李小红",
      phone: "13777777777",
      password: "password123",
      transactionPassword: "789012",
      balance: 8e4,
      nickname: "小红",
      email: "lixiaohong@example.com",
      idCard: "110101199303031789",
      avatar: "/static/avatars/lixiaohong_avatar.jpg",
      status: "active",
      createTime: "2024-01-03T16:45:00.000Z",
      lastLoginTime: "2024-01-14T11:10:00.000Z",
      realName: "李小红",
      gender: "女",
      birthDate: "1993-03-03",
      address: "广州市天河区珠江新城花城大道85号",
      avatarUpdateTime: "2024-01-14T11:10:00.000Z",
      lastUpdateTime: "2024-01-14T11:10:00.000Z",
      securitySettings: {
        biometricEnabled: false,
        smsVerificationEnabled: true,
        accountLockEnabled: false,
        twoFactorEnabled: false,
        securityNotificationsEnabled: false,
        transactionLimit: 2e5,
        passwordUpdateTime: "2023-12-01T00:00:00.000Z",
        transactionPasswordUpdateTime: "2023-12-01T00:00:00.000Z",
        securityQuestionsSet: false,
        emergencyContactSet: false,
        loginDevices: [
          {
            id: 1,
            name: "Samsung Galaxy S24",
            lastLogin: "2024-01-14T11:10:00.000Z",
            location: "广州市",
            status: "active",
            ip: "192.168.1.300",
            deviceType: "mobile"
          },
          {
            id: 2,
            name: "iPad Pro",
            lastLogin: "2024-01-13T16:45:00.000Z",
            location: "广州市",
            status: "active",
            ip: "192.168.1.301",
            deviceType: "tablet"
          },
          {
            id: 3,
            name: "Dell Laptop",
            lastLogin: "2024-01-12T08:30:00.000Z",
            location: "广州市",
            status: "active",
            ip: "192.168.1.302",
            deviceType: "desktop"
          }
        ],
        securityEvents: [
          {
            id: 1,
            type: "login",
            description: "账户登录",
            timestamp: "2024-01-14T11:10:00.000Z",
            location: "广州市",
            ip: "192.168.1.300",
            status: "success"
          },
          {
            id: 2,
            type: "failed_login",
            description: "登录失败",
            timestamp: "2024-01-13T20:15:00.000Z",
            location: "广州市",
            ip: "192.168.1.303",
            status: "failed"
          }
        ],
        securityQuestions: [],
        emergencyContact: null,
        twoFactorSecret: null
      },
      creditCards: [
        {
          cardNumber: "6222 6666 6666 6666",
          cardType: "钻石卡",
          cardBrand: "银联",
          creditLimit: 2e5,
          availableCredit: 18e4,
          currentBalance: 2e4,
          minPayment: 2e3,
          statementDate: "10",
          dueDate: "2024-02-01",
          lastStatementDate: "2024-01-10",
          cardStatus: "active",
          cardHolder: "李小红",
          expiryDate: "2030-03-31",
          cvv: "321",
          annualFee: 1e3,
          interestRate: 3e-4,
          cashAdvanceLimit: 1e5,
          rewardsPoints: 6800,
          cardColor: "#FF69B4"
        },
        {
          cardNumber: "6222 5555 5555 5555",
          cardType: "金卡",
          cardBrand: "银联",
          creditLimit: 8e4,
          availableCredit: 72e3,
          currentBalance: 8e3,
          minPayment: 800,
          statementDate: "18",
          dueDate: "2024-02-08",
          lastStatementDate: "2024-01-18",
          cardStatus: "active",
          cardHolder: "李小红",
          expiryDate: "2028-11-30",
          cvv: "654",
          annualFee: 300,
          interestRate: 5e-4,
          cashAdvanceLimit: 4e4,
          rewardsPoints: 2100,
          cardColor: "#32CD32"
        }
      ]
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
  function findUserByUsername(username) {
    return users.find(
      (user) => user.username === username || user.phone === username
    );
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
  function getAllUsers() {
    return users;
  }
  function findUserById(id) {
    return users.find((user) => user.id === id);
  }
  const users$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    checkUserExists,
    findUserById,
    findUserByUsername,
    generateVerificationCode,
    getAllUsers,
    registerUser,
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$p = {
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
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
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
                placeholder: "请输入密码",
                maxlength: "20",
                required: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.password]
            ])
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
  const PagesDengluLogin = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-6f56e16f"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/denglu/login.vue"]]);
  const _sfc_main$o = {
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
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-97bb96ad"], ["__file", "D:/Vue项目/专高六/1/项目/src/pages/register/register.vue"]]);
  const _sfc_main$n = {
    data() {
      return {
        isLoggedIn: false,
        showMoreFunctions: false
        // 控制更多功能按钮的显示/隐藏
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
    // 在methods对象中添加缺失的scrollToHotActivities方法
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/index/index.vue:175", "首页：用户未登录，跳转到登录页面");
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
      },
      // 处理信用卡点击
      handleCreditCardClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/credit-card/credit-card"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      },
      // 处理收支点击
      handleBalanceClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/balance/balance"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      },
      // 处理贷款点击
      handleLoanClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/loan/loan"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      },
      // 处理手机充值点击
      handleRechargeClick() {
        if (this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/recharge/recharge"
          });
        } else {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
        }
      },
      // 处理扫一扫点击 - 完善后的实现
      handleScanClick() {
        if (!this.isLoggedIn) {
          uni.navigateTo({
            url: "/pages/denglu/login"
          });
          return;
        }
        uni.scanCode({
          // 允许的扫码类型：barCode（一维码）和qrCode（二维码）
          scanType: ["barCode", "qrCode"],
          // 是否显示闪光灯按钮
          showFlash: true,
          // 成功扫码的回调
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:292", "扫码结果：", res);
            const result = res.result;
            if (result.startsWith("http")) {
              uni.showModal({
                title: "打开链接",
                content: `确定要打开链接: ${result} 吗？`,
                success: (confirmRes) => {
                  if (confirmRes.confirm) {
                    uni.openURL({
                      url: result
                    });
                  }
                }
              });
            } else if (result.includes("payment")) {
              uni.showModal({
                title: "支付确认",
                content: "检测到支付码，是否继续？",
                success: (confirmRes) => {
                  if (confirmRes.confirm) {
                    uni.showToast({
                      title: "正在处理支付",
                      icon: "loading"
                    });
                  }
                }
              });
            } else {
              uni.showModal({
                title: "扫码结果",
                content: result,
                showCancel: false
              });
            }
          },
          // 扫码失败的回调
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:340", "扫码失败：", err);
            if (err.errMsg !== "scanCode:fail cancel") {
              uni.showToast({
                title: "扫码失败，请重试",
                icon: "none"
              });
            }
          }
        });
      },
      // 切换更多功能的显示/隐藏
      toggleMoreFunctions() {
        this.showMoreFunctions = !this.showMoreFunctions;
      },
      // 新增：滚动到热门活动区域
      scrollToHotActivities() {
        uni.createSelectorQuery().select("#hot-activities-section").boundingClientRect((rect) => {
          const top = rect.top;
          uni.pageScrollTo({
            scrollTop: top,
            duration: 300
            // 滚动动画持续时间（毫秒）
          });
        }).exec();
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
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
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleBalanceClick && $options.handleBalanceClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-balance" }, "📊"),
            vue.createElementVNode("text", { class: "function-text" }, "收支")
          ]),
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "function-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleScanClick && $options.handleScanClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-scan" }, "🔍"),
            vue.createElementVNode("text", { class: "function-text" }, "扫一扫")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "function-grid" }, [
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "function-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.handleCreditCardClick && $options.handleCreditCardClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-card" }, "💳"),
            vue.createElementVNode("text", { class: "function-text" }, "信用卡")
          ])) : vue.createCommentVNode("v-if", true),
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "function-item"
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-deposit" }, "💰"),
            vue.createElementVNode("text", { class: "function-text" }, "存款")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.scrollToHotActivities && $options.scrollToHotActivities(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-activity" }, "🎉"),
            vue.createElementVNode("text", { class: "function-text" }, "热门活动")
          ]),
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "function-item"
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-branch" }, "🏦"),
            vue.createElementVNode("text", { class: "function-text" }, "网点查询")
          ])) : vue.createCommentVNode("v-if", true),
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "function-item"
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-electronic" }, "📱"),
            vue.createElementVNode("text", { class: "function-text" }, "开通电子")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "function-grid" }, [
          $data.showMoreFunctions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "function-item",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.handleLoanClick && $options.handleLoanClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-loan" }, "💸"),
            vue.createElementVNode("text", { class: "function-text" }, "贷款")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.handleRechargeClick && $options.handleRechargeClick(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-topup" }, "📱"),
            vue.createElementVNode("text", { class: "function-text" }, "手机充值")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.toggleMoreFunctions && $options.toggleMoreFunctions(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon icon-more" }, "•••"),
            vue.createElementVNode(
              "text",
              { class: "function-text" },
              vue.toDisplayString($data.showMoreFunctions ? "收起" : "全部"),
              1
              /* TEXT */
            )
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
      vue.createCommentVNode(" 热门活动 (添加id) "),
      vue.createElementVNode("view", {
        id: "hot-activities-section",
        class: "hot-activities"
      }, [
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
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-83a5a03c"], ["__file", "D:/Vue项目/专高六/1/项目/src/pages/index/index.vue"]]);
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
  const THEME_KEY = "app_theme";
  const themes$1 = {
    light: {
      id: "light",
      name: "浅色主题",
      colors: {
        primary: "#4caf50",
        primaryDark: "#2e7d32",
        background: "#f5f5f5",
        surface: "#ffffff",
        surfaceVariant: "#f8f9fa",
        text: "#333333",
        textSecondary: "#666666",
        border: "#e0e0e0",
        borderLight: "#f0f0f0",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
      },
      gradients: {
        primary: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
      }
    },
    dark: {
      id: "dark",
      name: "深色主题",
      colors: {
        primary: "#66bb6a",
        primaryDark: "#4caf50",
        background: "#121212",
        surface: "#1e1e1e",
        surfaceVariant: "#2d2d2d",
        text: "#ffffff",
        textSecondary: "#b3b3b3",
        border: "#333333",
        borderLight: "#2d2d2d",
        success: "#66bb6a",
        warning: "#ffb74d",
        error: "#f44336",
        info: "#42a5f5"
      },
      gradients: {
        primary: "linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)"
      }
    },
    blue: {
      id: "blue",
      name: "蓝色主题",
      colors: {
        primary: "#2196f3",
        primaryDark: "#1976d2",
        background: "#f3f7ff",
        surface: "#ffffff",
        surfaceVariant: "#f8faff",
        text: "#333333",
        textSecondary: "#666666",
        border: "#e3f2fd",
        borderLight: "#f0f7ff",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
      },
      gradients: {
        primary: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
      }
    },
    purple: {
      id: "purple",
      name: "紫色主题",
      colors: {
        primary: "#9c27b0",
        primaryDark: "#7b1fa2",
        background: "#faf5ff",
        surface: "#ffffff",
        surfaceVariant: "#f8f4ff",
        text: "#333333",
        textSecondary: "#666666",
        border: "#e1bee7",
        borderLight: "#f3e5f5",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
      },
      gradients: {
        primary: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)"
      }
    }
  };
  class SimpleThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme();
      this.listeners = [];
    }
    // 获取存储的主题
    getStoredTheme() {
      try {
        return uni.getStorageSync(THEME_KEY) || "light";
      } catch (error) {
        formatAppLog("error", "at utils/simple-theme.js:108", "获取主题失败:", error);
        return "light";
      }
    }
    // 存储主题
    setStoredTheme(themeId) {
      try {
        uni.setStorageSync(THEME_KEY, themeId);
      } catch (error) {
        formatAppLog("error", "at utils/simple-theme.js:118", "存储主题失败:", error);
      }
    }
    // 获取当前主题
    getCurrentTheme() {
      return themes$1[this.currentTheme] || themes$1.light;
    }
    // 获取当前主题ID
    getCurrentThemeId() {
      return this.currentTheme;
    }
    // 切换主题
    switchTheme(themeId) {
      if (themes$1[themeId]) {
        this.currentTheme = themeId;
        this.setStoredTheme(themeId);
        this.notifyListeners(themes$1[themeId]);
        formatAppLog("log", "at utils/simple-theme.js:138", "主题已切换为:", themes$1[themeId].name);
      } else {
        formatAppLog("error", "at utils/simple-theme.js:140", "主题不存在:", themeId);
      }
    }
    // 获取所有主题
    getAllThemes() {
      return Object.values(themes$1);
    }
    // 添加监听器
    addThemeListener(callback) {
      this.listeners.push(callback);
    }
    // 移除监听器
    removeThemeListener(callback) {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
    // 通知监听器
    notifyListeners(theme) {
      this.listeners.forEach((callback) => {
        try {
          callback(theme);
        } catch (error) {
          formatAppLog("error", "at utils/simple-theme.js:168", "主题监听器执行失败:", error);
        }
      });
    }
  }
  const themeManager$1 = new SimpleThemeManager();
  function getThemeStyles() {
    const theme = themeManager$1.getCurrentTheme();
    return {
      // 背景色
      background: {
        backgroundColor: theme.colors.background
      },
      surface: {
        backgroundColor: theme.colors.surface
      },
      surfaceVariant: {
        backgroundColor: theme.colors.surfaceVariant
      },
      // 文字颜色
      text: {
        color: theme.colors.text
      },
      textSecondary: {
        color: theme.colors.textSecondary
      },
      // 边框
      border: {
        borderColor: theme.colors.border
      },
      borderLight: {
        borderColor: theme.colors.borderLight
      },
      // 主色调
      primary: {
        color: theme.colors.primary
      },
      primaryBg: {
        backgroundColor: theme.colors.primary
      },
      primaryGradient: {
        background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`
      },
      // 状态颜色
      success: {
        color: theme.colors.success
      },
      successBg: {
        backgroundColor: theme.colors.success
      },
      warning: {
        color: theme.colors.warning
      },
      warningBg: {
        backgroundColor: theme.colors.warning
      },
      error: {
        color: theme.colors.error
      },
      errorBg: {
        backgroundColor: theme.colors.error
      },
      info: {
        color: theme.colors.info
      },
      infoBg: {
        backgroundColor: theme.colors.info
      }
    };
  }
  const _sfc_main$m = {
    data() {
      return {
        userInfo: null,
        currentTheme: themeManager$1.getCurrentTheme(),
        // 获取当前主题
        themeStyles: getThemeStyles()
        // 获取主题样式
      };
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/user/user.vue:173", "个人中心：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login",
            fail: (error) => {
              formatAppLog("error", "at pages/user/user.vue:177", "个人中心跳转失败:", error);
              uni.navigateTo({ url: "/pages/denglu/login" });
            }
          });
          return;
        }
        this.checkLoginStatus();
        this.loadTheme();
      } catch (error) {
        formatAppLog("error", "at pages/user/user.vue:187", "个人中心onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login",
          fail: () => {
            uni.navigateTo({ url: "/pages/denglu/login" });
          }
        });
      }
    },
    mounted() {
      themeManager$1.addThemeListener(this.onThemeChanged);
    },
    beforeDestroy() {
      themeManager$1.removeThemeListener(this.onThemeChanged);
    },
    methods: {
      // 主题变化回调
      onThemeChanged(theme) {
        formatAppLog("log", "at pages/user/user.vue:210", "主题变化回调:", theme);
        this.currentTheme = theme;
        this.themeStyles = getThemeStyles();
        this.$forceUpdate();
      },
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
        uni.navigateTo({
          url: "/pages/credit-cards/credit-cards"
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
        uni.navigateTo({
          url: "/pages/credit-cards/credit-cards"
        });
      },
      goToTransactions() {
        uni.showToast({
          title: "交易记录",
          icon: "none"
        });
      },
      goToSecurity() {
        uni.navigateTo({
          url: "/pages/user/security"
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
          formatAppLog("error", "at pages/user/user.vue:315", "查看退出记录失败:", error);
          uni.showToast({
            title: "查看记录失败",
            icon: "none"
          });
        }
      },
      // 显示信用卡信息
      showCreditCards() {
        if (!this.userInfo) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        try {
          let users2 = uni.getStorageSync("users") || [];
          if (users2.length === 0) {
            __vitePreload(() => Promise.resolve().then(() => users$1), false ? "__VITE_PRELOAD__" : void 0).then((module) => {
              const { users: importedUsers } = module;
              this.displayCreditCards(importedUsers);
            }).catch((error) => {
              formatAppLog("error", "at pages/user/user.vue:345", "导入用户数据失败:", error);
              uni.showToast({
                title: "获取数据失败",
                icon: "none"
              });
            });
            return;
          }
          this.displayCreditCards(users2);
        } catch (error) {
          formatAppLog("error", "at pages/user/user.vue:356", "获取信用卡信息失败:", error);
          uni.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      },
      // 显示信用卡信息的具体实现
      displayCreditCards(users2) {
        const currentUser = users2.find(
          (user) => user.id === this.userInfo.id || user.phone === this.userInfo.phone || user.username === this.userInfo.username
        );
        if (!currentUser || !currentUser.creditCards || currentUser.creditCards.length === 0) {
          uni.showModal({
            title: "信用卡信息",
            content: "您暂无信用卡信息",
            showCancel: false,
            confirmText: "确定"
          });
          return;
        }
        const cardsInfo = currentUser.creditCards.map((card, index) => {
          const cardNumber = card.cardNumber.replace(/\s/g, "");
          const maskedNumber = cardNumber.substring(0, 4) + " **** **** " + cardNumber.substring(cardNumber.length - 4);
          return `信用卡 ${index + 1}：${card.cardType} ${card.cardBrand}
卡号：${maskedNumber}
额度：¥${card.creditLimit.toLocaleString()}
可用：¥${card.availableCredit.toLocaleString()}
欠款：¥${card.currentBalance.toLocaleString()}
最低还款：¥${card.minPayment.toLocaleString()}
账单日：每月${card.statementDate}日
还款日：${card.dueDate}
有效期：${card.expiryDate}
积分：${card.rewardsPoints}点`;
        }).join("\n\n");
        uni.showModal({
          title: "我的信用卡",
          content: cardsInfo,
          showCancel: false,
          confirmText: "确定",
          confirmColor: "#2e7d32"
        });
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
        uni.navigateTo({
          url: "/pages/user/profile"
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
        this.currentTheme = themeManager$1.getCurrentTheme();
      },
      // 获取主题显示名称
      getThemeDisplayName(theme) {
        if (theme && typeof theme === "object" && theme.name) {
          return theme.name;
        }
        const themeNames = {
          "light": "浅色主题",
          "dark": "深色主题",
          "blue": "蓝色主题",
          "purple": "紫色主题"
        };
        return themeNames[theme] || "浅色主题";
      },
      // 切换主题
      toggleTheme() {
        try {
          formatAppLog("log", "at pages/user/user.vue:485", "开始切换主题...");
          formatAppLog("log", "at pages/user/user.vue:486", "当前主题对象:", this.currentTheme);
          const themes2 = themeManager$1.getAllThemes();
          formatAppLog("log", "at pages/user/user.vue:490", "所有可用主题:", themes2);
          const currentThemeId = this.currentTheme.id || this.currentTheme;
          formatAppLog("log", "at pages/user/user.vue:493", "当前主题ID:", currentThemeId);
          const currentIndex = themes2.findIndex((theme) => theme.id === currentThemeId);
          formatAppLog("log", "at pages/user/user.vue:496", "当前主题索引:", currentIndex);
          const nextIndex = (currentIndex + 1) % themes2.length;
          const newTheme = themes2[nextIndex];
          formatAppLog("log", "at pages/user/user.vue:500", "下一个主题:", newTheme);
          themeManager$1.switchTheme(newTheme.id);
          formatAppLog("log", "at pages/user/user.vue:504", "主题管理器切换完成");
          this.currentTheme = newTheme;
          this.themeStyles = getThemeStyles();
          formatAppLog("log", "at pages/user/user.vue:509", "本地状态更新完成");
          uni.showToast({
            title: `已切换到${newTheme.name}`,
            icon: "success",
            duration: 1500
          });
          this.$forceUpdate();
          formatAppLog("log", "at pages/user/user.vue:520", "页面强制更新完成");
        } catch (error) {
          formatAppLog("error", "at pages/user/user.vue:522", "主题切换失败:", error);
          uni.showToast({
            title: "主题切换失败",
            icon: "none"
          });
        }
      },
      // 查看头像
      viewAvatar() {
        if (!this.userInfo || !this.userInfo.avatar) {
          uni.showToast({
            title: "暂无头像",
            icon: "none"
          });
          return;
        }
        uni.previewImage({
          urls: [this.userInfo.avatar],
          current: this.userInfo.avatar,
          fail: (error) => {
            formatAppLog("error", "at pages/user/user.vue:545", "预览头像失败:", error);
            uni.showToast({
              title: "预览失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "user-page",
        style: vue.normalizeStyle($data.themeStyles.backgroundColor)
      },
      [
        vue.createCommentVNode(" 顶部背景 "),
        vue.createElementVNode(
          "view",
          {
            class: "header-bg",
            style: vue.normalizeStyle($data.themeStyles.primaryGradient)
          },
          null,
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 用户信息卡片 "),
        $data.userInfo ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "user-card",
            style: vue.normalizeStyle($data.themeStyles.surface)
          },
          [
            vue.createElementVNode("view", { class: "user-info" }, [
              vue.createElementVNode("view", { class: "avatar-section" }, [
                vue.createElementVNode("view", {
                  class: "avatar",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.viewAvatar && $options.viewAvatar(...args))
                }, [
                  vue.createElementVNode("image", {
                    src: $data.userInfo.avatar || "/static/default-avatar.png",
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "avatar-view-overlay" }, [
                    vue.createElementVNode("text", { class: "view-icon" }, "👁️")
                  ])
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
          ],
          4
          /* STYLE */
        )) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 未登录状态 "),
            vue.createElementVNode(
              "view",
              {
                class: "login-card",
                style: vue.normalizeStyle($data.themeStyles.surface)
              },
              [
                vue.createElementVNode("view", { class: "login-content" }, [
                  vue.createElementVNode("text", { class: "login-title" }, "欢迎使用农业银行"),
                  vue.createElementVNode("text", { class: "login-subtitle" }, "请登录您的账户"),
                  vue.createElementVNode("button", {
                    class: "login-btn",
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.goToLogin && $options.goToLogin(...args))
                  }, "立即登录")
                ])
              ],
              4
              /* STYLE */
            )
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )),
        vue.createCommentVNode(" 快捷功能 "),
        $data.userInfo ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 2,
            class: "quick-functions",
            style: vue.normalizeStyle($data.themeStyles.surface)
          },
          [
            vue.createElementVNode("view", { class: "function-grid" }, [
              vue.createElementVNode("view", {
                class: "function-item",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.goToTransfer && $options.goToTransfer(...args))
              }, [
                vue.createElementVNode("view", { class: "function-icon transfer-icon" }, "💳"),
                vue.createElementVNode("text", { class: "function-text" }, "转账")
              ]),
              vue.createElementVNode("view", {
                class: "function-item",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.goToPayment && $options.goToPayment(...args))
              }, [
                vue.createElementVNode("view", { class: "function-icon payment-icon" }, "💰"),
                vue.createElementVNode("text", { class: "function-text" }, "缴费")
              ]),
              vue.createElementVNode("view", {
                class: "function-item",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.goToInvestment && $options.goToInvestment(...args))
              }, [
                vue.createElementVNode("view", { class: "function-icon investment-icon" }, "📈"),
                vue.createElementVNode("text", { class: "function-text" }, "理财")
              ]),
              vue.createElementVNode("view", {
                class: "function-item",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.goToCredit && $options.goToCredit(...args))
              }, [
                vue.createElementVNode("view", { class: "function-icon credit-icon" }, "💳"),
                vue.createElementVNode("text", { class: "function-text" }, "信用卡")
              ])
            ])
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 功能菜单 "),
        $data.userInfo ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "menu-sections"
        }, [
          vue.createCommentVNode(" 账户管理 "),
          vue.createElementVNode(
            "view",
            {
              class: "menu-section",
              style: vue.normalizeStyle($data.themeStyles.surface)
            },
            [
              vue.createElementVNode("view", { class: "section-title" }, "账户管理"),
              vue.createElementVNode("view", { class: "menu-list" }, [
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[6] || (_cache[6] = (...args) => $options.goToAccount && $options.goToAccount(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "🏦"),
                    vue.createElementVNode("text", { class: "menu-text" }, "我的账户")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[7] || (_cache[7] = (...args) => $options.goToCards && $options.goToCards(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "💳"),
                    vue.createElementVNode("text", { class: "menu-text" }, "我的卡片")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.goToTransactions && $options.goToTransactions(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "📊"),
                    vue.createElementVNode("text", { class: "menu-text" }, "交易记录")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createCommentVNode(" 个人设置 "),
          vue.createElementVNode(
            "view",
            {
              class: "menu-section",
              style: vue.normalizeStyle($data.themeStyles.surface)
            },
            [
              vue.createElementVNode("view", { class: "section-title" }, "个人设置"),
              vue.createElementVNode("view", { class: "menu-list" }, [
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.goToProfile && $options.goToProfile(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "👤"),
                    vue.createElementVNode("text", { class: "menu-text" }, "个人资料")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.goToSecurity && $options.goToSecurity(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "🔒"),
                    vue.createElementVNode("text", { class: "menu-text" }, "安全设置")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item theme-item",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.toggleTheme && $options.toggleTheme(...args))
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
            ],
            4
            /* STYLE */
          ),
          vue.createCommentVNode(" 客户服务 "),
          vue.createElementVNode(
            "view",
            {
              class: "menu-section",
              style: vue.normalizeStyle($data.themeStyles.surface)
            },
            [
              vue.createElementVNode("view", { class: "section-title" }, "客户服务"),
              vue.createElementVNode("view", { class: "menu-list" }, [
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.goToHelp && $options.goToHelp(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "❓"),
                    vue.createElementVNode("text", { class: "menu-text" }, "帮助中心")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[13] || (_cache[13] = (...args) => $options.goToContact && $options.goToContact(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "📞"),
                    vue.createElementVNode("text", { class: "menu-text" }, "联系客服")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ]),
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.viewLogoutHistory && $options.viewLogoutHistory(...args))
                }, [
                  vue.createElementVNode("view", { class: "menu-left" }, [
                    vue.createElementVNode("text", { class: "menu-icon" }, "📋"),
                    vue.createElementVNode("text", { class: "menu-text" }, "退出记录")
                  ]),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createCommentVNode(" 退出登录 "),
          vue.createElementVNode("view", { class: "logout-section" }, [
            vue.createElementVNode("button", {
              class: "logout-btn",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.handleLogout && $options.handleLogout(...args))
            }, "退出登录")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-99b0ba47"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/user/user.vue"]]);
  const _imports_0$1 = "/static/tabbar/service.png";
  const _sfc_main$l = {
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
        ],
        // 热点资讯（示例静态数据，可后续接入后端/抓取）
        newsList: [
          {
            id: "n1",
            title: "银行App上线智能投顾：个性化组合更省心",
            source: "银行官方",
            time: "今天 10:20",
            tag: "产品上新",
            tagClass: "tag-new",
            cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop"
          },
          {
            id: "n2",
            title: "人民币存款利率微调，稳中趋优助力财富增值",
            source: "金融时报",
            time: "今天 09:05",
            tag: "利率",
            tagClass: "tag-rate",
            cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
          },
          {
            id: "n3",
            title: "净值型理财规模增长，风险匹配与长期主义成共识",
            source: "理财早报",
            time: "昨天 18:42",
            tag: "理财",
            tagClass: "tag-wealth",
            cover: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?q=80&w=1200&auto=format&fit=crop"
          },
          {
            id: "n4",
            title: "外汇市场波动加大，分散配置与风险对冲受关注",
            source: "外汇观察",
            time: "昨天 14:10",
            tag: "外汇",
            tagClass: "tag-fx",
            cover: "https://img0.baidu.com/it/u=4159114734,4003708834&fm=253&fmt=auto&app=138&f=JPEG?w=739&h=500"
          }
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
      },
      onNewsClick(n) {
        uni.showToast({ title: n.title, icon: "none" });
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
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
      vue.createCommentVNode(" 内容区（整页滚动） "),
      vue.createElementVNode("view", { class: "content" }, [
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
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 热点资讯（固定展示在底部） "),
        vue.createElementVNode("view", { class: "section-card" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "热点资讯"),
            vue.createElementVNode("text", { class: "sub" }, "精选银行与理财要闻")
          ]),
          vue.createElementVNode("view", { class: "news-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.newsList, (n) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "news-item",
                  key: n.id,
                  onClick: ($event) => $options.onNewsClick(n)
                }, [
                  vue.createElementVNode("image", {
                    class: "news-cover",
                    src: n.cover,
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "news-body" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "news-title" },
                      vue.toDisplayString(n.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "news-meta" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["news-tag", n.tagClass])
                        },
                        vue.toDisplayString(n.tag),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "news-source" },
                        vue.toDisplayString(n.source),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "news-time" },
                        vue.toDisplayString(n.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "news-arrow" }, "›")
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ])
    ]);
  }
  const PagesWealthWealth = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-a00d3a3e"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/wealth/wealth.vue"]]);
  const _sfc_main$k = {
    name: "LifePage",
    data() {
      return {
        activeCategory: 0,
        categories: ["精选", "活动", "折扣", "品牌"],
        currentTimeGreeting: "",
        greetingEmoji: "",
        weatherInfo: "22°C 晴",
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
            action: "payment",
            badge: "热门"
          },
          {
            icon: "📱",
            label: "手机充值",
            bgColor: "#FF9500",
            action: "recharge",
            badge: "优惠"
          },
          {
            icon: "🏛️",
            label: "政务民生",
            bgColor: "#34C759",
            action: "government"
          },
          {
            icon: "🎮",
            label: "小豆乐园",
            bgColor: "#FF6B35",
            action: "games",
            badge: "新"
          }
        ],
        allServices: [
          {
            icon: "🏫",
            label: "校园",
            bgColor: "#5AC8FA",
            action: "campus",
            status: "在线"
          },
          { icon: "⚡", label: "食堂", bgColor: "#30D158", action: "canteen" },
          { icon: "🎉", label: "党费", bgColor: "#FF3B30", action: "party" },
          {
            icon: "👨‍⚕️",
            label: "养老服务",
            bgColor: "#007AFF",
            action: "elderly",
            status: "热门"
          },
          {
            icon: "📄",
            label: "社保医保",
            bgColor: "#34C759",
            action: "insurance"
          },
          {
            icon: "🌿",
            label: "低碳空间",
            bgColor: "#32D74B",
            action: "carbon",
            status: "新"
          },
          {
            icon: "🎫",
            label: "优惠卡券",
            bgColor: "#AF52DE",
            action: "coupons"
          },
          {
            icon: "🎁",
            label: "京东特惠",
            bgColor: "#FF9500",
            action: "jd",
            status: "限时"
          },
          { icon: "🏪", label: "城市专区", bgColor: "#5856D6", action: "city" },
          {
            icon: "🎊",
            label: "热门活动",
            bgColor: "#FF2D92",
            action: "events",
            status: "火爆"
          }
        ],
        // 不同分类的卡片数据
        promotionCards: {
          0: {
            // 精选
            main: {
              title: "积分当钱花",
              subtitle: "至高抵现50%",
              desc: "积分当钱花优惠手不停",
              buttonText: "立即使用"
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
              buttonText: "立即抢购"
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
              buttonText: "查看折扣"
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
              buttonText: "进入专区"
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
          formatAppLog("log", "at pages/life/life.vue:593", "生活页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/life/life.vue:601", "生活页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/life/life.vue:603", "生活页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      initPage() {
        formatAppLog("log", "at pages/life/life.vue:613", "生活页面初始化");
        this.updateTimeGreeting();
      },
      // 更新时间问候语
      updateTimeGreeting() {
        const hour = (/* @__PURE__ */ new Date()).getHours();
        if (hour < 6) {
          this.currentTimeGreeting = "深夜好";
          this.greetingEmoji = "🌙";
        } else if (hour < 12) {
          this.currentTimeGreeting = "早上好";
          this.greetingEmoji = "🌅";
        } else if (hour < 18) {
          this.currentTimeGreeting = "下午好";
          this.greetingEmoji = "☀️";
        } else {
          this.currentTimeGreeting = "晚上好";
          this.greetingEmoji = "🌆";
        }
      },
      // 跳转到个人资料
      goToProfile() {
        uni.navigateTo({
          url: "/pages/user/profile"
        });
      },
      handleServiceTap(service) {
        formatAppLog("log", "at pages/life/life.vue:643", "点击服务:", service);
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
        formatAppLog("log", "at pages/life/life.vue:668", "切换分类:", this.categories[index]);
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
        formatAppLog("log", "at pages/life/life.vue:695", "点击主卡片:", currentCard);
        uni.showToast({
          title: `点击了${currentCard.title}`,
          icon: "none"
        });
      },
      // 处理小卡片点击
      handleSmallCardTap(card, index) {
        formatAppLog("log", "at pages/life/life.vue:704", "点击小卡片:", card, index);
        uni.showToast({
          title: `点击了${card.title}`,
          icon: "none"
        });
      },
      // 处理轮播图点击
      handleBannerTap(banner) {
        formatAppLog("log", "at pages/life/life.vue:713", "点击轮播图:", banner);
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
                  formatAppLog("log", "at pages/life/life.vue:735", `成功跳转到: ${banner.url}`);
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/life/life.vue:738", "跳转失败:", err);
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
        formatAppLog("log", "at pages/life/life.vue:755", "跳转到生活缴费页面");
        uni.navigateTo({
          url: "/pages/payment/payment",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:759", "成功跳转到生活缴费页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:762", "跳转失败:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      },
      goToRecharge() {
        formatAppLog("log", "at pages/life/life.vue:772", "跳转到手机充值页面");
        uni.navigateTo({
          url: "/pages/recharge/recharge",
          success: () => {
            formatAppLog("log", "at pages/life/life.vue:776", "成功跳转到手机充值页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/life/life.vue:779", "跳转失败:", err);
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
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "life-page" }, [
      vue.createCommentVNode(" 头部标题区域 "),
      vue.createElementVNode("view", { class: "header-section" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("view", { class: "greeting-section" }, [
            vue.createElementVNode("view", { class: "time-greeting" }, [
              vue.createElementVNode(
                "text",
                { class: "greeting-time" },
                vue.toDisplayString($data.currentTimeGreeting),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "greeting-emoji" },
                vue.toDisplayString($data.greetingEmoji),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("text", { class: "greeting-text" }, "欢迎使用"),
            vue.createElementVNode("text", { class: "app-name" }, "生活服务"),
            vue.createElementVNode("text", { class: "app-subtitle" }, "让生活更简单便捷")
          ]),
          vue.createElementVNode("view", { class: "user-section" }, [
            vue.createElementVNode("view", { class: "weather-info" }, [
              vue.createElementVNode("text", { class: "weather-icon" }, "🌤️"),
              vue.createElementVNode(
                "text",
                { class: "weather-text" },
                vue.toDisplayString($data.weatherInfo),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "user-avatar",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.goToProfile && $options.goToProfile(...args))
            }, [
              vue.createElementVNode("text", { class: "avatar-icon" }, "👤"),
              vue.createElementVNode("view", { class: "avatar-status" })
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "header-decoration" }, [
          vue.createElementVNode("view", { class: "decoration-circle circle-1" }),
          vue.createElementVNode("view", { class: "decoration-circle circle-2" }),
          vue.createElementVNode("view", { class: "decoration-circle circle-3" }),
          vue.createElementVNode("view", { class: "decoration-line line-1" }),
          vue.createElementVNode("view", { class: "decoration-line line-2" })
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
          vue.createElementVNode("view", { class: "section-title-wrapper" }, [
            vue.createElementVNode("text", { class: "section-icon" }, "⚡"),
            vue.createElementVNode("text", { class: "section-title" }, "快捷服务")
          ]),
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
                    vue.createElementVNode("view", { class: "icon-glow" }),
                    vue.createElementVNode("view", { class: "icon-shimmer" })
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
                service.badge ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "service-badge"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge-text" },
                    vue.toDisplayString(service.badge),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
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
          vue.createElementVNode("view", { class: "section-title-wrapper" }, [
            vue.createElementVNode("text", { class: "section-icon" }, "🎯"),
            vue.createElementVNode("text", { class: "section-title" }, "全部服务")
          ]),
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
                    vue.createElementVNode("view", { class: "icon-glow-large" }),
                    vue.createElementVNode("view", { class: "icon-shimmer-large" })
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
                ),
                service.status ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "service-status"
                }, [
                  vue.createElementVNode("text", { class: "status-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "status-text" },
                    vue.toDisplayString(service.status),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 分类导航 "),
      vue.createElementVNode("view", { class: "category-nav" }, [
        vue.createElementVNode("view", { class: "nav-container" }, [
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
                ),
                $data.activeCategory === index ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "nav-indicator"
                })) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "nav-background" })
      ]),
      vue.createCommentVNode(" 优惠活动卡片 "),
      vue.createElementVNode("view", { class: "promotion-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("view", { class: "section-title-wrapper" }, [
            vue.createElementVNode("text", { class: "section-icon" }, "🎁"),
            vue.createElementVNode("text", { class: "section-title" }, "精选优惠")
          ]),
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
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleMainCardTap && $options.handleMainCardTap(...args))
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
  const PagesLifeLife = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-980f0516"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/life/life.vue"]]);
  const SILICONFLOW_API_KEY = "sk-fkzxlpblcjigbzitanooofmnfmvvedobfdvvxqdbbdodntdt";
  const API_BASE_URL = "https://api.siliconflow.cn/v1";
  const sessionHistory = {};
  const chat = async (message, sessionId = "default", imageData = null) => {
    try {
      formatAppLog("log", "at api/ai.js:18", "chat API调用，接收到的参数:");
      formatAppLog("log", "at api/ai.js:19", "- message:", message);
      formatAppLog("log", "at api/ai.js:20", "- sessionId:", sessionId);
      formatAppLog("log", "at api/ai.js:21", "- imageData长度:", imageData ? imageData.length : 0);
      formatAppLog("log", "at api/ai.js:22", "- imageData前50字符:", imageData ? imageData.substring(0, 50) : "无");
      if (!sessionHistory[sessionId]) {
        sessionHistory[sessionId] = [];
      }
      const messageContent = [];
      if (imageData) {
        formatAppLog("log", "at api/ai.js:32", "添加图片到消息内容");
        messageContent.push({
          type: "image_url",
          image_url: { url: imageData }
        });
      }
      messageContent.push({ type: "text", text: message });
      sessionHistory[sessionId].push({
        role: "user",
        content: messageContent
      });
      const selectedModel = imageData ? "Qwen/Qwen2.5-VL-32B-Instruct" : "Qwen/Qwen2.5-14B-Instruct";
      formatAppLog("log", "at api/ai.js:48", "选择的模型:", selectedModel);
      formatAppLog("log", "at api/ai.js:49", "发送给AI的消息内容:", JSON.stringify(messageContent, null, 2));
      const response = await uni.request({
        url: `${API_BASE_URL}/chat/completions`,
        method: "POST",
        header: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json"
        },
        data: {
          model: selectedModel,
          messages: sessionHistory[sessionId],
          stream: false
        },
        timeout: 6e4
      });
      if (response.statusCode === 200 && response.data) {
        const assistantReply = response.data.choices[0].message;
        sessionHistory[sessionId].push(assistantReply);
        return {
          success: true,
          reply: assistantReply.content,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        };
      } else {
        throw new Error(`API请求失败: ${response.statusCode}`);
      }
    } catch (error) {
      formatAppLog("error", "at api/ai.js:79", "聊天请求失败:", error);
      return {
        success: false,
        error: error.message || "请求失败"
      };
    }
  };
  const speechToText = async (audioFile) => {
    try {
      const response = await uni.uploadFile({
        url: `${API_BASE_URL}/audio/transcriptions`,
        name: "file",
        filePath: audioFile,
        header: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`
        },
        formData: {
          model: "FunAudioLLM/SenseVoiceSmall",
          language: "zh"
        }
      });
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        return {
          success: true,
          text: data.text || data.result || ""
        };
      } else {
        throw new Error(`语音识别失败: ${response.statusCode}`);
      }
    } catch (error) {
      formatAppLog("error", "at api/ai.js:117", "语音转文字失败:", error);
      return {
        success: false,
        error: error.message || "语音识别失败"
      };
    }
  };
  const textToSpeech = async (text) => {
    try {
      formatAppLog("log", "at api/ai.js:130", "开始TTS请求，文本:", text);
      const requestData = {
        model: "fnlp/MOSS-TTSD-v0.5",
        input: `[S1]${text}`,
        // 使用[S1]标记说话人1
        voice: "fnlp/MOSS-TTSD-v0.5:anna",
        // 切换为 anna（温柔女声）
        response_format: "mp3",
        sample_rate: 44100,
        stream: false,
        // 改为false，获取完整音频文件
        speed: 1,
        // 语速
        gain: 0
      };
      formatAppLog("log", "at api/ai.js:144", "TTS请求数据:", requestData);
      const response = await uni.request({
        url: `${API_BASE_URL}/audio/speech`,
        method: "POST",
        header: {
          "Authorization": `Bearer ${SILICONFLOW_API_KEY}`,
          "Content-Type": "application/json"
        },
        data: requestData,
        timeout: 6e4,
        responseType: "arraybuffer"
        // 确保返回二进制数据
      });
      formatAppLog("log", "at api/ai.js:158", "TTS响应状态:", response.statusCode);
      formatAppLog("log", "at api/ai.js:159", "TTS响应头:", response.header);
      if (response.statusCode === 200) {
        const arrayBuffer = response.data;
        const uint8Array = new Uint8Array(arrayBuffer);
        formatAppLog("log", "at api/ai.js:166", "音频数据长度:", uint8Array.length);
        let base64 = "";
        try {
          let binaryString = "";
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
          }
          base64 = btoa(binaryString);
        } catch (e) {
          formatAppLog("log", "at api/ai.js:178", "btoa不可用，使用手动base64编码");
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          for (let i = 0; i < uint8Array.length; i += 3) {
            const byte1 = uint8Array[i] || 0;
            const byte2 = uint8Array[i + 1] || 0;
            const byte3 = uint8Array[i + 2] || 0;
            const enc1 = byte1 >> 2;
            const enc2 = (byte1 & 3) << 4 | byte2 >> 4;
            const enc3 = (byte2 & 15) << 2 | byte3 >> 6;
            const enc4 = byte3 & 63;
            base64 += chars[enc1] + chars[enc2] + chars[enc3] + chars[enc4];
          }
        }
        formatAppLog("log", "at api/ai.js:195", "base64长度:", base64.length);
        return {
          success: true,
          audioData: `data:audio/mp3;base64,${base64}`,
          audioPath: `data:audio/mp3;base64,${base64}`
          // 兼容原有代码
        };
      } else {
        formatAppLog("error", "at api/ai.js:204", "TTS API响应:", response);
        formatAppLog("error", "at api/ai.js:205", "TTS响应数据:", response.data);
        let errorMessage = `语音合成失败: ${response.statusCode}`;
        try {
          if (response.data) {
            const errorData = JSON.parse(response.data);
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (e) {
          formatAppLog("log", "at api/ai.js:215", "无法解析错误响应");
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      formatAppLog("error", "at api/ai.js:221", "文字转语音失败:", error);
      return {
        success: false,
        error: error.message || "语音合成失败"
      };
    }
  };
  const _imports_0 = "/static/wealth/aiavatar.png";
  const _imports_1 = "/static/wealth/useravatar.jpg";
  const _sfc_main$j = {
    data() {
      return {
        draft: "",
        sending: false,
        recording: false,
        scrollIntoId: "chat-bottom-anchor",
        placeholder: "请输入您的问题",
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
        // 预设问答
        showFaqSuggestions: true,
        faqSuggestions: [
          {
            title: "交易限额",
            answer: "我行渠道常见交易限额：\n- 微信银行单笔/单日可能存在额度限制，视账户与安全控件而定；\n- 手机银行按认证等级与设备控件不同；\n- 网银/U盾通常额度更高。\n如需提升额度：进入 设置-限额设置 或前往网点升级身份核验。"
          },
          {
            title: "个人消费贷款贴息范围",
            answer: "个人消费贷款贴息范围一般涵盖教育培训、家装家电、耐用消费品购置等合规消费用途，具体以当地贴息政策与银行审核为准。可咨询本地营业网点或致电95599。"
          },
          {
            title: "如何申请个人消费贷款贴息",
            answer: "申请流程：\n1) 确认是否在贴息活动覆盖区域及名单；\n2) 通过手机银行/网点提交贷款申请与相关材料；\n3) 审批后按合同发放；\n4) 贴息按政策周期与比例执行，系统自动核算抵扣。"
          },
          {
            title: "抗战胜利80周年普通纪念币",
            answer: "该纪念币发行与预约以人民银行公告为准。预约、兑换时间、额度及网点安排以公告为准，请关注人民银行与我行官方渠道通知。"
          }
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
        audioCtx: null,
        currentPlayingMessage: null
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
        this.initAudioContext();
      } catch (e) {
        formatAppLog("error", "at pages/service/chat.vue:153", "onLoad初始化失败:", e);
      }
    },
    onUnload() {
      this.stopCurrentAudio();
      if (this.audioCtx) {
        this.audioCtx.destroy();
        this.audioCtx = null;
      }
    },
    methods: {
      async selectFaq(item) {
        const renderedQ = this.renderMarkdownAndEmojis(item.title);
        const userMsg = { id: Date.now() + "-u", role: "user", html: renderedQ, time: this.nowTime() };
        this.messages.push(userMsg);
        const botIndex = this.showThinking("思考中…");
        const answer = item.answer || "稍后为您补充详细说明。";
        await this.typeOut(answer, botIndex, 1, 30);
        try {
          const tts = await textToSpeech(answer);
          if (tts && tts.success && this.messages[botIndex] && this.messages[botIndex].role === "bot") {
            this.$set(this.messages[botIndex], "audio", tts.audioPath);
          }
        } catch (e) {
          formatAppLog("warn", "at pages/service/chat.vue:179", "预设问答TTS失败:", e);
        }
        this.toBottom();
      },
      showThinking(text = "思考中…") {
        const botId = Date.now() + "-thinking";
        const msg = { id: botId, role: "bot", html: text, time: "" };
        this.messages.push(msg);
        this.toBottom();
        return this.messages.length - 1;
      },
      updateBotMessage(index, text) {
        const rendered = this.renderMarkdownAndEmojis(text);
        if (this.messages[index] && this.messages[index].role === "bot") {
          this.$set(this.messages[index], "html", rendered);
          this.$set(this.messages[index], "time", this.nowTime());
        }
        this.toBottom();
      },
      typeOut(fullText, index, chunkSize = 1, interval = 50) {
        return new Promise((resolve) => {
          let pos = 0;
          const step = () => {
            if (pos >= fullText.length)
              return resolve();
            const nextPos = Math.min(fullText.length, pos + chunkSize);
            const slice = fullText.slice(0, nextPos);
            this.updateBotMessage(index, slice);
            pos = nextPos;
            this.toBottom();
            setTimeout(step, interval);
          };
          this.updateBotMessage(index, "");
          this.toBottom();
          step();
        });
      },
      // 已移除流式实现，统一走一次性请求
      async requestOnceText(content, botIndexToReuse = null, imageData = null) {
        try {
          const sid = imageData ? `${this.sessionId}-vision` : this.sessionId;
          const result = await chat(content, sid, imageData != null ? imageData : this.pendingImageBase64);
          if (result.success) {
            const replyText = result.reply || "";
            const targetIndex = botIndexToReuse != null ? botIndexToReuse : this.showThinking();
            await this.typeOut(replyText, targetIndex, 1, 50);
          } else {
            throw new Error(result.error || "AI服务请求失败");
          }
        } catch (e) {
          formatAppLog("error", "at pages/service/chat.vue:241", "AI request error:", e);
          const fallback = this.generateReply(content);
          if (botIndexToReuse != null)
            this.updateBotMessage(botIndexToReuse, fallback);
          else
            this.messages.push({ id: Date.now() + "-b", role: "bot", html: this.renderMarkdownAndEmojis(fallback), time: this.nowTime() });
          uni.showToast({ title: "AI服务请求失败", icon: "none" });
        }
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
      togglePlayAudio(message) {
        uni.showToast({ title: "已关闭语音播放", icon: "none" });
        return;
      },
      stopCurrentAudio() {
        if (this.audioCtx) {
          this.audioCtx.stop();
        }
        if (this.currentPlayingMessage) {
          this.$set(this.currentPlayingMessage, "isPlaying", false);
          this.currentPlayingMessage = null;
        }
      },
      toggleEmoji() {
        this.showEmoji = !this.showEmoji;
      },
      // 安全转义 + 简单Markdown + 表情替换
      renderMarkdownAndEmojis(text = "") {
        let html = this.escapeHtml(text || "");
        html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\n/g, "<br/>");
        if (Array.isArray(this.EMOJI_ITEMS)) {
          for (const item of this.EMOJI_ITEMS) {
            const img = `<img src="${item.url}" alt="${item.code}" style="height:1.2em;vertical-align:-0.2em"/>`;
            html = html.split(item.code).join(img);
            html = html.split(item.char).join(img);
          }
        }
        return html;
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
        speechToText(filePath).then((result) => {
          uni.hideLoading();
          if (result.success && result.text) {
            this.draft = result.text;
            this.send();
          } else {
            uni.showToast({ title: result.error || "识别失败", icon: "none" });
          }
        }).catch((e) => {
          uni.hideLoading();
          uni.showToast({ title: "识别失败", icon: "none" });
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
              const ext2 = (path.split(".").pop() || "").toLowerCase();
              let mime2 = "image/jpeg";
              if (ext2 === "png")
                mime2 = "image/png";
              else if (ext2 === "jpg" || ext2 === "jpeg")
                mime2 = "image/jpeg";
              else if (ext2 === "webp")
                mime2 = "image/webp";
              plus.io.resolveLocalFileSystemURL(path, (entry) => {
                entry.file((file) => {
                  const reader = new plus.io.FileReader();
                  reader.onloadend = (e) => {
                    const dataUrl = e.target && e.target.result ? String(e.target.result) : "";
                    if (dataUrl && dataUrl.startsWith("data:")) {
                      this.pendingImageBase64 = dataUrl;
                    } else if (dataUrl) {
                      this.pendingImageBase64 = `data:${mime2};base64,${dataUrl}`;
                    }
                  };
                  reader.readAsDataURL(file);
                }, (err) => {
                  formatAppLog("warn", "at pages/service/chat.vue:375", "读取文件失败:", err);
                });
              }, (err) => {
                formatAppLog("warn", "at pages/service/chat.vue:378", "路径解析失败:", err);
              });
            } catch (e) {
              formatAppLog("warn", "at pages/service/chat.vue:387", "图片转base64失败:", e);
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
          const imageDataForSend = this.pendingImageBase64;
          this.pendingImageLocalPath = "";
          let botIndex = null;
          if (imageDataForSend) {
            botIndex = this.showThinking("正在分析图片中...");
          }
          this.pendingImageBase64 = "";
          await this.requestOnceText(content, botIndex, imageDataForSend);
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
          return '存款业务：活期按日计息，定期支持3个月/6个月/1年/3年等档，起存金额1000元起。可通过"财富-存款"进行办理。';
        }
        if (t.includes("理财") || t.includes("收益") || t.includes("申购")) {
          return '理财产品分为低/中风险，起投金额1000-10000元不等，支持T+1灵活赎回与封闭期产品，详情见"财富-理财产品"。';
        }
        if (t.includes("保险") || t.includes("意外") || t.includes("重疾")) {
          return '保险服务：提供医疗险、意外险、重疾险等多品类方案，支持在线投保与电子保单。可在"财富-保险"查看。';
        }
        if (t.includes("外汇") || t.includes("汇率") || t.includes("结售汇")) {
          return '外汇业务：支持主要币种实时汇率查询与结售汇，您可在"财富-外汇"查看行情并发起交易。';
        }
        if (t.includes("人工") || t.includes("转接") || t.includes("客服")) {
          return "需要人工服务吗？您可以拨打客服热线 95599，我们将尽快为您安排专属服务。";
        }
        return "已收到您的问题。我将为您查找相关信息，您也可以具体描述业务类型（如：存款/理财/保险/外汇）。";
      },
      toBottom() {
        this.$nextTick(() => {
          this.scrollIntoId = "chat-bottom-anchor";
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
      },
      // base64转ArrayBuffer
      base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      },
      // 初始化音频上下文
      initAudioContext() {
        try {
          if (this.audioCtx) {
            this.audioCtx.destroy();
          }
          this.audioCtx = uni.createInnerAudioContext();
          formatAppLog("log", "at pages/service/chat.vue:499", "音频上下文初始化成功");
          this.audioCtx.onEnded(() => {
            formatAppLog("log", "at pages/service/chat.vue:503", "音频播放结束");
            this.stopCurrentAudio();
          });
          this.audioCtx.onError((err) => {
            formatAppLog("error", "at pages/service/chat.vue:509", "音频播放错误:", err);
            formatAppLog("error", "at pages/service/chat.vue:510", "错误详情:", JSON.stringify(err));
            this.stopCurrentAudio();
          });
          this.audioCtx.onPlay(() => {
            formatAppLog("log", "at pages/service/chat.vue:517", "音频开始播放");
          });
          this.audioCtx.onCanplay(() => {
            formatAppLog("log", "at pages/service/chat.vue:522", "音频加载完成");
          });
          if (this.audioCtx.onLoadstart) {
            this.audioCtx.onLoadstart(() => {
              formatAppLog("log", "at pages/service/chat.vue:527", "音频开始加载");
            });
          }
          if (this.audioCtx.onLoaderror) {
            this.audioCtx.onLoaderror((err) => {
              formatAppLog("error", "at pages/service/chat.vue:533", "音频加载失败:", err);
              formatAppLog("error", "at pages/service/chat.vue:534", "加载错误详情:", JSON.stringify(err));
            });
          }
        } catch (e) {
          formatAppLog("error", "at pages/service/chat.vue:539", "音频上下文初始化失败:", e);
        }
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-page" }, [
      vue.createElementVNode("view", { class: "chat-header" }, [
        vue.createElementVNode("text", { class: "title" }, "AI 智能客服"),
        vue.createElementVNode("text", { class: "sub" }, "24小时为您服务")
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "chat-body",
        "scroll-into-view": $data.scrollIntoId,
        "scroll-with-animation": "true"
      }, [
        vue.createCommentVNode(" 预设问答区：猜你想了解 "),
        $data.showFaqSuggestions ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "faq-card"
        }, [
          vue.createElementVNode("view", { class: "faq-card-header" }, [
            vue.createElementVNode("image", {
              class: "faq-avatar",
              src: _imports_0,
              mode: "aspectFit"
            }),
            vue.createElementVNode("text", { class: "faq-title" }, "猜您想要了解以下内容")
          ]),
          vue.createElementVNode("view", { class: "faq-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.faqSuggestions, (q, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "faq-item",
                  key: idx,
                  onClick: ($event) => $options.selectFaq(q)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "faq-text" },
                    vue.toDisplayString(q.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "faq-arrow" }, "›")
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : vue.createCommentVNode("v-if", true),
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
                  class: "message-img",
                  mode: "aspectFit",
                  style: { width: "200rpx", height: "160rpx" }
                }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                m.time ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 2,
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
        )),
        vue.createCommentVNode(" 底部锚点用于自动滚动 "),
        vue.createElementVNode("view", { id: $data.scrollIntoId }, null, 8, ["id"])
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
      vue.withDirectives(vue.createElementVNode(
        "view",
        { class: "emoji-panel" },
        [
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
                item.url ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  src: item.url,
                  alt: item.code,
                  style: { "width": "24px", "height": "24px" },
                  mode: "aspectFit",
                  "lazy-load": false,
                  onError: ($event) => item.url = ""
                }, null, 40, ["src", "alt", "onError"])) : (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    style: { "font-size": "24px", "line-height": "24px" }
                  },
                  vue.toDisplayString(item.char),
                  1
                  /* TEXT */
                ))
              ], 8, ["onClick", "title"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        512
        /* NEED_PATCH */
      ), [
        [vue.vShow, $data.showEmoji]
      ]),
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
  const PagesServiceChat = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-e19cce9b"], ["__file", "D:/项目/yihangyidon/src/pages/service/chat.vue"]]);
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
  function getUserBalance() {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = getUserInfo();
        if (!userInfo) {
          reject(new Error("用户未登录"));
          return;
        }
        const balance = userInfo.balance || 0;
        formatAppLog("log", "at api/balance.js:18", "获取用户余额:", balance);
        resolve(balance);
      } catch (error) {
        formatAppLog("error", "at api/balance.js:21", "获取用户余额失败:", error);
        reject(error);
      }
    });
  }
  function deductBalance(amount, description = "转账支出") {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = getUserInfo();
        if (!userInfo) {
          reject(new Error("用户未登录"));
          return;
        }
        const currentBalance = userInfo.balance || 0;
        if (currentBalance < amount) {
          resolve({
            success: false,
            newBalance: currentBalance,
            message: "余额不足，无法完成转账"
          });
          return;
        }
        const newBalance = currentBalance - amount;
        userInfo.balance = newBalance;
        userInfo.lastUpdateTime = (/* @__PURE__ */ new Date()).toISOString();
        uni.setStorageSync("userInfo", userInfo);
        uni.setStorageSync("currentUser", userInfo);
        updateUserBalanceInDatabase(userInfo);
        addTransactionRecord({
          type: "expense",
          amount,
          description,
          balance: newBalance,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        formatAppLog("log", "at api/balance.js:75", `余额扣除成功: ${amount}元，剩余余额: ${newBalance}元`);
        resolve({
          success: true,
          newBalance,
          message: "转账成功"
        });
      } catch (error) {
        formatAppLog("error", "at api/balance.js:84", "扣除余额失败:", error);
        reject(error);
      }
    });
  }
  function checkBalanceSufficient(amount) {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = getUserInfo();
        if (!userInfo) {
          reject(new Error("用户未登录"));
          return;
        }
        const currentBalance = userInfo.balance || 0;
        const isSufficient = currentBalance >= amount;
        formatAppLog("log", "at api/balance.js:159", `余额检查: 当前余额${currentBalance}元，需要${amount}元，是否足够: ${isSufficient}`);
        resolve(isSufficient);
      } catch (error) {
        formatAppLog("error", "at api/balance.js:163", "检查余额失败:", error);
        reject(error);
      }
    });
  }
  function updateUserBalanceInDatabase(userInfo) {
    try {
      const users2 = uni.getStorageSync("users") || [];
      const userIndex = users2.findIndex((user) => user.id === userInfo.id);
      if (userIndex !== -1) {
        users2[userIndex] = { ...users2[userIndex], ...userInfo };
        uni.setStorageSync("users", users2);
        formatAppLog("log", "at api/balance.js:181", "本地数据库余额更新成功");
      }
    } catch (error) {
      formatAppLog("error", "at api/balance.js:184", "更新本地数据库余额失败:", error);
    }
  }
  function addTransactionRecord(transaction) {
    try {
      const userInfo = getUserInfo();
      if (!userInfo) {
        return;
      }
      if (!userInfo.transactionRecords) {
        userInfo.transactionRecords = [];
      }
      const newRecord = {
        id: Date.now(),
        ...transaction
      };
      userInfo.transactionRecords.unshift(newRecord);
      if (userInfo.transactionRecords.length > 100) {
        userInfo.transactionRecords = userInfo.transactionRecords.slice(0, 100);
      }
      uni.setStorageSync("userInfo", userInfo);
      uni.setStorageSync("currentUser", userInfo);
      formatAppLog("log", "at api/balance.js:218", "交易记录添加成功:", newRecord);
    } catch (error) {
      formatAppLog("error", "at api/balance.js:221", "添加交易记录失败:", error);
    }
  }
  const _sfc_main$i = {
    name: "PaymentPasswordModal",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      amount: {
        type: Number,
        required: true
      },
      payee: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        currentPassword: "",
        passwordDots: [1, 2, 3, 4, 5, 6],
        // 6个密码点
        errorMessage: "",
        loading: false,
        userInfo: null
      };
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.resetModal();
          this.loadUserInfo();
          this.$nextTick(() => {
            this.focusInput();
          });
        }
      }
    },
    methods: {
      loadUserInfo() {
        this.userInfo = getUserInfo();
      },
      resetModal() {
        this.currentPassword = "";
        this.errorMessage = "";
        this.loading = false;
      },
      focusInput() {
        if (this.$refs.passwordInput) {
          this.$refs.passwordInput.focus();
        }
      },
      onInputFocus() {
      },
      onInputBlur() {
      },
      onPasswordInput() {
        this.errorMessage = "";
        if (this.currentPassword.length === 6) {
          this.verifyPassword();
        }
      },
      async verifyPassword() {
        if (!this.userInfo || !this.userInfo.transactionPassword) {
          this.errorMessage = "未设置交易密码，请先设置";
          return false;
        }
        if (this.currentPassword === this.userInfo.transactionPassword) {
          return true;
        } else {
          this.errorMessage = "交易密码错误，请重新输入";
          this.currentPassword = "";
          return false;
        }
      },
      async confirmPayment() {
        if (this.currentPassword.length !== 6) {
          this.errorMessage = "请输入6位交易密码";
          return;
        }
        this.loading = true;
        try {
          const isValid = await this.verifyPassword();
          if (isValid) {
            this.$emit("payment-confirmed", {
              amount: this.amount,
              payee: this.payee,
              description: this.description,
              password: this.currentPassword
            });
            this.addSecurityEvent("payment", `支付¥${this.amount.toFixed(2)}给${this.payee}`);
            this.closeModal();
          } else {
            this.loading = false;
          }
        } catch (error) {
          formatAppLog("error", "at components/common/PaymentPasswordModal.vue:198", "支付验证失败:", error);
          this.errorMessage = "验证失败，请重试";
          this.loading = false;
        }
      },
      closeModal() {
        this.$emit("close");
      },
      handleMaskClick() {
        this.closeModal();
      },
      addSecurityEvent(type, description) {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings) {
          if (!userInfo.securitySettings.securityEvents) {
            userInfo.securitySettings.securityEvents = [];
          }
          const newEvent = {
            id: Date.now(),
            type,
            description,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            location: "当前位置",
            ip: "192.168.1.100",
            status: "success"
          };
          userInfo.securitySettings.securityEvents.unshift(newEvent);
          if (userInfo.securitySettings.securityEvents.length > 50) {
            userInfo.securitySettings.securityEvents = userInfo.securitySettings.securityEvents.slice(0, 50);
          }
          uni.setStorageSync("userInfo", userInfo);
          uni.setStorageSync("currentUser", userInfo);
        }
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.visible ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "payment-password-modal",
      onClick: _cache[8] || (_cache[8] = (...args) => $options.handleMaskClick && $options.handleMaskClick(...args))
    }, [
      vue.createElementVNode("view", {
        class: "modal-content",
        onClick: _cache[7] || (_cache[7] = vue.withModifiers(() => {
        }, ["stop"]))
      }, [
        vue.createCommentVNode(" 弹窗头部 "),
        vue.createElementVNode("view", { class: "modal-header" }, [
          vue.createElementVNode("view", { class: "header-left" }, [
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "header-title" }, "交易密码验证"),
          vue.createElementVNode("view", { class: "header-right" })
        ]),
        vue.createCommentVNode(" 弹窗内容 "),
        vue.createElementVNode("view", { class: "modal-body" }, [
          vue.createElementVNode("view", { class: "payment-info" }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "支付金额："),
              vue.createElementVNode(
                "text",
                { class: "info-value amount" },
                "¥" + vue.toDisplayString($props.amount.toFixed(2)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "收款方："),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($props.payee),
                1
                /* TEXT */
              )
            ]),
            $props.description ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "info-item"
            }, [
              vue.createElementVNode("text", { class: "info-label" }, "交易说明："),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($props.description),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 密码输入区域 "),
          vue.createElementVNode("view", { class: "password-input-section" }, [
            vue.createElementVNode("view", { class: "input-label" }, "请输入交易密码"),
            vue.createElementVNode("view", { class: "password-dots" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.passwordDots, (dot, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: index,
                      class: vue.normalizeClass(["password-dot", { "filled": index < $data.currentPassword.length }])
                    },
                    [
                      index < $data.currentPassword.length ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "●")) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 隐藏的输入框 "),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                ref: "passwordInput",
                type: "password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.currentPassword = $event),
                maxlength: "6",
                class: "hidden-input",
                onInput: _cache[2] || (_cache[2] = (...args) => $options.onPasswordInput && $options.onPasswordInput(...args)),
                onFocus: _cache[3] || (_cache[3] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                onBlur: _cache[4] || (_cache[4] = (...args) => $options.onInputBlur && $options.onInputBlur(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.currentPassword]
            ])
          ]),
          vue.createCommentVNode(" 错误提示 "),
          $data.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "error-message"
          }, [
            vue.createElementVNode(
              "text",
              { class: "error-text" },
              vue.toDisplayString($data.errorMessage),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 操作按钮 "),
          vue.createElementVNode("view", { class: "modal-actions" }, [
            vue.createElementVNode("button", {
              class: "cancel-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "取消"),
            vue.createElementVNode("button", {
              class: "confirm-btn",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.confirmPayment && $options.confirmPayment(...args)),
              disabled: $data.currentPassword.length !== 6 || $data.loading
            }, vue.toDisplayString($data.loading ? "验证中..." : "确认支付"), 9, ["disabled"])
          ])
        ])
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const PaymentPasswordModal = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-c92603ac"], ["__file", "E:/Vue项目/专高六/1/项目/src/components/common/PaymentPasswordModal.vue"]]);
  const _sfc_main$h = {
    name: "SimpleThemeSwitcher",
    data() {
      return {
        showSelector: false,
        selectedThemeId: null,
        currentThemeId: themeManager$1.getCurrentThemeId(),
        availableThemes: Object.values(themes$1)
      };
    },
    mounted() {
      themeManager$1.addThemeListener(this.onThemeChanged);
    },
    beforeDestroy() {
      themeManager$1.removeThemeListener(this.onThemeChanged);
    },
    methods: {
      onThemeChanged(theme) {
        this.currentThemeId = theme.id;
      },
      selectTheme(themeId) {
        this.selectedThemeId = themeId;
      },
      applyTheme() {
        if (this.selectedThemeId) {
          themeManager$1.switchTheme(this.selectedThemeId);
          uni.showToast({
            title: "主题已切换",
            icon: "success",
            duration: 1500
          });
        }
        this.closeModal();
      },
      closeModal() {
        this.showSelector = false;
        this.selectedThemeId = null;
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "theme-switcher" }, [
      vue.createCommentVNode(" 主题切换按钮 "),
      vue.createElementVNode("view", {
        class: "theme-button",
        onClick: _cache[0] || (_cache[0] = ($event) => $data.showSelector = true)
      }, [
        vue.createElementVNode("text", { class: "theme-icon" }, "🎨"),
        vue.createElementVNode("text", { class: "theme-text" }, "主题")
      ]),
      vue.createCommentVNode(" 主题选择弹窗 "),
      $data.showSelector ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "theme-modal",
        onClick: _cache[5] || (_cache[5] = (...args) => $options.closeModal && $options.closeModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createCommentVNode(" 弹窗头部 "),
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "选择主题"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "×")
          ]),
          vue.createCommentVNode(" 主题列表 "),
          vue.createElementVNode("view", { class: "theme-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.availableThemes, (theme) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: theme.id,
                  class: vue.normalizeClass(["theme-item", { active: $data.currentThemeId === theme.id }]),
                  onClick: ($event) => $options.selectTheme(theme.id)
                }, [
                  vue.createElementVNode("view", { class: "theme-preview" }, [
                    vue.createElementVNode("view", { class: "preview-colors" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "color-dot",
                          style: vue.normalizeStyle({ backgroundColor: theme.colors.primary })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "color-dot",
                          style: vue.normalizeStyle({ backgroundColor: theme.colors.background })
                        },
                        null,
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "color-dot",
                          style: vue.normalizeStyle({ backgroundColor: theme.colors.surface })
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "theme-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "theme-name" },
                      vue.toDisplayString(theme.name),
                      1
                      /* TEXT */
                    ),
                    $data.currentThemeId === theme.id ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      class: "theme-status"
                    }, "当前")) : vue.createCommentVNode("v-if", true)
                  ]),
                  $data.currentThemeId === theme.id ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "theme-check"
                  }, [
                    vue.createElementVNode("text", { class: "check-icon" }, "✓")
                  ])) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 操作按钮 "),
          vue.createElementVNode("view", { class: "modal-actions" }, [
            vue.createElementVNode("button", {
              class: "cancel-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "取消"),
            vue.createElementVNode("button", {
              class: "apply-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.applyTheme && $options.applyTheme(...args))
            }, "应用")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const SimpleThemeSwitcher = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-f10fce89"], ["__file", "E:/Vue项目/专高六/1/项目/src/components/common/SimpleThemeSwitcher.vue"]]);
  const _sfc_main$g = {
    components: {
      PaymentPasswordModal,
      SimpleThemeSwitcher
    },
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
        },
        isProcessing: false,
        // 转账处理状态
        transferLimit: 5e4,
        // 默认转账限额
        userBalance: 0,
        // 用户余额
        showPasswordModal: false,
        // 显示交易密码弹窗
        transferAmount: 0,
        // 转账金额
        transferPayee: "",
        // 收款方
        transferDescription: "",
        // 转账说明
        currentTheme: themeManager$1.getCurrentTheme(),
        themeStyles: getThemeStyles()
      };
    },
    mounted() {
      themeManager$1.addThemeListener(this.onThemeChanged);
    },
    beforeDestroy() {
      themeManager$1.removeThemeListener(this.onThemeChanged);
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/transfer/transfer.vue:154", "转账页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        this.getTransferLimit();
        this.getUserBalance();
      } catch (error) {
        formatAppLog("error", "at pages/transfer/transfer.vue:167", "转账页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      // 主题变化回调
      onThemeChanged(theme) {
        this.currentTheme = theme;
        this.themeStyles = getThemeStyles();
      },
      // 切换转账类型
      switchTab(tab) {
        this.currentTab = tab;
      },
      // 获取转账限额
      getTransferLimit() {
        setTimeout(() => {
          const savedLimit = uni.getStorageSync("transferLimit");
          if (savedLimit) {
            this.transferLimit = savedLimit;
          }
          formatAppLog("log", "at pages/transfer/transfer.vue:196", "转账限额:", this.transferLimit);
        }, 300);
      },
      // 获取用户余额
      async getUserBalance() {
        try {
          const balance = await getUserBalance();
          this.userBalance = balance;
          formatAppLog("log", "at pages/transfer/transfer.vue:205", "获取用户余额成功:", balance);
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:207", "获取用户余额失败:", error);
          this.userBalance = 0;
        }
      },
      // 验证转账金额
      async validateAmount(amount) {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          uni.showToast({
            title: "请输入有效的转账金额",
            icon: "none"
          });
          return false;
        }
        if (numAmount > this.transferLimit) {
          uni.showToast({
            title: `转账金额不能超过${this.transferLimit}元`,
            icon: "none"
          });
          return false;
        }
        try {
          const isSufficient = await checkBalanceSufficient(numAmount);
          if (!isSufficient) {
            uni.showToast({
              title: "余额不足，请检查账户余额",
              icon: "none"
            });
            return false;
          }
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:245", "检查余额失败:", error);
          uni.showToast({
            title: "检查余额失败，请重试",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      // 提交转账
      async submitTransfer() {
        this.isProcessing = true;
        try {
          if (this.currentTab === "account") {
            if (!this.accountForm.account || !this.accountForm.name || !this.accountForm.amount) {
              uni.showToast({
                title: "请填写完整信息",
                icon: "none"
              });
              this.isProcessing = false;
              return;
            }
            const isValidAmount = await this.validateAmount(this.accountForm.amount);
            if (!isValidAmount) {
              this.isProcessing = false;
              return;
            }
            this.transferAmount = parseFloat(this.accountForm.amount);
            this.transferPayee = this.accountForm.name;
            this.transferDescription = `向账号${this.accountForm.account}转账`;
            this.showPasswordModal = true;
          } else {
            if (!this.phoneForm.phone || !this.phoneForm.amount) {
              uni.showToast({
                title: "请填写完整信息",
                icon: "none"
              });
              this.isProcessing = false;
              return;
            }
            const isValidAmount = await this.validateAmount(this.phoneForm.amount);
            if (!isValidAmount) {
              this.isProcessing = false;
              return;
            }
            this.transferAmount = parseFloat(this.phoneForm.amount);
            this.transferPayee = this.phoneForm.phone;
            this.transferDescription = `向手机号${this.phoneForm.phone}转账`;
            this.showPasswordModal = true;
          }
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:308", "转账过程中出错:", error);
          uni.showToast({
            title: "转账失败，请重试",
            icon: "none"
          });
          this.isProcessing = false;
        }
      },
      // 验证收款人信息
      async verifyPayeeInfo(account, name) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          formatAppLog("log", "at pages/transfer/transfer.vue:327", "收款人信息验证成功");
          await this.processAccountTransfer();
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:332", "验证收款人信息失败:", error);
          uni.showToast({
            title: "收款人信息验证失败",
            icon: "none"
          });
          this.isProcessing = false;
        }
      },
      // 处理账号转账
      async processAccountTransfer() {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const transferInfo = {
            account: this.accountForm.account,
            name: this.accountForm.name,
            amount: parseFloat(this.accountForm.amount),
            remark: this.accountForm.remark,
            timestamp: (/* @__PURE__ */ new Date()).getTime()
          };
          this.updateUserBalance(parseFloat(this.accountForm.amount));
          this.saveTransferRecord({
            type: "account",
            ...transferInfo,
            status: "success",
            transactionId: "TX" + Date.now() + Math.random().toString(36).substr(2, 9)
          });
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
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:384", "账号转账失败:", error);
          this.saveTransferRecord({
            type: "account",
            account: this.accountForm.account,
            name: this.accountForm.name,
            amount: parseFloat(this.accountForm.amount),
            remark: this.accountForm.remark,
            timestamp: (/* @__PURE__ */ new Date()).getTime(),
            status: "failed",
            errorMsg: "转账失败，请重试",
            transactionId: "TX" + Date.now() + Math.random().toString(36).substr(2, 9)
          });
          uni.showToast({
            title: "转账失败，请重试",
            icon: "none"
          });
        } finally {
          this.isProcessing = false;
        }
      },
      // 处理手机号转账
      async processPhoneTransfer() {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const transferInfo = {
            phone: this.phoneForm.phone,
            amount: parseFloat(this.phoneForm.amount),
            remark: this.phoneForm.remark,
            timestamp: (/* @__PURE__ */ new Date()).getTime()
          };
          this.updateUserBalance(parseFloat(this.phoneForm.amount));
          this.saveTransferRecord({
            type: "phone",
            ...transferInfo,
            status: "success",
            transactionId: "TX" + Date.now() + Math.random().toString(36).substr(2, 9)
          });
          uni.showToast({
            title: "转账成功",
            icon: "success"
          });
          this.phoneForm = {
            phone: "",
            amount: "",
            remark: ""
          };
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:448", "手机号转账失败:", error);
          this.saveTransferRecord({
            type: "phone",
            phone: this.phoneForm.phone,
            amount: parseFloat(this.phoneForm.amount),
            remark: this.phoneForm.remark,
            timestamp: (/* @__PURE__ */ new Date()).getTime(),
            status: "failed",
            errorMsg: "转账失败，请重试",
            transactionId: "TX" + Date.now() + Math.random().toString(36).substr(2, 9)
          });
          uni.showToast({
            title: "转账失败，请重试",
            icon: "none"
          });
        } finally {
          this.isProcessing = false;
        }
      },
      // 更新用户余额
      updateUserBalance(amount) {
        this.userBalance -= amount;
        uni.setStorageSync("userBalance", this.userBalance);
      },
      // 保存转账记录
      saveTransferRecord(record) {
        try {
          const records = uni.getStorageSync("transferRecords") || [];
          records.unshift(record);
          if (records.length > 100) {
            records.splice(100);
          }
          uni.setStorageSync("transferRecords", records);
          formatAppLog("log", "at pages/transfer/transfer.vue:490", "转账记录已保存");
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:492", "保存转账记录失败:", error);
        }
      },
      // 跳转到转账记录
      goToTransferHistory() {
        uni.navigateTo({
          url: "/pages/transfer/history"
          // 假设我们创建了这个页面
        });
      },
      // 跳转到转账设置
      goToTransferSettings() {
        uni.showToast({
          title: "跳转到转账设置页面",
          icon: "none"
        });
      },
      // 交易密码验证成功
      async onPaymentConfirmed(paymentData) {
        try {
          this.isProcessing = true;
          const deductResult = await deductBalance(
            this.transferAmount,
            this.transferDescription
          );
          if (!deductResult.success) {
            uni.showToast({
              title: deductResult.message,
              icon: "none"
            });
            this.isProcessing = false;
            return;
          }
          this.userBalance = deductResult.newBalance;
          if (this.currentTab === "account") {
            await this.processAccountTransfer();
          } else {
            await this.processPhoneTransfer();
          }
          this.isProcessing = false;
          this.closePasswordModal();
          uni.showToast({
            title: `转账成功，余额：¥${deductResult.newBalance.toFixed(2)}`,
            icon: "success",
            duration: 3e3
          });
          this.clearForms();
        } catch (error) {
          formatAppLog("error", "at pages/transfer/transfer.vue:558", "转账处理失败:", error);
          this.isProcessing = false;
          uni.showToast({
            title: "转账失败，请重试",
            icon: "none"
          });
        }
      },
      // 关闭交易密码弹窗
      closePasswordModal() {
        this.showPasswordModal = false;
        this.isProcessing = false;
      },
      // 清空表单
      clearForms() {
        this.accountForm = {
          account: "",
          name: "",
          amount: "",
          remark: ""
        };
        this.phoneForm = {
          phone: "",
          amount: "",
          remark: ""
        };
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_SimpleThemeSwitcher = vue.resolveComponent("SimpleThemeSwitcher");
    const _component_PaymentPasswordModal = vue.resolveComponent("PaymentPasswordModal");
    return vue.openBlock(), vue.createElementBlock("view", { class: "transfer-page" }, [
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode(
        "view",
        {
          class: "nav-bar",
          style: vue.normalizeStyle($data.themeStyles.primaryGradient)
        },
        [
          vue.createElementVNode("text", { class: "nav-title" }, "转账"),
          vue.createElementVNode("view", { class: "nav-actions" }, [
            vue.createVNode(_component_SimpleThemeSwitcher)
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 账户余额显示 "),
      vue.createElementVNode(
        "view",
        {
          class: "balance-card",
          style: vue.normalizeStyle($data.themeStyles.primaryGradient)
        },
        [
          vue.createElementVNode("view", { class: "balance-info" }, [
            vue.createElementVNode("text", { class: "balance-label" }, "账户余额"),
            vue.createElementVNode(
              "text",
              { class: "balance-amount" },
              "¥" + vue.toDisplayString($data.userBalance.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "balance-tip" }, [
            vue.createElementVNode(
              "text",
              { class: "tip-text" },
              "单笔转账限额：¥" + vue.toDisplayString($data.transferLimit.toLocaleString()),
              1
              /* TEXT */
            )
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 转账类型选择 "),
      vue.createElementVNode(
        "view",
        {
          class: "transfer-types",
          style: vue.normalizeStyle($data.themeStyles.surface)
        },
        [
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
        ],
        4
        /* STYLE */
      ),
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
          onClick: _cache[9] || (_cache[9] = (...args) => $options.submitTransfer && $options.submitTransfer(...args)),
          disabled: $data.isProcessing
        }, vue.toDisplayString($data.isProcessing ? "处理中..." : "确认转账"), 9, ["disabled"])
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
      ]),
      vue.createCommentVNode(" 交易密码验证弹窗 "),
      vue.createVNode(_component_PaymentPasswordModal, {
        visible: $data.showPasswordModal,
        amount: $data.transferAmount,
        payee: $data.transferPayee,
        description: $data.transferDescription,
        onPaymentConfirmed: $options.onPaymentConfirmed,
        onClose: $options.closePasswordModal
      }, null, 8, ["visible", "amount", "payee", "description", "onPaymentConfirmed", "onClose"])
    ]);
  }
  const PagesTransferTransfer = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-d303ad3d"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/transfer/transfer.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        isLoginNeeded: false,
        // 添加登录提示标志
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
        },
        userBalance: 1e5
        // 模拟用户余额
      };
    },
    // 在onLoad方法中添加调试信息
    onLoad() {
      this.checkLoginStatus();
      if (!this.isLoginNeeded) {
        this.checkVerificationStatus();
        this.checkBankCardStatus();
        formatAppLog("log", "at pages/account/account.vue:151", "账户页面初始化 - 认证状态:", this.isVerified);
        formatAppLog("log", "at pages/account/account.vue:152", "账户页面初始化 - 银行卡状态:", this.hasBankCard);
      }
    },
    onShow() {
      this.checkLoginStatus();
      this.getUserBalance();
    },
    // 检查登录状态
    // 在methods对象中添加缺失的getUserBalance方法
    methods: {
      // ... 现有代码 ...
      // 检查登录状态
      checkLoginStatus() {
        try {
          if (!forceCheckLogin()) {
            formatAppLog("log", "at pages/account/account.vue:175", "账户页面：用户未登录，显示登录提示");
            this.isLoginNeeded = true;
            return;
          }
          this.isLoginNeeded = false;
          formatAppLog("log", "at pages/account/account.vue:181", "账户页面显示");
        } catch (error) {
          formatAppLog("error", "at pages/account/account.vue:183", "账户页面登录检查失败:", error);
          this.isLoginNeeded = true;
        }
      },
      // 新增：获取用户余额的方法
      getUserBalance() {
        try {
          const savedBalance = uni.getStorageSync("userBalance");
          if (savedBalance) {
            this.accountInfo.balance = savedBalance;
            return;
          }
          formatAppLog("log", "at pages/account/account.vue:201", "使用默认模拟余额:", this.accountInfo.balance);
        } catch (error) {
          formatAppLog("error", "at pages/account/account.vue:203", "获取用户余额失败:", error);
        }
      },
      // 跳转到登录页面
      goToLogin() {
        const currentPath = getCurrentPages()[getCurrentPages().length - 1].route;
        uni.setStorageSync("redirectUrl", `/${currentPath}`);
        uni.navigateTo({
          url: "/pages/denglu/login"
        });
      },
      // 检查实名认证状态
      // 检查实名认证状态
      checkVerificationStatus() {
        const verified = uni.getStorageSync("userVerified");
        if (verified === false) {
          this.isVerified = false;
        }
      },
      // 检查银行卡绑定状态
      checkBankCardStatus() {
        const hasCard = uni.getStorageSync("hasBankCard");
        if (hasCard === false) {
          this.hasBankCard = false;
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
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "account-page" }, [
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", { class: "nav-title" }, "我的账户")
      ]),
      vue.createCommentVNode(" 登录提示区域 "),
      $data.isLoginNeeded ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "login-prompt"
      }, [
        vue.createElementVNode("view", { class: "login-icon" }, "🔐"),
        vue.createElementVNode("text", { class: "login-text" }, "请先登录"),
        vue.createElementVNode("button", {
          class: "login-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
        }, "去登录")
      ])) : !$data.isVerified ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 未实名认证页面 "),
          vue.createElementVNode("view", { class: "verify-section" }, [
            vue.createElementVNode("view", { class: "verify-icon" }, "🔍"),
            vue.createElementVNode("text", { class: "verify-title" }, "请完成实名认证"),
            vue.createElementVNode("text", { class: "verify-desc" }, "完成实名认证后可享受更多金融服务"),
            vue.createElementVNode("button", {
              class: "verify-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goToVerify && $options.goToVerify(...args))
            }, "去认证"),
            vue.createElementVNode("view", { class: "verify-form" }, [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "姓名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    placeholder: "请输入真实姓名",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.verifyInfo.name = $event)
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
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.verifyInfo.idCard = $event),
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
                onClick: _cache[4] || (_cache[4] = (...args) => $options.submitVerify && $options.submitVerify(...args))
              }, "提交认证")
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : $data.isVerified && !$data.hasBankCard ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        [
          vue.createCommentVNode(" 未绑定银行卡页面 "),
          vue.createElementVNode("view", { class: "bankcard-section" }, [
            vue.createElementVNode("view", { class: "bankcard-icon" }, "💳"),
            vue.createElementVNode("text", { class: "bankcard-title" }, "请绑定银行卡"),
            vue.createElementVNode("text", { class: "bankcard-desc" }, "绑定银行卡后可进行存取款和转账等操作"),
            vue.createElementVNode("button", {
              class: "bankcard-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.addBankCard && $options.addBankCard(...args))
            }, "添加银行卡"),
            vue.createElementVNode("view", { class: "card-form" }, [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "银行卡号"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    placeholder: "请输入银行卡号",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.cardInfo.cardNumber = $event)
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
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.cardInfo.bankName = $event)
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
                onClick: _cache[8] || (_cache[8] = (...args) => $options.submitBankCard && $options.submitBankCard(...args))
              }, "提交绑定")
            ])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 3 },
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
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.showWithdraw && $options.showWithdraw(...args))
                }, "取款"),
                vue.createElementVNode("button", {
                  class: "action-btn",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.showDeposit && $options.showDeposit(...args))
                }, "存款")
              ])
            ]),
            vue.createCommentVNode(" 功能菜单 "),
            vue.createElementVNode("view", { class: "account-functions" }, [
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.goToTransfer && $options.goToTransfer(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "↔️"),
                  vue.createElementVNode("text", { class: "function-text" }, "转账")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.goToPayment && $options.goToPayment(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💸"),
                  vue.createElementVNode("text", { class: "function-text" }, "付款")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[13] || (_cache[13] = (...args) => $options.goToReceive && $options.goToReceive(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📲"),
                  vue.createElementVNode("text", { class: "function-text" }, "收款")
                ])
              ]),
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.goToCreditCard && $options.goToCreditCard(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💳"),
                  vue.createElementVNode("text", { class: "function-text" }, "信用卡还款")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[15] || (_cache[15] = (...args) => $options.goToWealth && $options.goToWealth(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "💰"),
                  vue.createElementVNode("text", { class: "function-text" }, "理财通")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[16] || (_cache[16] = (...args) => $options.goToTopup && $options.goToTopup(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📱"),
                  vue.createElementVNode("text", { class: "function-text" }, "手机充值")
                ])
              ]),
              vue.createElementVNode("view", { class: "function-row" }, [
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[17] || (_cache[17] = (...args) => $options.goToBill && $options.goToBill(...args))
                }, [
                  vue.createElementVNode("view", { class: "function-icon" }, "📊"),
                  vue.createElementVNode("text", { class: "function-text" }, "生活缴费")
                ]),
                vue.createElementVNode("view", {
                  class: "function-item",
                  onClick: _cache[18] || (_cache[18] = (...args) => $options.goToDonation && $options.goToDonation(...args))
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
  const PagesAccountAccount = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-f7e9057f"], ["__file", "D:/项目/yihangyidon/src/pages/account/account.vue"]]);
  const mobileRecharge = (rechargeInfo) => {
    return http.post("/life/recharge", rechargeInfo);
  };
  const getPaymentHistory = (params) => {
    return http.get("/life/payment-history", params);
  };
  const _sfc_main$d = {
    name: "PaymentPage",
    data() {
      return {
        // 第一行服务项目
        firstRowItems: [
          {
            icon: "💧",
            label: "水费",
            bgColor: "linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)",
            type: "water"
          },
          {
            icon: "💡",
            label: "电费",
            bgColor: "linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)",
            type: "electric"
          },
          {
            icon: "🔥",
            label: "燃气费",
            bgColor: "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
            type: "gas"
          }
        ],
        // 第二行服务项目
        secondRowItems: [
          {
            icon: "🏠",
            label: "供暖费",
            bgColor: "linear-gradient(135deg, #A1887F 0%, #8D6E63 100%)",
            type: "heating"
          },
          {
            icon: "📺",
            label: "有线电视费",
            bgColor: "linear-gradient(135deg, #9575CD 0%, #7E57C2 100%)",
            type: "tv"
          },
          {
            icon: "📦",
            label: "物业费",
            bgColor: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)",
            type: "property"
          }
        ],
        // 底部导航
        bottomNavs: [
          { icon: "☭", text: "党费", class: "party-nav" },
          { icon: "💰", text: "工会费", class: "union-nav" },
          { icon: "💬", text: "更多", class: "more-nav" }
        ],
        // 我的缴费数据
        myPayments: [
          {
            type: "party",
            title: "党费",
            number: "410******",
            lastDigits: "5030"
          },
          {
            type: "phone",
            title: "手机充值",
            number: "15703724132",
            amount: "50元"
          }
        ]
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/payment/payment.vue:198", "生活缴费页面加载");
    },
    methods: {
      // 处理卡片点击
      handleCardTap(type) {
        formatAppLog("log", "at pages/payment/payment.vue:204", "点击卡片:", type);
        switch (type) {
          case "party":
            uni.showToast({
              title: "跳转到党费缴费",
              icon: "none"
            });
            break;
          case "phone":
            uni.showToast({
              title: "跳转到手机充值",
              icon: "none"
            });
            break;
        }
      },
      // 处理优惠横幅点击
      handlePromotionTap() {
        formatAppLog("log", "at pages/payment/payment.vue:228", "点击优惠横幅");
        uni.showToast({
          title: "查看优惠详情",
          icon: "none"
        });
      },
      // 处理服务项目点击
      handleServiceTap(item) {
        formatAppLog("log", "at pages/payment/payment.vue:237", "点击服务:", item);
        switch (item.type) {
          case "water":
            this.goToWaterPage();
            break;
          case "electric":
            this.showPaymentForm("电费", item);
            break;
          case "gas":
            this.showPaymentForm("燃气费", item);
            break;
          case "heating":
            this.showPaymentForm("供暖费", item);
            break;
          case "tv":
            this.showPaymentForm("有线电视费", item);
            break;
          case "property":
            this.showPaymentForm("物业费", item);
            break;
          default:
            uni.showToast({
              title: `${item.label}功能开发中`,
              icon: "none"
            });
        }
      },
      // 显示缴费表单
      showPaymentForm(title, item) {
        uni.showModal({
          title: `${title}缴费`,
          content: `即将打开${title}缴费页面，请输入相关信息进行缴费。`,
          confirmText: "确定",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              this.openPaymentForm(item);
            }
          }
        });
      },
      // 打开缴费表单页面
      openPaymentForm(item) {
        this.showPaymentDialog(item);
      },
      // 显示缴费对话框
      showPaymentDialog(item) {
        uni.showModal({
          title: `${item.label}缴费`,
          editable: true,
          placeholderText: "请输入户号或账号",
          success: (res) => {
            if (res.confirm && res.content) {
              this.processPayment(item, res.content);
            }
          }
        });
      },
      // 处理缴费
      processPayment(item, accountNumber) {
        uni.showLoading({
          title: "查询中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showModal({
            title: "缴费查询",
            content: `${item.label}
账号: ${accountNumber}
待缴费用: ¥${this.getRandomAmount(
              item
            )}元

是否立即缴费？`,
            confirmText: "立即缴费",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                this.completePay(item, accountNumber);
              }
            }
          });
        }, 1500);
      },
      // 完成缴费
      completePay(item, accountNumber) {
        uni.showLoading({
          title: "缴费中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "缴费成功",
            icon: "success",
            duration: 2e3
          });
          formatAppLog("log", "at pages/payment/payment.vue:347", `${item.label}缴费成功，账号: ${accountNumber}`);
        }, 2e3);
      },
      // 跳转到水费页面
      goToWaterPage() {
        formatAppLog("log", "at pages/payment/payment.vue:353", "跳转到水费页面");
        uni.navigateTo({
          url: "/pages/water/water",
          success: () => {
            formatAppLog("log", "at pages/payment/payment.vue:357", "成功跳转到水费页面");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/payment/payment.vue:360", "跳转失败:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      },
      // 生成随机金额（模拟数据）
      getRandomAmount(item) {
        const amounts = {
          water: [45, 67, 89, 123, 156],
          electric: [89, 134, 178, 234, 289],
          gas: [67, 89, 112, 145, 178],
          heating: [234, 456, 678, 890, 1200],
          tv: [25, 30, 35, 40, 50],
          property: [180, 220, 280, 350, 420]
        };
        const typeAmounts = amounts[item.type] || [50, 100, 150, 200, 250];
        return typeAmounts[Math.floor(Math.random() * typeAmounts.length)];
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "payment-page" }, [
      vue.createCommentVNode(" 位置选择 "),
      vue.createElementVNode("view", { class: "location-section" }, [
        vue.createElementVNode("view", { class: "location-bar" }, [
          vue.createElementVNode("view", { class: "location-info" }, [
            vue.createElementVNode("text", { class: "location-icon" }, "📍"),
            vue.createElementVNode("text", { class: "location-text" }, "保定市")
          ]),
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
            vue.createElementVNode("input", {
              class: "search-input",
              placeholder: "请输入关键字搜索"
            })
          ])
        ])
      ]),
      vue.createCommentVNode(" 我的缴费 "),
      vue.createElementVNode("view", { class: "my-payment-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "我的缴费"),
          vue.createElementVNode("view", { class: "section-right" }, [
            vue.createElementVNode("text", { class: "manage-text" }, "缴费管理"),
            vue.createElementVNode("text", { class: "arrow" }, "→")
          ])
        ]),
        vue.createElementVNode("view", { class: "payment-cards" }, [
          vue.createCommentVNode(" 党费卡片 "),
          vue.createElementVNode("view", {
            class: "payment-card party-card",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.handleCardTap("party"))
          }, [
            vue.createElementVNode("view", { class: "card-left" }, [
              vue.createElementVNode("view", { class: "card-icon party-icon" }, [
                vue.createElementVNode("text", { class: "party-symbol" }, "☭")
              ]),
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createElementVNode("text", { class: "card-title" }, "党费"),
                vue.createElementVNode("text", { class: "card-subtitle" }, "自己 | ★手机 | 410******"),
                vue.createElementVNode("text", { class: "card-number" }, "*****5030")
              ])
            ])
          ]),
          vue.createCommentVNode(" 手机充值卡片 "),
          vue.createElementVNode("view", {
            class: "payment-card phone-card",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.handleCardTap("phone"))
          }, [
            vue.createElementVNode("view", { class: "card-left" }, [
              vue.createElementVNode("view", { class: "card-icon phone-icon" }, [
                vue.createElementVNode("text", { class: "phone-symbol" }, "📱")
              ]),
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createElementVNode("text", { class: "card-title" }, "手机充值"),
                vue.createElementVNode("text", { class: "card-subtitle" }, "常用缴费 | 15703724132 |"),
                vue.createElementVNode("text", { class: "card-number" }, "50元")
              ])
            ]),
            vue.createElementVNode("view", { class: "card-right" }, [
              vue.createElementVNode("view", { class: "recharge-icon" }, "💳")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 优惠活动横幅 "),
      vue.createElementVNode("view", {
        class: "promotion-banner",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handlePromotionTap && $options.handlePromotionTap(...args))
      }, [
        vue.createElementVNode("view", { class: "banner-content" }, [
          vue.createElementVNode("text", { class: "banner-title" }, "生活缴费先领券"),
          vue.createElementVNode("text", { class: "banner-subtitle" }, "信用卡支付享返现优惠"),
          vue.createElementVNode("text", { class: "banner-tag" }, "广告")
        ]),
        vue.createElementVNode("view", { class: "banner-decoration" }, [
          vue.createElementVNode("view", { class: "frog-icon" }, "🐸"),
          vue.createElementVNode("view", { class: "cards-icon" }, "💳")
        ])
      ]),
      vue.createCommentVNode(" 新增缴费 "),
      vue.createElementVNode("view", { class: "new-payment-section" }, [
        vue.createElementVNode("text", { class: "section-title" }, "新增缴费"),
        vue.createElementVNode("view", { class: "payment-grid" }, [
          vue.createCommentVNode(" 第一行 "),
          vue.createElementVNode("view", { class: "grid-row" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.firstRowItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "grid-item",
                  key: index,
                  onClick: ($event) => $options.handleServiceTap(item)
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "item-icon",
                      style: vue.normalizeStyle({ background: item.bgColor })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        { class: "icon-text" },
                        vue.toDisplayString(item.icon),
                        1
                        /* TEXT */
                      )
                    ],
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "item-label" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 第二行 "),
          vue.createElementVNode("view", { class: "grid-row" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.secondRowItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "grid-item",
                  key: index,
                  onClick: ($event) => $options.handleServiceTap(item)
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "item-icon",
                      style: vue.normalizeStyle({ background: item.bgColor })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        { class: "icon-text" },
                        vue.toDisplayString(item.icon),
                        1
                        /* TEXT */
                      )
                    ],
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "item-label" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ]),
      vue.createCommentVNode(" 底部导航占位 "),
      vue.createElementVNode("view", { class: "bottom-nav-placeholder" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.bottomNavs, (nav, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "nav-item",
              key: index
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["nav-item-icon", nav.class])
                },
                vue.toDisplayString(nav.icon),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode(
                "text",
                { class: "nav-item-text" },
                vue.toDisplayString(nav.text),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesPaymentPayment = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-6e0fac4f"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/payment/payment.vue"]]);
  const _sfc_main$d = {
    name: "WaterPage",
    data() {
      return {
        searchKeyword: "",
        isExpanded: false,
        allCompanies: [
          {
            id: 1,
            name: "保定市荣投水务有限公司",
            desc: "水费",
            area: "保定市",
            type: "municipal"
          },
          {
            id: 2,
            name: "保定徐水智享物业管理有限公司",
            desc: "徐水凯郡丽城小区水费",
            area: "徐水区",
            type: "property"
          },
          {
            id: 3,
            name: "定兴县自来水公司",
            desc: "水费",
            area: "定兴县",
            type: "municipal"
          },
          {
            id: 4,
            name: "定州市东亭物业服务有限公司",
            desc: "东亭水电费-金城颂园",
            area: "定州市",
            type: "property"
          },
          {
            id: 5,
            name: "定州市东亭物业服务有限公司",
            desc: "东亭水电费-宝塔花园",
            area: "定州市",
            type: "property"
          },
          {
            id: 6,
            name: "涿州市供水有限公司",
            desc: "水费",
            area: "涿州市",
            type: "municipal"
          },
          {
            id: 7,
            name: "高碑店市自来水公司",
            desc: "水费",
            area: "高碑店市",
            type: "municipal"
          },
          {
            id: 8,
            name: "安国市自来水公司",
            desc: "水费",
            area: "安国市",
            type: "municipal"
          },
          {
            id: 9,
            name: "易县自来水公司",
            desc: "水费",
            area: "易县",
            type: "municipal"
          },
          {
            id: 10,
            name: "曲阳县自来水公司",
            desc: "水费",
            area: "曲阳县",
            type: "municipal"
          }
        ]
      };
    },
    computed: {
      // 过滤后的公司列表
      filteredCompanies() {
        let companies = this.allCompanies;
        if (this.searchKeyword.trim()) {
          companies = companies.filter(
            (company) => company.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || company.desc.toLowerCase().includes(this.searchKeyword.toLowerCase()) || company.area.toLowerCase().includes(this.searchKeyword.toLowerCase())
          );
        }
        if (!this.isExpanded && !this.searchKeyword) {
          return companies.slice(0, 5);
        }
        return companies;
      },
      // 是否有更多数据
      hasMore() {
        return !this.searchKeyword && this.allCompanies.length > 5;
      }
    },
    onLoad() {
      formatAppLog("log", "at pages/water/water.vue:180", "水费区域选择页面加载");
    },
    methods: {
      // 处理搜索
      handleSearch(e) {
        this.searchKeyword = e.detail.value;
        formatAppLog("log", "at pages/water/water.vue:187", "搜索关键词:", this.searchKeyword);
      },
      // 切换展开状态
      toggleExpand() {
        this.isExpanded = !this.isExpanded;
        formatAppLog("log", "at pages/water/water.vue:193", "展开状态:", this.isExpanded);
      },
      // 选择水费公司
      selectCompany(company) {
        formatAppLog("log", "at pages/water/water.vue:198", "选择水费公司:", company);
        uni.showModal({
          title: "确认选择",
          content: `您选择了：${company.name}
服务区域：${company.area}
是否继续进行水费缴费？`,
          confirmText: "继续缴费",
          cancelText: "重新选择",
          success: (res) => {
            if (res.confirm) {
              this.proceedToPayment(company);
            }
          }
        });
      },
      // 进入缴费流程
      proceedToPayment(company) {
        formatAppLog("log", "at pages/water/water.vue:216", "进入缴费流程:", company);
        this.showPaymentForm(company);
      },
      // 显示缴费表单
      showPaymentForm(company) {
        uni.showModal({
          title: `${company.name}`,
          content: "请输入您的水费户号",
          editable: true,
          placeholderText: "请输入户号",
          success: (res) => {
            if (res.confirm && res.content) {
              this.processWaterPayment(company, res.content);
            }
          }
        });
      },
      // 处理水费缴费
      processWaterPayment(company, accountNumber) {
        uni.showLoading({
          title: "查询中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          const mockData = this.generateMockWaterBill(company, accountNumber);
          uni.showModal({
            title: "水费查询结果",
            content: `缴费单位：${company.name}
户号：${accountNumber}
用户地址：${mockData.address}
当前欠费：¥${mockData.amount}元
账期：${mockData.period}

是否立即缴费？`,
            confirmText: "立即缴费",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                this.completeWaterPayment(company, accountNumber, mockData);
              }
            }
          });
        }, 1500);
      },
      // 完成水费缴费
      completeWaterPayment(company, accountNumber, billData) {
        uni.showLoading({
          title: "缴费中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showModal({
            title: "缴费成功",
            content: `恭喜您！水费缴费成功

缴费单位：${company.name}
户号：${accountNumber}
缴费金额：¥${billData.amount}元
交易时间：${(/* @__PURE__ */ new Date()).toLocaleString()}

感谢您的使用！`,
            confirmText: "完成",
            showCancel: false,
            success: () => {
              uni.navigateBack({
                delta: 2
                // 返回到缴费主页
              });
            }
          });
        }, 2e3);
      },
      // 生成模拟账单数据
      generateMockWaterBill(company, accountNumber) {
        const amounts = [45.5, 67.8, 89.3, 123.6, 156.2, 78.9, 92.4];
        const addresses = [
          "XX小区1号楼2单元301",
          "XX花园3号楼1单元201",
          "XX家园5号楼3单元401",
          "XX公寓2号楼2单元101",
          "XX新城4号楼1单元501"
        ];
        const currentDate = /* @__PURE__ */ new Date();
        const period = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
        return {
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          address: addresses[Math.floor(Math.random() * addresses.length)],
          period,
          usage: Math.floor(Math.random() * 50) + 10 + "吨"
        };
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "water-page" }, [
      vue.createCommentVNode(" 位置选择 "),
      vue.createElementVNode("view", { class: "location-section" }, [
        vue.createElementVNode("view", { class: "location-bar" }, [
          vue.createElementVNode("view", { class: "location-info" }, [
            vue.createElementVNode("text", { class: "location-icon" }, "📍"),
            vue.createElementVNode("text", { class: "location-text" }, "保定市")
          ]),
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "search-input",
                placeholder: "请输入水费公司名称或小区名称",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKeyword = $event),
                onInput: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.searchKeyword]
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 新增缴费标题 "),
      vue.createElementVNode("view", { class: "section-title-container" }, [
        vue.createElementVNode("text", { class: "section-title" }, "新增缴费")
      ]),
      vue.createCommentVNode(" 水费公司列表 "),
      vue.createElementVNode("view", { class: "company-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($options.filteredCompanies, (company, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "company-item",
              key: index,
              onClick: ($event) => $options.selectCompany(company)
            }, [
              vue.createElementVNode("view", { class: "company-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "company-name" },
                  vue.toDisplayString(company.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "company-desc" },
                  vue.toDisplayString(company.desc),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "company-arrow" }, [
                vue.createElementVNode("text", { class: "arrow-icon" }, "→")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 展开更多按钮 "),
      $options.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "expand-more",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleExpand && $options.toggleExpand(...args))
      }, [
        vue.createElementVNode(
          "text",
          { class: "expand-text" },
          vue.toDisplayString($data.isExpanded ? "收起" : "展开更多"),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "expand-icon" },
          vue.toDisplayString($data.isExpanded ? "↑" : "↓"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 没有搜索结果时显示 "),
      $data.searchKeyword && $options.filteredCompanies.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "no-result"
      }, [
        vue.createElementVNode("text", { class: "no-result-text" }, "未找到相关水费公司"),
        vue.createElementVNode("text", { class: "no-result-desc" }, "请尝试输入其他关键词")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesWaterWater = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-ebd6dd79"], ["__file", "D:/Vue项目/专高六/1/项目/src/pages/water/water.vue"]]);
  const _sfc_main$c = {
    name: "RechargePage",
    data() {
      return {
        activeTab: 0,
        selectedAmount: 50,
        phoneNumber: "15903724152",
        inputPhoneNumber: "",
        showPhoneModal: false,
        carrierInfo: {
          name: "中国移动",
          location: "黑龙江 牡丹江"
        },
        rechargeAmounts: [
          { value: 50, price: 47.77, discount: null, selected: true },
          { value: 100, price: 97.78, discount: null, selected: false },
          { value: 200, price: 197.78, discount: null, selected: false },
          { value: 300, price: 297.78, discount: null, selected: false },
          { value: 500, price: 497.78, discount: null, selected: false },
          { value: 30, price: 29.7, discount: null, selected: false }
        ]
      };
    },
    computed: {
      formattedPhoneNumber() {
        if (!this.phoneNumber)
          return "点击输入手机号";
        return this.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3");
      },
      selectedPrice() {
        const selected = this.rechargeAmounts.find(
          (item) => item.value === this.selectedAmount
        );
        return selected ? selected.price : 0;
      },
      canRecharge() {
        return this.phoneNumber && this.phoneNumber.length === 11 && this.selectedAmount > 0;
      },
      isValidPhone() {
        return this.inputPhoneNumber && this.inputPhoneNumber.length === 11;
      }
    },
    onLoad(options) {
      this.initPage();
      if (options.phone) {
        this.phoneNumber = options.phone;
        this.getCarrierInfo();
      }
    },
    onShow() {
      try {
        if (!forceCheckLogin()) {
          formatAppLog("log", "at pages/recharge/recharge.vue:189", "手机充值页面：用户未登录，跳转到登录页面");
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
          return;
        }
        formatAppLog("log", "at pages/recharge/recharge.vue:195", "手机充值页面显示");
      } catch (error) {
        formatAppLog("error", "at pages/recharge/recharge.vue:197", "手机充值页面onShow检查失败:", error);
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
      }
    },
    methods: {
      initPage() {
        formatAppLog("log", "at pages/recharge/recharge.vue:206", "手机充值页面初始化");
        if (!this.phoneNumber) {
          this.showPhoneModal = true;
        }
      },
      switchTab(index) {
        this.activeTab = index;
        formatAppLog("log", "at pages/recharge/recharge.vue:215", "切换到标签:", index === 0 ? "充话费" : "自动充值");
      },
      selectAmount(amount) {
        this.selectedAmount = amount.value;
        formatAppLog("log", "at pages/recharge/recharge.vue:220", "选择充值金额:", amount);
      },
      selectFromContacts() {
        this.showPhoneModal = true;
      },
      hidePhoneModal() {
        this.showPhoneModal = false;
        this.inputPhoneNumber = "";
      },
      onPhoneInput() {
        this.inputPhoneNumber = this.inputPhoneNumber.replace(/\D/g, "").substring(0, 11);
      },
      confirmPhone() {
        if (this.isValidPhone) {
          this.phoneNumber = this.inputPhoneNumber;
          this.getCarrierInfo();
          this.hidePhoneModal();
        }
      },
      getCarrierInfo() {
        if (this.phoneNumber.length !== 11)
          return;
        const prefix = this.phoneNumber.substring(0, 3);
        let carrier = "";
        if ([
          "130",
          "131",
          "132",
          "155",
          "156",
          "166",
          "167",
          "185",
          "186"
        ].includes(prefix)) {
          carrier = "中国联通";
        } else if ([
          "134",
          "135",
          "136",
          "137",
          "138",
          "139",
          "147",
          "150",
          "151",
          "152",
          "157",
          "158",
          "159",
          "178",
          "182",
          "183",
          "184",
          "187",
          "188",
          "198"
        ].includes(prefix)) {
          carrier = "中国移动";
        } else if ([
          "133",
          "149",
          "153",
          "173",
          "177",
          "180",
          "181",
          "189",
          "199"
        ].includes(prefix)) {
          carrier = "中国电信";
        } else {
          carrier = "未知运营商";
        }
        this.carrierInfo = {
          name: carrier,
          location: "黑龙江 牡丹江"
        };
      },
      async handleRecharge() {
        if (!this.canRecharge) {
          uni.showToast({
            title: "请检查手机号码和充值金额",
            icon: "none"
          });
          return;
        }
        try {
          uni.showLoading({ title: "充值中..." });
          await new Promise((resolve) => setTimeout(resolve, 2e3));
          uni.hideLoading();
          uni.showToast({
            title: "充值成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (error) {
          uni.hideLoading();
          uni.showToast({
            title: "充值失败，请稍后重试",
            icon: "none"
          });
          formatAppLog("error", "at pages/recharge/recharge.vue:347", "充值失败:", error);
        }
      },
      goToStream() {
        uni.showToast({
          title: "国内流量功能开发中",
          icon: "none"
        });
      },
      goToFaq() {
        uni.showToast({
          title: "常见问题功能开发中",
          icon: "none"
        });
      },
      goToRecord() {
        uni.showToast({
          title: "充值记录功能开发中",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "recharge-page" }, [
      vue.createCommentVNode(" 手机号码区域 "),
      vue.createElementVNode("view", { class: "phone-section" }, [
        vue.createElementVNode("view", { class: "phone-display" }, [
          vue.createElementVNode(
            "text",
            { class: "phone-number" },
            vue.toDisplayString($options.formattedPhoneNumber),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", {
            class: "contact-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.selectFromContacts && $options.selectFromContacts(...args))
          }, [
            vue.createElementVNode("text", { class: "contact-icon" }, "👤")
          ])
        ]),
        $data.carrierInfo.name ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "carrier-info"
        }, [
          vue.createElementVNode(
            "text",
            { class: "carrier-text" },
            vue.toDisplayString($data.carrierInfo.name),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 充值类型选项卡 "),
      vue.createElementVNode("view", { class: "recharge-tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === 0 }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab(0))
          },
          [
            vue.createElementVNode("text", { class: "tab-text" }, "充话费"),
            $data.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "tab-underline"
            })) : vue.createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === 1 }]),
            onClick: _cache[2] || (_cache[2] = ($event) => $options.switchTab(1))
          },
          [
            vue.createElementVNode("text", { class: "tab-text" }, "自动充值"),
            $data.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "tab-underline"
            })) : vue.createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 充值金额选择 "),
      vue.createElementVNode("view", { class: "amount-section" }, [
        vue.createElementVNode("view", { class: "amount-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.rechargeAmounts, (amount, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["amount-card", { selected: $data.selectedAmount === amount.value }]),
                key: index,
                onClick: ($event) => $options.selectAmount(amount)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "amount-value" },
                  vue.toDisplayString(amount.value) + "元",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "amount-price" },
                  "售价" + vue.toDisplayString(amount.price) + "元",
                  1
                  /* TEXT */
                ),
                amount.discount ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "discount-badge"
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
      vue.createCommentVNode(" 充值按钮 "),
      vue.createElementVNode("view", { class: "recharge-button-container" }, [
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["recharge-button", { disabled: !$options.canRecharge }]),
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRecharge && $options.handleRecharge(...args)),
          disabled: !$options.canRecharge
        }, " ¥ " + vue.toDisplayString($options.selectedPrice) + " 立即充值 ", 11, ["disabled"])
      ]),
      vue.createCommentVNode(" 温馨提示 "),
      vue.createElementVNode("view", { class: "notice-section" }, [
        vue.createElementVNode("text", { class: "notice-title" }, "温馨提示"),
        vue.createElementVNode("text", { class: "notice-content" }, " 1.手机充值正常30分钟内到账，月初、月末属于充值高峰期时段，到账时间可能延迟，请您耐心等待。 "),
        vue.createElementVNode("text", { class: "notice-content" }, " 2.本服务由充值服务商提供，若不提供月结发票，如需增值税普通发票请联系服务商客服电话：圣科瑞（北京）科技有限公司 4001-8888-52，北京掌乐科技有限公司 010-62764933。 ")
      ]),
      vue.createCommentVNode(" 底部导航 "),
      vue.createElementVNode("view", { class: "bottom-nav" }, [
        vue.createElementVNode("view", {
          class: "nav-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.goToStream && $options.goToStream(...args))
        }, [
          vue.createElementVNode("text", { class: "nav-link" }, "国内流量")
        ]),
        vue.createElementVNode("text", { class: "nav-separator" }, "|"),
        vue.createElementVNode("view", {
          class: "nav-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.goToFaq && $options.goToFaq(...args))
        }, [
          vue.createElementVNode("text", { class: "nav-link" }, "常见问题")
        ]),
        vue.createElementVNode("text", { class: "nav-separator" }, "|"),
        vue.createElementVNode("view", {
          class: "nav-item",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.goToRecord && $options.goToRecord(...args))
        }, [
          vue.createElementVNode("text", { class: "nav-link" }, "充值记录")
        ])
      ]),
      vue.createCommentVNode(" 手机号码输入弹窗 "),
      $data.showPhoneModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "phone-modal",
        onClick: _cache[12] || (_cache[12] = (...args) => $options.hidePhoneModal && $options.hidePhoneModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[11] || (_cache[11] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "输入手机号码"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.hidePhoneModal && $options.hidePhoneModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "phone-input",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.inputPhoneNumber = $event),
                placeholder: "请输入11位手机号码",
                type: "number",
                maxlength: "11",
                onInput: _cache[9] || (_cache[9] = (...args) => $options.onPhoneInput && $options.onPhoneInput(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.inputPhoneNumber]
            ]),
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["confirm-btn", { disabled: !$options.isValidPhone }]),
              onClick: _cache[10] || (_cache[10] = (...args) => $options.confirmPhone && $options.confirmPhone(...args)),
              disabled: !$options.isValidPhone
            }, " 确认 ", 10, ["disabled"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesRechargeRecharge = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-d370def1"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/recharge/recharge.vue"]]);
  const _sfc_main$b = {
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
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesGovernmentGovernment = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-55002ac7"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/government/government.vue"]]);
  const _sfc_main$a = {
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
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesGamesGames = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-5e0e9dd0"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/games/games.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        transferRecords: []
      };
    },
    onShow() {
      if (!forceCheckLogin()) {
        formatAppLog("log", "at pages/transfer/history.vue:46", "转账记录页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login"
        });
        return;
      }
      this.loadTransferRecords();
    },
    methods: {
      // 加载转账记录
      loadTransferRecords() {
        const records = uni.getStorageSync("transferRecords") || [];
        this.transferRecords = records;
        if (this.transferRecords.length === 0) {
          this.createMockRecords();
        }
      },
      // 创建模拟记录（如果没有真实记录）
      createMockRecords() {
        const mockRecords = [
          {
            type: "account",
            account: "6228 **** **** 1234",
            name: "张三",
            amount: 500,
            remark: "饭钱",
            timestamp: Date.now() - 864e5,
            // 昨天
            status: "success",
            transactionId: "TX" + Date.now() + "001"
          },
          {
            type: "phone",
            phone: "138 **** 5678",
            amount: 1e3,
            remark: "房租",
            timestamp: Date.now() - 1728e5,
            // 前天
            status: "success",
            transactionId: "TX" + Date.now() + "002"
          },
          {
            type: "account",
            account: "6228 **** **** 5678",
            name: "李四",
            amount: 200,
            remark: "",
            timestamp: Date.now() - 2592e5,
            // 三天前
            status: "failed",
            errorMsg: "余额不足",
            transactionId: "TX" + Date.now() + "003"
          }
        ];
        this.transferRecords = mockRecords;
        uni.setStorageSync("transferRecords", mockRecords);
      },
      // 获取记录标题
      getRecordTitle(record) {
        if (record.type === "account") {
          return `转账给 ${record.name}`;
        } else {
          return `手机号转账`;
        }
      },
      // 获取记录详情
      getRecordDetail(record) {
        if (record.type === "account") {
          return `账号：${record.account}`;
        } else {
          return `手机号：${record.phone}`;
        }
      },
      // 格式化时间
      formatTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}`;
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "history-page" }, [
      vue.createCommentVNode(" 顶部导航 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", { class: "nav-title" }, "转账记录")
      ]),
      vue.createCommentVNode(" 记录列表 "),
      vue.createElementVNode("view", { class: "history-list" }, [
        $data.transferRecords.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-text" }, "暂无转账记录")
        ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.transferRecords, (record) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "record-item",
                key: record.transactionId
              }, [
                vue.createElementVNode("view", { class: "record-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-title" },
                    vue.toDisplayString($options.getRecordTitle(record)),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["record-status", record.status])
                    },
                    vue.toDisplayString(record.status === "success" ? "成功" : "失败"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "record-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-detail" },
                    vue.toDisplayString($options.getRecordDetail(record)),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "record-amount" },
                    vue.toDisplayString(record.status === "success" ? "-" : "") + vue.toDisplayString(record.amount) + "元",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "record-footer" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-time" },
                    vue.toDisplayString($options.formatTime(record.timestamp)),
                    1
                    /* TEXT */
                  ),
                  record.remark ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "record-remark"
                    },
                    vue.toDisplayString(record.remark),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ])
    ]);
  }
  const PagesTransferHistory = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-c9706b1b"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/transfer/history.vue"]]);
  const formatBankCard = (cardNumber, separator = " ") => {
    if (!cardNumber)
      return "";
    return cardNumber.replace(/\s/g, "").replace(/(.{4})/g, `$1${separator}`).trim();
  };
  const hideBankCard = (cardNumber, showStart = 4, showEnd = 4) => {
    if (!cardNumber)
      return "";
    const card = cardNumber.replace(/\s/g, "");
    if (card.length <= showStart + showEnd)
      return card;
    const start = card.slice(0, showStart);
    const end = card.slice(-showEnd);
    const middle = "*".repeat(card.length - showStart - showEnd);
    return formatBankCard(start + middle + end);
  };
  const _sfc_main$8 = {
    name: "BankCard",
    props: {
      cardInfo: {
        type: Object,
        required: true
      },
      showActions: {
        type: Boolean,
        default: false
      },
      hideCardNumber: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      bankName() {
        return this.cardInfo.bankName || "中国农业银行";
      },
      bankType() {
        return this.cardInfo.bankType || "abc";
      },
      bankLogo() {
        const logos = {
          abc: "/static/banks/abc.png",
          icbc: "/static/banks/icbc.png",
          ccb: "/static/banks/ccb.png",
          boc: "/static/banks/boc.png",
          comm: "/static/banks/comm.png"
        };
        return logos[this.bankType] || logos.abc;
      },
      cardTypeName() {
        const types = {
          debit: "储蓄卡",
          credit: "信用卡"
        };
        return types[this.cardInfo.cardType] || "储蓄卡";
      },
      displayCardNumber() {
        if (!this.cardInfo.cardNumber)
          return "";
        return this.hideCardNumber ? hideBankCard(this.cardInfo.cardNumber) : formatBankCard(this.cardInfo.cardNumber);
      },
      holderName() {
        return this.cardInfo.holderName || "";
      },
      expiryDate() {
        return this.cardInfo.expiryDate || "";
      },
      isDefault() {
        return this.cardInfo.isDefault || false;
      }
    },
    methods: {
      handleCardTap() {
        this.$emit("card-tap", this.cardInfo);
      },
      handleEdit() {
        this.$emit("edit", this.cardInfo);
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这张银行卡吗？",
          success: (res) => {
            if (res.confirm) {
              this.$emit("delete", this.cardInfo);
            }
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["bank-card", [`card-${$options.bankType}`, { "card-default": $options.isDefault }]]),
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handleCardTap && $options.handleCardTap(...args))
      },
      [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("view", { class: "bank-logo" }, [
            vue.createElementVNode("image", {
              src: $options.bankLogo,
              mode: "aspectFit",
              class: "logo-image"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "bank-info" }, [
            vue.createElementVNode(
              "text",
              { class: "bank-name" },
              vue.toDisplayString($options.bankName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "card-type" },
              vue.toDisplayString($options.cardTypeName),
              1
              /* TEXT */
            )
          ]),
          $props.showActions ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "card-actions"
          }, [
            vue.createElementVNode("text", {
              class: "action-btn",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleEdit && $options.handleEdit(...args), ["stop"]))
            }, "编辑"),
            vue.createElementVNode("text", {
              class: "action-btn delete",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.handleDelete && $options.handleDelete(...args), ["stop"]))
            }, "删除")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "card-number" }, [
          vue.createElementVNode(
            "text",
            { class: "number-text" },
            vue.toDisplayString($options.displayCardNumber),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card-footer" }, [
          vue.createElementVNode("view", { class: "card-info" }, [
            vue.createElementVNode("text", { class: "label" }, "持卡人"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($options.holderName),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "card-info" }, [
            vue.createElementVNode("text", { class: "label" }, "有效期"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($options.expiryDate || "--/--"),
              1
              /* TEXT */
            )
          ])
        ]),
        $options.isDefault ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "default-badge"
        }, [
          vue.createElementVNode("text", { class: "badge-text" }, "默认")
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const BankCard = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-2f14f5e9"], ["__file", "E:/Vue项目/专高六/1/项目/src/components/common/BankCard.vue"]]);
  const getCreditCards = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cards = uni.getStorageSync("creditCards") || [
          {
            id: "1",
            cardNumber: "6228481234567890123",
            bankName: "中国农业银行",
            bankType: "abc",
            cardType: "credit",
            holderName: "张三",
            expiryDate: "06/26",
            isDefault: true,
            limit: 3e4,
            used: 12345.67
          }
        ];
        resolve(cards);
      }, 300);
    });
  };
  const _sfc_main$7 = {
    components: {
      BankCard
    },
    data() {
      return {
        creditCards: [],
        hideCardNumber: true,
        billAmount: 0,
        minPayment: 0,
        paidAmount: 0,
        billDate: "每月10日",
        dueDate: "每月28日",
        promotions: [
          {
            id: "1",
            title: "餐饮消费满200减50",
            desc: "指定餐厅刷卡消费享优惠",
            image: "https://thafd.bing.com/th/id/OIP.Qasbo_B7CgQZgQbJZQs43QHaCI?o=7rm=3&rs=1&pid=ImgDetMain",
            endDate: "2024-12-31"
          },
          {
            id: "2",
            title: "周末加油9折优惠",
            desc: "指定加油站刷卡加油享折扣",
            image: "https://thafd.bing.com/th/id/OIP.h5Dnm2eV7jzm2z8-1ig0iAHaDJ?o=7rm=3&rs=1&pid=ImgDetMain",
            endDate: "2024-11-30"
          }
        ]
      };
    },
    onLoad() {
      this.checkLoginStatus();
      this.loadCreditCardInfo();
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        if (!forceCheckLogin()) {
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
        }
      },
      // 加载信用卡信息
      async loadCreditCardInfo() {
        try {
          uni.showLoading({ title: "加载中..." });
          this.creditCards = await getCreditCards();
          this.billAmount = 12345.67;
          this.minPayment = this.billAmount * 0.1;
          this.paidAmount = 5e3;
        } catch (error) {
          uni.showToast({
            title: "加载失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      // 申请信用卡
      applyForCreditCard() {
        uni.showToast({
          title: "前往信用卡申请页面",
          icon: "none"
        });
      },
      // 查看卡片详情
      viewCardDetails(card) {
        this.hideCardNumber = !this.hideCardNumber;
      },
      // 编辑卡片
      editCard(card) {
        uni.showToast({
          title: "编辑卡片信息",
          icon: "none"
        });
      },
      // 删除卡片
      deleteCard(card) {
        const index = this.creditCards.findIndex((item) => item.id === card.id);
        if (index > -1) {
          this.creditCards.splice(index, 1);
          uni.setStorageSync("creditCards", this.creditCards);
          uni.showToast({
            title: "卡片已删除",
            icon: "success"
          });
        }
      },
      // 全额还款
      repayFull() {
        uni.showModal({
          title: "确认还款",
          content: `确定要全额还款 ¥${this.billAmount.toFixed(2)} 吗？`,
          success: (res) => {
            if (res.confirm) {
              this.paidAmount = this.billAmount;
              uni.showToast({
                title: "还款成功",
                icon: "success"
              });
            }
          }
        });
      },
      // 最低还款
      repayMin() {
        uni.showModal({
          title: "确认还款",
          content: `确定要最低还款 ¥${this.minPayment.toFixed(2)} 吗？`,
          success: (res) => {
            if (res.confirm) {
              this.paidAmount += this.minPayment;
              uni.showToast({
                title: "还款成功",
                icon: "success"
              });
            }
          }
        });
      },
      // 查看交易明细
      viewTransactions() {
        uni.navigateTo({
          url: "/pages/balance/balance?type=credit"
        });
      },
      // 现金分期
      applyForCash() {
        uni.showToast({
          title: "前往现金分期页面",
          icon: "none"
        });
      },
      // 账单分期
      creditInstallment() {
        uni.showToast({
          title: "前往账单分期页面",
          icon: "none"
        });
      },
      // 额度管理
      creditLimit() {
        uni.showToast({
          title: "前往额度管理页面",
          icon: "none"
        });
      },
      // 查看所有优惠活动
      viewAllPromotions() {
        uni.showToast({
          title: "查看所有信用卡优惠",
          icon: "none"
        });
      },
      // 查看优惠详情
      viewPromotionDetail(promo) {
        uni.showToast({
          title: `查看${promo.title}详情`,
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BankCard = vue.resolveComponent("BankCard");
    return vue.openBlock(), vue.createElementBlock("view", { class: "credit-card-container" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "信用卡")
      ]),
      vue.createCommentVNode(" 信用卡卡片区域 "),
      vue.createElementVNode("view", { class: "credit-cards" }, [
        $data.creditCards.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no-card-tip"
        }, [
          vue.createElementVNode("text", { class: "tip-icon" }, "💳"),
          vue.createElementVNode("text", { class: "tip-text" }, "您还没有绑定信用卡"),
          vue.createElementVNode("button", {
            class: "apply-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.applyForCreditCard && $options.applyForCreditCard(...args))
          }, "立即申请")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "cards-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.creditCards, (card, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "card-wrapper"
              }, [
                vue.createVNode(_component_BankCard, {
                  cardInfo: card,
                  showActions: true,
                  hideCardNumber: $data.hideCardNumber,
                  onCardTap: ($event) => $options.viewCardDetails(card),
                  onEdit: ($event) => $options.editCard(card),
                  onDelete: ($event) => $options.deleteCard(card)
                }, null, 8, ["cardInfo", "hideCardNumber", "onCardTap", "onEdit", "onDelete"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ]),
      vue.createCommentVNode(" 账单信息 "),
      $data.creditCards.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "bill-section"
      }, [
        vue.createElementVNode("view", { class: "bill-header" }, [
          vue.createElementVNode("text", { class: "bill-title" }, "本期账单"),
          vue.createElementVNode(
            "text",
            { class: "bill-date" },
            "账单日: " + vue.toDisplayString($data.billDate) + " | 还款日: " + vue.toDisplayString($data.dueDate),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "bill-summary" }, [
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "账单金额"),
            vue.createElementVNode(
              "text",
              { class: "summary-value" },
              "¥" + vue.toDisplayString($data.billAmount.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "最低还款"),
            vue.createElementVNode(
              "text",
              { class: "summary-value" },
              "¥" + vue.toDisplayString($data.minPayment.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "已还金额"),
            vue.createElementVNode(
              "text",
              { class: "summary-value" },
              "¥" + vue.toDisplayString($data.paidAmount.toFixed(2)),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "bill-actions" }, [
          vue.createElementVNode("button", {
            class: "action-btn primary",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.repayFull && $options.repayFull(...args))
          }, "全额还款"),
          vue.createElementVNode("button", {
            class: "action-btn secondary",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.repayMin && $options.repayMin(...args))
          }, "最低还款")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 信用卡功能区 "),
      $data.creditCards.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "credit-functions"
      }, [
        vue.createElementVNode("view", { class: "function-grid" }, [
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.viewTransactions && $options.viewTransactions(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon" }, "📝"),
            vue.createElementVNode("text", { class: "function-text" }, "账单明细")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.applyForCash && $options.applyForCash(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon" }, "💸"),
            vue.createElementVNode("text", { class: "function-text" }, "现金分期")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.creditInstallment && $options.creditInstallment(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon" }, "🔄"),
            vue.createElementVNode("text", { class: "function-text" }, "账单分期")
          ]),
          vue.createElementVNode("view", {
            class: "function-item",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.creditLimit && $options.creditLimit(...args))
          }, [
            vue.createElementVNode("view", { class: "function-icon" }, "📊"),
            vue.createElementVNode("text", { class: "function-text" }, "额度管理")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 信用卡优惠活动 "),
      $data.promotions.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "promotions-section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "信用卡优惠"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.viewAllPromotions && $options.viewAllPromotions(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "promotions-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.promotions, (promo, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "promotion-item",
                key: index,
                onClick: ($event) => $options.viewPromotionDetail(promo)
              }, [
                vue.createElementVNode("image", {
                  class: "promo-image",
                  src: promo.image,
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode(
                  "text",
                  { class: "promo-title" },
                  vue.toDisplayString(promo.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "promo-desc" },
                  vue.toDisplayString(promo.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "promo-date" },
                  "有效期至：" + vue.toDisplayString(promo.endDate),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesCreditCardCreditCard = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-03264d9b"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/credit-card/credit-card.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        type: "normal",
        // normal 或 credit
        transactions: [],
        groupedTransactions: {},
        selectedDateRange: "本月",
        selectedType: "全部类型",
        incomeTotal: 0,
        expenseTotal: 0,
        balanceTotal: 0,
        hasMore: true,
        currentPage: 1,
        pageSize: 20
      };
    },
    onLoad(options) {
      this.checkLoginStatus();
      if (options.type === "credit") {
        this.type = "credit";
      }
      this.loadTransactions();
    },
    computed: {},
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        if (!forceCheckLogin()) {
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
        }
      },
      // 加载交易记录
      async loadTransactions() {
        try {
          uni.showLoading({ title: "加载中..." });
          const mockTransactions = this.generateMockTransactions();
          this.transactions = mockTransactions;
          this.groupTransactionsByDate();
          this.calculateSummary();
        } catch (error) {
          uni.showToast({
            title: "加载失败，请稍后重试",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      // 生成模拟交易数据
      generateMockTransactions() {
        const transactions = [];
        const today = /* @__PURE__ */ new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const recordCount = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < recordCount; j++) {
            const isIncome = Math.random() > 0.7;
            const types = this.type === "credit" ? ["餐饮", "购物", "交通", "娱乐", "还款"] : isIncome ? ["工资", "转账", "理财收益", "红包"] : ["餐饮", "购物", "交通", "娱乐", "缴费"];
            const type = types[Math.floor(Math.random() * types.length)];
            const amount = Math.round(Math.random() * 1e3 * (isIncome ? 20 : 1)) / 100;
            let icon = "💰", category = "expense";
            if (isIncome || type === "工资" || type === "转账" || type === "理财收益" || type === "红包") {
              category = "income";
              switch (type) {
                case "工资":
                  icon = "💼";
                  break;
                case "转账":
                  icon = "↔️";
                  break;
                case "理财收益":
                  icon = "📈";
                  break;
                case "红包":
                  icon = "🧧";
                  break;
                default:
                  icon = "💰";
              }
            } else {
              switch (type) {
                case "餐饮":
                  icon = "🍽️";
                  break;
                case "购物":
                  icon = "🛍️";
                  break;
                case "交通":
                  icon = "🚗";
                  break;
                case "娱乐":
                  icon = "🎮";
                  break;
                case "缴费":
                  icon = "💸";
                  break;
                case "还款":
                  icon = "🔄";
                  break;
                default:
                  icon = "💰";
              }
            }
            const hours = Math.floor(Math.random() * 24);
            const minutes = Math.floor(Math.random() * 60);
            const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            transactions.push({
              id: `${i}-${j}`,
              title: type,
              amount,
              type: category,
              icon,
              date: date.toISOString().split("T")[0],
              time: timeStr,
              desc: `这是一笔${type}交易`,
              account: "储蓄卡(****1234)",
              status: "success"
            });
          }
        }
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      // 按日期分组交易记录
      groupTransactionsByDate() {
        const grouped = {};
        this.transactions.forEach((transaction) => {
          const date = this.formatDate(transaction.date);
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(transaction);
        });
        this.groupedTransactions = grouped;
      },
      // 格式化日期显示
      formatDate(dateString) {
        const date = new Date(dateString);
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        if (targetDate.getTime() === today.getTime()) {
          return "今天";
        } else if (targetDate.getTime() === yesterday.getTime()) {
          return "昨天";
        } else {
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${month}月${day}日`;
        }
      },
      // 计算收支汇总
      calculateSummary() {
        let income = 0;
        let expense = 0;
        this.transactions.forEach((transaction) => {
          if (transaction.type === "income") {
            income += transaction.amount;
          } else {
            expense += transaction.amount;
          }
        });
        this.incomeTotal = income;
        this.expenseTotal = expense;
        this.balanceTotal = income - expense;
      },
      // 显示日期选择器
      showDatePicker() {
        uni.showActionSheet({
          itemList: ["今天", "昨天", "近7天", "本月", "上月", "自定义"],
          success: (res) => {
            const options = ["今天", "昨天", "近7天", "本月", "上月", "自定义"];
            this.selectedDateRange = options[res.tapIndex];
            this.currentPage = 1;
            this.loadTransactions();
          }
        });
      },
      // 显示类型筛选器
      showTypeFilter() {
        const options = this.type === "credit" ? ["全部类型", "餐饮", "购物", "交通", "娱乐", "还款"] : ["全部类型", "工资", "转账", "理财收益", "红包", "餐饮", "购物", "交通", "娱乐", "缴费"];
        uni.showActionSheet({
          itemList: options,
          success: (res) => {
            this.selectedType = options[res.tapIndex];
            this.currentPage = 1;
            this.loadTransactions();
          }
        });
      },
      // 查看交易详情
      viewTransactionDetail(transaction) {
        uni.showModal({
          title: transaction.title,
          content: `金额: ${transaction.type === "income" ? "+" : "-"}¥${transaction.amount.toFixed(2)}
时间: ${transaction.date} ${transaction.time}
账户: ${transaction.account}
描述: ${transaction.desc}`,
          showCancel: false
        });
      },
      // 加载更多交易记录
      loadMoreTransactions() {
        if (!this.hasMore)
          return;
        this.currentPage++;
        if (this.currentPage > 2) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多记录了",
            icon: "none"
          });
        } else {
          this.loadTransactions();
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "balance-container" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode(
          "text",
          { class: "header-title" },
          vue.toDisplayString($data.type === "credit" ? "信用卡账单明细" : "收支明细"),
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 筛选条件 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", {
          class: "date-filter",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.showDatePicker && $options.showDatePicker(...args))
        }, [
          vue.createElementVNode(
            "text",
            { class: "filter-text" },
            vue.toDisplayString($data.selectedDateRange),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "filter-icon" }, "🔽")
        ]),
        vue.createElementVNode("view", {
          class: "type-filter",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.showTypeFilter && $options.showTypeFilter(...args))
        }, [
          vue.createElementVNode(
            "text",
            { class: "filter-text" },
            vue.toDisplayString($data.selectedType),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "filter-icon" }, "🔽")
        ])
      ]),
      vue.createCommentVNode(" 收支概览 "),
      $data.type !== "credit" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "summary-section"
      }, [
        vue.createElementVNode("view", { class: "summary-grid" }, [
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "收入"),
            vue.createElementVNode(
              "text",
              { class: "summary-value income" },
              "+¥" + vue.toDisplayString($data.incomeTotal.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "支出"),
            vue.createElementVNode(
              "text",
              { class: "summary-value expense" },
              "-¥" + vue.toDisplayString($data.expenseTotal.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode("text", { class: "summary-label" }, "结余"),
            vue.createElementVNode(
              "text",
              { class: "summary-value" },
              vue.toDisplayString($data.balanceTotal >= 0 ? "+" : "") + "¥" + vue.toDisplayString($data.balanceTotal.toFixed(2)),
              1
              /* TEXT */
            )
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 交易列表 "),
      vue.createElementVNode("view", { class: "transaction-list" }, [
        $data.transactions.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-list"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📝"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无交易记录")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "list-content"
        }, [
          vue.createCommentVNode(" 按日期分组显示 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.groupedTransactions, (group, date) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: date,
                class: "transaction-group"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "group-date" },
                  vue.toDisplayString(date),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "group-items" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(group, (transaction, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "transaction-item",
                        key: index,
                        onClick: ($event) => $options.viewTransactionDetail(transaction)
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["transaction-icon", transaction.type])
                          },
                          [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString(transaction.icon),
                              1
                              /* TEXT */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode("view", { class: "transaction-info" }, [
                          vue.createElementVNode("view", { class: "info-row" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "transaction-title" },
                              vue.toDisplayString(transaction.title),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              {
                                class: vue.normalizeClass(["transaction-amount", transaction.type])
                              },
                              vue.toDisplayString(transaction.type === "income" ? "+" : "-") + "¥" + vue.toDisplayString(transaction.amount.toFixed(2)),
                              3
                              /* TEXT, CLASS */
                            )
                          ]),
                          vue.createElementVNode(
                            "text",
                            { class: "transaction-time" },
                            vue.toDisplayString(transaction.time),
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
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "load-more",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.loadMoreTransactions && $options.loadMoreTransactions(...args))
      }, [
        vue.createElementVNode("text", { class: "load-text" }, "上拉加载更多")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesBalanceBalance = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-a05d65b8"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/balance/balance.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        hasLoan: true,
        // 模拟用户有贷款
        loanInfo: {
          amount: 1e5,
          status: "还款中",
          type: "个人消费贷",
          term: 36,
          rate: 4.5,
          paidInstallments: 12,
          totalInstallments: 36,
          nextPaymentDate: "2024-06-10",
          nextPaymentAmount: 3200.5
        },
        loanProducts: [
          {
            id: "1",
            name: "个人消费贷",
            rate: 4.5,
            amountRange: "1万-50万",
            termRange: "6-60期",
            features: "无需抵押，快速审批",
            minRate: 4.2,
            maxRate: 5.8
          },
          {
            id: "2",
            name: "房贷",
            rate: 3.8,
            amountRange: "50万-500万",
            termRange: "12-360期",
            features: "利率优惠，长期稳定",
            minRate: 3.6,
            maxRate: 4.8
          },
          {
            id: "3",
            name: "经营贷",
            rate: 5.2,
            amountRange: "10万-100万",
            termRange: "12-60期",
            features: "助力创业，灵活还款",
            minRate: 4.8,
            maxRate: 6.5
          }
        ],
        loanNews: [
          {
            id: "1",
            title: "央行降准0.5个百分点，贷款市场利率有望下行",
            date: "2024-05-15",
            content: "中国人民银行决定下调金融机构存款准备金率0.5个百分点，预计将释放长期资金约1万亿元，有助于降低社会融资成本..."
          },
          {
            id: "2",
            title: "个人消费贷新政策解读：这些变化你需要了解",
            date: "2024-05-10",
            content: "近日，银保监会发布了关于调整个人消费贷款政策的通知，新政策对贷款额度、期限、利率等方面做出了调整..."
          },
          {
            id: "3",
            title: "如何提高贷款审批通过率？这些技巧很重要",
            date: "2024-05-05",
            content: "在申请贷款时，很多人会遇到审批不通过的情况。本文将为您介绍几个提高贷款审批通过率的实用技巧..."
          }
        ]
      };
    },
    onLoad() {
      this.checkLoginStatus();
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        if (!forceCheckLogin()) {
          uni.reLaunch({
            url: "/pages/denglu/login"
          });
        }
      },
      // 立即还款
      makePayment() {
        uni.showModal({
          title: "确认还款",
          content: `确定要偿还本期贷款 ¥${this.loanInfo.nextPaymentAmount.toFixed(2)} 吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: "还款处理中..." });
              setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "还款成功",
                  icon: "success"
                });
                this.loanInfo.paidInstallments++;
                this.loanInfo.nextPaymentDate = "2024-07-10";
              }, 1500);
            }
          }
        });
      },
      // 查看贷款详情 - 修改为提示功能
      viewLoanDetails() {
        uni.showModal({
          title: "提示",
          content: "贷款详情功能正在开发中",
          showCancel: false
        });
      },
      // 申请新贷款 - 修改为提示功能
      applyForLoan() {
        uni.showModal({
          title: "提示",
          content: "贷款申请功能正在开发中",
          showCancel: false
        });
      },
      // 查看所有贷款产品 - 修改为提示功能
      viewAllProducts() {
        uni.showModal({
          title: "提示",
          content: "查看全部产品功能正在开发中",
          showCancel: false
        });
      },
      // 查看产品详情 - 修改为提示功能
      viewProductDetail(product) {
        uni.showModal({
          title: "提示",
          content: "产品详情功能正在开发中",
          showCancel: false
        });
      },
      // 申请特定产品 - 修改为提示功能
      applyForProduct(product) {
        uni.showModal({
          title: "提示",
          content: "产品申请功能正在开发中",
          showCancel: false
        });
      },
      // 打开贷款计算器 - 修改为提示功能
      openCalculator() {
        uni.showModal({
          title: "提示",
          content: "贷款计算器功能正在开发中",
          showCancel: false
        });
      },
      // 打开利率查询 - 修改为提示功能
      openRateQuery() {
        uni.showModal({
          title: "提示",
          content: "利率查询功能正在开发中",
          showCancel: false
        });
      },
      // 打开还款计划 - 修改为提示功能
      openRepaymentPlan() {
        uni.showModal({
          title: "提示",
          content: "还款计划功能正在开发中",
          showCancel: false
        });
      },
      // 打开常见问题 - 修改为提示功能
      openLoanFAQ() {
        uni.showModal({
          title: "提示",
          content: "贷款常见问题功能正在开发中",
          showCancel: false
        });
      },
      // 查看所有资讯 - 修改为提示功能
      viewAllNews() {
        uni.showModal({
          title: "提示",
          content: "查看全部资讯功能正在开发中",
          showCancel: false
        });
      },
      // 查看资讯详情 - 修改为提示功能
      viewNewsDetail(news) {
        uni.showModal({
          title: "提示",
          content: "资讯详情功能正在开发中",
          showCancel: false
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "loan-container" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "贷款服务")
      ]),
      vue.createCommentVNode(" 贷款概览 "),
      $data.hasLoan ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loan-overview"
      }, [
        vue.createElementVNode("view", { class: "overview-content" }, [
          vue.createElementVNode("text", { class: "overview-label" }, "您有一笔贷款"),
          vue.createElementVNode(
            "text",
            { class: "overview-amount" },
            "¥" + vue.toDisplayString($data.loanInfo.amount.toFixed(2)),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "overview-status" },
            vue.toDisplayString($data.loanInfo.status),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "loan-details" }, [
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "贷款类型: " + vue.toDisplayString($data.loanInfo.type),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "贷款期限: " + vue.toDisplayString($data.loanInfo.term) + " 个月",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "贷款利率: " + vue.toDisplayString($data.loanInfo.rate) + "%",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "已还期数: " + vue.toDisplayString($data.loanInfo.paidInstallments) + "/" + vue.toDisplayString($data.loanInfo.totalInstallments),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "下次还款日: " + vue.toDisplayString($data.loanInfo.nextPaymentDate),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "detail-item" },
              "下次还款金额: ¥" + vue.toDisplayString($data.loanInfo.nextPaymentAmount.toFixed(2)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "overview-actions" }, [
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.makePayment && $options.makePayment(...args))
            }, "立即还款"),
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.viewLoanDetails && $options.viewLoanDetails(...args))
            }, "查看详情")
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 无贷款状态 "),
          vue.createElementVNode("view", { class: "no-loan" }, [
            vue.createElementVNode("text", { class: "no-loan-icon" }, "💸"),
            vue.createElementVNode("text", { class: "no-loan-text" }, "您当前没有贷款记录"),
            vue.createElementVNode("button", {
              class: "apply-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.applyForLoan && $options.applyForLoan(...args))
            }, "立即申请")
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 贷款产品 "),
      vue.createElementVNode("view", { class: "loan-products" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "热门贷款产品"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.viewAllProducts && $options.viewAllProducts(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "products-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.loanProducts, (product, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "product-card",
                key: index,
                onClick: ($event) => $options.viewProductDetail(product)
              }, [
                vue.createElementVNode("view", { class: "product-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "product-title" },
                    vue.toDisplayString(product.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "product-rate" },
                    vue.toDisplayString(product.rate) + "%",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "rate-label" }, "年利率")
                ]),
                vue.createElementVNode("view", { class: "product-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info-item" },
                    vue.toDisplayString(product.amountRange),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "info-item" },
                    vue.toDisplayString(product.termRange),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "info-item" },
                    vue.toDisplayString(product.features),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("button", {
                  class: "apply-product-btn",
                  onClick: vue.withModifiers(($event) => $options.applyForProduct(product), ["stop"])
                }, "立即申请", 8, ["onClick"])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 贷款工具 "),
      vue.createElementVNode("view", { class: "loan-tools" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "贷款工具")
        ]),
        vue.createElementVNode("view", { class: "tools-grid" }, [
          vue.createElementVNode("view", {
            class: "tool-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.openCalculator && $options.openCalculator(...args))
          }, [
            vue.createElementVNode("view", { class: "tool-icon" }, "🧮"),
            vue.createElementVNode("text", { class: "tool-text" }, "贷款计算器")
          ]),
          vue.createElementVNode("view", {
            class: "tool-item",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.openRateQuery && $options.openRateQuery(...args))
          }, [
            vue.createElementVNode("view", { class: "tool-icon" }, "📊"),
            vue.createElementVNode("text", { class: "tool-text" }, "利率查询")
          ]),
          vue.createElementVNode("view", {
            class: "tool-item",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.openRepaymentPlan && $options.openRepaymentPlan(...args))
          }, [
            vue.createElementVNode("view", { class: "tool-icon" }, "📝"),
            vue.createElementVNode("text", { class: "tool-text" }, "还款计划")
          ]),
          vue.createElementVNode("view", {
            class: "tool-item",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.openLoanFAQ && $options.openLoanFAQ(...args))
          }, [
            vue.createElementVNode("view", { class: "tool-icon" }, "❓"),
            vue.createElementVNode("text", { class: "tool-text" }, "常见问题")
          ])
        ])
      ]),
      vue.createCommentVNode(" 贷款资讯 "),
      vue.createElementVNode("view", { class: "loan-news" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "贷款资讯"),
          vue.createElementVNode("text", {
            class: "view-all",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.viewAllNews && $options.viewAllNews(...args))
          }, "查看全部")
        ]),
        vue.createElementVNode("view", { class: "news-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.loanNews, (news, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "news-item",
                key: index,
                onClick: ($event) => $options.viewNewsDetail(news)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "news-title" },
                  vue.toDisplayString(news.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "news-date" },
                  vue.toDisplayString(news.date),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesLoanLoan = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-2fe4ed24"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/loan/loan.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        creditCards: [],
        showDetail: false,
        selectedCard: null,
        selectedIndex: 0,
        showAddCard: false,
        showFullCardNumbers: false,
        showDetailCardNumbers: false,
        showDetailCVV: false,
        showNewCardNumber: false,
        showNewCVV: false,
        showRepaymentModal: false,
        showTransactionsModal: false,
        showRepaymentRecordModal: false,
        showCardDetailModal: false,
        customAmount: "",
        isCustomAmountValid: false,
        repaymentRecord: null,
        showSuccessAnimation: false,
        // 新增银行卡相关数据
        newCard: {
          cardType: "",
          cardBrand: "",
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
          creditLimit: "",
          annualFee: "",
          statementDate: "",
          dueDate: "",
          cardColor: "#4CAF50"
        },
        // 银行卡类型选项
        cardTypes: [
          { value: "钻石卡", name: "钻石卡", icon: "💎" },
          { value: "白金卡", name: "白金卡", icon: "⚪" },
          { value: "金卡", name: "金卡", icon: "🟡" },
          { value: "普卡", name: "普卡", icon: "🟢" },
          { value: "学生卡", name: "学生卡", icon: "🎓" },
          { value: "商务卡", name: "商务卡", icon: "💼" }
        ],
        // 银行品牌选项
        bankBrands: [
          { value: "中国农业银行", name: "中国农业银行", icon: "🏦" },
          { value: "中国工商银行", name: "中国工商银行", icon: "🏦" },
          { value: "中国建设银行", name: "中国建设银行", icon: "🏦" },
          { value: "中国银行", name: "中国银行", icon: "🏦" },
          { value: "交通银行", name: "交通银行", icon: "🏦" },
          { value: "招商银行", name: "招商银行", icon: "🏦" },
          { value: "浦发银行", name: "浦发银行", icon: "🏦" },
          { value: "中信银行", name: "中信银行", icon: "🏦" },
          { value: "华夏银行", name: "华夏银行", icon: "🏦" },
          { value: "民生银行", name: "民生银行", icon: "🏦" },
          { value: "广发银行", name: "广发银行", icon: "🏦" },
          { value: "平安银行", name: "平安银行", icon: "🏦" },
          { value: "兴业银行", name: "兴业银行", icon: "🏦" },
          { value: "银联", name: "银联", icon: "💳" },
          { value: "Visa", name: "Visa", icon: "💳" },
          { value: "MasterCard", name: "MasterCard", icon: "💳" },
          { value: "American Express", name: "American Express", icon: "💳" }
        ],
        // 卡片颜色选项
        cardColors: [
          { value: "#4CAF50", name: "绿色" },
          { value: "#2196F3", name: "蓝色" },
          { value: "#FF9800", name: "橙色" },
          { value: "#9C27B0", name: "紫色" },
          { value: "#F44336", name: "红色" },
          { value: "#607D8B", name: "灰色" },
          { value: "#795548", name: "棕色" },
          { value: "#FF5722", name: "深橙色" },
          { value: "#3F51B5", name: "靛蓝色" },
          { value: "#009688", name: "青色" },
          { value: "#E91E63", name: "粉色" },
          { value: "#673AB7", name: "深紫色" }
        ]
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/credit-cards/credit-cards.vue:821", "信用卡页面加载开始");
      this.loadCreditCards();
      setTimeout(() => {
        formatAppLog("log", "at pages/credit-cards/credit-cards.vue:826", "信用卡数据加载完成:", this.creditCards);
        if (!this.creditCards || this.creditCards.length === 0) {
          formatAppLog("warn", "at pages/credit-cards/credit-cards.vue:828", "警告: 信用卡数据为空");
          uni.showToast({
            title: "未找到信用卡数据",
            icon: "none",
            duration: 2e3
          });
        }
      }, 1e3);
    },
    computed: {
      isFormValid() {
        return this.validateForm();
      }
    },
    methods: {
      goBack() {
        uni.switchTab({
          url: "/pages/user/user"
        });
      },
      toggleCardNumberVisibility() {
        this.showFullCardNumbers = !this.showFullCardNumbers;
        uni.showToast({
          title: this.showFullCardNumbers ? "显示完整卡号" : "隐藏卡号",
          icon: "none",
          duration: 1500
        });
      },
      toggleDetailCardNumberVisibility() {
        this.showDetailCardNumbers = !this.showDetailCardNumbers;
        uni.showToast({
          title: this.showDetailCardNumbers ? "显示完整卡号" : "隐藏卡号",
          icon: "none",
          duration: 1500
        });
      },
      toggleDetailCVVVisibility() {
        this.showDetailCVV = !this.showDetailCVV;
        uni.showToast({
          title: this.showDetailCVV ? "显示CVV" : "隐藏CVV",
          icon: "none",
          duration: 1500
        });
      },
      toggleNewCardNumberVisibility() {
        this.showNewCardNumber = !this.showNewCardNumber;
      },
      toggleNewCVVVisibility() {
        this.showNewCVV = !this.showNewCVV;
      },
      loadCreditCards() {
        try {
          let users2 = uni.getStorageSync("users") || [];
          if (users2.length === 0) {
            try {
              const userData = require("@/data/users.js");
              users2 = userData.default || userData;
              uni.setStorageSync("users", users2);
            } catch (e) {
              formatAppLog("warn", "at pages/credit-cards/credit-cards.vue:895", "无法加载用户数据文件，使用默认数据");
              users2 = [];
            }
          }
          const currentUser = users2.find((user) => user.isLoggedIn);
          if (currentUser && currentUser.creditCards && currentUser.creditCards.length > 0) {
            this.creditCards = currentUser.creditCards;
            formatAppLog("log", "at pages/credit-cards/credit-cards.vue:905", "加载用户信用卡数据:", this.creditCards);
          } else {
            formatAppLog("log", "at pages/credit-cards/credit-cards.vue:908", "创建默认信用卡数据");
            this.creditCards = [
              {
                id: 1,
                cardNumber: "6222 6666 6666 6666",
                cardType: "钻石卡",
                cardBrand: "银联",
                creditLimit: 1e5,
                availableCredit: 75e3,
                currentBalance: 25e3,
                minPayment: 2500,
                statementDate: "15",
                dueDate: "2024-02-15",
                lastStatementDate: "2024-01-15",
                cardStatus: "active",
                cardHolder: currentUser ? currentUser.username : "张三",
                expiryDate: "2028-12",
                cvv: "123",
                annualFee: 2e3,
                interestRate: 5e-4,
                cashAdvanceLimit: 5e4,
                rewardsPoints: 15e3,
                cardColor: "#4CAF50"
              }
            ];
            if (currentUser) {
              currentUser.creditCards = this.creditCards;
              uni.setStorageSync("users", users2);
              formatAppLog("log", "at pages/credit-cards/credit-cards.vue:938", "保存信用卡数据到用户:", currentUser.username);
            }
          }
          this.creditCards.forEach((card) => {
            if (!card.availableCredit) {
              card.availableCredit = card.creditLimit - (card.currentBalance || 0);
            }
            if (!card.minPayment) {
              card.minPayment = Math.max(card.currentBalance * 0.1, 100);
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/credit-cards/credit-cards.vue:953", "加载信用卡信息失败:", error);
          uni.showToast({
            title: "加载失败: " + error.message,
            icon: "none",
            duration: 3e3
          });
          this.creditCards = [
            {
              id: 1,
              cardNumber: "6222 6666 6666 6666",
              cardType: "钻石卡",
              cardBrand: "银联",
              creditLimit: 1e5,
              availableCredit: 75e3,
              currentBalance: 25e3,
              minPayment: 2500,
              statementDate: "15",
              dueDate: "2024-02-15",
              lastStatementDate: "2024-01-15",
              cardStatus: "active",
              cardHolder: "张三",
              expiryDate: "2028-12",
              cvv: "123",
              annualFee: 2e3,
              interestRate: 5e-4,
              cashAdvanceLimit: 5e4,
              rewardsPoints: 15e3,
              cardColor: "#4CAF50"
            }
          ];
        }
      },
      showCardDetail(card, index) {
        this.selectedCard = card;
        this.selectedIndex = index;
        this.showDetail = true;
        this.showDetailCardNumbers = false;
        this.showDetailCVV = false;
      },
      closeDetail() {
        this.showDetail = false;
        this.selectedCard = null;
        this.showDetailCardNumbers = false;
        this.showDetailCVV = false;
      },
      showRepayment() {
        this.showDetail = false;
        this.showRepaymentModal = true;
      },
      closeRepaymentModal() {
        this.showRepaymentModal = false;
        this.customAmount = "";
        this.isCustomAmountValid = false;
      },
      closeRepaymentRecordModal() {
        this.showRepaymentRecordModal = false;
        this.repaymentRecord = null;
        this.showSuccessAnimation = false;
      },
      showRepaymentRecord() {
        if (!this.repaymentRecord) {
          formatAppLog("error", "at pages/credit-cards/credit-cards.vue:1024", "还款记录数据不存在");
          uni.showToast({
            title: "还款记录数据错误",
            icon: "none"
          });
          return;
        }
        this.showRepaymentRecordModal = true;
        setTimeout(() => {
          this.showSuccessAnimation = true;
        }, 500);
      },
      testRepaymentRecord() {
        this.repaymentRecord = {
          id: Date.now(),
          cardNumber: "6222 6666 6666 6666",
          cardType: "钻石卡",
          cardBrand: "银联",
          repaymentAmount: 5e3,
          repaymentType: "测试还款",
          oldBalance: 1e4,
          newBalance: 5e3,
          repaymentTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN"),
          status: "成功"
        };
        uni.showToast({
          title: "测试数据已创建",
          icon: "success"
        });
      },
      showTransactions() {
        this.showDetail = false;
        this.showTransactionsModal = true;
      },
      closeTransactionsModal() {
        this.showTransactionsModal = false;
      },
      handleRepayment(type) {
        const card = this.selectedCard;
        if (!card)
          return;
        let amount = 0;
        let repaymentType = "";
        switch (type) {
          case "full":
            amount = card.currentBalance;
            repaymentType = "全额还款";
            break;
          case "min":
            amount = card.minPayment;
            repaymentType = "最低还款";
            break;
          default:
            return;
        }
        if (amount < card.minPayment) {
          uni.showModal({
            title: "还款失败",
            content: `还款金额不能低于最低还款额 ¥${card.minPayment.toLocaleString()}`,
            showCancel: false
          });
          return;
        }
        this.processRepayment(amount, repaymentType);
      },
      confirmCustomRepayment() {
        const amount = parseFloat(this.customAmount);
        if (isNaN(amount) || amount <= 0) {
          uni.showToast({
            title: "请输入有效金额",
            icon: "none"
          });
          return;
        }
        if (amount < this.selectedCard.minPayment) {
          uni.showModal({
            title: "还款失败",
            content: `还款金额不能低于最低还款额 ¥${this.selectedCard.minPayment.toLocaleString()}`,
            showCancel: false
          });
          return;
        }
        this.processRepayment(amount, "自定义还款");
      },
      processRepayment(amount, repaymentType) {
        const card = this.selectedCard;
        if (!card)
          return;
        uni.showLoading({
          title: "处理中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          const oldBalance = card.currentBalance;
          const newBalance = Math.max(0, oldBalance - amount);
          card.currentBalance = newBalance;
          card.availableCredit = card.creditLimit - newBalance;
          this.repaymentRecord = {
            id: Date.now(),
            cardNumber: card.cardNumber,
            cardType: card.cardType,
            cardBrand: card.cardBrand,
            repaymentAmount: amount,
            repaymentType,
            oldBalance,
            newBalance,
            repaymentTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN"),
            status: "成功"
          };
          this.updateCreditCardData();
          this.closeRepaymentModal();
          this.showRepaymentRecord();
        }, 1500);
      },
      validateCustomAmount() {
        const amount = parseFloat(this.customAmount);
        if (isNaN(amount) || amount <= 0) {
          this.isCustomAmountValid = false;
          return;
        }
        if (!this.selectedCard) {
          this.isCustomAmountValid = false;
          return;
        }
        if (amount < this.selectedCard.minPayment) {
          this.isCustomAmountValid = false;
          return;
        }
        if (amount > this.selectedCard.currentBalance) {
          this.isCustomAmountValid = false;
          return;
        }
        this.isCustomAmountValid = true;
      },
      updateCreditCardData() {
        try {
          let users2 = uni.getStorageSync("users") || [];
          const currentUser = users2.find((user) => user.isLoggedIn);
          if (currentUser) {
            currentUser.creditCards = this.creditCards;
            uni.setStorageSync("users", users2);
          }
        } catch (error) {
          formatAppLog("error", "at pages/credit-cards/credit-cards.vue:1200", "更新信用卡数据失败:", error);
        }
      },
      getTransactions() {
        return [
          {
            id: 1,
            type: "expense",
            description: "餐饮消费",
            merchant: "星巴克咖啡",
            location: "北京市朝阳区",
            amount: -68.5,
            date: "2024-01-15 14:30:00"
          },
          {
            id: 2,
            type: "expense",
            description: "购物消费",
            merchant: "京东商城",
            location: "北京市",
            amount: -1299,
            date: "2024-01-14 16:20:00"
          },
          {
            id: 3,
            type: "income",
            description: "还款入账",
            merchant: "中国农业银行",
            location: "北京市",
            amount: 5e3,
            date: "2024-01-13 09:00:00"
          }
        ];
      },
      getTransactionIcon(type) {
        const icons = {
          expense: "💸",
          income: "💰",
          transfer: "↔️"
        };
        return icons[type] || "💳";
      },
      getTransactionTypeText(type) {
        const texts = {
          expense: "消费",
          income: "收入",
          transfer: "转账"
        };
        return texts[type] || "其他";
      },
      formatTransactionDate(dateStr) {
        const date = new Date(dateStr);
        const now = /* @__PURE__ */ new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        if (diffDays === 1) {
          return "今天";
        } else if (diffDays === 2) {
          return "昨天";
        } else if (diffDays <= 7) {
          return `${diffDays - 1}天前`;
        } else {
          return date.toLocaleDateString("zh-CN");
        }
      },
      formatCardNumber(cardNumber) {
        if (!cardNumber)
          return "";
        const cleaned = cardNumber.replace(/\s/g, "");
        if (cleaned.length <= 8) {
          return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
        } else {
          const firstFour = cleaned.substring(0, 4);
          const lastFour = cleaned.substring(cleaned.length - 4);
          const middle = "*".repeat(cleaned.length - 8);
          return `${firstFour} ${middle} ${lastFour}`;
        }
      },
      formatExpiryDate(expiryDate) {
        if (!expiryDate)
          return "";
        return expiryDate.replace(/(\d{4})-(\d{2})/, "$2/$1");
      },
      applyCard() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      },
      showAddCardModal() {
        this.showAddCard = true;
      },
      closeAddCard() {
        this.showAddCard = false;
        this.showNewCardNumber = false;
        this.showNewCVV = false;
      },
      // 获取总信用额度
      getTotalCreditLimit() {
        if (!this.creditCards || this.creditCards.length === 0)
          return "¥0";
        const total = this.creditCards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
        return `¥${total.toLocaleString()}`;
      },
      // 获取总可用额度
      getTotalAvailableCredit() {
        if (!this.creditCards || this.creditCards.length === 0)
          return "¥0";
        const total = this.creditCards.reduce((sum, card) => sum + (card.availableCredit || 0), 0);
        return `¥${total.toLocaleString()}`;
      },
      // 获取状态文本
      getStatusText(status) {
        const statusMap = {
          active: "正常",
          frozen: "冻结",
          expired: "过期",
          locked: "锁定"
        };
        return statusMap[status] || "未知";
      },
      // 银行卡管理相关方法
      selectCardType(type) {
        this.newCard.cardType = type;
      },
      selectBankBrand(bank) {
        this.newCard.cardBrand = bank;
      },
      selectCardColor(color) {
        this.newCard.cardColor = color;
      },
      formatCardNumberInput(event) {
        let value = event.detail.value.replace(/\s/g, "");
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        this.newCard.cardNumber = value;
      },
      formatExpiryInput(event) {
        let value = event.detail.value.replace(/\D/g, "");
        if (value.length >= 2) {
          value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        this.newCard.expiryDate = value;
      },
      validateForm() {
        return this.newCard.cardType && this.newCard.cardBrand && this.newCard.cardNumber.replace(/\s/g, "").length >= 16 && this.newCard.cardHolder && this.newCard.expiryDate && this.newCard.cvv && this.newCard.creditLimit && this.newCard.annualFee && this.newCard.statementDate && this.newCard.dueDate;
      },
      confirmAddCard() {
        if (!this.validateForm()) {
          uni.showToast({
            title: "请完善所有必填信息",
            icon: "none"
          });
          return;
        }
        const cardNumber = this.newCard.cardNumber.replace(/\s/g, "");
        if (!/^\d{16,19}$/.test(cardNumber)) {
          uni.showToast({
            title: "银行卡号格式不正确",
            icon: "none"
          });
          return;
        }
        if (!/^\d{3,4}$/.test(this.newCard.cvv)) {
          uni.showToast({
            title: "CVV格式不正确",
            icon: "none"
          });
          return;
        }
        const newCardData = {
          id: Date.now(),
          cardNumber: this.newCard.cardNumber,
          cardType: this.newCard.cardType,
          cardBrand: this.newCard.cardBrand,
          creditLimit: parseFloat(this.newCard.creditLimit),
          availableCredit: parseFloat(this.newCard.creditLimit),
          currentBalance: 0,
          minPayment: 0,
          statementDate: this.newCard.statementDate,
          dueDate: this.newCard.dueDate,
          lastStatementDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          cardStatus: "active",
          cardHolder: this.newCard.cardHolder,
          expiryDate: this.newCard.expiryDate.replace("/", "-"),
          cvv: this.newCard.cvv,
          annualFee: parseFloat(this.newCard.annualFee),
          interestRate: 5e-4,
          cashAdvanceLimit: parseFloat(this.newCard.creditLimit) * 0.5,
          rewardsPoints: 0,
          cardColor: this.newCard.cardColor
        };
        this.creditCards.push(newCardData);
        this.updateCreditCardData();
        this.resetNewCardForm();
        this.closeAddCard();
        uni.showToast({
          title: "银行卡添加成功",
          icon: "success"
        });
      },
      resetNewCardForm() {
        this.newCard = {
          cardType: "",
          cardBrand: "",
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
          creditLimit: "",
          annualFee: "",
          statementDate: "",
          dueDate: "",
          cardColor: "#4CAF50"
        };
      },
      showCardDetailModal() {
        this.showCardDetailModal = true;
      },
      closeCardDetailModal() {
        this.showCardDetailModal = false;
        this.showDetailCardNumbers = false;
        this.showDetailCVV = false;
      },
      editCard() {
        uni.showToast({
          title: "编辑功能开发中",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O;
    return vue.openBlock(), vue.createElementBlock("view", { class: "credit-cards-page" }, [
      vue.createCommentVNode(" 顶部导航栏 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", {
          class: "nav-left",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "‹")
        ]),
        vue.createElementVNode("view", { class: "nav-title" }, "我的信用卡"),
        vue.createElementVNode("view", { class: "nav-right" }, [
          vue.createElementVNode("view", {
            class: "nav-icon",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleCardNumberVisibility && $options.toggleCardNumberVisibility(...args))
          }, [
            vue.createElementVNode(
              "text",
              { class: "eye-icon" },
              vue.toDisplayString($data.showFullCardNumbers ? "👁️" : "👁️‍🗨️"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "nav-icon",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.showAddCardModal && $options.showAddCardModal(...args))
          }, [
            vue.createElementVNode("text", { class: "add-icon" }, "+")
          ])
        ])
      ]),
      vue.createCommentVNode(" 信用卡列表 "),
      $data.creditCards && $data.creditCards.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "cards-container"
      }, [
        vue.createCommentVNode(" 卡片统计信息 "),
        vue.createElementVNode("view", { class: "cards-summary" }, [
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode(
              "text",
              { class: "summary-number" },
              vue.toDisplayString($data.creditCards.length),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "summary-label" }, "信用卡数量")
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode(
              "text",
              { class: "summary-number" },
              vue.toDisplayString($options.getTotalCreditLimit()),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "summary-label" }, "总信用额度")
          ]),
          vue.createElementVNode("view", { class: "summary-item" }, [
            vue.createElementVNode(
              "text",
              { class: "summary-number" },
              vue.toDisplayString($options.getTotalAvailableCredit()),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "summary-label" }, "总可用额度")
          ])
        ]),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.creditCards, (card, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "card-item",
              key: index,
              style: vue.normalizeStyle({ background: card.cardColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }),
              onClick: ($event) => $options.showCardDetail(card, index)
            }, [
              vue.createCommentVNode(" 卡片头部 "),
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode("view", { class: "card-brand" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "brand-text" },
                    vue.toDisplayString(card.cardBrand),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "card-type" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "type-text" },
                    vue.toDisplayString(card.cardType),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createCommentVNode(" 卡片号码 "),
              vue.createElementVNode("view", { class: "card-number" }, [
                vue.createElementVNode(
                  "text",
                  { class: "number-text" },
                  vue.toDisplayString($data.showFullCardNumbers ? card.cardNumber : $options.formatCardNumber(card.cardNumber)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", {
                  class: "card-number-toggle",
                  onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.toggleCardNumberVisibility && $options.toggleCardNumberVisibility(...args), ["stop"]))
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "toggle-icon" },
                    vue.toDisplayString($data.showFullCardNumbers ? "👁️" : "👁️‍🗨️"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createCommentVNode(" 卡片底部信息 "),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode("view", { class: "card-holder" }, [
                  vue.createElementVNode("text", { class: "holder-label" }, "持卡人"),
                  vue.createElementVNode(
                    "text",
                    { class: "holder-name" },
                    vue.toDisplayString(card.cardHolder),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "card-expiry" }, [
                  vue.createElementVNode("text", { class: "expiry-label" }, "有效期"),
                  vue.createElementVNode(
                    "text",
                    { class: "expiry-date" },
                    vue.toDisplayString($options.formatExpiryDate(card.expiryDate)),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createCommentVNode(" 卡片状态指示器 - 只显示非正常状态 "),
              card.cardStatus !== "active" ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: vue.normalizeClass(["card-status", card.cardStatus])
                },
                [
                  vue.createElementVNode(
                    "text",
                    { class: "status-text" },
                    vue.toDisplayString($options.getStatusText(card.cardStatus)),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true)
            ], 12, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 无信用卡提示 "),
          vue.createElementVNode("view", { class: "empty-state" }, [
            vue.createElementVNode("view", { class: "empty-icon" }, "💳"),
            vue.createElementVNode("text", { class: "empty-title" }, "暂无信用卡"),
            vue.createElementVNode("text", { class: "empty-desc" }, "您还没有申请信用卡"),
            vue.createElementVNode("button", {
              class: "apply-btn",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.applyCard && $options.applyCard(...args))
            }, "立即申请")
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 信用卡详情弹窗 "),
      $data.showDetail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "card-detail-modal",
        onClick: _cache[11] || (_cache[11] = (...args) => $options.closeDetail && $options.closeDetail(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content detail-modal",
          onClick: _cache[10] || (_cache[10] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "信用卡详情"),
            vue.createElementVNode("view", { class: "modal-actions" }, [
              vue.createElementVNode("view", {
                class: "action-icon",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.toggleDetailCardNumberVisibility && $options.toggleDetailCardNumberVisibility(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "eye-icon" },
                  vue.toDisplayString($data.showDetailCardNumbers ? "👁️" : "👁️‍🗨️"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("text", {
                class: "close-btn",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.closeDetail && $options.closeDetail(...args))
              }, "×")
            ])
          ]),
          vue.createElementVNode("view", { class: "detail-content" }, [
            vue.createCommentVNode(" 卡片基本信息 "),
            vue.createElementVNode("view", { class: "detail-section" }, [
              vue.createElementVNode("view", { class: "section-title" }, "基本信息"),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "卡号"),
                vue.createElementVNode("view", { class: "card-number-display" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.showDetailCardNumbers ? $data.selectedCard.cardNumber : $options.formatCardNumber($data.selectedCard.cardNumber)),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", {
                    class: "toggle-visibility",
                    onClick: _cache[7] || (_cache[7] = (...args) => $options.toggleDetailCardNumberVisibility && $options.toggleDetailCardNumberVisibility(...args))
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "toggle-icon" },
                      vue.toDisplayString($data.showDetailCardNumbers ? "👁️" : "👁️‍🗨️"),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "卡片类型"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.selectedCard.cardType) + " " + vue.toDisplayString($data.selectedCard.cardBrand),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "持卡人"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.selectedCard.cardHolder),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "有效期"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($options.formatExpiryDate($data.selectedCard.expiryDate)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "卡片状态"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value status" },
                  vue.toDisplayString($options.getStatusText($data.selectedCard.cardStatus)),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createCommentVNode(" 额度信息 "),
            vue.createElementVNode("view", { class: "detail-section" }, [
              vue.createElementVNode("view", { class: "section-title" }, "额度信息"),
              vue.createElementVNode("view", { class: "limit-info" }, [
                vue.createElementVNode("view", { class: "limit-item" }, [
                  vue.createElementVNode("text", { class: "limit-label" }, "信用额度"),
                  vue.createElementVNode(
                    "text",
                    { class: "limit-value" },
                    "¥" + vue.toDisplayString($data.selectedCard.creditLimit.toLocaleString()),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "limit-item" }, [
                  vue.createElementVNode("text", { class: "limit-label" }, "可用额度"),
                  vue.createElementVNode(
                    "text",
                    { class: "limit-value available" },
                    "¥" + vue.toDisplayString($data.selectedCard.availableCredit.toLocaleString()),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "limit-item" }, [
                  vue.createElementVNode("text", { class: "limit-label" }, "当前欠款"),
                  vue.createElementVNode(
                    "text",
                    { class: "limit-value debt" },
                    "¥" + vue.toDisplayString($data.selectedCard.currentBalance.toLocaleString()),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "limit-item" }, [
                  vue.createElementVNode("text", { class: "limit-label" }, "最低还款"),
                  vue.createElementVNode(
                    "text",
                    { class: "limit-value min" },
                    "¥" + vue.toDisplayString($data.selectedCard.minPayment.toLocaleString()),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ]),
            vue.createCommentVNode(" 账单信息 "),
            vue.createElementVNode("view", { class: "detail-section" }, [
              vue.createElementVNode("view", { class: "section-title" }, "账单信息"),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "账单日"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  "每月" + vue.toDisplayString($data.selectedCard.statementDate) + "日",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "到期还款日"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.selectedCard.dueDate),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "年费"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  "¥" + vue.toDisplayString($data.selectedCard.annualFee.toLocaleString()),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer detail-footer" }, [
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.showRepayment && $options.showRepayment(...args))
            }, "立即还款"),
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.showTransactions && $options.showTransactions(...args))
            }, "查看交易")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 还款弹窗 "),
      $data.showRepaymentModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal-overlay",
        onClick: _cache[19] || (_cache[19] = (...args) => $options.closeRepaymentModal && $options.closeRepaymentModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content repayment-modal",
          onClick: _cache[18] || (_cache[18] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "立即还款"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.closeRepaymentModal && $options.closeRepaymentModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createCommentVNode(" 卡片信息 "),
            vue.createElementVNode("view", { class: "card-info" }, [
              vue.createElementVNode(
                "view",
                { class: "card-number" },
                vue.toDisplayString((_a = $data.selectedCard) == null ? void 0 : _a.cardNumber),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "card-type" },
                vue.toDisplayString((_b = $data.selectedCard) == null ? void 0 : _b.cardType) + " " + vue.toDisplayString((_c = $data.selectedCard) == null ? void 0 : _c.cardBrand),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 还款信息 "),
            vue.createElementVNode("view", { class: "repayment-info" }, [
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "当前欠款"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value debt" },
                  "¥" + vue.toDisplayString(((_e = (_d = $data.selectedCard) == null ? void 0 : _d.currentBalance) == null ? void 0 : _e.toLocaleString()) || "0"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "最低还款"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  "¥" + vue.toDisplayString(((_g = (_f = $data.selectedCard) == null ? void 0 : _f.minPayment) == null ? void 0 : _g.toLocaleString()) || "0"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "可用额度"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value available" },
                  "¥" + vue.toDisplayString(((_i = (_h = $data.selectedCard) == null ? void 0 : _h.availableCredit) == null ? void 0 : _i.toLocaleString()) || "0"),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createCommentVNode(" 还款方式 "),
            vue.createElementVNode("view", { class: "repayment-methods" }, [
              vue.createElementVNode("button", {
                class: "method-btn full",
                onClick: _cache[13] || (_cache[13] = ($event) => $options.handleRepayment("full"))
              }, [
                vue.createElementVNode("view", { class: "left-content" }, [
                  vue.createElementVNode("text", { class: "method-icon" }, "💰"),
                  vue.createElementVNode("text", { class: "method-title" }, "全额还款")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "method-amount" },
                  "¥" + vue.toDisplayString(((_k = (_j = $data.selectedCard) == null ? void 0 : _j.currentBalance) == null ? void 0 : _k.toLocaleString()) || "0"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("button", {
                class: "method-btn min",
                onClick: _cache[14] || (_cache[14] = ($event) => $options.handleRepayment("min"))
              }, [
                vue.createElementVNode("view", { class: "left-content" }, [
                  vue.createElementVNode("text", { class: "method-icon" }, "💳"),
                  vue.createElementVNode("text", { class: "method-title" }, "最低还款")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "method-amount" },
                  "¥" + vue.toDisplayString(((_m = (_l = $data.selectedCard) == null ? void 0 : _l.minPayment) == null ? void 0 : _m.toLocaleString()) || "0"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "method-btn custom" }, [
                vue.createElementVNode("view", { class: "left-content" }, [
                  vue.createElementVNode("text", { class: "method-icon" }, "✏️"),
                  vue.createElementVNode("text", { class: "method-title" }, "自定义还款")
                ]),
                vue.createElementVNode("view", { class: "custom-input-section" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "custom-amount-input",
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.customAmount = $event),
                      placeholder: "输入金额",
                      type: "number",
                      maxlength: "10",
                      onInput: _cache[16] || (_cache[16] = (...args) => $options.validateCustomAmount && $options.validateCustomAmount(...args))
                    },
                    null,
                    544
                    /* NEED_HYDRATION, NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.customAmount]
                  ])
                ])
              ])
            ]),
            vue.createCommentVNode(" 确认还款按钮区域 "),
            vue.createElementVNode("view", { class: "modal-footer" }, [
              vue.createElementVNode("button", {
                class: "confirm-repayment-btn",
                onClick: _cache[17] || (_cache[17] = (...args) => $options.confirmCustomRepayment && $options.confirmCustomRepayment(...args)),
                disabled: !$data.isCustomAmountValid
              }, " 确认还款 ", 8, ["disabled"])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 交易记录弹窗 "),
      $data.showTransactionsModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "modal-overlay",
        onClick: _cache[22] || (_cache[22] = (...args) => $options.closeTransactionsModal && $options.closeTransactionsModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content transactions-modal",
          onClick: _cache[21] || (_cache[21] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "交易记录"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[20] || (_cache[20] = (...args) => $options.closeTransactionsModal && $options.closeTransactionsModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createCommentVNode(" 卡片信息 "),
            vue.createElementVNode("view", { class: "card-info" }, [
              vue.createElementVNode(
                "view",
                { class: "card-number" },
                vue.toDisplayString((_n = $data.selectedCard) == null ? void 0 : _n.cardNumber),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "card-type" },
                vue.toDisplayString((_o = $data.selectedCard) == null ? void 0 : _o.cardType) + " " + vue.toDisplayString((_p = $data.selectedCard) == null ? void 0 : _p.cardBrand),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 交易列表 "),
            vue.createElementVNode("view", { class: "transactions-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.getTransactions(), (trans) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "transaction-item",
                    key: trans.id
                  }, [
                    vue.createElementVNode("view", { class: "transaction-left" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "transaction-icon" },
                        vue.toDisplayString($options.getTransactionIcon(trans.type)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "transaction-details" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "transaction-desc" },
                          vue.toDisplayString(trans.description),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "transaction-merchant" },
                          vue.toDisplayString(trans.merchant),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "transaction-location" },
                          vue.toDisplayString(trans.location),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "transaction-right" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["transaction-amount", { "income": trans.amount > 0, "expense": trans.amount < 0 }])
                        },
                        vue.toDisplayString(trans.amount > 0 ? "+" : "") + "¥" + vue.toDisplayString(Math.abs(trans.amount).toLocaleString()),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "transaction-date" },
                        vue.toDisplayString($options.formatTransactionDate(trans.date)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "transaction-type" },
                        vue.toDisplayString($options.getTransactionTypeText(trans.type)),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 交易统计 "),
            vue.createElementVNode("view", { class: "transactions-summary" }, [
              vue.createElementVNode(
                "text",
                { class: "summary-text" },
                "共 " + vue.toDisplayString($options.getTransactions().length) + " 笔交易",
                1
                /* TEXT */
              )
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 还款记录弹窗 "),
      $data.showRepaymentRecordModal && $data.repaymentRecord ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "modal-overlay",
        onClick: _cache[27] || (_cache[27] = (...args) => $options.closeRepaymentRecordModal && $options.closeRepaymentRecordModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content repayment-record-modal",
          onClick: _cache[26] || (_cache[26] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "还款记录"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[23] || (_cache[23] = (...args) => $options.closeRepaymentRecordModal && $options.closeRepaymentRecordModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createCommentVNode(" 还款成功图标和动画 "),
            vue.createElementVNode("view", { class: "success-animation" }, [
              vue.createElementVNode("view", { class: "success-circle" }, [
                vue.createElementVNode("text", { class: "success-symbol" }, "✓")
              ]),
              vue.createElementVNode("view", { class: "success-ripple" }),
              vue.createElementVNode("view", { class: "success-ripple delay-1" }),
              vue.createElementVNode("view", { class: "success-ripple delay-2" }),
              vue.createCommentVNode(" 庆祝动画 "),
              $data.showSuccessAnimation ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "celebration"
              }, [
                vue.createElementVNode("text", { class: "celebration-item" }, "🎉"),
                vue.createElementVNode("text", { class: "celebration-item" }, "✨"),
                vue.createElementVNode("text", { class: "celebration-item" }, "🎊"),
                vue.createElementVNode("text", { class: "celebration-item" }, "💫")
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 还款状态 "),
            vue.createElementVNode("view", { class: "repayment-status" }, [
              vue.createElementVNode("text", { class: "status-text" }, "还款成功"),
              vue.createElementVNode("text", { class: "status-subtitle" }, "您的还款已成功处理，资金已实时到账")
            ]),
            vue.createCommentVNode(" 还款金额突出显示 "),
            vue.createElementVNode("view", { class: "amount-highlight" }, [
              vue.createElementVNode("text", { class: "amount-label" }, "本次还款金额"),
              vue.createElementVNode(
                "text",
                { class: "amount-value" },
                "¥" + vue.toDisplayString($data.repaymentRecord.repaymentAmount.toLocaleString()),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "amount-desc" },
                vue.toDisplayString($data.repaymentRecord.repaymentType),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 卡片信息 "),
            vue.createElementVNode("view", { class: "record-card-info" }, [
              vue.createElementVNode("view", { class: "card-icon" }, "💳"),
              vue.createElementVNode(
                "view",
                { class: "card-number" },
                vue.toDisplayString($data.repaymentRecord.cardNumber),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "card-type" },
                vue.toDisplayString($data.repaymentRecord.cardType) + " " + vue.toDisplayString($data.repaymentRecord.cardBrand),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 还款详情 "),
            vue.createElementVNode("view", { class: "repayment-details" }, [
              vue.createElementVNode("view", { class: "details-header" }, [
                vue.createElementVNode("text", { class: "header-title" }, "还款详情")
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "💰"),
                  vue.createElementVNode("text", { class: "detail-label" }, "还款方式")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "detail-value" },
                  vue.toDisplayString($data.repaymentRecord.repaymentType),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "📊"),
                  vue.createElementVNode("text", { class: "detail-label" }, "还款前欠款")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "detail-value debt" },
                  "¥" + vue.toDisplayString($data.repaymentRecord.oldBalance.toLocaleString()),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "📉"),
                  vue.createElementVNode("text", { class: "detail-label" }, "还款后欠款")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "detail-value debt" },
                  "¥" + vue.toDisplayString($data.repaymentRecord.newBalance.toLocaleString()),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "⏰"),
                  vue.createElementVNode("text", { class: "detail-label" }, "还款时间")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "detail-value" },
                  vue.toDisplayString($data.repaymentRecord.repaymentTime),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "🎯"),
                  vue.createElementVNode("text", { class: "detail-label" }, "处理状态")
                ]),
                vue.createElementVNode("text", { class: "detail-value success" }, "处理成功")
              ]),
              vue.createElementVNode("view", { class: "detail-row" }, [
                vue.createElementVNode("view", { class: "detail-left" }, [
                  vue.createElementVNode("text", { class: "detail-icon" }, "📱"),
                  vue.createElementVNode("text", { class: "detail-label" }, "交易流水号")
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "detail-value" },
                  "R" + vue.toDisplayString(Date.now().toString().slice(-8)),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createCommentVNode(" 温馨提示 "),
            vue.createElementVNode("view", { class: "repayment-tips" }, [
              vue.createElementVNode("view", { class: "tips-header" }, [
                vue.createElementVNode("text", { class: "tips-icon" }, "💡"),
                vue.createElementVNode("text", { class: "tips-title" }, "温馨提示")
              ]),
              vue.createElementVNode("view", { class: "tips-list" }, [
                vue.createElementVNode("text", { class: "tips-content" }, "• 还款已实时到账，请注意查收银行短信通知"),
                vue.createElementVNode("text", { class: "tips-content" }, "• 建议保留此记录，以备后续查询使用"),
                vue.createElementVNode("text", { class: "tips-content" }, "• 如有疑问，请联系客服热线：400-888-8888")
              ])
            ])
          ]),
          vue.createCommentVNode(" 底部按钮 "),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[24] || (_cache[24] = (...args) => $options.closeRepaymentRecordModal && $options.closeRepaymentRecordModal(...args))
            }, "确定"),
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[25] || (_cache[25] = (...args) => $options.testRepaymentRecord && $options.testRepaymentRecord(...args)),
              style: { "margin-left": "20rpx" }
            }, "测试数据")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 添加银行卡弹窗 "),
      $data.showAddCard ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 6,
        class: "modal-overlay",
        onClick: _cache[44] || (_cache[44] = (...args) => $options.closeAddCard && $options.closeAddCard(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content add-card-modal",
          onClick: _cache[43] || (_cache[43] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "添加银行卡"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[28] || (_cache[28] = (...args) => $options.closeAddCard && $options.closeAddCard(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createCommentVNode(" 银行卡类型选择 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("view", { class: "form-title" }, "银行卡类型"),
              vue.createElementVNode("view", { class: "card-type-options" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.cardTypes, (type) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["type-option", { active: $data.newCard.cardType === type.value }]),
                      key: type.value,
                      onClick: ($event) => $options.selectCardType(type.value)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "type-icon" },
                        vue.toDisplayString(type.icon),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "type-name" },
                        vue.toDisplayString(type.name),
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
            vue.createCommentVNode(" 银行品牌选择 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("view", { class: "form-title" }, "银行品牌"),
              vue.createElementVNode("view", { class: "bank-options" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.bankBrands, (bank) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["bank-option", { active: $data.newCard.cardBrand === bank.value }]),
                      key: bank.value,
                      onClick: ($event) => $options.selectBankBrand(bank.value)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "bank-icon" },
                        vue.toDisplayString(bank.icon),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "bank-name" },
                        vue.toDisplayString(bank.name),
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
            vue.createCommentVNode(" 卡片信息输入 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("view", { class: "form-title" }, "卡片信息"),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "卡号"),
                vue.createElementVNode("view", { class: "card-input-container" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input",
                      "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => $data.newCard.cardNumber = $event),
                      placeholder: "请输入银行卡号",
                      type: "text",
                      maxlength: "19",
                      onInput: _cache[30] || (_cache[30] = (...args) => $options.formatCardNumberInput && $options.formatCardNumberInput(...args))
                    },
                    null,
                    544
                    /* NEED_HYDRATION, NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.newCard.cardNumber]
                  ]),
                  vue.createElementVNode("view", {
                    class: "input-toggle",
                    onClick: _cache[31] || (_cache[31] = (...args) => $options.toggleNewCardNumberVisibility && $options.toggleNewCardNumberVisibility(...args))
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "toggle-icon" },
                      vue.toDisplayString($data.showNewCardNumber ? "👁️" : "👁️‍🗨️"),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "input-tip" }, "请输入16-19位银行卡号")
              ]),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "持卡人姓名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.newCard.cardHolder = $event),
                    placeholder: "请输入持卡人姓名",
                    type: "text",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.newCard.cardHolder]
                ])
              ]),
              vue.createElementVNode("view", { class: "input-row" }, [
                vue.createElementVNode("view", { class: "input-group half" }, [
                  vue.createElementVNode("text", { class: "input-label" }, "有效期"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input",
                      "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => $data.newCard.expiryDate = $event),
                      placeholder: "MM/YY",
                      type: "text",
                      maxlength: "5",
                      onInput: _cache[34] || (_cache[34] = (...args) => $options.formatExpiryInput && $options.formatExpiryInput(...args))
                    },
                    null,
                    544
                    /* NEED_HYDRATION, NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.newCard.expiryDate]
                  ])
                ]),
                vue.createElementVNode("view", { class: "input-group half" }, [
                  vue.createElementVNode("text", { class: "input-label" }, "CVV"),
                  vue.createElementVNode("view", { class: "card-input-container" }, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      class: "form-input",
                      "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.newCard.cvv = $event),
                      placeholder: "3-4位安全码",
                      type: $data.showNewCVV ? "text" : "password",
                      maxlength: "4"
                    }, null, 8, ["type"]), [
                      [vue.vModelDynamic, $data.newCard.cvv]
                    ]),
                    vue.createElementVNode("view", {
                      class: "input-toggle",
                      onClick: _cache[36] || (_cache[36] = (...args) => $options.toggleNewCVVVisibility && $options.toggleNewCVVVisibility(...args))
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "toggle-icon" },
                        vue.toDisplayString($data.showNewCVV ? "👁️" : "👁️‍🗨️"),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "cvv-tip" }, [
                    vue.createElementVNode("text", { class: "tip-icon" }, "👁️"),
                    vue.createElementVNode("text", { class: "tip-text" }, "卡片背面3-4位数字")
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "信用额度"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => $data.newCard.creditLimit = $event),
                    placeholder: "请输入信用额度",
                    type: "number",
                    maxlength: "10"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.newCard.creditLimit]
                ]),
                vue.createElementVNode("view", { class: "input-tip" }, "单位：元")
              ]),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "年费"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $data.newCard.annualFee = $event),
                    placeholder: "请输入年费",
                    type: "number",
                    maxlength: "6"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.newCard.annualFee]
                ]),
                vue.createElementVNode("view", { class: "input-tip" }, "单位：元")
              ])
            ]),
            vue.createCommentVNode(" 账单信息 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("view", { class: "form-title" }, "账单信息"),
              vue.createElementVNode("view", { class: "input-row" }, [
                vue.createElementVNode("view", { class: "input-group half" }, [
                  vue.createElementVNode("text", { class: "input-label" }, "账单日"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input",
                      "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => $data.newCard.statementDate = $event),
                      placeholder: "1-31",
                      type: "number",
                      min: "1",
                      max: "31"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.newCard.statementDate]
                  ])
                ]),
                vue.createElementVNode("view", { class: "input-group half" }, [
                  vue.createElementVNode("text", { class: "input-label" }, "到期还款日"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input",
                      "onUpdate:modelValue": _cache[40] || (_cache[40] = ($event) => $data.newCard.dueDate = $event),
                      placeholder: "YYYY-MM-DD",
                      type: "text",
                      maxlength: "10"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.newCard.dueDate]
                  ])
                ])
              ])
            ]),
            vue.createCommentVNode(" 卡片颜色选择 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("view", { class: "form-title" }, "卡片颜色"),
              vue.createElementVNode("view", { class: "color-options" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.cardColors, (color) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["color-option", { active: $data.newCard.cardColor === color.value }]),
                      style: vue.normalizeStyle({ background: color.value }),
                      key: color.value,
                      onClick: ($event) => $options.selectCardColor(color.value)
                    }, null, 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createCommentVNode(" 底部按钮 "),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[41] || (_cache[41] = (...args) => $options.closeAddCard && $options.closeAddCard(...args))
            }, "取消"),
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[42] || (_cache[42] = (...args) => $options.confirmAddCard && $options.confirmAddCard(...args)),
              disabled: !$options.isFormValid
            }, "确认添加", 8, ["disabled"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 银行卡详情弹窗 "),
      $options.showCardDetailModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 7,
        class: "modal-overlay",
        onClick: _cache[51] || (_cache[51] = (...args) => $options.closeCardDetailModal && $options.closeCardDetailModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content card-detail-modal",
          onClick: _cache[50] || (_cache[50] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "银行卡详情"),
            vue.createElementVNode("text", {
              class: "close-btn",
              onClick: _cache[45] || (_cache[45] = (...args) => $options.closeCardDetailModal && $options.closeCardDetailModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createCommentVNode(" 卡片预览 "),
            vue.createElementVNode(
              "view",
              {
                class: "card-preview",
                style: vue.normalizeStyle({ background: ((_q = $data.selectedCard) == null ? void 0 : _q.cardColor) || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" })
              },
              [
                vue.createElementVNode("view", { class: "preview-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "preview-brand" },
                    vue.toDisplayString((_r = $data.selectedCard) == null ? void 0 : _r.cardBrand),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "preview-type" },
                    vue.toDisplayString((_s = $data.selectedCard) == null ? void 0 : _s.cardType),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "preview-number" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "number-text" },
                    vue.toDisplayString($data.showDetailCardNumbers ? (_t = $data.selectedCard) == null ? void 0 : _t.cardNumber : $options.formatCardNumber((_u = $data.selectedCard) == null ? void 0 : _u.cardNumber)),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "preview-footer" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "preview-holder" },
                    vue.toDisplayString((_v = $data.selectedCard) == null ? void 0 : _v.cardHolder),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "preview-expiry" },
                    vue.toDisplayString($options.formatExpiryDate((_w = $data.selectedCard) == null ? void 0 : _w.expiryDate)),
                    1
                    /* TEXT */
                  )
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createCommentVNode(" 详细信息 "),
            vue.createElementVNode("view", { class: "detail-sections" }, [
              vue.createCommentVNode(" 基本信息 "),
              vue.createElementVNode("view", { class: "detail-section" }, [
                vue.createElementVNode("view", { class: "section-title" }, "基本信息"),
                vue.createElementVNode("view", { class: "info-grid" }, [
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "卡号"),
                    vue.createElementVNode("view", { class: "card-number-display" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString($data.showDetailCardNumbers ? (_x = $data.selectedCard) == null ? void 0 : _x.cardNumber : $options.formatCardNumber((_y = $data.selectedCard) == null ? void 0 : _y.cardNumber)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", {
                        class: "toggle-visibility",
                        onClick: _cache[46] || (_cache[46] = (...args) => $options.toggleDetailCardNumberVisibility && $options.toggleDetailCardNumberVisibility(...args))
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "toggle-icon" },
                          vue.toDisplayString($data.showDetailCardNumbers ? "👁️" : "👁️‍🗨️"),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "持卡人"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString((_z = $data.selectedCard) == null ? void 0 : _z.cardHolder),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "有效期"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString($options.formatExpiryDate((_A = $data.selectedCard) == null ? void 0 : _A.expiryDate)),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "CVV"),
                    vue.createElementVNode("view", { class: "card-number-display" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString($data.showDetailCVV ? (_B = $data.selectedCard) == null ? void 0 : _B.cvv : "***"),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", {
                        class: "toggle-visibility",
                        onClick: _cache[47] || (_cache[47] = (...args) => $options.toggleDetailCVVVisibility && $options.toggleDetailCVVVisibility(...args))
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "toggle-icon" },
                          vue.toDisplayString($data.showDetailCVV ? "👁️" : "👁️‍🗨️"),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ])
                ])
              ]),
              vue.createCommentVNode(" 额度信息 "),
              vue.createElementVNode("view", { class: "detail-section" }, [
                vue.createElementVNode("view", { class: "section-title" }, "额度信息"),
                vue.createElementVNode("view", { class: "info-grid" }, [
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "信用额度"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      "¥" + vue.toDisplayString(((_D = (_C = $data.selectedCard) == null ? void 0 : _C.creditLimit) == null ? void 0 : _D.toLocaleString()) || "0"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "可用额度"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value available" },
                      "¥" + vue.toDisplayString(((_F = (_E = $data.selectedCard) == null ? void 0 : _E.availableCredit) == null ? void 0 : _F.toLocaleString()) || "0"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "当前欠款"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value debt" },
                      "¥" + vue.toDisplayString(((_H = (_G = $data.selectedCard) == null ? void 0 : _G.currentBalance) == null ? void 0 : _H.toLocaleString()) || "0"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "最低还款"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value min" },
                      "¥" + vue.toDisplayString(((_J = (_I = $data.selectedCard) == null ? void 0 : _I.minPayment) == null ? void 0 : _J.toLocaleString()) || "0"),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createCommentVNode(" 账单信息 "),
              vue.createElementVNode("view", { class: "detail-section" }, [
                vue.createElementVNode("view", { class: "section-title" }, "账单信息"),
                vue.createElementVNode("view", { class: "info-grid" }, [
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "账单日"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      "每月" + vue.toDisplayString(((_K = $data.selectedCard) == null ? void 0 : _K.statementDate) || "0") + "日",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "到期还款日"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(((_L = $data.selectedCard) == null ? void 0 : _L.dueDate) || "未设置"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "年费"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      "¥" + vue.toDisplayString(((_N = (_M = $data.selectedCard) == null ? void 0 : _M.annualFee) == null ? void 0 : _N.toLocaleString()) || "0"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "卡片状态"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value status" },
                      vue.toDisplayString($options.getStatusText((_O = $data.selectedCard) == null ? void 0 : _O.cardStatus)),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 底部按钮 "),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "action-btn secondary",
              onClick: _cache[48] || (_cache[48] = (...args) => $options.closeCardDetailModal && $options.closeCardDetailModal(...args))
            }, "关闭"),
            vue.createElementVNode("button", {
              class: "action-btn primary",
              onClick: _cache[49] || (_cache[49] = (...args) => $options.editCard && $options.editCard(...args))
            }, "编辑卡片")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesCreditCardsCreditCards = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-a750c574"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/credit-cards/credit-cards.vue"]]);
  class SyncManager {
    constructor() {
      this.maxRetryCount = 3;
      this.retryInterval = 5e3;
      this.syncQueue = [];
      this.isSyncing = false;
    }
    /**
     * 初始化同步管理器
     */
    init() {
      this.loadSyncQueue();
      this.startSyncTimer();
    }
    /**
     * 加载同步队列
     */
    loadSyncQueue() {
      try {
        this.syncQueue = uni.getStorageSync("syncQueue") || [];
        formatAppLog("log", "at utils/sync.js:28", "加载同步队列:", this.syncQueue.length, "个任务");
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:30", "加载同步队列失败:", error);
        this.syncQueue = [];
      }
    }
    /**
     * 保存同步队列
     */
    saveSyncQueue() {
      try {
        uni.setStorageSync("syncQueue", this.syncQueue);
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:42", "保存同步队列失败:", error);
      }
    }
    /**
     * 添加同步任务
     * @param {string} type 任务类型
     * @param {object} data 任务数据
     */
    addSyncTask(type, data) {
      const task = {
        id: this.generateTaskId(),
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      };
      this.syncQueue.push(task);
      this.saveSyncQueue();
      formatAppLog("log", "at utils/sync.js:64", "添加同步任务:", type, task.id);
      this.processSyncQueue();
    }
    /**
     * 生成任务ID
     */
    generateTaskId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    /**
     * 开始同步定时器
     */
    startSyncTimer() {
      setInterval(() => {
        this.processSyncQueue();
      }, 3e4);
    }
    /**
     * 处理同步队列
     */
    async processSyncQueue() {
      if (this.isSyncing || this.syncQueue.length === 0) {
        return;
      }
      this.isSyncing = true;
      try {
        const networkType = await this.getNetworkType();
        if (networkType === "none") {
          formatAppLog("log", "at utils/sync.js:101", "网络不可用，跳过同步");
          return;
        }
        const pendingTasks = this.syncQueue.filter((task) => task.status === "pending");
        for (const task of pendingTasks) {
          await this.processTask(task);
        }
        this.cleanupCompletedTasks();
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:116", "处理同步队列失败:", error);
      } finally {
        this.isSyncing = false;
      }
    }
    /**
     * 处理单个任务
     * @param {object} task 任务对象
     */
    async processTask(task) {
      try {
        formatAppLog("log", "at utils/sync.js:128", "处理同步任务:", task.type, task.id);
        let success = false;
        switch (task.type) {
          case "updateAvatar":
            success = await this.syncAvatar(task.data);
            break;
          case "updateProfile":
            success = await this.syncProfile(task.data);
            break;
          case "updateUserInfo":
            success = await this.syncUserInfo(task.data);
            break;
          default:
            formatAppLog("warn", "at utils/sync.js:143", "未知的同步任务类型:", task.type);
            task.status = "failed";
            break;
        }
        if (success) {
          task.status = "completed";
          formatAppLog("log", "at utils/sync.js:150", "同步任务完成:", task.id);
        } else {
          task.retryCount++;
          if (task.retryCount >= this.maxRetryCount) {
            task.status = "failed";
            formatAppLog("error", "at utils/sync.js:155", "同步任务失败，已达到最大重试次数:", task.id);
          } else {
            formatAppLog("log", "at utils/sync.js:157", "同步任务失败，将重试:", task.id, "重试次数:", task.retryCount);
          }
        }
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:162", "处理同步任务失败:", task.id, error);
        task.retryCount++;
        if (task.retryCount >= this.maxRetryCount) {
          task.status = "failed";
        }
      }
      this.saveSyncQueue();
    }
    /**
     * 同步头像
     * @param {object} userInfo 用户信息
     */
    async syncAvatar(userInfo) {
      try {
        const response = await this.request({
          url: "https://api.abchina.com/user/avatar",
          method: "PUT",
          data: {
            avatar: userInfo.avatar,
            avatarUpdateTime: userInfo.avatarUpdateTime
          }
        });
        return response.success;
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:189", "同步头像失败:", error);
        return false;
      }
    }
    /**
     * 同步用户资料
     * @param {object} profileData 资料数据
     */
    async syncProfile(profileData) {
      try {
        const response = await this.request({
          url: "https://api.abchina.com/user/profile",
          method: "PUT",
          data: profileData
        });
        return response.success;
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:208", "同步用户资料失败:", error);
        return false;
      }
    }
    /**
     * 同步用户信息
     * @param {object} userInfo 用户信息
     */
    async syncUserInfo(userInfo) {
      try {
        const response = await this.request({
          url: "https://api.abchina.com/user/info",
          method: "PUT",
          data: userInfo
        });
        return response.success;
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:227", "同步用户信息失败:", error);
        return false;
      }
    }
    /**
     * 发送请求
     * @param {object} options 请求选项
     */
    request(options) {
      return new Promise((resolve, reject) => {
        uni.request({
          ...options,
          header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${uni.getStorageSync("token") || ""}`,
            ...options.header
          },
          success: (res) => {
            if (res.data.code === 0) {
              resolve({ success: true, data: res.data.data });
            } else {
              reject(new Error(res.data.message || "请求失败"));
            }
          },
          fail: reject
        });
      });
    }
    /**
     * 获取网络类型
     */
    getNetworkType() {
      return new Promise((resolve) => {
        uni.getNetworkType({
          success: (res) => resolve(res.networkType),
          fail: () => resolve("unknown")
        });
      });
    }
    /**
     * 清理已完成的任务
     */
    cleanupCompletedTasks() {
      const beforeCount = this.syncQueue.length;
      this.syncQueue = this.syncQueue.filter((task) => task.status === "pending");
      const afterCount = this.syncQueue.length;
      if (beforeCount !== afterCount) {
        this.saveSyncQueue();
        formatAppLog("log", "at utils/sync.js:279", "清理已完成的任务:", beforeCount - afterCount, "个");
      }
    }
    /**
     * 获取同步状态
     */
    getSyncStatus() {
      const pending = this.syncQueue.filter((task) => task.status === "pending").length;
      const failed = this.syncQueue.filter((task) => task.status === "failed").length;
      return {
        pending,
        failed,
        total: this.syncQueue.length,
        isSyncing: this.isSyncing
      };
    }
    /**
     * 手动触发同步
     */
    async manualSync() {
      if (this.isSyncing) {
        uni.showToast({
          title: "正在同步中...",
          icon: "none"
        });
        return;
      }
      uni.showLoading({
        title: "同步中..."
      });
      try {
        await this.processSyncQueue();
        const status = this.getSyncStatus();
        if (status.pending === 0) {
          uni.showToast({
            title: "同步完成",
            icon: "success"
          });
        } else {
          uni.showToast({
            title: `还有${status.pending}个任务待同步`,
            icon: "none"
          });
        }
      } catch (error) {
        formatAppLog("error", "at utils/sync.js:330", "手动同步失败:", error);
        uni.showToast({
          title: "同步失败",
          icon: "none"
        });
      } finally {
        uni.hideLoading();
      }
    }
  }
  const syncManager = new SyncManager();
  const _sfc_main$3 = {
    data() {
      return {
        profileData: {
          avatar: "",
          realName: "",
          nickname: "",
          gender: "男",
          birthDate: "",
          phone: "",
          email: "",
          idCard: "",
          address: ""
        },
        genderOptions: ["男", "女"],
        genderIndex: 0
      };
    },
    onLoad() {
      this.loadProfileData();
      syncManager.init();
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      loadProfileData() {
        try {
          const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
          if (userInfo) {
            this.profileData = { ...this.profileData, ...userInfo };
            this.setPickerIndexes();
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:171", "加载个人资料失败:", error);
        }
      },
      setPickerIndexes() {
        this.genderIndex = this.genderOptions.indexOf(this.profileData.gender) || 0;
      },
      changeAvatar() {
        uni.showActionSheet({
          itemList: ["拍照", "从相册选择"],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.takePhoto();
            } else if (res.tapIndex === 1) {
              this.chooseFromAlbum();
            }
          }
        });
      },
      // 拍照功能
      takePhoto() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["camera"],
          success: (res) => {
            this.handleImageSelected(res.tempFilePaths[0]);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/user/profile.vue:205", "拍照失败:", error);
            uni.showToast({
              title: "拍照失败，请重试",
              icon: "none"
            });
          }
        });
      },
      // 从相册选择
      chooseFromAlbum() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album"],
          success: (res) => {
            this.handleImageSelected(res.tempFilePaths[0]);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/user/profile.vue:224", "选择图片失败:", error);
            uni.showToast({
              title: "选择图片失败，请重试",
              icon: "none"
            });
          }
        });
      },
      // 处理选中的图片
      async handleImageSelected(imagePath) {
        uni.showLoading({
          title: "上传中..."
        });
        try {
          const uploadResult = await this.uploadAvatarToServer(imagePath);
          if (uploadResult.success) {
            this.profileData.avatar = uploadResult.avatarUrl;
            await this.saveAvatarToStorage(uploadResult.avatarUrl);
            uni.hideLoading();
            uni.showToast({
              title: "头像更新成功",
              icon: "success",
              duration: 1500
            });
          } else {
            throw new Error(uploadResult.message || "上传失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:264", "头像上传失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: error.message || "头像上传失败",
            icon: "none"
          });
        }
      },
      // 上传头像到服务器
      uploadAvatarToServer(imagePath) {
        return new Promise((resolve, reject) => {
          uni.getNetworkType({
            success: (networkRes) => {
              if (networkRes.networkType === "none") {
                resolve({
                  success: true,
                  avatarUrl: imagePath,
                  isOffline: true
                });
                return;
              }
              uni.uploadFile({
                url: "https://api.abchina.com/user/avatar",
                filePath: imagePath,
                name: "avatar",
                header: {
                  "Authorization": `Bearer ${uni.getStorageSync("token") || ""}`
                },
                success: (res) => {
                  try {
                    const data = JSON.parse(res.data);
                    if (data.code === 0) {
                      resolve({
                        success: true,
                        avatarUrl: data.data.avatarUrl,
                        isOffline: false
                      });
                    } else {
                      reject(new Error(data.message || "上传失败"));
                    }
                  } catch (parseError) {
                    reject(new Error("服务器响应格式错误"));
                  }
                },
                fail: (error) => {
                  formatAppLog("error", "at pages/user/profile.vue:314", "上传失败:", error);
                  resolve({
                    success: true,
                    avatarUrl: imagePath,
                    isOffline: true,
                    message: "网络异常，已保存到本地"
                  });
                }
              });
            },
            fail: () => {
              resolve({
                success: true,
                avatarUrl: imagePath,
                isOffline: true
              });
            }
          });
        });
      },
      // 保存头像到本地存储和数据库
      async saveAvatarToStorage(avatarUrl) {
        try {
          let userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
          if (userInfo) {
            userInfo.avatar = avatarUrl;
            userInfo.avatarUpdateTime = (/* @__PURE__ */ new Date()).toISOString();
            uni.setStorageSync("userInfo", userInfo);
            uni.setStorageSync("currentUser", userInfo);
            await this.updateLocalDatabase(userInfo);
            if (!this.isOfflineMode) {
              await this.syncToServer(userInfo);
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:360", "保存头像失败:", error);
          throw error;
        }
      },
      // 更新本地数据库
      async updateLocalDatabase(userInfo) {
        try {
          const users2 = uni.getStorageSync("users") || [];
          const userIndex = users2.findIndex(
            (user) => user.id === userInfo.id || user.phone === userInfo.phone || user.username === userInfo.username
          );
          if (userIndex !== -1) {
            users2[userIndex].avatar = userInfo.avatar;
            users2[userIndex].avatarUpdateTime = userInfo.avatarUpdateTime;
            uni.setStorageSync("users", users2);
            formatAppLog("log", "at pages/user/profile.vue:385", "本地数据库更新成功:", userInfo.avatar);
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:388", "更新本地数据库失败:", error);
          throw error;
        }
      },
      // 同步到服务器
      async syncToServer(userInfo) {
        try {
          const response = await this.updateUserInfoAPI(userInfo);
          if (response.success) {
            formatAppLog("log", "at pages/user/profile.vue:399", "服务器同步成功");
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:402", "服务器同步失败:", error);
          syncManager.addSyncTask("updateAvatar", userInfo);
        }
      },
      // 更新用户信息API
      updateUserInfoAPI(userInfo) {
        return new Promise((resolve, reject) => {
          uni.request({
            url: "https://api.abchina.com/user/info",
            method: "PUT",
            header: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${uni.getStorageSync("token") || ""}`
            },
            data: {
              avatar: userInfo.avatar,
              avatarUpdateTime: userInfo.avatarUpdateTime
            },
            success: (res) => {
              if (res.data.code === 0) {
                resolve({ success: true, data: res.data.data });
              } else {
                reject(new Error(res.data.message || "更新失败"));
              }
            },
            fail: (error) => {
              reject(error);
            }
          });
        });
      },
      onGenderChange(e) {
        this.genderIndex = e.detail.value;
        this.profileData.gender = this.genderOptions[e.detail.value];
      },
      onBirthDateChange(e) {
        this.profileData.birthDate = e.detail.value;
      },
      async saveProfile() {
        try {
          uni.showLoading({
            title: "保存中..."
          });
          let userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
          if (userInfo) {
            userInfo = {
              ...userInfo,
              ...this.profileData,
              lastUpdateTime: (/* @__PURE__ */ new Date()).toISOString()
            };
            uni.setStorageSync("userInfo", userInfo);
            uni.setStorageSync("currentUser", userInfo);
            await this.updateLocalDatabase(userInfo);
            try {
              await this.syncProfileToServer(userInfo);
              formatAppLog("log", "at pages/user/profile.vue:471", "个人资料同步成功");
            } catch (syncError) {
              formatAppLog("error", "at pages/user/profile.vue:473", "同步失败，已加入同步队列:", syncError);
              syncManager.addSyncTask("updateProfile", userInfo);
            }
          }
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            this.goBack();
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:489", "保存个人资料失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      },
      // 同步个人资料到服务器
      async syncProfileToServer(userInfo) {
        try {
          const response = await this.updateUserInfoAPI(userInfo);
          if (!response.success) {
            throw new Error("同步失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/profile.vue:506", "同步个人资料失败:", error);
          throw error;
        }
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", {
          class: "nav-left",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "‹")
        ]),
        vue.createElementVNode("view", { class: "nav-title" }, "个人资料"),
        vue.createElementVNode("view", { class: "nav-right" }, [
          vue.createElementVNode("text", {
            class: "save-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.saveProfile && $options.saveProfile(...args))
          }, "保存")
        ])
      ]),
      vue.createElementVNode("view", { class: "profile-form" }, [
        vue.createElementVNode("view", { class: "avatar-section" }, [
          vue.createElementVNode("view", { class: "avatar-wrapper" }, [
            vue.createElementVNode("image", {
              src: $data.profileData.avatar || "/static/default-avatar.png",
              class: "avatar-image",
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", {
              class: "avatar-edit",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.changeAvatar && $options.changeAvatar(...args))
            }, [
              vue.createElementVNode("text", { class: "edit-icon" }, "📷")
            ])
          ]),
          vue.createElementVNode("text", { class: "avatar-tip" }, "点击更换头像（支持拍照和相册选择）")
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "基本信息"),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "真实姓名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.profileData.realName = $event),
                placeholder: "请输入真实姓名",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.profileData.realName]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "昵称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.profileData.nickname = $event),
                placeholder: "请输入昵称",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.profileData.nickname]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "性别"),
            vue.createElementVNode("picker", {
              class: "form-picker",
              value: $data.genderIndex,
              range: $data.genderOptions,
              onChange: _cache[5] || (_cache[5] = (...args) => $options.onGenderChange && $options.onGenderChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker-text" },
                vue.toDisplayString($data.genderOptions[$data.genderIndex]),
                1
                /* TEXT */
              )
            ], 40, ["value", "range"])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "出生日期"),
            vue.createElementVNode("picker", {
              class: "form-picker",
              mode: "date",
              value: $data.profileData.birthDate,
              onChange: _cache[6] || (_cache[6] = (...args) => $options.onBirthDateChange && $options.onBirthDateChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker-text" },
                vue.toDisplayString($data.profileData.birthDate || "请选择出生日期"),
                1
                /* TEXT */
              )
            ], 40, ["value"])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "联系方式"),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "手机号码"),
            vue.createElementVNode("view", { class: "phone-input-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input phone-input",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.profileData.phone = $event),
                  placeholder: "请输入手机号码",
                  type: "number",
                  maxlength: "11",
                  disabled: true
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.profileData.phone]
              ]),
              vue.createElementVNode("text", { class: "phone-status" }, "已验证")
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "邮箱地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.profileData.email = $event),
                placeholder: "请输入邮箱地址",
                type: "email",
                maxlength: "50"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.profileData.email]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "地址信息"),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "身份证号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.profileData.idCard = $event),
                placeholder: "请输入身份证号码",
                maxlength: "18",
                disabled: true
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.profileData.idCard]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "居住地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.profileData.address = $event),
                placeholder: "请输入详细居住地址",
                maxlength: "100"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.profileData.address]
            ])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-actions" }, [
        vue.createElementVNode("button", {
          class: "save-button",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.saveProfile && $options.saveProfile(...args))
        }, " 保存修改 ")
      ])
    ]);
  }
  const PagesUserProfile = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-f6b4f04d"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/user/profile.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        securityScore: 85,
        biometricEnabled: true,
        smsVerificationEnabled: true,
        accountLockEnabled: true,
        twoFactorEnabled: false,
        securityNotificationsEnabled: true,
        securityQuestionsSet: false,
        emergencyContactSet: false,
        transactionLimit: 5e4,
        passwordUpdateTime: "2024-01-01",
        transactionPasswordUpdateTime: "2024-01-01",
        lastUpdateTime: "2024-01-15",
        lastLoginTime: "2024-01-15 14:30:00",
        securityEventsCount: 5,
        loginDevices: [
          {
            id: 1,
            name: "iPhone 14",
            lastLogin: "2024-01-15 14:30:00",
            location: "北京市",
            status: "active",
            ip: "192.168.1.100"
          },
          {
            id: 2,
            name: "MacBook Pro",
            lastLogin: "2024-01-14 09:15:00",
            location: "北京市",
            status: "active",
            ip: "192.168.1.101"
          }
        ],
        securityRecommendations: []
      };
    },
    computed: {
      passwordStrength() {
        return "强";
      },
      isPasswordExpired() {
        const lastUpdate = new Date(this.passwordUpdateTime);
        const now = /* @__PURE__ */ new Date();
        const daysDiff = (now - lastUpdate) / (1e3 * 60 * 60 * 24);
        return daysDiff > 90;
      },
      isTransactionPasswordExpired() {
        const lastUpdate = new Date(this.transactionPasswordUpdateTime);
        const now = /* @__PURE__ */ new Date();
        const daysDiff = (now - lastUpdate) / (1e3 * 60 * 60 * 24);
        return daysDiff > 180;
      }
    },
    onLoad() {
      try {
        this.loadSecuritySettings();
        this.calculateSecurityScore();
        this.generateSecurityRecommendations();
      } catch (error) {
        formatAppLog("error", "at pages/user/security.vue:397", "安全设置页面初始化失败:", error);
        uni.showToast({
          title: "页面加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    },
    methods: {
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      // 刷新安全状态
      refreshSecurityStatus() {
        uni.showLoading({ title: "刷新中..." });
        setTimeout(() => {
          this.calculateSecurityScore();
          this.generateSecurityRecommendations();
          uni.hideLoading();
          uni.showToast({
            title: "刷新完成",
            icon: "success"
          });
        }, 1e3);
      },
      // 加载安全设置
      loadSecuritySettings() {
        try {
          const settings = uni.getStorageSync("securitySettings");
          if (settings && typeof settings === "object") {
            Object.assign(this, settings);
          }
          const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
          if (userInfo && userInfo.securitySettings && typeof userInfo.securitySettings === "object") {
            const securitySettings = userInfo.securitySettings;
            this.biometricEnabled = Boolean(securitySettings.biometricEnabled);
            this.smsVerificationEnabled = Boolean(securitySettings.smsVerificationEnabled);
            this.accountLockEnabled = Boolean(securitySettings.accountLockEnabled);
            this.twoFactorEnabled = Boolean(securitySettings.twoFactorEnabled);
            this.securityNotificationsEnabled = Boolean(securitySettings.securityNotificationsEnabled);
            this.transactionLimit = Number(securitySettings.transactionLimit) || 5e4;
            this.passwordUpdateTime = securitySettings.passwordUpdateTime || "2024-01-01";
            this.transactionPasswordUpdateTime = securitySettings.transactionPasswordUpdateTime || "2024-01-01";
            this.securityQuestionsSet = Boolean(securitySettings.securityQuestionsSet);
            this.emergencyContactSet = Boolean(securitySettings.emergencyContactSet);
            this.loginDevices = Array.isArray(securitySettings.loginDevices) ? securitySettings.loginDevices : [];
            this.securityEventsCount = Array.isArray(securitySettings.securityEvents) ? securitySettings.securityEvents.length : 0;
            if (Array.isArray(securitySettings.securityEvents) && securitySettings.securityEvents.length > 0) {
              const lastLoginEvent = securitySettings.securityEvents.filter((event) => event && event.type === "login" && event.status === "success").sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              if (lastLoginEvent && lastLoginEvent.timestamp) {
                this.lastLoginTime = new Date(lastLoginEvent.timestamp).toLocaleString();
              }
            }
          }
          formatAppLog("log", "at pages/user/security.vue:466", "安全设置加载成功");
        } catch (error) {
          formatAppLog("error", "at pages/user/security.vue:468", "加载安全设置失败:", error);
          this.biometricEnabled = false;
          this.smsVerificationEnabled = false;
          this.accountLockEnabled = false;
          this.twoFactorEnabled = false;
          this.securityNotificationsEnabled = false;
          this.transactionLimit = 5e4;
          this.passwordUpdateTime = "2024-01-01";
          this.transactionPasswordUpdateTime = "2024-01-01";
          this.securityQuestionsSet = false;
          this.emergencyContactSet = false;
          this.loginDevices = [];
          this.securityEventsCount = 0;
        }
      },
      // 保存安全设置
      saveSecuritySettings() {
        try {
          const settings = {
            biometricEnabled: this.biometricEnabled,
            smsVerificationEnabled: this.smsVerificationEnabled,
            accountLockEnabled: this.accountLockEnabled,
            twoFactorEnabled: this.twoFactorEnabled,
            securityNotificationsEnabled: this.securityNotificationsEnabled,
            transactionLimit: this.transactionLimit,
            passwordUpdateTime: this.passwordUpdateTime,
            transactionPasswordUpdateTime: this.transactionPasswordUpdateTime,
            securityQuestionsSet: this.securityQuestionsSet,
            emergencyContactSet: this.emergencyContactSet,
            loginDevices: this.loginDevices
          };
          uni.setStorageSync("securitySettings", settings);
          const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
          if (userInfo) {
            userInfo.securitySettings = {
              ...userInfo.securitySettings,
              ...settings,
              lastUpdateTime: (/* @__PURE__ */ new Date()).toISOString()
            };
            uni.setStorageSync("userInfo", userInfo);
            uni.setStorageSync("currentUser", userInfo);
            this.updateUserSecurityInDatabase(userInfo);
          }
          this.lastUpdateTime = (/* @__PURE__ */ new Date()).toLocaleDateString();
          this.calculateSecurityScore();
        } catch (error) {
          formatAppLog("error", "at pages/user/security.vue:527", "保存安全设置失败:", error);
        }
      },
      // 更新数据库中的用户安全设置
      updateUserSecurityInDatabase(userInfo) {
        try {
          const users2 = uni.getStorageSync("users") || [];
          const userIndex = users2.findIndex(
            (user) => user.id === userInfo.id || user.phone === userInfo.phone || user.username === userInfo.username
          );
          if (userIndex !== -1) {
            users2[userIndex].securitySettings = userInfo.securitySettings;
            uni.setStorageSync("users", users2);
            formatAppLog("log", "at pages/user/security.vue:550", "用户安全设置数据库更新成功");
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/security.vue:553", "更新用户安全设置数据库失败:", error);
        }
      },
      // 计算安全评分
      calculateSecurityScore() {
        let score = 0;
        score += 40;
        if (!this.isPasswordExpired)
          score += 10;
        if (!this.isTransactionPasswordExpired)
          score += 10;
        if (this.biometricEnabled)
          score += 10;
        if (this.smsVerificationEnabled)
          score += 10;
        if (this.accountLockEnabled)
          score += 5;
        if (this.twoFactorEnabled)
          score += 10;
        if (this.securityNotificationsEnabled)
          score += 5;
        if (this.securityQuestionsSet)
          score += 5;
        if (this.emergencyContactSet)
          score += 5;
        if (this.loginDevices.length <= 3)
          score += 10;
        else if (this.loginDevices.length <= 5)
          score += 5;
        this.securityScore = Math.min(100, score);
      },
      // 生成安全建议
      generateSecurityRecommendations() {
        this.securityRecommendations = [];
        if (this.isPasswordExpired) {
          this.securityRecommendations.push({
            text: "登录密码已超过90天未更新",
            action: "立即更新",
            type: "password"
          });
        }
        if (this.isTransactionPasswordExpired) {
          this.securityRecommendations.push({
            text: "交易密码已超过180天未更新",
            action: "立即更新",
            type: "transaction"
          });
        }
        if (!this.twoFactorEnabled) {
          this.securityRecommendations.push({
            text: "建议启用双重认证",
            action: "立即启用",
            type: "2fa"
          });
        }
        if (this.loginDevices.length > 5) {
          this.securityRecommendations.push({
            text: "登录设备过多，建议清理",
            action: "查看设备",
            type: "device"
          });
        }
        if (!this.securityQuestionsSet) {
          this.securityRecommendations.push({
            text: "建议设置安全问题",
            action: "立即设置",
            type: "questions"
          });
        }
      },
      // 处理安全建议
      handleRecommendation(recommendation) {
        switch (recommendation.type) {
          case "password":
            this.changeLoginPassword();
            break;
          case "transaction":
            this.changeTransactionPassword();
            break;
          case "2fa":
            this.setTwoFactorAuth();
            break;
          case "device":
            this.setLoginDevice();
            break;
          case "questions":
            this.setSecurityQuestions();
            break;
        }
      },
      // 获取登录安全计数
      getLoginSecurityCount() {
        let count = 0;
        if (!this.isPasswordExpired)
          count++;
        if (this.biometricEnabled)
          count++;
        if (this.loginDevices.length <= 3)
          count++;
        return count;
      },
      // 获取交易安全计数
      getTransactionSecurityCount() {
        let count = 0;
        if (!this.isTransactionPasswordExpired)
          count++;
        if (this.transactionLimit > 0)
          count++;
        if (this.smsVerificationEnabled)
          count++;
        return count;
      },
      // 获取账户保护计数
      getAccountProtectionCount() {
        let count = 0;
        if (this.securityQuestionsSet)
          count++;
        if (this.emergencyContactSet)
          count++;
        if (this.accountLockEnabled)
          count++;
        return count;
      },
      // 获取安全日志计数
      getSecurityLogCount() {
        return 2;
      },
      // 获取高级安全计数
      getAdvancedSecurityCount() {
        let count = 0;
        if (this.twoFactorEnabled)
          count++;
        if (this.securityNotificationsEnabled)
          count++;
        return count;
      },
      // 获取安全评分提示
      getScoreTip() {
        if (this.securityScore >= 90) {
          return "账户安全状况优秀，继续保持！";
        } else if (this.securityScore >= 70) {
          return "账户安全状况良好，建议完善安全设置";
        } else if (this.securityScore >= 50) {
          return "账户安全状况一般，请及时完善安全设置";
        } else {
          return "账户安全状况较差，请立即完善安全设置";
        }
      },
      // 修改登录密码
      changeLoginPassword() {
        uni.navigateTo({
          url: "/pages/user/change-password?type=login"
        });
      },
      // 显示密码输入界面
      showPasswordInput(type) {
        uni.showModal({
          title: type === "login" ? "修改登录密码" : "修改交易密码",
          editable: true,
          placeholderText: "请输入新密码（6-20位，包含字母和数字）",
          confirmText: "确认修改",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm && res.content) {
              this.validateAndUpdatePassword(res.content, type);
            }
          }
        });
      },
      // 验证并更新密码
      validateAndUpdatePassword(newPassword, type) {
        if (newPassword.length < 6 || newPassword.length > 20) {
          uni.showToast({
            title: "密码长度应为6-20位",
            icon: "none"
          });
          return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(newPassword)) {
          uni.showToast({
            title: "密码必须包含字母和数字",
            icon: "none"
          });
          return;
        }
        const updateTime = (/* @__PURE__ */ new Date()).toISOString();
        if (type === "login") {
          this.passwordUpdateTime = updateTime;
        } else {
          this.transactionPasswordUpdateTime = updateTime;
        }
        this.addSecurityEvent(
          type === "login" ? "password_change" : "transaction_password_change",
          `修改${type === "login" ? "登录" : "交易"}密码`
        );
        this.saveSecuritySettings();
        this.calculateSecurityScore();
        this.generateSecurityRecommendations();
        uni.showToast({
          title: `${type === "login" ? "登录" : "交易"}密码已更新`,
          icon: "success"
        });
      },
      // 添加安全事件
      addSecurityEvent(type, description) {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings) {
          if (!userInfo.securitySettings.securityEvents) {
            userInfo.securitySettings.securityEvents = [];
          }
          const newEvent = {
            id: Date.now(),
            type,
            description,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            location: "当前位置",
            ip: "192.168.1.100",
            status: "success"
          };
          userInfo.securitySettings.securityEvents.unshift(newEvent);
          if (userInfo.securitySettings.securityEvents.length > 50) {
            userInfo.securitySettings.securityEvents = userInfo.securitySettings.securityEvents.slice(0, 50);
          }
          uni.setStorageSync("userInfo", userInfo);
          uni.setStorageSync("currentUser", userInfo);
          this.updateUserSecurityInDatabase(userInfo);
        }
      },
      // 生物识别开关变化
      onBiometricChange(e) {
        this.biometricEnabled = e.detail.value;
        this.saveSecuritySettings();
        uni.showToast({
          title: this.biometricEnabled ? "已开启生物识别" : "已关闭生物识别",
          icon: "success"
        });
      },
      // 设置登录设备
      setLoginDevice() {
        uni.showModal({
          title: "登录设备管理",
          content: `当前有${this.loginDevices.length}台设备登录，建议定期检查并清理不常用的设备。`,
          confirmText: "查看详情",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              this.showDeviceList();
            }
          }
        });
      },
      // 显示设备列表
      showDeviceList() {
        const deviceList = this.loginDevices.map(
          (device) => `${device.name}
最后登录：${device.lastLogin}
位置：${device.location}
IP：${device.ip}`
        ).join("\n\n");
        uni.showModal({
          title: "登录设备列表",
          content: deviceList,
          showCancel: false,
          confirmText: "确定"
        });
      },
      // 修改交易密码
      changeTransactionPassword() {
        uni.navigateTo({
          url: "/pages/user/change-password?type=transaction"
        });
      },
      // 设置交易限额
      setTransactionLimit() {
        uni.showModal({
          title: "设置交易限额",
          content: `当前单笔交易限额：¥${this.transactionLimit.toLocaleString()}
建议根据日常消费需求设置合适的限额。`,
          confirmText: "修改限额",
          cancelText: "保持现状",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "功能开发中",
                icon: "none"
              });
            }
          }
        });
      },
      // 短信验证开关变化
      onSmsVerificationChange(e) {
        this.smsVerificationEnabled = e.detail.value;
        this.saveSecuritySettings();
        uni.showToast({
          title: this.smsVerificationEnabled ? "已开启短信验证" : "已关闭短信验证",
          icon: "success"
        });
      },
      // 设置安全问题
      setSecurityQuestions() {
        uni.showModal({
          title: "设置安全问题",
          content: "安全问题用于身份验证和密码重置，建议设置3个不同的问题。",
          confirmText: "立即设置",
          cancelText: "稍后再说",
          success: (res) => {
            if (res.confirm) {
              this.showSecurityQuestionsSetup();
            }
          }
        });
      },
      // 显示安全问题设置界面
      showSecurityQuestionsSetup() {
        const questions = [
          "您的小学名称是什么？",
          "您的第一个宠物的名字是什么？",
          "您最喜欢的颜色是什么？",
          "您的出生地是哪里？",
          "您最喜欢的食物是什么？",
          "您的第一个老师的姓名是什么？"
        ];
        uni.showActionSheet({
          itemList: questions,
          success: (res) => {
            const selectedQuestion = questions[res.tapIndex];
            this.setSecurityQuestionAnswer(selectedQuestion);
          }
        });
      },
      // 设置安全问题答案
      setSecurityQuestionAnswer(question) {
        uni.showModal({
          title: "设置安全问题",
          content: `问题：${question}`,
          editable: true,
          placeholderText: "请输入答案",
          confirmText: "确认",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm && res.content) {
              this.saveSecurityQuestion(question, res.content);
            }
          }
        });
      },
      // 保存安全问题
      saveSecurityQuestion(question, answer) {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings) {
          if (!userInfo.securitySettings.securityQuestions) {
            userInfo.securitySettings.securityQuestions = [];
          }
          userInfo.securitySettings.securityQuestions.push({
            question,
            answer
          });
          if (userInfo.securitySettings.securityQuestions.length >= 3) {
            userInfo.securitySettings.securityQuestionsSet = true;
            this.securityQuestionsSet = true;
          }
          uni.setStorageSync("userInfo", userInfo);
          uni.setStorageSync("currentUser", userInfo);
          this.updateUserSecurityInDatabase(userInfo);
          this.addSecurityEvent("security_question_set", "设置安全问题");
          this.calculateSecurityScore();
          this.generateSecurityRecommendations();
          uni.showToast({
            title: "安全问题已设置",
            icon: "success"
          });
        }
      },
      // 设置紧急联系人
      setEmergencyContact() {
        uni.showModal({
          title: "设置紧急联系人",
          content: "紧急联系人用于账户异常情况下的身份验证和通知。",
          confirmText: "立即设置",
          cancelText: "稍后再说",
          success: (res) => {
            if (res.confirm) {
              this.showEmergencyContactSetup();
            }
          }
        });
      },
      // 显示紧急联系人设置界面
      showEmergencyContactSetup() {
        uni.showModal({
          title: "设置紧急联系人",
          content: "请输入紧急联系人信息",
          editable: true,
          placeholderText: "请输入联系人姓名",
          confirmText: "下一步",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm && res.content) {
              this.setEmergencyContactPhone(res.content);
            }
          }
        });
      },
      // 设置紧急联系人电话
      setEmergencyContactPhone(name) {
        uni.showModal({
          title: "设置紧急联系人",
          content: `联系人：${name}`,
          editable: true,
          placeholderText: "请输入手机号码",
          confirmText: "下一步",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm && res.content) {
              this.setEmergencyContactRelationship(name, res.content);
            }
          }
        });
      },
      // 设置紧急联系人关系
      setEmergencyContactRelationship(name, phone) {
        const relationships = ["父亲", "母亲", "配偶", "子女", "兄弟姐妹", "朋友", "其他"];
        uni.showActionSheet({
          itemList: relationships,
          success: (res) => {
            const relationship = relationships[res.tapIndex];
            this.saveEmergencyContact(name, phone, relationship);
          }
        });
      },
      // 保存紧急联系人
      saveEmergencyContact(name, phone, relationship) {
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          uni.showToast({
            title: "请输入正确的手机号码",
            icon: "none"
          });
          return;
        }
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings) {
          userInfo.securitySettings.emergencyContact = {
            name,
            phone,
            relationship
          };
          userInfo.securitySettings.emergencyContactSet = true;
          this.emergencyContactSet = true;
          uni.setStorageSync("userInfo", userInfo);
          uni.setStorageSync("currentUser", userInfo);
          this.updateUserSecurityInDatabase(userInfo);
          this.addSecurityEvent("emergency_contact_set", "设置紧急联系人");
          this.calculateSecurityScore();
          this.generateSecurityRecommendations();
          uni.showToast({
            title: "紧急联系人已设置",
            icon: "success"
          });
        }
      },
      // 账户锁定开关变化
      onAccountLockChange(e) {
        this.accountLockEnabled = e.detail.value;
        this.saveSecuritySettings();
        uni.showToast({
          title: this.accountLockEnabled ? "已开启账户锁定" : "已关闭账户锁定",
          icon: "success"
        });
      },
      // 双重认证开关变化
      onTwoFactorChange(e) {
        this.twoFactorEnabled = e.detail.value;
        this.saveSecuritySettings();
        uni.showToast({
          title: this.twoFactorEnabled ? "已启用双重认证" : "已关闭双重认证",
          icon: "success"
        });
      },
      // 安全通知开关变化
      onSecurityNotificationsChange(e) {
        this.securityNotificationsEnabled = e.detail.value;
        this.saveSecuritySettings();
        uni.showToast({
          title: this.securityNotificationsEnabled ? "已启用安全通知" : "已关闭安全通知",
          icon: "success"
        });
      },
      // 设置双重认证
      setTwoFactorAuth() {
        if (this.twoFactorEnabled) {
          uni.showModal({
            title: "双重认证",
            content: "双重认证已启用，建议使用Google Authenticator等应用。",
            showCancel: false,
            confirmText: "确定"
          });
        } else {
          uni.showModal({
            title: "启用双重认证",
            content: "双重认证可以显著提高账户安全性，建议启用。",
            confirmText: "立即启用",
            cancelText: "稍后再说",
            success: (res) => {
              if (res.confirm) {
                this.twoFactorEnabled = true;
                this.saveSecuritySettings();
              }
            }
          });
        }
      },
      // 设置安全通知
      setSecurityNotifications() {
        uni.showModal({
          title: "安全通知设置",
          content: "安全通知可以及时提醒您账户的异常活动。",
          confirmText: "确定",
          showCancel: false
        });
      },
      // 查看登录记录
      viewLoginHistory() {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings && userInfo.securitySettings.securityEvents) {
          const loginEvents = userInfo.securitySettings.securityEvents.filter((event) => event.type === "login").slice(0, 10);
          if (loginEvents.length === 0) {
            uni.showToast({
              title: "暂无登录记录",
              icon: "none"
            });
            return;
          }
          const loginHistory = loginEvents.map((event) => {
            const date = new Date(event.timestamp).toLocaleString();
            const status = event.status === "success" ? "成功" : "失败";
            return `${date}
位置：${event.location}
IP：${event.ip}
状态：${status}`;
          }).join("\n\n");
          uni.showModal({
            title: "登录记录",
            content: loginHistory,
            showCancel: false,
            confirmText: "确定"
          });
        } else {
          uni.showToast({
            title: "暂无登录记录",
            icon: "none"
          });
        }
      },
      // 查看安全事件
      viewSecurityEvents() {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings && userInfo.securitySettings.securityEvents) {
          const securityEvents = userInfo.securitySettings.securityEvents.slice(0, 15);
          if (securityEvents.length === 0) {
            uni.showToast({
              title: "暂无安全事件",
              icon: "none"
            });
            return;
          }
          const eventsList = securityEvents.map((event) => {
            const date = new Date(event.timestamp).toLocaleString();
            const status = event.status === "success" ? "成功" : "失败";
            return `${date}
事件：${event.description}
位置：${event.location}
状态：${status}`;
          }).join("\n\n");
          uni.showModal({
            title: "安全事件记录",
            content: eventsList,
            showCancel: false,
            confirmText: "确定"
          });
        } else {
          uni.showToast({
            title: "暂无安全事件",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "security-page" }, [
      vue.createCommentVNode(" 顶部导航栏 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", {
          class: "nav-left",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "‹")
        ]),
        vue.createElementVNode("view", { class: "nav-title" }, "安全设置"),
        vue.createElementVNode("view", { class: "nav-right" }, [
          vue.createElementVNode("text", {
            class: "refresh-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.refreshSecurityStatus && $options.refreshSecurityStatus(...args))
          }, "🔄")
        ])
      ]),
      vue.createCommentVNode(" 安全状态概览 "),
      vue.createElementVNode("view", { class: "security-overview" }, [
        vue.createElementVNode("view", { class: "overview-header" }, [
          vue.createElementVNode("text", { class: "overview-title" }, "账户安全评分"),
          vue.createElementVNode("view", { class: "security-score" }, [
            vue.createElementVNode(
              "text",
              { class: "score-number" },
              vue.toDisplayString($data.securityScore),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "score-unit" }, "分")
          ])
        ]),
        vue.createElementVNode("view", { class: "score-bar" }, [
          vue.createElementVNode(
            "view",
            {
              class: "score-progress",
              style: vue.normalizeStyle({ width: $data.securityScore / 100 * 100 + "%" })
            },
            null,
            4
            /* STYLE */
          )
        ]),
        vue.createElementVNode(
          "text",
          { class: "score-tip" },
          vue.toDisplayString($options.getScoreTip()),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "score-details" }, [
          vue.createElementVNode(
            "text",
            { class: "detail-item" },
            "密码强度：" + vue.toDisplayString($options.passwordStrength),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "detail-item" },
            "设备数量：" + vue.toDisplayString($data.loginDevices.length) + "台",
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "detail-item" },
            "最后更新：" + vue.toDisplayString($data.lastUpdateTime),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 安全功能列表 "),
      vue.createElementVNode("view", { class: "security-sections" }, [
        vue.createCommentVNode(" 登录安全 "),
        vue.createElementVNode("view", { class: "security-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode("text", { class: "title-text" }, "登录安全"),
            vue.createElementVNode(
              "text",
              { class: "section-count" },
              vue.toDisplayString($options.getLoginSecurityCount()) + "/3",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "security-list" }, [
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.changeLoginPassword && $options.changeLoginPassword(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔐"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "登录密码"),
                  vue.createElementVNode("text", { class: "item-desc" }, "定期更换密码提高安全性"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-update-time" },
                    "上次更新：" + vue.toDisplayString($data.passwordUpdateTime),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["item-status", { "warning": $options.isPasswordExpired }])
                  },
                  vue.toDisplayString($options.isPasswordExpired ? "需更新" : "已设置"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[4] || (_cache[4] = (...args) => _ctx.toggleBiometricLogin && _ctx.toggleBiometricLogin(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "👆"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "生物识别登录"),
                  vue.createElementVNode("text", { class: "item-desc" }, "指纹/面容识别快速登录"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.biometricEnabled ? "已启用" : "未启用"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("switch", {
                  checked: $data.biometricEnabled,
                  onChange: _cache[3] || (_cache[3] = (...args) => $options.onBiometricChange && $options.onBiometricChange(...args)),
                  color: "#4caf50"
                }, null, 40, ["checked"])
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.setLoginDevice && $options.setLoginDevice(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "📱"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "登录设备管理"),
                  vue.createElementVNode("text", { class: "item-desc" }, "管理已登录的设备"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-device-info" },
                    vue.toDisplayString($data.loginDevices.length) + "台设备在线",
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  { class: "device-count" },
                  vue.toDisplayString($data.loginDevices.length) + "台",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 交易安全 "),
        vue.createElementVNode("view", { class: "security-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode("text", { class: "title-text" }, "交易安全"),
            vue.createElementVNode(
              "text",
              { class: "section-count" },
              vue.toDisplayString($options.getTransactionSecurityCount()) + "/3",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "security-list" }, [
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.changeTransactionPassword && $options.changeTransactionPassword(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "💳"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "交易密码"),
                  vue.createElementVNode("text", { class: "item-desc" }, "用于重要交易验证"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-update-time" },
                    "上次更新：" + vue.toDisplayString($data.transactionPasswordUpdateTime),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["item-status", { "warning": $options.isTransactionPasswordExpired }])
                  },
                  vue.toDisplayString($options.isTransactionPasswordExpired ? "需更新" : "已设置"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.setTransactionLimit && $options.setTransactionLimit(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "💰"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "交易限额"),
                  vue.createElementVNode("text", { class: "item-desc" }, "设置单笔和日累计限额"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-limit-info" },
                    "当前限额：¥" + vue.toDisplayString($data.transactionLimit.toLocaleString()),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  { class: "item-status" },
                  "¥" + vue.toDisplayString($data.transactionLimit.toLocaleString()),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[9] || (_cache[9] = (...args) => _ctx.toggleSmsVerification && _ctx.toggleSmsVerification(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "📱"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "短信验证"),
                  vue.createElementVNode("text", { class: "item-desc" }, "重要操作需短信验证"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.smsVerificationEnabled ? "已启用" : "未启用"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("switch", {
                  checked: $data.smsVerificationEnabled,
                  onChange: _cache[8] || (_cache[8] = (...args) => $options.onSmsVerificationChange && $options.onSmsVerificationChange(...args)),
                  color: "#4caf50"
                }, null, 40, ["checked"])
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 账户保护 "),
        vue.createElementVNode("view", { class: "security-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode("text", { class: "title-text" }, "账户保护"),
            vue.createElementVNode(
              "text",
              { class: "section-count" },
              vue.toDisplayString($options.getAccountProtectionCount()) + "/3",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "security-list" }, [
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.setSecurityQuestions && $options.setSecurityQuestions(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "❓"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "安全问题"),
                  vue.createElementVNode("text", { class: "item-desc" }, "设置安全问题用于身份验证"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.securityQuestionsSet ? "已设置3个问题" : "未设置"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["item-status", { "warning": !$data.securityQuestionsSet }])
                  },
                  vue.toDisplayString($data.securityQuestionsSet ? "已设置" : "未设置"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.setEmergencyContact && $options.setEmergencyContact(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🚨"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "紧急联系人"),
                  vue.createElementVNode("text", { class: "item-desc" }, "设置紧急情况联系人"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.emergencyContactSet ? "已设置联系人" : "未设置"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["item-status", { "warning": !$data.emergencyContactSet }])
                  },
                  vue.toDisplayString($data.emergencyContactSet ? "已设置" : "未设置"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[13] || (_cache[13] = (...args) => _ctx.toggleAccountLock && _ctx.toggleAccountLock(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔒"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "账户锁定"),
                  vue.createElementVNode("text", { class: "item-desc" }, "异常登录时自动锁定账户"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.accountLockEnabled ? "已启用" : "未启用"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("switch", {
                  checked: $data.accountLockEnabled,
                  onChange: _cache[12] || (_cache[12] = (...args) => $options.onAccountLockChange && $options.onAccountLockChange(...args)),
                  color: "#4caf50"
                }, null, 40, ["checked"])
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 安全日志 "),
        vue.createElementVNode("view", { class: "security-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode("text", { class: "title-text" }, "安全日志"),
            vue.createElementVNode(
              "text",
              { class: "section-count" },
              vue.toDisplayString($options.getSecurityLogCount()) + "/2",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "security-list" }, [
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.viewLoginHistory && $options.viewLoginHistory(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "📋"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "登录记录"),
                  vue.createElementVNode("text", { class: "item-desc" }, "查看账户登录历史"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-log-info" },
                    "最近登录：" + vue.toDisplayString($data.lastLoginTime),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.viewSecurityEvents && $options.viewSecurityEvents(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔍"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "安全事件"),
                  vue.createElementVNode("text", { class: "item-desc" }, "查看安全相关事件记录"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-log-info" },
                    vue.toDisplayString($data.securityEventsCount) + "个事件",
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("text", { class: "arrow" }, ">")
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 高级安全设置 "),
        vue.createElementVNode("view", { class: "security-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, [
            vue.createElementVNode("text", { class: "title-text" }, "高级安全设置"),
            vue.createElementVNode(
              "text",
              { class: "section-count" },
              vue.toDisplayString($options.getAdvancedSecurityCount()) + "/2",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "security-list" }, [
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[17] || (_cache[17] = (...args) => $options.setTwoFactorAuth && $options.setTwoFactorAuth(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔐"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "双重认证"),
                  vue.createElementVNode("text", { class: "item-desc" }, "Google Authenticator等2FA应用"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.twoFactorEnabled ? "已启用" : "未启用"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("switch", {
                  checked: $data.twoFactorEnabled,
                  onChange: _cache[16] || (_cache[16] = (...args) => $options.onTwoFactorChange && $options.onTwoFactorChange(...args)),
                  color: "#4caf50"
                }, null, 40, ["checked"])
              ])
            ]),
            vue.createElementVNode("view", {
              class: "security-item",
              onClick: _cache[19] || (_cache[19] = (...args) => $options.setSecurityNotifications && $options.setSecurityNotifications(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔔"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "安全通知"),
                  vue.createElementVNode("text", { class: "item-desc" }, "异常活动实时通知"),
                  vue.createElementVNode(
                    "text",
                    { class: "item-status-text" },
                    vue.toDisplayString($data.securityNotificationsEnabled ? "已启用" : "未启用"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                vue.createElementVNode("switch", {
                  checked: $data.securityNotificationsEnabled,
                  onChange: _cache[18] || (_cache[18] = (...args) => $options.onSecurityNotificationsChange && $options.onSecurityNotificationsChange(...args)),
                  color: "#4caf50"
                }, null, 40, ["checked"])
              ])
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 安全提示 "),
      vue.createElementVNode("view", { class: "security-tips" }, [
        vue.createElementVNode("view", { class: "tips-header" }, [
          vue.createElementVNode("text", { class: "tips-icon" }, "💡"),
          vue.createElementVNode("text", { class: "tips-title" }, "安全提示")
        ]),
        vue.createElementVNode("view", { class: "tips-content" }, [
          vue.createElementVNode("text", { class: "tip-item" }, "• 定期更换密码，不要使用简单密码"),
          vue.createElementVNode("text", { class: "tip-item" }, "• 不要在公共场所登录账户"),
          vue.createElementVNode("text", { class: "tip-item" }, "• 及时关注账户异常活动"),
          vue.createElementVNode("text", { class: "tip-item" }, "• 保护好个人信息，不要泄露给他人"),
          vue.createElementVNode("text", { class: "tip-item" }, "• 启用双重认证提高账户安全性")
        ])
      ]),
      vue.createCommentVNode(" 安全建议 "),
      $data.securityRecommendations.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "security-recommendations"
      }, [
        vue.createElementVNode("view", { class: "recommendations-header" }, [
          vue.createElementVNode("text", { class: "recommendations-icon" }, "⚠️"),
          vue.createElementVNode("text", { class: "recommendations-title" }, "安全建议")
        ]),
        vue.createElementVNode("view", { class: "recommendations-content" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.securityRecommendations, (rec, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "recommendation-item",
                key: index,
                onClick: ($event) => $options.handleRecommendation(rec)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "recommendation-text" },
                  vue.toDisplayString(rec.text),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "recommendation-action" },
                  vue.toDisplayString(rec.action),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserSecurity = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-b74f3c40"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/user/security.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        type: "login",
        // 'login' or 'transaction'
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        passwordStrengthText: "很弱",
        passwordStrengthClass: "weak",
        userInfo: null,
        canSave: false
      };
    },
    computed: {
      pageTitle() {
        return this.type === "login" ? "修改登录密码" : "修改交易密码";
      }
    },
    onLoad(options) {
      if (options.type) {
        this.type = options.type;
      }
      this.loadUserInfo();
    },
    watch: {
      currentPassword() {
        this.checkCanSave();
      },
      newPassword() {
        this.checkPasswordStrength();
        this.checkCanSave();
      },
      confirmPassword() {
        this.checkCanSave();
      }
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      loadUserInfo() {
        this.userInfo = getUserInfo();
      },
      checkPasswordStrength() {
        const password = this.newPassword;
        let strength = 0;
        if (password.length >= 6)
          strength++;
        if (/[a-zA-Z]/.test(password))
          strength++;
        if (/\d/.test(password))
          strength++;
        if (/[^a-zA-Z0-9]/.test(password))
          strength++;
        if (password.length < 6) {
          this.passwordStrengthText = "很弱";
          this.passwordStrengthClass = "very-weak";
        } else if (strength <= 2) {
          this.passwordStrengthText = "弱";
          this.passwordStrengthClass = "weak";
        } else if (strength === 3) {
          this.passwordStrengthText = "中";
          this.passwordStrengthClass = "medium";
        } else {
          this.passwordStrengthText = "强";
          this.passwordStrengthClass = "strong";
        }
      },
      validateCurrentPassword() {
        if (!this.currentPassword) {
          uni.showToast({ title: "请输入当前密码", icon: "none" });
          return false;
        }
        return true;
      },
      validateNewPasswords() {
        if (!this.newPassword) {
          uni.showToast({ title: "请输入新密码", icon: "none" });
          return false;
        }
        if (this.newPassword.length < 6 || this.newPassword.length > 20) {
          uni.showToast({ title: "新密码长度应为6-20位", icon: "none" });
          return false;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(this.newPassword)) {
          uni.showToast({ title: "新密码必须包含字母和数字", icon: "none" });
          return false;
        }
        if (this.newPassword !== this.confirmPassword) {
          uni.showToast({ title: "两次输入的新密码不一致", icon: "none" });
          return false;
        }
        if (this.newPassword === this.currentPassword) {
          uni.showToast({ title: "新密码不能与当前密码相同", icon: "none" });
          return false;
        }
        return true;
      },
      checkCanSave() {
        this.canSave = this.currentPassword && this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword && this.newPassword.length >= 6 && this.newPassword.length <= 20 && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(this.newPassword) && this.newPassword !== this.currentPassword;
      },
      async saveNewPassword() {
        if (!this.validateCurrentPassword() || !this.validateNewPasswords()) {
          return;
        }
        uni.showLoading({ title: "修改中..." });
        try {
          const currentPasswordField = this.type === "login" ? "password" : "transactionPassword";
          if (this.userInfo[currentPasswordField] !== this.currentPassword) {
            uni.hideLoading();
            uni.showToast({ title: "当前密码错误", icon: "none" });
            return;
          }
          let updatedUserInfo = { ...this.userInfo };
          if (!updatedUserInfo.securitySettings) {
            updatedUserInfo.securitySettings = {};
          }
          if (this.type === "login") {
            updatedUserInfo.password = this.newPassword;
            updatedUserInfo.securitySettings.passwordUpdateTime = (/* @__PURE__ */ new Date()).toISOString();
            this.addSecurityEvent("password_change", "修改登录密码");
          } else {
            updatedUserInfo.transactionPassword = this.newPassword;
            updatedUserInfo.securitySettings.transactionPasswordUpdateTime = (/* @__PURE__ */ new Date()).toISOString();
            this.addSecurityEvent("transaction_password_change", "修改交易密码");
          }
          uni.setStorageSync("userInfo", updatedUserInfo);
          uni.setStorageSync("currentUser", updatedUserInfo);
          await this.updateLocalDatabase(updatedUserInfo);
          this.userInfo = updatedUserInfo;
          this.currentPassword = "";
          this.newPassword = "";
          this.confirmPassword = "";
          this.canSave = false;
          uni.hideLoading();
          uni.showToast({ title: `${this.pageTitle}成功`, icon: "success" });
          setTimeout(() => {
            this.goBack();
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/user/change-password.vue:237", "修改密码失败:", error);
          uni.hideLoading();
          uni.showToast({ title: `修改${this.pageTitle}失败`, icon: "none" });
        }
      },
      async updateLocalDatabase(userInfo) {
        try {
          const response = await uni.request({
            url: "/db/user.json",
            method: "GET"
          });
          if (response.data && Array.isArray(response.data)) {
            const users2 = response.data;
            const userIndex = users2.findIndex((user) => user.id === userInfo.id);
            if (userIndex !== -1) {
              users2[userIndex] = { ...users2[userIndex], ...userInfo };
              uni.setStorageSync("users_backup", users2);
              formatAppLog("log", "at pages/user/change-password.vue:260", "本地数据库密码更新成功");
            }
          } else {
            const users2 = uni.getStorageSync("users") || [];
            const userIndex = users2.findIndex((user) => user.id === userInfo.id);
            if (userIndex !== -1) {
              users2[userIndex] = { ...users2[userIndex], ...userInfo };
              uni.setStorageSync("users", users2);
              formatAppLog("log", "at pages/user/change-password.vue:269", "本地存储密码更新成功");
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/change-password.vue:273", "更新本地数据库失败:", error);
          try {
            const users2 = uni.getStorageSync("users") || [];
            const userIndex = users2.findIndex((user) => user.id === userInfo.id);
            if (userIndex !== -1) {
              users2[userIndex] = { ...users2[userIndex], ...userInfo };
              uni.setStorageSync("users", users2);
              formatAppLog("log", "at pages/user/change-password.vue:281", "降级到本地存储更新成功");
            }
          } catch (fallbackError) {
            formatAppLog("error", "at pages/user/change-password.vue:284", "本地存储更新也失败:", fallbackError);
            throw fallbackError;
          }
        }
      },
      addSecurityEvent(type, description) {
        const userInfo = uni.getStorageSync("userInfo") || uni.getStorageSync("currentUser");
        if (userInfo && userInfo.securitySettings) {
          if (!userInfo.securitySettings.securityEvents) {
            userInfo.securitySettings.securityEvents = [];
          }
          const newEvent = {
            id: Date.now(),
            type,
            description,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            location: "当前位置",
            ip: "192.168.1.100",
            status: "success"
          };
          userInfo.securitySettings.securityEvents.unshift(newEvent);
          if (userInfo.securitySettings.securityEvents.length > 50) {
            userInfo.securitySettings.securityEvents = userInfo.securitySettings.securityEvents.slice(0, 50);
          }
          uni.setStorageSync("userInfo", userInfo);
          uni.setStorageSync("currentUser", userInfo);
          this.updateLocalDatabase(userInfo);
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-password-page" }, [
      vue.createCommentVNode(" 顶部导航栏 "),
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", {
          class: "nav-left",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "‹")
        ]),
        vue.createElementVNode(
          "view",
          { class: "nav-title" },
          vue.toDisplayString($options.pageTitle),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "nav-right" })
      ]),
      vue.createCommentVNode(" 密码修改表单 "),
      vue.createElementVNode("view", { class: "password-form" }, [
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "当前密码"),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                ref: "currentPasswordInput",
                type: "password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.currentPassword = $event),
                placeholder: "请输入当前密码",
                maxlength: "20",
                class: "password-input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.currentPassword]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "新密码"),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                ref: "newPasswordInput",
                type: "password",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.newPassword = $event),
                placeholder: "请输入新密码（6-20位，包含字母和数字）",
                maxlength: "20",
                class: "password-input",
                onInput: _cache[3] || (_cache[3] = (...args) => $options.checkPasswordStrength && $options.checkPasswordStrength(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.newPassword]
            ]),
            vue.createElementVNode("view", { class: "password-strength" }, [
              vue.createTextVNode(" 密码强度： "),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["strength-text", $data.passwordStrengthClass])
                },
                vue.toDisplayString($data.passwordStrengthText),
                3
                /* TEXT, CLASS */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "确认新密码"),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                ref: "confirmPasswordInput",
                type: "password",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.confirmPassword = $event),
                placeholder: "请再次输入新密码",
                maxlength: "20",
                class: "password-input",
                onInput: _cache[5] || (_cache[5] = (...args) => $options.validateNewPasswords && $options.validateNewPasswords(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.confirmPassword]
            ])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "save-button",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.saveNewPassword && $options.saveNewPassword(...args)),
          disabled: !$data.canSave
        }, " 确认修改 ", 8, ["disabled"])
      ]),
      vue.createElementVNode("view", { class: "password-tips" }, [
        vue.createElementVNode("text", { class: "tips-title" }, "密码设置建议："),
        vue.createElementVNode("text", { class: "tip-item" }, "• 密码长度应为6-20位"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 必须包含字母和数字"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 建议包含特殊字符（如@$!%*#?&）"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 请勿使用与个人信息相关的简单密码"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 定期更换密码，提高账户安全性")
      ])
    ]);
  }
  const PagesUserChangePassword = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-df75db25"], ["__file", "E:/Vue项目/专高六/1/项目/src/pages/user/change-password.vue"]]);
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
  __definePage("pages/water/water", PagesWaterWater);
  __definePage("pages/recharge/recharge", PagesRechargeRecharge);
  __definePage("pages/government/government", PagesGovernmentGovernment);
  __definePage("pages/games/games", PagesGamesGames);
  __definePage("pages/transfer/history", PagesTransferHistory);
  __definePage("pages/credit-card/credit-card", PagesCreditCardCreditCard);
  __definePage("pages/balance/balance", PagesBalanceBalance);
  __definePage("pages/loan/loan", PagesLoanLoan);
  __definePage("pages/credit-cards/credit-cards", PagesCreditCardsCreditCards);
  __definePage("pages/user/profile", PagesUserProfile);
  __definePage("pages/user/security", PagesUserSecurity);
  __definePage("pages/user/change-password", PagesUserChangePassword);
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
  const THEME_STORAGE_KEY = "app_theme";
  const themes = {
    light: {
      name: "浅色主题",
      id: "light",
      colors: {
        primary: "#4caf50",
        primaryDark: "#2e7d32",
        primaryLight: "#81c784",
        secondary: "#ff9800",
        secondaryDark: "#f57c00",
        background: "#f5f5f5",
        surface: "#ffffff",
        surfaceVariant: "#f8f9fa",
        text: "#333333",
        textSecondary: "#666666",
        textDisabled: "#999999",
        border: "#e0e0e0",
        borderLight: "#f0f0f0",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
        shadow: "rgba(0, 0, 0, 0.1)",
        shadowDark: "rgba(0, 0, 0, 0.2)"
      },
      gradients: {
        primary: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
        secondary: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        success: "linear-gradient(135deg, #388e3c 0%, #4caf50 100%)",
        warning: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        error: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
      }
    },
    dark: {
      name: "深色主题",
      id: "dark",
      colors: {
        primary: "#66bb6a",
        primaryDark: "#4caf50",
        primaryLight: "#81c784",
        secondary: "#ffb74d",
        secondaryDark: "#ff9800",
        background: "#121212",
        surface: "#1e1e1e",
        surfaceVariant: "#2d2d2d",
        text: "#ffffff",
        textSecondary: "#b3b3b3",
        textDisabled: "#666666",
        border: "#333333",
        borderLight: "#2d2d2d",
        success: "#66bb6a",
        warning: "#ffb74d",
        error: "#f44336",
        info: "#42a5f5",
        shadow: "rgba(0, 0, 0, 0.3)",
        shadowDark: "rgba(0, 0, 0, 0.5)"
      },
      gradients: {
        primary: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
        secondary: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
        success: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
        warning: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
        error: "linear-gradient(135deg, #f44336 0%, #e57373 100%)"
      }
    },
    blue: {
      name: "蓝色主题",
      id: "blue",
      colors: {
        primary: "#2196f3",
        primaryDark: "#1976d2",
        primaryLight: "#64b5f6",
        secondary: "#ff9800",
        secondaryDark: "#f57c00",
        background: "#f3f7ff",
        surface: "#ffffff",
        surfaceVariant: "#f8faff",
        text: "#333333",
        textSecondary: "#666666",
        textDisabled: "#999999",
        border: "#e3f2fd",
        borderLight: "#f0f7ff",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
        shadow: "rgba(33, 150, 243, 0.1)",
        shadowDark: "rgba(33, 150, 243, 0.2)"
      },
      gradients: {
        primary: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
        secondary: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        success: "linear-gradient(135deg, #388e3c 0%, #4caf50 100%)",
        warning: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        error: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
      }
    },
    purple: {
      name: "紫色主题",
      id: "purple",
      colors: {
        primary: "#9c27b0",
        primaryDark: "#7b1fa2",
        primaryLight: "#ba68c8",
        secondary: "#ff9800",
        secondaryDark: "#f57c00",
        background: "#faf5ff",
        surface: "#ffffff",
        surfaceVariant: "#f8f4ff",
        text: "#333333",
        textSecondary: "#666666",
        textDisabled: "#999999",
        border: "#e1bee7",
        borderLight: "#f3e5f5",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
        shadow: "rgba(156, 39, 176, 0.1)",
        shadowDark: "rgba(156, 39, 176, 0.2)"
      },
      gradients: {
        primary: "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
        secondary: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        success: "linear-gradient(135deg, #388e3c 0%, #4caf50 100%)",
        warning: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
        error: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
      }
    }
  };
  class ThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme() || "light";
      this.listeners = [];
      this.init();
    }
    // 初始化主题
    init() {
      setTimeout(() => {
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
      }, 100);
    }
    // 获取存储的主题
    getStoredTheme() {
      try {
        return uni.getStorageSync(THEME_STORAGE_KEY);
      } catch (error) {
        formatAppLog("error", "at utils/theme.js:158", "获取主题失败:", error);
        return "light";
      }
    }
    // 存储主题
    setStoredTheme(themeId) {
      try {
        uni.setStorageSync(THEME_STORAGE_KEY, themeId);
      } catch (error) {
        formatAppLog("error", "at utils/theme.js:168", "存储主题失败:", error);
      }
    }
    // 应用主题
    applyTheme(themeId) {
      const theme = themes[themeId];
      if (!theme) {
        formatAppLog("error", "at utils/theme.js:176", "主题不存在:", themeId);
        return;
      }
      this.currentTheme = themeId;
      this.setStoredTheme(themeId);
      this.applyCSSVariables(theme);
      this.notifyListeners(theme);
      formatAppLog("log", "at utils/theme.js:189", "主题已切换为:", theme.name);
    }
    // 应用CSS变量
    applyCSSVariables(theme) {
      if (typeof document === "undefined") {
        formatAppLog("warn", "at utils/theme.js:196", "Document not available, skipping CSS variable application");
        return;
      }
      try {
        const root = document.documentElement || document.body;
        if (!root) {
          formatAppLog("warn", "at utils/theme.js:204", "Root element not available, skipping CSS variable application");
          return;
        }
        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
        Object.entries(theme.gradients).forEach(([key, value]) => {
          root.style.setProperty(`--gradient-${key}`, value);
        });
        if (document.body) {
          document.body.className = document.body.className.replace(/theme-\w+/g, "");
          document.body.classList.add(`theme-${theme.id}`);
        }
      } catch (error) {
        formatAppLog("warn", "at utils/theme.js:224", "Failed to apply CSS variables:", error);
      }
    }
    // 获取当前主题
    getCurrentTheme() {
      return themes[this.currentTheme];
    }
    // 获取当前主题ID
    getCurrentThemeId() {
      return this.currentTheme;
    }
    // 切换主题
    switchTheme(themeId) {
      if (themes[themeId]) {
        this.applyTheme(themeId);
      } else {
        formatAppLog("error", "at utils/theme.js:243", "主题不存在:", themeId);
      }
    }
    // 切换到下一个主题
    switchToNextTheme() {
      const themeIds = Object.keys(themes);
      const currentIndex = themeIds.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themeIds.length;
      this.switchTheme(themeIds[nextIndex]);
    }
    // 添加主题变化监听器
    addThemeListener(callback) {
      this.listeners.push(callback);
    }
    // 移除主题变化监听器
    removeThemeListener(callback) {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
    // 通知监听器
    notifyListeners(theme) {
      this.listeners.forEach((callback) => {
        try {
          callback(theme);
        } catch (error) {
          formatAppLog("error", "at utils/theme.js:274", "主题监听器执行失败:", error);
        }
      });
    }
    // 设置系统主题监听
    setupSystemThemeListener() {
      if (typeof window === "undefined" || !window.matchMedia) {
        formatAppLog("warn", "at utils/theme.js:283", "Window or matchMedia not available, skipping system theme listener");
        return;
      }
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addListener((e) => {
        const storedTheme = this.getStoredTheme();
        if (!storedTheme || storedTheme === "auto") {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
    // 获取所有可用主题
    getAllThemes() {
      return Object.values(themes);
    }
    // 检查主题是否存在
    hasTheme(themeId) {
      return themes.hasOwnProperty(themeId);
    }
  }
  const themeManager = new ThemeManager();
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/Vue项目/专高六/1/项目/src/App.vue"]]);
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
      formatAppLog("error", "at main.js:38", "Vue Error:", err);
      formatAppLog("error", "at main.js:39", "Error Info:", info);
      reportError(err, info);
      uni.showToast({
        title: "应用出现错误，请重试",
        icon: "none",
        duration: 3e3
      });
    };
    app.config.warnHandler = (msg, vm, trace) => {
      formatAppLog("warn", "at main.js:54", "Vue Warning:", msg);
      formatAppLog("warn", "at main.js:55", "Warning Trace:", trace);
    };
    app.config.globalProperties.$app = {
      // 主题管理器
      theme: themeManager$1,
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
          formatAppLog("log", "at main.js:180", "Request:", config);
          return config;
        },
        // 响应拦截器
        afterResponse(response) {
          formatAppLog("log", "at main.js:186", "Response:", response);
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
            formatAppLog("error", "at main.js:222", "Request Error:", error);
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
            formatAppLog("error", "at main.js:288", "Storage Set Error:", error);
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
            formatAppLog("error", "at main.js:308", "Storage Get Error:", error);
            return defaultValue;
          }
        },
        // 删除存储
        remove(key) {
          try {
            uni.removeStorageSync(key);
          } catch (error) {
            formatAppLog("error", "at main.js:318", "Storage Remove Error:", error);
          }
        },
        // 清空存储
        clear() {
          try {
            uni.clearStorageSync();
          } catch (error) {
            formatAppLog("error", "at main.js:327", "Storage Clear Error:", error);
          }
        }
      }
    };
    app.mixin({
      // 页面生命周期
      onLoad(options) {
        formatAppLog("log", "at main.js:337", "Page Load:", this.$options.name, options);
        this.pageStartTime = Date.now();
      },
      onShow() {
        formatAppLog("log", "at main.js:344", "Page Show:", this.$options.name);
      },
      onHide() {
        formatAppLog("log", "at main.js:348", "Page Hide:", this.$options.name);
        if (this.pageStartTime) {
          const duration = Date.now() - this.pageStartTime;
          formatAppLog("log", "at main.js:353", "Page Duration:", this.$options.name, duration + "ms");
        }
      },
      onUnload() {
        formatAppLog("log", "at main.js:358", "Page Unload:", this.$options.name);
      },
      // 错误处理
      onError(error) {
        formatAppLog("error", "at main.js:363", "Page Error:", this.$options.name, error);
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
    formatAppLog("error", "at main.js:389", "Error Report:", errorData);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      formatAppLog("error", "at main.js:402", "Global Error:", event.error);
      reportError(event.error, "Global Error");
    });
    window.addEventListener("unhandledrejection", (event) => {
      formatAppLog("error", "at main.js:407", "Unhandled Promise Rejection:", event.reason);
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

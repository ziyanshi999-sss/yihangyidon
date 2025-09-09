"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onShow() {
    try {
      if (!utils_auth.forceCheckLogin()) {
        console.log("个人中心：用户未登录，跳转到登录页面");
        common_vendor.index.reLaunch({
          url: "/pages/denglu/login",
          fail: (error) => {
            console.error("个人中心跳转失败:", error);
            common_vendor.index.navigateTo({ url: "/pages/denglu/login" });
          }
        });
        return;
      }
      this.checkLoginStatus();
    } catch (error) {
      console.error("个人中心onShow检查失败:", error);
      common_vendor.index.reLaunch({
        url: "/pages/denglu/login",
        fail: () => {
          common_vendor.index.navigateTo({ url: "/pages/denglu/login" });
        }
      });
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = utils_auth.getUserInfo();
      if (userInfo) {
        this.userInfo = userInfo;
      } else {
        this.userInfo = null;
      }
    },
    // 跳转到登录页面
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/denglu/login"
      });
    },
    // 查看退出记录
    viewLogoutHistory() {
      try {
        const logoutLogs = common_vendor.index.getStorageSync("logoutLogs") || [];
        if (logoutLogs.length === 0) {
          common_vendor.index.showToast({
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
        common_vendor.index.showModal({
          title: "退出记录",
          content: formattedLogs,
          showCancel: false,
          confirmText: "确定"
        });
      } catch (error) {
        console.error("查看退出记录失败:", error);
        common_vendor.index.showToast({
          title: "查看记录失败",
          icon: "none"
        });
      }
    },
    // 退出登录
    handleLogout() {
      common_vendor.index.showActionSheet({
        itemList: ["普通退出", "快速退出", "强制退出"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              utils_auth.logout({
                showConfirm: true,
                syncToServer: true,
                reason: "用户从个人中心退出"
              });
              break;
            case 1:
              utils_auth.quickLogout("用户快速退出");
              break;
            case 2:
              common_vendor.index.showModal({
                title: "强制退出确认",
                content: "强制退出将清除所有数据且不同步服务器，确定继续吗？",
                confirmText: "确定",
                cancelText: "取消",
                confirmColor: "#e74c3c",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    utils_auth.forceLogout("用户强制退出");
                  }
                }
              });
              break;
          }
        }
      });
    },
    goToProfile() {
      common_vendor.index.showToast({
        title: "个人资料",
        icon: "none"
      });
    },
    goToSettings() {
      common_vendor.index.showToast({
        title: "设置",
        icon: "none"
      });
    },
    goToHelp() {
      common_vendor.index.showToast({
        title: "帮助中心",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? {
    b: $data.userInfo.avatar,
    c: common_vendor.t($data.userInfo.nickname),
    d: common_vendor.t($data.userInfo.phone)
  } : {
    e: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    f: $data.userInfo
  }, $data.userInfo ? {
    g: common_vendor.o((...args) => $options.goToProfile && $options.goToProfile(...args)),
    h: common_vendor.o((...args) => $options.goToSettings && $options.goToSettings(...args)),
    i: common_vendor.o((...args) => $options.goToHelp && $options.goToHelp(...args)),
    j: common_vendor.o((...args) => $options.viewLogoutHistory && $options.viewLogoutHistory(...args)),
    k: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99b0ba47"]]);
wx.createPage(MiniProgramPage);

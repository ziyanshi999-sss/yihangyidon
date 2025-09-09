"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  data() {
    return {
      isLoggedIn: false
    };
  },
  // 页面加载时检查登录状态
  // 页面加载时检查登录状态
  onLoad() {
    this.checkLoginStatus();
  },
  // 页面显示时检查登录状态
  onShow() {
    this.checkLoginStatus();
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
      if (!utils_auth.forceCheckLogin()) {
        console.log("首页：用户未登录，跳转到登录页面");
        common_vendor.index.reLaunch({
          url: "/pages/denglu/login"
        });
        return;
      }
      this.isLoggedIn = true;
    },
    // 处理转账按钮点击事件
    handleTransferClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/transfer/transfer"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    },
    // 处理我的账户点击事件
    handleAccountClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/account/account"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleAccountClick && $options.handleAccountClick(...args)),
    b: common_vendor.o((...args) => $options.handleTransferClick && $options.handleTransferClick(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);

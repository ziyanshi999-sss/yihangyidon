"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onLoad() {
    this.initPage();
  },
  methods: {
    initPage() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          this.userInfo = userInfo;
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    navigateTo(url) {
      common_vendor.index.switchTab({
        url
      });
    },
    handleService(type) {
      switch (type) {
        case "transfer":
          common_vendor.index.showToast({
            title: "转账汇款功能开发中",
            icon: "none"
          });
          break;
        case "payment":
          common_vendor.index.showToast({
            title: "缴费支付功能开发中",
            icon: "none"
          });
          break;
        case "investment":
          common_vendor.index.showToast({
            title: "投资理财功能开发中",
            icon: "none"
          });
          break;
        case "loan":
          common_vendor.index.showToast({
            title: "贷款服务功能开发中",
            icon: "none"
          });
          break;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o(($event) => $options.navigateTo("/pages/wealth/wealth")),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/life/life")),
    d: common_vendor.o(($event) => $options.navigateTo("/pages/user/user")),
    e: common_vendor.o(($event) => $options.handleService("transfer")),
    f: common_vendor.o(($event) => $options.handleService("payment")),
    g: common_vendor.o(($event) => $options.handleService("investment")),
    h: common_vendor.o(($event) => $options.handleService("loan"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);

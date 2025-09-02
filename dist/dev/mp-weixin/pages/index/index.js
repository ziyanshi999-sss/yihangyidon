"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
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
      if (!utils_auth.forceCheckLogin()) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:175", "首页：用户未登录，跳转到登录页面");
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
    },
    // 处理信用卡点击
    handleCreditCardClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/credit-card/credit-card"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    },
    // 处理收支点击
    handleBalanceClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/balance/balance"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    },
    // 处理贷款点击
    handleLoanClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/loan/loan"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    },
    // 处理手机充值点击
    handleRechargeClick() {
      if (this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/recharge/recharge"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
      }
    },
    // 处理扫一扫点击 - 完善后的实现
    handleScanClick() {
      if (!this.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/denglu/login"
        });
        return;
      }
      common_vendor.index.scanCode({
        // 允许的扫码类型：barCode（一维码）和qrCode（二维码）
        scanType: ["barCode", "qrCode"],
        // 是否显示闪光灯按钮
        showFlash: true,
        // 成功扫码的回调
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:292", "扫码结果：", res);
          const result = res.result;
          if (result.startsWith("http")) {
            common_vendor.index.showModal({
              title: "打开链接",
              content: `确定要打开链接: ${result} 吗？`,
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  common_vendor.index.openURL({
                    url: result
                  });
                }
              }
            });
          } else if (result.includes("payment")) {
            common_vendor.index.showModal({
              title: "支付确认",
              content: "检测到支付码，是否继续？",
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  common_vendor.index.showToast({
                    title: "正在处理支付",
                    icon: "loading"
                  });
                }
              }
            });
          } else {
            common_vendor.index.showModal({
              title: "扫码结果",
              content: result,
              showCancel: false
            });
          }
        },
        // 扫码失败的回调
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:340", "扫码失败：", err);
          if (err.errMsg !== "scanCode:fail cancel") {
            common_vendor.index.showToast({
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
      common_vendor.index.createSelectorQuery().select("#hot-activities-section").boundingClientRect((rect) => {
        const top = rect.top;
        common_vendor.index.pageScrollTo({
          scrollTop: top,
          duration: 300
          // 滚动动画持续时间（毫秒）
        });
      }).exec();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleAccountClick && $options.handleAccountClick(...args)),
    b: common_vendor.o((...args) => $options.handleTransferClick && $options.handleTransferClick(...args)),
    c: common_vendor.o((...args) => $options.handleBalanceClick && $options.handleBalanceClick(...args)),
    d: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {
    e: common_vendor.o((...args) => $options.handleScanClick && $options.handleScanClick(...args))
  } : {}, {
    f: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {
    g: common_vendor.o((...args) => $options.handleCreditCardClick && $options.handleCreditCardClick(...args))
  } : {}, {
    h: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {} : {}, {
    i: common_vendor.o((...args) => $options.scrollToHotActivities && $options.scrollToHotActivities(...args)),
    j: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {} : {}, {
    k: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {} : {}, {
    l: $data.showMoreFunctions
  }, $data.showMoreFunctions ? {
    m: common_vendor.o((...args) => $options.handleLoanClick && $options.handleLoanClick(...args))
  } : {}, {
    n: common_vendor.o((...args) => $options.handleRechargeClick && $options.handleRechargeClick(...args)),
    o: common_vendor.t($data.showMoreFunctions ? "收起" : "全部"),
    p: common_vendor.o((...args) => $options.toggleMoreFunctions && $options.toggleMoreFunctions(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map

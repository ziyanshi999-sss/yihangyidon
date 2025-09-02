"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "LifePage",
  data() {
    return {
      activeCategory: 0,
      categories: ["精选", "活动", "折扣", "品牌"],
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
      ]
    };
  },
  onLoad() {
    this.initPage();
  },
  onShow() {
    try {
      if (!utils_auth.forceCheckLogin()) {
        common_vendor.index.__f__("log", "at pages/life/life.vue:233", "生活页面：用户未登录，跳转到登录页面");
        common_vendor.index.reLaunch({
          url: "/pages/denglu/login"
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/life/life.vue:241", "生活页面显示");
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/life/life.vue:243", "生活页面onShow检查失败:", error);
      common_vendor.index.reLaunch({
        url: "/pages/denglu/login"
      });
    }
  },
  methods: {
    initPage() {
      common_vendor.index.__f__("log", "at pages/life/life.vue:253", "生活页面初始化");
    },
    handleServiceTap(service) {
      common_vendor.index.__f__("log", "at pages/life/life.vue:257", "点击服务:", service);
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
          common_vendor.index.showToast({
            title: `即将跳转到${service.label}`,
            icon: "none"
          });
      }
    },
    switchCategory(index) {
      this.activeCategory = index;
      common_vendor.index.__f__("log", "at pages/life/life.vue:282", "切换分类:", this.categories[index]);
    },
    goToPayment() {
      common_vendor.index.__f__("log", "at pages/life/life.vue:286", "跳转到生活缴费页面");
      common_vendor.index.navigateTo({
        url: "/pages/payment/payment",
        success: () => {
          common_vendor.index.__f__("log", "at pages/life/life.vue:290", "成功跳转到生活缴费页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/life/life.vue:293", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    goToRecharge() {
      common_vendor.index.__f__("log", "at pages/life/life.vue:303", "跳转到手机充值页面");
      common_vendor.index.navigateTo({
        url: "/pages/recharge/recharge",
        success: () => {
          common_vendor.index.__f__("log", "at pages/life/life.vue:307", "成功跳转到手机充值页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/life/life.vue:310", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    goToGovernment() {
      common_vendor.index.navigateTo({
        url: "/pages/government/government"
      });
    },
    goToGames() {
      common_vendor.index.navigateTo({
        url: "/pages/games/games"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_assets._imports_1,
    c: common_vendor.f($data.quickServices, (service, index, i0) => {
      return {
        a: common_vendor.t(service.icon),
        b: service.bgColor,
        c: common_vendor.t(service.label),
        d: index,
        e: common_vendor.o(($event) => $options.handleServiceTap(service), index)
      };
    }),
    d: common_vendor.f($data.allServices, (service, index, i0) => {
      return {
        a: common_vendor.t(service.icon),
        b: service.bgColor,
        c: common_vendor.t(service.label),
        d: index,
        e: common_vendor.o(($event) => $options.handleServiceTap(service), index)
      };
    }),
    e: common_vendor.f($data.categories, (category, index, i0) => {
      return {
        a: common_vendor.t(category),
        b: index,
        c: $data.activeCategory === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(index), index)
      };
    }),
    f: common_assets._imports_2,
    g: common_assets._imports_3,
    h: common_assets._imports_4
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-980f0516"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/life/life.js.map

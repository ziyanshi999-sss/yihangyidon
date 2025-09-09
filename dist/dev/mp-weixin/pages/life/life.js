"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
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
      if (!utils_auth.forceCheckLogin()) {
        console.log("生活页面：用户未登录，跳转到登录页面");
        common_vendor.index.reLaunch({
          url: "/pages/denglu/login"
        });
        return;
      }
      console.log("生活页面显示");
    } catch (error) {
      console.error("生活页面onShow检查失败:", error);
      common_vendor.index.reLaunch({
        url: "/pages/denglu/login"
      });
    }
  },
  methods: {
    initPage() {
      console.log("生活页面初始化");
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
      common_vendor.index.navigateTo({
        url: "/pages/user/profile"
      });
    },
    handleServiceTap(service) {
      console.log("点击服务:", service);
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
      console.log("切换分类:", this.categories[index]);
      common_vendor.index.showToast({
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
      console.log("点击主卡片:", currentCard);
      common_vendor.index.showToast({
        title: `点击了${currentCard.title}`,
        icon: "none"
      });
    },
    // 处理小卡片点击
    handleSmallCardTap(card, index) {
      console.log("点击小卡片:", card, index);
      common_vendor.index.showToast({
        title: `点击了${card.title}`,
        icon: "none"
      });
    },
    // 处理轮播图点击
    handleBannerTap(banner) {
      console.log("点击轮播图:", banner);
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
            common_vendor.index.navigateTo({
              url: banner.url,
              success: () => {
                console.log(`成功跳转到: ${banner.url}`);
              },
              fail: (err) => {
                console.error("跳转失败:", err);
                common_vendor.index.showToast({
                  title: "页面跳转失败",
                  icon: "none"
                });
              }
            });
          } else {
            common_vendor.index.showToast({
              title: `点击了${banner.title}`,
              icon: "none"
            });
          }
      }
    },
    goToPayment() {
      console.log("跳转到生活缴费页面");
      common_vendor.index.navigateTo({
        url: "/pages/payment/payment",
        success: () => {
          console.log("成功跳转到生活缴费页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    goToRecharge() {
      console.log("跳转到手机充值页面");
      common_vendor.index.navigateTo({
        url: "/pages/recharge/recharge",
        success: () => {
          console.log("成功跳转到手机充值页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
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
    a: common_vendor.t($data.currentTimeGreeting),
    b: common_vendor.t($data.greetingEmoji),
    c: common_vendor.t($data.weatherInfo),
    d: common_vendor.o((...args) => $options.goToProfile && $options.goToProfile(...args)),
    e: common_vendor.f($data.bannerData, (banner, index, i0) => {
      return {
        a: common_vendor.t(banner.title),
        b: common_vendor.t(banner.subtitle),
        c: common_vendor.t(banner.discount),
        d: common_vendor.n(`shape-${index + 1}`),
        e: common_vendor.t(banner.icon),
        f: common_vendor.n(`banner-item-${index + 1}`),
        g: common_vendor.o(($event) => $options.handleBannerTap(banner), banner.id),
        h: banner.id
      };
    }),
    f: common_vendor.f($data.quickServices, (service, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(service.icon),
        b: service.bgColor,
        c: common_vendor.t(service.label),
        d: service.badge
      }, service.badge ? {
        e: common_vendor.t(service.badge)
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.handleServiceTap(service), index)
      });
    }),
    g: common_vendor.f($data.allServices, (service, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(service.icon),
        b: service.bgColor,
        c: common_vendor.t(service.label),
        d: service.status
      }, service.status ? {
        e: common_vendor.t(service.status)
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.handleServiceTap(service), index)
      });
    }),
    h: common_vendor.f($data.categories, (category, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(category),
        b: $data.activeCategory === index
      }, $data.activeCategory === index ? {} : {}, {
        c: index,
        d: $data.activeCategory === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchCategory(index), index)
      });
    }),
    i: common_vendor.t($options.currentPromotionData.main.title),
    j: common_vendor.t($options.currentPromotionData.main.subtitle),
    k: common_vendor.t($options.currentPromotionData.main.desc),
    l: common_vendor.t($options.currentPromotionData.main.buttonText),
    m: common_vendor.o((...args) => $options.handleMainCardTap && $options.handleMainCardTap(...args)),
    n: common_vendor.t($options.currentPromotionData.main.icon),
    o: common_vendor.f($options.currentPromotionData.small, (card, index, i0) => {
      return {
        a: common_vendor.t(card.title),
        b: common_vendor.t(card.subtitle),
        c: common_vendor.t(card.icon),
        d: common_vendor.n($options.getCardClass(card.type)),
        e: index,
        f: common_vendor.o(($event) => $options.handleSmallCardTap(card, index), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-980f0516"]]);
wx.createPage(MiniProgramPage);

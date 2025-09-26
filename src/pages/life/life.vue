<template>
  <view class="life-page">
    <!-- 头部标题区域 -->
    <view class="header-section">
      <view class="header-content">
        <view class="greeting-section">
          <view class="time-greeting">
            <text class="greeting-time">{{ currentTimeGreeting }}</text>
            <text class="greeting-emoji">{{ greetingEmoji }}</text>
          </view>
          <text class="greeting-text">欢迎使用</text>
          <text class="app-name">生活服务</text>
          <text class="app-subtitle">让生活更简单便捷</text>
        </view>
        <view class="user-section">
          <view class="weather-info">
            <text class="weather-icon">🌤️</text>
            <text class="weather-text">{{ weatherInfo }}</text>
          </view>
          <view class="user-avatar" @tap="goToProfile">
            <text class="avatar-icon">👤</text>
            <view class="avatar-status"></view>
          </view>
        </view>
      </view>
      <view class="header-decoration">
        <view class="decoration-circle circle-1"></view>
        <view class="decoration-circle circle-2"></view>
        <view class="decoration-circle circle-3"></view>
        <view class="decoration-line line-1"></view>
        <view class="decoration-line line-2"></view>
      </view>
    </view>

    <!-- 轮播广告 -->
    <view class="banner-section">
      <swiper
        class="banner-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="(banner, index) in bannerData" :key="banner.id">
          <view
            class="banner-item"
            :class="`banner-item-${index + 1}`"
            @tap="handleBannerTap(banner)"
          >
            <view class="banner-content">
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-subtitle">{{ banner.subtitle }}</text>
              <text class="banner-discount">{{ banner.discount }}</text>
            </view>
            <view class="banner-decoration">
              <view
                class="decoration-shape"
                :class="`shape-${index + 1}`"
              ></view>
              <view class="decoration-icon">{{ banner.icon }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 快捷服务 -->
    <view class="quick-services">
      <view class="section-header">
        <view class="section-title-wrapper">
          <text class="section-icon">⚡</text>
          <text class="section-title">快捷服务</text>
        </view>
        <text class="section-subtitle">常用功能一键直达</text>
      </view>
      <view class="services-grid">
        <view
          class="service-item"
          v-for="(service, index) in quickServices"
          :key="index"
          @tap="handleServiceTap(service)"
        >
          <view
            class="service-icon"
            :style="{ backgroundColor: service.bgColor }"
          >
            <text class="icon-text">{{ service.icon }}</text>
            <view class="icon-glow"></view>
            <view class="icon-shimmer"></view>
          </view>
          <text class="service-label">{{ service.label }}</text>
          <view class="service-badge" v-if="service.badge">
            <text class="badge-text">{{ service.badge }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 全部服务 -->
    <view class="all-services">
      <view class="section-header">
        <view class="section-title-wrapper">
          <text class="section-icon">🎯</text>
          <text class="section-title">全部服务</text>
        </view>
        <text class="section-subtitle">更多精彩功能等你发现</text>
      </view>
      <view class="services-grid-large">
        <view
          class="service-item-large"
          v-for="(service, index) in allServices"
          :key="index"
          @tap="handleServiceTap(service)"
        >
          <view
            class="service-icon-large"
            :style="{ backgroundColor: service.bgColor }"
          >
            <text class="icon-text-large">{{ service.icon }}</text>
            <view class="icon-glow-large"></view>
            <view class="icon-shimmer-large"></view>
          </view>
          <text class="service-label-large">{{ service.label }}</text>
          <view class="service-status" v-if="service.status">
            <text class="status-dot"></text>
            <text class="status-text">{{ service.status }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="nav-container">
        <view
          class="nav-item"
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: activeCategory === index }"
          @tap="switchCategory(index)"
        >
          <text class="nav-text">{{ category }}</text>
          <view class="nav-indicator" v-if="activeCategory === index"></view>
        </view>
      </view>
      <view class="nav-background"></view>
    </view>

    <!-- 优惠活动卡片 -->
    <view class="promotion-section">
      <view class="section-header">
        <view class="section-title-wrapper">
          <text class="section-icon">🎁</text>
          <text class="section-title">精选优惠</text>
        </view>
        <text class="section-subtitle">专享福利等你来领</text>
      </view>
      <view class="promotion-cards">
        <view class="promotion-card large">
          <view class="card-content">
            <text class="card-title">{{
              currentPromotionData.main.title
            }}</text>
            <text class="card-subtitle">{{
              currentPromotionData.main.subtitle
            }}</text>
            <text class="card-desc">{{ currentPromotionData.main.desc }}</text>
            <view class="card-button" @tap="handleMainCardTap">
              <text class="button-text">{{
                currentPromotionData.main.buttonText
              }}</text>
            </view>
          </view>
          <view class="card-decoration">
            <view class="decoration-element element-1"></view>
            <view class="decoration-element element-2"></view>
            <text class="card-icon">{{ currentPromotionData.main.icon }}</text>
          </view>
        </view>

        <view class="promotion-cards-right">
          <view class="cards-scroll-container">
            <view
              class="promotion-card small"
              :class="getCardClass(card.type)"
              v-for="(card, index) in currentPromotionData.small"
              :key="index"
              @tap="handleSmallCardTap(card, index)"
            >
              <view class="small-card-content">
                <text class="card-title-small">{{ card.title }}</text>
                <text class="card-subtitle-small">{{ card.subtitle }}</text>
                <view class="small-card-icon">{{ card.icon }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from "@/utils/auth.js";
import themeManager from '@/utils/theme.js'
import { useAppStore } from '@/stores/app.js'

export default {
  name: "LifePage",
  data() {
    return {
      activeCategory: 0,
      categories: ["精选", "活动", "折扣", "品牌"],
      currentTimeGreeting: "",
      greetingEmoji: "",
      weatherInfo: "22°C 晴",
      currentTheme: 'light',
      // 轮播图数据
      bannerData: [
        {
          id: 1,
          title: "生活缴费优惠",
          subtitle: "水电燃气一键支付",
          discount: "立减10元",
          icon: "💳",
          action: "payment", // 跳转到生活缴费页面
          url: "/pages/payment/payment",
        },
        {
          id: 2,
          title: "手机充值特惠",
          subtitle: "充值满100送20",
          discount: "限时优惠",
          icon: "📱",
          action: "recharge", // 跳转到手机充值页面
          url: "/pages/recharge/recharge",
        },
        {
          id: 3,
          title: "政务服务大厅",
          subtitle: "在线办事更便民",
          discount: "免费办理",
          icon: "🏛️",
          action: "government", // 跳转到政务服务页面
          url: "/pages/government/government",
        },
        {
          id: 4,
          title: "小豆乐园",
          subtitle: "趣味游戏赢积分",
          discount: "每日签到",
          icon: "🎮",
          action: "games", // 跳转到游戏页面
          url: "/pages/games/games",
        },
      ],
      quickServices: [
        {
          icon: "💧",
          label: "生活缴费",
          bgColor: "#00D4AA",
          action: "payment",
          badge: "热门",
        },
        {
          icon: "📱",
          label: "手机充值",
          bgColor: "#FF9500",
          action: "recharge",
          badge: "优惠",
        },
        {
          icon: "🏛️",
          label: "政务民生",
          bgColor: "#34C759",
          action: "government",
        },
        {
          icon: "🎮",
          label: "小豆乐园",
          bgColor: "#FF6B35",
          action: "games",
          badge: "新",
        },
      ],
      allServices: [
        {
          icon: "🏫",
          label: "校园",
          bgColor: "#5AC8FA",
          action: "campus",
          status: "在线",
        },
        { icon: "⚡", label: "食堂", bgColor: "#30D158", action: "canteen" },
        { icon: "🎉", label: "党费", bgColor: "#FF3B30", action: "party" },
        {
          icon: "👨‍⚕️",
          label: "养老服务",
          bgColor: "#007AFF",
          action: "elderly",
          status: "热门",
        },
        {
          icon: "📄",
          label: "社保医保",
          bgColor: "#34C759",
          action: "insurance",
        },
        {
          icon: "🌿",
          label: "低碳空间",
          bgColor: "#32D74B",
          action: "carbon",
          status: "新",
        },
        {
          icon: "🎫",
          label: "优惠卡券",
          bgColor: "#AF52DE",
          action: "coupons",
        },
        {
          icon: "🎁",
          label: "京东特惠",
          bgColor: "#FF9500",
          action: "jd",
          status: "限时",
        },
        { icon: "🏪", label: "城市专区", bgColor: "#5856D6", action: "city" },
        {
          icon: "🎊",
          label: "热门活动",
          bgColor: "#FF2D92",
          action: "events",
          status: "火爆",
        },
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
          },
          small: [
            {
              title: "车票优惠享",
              subtitle: "最高88元立减金",
              icon: "🚄",
              type: "blue",
            },
            {
              title: "美食优惠券",
              subtitle: "新用户专享优惠",
              icon: "🍔",
              type: "orange",
            },
            {
              title: "话费充值",
              subtitle: "充100送20话费",
              icon: "📱",
              type: "green",
            },
            {
              title: "电影票特惠",
              subtitle: "周末观影5折起",
              icon: "🎬",
              type: "purple",
            },
            {
              title: "外卖红包",
              subtitle: "满30减15元",
              icon: "🥘",
              type: "red",
            },
            {
              title: "购物返现",
              subtitle: "消费满100返20",
              icon: "🛍️",
              type: "pink",
            },
            {
              title: "加油优惠",
              subtitle: "95号汽油9.5折",
              icon: "⛽",
              type: "yellow",
            },
            {
              title: "咖啡买一送一",
              subtitle: "指定门店限时优惠",
              icon: "☕",
              type: "gray",
            },
          ],
        },
        1: {
          // 活动
          main: {
            title: "限时秒杀",
            subtitle: "每日10点开抢",
            desc: "超值商品限量抢购",
            buttonText: "立即抢购",
          },
          small: [
            {
              title: "双11狂欢",
              subtitle: "全场商品5折起",
              icon: "🛒",
              type: "red",
            },
            {
              title: "签到有礼",
              subtitle: "连续签到送好礼",
              icon: "📅",
              type: "blue",
            },
            {
              title: "新人专享",
              subtitle: "注册即送50元券",
              icon: "🎊",
              type: "orange",
            },
            {
              title: "邀请好友",
              subtitle: "邀请1人得10元",
              icon: "👥",
              type: "green",
            },
            {
              title: "抽奖大转盘",
              subtitle: "每日免费3次机会",
              icon: "🎰",
              type: "purple",
            },
            {
              title: "满减活动",
              subtitle: "满199减50元",
              icon: "💸",
              type: "pink",
            },
            {
              title: "积分翻倍",
              subtitle: "本周积分双倍返还",
              icon: "⭐",
              type: "yellow",
            },
            {
              title: "会员专场",
              subtitle: "VIP专享8折优惠",
              icon: "👑",
              type: "gray",
            },
          ],
        },
        2: {
          // 折扣
          main: {
            title: "超级折扣日",
            subtitle: "全场最低3折",
            desc: "品牌商品超低折扣",
            buttonText: "查看折扣",
          },
          small: [
            {
              title: "服装鞋帽",
              subtitle: "春季新品5折起",
              icon: "👕",
              type: "pink",
            },
            {
              title: "数码家电",
              subtitle: "爆款产品直降",
              icon: "📱",
              type: "blue",
            },
            {
              title: "母婴用品",
              subtitle: "进口奶粉8折",
              icon: "🍼",
              type: "orange",
            },
            {
              title: "美妆护肤",
              subtitle: "大牌化妆品6折",
              icon: "💄",
              type: "purple",
            },
            {
              title: "家居用品",
              subtitle: "家具家纺7折起",
              icon: "🏠",
              type: "green",
            },
            {
              title: "图书文具",
              subtitle: "学习用品5折起",
              icon: "📚",
              type: "red",
            },
            {
              title: "运动户外",
              subtitle: "健身装备6折起",
              icon: "🏃‍♂️",
              type: "yellow",
            },
            {
              title: "食品生鲜",
              subtitle: "进口食品8折起",
              icon: "🥗",
              type: "gray",
            },
          ],
        },
        3: {
          // 品牌
          main: {
            title: "品牌联盟",
            subtitle: "知名品牌集结",
            desc: "精选品牌特惠专区",
            buttonText: "进入专区",
          },
          small: [
            {
              title: "苹果专区",
              subtitle: "iPhone新品上市",
              icon: "📱",
              type: "gray",
            },
            {
              title: "耐克运动",
              subtitle: "运动装备8折起",
              icon: "👟",
              type: "red",
            },
            {
              title: "星巴克",
              subtitle: "咖啡买二送一",
              icon: "☕",
              type: "green",
            },
            {
              title: "麦当劳",
              subtitle: "套餐优惠券",
              icon: "🍟",
              type: "yellow",
            },
            {
              title: "华为商城",
              subtitle: "智能设备新品",
              icon: "📟",
              type: "blue",
            },
            {
              title: "优衣库",
              subtitle: "基础款服饰特价",
              icon: "👔",
              type: "orange",
            },
            {
              title: "肯德基",
              subtitle: "全家桶特惠价",
              icon: "🍗",
              type: "purple",
            },
            {
              title: "小米有品",
              subtitle: "智能家居9折",
              icon: "🏡",
              type: "pink",
            },
          ],
        },
      },
    };
  },

  computed: {
    // 当前分类的推广卡片数据
    currentPromotionData() {
      return this.promotionCards[this.activeCategory] || this.promotionCards[0];
    },
  },

  onLoad() {
    this.initPage();
    this.loadLifeServicesData();
    this.initTheme();
  },

  onShow() {
    try {
      // 检查登录状态 - 使用更宽松的检查方式
      const isLoggedIn = uni.getStorageSync('isLoggedIn')
      const userInfo = uni.getStorageSync('userInfo')
      
      if (!isLoggedIn || !userInfo) {
        console.log("生活页面：用户未登录，尝试从数据库恢复登录状态");
        
        // 尝试从数据库恢复登录状态
        try {
          const users = uni.getStorageSync('users') || []
          const loggedInUser = users.find(user => user.isLoggedIn === true)
          
          if (loggedInUser) {
            console.log("从数据库恢复登录状态:", loggedInUser.username)
            // 恢复登录状态
            uni.setStorageSync('userInfo', loggedInUser)
            uni.setStorageSync('isLoggedIn', true)
            uni.setStorageSync('currentUser', loggedInUser)
            uni.setStorageSync('currentUserId', loggedInUser.id)
          } else {
            console.log("生活页面：数据库中也未找到登录用户，跳转到登录页面");
            uni.reLaunch({
              url: "/pages/denglu/login",
            });
            return;
          }
        } catch (recoveryError) {
          console.error("恢复登录状态失败:", recoveryError);
          uni.reLaunch({
            url: "/pages/denglu/login",
          });
          return;
        }
      }

      // 页面显示逻辑
      console.log("生活页面显示");
      this.checkThemeChange();
    } catch (error) {
      console.error("生活页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  methods: {
    initPage() {
      // 页面初始化
      console.log("生活页面初始化");
      this.updateTimeGreeting();
    },

    // 加载生活服务数据
    loadLifeServicesData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser && currentUser.lifeServices) {
          // 使用用户的生活服务数据
          this.quickServices = currentUser.lifeServices.quickServices || this.quickServices
          this.allServices = currentUser.lifeServices.allServices || this.allServices
          this.bannerData = currentUser.lifeServices.bannerData || this.bannerData
          
          console.log('✅ 生活服务数据加载成功:', {
            quickServices: this.quickServices.length,
            allServices: this.allServices.length,
            bannerData: this.bannerData.length
          })
        } else {
          // 如果没有生活服务数据，保存当前数据到用户
          if (currentUser) {
            currentUser.lifeServices = {
              quickServices: this.quickServices,
              allServices: this.allServices,
              bannerData: this.bannerData,
              paymentCategories: this.getDefaultPaymentCategories(),
              recentPayments: this.getDefaultRecentPayments(),
              favoriteServices: this.getDefaultFavoriteServices()
            }
            uni.setStorageSync('users', users)
            console.log('✅ 已为用户创建生活服务数据')
          }
        }
      } catch (error) {
        console.error('❌ 加载生活服务数据失败:', error)
      }
    },

    // 获取默认缴费分类数据
    getDefaultPaymentCategories() {
      return [
        {
          id: "utilities",
          name: "水电燃气",
          icon: "⚡",
          color: "#FF6B35",
          services: [
            {
              id: "electricity",
              name: "电费",
              icon: "⚡",
              providers: ["国家电网", "南方电网", "地方电网"],
              defaultProvider: "国家电网"
            },
            {
              id: "water",
              name: "水费",
              icon: "💧",
              providers: ["上海水务", "广州水务", "深圳水务", "杭州水务", "成都水务"],
              defaultProvider: "上海水务"
            },
            {
              id: "gas",
              name: "燃气费",
              icon: "🔥",
              providers: ["华润燃气", "新奥燃气", "港华燃气"],
              defaultProvider: "华润燃气"
            }
          ]
        },
        {
          id: "communication",
          name: "通讯服务",
          icon: "📱",
          color: "#007AFF",
          services: [
            {
              id: "mobile",
              name: "手机充值",
              icon: "📱",
              providers: ["中国移动", "中国联通", "中国电信"],
              defaultProvider: "中国移动"
            },
            {
              id: "broadband",
              name: "宽带缴费",
              icon: "🌐",
              providers: ["中国移动", "中国联通", "中国电信"],
              defaultProvider: "中国移动"
            }
          ]
        }
      ]
    },

    // 获取默认最近缴费记录
    getDefaultRecentPayments() {
      return [
        {
          id: "rp001",
          type: "电费",
          amount: 350,
          account: "9876543210",
          provider: "国家电网",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          icon: "⚡"
        },
        {
          id: "rp002",
          type: "水费",
          amount: 120,
          account: "1234567890",
          provider: "上海水务",
          status: "completed",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          icon: "💧"
        }
      ]
    },

    // 获取默认收藏服务
    getDefaultFavoriteServices() {
      return [
        {
          id: "fs001",
          type: "电费",
          account: "9876543210",
          provider: "国家电网",
          nickname: "家庭电费",
          icon: "⚡",
          color: "#FF6B35"
        },
        {
          id: "fs002",
          type: "水费",
          account: "1234567890",
          provider: "上海水务",
          nickname: "家庭水费",
          icon: "💧",
          color: "#007AFF"
        }
      ]
    },

    // 更新时间问候语
    updateTimeGreeting() {
      const hour = new Date().getHours();
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
        url: "/pages/user/profile",
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
          uni.showToast({
            title: `即将跳转到${service.label}`,
            icon: "none",
          });
      }
    },

    switchCategory(index) {
      this.activeCategory = index;
      console.log("切换分类:", this.categories[index]);
      // 可以添加切换动画效果
      uni.showToast({
        title: `切换到${this.categories[index]}`,
        icon: "none",
        duration: 1000,
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
        yellow: "card-yellow",
      };
      return classMap[type] || "card-blue";
    },

    // 处理主卡片点击
    handleMainCardTap() {
      const currentCard = this.currentPromotionData.main;
      console.log("点击主卡片:", currentCard);
      uni.showToast({
        title: `点击了${currentCard.title}`,
        icon: "none",
      });
    },

    // 处理小卡片点击
    handleSmallCardTap(card, index) {
      console.log("点击小卡片:", card, index);
      uni.showToast({
        title: `点击了${card.title}`,
        icon: "none",
      });
    },

    // 处理轮播图点击
    handleBannerTap(banner) {
      console.log("点击轮播图:", banner);

      // 根据action类型进行不同的跳转
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
          // 如果有自定义URL，直接跳转
          if (banner.url) {
            uni.navigateTo({
              url: banner.url,
              success: () => {
                console.log(`成功跳转到: ${banner.url}`);
              },
              fail: (err) => {
                console.error("跳转失败:", err);
                uni.showToast({
                  title: "页面跳转失败",
                  icon: "none",
                });
              },
            });
          } else {
            uni.showToast({
              title: `点击了${banner.title}`,
              icon: "none",
            });
          }
      }
    },

    goToPayment() {
      console.log("跳转到生活缴费页面");
      uni.navigateTo({
        url: "/pages/payment/payment",
        success: () => {
          console.log("成功跳转到生活缴费页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    },

    goToRecharge() {
      console.log("跳转到手机充值页面");
      uni.navigateTo({
        url: "/pages/recharge/recharge",
        success: () => {
          console.log("成功跳转到手机充值页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    },

    goToGovernment() {
      uni.navigateTo({
        url: "/pages/government/government",
      });
    },

    goToGames() {
      uni.navigateTo({
        url: "/pages/games/games",
      });
    },

    // 初始化主题
    initTheme() {
      try {
        this.currentTheme = themeManager.getCurrentTheme()
        console.log('生活页面初始化主题:', this.currentTheme)
      } catch (error) {
        console.error('生活页面初始化主题失败:', error)
      }
    },

    // 检查主题变化
    checkThemeChange() {
      try {
        const currentTheme = themeManager.getCurrentTheme()
        if (this.currentTheme !== currentTheme) {
          this.currentTheme = currentTheme
          console.log('生活页面主题已更新:', currentTheme)
        }
      } catch (error) {
        console.error('生活页面检查主题变化失败:', error)
      }
    }
  },
};
</script>

<style scoped>
.life-page {
  min-height: 100vh;
  background: var(--theme-background, linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%));
  transition: background-color 0.3s ease;
}

/* 头部区域 */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80rpx 30rpx 50rpx;
  position: relative;
  overflow: hidden;
  min-height: 320rpx;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.greeting-section {
  flex: 1;
}

.time-greeting {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.greeting-time {
  color: rgba(255, 255, 255, 0.95);
  font-size: 32rpx;
  font-weight: 600;
  margin-right: 12rpx;
}

.greeting-emoji {
  font-size: 36rpx;
}

.greeting-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 28rpx;
  display: block;
  margin-bottom: 8rpx;
}

.app-name {
  color: #fff;
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  display: block;
}

.user-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20rpx;
}

.weather-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 12rpx 20rpx;
  border-radius: 24rpx;
  backdrop-filter: blur(10rpx);
}

.weather-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.weather-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
}

.user-avatar {
  width: 88rpx;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  position: relative;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.user-avatar:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.avatar-icon {
  font-size: 40rpx;
  color: #fff;
}

.avatar-status {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 20rpx;
  height: 20rpx;
  background: #28a745;
  border-radius: 50%;
  border: 2rpx solid #fff;
}

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20rpx);
}

.decoration-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 100%
  );
  border-radius: 2rpx;
}

.line-1 {
  width: 300rpx;
  height: 4rpx;
  top: 100rpx;
  right: -100rpx;
  transform: rotate(15deg);
  animation: slideIn 4s ease-in-out infinite;
}

.line-2 {
  width: 200rpx;
  height: 3rpx;
  bottom: 80rpx;
  right: -50rpx;
  transform: rotate(-20deg);
  animation: slideIn 6s ease-in-out infinite reverse;
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -100rpx;
  right: -50rpx;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 120rpx;
  height: 120rpx;
  top: 50rpx;
  right: 200rpx;
  animation: float 4s ease-in-out infinite reverse;
}

.circle-3 {
  width: 80rpx;
  height: 80rpx;
  bottom: 20rpx;
  right: 100rpx;
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-100rpx) rotate(15deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(100rpx) rotate(15deg);
  }
}

/* 轮播广告 */
.banner-section {
  margin: -20rpx 30rpx 30rpx;
}

.banner-swiper {
  height: 200rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

.banner-item {
  height: 100%;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-item:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.banner-item-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-item-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.banner-item-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.banner-item-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.banner-content {
  flex: 1;
  z-index: 2;
}

.banner-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
  margin-bottom: 8rpx;
}

.banner-discount {
  color: #fff;
  font-size: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  display: inline-block;
}

.banner-decoration {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-shape {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  position: absolute;
  animation: pulse 2s ease-in-out infinite;
}

.shape-1 {
  animation-delay: 0s;
}

.shape-2 {
  animation-delay: 0.5s;
}

.shape-3 {
  animation-delay: 1s;
}

.shape-4 {
  animation-delay: 1.5s;
}

.decoration-icon {
  font-size: 48rpx;
  z-index: 2;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

/* 章节标题 */
.section-header {
  margin-bottom: 30rpx;
  text-align: center;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.section-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.section-title {
  color: var(--theme-text-primary, #333);
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  transition: color 0.3s ease;
}

.section-subtitle {
  color: var(--theme-text-secondary, #666);
  font-size: 26rpx;
  display: block;
  transition: color 0.3s ease;
}

/* 快捷服务 */
.quick-services {
  background: var(--theme-card-background, #fff);
  margin: 0 30rpx 30rpx;
  padding: 40rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.06));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.service-item:hover {
  transform: translateY(-8rpx);
}

.service-icon {
  width: 92rpx;
  height: 92rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  position: relative;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.service-item:hover .service-icon {
  transform: translateY(-8rpx) scale(1.05);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.25);
}

.service-item:active .service-icon {
  transform: scale(0.95);
}

.icon-glow {
  position: absolute;
  top: -6rpx;
  left: -6rpx;
  right: -6rpx;
  bottom: -6rpx;
  border-radius: 30rpx;
  background: inherit;
  opacity: 0.4;
  filter: blur(12rpx);
  z-index: -1;
  animation: glowPulse 3s ease-in-out infinite;
}

.icon-shimmer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  animation: shimmer 4s ease-in-out infinite;
}

.icon-text {
  font-size: 36rpx;
  color: #fff;
  position: relative;
  z-index: 2;
}

.service-label {
  font-size: 26rpx;
  color: var(--theme-text-primary, #333);
  line-height: 1.2;
  font-weight: 500;
  transition: color 0.3s ease;
}

.service-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: linear-gradient(135deg, #ff416c 0%, #ff4757 100%);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 10rpx;
  transform: scale(0.9);
  box-shadow: 0 2rpx 8rpx rgba(255, 65, 108, 0.4);
  animation: badgeBounce 2s ease-in-out infinite;
}

.badge-text {
  font-weight: 600;
  color: #fff;
}

/* 全部服务 */
.all-services {
  background: var(--theme-card-background, #fff);
  margin: 0 30rpx 30rpx;
  padding: 40rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.06));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.services-grid-large {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40rpx 20rpx;
}

.service-item-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.service-item-large:hover {
  transform: translateY(-6rpx);
}

.service-icon-large {
  width: 84rpx;
  height: 84rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  position: relative;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.service-item-large:hover .service-icon-large {
  transform: translateY(-4rpx) scale(1.03);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.18);
}

.service-item-large:active .service-icon-large {
  transform: scale(0.95);
}

.icon-glow-large {
  position: absolute;
  top: -4rpx;
  left: -4rpx;
  right: -4rpx;
  bottom: -4rpx;
  border-radius: 26rpx;
  background: inherit;
  opacity: 0.3;
  filter: blur(8rpx);
  z-index: -1;
  animation: glowPulse 4s ease-in-out infinite;
}

.icon-shimmer-large {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  animation: shimmer 5s ease-in-out infinite;
}

.icon-text-large {
  font-size: 32rpx;
  color: #fff;
  position: relative;
  z-index: 2;
}

.service-label-large {
  font-size: 24rpx;
  color: var(--theme-text-primary, #333);
  line-height: 1.2;
  font-weight: 500;
  transition: color 0.3s ease;
}

.service-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
}

.status-dot {
  width: 8rpx;
  height: 8rpx;
  background: #28a745;
  border-radius: 50%;
  margin-right: 6rpx;
  animation: statusPulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 20rpx;
  color: #28a745;
  font-weight: 500;
}

/* 分类导航 */
.category-nav {
  position: relative;
  background: var(--theme-card-background, #fff);
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 8rpx;
  box-shadow: 0 4rpx 20rpx var(--theme-shadow-light, rgba(0, 0, 0, 0.08));
  overflow: hidden;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-container {
  display: flex;
  position: relative;
  z-index: 2;
}

.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  z-index: 1;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
  border-radius: 16rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item:active {
  transform: scale(0.98);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.nav-text {
  font-size: 28rpx;
  color: var(--theme-text-secondary, #666);
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-item.active .nav-text {
  color: #fff;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.2);
}

.nav-indicator {
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 20rpx;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2rpx;
  animation: indicatorGlow 2s ease-in-out infinite;
}

/* 优惠活动卡片 */
.promotion-section {
  margin: 0 30rpx 120rpx;
}

.promotion-cards {
  display: flex;
  gap: 24rpx;
  height: 480rpx;
}

.promotion-card.large {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 36rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.promotion-card.large:active {
  transform: scale(0.98);
}

.card-content {
  position: relative;
  z-index: 2;
  flex: 1;
}

.card-title {
  color: #fff;
  font-size: 42rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.card-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  margin-bottom: 24rpx;
  line-height: 1.5;
  flex: 1;
}

.card-button {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 24rpx;
  padding: 16rpx 32rpx;
  display: inline-block;
  backdrop-filter: blur(10rpx);
  align-self: flex-start;
  transition: all 0.3s ease;
}

.card-button:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.95);
}

.button-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.card-decoration {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.element-1 {
  width: 80rpx;
  height: 80rpx;
  animation: rotate 8s linear infinite;
}

.element-2 {
  width: 60rpx;
  height: 60rpx;
  animation: rotate 6s linear infinite reverse;
}

.card-icon {
  font-size: 56rpx;
  z-index: 2;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.promotion-cards-right {
  width: 400rpx;
  height: 100%;
  overflow: hidden;
}

.cards-scroll-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  height: 100%;
  overflow-y: auto;
  padding-right: 8rpx;
}

.cards-scroll-container::-webkit-scrollbar {
  width: 4rpx;
}

.cards-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2rpx;
}

.cards-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.promotion-card.small {
  width: 180rpx;
  height: 180rpx;
  border-radius: 20rpx;
  padding: 24rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.promotion-card.small:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.2);
}

.promotion-card.small:active {
  transform: scale(0.95);
}

.card-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.card-green {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.card-purple {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.card-red {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.card-pink {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.card-gray {
  background: linear-gradient(135deg, #e3e3e3 0%, #5d6874 100%);
}

.card-yellow {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
}

.small-card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title-small {
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.card-subtitle-small {
  color: rgba(255, 255, 255, 0.9);
  font-size: 24rpx;
  line-height: 1.4;
  flex: 1;
}

.small-card-icon {
  font-size: 40rpx;
  text-align: right;
  margin-top: 12rpx;
}

/* 新增动画效果 */
@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(200%) translateY(200%) rotate(45deg);
  }
}

@keyframes badgeBounce {
  0%,
  100% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

@keyframes indicatorGlow {
  0%,
  100% {
    opacity: 0.8;
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 12rpx rgba(255, 255, 255, 0.6);
  }
}

/* 点击效果 */
.service-item:active,
.service-item-large:active,
.promotion-card:active,
.action-btn:active {
  opacity: 0.8;
  transform: scale(0.95);
  transition: all 0.1s ease;
}

/* 页面加载动画 */
.life-page {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 30rpx;
  }

  .services-grid-large {
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx 15rpx;
  }

  .promotion-cards {
    flex-direction: column;
    height: auto;
    gap: 20rpx;
  }

  .promotion-cards-right {
    width: 100%;
    height: 300rpx;
  }
}
</style>

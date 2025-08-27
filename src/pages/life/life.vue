<template>
  <view class="life-page">
    <!-- 头部搜索区域 -->
    <view class="header-section">
      <view class="location-info">
        <view class="location-icon">📍</view>
        <text class="location-text">牡丹江</text>
      </view>

      <view class="search-container">
        <view class="search-box">
          <view class="search-icon">🔍</view>
          <input
            class="search-input"
            placeholder="本地优惠"
            placeholder-style="color: rgba(255,255,255,0.7)"
          />
          <view class="voice-icon">🎤</view>
        </view>
      </view>

      <view class="header-actions">
        <view class="action-item">
          <text class="action-icon">📝</text>
          <text class="action-text">记事</text>
        </view>
        <view class="action-item">
          <text class="action-icon">🗂️</text>
          <text class="action-text">卡券</text>
        </view>
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
        <swiper-item>
          <view class="banner-item">
            <text class="banner-title">京东购物用农行信用卡</text>
            <text class="banner-subtitle">积分抵现至高10%</text>
            <image
              class="banner-image"
              src="/static/banner1.png"
              mode="aspectFit"
            ></image>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="banner-item">
            <text class="banner-title">生活缴费享优惠</text>
            <text class="banner-subtitle">水电燃气一键支付</text>
            <image
              class="banner-image"
              src="/static/banner2.png"
              mode="aspectFit"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 快捷服务 -->
    <view class="quick-services">
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
          </view>
          <text class="service-label">{{ service.label }}</text>
        </view>
      </view>
    </view>

    <!-- 全部服务 -->
    <view class="all-services">
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
          </view>
          <text class="service-label-large">{{ service.label }}</text>
        </view>
      </view>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view
        class="nav-item"
        v-for="(category, index) in categories"
        :key="index"
        :class="{ active: activeCategory === index }"
        @tap="switchCategory(index)"
      >
        <text class="nav-text">{{ category }}</text>
      </view>
    </view>

    <!-- 优惠活动卡片 -->
    <view class="promotion-section">
      <view class="promotion-cards">
        <view class="promotion-card large">
          <view class="card-content">
            <text class="card-title">积分当钱花</text>
            <text class="card-subtitle">至高抵现50%</text>
            <text class="card-desc">积分当钱花优惠手不...</text>
            <text class="card-detail">至高抵现50%</text>
            <image
              class="card-mascot"
              src="/static/frog-mascot.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <view class="promotion-cards-right">
          <view class="promotion-card small">
            <text class="card-title-small">车票优惠享</text>
            <text class="card-subtitle-small">最高88元12306立减金</text>
            <image
              class="card-bg"
              src="/static/train-bg.png"
              mode="aspectFill"
            ></image>
          </view>

          <view class="promotion-card small">
            <text class="card-title-small">茶颜优惠券</text>
            <text class="card-subtitle-small">新用户专享首杯至5.9元</text>
            <image
              class="card-bg"
              src="/static/tea-bg.png"
              mode="aspectFill"
            ></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from '@/utils/auth.js'

export default {
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
          action: "payment",
        },
        {
          icon: "¥",
          label: "手机充值",
          bgColor: "#FF9500",
          action: "recharge",
        },
        {
          icon: "👥",
          label: "政务民生",
          bgColor: "#34C759",
          action: "government",
        },
        { icon: "🎯", label: "小豆乐园", bgColor: "#FF6B35", action: "games" },
      ],
      allServices: [
        { icon: "🏫", label: "校园", bgColor: "#5AC8FA", action: "campus" },
        { icon: "⚡", label: "食堂", bgColor: "#30D158", action: "canteen" },
        { icon: "🎉", label: "党费", bgColor: "#FF3B30", action: "party" },
        {
          icon: "👨‍⚕️",
          label: "养老服务",
          bgColor: "#007AFF",
          action: "elderly",
        },
        {
          icon: "📄",
          label: "社保医保",
          bgColor: "#34C759",
          action: "insurance",
        },
        { icon: "🌿", label: "低碳空间", bgColor: "#32D74B", action: "carbon" },
        {
          icon: "🎫",
          label: "优惠卡券",
          bgColor: "#AF52DE",
          action: "coupons",
        },
        { icon: "🎁", label: "京东特惠", bgColor: "#FF9500", action: "jd" },
        { icon: "🏪", label: "城市专区", bgColor: "#5856D6", action: "city" },
        { icon: "🎊", label: "热门活动", bgColor: "#FF2D92", action: "events" },
      ],
    };
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    try {
      // 检查登录状态
      if (!forceCheckLogin()) {
        console.log('生活页面：用户未登录，跳转到登录页面')
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
        return
      }
      
      // 页面显示逻辑
      console.log('生活页面显示')
    } catch (error) {
      console.error('生活页面onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  },

  methods: {
    initPage() {
      // 页面初始化
      console.log("生活页面初始化");
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
  },
};
</script>

<style scoped>
.life-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff6b4a 0%, #ff8a65 50%, #f5f5f5 50%);
}

/* 头部区域 */
.header-section {
  padding: 30rpx;
  padding-top: 60rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.location-info {
  display: flex;
  align-items: center;
}

.location-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.location-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
}

.search-container {
  flex: 1;
  margin: 0 30rpx;
}

.search-box {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10rpx);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.search-input {
  flex: 1;
  color: #fff;
  font-size: 28rpx;
}

.voice-icon {
  font-size: 32rpx;
  margin-left: 20rpx;
}

.header-actions {
  display: flex;
  gap: 30rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.action-text {
  color: #fff;
  font-size: 22rpx;
}

/* 轮播广告 */
.banner-section {
  margin: 0 30rpx 40rpx;
}

.banner-swiper {
  height: 200rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.banner-item {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
  height: 100%;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.banner-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 24rpx;
}

.banner-image {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  width: 120rpx;
  height: 120rpx;
}

/* 快捷服务 */
.quick-services {
  background: #fff;
  margin: 0 30rpx 30rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
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
}

.service-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.icon-text {
  font-size: 36rpx;
  color: #fff;
}

.service-label {
  font-size: 26rpx;
  color: #333;
  line-height: 1.2;
}

/* 全部服务 */
.all-services {
  background: #fff;
  margin: 0 30rpx 30rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
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
}

.service-icon-large {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-text-large {
  font-size: 32rpx;
  color: #fff;
}

.service-label-large {
  font-size: 24rpx;
  color: #333;
  line-height: 1.2;
}

/* 分类导航 */
.category-nav {
  display: flex;
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.nav-item.active {
  background: #00d4aa;
}

.nav-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.nav-item.active .nav-text {
  color: #fff;
}

/* 优惠活动卡片 */
.promotion-section {
  margin: 0 30rpx 100rpx;
}

.promotion-cards {
  display: flex;
  gap: 20rpx;
  height: 400rpx;
}

.promotion-card.large {
  flex: 1;
  background: linear-gradient(135deg, #32d74b 0%, #30db5b 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  overflow: hidden;
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.card-subtitle {
  color: #fff;
  font-size: 24rpx;
  margin-bottom: 20rpx;
}

.card-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 22rpx;
  margin-bottom: 10rpx;
}

.card-detail {
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
}

.card-mascot {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 120rpx;
  height: 120rpx;
}

.promotion-cards-right {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 300rpx;
}

.promotion-card.small {
  flex: 1;
  border-radius: 16rpx;
  padding: 24rpx;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
}

.promotion-card.small:last-child {
  background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
}

.card-title-small {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  position: relative;
  z-index: 2;
}

.card-subtitle-small {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20rpx;
  line-height: 1.4;
  position: relative;
  z-index: 2;
}

.card-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

/* 点击效果 */
.service-item:active,
.service-item-large:active,
.promotion-card:active {
  opacity: 0.8;
  transform: scale(0.95);
  transition: all 0.1s ease;
}
</style>
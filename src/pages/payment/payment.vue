<template>
  <view class="payment-page">
    <!-- 位置选择 -->
    <view class="location-section">
      <view class="location-bar">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <text class="location-text">保定市</text>
        </view>
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input class="search-input" placeholder="请输入关键字搜索" />
        </view>
      </view>
    </view>

    <!-- 我的缴费 -->
    <view class="my-payment-section">
      <view class="section-header">
        <text class="section-title">我的缴费</text>
        <view class="section-right" @tap="goToPaymentManagement">
          <text class="manage-text">缴费管理</text>
          <text class="arrow">→</text>
        </view>
      </view>

      <view class="payment-cards">
        <!-- 党费卡片 -->
        <view class="payment-card party-card" @tap="handleCardTap('party')">
          <view class="card-left">
            <view class="card-icon party-icon">
              <text class="party-symbol">☭</text>
            </view>
            <view class="card-info">
              <text class="card-title">党费</text>
              <text class="card-subtitle">自己 | ★手机 | 410******</text>
              <text class="card-number">*****5030</text>
            </view>
          </view>
        </view>

        <!-- 手机充值卡片 -->
        <view class="payment-card phone-card" @tap="handleCardTap('phone')">
          <view class="card-left">
            <view class="card-icon phone-icon">
              <text class="phone-symbol">📱</text>
            </view>
            <view class="card-info">
              <text class="card-title">手机充值</text>
              <text class="card-subtitle">常用缴费 | 15703724132 |</text>
              <text class="card-number">50元</text>
            </view>
          </view>
          <view class="card-right">
            <view class="recharge-icon">💳</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠活动横幅 -->
    <view class="promotion-banner" @tap="handlePromotionTap">
      <view class="banner-content">
        <text class="banner-title">生活缴费先领券</text>
        <text class="banner-subtitle">信用卡支付享返现优惠</text>
        <text class="banner-tag">广告</text>
      </view>
      <view class="banner-decoration">
        <view class="frog-icon">🐸</view>
        <view class="cards-icon">💳</view>
      </view>
    </view>

    <!-- 新增缴费 -->
    <view class="new-payment-section">
      <text class="section-title">新增缴费</text>

      <view class="payment-grid">
        <!-- 第一行 -->
        <view class="grid-row">
          <view
            class="grid-item"
            v-for="(item, index) in firstRowItems"
            :key="index"
            @tap="handleServiceTap(item)"
          >
            <view class="item-icon" :style="{ background: item.bgColor }">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
        </view>

        <!-- 第二行 -->
        <view class="grid-row">
          <view
            class="grid-item"
            v-for="(item, index) in secondRowItems"
            :key="index"
            @tap="handleServiceTap(item)"
          >
            <view class="item-icon" :style="{ background: item.bgColor }">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航占位 -->
    <view class="bottom-nav-placeholder">
      <view class="nav-item" v-for="(nav, index) in bottomNavs" :key="index">
        <view class="nav-item-icon" :class="nav.class">{{ nav.icon }}</view>
        <text class="nav-item-text">{{ nav.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { payLifeBill, queryUtilityBill, getPaymentHistory } from "@/api/life";

export default {
  name: "PaymentPage",
  data() {
    return {
      // 第一行服务项目
      firstRowItems: [
        {
          icon: "💧",
          label: "水费",
          bgColor: "linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)",
          type: "water",
        },
        {
          icon: "💡",
          label: "电费",
          bgColor: "linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)",
          type: "electric",
        },
        {
          icon: "🔥",
          label: "燃气费",
          bgColor: "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
          type: "gas",
        },
      ],

      // 第二行服务项目
      secondRowItems: [
        {
          icon: "🏠",
          label: "供暖费",
          bgColor: "linear-gradient(135deg, #A1887F 0%, #8D6E63 100%)",
          type: "heating",
        },
        {
          icon: "📺",
          label: "有线电视费",
          bgColor: "linear-gradient(135deg, #9575CD 0%, #7E57C2 100%)",
          type: "tv",
        },
        {
          icon: "📦",
          label: "物业费",
          bgColor: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)",
          type: "property",
        },
      ],

      // 底部导航
      bottomNavs: [
        { icon: "☭", text: "党费", class: "party-nav" },
        { icon: "💰", text: "工会费", class: "union-nav" },
        { icon: "💬", text: "更多", class: "more-nav" },
      ],

      // 我的缴费数据
      myPayments: [
        {
          type: "party",
          title: "党费",
          number: "410******",
          lastDigits: "5030",
        },
        {
          type: "phone",
          title: "手机充值",
          number: "15703724132",
          amount: "50元",
        },
      ],
    };
  },

  onLoad() {
    console.log("生活缴费页面加载");
  },

  methods: {
    // 处理卡片点击
    handleCardTap(type) {
      console.log("点击卡片:", type);

      switch (type) {
        case "party":
          uni.showToast({
            title: "跳转到党费缴费",
            icon: "none",
          });
          break;
        case "phone":
          uni.showToast({
            title: "跳转到手机充值",
            icon: "none",
          });
          // 可以跳转到手机充值页面
          // uni.navigateTo({
          //   url: "/pages/recharge/recharge"
          // });
          break;
      }
    },

    // 处理优惠横幅点击
    handlePromotionTap() {
      console.log("点击优惠横幅");
      uni.showToast({
        title: "查看优惠详情",
        icon: "none",
      });
    },

    // 处理服务项目点击
    handleServiceTap(item) {
      console.log("点击服务:", item);

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
            icon: "none",
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
            // 这里可以跳转到具体的缴费表单页面
            this.openPaymentForm(item);
          }
        },
      });
    },

    // 打开缴费表单页面
    openPaymentForm(item) {
      // 创建一个简单的缴费表单弹窗
      this.showPaymentDialog(item);
    },

    // 显示缴费对话框
    showPaymentDialog(item) {
      // 使用uni.showModal创建简单的缴费界面
      uni.showModal({
        title: `${item.label}缴费`,
        editable: true,
        placeholderText: "请输入户号或账号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.processPayment(item, res.content);
          }
        },
      });
    },

    // 处理缴费
    processPayment(item, accountNumber) {
      uni.showLoading({
        title: "查询中...",
      });

      // 模拟查询和缴费过程
      setTimeout(() => {
        uni.hideLoading();

        // 显示缴费结果
        uni.showModal({
          title: "缴费查询",
          content: `${
            item.label
          }\n账号: ${accountNumber}\n待缴费用: ¥${this.getRandomAmount(
            item
          )}元\n\n是否立即缴费？`,
          confirmText: "立即缴费",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              this.completePay(item, accountNumber);
            }
          },
        });
      }, 1500);
    },

    // 完成缴费
    completePay(item, accountNumber) {
      uni.showLoading({
        title: "缴费中...",
      });

      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: "缴费成功",
          icon: "success",
          duration: 2000,
        });

        // 可以在这里更新缴费记录
        console.log(`${item.label}缴费成功，账号: ${accountNumber}`);
      }, 2000);
    },

    // 跳转到水费页面
    goToWaterPage() {
      console.log("跳转到水费页面");
      uni.navigateTo({
        url: "/pages/water/water",
        success: () => {
          console.log("成功跳转到水费页面");
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

    // 跳转到缴费管理页面
    goToPaymentManagement() {
      console.log("跳转到缴费管理页面");
      uni.navigateTo({
        url: "/pages/payment-management/payment-management",
        success: () => {
          console.log("成功跳转到缴费管理页面");
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

    // 生成随机金额（模拟数据）
    getRandomAmount(item) {
      const amounts = {
        water: [45, 67, 89, 123, 156],
        electric: [89, 134, 178, 234, 289],
        gas: [67, 89, 112, 145, 178],
        heating: [234, 456, 678, 890, 1200],
        tv: [25, 30, 35, 40, 50],
        property: [180, 220, 280, 350, 420],
      };

      const typeAmounts = amounts[item.type] || [50, 100, 150, 200, 250];
      return typeAmounts[Math.floor(Math.random() * typeAmounts.length)];
    },
  },
};
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 位置选择 */
.location-section {
  background: #fff;
  padding: 60rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.location-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.location-icon {
  font-size: 24rpx;
}

.location-text {
  font-size: 28rpx;
  color: #333;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 24rpx;
  padding: 12rpx 20rpx;
  gap: 10rpx;
}

.search-icon {
  font-size: 24rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

/* 我的缴费 */
.my-payment-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.manage-text {
  font-size: 26rpx;
  color: #666;
}

.arrow {
  font-size: 24rpx;
  color: #999;
}

/* 缴费卡片 */
.payment-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.payment-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-radius: 12rpx;
  background: #fff;
  border: 2rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.payment-card:active {
  transform: scale(0.98);
  background: #f8f9fa;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.card-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.party-icon {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
}

.party-symbol {
  color: #fff;
  font-size: 32rpx;
}

.phone-icon {
  background: linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%);
}

.phone-symbol {
  color: #fff;
  font-size: 28rpx;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.card-subtitle {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 4rpx;
}

.card-number {
  font-size: 24rpx;
  color: #999;
}

.card-right {
  display: flex;
  align-items: center;
}

.recharge-icon {
  font-size: 32rpx;
  color: #2ed573;
}

/* 优惠横幅 */
.promotion-banner {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.promotion-banner:active {
  transform: scale(0.98);
}

.banner-content {
  flex: 1;
  z-index: 2;
}

.banner-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 16rpx;
}

.banner-tag {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.banner-decoration {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.frog-icon,
.cards-icon {
  font-size: 48rpx;
  animation: float 3s ease-in-out infinite;
}

.cards-icon {
  animation-delay: 1.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

/* 新增缴费 */
.new-payment-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.payment-grid {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  margin-top: 30rpx;
}

.grid-row {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.grid-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.grid-item:active {
  transform: translateY(-4rpx);
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.item-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.8;
}

.icon-text {
  font-size: 32rpx;
  color: #fff;
  position: relative;
  z-index: 1;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.item-label {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

/* 底部导航占位 */
.bottom-nav-placeholder {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  padding: 20rpx 0;
  margin-top: 40rpx;
  border-top: 1rpx solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  transition: all 0.3s ease;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item-icon {
  font-size: 32rpx;
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.party-nav {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
}

.union-nav {
  background: linear-gradient(135deg, #3742fa 0%, #2f3542 100%);
}

.more-nav {
  background: linear-gradient(135deg, #57606f 0%, #2f3542 100%);
}

.nav-item-text {
  font-size: 22rpx;
  color: #666;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .grid-row {
    gap: 15rpx;
  }

  .item-icon {
    width: 72rpx;
    height: 72rpx;
  }

  .icon-text {
    font-size: 28rpx;
  }

  .item-label {
    font-size: 24rpx;
  }
}

/* 页面加载动画 */
.payment-page {
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

/* 卡片悬停效果 */
.payment-card:hover,
.grid-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
}

/* 按钮点击效果 */
.payment-card:active,
.grid-item:active,
.promotion-banner:active,
.nav-item:active {
  opacity: 0.8;
}
</style>
<template>
  <view class="payment-page">
    <!-- 头部区域 -->
    <view class="header">
      <text class="page-title">生活缴费</text>
      <text class="page-subtitle">便民服务，一键支付</text>
    </view>

    <!-- 缴费类型网格 -->
    <view class="payment-grid">
      <!-- 水费 -->
      <view class="payment-item" @tap="goToWater">
        <view class="item-icon water-icon">💧</view>
        <text class="item-title">水费</text>
        <text class="item-desc">自来水缴费</text>
      </view>

      <!-- 电费 -->
      <view class="payment-item" @tap="goToElectric">
        <view class="item-icon electric-icon">⚡</view>
        <text class="item-title">电费</text>
        <text class="item-desc">电力缴费</text>
      </view>

      <!-- 燃气费 -->
      <view class="payment-item" @tap="goToGas">
        <view class="item-icon gas-icon">🔥</view>
        <text class="item-title">燃气费</text>
        <text class="item-desc">天然气缴费</text>
      </view>

      <!-- 话费 -->
      <view class="payment-item" @tap="goToPhone">
        <view class="item-icon phone-icon">📱</view>
        <text class="item-title">话费</text>
        <text class="item-desc">手机充值</text>
      </view>

      <!-- 宽带费 -->
      <view class="payment-item" @tap="goToBroadband">
        <view class="item-icon broadband-icon">🌐</view>
        <text class="item-title">宽带费</text>
        <text class="item-desc">网络缴费</text>
      </view>

      <!-- 有线电视 -->
      <view class="payment-item" @tap="goToTV">
        <view class="item-icon tv-icon">📺</view>
        <text class="item-title">有线电视</text>
        <text class="item-desc">数字电视</text>
      </view>
    </view>

    <!-- 最近缴费记录 -->
    <view class="recent-section">
      <view class="section-header">
        <text class="section-title">最近缴费</text>
        <text class="more-link" @tap="goToPaymentManagement">查看全部</text>
      </view>

      <view class="recent-list" v-if="recentPayments.length > 0">
        <view
          class="recent-item"
          v-for="payment in recentPayments"
          :key="payment.id"
          @tap="goToPaymentDetail(payment)"
        >
          <view class="recent-left">
            <view class="recent-icon" :class="payment.type + '-icon'">
              {{ payment.icon }}
            </view>
            <view class="recent-info">
              <text class="recent-title">{{ payment.title }}</text>
              <text class="recent-desc">{{ payment.desc }}</text>
            </view>
          </view>
          <view class="recent-right">
            <text class="recent-amount">¥{{ payment.amount }}</text>
            <text class="recent-status" :class="payment.status">
              {{ payment.statusText }}
            </text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text class="empty-text">暂无缴费记录</text>
        <text class="empty-desc">快去缴费吧~</text>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from "@/utils/auth.js";

export default {
  name: "PaymentPage",
  data() {
    return {
      recentPayments: [],
      paymentRecords: [],
    };
  },

  onLoad() {
    console.log("生活缴费页面加载");
    this.loadPaymentData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("生活缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("生活缴费页面显示");
      this.loadPaymentData();
    } catch (error) {
      console.error("生活缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  methods: {
    // 加载缴费数据
    loadPaymentData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          // 加载缴费记录
          this.paymentRecords = currentUser.paymentRecords || [];

          // 处理最近缴费数据
          this.recentPayments = this.paymentRecords
            .slice(0, 5)
            .map((record) => ({
              id: record.id,
              type: this.getPaymentType(record.type),
              icon: this.getPaymentIcon(record.type),
              title: record.type,
              desc: record.phoneNumber || record.account || record.description,
              amount: record.amount.toFixed(2),
              status: record.status === "completed" ? "success" : "pending",
              statusText: record.status === "completed" ? "缴费成功" : "处理中",
            }));

          console.log("✅ 生活缴费数据加载成功:", {
            paymentRecords: this.paymentRecords.length,
            recentPayments: this.recentPayments.length,
            userBalance: currentUser.balance,
          });
        } else {
          console.log("❌ 未找到当前用户数据");
          this.recentPayments = [];
          this.paymentRecords = [];
        }
      } catch (error) {
        console.error("❌ 加载生活缴费数据失败:", error);
        this.recentPayments = [];
        this.paymentRecords = [];
      }
    },

    // 获取缴费类型
    getPaymentType(type) {
      const typeMap = {
        手机充值: "phone",
        电费: "electric",
        水费: "water",
        燃气费: "gas",
        宽带费: "broadband",
        有线电视费: "tv",
        党费: "party",
      };
      return typeMap[type] || "other";
    },

    // 获取缴费图标
    getPaymentIcon(type) {
      const iconMap = {
        手机充值: "📱",
        电费: "⚡",
        水费: "💧",
        燃气费: "🔥",
        宽带费: "🌐",
        有线电视费: "📺",
        党费: "☭",
      };
      return iconMap[type] || "💰";
    },

    goToWater() {
      uni.navigateTo({
        url: "/pages/water/water",
      });
    },

    goToElectric() {
      uni.navigateTo({
        url: "/pages/electric/electric",
      });
    },

    goToGas() {
      uni.navigateTo({
        url: "/pages/gas/gas",
      });
    },

    goToPhone() {
      uni.navigateTo({
        url: "/pages/recharge/recharge",
      });
    },

    goToBroadband() {
      uni.navigateTo({
        url: "/pages/broadband/broadband",
      });
    },

    goToTV() {
      uni.navigateTo({
        url: "/pages/tv/tv",
      });
    },

    goToPaymentManagement() {
      uni.navigateTo({
        url: "/pages/payment-management/payment-management",
      });
    },

    goToPaymentDetail(payment) {
      console.log("查看缴费详情:", payment);
      uni.showToast({
        title: "缴费详情功能开发中",
        icon: "none",
      });
    },
  },
};
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 头部区域 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 30rpx 40rpx;
  color: #fff;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.page-subtitle {
  display: block;
  font-size: 28rpx;
  opacity: 0.9;
}

/* 缴费类型网格 */
.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.payment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 20rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.payment-item:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-bottom: 20rpx;
}

.water-icon {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.electric-icon {
  background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
}

.gas-icon {
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
}

.broadband-icon {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
}

.tv-icon {
  background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
}

.item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

/* 最近缴费记录 */
.recent-section {
  background: #fff;
  padding: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.more-link {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: background-color 0.3s ease;
}

.recent-item:active {
  background: #e9ecef;
}

.recent-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.recent-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.recent-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.recent-desc {
  font-size: 24rpx;
  color: #999;
}

.recent-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
}

.recent-amount {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.recent-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-weight: 500;
}

.recent-status.success {
  background: #d1f2eb;
  color: #00a085;
}

.recent-status.pending {
  background: #fef9e7;
  color: #f39c12;
}

.recent-status.failed {
  background: #fadbd8;
  color: #e74c3c;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #ccc;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .payment-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-title {
    font-size: 40rpx;
  }
}
</style>

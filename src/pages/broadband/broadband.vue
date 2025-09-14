<template>
  <view class="broadband-page">
    <!-- 地区选择 -->
    <view class="location-section">
      <view class="location-header">
        <text class="location-title">选择地区</text>
        <text class="location-tip">请选择您的缴费地区</text>
      </view>

      <view class="current-location" @tap="goToCitySelect">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <view class="location-text-wrapper">
            <text class="location-text">{{ selectedCity }}</text>
            <text class="location-status">当前定位</text>
          </view>
        </view>
        <text class="change-text">更换</text>
      </view>
    </view>

    <!-- 运营商选择 -->
    <view class="company-section" v-if="broadbandProviders.length > 0">
      <view class="section-header">
        <text class="section-title">选择宽带运营商</text>
        <text class="company-count"
          >{{ broadbandProviders.length }}家运营商</text
        >
      </view>

      <view class="company-list">
        <view
          class="company-item"
          v-for="(provider, index) in broadbandProviders"
          :key="index"
          @tap="selectProvider(provider)"
        >
          <view class="company-info">
            <text class="company-name">{{ provider.name }}</text>
            <text class="company-desc">{{ provider.description }}</text>
          </view>
          <view class="company-arrow">
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 暂无服务提示 -->
    <view class="no-service" v-if="broadbandProviders.length === 0">
      <view class="no-service-icon">🌐</view>
      <text class="no-service-title">暂无宽带服务</text>
      <text class="no-service-desc"
        >{{ selectedCity }}暂未开通宽带缴费服务</text
      >
      <text class="no-service-tip">请联系当地运营商或稍后再试</text>
    </view>

    <!-- 底部说明 -->
    <view class="footer-info">
      <text class="info-text">• 缴费成功后，请保留缴费凭证</text>
      <text class="info-text">• 如有疑问，请联系运营商客服</text>
      <text class="info-text">• 缴费到账时间：实时到账</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "BroadbandPage",
  data() {
    return {
      selectedCity: "保定市", // 默认城市

      // 不同城市的宽带运营商数据
      cityBroadbandProviders: {
        保定市: [
          {
            name: "中国移动宽带",
            description: "中国移动保定分公司宽带服务",
            code: "baoding_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通保定分公司宽带服务",
            code: "baoding_unicom",
            serviceArea: "主城区、开发区",
          },
          {
            name: "中国电信宽带",
            description: "中国电信保定分公司宽带服务",
            code: "baoding_telecom",
            serviceArea: "主城区、郊区",
          },
        ],
        北京: [
          {
            name: "中国移动宽带",
            description: "中国移动北京分公司宽带服务",
            code: "beijing_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通北京分公司宽带服务",
            code: "beijing_unicom",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国电信宽带",
            description: "中国电信北京分公司宽带服务",
            code: "beijing_telecom",
            serviceArea: "全市覆盖",
          },
          {
            name: "北京歌华有线",
            description: "北京歌华有线宽带服务",
            code: "beijing_gehua",
            serviceArea: "部分区域",
          },
        ],
        上海: [
          {
            name: "中国移动宽带",
            description: "中国移动上海分公司宽带服务",
            code: "shanghai_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通上海分公司宽带服务",
            code: "shanghai_unicom",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国电信宽带",
            description: "中国电信上海分公司宽带服务",
            code: "shanghai_telecom",
            serviceArea: "全市覆盖",
          },
        ],
        广州市: [
          {
            name: "中国移动宽带",
            description: "中国移动广州分公司宽带服务",
            code: "guangzhou_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通广州分公司宽带服务",
            code: "guangzhou_unicom",
            serviceArea: "主城区",
          },
          {
            name: "中国电信宽带",
            description: "中国电信广州分公司宽带服务",
            code: "guangzhou_telecom",
            serviceArea: "全市覆盖",
          },
        ],
        深圳: [
          {
            name: "中国移动宽带",
            description: "中国移动深圳分公司宽带服务",
            code: "shenzhen_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通深圳分公司宽带服务",
            code: "shenzhen_unicom",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国电信宽带",
            description: "中国电信深圳分公司宽带服务",
            code: "shenzhen_telecom",
            serviceArea: "全市覆盖",
          },
        ],
        杭州市: [
          {
            name: "中国移动宽带",
            description: "中国移动杭州分公司宽带服务",
            code: "hangzhou_mobile",
            serviceArea: "全市覆盖",
          },
          {
            name: "中国联通宽带",
            description: "中国联通杭州分公司宽带服务",
            code: "hangzhou_unicom",
            serviceArea: "主城区、西湖区",
          },
          {
            name: "中国电信宽带",
            description: "中国电信杭州分公司宽带服务",
            code: "hangzhou_telecom",
            serviceArea: "全市覆盖",
          },
        ],
      },
    };
  },

  computed: {
    // 当前城市的宽带运营商
    broadbandProviders() {
      return this.cityBroadbandProviders[this.selectedCity] || [];
    },
  },

  onLoad() {
    console.log("宽带费页面加载");
    this.initializeLocation();
    this.loadUserData();
  },

  onShow() {
    // 页面显示时检查城市是否有变化
    this.syncLocationFromStorage();
  },

  onReady() {
    // 监听城市选择事件
    uni.$on("citySelected", (city) => {
      console.log("宽带费页面接收到城市选择:", city);
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        uni.showToast({
          title: `已切换到${city}`,
          icon: "none",
          duration: 1500,
        });
      }
    });
  },

  onUnload() {
    // 移除事件监听
    uni.$off("citySelected");
  },

  methods: {
    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          console.log("✅ 用户数据加载成功:", {
            username: currentUser.username,
            phone: currentUser.phone,
            balance: currentUser.balance,
            hasLifeServices: !!currentUser.lifeServices,
          });

          // 如果有生活服务数据，可以在这里处理
          if (currentUser.lifeServices) {
            console.log("用户生活服务数据:", currentUser.lifeServices);
          }
        } else {
          console.log("❌ 未找到当前用户数据");
        }
      } catch (error) {
        console.error("❌ 加载用户数据失败:", error);
      }
    },

    // 初始化位置信息
    initializeLocation() {
      const city = uni.getStorageSync("selectedCity");
      if (city) {
        this.selectedCity = city;
        console.log(`宽带费页面同步城市: ${city}`);
      }
    },

    // 从存储同步位置信息
    syncLocationFromStorage() {
      const city = uni.getStorageSync("selectedCity");
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        console.log(`宽带费页面城市已更新: ${city}`);

        // 显示城市变更提示
        uni.showToast({
          title: `已切换到${city}`,
          icon: "none",
          duration: 1500,
        });
      }
    },

    // 跳转到城市选择页面
    goToCitySelect() {
      console.log("从宽带费页面跳转到城市选择");
      uni.navigateTo({
        url: "/pages/city-select/city-select",
        success: () => {
          console.log("成功跳转到城市选择页面");
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

    // 选择宽带运营商
    selectProvider(provider) {
      console.log("选择宽带运营商:", provider);

      uni.showModal({
        title: provider.name,
        content: `服务区域：${provider.serviceArea}\n\n即将进入${provider.name}缴费页面，请准备好您的宽带账号。`,
        confirmText: "进入缴费",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.enterPaymentFlow(provider);
          }
        },
      });
    },

    // 进入缴费流程
    enterPaymentFlow(provider) {
      // 跳转到新的宽带费缴费页面
      uni.navigateTo({
        url: `/pages/broadband-payment/broadband-payment?city=${encodeURIComponent(
          this.selectedCity
        )}&provider=${encodeURIComponent(JSON.stringify(provider))}`,
        success: () => {
          console.log("成功跳转到宽带费缴费页面");
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

    // 生成交易流水号
    generateTransactionId() {
      const now = new Date();
      const timestamp = now.getTime().toString();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `BB${timestamp.slice(-8)}${random}`;
    },
  },
};
</script>

<style scoped>
.broadband-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 地区选择 */
.location-section {
  background: #fff;
  margin: 60rpx 30rpx 20rpx; /* 增加顶部间距 */
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.location-header {
  margin-bottom: 24rpx;
}

.location-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.location-tip {
  font-size: 24rpx;
  color: #666;
}

.current-location {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.current-location:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.location-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.location-icon {
  font-size: 32rpx;
  color: #3b82f6;
}

.location-text-wrapper {
  flex: 1;
}

.location-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.location-status {
  font-size: 22rpx;
  color: #3b82f6;
  background: #eff6ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.change-text {
  font-size: 26rpx;
  color: #3b82f6;
  font-weight: 500;
}

/* 运营商选择 */
.company-section {
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
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.company-count {
  font-size: 24rpx;
  color: #666;
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.company-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.company-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.company-desc {
  font-size: 24rpx;
  color: #666;
}

.company-arrow {
  margin-left: 20rpx;
}

.arrow-icon {
  font-size: 24rpx;
  color: #999;
}

/* 暂无服务 */
.no-service {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80rpx 30rpx;
  margin: 40rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.no-service-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.no-service-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.no-service-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.no-service-tip {
  font-size: 24rpx;
  color: #999;
}

/* 底部说明 */
.footer-info {
  margin: 40rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.info-text:last-child {
  margin-bottom: 0;
}

/* 页面加载动画 */
.broadband-page {
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
  .location-section,
  .company-section,
  .footer-info {
    margin: 20rpx 20rpx;
    padding: 24rpx;
  }

  .company-item {
    padding: 20rpx;
  }
}
</style>

<template>
  <view class="tv-page">
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

    <!-- 有线电视运营商选择 -->
    <view class="company-section" v-if="tvProviders.length > 0">
      <view class="section-header">
        <text class="section-title">选择有线电视运营商</text>
        <text class="company-count">{{ tvProviders.length }}家运营商</text>
      </view>

      <view class="company-list">
        <view
          class="company-item"
          v-for="(provider, index) in tvProviders"
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
    <view class="no-service" v-if="tvProviders.length === 0">
      <view class="no-service-icon">📺</view>
      <text class="no-service-title">暂无有线电视服务</text>
      <text class="no-service-desc"
        >{{ selectedCity }}暂未开通有线电视缴费服务</text
      >
      <text class="no-service-tip">请联系当地有线电视运营商或稍后再试</text>
    </view>

    <!-- 底部说明 -->
    <view class="footer-info">
      <text class="info-text">• 缴费成功后，请保留缴费凭证</text>
      <text class="info-text">• 如有疑问，请联系有线电视客服</text>
      <text class="info-text">• 缴费到账时间：实时到账</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "TvPage",
  data() {
    return {
      selectedCity: "保定市", // 默认城市

      // 不同城市的有线电视运营商数据
      cityTvProviders: {
        保定市: [
          {
            name: "保定广电网络",
            description: "保定市有线数字电视服务",
            code: "baoding_catv",
            serviceArea: "全市覆盖",
          },
          {
            name: "河北广电网络保定分公司",
            description: "河北广电保定地区服务",
            code: "hebei_catv_baoding",
            serviceArea: "主城区、县区",
          },
        ],
        北京: [
          {
            name: "北京歌华有线",
            description: "北京市有线数字电视服务商",
            code: "beijing_gehua",
            serviceArea: "全市覆盖",
          },
          {
            name: "北京数字电视",
            description: "北京数字电视运营服务",
            code: "beijing_digital_tv",
            serviceArea: "部分区域",
          },
        ],
        上海: [
          {
            name: "上海东方有线",
            description: "上海市有线数字电视服务商",
            code: "shanghai_oriental",
            serviceArea: "全市覆盖",
          },
        ],
        广州市: [
          {
            name: "广州珠江数码",
            description: "广州市有线数字电视服务",
            code: "guangzhou_zhujiang",
            serviceArea: "主城区",
          },
          {
            name: "广东广电网络广州分公司",
            description: "广东广电广州地区服务",
            code: "guangdong_catv_gz",
            serviceArea: "全市覆盖",
          },
        ],
        深圳: [
          {
            name: "深圳天威视讯",
            description: "深圳市有线数字电视服务商",
            code: "shenzhen_topway",
            serviceArea: "全市覆盖",
          },
        ],
        杭州市: [
          {
            name: "杭州华数传媒",
            description: "杭州市有线数字电视服务",
            code: "hangzhou_wasu",
            serviceArea: "全市覆盖",
          },
          {
            name: "浙江广电网络杭州分公司",
            description: "浙江广电杭州地区服务",
            code: "zhejiang_catv_hz",
            serviceArea: "主城区、西湖区",
          },
        ],
      },
    };
  },

  computed: {
    // 当前城市的有线电视运营商
    tvProviders() {
      return this.cityTvProviders[this.selectedCity] || [];
    },
  },

  onLoad() {
    console.log("有线电视费页面加载");
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
      console.log("有线电视费页面接收到城市选择:", city);
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
        console.log(`有线电视费页面同步城市: ${city}`);
      }
    },

    // 从存储同步位置信息
    syncLocationFromStorage() {
      const city = uni.getStorageSync("selectedCity");
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        console.log(`有线电视费页面城市已更新: ${city}`);

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
      console.log("从有线电视费页面跳转到城市选择");
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

    // 选择有线电视运营商
    selectProvider(provider) {
      console.log("选择有线电视运营商:", provider);

      uni.showModal({
        title: provider.name,
        content: `服务区域：${provider.serviceArea}\n\n即将进入${provider.name}缴费页面，请准备好您的机顶盒号码或用户号。`,
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
      // 跳转到新的有线电视费缴费页面
      uni.navigateTo({
        url: `/pages/tv-payment/tv-payment?city=${encodeURIComponent(
          this.selectedCity
        )}&provider=${encodeURIComponent(JSON.stringify(provider))}`,
        success: () => {
          console.log("成功跳转到有线电视费缴费页面");
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
      return `TV${timestamp.slice(-8)}${random}`;
    },
  },
};
</script>

<style scoped>
.tv-page {
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
  color: #8b5cf6;
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
  color: #8b5cf6;
  background: #f3f4f6;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.change-text {
  font-size: 26rpx;
  color: #8b5cf6;
  font-weight: 500;
}

/* 有线电视运营商选择 */
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
.tv-page {
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

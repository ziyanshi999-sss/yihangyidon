<template>
  <view class="gas-page">
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

    <!-- 燃气公司选择 -->
    <view class="company-section" v-if="gasCompanies.length > 0">
      <view class="section-header">
        <text class="section-title">选择燃气公司</text>
        <text class="company-count">{{ gasCompanies.length }}家公司</text>
      </view>

      <view class="company-list">
        <view
          class="company-item"
          v-for="(company, index) in gasCompanies"
          :key="index"
          @tap="selectCompany(company)"
        >
          <view class="company-info">
            <text class="company-name">{{ company.name }}</text>
            <text class="company-desc">{{ company.description }}</text>
          </view>
          <view class="company-arrow">
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 暂无服务提示 -->
    <view class="no-service" v-if="gasCompanies.length === 0">
      <view class="no-service-icon">🔥</view>
      <text class="no-service-title">暂无燃气服务</text>
      <text class="no-service-desc"
        >{{ selectedCity }}暂未开通燃气缴费服务</text
      >
      <text class="no-service-tip">请联系当地燃气公司或稍后再试</text>
    </view>

    <!-- 底部说明 -->
    <view class="footer-info">
      <text class="info-text">• 缴费成功后，请保留缴费凭证</text>
      <text class="info-text">• 如有疑问，请联系燃气公司客服</text>
      <text class="info-text">• 缴费到账时间：实时到账</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "GasPage",
  data() {
    return {
      selectedCity: "保定市", // 默认城市

      // 不同城市的燃气公司数据
      cityGasCompanies: {
        保定市: [
          {
            name: "华润燃气保定有限公司",
            description: "保定市主城区燃气服务",
            code: "baoding_gas",
            serviceArea: "主城区、高新区",
          },
          {
            name: "新奥燃气保定有限公司",
            description: "保定市南部地区燃气服务",
            code: "baoding_xinao_gas",
            serviceArea: "满城区、清苑区",
          },
        ],
        北京: [
          {
            name: "北京燃气集团有限责任公司",
            description: "北京市主要燃气服务商",
            code: "beijing_gas",
            serviceArea: "全市范围",
          },
          {
            name: "北京港华燃气有限公司",
            description: "北京市部分区域燃气服务",
            code: "beijing_ganghua_gas",
            serviceArea: "部分区域",
          },
        ],
        上海: [
          {
            name: "上海燃气集团股份有限公司",
            description: "上海市主要燃气服务商",
            code: "shanghai_gas",
            serviceArea: "全市范围",
          },
        ],
        广州市: [
          {
            name: "广州燃气集团有限公司",
            description: "广州市主城区燃气服务",
            code: "guangzhou_gas",
            serviceArea: "主城区",
          },
          {
            name: "华润燃气广州有限公司",
            description: "广州市部分区域燃气服务",
            code: "guangzhou_huarun_gas",
            serviceArea: "番禺区、南沙区",
          },
        ],
        深圳: [
          {
            name: "深圳燃气集团股份有限公司",
            description: "深圳市主要燃气服务商",
            code: "shenzhen_gas",
            serviceArea: "全市范围",
          },
        ],
        杭州市: [
          {
            name: "杭州市燃气集团有限公司",
            description: "杭州市主城区燃气服务",
            code: "hangzhou_gas",
            serviceArea: "主城区、西湖区",
          },
        ],
      },
    };
  },

  computed: {
    // 当前城市的燃气公司
    gasCompanies() {
      return this.cityGasCompanies[this.selectedCity] || [];
    },
  },

  onLoad() {
    console.log("燃气费页面加载");
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
      console.log("燃气费页面接收到城市选择:", city);
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
        console.log(`燃气费页面同步城市: ${city}`);
      }
    },

    // 从存储同步位置信息
    syncLocationFromStorage() {
      const city = uni.getStorageSync("selectedCity");
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        console.log(`燃气费页面城市已更新: ${city}`);

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
      console.log("从燃气费页面跳转到城市选择");
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

    // 选择燃气公司
    selectCompany(company) {
      console.log("选择燃气公司:", company);

      uni.showModal({
        title: company.name,
        content: `服务区域：${company.serviceArea}\n\n即将进入${company.name}缴费页面，请准备好您的用户编号。`,
        confirmText: "进入缴费",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.enterPaymentFlow(company);
          }
        },
      });
    },

    // 进入缴费流程
    enterPaymentFlow(company) {
      // 跳转到新的燃气费缴费页面
      uni.navigateTo({
        url: `/pages/gas-payment/gas-payment?city=${encodeURIComponent(
          this.selectedCity
        )}&company=${encodeURIComponent(JSON.stringify(company))}`,
        success: () => {
          console.log("成功跳转到燃气费缴费页面");
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
      return `GF${timestamp.slice(-8)}${random}`;
    },
  },
};
</script>

<style scoped>
.gas-page {
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
  color: #dc2626;
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
  color: #dc2626;
  background: #fef2f2;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.change-text {
  font-size: 26rpx;
  color: #dc2626;
  font-weight: 500;
}

/* 燃气公司选择 */
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
.gas-page {
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

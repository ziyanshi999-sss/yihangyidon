<template>
  <view class="electric-payment-page">
    <!-- 顶部电力主题插画背景 -->
    <view class="header-section">
      <view class="electric-illustration">
        <!-- SVG电力插画 -->
        <view class="electric-scene">
          <!-- 背景城市轮廓 -->
          <view class="city-skyline"></view>

          <!-- 电线塔 -->
          <view class="power-tower">
            <view class="tower-base"></view>
            <view class="tower-body"></view>
            <view class="tower-top"></view>
            <view class="power-lines" v-if="showPowerFlow">
              <view class="line line-1"></view>
              <view class="line line-2"></view>
              <view class="line line-3"></view>
            </view>
          </view>

          <!-- 电力设备 -->
          <view class="electric-equipment">
            <view class="transformer">
              <view class="transformer-body"></view>
              <view class="transformer-top"></view>
              <view class="electric-spark" v-if="showSpark"></view>
            </view>
            <view class="control-panel">
              <view class="panel-body"></view>
              <view
                class="indicator indicator-1"
                :class="{ active: showIndicator1 }"
              ></view>
              <view
                class="indicator indicator-2"
                :class="{ active: showIndicator2 }"
              ></view>
              <view
                class="indicator indicator-3"
                :class="{ active: showIndicator3 }"
              ></view>
            </view>
          </view>

          <!-- 电表 -->
          <view class="electric-meter">
            <view class="meter-body">
              <view class="meter-display">
                <text class="meter-number">{{ meterReading }}</text>
              </view>
              <view class="meter-dial"></view>
            </view>
          </view>

          <!-- 闪电效果 -->
          <view class="lightning-effects">
            <view class="lightning lightning-1" v-if="showLightning1"></view>
            <view class="lightning lightning-2" v-if="showLightning2"></view>
          </view>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <text class="page-title">电费</text>
        <text class="location-text">{{ selectedCity }}</text>
      </view>
    </view>

    <!-- 缴费项目信息 -->
    <view class="payment-info-section">
      <view class="info-row">
        <text class="info-label">缴费项目</text>
        <text class="info-value">电费</text>
      </view>

      <view class="info-row">
        <text class="info-label">收费单位</text>
        <text class="info-value">{{ selectedCompany.name }}</text>
      </view>

      <view class="info-row">
        <text class="info-label">用户号</text>
        <view class="input-container">
          <input
            class="user-number-input"
            v-model="userNumber"
            placeholder="请输入用户号"
            type="text"
            maxlength="20"
            @input="onUserNumberInput"
          />
        </view>
      </view>
    </view>

    <!-- 分组选择 -->
    <view class="group-section">
      <text class="group-label">分组</text>
      <view class="group-options">
        <view
          class="group-option"
          v-for="(group, index) in groupOptions"
          :key="index"
          :class="{ active: selectedGroup === group.value }"
          @tap="selectGroup(group.value)"
        >
          <text class="group-text">{{ group.label }}</text>
        </view>
      </view>
      <view class="group-manage">
        <text class="manage-text">常用缴费</text>
        <text class="manage-arrow">></text>
      </view>
    </view>

    <!-- 下一步按钮 -->
    <view class="next-button-container">
      <button
        class="next-button"
        :class="{ disabled: !canProceed }"
        @tap="handleNext"
        :disabled="!canProceed"
      >
        下一步
      </button>
    </view>

    <!-- 账单详情弹窗 -->
    <view class="bill-modal" v-if="showBillModal" @tap="hideBillModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">电费账单</text>
          <text class="modal-close" @tap="hideBillModal">×</text>
        </view>
        <view class="modal-body">
          <view class="bill-info">
            <view class="bill-row">
              <text class="bill-label">用户编号：</text>
              <text class="bill-value">{{ billInfo.userNumber }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">用户姓名：</text>
              <text class="bill-value">{{ billInfo.userName }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">用电地址：</text>
              <text class="bill-value">{{ billInfo.address }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">上期读数：</text>
              <text class="bill-value">{{ billInfo.lastReading }}度</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期读数：</text>
              <text class="bill-value">{{ billInfo.currentReading }}度</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期用量：</text>
              <text class="bill-value">{{ billInfo.usage }}度</text>
            </view>
            <view class="bill-row highlight">
              <text class="bill-label">应缴费用：</text>
              <text class="bill-amount">¥{{ billInfo.amount }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">缴费期限：</text>
              <text class="bill-value">{{ billInfo.dueDate }}</text>
            </view>
          </view>

          <button class="pay-button" @tap="proceedToPayment">立即缴费</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from "@/utils/auth.js";

export default {
  name: "ElectricPaymentPage",
  data() {
    return {
      selectedCity: "保定市",
      selectedCompany: {
        name: "国家电网保定供电公司",
        code: "baoding_electric",
      },
      userNumber: "",
      selectedGroup: "self",
      showPowerFlow: false,
      showSpark: false,
      showIndicator1: false,
      showIndicator2: false,
      showIndicator3: false,
      showLightning1: false,
      showLightning2: false,
      meterReading: "12345",
      showBillModal: false,
      groupOptions: [
        { label: "自己", value: "self" },
        { label: "父母", value: "parents" },
        { label: "朋友", value: "friends" },
      ],
      billInfo: {
        userNumber: "",
        userName: "",
        address: "",
        lastReading: 0,
        currentReading: 0,
        usage: 0,
        amount: "0.00",
        dueDate: "",
      },
    };
  },

  computed: {
    canProceed() {
      return this.userNumber && this.userNumber.length >= 6;
    },
  },

  onLoad(options) {
    // 接收从电费页面传递的参数
    if (options.city) {
      this.selectedCity = options.city;
    }
    if (options.company) {
      try {
        this.selectedCompany = JSON.parse(decodeURIComponent(options.company));
      } catch (e) {
        console.error("解析公司信息失败:", e);
      }
    }

    console.log("电费缴费页面加载，参数：", {
      city: this.selectedCity,
      company: this.selectedCompany,
    });

    // 启动电力动画
    this.startElectricAnimation();
    this.loadUserData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("电费缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("电费缴费页面显示");
    } catch (error) {
      console.error("电费缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  onUnload() {
    // 清理定时器
    if (this.electricTimer) {
      clearInterval(this.electricTimer);
    }
    if (this.indicatorTimer) {
      clearInterval(this.indicatorTimer);
    }
    if (this.lightningTimer) {
      clearInterval(this.lightningTimer);
    }
  },

  methods: {
    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          console.log("电费缴费页面加载用户数据:", {
            username: currentUser.username,
            balance: currentUser.balance,
          });
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    },

    // 启动电力动画
    startElectricAnimation() {
      // 电力线动画
      this.electricTimer = setInterval(() => {
        this.showPowerFlow = !this.showPowerFlow;
        this.showSpark = !this.showSpark;
      }, 2000);

      // 指示灯动画
      this.indicatorTimer = setInterval(() => {
        this.showIndicator1 = Math.random() > 0.5;
        this.showIndicator2 = Math.random() > 0.5;
        this.showIndicator3 = Math.random() > 0.5;
      }, 1000);

      // 闪电动画
      this.lightningTimer = setInterval(() => {
        this.showLightning1 = Math.random() > 0.8;
        this.showLightning2 = Math.random() > 0.8;
      }, 3000);

      // 电表读数动画
      setInterval(() => {
        const baseReading = 12345;
        const random = Math.floor(Math.random() * 100);
        this.meterReading = (baseReading + random).toString();
      }, 5000);
    },

    // 用户号输入处理
    onUserNumberInput() {
      // 限制只能输入数字和字母
      this.userNumber = this.userNumber.replace(/[^a-zA-Z0-9]/g, "");
    },

    // 选择分组
    selectGroup(group) {
      this.selectedGroup = group;
      console.log("选择分组:", group);
    },

    // 处理下一步
    async handleNext() {
      if (!this.canProceed) {
        uni.showToast({
          title: "请输入正确的用户号",
          icon: "none",
        });
        return;
      }

      try {
        uni.showLoading({ title: "查询中..." });

        // 模拟查询用户信息
        await this.queryUserBill();

        uni.hideLoading();
        this.showBillModal = true;
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: "查询失败，请稍后重试",
          icon: "none",
        });
        console.error("查询用户账单失败:", error);
      }
    },

    // 查询用户账单
    async queryUserBill() {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 生成模拟账单数据
      const mockBill = {
        userNumber: this.userNumber,
        userName: this.generateUserName(),
        address: this.generateAddress(),
        lastReading: Math.floor(Math.random() * 1000) + 500,
        currentReading: 0,
        usage: 0,
        amount: "0.00",
        dueDate: this.generateDueDate(),
      };

      mockBill.currentReading =
        mockBill.lastReading + Math.floor(Math.random() * 300) + 100;
      mockBill.usage = mockBill.currentReading - mockBill.lastReading;
      mockBill.amount = this.calculateElectricBill(mockBill.usage);

      this.billInfo = mockBill;
    },

    // 生成模拟用户名
    generateUserName() {
      const surnames = [
        "张",
        "王",
        "李",
        "刘",
        "陈",
        "杨",
        "赵",
        "黄",
        "周",
        "吴",
      ];
      const names = [
        "伟",
        "芳",
        "娜",
        "敏",
        "静",
        "丽",
        "强",
        "磊",
        "军",
        "洋",
      ];
      return (
        surnames[Math.floor(Math.random() * surnames.length)] +
        names[Math.floor(Math.random() * names.length)]
      );
    },

    // 生成模拟地址
    generateAddress() {
      const districts = ["新市区", "竞秀区", "莲池区", "满城区", "清苑区"];
      const communities = [
        "阳光小区",
        "绿城花园",
        "金桂园",
        "紫薇苑",
        "梧桐大院",
      ];
      const buildings = Math.floor(Math.random() * 20) + 1;
      const units = Math.floor(Math.random() * 6) + 1;
      const rooms = Math.floor(Math.random() * 20) + 101;

      return `${districts[Math.floor(Math.random() * districts.length)]}${
        communities[Math.floor(Math.random() * communities.length)]
      }${buildings}号楼${units}单元${rooms}`;
    },

    // 生成缴费期限
    generateDueDate() {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 15);
      return date.toISOString().split("T")[0];
    },

    // 计算电费
    calculateElectricBill(usage) {
      let amount = 0;
      if (usage <= 180) {
        // 第一阶梯：0.56元/度
        amount = usage * 0.56;
      } else if (usage <= 350) {
        // 第二阶梯：0.61元/度
        amount = 180 * 0.56 + (usage - 180) * 0.61;
      } else {
        // 第三阶梯：0.86元/度
        amount = 180 * 0.56 + 170 * 0.61 + (usage - 350) * 0.86;
      }
      return amount.toFixed(2);
    },

    // 隐藏账单弹窗
    hideBillModal() {
      this.showBillModal = false;
    },

    // 进入支付流程
    proceedToPayment() {
      this.hideBillModal();

      // 跳转到支付页面
      uni.navigateTo({
        url: `/pages/recharge-payment/recharge-payment?amount=${
          this.billInfo.amount
        }&phone=${this.userNumber}&rechargeAmount=${
          this.billInfo.amount
        }&type=electric&billInfo=${encodeURIComponent(
          JSON.stringify(this.billInfo)
        )}`,
      });
    },
  },
};
</script>

<style scoped>
.electric-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部电力插画区域 */
.header-section {
  position: relative;
  height: 400rpx;
  background: linear-gradient(180deg, #fef3c7 0%, #f59e0b 100%);
  overflow: hidden;
}

.electric-illustration {
  position: relative;
  width: 100%;
  height: 300rpx;
  padding: 40rpx 30rpx 20rpx;
}

.electric-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 城市轮廓背景 */
.city-skyline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 20%,
    rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.1) 60%,
    rgba(0, 0, 0, 0.2) 80%,
    transparent 100%
  );
  opacity: 0.3;
}

/* 电线塔 */
.power-tower {
  position: absolute;
  right: 80rpx;
  top: 20rpx;
  width: 120rpx;
  height: 200rpx;
}

.tower-base {
  position: absolute;
  bottom: 0;
  left: 40rpx;
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  border-radius: 4rpx;
}

.tower-body {
  position: absolute;
  bottom: 35rpx;
  left: 55rpx;
  width: 10rpx;
  height: 120rpx;
  background: linear-gradient(180deg, #6b7280 0%, #374151 100%);
  border-radius: 5rpx;
}

.tower-top {
  position: absolute;
  top: 0;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.power-lines {
  position: absolute;
  top: 50rpx;
  left: -50rpx;
  width: 200rpx;
  height: 80rpx;
}

.line {
  position: absolute;
  height: 3rpx;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  border-radius: 2rpx;
  animation: powerFlow 2s ease-in-out infinite;
}

.line-1 {
  top: 10rpx;
  left: 0;
  width: 180rpx;
}

.line-2 {
  top: 35rpx;
  left: 10rpx;
  width: 170rpx;
}

.line-3 {
  top: 60rpx;
  left: 20rpx;
  width: 160rpx;
}

@keyframes powerFlow {
  0%,
  100% {
    box-shadow: 0 0 5rpx rgba(251, 191, 36, 0.5);
  }
  50% {
    box-shadow: 0 0 15rpx rgba(251, 191, 36, 0.8);
  }
}

/* 电力设备 */
.electric-equipment {
  position: absolute;
  left: 50rpx;
  top: 100rpx;
  width: 150rpx;
  height: 120rpx;
}

.transformer {
  position: relative;
  width: 80rpx;
  height: 60rpx;
  margin-bottom: 20rpx;
}

.transformer-body {
  width: 80rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 8rpx;
}

.transformer-top {
  position: absolute;
  top: -10rpx;
  left: 20rpx;
  width: 40rpx;
  height: 20rpx;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  border-radius: 10rpx;
}

.electric-spark {
  position: absolute;
  top: -20rpx;
  left: 35rpx;
  width: 10rpx;
  height: 10rpx;
  background: #fbbf24;
  border-radius: 50%;
  animation: sparkle 0.5s ease-in-out;
  box-shadow: 0 0 10rpx #fbbf24;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.control-panel {
  position: relative;
  width: 100rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 6rpx;
  margin-left: 50rpx;
}

.indicator {
  position: absolute;
  top: 10rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #6b7280;
  transition: all 0.3s ease;
}

.indicator-1 {
  left: 15rpx;
}

.indicator-2 {
  left: 35rpx;
}

.indicator-3 {
  left: 55rpx;
}

.indicator.active {
  background: #10b981;
  box-shadow: 0 0 8rpx #10b981;
}

/* 电表 */
.electric-meter {
  position: absolute;
  left: 20rpx;
  top: 40rpx;
  width: 100rpx;
  height: 80rpx;
}

.meter-body {
  width: 100rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
  border-radius: 8rpx;
  border: 2rpx solid #6b7280;
  position: relative;
}

.meter-display {
  position: absolute;
  top: 15rpx;
  left: 10rpx;
  right: 10rpx;
  height: 30rpx;
  background: #000;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meter-number {
  color: #10b981;
  font-size: 20rpx;
  font-weight: bold;
  font-family: "Courier New", monospace;
}

.meter-dial {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 30rpx;
  height: 30rpx;
  border: 3rpx solid #6b7280;
  border-radius: 50%;
  border-top-color: #dc2626;
  animation: meterSpin 3s linear infinite;
}

@keyframes meterSpin {
  0% {
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg);
  }
}

/* 闪电效果 */
.lightning-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.lightning {
  position: absolute;
  width: 4rpx;
  background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
  opacity: 0;
  animation: lightning 0.3s ease-in-out;
}

.lightning-1 {
  top: 30rpx;
  left: 150rpx;
  height: 100rpx;
  transform: rotate(15deg);
}

.lightning-2 {
  top: 60rpx;
  right: 120rpx;
  height: 80rpx;
  transform: rotate(-20deg);
}

@keyframes lightning {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 10rpx #fbbf24;
  }
}

/* 标题区域 */
.title-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10rpx);
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.location-text {
  font-size: 28rpx;
  color: #666;
}

/* 缴费信息区域 */
.payment-info-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  min-width: 140rpx;
}

.info-value {
  font-size: 28rpx;
  color: #666;
  flex: 1;
  text-align: right;
}

.input-container {
  flex: 1;
  margin-left: 20rpx;
}

.user-number-input {
  width: 100%;
  height: 60rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: right;
  background: #f8f9fa;
}

.user-number-input:focus {
  border-color: #f59e0b;
  background: #fff;
}

/* 分组选择区域 */
.group-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.group-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 24rpx;
}

.group-options {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.group-option {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #e9ecef;
  border-radius: 40rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.group-option.active {
  border-color: #f59e0b;
  background: #fef3c7;
}

.group-option:active {
  transform: scale(0.95);
}

.group-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.group-option.active .group-text {
  color: #f59e0b;
}

.group-manage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
}

.manage-text {
  font-size: 28rpx;
  color: #f59e0b;
  font-weight: 500;
}

.manage-arrow {
  font-size: 24rpx;
  color: #999;
}

/* 下一步按钮 */
.next-button-container {
  padding: 40rpx 30rpx;
}

.next-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.next-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.4);
}

.next-button.disabled {
  background: #ccc;
  box-shadow: none;
  color: #999;
}

/* 账单弹窗 */
.bill-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  font-weight: 300;
}

.modal-body {
  padding: 30rpx;
}

.bill-info {
  margin-bottom: 30rpx;
}

.bill-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.bill-row:last-child {
  border-bottom: none;
}

.bill-row.highlight {
  background: #fef3c7;
  padding: 20rpx;
  border-radius: 8rpx;
  margin: 16rpx 0;
  border: none;
}

.bill-label {
  font-size: 26rpx;
  color: #666;
}

.bill-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.bill-amount {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: 600;
}

.pay-button {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.3);
}

/* 动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .header-section {
    height: 320rpx;
  }

  .electric-illustration {
    height: 240rpx;
    padding: 30rpx 20rpx 15rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

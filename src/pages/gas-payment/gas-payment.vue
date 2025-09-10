<template>
  <view class="gas-payment-page">
    <!-- 顶部燃气主题插画背景 -->
    <view class="header-section">
      <view class="gas-illustration">
        <!-- SVG燃气插画 -->
        <view class="gas-scene">
          <!-- 背景建筑 -->
          <view class="building-bg"></view>

          <!-- 燃气管道系统 -->
          <view class="pipeline-system">
            <view class="main-pipe"></view>
            <view class="branch-pipe branch-1"></view>
            <view class="branch-pipe branch-2"></view>
            <view class="branch-pipe branch-3"></view>
            <view class="gas-flow" v-if="showGasFlow">
              <view class="flow-particle particle-1"></view>
              <view class="flow-particle particle-2"></view>
              <view class="flow-particle particle-3"></view>
            </view>
          </view>

          <!-- 燃气表 -->
          <view class="gas-meter">
            <view class="meter-body">
              <view class="meter-face">
                <text class="meter-reading">{{ gasReading }}</text>
                <view class="meter-dial"></view>
              </view>
              <view class="meter-pipes">
                <view class="inlet-pipe"></view>
                <view class="outlet-pipe"></view>
              </view>
            </view>
          </view>

          <!-- 燃气灶 -->
          <view class="gas-stove">
            <view class="stove-body">
              <view class="burner burner-1" :class="{ active: showFlame1 }">
                <view class="flame flame-1" v-if="showFlame1"></view>
              </view>
              <view class="burner burner-2" :class="{ active: showFlame2 }">
                <view class="flame flame-2" v-if="showFlame2"></view>
              </view>
            </view>
            <view class="stove-base"></view>
          </view>

          <!-- 安全阀门 -->
          <view class="safety-valve">
            <view class="valve-body"></view>
            <view class="valve-handle" :class="{ active: valveOpen }"></view>
            <view
              class="safety-indicator"
              :class="{ safe: safetyStatus }"
            ></view>
          </view>

          <!-- 燃气云效果 -->
          <view class="gas-clouds" v-if="showGasClouds">
            <view class="gas-cloud cloud-1"></view>
            <view class="gas-cloud cloud-2"></view>
            <view class="gas-cloud cloud-3"></view>
          </view>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <text class="page-title">燃气费</text>
        <text class="location-text">{{ selectedCity }}</text>
      </view>
    </view>

    <!-- 缴费项目信息 -->
    <view class="payment-info-section">
      <view class="info-row">
        <text class="info-label">缴费项目</text>
        <text class="info-value">燃气费</text>
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
          <text class="modal-title">燃气费账单</text>
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
              <text class="bill-label">用气地址：</text>
              <text class="bill-value">{{ billInfo.address }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">上期读数：</text>
              <text class="bill-value">{{ billInfo.lastReading }}m³</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期读数：</text>
              <text class="bill-value">{{ billInfo.currentReading }}m³</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期用量：</text>
              <text class="bill-value">{{ billInfo.usage }}m³</text>
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
  name: "GasPaymentPage",
  data() {
    return {
      selectedCity: "保定市",
      selectedCompany: {
        name: "华润燃气保定有限公司",
        code: "baoding_gas",
      },
      userNumber: "",
      selectedGroup: "self",
      showGasFlow: false,
      showFlame1: false,
      showFlame2: false,
      valveOpen: true,
      safetyStatus: true,
      showGasClouds: false,
      gasReading: "1234.5",
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
    // 接收从燃气费页面传递的参数
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

    console.log("燃气费缴费页面加载，参数：", {
      city: this.selectedCity,
      company: this.selectedCompany,
    });

    // 启动燃气动画
    this.startGasAnimation();
    this.loadUserData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("燃气费缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("燃气费缴费页面显示");
    } catch (error) {
      console.error("燃气费缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  onUnload() {
    // 清理定时器
    if (this.gasTimer) {
      clearInterval(this.gasTimer);
    }
    if (this.flameTimer) {
      clearInterval(this.flameTimer);
    }
    if (this.safetyTimer) {
      clearInterval(this.safetyTimer);
    }
  },

  methods: {
    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          console.log("燃气费缴费页面加载用户数据:", {
            username: currentUser.username,
            balance: currentUser.balance,
          });
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    },

    // 启动燃气动画
    startGasAnimation() {
      // 燃气流动动画
      this.gasTimer = setInterval(() => {
        this.showGasFlow = !this.showGasFlow;
        this.showGasClouds = Math.random() > 0.7;
      }, 2500);

      // 火焰动画
      this.flameTimer = setInterval(() => {
        this.showFlame1 = Math.random() > 0.6;
        this.showFlame2 = Math.random() > 0.6;
      }, 1500);

      // 安全状态动画
      this.safetyTimer = setInterval(() => {
        this.valveOpen = Math.random() > 0.3;
        this.safetyStatus = Math.random() > 0.1;
      }, 4000);

      // 燃气表读数动画
      setInterval(() => {
        const baseReading = 1234.5;
        const random = Math.random() * 0.1;
        this.gasReading = (baseReading + random).toFixed(1);
      }, 6000);
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
        mockBill.lastReading + Math.floor(Math.random() * 50) + 10;
      mockBill.usage = mockBill.currentReading - mockBill.lastReading;
      mockBill.amount = this.calculateGasBill(mockBill.usage);

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

    // 计算燃气费
    calculateGasBill(usage) {
      let amount = 0;
      if (usage <= 20) {
        // 第一阶梯：2.8元/m³
        amount = usage * 2.8;
      } else if (usage <= 40) {
        // 第二阶梯：3.2元/m³
        amount = 20 * 2.8 + (usage - 20) * 3.2;
      } else {
        // 第三阶梯：4.0元/m³
        amount = 20 * 2.8 + 20 * 3.2 + (usage - 40) * 4.0;
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
        }&type=gas&billInfo=${encodeURIComponent(
          JSON.stringify(this.billInfo)
        )}`,
      });
    },
  },
};
</script>

<style scoped>
.gas-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部燃气插画区域 */
.header-section {
  position: relative;
  height: 400rpx;
  background: linear-gradient(180deg, #fee2e2 0%, #dc2626 100%);
  overflow: hidden;
}

.gas-illustration {
  position: relative;
  width: 100%;
  height: 300rpx;
  padding: 40rpx 30rpx 20rpx;
}

.gas-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 建筑背景 */
.building-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 25%,
    rgba(0, 0, 0, 0.15) 50%,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 100%
  );
  opacity: 0.4;
}

/* 燃气管道系统 */
.pipeline-system {
  position: absolute;
  top: 30rpx;
  left: 20rpx;
  width: 300rpx;
  height: 150rpx;
}

.main-pipe {
  position: absolute;
  bottom: 20rpx;
  left: 0;
  width: 200rpx;
  height: 12rpx;
  background: linear-gradient(90deg, #6b7280 0%, #374151 100%);
  border-radius: 6rpx;
}

.branch-pipe {
  position: absolute;
  width: 8rpx;
  background: linear-gradient(180deg, #6b7280 0%, #374151 100%);
  border-radius: 4rpx;
}

.branch-1 {
  left: 60rpx;
  top: 0;
  height: 52rpx;
}

.branch-2 {
  left: 120rpx;
  top: 20rpx;
  height: 32rpx;
}

.branch-3 {
  left: 180rpx;
  top: 10rpx;
  height: 42rpx;
}

.gas-flow {
  position: absolute;
  width: 100%;
  height: 100%;
}

.flow-particle {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: #ef4444;
  border-radius: 50%;
  animation: gasFlow 3s ease-in-out infinite;
  opacity: 0.8;
}

.particle-1 {
  bottom: 24rpx;
  left: 10rpx;
  animation-delay: 0s;
}

.particle-2 {
  bottom: 24rpx;
  left: 100rpx;
  animation-delay: 1s;
}

.particle-3 {
  bottom: 24rpx;
  left: 190rpx;
  animation-delay: 2s;
}

@keyframes gasFlow {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 燃气表 */
.gas-meter {
  position: absolute;
  left: 350rpx;
  top: 50rpx;
  width: 120rpx;
  height: 100rpx;
}

.meter-body {
  width: 100rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
  border-radius: 10rpx;
  border: 3rpx solid #6b7280;
  position: relative;
}

.meter-face {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  right: 10rpx;
  height: 40rpx;
  background: #1f2937;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.meter-reading {
  color: #ef4444;
  font-size: 16rpx;
  font-weight: bold;
  font-family: "Courier New", monospace;
  margin-bottom: 4rpx;
}

.meter-dial {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid #6b7280;
  border-radius: 50%;
  border-top-color: #ef4444;
  animation: meterSpin 4s linear infinite;
}

@keyframes meterSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.meter-pipes {
  position: absolute;
  bottom: -15rpx;
  left: 50%;
  transform: translateX(-50%);
}

.inlet-pipe,
.outlet-pipe {
  width: 6rpx;
  height: 15rpx;
  background: #6b7280;
  border-radius: 3rpx;
  display: inline-block;
  margin: 0 5rpx;
}

/* 燃气灶 */
.gas-stove {
  position: absolute;
  right: 80rpx;
  bottom: 50rpx;
  width: 140rpx;
  height: 100rpx;
}

.stove-body {
  width: 120rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 12rpx;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10rpx;
}

.burner {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #4b5563;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #6b7280;
}

.burner.active {
  border-color: #ef4444;
  box-shadow: 0 0 10rpx rgba(239, 68, 68, 0.5);
}

.flame {
  width: 20rpx;
  height: 30rpx;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flicker 0.5s ease-in-out infinite alternate;
}

.flame-1 {
  background: linear-gradient(180deg, #fbbf24 0%, #ef4444 100%);
}

.flame-2 {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
}

@keyframes flicker {
  0% {
    transform: scale(1) rotate(-2deg);
  }
  100% {
    transform: scale(1.1) rotate(2deg);
  }
}

.stove-base {
  width: 140rpx;
  height: 20rpx;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  border-radius: 10rpx;
  margin-top: 10rpx;
}

/* 安全阀门 */
.safety-valve {
  position: absolute;
  left: 50rpx;
  bottom: 30rpx;
  width: 60rpx;
  height: 60rpx;
}

.valve-body {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  position: relative;
  border: 3rpx solid #d97706;
}

.valve-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 4rpx;
  background: #991b1b;
  border-radius: 2rpx;
  transition: all 0.3s ease;
}

.valve-handle.active {
  transform: translate(-50%, -50%) rotate(90deg);
  background: #16a34a;
}

.safety-indicator {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #ef4444;
  animation: dangerPulse 1s ease-in-out infinite;
}

.safety-indicator.safe {
  background: #16a34a;
  animation: safePulse 2s ease-in-out infinite;
}

@keyframes dangerPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

@keyframes safePulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 燃气云效果 */
.gas-clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.gas-cloud {
  position: absolute;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  animation: gasCloud 2s ease-in-out;
}

.cloud-1 {
  top: 40rpx;
  left: 100rpx;
  width: 30rpx;
  height: 30rpx;
}

.cloud-2 {
  top: 60rpx;
  right: 150rpx;
  width: 25rpx;
  height: 25rpx;
  animation-delay: 0.5s;
}

.cloud-3 {
  bottom: 80rpx;
  left: 200rpx;
  width: 35rpx;
  height: 35rpx;
  animation-delay: 1s;
}

@keyframes gasCloud {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.6;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
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
  border-color: #dc2626;
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
  border-color: #dc2626;
  background: #fee2e2;
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
  color: #dc2626;
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
  color: #dc2626;
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
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;
}

.next-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(220, 38, 38, 0.4);
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
  background: #fee2e2;
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
  color: #dc2626;
  font-weight: 600;
}

.pay-button {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(220, 38, 38, 0.3);
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

  .gas-illustration {
    height: 240rpx;
    padding: 30rpx 20rpx 15rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

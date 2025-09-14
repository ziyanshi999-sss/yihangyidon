<template>
  <view class="broadband-payment-page">
    <!-- 顶部网络主题插画背景 -->
    <view class="header-section">
      <view class="network-illustration">
        <!-- SVG网络插画 -->
        <view class="network-scene">
          <!-- 网络节点 -->
          <view class="network-nodes">
            <view
              class="node central-node"
              :class="{ active: centralNodeActive }"
            >
              <view class="node-core"></view>
              <view class="node-ring ring-1"></view>
              <view class="node-ring ring-2"></view>
            </view>
            <view
              class="node edge-node node-1"
              :class="{ active: edgeNode1Active }"
            ></view>
            <view
              class="node edge-node node-2"
              :class="{ active: edgeNode2Active }"
            ></view>
            <view
              class="node edge-node node-3"
              :class="{ active: edgeNode3Active }"
            ></view>
            <view
              class="node edge-node node-4"
              :class="{ active: edgeNode4Active }"
            ></view>
          </view>

          <!-- 数据流动线路 -->
          <view class="data-connections" v-if="showDataFlow">
            <view class="connection connection-1">
              <view class="data-packet packet-1"></view>
            </view>
            <view class="connection connection-2">
              <view class="data-packet packet-2"></view>
            </view>
            <view class="connection connection-3">
              <view class="data-packet packet-3"></view>
            </view>
            <view class="connection connection-4">
              <view class="data-packet packet-4"></view>
            </view>
          </view>

          <!-- 路由器 -->
          <view class="router-device">
            <view class="router-body">
              <view
                class="router-antenna antenna-1"
                :class="{ transmitting: antenna1Signal }"
              ></view>
              <view
                class="router-antenna antenna-2"
                :class="{ transmitting: antenna2Signal }"
              ></view>
              <view
                class="router-antenna antenna-3"
                :class="{ transmitting: antenna3Signal }"
              ></view>
              <view
                class="status-led led-power"
                :class="{ on: powerLed }"
              ></view>
              <view
                class="status-led led-internet"
                :class="{ on: internetLed }"
              ></view>
              <view class="status-led led-wifi" :class="{ on: wifiLed }"></view>
            </view>
            <view class="router-base"></view>
          </view>

          <!-- 信号波纹 -->
          <view class="signal-waves" v-if="showSignalWaves">
            <view class="wave wave-1"></view>
            <view class="wave wave-2"></view>
            <view class="wave wave-3"></view>
          </view>

          <!-- 网络图标云 -->
          <view class="network-icons">
            <view class="icon-wifi" :class="{ active: wifiActive }">📶</view>
            <view class="icon-cloud" :class="{ active: cloudActive }">☁️</view>
            <view class="icon-globe" :class="{ active: globeActive }">🌍</view>
          </view>

          <!-- 数据统计显示 -->
          <view class="speed-display">
            <view class="speed-gauge">
              <text class="speed-text">{{ currentSpeed }} Mbps</text>
              <view class="gauge-bar">
                <view
                  class="gauge-fill"
                  :style="{ width: speedPercent + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <text class="page-title">宽带费</text>
        <text class="location-text">{{ selectedCity }}</text>
      </view>
    </view>

    <!-- 缴费项目信息 -->
    <view class="payment-info-section">
      <view class="info-row">
        <text class="info-label">缴费项目</text>
        <text class="info-value">宽带费</text>
      </view>

      <view class="info-row">
        <text class="info-label">运营商</text>
        <text class="info-value">{{ selectedProvider.name }}</text>
      </view>

      <view class="info-row">
        <text class="info-label">宽带账号</text>
        <view class="input-container">
          <input
            class="user-number-input"
            v-model="userNumber"
            placeholder="请输入宽带账号"
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
          <text class="modal-title">宽带费账单</text>
          <text class="modal-close" @tap="hideBillModal">×</text>
        </view>
        <view class="modal-body">
          <view class="bill-info">
            <view class="bill-row">
              <text class="bill-label">宽带账号：</text>
              <text class="bill-value">{{ billInfo.userNumber }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">用户姓名：</text>
              <text class="bill-value">{{ billInfo.userName }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">安装地址：</text>
              <text class="bill-value">{{ billInfo.address }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">套餐类型：</text>
              <text class="bill-value">{{ billInfo.packageType }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">服务周期：</text>
              <text class="bill-value">{{ billInfo.servicePeriod }}</text>
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
  name: "BroadbandPaymentPage",
  data() {
    return {
      selectedCity: "保定市",
      selectedProvider: {
        name: "中国移动宽带",
        code: "baoding_mobile",
      },
      userNumber: "",
      selectedGroup: "self",
      centralNodeActive: true,
      edgeNode1Active: false,
      edgeNode2Active: false,
      edgeNode3Active: false,
      edgeNode4Active: false,
      showDataFlow: false,
      antenna1Signal: false,
      antenna2Signal: false,
      antenna3Signal: false,
      powerLed: true,
      internetLed: true,
      wifiLed: true,
      showSignalWaves: false,
      wifiActive: false,
      cloudActive: false,
      globeActive: false,
      currentSpeed: "100",
      speedPercent: 75,
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
        packageType: "",
        servicePeriod: "",
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
    // 接收从宽带费页面传递的参数
    if (options.city) {
      this.selectedCity = options.city;
    }
    if (options.provider) {
      try {
        this.selectedProvider = JSON.parse(
          decodeURIComponent(options.provider)
        );
      } catch (e) {
        console.error("解析运营商信息失败:", e);
      }
    }

    console.log("宽带费缴费页面加载，参数：", {
      city: this.selectedCity,
      provider: this.selectedProvider,
    });

    // 启动网络动画
    this.startNetworkAnimation();
    this.loadUserData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("宽带费缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("宽带费缴费页面显示");
    } catch (error) {
      console.error("宽带费缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  onUnload() {
    // 清理定时器
    if (this.networkTimer) {
      clearInterval(this.networkTimer);
    }
    if (this.signalTimer) {
      clearInterval(this.signalTimer);
    }
    if (this.speedTimer) {
      clearInterval(this.speedTimer);
    }
  },

  methods: {
    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          console.log("宽带费缴费页面加载用户数据:", {
            username: currentUser.username,
            balance: currentUser.balance,
          });
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    },

    // 启动网络动画
    startNetworkAnimation() {
      // 网络节点动画
      this.networkTimer = setInterval(() => {
        this.edgeNode1Active = Math.random() > 0.6;
        this.edgeNode2Active = Math.random() > 0.6;
        this.edgeNode3Active = Math.random() > 0.6;
        this.edgeNode4Active = Math.random() > 0.6;
        this.showDataFlow = !this.showDataFlow;
      }, 2000);

      // 信号动画
      this.signalTimer = setInterval(() => {
        this.antenna1Signal = Math.random() > 0.5;
        this.antenna2Signal = Math.random() > 0.5;
        this.antenna3Signal = Math.random() > 0.5;
        this.showSignalWaves = !this.showSignalWaves;
        this.wifiActive = Math.random() > 0.4;
        this.cloudActive = Math.random() > 0.6;
        this.globeActive = Math.random() > 0.3;
      }, 1500);

      // 网速动画
      this.speedTimer = setInterval(() => {
        const speeds = [50, 75, 100, 150, 200, 300];
        this.currentSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        this.speedPercent = Math.min(
          (parseInt(this.currentSpeed) / 300) * 100,
          100
        );
      }, 3000);
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
          title: "请输入正确的宽带账号",
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
      const packageTypes = ["100M光纤", "200M光纤", "500M光纤", "1000M光纤"];
      const mockBill = {
        userNumber: this.userNumber,
        userName: this.generateUserName(),
        address: this.generateAddress(),
        packageType:
          packageTypes[Math.floor(Math.random() * packageTypes.length)],
        servicePeriod: this.generateServicePeriod(),
        amount: this.generateAmount(),
        dueDate: this.generateDueDate(),
      };

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

    // 生成服务周期
    generateServicePeriod() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;

      return `${year}年${month
        .toString()
        .padStart(2, "0")}月 - ${nextYear}年${nextMonth
        .toString()
        .padStart(2, "0")}月`;
    },

    // 生成费用
    generateAmount() {
      const amounts = [89, 99, 129, 159, 199, 299];
      return amounts[Math.floor(Math.random() * amounts.length)].toFixed(2);
    },

    // 生成缴费期限
    generateDueDate() {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 15);
      return date.toISOString().split("T")[0];
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
        }&type=broadband&billInfo=${encodeURIComponent(
          JSON.stringify(this.billInfo)
        )}`,
      });
    },
  },
};
</script>

<style scoped>
.broadband-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部网络插画区域 */
.header-section {
  position: relative;
  height: 400rpx;
  background: linear-gradient(180deg, #dbeafe 0%, #3b82f6 100%);
  overflow: hidden;
}

.network-illustration {
  position: relative;
  width: 100%;
  height: 300rpx;
  padding: 40rpx 30rpx 20rpx;
}

.network-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 网络节点 */
.network-nodes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.node {
  position: absolute;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.central-node {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60rpx;
  height: 60rpx;
  background: #3b82f6;
}

.central-node.active {
  box-shadow: 0 0 20rpx #3b82f6;
}

.node-core {
  width: 100%;
  height: 100%;
  background: #1d4ed8;
  border-radius: 50%;
}

.node-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2rpx solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: nodeRing 3s ease-in-out infinite;
}

.ring-1 {
  width: 80rpx;
  height: 80rpx;
  transform: translate(-50%, -50%);
}

.ring-2 {
  width: 100rpx;
  height: 100rpx;
  transform: translate(-50%, -50%);
  animation-delay: 1s;
}

@keyframes nodeRing {
  0%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.edge-node {
  width: 30rpx;
  height: 30rpx;
  background: #60a5fa;
  transition: all 0.3s ease;
}

.edge-node.active {
  background: #1d4ed8;
  box-shadow: 0 0 10rpx #3b82f6;
}

.node-1 {
  top: 20%;
  left: 30%;
}

.node-2 {
  top: 20%;
  right: 30%;
}

.node-3 {
  bottom: 30%;
  left: 25%;
}

.node-4 {
  bottom: 30%;
  right: 25%;
}

/* 数据连接线 */
.data-connections {
  position: absolute;
  width: 100%;
  height: 100%;
}

.connection {
  position: absolute;
  height: 2rpx;
  background: rgba(59, 130, 246, 0.4);
  transform-origin: left center;
}

.connection-1 {
  top: 50%;
  left: 50%;
  width: 120rpx;
  transform: translate(-50%, -50%) rotate(-30deg);
}

.connection-2 {
  top: 50%;
  left: 50%;
  width: 120rpx;
  transform: translate(-50%, -50%) rotate(30deg);
}

.connection-3 {
  top: 50%;
  left: 50%;
  width: 140rpx;
  transform: translate(-50%, -50%) rotate(-150deg);
}

.connection-4 {
  top: 50%;
  left: 50%;
  width: 140rpx;
  transform: translate(-50%, -50%) rotate(150deg);
}

.data-packet {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: #1d4ed8;
  border-radius: 50%;
  animation: dataFlow 2s linear infinite;
}

@keyframes dataFlow {
  0% {
    left: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

/* 路由器设备 */
.router-device {
  position: absolute;
  right: 50rpx;
  top: 60rpx;
  width: 120rpx;
  height: 80rpx;
}

.router-body {
  width: 100rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 8rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10rpx;
}

.router-antenna {
  width: 4rpx;
  height: 25rpx;
  background: #6b7280;
  border-radius: 2rpx;
  position: relative;
  top: -20rpx;
}

.router-antenna.transmitting {
  background: #3b82f6;
  box-shadow: 0 0 8rpx #3b82f6;
}

.status-led {
  position: absolute;
  bottom: 8rpx;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #6b7280;
}

.led-power {
  left: 10rpx;
}

.led-internet {
  left: 25rpx;
}

.led-wifi {
  left: 40rpx;
}

.status-led.on {
  background: #16a34a;
  box-shadow: 0 0 6rpx #16a34a;
}

.router-base {
  width: 120rpx;
  height: 15rpx;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  border-radius: 8rpx;
  margin-top: 5rpx;
}

/* 信号波纹 */
.signal-waves {
  position: absolute;
  top: 50%;
  right: 110rpx;
  transform: translateY(-50%);
}

.wave {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid rgba(59, 130, 246, 0.4);
  border-radius: 50%;
  position: absolute;
  animation: signalWave 2s ease-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 0.5s;
}

.wave-3 {
  animation-delay: 1s;
}

@keyframes signalWave {
  0% {
    width: 20rpx;
    height: 20rpx;
    opacity: 1;
  }
  100% {
    width: 80rpx;
    height: 80rpx;
    opacity: 0;
  }
}

/* 网络图标 */
.network-icons {
  position: absolute;
  left: 50rpx;
  top: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.icon-wifi,
.icon-cloud,
.icon-globe {
  font-size: 32rpx;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.icon-wifi.active,
.icon-cloud.active,
.icon-globe.active {
  opacity: 1;
  transform: scale(1.2);
}

/* 速度显示 */
.speed-display {
  position: absolute;
  bottom: 20rpx;
  left: 50rpx;
  width: 150rpx;
}

.speed-gauge {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8rpx;
  padding: 8rpx;
}

.speed-text {
  font-size: 20rpx;
  color: #1f2937;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-bottom: 6rpx;
}

.gauge-bar {
  height: 6rpx;
  background: #e5e7eb;
  border-radius: 3rpx;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 3rpx;
  transition: width 0.5s ease;
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
  border-color: #3b82f6;
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
  border-color: #3b82f6;
  background: #dbeafe;
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
  color: #3b82f6;
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
  color: #3b82f6;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.next-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.4);
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
  background: #dbeafe;
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
  color: #3b82f6;
  font-weight: 600;
}

.pay-button {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.3);
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

  .network-illustration {
    height: 240rpx;
    padding: 30rpx 20rpx 15rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

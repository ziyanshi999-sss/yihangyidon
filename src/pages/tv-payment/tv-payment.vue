<template>
  <view class="tv-payment-page">
    <!-- 顶部电视主题插画背景 -->
    <view class="header-section">
      <view class="tv-illustration">
        <!-- SVG电视插画 -->
        <view class="tv-scene">
          <!-- 客厅背景 -->
          <view class="living-room-bg"></view>

          <!-- 电视机 -->
          <view class="television">
            <view class="tv-screen" :class="{ playing: tvPlaying }">
              <view class="screen-content" v-if="tvPlaying">
                <view class="channel-info">
                  <text class="channel-number">{{ currentChannel }}</text>
                  <text class="channel-name">{{ channelName }}</text>
                </view>
                <view class="program-bars">
                  <view
                    class="bar bar-1"
                    :style="{ height: bar1Height + '%' }"
                  ></view>
                  <view
                    class="bar bar-2"
                    :style="{ height: bar2Height + '%' }"
                  ></view>
                  <view
                    class="bar bar-3"
                    :style="{ height: bar3Height + '%' }"
                  ></view>
                  <view
                    class="bar bar-4"
                    :style="{ height: bar4Height + '%' }"
                  ></view>
                </view>
              </view>
              <view class="screen-reflection"></view>
            </view>
            <view class="tv-frame"></view>
            <view class="tv-stand"></view>
            <view class="power-indicator" :class="{ on: tvPlaying }"></view>
          </view>

          <!-- 机顶盒 -->
          <view class="set-top-box">
            <view class="box-body">
              <view class="box-display">
                <text class="time-display">{{ currentTime }}</text>
              </view>
              <view
                class="signal-indicator"
                :class="{ strong: signalStrong }"
              ></view>
            </view>
            <view class="box-ports">
              <view class="port port-1"></view>
              <view class="port port-2"></view>
              <view class="port port-3"></view>
            </view>
          </view>

          <!-- 遥控器 -->
          <view class="remote-control">
            <view class="remote-body">
              <view class="remote-screen">
                <text class="remote-text">{{ currentChannel }}</text>
              </view>
              <view class="remote-buttons">
                <view
                  class="button power-btn"
                  :class="{ pressed: powerPressed }"
                ></view>
                <view class="button nav-btn up-btn"></view>
                <view class="button nav-btn down-btn"></view>
                <view class="button nav-btn left-btn"></view>
                <view class="button nav-btn right-btn"></view>
                <view class="button center-btn"></view>
              </view>
            </view>
          </view>

          <!-- 信号波纹 */
          <view class="signal-waves" v-if="showSignal">
            <view class="signal-wave wave-1"></view>
            <view class="signal-wave wave-2"></view>
            <view class="signal-wave wave-3"></view>
          </view>

          <!-- 电视节目图标 -->
          <view class="program-icons">
            <view class="icon news-icon" :class="{ active: newsActive }"
              >📺</view
            >
            <view class="icon movie-icon" :class="{ active: movieActive }"
              >🎬</view
            >
            <view class="icon sports-icon" :class="{ active: sportsActive }"
              >⚽</view
            >
          </view>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <text class="page-title">有线电视费</text>
        <text class="location-text">{{ selectedCity }}</text>
      </view>
    </view>

    <!-- 缴费项目信息 -->
    <view class="payment-info-section">
      <view class="info-row">
        <text class="info-label">缴费项目</text>
        <text class="info-value">有线电视费</text>
      </view>

      <view class="info-row">
        <text class="info-label">运营商</text>
        <text class="info-value">{{ selectedProvider.name }}</text>
      </view>

      <view class="info-row">
        <text class="info-label">机顶盒号</text>
        <view class="input-container">
          <input
            class="user-number-input"
            v-model="userNumber"
            placeholder="请输入机顶盒号码"
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
          <text class="modal-title">有线电视费账单</text>
          <text class="modal-close" @tap="hideBillModal">×</text>
        </view>
        <view class="modal-body">
          <view class="bill-info">
            <view class="bill-row">
              <text class="bill-label">机顶盒号：</text>
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
  name: "TvPaymentPage",
  data() {
    return {
      selectedCity: "保定市",
      selectedProvider: {
        name: "保定广电网络",
        code: "baoding_catv",
      },
      userNumber: "",
      selectedGroup: "self",
      tvPlaying: true,
      currentChannel: "001",
      channelName: "新闻频道",
      currentTime: "20:30",
      signalStrong: true,
      showSignal: false,
      powerPressed: false,
      newsActive: true,
      movieActive: false,
      sportsActive: false,
      bar1Height: 60,
      bar2Height: 80,
      bar3Height: 40,
      bar4Height: 70,
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
    // 接收从有线电视费页面传递的参数
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

    console.log("有线电视费缴费页面加载，参数：", {
      city: this.selectedCity,
      provider: this.selectedProvider,
    });

    // 启动电视动画
    this.startTvAnimation();
    this.loadUserData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("有线电视费缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("有线电视费缴费页面显示");
    } catch (error) {
      console.error("有线电视费缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  onUnload() {
    // 清理定时器
    if (this.tvTimer) {
      clearInterval(this.tvTimer);
    }
    if (this.signalTimer) {
      clearInterval(this.signalTimer);
    }
    if (this.programTimer) {
      clearInterval(this.programTimer);
    }
  },

  methods: {
    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync("users") || [];
        const currentUser = users.find((user) => user.isLoggedIn);

        if (currentUser) {
          console.log("有线电视费缴费页面加载用户数据:", {
            username: currentUser.username,
            balance: currentUser.balance,
          });
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    },

    // 启动电视动画
    startTvAnimation() {
      // 频道切换动画
      this.tvTimer = setInterval(() => {
        const channels = [
          { number: "001", name: "新闻频道" },
          { number: "002", name: "电影频道" },
          { number: "003", name: "体育频道" },
          { number: "004", name: "综艺频道" },
          { number: "005", name: "音乐频道" },
        ];
        const randomChannel =
          channels[Math.floor(Math.random() * channels.length)];
        this.currentChannel = randomChannel.number;
        this.channelName = randomChannel.name;

        // 更新节目图标状态
        this.newsActive = randomChannel.number === "001";
        this.movieActive = randomChannel.number === "002";
        this.sportsActive = randomChannel.number === "003";
      }, 4000);

      // 信号和时间动画
      this.signalTimer = setInterval(() => {
        this.signalStrong = Math.random() > 0.2;
        this.showSignal = !this.showSignal;
        this.powerPressed = Math.random() > 0.8;

        // 更新时间显示
        const now = new Date();
        this.currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      }, 2000);

      // 节目条形图动画
      this.programTimer = setInterval(() => {
        this.bar1Height = Math.floor(Math.random() * 80) + 20;
        this.bar2Height = Math.floor(Math.random() * 80) + 20;
        this.bar3Height = Math.floor(Math.random() * 80) + 20;
        this.bar4Height = Math.floor(Math.random() * 80) + 20;
      }, 1500);
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
          title: "请输入正确的机顶盒号码",
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
      const packageTypes = ["基础套餐", "标准套餐", "高清套餐", "4K超清套餐"];
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
      const amounts = [25, 35, 45, 65, 85, 120];
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
        }&type=tv&billInfo=${encodeURIComponent(
          JSON.stringify(this.billInfo)
        )}`,
      });
    },
  },
};
</script>

<style scoped>
.tv-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部电视插画区域 */
.header-section {
  position: relative;
  height: 400rpx;
  background: linear-gradient(180deg, #f3e8ff 0%, #8b5cf6 100%);
  overflow: hidden;
}

.tv-illustration {
  position: relative;
  width: 100%;
  height: 300rpx;
  padding: 40rpx 30rpx 20rpx;
}

.tv-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 客厅背景 */
.living-room-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.15) 30%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.15) 70%,
    rgba(0, 0, 0, 0.1) 100%
  );
  opacity: 0.3;
}

/* 电视机 */
.television {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 120rpx;
}

.tv-screen {
  width: 180rpx;
  height: 100rpx;
  background: #000;
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
  border: 4rpx solid #2d3436;
}

.tv-screen.playing {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
}

.screen-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channel-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-number {
  color: #fff;
  font-size: 16rpx;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

.channel-name {
  color: #fff;
  font-size: 12rpx;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

.program-bars {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4rpx;
  height: 30rpx;
}

.bar {
  width: 8rpx;
  background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 2rpx;
  transition: height 0.3s ease;
}

.screen-reflection {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  width: 40rpx;
  height: 20rpx;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 4rpx;
}

.tv-frame {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 200rpx;
  height: 20rpx;
  background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
  border-radius: 0 0 8rpx 8rpx;
}

.tv-stand {
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 15rpx;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  border-radius: 8rpx;
}

.power-indicator {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #636e72;
}

.power-indicator.on {
  background: #00b894;
  box-shadow: 0 0 8rpx #00b894;
}

/* 机顶盒 */
.set-top-box {
  position: absolute;
  left: 50%;
  bottom: 30rpx;
  transform: translateX(-50%);
  width: 150rpx;
  height: 40rpx;
}

.box-body {
  width: 100%;
  height: 25rpx;
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  border-radius: 4rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;
}

.box-display {
  background: #000;
  color: #00b894;
  font-size: 12rpx;
  padding: 2rpx 6rpx;
  border-radius: 2rpx;
}

.signal-indicator {
  width: 12rpx;
  height: 8rpx;
  background: #fd79a8;
  border-radius: 2rpx;
}

.signal-indicator.strong {
  background: #00b894;
  box-shadow: 0 0 4rpx #00b894;
}

.box-ports {
  display: flex;
  justify-content: center;
  gap: 8rpx;
  margin-top: 4rpx;
}

.port {
  width: 12rpx;
  height: 6rpx;
  background: #636e72;
  border-radius: 2rpx;
}

/* 遥控器 */
.remote-control {
  position: absolute;
  right: 30rpx;
  top: 60rpx;
  width: 60rpx;
  height: 140rpx;
}

.remote-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  border-radius: 12rpx;
  padding: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.remote-screen {
  width: 40rpx;
  height: 20rpx;
  background: #000;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.remote-text {
  color: #00b894;
  font-size: 10rpx;
  font-weight: bold;
}

.remote-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 4rpx;
  width: 100%;
  flex: 1;
}

.button {
  background: #636e72;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.button:active,
.button.pressed {
  background: #00b894;
  transform: scale(0.9);
}

.power-btn {
  grid-column: 2;
  grid-row: 1;
  background: #e17055;
}

.power-btn.pressed {
  background: #00b894;
}

.nav-btn {
  background: #74b9ff;
}

.up-btn {
  grid-column: 2;
  grid-row: 2;
}

.down-btn {
  grid-column: 2;
  grid-row: 3;
}

.left-btn {
  grid-column: 1;
  grid-row: 2;
}

.right-btn {
  grid-column: 3;
  grid-row: 2;
}

.center-btn {
  grid-column: 2;
  grid-row: 2;
  background: #fd79a8;
  transform: scale(0.7);
}

/* 信号波纹 */
.signal-waves {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
}

.signal-wave {
  position: absolute;
  border: 2rpx solid rgba(139, 92, 246, 0.4);
  border-radius: 50%;
  animation: signalPulse 2s ease-out infinite;
}

.wave-1 {
  width: 30rpx;
  height: 30rpx;
  animation-delay: 0s;
}

.wave-2 {
  width: 50rpx;
  height: 50rpx;
  animation-delay: 0.5s;
}

.wave-3 {
  width: 70rpx;
  height: 70rpx;
  animation-delay: 1s;
}

@keyframes signalPulse {
  0% {
    opacity: 1;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

/* 节目图标 */
.program-icons {
  position: absolute;
  right: 50rpx;
  bottom: 80rpx;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.icon {
  font-size: 28rpx;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.icon.active {
  opacity: 1;
  transform: scale(1.2);
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
  border-color: #8b5cf6;
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
  border-color: #8b5cf6;
  background: #f3e8ff;
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
  color: #8b5cf6;
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
  color: #8b5cf6;
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.next-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(139, 92, 246, 0.4);
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
  background: #f3e8ff;
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
  color: #8b5cf6;
  font-weight: 600;
}

.pay-button {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(139, 92, 246, 0.3);
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

  .tv-illustration {
    height: 240rpx;
    padding: 30rpx 20rpx 15rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

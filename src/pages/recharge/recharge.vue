<template>
  <view class="recharge-page">
    <!-- 手机号码区域 -->
    <view class="phone-section">
      <view class="phone-display">
        <text class="phone-number">{{ formattedPhoneNumber }}</text>
        <view class="contact-btn" @tap="selectFromContacts">
          <text class="contact-icon">👤</text>
        </view>
      </view>
      <view class="carrier-info" v-if="carrierInfo.name">
        <text class="carrier-text">{{ carrierInfo.name }}</text>
      </view>
    </view>

    <!-- 充值类型选项卡 -->
    <view class="recharge-tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 0 }"
        @tap="switchTab(0)"
      >
        <text class="tab-text">充话费</text>
        <view class="tab-underline" v-if="activeTab === 0"></view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 1 }"
        @tap="switchTab(1)"
      >
        <text class="tab-text">自动充值</text>
        <view class="tab-underline" v-if="activeTab === 1"></view>
      </view>
    </view>

    <!-- 充值金额选择 -->
    <view class="amount-section">
      <view class="amount-grid">
        <view
          class="amount-card"
          v-for="(amount, index) in rechargeAmounts"
          :key="index"
          :class="{ selected: selectedAmount === amount.value }"
          @tap="selectAmount(amount)"
        >
          <text class="amount-value">{{ amount.value }}元</text>
          <text class="amount-price">售价{{ amount.price }}元</text>
          <view class="discount-badge" v-if="amount.discount">
            <text class="discount-text">{{ amount.discount }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 充值按钮 -->
    <view class="recharge-button-container">
      <button
        class="recharge-button"
        :class="{ disabled: !canRecharge }"
        @tap="handleRecharge"
        :disabled="!canRecharge"
      >
        ¥ {{ selectedPrice }} 立即充值
      </button>
    </view>

    <!-- 温馨提示 -->
    <view class="notice-section">
      <text class="notice-title">温馨提示</text>
      <text class="notice-content">
        1.手机充值正常30分钟内到账，月初、月末属于充值高峰期时段，到账时间可能延迟，请您耐心等待。
      </text>
      <text class="notice-content">
        2.本服务由充值服务商提供，若不提供月结发票，如需增值税普通发票请联系服务商客服电话：圣科瑞（北京）科技有限公司
        4001-8888-52，北京掌乐科技有限公司 010-62764933。
      </text>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @tap="goToStream">
        <text class="nav-link">国内流量</text>
      </view>
      <text class="nav-separator">|</text>
      <view class="nav-item" @tap="goToFaq">
        <text class="nav-link">常见问题</text>
      </view>
      <text class="nav-separator">|</text>
      <view class="nav-item" @tap="goToRecord">
        <text class="nav-link">充值记录</text>
      </view>
    </view>

    <!-- 手机号码输入弹窗 -->
    <view class="phone-modal" v-if="showPhoneModal" @tap="hidePhoneModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">输入手机号码</text>
          <text class="modal-close" @tap="hidePhoneModal">×</text>
        </view>
        <view class="modal-body">
          <input
            class="phone-input"
            v-model="inputPhoneNumber"
            placeholder="请输入11位手机号码"
            type="number"
            maxlength="11"
            @input="onPhoneInput"
          />
          <button
            class="confirm-btn"
            :class="{ disabled: !isValidPhone }"
            @tap="confirmPhone"
            :disabled="!isValidPhone"
          >
            确认
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from "@/utils/auth.js";

export default {
  name: "RechargePage",
  data() {
    return {
      activeTab: 0,
      selectedAmount: 50,
      phoneNumber: "",
      inputPhoneNumber: "",
      showPhoneModal: false,
      carrierInfo: {
        name: "",
        location: "",
      },
      rechargeAmounts: [
        { value: 50, price: 47.77, discount: null, selected: true },
        { value: 100, price: 97.78, discount: null, selected: false },
        { value: 200, price: 197.78, discount: null, selected: false },
        { value: 300, price: 297.78, discount: null, selected: false },
        { value: 500, price: 497.78, discount: null, selected: false },
        { value: 30, price: 29.7, discount: null, selected: false },
      ],
    };
  },

  computed: {
    formattedPhoneNumber() {
      if (!this.phoneNumber) return "点击输入手机号";
      return this.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3");
    },

    selectedPrice() {
      const selected = this.rechargeAmounts.find(
        (item) => item.value === this.selectedAmount
      );
      return selected ? selected.price : 0;
    },

    canRecharge() {
      return (
        this.phoneNumber &&
        this.phoneNumber.length === 11 &&
        this.selectedAmount > 0
      );
    },

    isValidPhone() {
      return this.inputPhoneNumber && this.inputPhoneNumber.length === 11;
    },
  },

  onLoad(options) {
    this.initPage();
    this.loadUserData();
    // 如果从其他页面传递了手机号码
    if (options.phone) {
      this.phoneNumber = options.phone;
      this.getCarrierInfo();
    }
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("手机充值页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("手机充值页面显示");
    } catch (error) {
      console.error("手机充值页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  methods: {
    initPage() {
      console.log("手机充值页面初始化");
      // 设置默认选中第一个金额
      if (!this.phoneNumber) {
        this.showPhoneModal = true;
      }
    },

    // 加载用户数据
    loadUserData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser) {
          // 使用用户的手机号作为默认值
          if (currentUser.phone && !this.phoneNumber) {
            this.phoneNumber = currentUser.phone
            this.getCarrierInfo()
          }
          
          console.log('✅ 充值页面用户数据加载成功:', {
            username: currentUser.username,
            phone: currentUser.phone,
            balance: currentUser.balance
          })
        } else {
          console.log('❌ 未找到当前用户数据')
        }
      } catch (error) {
        console.error('❌ 加载用户数据失败:', error)
      }
    },

    switchTab(index) {
      this.activeTab = index;
      console.log("切换到标签:", index === 0 ? "充话费" : "自动充值");
    },

    selectAmount(amount) {
      this.selectedAmount = amount.value;
      console.log("选择充值金额:", amount);
    },

    selectFromContacts() {
      this.showPhoneModal = true;
    },

    hidePhoneModal() {
      this.showPhoneModal = false;
      this.inputPhoneNumber = "";
    },

    onPhoneInput() {
      // 限制只能输入数字，最多11位
      this.inputPhoneNumber = this.inputPhoneNumber
        .replace(/\D/g, "")
        .substring(0, 11);
    },

    confirmPhone() {
      if (this.isValidPhone) {
        this.phoneNumber = this.inputPhoneNumber;
        this.getCarrierInfo();
        this.hidePhoneModal();
      }
    },

    getCarrierInfo() {
      if (this.phoneNumber.length !== 11) return;

      const prefix = this.phoneNumber.substring(0, 3);
      let carrier = "";

      if (
        [
          "130",
          "131",
          "132",
          "155",
          "156",
          "166",
          "167",
          "185",
          "186",
        ].includes(prefix)
      ) {
        carrier = "中国联通";
      } else if (
        [
          "134",
          "135",
          "136",
          "137",
          "138",
          "139",
          "147",
          "150",
          "151",
          "152",
          "157",
          "158",
          "159",
          "178",
          "182",
          "183",
          "184",
          "187",
          "188",
          "198",
        ].includes(prefix)
      ) {
        carrier = "中国移动";
      } else if (
        [
          "133",
          "149",
          "153",
          "173",
          "177",
          "180",
          "181",
          "189",
          "199",
        ].includes(prefix)
      ) {
        carrier = "中国电信";
      } else {
        carrier = "未知运营商";
      }

      this.carrierInfo = {
        name: carrier,
        location: "黑龙江 牡丹江",
      };
    },

    async handleRecharge() {
      if (!this.canRecharge) {
        uni.showToast({
          title: "请检查手机号码和充值金额",
          icon: "none",
        });
        return;
      }

      // 跳转到充值支付页面
      uni.navigateTo({
        url: `/pages/recharge-payment/recharge-payment?amount=${this.selectedPrice}&phone=${this.phoneNumber}&rechargeAmount=${this.selectedAmount}&type=recharge`,
      });
    },

    goToStream() {
      uni.showToast({
        title: "国内流量功能开发中",
        icon: "none",
      });
    },

    goToFaq() {
      uni.showToast({
        title: "常见问题功能开发中",
        icon: "none",
      });
    },

    goToRecord() {
      uni.showToast({
        title: "充值记录功能开发中",
        icon: "none",
      });
    },
  },
};
</script>

<style scoped>
.recharge-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 手机号码区域 */
.phone-section {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
}

.phone-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.phone-number {
  font-size: 48rpx;
  font-weight: 500;
  color: #333;
  font-style: italic;
}

.contact-btn {
  width: 60rpx;
  height: 60rpx;
  background: #20c997;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.contact-btn:active {
  transform: scale(0.95);
  background: #1db584;
}

.contact-icon {
  font-size: 28rpx;
  color: #fff;
}

.carrier-info {
  display: flex;
  align-items: center;
}

.carrier-text {
  font-size: 28rpx;
  color: #666;
}

/* 充值类型选项卡 */
.recharge-tabs {
  display: flex;
  background: #fff;
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  padding: 30rpx 0;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.tab-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #20c997;
  font-weight: 600;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: #20c997;
  border-radius: 3rpx;
  animation: slideIn 0.3s ease;
}

/* 充值金额网格 */
.amount-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.amount-card {
  position: relative;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 32rpx 16rpx;
  text-align: center;
  background: #fff;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 120rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.amount-card:active {
  transform: scale(0.98);
}

.amount-card.selected {
  border-color: #ff6b35;
  background: #fff;
  box-shadow: 0 0 0 2rpx #ff6b35;
}

.amount-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 6rpx;
  font-style: normal;
}

.amount-price {
  display: block;
  font-size: 22rpx;
  color: #ff4757;
  font-weight: 400;
}

.discount-badge {
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  color: #fff;
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 0 12rpx 0 12rpx;
  font-weight: 600;
  box-shadow: 0 2rpx 8rpx rgba(255, 71, 87, 0.3);
}

.discount-text {
  color: #fff;
}

/* 充值按钮 */
.recharge-button-container {
  padding: 0 30rpx 40rpx;
}

.recharge-button {
  width: 100%;
  padding: 36rpx;
  background: linear-gradient(135deg, #ff9500 0%, #ff8400 100%);
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 149, 0, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 1rpx;
}

.recharge-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.4);
}

.recharge-button.disabled {
  background: #ccc;
  box-shadow: none;
  color: #999;
}

/* 温馨提示 */
.notice-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.notice-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.notice-content {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

/* 底部导航 */
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 30rpx;
  gap: 20rpx;
}

.nav-item {
  transition: all 0.3s ease;
}

.nav-item:active {
  opacity: 0.7;
}

.nav-link {
  font-size: 28rpx;
  color: #20c997;
  font-weight: 500;
}

.nav-separator {
  font-size: 24rpx;
  color: #ccc;
}

/* 手机号码输入弹窗 */
.phone-modal {
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
  padding: 40rpx 30rpx;
}

.phone-input {
  width: 100%;
  padding: 28rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
  font-size: 32rpx;
  text-align: center;
  margin-bottom: 30rpx;
  font-weight: 500;
}

.phone-input:focus {
  border-color: #20c997;
  outline: none;
}

.confirm-btn {
  width: 100%;
  padding: 28rpx;
  background: #20c997;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.confirm-btn:active {
  background: #1db584;
}

.confirm-btn.disabled {
  background: #ccc;
  color: #999;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: 60rpx;
  }
}

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
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .phone-number {
    font-size: 40rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

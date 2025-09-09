<template>
  <view class="payment-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="nav-title">支付</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 支付金额显示 -->
    <view class="payment-amount-section">
      <text class="amount-label">应付金额(元)</text>
      <text class="amount-value">{{ paymentInfo.amount }}</text>
    </view>

    <!-- 订单详情 -->
    <view class="order-section">
      <view class="section-header">
        <text class="section-title">订单详情</text>
        <view class="toggle-btn" @tap="toggleOrderDetail">
          <text class="toggle-text">{{
            showOrderDetail ? "全额支付" : "话费充值"
          }}</text>
          <text class="toggle-icon" :class="{ rotated: showOrderDetail }"
            >›</text
          >
        </view>
      </view>

      <view class="order-info" v-if="showOrderDetail">
        <view class="order-item">
          <text class="item-label">订单金额</text>
          <text class="item-value">{{ paymentInfo.amount }}元</text>
        </view>
        <view class="order-item">
          <text class="item-label">手机号码</text>
          <text class="item-value">{{ paymentInfo.phoneNumber }}</text>
        </view>
        <view class="order-item">
          <text class="item-label">充值面额</text>
          <text class="item-value">{{ paymentInfo.rechargeAmount }}元</text>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-methods-section">
      <text class="section-title">付款方式</text>

      <!-- 电子账户 -->
      <view
        class="payment-method"
        :class="{ selected: selectedPaymentMethod === 'account' }"
        @tap="selectPaymentMethod('account')"
      >
        <view class="method-left">
          <view class="method-icon account-icon">💳</view>
          <view class="method-info">
            <text class="method-name">电子账户({{ accountBalance }})</text>
            <text class="method-desc">可快速从他行卡转账并支付</text>
          </view>
        </view>
        <view class="method-right">
          <view
            class="radio"
            :class="{ checked: selectedPaymentMethod === 'account' }"
          >
            <view
              class="radio-inner"
              v-if="selectedPaymentMethod === 'account'"
            ></view>
          </view>
        </view>
      </view>

      <!-- 余额不足提示 -->
      <view
        class="insufficient-notice"
        v-if="selectedPaymentMethod === 'account'"
      >
        <text class="notice-text">余额不足，可用余额 0.20元</text>
      </view>

      <!-- 从他行转入资金 -->
      <view class="transfer-option" @tap="showTransferModal">
        <view class="transfer-left">
          <view class="transfer-icon">🏦</view>
          <text class="transfer-text">从他行转入资金</text>
        </view>
        <view class="transfer-arrow">›</view>
      </view>

      <!-- 支付宝 -->
      <view
        class="payment-method"
        :class="{ selected: selectedPaymentMethod === 'alipay' }"
        @tap="selectPaymentMethod('alipay')"
      >
        <view class="method-left">
          <view class="method-icon alipay-icon">
            <text class="icon-text">支</text>
          </view>
          <view class="method-info">
            <text class="method-name">支付宝</text>
            <text class="method-desc">数亿用户的选择，更快更安全</text>
          </view>
        </view>
        <view class="method-right">
          <view
            class="radio"
            :class="{ checked: selectedPaymentMethod === 'alipay' }"
          >
            <view
              class="radio-inner"
              v-if="selectedPaymentMethod === 'alipay'"
            ></view>
          </view>
        </view>
      </view>

      <!-- 微信支付 -->
      <view
        class="payment-method"
        :class="{ selected: selectedPaymentMethod === 'wechat' }"
        @tap="selectPaymentMethod('wechat')"
      >
        <view class="method-left">
          <view class="method-icon wechat-icon">
            <text class="icon-text">微</text>
          </view>
          <view class="method-info">
            <text class="method-name">微信支付</text>
            <text class="method-desc">微信安全支付</text>
          </view>
        </view>
        <view class="method-right">
          <view
            class="radio"
            :class="{ checked: selectedPaymentMethod === 'wechat' }"
          >
            <view
              class="radio-inner"
              v-if="selectedPaymentMethod === 'wechat'"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 付款按钮 -->
    <view class="payment-button-container">
      <button
        class="payment-button"
        :class="{ disabled: !selectedPaymentMethod }"
        @tap="handlePayment"
        :disabled="!selectedPaymentMethod"
      >
        付款
      </button>
    </view>

    <!-- 转账弹窗 -->
    <view
      class="transfer-modal"
      v-if="showTransferModalFlag"
      @tap="hideTransferModal"
    >
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">从他行转入资金</text>
          <text class="modal-close" @tap="hideTransferModal">×</text>
        </view>
        <view class="modal-body">
          <text class="modal-desc">选择银行卡进行转账充值</text>
          <view class="bank-list">
            <view class="bank-item" @tap="selectBank('icbc')">
              <text class="bank-name">工商银行</text>
              <text class="bank-arrow">›</text>
            </view>
            <view class="bank-item" @tap="selectBank('ccb')">
              <text class="bank-name">建设银行</text>
              <text class="bank-arrow">›</text>
            </view>
            <view class="bank-item" @tap="selectBank('abc')">
              <text class="bank-name">农业银行</text>
              <text class="bank-arrow">›</text>
            </view>
            <view class="bank-item" @tap="selectBank('boc')">
              <text class="bank-name">中国银行</text>
              <text class="bank-arrow">›</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from "@/utils/auth.js";

export default {
  name: "RechargePaymentPage",
  data() {
    return {
      paymentInfo: {
        amount: 49.99,
        phoneNumber: "",
        rechargeAmount: 50,
      },
      selectedPaymentMethod: "account",
      showOrderDetail: false,
      showTransferModalFlag: false,
      accountBalance: "3707",
      paymentType: "recharge", // 支付类型：recharge（充值）、water（水费）
      billInfo: null, // 账单信息
    };
  },

  onLoad(options) {
    // 接收从充值页面传递的参数
    if (options.amount) {
      this.paymentInfo.amount = parseFloat(options.amount);
    }
    if (options.phone) {
      this.paymentInfo.phoneNumber = options.phone;
    }
    if (options.rechargeAmount) {
      this.paymentInfo.rechargeAmount = parseInt(options.rechargeAmount);
    }

    // 接收支付类型参数
    if (options.type) {
      this.paymentType = options.type;
    }

    // 接收账单信息参数（水费支付时使用）
    if (options.billInfo) {
      try {
        this.billInfo = JSON.parse(decodeURIComponent(options.billInfo));
      } catch (e) {
        console.error("解析账单信息失败:", e);
      }
    }

    console.log(
      "支付页面加载，支付信息：",
      this.paymentInfo,
      "支付类型：",
      this.paymentType
    );
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("充值支付页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("充值支付页面显示");
    } catch (error) {
      console.error("充值支付页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  methods: {
    goBack() {
      uni.navigateBack();
    },

    toggleOrderDetail() {
      this.showOrderDetail = !this.showOrderDetail;
    },

    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
      console.log("选择支付方式：", method);
    },

    showTransferModal() {
      this.showTransferModalFlag = true;
    },

    hideTransferModal() {
      this.showTransferModalFlag = false;
    },

    selectBank(bankCode) {
      console.log("选择银行：", bankCode);
      this.hideTransferModal();
      uni.showToast({
        title: "银行转账功能开发中",
        icon: "none",
      });
    },

    async handlePayment() {
      if (!this.selectedPaymentMethod) {
        uni.showToast({
          title: "请选择支付方式",
          icon: "none",
        });
        return;
      }

      try {
        uni.showLoading({ title: "支付中..." });

        // 根据不同支付方式处理
        switch (this.selectedPaymentMethod) {
          case "account":
            await this.handleAccountPayment();
            break;
          case "alipay":
            await this.handleAlipayPayment();
            break;
          case "wechat":
            await this.handleWechatPayment();
            break;
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: "支付失败，请稍后重试",
          icon: "none",
        });
        console.error("支付失败:", error);
      }
    },

    async handleAccountPayment() {
      // 模拟账户支付
      await new Promise((resolve) => setTimeout(resolve, 2000));

      uni.hideLoading();
      uni.showToast({
        title: "余额不足，请选择其他支付方式",
        icon: "none",
        duration: 2000,
      });
    },

    async handleAlipayPayment() {
      // 模拟支付宝支付
      await new Promise((resolve) => setTimeout(resolve, 2000));

      uni.hideLoading();
      uni.showToast({
        title: "支付成功",
        icon: "success",
      });

      setTimeout(() => {
        this.handlePaymentSuccess();
      }, 1500);
    },

    async handleWechatPayment() {
      // 模拟微信支付
      await new Promise((resolve) => setTimeout(resolve, 2000));

      uni.hideLoading();
      uni.showToast({
        title: "支付成功",
        icon: "success",
      });

      setTimeout(() => {
        this.handlePaymentSuccess();
      }, 1500);
    },

    // 处理支付成功后的跳转
    handlePaymentSuccess() {
      if (this.paymentType === "water") {
        // 水费支付成功后跳转到生活页面
        uni.reLaunch({
          url: "/pages/life/life",
        });
      } else {
        // 充值支付成功后返回上一页
        uni.navigateBack({
          delta: 2,
        });
      }
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

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  font-weight: 300;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 60rpx;
}

/* 支付金额区域 */
.payment-amount-section {
  background: #fff;
  padding: 60rpx 30rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.amount-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.amount-value {
  display: block;
  font-size: 88rpx;
  font-weight: 300;
  color: #333;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

/* 订单详情区域 */
.order-section {
  background: #fff;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.toggle-text {
  font-size: 28rpx;
  color: #666;
}

.toggle-icon {
  font-size: 32rpx;
  color: #999;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(90deg);
}

.order-info {
  padding: 0 30rpx 20rpx;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.item-label {
  font-size: 28rpx;
  color: #666;
}

.item-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 支付方式区域 */
.payment-methods-section {
  background: #fff;
  margin-bottom: 120rpx;
}

.payment-methods-section .section-title {
  display: block;
  padding: 30rpx 30rpx 20rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}

.payment-method {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.payment-method:active {
  background: #f8f8f8;
}

.payment-method.selected {
  background: #fff;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
}

.account-icon {
  background: #20c997;
  font-size: 32rpx;
}

.alipay-icon {
  background: #1677ff;
}

.wechat-icon {
  background: #07c160;
}

.icon-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.method-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.method-desc {
  font-size: 24rpx;
  color: #999;
}

.method-right {
  margin-left: 20rpx;
}

.radio {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio.checked {
  border-color: #ff9500;
  background: #ff9500;
}

.radio-inner {
  width: 16rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
}

/* 余额不足提示 */
.insufficient-notice {
  padding: 20rpx 30rpx;
  background: #fff5f5;
  margin: 0 30rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.notice-text {
  font-size: 24rpx;
  color: #ff4757;
}

/* 转账选项 */
.transfer-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #f8f9fa;
}

.transfer-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.transfer-icon {
  font-size: 32rpx;
}

.transfer-text {
  font-size: 28rpx;
  color: #20c997;
  font-weight: 500;
}

.transfer-arrow {
  font-size: 32rpx;
  color: #999;
}

/* 付款按钮 */
.payment-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx 40rpx;
  border-top: 1rpx solid #e5e5e5;
}

.payment-button {
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
}

.payment-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.4);
}

.payment-button.disabled {
  background: #ccc;
  box-shadow: none;
  color: #999;
}

/* 转账弹窗 */
.transfer-modal {
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
  padding: 30rpx;
}

.modal-desc {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.bank-list {
  display: flex;
  flex-direction: column;
}

.bank-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.bank-item:last-child {
  border-bottom: none;
}

.bank-item:active {
  background: #f8f8f8;
}

.bank-name {
  font-size: 30rpx;
  color: #333;
}

.bank-arrow {
  font-size: 32rpx;
  color: #999;
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
  .amount-value {
    font-size: 72rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>
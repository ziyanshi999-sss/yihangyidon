<template>
  <view
    class="bank-card"
    :class="[`card-${bankType}`, { 'card-default': isDefault }]"
    @tap="handleCardTap"
  >
    <view class="card-header">
      <view class="bank-logo">
        <image :src="bankLogo" mode="aspectFit" class="logo-image"></image>
      </view>
      <view class="bank-info">
        <text class="bank-name">{{ bankName }}</text>
        <text class="card-type">{{ cardTypeName }}</text>
      </view>
      <view class="card-actions" v-if="showActions">
        <text class="action-btn" @tap.stop="handleEdit">编辑</text>
        <text class="action-btn delete" @tap.stop="handleDelete">删除</text>
      </view>
    </view>

    <view class="card-number">
      <text class="number-text">{{ displayCardNumber }}</text>
    </view>

    <view class="card-footer">
      <view class="card-info">
        <text class="label">持卡人</text>
        <text class="value">{{ holderName }}</text>
      </view>
      <view class="card-info">
        <text class="label">有效期</text>
        <text class="value">{{ expiryDate || "--/--" }}</text>
      </view>
    </view>

    <view class="default-badge" v-if="isDefault">
      <text class="badge-text">默认</text>
    </view>
  </view>
</template>

<script>
import { formatBankCard, hideBankCard } from "@/utils/common";

export default {
  name: "BankCard",
  props: {
    cardInfo: {
      type: Object,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    hideCardNumber: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    bankName() {
      return this.cardInfo.bankName || "中国农业银行";
    },
    bankType() {
      return this.cardInfo.bankType || "abc";
    },
    bankLogo() {
      // 根据银行类型返回对应logo
      const logos = {
        abc: "/static/banks/abc.png",
        icbc: "/static/banks/icbc.png",
        ccb: "/static/banks/ccb.png",
        boc: "/static/banks/boc.png",
        comm: "/static/banks/comm.png",
      };
      return logos[this.bankType] || logos.abc;
    },
    cardTypeName() {
      const types = {
        debit: "储蓄卡",
        credit: "信用卡",
      };
      return types[this.cardInfo.cardType] || "储蓄卡";
    },
    displayCardNumber() {
      if (!this.cardInfo.cardNumber) return "";
      return this.hideCardNumber
        ? hideBankCard(this.cardInfo.cardNumber)
        : formatBankCard(this.cardInfo.cardNumber);
    },
    holderName() {
      return this.cardInfo.holderName || "";
    },
    expiryDate() {
      return this.cardInfo.expiryDate || "";
    },
    isDefault() {
      return this.cardInfo.isDefault || false;
    },
  },
  methods: {
    handleCardTap() {
      this.$emit("card-tap", this.cardInfo);
    },
    handleEdit() {
      this.$emit("edit", this.cardInfo);
    },
    handleDelete() {
      uni.showModal({
        title: "确认删除",
        content: "确定要删除这张银行卡吗？",
        success: (res) => {
          if (res.confirm) {
            this.$emit("delete", this.cardInfo);
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.bank-card {
  position: relative;
  width: 100%;
  height: 200rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-abc {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.card-icbc {
  background: linear-gradient(135deg, #c31432 0%, #240b36 100%);
}

.card-ccb {
  background: linear-gradient(135deg, #0052cc 0%, #1e3c72 100%);
}

.card-boc {
  background: linear-gradient(135deg, #d31027 0%, #ea384d 100%);
}

.card-default {
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.bank-logo {
  width: 60rpx;
  height: 40rpx;
}

.logo-image {
  width: 100%;
  height: 100%;
}

.bank-info {
  flex: 1;
  margin-left: 20rpx;
}

.bank-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
}

.card-type {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.card-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  font-size: 24rpx;
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.delete {
  background: rgba(255, 59, 48, 0.8);
}

.card-number {
  margin-bottom: 20rpx;
}

.number-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  letter-spacing: 4rpx;
  font-family: "Courier New", monospace;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4rpx;
}

.value {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

.default-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff3b30;
  border-radius: 0 20rpx 0 20rpx;
  padding: 8rpx 16rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

/* 卡片悬浮效果 */
.bank-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bank-card:active::before {
  opacity: 1;
}
</style>
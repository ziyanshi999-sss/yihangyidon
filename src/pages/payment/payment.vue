<template>
  <view class="payment-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">生活缴费</text>
      <text class="header-subtitle">水电燃气一键支付</text>
    </view>

    <!-- 缴费类型选择 -->
    <view class="payment-types">
      <view class="types-grid">
        <view
          class="type-item"
          v-for="(type, index) in paymentTypes"
          :key="index"
          @tap="selectPaymentType(type)"
        >
          <view class="type-icon" :style="{ backgroundColor: type.bgColor }">
            <text class="icon-text">{{ type.icon }}</text>
          </view>
          <text class="type-label">{{ type.label }}</text>
        </view>
      </view>
    </view>

    <!-- 缴费表单 -->
    <view class="payment-form" v-if="selectedType">
      <view class="form-section">
        <view class="section-title">
          <text>{{ selectedType.label }}缴费</text>
        </view>

        <view class="form-item">
          <text class="form-label">{{ selectedType.numberLabel }}</text>
          <input
            class="form-input"
            v-model="paymentForm.number"
            :placeholder="`请输入${selectedType.numberLabel}`"
            type="text"
          />
        </view>

        <view class="form-item" v-if="selectedType.showAddress">
          <text class="form-label">缴费地址</text>
          <input
            class="form-input"
            v-model="paymentForm.address"
            placeholder="请输入详细地址"
            type="text"
          />
        </view>

        <view class="form-item">
          <text class="form-label">缴费金额</text>
          <input
            class="form-input amount-input"
            v-model="paymentForm.amount"
            placeholder="请输入缴费金额"
            type="digit"
          />
        </view>
      </view>

      <!-- 缴费按钮 -->
      <view class="payment-actions">
        <button class="query-btn" @tap="queryBill">查询账单</button>
        <button class="pay-btn" @tap="submitPayment" :disabled="!canSubmit">
          立即缴费
        </button>
      </view>
    </view>

    <!-- 缴费记录 -->
    <view class="payment-history">
      <view class="history-header">
        <text class="history-title">最近缴费记录</text>
        <text class="view-all" @tap="viewAllHistory">查看全部</text>
      </view>

      <view class="history-list">
        <view
          class="history-item"
          v-for="(record, index) in paymentHistory"
          :key="index"
        >
          <view class="record-icon">
            <text>{{ record.typeIcon }}</text>
          </view>
          <view class="record-info">
            <text class="record-title">{{ record.title }}</text>
            <text class="record-detail">{{ record.detail }}</text>
          </view>
          <view class="record-amount">
            <text class="amount">-¥{{ record.amount }}</text>
            <text class="status">{{ record.status }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { payLifeBill, queryUtilityBill, getPaymentHistory } from "@/api/life";

export default {
  name: "PaymentPage",
  data() {
    return {
      selectedType: null,
      paymentForm: {
        number: "",
        address: "",
        amount: "",
      },
      paymentTypes: [
        {
          icon: "💡",
          label: "电费",
          bgColor: "#FFD700",
          type: "electric",
          numberLabel: "电费户号",
          showAddress: true,
        },
        {
          icon: "💧",
          label: "水费",
          bgColor: "#1E90FF",
          type: "water",
          numberLabel: "水费户号",
          showAddress: true,
        },
        {
          icon: "🔥",
          label: "燃气费",
          bgColor: "#FF6347",
          type: "gas",
          numberLabel: "燃气户号",
          showAddress: true,
        },
        {
          icon: "📱",
          label: "话费",
          bgColor: "#32CD32",
          type: "phone",
          numberLabel: "手机号码",
          showAddress: false,
        },
        {
          icon: "📺",
          label: "有线电视",
          bgColor: "#9370DB",
          type: "tv",
          numberLabel: "用户编号",
          showAddress: true,
        },
        {
          icon: "🌐",
          label: "宽带费",
          bgColor: "#FF1493",
          type: "internet",
          numberLabel: "宽带账号",
          showAddress: true,
        },
      ],
      paymentHistory: [
        {
          typeIcon: "💡",
          title: "电费缴费",
          detail: "户号: 123456789",
          amount: "156.80",
          status: "成功",
        },
        {
          typeIcon: "💧",
          title: "水费缴费",
          detail: "户号: 987654321",
          amount: "89.50",
          status: "成功",
        },
        {
          typeIcon: "📱",
          title: "话费充值",
          detail: "手机: 138****8888",
          amount: "100.00",
          status: "成功",
        },
      ],
    };
  },

  computed: {
    canSubmit() {
      return (
        this.paymentForm.number &&
        this.paymentForm.amount &&
        (!this.selectedType.showAddress || this.paymentForm.address)
      );
    },
  },

  onLoad() {
    this.loadPaymentHistory();
  },

  methods: {
    selectPaymentType(type) {
      this.selectedType = type;
      this.paymentForm = {
        number: "",
        address: "",
        amount: "",
      };
    },

    async queryBill() {
      if (!this.paymentForm.number) {
        uni.showToast({
          title: `请输入${this.selectedType.numberLabel}`,
          icon: "none",
        });
        return;
      }

      try {
        uni.showLoading({ title: "查询中..." });

        const result = await queryUtilityBill({
          type: this.selectedType.type,
          number: this.paymentForm.number,
          address: this.paymentForm.address,
        });

        if (result.amount) {
          this.paymentForm.amount = result.amount.toString();
          uni.showToast({
            title: "查询成功",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: "暂无待缴费用",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "查询失败，请稍后重试",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    async submitPayment() {
      if (!this.canSubmit) return;

      try {
        uni.showLoading({ title: "缴费中..." });

        await payLifeBill({
          type: this.selectedType.type,
          number: this.paymentForm.number,
          address: this.paymentForm.address,
          amount: parseFloat(this.paymentForm.amount),
        });

        uni.showToast({
          title: "缴费成功",
          icon: "success",
        });

        // 重新加载缴费记录
        this.loadPaymentHistory();

        // 清空表单
        this.paymentForm = {
          number: "",
          address: "",
          amount: "",
        };
      } catch (error) {
        uni.showToast({
          title: "缴费失败，请稍后重试",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    async loadPaymentHistory() {
      try {
        const history = await getPaymentHistory({ limit: 3 });
        this.paymentHistory = history;
      } catch (error) {
        console.error("加载缴费记录失败:", error);
      }
    },

    viewAllHistory() {
      uni.navigateTo({
        url: "/pages/payment-history/payment-history",
      });
    },
  },
};
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #00d4aa 0%, #00b89d 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.payment-types {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.type-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.icon-text {
  font-size: 32rpx;
  color: #fff;
}

.type-label {
  font-size: 26rpx;
  color: #333;
}

.payment-form {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 40rpx 30rpx;
}

.section-title {
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.section-title text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #fafafa;
}

.form-input:focus {
  border-color: #00d4aa;
  background: #fff;
}

.amount-input {
  color: #ff6b35;
  font-weight: 600;
}

.payment-actions {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  background: #f8f8f8;
}

.query-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  color: #666;
  font-size: 28rpx;
  border: none;
}

.pay-btn {
  flex: 2;
  padding: 28rpx;
  border-radius: 12rpx;
  background: #00d4aa;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.pay-btn[disabled] {
  background: #cccccc;
  color: #999;
}

.payment-history {
  background: #fff;
  margin: 0 30rpx 100rpx;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.history-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.view-all {
  font-size: 26rpx;
  color: #00d4aa;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #fafafa;
}

.record-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 24rpx;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.record-detail {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  text-align: right;
}

.amount {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.status {
  font-size: 22rpx;
  color: #00d4aa;
}

/* 点击效果 */
.type-item:active,
.query-btn:active,
.pay-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
  transition: all 0.1s ease;
}
</style>
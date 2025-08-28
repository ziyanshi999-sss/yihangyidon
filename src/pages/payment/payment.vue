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
    <view class="payment-form" v-if="selectedType" @tap.stop>
      <!-- 缴费类型信息 -->
      <view class="type-info">
        <view class="info-header">
          <view
            class="type-icon-large"
            :style="{ backgroundColor: selectedType.bgColor }"
          >
            <text class="icon-text-large">{{ selectedType.icon }}</text>
          </view>
          <view class="type-details">
            <text class="type-title">{{ selectedType.label }}缴费</text>
            <text class="type-desc">{{ selectedType.description }}</text>
            <text class="avg-amount"
              >常见金额: {{ selectedType.avgAmount }}元</text
            >
          </view>
        </view>
      </view>

      <view class="form-section" @tap.stop>
        <view class="form-item">
          <text class="form-label">{{ selectedType.numberLabel }}</text>
          <input
            class="form-input"
            v-model="paymentForm.number"
            :placeholder="selectedType.placeholder"
            type="text"
            @input="onNumberInput"
            @blur="validateNumber"
            @focus="clearNumberError"
            :maxlength="20"
            confirm-type="done"
          />
          <view class="input-error" v-if="formErrors.number">
            <text class="error-text">{{ formErrors.number }}</text>
          </view>
        </view>

        <view class="form-item" v-if="selectedType.showAddress">
          <text class="form-label">缴费地址</text>
          <input
            class="form-input"
            v-model="paymentForm.address"
            placeholder="请输入详细地址（如：XX小区XX号楼XX室）"
            type="text"
            @input="onAddressInput"
            @focus="clearAddressError"
            :maxlength="100"
            confirm-type="done"
          />
          <view class="input-error" v-if="formErrors.address">
            <text class="error-text">{{ formErrors.address }}</text>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">缴费金额</text>
          <input
            class="form-input amount-input"
            v-model="paymentForm.amount"
            placeholder="请输入缴费金额或点击查询账单"
            type="digit"
            @input="onAmountInput"
            @blur="validateAmount"
            @focus="clearAmountError"
            :maxlength="8"
            confirm-type="done"
          />
          <view class="input-error" v-if="formErrors.amount">
            <text class="error-text">{{ formErrors.amount }}</text>
          </view>
        </view>

        <!-- 温馨提示 -->
        <view class="tips-section">
          <text class="tips-title">💡 温馨提示</text>
          <view class="tips-list">
            <text
              class="tip-item"
              v-for="(tip, index) in selectedType.tips"
              :key="index"
            >
              • {{ tip }}
            </text>
          </view>
        </view>
      </view>

      <!-- 缴费按钮 -->
      <view class="payment-actions">
        <button
          class="query-btn"
          @tap="queryBill"
          :disabled="!paymentForm.number"
        >
          查询账单
        </button>
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
      formErrors: {
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
          description: "支持国家电网、南方电网等",
          placeholder: "请输入10-12位电费户号",
          pattern: /^\d{10,12}$/,
          errorMsg: "电费户号格式不正确",
          avgAmount: "150-300",
          tips: [
            "查看电费单上的户号",
            "户号通常为10-12位数字",
            "支持预付费和后付费",
          ],
        },
        {
          icon: "💧",
          label: "水费",
          bgColor: "#1E90FF",
          type: "water",
          numberLabel: "水费户号",
          showAddress: true,
          description: "支持自来水公司缴费",
          placeholder: "请输入8-10位水费户号",
          pattern: /^\d{8,10}$/,
          errorMsg: "水费户号格式不正确",
          avgAmount: "50-150",
          tips: [
            "查看水费单上的用户编号",
            "户号通常为8-10位数字",
            "支持阶梯水价计费",
          ],
        },
        {
          icon: "🔥",
          label: "燃气费",
          bgColor: "#FF6347",
          type: "gas",
          numberLabel: "燃气户号",
          showAddress: true,
          description: "支持天然气公司缴费",
          placeholder: "请输入燃气用户号",
          pattern: /^\d{6,12}$/,
          errorMsg: "燃气户号格式不正确",
          avgAmount: "80-200",
          tips: [
            "查看燃气费单上的用户号",
            "户号格式因地区而异",
            "支持IC卡和直供用户",
          ],
        },
        {
          icon: "📱",
          label: "话费",
          bgColor: "#32CD32",
          type: "phone",
          numberLabel: "手机号码",
          showAddress: false,
          description: "支持三大运营商话费充值",
          placeholder: "请输入11位手机号码",
          pattern: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式不正确",
          avgAmount: "30-100",
          tips: ["支持移动、联通、电信", "充值后即时到账", "可设置自动充值"],
        },
        {
          icon: "📺",
          label: "有线电视",
          bgColor: "#9370DB",
          type: "tv",
          numberLabel: "用户编号",
          showAddress: true,
          description: "支持有线电视费缴纳",
          placeholder: "请输入有线电视用户编号",
          pattern: /^\d{8,15}$/,
          errorMsg: "用户编号格式不正确",
          avgAmount: "20-50",
          tips: [
            "查看有线电视缴费单",
            "用户编号在机顶盒上",
            "支持数字电视和高清频道",
          ],
        },
        {
          icon: "🌐",
          label: "宽带费",
          bgColor: "#FF1493",
          type: "internet",
          numberLabel: "宽带账号",
          showAddress: true,
          description: "支持宽带费用缴纳",
          placeholder: "请输入宽带账号",
          pattern: /^[a-zA-Z0-9]{6,20}$/,
          errorMsg: "宽带账号格式不正确",
          avgAmount: "50-200",
          tips: [
            "查看宽带缴费单上的账号",
            "账号可能包含字母和数字",
            "支持包年包月套餐",
          ],
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
      this.formErrors = {
        number: "",
        address: "",
        amount: "",
      };
    },

    // 验证号码格式
    validateNumber() {
      if (!this.paymentForm.number) {
        this.formErrors.number = `请输入${this.selectedType.numberLabel}`;
        return false;
      }

      if (!this.selectedType.pattern.test(this.paymentForm.number)) {
        this.formErrors.number = this.selectedType.errorMsg;
        return false;
      }

      this.formErrors.number = "";
      return true;
    },

    // 验证金额
    validateAmount() {
      if (!this.paymentForm.amount) {
        this.formErrors.amount = "请输入缴费金额";
        return false;
      }

      const amount = parseFloat(this.paymentForm.amount);
      if (isNaN(amount) || amount <= 0) {
        this.formErrors.amount = "请输入有效的金额";
        return false;
      }

      if (amount > 10000) {
        this.formErrors.amount = "单次缴费金额不能超过10000元";
        return false;
      }

      this.formErrors.amount = "";
      return true;
    },

    // 验证地址
    validateAddress() {
      if (this.selectedType.showAddress && !this.paymentForm.address) {
        this.formErrors.address = "请输入缴费地址";
        return false;
      }

      this.formErrors.address = "";
      return true;
    },

    // 验证所有表单字段
    validateForm() {
      const isNumberValid = this.validateNumber();
      const isAmountValid = this.validateAmount();
      const isAddressValid = this.validateAddress();

      return isNumberValid && isAmountValid && isAddressValid;
    },

    // 输入事件处理
    onNumberInput(e) {
      this.paymentForm.number = e.detail.value;
      // 清除错误提示
      if (this.formErrors.number) {
        this.formErrors.number = "";
      }
    },

    onAddressInput(e) {
      this.paymentForm.address = e.detail.value;
      // 清除错误提示
      if (this.formErrors.address) {
        this.formErrors.address = "";
      }
    },

    onAmountInput(e) {
      this.paymentForm.amount = e.detail.value;
      // 清除错误提示
      if (this.formErrors.amount) {
        this.formErrors.amount = "";
      }
    },

    // 清除错误提示
    clearNumberError() {
      this.formErrors.number = "";
    },

    clearAddressError() {
      this.formErrors.address = "";
    },

    clearAmountError() {
      this.formErrors.amount = "";
    },

    async queryBill() {
      // 验证号码格式
      if (!this.validateNumber()) {
        return;
      }

      // 验证地址（如果需要）
      if (!this.validateAddress()) {
        return;
      }

      try {
        uni.showLoading({ title: "查询中..." });

        // 模拟查询结果（实际项目中调用真实API）
        const result = await this.mockQueryBill({
          type: this.selectedType.type,
          number: this.paymentForm.number,
          address: this.paymentForm.address,
        });

        if (result.success && result.amount) {
          this.paymentForm.amount = result.amount.toString();
          uni.showModal({
            title: "查询成功",
            content: `查询到待缴费用：${result.amount}元\n账期：${
              result.period
            }\n地址：${result.address || this.paymentForm.address}`,
            confirmText: "确定",
            showCancel: false,
          });
        } else {
          uni.showModal({
            title: "查询结果",
            content: result.message || "暂无待缴费用",
            confirmText: "确定",
            showCancel: false,
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
      // 验证整个表单
      if (!this.validateForm()) {
        uni.showToast({
          title: "请检查输入信息",
          icon: "none",
        });
        return;
      }

      // 确认缴费
      const confirmResult = await new Promise((resolve) => {
        uni.showModal({
          title: "确认缴费",
          content: `${this.selectedType.label}缴费\n${this.selectedType.numberLabel}：${this.paymentForm.number}\n缴费金额：${this.paymentForm.amount}元`,
          confirmText: "确认缴费",
          cancelText: "取消",
          success: (res) => resolve(res.confirm),
        });
      });

      if (!confirmResult) return;

      try {
        uni.showLoading({ title: "缴费中..." });

        // 模拟缴费（实际项目中调用真实API）
        const result = await this.mockPayment({
          type: this.selectedType.type,
          number: this.paymentForm.number,
          address: this.paymentForm.address,
          amount: parseFloat(this.paymentForm.amount),
        });

        if (result.success) {
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
          this.formErrors = {
            number: "",
            address: "",
            amount: "",
          };
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        uni.showToast({
          title: error.message || "缴费失败，请稍后重试",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    // 模拟查询账单API
    async mockQueryBill(params) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 根据不同类型返回不同的模拟数据
          const mockData = {
            electric: {
              success: true,
              amount: 156.8,
              period: "2024年1月",
              address: "XX小区XX号楼",
            },
            water: {
              success: true,
              amount: 89.5,
              period: "2024年1月",
              address: "XX小区XX号楼",
            },
            gas: {
              success: true,
              amount: 125.3,
              period: "2024年1月",
              address: "XX小区XX号楼",
            },
            phone: {
              success: true,
              amount: 50.0,
              period: "当前余额",
              address: null,
            },
            tv: {
              success: true,
              amount: 25.0,
              period: "2024年1月",
              address: "XX小区XX号楼",
            },
            internet: {
              success: true,
              amount: 100.0,
              period: "2024年1月",
              address: "XX小区XX号楼",
            },
          };

          resolve(
            mockData[params.type] || { success: false, message: "查询失败" }
          );
        }, 1500);
      });
    },

    // 模拟缴费API
    async mockPayment(params) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟成功缴费
          resolve({
            success: true,
            orderId: `PAY${Date.now()}`,
            message: "缴费成功",
          });
        }, 2000);
      });
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

/* 缴费类型信息 */
.type-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.info-header {
  display: flex;
  align-items: center;
}

.type-icon-large {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
}

.icon-text-large {
  font-size: 40rpx;
  color: #fff;
}

.type-details {
  flex: 1;
}

.type-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.type-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 6rpx;
  display: block;
}

.avg-amount {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.form-section {
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
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
  position: relative;
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
  box-sizing: border-box;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  cursor: text;
}

.form-input:focus {
  border-color: #00d4aa;
  background: #fff;
  box-shadow: 0 0 0 2rpx rgba(0, 212, 170, 0.2);
}

.form-input:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.amount-input {
  color: #ff6b35;
  font-weight: 600;
}

/* 输入错误样式 */
.input-error {
  margin-top: 8rpx;
}

.error-text {
  color: #ff4757;
  font-size: 24rpx;
}

.form-input.error {
  border-color: #ff4757;
  background: #fff5f5;
}

/* 温馨提示 */
.tips-section {
  background: #f8f9ff;
  border: 2rpx solid #e6f3ff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-top: 30rpx;
}

.tips-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
  display: block;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.tip-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
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
  transition: all 0.3s ease;
}

.query-btn[disabled] {
  background: #e0e0e0;
  color: #999;
  opacity: 0.6;
}

.query-btn:not([disabled]):active {
  background: #e0e0e0;
  transform: scale(0.98);
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
  transition: all 0.3s ease;
}

.pay-btn[disabled] {
  background: #cccccc;
  color: #999;
  opacity: 0.6;
}

.pay-btn:not([disabled]):active {
  background: #00b89d;
  transform: scale(0.98);
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
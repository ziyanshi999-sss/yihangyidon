<template>
  <view class="water-payment-page">
    <!-- 顶部厨房插画背景 -->
    <view class="header-section">
      <view class="kitchen-illustration">
        <!-- SVG厨房插画 -->
        <view class="kitchen-scene">
          <!-- 背景砖墙 -->
          <view class="brick-wall"></view>

          <!-- 水槽和水龙头 -->
          <view class="sink-area">
            <view class="faucet">
              <view class="faucet-base"></view>
              <view class="water-flow" v-if="showWaterFlow"></view>
            </view>
            <view class="sink-bowl">
              <view class="sink-inner"></view>
              <view class="plate plate-1"></view>
              <view class="plate plate-2"></view>
            </view>
          </view>

          <!-- 台面物品 -->
          <view class="counter-items">
            <view class="cutting-board">
              <view class="carrot"></view>
              <view class="tomato"></view>
              <view class="knife"></view>
            </view>
            <view class="glass"></view>
          </view>

          <!-- 挂钩和物品 -->
          <view class="hanging-items">
            <view class="meat-hook"></view>
          </view>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <text class="page-title">水费</text>
        <text class="location-text">{{ selectedCity }}</text>
      </view>
    </view>

    <!-- 缴费项目信息 -->
    <view class="payment-info-section">
      <view class="info-row">
        <text class="info-label">缴费项目</text>
        <text class="info-value">水费</text>
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
          <text class="modal-title">水费账单</text>
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
              <text class="bill-label">用水地址：</text>
              <text class="bill-value">{{ billInfo.address }}</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">上期读数：</text>
              <text class="bill-value">{{ billInfo.lastReading }}吨</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期读数：</text>
              <text class="bill-value">{{ billInfo.currentReading }}吨</text>
            </view>
            <view class="bill-row">
              <text class="bill-label">本期用量：</text>
              <text class="bill-value">{{ billInfo.usage }}吨</text>
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
  name: "WaterPaymentPage",
  data() {
    return {
      selectedCity: "保定市",
      selectedCompany: {
        name: "保定市自来水公司",
        code: "baoding_water",
      },
      userNumber: "",
      selectedGroup: "self",
      showWaterFlow: false,
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
    // 接收从水费页面传递的参数
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

    console.log("水费缴费页面加载，参数：", {
      city: this.selectedCity,
      company: this.selectedCompany,
    });

    // 启动水流动画
    this.startWaterAnimation();
    this.loadUserData();
  },

  onShow() {
    try {
      if (!forceCheckLogin()) {
        console.log("水费缴费页面：用户未登录，跳转到登录页面");
        uni.reLaunch({
          url: "/pages/denglu/login",
        });
        return;
      }
      console.log("水费缴费页面显示");
    } catch (error) {
      console.error("水费缴费页面onShow检查失败:", error);
      uni.reLaunch({
        url: "/pages/denglu/login",
      });
    }
  },

  onUnload() {
    // 清理定时器
    if (this.waterTimer) {
      clearInterval(this.waterTimer);
    }
  },

  methods: {
    // 加载用户数据
    async loadUserData() {
      try {
        // 使用数据连接器获取用户数据
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        const users = await connector.getUsers()
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser) {
          console.log('水费缴费页面加载用户数据:', {
            username: currentUser.username,
            balance: currentUser.balance
          })
          
          // 加载水费相关数据
          await this.loadWaterData(connector)
        }
      } catch (error) {
        console.error('加载用户数据失败:', error)
      }
    },

    // 加载水费相关数据
    async loadWaterData(connector) {
      try {
        const waterData = await connector.getWaterPaymentData()
        const paymentHistory = await connector.getWaterPaymentHistory()
        
        console.log('💧 水费数据加载完成:', {
          cities: Object.keys(waterData.cities || {}).length,
          paymentHistory: paymentHistory.length
        })

        // 验证当前选择的公司是否在数据中
        if (this.selectedCompany && waterData.cities) {
          const cityData = waterData.cities[this.selectedCity]
          if (cityData && cityData.companies) {
            const companyExists = cityData.companies.find(company => 
              company.code === this.selectedCompany.code
            )
            if (companyExists) {
              // 更新公司信息，确保数据一致性
              this.selectedCompany = companyExists
              console.log('✅ 公司信息已更新:', this.selectedCompany)
            }
          }
        }
      } catch (error) {
        console.error('❌ 加载水费数据失败:', error)
      }
    },

    // 启动水流动画
    startWaterAnimation() {
      this.waterTimer = setInterval(() => {
        this.showWaterFlow = !this.showWaterFlow;
      }, 2000);
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
        lastReading: Math.floor(Math.random() * 100) + 50,
        currentReading: 0,
        usage: 0,
        amount: "0.00",
        dueDate: this.generateDueDate(),
      };

      mockBill.currentReading =
        mockBill.lastReading + Math.floor(Math.random() * 30) + 10;
      mockBill.usage = mockBill.currentReading - mockBill.lastReading;
      mockBill.amount = this.calculateWaterBill(mockBill.usage);

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

    // 计算水费
    calculateWaterBill(usage) {
      let amount = 0;
      if (usage <= 15) {
        amount = usage * 2.8;
      } else if (usage <= 25) {
        amount = 15 * 2.8 + (usage - 15) * 4.2;
      } else {
        amount = 15 * 2.8 + 10 * 4.2 + (usage - 25) * 6.0;
      }
      return amount.toFixed(2);
    },

    // 隐藏账单弹窗
    hideBillModal() {
      this.showBillModal = false;
    },

    // 进入支付流程
    async proceedToPayment() {
      this.hideBillModal();

      try {
        // 记录支付开始
        console.log('💧 开始水费支付流程:', {
          userNumber: this.userNumber,
          amount: this.billInfo.amount,
          company: this.selectedCompany.name
        })

        // 跳转到支付页面
        uni.navigateTo({
          url: `/pages/recharge-payment/recharge-payment?amount=${
            this.billInfo.amount
          }&phone=${this.userNumber}&rechargeAmount=${
            this.billInfo.amount
          }&type=water&billInfo=${encodeURIComponent(
            JSON.stringify(this.billInfo)
          )}&company=${encodeURIComponent(
            JSON.stringify(this.selectedCompany)
          )}`,
        });
      } catch (error) {
        console.error('❌ 进入支付流程失败:', error)
        uni.showToast({
          title: '支付流程启动失败',
          icon: 'error'
        })
      }
    },

    // 处理支付成功回调
    async handlePaymentSuccess(paymentResult) {
      try {
        console.log('💧 水费支付成功:', paymentResult)
        
        // 使用数据连接器添加缴费记录
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        const users = await connector.getUsers()
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser) {
          // 添加缴费记录
          const paymentRecord = {
            userId: currentUser.id,
            company: this.selectedCompany.name,
            userNumber: this.userNumber,
            amount: this.billInfo.amount,
            billPeriod: this.billInfo.billPeriod,
            city: this.selectedCity,
            paymentMethod: paymentResult.paymentMethod || '银行卡',
            transactionId: paymentResult.transactionId || `water_${Date.now()}`
          }
          
          await connector.addWaterPaymentRecord(paymentRecord)
          
          // 更新用户余额
          const newBalance = currentUser.balance - this.billInfo.amount
          currentUser.balance = newBalance
          
          // 更新用户数据
          const userIndex = users.findIndex(user => user.id === currentUser.id)
          if (userIndex !== -1) {
            users[userIndex] = currentUser
            // 这里可以添加更新用户数据的逻辑
          }
          
          console.log('✅ 水费缴费记录添加成功，用户余额更新:', newBalance)
          
          // 显示成功提示
          uni.showToast({
            title: '缴费成功',
            icon: 'success',
            duration: 2000
          })
          
          // 延迟返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 2000)
        }
      } catch (error) {
        console.error('❌ 处理支付成功回调失败:', error)
        uni.showToast({
          title: '缴费记录保存失败',
          icon: 'error'
        })
      }
    },
  },
};
</script>

<style scoped>
.water-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部厨房插画区域 */
.header-section {
  position: relative;
  height: 400rpx;
  background: linear-gradient(180deg, #ffeaa7 0%, #fab1a0 100%);
  overflow: hidden;
}

.kitchen-illustration {
  position: relative;
  width: 100%;
  height: 300rpx;
  padding: 40rpx 30rpx 20rpx;
}

.kitchen-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 砖墙背景 */
.brick-wall {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.1) 75%,
      rgba(255, 255, 255, 0.1) 76%,
      transparent 77%
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.1) 75%,
      rgba(255, 255, 255, 0.1) 76%,
      transparent 77%
    );
  background-size: 80rpx 40rpx, 80rpx 40rpx;
  background-position: 0 0, 40rpx 40rpx;
  opacity: 0.3;
}

/* 水槽区域 */
.sink-area {
  position: absolute;
  right: 80rpx;
  top: 80rpx;
  width: 300rpx;
  height: 180rpx;
}

/* 水龙头 */
.faucet {
  position: absolute;
  right: 100rpx;
  top: -20rpx;
  width: 80rpx;
  height: 100rpx;
}

.faucet-base {
  width: 60rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
  border-radius: 30rpx 30rpx 10rpx 10rpx;
  position: relative;
}

.faucet-base::before {
  content: "";
  position: absolute;
  top: 30rpx;
  right: -20rpx;
  width: 40rpx;
  height: 20rpx;
  background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
  border-radius: 0 10rpx 10rpx 0;
}

/* 水流动画 */
.water-flow {
  position: absolute;
  bottom: -40rpx;
  left: 25rpx;
  width: 10rpx;
  height: 40rpx;
  background: linear-gradient(180deg, #74b9ff 0%, #0984e3 100%);
  border-radius: 5rpx;
  animation: waterDrop 0.5s ease-in-out;
}

@keyframes waterDrop {
  0% {
    height: 0;
    opacity: 0;
  }
  50% {
    height: 40rpx;
    opacity: 1;
  }
  100% {
    height: 40rpx;
    opacity: 0;
  }
}

/* 水槽 */
.sink-bowl {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #ddd 0%, #bbb 100%);
  border-radius: 100rpx 100rpx 20rpx 20rpx;
  overflow: hidden;
}

.sink-inner {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  right: 10rpx;
  bottom: 10rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 90rpx 90rpx 15rpx 15rpx;
}

/* 盘子 */
.plate {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  background: #fff;
  border-radius: 50%;
  border: 2rpx solid #e9ecef;
}

.plate-1 {
  top: 20rpx;
  left: 30rpx;
  transform: rotate(-15deg);
}

.plate-2 {
  top: 30rpx;
  right: 40rpx;
  transform: rotate(20deg);
}

/* 台面物品 */
.counter-items {
  position: absolute;
  left: 50rpx;
  top: 100rpx;
  width: 200rpx;
  height: 120rpx;
}

.cutting-board {
  position: relative;
  width: 120rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #d4a574 0%, #c19a6b 100%);
  border-radius: 10rpx;
}

/* 胡萝卜 */
.carrot {
  position: absolute;
  top: 15rpx;
  left: 10rpx;
  width: 30rpx;
  height: 8rpx;
  background: linear-gradient(90deg, #fd79a8 0%, #e84393 100%);
  border-radius: 4rpx;
}

.carrot::before {
  content: "";
  position: absolute;
  top: -5rpx;
  left: -2rpx;
  width: 8rpx;
  height: 8rpx;
  background: #00b894;
  border-radius: 50%;
}

/* 番茄 */
.tomato {
  position: absolute;
  top: 10rpx;
  right: 15rpx;
  width: 25rpx;
  height: 25rpx;
  background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
  border-radius: 50%;
}

/* 刀 */
.knife {
  position: absolute;
  bottom: 10rpx;
  left: 20rpx;
  width: 60rpx;
  height: 8rpx;
  background: linear-gradient(90deg, #636e72 0%, #2d3436 50%, #ddd 100%);
  border-radius: 4rpx;
}

/* 杯子 */
.glass {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 60rpx;
  background: linear-gradient(
    180deg,
    rgba(116, 185, 255, 0.3) 0%,
    rgba(116, 185, 255, 0.6) 100%
  );
  border-radius: 0 0 20rpx 20rpx;
  border: 2rpx solid rgba(116, 185, 255, 0.5);
  border-top: none;
}

/* 挂钩物品 */
.hanging-items {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
}

.meat-hook {
  width: 40rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  border-radius: 20rpx 20rpx 10rpx 10rpx;
  position: relative;
}

.meat-hook::before {
  content: "";
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 4rpx;
  height: 15rpx;
  background: #636e72;
  border-radius: 2rpx;
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
  border-color: #74b9ff;
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
  border-color: #74b9ff;
  background: #e6f7ff;
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
  color: #74b9ff;
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
  color: #74b9ff;
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
  background: linear-gradient(135deg, #ff9500 0%, #ff8400 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 149, 0, 0.3);
  transition: all 0.3s ease;
}

.next-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.4);
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
  background: #fff7e6;
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
  background: linear-gradient(135deg, #ff9500 0%, #ff8400 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 149, 0, 0.3);
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

  .kitchen-illustration {
    height: 240rpx;
    padding: 30rpx 20rpx 15rpx;
  }

  .modal-content {
    width: 90%;
    margin: 0 5%;
  }
}
</style>

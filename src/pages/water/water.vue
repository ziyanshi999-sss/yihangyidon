<template>
  <view class="water-page">
    <!-- 地区选择 -->
    <view class="location-section">
      <view class="location-header">
        <text class="location-title">选择地区</text>
        <text class="location-tip">请选择您的缴费地区</text>
      </view>

      <view class="current-location" @tap="goToCitySelect">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <view class="location-text-wrapper">
            <text class="location-text">{{ selectedCity }}</text>
            <text class="location-status">当前定位</text>
          </view>
        </view>
        <text class="change-text">更换</text>
      </view>
    </view>

    <!-- 水费公司选择 -->
    <view class="company-section" v-if="waterCompanies.length > 0">
      <view class="section-header">
        <text class="section-title">选择供水公司</text>
        <text class="company-count">{{ waterCompanies.length }}家公司</text>
      </view>

      <view class="company-list">
        <view
          class="company-item"
          v-for="(company, index) in waterCompanies"
          :key="index"
          @tap="selectCompany(company)"
        >
          <view class="company-info">
            <text class="company-name">{{ company.name }}</text>
            <text class="company-desc">{{ company.description }}</text>
          </view>
          <view class="company-arrow">
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 暂无服务提示 -->
    <view class="no-service" v-if="waterCompanies.length === 0">
      <view class="no-service-icon">🚰</view>
      <text class="no-service-title">暂无水费服务</text>
      <text class="no-service-desc"
        >{{ selectedCity }}暂未开通水费缴费服务</text
      >
      <text class="no-service-tip">请联系当地供水公司或稍后再试</text>
    </view>

    <!-- 历史记录入口 -->
    <view class="history-section" v-if="waterCompanies.length > 0">
      <view class="history-card" @tap="goToHistory">
        <view class="history-icon">📋</view>
        <view class="history-content">
          <text class="history-title">缴费记录</text>
          <text class="history-desc">查看历史缴费记录</text>
        </view>
        <view class="history-arrow">
          <text class="arrow-icon">→</text>
        </view>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="footer-info">
      <text class="info-text">• 缴费成功后，请保留缴费凭证</text>
      <text class="info-text">• 如有疑问，请联系供水公司客服</text>
      <text class="info-text">• 缴费到账时间：实时到账</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "WaterPage",
  data() {
    return {
      selectedCity: "保定市", // 默认城市

      // 不同城市的水费公司数据
      cityWaterCompanies: {
        保定市: [
          {
            name: "保定市自来水公司",
            description: "保定市主城区供水服务",
            code: "baoding_water",
            serviceArea: "主城区、高新区",
          },
          {
            name: "保定市北部水务公司",
            description: "保定市北部地区供水服务",
            code: "baoding_north_water",
            serviceArea: "徐水区、满城区",
          },
        ],
        北京: [
          {
            name: "北京自来水集团",
            description: "北京市主要供水服务商",
            code: "beijing_water",
            serviceArea: "全市范围",
          },
          {
            name: "北京市郊区水务公司",
            description: "北京市郊区供水服务",
            code: "beijing_suburb_water",
            serviceArea: "郊区县域",
          },
        ],
        上海: [
          {
            name: "上海城投水务集团",
            description: "上海市主要供水服务商",
            code: "shanghai_water",
            serviceArea: "全市范围",
          },
        ],
        广州市: [
          {
            name: "广州市自来水公司",
            description: "广州市主城区供水服务",
            code: "guangzhou_water",
            serviceArea: "主城区",
          },
          {
            name: "广州市番禺水务公司",
            description: "番禺区供水服务",
            code: "guangzhou_panyu_water",
            serviceArea: "番禺区",
          },
        ],
        深圳: [
          {
            name: "深圳市水务集团",
            description: "深圳市主要供水服务商",
            code: "shenzhen_water",
            serviceArea: "全市范围",
          },
        ],
        杭州市: [
          {
            name: "杭州市自来水公司",
            description: "杭州市主城区供水服务",
            code: "hangzhou_water",
            serviceArea: "主城区、西湖区",
          },
        ],
      },
    };
  },

  computed: {
    // 当前城市的水费公司
    waterCompanies() {
      return this.cityWaterCompanies[this.selectedCity] || [];
    },
  },

  onLoad() {
    console.log("水费页面加载");
    this.initializeLocation();
    this.loadUserData();
  },

  onShow() {
    // 页面显示时检查城市是否有变化
    this.syncLocationFromStorage();
  },

  onReady() {
    // 监听城市选择事件
    uni.$on("citySelected", (city) => {
      console.log("水费页面接收到城市选择:", city);
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        uni.showToast({
          title: `已切换到${city}`,
          icon: "none",
          duration: 1500,
        });
      }
    });
  },

  onUnload() {
    // 移除事件监听
    uni.$off("citySelected");
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
          console.log('✅ 水费页面用户数据加载成功:', {
            username: currentUser.username,
            phone: currentUser.phone,
            balance: currentUser.balance,
            hasLifeServices: !!currentUser.lifeServices
          })
          
          // 加载水费支付历史
          await this.loadWaterPaymentHistory(connector)
        } else {
          console.log('❌ 未找到当前用户数据')
        }
      } catch (error) {
        console.error('❌ 加载用户数据失败:', error)
      }
    },

    // 加载水费缴费历史
    async loadWaterPaymentHistory(connector) {
      try {
        const paymentHistory = await connector.getWaterPaymentHistory()
        console.log('💧 水费缴费历史:', paymentHistory.length, '条记录')
        
        // 可以在这里处理历史记录，比如显示最近缴费记录
        if (paymentHistory.length > 0) {
          const latestPayment = paymentHistory[0]
          console.log('最新缴费记录:', latestPayment)
        }
      } catch (error) {
        console.error('❌ 加载水费缴费历史失败:', error)
      }
    },

    // 初始化位置信息
    initializeLocation() {
      const city = uni.getStorageSync("selectedCity");
      if (city) {
        this.selectedCity = city;
        console.log(`水费页面同步城市: ${city}`);
      }
    },

    // 从存储同步位置信息
    syncLocationFromStorage() {
      const city = uni.getStorageSync("selectedCity");
      if (city && city !== this.selectedCity) {
        this.selectedCity = city;
        console.log(`水费页面城市已更新: ${city}`);

        // 显示城市变更提示
        uni.showToast({
          title: `已切换到${city}`,
          icon: "none",
          duration: 1500,
        });
      }
    },

    // 跳转到城市选择页面
    goToCitySelect() {
      console.log("从水费页面跳转到城市选择");
      uni.navigateTo({
        url: "/pages/city-select/city-select",
        success: () => {
          console.log("成功跳转到城市选择页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    },

    // 选择供水公司
    selectCompany(company) {
      console.log("选择供水公司:", company);

      uni.showModal({
        title: company.name,
        content: `服务区域：${company.serviceArea}\n\n即将进入${company.name}缴费页面，请准备好您的用户编号。`,
        confirmText: "进入缴费",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.enterPaymentFlow(company);
          }
        },
      });
    },

    // 进入缴费流程
    enterPaymentFlow(company) {
      // 跳转到新的水费缴费页面
      uni.navigateTo({
        url: `/pages/water-payment/water-payment?city=${encodeURIComponent(
          this.selectedCity
        )}&company=${encodeURIComponent(JSON.stringify(company))}`,
        success: () => {
          console.log("成功跳转到水费缴费页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    },

    // 跳转到历史记录
    goToHistory() {
      uni.navigateTo({
        url: '/pages/water-history/water-history',
        success: () => {
          console.log("成功跳转到水费历史记录页面");
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    },

    // 显示缴费表单
    showPaymentForm(company) {
      uni.showModal({
        title: `${company.name}缴费`,
        editable: true,
        placeholderText: "请输入用户编号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.processWaterPayment(company, res.content);
          } else if (res.confirm && !res.content) {
            uni.showToast({
              title: "请输入用户编号",
              icon: "none",
            });
          }
        },
      });
    },

    // 处理水费缴费
    processWaterPayment(company, userNumber) {
      uni.showLoading({
        title: "查询中...",
      });

      // 模拟查询用户信息和账单
      setTimeout(() => {
        uni.hideLoading();

        const mockBill = {
          userNumber: userNumber,
          userName: userInfo?.realName || userInfo?.nickname || "用户",
          address: userInfo?.address || "用户地址",
          lastReading: 145,
          currentReading: 167,
          usage: 22,
          amount: this.calculateWaterBill(22),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        this.showBillDetails(company, mockBill);
      }, 2000);
    },

    // 显示账单详情
    showBillDetails(company, bill) {
      const content = `用户编号：${bill.userNumber}
用户姓名：${bill.userName}
用水地址：${bill.address}
上期读数：${bill.lastReading}吨
本期读数：${bill.currentReading}吨
本期用量：${bill.usage}吨
应缴费用：¥${bill.amount}元
缴费期限：${bill.dueDate}

是否立即缴费？`;

      uni.showModal({
        title: "水费账单",
        content: content,
        confirmText: "立即缴费",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.completeWaterPayment(company, bill);
          }
        },
      });
    },

    // 完成水费缴费
    completeWaterPayment(company, bill) {
      uni.showLoading({
        title: "缴费中...",
      });

      setTimeout(() => {
        uni.hideLoading();

        // 保存缴费记录到用户数据
        this.savePaymentRecord(company, bill);

        uni.showModal({
          title: "缴费成功",
          content: `恭喜您！水费缴费成功
          
缴费金额：¥${bill.amount}元
缴费时间：${new Date().toLocaleString()}
流水号：${this.generateTransactionId()}

请保留好缴费凭证，如有疑问请联系供水公司。`,
          showCancel: false,
          confirmText: "确定",
          success: () => {
            // 可以跳回上一页或主页
            console.log(`水费缴费成功 - ${company.name}: ¥${bill.amount}`);
            uni.navigateBack();
          },
        });
      }, 2500);
    },

    // 保存缴费记录
    savePaymentRecord(company, bill) {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUserIndex = users.findIndex(user => user.isLoggedIn)
        
        if (currentUserIndex !== -1) {
          const currentUser = users[currentUserIndex]
          
          // 创建缴费记录
          const paymentRecord = {
            id: `p${Date.now()}`,
            type: "水费",
            amount: parseFloat(bill.amount),
            account: bill.userNumber,
            description: `${company.name} - ${bill.address}`,
            status: "completed",
            timestamp: new Date().toISOString(),
            operator: company.name,
            transactionId: this.generateTransactionId()
          }
          
          // 添加到缴费记录
          if (!currentUser.paymentRecords) {
            currentUser.paymentRecords = []
          }
          currentUser.paymentRecords.unshift(paymentRecord)
          
          // 更新用户余额
          currentUser.balance -= parseFloat(bill.amount)
          currentUser.lastUpdateTime = new Date().toISOString()
          
          // 保存到本地存储
          users[currentUserIndex] = currentUser
          uni.setStorageSync('users', users)
          uni.setStorageSync('userInfo', currentUser)
          uni.setStorageSync('currentUser', currentUser)
          
          console.log('水费缴费记录已保存:', paymentRecord)
        }
      } catch (error) {
        console.error('保存缴费记录失败:', error)
      }
    },

    // 计算水费（模拟计算）
    calculateWaterBill(usage) {
      // 阶梯水价计算
      let amount = 0;
      if (usage <= 15) {
        amount = usage * 2.8; // 第一阶梯：2.8元/吨
      } else if (usage <= 25) {
        amount = 15 * 2.8 + (usage - 15) * 4.2; // 第二阶梯：4.2元/吨
      } else {
        amount = 15 * 2.8 + 10 * 4.2 + (usage - 25) * 6.0; // 第三阶梯：6.0元/吨
      }
      return amount.toFixed(2);
    },

    // 生成交易流水号
    generateTransactionId() {
      const now = new Date();
      const timestamp = now.getTime().toString();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `WF${timestamp.slice(-8)}${random}`;
    },
  },
};
</script>

<style scoped>
.water-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 地区选择 */
.location-section {
  background: #fff;
  margin: 60rpx 30rpx 20rpx; /* 增加顶部间距 */
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.location-header {
  margin-bottom: 24rpx;
}

.location-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.location-tip {
  font-size: 24rpx;
  color: #666;
}

.current-location {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.current-location:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.location-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.location-icon {
  font-size: 32rpx;
  color: #1890ff;
}

.location-text-wrapper {
  flex: 1;
}

.location-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.location-status {
  font-size: 22rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.change-text {
  font-size: 26rpx;
  color: #1890ff;
  font-weight: 500;
}

/* 供水公司选择 */
.company-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.company-count {
  font-size: 24rpx;
  color: #666;
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.company-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.company-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.company-desc {
  font-size: 24rpx;
  color: #666;
}

.company-arrow {
  margin-left: 20rpx;
}

.arrow-icon {
  font-size: 24rpx;
  color: #999;
}

/* 暂无服务 */
.no-service {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80rpx 30rpx;
  margin: 40rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.no-service-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.no-service-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.no-service-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.no-service-tip {
  font-size: 24rpx;
  color: #999;
}

/* 历史记录入口 */
.history-section {
  margin: 24rpx;
}

.history-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.history-card:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.history-icon {
  font-size: 32rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12rpx;
}

.history-content {
  flex: 1;
}

.history-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.history-desc {
  font-size: 20rpx;
  color: #666;
}

.history-arrow {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 20rpx;
  color: #999;
}

/* 底部说明 */
.footer-info {
  margin: 40rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.info-text:last-child {
  margin-bottom: 0;
}

/* 页面加载动画 */
.water-page {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .location-section,
  .company-section,
  .footer-info {
    margin: 20rpx 20rpx;
    padding: 24rpx;
  }

  .company-item {
    padding: 20rpx;
  }
}
</style>
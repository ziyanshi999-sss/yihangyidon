<template>
  <view class="home-container">
    <!-- 顶部banner -->
    <view class="banner">
      <image src="/static/logo.png" class="logo" mode="aspectFit"></image>
      <text class="welcome">欢迎使用农业银行</text>
    </view>
    
    <!-- 快捷功能 -->
    <view class="quick-actions">
      <view class="action-item" @click="navigateTo('/pages/wealth/wealth')">
        <view class="action-icon">💰</view>
        <text class="action-text">财富管理</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/life/life')">
        <view class="action-icon">🏠</view>
        <text class="action-text">生活服务</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/user/user')">
        <view class="action-icon">👤</view>
        <text class="action-text">个人中心</text>
      </view>
    </view>
    
    <!-- 银行服务 -->
    <view class="bank-services">
      <view class="service-title">银行服务</view>
      <view class="service-grid">
        <view class="service-item" @click="handleService('transfer')">
          <text class="service-icon">💳</text>
          <text class="service-name">转账汇款</text>
        </view>
        <view class="service-item" @click="handleService('payment')">
          <text class="service-icon">💸</text>
          <text class="service-name">缴费支付</text>
        </view>
        <view class="service-item" @click="handleService('investment')">
          <text class="service-icon">📈</text>
          <text class="service-name">投资理财</text>
        </view>
        <view class="service-item" @click="handleService('loan')">
          <text class="service-icon">🏦</text>
          <text class="service-name">贷款服务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null
    }
  },
  
  onLoad() {
    this.initPage()
  },
  
  methods: {
    initPage() {
      // 获取用户信息
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          this.userInfo = userInfo
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    navigateTo(url) {
      uni.switchTab({
        url: url
      })
    },
    
    handleService(type) {
      switch(type) {
        case 'transfer':
          uni.showToast({
            title: '转账汇款功能开发中',
            icon: 'none'
          })
          break
        case 'payment':
          uni.showToast({
            title: '缴费支付功能开发中',
            icon: 'none'
          })
          break
        case 'investment':
          uni.showToast({
            title: '投资理财功能开发中',
            icon: 'none'
          })
          break
        case 'loan':
          uni.showToast({
            title: '贷款服务功能开发中',
            icon: 'none'
          })
          break
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.banner {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
  color: white;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.welcome {
  font-size: 36rpx;
  font-weight: bold;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.action-item {
  text-align: center;
  flex: 1;
}

.action-icon {
  font-size: 60rpx;
  margin-bottom: 10rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.bank-services {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
}

.service-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
}

.service-item {
  background: #f8f9fa;
  border-radius: 15rpx;
  padding: 30rpx;
  text-align: center;
  border: 2rpx solid #e9ecef;
}

.service-icon {
  font-size: 50rpx;
  margin-bottom: 15rpx;
  display: block;
}

.service-name {
  font-size: 28rpx;
  color: #555;
}
</style>
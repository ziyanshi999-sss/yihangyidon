<template>
  <view class="home-container">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <text class="icon-search">🔍</text>
        <text class="search-text">热门资讯</text>
      </view>
      <view class="header-icons">
        <text class="icon">📱</text>
        <text class="icon">👥</text>
        <text class="icon">✉️</text>
      </view>
    </view>

    <!-- 广告横幅 -->
    <view class="banner">
      <text class="banner-text">您有5元掌银支付立减金</text>
      <button class="banner-btn">去查看</button>
    </view>

    <!-- 主要功能区 -->
    <view class="function-area">
      <view class="function-grid">
        <view class="function-item" @click="handleAccountClick">
          <view class="function-icon icon-account">👤</view>
          <text class="function-text">我的账户</text>
        </view>
        <view class="function-item" @click="handleTransferClick">
          <view class="function-icon icon-transfer">↔️</view>
          <text class="function-text">转账</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-balance">📊</view>
          <text class="function-text">收支</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-scan">🔍</view>
          <text class="function-text">扫一扫</text>
        </view>
      </view>

      <view class="function-grid">
        <view class="function-item">
          <view class="function-icon icon-card">💳</view>
          <text class="function-text">信用卡</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-deposit">💰</view>
          <text class="function-text">存款</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-activity">🎉</view>
          <text class="function-text">热门活动</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-branch">🏦</view>
          <text class="function-text">网点查询</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-electronic">📱</view>
          <text class="function-text">开通电子</text>
        </view>
      </view>

      <view class="function-grid">
        <view class="function-item">
          <view class="function-icon icon-loan">💸</view>
          <text class="function-text">贷款</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-topup">📱</view>
          <text class="function-text">手机充值</text>
        </view>
        <view class="function-item">
          <view class="function-icon icon-more">•••</view>
          <text class="function-text">全部</text>
        </view>
      </view>
    </view>

    <!-- 待办事项 -->
    <view class="todo-section">
      <text class="section-title">待办</text>
      <text class="todo-content">快来试试智能提醒吧~</text>
      <text class="arrow-right">➡️</text>
    </view>

    <!-- 头条新闻 -->
    <view class="news-section">
      <text class="section-title">头条</text>
      <text class="news-content">中信建投：REITs市场拐点已至 看好后...</text>
      <text class="arrow-right">➡️</text>
    </view>

    <!-- 轮播图 -->
    <view class="swiper-container">
      <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
        <swiper-item>
          <view class="swiper-item">
            <image src="https://thafd.bing.com/th/id/OIP.h5Dnm2eV7jzm2z8-1ig0iAHaDJ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">信用卡优惠活动</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image src="https://thafd.bing.com/th/id/OIP.ShhOt-72lWZa7qJGwxoRBwHaDs?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">新客专享礼遇</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image src="https://thafd.bing.com/th/id/OIP.Qasbo_B7CgQZgQbJZQs43QHaCI?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">理财知识讲座</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 广告区域 -->
    <view class="ad-section">
      <view class="ad-content">
        <text class="ad-title">一键绑卡</text>
        <text class="ad-desc">美好生活 乐享便捷支付</text>
        <button class="ad-btn">GO</button>
      </view>
    </view>

    <!-- 热门活动 -->
    <view class="hot-activities">
      <text class="activities-title">热门活动</text>
      <text class="arrow-right">➡️</text>
    </view>

    <!-- 活动卡片 -->
    <view class="activity-cards">
      <view class="activity-card">
        <text class="card-title">星级福利</text>
        <text class="card-desc">月度福利领取活动</text>
      </view>
      <view class="activity-card">
        <text class="card-title">超多彩品牌优惠券</text>
        <text class="card-desc">折扣低至5.5折</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: true, // 默认已登录
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 处理转账按钮点击事件
    handleTransferClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到转账页面
        uni.navigateTo({
          url: '/pages/transfer/transfer'
        })
      } else {
        // 未登录，显示登录弹窗
        this.$refs.loginPopup.open()
      }
    },
    
    // 处理我的账户点击事件
    handleAccountClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到账户页面
        uni.navigateTo({
          url: '/pages/account/account'
        })
      } else {
        // 未登录，显示登录弹窗
        this.$refs.loginPopup.open()
      }
    },
    
    // 关闭登录弹窗
    closeLoginPopup() {
      this.$refs.loginPopup.close()
    },
    
    // 登录处理
    login() {
      // 这里简化处理，实际项目中应该调用登录API
      if (this.loginForm.username && this.loginForm.password) {
        this.isLoggedIn = true
        this.$refs.loginPopup.close()
        
        // 保存用户登录状态
        uni.setStorageSync('userInfo', {
          username: this.loginForm.username
        })
      } else {
        uni.showToast({
          title: '请输入账号和密码',
          icon: 'none'
        })
      }
    }
  },
  
  // 页面加载时检查登录状态
  onLoad() {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) {
      this.isLoggedIn = true
    }
  }
}
</script>

<style scoped>
.home-container {
  padding-bottom: 60px; /* 为底部导航栏留出空间 */
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 顶部搜索栏 */
.search-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f9a825;
  border-bottom: 1px solid #e0e0e0;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 5px 15px;
  margin-right: 10px;
}

.icon-search {
  margin-right: 5px;
}

.search-text {
  color: #999;
}

.header-icons {
  display: flex;
  align-items: center;
}

.icon {
  margin-left: 15px;
  font-size: 20px;
}

/* 广告横幅 */
.banner {
  background-color: #f9a825;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.banner-text {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}

.banner-btn {
  background-color: #fff;
  color: #f9a825;
  border-radius: 20px;
  margin-top: 10px;
  padding: 5px 20px;
  font-size: 14px;
}

/* 功能区域 */
.function-area {
  background-color: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.function-grid {
  display: flex;
  margin-bottom: 20px;
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
}

.icon-account {
  background-color: #4caf50;
}

.icon-transfer {
  background-color: #ff9800;
}

.icon-balance {
  background-color: #4caf50;
}

.icon-scan {
  background-color: #ff9800;
}

.icon-card {
  background-color: #2196f3;
}

.icon-deposit {
  background-color: #ffeb3b;
}

.icon-activity {
  background-color: #e91e63;
}

.icon-branch {
  background-color: #9c27b0;
}

.icon-electronic {
  background-color: #00bcd4;
}

.icon-loan {
  background-color: #f44336;
}

.icon-topup {
  background-color: #03a9f4;
}

.icon-more {
  background-color: #795548;
}

.function-text {
  font-size: 14px;
  color: #333;
  margin-top: 5px;
}

/* 待办和新闻区域 */
.todo-section, .news-section {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.section-title {
  font-weight: bold;
  margin-right: 10px;
  color: #333;
}

.todo-content, .news-content {
  flex: 1;
  color: #666;
  font-size: 14px;
}

.arrow-right {
  color: #ccc;
}

/* 轮播图样式 */
.swiper-container {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.swiper {
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
}

.swiper-item {
  height: 100%;
  position: relative;
}

.swiper-image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.swiper-desc {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

/* 广告区域 */
.ad-section {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.ad-content {
  background-color: #f9f0e0;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ad-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.ad-desc {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.ad-btn {
  background-color: #ff6b00;
  color: #fff;
  border-radius: 5px;
  padding: 5px 15px;
  font-size: 14px;
}

/* 热门活动 */
.hot-activities {
  background-color: #fff;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.activities-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 活动卡片 */
.activity-cards {
  display: flex;
  padding: 0 15px 15px;
  gap: 10px;
}

.activity-card {
  flex: 1;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.card-desc {
  font-size: 12px;
  color: #666;
}

/* 登录弹窗样式 */
.login-popup {
  width: 80%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-bottom: 20px;
}

.popup-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  margin-bottom: 15px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.popup-btn {
  flex: 1;
  margin: 0 5px;
  border-radius: 5px;
}

.cancel-btn {
  background-color: #f8f8f8;
  color: #333;
}

.confirm-btn {
  background-color: #ff6b00;
  color: #fff;
}
</style>
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
        <view class="function-item" @click="handleBalanceClick">
          <view class="function-icon icon-balance">📊</view>
          <text class="function-text">收支</text>
        </view>
        <view class="function-item" v-if="showMoreFunctions" @click="handleScanClick">
          <view class="function-icon icon-scan">🔍</view>
          <text class="function-text">扫一扫</text>
        </view>
      </view>

      <view class="function-grid">
        <view class="function-item" v-if="showMoreFunctions" @click="handleCreditCardClick">
          <view class="function-icon icon-card">💳</view>
          <text class="function-text">信用卡</text>
        </view>
        <view class="function-item" v-if="showMoreFunctions">
          <view class="function-icon icon-deposit">💰</view>
          <text class="function-text">存款</text>
        </view>
        <view class="function-item" @click="scrollToHotActivities">
          <view class="function-icon icon-activity">🎉</view>
          <text class="function-text">热门活动</text>
        </view>
        <view class="function-item" v-if="showMoreFunctions">
          <view class="function-icon icon-branch">🏦</view>
          <text class="function-text">网点查询</text>
        </view>
        <view class="function-item" v-if="showMoreFunctions">
          <view class="function-icon icon-electronic">📱</view>
          <text class="function-text">开通电子</text>
        </view>
      </view>

      <view class="function-grid">
        <view class="function-item" v-if="showMoreFunctions" @click="handleLoanClick">
          <view class="function-icon icon-loan">💸</view>
          <text class="function-text">贷款</text>
        </view>
        <view class="function-item" @click="handleRechargeClick">
          <view class="function-icon icon-topup">📱</view>
          <text class="function-text">手机充值</text>
        </view>
        <view class="function-item" @click="handleServiceClick">
          <view class="function-icon icon-service">💬</view>
          <text class="function-text">在线客服</text>
        </view>
        <view class="function-item" @click="toggleMoreFunctions">
          <view class="function-icon icon-more">•••</view>
          <text class="function-text">{{ showMoreFunctions ? '收起' : '全部' }}</text>
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

    <!-- 热门活动 (添加id) -->
    <view id="hot-activities-section" class="hot-activities">
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
import { forceCheckLogin } from '@/utils/auth.js'

export default {
  data() {
    return {
      isLoggedIn: false,
      showMoreFunctions: false // 控制更多功能按钮的显示/隐藏
    }
  },
  
  // 页面加载时检查登录状态
  onLoad() {
    this.checkLoginStatus()
  },
  
  // 页面显示时检查登录状态
  onShow() {
    this.checkLoginStatus()
  },
  
  // 在methods对象中添加缺失的scrollToHotActivities方法
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      if (!forceCheckLogin()) {
        console.log('首页：用户未登录，跳转到登录页面')
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
        return
      }
      this.isLoggedIn = true
    },

    // 处理转账按钮点击事件
    handleTransferClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到转账页面
        uni.navigateTo({
          url: '/pages/transfer/transfer'
        })
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
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
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 处理信用卡点击
    handleCreditCardClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到信用卡页面
        uni.navigateTo({
          url: '/pages/credit-card/credit-card'
        })
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 处理收支点击
    handleBalanceClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到收支页面
        uni.navigateTo({
          url: '/pages/balance/balance'
        })
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 处理贷款点击
    handleLoanClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到贷款页面
        uni.navigateTo({
          url: '/pages/loan/loan'
        })
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 处理手机充值点击
    handleRechargeClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到手机充值页面
        uni.navigateTo({
          url: '/pages/recharge/recharge'
        })
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 处理客服点击
    handleServiceClick() {
      // 直接跳转到AI客服页面，无需登录检查
      uni.navigateTo({
        url: '/pages/service/chat'
      })
    },
    
    // 处理扫一扫点击 - 完善后的实现
    handleScanClick() {
      // 检查是否登录
      if (!this.isLoggedIn) {
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
        return
      }
      
      // 调用uni-app的扫码API
      uni.scanCode({
        // 允许的扫码类型：barCode（一维码）和qrCode（二维码）
        scanType: ['barCode', 'qrCode'],
        // 是否显示闪光灯按钮
        showFlash: true,
        // 成功扫码的回调
        success: (res) => {
          console.log('扫码结果：', res)
          
          // 解析扫码结果
          const result = res.result
          
          // 这里可以根据扫码结果做不同的处理
          // 例如，如果是URL则打开链接，如果是支付码则处理支付等
          if (result.startsWith('http')) {
            // 打开网页链接
            uni.showModal({
              title: '打开链接',
              content: `确定要打开链接: ${result} 吗？`,
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  // 在外部浏览器打开链接
                  uni.openURL({
                    url: result
                  })
                }
              }
            })
          } else if (result.includes('payment')) {
            // 处理支付相关扫码
            uni.showModal({
              title: '支付确认',
              content: '检测到支付码，是否继续？',
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  // 这里可以跳转到支付页面或处理支付逻辑
                  uni.showToast({
                    title: '正在处理支付',
                    icon: 'loading'
                  })
                  // 实际项目中这里会有更多支付相关的逻辑
                }
              }
            })
          } else {
            // 其他类型的扫码结果，直接显示
            uni.showModal({
              title: '扫码结果',
              content: result,
              showCancel: false
            })
          }
        },
        // 扫码失败的回调
        fail: (err) => {
          console.error('扫码失败：', err)
          // 如果用户取消扫码，不显示错误提示
          if (err.errMsg !== 'scanCode:fail cancel') {
            uni.showToast({
              title: '扫码失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    
    // 切换更多功能的显示/隐藏
    toggleMoreFunctions() {
      this.showMoreFunctions = !this.showMoreFunctions
    },
    
    // 新增：滚动到热门活动区域
    scrollToHotActivities() {
      // 使用uni-app的查询API选择目标元素
      uni.createSelectorQuery().select('#hot-activities-section').boundingClientRect((rect) => {
        // 获取元素的顶部位置
        const top = rect.top
        // 滚动到指定位置
        uni.pageScrollTo({
          scrollTop: top,
          duration: 300 // 滚动动画持续时间（毫秒）
        })
      }).exec()
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
</style>
<template>
  <view class="home-container" @click="closeSearchSuggestions">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar" @click.stop="handleSearchClick">
        <text class="icon-search">🔍</text>
        <text class="search-text">热门资讯</text>
      </view>
      <view class="header-icons">
        <text class="icon" @click.stop="showFeatureTip('消息')">📱</text>
        <text class="icon" @click.stop="showFeatureTip('联系人')">👥</text>
        <text class="icon" @click.stop="showFeatureTip('通知')">✉️</text>
      </view>
    </view>

    <!-- 搜索建议弹窗 -->
    <view v-if="showSearchSuggestions" class="search-suggestions" @click.stop>
      <view class="suggestion-item" @click="handleAccountClick">
        <text>我的账户</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleTransferClick">
        <text>转账</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleBalanceClick">
        <text>收支</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleCreditCardClick">
        <text>信用卡</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleLoanClick">
        <text>贷款</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleScanClick">
        <text>扫一扫</text>
        <text class="arrow-right">→</text>
      </view>
      <view class="suggestion-item" @click="handleRechargeClick">
        <text>手机充值</text>
        <text class="arrow-right">→</text>
      </view>
    </view>

    <!-- 广告横幅 -->
    <view class="banner">
      <text class="banner-text">欢迎来到农业银行</text>
    </view>

    <!-- 主要功能区 - 优化后的布局 -->
    <view class="function-area">
      <!-- 第一行：3个按钮 -->
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
      </view>

      <!-- 第二行：3个按钮 -->
      <view class="function-grid">
        <view class="function-item" @click="handleCreditCardClick">
          <view class="function-icon icon-card">💳</view>
          <text class="function-text">信用卡</text>
        </view>
        <view class="function-item" @click="scrollToHotActivities">
          <view class="function-icon icon-activity">🎉</view>
          <text class="function-text">热门活动</text>
        </view>
        <view class="function-item" @click="toggleMoreFunctions">
          <view class="function-icon icon-more">•••</view>
          <text class="function-text">{{ showMoreFunctions ? '收起' : '全部' }}</text>
        </view>
      </view>

      <!-- 点击全部后显示的按钮区域 -->
      <view class="more-functions" v-if="showMoreFunctions">
        <view class="function-grid">
          <view class="function-item" @click="handleScanClick">
            <view class="function-icon icon-scan">🔍</view>
            <text class="function-text">扫一扫</text>
          </view>
          <view class="function-item" @click="showFeatureTip('存款')">
            <view class="function-icon icon-deposit">💰</view>
            <text class="function-text">存款</text>
          </view>
          <view class="function-item" @click="showFeatureTip('网点查询')">
            <view class="function-icon icon-branch">🏦</view>
            <text class="function-text">网点查询</text>
          </view>
        </view>
        
        <view class="function-grid">
          <view class="function-item" @click="handleLoanClick">
            <view class="function-icon icon-loan">💸</view>
            <text class="function-text">贷款</text>
          </view>
          <view class="function-item" @click="handleRechargeClick">
            <view class="function-icon icon-topup">📱</view>
            <text class="function-text">手机充值</text>
          </view>
          <view class="function-item" @click="showFeatureTip('纪念币预约')">
            <view class="function-icon icon-coin">🪙</view>
            <text class="function-text">纪念币预约</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 其余内容保持不变 -->
    <view class="todo-section" @click="showFeatureTip('待办')">
      <text class="section-title">待办</text>
      <text class="todo-content">快来试试智能提醒吧~</text>
      <text class="arrow-right">➡️</text>
    </view>

    <!-- 头条新闻 -->
    <view class="news-section" @click="showFeatureTip('新闻')">
      <text class="section-title">头条</text>
      <text class="news-content">中信建投：REITs市场拐点已至 看好后...</text>
      <text class="arrow-right">➡️</text>
    </view>

    <!-- 轮播图 -->
    <view class="swiper-container">
      <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
        <swiper-item>
          <view class="swiper-item">
            <image src="https://img95.699pic.com/xsj/0s/zy/o6.jpg!/fh/300" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">信用卡优惠活动</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image src="https://img95.699pic.com/xsj/0s/4k/2x.jpg!/fh/300" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">新客专享礼遇</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image src="https://img95.699pic.com/xsj/0s/2p/t4.jpg!/fh/300" class="swiper-image" mode="aspectFill"></image>
            <text class="swiper-desc">理财知识讲座</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 广告区域 -->
    <view class="ad-section" @click="showFeatureTip('一键绑卡')">
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
      <view class="activity-card" @click="showFeatureTip('星级福利')">
        <text class="card-title">星级福利</text>
        <text class="card-desc">月度福利领取活动</text>
      </view>
      <view class="activity-card" @click="showFeatureTip('品牌优惠券')">
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
      showMoreFunctions: false,
      showSearchSuggestions: false // 控制搜索建议的显示/隐藏
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
    
    // 新增：处理搜索框点击事件
    handleSearchClick() {
      this.showSearchSuggestions = true
    },
    
    // 新增：点击其他区域关闭搜索建议
    closeSearchSuggestions() {
      this.showSearchSuggestions = false
    },
    
    // 新增：显示功能开发提示
    showFeatureTip(featureName) {
      uni.showToast({
        title: `${featureName}功能开发中`,
        icon: 'none',
        duration: 2000
      })
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
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

/* 功能区域 */
.function-area {
  background-color: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.function-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.function-grid:last-child {
  margin-bottom: 0;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%; /* 确保一行显示3个按钮 */
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.function-item:active {
  background-color: #f5f5f5;
  transform: scale(0.95);
}

.function-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 8px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 优化各个图标背景色 */
.icon-account { background-color: #2196f3; }
.icon-transfer { background-color: #4caf50; }
.icon-balance { background-color: #ff9800; }
.icon-scan { background-color: #9c27b0; }
.icon-card { background-color: #f44336; }
.icon-deposit { background-color: #00bcd4; }
.icon-activity { background-color: #ffeb3b; color: #333; }
.icon-branch { background-color: #795548; }
.icon-electronic { background-color: #673ab7; }
.icon-loan { background-color: #e91e63; }
.icon-topup { background-color: #009688; }
.icon-more { background-color: #607d8b; }
.icon-coin { background-color: #ff9800; }

.function-text {
  font-size: 14px;
  color: #333;
  margin-top: 8px;
  font-weight: 500;
}

/* 优化广告横幅样式 */
.banner {
  background: linear-gradient(135deg, #f9a825 0%, #ffb74d 100%);
  padding: 20px 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.banner-text {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 优化搜索栏样式 */
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 25px;
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-bar:active {
  background-color: #f5f5f5;
}

/* 优化搜索建议样式 */
.search-suggestions {
  position: absolute;
  top: 60px;
  left: 15px;
  right: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.arrow-right {
  color: #999;
  font-size: 14px;
}

/* 其他样式保持不变 */
.todo-section,
.news-section {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.todo-content,
.news-content {
  flex: 1;
  margin: 0 10px;
  color: #666;
}

.swiper-container {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
}

.swiper {
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.swiper-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.swiper-desc {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 4px;
}

.ad-section {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
}

.ad-content {
  background-color: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ad-title {
  font-size: 16px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 5px;
}

.ad-desc {
  font-size: 14px;
  color: #64b5f6;
  margin-bottom: 10px;
}

.ad-btn {
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
}

.hot-activities {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activities-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.activity-cards {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 15px;
}

.activity-card {
  width: 48%;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.card-desc {
  font-size: 14px;
  color: #666;
}

/* 更多功能区域 */
.more-functions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}
</style>
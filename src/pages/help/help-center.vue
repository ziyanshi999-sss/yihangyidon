<template>
  <view class="help-center">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input class="search-input" placeholder="搜索帮助内容" v-model="searchKeyword" @input="onSearch" />
      </view>
    </view>

    <!-- 快速入口 -->
    <view class="quick-entries">
      <view class="section-title">快速入口</view>
      <view class="entry-grid">
        <view class="entry-item" @click="goToSection('account')">
          <view class="entry-icon">👤</view>
          <text class="entry-text">账户管理</text>
        </view>
        <view class="entry-item" @click="goToSection('transfer')">
          <view class="entry-icon">↔️</view>
          <text class="entry-text">转账汇款</text>
        </view>
        <view class="entry-item" @click="goToSection('ebank')">
          <view class="entry-icon">📱</view>
          <text class="entry-text">电子银行</text>
        </view>
        <view class="entry-item" @click="goToSection('security')">
          <view class="entry-icon">🔒</view>
          <text class="entry-text">安全设置</text>
        </view>
      </view>
    </view>

    <!-- 帮助内容列表 -->
    <view class="help-content">
      <!-- 账户管理 -->
      <view class="help-section" id="account">
        <view class="section-header">
          <text class="section-title">账户管理</text>
          <text class="section-subtitle">账户相关操作指南</text>
        </view>
        <view class="help-list">
          <view class="help-item" @click="openHelpDetail('account-loss')">
            <view class="help-icon">🚨</view>
            <view class="help-info">
              <text class="help-title">银行卡挂失</text>
              <text class="help-desc">如何快速挂失银行卡，保护资金安全</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('password-change')">
            <view class="help-icon">🔑</view>
            <view class="help-info">
              <text class="help-title">密码修改</text>
              <text class="help-desc">修改登录密码、支付密码操作步骤</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('account-query')">
            <view class="help-icon">📊</view>
            <view class="help-info">
              <text class="help-title">账户查询</text>
              <text class="help-desc">查询账户余额、交易明细等信息</text>
            </view>
            <text class="help-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 转账汇款 -->
      <view class="help-section" id="transfer">
        <view class="section-header">
          <text class="section-title">转账汇款</text>
          <text class="section-subtitle">资金转账操作指南</text>
        </view>
        <view class="help-list">
          <view class="help-item" @click="openHelpDetail('phone-transfer')">
            <view class="help-icon">📱</view>
            <view class="help-info">
              <text class="help-title">手机号转账</text>
              <text class="help-desc">通过手机号码快速转账操作流程</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('quick-transfer')">
            <view class="help-icon">⚡</view>
            <view class="help-info">
              <text class="help-title">快捷转账</text>
              <text class="help-desc">常用收款人快速转账设置</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('cross-bank')">
            <view class="help-icon">🏦</view>
            <view class="help-info">
              <text class="help-title">跨行转账</text>
              <text class="help-desc">跨行资金归集操作步骤</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('transfer-limit')">
            <view class="help-icon">📋</view>
            <view class="help-info">
              <text class="help-title">转账限额</text>
              <text class="help-desc">了解各类转账限额设置</text>
            </view>
            <text class="help-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 电子银行 -->
      <view class="help-section" id="ebank">
        <view class="section-header">
          <text class="section-title">电子银行</text>
          <text class="section-subtitle">网银和掌银操作指南</text>
        </view>
        <view class="help-list">
          <view class="help-item" @click="openHelpDetail('mobile-bank')">
            <view class="help-icon">📱</view>
            <view class="help-info">
              <text class="help-title">掌上银行</text>
              <text class="help-desc">掌上银行注册、登录、功能使用</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('online-bank')">
            <view class="help-icon">💻</view>
            <view class="help-info">
              <text class="help-title">个人网银</text>
              <text class="help-desc">网上银行开通和使用指南</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('electronic-receipt')">
            <view class="help-icon">📄</view>
            <view class="help-info">
              <text class="help-title">电子回单</text>
              <text class="help-desc">电子回单查询和验证方法</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('fund-collection')">
            <view class="help-icon">💰</view>
            <view class="help-info">
              <text class="help-title">资金归集</text>
              <text class="help-desc">跨行资金归集设置和操作</text>
            </view>
            <text class="help-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 安全设置 -->
      <view class="help-section" id="security">
        <view class="section-header">
          <text class="section-title">安全设置</text>
          <text class="section-subtitle">账户安全保护指南</text>
        </view>
        <view class="help-list">
          <view class="help-item" @click="openHelpDetail('fingerprint')">
            <view class="help-icon">👆</view>
            <view class="help-info">
              <text class="help-title">指纹登录</text>
              <text class="help-desc">设置和使用指纹登录功能</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('face-id')">
            <view class="help-icon">👤</view>
            <view class="help-info">
              <text class="help-title">人脸识别</text>
              <text class="help-desc">人脸识别登录设置方法</text>
            </view>
            <text class="help-arrow">></text>
          </view>
          <view class="help-item" @click="openHelpDetail('sms-verify')">
            <view class="help-icon">📲</view>
            <view class="help-info">
              <text class="help-title">短信验证</text>
              <text class="help-desc">短信验证码接收和验证</text>
            </view>
            <text class="help-arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-service">
      <view class="contact-card" @click="goToAIService">
        <view class="contact-icon">💬</view>
        <view class="contact-info">
          <text class="contact-title">需要更多帮助？</text>
          <text class="contact-desc">联系AI智能客服，24小时在线为您服务</text>
        </view>
        <text class="contact-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      helpSections: [
        { id: 'account', title: '账户管理' },
        { id: 'transfer', title: '转账汇款' },
        { id: 'ebank', title: '电子银行' },
        { id: 'security', title: '安全设置' }
      ]
    }
  },
  methods: {
    // 搜索功能
    onSearch() {
      // 这里可以实现搜索逻辑
      console.log('搜索关键词:', this.searchKeyword)
    },
    
    // 跳转到指定章节
    goToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    
    // 打开帮助详情
    openHelpDetail(helpId) {
      // 跳转到帮助详情页面
      uni.navigateTo({
        url: `/pages/help/help-detail?helpId=${helpId}`
      })
    },
    
    // 跳转到AI客服
    goToAIService() {
      uni.navigateTo({
        url: '/pages/service/chat'
      })
    }
  }
}
</script>

<style scoped>
.help-center {
  background: #f5f7fb;
  min-height: 100vh;
}

/* 搜索栏 */
.search-header {
  background: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 25rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #999;
  margin-right: 15rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* 快速入口 */
.quick-entries {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 20rpx;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
  border-radius: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.entry-item:active {
  transform: scale(0.95);
  background: #e9ecef;
}

.entry-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.entry-text {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}

/* 帮助内容 */
.help-content {
  padding: 0 20rpx;
}

.help-section {
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.section-header {
  padding: 30rpx;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: #fff;
}

.section-subtitle {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 8rpx;
}

.help-list {
  padding: 0;
}

.help-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.help-item:last-child {
  border-bottom: none;
}

.help-item:active {
  background: #f8f9fa;
}

.help-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
  width: 60rpx;
  text-align: center;
}

.help-info {
  flex: 1;
}

.help-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.help-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.help-arrow {
  font-size: 32rpx;
  color: #ccc;
  margin-left: 15rpx;
}

/* 联系客服 */
.contact-service {
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.contact-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  color: #fff;
  transition: transform 0.3s ease;
}

.contact-card:active {
  transform: scale(0.98);
}

.contact-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.contact-info {
  flex: 1;
}

.contact-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.contact-desc {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
  line-height: 1.4;
}

.contact-arrow {
  font-size: 32rpx;
  margin-left: 15rpx;
}
</style>

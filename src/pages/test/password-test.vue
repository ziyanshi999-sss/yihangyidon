<template>
  <view class="password-test-page">
    <view class="header">
      <text class="title">交易密码测试</text>
    </view>
    
    <view class="content">
      <view class="user-info">
        <text class="label">当前用户:</text>
        <text class="value">{{ userInfo.username || '未登录' }}</text>
      </view>
      
      <view class="user-info">
        <text class="label">用户ID:</text>
        <text class="value">{{ userInfo.id || 'N/A' }}</text>
      </view>
      
      <view class="user-info">
        <text class="label">交易密码:</text>
        <text class="value">{{ userInfo.transactionPassword || '未设置' }}</text>
      </view>
      
      <view class="user-info">
        <text class="label">余额:</text>
        <text class="value">¥{{ userInfo.balance || 0 }}</text>
      </view>
      
      <button class="test-btn" @tap="testPaymentModal">测试支付弹窗</button>
      
      <button class="test-btn" @tap="reloadUserData">重新加载用户数据</button>
    </view>
    
    <!-- 支付弹窗 -->
    <PaymentPasswordModal
      :visible="showPaymentModal"
      :amount="testAmount"
      :description="testDescription"
      @close="closePaymentModal"
      @payment-confirmed="handlePaymentConfirm"
    />
  </view>
</template>

<script>
import PaymentPasswordModal from '@/components/common/PaymentPasswordModal.vue'
import dataSync from '@/utils/data-sync.js'
import { getUserInfo } from '@/utils/auth.js'

export default {
  name: 'PasswordTestPage',
  components: {
    PaymentPasswordModal
  },
  data() {
    return {
      userInfo: {},
      showPaymentModal: false,
      testAmount: 100,
      testDescription: '测试交易'
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      console.log('开始加载用户信息...')
      
      // 尝试多种方式获取用户信息
      this.userInfo = dataSync.getCurrentUserInfo() || getUserInfo()
      
      if (!this.userInfo) {
        console.log('从本地存储获取用户信息失败，尝试从数据连接器加载...')
        const users = await dataSync.getUsersData()
        if (users && users.length > 0) {
          this.userInfo = users[0]
          console.log('从数据连接器加载用户信息成功:', this.userInfo)
        }
      }
      
      console.log('最终用户信息:', this.userInfo)
    },
    
    testPaymentModal() {
      this.showPaymentModal = true
    },
    
    closePaymentModal() {
      console.log('测试页面：关闭支付弹窗')
      this.showPaymentModal = false
    },
    
    handlePaymentConfirm(paymentData) {
      console.log('收到支付确认事件:', paymentData)
      console.log('支付确认成功')
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      })
      this.showPaymentModal = false
    },
    
    reloadUserData() {
      console.log('重新加载用户数据...')
      dataSync.syncAllDataToStorage()
      this.loadUserInfo()
      uni.showToast({
        title: '数据已重新加载',
        icon: 'success'
      })
    }
  }
}
</script>

<style scoped>
.password-test-page {
  padding: 40rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.content {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}

.user-info:last-child {
  border-bottom: none;
}

.label {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.test-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test-btn:active {
  opacity: 0.8;
  transform: translateY(2rpx);
}
</style>

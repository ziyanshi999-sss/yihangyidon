<template>
  <view class="sso-demo-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="header-title">SSO功能演示</text>
      <text class="header-subtitle">单点登录集成示例</text>
    </view>

    <!-- 认证状态卡片 -->
    <view class="status-card">
      <view class="card-header">
        <text class="card-title">认证状态</text>
        <view class="status-indicator" :class="statusClass">
          <text class="status-dot"></text>
          <text class="status-text">{{ statusText }}</text>
        </view>
      </view>
      
      <view class="card-content" v-if="!authLoading">
        <view v-if="isAuthenticated" class="user-info">
          <view class="user-avatar">
            <image :src="userAvatar" class="avatar-img" />
          </view>
          <view class="user-details">
            <text class="user-name">{{ userDisplayName }}</text>
            <text class="user-id">ID: {{ getUserId() }}</text>
            <text class="login-time">登录时间: {{ loginTime }}</text>
          </view>
        </view>
        
        <view v-else class="not-authenticated">
          <text class="not-auth-icon">🔒</text>
          <text class="not-auth-text">未登录</text>
          <button class="login-btn" @tap="goToLogin">去登录</button>
        </view>
      </view>
    </view>

    <!-- 权限测试 -->
    <view class="permissions-card" v-if="isAuthenticated">
      <view class="card-header">
        <text class="card-title">权限测试</text>
      </view>
      
      <view class="card-content">
        <view class="permission-list">
          <view 
            class="permission-item" 
            v-for="permission in testPermissions" 
            :key="permission.key"
          >
            <text class="permission-name">{{ permission.name }}</text>
            <view class="permission-status" :class="permission.hasPermission ? 'granted' : 'denied'">
              <text class="permission-icon">{{ permission.hasPermission ? '✅' : '❌' }}</text>
              <text class="permission-text">{{ permission.hasPermission ? '有权限' : '无权限' }}</text>
            </view>
            <button 
              class="test-btn" 
              :disabled="!permission.hasPermission"
              @tap="testPermission(permission)"
            >
              测试
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- SSO操作 -->
    <view class="actions-card">
      <view class="card-header">
        <text class="card-title">SSO操作</text>
      </view>
      
      <view class="card-content">
        <view class="action-grid">
          <button class="action-btn primary" @tap="checkAuthStatus">
            <text class="btn-icon">🔍</text>
            <text class="btn-text">检查认证状态</text>
          </button>
          
          <button class="action-btn secondary" @tap="refreshToken" v-if="isAuthenticated">
            <text class="btn-icon">🔄</text>
            <text class="btn-text">刷新Token</text>
          </button>
          
          <button class="action-btn warning" @tap="performLogout" v-if="isAuthenticated">
            <text class="btn-icon">🚪</text>
            <text class="btn-text">登出</text>
          </button>
          
          <button class="action-btn info" @tap="showUserInfo" v-if="isAuthenticated">
            <text class="btn-icon">👤</text>
            <text class="btn-text">用户信息</text>
          </button>
          
          <button class="action-btn success" @tap="testAPICall" v-if="isAuthenticated">
            <text class="btn-icon">📡</text>
            <text class="btn-text">测试API调用</text>
          </button>
          
          <button class="action-btn danger" @tap="simulateTokenExpiry" v-if="isAuthenticated">
            <text class="btn-icon">⏰</text>
            <text class="btn-text">模拟Token过期</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 跨应用通信测试 -->
    <view class="communication-card" v-if="isAuthenticated">
      <view class="card-header">
        <text class="card-title">跨应用通信</text>
      </view>
      
      <view class="card-content">
        <view class="comm-section">
          <text class="section-title">发送消息到其他应用:</text>
          <view class="message-input">
            <input 
              class="input-field"
              v-model="testMessage"
              placeholder="输入测试消息"
            />
            <button class="send-btn" @tap="sendCrossAppMessage">发送</button>
          </view>
        </view>
        
        <view class="comm-section">
          <text class="section-title">接收到的消息:</text>
          <view class="message-list">
            <view 
              class="message-item" 
              v-for="(message, index) in receivedMessages" 
              :key="index"
            >
              <text class="message-time">{{ message.time }}</text>
              <text class="message-content">{{ message.content }}</text>
            </view>
            <text v-if="receivedMessages.length === 0" class="no-messages">暂无消息</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 调试信息 -->
    <view class="debug-card">
      <view class="card-header">
        <text class="card-title">调试信息</text>
        <button class="toggle-btn" @tap="showDebug = !showDebug">
          {{ showDebug ? '隐藏' : '显示' }}
        </button>
      </view>
      
      <view class="card-content" v-if="showDebug">
        <view class="debug-section">
          <text class="debug-label">Token信息:</text>
          <text class="debug-value">{{ tokenInfo }}</text>
        </view>
        
        <view class="debug-section">
          <text class="debug-label">用户权限:</text>
          <text class="debug-value">{{ JSON.stringify(userPermissions, null, 2) }}</text>
        </view>
        
        <view class="debug-section">
          <text class="debug-label">设备信息:</text>
          <text class="debug-value">{{ JSON.stringify(deviceInfo, null, 2) }}</text>
        </view>
        
        <view class="debug-section">
          <text class="debug-label">SSO配置:</text>
          <text class="debug-value">{{ JSON.stringify(ssoConfig, null, 2) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ssoMixin from '@/mixins/sso-mixin.js'

export default {
  name: 'SSODemo',
  mixins: [ssoMixin],
  
  data() {
    return {
      loginTime: '',
      testPermissions: [
        { key: 'admin', name: '管理员权限', hasPermission: false },
        { key: 'user.security', name: '安全设置', hasPermission: false },
        { key: 'loan.apply', name: '贷款申请', hasPermission: false },
        { key: 'wealth.premium', name: '高端理财', hasPermission: false },
        { key: 'transfer.send', name: '转账权限', hasPermission: false }
      ],
      testMessage: '',
      receivedMessages: [],
      showDebug: false,
      deviceInfo: {},
      ssoConfig: {}
    }
  },
  
  computed: {
    statusClass() {
      if (this.authLoading) return 'loading'
      return this.isAuthenticated ? 'authenticated' : 'not-authenticated'
    },
    
    statusText() {
      if (this.authLoading) return '验证中...'
      return this.isAuthenticated ? '已认证' : '未认证'
    },
    
    tokenInfo() {
      if (!this.ssoClient) return 'N/A'
      
      const token = this.ssoClient.getToken()
      if (!token) return '无Token'
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return JSON.stringify({
          userId: payload.userId,
          username: payload.username,
          exp: new Date(payload.exp * 1000).toLocaleString(),
          iat: new Date(payload.iat * 1000).toLocaleString()
        }, null, 2)
      } catch (error) {
        return 'Token解析失败'
      }
    }
  },
  
  async mounted() {
    await this.initDemo()
  },
  
  methods: {
    async initDemo() {
      // 记录登录时间
      if (this.isAuthenticated) {
        this.loginTime = new Date().toLocaleString()
        await this.loadPermissions()
      }
      
      // 获取设备信息
      this.deviceInfo = this.getDeviceInfo()
      
      // 获取SSO配置
      this.ssoConfig = {
        authServerUrl: this.getAuthServerUrl(),
        appId: 'bank-mobile-app'
      }
      
      // 设置跨应用消息监听
      this.setupMessageListener()
    },
    
    async loadPermissions() {
      for (const permission of this.testPermissions) {
        permission.hasPermission = await this.checkPermission(permission.key)
      }
    },
    
    async checkAuthStatus() {
      uni.showLoading({ title: '检查中...' })
      
      try {
        await this.checkAuthenticationStatus()
        
        uni.hideLoading()
        uni.showToast({
          title: this.isAuthenticated ? '认证有效' : '未认证',
          icon: this.isAuthenticated ? 'success' : 'error'
        })
        
        if (this.isAuthenticated) {
          this.loginTime = new Date().toLocaleString()
          await this.loadPermissions()
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '检查失败',
          icon: 'error'
        })
      }
    },
    
    async refreshToken() {
      uni.showLoading({ title: '刷新中...' })
      
      try {
        const refreshed = await this.ssoClient.refreshToken()
        
        uni.hideLoading()
        
        if (refreshed) {
          uni.showToast({
            title: 'Token刷新成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: 'Token刷新失败',
            icon: 'error'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '刷新失败',
          icon: 'error'
        })
      }
    },
    
    async testPermission(permission) {
      const hasPermission = await this.requirePermission(permission.key, {
        message: `测试 ${permission.name} 权限`
      })
      
      if (hasPermission) {
        uni.showModal({
          title: '权限测试',
          content: `${permission.name} 权限验证通过！`,
          showCancel: false
        })
      }
    },
    
    async testAPICall() {
      uni.showLoading({ title: '调用API...' })
      
      try {
        const response = await this.makeAuthenticatedRequest('/api/user/profile')
        const result = await response.json()
        
        uni.hideLoading()
        
        uni.showModal({
          title: 'API调用结果',
          content: JSON.stringify(result, null, 2),
          showCancel: false
        })
      } catch (error) {
        uni.hideLoading()
        
        uni.showModal({
          title: 'API调用失败',
          content: error.message,
          showCancel: false
        })
      }
    },
    
    simulateTokenExpiry() {
      uni.showModal({
        title: '模拟Token过期',
        content: '这将清除当前Token并触发重新登录流程',
        success: (res) => {
          if (res.confirm) {
            this.ssoClient.clearAuthData()
            this.handleTokenExpired()
          }
        }
      })
    },
    
    showUserInfo() {
      const userInfo = this.getUserInfo()
      
      uni.showModal({
        title: '用户信息',
        content: JSON.stringify(userInfo, null, 2),
        showCancel: false
      })
    },
    
    goToLogin() {
      uni.navigateTo({
        url: '/pages/denglu/login'
      })
    },
    
    sendCrossAppMessage() {
      if (!this.testMessage.trim()) {
        uni.showToast({
          title: '请输入消息内容',
          icon: 'none'
        })
        return
      }
      
      this.ssoClient.notifyOtherApps('test_message', {
        message: this.testMessage,
        timestamp: Date.now()
      })
      
      uni.showToast({
        title: '消息已发送',
        icon: 'success'
      })
      
      this.testMessage = ''
    },
    
    setupMessageListener() {
      // 重写handleCrossAppMessage方法来接收测试消息
      const originalHandler = this.ssoClient.handleCrossAppMessage.bind(this.ssoClient)
      
      this.ssoClient.handleCrossAppMessage = (message) => {
        // 调用原始处理器
        originalHandler(message)
        
        // 处理测试消息
        if (message.action === 'test_message') {
          this.receivedMessages.unshift({
            time: new Date(message.data.timestamp).toLocaleString(),
            content: message.data.message
          })
          
          // 限制消息数量
          if (this.receivedMessages.length > 10) {
            this.receivedMessages = this.receivedMessages.slice(0, 10)
          }
        }
      }
    },
    
    getDeviceInfo() {
      // #ifdef APP-PLUS
      return {
        platform: 'app',
        model: plus.device.model,
        uuid: plus.device.uuid,
        version: plus.runtime.version
      }
      // #endif
      
      // #ifdef H5
      return {
        platform: 'h5',
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`
      }
      // #endif
      
      // #ifdef MP-WEIXIN
      const systemInfo = wx.getSystemInfoSync()
      return {
        platform: 'mp-weixin',
        model: systemInfo.model,
        version: systemInfo.version,
        system: systemInfo.system
      }
      // #endif
      
      return { platform: 'unknown' }
    }
  }
}
</script>

<style scoped>
.sso-demo-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.page-header {
  text-align: center;
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.header-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 10rpx;
}

.header-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.status-card,
.permissions-card,
.actions-card,
.communication-card,
.debug-card {
  background: white;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #fafbfc;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.status-indicator {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.status-indicator.authenticated {
  background: rgba(76, 175, 80, 0.1);
}

.status-indicator.not-authenticated {
  background: rgba(244, 67, 54, 0.1);
}

.status-indicator.loading {
  background: rgba(255, 193, 7, 0.1);
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.authenticated .status-dot {
  background: #4caf50;
}

.not-authenticated .status-dot {
  background: #f44336;
}

.loading .status-dot {
  background: #ffc107;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 24rpx;
  color: #666;
}

.card-content {
  padding: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.user-id,
.login-time {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.not-authenticated {
  text-align: center;
  padding: 40rpx 0;
}

.not-auth-icon {
  display: block;
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

.not-auth-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.login-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.permission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.permission-name {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.permission-status {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
}

.permission-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.permission-text {
  font-size: 24rpx;
}

.permission-status.granted .permission-text {
  color: #4caf50;
}

.permission-status.denied .permission-text {
  color: #f44336;
}

.test-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
}

.test-btn:disabled {
  background: #ccc;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  border-radius: 12rpx;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
}

.action-btn.secondary {
  background: linear-gradient(135deg, #9e9e9e, #757575);
  color: white;
}

.action-btn.warning {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
}

.action-btn.info {
  background: linear-gradient(135deg, #00bcd4, #0097a7);
  color: white;
}

.action-btn.success {
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
}

.action-btn.danger {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.btn-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.btn-text {
  font-size: 24rpx;
  text-align: center;
}

.comm-section {
  margin-bottom: 30rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 15rpx;
}

.message-input {
  display: flex;
  gap: 15rpx;
}

.input-field {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.send-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 0 30rpx;
  font-size: 26rpx;
}

.message-list {
  max-height: 300rpx;
  overflow-y: auto;
}

.message-item {
  padding: 15rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.message-time {
  display: block;
  font-size: 20rpx;
  color: #999;
  margin-bottom: 5rpx;
}

.message-content {
  font-size: 26rpx;
  color: #333;
}

.no-messages {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 30rpx;
}

.toggle-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
}

.debug-section {
  margin-bottom: 20rpx;
}

.debug-label {
  display: block;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.debug-value {
  font-size: 22rpx;
  color: #666;
  background: #f8f9fa;
  padding: 15rpx;
  border-radius: 8rpx;
  font-family: monospace;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>

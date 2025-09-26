<template>
  <view class="data-sync-demo">
    <view class="header">
      <text class="title">数据同步演示</text>
      <text class="subtitle">统一数据管理器测试页面</text>
    </view>

    <!-- 当前用户信息 -->
    <view class="user-info-card">
      <view class="card-header">
        <text class="card-title">当前用户信息</text>
        <button class="refresh-btn" @click="refreshUserData">刷新</button>
      </view>
      <view class="user-details">
        <text class="user-name">{{ currentUser.username || '未登录' }}</text>
        <text class="user-balance">余额: ¥{{ (currentUser.balance || 0).toFixed(2) }}</text>
        <text class="user-phone">手机: {{ currentUser.phone || '未设置' }}</text>
      </view>
    </view>

    <!-- 存款数据 -->
    <view class="data-card">
      <view class="card-header">
        <text class="card-title">存款数据</text>
        <button class="update-btn" @click="updateDepositData">更新</button>
      </view>
      <view class="data-content">
        <view class="data-item">
          <text class="data-label">活期存款:</text>
          <text class="data-value">¥{{ (depositData.current || 0).toLocaleString() }}</text>
        </view>
        <view class="data-item">
          <text class="data-label">定期存款:</text>
          <text class="data-value">¥{{ (depositData.fixed || 0).toLocaleString() }}</text>
        </view>
        <view class="data-item">
          <text class="data-label">智能存款:</text>
          <text class="data-value">¥{{ (depositData.smart || 0).toLocaleString() }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn primary" @click="simulateTransfer">模拟转账</button>
      <button class="action-btn secondary" @click="simulateDeposit">模拟存款</button>
      <button class="action-btn success" @click="simulateRecharge">模拟充值</button>
      <button class="action-btn warning" @click="switchUser">切换用户</button>
    </view>

    <!-- 数据变化日志 -->
    <view class="log-card">
      <view class="card-header">
        <text class="card-title">数据变化日志</text>
        <button class="clear-btn" @click="clearLogs">清空</button>
      </view>
      <view class="log-content">
        <view class="log-item" v-for="(log, index) in logs" :key="index">
          <text class="log-time">{{ log.time }}</text>
          <text class="log-message">{{ log.message }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import unifiedDataManager from '@/utils/unified-data-manager.js'

export default {
  data() {
    return {
      currentUser: {},
      depositData: {
        current: 0,
        fixed: 0,
        smart: 0
      },
      logs: []
    }
  },

  async onLoad() {
    await this.initDataManager()
    this.loadUserData()
    this.setupDataListener()
  },

  methods: {
    // 初始化数据管理器
    async initDataManager() {
      try {
        await unifiedDataManager.init()
        this.addLog('数据管理器初始化成功')
      } catch (error) {
        this.addLog('数据管理器初始化失败: ' + error.message)
      }
    },

    // 加载用户数据
    loadUserData() {
      this.currentUser = unifiedDataManager.getCurrentUser() || {}
      
      if (this.currentUser.wealthProducts && this.currentUser.wealthProducts.deposits) {
        this.depositData = {
          current: this.currentUser.wealthProducts.deposits.current || 0,
          fixed: this.currentUser.wealthProducts.deposits.fixed || 0,
          smart: this.currentUser.wealthProducts.deposits.smart || 0
        }
      }
      
      this.addLog(`加载用户数据: ${this.currentUser.username}`)
    },

    // 设置数据监听
    setupDataListener() {
      unifiedDataManager.onDataChange((data) => {
        this.addLog('收到数据更新事件')
        this.loadUserData()
      })
    },

    // 刷新用户数据
    refreshUserData() {
      this.loadUserData()
      this.addLog('手动刷新用户数据')
    },

    // 更新存款数据
    updateDepositData() {
      if (!this.currentUser.id) {
        this.addLog('请先选择用户')
        return
      }

      const newDepositData = {
        current: Math.floor(Math.random() * 50000) + 10000,
        fixed: Math.floor(Math.random() * 100000) + 20000,
        smart: Math.floor(Math.random() * 30000) + 5000
      }

      unifiedDataManager.updateUserData(this.currentUser.id, {
        wealthProducts: {
          ...this.currentUser.wealthProducts,
          deposits: newDepositData
        }
      })

      this.addLog('存款数据已更新')
    },

    // 模拟转账
    simulateTransfer() {
      if (!this.currentUser.id) {
        this.addLog('请先选择用户')
        return
      }

      const amount = Math.floor(Math.random() * 5000) + 1000
      const newBalance = (this.currentUser.balance || 0) - amount

      // 更新余额
      unifiedDataManager.updateBalance(this.currentUser.id, newBalance)

      // 添加转账记录
      const transferRecord = {
        id: 't' + Date.now(),
        type: 'outgoing',
        amount: amount,
        recipient: '测试收款人',
        recipientAccount: '6228480012345678900',
        description: '测试转账',
        status: 'completed',
        timestamp: new Date().toISOString(),
        fee: 2.5
      }

      unifiedDataManager.addTransferRecord(this.currentUser.id, transferRecord)

      this.addLog(`模拟转账: ¥${amount}`)
    },

    // 模拟存款
    simulateDeposit() {
      if (!this.currentUser.id) {
        this.addLog('请先选择用户')
        return
      }

      const amount = Math.floor(Math.random() * 20000) + 5000
      const depositType = ['current', 'fixed', 'smart'][Math.floor(Math.random() * 3)]

      unifiedDataManager.updateDepositData(this.currentUser.id, depositType, amount)
      this.addLog(`模拟存款: ${depositType} ¥${amount}`)
    },

    // 模拟充值
    simulateRecharge() {
      if (!this.currentUser.id) {
        this.addLog('请先选择用户')
        return
      }

      const amount = Math.floor(Math.random() * 200) + 50
      const rechargeRecord = {
        id: 'r' + Date.now(),
        phoneNumber: this.currentUser.phone,
        amount: amount,
        operator: '中国移动',
        status: 'completed',
        timestamp: new Date().toISOString()
      }

      unifiedDataManager.addRechargeRecord(this.currentUser.id, rechargeRecord)
      this.addLog(`模拟充值: ¥${amount}`)
    },

    // 切换用户
    switchUser() {
      const users = unifiedDataManager.getAllUsers()
      if (users.length > 1) {
        const currentIndex = users.findIndex(user => user.id === this.currentUser.id)
        const nextIndex = (currentIndex + 1) % users.length
        const nextUser = users[nextIndex]
        
        unifiedDataManager.setCurrentUser(nextUser.id)
        this.addLog(`切换到用户: ${nextUser.username}`)
      } else {
        this.addLog('只有一个用户，无法切换')
      }
    },

    // 添加日志
    addLog(message) {
      this.logs.unshift({
        time: new Date().toLocaleTimeString(),
        message: message
      })
      
      // 限制日志数量
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50)
      }
    },

    // 清空日志
    clearLogs() {
      this.logs = []
    }
  }
}
</script>

<style scoped>
.data-sync-demo {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
}

.user-info-card,
.data-card,
.log-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.refresh-btn,
.update-btn,
.clear-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.user-balance,
.user-phone {
  font-size: 26rpx;
  color: #666;
}

.data-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.data-item:last-child {
  border-bottom: none;
}

.data-label {
  font-size: 26rpx;
  color: #666;
}

.data-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-btn {
  flex: 1;
  min-width: 150rpx;
  padding: 20rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: bold;
}

.action-btn.primary {
  background: #007AFF;
  color: white;
}

.action-btn.secondary {
  background: #34C759;
  color: white;
}

.action-btn.success {
  background: #FF9500;
  color: white;
}

.action-btn.warning {
  background: #FF3B30;
  color: white;
}

.log-content {
  max-height: 400rpx;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 20rpx;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 22rpx;
  color: #999;
  min-width: 120rpx;
}

.log-message {
  font-size: 24rpx;
  color: #333;
  flex: 1;
}
</style>


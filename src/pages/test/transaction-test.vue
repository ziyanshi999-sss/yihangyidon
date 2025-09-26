<template>
  <view class="container">
    <view class="header">
      <text class="title">交易记录持久化测试</text>
    </view>
    
    <view class="test-section">
      <view class="section-title">当前交易记录 ({{ transactions.length }}条)</view>
      <view class="transaction-list">
        <view class="transaction-item" v-for="(transaction, index) in transactions.slice(0, 5)" :key="index">
          <view class="transaction-info">
            <text class="transaction-desc">{{ transaction.description }}</text>
            <text class="transaction-amount" :class="transaction.type">{{ transaction.type === 'income' ? '+' : '-' }}¥{{ transaction.amount }}</text>
          </view>
          <text class="transaction-time">{{ formatTime(transaction.timestamp) }}</text>
        </view>
      </view>
    </view>
    
    <view class="test-section">
      <view class="section-title">测试操作</view>
      <button @click="addIncomeTransaction" class="test-btn income-btn">添加收入记录</button>
      <button @click="addExpenseTransaction" class="test-btn expense-btn">添加支出记录</button>
      <button @click="addTransferTransaction" class="test-btn transfer-btn">添加转账记录</button>
      <button @click="checkDataConsistency" class="test-btn">检查数据一致性</button>
      <button @click="clearTransactions" class="test-btn danger-btn">清空交易记录</button>
    </view>
    
    <view class="test-section">
      <view class="section-title">测试结果</view>
      <view class="result-item" v-for="(result, index) in testResults" :key="index">
        <text class="result-text">{{ result }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <view class="section-title">操作说明</view>
      <view class="instruction">
        <text>1. 点击任意"添加"按钮创建交易记录</text>
        <text>2. 退出登录并重新登录</text>
        <text>3. 检查交易记录是否保持</text>
        <text>4. 查看控制台日志确认数据同步</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
import { addTransactionRecord } from '@/api/balance.js'
import dataSyncFix from '@/utils/data-sync-fix.js'

export default {
  name: 'TransactionTest',
  data() {
    return {
      transactions: [],
      testResults: []
    }
  },
  
  onLoad() {
    this.loadTransactions()
  },
  
  methods: {
    // 加载交易记录
    loadTransactions() {
      const userStore = useUserStore()
      const userInfo = userStore.state.userInfo
      if (userInfo && userInfo.transactionRecords) {
        this.transactions = userInfo.transactionRecords
        this.addResult('✅ 交易记录已加载: ' + this.transactions.length + '条')
      } else {
        this.transactions = []
        this.addResult('⚠️ 未找到交易记录')
      }
    },
    
    // 添加收入记录
    addIncomeTransaction() {
      const amount = Math.floor(Math.random() * 5000) + 1000
      const transaction = {
        type: 'income',
        amount: amount,
        description: '测试收入 - ' + new Date().toLocaleTimeString(),
        balance: (this.getCurrentBalance() || 0) + amount,
        timestamp: new Date().toISOString(),
        icon: '💰',
        title: '测试收入',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      addTransactionRecord(transaction)
      this.loadTransactions()
      this.addResult('✅ 收入记录已添加: ¥' + amount)
    },
    
    // 添加支出记录
    addExpenseTransaction() {
      const amount = Math.floor(Math.random() * 1000) + 100
      const transaction = {
        type: 'expense',
        amount: amount,
        description: '测试支出 - ' + new Date().toLocaleTimeString(),
        balance: (this.getCurrentBalance() || 0) - amount,
        timestamp: new Date().toISOString(),
        icon: '💳',
        title: '测试支出',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      addTransactionRecord(transaction)
      this.loadTransactions()
      this.addResult('✅ 支出记录已添加: ¥' + amount)
    },
    
    // 添加转账记录
    addTransferTransaction() {
      const amount = Math.floor(Math.random() * 2000) + 500
      const transaction = {
        type: 'expense',
        amount: amount,
        description: '测试转账 - 转给测试用户',
        balance: (this.getCurrentBalance() || 0) - amount,
        timestamp: new Date().toISOString(),
        icon: '💸',
        title: '测试转账',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      addTransactionRecord(transaction)
      this.loadTransactions()
      this.addResult('✅ 转账记录已添加: ¥' + amount)
    },
    
    // 检查数据一致性
    async checkDataConsistency() {
      try {
        const result = await dataSyncFix.ensureDataConsistency()
        this.addResult('✅ 数据一致性检查完成: ' + (result ? '通过' : '失败'))
        
        // 检查各个存储位置的数据
        const userInfo = uni.getStorageSync('userInfo')
        const userData = uni.getStorageSync('userData')
        const users = uni.getStorageSync('users')
        
        this.addResult('📊 存储状态: userInfo=' + (userInfo ? '有' : '无') + 
                      ', userData=' + (userData ? '有' : '无') + 
                      ', users=' + (users ? '有' : '无'))
      } catch (error) {
        this.addResult('❌ 数据一致性检查失败: ' + error.message)
      }
    },
    
    // 清空交易记录
    clearTransactions() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有交易记录吗？',
        success: (res) => {
          if (res.confirm) {
            const userStore = useUserStore()
            userStore.actions.updateUserInfo({ transactionRecords: [] })
            this.loadTransactions()
            this.addResult('✅ 交易记录已清空')
          }
        }
      })
    },
    
    // 获取当前余额
    getCurrentBalance() {
      const userStore = useUserStore()
      return userStore.state.userInfo?.balance || 0
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN')
    },
    
    // 添加测试结果
    addResult(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.testResults.unshift(`[${timestamp}] ${message}`)
      
      // 限制结果数量
      if (this.testResults.length > 15) {
        this.testResults = this.testResults.slice(0, 15)
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.test-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 5px;
}

.transaction-list {
  max-height: 300px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.transaction-info {
  flex: 1;
}

.transaction-desc {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.transaction-amount {
  font-size: 16px;
  font-weight: bold;
}

.transaction-amount.income {
  color: #52c41a;
}

.transaction-amount.expense {
  color: #ff4d4f;
}

.transaction-time {
  font-size: 12px;
  color: #999;
}

.test-btn {
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  margin: 5px;
  font-size: 14px;
  color: white;
}

.income-btn {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.expense-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
}

.transfer-btn {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.danger-btn {
  background: linear-gradient(135deg, #ff7a45 0%, #ffa940 100%);
}

.test-btn:active {
  opacity: 0.8;
}

.result-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.result-text {
  font-size: 14px;
  color: #333;
}

.instruction {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.instruction text {
  display: block;
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}
</style>

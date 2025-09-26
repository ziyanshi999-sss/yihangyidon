<template>
  <view class="container">
    <view class="header">
      <text class="title">数据持久化测试</text>
    </view>
    
    <view class="test-section">
      <view class="section-title">当前用户信息</view>
      <view class="info-item">
        <text class="label">用户名:</text>
        <text class="value">{{ userInfo.username || '未设置' }}</text>
      </view>
      <view class="info-item">
        <text class="label">手机号:</text>
        <text class="value">{{ userInfo.phone || '未设置' }}</text>
      </view>
      <view class="info-item">
        <text class="label">余额:</text>
        <text class="value">¥{{ userInfo.balance || 0 }}</text>
      </view>
      <view class="info-item">
        <text class="label">最后更新时间:</text>
        <text class="value">{{ userInfo.lastUpdateTime || '未知' }}</text>
      </view>
    </view>
    
    <view class="test-section">
      <view class="section-title">测试操作</view>
      <button @click="updateUserInfo" class="test-btn">修改用户信息</button>
      <button @click="updateBalance" class="test-btn">修改余额</button>
      <button @click="checkDataConsistency" class="test-btn">检查数据一致性</button>
      <button @click="forceSyncData" class="test-btn">强制同步数据</button>
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
        <text>1. 点击"修改用户信息"或"修改余额"按钮</text>
        <text>2. 退出登录并重新登录</text>
        <text>3. 检查数据是否保持修改后的状态</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
import dataSyncFix from '@/utils/data-sync-fix.js'

export default {
  name: 'DataPersistenceTest',
  data() {
    return {
      userInfo: {},
      testResults: []
    }
  },
  
  onLoad() {
    this.loadUserInfo()
  },
  
  methods: {
    // 加载用户信息
    loadUserInfo() {
      const userStore = useUserStore()
      this.userInfo = userStore.state.userInfo || {}
      this.addResult('✅ 用户信息已加载')
    },
    
    // 修改用户信息
    async updateUserInfo() {
      try {
        const userStore = useUserStore()
        const newInfo = {
          username: '测试用户' + Date.now(),
          phone: '138' + Math.random().toString().substr(2, 8),
          lastUpdateTime: new Date().toISOString()
        }
        
        userStore.actions.updateUserInfo(newInfo)
        this.userInfo = { ...this.userInfo, ...newInfo }
        
        this.addResult('✅ 用户信息已修改: ' + newInfo.username)
      } catch (error) {
        this.addResult('❌ 修改用户信息失败: ' + error.message)
      }
    },
    
    // 修改余额
    async updateBalance() {
      try {
        const userStore = useUserStore()
        const newBalance = Math.floor(Math.random() * 100000) + 50000
        
        userStore.actions.setBalance(newBalance)
        this.userInfo.balance = newBalance
        
        this.addResult('✅ 余额已修改为: ¥' + newBalance)
      } catch (error) {
        this.addResult('❌ 修改余额失败: ' + error.message)
      }
    },
    
    // 检查数据一致性
    async checkDataConsistency() {
      try {
        const result = await dataSyncFix.ensureDataConsistency()
        this.addResult('✅ 数据一致性检查完成: ' + (result ? '通过' : '失败'))
      } catch (error) {
        this.addResult('❌ 数据一致性检查失败: ' + error.message)
      }
    },
    
    // 强制同步数据
    async forceSyncData() {
      try {
        const result = await dataSyncFix.forceSyncAllData()
        this.addResult('✅ 强制同步完成: ' + (result ? '成功' : '失败'))
      } catch (error) {
        this.addResult('❌ 强制同步失败: ' + error.message)
      }
    },
    
    // 添加测试结果
    addResult(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.testResults.unshift(`[${timestamp}] ${message}`)
      
      // 限制结果数量
      if (this.testResults.length > 10) {
        this.testResults = this.testResults.slice(0, 10)
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

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}

.test-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  margin: 5px;
  font-size: 14px;
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

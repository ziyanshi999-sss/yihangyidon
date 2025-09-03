<template>
  <view class="history-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-title">转账记录</text>
    </view>

    <!-- 记录列表 -->
    <view class="history-list">
      <view v-if="transferRecords.length === 0" class="empty-state">
        <text class="empty-text">暂无转账记录</text>
      </view>
      <view v-else>
        <view class="record-item" v-for="record in transferRecords" :key="record.transactionId">
          <view class="record-header">
            <text class="record-title">{{ getRecordTitle(record) }}</text>
            <text class="record-status" :class="record.status">{{ record.status === 'success' ? '成功' : '失败' }}</text>
          </view>
          <view class="record-info">
            <text class="record-detail">{{ getRecordDetail(record) }}</text>
            <text class="record-amount">{{ record.status === 'success' ? '-' : '' }}{{ record.amount }}元</text>
          </view>
          <view class="record-footer">
            <text class="record-time">{{ formatTime(record.timestamp) }}</text>
            <text class="record-remark" v-if="record.remark">{{ record.remark }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'

export default {
  data() {
    return {
      transferRecords: []
    }
  },
  
  onShow() {
    // 检查登录状态
    if (!forceCheckLogin()) {
      console.log('转账记录页面：用户未登录，跳转到登录页面')
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
      return
    }
    
    // 加载转账记录
    this.loadTransferRecords()
  },
  
  methods: {
    // 加载转账记录
    loadTransferRecords() {
      // 从本地存储获取转账记录
      const records = uni.getStorageSync('transferRecords') || []
      this.transferRecords = records
      
      // 如果没有记录，创建一些模拟数据
      if (this.transferRecords.length === 0) {
        this.createMockRecords()
      }
    },
    
    // 创建模拟记录（如果没有真实记录）
    createMockRecords() {
      const mockRecords = [
        {
          type: 'account',
          account: '6228 **** **** 1234',
          name: '张三',
          amount: 500.00,
          remark: '饭钱',
          timestamp: Date.now() - 86400000, // 昨天
          status: 'success',
          transactionId: 'TX' + Date.now() + '001'
        },
        {
          type: 'phone',
          phone: '138 **** 5678',
          amount: 1000.00,
          remark: '房租',
          timestamp: Date.now() - 172800000, // 前天
          status: 'success',
          transactionId: 'TX' + Date.now() + '002'
        },
        {
          type: 'account',
          account: '6228 **** **** 5678',
          name: '李四',
          amount: 200.00,
          remark: '',
          timestamp: Date.now() - 259200000, // 三天前
          status: 'failed',
          errorMsg: '余额不足',
          transactionId: 'TX' + Date.now() + '003'
        }
      ]
      
      this.transferRecords = mockRecords
      // 保存模拟记录到本地存储
      uni.setStorageSync('transferRecords', mockRecords)
    },
    
    // 获取记录标题
    getRecordTitle(record) {
      if (record.type === 'account') {
        return `转账给 ${record.name}`
      } else {
        return `手机号转账`
      }
    },
    
    // 获取记录详情
    getRecordDetail(record) {
      if (record.type === 'account') {
        return `账号：${record.account}`
      } else {
        return `手机号：${record.phone}`
      }
    },
    
    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style scoped>
.history-page {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.nav-bar {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.history-list {
  padding: 10px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.record-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.record-status {
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.record-status.success {
  background-color: #e8f5e8;
  color: #4caf50;
}

.record-status.failed {
  background-color: #ffebee;
  color: #f44336;
}

.record-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-detail {
  font-size: 14px;
  color: #666;
}

.record-amount {
  font-size: 16px;
  font-weight: bold;
  color: #f44336;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.record-remark {
  font-size: 12px;
  color: #666;
}
</style>
<template>
  <view class="balance-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">{{ type === 'credit' ? '信用卡账单明细' : '收支明细' }}</text>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-section">
      <view class="date-filter" @tap="showDatePicker">
        <text class="filter-text">{{ selectedDateRange }}</text>
        <text class="filter-icon">🔽</text>
      </view>
      <view class="type-filter" @tap="showTypeFilter">
        <text class="filter-text">{{ selectedType }}</text>
        <text class="filter-icon">🔽</text>
      </view>
    </view>

    <!-- 收支概览 -->
    <view class="summary-section" v-if="type !== 'credit'">
      <view class="summary-grid">
        <view class="summary-item">
          <text class="summary-label">收入</text>
          <text class="summary-value income">+¥{{ incomeTotal.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">支出</text>
          <text class="summary-value expense">-¥{{ expenseTotal.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">结余</text>
          <text class="summary-value">{{ balanceTotal >= 0 ? '+' : '' }}¥{{ balanceTotal.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 交易列表 -->
    <view class="transaction-list">
      <view v-if="transactions.length === 0" class="empty-list">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无交易记录</text>
      </view>
      
      <view v-else class="list-content">
        <!-- 按日期分组显示 -->
        <view v-for="(group, date) in groupedTransactions" :key="date" class="transaction-group">
          <text class="group-date">{{ date }}</text>
          <view class="group-items">
            <view class="transaction-item" v-for="(transaction, index) in group" :key="index" @tap="viewTransactionDetail(transaction)">
              <view class="transaction-icon" :class="transaction.type">
                <text>{{ transaction.icon }}</text>
              </view>
              <view class="transaction-info">
                <view class="info-row">
                  <text class="transaction-title">{{ transaction.title }}</text>
                  <text class="transaction-amount" :class="transaction.type">
                    {{ transaction.type === 'income' ? '+' : '-' }}¥{{ transaction.amount.toFixed(2) }}
                  </text>
                </view>
                <text class="transaction-time">{{ transaction.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="hasMore" class="load-more" @tap="loadMoreTransactions">
      <text class="load-text">上拉加载更多</text>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'
import { getTransactionHistory } from '@/api/user.js'

export default {
  data() {
    return {
      type: 'normal', // normal 或 credit
      transactions: [],
      groupedTransactions: {},
      selectedDateRange: '本月',
      selectedType: '全部类型',
      incomeTotal: 0,
      expenseTotal: 0,
      balanceTotal: 0,
      hasMore: true,
      currentPage: 1,
      pageSize: 20
    }
  },
  onLoad(options) {
    this.checkLoginStatus()
    if (options.type === 'credit') {
      this.type = 'credit'
    }
    this.loadTransactions()
  },
  computed: {
    
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      if (!forceCheckLogin()) {
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      }
    },
    
    // 加载交易记录
    async loadTransactions() {
      try {
        uni.showLoading({ title: '加载中...' })
        
        // 模拟API调用
        // const res = await getTransactionHistory({
        //   page: this.currentPage,
        //   pageSize: this.pageSize,
        //   dateRange: this.selectedDateRange,
        //   type: this.selectedType
        // })
        
        // 使用模拟数据
        const mockTransactions = this.generateMockTransactions()
        this.transactions = mockTransactions
        this.groupTransactionsByDate()
        this.calculateSummary()
        
      } catch (error) {
        uni.showToast({
          title: '加载失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 生成模拟交易数据
    generateMockTransactions() {
      const transactions = []
      const today = new Date()
      
      // 生成最近30天的模拟数据
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // 每天生成1-3条交易记录
        const recordCount = Math.floor(Math.random() * 3) + 1
        
        for (let j = 0; j < recordCount; j++) {
          const isIncome = Math.random() > 0.7 // 30%概率是收入
          const types = this.type === 'credit' ? 
            ['餐饮', '购物', '交通', '娱乐', '还款'] : 
            (isIncome ? ['工资', '转账', '理财收益', '红包'] : ['餐饮', '购物', '交通', '娱乐', '缴费'])
          
          const type = types[Math.floor(Math.random() * types.length)]
          const amount = Math.round(Math.random() * 1000 * (isIncome ? 20 : 1)) / 100
          
          // 根据类型设置图标和分类
          let icon = '💰', category = 'expense'
          if (isIncome || type === '工资' || type === '转账' || type === '理财收益' || type === '红包') {
            category = 'income'
            switch (type) {
              case '工资': icon = '💼'; break
              case '转账': icon = '↔️'; break
              case '理财收益': icon = '📈'; break
              case '红包': icon = '🧧'; break
              default: icon = '💰'
            }
          } else {
            switch (type) {
              case '餐饮': icon = '🍽️'; break
              case '购物': icon = '🛍️'; break
              case '交通': icon = '🚗'; break
              case '娱乐': icon = '🎮'; break
              case '缴费': icon = '💸'; break
              case '还款': icon = '🔄'; break
              default: icon = '💰'
            }
          }
          
          // 格式化时间
          const hours = Math.floor(Math.random() * 24)
          const minutes = Math.floor(Math.random() * 60)
          const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
          
          transactions.push({
            id: `${i}-${j}`,
            title: type,
            amount: amount,
            type: category,
            icon: icon,
            date: date.toISOString().split('T')[0],
            time: timeStr,
            desc: `这是一笔${type}交易`,
            account: '储蓄卡(****1234)',
            status: 'success'
          })
        }
      }
      
      // 按日期倒序排序
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    
    // 按日期分组交易记录
    groupTransactionsByDate() {
      const grouped = {}
      
      this.transactions.forEach(transaction => {
        const date = this.formatDate(transaction.date)
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(transaction)
      })
      
      this.groupedTransactions = grouped
    },
    
    // 格式化日期显示
    formatDate(dateString) {
      const date = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      
      if (targetDate.getTime() === today.getTime()) {
        return '今天'
      } else if (targetDate.getTime() === yesterday.getTime()) {
        return '昨天'
      } else {
        // 显示具体日期
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}月${day}日`
      }
    },
    
    // 计算收支汇总
    calculateSummary() {
      let income = 0
      let expense = 0
      
      this.transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          income += transaction.amount
        } else {
          expense += transaction.amount
        }
      })
      
      this.incomeTotal = income
      this.expenseTotal = expense
      this.balanceTotal = income - expense
    },
    
    // 显示日期选择器
    showDatePicker() {
      uni.showActionSheet({
        itemList: ['今天', '昨天', '近7天', '本月', '上月', '自定义'],
        success: (res) => {
          const options = ['今天', '昨天', '近7天', '本月', '上月', '自定义']
          this.selectedDateRange = options[res.tapIndex]
          this.currentPage = 1
          this.loadTransactions()
        }
      })
    },
    
    // 显示类型筛选器
    showTypeFilter() {
      const options = this.type === 'credit' ? 
        ['全部类型', '餐饮', '购物', '交通', '娱乐', '还款'] : 
        ['全部类型', '工资', '转账', '理财收益', '红包', '餐饮', '购物', '交通', '娱乐', '缴费']
        
      uni.showActionSheet({
        itemList: options,
        success: (res) => {
          this.selectedType = options[res.tapIndex]
          this.currentPage = 1
          this.loadTransactions()
        }
      })
    },
    
    // 查看交易详情
    viewTransactionDetail(transaction) {
      uni.showModal({
        title: transaction.title,
        content: `金额: ${transaction.type === 'income' ? '+' : '-' }¥${transaction.amount.toFixed(2)}
时间: ${transaction.date} ${transaction.time}
账户: ${transaction.account}
描述: ${transaction.desc}`,
        showCancel: false
      })
    },
    
    // 加载更多交易记录
    loadMoreTransactions() {
      if (!this.hasMore) return
      
      this.currentPage++
      // 这里可以实现加载更多的逻辑
      // 模拟没有更多数据的情况
      if (this.currentPage > 2) {
        this.hasMore = false
        uni.showToast({
          title: '没有更多记录了',
          icon: 'none'
        })
      } else {
        // 加载更多数据
        this.loadTransactions()
      }
    }
  }
}
</script>

<style scoped>
.balance-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.filter-section {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.filter-section > view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  margin: 0 10rpx;
}

.filter-text {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.filter-icon {
  font-size: 24rpx;
  color: #999;
}

.summary-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.summary-grid {
  display: flex;
  justify-content: space-between;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.summary-value {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.summary-value.income {
  color: #4caf50;
}

.summary-value.expense {
  color: #f44336;
}

.transaction-list {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.empty-list {
  text-align: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.transaction-group {
  margin-bottom: 30rpx;
}

.transaction-group:last-child {
  margin-bottom: 0;
}

.group-date {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.transaction-icon.income {
  background: #e8f5e9;
}

.transaction-icon.expense {
  background: #ffebee;
}

.transaction-info {
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.transaction-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.transaction-amount {
  font-size: 32rpx;
  font-weight: bold;
}

.transaction-amount.income {
  color: #4caf50;
}

.transaction-amount.expense {
  color: #f44336;
}

.transaction-time {
  font-size: 24rpx;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}

.load-more:active {
  background: #f5f5f5;
}
</style>
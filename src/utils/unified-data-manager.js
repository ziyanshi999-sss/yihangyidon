/**
 * 统一数据管理器
 * 负责所有用户数据的加载、更新、同步和本地存储
 */

class UnifiedDataManager {
  constructor() {
    this.users = []
    this.currentUser = null
    this.isInitialized = false
  }

  /**
   * 初始化数据管理器
   */
  async init() {
    try {
      // 从本地存储加载用户数据
      this.users = uni.getStorageSync('users') || []
      
      // 如果没有数据，从数据连接器加载
      if (this.users.length === 0) {
        await this.loadFromDataConnector()
      }
      
      // 设置当前用户
      this.currentUser = this.users.find(user => user.isLoggedIn) || this.users[0]
      
      this.isInitialized = true
      console.log('✅ 统一数据管理器初始化成功')
      
      return true
    } catch (error) {
      console.error('❌ 统一数据管理器初始化失败:', error)
      return false
    }
  }

  /**
   * 从数据连接器加载数据
   */
  async loadFromDataConnector() {
    try {
      // 从数据连接器加载数据
      const dataConnector = await import('../../db/data-connector.js')
      await dataConnector.default.init()
      const userData = await dataConnector.default.getUsers()
      this.users = userData
      this.saveToLocalStorage()
      console.log('✅ 从数据连接器加载数据成功')
    } catch (error) {
      console.error('❌ 从数据连接器加载数据失败:', error)
    }
  }

  /**
   * 获取模拟数据（备用）
   */
  async getUserJsonData() {
    // 备用模拟数据
    return [
      {
        "id": "u001",
        "username": "李华",
        "phone": "13888888888",
        "balance": 280000.00,
        "isLoggedIn": true,
        "wealthProducts": {
          "deposits": {
            "current": 30000,
            "fixed": 50000,
            "smart": 20000
          },
          "investments": [
            {
              "id": "inv001",
              "name": "稳健理财A",
              "amount": 30000,
              "rate": 3.8
            }
          ]
        },
        "depositProducts": {
          "current": { "rate": 0.35 },
          "fixed": [{ "rate": 2.45 }],
          "smart": { "rate": 3.50 }
        },
        "utilityAccounts": {
          "electricity": {
            "accountNumber": "9876543210",
            "meterReading": "12345",
            "balance": 0
          },
          "water": {
            "accountNumber": "1234567890",
            "meterReading": "5678",
            "balance": 0
          }
        },
        "rechargeHistory": [],
        "forexData": {
          "majorPairs": [
            {
              "code": "USD/CNY",
              "name": "美元/人民币",
              "price": 7.2375,
              "change": 0.12
            }
          ]
        },
        "loanInfo": {
          "availableAmount": 100000,
          "interestRate": 4.35
        },
        "wealthGoals": [
          {
            "id": "g001",
            "title": "购房首付",
            "target": 500000,
            "current": 250000,
            "progress": 50
          }
        ],
        "aiAnalysis": {
          "financialHealth": "优秀",
          "savingsRate": 35
        }
      }
    ]
  }

  /**
   * 保存数据到本地存储
   */
  saveToLocalStorage() {
    try {
      uni.setStorageSync('users', this.users)
      console.log('✅ 数据已保存到本地存储')
    } catch (error) {
      console.error('❌ 保存数据到本地存储失败:', error)
    }
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * 设置当前用户
   */
  setCurrentUser(userId) {
    this.currentUser = this.users.find(user => user.id === userId)
    if (this.currentUser) {
      // 更新登录状态
      this.users.forEach(user => {
        user.isLoggedIn = user.id === userId
      })
      this.saveToLocalStorage()
      console.log('✅ 当前用户已切换为:', this.currentUser.username)
    }
  }

  /**
   * 更新用户数据
   */
  updateUserData(userId, data) {
    const userIndex = this.users.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...data }
      this.saveToLocalStorage()
      
      // 如果更新的是当前用户，同步更新currentUser
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = this.users[userIndex]
      }
      
      // 触发数据同步
      this.syncData()
      
      console.log('✅ 用户数据已更新:', userId)
      return true
    }
    return false
  }

  /**
   * 更新用户余额
   */
  updateBalance(userId, newBalance) {
    return this.updateUserData(userId, { balance: newBalance })
  }

  /**
   * 更新存款数据
   */
  updateDepositData(userId, depositType, amount) {
    const user = this.users.find(u => u.id === userId)
    if (user && user.wealthProducts && user.wealthProducts.deposits) {
      user.wealthProducts.deposits[depositType] = amount
      this.updateUserData(userId, { wealthProducts: user.wealthProducts })
      return true
    }
    return false
  }

  /**
   * 更新转账记录
   */
  addTransferRecord(userId, record) {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      if (!user.transferRecords) {
        user.transferRecords = []
      }
      user.transferRecords.unshift(record)
      this.updateUserData(userId, { transferRecords: user.transferRecords })
      return true
    }
    return false
  }

  /**
   * 更新充值记录
   */
  addRechargeRecord(userId, record) {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      if (!user.rechargeHistory) {
        user.rechargeHistory = []
      }
      user.rechargeHistory.unshift(record)
      this.updateUserData(userId, { rechargeHistory: user.rechargeHistory })
      return true
    }
    return false
  }

  /**
   * 更新缴费记录
   */
  addPaymentRecord(userId, record) {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      if (!user.paymentRecords) {
        user.paymentRecords = []
      }
      user.paymentRecords.unshift(record)
      this.updateUserData(userId, { paymentRecords: user.paymentRecords })
      return true
    }
    return false
  }

  /**
   * 更新财富目标
   */
  updateWealthGoal(userId, goalId, updates) {
    const user = this.users.find(u => u.id === userId)
    if (user && user.wealthGoals) {
      const goalIndex = user.wealthGoals.findIndex(goal => goal.id === goalId)
      if (goalIndex !== -1) {
        user.wealthGoals[goalIndex] = { ...user.wealthGoals[goalIndex], ...updates }
        this.updateUserData(userId, { wealthGoals: user.wealthGoals })
        return true
      }
    }
    return false
  }

  /**
   * 更新AI分析数据
   */
  updateAIAnalysis(userId, analysis) {
    return this.updateUserData(userId, { aiAnalysis: analysis })
  }

  /**
   * 获取用户特定数据
   */
  getUserData(userId, dataPath) {
    const user = this.users.find(u => u.id === userId)
    if (!user) return null
    
    if (!dataPath) return user
    
    // 支持点号分隔的路径，如 'wealthProducts.deposits.current'
    return dataPath.split('.').reduce((obj, key) => obj?.[key], user)
  }

  /**
   * 获取所有用户
   */
  getAllUsers() {
    return this.users
  }

  /**
   * 数据同步 - 确保所有页面数据一致
   */
  syncData() {
    try {
      // 触发数据更新事件
      uni.$emit('dataUpdated', {
        users: this.users,
        currentUser: this.currentUser
      })
      
      console.log('✅ 数据同步完成')
    } catch (error) {
      console.error('❌ 数据同步失败:', error)
    }
  }

  /**
   * 监听数据变化
   */
  onDataChange(callback) {
    uni.$on('dataUpdated', callback)
  }

  /**
   * 移除数据变化监听
   */
  offDataChange(callback) {
    uni.$off('dataUpdated', callback)
  }

  /**
   * 重置数据
   */
  resetData() {
    this.users = []
    this.currentUser = null
    this.isInitialized = false
    uni.removeStorageSync('users')
    console.log('✅ 数据已重置')
  }
}

// 创建单例实例
const unifiedDataManager = new UnifiedDataManager()

export default unifiedDataManager

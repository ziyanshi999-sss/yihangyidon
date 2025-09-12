/**
 * 数据同步工具
 * 确保所有数据都从本地存储获取，基于 user.json 文件
 */

import { getStorage, setStorage } from './storage.js'
import userDataJson from '../../db/user.json'

class DataSync {
  constructor() {
    this.storageKeys = {
      USERS: 'users',
      USER_INFO: 'userInfo',
      CURRENT_USER_ID: 'currentUserId',
      IS_LOGGED_IN: 'isLoggedIn',
      WEALTH_DATA: 'wealthData',
      ACCOUNT_DATA: 'accountData',
      CREDIT_CARD_DATA: 'creditCardData',
      TRANSFER_DATA: 'transferData',
      PAYMENT_DATA: 'paymentData',
      SECURITY_DATA: 'securityData',
      USER_GOALS: 'userGoals'
    }
  }

  /**
   * 获取用户数据（优先从本地存储）
   */
  getUsersData() {
    try {
      // 首先尝试从本地存储获取
      let users = uni.getStorageSync(this.storageKeys.USERS)
      
      if (!users || users.length === 0) {
        // 如果本地存储没有数据，使用JSON文件数据
        users = userDataJson
        // 保存到本地存储
        uni.setStorageSync(this.storageKeys.USERS, users)
        console.log('从JSON文件同步用户数据到本地存储')
      }
      
      return users
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return userDataJson
    }
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUserInfo() {
    try {
      // 首先尝试从本地存储获取
      let userInfo = uni.getStorageSync(this.storageKeys.USER_INFO)
      
      if (!userInfo) {
        // 如果本地存储没有数据，从用户数据中获取第一个用户
        const users = this.getUsersData()
        userInfo = users[0]
        if (userInfo) {
          uni.setStorageSync(this.storageKeys.USER_INFO, userInfo)
          uni.setStorageSync(this.storageKeys.CURRENT_USER_ID, userInfo.id)
          uni.setStorageSync(this.storageKeys.IS_LOGGED_IN, true)
        }
      }
      
      return userInfo
    } catch (error) {
      console.error('获取当前用户信息失败:', error)
      return null
    }
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUserId() {
    try {
      let currentUserId = uni.getStorageSync(this.storageKeys.CURRENT_USER_ID)
      
      if (!currentUserId) {
        const userInfo = this.getCurrentUserInfo()
        currentUserId = userInfo?.id || 'u001'
        uni.setStorageSync(this.storageKeys.CURRENT_USER_ID, currentUserId)
      }
      
      return currentUserId
    } catch (error) {
      console.error('获取当前用户ID失败:', error)
      return 'u001'
    }
  }

  /**
   * 获取财富数据
   */
  getWealthData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let wealthData = uni.getStorageSync(this.storageKeys.WEALTH_DATA)
      
      if (!wealthData || !wealthData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          wealthData = wealthData || {}
          wealthData[targetUserId] = {
            deposits: user.wealthProducts?.deposits || {
              current: 0,
              fixed: 0,
              smart: 0
            },
            investments: user.wealthProducts?.investments || [],
            investmentPortfolio: user.investmentPortfolio || {
              totalValue: 0,
              totalReturn: 0,
              returnRate: 0,
              holdings: []
            },
            depositProducts: user.depositProducts || {
              current: { rate: 0.35, features: [], riskWarning: '' },
              fixed: [],
              smart: { rate: 2.8, features: [], riskWarning: '' }
            },
            insuranceProducts: user.insuranceProducts || {
              categories: []
            },
            forexProducts: user.forexProducts || {
              majorPairs: [],
              tradingPairs: []
            }
          }
          
          uni.setStorageSync(this.storageKeys.WEALTH_DATA, wealthData)
        }
      }
      
      return wealthData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取财富数据失败:', error)
      return {}
    }
  }

  /**
   * 获取账户数据
   */
  getAccountData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let accountData = uni.getStorageSync(this.storageKeys.ACCOUNT_DATA)
      
      if (!accountData || !accountData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          accountData = accountData || {}
          accountData[targetUserId] = {
            balance: user.balance || 0,
            bankAccounts: user.bankAccounts || [],
            totalBalance: user.balance || 0,
            accountCount: (user.bankAccounts || []).length
          }
          
          uni.setStorageSync(this.storageKeys.ACCOUNT_DATA, accountData)
        }
      }
      
      return accountData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取账户数据失败:', error)
      return {}
    }
  }

  /**
   * 获取信用卡数据
   */
  getCreditCardData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let creditCardData = uni.getStorageSync(this.storageKeys.CREDIT_CARD_DATA)
      
      if (!creditCardData || !creditCardData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          creditCardData = creditCardData || {}
          creditCardData[targetUserId] = {
            cards: user.creditCards || [],
            totalCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.creditLimit || 0), 0),
            usedCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.currentBalance || 0), 0),
            availableCredit: (user.creditCards || []).reduce((sum, card) => sum + (card.availableCredit || 0), 0),
            cardCount: (user.creditCards || []).length
          }
          
          uni.setStorageSync(this.storageKeys.CREDIT_CARD_DATA, creditCardData)
        }
      }
      
      return creditCardData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取信用卡数据失败:', error)
      return {}
    }
  }

  /**
   * 获取转账数据
   */
  getTransferData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let transferData = uni.getStorageSync(this.storageKeys.TRANSFER_DATA)
      
      if (!transferData || !transferData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          transferData = transferData || {}
          transferData[targetUserId] = {
            records: user.transferRecords || [],
            totalTransfers: (user.transferRecords || []).length,
            totalTransferAmount: (user.transferRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0)
          }
          
          uni.setStorageSync(this.storageKeys.TRANSFER_DATA, transferData)
        }
      }
      
      return transferData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取转账数据失败:', error)
      return {}
    }
  }

  /**
   * 获取支付数据
   */
  getPaymentData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let paymentData = uni.getStorageSync(this.storageKeys.PAYMENT_DATA)
      
      if (!paymentData || !paymentData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          paymentData = paymentData || {}
          paymentData[targetUserId] = {
            records: user.paymentRecords || [],
            totalPayments: (user.paymentRecords || []).length,
            totalPaymentAmount: (user.paymentRecords || []).reduce((sum, p) => sum + (p.amount || 0), 0)
          }
          
          uni.setStorageSync(this.storageKeys.PAYMENT_DATA, paymentData)
        }
      }
      
      return paymentData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取支付数据失败:', error)
      return {}
    }
  }

  /**
   * 获取安全数据
   */
  getSecurityData(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let securityData = uni.getStorageSync(this.storageKeys.SECURITY_DATA)
      
      if (!securityData || !securityData[targetUserId]) {
        // 如果本地存储没有数据，从用户数据中获取
        const users = this.getUsersData()
        const user = users.find(u => u.id === targetUserId) || users[0]
        
        if (user) {
          securityData = securityData || {}
          securityData[targetUserId] = {
            settings: user.securitySettings || {},
            biometricEnabled: user.securitySettings?.biometricEnabled || false,
            twoFactorEnabled: user.securitySettings?.twoFactorEnabled || false,
            transactionLimit: user.securitySettings?.transactionLimit || 0
          }
          
          uni.setStorageSync(this.storageKeys.SECURITY_DATA, securityData)
        }
      }
      
      return securityData?.[targetUserId] || {}
    } catch (error) {
      console.error('获取安全数据失败:', error)
      return {}
    }
  }

  /**
   * 获取目标数据
   */
  getUserGoals(userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 首先尝试从本地存储获取
      let userGoals = uni.getStorageSync(this.storageKeys.USER_GOALS)
      
      if (!userGoals || !userGoals[targetUserId]) {
        // 如果本地存储没有数据，创建默认目标
        userGoals = userGoals || {}
        userGoals[targetUserId] = [
          {
            id: 'goal001',
            name: '购房首付',
            targetAmount: 500000,
            currentAmount: 325000,
            monthlyContribution: 5000,
            targetDate: '2026-08-01',
            category: 'house',
            priority: 'high',
            status: 'active',
            progress: 65,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          },
          {
            id: 'goal002',
            name: '教育基金',
            targetAmount: 150000,
            currentAmount: 60000,
            monthlyContribution: 3000,
            targetDate: '2028-06-01',
            category: 'education',
            priority: 'medium',
            status: 'active',
            progress: 40,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          },
          {
            id: 'goal003',
            name: '退休规划',
            targetAmount: 1000000,
            currentAmount: 250000,
            monthlyContribution: 2000,
            targetDate: '2040-12-01',
            category: 'retirement',
            priority: 'low',
            status: 'active',
            progress: 25,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          }
        ]
        
        uni.setStorageSync(this.storageKeys.USER_GOALS, userGoals)
      }
      
      return userGoals?.[targetUserId] || []
    } catch (error) {
      console.error('获取目标数据失败:', error)
      return []
    }
  }

  /**
   * 更新数据到本地存储
   */
  updateDataToStorage(key, data, userId = null) {
    try {
      const targetUserId = userId || this.getCurrentUserId()
      
      // 获取现有数据
      let existingData = uni.getStorageSync(key) || {}
      
      // 更新对应用户的数据
      existingData[targetUserId] = {
        ...existingData[targetUserId],
        ...data,
        lastUpdateTime: new Date().toISOString()
      }
      
      // 保存到本地存储
      uni.setStorageSync(key, existingData)
      
      console.log(`数据已更新到本地存储: ${key}`)
      return true
    } catch (error) {
      console.error(`更新数据到本地存储失败: ${key}`, error)
      return false
    }
  }

  /**
   * 同步所有数据到本地存储
   */
  syncAllDataToStorage() {
    try {
      console.log('开始同步所有数据到本地存储...')
      
      const users = this.getUsersData()
      
      users.forEach(user => {
        // 同步财富数据
        this.getWealthData(user.id)
        
        // 同步账户数据
        this.getAccountData(user.id)
        
        // 同步信用卡数据
        this.getCreditCardData(user.id)
        
        // 同步转账数据
        this.getTransferData(user.id)
        
        // 同步支付数据
        this.getPaymentData(user.id)
        
        // 同步安全数据
        this.getSecurityData(user.id)
        
        // 同步目标数据
        this.getUserGoals(user.id)
      })
      
      console.log('所有数据已同步到本地存储')
      return true
    } catch (error) {
      console.error('同步数据到本地存储失败:', error)
      return false
    }
  }
}

// 创建单例实例
const dataSync = new DataSync()

export default dataSync

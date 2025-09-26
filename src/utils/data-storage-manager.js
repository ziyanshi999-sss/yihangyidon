/**
 * 数据本地存储管理器
 * 统一管理所有数据的本地存储，基于数据连接器
 */

import { setStorage, getStorage } from './storage.js'
import dataConnector from '../../db/data-connector.js'

class DataStorageManager {
  constructor() {
    this.storageKeys = {
      // 用户相关
      USER_INFO: 'userInfo',
      CURRENT_USER_ID: 'currentUserId',
      IS_LOGGED_IN: 'isLoggedIn',
      USERS: 'users',
      
      // 财富相关
      WEALTH_DATA: 'wealthData',
      DEPOSIT_DATA: 'depositData',
      INVESTMENT_DATA: 'investmentData',
      INSURANCE_DATA: 'insuranceData',
      FOREX_DATA: 'forexData',
      
      // 账户相关
      ACCOUNT_DATA: 'accountData',
      BALANCE_DATA: 'balanceData',
      TRANSACTION_DATA: 'transactionData',
      
      // 信用卡相关
      CREDIT_CARD_DATA: 'creditCardData',
      CREDIT_CARD_TRANSACTIONS: 'creditCardTransactions',
      
      // 转账相关
      TRANSFER_DATA: 'transferData',
      FREQUENT_CONTACTS: 'frequentContacts',
      
      // 支付相关
      PAYMENT_DATA: 'paymentData',
      LIFE_SERVICES: 'lifeServices',
      
      // 安全相关
      SECURITY_DATA: 'securityData',
      LOGIN_DEVICES: 'loginDevices',
      SECURITY_EVENTS: 'securityEvents',
      
      // 目标管理相关
      USER_GOALS: 'userGoals',
      GOAL_PROGRESS: 'goalProgress',
      
      // 应用设置
      APP_SETTINGS: 'appSettings',
      THEME_SETTINGS: 'themeSettings',
      LANGUAGE_SETTINGS: 'languageSettings',
      
      // 缓存数据
      CACHE_DATA: 'cacheData',
      LAST_SYNC_TIME: 'lastSyncTime'
    }
  }

  /**
   * 初始化所有数据到本地存储
   */
  async initAllDataToStorage() {
    try {
      console.log('开始初始化所有数据到本地存储...')
      
      // 1. 初始化用户数据
      await this.initUserData()
      
      // 2. 初始化财富数据
      await this.initWealthData()
      
      // 3. 初始化账户数据
      await this.initAccountData()
      
      // 4. 初始化信用卡数据
      await this.initCreditCardData()
      
      // 5. 初始化转账数据
      await this.initTransferData()
      
      // 6. 初始化支付数据
      await this.initPaymentData()
      
      // 7. 初始化安全数据
      await this.initSecurityData()
      
      // 8. 初始化目标管理数据
      await this.initGoalData()
      
      // 9. 初始化应用设置
      await this.initAppSettings()
      
      // 10. 设置同步时间
      await this.setLastSyncTime()
      
      console.log('所有数据初始化到本地存储完成！')
      return true
    } catch (error) {
      console.error('初始化数据到本地存储失败:', error)
      return false
    }
  }

  /**
   * 初始化用户数据
   */
  async initUserData() {
    try {
      // 从数据连接器获取用户数据
      await dataConnector.init()
      const users = await dataConnector.getUsers()
      
      // 存储所有用户数据
      await setStorage(this.storageKeys.USERS, users, true)
      
      // 存储当前用户信息（默认第一个用户）
      const currentUser = users[0]
      if (currentUser) {
        await setStorage(this.storageKeys.USER_INFO, currentUser, true)
        await setStorage(this.storageKeys.CURRENT_USER_ID, currentUser.id, true)
        await setStorage(this.storageKeys.IS_LOGGED_IN, true, true)
      }
      
      console.log('用户数据初始化完成:', users.length, '个用户')
    } catch (error) {
      console.error('初始化用户数据失败:', error)
    }
  }

  /**
   * 初始化财富数据
   */
  async initWealthData() {
    try {
      const users = await dataConnector.getUsers()
      const wealthData = {}
      
      users.forEach(user => {
        wealthData[user.id] = {
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
      })
      
      await setStorage(this.storageKeys.WEALTH_DATA, wealthData, true)
      console.log('财富数据初始化完成')
    } catch (error) {
      console.error('初始化财富数据失败:', error)
    }
  }

  /**
   * 初始化账户数据
   */
  async initAccountData() {
    try {
      const users = await dataConnector.getUsers()
      const accountData = {}
      const balanceData = {}
      const transactionData = {}
      
      users.forEach(user => {
        accountData[user.id] = {
          balance: user.balance || 0,
          bankAccounts: user.bankAccounts || [],
          totalBalance: user.balance || 0,
          accountCount: (user.bankAccounts || []).length
        }
        
        balanceData[user.id] = {
          currentBalance: user.balance || 0,
          availableBalance: user.balance || 0,
          frozenBalance: 0,
          lastUpdateTime: new Date().toISOString()
        }
        
        transactionData[user.id] = {
          records: user.transactionRecords || [],
          totalTransactions: (user.transactionRecords || []).length,
          totalAmount: (user.transactionRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0),
          averageAmount: (user.transactionRecords || []).length > 0 ? 
            (user.transactionRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0) / (user.transactionRecords || []).length : 0
        }
      })
      
      await setStorage(this.storageKeys.ACCOUNT_DATA, accountData, true)
      await setStorage(this.storageKeys.BALANCE_DATA, balanceData, true)
      await setStorage(this.storageKeys.TRANSACTION_DATA, transactionData, true)
      
      console.log('账户数据初始化完成')
    } catch (error) {
      console.error('初始化账户数据失败:', error)
    }
  }

  /**
   * 初始化信用卡数据
   */
  async initCreditCardData() {
    try {
      const users = await dataConnector.getUsers()
      const creditCardData = {}
      const creditCardTransactions = {}
      
      users.forEach(user => {
        creditCardData[user.id] = {
          cards: user.creditCards || [],
          totalCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.creditLimit || 0), 0),
          usedCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.currentBalance || 0), 0),
          availableCredit: (user.creditCards || []).reduce((sum, card) => sum + (card.availableCredit || 0), 0),
          cardCount: (user.creditCards || []).length
        }
        
        creditCardTransactions[user.id] = user.creditCardTransactions || []
      })
      
      await setStorage(this.storageKeys.CREDIT_CARD_DATA, creditCardData, true)
      await setStorage(this.storageKeys.CREDIT_CARD_TRANSACTIONS, creditCardTransactions, true)
      
      console.log('信用卡数据初始化完成')
    } catch (error) {
      console.error('初始化信用卡数据失败:', error)
    }
  }

  /**
   * 初始化转账数据
   */
  async initTransferData() {
    try {
      const users = await dataConnector.getUsers()
      const transferData = {}
      const frequentContacts = {}
      
      users.forEach(user => {
        transferData[user.id] = {
          records: user.transferRecords || [],
          totalTransfers: (user.transferRecords || []).length,
          totalTransferAmount: (user.transferRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0)
        }
        
        frequentContacts[user.id] = user.frequentContacts || []
      })
      
      await setStorage(this.storageKeys.TRANSFER_DATA, transferData, true)
      await setStorage(this.storageKeys.FREQUENT_CONTACTS, frequentContacts, true)
      
      console.log('转账数据初始化完成')
    } catch (error) {
      console.error('初始化转账数据失败:', error)
    }
  }

  /**
   * 初始化支付数据
   */
  async initPaymentData() {
    try {
      const users = await dataConnector.getUsers()
      const paymentData = {}
      const lifeServices = {}
      
      users.forEach(user => {
        paymentData[user.id] = {
          records: user.paymentRecords || [],
          totalPayments: (user.paymentRecords || []).length,
          totalPaymentAmount: (user.paymentRecords || []).reduce((sum, p) => sum + (p.amount || 0), 0)
        }
        
        lifeServices[user.id] = user.lifeServices || {
          phoneRecharge: {},
          utilities: [],
          quickServices: [],
          allServices: [],
          bannerData: [],
          paymentCategories: [],
          recentPayments: [],
          favoriteServices: []
        }
      })
      
      await setStorage(this.storageKeys.PAYMENT_DATA, paymentData, true)
      await setStorage(this.storageKeys.LIFE_SERVICES, lifeServices, true)
      
      console.log('支付数据初始化完成')
    } catch (error) {
      console.error('初始化支付数据失败:', error)
    }
  }

  /**
   * 初始化安全数据
   */
  async initSecurityData() {
    try {
      const users = await dataConnector.getUsers()
      const securityData = {}
      const loginDevices = {}
      const securityEvents = {}
      
      users.forEach(user => {
        securityData[user.id] = {
          settings: user.securitySettings || {},
          biometricEnabled: user.securitySettings?.biometricEnabled || false,
          twoFactorEnabled: user.securitySettings?.twoFactorEnabled || false,
          transactionLimit: user.securitySettings?.transactionLimit || 0
        }
        
        loginDevices[user.id] = user.securitySettings?.loginDevices || []
        securityEvents[user.id] = user.securitySettings?.securityEvents || []
      })
      
      await setStorage(this.storageKeys.SECURITY_DATA, securityData, true)
      await setStorage(this.storageKeys.LOGIN_DEVICES, loginDevices, true)
      await setStorage(this.storageKeys.SECURITY_EVENTS, securityEvents, true)
      
      console.log('安全数据初始化完成')
    } catch (error) {
      console.error('初始化安全数据失败:', error)
    }
  }

  /**
   * 初始化目标管理数据
   */
  async initGoalData() {
    try {
      const users = await dataConnector.getUsers()
      const userGoals = {}
      const goalProgress = {}
      
      users.forEach(user => {
        // 为每个用户创建默认目标
        userGoals[user.id] = [
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
        
        goalProgress[user.id] = {
          totalGoals: 3,
          completedGoals: 0,
          activeGoals: 3,
          totalTargetAmount: 1650000,
          totalCurrentAmount: 635000,
          overallProgress: 38.5
        }
      })
      
      await setStorage(this.storageKeys.USER_GOALS, userGoals, true)
      await setStorage(this.storageKeys.GOAL_PROGRESS, goalProgress, true)
      
      console.log('目标管理数据初始化完成')
    } catch (error) {
      console.error('初始化目标管理数据失败:', error)
    }
  }

  /**
   * 初始化应用设置
   */
  async initAppSettings() {
    try {
      const appSettings = {
        version: '1.0.0',
        lastUpdateTime: new Date().toISOString(),
        autoSync: true,
        dataBackup: true,
        notifications: true,
        biometricLogin: true
      }
      
      const themeSettings = {
        currentTheme: 'light',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        fontSize: 'medium',
        language: 'zh-CN'
      }
      
      const languageSettings = {
        currentLanguage: 'zh-CN',
        availableLanguages: ['zh-CN', 'en-US'],
        autoDetect: true
      }
      
      await setStorage(this.storageKeys.APP_SETTINGS, appSettings, true)
      await setStorage(this.storageKeys.THEME_SETTINGS, themeSettings, true)
      await setStorage(this.storageKeys.LANGUAGE_SETTINGS, languageSettings, true)
      
      console.log('应用设置初始化完成')
    } catch (error) {
      console.error('初始化应用设置失败:', error)
    }
  }

  /**
   * 设置最后同步时间
   */
  async setLastSyncTime() {
    try {
      const syncTime = new Date().toISOString()
      await setStorage(this.storageKeys.LAST_SYNC_TIME, syncTime, true)
      console.log('同步时间设置完成:', syncTime)
    } catch (error) {
      console.error('设置同步时间失败:', error)
    }
  }

  /**
   * 获取存储的数据
   */
  async getStoredData(key) {
    try {
      return await getStorage(key, true)
    } catch (error) {
      console.error(`获取存储数据失败: ${key}`, error)
      return null
    }
  }

  /**
   * 更新存储的数据
   */
  async updateStoredData(key, data) {
    try {
      await setStorage(key, data, true)
      console.log(`存储数据更新成功: ${key}`)
      return true
    } catch (error) {
      console.error(`更新存储数据失败: ${key}`, error)
      return false
    }
  }

  /**
   * 获取所有存储信息
   */
  async getAllStorageInfo() {
    try {
      const storageInfo = {}
      
      for (const [key, value] of Object.entries(this.storageKeys)) {
        const data = await this.getStoredData(value)
        storageInfo[key] = {
          key: value,
          hasData: data !== null,
          dataSize: data ? JSON.stringify(data).length : 0,
          lastUpdate: data?.lastUpdateTime || null
        }
      }
      
      return storageInfo
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return {}
    }
  }

  /**
   * 数据同步检查
   */
  async checkDataSync() {
    try {
      const lastSyncTime = await this.getStoredData(this.storageKeys.LAST_SYNC_TIME)
      const now = new Date()
      
      if (!lastSyncTime) {
        console.log('首次运行，需要初始化数据')
        return { needsSync: true, reason: '首次运行' }
      }
      
      const lastSync = new Date(lastSyncTime)
      const timeDiff = now - lastSync
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        console.log('数据超过24小时未同步，需要更新')
        return { needsSync: true, reason: '数据过期', hoursDiff }
      }
      
      console.log('数据同步正常')
      return { needsSync: false, hoursDiff }
    } catch (error) {
      console.error('检查数据同步失败:', error)
      return { needsSync: true, reason: '检查失败' }
    }
  }
}

// 创建单例实例
const dataStorageManager = new DataStorageManager()

export default dataStorageManager

/**
 * 增强数据操作器
 * 在用户同意后直接操作用户数据
 */

import dataPermissionManager from './data-permission-manager.js'
import zhipuAI from '@/api/zhipu-ai.js'
import userDataLoader from './user-data-loader.js'

class EnhancedDataOperator {
  constructor() {
    this.permissionManager = dataPermissionManager
  }

  /**
   * 智能数据收集 - 获取所有用户数据
   */
  async collectAllUserData() {
    try {
      // 检查是否有数据访问权限
      if (!this.permissionManager.hasPermission('read', 'all')) {
        const granted = await this.permissionManager.requestDataAccess('all', 'analysis')
        if (!granted) {
          throw new Error('用户拒绝了数据访问权限')
        }
      }

      // 获取当前登录用户信息
      const loginInfo = uni.getStorageSync('loginInfo') || {}
      const currentUserId = loginInfo.userId || 'u001' // 默认使用第一个用户
      
      // 从 user.json 加载真实用户数据
      const userFinancialData = await userDataLoader.getUserFinancialData(currentUserId)
      
      if (!userFinancialData) {
        throw new Error('无法加载用户数据')
      }

      const allData = {
        // 从 user.json 获取的真实数据
        userInfo: userFinancialData.userInfo,
        accountData: userFinancialData.accountData,
        creditCardData: userFinancialData.creditCardData,
        transactionData: userFinancialData.transactionData,
        investmentData: userFinancialData.investmentData,
        transferData: userFinancialData.transferData,
        paymentData: userFinancialData.paymentData,
        securityData: userFinancialData.securityData,
        
        // 补充的本地数据
        goalData: this.getGoalData(),
        spendingData: this.getSpendingData(),
        systemData: this.getSystemData(),
        
        // 数据来源标识
        dataSource: 'user.json',
        userId: currentUserId,
        
        // 时间戳
        collectedAt: new Date().toISOString()
      }

      // 记录数据收集
      this.permissionManager.recordConsent('data_collected', {
        dataTypes: Object.keys(allData),
        timestamp: allData.collectedAt,
        userId: currentUserId,
        dataSource: 'user.json'
      })

      console.log('从 user.json 收集用户数据成功:', allData)
      return allData
    } catch (error) {
      console.error('收集用户数据失败:', error)
      throw error
    }
  }

  /**
   * 获取用户基本信息
   */
  getUserInfo() {
    const userInfo = uni.getStorageSync('userInfo') || {}
    const loginInfo = uni.getStorageSync('loginInfo') || {}
    
    return {
      username: userInfo.username || loginInfo.username || '用户',
      phone: userInfo.phone || loginInfo.phone || '',
      email: userInfo.email || '',
      age: userInfo.age || 30,
      occupation: userInfo.occupation || '未知',
      monthlyIncome: userInfo.monthlyIncome || 0,
      monthlyExpense: userInfo.monthlyExpense || 0,
      riskProfile: userInfo.riskProfile || '平衡型',
      investmentGoals: userInfo.investmentGoals || ['财富增值'],
      investmentHorizon: userInfo.investmentHorizon || '中长期',
      emergencyFund: userInfo.emergencyFund || 0,
      debtAmount: userInfo.debtAmount || 0,
      creditScore: userInfo.creditScore || 0
    }
  }

  /**
   * 获取账户数据
   */
  getAccountData() {
    const balance = uni.getStorageSync('userBalance') || 0
    const accounts = uni.getStorageSync('userAccounts') || []
    const cards = uni.getStorageSync('userCards') || []
    
    return {
      totalBalance: balance,
      accounts: accounts,
      cards: cards,
      accountCount: accounts.length,
      cardCount: cards.length,
      primaryAccount: accounts.find(acc => acc.isPrimary) || accounts[0] || null,
      totalCreditLimit: cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0),
      usedCreditLimit: cards.reduce((sum, card) => sum + (card.usedAmount || 0), 0)
    }
  }

  /**
   * 获取交易数据
   */
  getTransactionData() {
    const transactions = uni.getStorageSync('userTransactions') || []
    const recentTransactions = transactions.slice(-100) // 最近100笔交易
    
    return {
      totalTransactions: transactions.length,
      recentTransactions: recentTransactions,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      averageAmount: transactions.length > 0 ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / transactions.length : 0,
      categories: this.analyzeTransactionCategories(transactions),
      trends: this.analyzeTransactionTrends(transactions)
    }
  }

  /**
   * 获取投资数据
   */
  getInvestmentData() {
    const investments = uni.getStorageSync('userInvestments') || []
    const portfolio = uni.getStorageSync('userPortfolio') || {}
    
    return {
      investments: investments,
      portfolio: portfolio,
      totalInvested: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
      currentValue: investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0),
      totalReturn: investments.reduce((sum, inv) => sum + ((inv.currentValue || inv.amount || 0) - (inv.amount || 0)), 0),
      returnRate: this.calculateReturnRate(investments),
      performance: this.calculateInvestmentPerformance(investments)
    }
  }

  /**
   * 获取目标数据
   */
  getGoalData() {
    const goals = uni.getStorageSync('userGoals') || []
    const activeGoals = goals.filter(goal => goal.status === 'active')
    const completedGoals = goals.filter(goal => goal.status === 'completed')
    
    return {
      totalGoals: goals.length,
      activeGoals: activeGoals,
      completedGoals: completedGoals,
      totalTargetAmount: activeGoals.reduce((sum, goal) => sum + (goal.target || 0), 0),
      totalSavedAmount: activeGoals.reduce((sum, goal) => sum + (goal.current || 0), 0),
      averageProgress: this.calculateAverageProgress(activeGoals),
      goalCategories: this.analyzeGoalCategories(goals)
    }
  }

  /**
   * 获取消费数据
   */
  getSpendingData() {
    const spending = uni.getStorageSync('userSpending') || []
    const categories = uni.getStorageSync('spendingCategories') || []
    
    return {
      spending: spending,
      categories: categories,
      totalSpent: spending.reduce((sum, s) => sum + (s.amount || 0), 0),
      monthlySpending: this.calculateMonthlySpending(spending),
      categoryAnalysis: this.analyzeSpendingCategories(spending),
      trends: this.analyzeSpendingTrends(spending)
    }
  }

  /**
   * 获取系统数据
   */
  getSystemData() {
    return {
      appVersion: '1.0.0',
      platform: uni.getSystemInfoSync().platform,
      language: uni.getSystemInfoSync().language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      lastLogin: uni.getStorageSync('lastLogin') || null,
      sessionDuration: this.calculateSessionDuration(),
      deviceInfo: uni.getSystemInfoSync()
    }
  }

  /**
   * AI智能数据操作 - 在用户同意后直接操作数据
   */
  async performDataOperation(operation, data) {
    try {
      // 检查操作权限
      if (!this.permissionManager.hasPermission('write', operation.type)) {
        const granted = await this.permissionManager.requestDataAccess(operation.dataType, operation.purpose)
        if (!granted) {
          throw new Error('用户拒绝了数据操作权限')
        }
      }

      let result
      switch (operation.type) {
        case 'updateProfile':
          result = await this.updateUserProfile(data)
          break
        case 'createGoal':
          result = await this.createGoal(data)
          break
        case 'updateGoal':
          result = await this.updateGoal(data)
          break
        case 'createInvestment':
          result = await this.createInvestment(data)
          break
        case 'updateInvestment':
          result = await this.updateInvestment(data)
          break
        case 'createTransaction':
          result = await this.createTransaction(data)
          break
        default:
          throw new Error(`不支持的操作类型: ${operation.type}`)
      }

      // 记录操作
      this.permissionManager.recordConsent('data_operation', {
        operation: operation.type,
        data: data,
        result: result
      })

      return result
    } catch (error) {
      console.error('数据操作失败:', error)
      throw error
    }
  }

  /**
   * 更新用户资料
   */
  async updateUserProfile(profileData) {
    try {
      const currentProfile = uni.getStorageSync('userInfo') || {}
      const updatedProfile = { ...currentProfile, ...profileData }
      
      uni.setStorageSync('userInfo', updatedProfile)
      
      return {
        success: true,
        message: '用户资料更新成功',
        data: updatedProfile
      }
    } catch (error) {
      throw new Error('更新用户资料失败')
    }
  }

  /**
   * 创建理财目标
   */
  async createGoal(goalData) {
    try {
      const goals = uni.getStorageSync('userGoals') || []
      const newGoal = {
        id: Date.now(),
        ...goalData,
        status: 'active',
        createdAt: new Date().toISOString(),
        progress: 0
      }
      
      goals.push(newGoal)
      uni.setStorageSync('userGoals', goals)
      
      return {
        success: true,
        message: '理财目标创建成功',
        data: newGoal
      }
    } catch (error) {
      throw new Error('创建理财目标失败')
    }
  }

  /**
   * 更新理财目标
   */
  async updateGoal(goalData) {
    try {
      const goals = uni.getStorageSync('userGoals') || []
      const goalIndex = goals.findIndex(goal => goal.id === goalData.id)
      
      if (goalIndex === -1) {
        throw new Error('目标不存在')
      }
      
      goals[goalIndex] = { ...goals[goalIndex], ...goalData, updatedAt: new Date().toISOString() }
      uni.setStorageSync('userGoals', goals)
      
      return {
        success: true,
        message: '理财目标更新成功',
        data: goals[goalIndex]
      }
    } catch (error) {
      throw new Error('更新理财目标失败')
    }
  }

  /**
   * 创建投资记录
   */
  async createInvestment(investmentData) {
    try {
      // 获取当前用户ID
      const loginInfo = uni.getStorageSync('loginInfo') || {}
      const currentUserId = loginInfo.userId || 'u001'
      
      // 使用 userDataLoader 添加投资记录
      const newInvestment = await userDataLoader.addInvestment(currentUserId, investmentData)
      
      return {
        success: true,
        message: '投资记录创建成功',
        data: newInvestment
      }
    } catch (error) {
      console.error('创建投资记录失败:', error)
      throw new Error('创建投资记录失败')
    }
  }

  /**
   * 更新投资记录
   */
  async updateInvestment(investmentData) {
    try {
      const investments = uni.getStorageSync('userInvestments') || []
      const investmentIndex = investments.findIndex(inv => inv.id === investmentData.id)
      
      if (investmentIndex === -1) {
        throw new Error('投资记录不存在')
      }
      
      investments[investmentIndex] = { ...investments[investmentIndex], ...investmentData, updatedAt: new Date().toISOString() }
      uni.setStorageSync('userInvestments', investments)
      
      return {
        success: true,
        message: '投资记录更新成功',
        data: investments[investmentIndex]
      }
    } catch (error) {
      throw new Error('更新投资记录失败')
    }
  }

  /**
   * 创建交易记录
   */
  async createTransaction(transactionData) {
    try {
      // 获取当前用户ID
      const loginInfo = uni.getStorageSync('loginInfo') || {}
      const currentUserId = loginInfo.userId || 'u001'
      
      // 使用 userDataLoader 添加交易记录
      const newTransaction = await userDataLoader.addTransaction(currentUserId, transactionData)
      
      return {
        success: true,
        message: '交易记录创建成功',
        data: newTransaction
      }
    } catch (error) {
      console.error('创建交易记录失败:', error)
      throw new Error('创建交易记录失败')
    }
  }

  /**
   * AI智能建议执行 - 自动执行AI建议
   */
  async executeAISuggestion(suggestion) {
    try {
      // 使用AI分析建议并执行
      const aiResponse = await zhipuAI.chatWithAI(
        `请分析以下建议并提供具体的执行步骤：${JSON.stringify(suggestion)}`,
        { context: 'suggestion_execution' }
      )

      if (!aiResponse.success) {
        throw new Error('AI分析失败')
      }

      // 根据建议类型执行相应操作
      const executionResult = await this.performSuggestionExecution(suggestion, aiResponse.content)

      return {
        success: true,
        message: 'AI建议执行成功',
        suggestion: suggestion,
        aiAnalysis: aiResponse.content,
        executionResult: executionResult
      }
    } catch (error) {
      console.error('执行AI建议失败:', error)
      throw error
    }
  }

  /**
   * 执行建议
   */
  async performSuggestionExecution(suggestion, aiAnalysis) {
    const results = []
    
    // 根据建议类型执行操作
    if (suggestion.type === 'create_goal') {
      const result = await this.createGoal(suggestion.goalData)
      results.push(result)
    } else if (suggestion.type === 'update_investment') {
      const result = await this.updateInvestment(suggestion.investmentData)
      results.push(result)
    } else if (suggestion.type === 'create_transaction') {
      const result = await this.createTransaction(suggestion.transactionData)
      results.push(result)
    }

    return results
  }

  // 辅助方法
  analyzeTransactionCategories(transactions) {
    const categories = {}
    transactions.forEach(t => {
      const category = t.category || '其他'
      categories[category] = (categories[category] || 0) + 1
    })
    return categories
  }

  analyzeTransactionTrends(transactions) {
    // 分析交易趋势的逻辑
    return {
      monthlyTrend: this.calculateMonthlyTrend(transactions),
      categoryTrend: this.calculateCategoryTrend(transactions)
    }
  }

  calculateReturnRate(investments) {
    if (investments.length === 0) return 0
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const totalCurrent = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0)
    return totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0
  }

  calculateInvestmentPerformance(investments) {
    // 计算投资表现
    return {
      bestPerformer: this.findBestPerformer(investments),
      worstPerformer: this.findWorstPerformer(investments),
      averageReturn: this.calculateAverageReturn(investments)
    }
  }

  calculateAverageProgress(goals) {
    if (goals.length === 0) return 0
    const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0)
    return totalProgress / goals.length
  }

  analyzeGoalCategories(goals) {
    const categories = {}
    goals.forEach(goal => {
      const category = goal.category || '其他'
      categories[category] = (categories[category] || 0) + 1
    })
    return categories
  }

  calculateMonthlySpending(spending) {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return spending.filter(s => {
      const date = new Date(s.date || s.timestamp)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).reduce((sum, s) => sum + (s.amount || 0), 0)
  }

  analyzeSpendingCategories(spending) {
    const categories = {}
    spending.forEach(s => {
      const category = s.category || '其他'
      categories[category] = (categories[category] || 0) + (s.amount || 0)
    })
    return categories
  }

  analyzeSpendingTrends(spending) {
    return {
      monthlyTrend: this.calculateMonthlyTrend(spending),
      categoryTrend: this.calculateCategoryTrend(spending)
    }
  }

  calculateSessionDuration() {
    const sessionStart = uni.getStorageSync('sessionStart')
    if (sessionStart) {
      return Date.now() - sessionStart
    }
    return 0
  }

  calculateMonthlyTrend(data) {
    // 计算月度趋势
    return []
  }

  calculateCategoryTrend(data) {
    // 计算分类趋势
    return {}
  }

  findBestPerformer(investments) {
    if (investments.length === 0) return null
    return investments.reduce((best, current) => {
      const currentReturn = (current.currentValue || current.amount || 0) - (current.amount || 0)
      const bestReturn = (best.currentValue || best.amount || 0) - (best.amount || 0)
      return currentReturn > bestReturn ? current : best
    })
  }

  findWorstPerformer(investments) {
    if (investments.length === 0) return null
    return investments.reduce((worst, current) => {
      const currentReturn = (current.currentValue || current.amount || 0) - (current.amount || 0)
      const worstReturn = (worst.currentValue || worst.amount || 0) - (worst.amount || 0)
      return currentReturn < worstReturn ? current : worst
    })
  }

  calculateAverageReturn(investments) {
    if (investments.length === 0) return 0
    const totalReturn = investments.reduce((sum, inv) => {
      return sum + ((inv.currentValue || inv.amount || 0) - (inv.amount || 0))
    }, 0)
    return totalReturn / investments.length
  }
}

// 创建单例实例
const enhancedDataOperator = new EnhancedDataOperator()

export default enhancedDataOperator

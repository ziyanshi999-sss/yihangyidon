/**
 * 项目数据分析器
 * 收集和分析用户的所有项目数据
 */

import zhipuAI from '@/api/zhipu-ai.js'
import { getSafeArray, getSafeObject, getSafeNumber } from './safe-storage.js'

class ProjectDataAnalyzer {
  constructor() {
    this.userData = null
    this.projectData = null
  }

  /**
   * 收集用户所有数据
   */
  async collectAllUserData() {
    try {
      // 获取用户基本信息
      const userInfo = this.getUserInfo()
      
      // 获取账户数据
      const accountData = this.getAccountData()
      
      // 获取交易记录
      const transactionData = this.getTransactionData()
      
      // 获取投资数据
      const investmentData = this.getInvestmentData()
      
      // 获取目标数据
      const goalData = this.getGoalData()
      
      // 获取消费数据
      const spendingData = this.getSpendingData()

      this.userData = {
        userInfo,
        accountData,
        transactionData,
        investmentData,
        goalData,
        spendingData,
        timestamp: new Date().toISOString()
      }

      return this.userData
    } catch (error) {
      console.error('收集用户数据失败:', error)
      throw error
    }
  }

  /**
   * 获取用户基本信息
   */
  getUserInfo() {
    try {
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
        investmentHorizon: userInfo.investmentHorizon || '中长期'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return {}
    }
  }

  /**
   * 获取账户数据
   */
  getAccountData() {
    try {
      const balance = uni.getStorageSync('userBalance') || 0
      const accounts = uni.getStorageSync('userAccounts') || []
      
      return {
        totalBalance: balance,
        accounts: accounts,
        accountCount: accounts.length,
        primaryAccount: accounts.find(acc => acc.isPrimary) || accounts[0] || null
      }
    } catch (error) {
      console.error('获取账户数据失败:', error)
      return { totalBalance: 0, accounts: [], accountCount: 0 }
    }
  }

  /**
   * 获取交易记录
   */
  getTransactionData() {
    try {
      const transactions = uni.getStorageSync('userTransactions') || []
      const recentTransactions = transactions.slice(-50) // 最近50笔交易
      
      // 分析交易模式
      const transactionAnalysis = this.analyzeTransactions(recentTransactions)
      
      return {
        totalTransactions: transactions.length,
        recentTransactions: recentTransactions,
        analysis: transactionAnalysis
      }
    } catch (error) {
      console.error('获取交易数据失败:', error)
      return { totalTransactions: 0, recentTransactions: [], analysis: {} }
    }
  }

  /**
   * 获取投资数据
   */
  getInvestmentData() {
    try {
      const investments = uni.getStorageSync('userInvestments') || []
      const portfolio = uni.getStorageSync('userPortfolio') || {}
      
      // 计算投资表现
      const performance = this.calculateInvestmentPerformance(investments)
      
      return {
        investments: investments,
        portfolio: portfolio,
        performance: performance,
        totalInvested: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
        currentValue: investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0)
      }
    } catch (error) {
      console.error('获取投资数据失败:', error)
      return { investments: [], portfolio: {}, performance: {}, totalInvested: 0, currentValue: 0 }
    }
  }

  /**
   * 获取目标数据
   */
  getGoalData() {
    try {
      // 使用安全的数组获取方法
      const goals = getSafeArray('userGoals', [])
      
      const activeGoals = goals.filter(goal => goal && goal.status === 'active')
      const completedGoals = goals.filter(goal => goal && goal.status === 'completed')
      
      return {
        totalGoals: goals.length,
        activeGoals: activeGoals,
        completedGoals: completedGoals,
        goalProgress: this.calculateGoalProgress(activeGoals)
      }
    } catch (error) {
      console.error('获取目标数据失败:', error)
      return { totalGoals: 0, activeGoals: [], completedGoals: [], goalProgress: 0 }
    }
  }

  /**
   * 获取消费数据
   */
  getSpendingData() {
    try {
      // 使用安全的数组获取方法
      const spending = getSafeArray('userSpending', [])
      const categories = getSafeArray('spendingCategories', [])
      
      // 分析消费模式
      const spendingAnalysis = this.analyzeSpending(spending, categories)
      
      return {
        spending: spending,
        categories: categories,
        analysis: spendingAnalysis,
        monthlySpending: this.calculateMonthlySpending(spending)
      }
    } catch (error) {
      console.error('获取消费数据失败:', error)
      return { spending: [], categories: [], analysis: {}, monthlySpending: 0 }
    }
  }

  /**
   * 分析交易模式
   */
  analyzeTransactions(transactions) {
    if (!transactions || transactions.length === 0) {
      return {
        totalAmount: 0,
        averageAmount: 0,
        frequency: 0,
        topCategories: [],
        trends: {}
      }
    }

    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const averageAmount = totalAmount / transactions.length
    
    // 按类别统计
    const categoryStats = {}
    transactions.forEach(t => {
      const category = t.category || '其他'
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })
    
    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    return {
      totalAmount,
      averageAmount,
      frequency: transactions.length,
      topCategories,
      trends: this.calculateTrends(transactions)
    }
  }

  /**
   * 计算投资表现
   */
  calculateInvestmentPerformance(investments) {
    if (!investments || investments.length === 0) {
      return {
        totalReturn: 0,
        returnRate: 0,
        bestPerformer: null,
        worstPerformer: null
      }
    }

    let totalReturn = 0
    let totalInvested = 0
    let bestReturn = -Infinity
    let worstReturn = Infinity
    let bestPerformer = null
    let worstPerformer = null

    investments.forEach(inv => {
      const invested = inv.amount || 0
      const current = inv.currentValue || inv.amount || 0
      const return_ = current - invested
      const returnRate = invested > 0 ? (return_ / invested) * 100 : 0

      totalReturn += return_
      totalInvested += invested

      if (returnRate > bestReturn) {
        bestReturn = returnRate
        bestPerformer = inv
      }
      if (returnRate < worstReturn) {
        worstReturn = returnRate
        worstPerformer = inv
      }
    })

    const overallReturnRate = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

    return {
      totalReturn,
      returnRate: overallReturnRate,
      bestPerformer: bestPerformer ? { ...bestPerformer, returnRate: bestReturn } : null,
      worstPerformer: worstPerformer ? { ...worstPerformer, returnRate: worstReturn } : null
    }
  }

  /**
   * 计算目标进度
   */
  calculateGoalProgress(goals) {
    if (!goals || goals.length === 0) return 0

    const totalProgress = goals.reduce((sum, goal) => {
      return sum + (goal.progress || 0)
    }, 0)

    return totalProgress / goals.length
  }

  /**
   * 分析消费模式
   */
  analyzeSpending(spending, categories) {
    if (!spending || spending.length === 0) {
      return {
        totalSpent: 0,
        averageSpent: 0,
        topCategories: [],
        monthlyTrend: []
      }
    }

    const totalSpent = spending.reduce((sum, s) => sum + (s.amount || 0), 0)
    const averageSpent = totalSpent / spending.length

    // 按类别统计
    const categoryStats = {}
    spending.forEach(s => {
      const category = s.category || '其他'
      categoryStats[category] = (categoryStats[category] || 0) + (s.amount || 0)
    })

    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }))

    return {
      totalSpent,
      averageSpent,
      topCategories,
      monthlyTrend: this.calculateMonthlyTrend(spending)
    }
  }

  /**
   * 计算月度消费
   */
  calculateMonthlySpending(spending) {
    if (!spending || spending.length === 0) return 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlySpending = spending.filter(s => {
      const date = new Date(s.date || s.timestamp)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    return monthlySpending.reduce((sum, s) => sum + (s.amount || 0), 0)
  }

  /**
   * 计算趋势
   */
  calculateTrends(data) {
    if (!data || data.length < 2) return {}

    const sorted = data.sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp))
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    
    const firstAmount = first.amount || 0
    const lastAmount = last.amount || 0
    
    const trend = lastAmount > firstAmount ? 'increasing' : lastAmount < firstAmount ? 'decreasing' : 'stable'
    const changeRate = firstAmount > 0 ? ((lastAmount - firstAmount) / firstAmount) * 100 : 0

    return {
      trend,
      changeRate,
      firstValue: firstAmount,
      lastValue: lastAmount
    }
  }

  /**
   * 计算月度趋势
   */
  calculateMonthlyTrend(spending) {
    if (!spending || spending.length === 0) return []

    const monthlyData = {}
    spending.forEach(s => {
      const date = new Date(s.date || s.timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (s.amount || 0)
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }))
  }

  /**
   * 使用AI分析数据
   */
  async analyzeWithAI() {
    try {
      if (!this.userData) {
        await this.collectAllUserData()
      }

      // 使用智谱AI分析财务状况
      const analysis = await zhipuAI.analyzeFinancialStatus({
        totalAssets: this.userData.accountData.totalBalance,
        riskProfile: this.userData.userInfo.riskProfile,
        age: this.userData.userInfo.age,
        monthlyIncome: this.userData.userInfo.monthlyIncome,
        monthlyExpense: this.userData.userInfo.monthlyExpense,
        portfolio: this.userData.investmentData.portfolio,
        investments: this.userData.investmentData.investments,
        goals: this.userData.goalData.activeGoals,
        spending: this.userData.spendingData.analysis
      })

      return {
        success: analysis.success,
        data: this.userData,
        aiAnalysis: analysis.content,
        error: analysis.error
      }
    } catch (error) {
      console.error('AI分析失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 生成智能建议
   */
  async generateSmartAdvice() {
    try {
      if (!this.userData) {
        await this.collectAllUserData()
      }

      const advice = await zhipuAI.generateInvestmentAdvice(
        {
          marketTrend: 'stable',
          interestRate: 3.5,
          inflation: 2.1
        },
        {
          riskTolerance: this.userData.userInfo.riskProfile,
          investmentGoals: this.userData.userInfo.investmentGoals,
          investmentHorizon: this.userData.userInfo.investmentHorizon,
          currentAssets: this.userData.accountData.totalBalance
        }
      )

      return {
        success: advice.success,
        advice: advice.content,
        error: advice.error
      }
    } catch (error) {
      console.error('生成建议失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建单例实例
const projectDataAnalyzer = new ProjectDataAnalyzer()

export default projectDataAnalyzer



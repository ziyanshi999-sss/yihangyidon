/**
 * 交易记录API
 * 提供交易记录的增删改查功能
 */

import dataConnector from '../../db/data-connector.js'

// 获取当前用户ID
function getCurrentUserId() {
  try {
    const users = uni.getStorageSync('users') || []
    const currentUser = users.find(user => user.isLoggedIn)
    return currentUser ? currentUser.id : null
  } catch (error) {
    console.error('获取当前用户ID失败:', error)
    return null
  }
}

/**
 * 获取用户交易记录
 * @param {string} userId - 用户ID，可选，默认使用当前登录用户
 * @returns {Promise<Array>} 交易记录列表
 */
export async function getTransactionRecords(userId = null) {
  try {
    const targetUserId = userId || getCurrentUserId()
    if (!targetUserId) {
      throw new Error('用户未登录')
    }

    const connector = dataConnector.default
    if (!connector.isInitialized) {
      await connector.init()
    }

    const transactions = await connector.getUserTransactions(targetUserId)
    console.log('✅ 获取交易记录成功:', transactions.length, '条')
    return transactions
  } catch (error) {
    console.error('❌ 获取交易记录失败:', error)
    throw error
  }
}

/**
 * 添加交易记录
 * @param {Object} transaction - 交易记录对象
 * @param {string} transaction.type - 交易类型: 'income' | 'expense'
 * @param {string} transaction.category - 交易分类
 * @param {number} transaction.amount - 交易金额
 * @param {string} transaction.description - 交易描述
 * @param {string} transaction.source - 交易来源
 * @param {string} transaction.reference - 交易编号
 * @param {string} userId - 用户ID，可选，默认使用当前登录用户
 * @returns {Promise<Object>} 新创建的交易记录
 */
export async function addTransactionRecord(transaction, userId = null) {
  try {
    const targetUserId = userId || getCurrentUserId()
    if (!targetUserId) {
      throw new Error('用户未登录')
    }

    if (!transaction.type || !transaction.amount) {
      throw new Error('交易类型和金额不能为空')
    }

    const connector = dataConnector.default
    if (!connector.isInitialized) {
      await connector.init()
    }

    // 获取当前用户余额
    const users = await connector.getUsers()
    const currentUser = users.find(u => u.id === targetUserId)
    const currentBalance = currentUser ? currentUser.balance : 0

    // 计算交易后余额
    let newBalance = currentBalance
    if (transaction.type === 'income') {
      newBalance = currentBalance + transaction.amount
    } else if (transaction.type === 'expense') {
      newBalance = currentBalance - transaction.amount
    }

    // 构建完整的交易记录
    const fullTransaction = {
      type: transaction.type,
      category: transaction.category || 'other',
      amount: transaction.amount,
      description: transaction.description || '',
      source: transaction.source || '',
      reference: transaction.reference || `TX${Date.now()}`,
      balance: newBalance,
      icon: getTransactionIcon(transaction.type, transaction.category),
      title: getTransactionTitle(transaction.type, transaction.category),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      status: transaction.status || 'completed'
    }

    const newRecord = await connector.addTransactionRecord(targetUserId, fullTransaction)
    
    // 更新本地存储
    await updateLocalStorage(targetUserId)
    
    console.log('✅ 添加交易记录成功:', newRecord)
    return newRecord
  } catch (error) {
    console.error('❌ 添加交易记录失败:', error)
    throw error
  }
}

/**
 * 更新交易记录
 * @param {string} transactionId - 交易记录ID
 * @param {Object} updates - 更新内容
 * @param {string} userId - 用户ID，可选，默认使用当前登录用户
 * @returns {Promise<Object>} 更新后的交易记录
 */
export async function updateTransactionRecord(transactionId, updates, userId = null) {
  try {
    const targetUserId = userId || getCurrentUserId()
    if (!targetUserId) {
      throw new Error('用户未登录')
    }

    const connector = dataConnector.default
    if (!connector.isInitialized) {
      await connector.init()
    }

    const updatedRecord = await connector.updateTransactionRecord(targetUserId, transactionId, updates)
    
    // 更新本地存储
    await updateLocalStorage(targetUserId)
    
    console.log('✅ 更新交易记录成功:', updatedRecord)
    return updatedRecord
  } catch (error) {
    console.error('❌ 更新交易记录失败:', error)
    throw error
  }
}

/**
 * 获取交易统计信息
 * @param {string} userId - 用户ID，可选，默认使用当前登录用户
 * @param {string} period - 统计周期: 'today' | 'week' | 'month' | 'all'
 * @returns {Promise<Object>} 统计信息
 */
export async function getTransactionStats(userId = null, period = 'all') {
  try {
    const targetUserId = userId || getCurrentUserId()
    if (!targetUserId) {
      throw new Error('用户未登录')
    }

    const transactions = await getTransactionRecords(targetUserId)
    
    // 根据周期筛选交易记录
    const filteredTransactions = filterTransactionsByPeriod(transactions, period)
    
    // 计算统计信息
    const stats = {
      totalTransactions: filteredTransactions.length,
      totalIncome: 0,
      totalExpense: 0,
      incomeCount: 0,
      expenseCount: 0,
      categories: {},
      period: period
    }

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        stats.totalIncome += transaction.amount || 0
        stats.incomeCount++
      } else if (transaction.type === 'expense') {
        stats.totalExpense += transaction.amount || 0
        stats.expenseCount++
      }

      // 统计分类
      const category = transaction.category || 'other'
      if (!stats.categories[category]) {
        stats.categories[category] = {
          count: 0,
          amount: 0,
          type: transaction.type
        }
      }
      stats.categories[category].count++
      stats.categories[category].amount += transaction.amount || 0
    })

    console.log('✅ 获取交易统计成功:', stats)
    return stats
  } catch (error) {
    console.error('❌ 获取交易统计失败:', error)
    throw error
  }
}

/**
 * 根据周期筛选交易记录
 * @param {Array} transactions - 交易记录列表
 * @param {string} period - 周期
 * @returns {Array} 筛选后的交易记录
 */
function filterTransactionsByPeriod(transactions, period) {
  if (period === 'all') {
    return transactions
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.timestamp)
    switch (period) {
      case 'today':
        return transactionDate >= today
      case 'week':
        return transactionDate >= weekAgo
      case 'month':
        return transactionDate >= monthAgo
      default:
        return true
    }
  })
}

/**
 * 获取交易图标
 * @param {string} type - 交易类型
 * @param {string} category - 交易分类
 * @returns {string} 图标
 */
function getTransactionIcon(type, category) {
  const iconMap = {
    income: {
      salary: '💰',
      investment: '📊',
      refund: '↩️',
      default: '💰'
    },
    expense: {
      utility: '💧',
      transfer: '💸',
      investment: '📈',
      shopping: '🛒',
      food: '🍽️',
      transport: '🚇',
      default: '💳'
    }
  }

  return iconMap[type]?.[category] || iconMap[type]?.default || '💳'
}

/**
 * 获取交易标题
 * @param {string} type - 交易类型
 * @param {string} category - 交易分类
 * @returns {string} 标题
 */
function getTransactionTitle(type, category) {
  const titleMap = {
    income: {
      salary: '工资收入',
      investment: '理财收益',
      refund: '退款到账',
      default: '收入'
    },
    expense: {
      utility: '生活缴费',
      transfer: '转账',
      investment: '理财投资',
      shopping: '网上购物',
      food: '餐厅用餐',
      transport: '交通出行',
      default: '支出'
    }
  }

  return titleMap[type]?.[category] || titleMap[type]?.default || '交易'
}

/**
 * 更新本地存储
 * @param {string} userId - 用户ID
 */
async function updateLocalStorage(userId) {
  try {
    const connector = dataConnector.default
    const users = await connector.getUsers()
    const updatedUser = users.find(u => u.id === userId)
    
    if (updatedUser) {
      // 更新本地存储中的用户数据
      const localUsers = uni.getStorageSync('users') || []
      const localUserIndex = localUsers.findIndex(u => u.id === userId)
      
      if (localUserIndex !== -1) {
        localUsers[localUserIndex] = updatedUser
        uni.setStorageSync('users', localUsers)
        console.log('✅ 本地存储更新成功')
      }
      
      // 同时更新currentUser
      uni.setStorageSync('currentUser', updatedUser)
      console.log('✅ currentUser更新成功')
    }
  } catch (error) {
    console.error('❌ 更新本地存储失败:', error)
  }
}

/**
 * 创建测试交易记录
 * @param {string} userId - 用户ID，可选，默认使用当前登录用户
 * @returns {Promise<Object>} 创建的测试交易记录
 */
export async function createTestTransaction(userId = null) {
  try {
    const testTransaction = {
      type: 'expense',
      category: 'shopping',
      amount: Math.floor(Math.random() * 500) + 50,
      description: '测试交易 - ' + new Date().toLocaleTimeString(),
      source: '测试商户',
      reference: `TEST${Date.now()}`
    }

    return await addTransactionRecord(testTransaction, userId)
  } catch (error) {
    console.error('❌ 创建测试交易记录失败:', error)
    throw error
  }
}

export default {
  getTransactionRecords,
  addTransactionRecord,
  updateTransactionRecord,
  getTransactionStats,
  createTestTransaction
}

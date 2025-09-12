/**
 * 财富管理API服务
 * 从user.json中读取财富相关数据
 */

import { getUsersData, updateUser } from '@/data/users.js'
import { getStorage, setStorage } from '@/utils/storage'

/**
 * 获取当前用户的财富数据
 * @returns {Object} 财富数据
 */
export function getCurrentUserWealthData() {
  // 首先尝试从本地存储获取数据
  let users = uni.getStorageSync('users')
  
  if (!users || users.length === 0) {
    // 如果本地存储没有数据，从getUsersData获取
    users = getUsersData()
  }
  
  const currentUserId = getCurrentUserId()
  const currentUser = users.find(user => user.id === currentUserId) || users[0]
  
  return {
    deposits: currentUser.wealthProducts?.deposits || {
      current: 0,
      fixed: 0,
      smart: 0
    },
    investments: currentUser.wealthProducts?.investments || [],
    investmentPortfolio: currentUser.investmentPortfolio || {
      totalValue: 0,
      totalReturn: 0,
      returnRate: 0,
      holdings: []
    },
    depositProducts: currentUser.depositProducts || {
      current: { rate: 0.35, features: [], riskWarning: '' },
      fixed: [],
      smart: { rate: 2.8, features: [], riskWarning: '' }
    },
    insuranceProducts: currentUser.insuranceProducts || {
      categories: [
        {
          id: 'life',
          name: '人寿保险',
          icon: '👨‍👩‍👧‍👦',
          color: '#FF6B35',
          products: [
            {
              id: 'life001',
              name: '终身寿险',
              type: '人寿保险',
              premium: 5000,
              coverage: 500000,
              term: '终身',
              features: ['终身保障', '现金价值', '分红收益'],
              riskLevel: '低风险',
              status: '在售'
            },
            {
              id: 'life002',
              name: '定期寿险',
              type: '人寿保险',
              premium: 2000,
              coverage: 300000,
              term: '20年',
              features: ['高保障', '低保费', '灵活选择'],
              riskLevel: '低风险',
              status: '在售'
            }
          ]
        },
        {
          id: 'health',
          name: '健康保险',
          icon: '🏥',
          color: '#34C759',
          products: [
            {
              id: 'health001',
              name: '重疾保险',
              type: '健康保险',
              premium: 3000,
              coverage: 200000,
              term: '终身',
              features: ['重疾保障', '轻症赔付', '豁免保费'],
              riskLevel: '中风险',
              status: '在售'
            },
            {
              id: 'health002',
              name: '医疗保险',
              type: '健康保险',
              premium: 800,
              coverage: 100000,
              term: '1年',
              features: ['住院保障', '门诊报销', '无免赔额'],
              riskLevel: '低风险',
              status: '在售'
            }
          ]
        },
        {
          id: 'accident',
          name: '意外保险',
          icon: '🛡️',
          color: '#FF9500',
          products: [
            {
              id: 'accident001',
              name: '综合意外险',
              type: '意外保险',
              premium: 200,
              coverage: 100000,
              term: '1年',
              features: ['意外身故', '意外伤残', '意外医疗'],
              riskLevel: '低风险',
              status: '在售'
            }
          ]
        }
      ]
    },
    forexProducts: currentUser.forexProducts || {
      majorPairs: [
        {
          code: 'USD/CNY',
          name: '美元/人民币',
          price: '7.2345',
          change: '+0.0123',
          changePercent: '+0.17%',
          trend: 'up'
        },
        {
          code: 'EUR/CNY',
          name: '欧元/人民币',
          price: '7.8901',
          change: '-0.0234',
          changePercent: '-0.30%',
          trend: 'down'
        },
        {
          code: 'GBP/CNY',
          name: '英镑/人民币',
          price: '9.1234',
          change: '+0.0456',
          changePercent: '+0.50%',
          trend: 'up'
        },
        {
          code: 'JPY/CNY',
          name: '日元/人民币',
          price: '0.0489',
          change: '-0.0001',
          changePercent: '-0.20%',
          trend: 'down'
        }
      ],
      tradingPairs: [
        {
          id: 'forex001',
          pair: 'USD/CNY',
          buyPrice: '7.2345',
          sellPrice: '7.2340',
          spread: '0.0005',
          status: '可交易'
        },
        {
          id: 'forex002',
          pair: 'EUR/CNY',
          buyPrice: '7.8901',
          sellPrice: '7.8896',
          spread: '0.0005',
          status: '可交易'
        },
        {
          id: 'forex003',
          pair: 'GBP/CNY',
          buyPrice: '9.1234',
          sellPrice: '9.1229',
          spread: '0.0005',
          status: '可交易'
        }
      ]
    }
  }
}

/**
 * 获取存款产品数据
 * @returns {Object} 存款产品数据
 */
export function getDepositProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.depositProducts
}

/**
 * 获取理财产品数据
 * @returns {Array} 理财产品数据
 */
export function getWealthProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.investments
}

/**
 * 获取保险产品数据
 * @returns {Object} 保险产品数据
 */
export function getInsuranceProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.insuranceProducts
}

/**
 * 获取外汇产品数据
 * @returns {Object} 外汇产品数据
 */
export function getForexProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.forexProducts
}

/**
 * 获取投资组合数据
 * @returns {Object} 投资组合数据
 */
export function getInvestmentPortfolio() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.investmentPortfolio
}

/**
 * 获取存款利率数据
 * @returns {Object} 存款利率数据
 */
export function getDepositRates() {
  const depositProducts = getDepositProducts()
  
  return {
    current: {
      rate: depositProducts.current?.rate || 0.35,
      features: depositProducts.current?.features || ['随时存取', '灵活方便', '安全可靠'],
      riskWarning: depositProducts.current?.riskWarning || '存款保险保障，风险极低'
    },
    fixed: depositProducts.fixed || [
      { term: '3个月', rate: 1.85, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '6个月', rate: 2.05, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '1年', rate: 2.10, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '2年', rate: 2.60, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '3年', rate: 2.95, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '5年', rate: 3.20, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' }
    ],
    smart: {
      rate: depositProducts.smart?.rate || 2.8,
      features: depositProducts.smart?.features || ['智能计息', '灵活存取', '收益优化'],
      riskWarning: depositProducts.smart?.riskWarning || '存款保险保障，风险极低'
    }
  }
}

/**
 * 获取理财产品分类数据
 * @returns {Array} 理财产品分类数据
 */
export function getWealthProductCategories() {
  const investments = getWealthProducts()
  
  // 根据投资类型分组
  const categories = [
    {
      id: 'low-risk',
      name: '低风险理财',
      icon: '🛡️',
      color: '#34C759',
      products: investments.filter(inv => inv.rate <= 4.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 1000,
        term: inv.term,
        riskLevel: '低风险',
        features: ['保本保息', '收益稳定', '风险极低'],
        status: inv.status,
        description: '适合稳健型投资者，风险极低，收益稳定'
      }))
    },
    {
      id: 'medium-risk',
      name: '中风险理财',
      icon: '⚖️',
      color: '#FF9500',
      products: investments.filter(inv => inv.rate > 4.0 && inv.rate <= 6.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 5000,
        term: inv.term,
        riskLevel: '中风险',
        features: ['收益较高', '风险适中', '期限灵活'],
        status: inv.status,
        description: '适合平衡型投资者，风险适中，收益较高'
      }))
    },
    {
      id: 'high-risk',
      name: '高风险理财',
      icon: '🚀',
      color: '#FF3B30',
      products: investments.filter(inv => inv.rate > 6.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 10000,
        term: inv.term,
        riskLevel: '高风险',
        features: ['高收益', '高风险', '专业投资'],
        status: inv.status,
        description: '适合激进型投资者，高风险高收益'
      }))
    }
  ]
  
  // 如果没有数据，返回默认数据
  if (investments.length === 0) {
    return [
      {
        id: 'low-risk',
        name: '低风险理财',
        icon: '🛡️',
        color: '#34C759',
        products: [
          {
            id: 'default001',
            name: '稳健理财A',
            type: '理财产品',
            yield: 3.8,
            minAmount: 1000,
            term: '90天',
            riskLevel: '低风险',
            features: ['保本保息', '收益稳定', '风险极低'],
            status: '在售',
            description: '适合稳健型投资者，风险极低，收益稳定'
          }
        ]
      },
      {
        id: 'medium-risk',
        name: '中风险理财',
        icon: '⚖️',
        color: '#FF9500',
        products: [
          {
            id: 'default002',
            name: '平衡理财B',
            type: '理财产品',
            yield: 4.5,
            minAmount: 5000,
            term: '180天',
            riskLevel: '中风险',
            features: ['收益较高', '风险适中', '期限灵活'],
            status: '在售',
            description: '适合平衡型投资者，风险适中，收益较高'
          }
        ]
      },
      {
        id: 'high-risk',
        name: '高风险理财',
        icon: '🚀',
        color: '#FF3B30',
        products: [
          {
            id: 'default003',
            name: '成长理财C',
            type: '理财产品',
            yield: 6.5,
            minAmount: 10000,
            term: '365天',
            riskLevel: '高风险',
            features: ['高收益', '高风险', '专业投资'],
            status: '在售',
            description: '适合激进型投资者，高风险高收益'
          }
        ]
      }
    ]
  }
  
  return categories
}

/**
 * 获取保险产品分类数据
 * @returns {Array} 保险产品分类数据
 */
export function getInsuranceCategories() {
  const insuranceProducts = getInsuranceProducts()
  return insuranceProducts.categories || []
}

/**
 * 获取外汇主要货币对数据
 * @returns {Array} 外汇主要货币对数据
 */
export function getForexMajorPairs() {
  const forexProducts = getForexProducts()
  return forexProducts.majorPairs || []
}

/**
 * 获取外汇交易货币对数据
 * @returns {Array} 外汇交易货币对数据
 */
export function getForexTradingPairs() {
  const forexProducts = getForexProducts()
  return forexProducts.tradingPairs || []
}

/**
 * 更新用户财富数据
 * @param {string} userId 用户ID
 * @param {Object} wealthData 财富数据
 * @returns {boolean} 更新是否成功
 */
export function updateUserWealthData(userId, wealthData) {
  try {
    // 更新用户数据
    const success = updateUser(userId, wealthData)
    
    if (success) {
      // 同步到本地存储
      syncWealthDataToStorage(userId, wealthData)
      
      // 触发数据更新事件
      uni.$emit('wealthDataUpdated', { userId, wealthData })
      
      console.log('财富数据更新成功:', userId, wealthData)
      return true
    }
    return false
  } catch (error) {
    console.error('更新财富数据失败:', error)
    return false
  }
}

/**
 * 同步财富数据到本地存储
 * @param {string} userId 用户ID
 * @param {Object} wealthData 财富数据
 */
function syncWealthDataToStorage(userId, wealthData) {
  try {
    // 获取当前本地存储的财富数据
    const localWealthData = getStorage('wealthData', true) || {}
    
    // 更新对应用户的财富数据
    localWealthData[userId] = {
      ...localWealthData[userId],
      ...wealthData,
      lastUpdateTime: new Date().toISOString()
    }
    
    // 保存到本地存储
    setStorage('wealthData', localWealthData, true)
    
    console.log('财富数据已同步到本地存储:', userId)
  } catch (error) {
    console.error('同步财富数据到本地存储失败:', error)
  }
}

/**
 * 从本地存储获取财富数据
 * @param {string} userId 用户ID
 * @returns {Object} 财富数据
 */
export function getWealthDataFromStorage(userId) {
  try {
    const localWealthData = getStorage('wealthData', true) || {}
    return localWealthData[userId] || null
  } catch (error) {
    console.error('从本地存储获取财富数据失败:', error)
    return null
  }
}

/**
 * 同步本地存储的财富数据到用户数据
 * @param {string} userId 用户ID
 */
export function syncStorageToUserData(userId) {
  try {
    const localWealthData = getWealthDataFromStorage(userId)
    if (localWealthData) {
      updateUser(userId, localWealthData)
      console.log('本地存储财富数据已同步到用户数据:', userId)
    }
  } catch (error) {
    console.error('同步本地存储到用户数据失败:', error)
  }
}

/**
 * 添加投资记录
 * @param {string} userId 用户ID
 * @param {Object} investment 投资记录
 * @returns {boolean} 添加是否成功
 */
export function addInvestmentRecord(userId, investment) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      if (!user.wealthProducts) {
        user.wealthProducts = { investments: [] }
      }
      if (!user.wealthProducts.investments) {
        user.wealthProducts.investments = []
      }
      
      // 添加投资记录
      const newInvestment = {
        ...investment,
        id: `inv${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        status: '持有中'
      }
      user.wealthProducts.investments.push(newInvestment)
      
      // 更新用户数据并同步
      updateUserWealthData(userId, { wealthProducts: user.wealthProducts })
      
      // 更新投资组合数据
      updateInvestmentPortfolio(userId)
      
      console.log('投资记录添加成功:', newInvestment)
      return true
    }
    return false
  } catch (error) {
    console.error('添加投资记录失败:', error)
    return false
  }
}

/**
 * 更新投资组合数据
 * @param {string} userId 用户ID
 */
function updateInvestmentPortfolio(userId) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user && user.wealthProducts && user.wealthProducts.investments) {
      const investments = user.wealthProducts.investments
      
      // 计算总投资价值和收益
      const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0)
      const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0)
      const totalReturn = totalValue - totalAmount
      const returnRate = totalAmount > 0 ? (totalReturn / totalAmount) * 100 : 0
      
      // 更新投资组合
      const investmentPortfolio = {
        totalValue,
        totalReturn,
        returnRate: parseFloat(returnRate.toFixed(2)),
        holdings: investments
      }
      
      updateUserWealthData(userId, { investmentPortfolio })
    }
  } catch (error) {
    console.error('更新投资组合失败:', error)
  }
}

/**
 * 添加存款记录
 * @param {string} userId 用户ID
 * @param {string} type 存款类型 (current/fixed/smart)
 * @param {number} amount 存款金额
 * @returns {boolean} 添加是否成功
 */
export function addDepositRecord(userId, type, amount) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      if (!user.wealthProducts) {
        user.wealthProducts = { deposits: { current: 0, fixed: 0, smart: 0 } }
      }
      if (!user.wealthProducts.deposits) {
        user.wealthProducts.deposits = { current: 0, fixed: 0, smart: 0 }
      }
      
      // 更新存款金额
      user.wealthProducts.deposits[type] = (user.wealthProducts.deposits[type] || 0) + amount
      
      // 更新用户数据并同步
      updateUserWealthData(userId, { wealthProducts: user.wealthProducts })
      
      // 更新账户余额（从主账户扣除存款金额）
      updateUserBalance(userId, -amount, `存款-${type}`)
      
      console.log('存款记录添加成功:', { type, amount })
      return true
    }
    return false
  } catch (error) {
    console.error('添加存款记录失败:', error)
    return false
  }
}

/**
 * 更新用户账户余额
 * @param {string} userId 用户ID
 * @param {number} amount 金额变化（正数为收入，负数为支出）
 * @param {string} description 交易描述
 */
function updateUserBalance(userId, amount, description) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      // 更新余额
      user.balance = (user.balance || 0) + amount
      
      // 添加交易记录
      if (!user.transactionRecords) {
        user.transactionRecords = []
      }
      
      const transaction = {
        id: Date.now(),
        type: amount > 0 ? 'income' : 'expense',
        amount: Math.abs(amount),
        description,
        balance: user.balance,
        timestamp: new Date().toISOString(),
        icon: amount > 0 ? '💰' : '💳',
        title: description,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      user.transactionRecords.unshift(transaction)
      
      // 更新用户数据
      updateUser(userId, { 
        balance: user.balance, 
        transactionRecords: user.transactionRecords 
      })
      
      // 触发余额更新事件
      uni.$emit('balanceUpdated', { userId, balance: user.balance, transaction })
      
      console.log('用户余额更新成功:', { userId, balance: user.balance })
    }
  } catch (error) {
    console.error('更新用户余额失败:', error)
  }
}

/**
 * 获取当前用户ID
 * @returns {string} 用户ID
 */
export function getCurrentUserId() {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    return userInfo?.id || 'u001' // 默认返回第一个用户
  } catch (error) {
    console.error('获取当前用户ID失败:', error)
    return 'u001'
  }
}

/**
 * 初始化财富数据同步
 * 在应用启动时调用，确保数据一致性
 */
export function initWealthDataSync() {
  try {
    const userId = getCurrentUserId()
    
    // 同步本地存储到用户数据
    syncStorageToUserData(userId)
    
    // 监听数据更新事件
    uni.$on('wealthDataUpdated', (data) => {
      console.log('财富数据更新事件:', data)
      // 可以在这里添加其他页面的数据同步逻辑
    })
    
    uni.$on('balanceUpdated', (data) => {
      console.log('余额更新事件:', data)
      // 可以在这里更新其他页面的余额显示
    })
    
    console.log('财富数据同步初始化完成')
  } catch (error) {
    console.error('初始化财富数据同步失败:', error)
  }
}

/**
 * 购买理财产品
 * @param {string} userId 用户ID
 * @param {Object} product 产品信息
 * @param {number} amount 购买金额
 * @returns {boolean} 购买是否成功
 */
export function purchaseWealthProduct(userId, product, amount) {
  try {
    // 检查余额是否足够
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (!user || user.balance < amount) {
      console.log('余额不足，无法购买')
      return false
    }
    
    // 创建投资记录
    const investment = {
      name: product.name,
      type: product.type || '理财产品',
      amount: amount,
      rate: product.rate || 0,
      term: product.term || '开放式',
      currentValue: amount // 初始价值等于购买金额
    }
    
    // 添加投资记录
    const success = addInvestmentRecord(userId, investment)
    
    if (success) {
      // 更新余额（扣除购买金额）
      updateUserBalance(userId, -amount, `购买${product.name}`)
      
      console.log('理财产品购买成功:', { product: product.name, amount })
      return true
    }
    
    return false
  } catch (error) {
    console.error('购买理财产品失败:', error)
    return false
  }
}

/**
 * 购买保险产品
 * @param {string} userId 用户ID
 * @param {Object} product 保险产品信息
 * @returns {boolean} 购买是否成功
 */
export function purchaseInsuranceProduct(userId, product) {
  try {
    const premium = product.premium || 0
    
    // 检查余额是否足够
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (!user || user.balance < premium) {
      console.log('余额不足，无法购买保险')
      return false
    }
    
    // 更新余额（扣除保费）
    updateUserBalance(userId, -premium, `购买${product.name}保险`)
    
    // 可以在这里添加保险记录到用户数据
    console.log('保险产品购买成功:', { product: product.name, premium })
    return true
  } catch (error) {
    console.error('购买保险产品失败:', error)
    return false
  }
}
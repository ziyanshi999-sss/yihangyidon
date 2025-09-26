// 支付相关API
import { getUserInfo } from '@/utils/auth.js'

/**
 * 验证支付密码
 * @param {string} password 支付密码
 * @returns {Promise<boolean>} 密码是否正确
 */
export function verifyPaymentPassword(password) {
  return new Promise((resolve, reject) => {
    try {
      console.log('=== 支付密码验证开始 ===')
      
      // 参数验证
      if (!password || typeof password !== 'string') {
        console.error('支付密码参数无效:', password)
        resolve(false)
        return
      }
      
      // 获取用户信息
      const userInfo = await getUserInfo()
      if (!userInfo) {
        console.error('用户未登录')
        reject(new Error('用户未登录'))
        return
      }
      
      console.log('用户信息获取成功:', {
        id: userInfo.id,
        username: userInfo.username,
        phone: userInfo.phone,
        hasTransactionPassword: !!userInfo.transactionPassword,
        storedPassword: userInfo.transactionPassword,
        storedPasswordType: typeof userInfo.transactionPassword,
        storedPasswordLength: userInfo.transactionPassword?.length
      })
      
      // 验证密码
      const isCorrect = userInfo.transactionPassword === password
      
      console.log('密码验证详情:', {
        inputPassword: password,
        inputPasswordType: typeof password,
        inputPasswordLength: password.length,
        storedPassword: userInfo.transactionPassword,
        storedPasswordType: typeof userInfo.transactionPassword,
        storedPasswordLength: userInfo.transactionPassword?.length,
        exactMatch: userInfo.transactionPassword === password,
        result: isCorrect
      })
      
      if (isCorrect) {
        console.log('✅ 支付密码验证成功')
      } else {
        console.log('❌ 支付密码验证失败')
      }
      
      console.log('=== 支付密码验证结束 ===')
      resolve(isCorrect)
      
    } catch (error) {
      console.error('验证支付密码异常:', error)
      reject(error)
    }
  })
}

/**
 * 执行信用卡还款
 * @param {Object} params 还款参数
 * @param {string} params.cardNumber 信用卡号
 * @param {number} params.amount 还款金额
 * @param {string} params.password 支付密码
 * @returns {Promise<{success: boolean, message: string, newBalance?: number, newCardBalance?: number}>}
 */
export function executeCreditCardRepayment(params) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('=== 信用卡还款开始 ===')
      console.log('还款参数:', params)
      
      const { cardNumber, amount, password } = params
      
      // 参数验证
      if (!cardNumber || !amount || !password) {
        resolve({
          success: false,
          message: '还款参数不完整'
        })
        return
      }
      
      // 验证支付密码
      const passwordValid = await verifyPaymentPassword(password)
      if (!passwordValid) {
        resolve({
          success: false,
          message: '支付密码错误'
        })
        return
      }
      
      // 获取用户信息
      const userInfo = await getUserInfo()
      if (!userInfo) {
        resolve({
          success: false,
          message: '用户未登录'
        })
        return
      }
      
      // 检查账户余额
      const currentBalance = userInfo.balance || 0
      if (currentBalance < amount) {
        resolve({
          success: false,
          message: '账户余额不足'
        })
        return
      }
      
      // 查找信用卡
      const creditCards = userInfo.creditCards || []
      const cardIndex = creditCards.findIndex(card => card.cardNumber === cardNumber)
      
      if (cardIndex === -1) {
        resolve({
          success: false,
          message: '未找到指定的信用卡'
        })
        return
      }
      
      const card = creditCards[cardIndex]
      const currentCardBalance = card.currentBalance || 0
      
      // 检查还款金额
      if (amount > currentCardBalance) {
        resolve({
          success: false,
          message: '还款金额不能超过当前欠款'
        })
        return
      }
      
      // 执行还款操作
      const newBalance = currentBalance - amount
      const newCardBalance = currentCardBalance - amount
      const newAvailableCredit = card.creditLimit - newCardBalance
      
      // 更新用户余额
      userInfo.balance = newBalance
      userInfo.lastUpdateTime = new Date().toISOString()
      
      // 更新信用卡信息
      creditCards[cardIndex] = {
        ...card,
        currentBalance: newCardBalance,
        availableCredit: newAvailableCredit,
        lastStatementDate: new Date().toISOString().split('T')[0]
      }
      
      userInfo.creditCards = creditCards
      
      // 更新本地存储
      uni.setStorageSync('userInfo', userInfo)
      uni.setStorageSync('currentUser', userInfo)
      
      // 更新数据库
      updateUserInDatabase(userInfo)
      
      // 记录交易记录
      addTransactionRecord(userInfo, amount, cardNumber, newBalance)
      
      console.log('✅ 信用卡还款成功:', {
        amount: amount,
        newBalance: newBalance,
        newCardBalance: newCardBalance
      })
      
      resolve({
        success: true,
        message: '还款成功',
        newBalance: newBalance,
        newCardBalance: newCardBalance,
        newAvailableCredit: newAvailableCredit
      })
      
    } catch (error) {
      console.error('信用卡还款失败:', error)
      resolve({
        success: false,
        message: '还款失败，请重试'
      })
    }
  })
}

/**
 * 更新数据库中的用户信息
 * @param {Object} userInfo 用户信息
 */
function updateUserInDatabase(userInfo) {
  try {
    const users = uni.getStorageSync('users') || []
    const userIndex = users.findIndex(user => user.id === userInfo.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userInfo }
      uni.setStorageSync('users', users)
      console.log('✅ 用户数据更新成功')
    }
  } catch (error) {
    console.error('❌ 更新用户数据失败:', error)
  }
}

/**
 * 添加交易记录
 * @param {Object} userInfo 用户信息
 * @param {number} amount 还款金额
 * @param {string} cardNumber 信用卡号
 * @param {number} newBalance 新余额
 */
function addTransactionRecord(userInfo, amount, cardNumber, newBalance) {
  try {
    if (!userInfo.transactionRecords) {
      userInfo.transactionRecords = []
    }
    
    const newRecord = {
      id: Date.now(),
      type: 'expense',
      amount: amount,
      description: `信用卡还款 - ${cardNumber.slice(-4)}`,
      balance: newBalance,
      timestamp: new Date().toISOString(),
      icon: '💳',
      title: '信用卡还款',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    userInfo.transactionRecords.unshift(newRecord)
    
    // 只保留最近100条记录
    if (userInfo.transactionRecords.length > 100) {
      userInfo.transactionRecords = userInfo.transactionRecords.slice(0, 100)
    }
    
    // 更新本地存储
    uni.setStorageSync('userInfo', userInfo)
    uni.setStorageSync('currentUser', userInfo)
    
    // 同步更新到userData
    const userData = uni.getStorageSync('userData') || []
    const userIndex = userData.findIndex(u => u.id === userInfo.id)
    if (userIndex !== -1) {
      userData[userIndex].transactionRecords = userInfo.transactionRecords
      userData[userIndex].lastUpdateTime = new Date().toISOString()
      uni.setStorageSync('userData', userData)
      console.log('✅ 交易记录已同步到userData')
    }
    
    console.log('✅ 交易记录添加成功:', newRecord)
    
  } catch (error) {
    console.error('❌ 添加交易记录失败:', error)
  }
}

/**
 * 获取用户支付信息
 * @returns {Promise<{balance: number, creditCards: Array}>}
 */
export function getUserPaymentInfo() {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = await getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      resolve({
        balance: userInfo.balance || 0,
        creditCards: userInfo.creditCards || []
      })
      
    } catch (error) {
      console.error('获取用户支付信息失败:', error)
      reject(error)
    }
  })
}

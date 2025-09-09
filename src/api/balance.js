// 余额管理API
import { getUserInfo } from '@/utils/auth.js'

/**
 * 获取用户余额
 * @returns {Promise<number>} 用户余额
 */
export function getUserBalance() {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const balance = userInfo.balance || 0
      console.log('获取用户余额:', balance)
      resolve(balance)
    } catch (error) {
      console.error('获取用户余额失败:', error)
      reject(error)
    }
  })
}

/**
 * 扣除用户余额
 * @param {number} amount 扣除金额
 * @param {string} description 交易描述
 * @returns {Promise<{success: boolean, newBalance: number, message: string}>}
 */
export function deductBalance(amount, description = '转账支出') {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const currentBalance = userInfo.balance || 0
      
      // 检查余额是否足够
      if (currentBalance < amount) {
        resolve({
          success: false,
          newBalance: currentBalance,
          message: '余额不足，无法完成转账'
        })
        return
      }
      
      // 扣除余额
      const newBalance = currentBalance - amount
      userInfo.balance = newBalance
      userInfo.lastUpdateTime = new Date().toISOString()
      
      // 更新本地存储
      uni.setStorageSync('userInfo', userInfo)
      uni.setStorageSync('currentUser', userInfo)
      
      // 更新本地数据库
      updateUserBalanceInDatabase(userInfo)
      
      // 记录交易记录
      addTransactionRecord({
        type: 'expense',
        amount: amount,
        description: description,
        balance: newBalance,
        timestamp: new Date().toISOString()
      })
      
      console.log(`余额扣除成功: ${amount}元，剩余余额: ${newBalance}元`)
      
      resolve({
        success: true,
        newBalance: newBalance,
        message: '转账成功'
      })
      
    } catch (error) {
      console.error('扣除余额失败:', error)
      reject(error)
    }
  })
}

/**
 * 增加用户余额
 * @param {number} amount 增加金额
 * @param {string} description 交易描述
 * @returns {Promise<{success: boolean, newBalance: number, message: string}>}
 */
export function addBalance(amount, description = '转账收入') {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const currentBalance = userInfo.balance || 0
      const newBalance = currentBalance + amount
      
      userInfo.balance = newBalance
      userInfo.lastUpdateTime = new Date().toISOString()
      
      // 更新本地存储
      uni.setStorageSync('userInfo', userInfo)
      uni.setStorageSync('currentUser', userInfo)
      
      // 更新本地数据库
      updateUserBalanceInDatabase(userInfo)
      
      // 记录交易记录
      addTransactionRecord({
        type: 'income',
        amount: amount,
        description: description,
        balance: newBalance,
        timestamp: new Date().toISOString()
      })
      
      console.log(`余额增加成功: ${amount}元，当前余额: ${newBalance}元`)
      
      resolve({
        success: true,
        newBalance: newBalance,
        message: '收款成功'
      })
      
    } catch (error) {
      console.error('增加余额失败:', error)
      reject(error)
    }
  })
}

/**
 * 检查余额是否足够
 * @param {number} amount 需要检查的金额
 * @returns {Promise<boolean>} 余额是否足够
 */
export function checkBalanceSufficient(amount) {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const currentBalance = userInfo.balance || 0
      const isSufficient = currentBalance >= amount
      
      console.log(`余额检查: 当前余额${currentBalance}元，需要${amount}元，是否足够: ${isSufficient}`)
      resolve(isSufficient)
      
    } catch (error) {
      console.error('检查余额失败:', error)
      reject(error)
    }
  })
}

/**
 * 更新本地数据库中的用户余额
 * @param {Object} userInfo 用户信息
 */
function updateUserBalanceInDatabase(userInfo) {
  try {
    const users = uni.getStorageSync('users') || []
    const userIndex = users.findIndex(user => user.id === userInfo.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userInfo }
      uni.setStorageSync('users', users)
      console.log('本地数据库余额更新成功')
    }
  } catch (error) {
    console.error('更新本地数据库余额失败:', error)
  }
}

/**
 * 添加交易记录
 * @param {Object} transaction 交易信息
 */
function addTransactionRecord(transaction) {
  try {
    const userInfo = getUserInfo()
    if (!userInfo) {
      return
    }
    
    if (!userInfo.transactionRecords) {
      userInfo.transactionRecords = []
    }
    
    const newRecord = {
      id: Date.now(),
      ...transaction
    }
    
    userInfo.transactionRecords.unshift(newRecord)
    
    // 只保留最近100条记录
    if (userInfo.transactionRecords.length > 100) {
      userInfo.transactionRecords = userInfo.transactionRecords.slice(0, 100)
    }
    
    uni.setStorageSync('userInfo', userInfo)
    uni.setStorageSync('currentUser', userInfo)
    
    console.log('交易记录添加成功:', newRecord)
    
  } catch (error) {
    console.error('添加交易记录失败:', error)
  }
}

/**
 * 获取交易记录
 * @param {number} limit 限制条数，默认20条
 * @returns {Promise<Array>} 交易记录列表
 */
export function getTransactionRecords(limit = 20) {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const records = userInfo.transactionRecords || []
      const limitedRecords = records.slice(0, limit)
      
      console.log(`获取交易记录: ${limitedRecords.length}条`)
      resolve(limitedRecords)
      
    } catch (error) {
      console.error('获取交易记录失败:', error)
      reject(error)
    }
  })
}

/**
 * 验证支付密码
 * @param {string} password 支付密码
 * @returns {Promise<boolean>} 密码是否正确
 */
export function verifyPaymentPassword(password) {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      console.log('支付密码验证调试信息:', {
        userId: userInfo.id,
        username: userInfo.username,
        phone: userInfo.phone,
        storedPassword: userInfo.transactionPassword,
        inputPassword: password,
        passwordType: typeof userInfo.transactionPassword,
        inputType: typeof password,
        passwordLength: userInfo.transactionPassword?.length,
        inputLength: password?.length
      })
      
      const isCorrect = userInfo.transactionPassword === password
      console.log('支付密码验证结果:', isCorrect ? '正确' : '错误')
      
      if (!isCorrect) {
        console.log('密码不匹配详情:', {
          stored: `"${userInfo.transactionPassword}"`,
          input: `"${password}"`,
          equal: userInfo.transactionPassword === password
        })
      }
      
      resolve(isCorrect)
      
    } catch (error) {
      console.error('验证支付密码失败:', error)
      reject(error)
    }
  })
}

/**
 * 信用卡还款
 * @param {string} cardNumber 信用卡号
 * @param {number} amount 还款金额
 * @param {string} paymentPassword 支付密码
 * @returns {Promise<{success: boolean, message: string, newBalance: number, newCardBalance: number}>}
 */
export function repayCreditCard(cardNumber, amount, paymentPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      // 验证支付密码
      const isPasswordCorrect = await verifyPaymentPassword(paymentPassword)
      if (!isPasswordCorrect) {
        resolve({
          success: false,
          message: '支付密码错误',
          newBalance: userInfo.balance,
          newCardBalance: 0
        })
        return
      }
      
      // 检查余额是否足够
      const currentBalance = userInfo.balance || 0
      if (currentBalance < amount) {
        resolve({
          success: false,
          message: '账户余额不足，无法完成还款',
          newBalance: currentBalance,
          newCardBalance: 0
        })
        return
      }
      
      // 查找信用卡
      const creditCards = userInfo.creditCards || []
      const cardIndex = creditCards.findIndex(card => card.cardNumber === cardNumber)
      
      if (cardIndex === -1) {
        resolve({
          success: false,
          message: '未找到指定的信用卡',
          newBalance: currentBalance,
          newCardBalance: 0
        })
        return
      }
      
      const card = creditCards[cardIndex]
      const currentCardBalance = card.currentBalance || 0
      
      // 检查还款金额是否超过欠款
      if (amount > currentCardBalance) {
        resolve({
          success: false,
          message: '还款金额不能超过当前欠款',
          newBalance: currentBalance,
          newCardBalance: currentCardBalance
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
      
      // 更新本地数据库
      updateUserBalanceInDatabase(userInfo)
      
      // 记录交易记录
      addTransactionRecord({
        type: 'expense',
        amount: amount,
        description: `信用卡还款 - ${card.cardType} ${cardNumber.slice(-4)}`,
        balance: newBalance,
        timestamp: new Date().toISOString(),
        icon: '💳',
        title: '信用卡还款',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
      
      console.log(`信用卡还款成功: ${amount}元，剩余余额: ${newBalance}元，信用卡余额: ${newCardBalance}元`)
      
      resolve({
        success: true,
        message: '还款成功',
        newBalance: newBalance,
        newCardBalance: newCardBalance,
        newAvailableCredit: newAvailableCredit
      })
      
    } catch (error) {
      console.error('信用卡还款失败:', error)
      reject(error)
    }
  })
}

/**
 * 获取信用卡信息
 * @param {string} cardNumber 信用卡号（可选）
 * @returns {Promise<Array|Object>} 信用卡信息
 */
export function getCreditCards(cardNumber = null) {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const creditCards = userInfo.creditCards || []
      
      if (cardNumber) {
        const card = creditCards.find(card => card.cardNumber === cardNumber)
        resolve(card || null)
      } else {
        resolve(creditCards)
      }
      
    } catch (error) {
      console.error('获取信用卡信息失败:', error)
      reject(error)
    }
  })
}

/**
 * 获取信用卡还款记录
 * @param {string} cardNumber 信用卡号（可选）
 * @param {number} limit 限制条数，默认10条
 * @returns {Promise<Array>} 还款记录列表
 */
export function getRepaymentRecords(cardNumber = null, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const userInfo = getUserInfo()
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }
      
      const records = userInfo.transactionRecords || []
      let repaymentRecords = records.filter(record => 
        record.description && record.description.includes('信用卡还款')
      )
      
      if (cardNumber) {
        repaymentRecords = repaymentRecords.filter(record => 
          record.description && record.description.includes(cardNumber.slice(-4))
        )
      }
      
      const limitedRecords = repaymentRecords.slice(0, limit)
      
      console.log(`获取还款记录: ${limitedRecords.length}条`)
      resolve(limitedRecords)
      
    } catch (error) {
      console.error('获取还款记录失败:', error)
      reject(error)
    }
  })
}
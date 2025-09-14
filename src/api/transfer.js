/**
 * 转账汇款相关API - 使用本地存储
 */
import dataSync from '@/utils/data-sync.js'

/**
 * 转账
 * @param {object} transferInfo 转账信息
 */
export const transfer = async (transferInfo) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 获取当前用户信息
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 验证余额
    if (currentUser.balance < transferInfo.amount) {
      throw new Error('余额不足')
    }
    
    // 创建转账记录
    const transferRecord = {
      id: 't' + Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'outgoing',
      amount: transferInfo.amount,
      recipient: transferInfo.name,
      recipientAccount: transferInfo.account,
      description: transferInfo.remark || '转账',
      status: 'completed',
      timestamp: new Date().toISOString(),
      fee: transferInfo.amount > 1000 ? 2.5 : 0
    }
    
    // 更新用户余额
    currentUser.balance -= transferInfo.amount
    
    // 添加到转账记录
    if (!currentUser.transferRecords) {
      currentUser.transferRecords = []
    }
    currentUser.transferRecords.unshift(transferRecord)
    
    // 保存到本地存储
    dataSync.updateUserData(currentUser)
    
    return {
      success: true,
      data: transferRecord,
      message: '转账成功'
    }
  } catch (error) {
    console.error('转账失败:', error)
    return {
      success: false,
      message: error.message || '转账失败'
    }
  }
}

/**
 * 获取转账记录
 * @param {object} params 查询参数
 */
export const getTransferHistory = (params = {}) => {
  try {
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      return {
        success: false,
        message: '用户未登录'
      }
    }
    
    let records = currentUser.transferRecords || []
    
    // 根据参数过滤记录
    if (params.type) {
      records = records.filter(record => record.type === params.type)
    }
    
    if (params.status) {
      records = records.filter(record => record.status === params.status)
    }
    
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate)
      const end = new Date(params.endDate)
      records = records.filter(record => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= start && recordDate <= end
      })
    }
    
    // 分页
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    return {
      success: true,
      data: {
        records: records.slice(startIndex, endIndex),
        total: records.length,
        page,
        pageSize
      }
    }
  } catch (error) {
    console.error('获取转账记录失败:', error)
    return {
      success: false,
      message: '获取转账记录失败'
    }
  }
}

/**
 * 验证收款人信息
 * @param {string} bankCard 银行卡号
 * @param {string} name 姓名
 */
export const validatePayee = async (bankCard, name) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟验证逻辑
    if (!bankCard || bankCard.length < 16) {
      throw new Error('银行卡号格式不正确')
    }
    
    if (!name || name.length < 2) {
      throw new Error('姓名格式不正确')
    }
    
    // 模拟验证成功
    return {
      success: true,
      data: {
        name: name,
        bank: '中国农业银行',
        account: bankCard
      },
      message: '收款人信息验证成功'
    }
  } catch (error) {
    console.error('验证收款人信息失败:', error)
    return {
      success: false,
      message: error.message || '验证收款人信息失败'
    }
  }
}

/**
 * 获取转账限额
 */
export const getTransferLimit = () => {
  try {
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      return {
        success: false,
        message: '用户未登录'
      }
    }
    
    const limit = currentUser.securitySettings?.transactionLimit || 50000
    
    return {
      success: true,
      data: {
        dailyLimit: limit,
        singleLimit: limit,
        monthlyLimit: limit * 10
      }
    }
  } catch (error) {
    console.error('获取转账限额失败:', error)
    return {
      success: false,
      message: '获取转账限额失败'
    }
  }
}

/**
 * 预约转账
 * @param {object} appointmentInfo 预约信息
 */
export const appointmentTransfer = async (appointmentInfo) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 创建预约转账记录
    const appointmentRecord = {
      id: 'apt' + Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'appointment',
      amount: appointmentInfo.amount,
      recipient: appointmentInfo.name,
      recipientAccount: appointmentInfo.account,
      description: appointmentInfo.remark || '预约转账',
      status: 'pending',
      appointmentTime: appointmentInfo.appointmentTime,
      timestamp: new Date().toISOString(),
      fee: appointmentInfo.amount > 1000 ? 2.5 : 0
    }
    
    // 添加到预约记录
    if (!currentUser.appointmentTransfers) {
      currentUser.appointmentTransfers = []
    }
    currentUser.appointmentTransfers.unshift(appointmentRecord)
    
    // 保存到本地存储
    dataSync.updateUserData(currentUser)
    
    return {
      success: true,
      data: appointmentRecord,
      message: '预约转账成功'
    }
  } catch (error) {
    console.error('预约转账失败:', error)
    return {
      success: false,
      message: error.message || '预约转账失败'
    }
  }
}

/**
 * 取消预约转账
 * @param {string} appointmentId 预约ID
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 查找并取消预约
    if (currentUser.appointmentTransfers) {
      const appointmentIndex = currentUser.appointmentTransfers.findIndex(
        apt => apt.id === appointmentId
      )
      
      if (appointmentIndex !== -1) {
        currentUser.appointmentTransfers[appointmentIndex].status = 'cancelled'
        currentUser.appointmentTransfers[appointmentIndex].cancelledAt = new Date().toISOString()
        
        // 保存到本地存储
        dataSync.updateUserData(currentUser)
        
        return {
          success: true,
          message: '预约转账已取消'
        }
      }
    }
    
    throw new Error('预约记录不存在')
  } catch (error) {
    console.error('取消预约转账失败:', error)
    return {
      success: false,
      message: error.message || '取消预约转账失败'
    }
  }
}

/**
 * 跨境汇款
 * @param {object} remittanceInfo 汇款信息
 */
export const crossBorderRemittance = async (remittanceInfo) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 创建跨境汇款记录
    const remittanceRecord = {
      id: 'cb' + Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'cross-border',
      amount: remittanceInfo.amount,
      currency: remittanceInfo.currency,
      recipient: remittanceInfo.recipient,
      recipientAccount: remittanceInfo.recipientAccount,
      recipientBank: remittanceInfo.recipientBank,
      description: remittanceInfo.description || '跨境汇款',
      status: 'processing',
      timestamp: new Date().toISOString(),
      fee: remittanceInfo.fee || 50,
      exchangeRate: remittanceInfo.exchangeRate || 7.2
    }
    
    // 添加到跨境汇款记录
    if (!currentUser.crossBorderRemittances) {
      currentUser.crossBorderRemittances = []
    }
    currentUser.crossBorderRemittances.unshift(remittanceRecord)
    
    // 保存到本地存储
    dataSync.updateUserData(currentUser)
    
    return {
      success: true,
      data: remittanceRecord,
      message: '跨境汇款申请已提交'
    }
  } catch (error) {
    console.error('跨境汇款失败:', error)
    return {
      success: false,
      message: error.message || '跨境汇款失败'
    }
  }
}

/**
 * 获取汇率信息
 * @param {string} fromCurrency 原币种
 * @param {string} toCurrency 目标币种
 */
export const getExchangeRate = (fromCurrency, toCurrency) => {
  try {
    // 模拟汇率数据
    const exchangeRates = {
      'USD/CNY': 7.2345,
      'EUR/CNY': 7.8901,
      'GBP/CNY': 9.1234,
      'JPY/CNY': 0.0489,
      'HKD/CNY': 0.9234,
      'AUD/CNY': 4.7890
    }
    
    const pair = `${fromCurrency}/${toCurrency}`
    const rate = exchangeRates[pair] || 1
    
    return {
      success: true,
      data: {
        fromCurrency,
        toCurrency,
        rate,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('获取汇率失败:', error)
    return {
      success: false,
      message: '获取汇率失败'
    }
  }
}

/**
 * 手机号转账
 * @param {object} phoneTransferInfo 手机号转账信息
 */
export const phoneTransfer = async (phoneTransferInfo) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 验证余额
    if (currentUser.balance < phoneTransferInfo.amount) {
      throw new Error('余额不足')
    }
    
    // 创建手机号转账记录
    const transferRecord = {
      id: 'pt' + Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'outgoing',
      amount: phoneTransferInfo.amount,
      recipient: phoneTransferInfo.phone,
      recipientAccount: phoneTransferInfo.phone,
      description: phoneTransferInfo.remark || '手机号转账',
      status: 'completed',
      timestamp: new Date().toISOString(),
      fee: phoneTransferInfo.amount > 1000 ? 2.5 : 0
    }
    
    // 更新用户余额
    currentUser.balance -= phoneTransferInfo.amount
    
    // 添加到转账记录
    if (!currentUser.transferRecords) {
      currentUser.transferRecords = []
    }
    currentUser.transferRecords.unshift(transferRecord)
    
    // 保存到本地存储
    dataSync.updateUserData(currentUser)
    
    return {
      success: true,
      data: transferRecord,
      message: '手机号转账成功'
    }
  } catch (error) {
    console.error('手机号转账失败:', error)
    return {
      success: false,
      message: error.message || '手机号转账失败'
    }
  }
}

/**
 * 二维码收款
 * @param {number} amount 收款金额
 */
export const generateQRCode = async (amount) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const currentUser = dataSync.getCurrentUserInfo()
    if (!currentUser) {
      throw new Error('用户未登录')
    }
    
    // 生成二维码数据
    const qrData = {
      id: 'qr' + Date.now() + Math.random().toString(36).substr(2, 9),
      amount: amount,
      account: currentUser.bankAccounts?.[0]?.accountNumber || '6228480012345678901',
      name: currentUser.username,
      timestamp: new Date().toISOString(),
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==` // 模拟二维码
    }
    
    return {
      success: true,
      data: qrData,
      message: '二维码生成成功'
    }
  } catch (error) {
    console.error('生成二维码失败:', error)
    return {
      success: false,
      message: '生成二维码失败'
    }
  }
}
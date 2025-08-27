/**
 * 转账汇款相关API
 */
import { http } from '@/utils/request'

/**
 * 转账
 * @param {object} transferInfo 转账信息
 */
export const transfer = (transferInfo) => {
  return http.post('/transfer/send', transferInfo)
}

/**
 * 获取转账记录
 * @param {object} params 查询参数
 */
export const getTransferHistory = (params) => {
  return http.get('/transfer/history', params)
}

/**
 * 验证收款人信息
 * @param {string} bankCard 银行卡号
 * @param {string} name 姓名
 */
export const validatePayee = (bankCard, name) => {
  return http.post('/transfer/validate-payee', {
    bank_card: bankCard,
    name
  })
}

/**
 * 获取转账限额
 */
export const getTransferLimit = () => {
  return http.get('/transfer/limit')
}

/**
 * 预约转账
 * @param {object} appointmentInfo 预约信息
 */
export const appointmentTransfer = (appointmentInfo) => {
  return http.post('/transfer/appointment', appointmentInfo)
}

/**
 * 取消预约转账
 * @param {string} appointmentId 预约ID
 */
export const cancelAppointment = (appointmentId) => {
  return http.delete(`/transfer/appointment/${appointmentId}`)
}

/**
 * 跨境汇款
 * @param {object} remittanceInfo 汇款信息
 */
export const crossBorderRemittance = (remittanceInfo) => {
  return http.post('/transfer/cross-border', remittanceInfo)
}

/**
 * 获取汇率信息
 * @param {string} fromCurrency 原币种
 * @param {string} toCurrency 目标币种
 */
export const getExchangeRate = (fromCurrency, toCurrency) => {
  return http.get('/transfer/exchange-rate', {
    from: fromCurrency,
    to: toCurrency
  })
}

/**
 * 手机号转账
 * @param {object} phoneTransferInfo 手机号转账信息
 */
export const phoneTransfer = (phoneTransferInfo) => {
  return http.post('/transfer/phone', phoneTransferInfo)
}

/**
 * 二维码收款
 * @param {number} amount 收款金额
 */
export const generateQRCode = (amount) => {
  return http.post('/transfer/qr-code', { amount })
}
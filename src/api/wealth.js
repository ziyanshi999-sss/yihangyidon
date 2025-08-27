/**
 * 财富管理相关API
 */
import { http } from '@/utils/request'

/**
 * 获取理财产品列表
 * @param {object} params 查询参数
 */
export const getWealthProducts = (params) => {
  return http.get('/wealth/products', params)
}

/**
 * 获取理财产品详情
 * @param {string} productId 产品ID
 */
export const getWealthProductDetail = (productId) => {
  return http.get(`/wealth/products/${productId}`)
}

/**
 * 购买理财产品
 * @param {object} orderInfo 订单信息
 */
export const purchaseWealth = (orderInfo) => {
  return http.post('/wealth/purchase', orderInfo)
}

/**
 * 获取我的理财
 */
export const getMyWealth = () => {
  return http.get('/wealth/my-products')
}

/**
 * 赎回理财产品
 * @param {string} holdingId 持仓ID
 * @param {number} amount 赎回金额
 */
export const redeemWealth = (holdingId, amount) => {
  return http.post('/wealth/redeem', {
    holding_id: holdingId,
    amount
  })
}

/**
 * 获取基金列表
 * @param {object} params 查询参数
 */
export const getFunds = (params) => {
  return http.get('/wealth/funds', params)
}

/**
 * 获取基金详情
 * @param {string} fundCode 基金代码
 */
export const getFundDetail = (fundCode) => {
  return http.get(`/wealth/funds/${fundCode}`)
}

/**
 * 基金定投
 * @param {object} planInfo 定投计划信息
 */
export const createInvestmentPlan = (planInfo) => {
  return http.post('/wealth/investment-plan', planInfo)
}

/**
 * 获取我的基金
 */
export const getMyFunds = () => {
  return http.get('/wealth/my-funds')
}

/**
 * 获取投资组合
 */
export const getPortfolio = () => {
  return http.get('/wealth/portfolio')
}

/**
 * 获取收益分析
 * @param {string} period 时间周期 day|week|month|year
 */
export const getIncomeAnalysis = (period = 'month') => {
  return http.get('/wealth/income-analysis', { period })
}

/**
 * 获取市场行情
 */
export const getMarketData = () => {
  return http.get('/wealth/market-data')
}

/**
 * 获取推荐产品
 */
export const getRecommendProducts = () => {
  return http.get('/wealth/recommend')
}
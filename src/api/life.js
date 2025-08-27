/**
 * 生活服务相关API
 */
import { http } from '@/utils/request'

/**
 * 获取生活服务列表
 * @param {object} params 查询参数
 */
export const getLifeServices = (params) => {
    return http.get('/life/services', params)
}

/**
 * 生活缴费
 * @param {object} paymentInfo 缴费信息
 */
export const payLifeBill = (paymentInfo) => {
    return http.post('/life/payment', paymentInfo)
}

/**
 * 手机充值
 * @param {object} rechargeInfo 充值信息
 */
export const mobileRecharge = (rechargeInfo) => {
    return http.post('/life/recharge', rechargeInfo)
}

/**
 * 获取缴费记录
 * @param {object} params 查询参数
 */
export const getPaymentHistory = (params) => {
    return http.get('/life/payment-history', params)
}

/**
 * 查询水电燃气费用
 * @param {object} queryInfo 查询信息
 */
export const queryUtilityBill = (queryInfo) => {
    return http.post('/life/utility/query', queryInfo)
}

/**
 * 获取优惠活动列表
 * @param {string} category 分类
 */
export const getPromotions = (category = 'all') => {
    return http.get('/life/promotions', { category })
}

/**
 * 获取京东特惠商品
 * @param {object} params 查询参数
 */
export const getJDProducts = (params) => {
    return http.get('/life/jd-products', params)
}

/**
 * 政务服务查询
 * @param {object} params 查询参数
 */
export const getGovernmentServices = (params) => {
    return http.get('/life/government', params)
}

/**
 * 获取城市专区信息
 * @param {string} cityCode 城市代码
 */
export const getCityServices = (cityCode) => {
    return http.get(`/life/city/${cityCode}`)
}

/**
 * 获取优惠券列表
 * @param {object} params 查询参数
 */
export const getCoupons = (params) => {
    return http.get('/life/coupons', params)
}

/**
 * 领取优惠券
 * @param {string} couponId 优惠券ID
 */
export const receiveCoupon = (couponId) => {
    return http.post('/life/coupons/receive', { coupon_id: couponId })
}

/**
 * 校园服务
 * @param {object} params 查询参数
 */
export const getCampusServices = (params) => {
    return http.get('/life/campus', params)
}

/**
 * 食堂服务
 * @param {object} params 查询参数
 */
export const getCanteenServices = (params) => {
    return http.get('/life/canteen', params)
}

/**
 * 党费缴纳
 * @param {object} paymentInfo 缴费信息
 */
export const payPartyFee = (paymentInfo) => {
    return http.post('/life/party-fee', paymentInfo)
}

/**
 * 社保医保服务
 * @param {object} params 查询参数
 */
export const getSocialInsurance = (params) => {
    return http.get('/life/social-insurance', params)
}

/**
 * 低碳积分查询
 */
export const getCarbonPoints = () => {
    return http.get('/life/carbon-points')
}

/**
 * 获取热门活动
 * @param {object} params 查询参数
 */
export const getHotActivities = (params) => {
    return http.get('/life/hot-activities', params)
}
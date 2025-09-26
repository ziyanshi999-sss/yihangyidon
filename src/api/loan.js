/**
 * 贷款相关API
 */
import { http } from '@/utils/request'

/**
 * 获取贷款产品列表
 * @param {object} params 查询参数
 */
export const getLoanProducts = (params = {}) => {
  return http.get('/loan/products', params)
}

/**
 * 获取贷款产品详情
 * @param {string} productId 产品ID
 */
export const getLoanProductDetail = (productId) => {
  return http.get(`/loan/products/${productId}`)
}

/**
 * 提交贷款申请
 * @param {object} applicationData 申请数据
 */
export const submitLoanApplication = (applicationData) => {
  return http.post('/loan/applications', applicationData)
}

/**
 * 获取贷款申请状态
 * @param {string} applicationId 申请ID
 */
export const getLoanApplicationStatus = (applicationId) => {
  return http.get(`/loan/applications/${applicationId}/status`)
}

/**
 * 获取用户贷款信息
 * @param {string} userId 用户ID
 */
export const getUserLoanInfo = (userId) => {
  return http.get(`/loan/user/${userId}`)
}

/**
 * 贷款还款
 * @param {object} paymentData 还款数据
 */
export const makeLoanPayment = (paymentData) => {
  return http.post('/loan/payment', paymentData)
}

/**
 * 获取还款计划
 * @param {string} loanId 贷款ID
 */
export const getRepaymentPlan = (loanId) => {
  return http.get(`/loan/${loanId}/repayment-plan`)
}

/**
 * 贷款计算器
 * @param {object} calcParams 计算参数
 */
export const calculateLoan = (calcParams) => {
  return http.post('/loan/calculate', calcParams)
}

/**
 * 人脸认证
 * @param {object} authData 认证数据
 */
export const faceAuthentication = (authData) => {
  return http.post('/loan/face-auth', authData)
}

/**
 * 验证人脸认证结果
 * @param {string} authToken 认证令牌
 */
export const verifyFaceAuth = (authToken) => {
  return http.post('/loan/face-auth/verify', { authToken })
}

/**
 * 获取贷款额度评估
 * @param {object} assessmentData 评估数据
 */
export const getLoanAmountAssessment = (assessmentData) => {
  return http.post('/loan/assessment', assessmentData)
}

/**
 * 上传贷款申请材料
 * @param {object} materials 申请材料
 */
export const uploadLoanMaterials = (materials) => {
  return http.post('/loan/materials/upload', materials)
}

/**
 * 获取贷款申请进度
 * @param {string} applicationId 申请ID
 */
export const getLoanApplicationProgress = (applicationId) => {
  return http.get(`/loan/applications/${applicationId}/progress`)
}

/**
 * 取消贷款申请
 * @param {string} applicationId 申请ID
 */
export const cancelLoanApplication = (applicationId) => {
  return http.post(`/loan/applications/${applicationId}/cancel`)
}

/**
 * 获取贷款历史记录
 * @param {object} params 查询参数
 */
export const getLoanHistory = (params = {}) => {
  return http.get('/loan/history', params)
}

/**
 * 获取利率信息
 * @param {string} productType 产品类型
 */
export const getInterestRates = (productType) => {
  return http.get(`/loan/rates/${productType}`)
}

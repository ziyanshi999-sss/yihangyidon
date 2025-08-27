/**
 * 用户相关API
 */
import { http } from '@/utils/request'

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return http.get('/user/info')
}

/**
 * 更新用户信息
 * @param {object} userInfo 用户信息
 */
export const updateUserInfo = (userInfo) => {
  return http.put('/user/info', userInfo)
}

/**
 * 上传头像
 * @param {string} avatar 头像文件路径
 */
export const uploadAvatar = (avatar) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'https://api.abchina.com/user/avatar',
      filePath: avatar,
      name: 'avatar',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          resolve(data.data)
        } else {
          reject(data)
        }
      },
      fail: reject
    })
  })
}

/**
 * 获取银行卡列表
 */
export const getBankCards = () => {
  return http.get('/user/bank-cards')
}

/**
 * 添加银行卡
 * @param {object} cardInfo 银行卡信息
 */
export const addBankCard = (cardInfo) => {
  return http.post('/user/bank-cards', cardInfo)
}

/**
 * 删除银行卡
 * @param {string} cardId 银行卡ID
 */
export const deleteBankCard = (cardId) => {
  return http.delete(`/user/bank-cards/${cardId}`)
}

/**
 * 设置默认银行卡
 * @param {string} cardId 银行卡ID
 */
export const setDefaultCard = (cardId) => {
  return http.put(`/user/bank-cards/${cardId}/default`)
}

/**
 * 获取交易记录
 * @param {object} params 查询参数
 */
export const getTransactionHistory = (params) => {
  return http.get('/user/transactions', params)
}

/**
 * 获取账户余额
 */
export const getAccountBalance = () => {
  return http.get('/user/balance')
}

/**
 * 实名认证
 * @param {object} authInfo 认证信息
 */
export const realNameAuth = (authInfo) => {
  return http.post('/user/real-name-auth', authInfo)
}

/**
 * 获取认证状态
 */
export const getAuthStatus = () => {
  return http.get('/user/auth-status')
}
/**
 * 认证相关API
 */
import { http } from '@/utils/request'

/**
 * 用户登录
 * @param {string} phone 手机号
 * @param {string} password 密码
 */
export const login = (phone, password) => {
  return http.post('/auth/login', {
    phone,
    password
  })
}

/**
 * 短信验证码登录
 * @param {string} phone 手机号
 * @param {string} code 验证码
 */
export const loginBySms = (phone, code) => {
  return http.post('/auth/login/sms', {
    phone,
    code
  })
}

/**
 * 发送验证码
 * @param {string} phone 手机号
 * @param {string} type 类型 login|register|reset
 */
export const sendSmsCode = (phone, type = 'login') => {
  return http.post('/auth/sms/send', {
    phone,
    type
  })
}

/**
 * 用户注册
 * @param {object} userInfo 用户信息
 */
export const register = (userInfo) => {
  return http.post('/auth/register', userInfo)
}

/**
 * 退出登录
 */
export const logout = () => {
  return http.post('/auth/logout')
}

/**
 * 刷新token
 * @param {string} refreshToken 刷新token
 */
export const refreshToken = (refreshToken) => {
  return http.post('/auth/refresh', {
    refresh_token: refreshToken
  })
}

/**
 * 修改密码
 * @param {string} oldPassword 旧密码
 * @param {string} newPassword 新密码
 */
export const changePassword = (oldPassword, newPassword) => {
  return http.post('/auth/password/change', {
    old_password: oldPassword,
    new_password: newPassword
  })
}

/**
 * 重置密码
 * @param {string} phone 手机号
 * @param {string} code 验证码
 * @param {string} newPassword 新密码
 */
export const resetPassword = (phone, code, newPassword) => {
  return http.post('/auth/password/reset', {
    phone,
    code,
    new_password: newPassword
  })
}
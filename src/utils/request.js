/**
 * 网络请求工具类
 * 基于uni.request封装的HTTP请求库
 */

// 请求基础配置
const BASE_URL = 'https://api.abchina.com' // 农业银行API基础地址
const TIMEOUT = 10000 // 请求超时时间

/**
 * 请求拦截器
 */
const requestInterceptor = (config) => {
  // 添加token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 添加公共header
  config.header = {
    'Content-Type': 'application/json',
    'X-Client-Type': 'uni-app',
    ...config.header
  }
  
  return config
}

/**
 * 响应拦截器
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // HTTP状态码检查
  if (statusCode === 200) {
    // 业务状态码检查
    if (data.code === 0) {
      return data.data
    } else {
      // 业务错误处理
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
  } else if (statusCode === 401) {
    // token过期，跳转登录
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.navigateTo({
      url: '/login/login'
    })
    return Promise.reject('登录已过期')
  } else {
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    })
    return Promise.reject('网络错误')
  }
}

/**
 * 基础请求方法
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 请求配置
    let config = {
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || TIMEOUT
    }
    
    // 应用请求拦截器
    config = requestInterceptor(config)
    
    // 发起请求
    uni.request({
      ...config,
      success: (response) => {
        try {
          const result = responseInterceptor(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        console.error('请求失败:', error)
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

// 封装常用请求方法
export const http = {
  get: (url, params = {}) => {
    return request({
      url: url + (Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : ''),
      method: 'GET'
    })
  },
  
  post: (url, data = {}) => {
    return request({
      url,
      method: 'POST',
      data
    })
  },
  
  put: (url, data = {}) => {
    return request({
      url,
      method: 'PUT',
      data
    })
  },
  
  delete: (url) => {
    return request({
      url,
      method: 'DELETE'
    })
  }
}

export default http
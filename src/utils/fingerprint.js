/**
 * 指纹登录工具
 * @description 支持移动端指纹识别登录
 */

// 检查是否支持指纹识别
export function isFingerprintSupported() {
  // #ifdef APP-PLUS
  return plus.fingerprint && plus.fingerprint.isSupport()
  // #endif
  
  // #ifdef H5
  return false
  // #endif
  
  // #ifdef MP
  return false
  // #endif
}

// 检查是否已设置指纹
export function isFingerprintSet() {
  // #ifdef APP-PLUS
  try {
    return plus.fingerprint && plus.fingerprint.isSupport() && plus.fingerprint.isEnrolledFingerprints()
  } catch (error) {
    console.error('检查指纹设置失败:', error)
    return false
  }
  // #endif
  
  return false
}

// 验证指纹
export function authenticateFingerprint() {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (!plus.fingerprint) {
      reject(new Error('设备不支持指纹识别'))
      return
    }
    
    plus.fingerprint.authenticate(
      (result) => {
        console.log('指纹验证成功')
        resolve(result)
      },
      (error) => {
        console.error('指纹验证失败:', error)
        reject(error)
      },
      {
        message: '请验证指纹登录'
      }
    )
    // #endif
    
    // #ifndef APP-PLUS
    reject(new Error('当前平台不支持指纹识别'))
    // #endif
  })
}

// 获取指纹登录提示信息
export function getFingerprintMessage() {
  if (!isFingerprintSupported()) {
    return '设备不支持指纹识别'
  }
  
  if (!isFingerprintSet()) {
    return '请先在系统设置中设置指纹'
  }
  
  return '点击验证指纹登录'
}

// 检查用户是否启用了指纹登录
export function isUserFingerprintEnabled(userInfo) {
  return userInfo && userInfo.fingerprintEnabled === true
}

// 指纹登录处理
export async function handleFingerprintLogin() {
  try {
    // 检查设备支持
    if (!isFingerprintSupported()) {
      throw new Error('设备不支持指纹识别')
    }
    
    // 检查是否设置指纹
    if (!isFingerprintSet()) {
      throw new Error('请先在系统设置中设置指纹')
    }
    
    // 验证指纹
    await authenticateFingerprint()
    
    // 获取最近登录的用户信息
    const recentUser = uni.getStorageSync('recentUser')
    if (!recentUser) {
      throw new Error('请先使用其他方式登录一次')
    }
    
    // 检查用户是否启用指纹登录
    if (!isUserFingerprintEnabled(recentUser)) {
      throw new Error('该用户未启用指纹登录')
    }
    
    return recentUser
    
  } catch (error) {
    console.error('指纹登录失败:', error)
    throw error
  }
}

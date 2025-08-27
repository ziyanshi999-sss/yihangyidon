/**
 * 登录拦截工具函数
 * @description 统一管理登录状态检查和页面访问控制
 */

// 白名单页面列表（不需要登录的页面）
const WHITE_LIST = [
  '/pages/denglu/login',
  '/pages/denglu/register',
  '/pages/common/404',
  '/pages/common/error'
]

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    const isLoggedIn = uni.getStorageSync('isLoggedIn')
    return !!(userInfo && isLoggedIn)
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  }
}

/**
 * 获取当前页面路径
 * @returns {string} 当前页面路径
 */
export function getCurrentPagePath() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    return '/' + currentPage.route
  }
  return ''
}

/**
 * 检查当前页面是否在白名单中
 * @param {string} pagePath 页面路径
 * @returns {boolean} 是否在白名单中
 */
export function isWhiteListPage(pagePath = '') {
  const path = pagePath || getCurrentPagePath()
  return WHITE_LIST.some(whitePath => path.includes(whitePath))
}

/**
 * 跳转到登录页面
 * @param {string} redirectUrl 登录成功后跳转的页面
 */
export function redirectToLogin(redirectUrl = '') {
  const currentPath = getCurrentPagePath()
  
  // 如果当前页面不在白名单中，将其设为登录后的跳转目标
  if (!isWhiteListPage(currentPath)) {
    redirectUrl = currentPath
  }
  
  // 保存跳转目标
  if (redirectUrl) {
    uni.setStorageSync('redirectUrl', redirectUrl)
  }
  
  // 跳转到登录页面
  uni.navigateTo({
    url: '/pages/denglu/login',
    fail: (error) => {
      console.error('跳转登录页面失败:', error)
      // 如果跳转失败，尝试使用switchTab
      uni.switchTab({
        url: '/pages/denglu/login'
      })
    }
  })
}

/**
 * 检查登录状态并处理未登录情况
 * @param {string} redirectUrl 登录成功后跳转的页面
 * @returns {boolean} 是否已登录
 */
export function checkLoginAndRedirect(redirectUrl = '') {
  if (!isLoggedIn()) {
    // 如果当前页面不在白名单中，强制跳转到登录页
    if (!isWhiteListPage()) {
      console.log('用户未登录，强制跳转到登录页面')
      redirectToLogin(redirectUrl)
      return false
    }
  }
  return true
}

/**
 * 强制检查登录状态（用于退出后的安全检查）
 * @returns {boolean} 是否已登录
 */
export function forceCheckLogin() {
  // 如果正在退出登录，跳过检查
  const isLoggingOut = uni.getStorageSync('isLoggingOut')
  if (isLoggingOut) {
    console.log('正在退出登录，跳过登录检查')
    return false
  }
  
  const isLoggedIn = uni.getStorageSync('isLoggedIn')
  const userInfo = uni.getStorageSync('userInfo')
  
  if (!isLoggedIn || !userInfo) {
    console.log('强制检查：用户未登录，清除所有状态')
    // 清除所有可能的登录状态
    clearAllUserData()
    return false
  }
  return true
}

/**
 * 登录成功后的处理
 * @param {Object} userInfo 用户信息
 */
export function handleLoginSuccess(userInfo) {
  // 保存用户信息和登录状态
  uni.setStorageSync('userInfo', userInfo)
  uni.setStorageSync('isLoggedIn', true)
  
  // 获取登录前的跳转目标
  const redirectUrl = uni.getStorageSync('redirectUrl')
  
  if (redirectUrl) {
    // 清除跳转目标
    uni.removeStorageSync('redirectUrl')
    
    // 跳转到目标页面
    if (redirectUrl.includes('/pages/')) {
      // 如果是tabBar页面，使用switchTab
      if (isTabBarPage(redirectUrl)) {
        uni.switchTab({
          url: redirectUrl
        })
      } else {
        uni.navigateTo({
          url: redirectUrl
        })
      }
    }
  } else {
    // 默认跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

/**
 * 退出登录
 * @param {Object} options 退出选项
 * @param {boolean} options.showConfirm 是否显示确认对话框
 * @param {boolean} options.syncToServer 是否同步到服务器
 * @param {string} options.reason 退出原因
 */
export function logout(options = {}) {
  const {
    showConfirm = true,
    syncToServer = true,
    reason = '用户主动退出'
  } = options

  const performLogout = async () => {
    try {
      // 设置退出状态标记，防止拦截器干扰
      uni.setStorageSync('isLoggingOut', true)
      
      // 记录退出日志
      logLogoutEvent(reason)
      
      // 清除所有用户相关数据
      clearAllUserData()
      
      // 同步到服务器（如果启用）
      if (syncToServer) {
        await syncLogoutToServer(reason)
      }
      
      // 显示退出成功提示
      uni.showToast({
        title: '已安全退出登录',
        icon: 'success',
        duration: 1500
      })
      
      // 强制跳转到登录页面，绕过所有拦截器
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/denglu/login',
          success: () => {
            console.log('已强制跳转到登录页面')
            // 清除退出状态标记
            uni.removeStorageSync('isLoggingOut')
          },
          fail: (error) => {
            console.error('跳转登录页面失败:', error)
            // 如果reLaunch失败，尝试使用navigateTo
            uni.navigateTo({
              url: '/pages/denglu/login',
              success: () => {
                uni.removeStorageSync('isLoggingOut')
              }
            })
          }
        })
      }, 100) // 短暂延迟确保数据清除完成
      
    } catch (error) {
      console.error('退出登录失败:', error)
      
      // 即使同步失败，也要清除本地数据
      clearAllUserData()
      
      // 清除退出状态标记
      uni.removeStorageSync('isLoggingOut')
      
      uni.showToast({
        title: '退出登录失败，请重试',
        icon: 'none'
      })
    }
  }

  if (showConfirm) {
    // 显示确认对话框
    uni.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？退出后将清除所有登录信息。',
      confirmText: '确认退出',
      cancelText: '取消',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          performLogout()
        }
      }
    })
  } else {
    // 直接执行退出
    performLogout()
  }
}

/**
 * 清除所有用户相关数据
 */
function clearAllUserData() {
  const keysToRemove = [
    'userInfo',
    'isLoggedIn',
    'redirectUrl',
    'recentUser',
    'rememberedPassword',
    'token',
    'refreshToken',
    'userPreferences',
    'lastLoginTime',
    'sessionData'
  ]
  
  keysToRemove.forEach(key => {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.warn(`清除存储键 ${key} 失败:`, error)
    }
  })
  
  // 清除可能存在的其他用户相关数据
  try {
    const allKeys = uni.getStorageInfoSync().keys
    allKeys.forEach(key => {
      if (key.startsWith('user_') || key.startsWith('auth_') || key.includes('login')) {
        uni.removeStorageSync(key)
      }
    })
  } catch (error) {
    console.warn('清除用户相关数据失败:', error)
  }
}

/**
 * 记录退出登录事件
 * @param {string} reason 退出原因
 */
function logLogoutEvent(reason) {
  const logoutData = {
    timestamp: Date.now(),
    reason,
    platform: uni.getSystemInfoSync().platform,
    version: '1.0.0'
  }
  
  try {
    // 保存退出日志到本地
    const logoutLogs = uni.getStorageSync('logoutLogs') || []
    logoutLogs.push(logoutData)
    
    // 只保留最近10条记录
    if (logoutLogs.length > 10) {
      logoutLogs.splice(0, logoutLogs.length - 10)
    }
    
    uni.setStorageSync('logoutLogs', logoutLogs)
    
    // 输出到控制台
    console.log('用户退出登录:', logoutData)
  } catch (error) {
    console.error('记录退出日志失败:', error)
  }
}

/**
 * 同步退出到服务器
 * @param {string} reason 退出原因
 */
async function syncLogoutToServer(reason) {
  try {
    // 获取当前用户信息
    const userInfo = getUserInfo()
    if (!userInfo) {
      console.log('用户信息不存在，跳过服务器同步')
      return
    }
    
    // 构建退出请求数据
    const logoutData = {
      userId: userInfo.id,
      username: userInfo.username,
      phone: userInfo.phone,
      reason,
      timestamp: Date.now(),
      platform: uni.getSystemInfoSync().platform,
      deviceId: getDeviceId()
    }
    
    // 这里可以调用服务器API，通知服务器用户已退出
    // 例如：清除服务器端的session、token等
    
    // 模拟API调用
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟网络请求
        const success = Math.random() > 0.1 // 90%成功率
        if (success) {
          resolve()
        } else {
          reject(new Error('网络请求失败'))
        }
      }, 500)
    })
    
    console.log('退出登录已同步到服务器:', logoutData)
    
    // 保存退出记录到本地，用于多端同步
    saveLogoutRecord(logoutData)
    
  } catch (error) {
    console.warn('同步退出到服务器失败:', error)
    // 不抛出错误，避免影响本地退出流程
  }
}

/**
 * 获取设备ID
 * @returns {string} 设备ID
 */
function getDeviceId() {
  try {
    const systemInfo = uni.getSystemInfoSync()
    return `${systemInfo.platform}_${systemInfo.model}_${systemInfo.system}`
  } catch (error) {
    return 'unknown_device'
  }
}

/**
 * 保存退出记录
 * @param {Object} logoutData 退出数据
 */
function saveLogoutRecord(logoutData) {
  try {
    const logoutRecords = uni.getStorageSync('logoutRecords') || []
    logoutRecords.push(logoutData)
    
    // 只保留最近20条记录
    if (logoutRecords.length > 20) {
      logoutRecords.splice(0, logoutRecords.length - 20)
    }
    
    uni.setStorageSync('logoutRecords', logoutRecords)
  } catch (error) {
    console.error('保存退出记录失败:', error)
  }
}

/**
 * 检查是否为tabBar页面
 * @param {string} pagePath 页面路径
 * @returns {boolean} 是否为tabBar页面
 */
function isTabBarPage(pagePath) {
  const tabBarPages = [
    '/pages/index/index',
    '/pages/wealth/wealth',
    '/pages/life/life',
    '/pages/user/user'
  ]
  return tabBarPages.some(tabPath => pagePath.includes(tabPath))
}

/**
 * 页面登录检查装饰器
 * @param {Function} pageMethod 页面方法
 * @returns {Function} 装饰后的方法
 */
export function requireLogin(pageMethod) {
  return function(...args) {
    if (!checkLoginAndRedirect()) {
      return
    }
    return pageMethod.apply(this, args)
  }
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export function getUserInfo() {
  try {
    return uni.getStorageSync('userInfo')
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 更新用户信息
 * @param {Object} userInfo 新的用户信息
 */
export function updateUserInfo(userInfo) {
  try {
    uni.setStorageSync('userInfo', userInfo)
  } catch (error) {
    console.error('更新用户信息失败:', error)
  }
}

/**
 * 快速退出登录（不显示确认对话框）
 * @param {string} reason 退出原因
 */
export function quickLogout(reason = '快速退出') {
  logout({
    showConfirm: false,
    syncToServer: true,
    reason
  })
}

/**
 * 强制退出登录（清除所有数据，不同步服务器）
 * @param {string} reason 退出原因
 */
export function forceLogout(reason = '强制退出') {
  logout({
    showConfirm: false,
    syncToServer: false,
    reason
  })
}

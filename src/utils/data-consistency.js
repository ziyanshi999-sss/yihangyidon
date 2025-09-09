/**
 * 数据一致性检查工具
 * 确保用户信息与数据库数据保持一致
 */

/**
 * 检查并修复用户数据一致性
 * @returns {Object|null} 修复后的用户信息
 */
export function checkAndFixUserDataConsistency() {
  try {
    console.log('🔍 开始检查用户数据一致性...')
    
    // 获取当前存储的数据
    const currentUserId = uni.getStorageSync('currentUserId') || 'u001'
    const users = uni.getStorageSync('users') || []
    const userInfo = uni.getStorageSync('userInfo')
    
    console.log('当前用户ID:', currentUserId)
    console.log('存储的用户信息:', userInfo)
    
    // 从数据库中找到对应的用户
    const dbUser = users.find(user => user.id === currentUserId)
    
    if (!dbUser) {
      console.warn('⚠️ 数据库中未找到用户:', currentUserId)
      return null
    }
    
    // 检查数据一致性
    const isConsistent = userInfo && 
      userInfo.id === dbUser.id &&
      userInfo.username === dbUser.username &&
      userInfo.balance === dbUser.balance &&
      userInfo.phone === dbUser.phone
    
    if (isConsistent) {
      console.log('✅ 用户数据一致，无需修复')
      return userInfo
    }
    
    // 数据不一致，需要修复
    console.log('🔧 发现数据不一致，开始修复...')
    console.log('数据库用户:', dbUser.username, '余额:', dbUser.balance)
    console.log('存储用户:', userInfo?.username, '余额:', userInfo?.balance)
    
    // 使用数据库中的最新数据
    const fixedUserInfo = {
      ...dbUser,
      // 确保必要字段存在
      balance: dbUser.balance || 0,
      nickname: dbUser.nickname || dbUser.username
    }
    
    // 更新本地存储
    uni.setStorageSync('userInfo', fixedUserInfo)
    uni.setStorageSync('currentUser', fixedUserInfo)
    
    console.log('✅ 用户数据修复完成:', {
      username: fixedUserInfo.username,
      balance: fixedUserInfo.balance,
      phone: fixedUserInfo.phone
    })
    
    return fixedUserInfo
    
  } catch (error) {
    console.error('❌ 数据一致性检查失败:', error)
    return null
  }
}

/**
 * 确保用户信息是最新的
 * @param {string} userId 用户ID
 * @returns {Object|null} 最新的用户信息
 */
export function ensureLatestUserInfo(userId) {
  try {
    const users = uni.getStorageSync('users') || []
    const latestUser = users.find(user => user.id === userId)
    
    if (latestUser) {
      // 更新本地存储
      uni.setStorageSync('userInfo', latestUser)
      uni.setStorageSync('currentUser', latestUser)
      console.log('✅ 用户信息已更新为最新:', latestUser.username, '余额:', latestUser.balance)
      return latestUser
    }
    
    return null
  } catch (error) {
    console.error('❌ 更新用户信息失败:', error)
    return null
  }
}

/**
 * 同步用户数据到本地存储
 * @param {Object} userData 用户数据
 */
export function syncUserDataToStorage(userData) {
  try {
    if (!userData || !userData.id) {
      console.warn('⚠️ 无效的用户数据')
      return false
    }
    
    // 更新本地存储
    uni.setStorageSync('userInfo', userData)
    uni.setStorageSync('currentUser', userData)
    uni.setStorageSync('currentUserId', userData.id)
    
    console.log('✅ 用户数据已同步到本地存储:', userData.username, '余额:', userData.balance)
    return true
  } catch (error) {
    console.error('❌ 同步用户数据失败:', error)
    return false
  }
}

/**
 * 获取当前用户的完整信息
 * @returns {Object|null} 当前用户信息
 */
export function getCurrentUserInfo() {
  try {
    // 首先检查数据一致性
    const consistentUserInfo = checkAndFixUserDataConsistency()
    
    if (consistentUserInfo) {
      return consistentUserInfo
    }
    
    // 如果一致性检查失败，尝试从数据库加载
    const currentUserId = uni.getStorageSync('currentUserId') || 'u001'
    return ensureLatestUserInfo(currentUserId)
    
  } catch (error) {
    console.error('❌ 获取当前用户信息失败:', error)
    return null
  }
}

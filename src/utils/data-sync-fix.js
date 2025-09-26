/**
 * 数据同步修复工具
 * 解决数据修改后重新登录丢失的问题
 */

class DataSyncFix {
  constructor() {
    this.isInitialized = false
  }

  /**
   * 初始化数据同步
   */
  async init() {
    try {
      console.log('🔄 开始初始化数据同步...')
      
      // 检查本地存储的数据
      const localUserData = uni.getStorageSync('userData')
      const localUserInfo = uni.getStorageSync('userInfo')
      
      if (localUserData && localUserData.length > 0) {
        console.log('✅ 发现本地用户数据，优先使用本地数据')
        this.isInitialized = true
        return true
      }
      
      if (localUserInfo) {
        console.log('✅ 发现本地用户信息，创建用户数据')
        await this.createUserDataFromInfo(localUserInfo)
        this.isInitialized = true
        return true
      }
      
      console.log('ℹ️ 未发现本地数据，将使用默认数据')
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('❌ 数据同步初始化失败:', error)
      return false
    }
  }

  /**
   * 从用户信息创建用户数据
   */
  async createUserDataFromInfo(userInfo) {
    try {
      const userData = [{
        ...userInfo,
        lastUpdateTime: new Date().toISOString()
      }]
      
      uni.setStorageSync('userData', userData)
      console.log('✅ 已从用户信息创建用户数据')
    } catch (error) {
      console.error('❌ 创建用户数据失败:', error)
    }
  }

  /**
   * 同步用户数据
   */
  async syncUserData(userId, updateData) {
    try {
      // 获取当前用户数据
      let userData = uni.getStorageSync('userData') || []
      
      // 查找用户
      const userIndex = userData.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        console.warn('⚠️ 用户不存在，无法同步数据')
        return false
      }
      
      // 更新用户数据
      userData[userIndex] = {
        ...userData[userIndex],
        ...updateData,
        lastUpdateTime: new Date().toISOString()
      }
      
      // 保存到本地存储
      uni.setStorageSync('userData', userData)
      
      // 同步更新userInfo
      const updatedUser = userData[userIndex]
      uni.setStorageSync('userInfo', updatedUser)
      
      console.log('✅ 用户数据同步完成:', userId)
      return true
    } catch (error) {
      console.error('❌ 用户数据同步失败:', error)
      return false
    }
  }

  /**
   * 确保数据一致性
   */
  async ensureDataConsistency() {
    try {
      const userData = uni.getStorageSync('userData')
      const userInfo = uni.getStorageSync('userInfo')
      
      if (!userData || userData.length === 0) {
        if (userInfo) {
          await this.createUserDataFromInfo(userInfo)
        }
        return true
      }
      
      if (userInfo && userData.length > 0) {
        // 检查userInfo是否与userData中的用户信息一致
        const currentUser = userData.find(u => u.id === userInfo.id)
        if (currentUser) {
          // 比较最后更新时间，使用较新的数据
          const userInfoTime = new Date(userInfo.lastUpdateTime || 0)
          const userDataTime = new Date(currentUser.lastUpdateTime || 0)
          
          if (userInfoTime > userDataTime) {
            // userInfo更新，同步到userData
            await this.syncUserData(userInfo.id, userInfo)
          } else if (userDataTime > userInfoTime) {
            // userData更新，同步到userInfo
            uni.setStorageSync('userInfo', currentUser)
          }
        }
      }
      
      console.log('✅ 数据一致性检查完成')
      return true
    } catch (error) {
      console.error('❌ 数据一致性检查失败:', error)
      return false
    }
  }

  /**
   * 获取用户数据（优先本地存储）
   */
  async getUserData(userId) {
    try {
      const userData = uni.getStorageSync('userData') || []
      const user = userData.find(u => u.id === userId)
      
      if (user) {
        console.log('✅ 从本地存储获取用户数据:', user.username)
        return user
      }
      
      console.warn('⚠️ 本地存储中未找到用户数据')
      return null
    } catch (error) {
      console.error('❌ 获取用户数据失败:', error)
      return null
    }
  }

  /**
   * 强制同步所有数据
   */
  async forceSyncAllData() {
    try {
      console.log('🔄 开始强制同步所有数据...')
      
      // 确保数据一致性
      await this.ensureDataConsistency()
      
      // 触发数据更新事件
      uni.$emit('dataSyncComplete', {
        timestamp: new Date().toISOString(),
        message: '数据同步完成'
      })
      
      console.log('✅ 强制同步完成')
      return true
    } catch (error) {
      console.error('❌ 强制同步失败:', error)
      return false
    }
  }

  /**
   * 重置数据（清空本地存储）
   */
  async resetData() {
    try {
      uni.removeStorageSync('userData')
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
      
      console.log('✅ 数据已重置')
      return true
    } catch (error) {
      console.error('❌ 重置数据失败:', error)
      return false
    }
  }
}

// 创建单例实例
const dataSyncFix = new DataSyncFix()

export default dataSyncFix

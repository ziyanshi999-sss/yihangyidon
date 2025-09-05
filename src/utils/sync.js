/**
 * 数据同步工具类
 * 处理离线数据同步和重试机制
 */

class SyncManager {
  constructor() {
    this.maxRetryCount = 3
    this.retryInterval = 5000 // 5秒
    this.syncQueue = []
    this.isSyncing = false
  }

  /**
   * 初始化同步管理器
   */
  init() {
    this.loadSyncQueue()
    this.startSyncTimer()
  }

  /**
   * 加载同步队列
   */
  loadSyncQueue() {
    try {
      this.syncQueue = uni.getStorageSync('syncQueue') || []
      console.log('加载同步队列:', this.syncQueue.length, '个任务')
    } catch (error) {
      console.error('加载同步队列失败:', error)
      this.syncQueue = []
    }
  }

  /**
   * 保存同步队列
   */
  saveSyncQueue() {
    try {
      uni.setStorageSync('syncQueue', this.syncQueue)
    } catch (error) {
      console.error('保存同步队列失败:', error)
    }
  }

  /**
   * 添加同步任务
   * @param {string} type 任务类型
   * @param {object} data 任务数据
   */
  addSyncTask(type, data) {
    const task = {
      id: this.generateTaskId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    }
    
    this.syncQueue.push(task)
    this.saveSyncQueue()
    
    console.log('添加同步任务:', type, task.id)
    
    // 立即尝试同步
    this.processSyncQueue()
  }

  /**
   * 生成任务ID
   */
  generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * 开始同步定时器
   */
  startSyncTimer() {
    // 每30秒检查一次同步队列
    setInterval(() => {
      this.processSyncQueue()
    }, 30000)
  }

  /**
   * 处理同步队列
   */
  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return
    }

    this.isSyncing = true
    
    try {
      // 检查网络状态
      const networkType = await this.getNetworkType()
      if (networkType === 'none') {
        console.log('网络不可用，跳过同步')
        return
      }

      // 处理待同步的任务
      const pendingTasks = this.syncQueue.filter(task => task.status === 'pending')
      
      for (const task of pendingTasks) {
        await this.processTask(task)
      }
      
      // 清理已完成的任务
      this.cleanupCompletedTasks()
      
    } catch (error) {
      console.error('处理同步队列失败:', error)
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * 处理单个任务
   * @param {object} task 任务对象
   */
  async processTask(task) {
    try {
      console.log('处理同步任务:', task.type, task.id)
      
      let success = false
      
      switch (task.type) {
        case 'updateAvatar':
          success = await this.syncAvatar(task.data)
          break
        case 'updateProfile':
          success = await this.syncProfile(task.data)
          break
        case 'updateUserInfo':
          success = await this.syncUserInfo(task.data)
          break
        default:
          console.warn('未知的同步任务类型:', task.type)
          task.status = 'failed'
          break
      }
      
      if (success) {
        task.status = 'completed'
        console.log('同步任务完成:', task.id)
      } else {
        task.retryCount++
        if (task.retryCount >= this.maxRetryCount) {
          task.status = 'failed'
          console.error('同步任务失败，已达到最大重试次数:', task.id)
        } else {
          console.log('同步任务失败，将重试:', task.id, '重试次数:', task.retryCount)
        }
      }
      
    } catch (error) {
      console.error('处理同步任务失败:', task.id, error)
      task.retryCount++
      if (task.retryCount >= this.maxRetryCount) {
        task.status = 'failed'
      }
    }
    
    this.saveSyncQueue()
  }

  /**
   * 同步头像
   * @param {object} userInfo 用户信息
   */
  async syncAvatar(userInfo) {
    try {
      const response = await this.request({
        url: 'https://api.abchina.com/user/avatar',
        method: 'PUT',
        data: {
          avatar: userInfo.avatar,
          avatarUpdateTime: userInfo.avatarUpdateTime
        }
      })
      
      return response.success
    } catch (error) {
      console.error('同步头像失败:', error)
      return false
    }
  }

  /**
   * 同步用户资料
   * @param {object} profileData 资料数据
   */
  async syncProfile(profileData) {
    try {
      const response = await this.request({
        url: 'https://api.abchina.com/user/profile',
        method: 'PUT',
        data: profileData
      })
      
      return response.success
    } catch (error) {
      console.error('同步用户资料失败:', error)
      return false
    }
  }

  /**
   * 同步用户信息
   * @param {object} userInfo 用户信息
   */
  async syncUserInfo(userInfo) {
    try {
      const response = await this.request({
        url: 'https://api.abchina.com/user/info',
        method: 'PUT',
        data: userInfo
      })
      
      return response.success
    } catch (error) {
      console.error('同步用户信息失败:', error)
      return false
    }
  }

  /**
   * 发送请求
   * @param {object} options 请求选项
   */
  request(options) {
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`,
          ...options.header
        },
        success: (res) => {
          if (res.data.code === 0) {
            resolve({ success: true, data: res.data.data })
          } else {
            reject(new Error(res.data.message || '请求失败'))
          }
        },
        fail: reject
      })
    })
  }

  /**
   * 获取网络类型
   */
  getNetworkType() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => resolve(res.networkType),
        fail: () => resolve('unknown')
      })
    })
  }

  /**
   * 清理已完成的任务
   */
  cleanupCompletedTasks() {
    const beforeCount = this.syncQueue.length
    this.syncQueue = this.syncQueue.filter(task => task.status === 'pending')
    const afterCount = this.syncQueue.length
    
    if (beforeCount !== afterCount) {
      this.saveSyncQueue()
      console.log('清理已完成的任务:', beforeCount - afterCount, '个')
    }
  }

  /**
   * 获取同步状态
   */
  getSyncStatus() {
    const pending = this.syncQueue.filter(task => task.status === 'pending').length
    const failed = this.syncQueue.filter(task => task.status === 'failed').length
    
    return {
      pending,
      failed,
      total: this.syncQueue.length,
      isSyncing: this.isSyncing
    }
  }

  /**
   * 手动触发同步
   */
  async manualSync() {
    if (this.isSyncing) {
      uni.showToast({
        title: '正在同步中...',
        icon: 'none'
      })
      return
    }

    uni.showLoading({
      title: '同步中...'
    })

    try {
      await this.processSyncQueue()
      
      const status = this.getSyncStatus()
      if (status.pending === 0) {
        uni.showToast({
          title: '同步完成',
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: `还有${status.pending}个任务待同步`,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('手动同步失败:', error)
      uni.showToast({
        title: '同步失败',
        icon: 'none'
      })
    } finally {
      uni.hideLoading()
    }
  }
}

// 创建单例实例
const syncManager = new SyncManager()

export default syncManager

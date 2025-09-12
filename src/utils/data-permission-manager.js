/**
 * 数据权限管理器
 * 管理AI对用户数据的访问权限和操作权限
 */

class DataPermissionManager {
  constructor() {
    this.permissions = {
      read: {
        userInfo: false,
        accountData: false,
        transactions: false,
        investments: false,
        goals: false,
        spending: false,
        all: false
      },
      write: {
        updateProfile: false,
        createGoal: false,
        updateGoal: false,
        createInvestment: false,
        updateInvestment: false,
        createTransaction: false,
        all: false
      },
      analyze: {
        financialAnalysis: false,
        riskAssessment: false,
        investmentAdvice: false,
        spendingAnalysis: false,
        all: false
      }
    }
    
    this.consentHistory = []
    this.loadPermissions()
  }

  /**
   * 加载已保存的权限设置
   */
  loadPermissions() {
    try {
      const savedPermissions = uni.getStorageSync('ai_data_permissions')
      if (savedPermissions) {
        this.permissions = { ...this.permissions, ...savedPermissions }
      }
    } catch (error) {
      console.error('加载权限设置失败:', error)
    }
  }

  /**
   * 保存权限设置
   */
  savePermissions() {
    try {
      uni.setStorageSync('ai_data_permissions', this.permissions)
      this.recordConsent('permissions_updated', this.permissions)
    } catch (error) {
      console.error('保存权限设置失败:', error)
    }
  }

  /**
   * 记录用户同意操作
   */
  recordConsent(action, data) {
    const consent = {
      timestamp: new Date().toISOString(),
      action: action,
      data: data,
      ip: 'local'
    }
    this.consentHistory.push(consent)
    
    try {
      uni.setStorageSync('ai_consent_history', this.consentHistory)
    } catch (error) {
      console.error('记录同意操作失败:', error)
    }
  }

  /**
   * 请求数据访问权限
   */
  async requestDataAccess(dataType, purpose) {
    return new Promise((resolve, reject) => {
      const message = this.getPermissionMessage(dataType, purpose)
      
      uni.showModal({
        title: '数据访问请求',
        content: message,
        confirmText: '同意',
        cancelText: '拒绝',
        success: (res) => {
          if (res.confirm) {
            this.grantPermission(dataType)
            this.recordConsent('data_access_granted', { dataType, purpose })
            resolve(true)
          } else {
            this.recordConsent('data_access_denied', { dataType, purpose })
            resolve(false)
          }
        },
        fail: () => {
          reject(new Error('权限请求失败'))
        }
      })
    })
  }

  /**
   * 获取权限请求消息
   */
  getPermissionMessage(dataType, purpose) {
    const messages = {
      userInfo: 'AI需要访问您的基本信息（年龄、收入、风险偏好等）来提供个性化的理财建议。',
      accountData: 'AI需要访问您的账户数据（余额、账户信息等）来进行财务分析。',
      transactions: 'AI需要访问您的交易记录来分析消费模式和投资行为。',
      investments: 'AI需要访问您的投资数据来评估投资组合表现。',
      goals: 'AI需要访问您的理财目标来制定相应的投资策略。',
      spending: 'AI需要访问您的消费数据来优化支出结构。',
      all: 'AI需要访问您的所有财务数据来提供全面的财富管理服务。'
    }
    
    const purposeMessages = {
      analysis: '用于财务分析和风险评估',
      advice: '用于生成个性化投资建议',
      optimization: '用于优化资产配置',
      planning: '用于制定理财规划'
    }
    
    return `${messages[dataType] || messages.all}\n\n目的：${purposeMessages[purpose] || purpose}`
  }

  /**
   * 授予权限
   */
  grantPermission(dataType) {
    if (dataType === 'all') {
      // 授予所有权限
      Object.keys(this.permissions.read).forEach(key => {
        this.permissions.read[key] = true
      })
      Object.keys(this.permissions.write).forEach(key => {
        this.permissions.write[key] = true
      })
      Object.keys(this.permissions.analyze).forEach(key => {
        this.permissions.analyze[key] = true
      })
    } else {
      // 授予特定权限
      if (this.permissions.read.hasOwnProperty(dataType)) {
        this.permissions.read[dataType] = true
      }
      if (this.permissions.write.hasOwnProperty(dataType)) {
        this.permissions.write[dataType] = true
      }
      if (this.permissions.analyze.hasOwnProperty(dataType)) {
        this.permissions.analyze[dataType] = true
      }
    }
    
    this.savePermissions()
  }

  /**
   * 撤销权限
   */
  revokePermission(dataType) {
    if (dataType === 'all') {
      // 撤销所有权限
      Object.keys(this.permissions.read).forEach(key => {
        this.permissions.read[key] = false
      })
      Object.keys(this.permissions.write).forEach(key => {
        this.permissions.write[key] = false
      })
      Object.keys(this.permissions.analyze).forEach(key => {
        this.permissions.analyze[key] = false
      })
    } else {
      // 撤销特定权限
      if (this.permissions.read.hasOwnProperty(dataType)) {
        this.permissions.read[dataType] = false
      }
      if (this.permissions.write.hasOwnProperty(dataType)) {
        this.permissions.write[dataType] = false
      }
      if (this.permissions.analyze.hasOwnProperty(dataType)) {
        this.permissions.analyze[dataType] = false
      }
    }
    
    this.savePermissions()
    this.recordConsent('permission_revoked', { dataType })
  }

  /**
   * 检查权限
   */
  hasPermission(type, dataType) {
    if (this.permissions[type] && this.permissions[type][dataType]) {
      return true
    }
    if (this.permissions[type] && this.permissions[type].all) {
      return true
    }
    return false
  }

  /**
   * 获取权限状态
   */
  getPermissionStatus() {
    return {
      permissions: this.permissions,
      consentHistory: this.consentHistory,
      lastUpdated: this.consentHistory.length > 0 ? this.consentHistory[this.consentHistory.length - 1].timestamp : null
    }
  }

  /**
   * 重置所有权限
   */
  resetAllPermissions() {
    this.permissions = {
      read: {
        userInfo: false,
        accountData: false,
        transactions: false,
        investments: false,
        goals: false,
        spending: false,
        all: false
      },
      write: {
        updateProfile: false,
        createGoal: false,
        updateGoal: false,
        createInvestment: false,
        updateInvestment: false,
        createTransaction: false,
        all: false
      },
      analyze: {
        financialAnalysis: false,
        riskAssessment: false,
        investmentAdvice: false,
        spendingAnalysis: false,
        all: false
      }
    }
    
    this.savePermissions()
    this.recordConsent('all_permissions_reset', {})
  }

  /**
   * 批量请求权限
   */
  async requestMultiplePermissions(permissions) {
    const results = {}
    
    for (const permission of permissions) {
      const granted = await this.requestDataAccess(permission.dataType, permission.purpose)
      results[permission.dataType] = granted
    }
    
    return results
  }

  /**
   * 获取权限摘要
   */
  getPermissionSummary() {
    const readCount = Object.values(this.permissions.read).filter(Boolean).length
    const writeCount = Object.values(this.permissions.write).filter(Boolean).length
    const analyzeCount = Object.values(this.permissions.analyze).filter(Boolean).length
    
    return {
      totalPermissions: readCount + writeCount + analyzeCount,
      readPermissions: readCount,
      writePermissions: writeCount,
      analyzePermissions: analyzeCount,
      hasFullAccess: this.permissions.read.all && this.permissions.write.all && this.permissions.analyze.all
    }
  }
}

// 创建单例实例
const dataPermissionManager = new DataPermissionManager()

export default dataPermissionManager



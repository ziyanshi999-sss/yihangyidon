// 用户等级检查工具

/**
 * 检查用户是否符合白金贵宾条件
 * @param {Object} userInfo - 用户信息
 * @returns {boolean} 是否符合白金贵宾条件
 */
export function isPlatinumVip(userInfo) {
  if (!userInfo || !userInfo.creditCards || !Array.isArray(userInfo.creditCards)) {
    return false
  }
  
  // 检查是否有白金卡或钻石卡
  const hasPlatinumCard = userInfo.creditCards.some(card => 
    card.cardType === '白金卡' || card.cardType === '钻石卡'
  )
  
  // 检查账户余额是否达到白金贵宾标准（50万以上）
  const hasHighBalance = userInfo.balance >= 500000
  
  // 检查是否有高额度信用卡（10万以上）
  const hasHighCreditLimit = userInfo.creditCards.some(card => 
    card.creditLimit >= 100000
  )
  
  // 满足任一条件即可成为白金贵宾
  return hasPlatinumCard || hasHighBalance || hasHighCreditLimit
}

/**
 * 获取用户等级
 * @param {Object} userInfo - 用户信息
 * @returns {string} 用户等级
 */
export function getUserLevel(userInfo) {
  if (!userInfo) {
    return '普通用户'
  }
  
  if (isPlatinumVip(userInfo)) {
    return '白金贵宾'
  }
  
  // 检查是否有金卡
  const hasGoldCard = userInfo.creditCards && userInfo.creditCards.some(card => 
    card.cardType === '金卡'
  )
  
  if (hasGoldCard) {
    return '金卡用户'
  }
  
  return '普通用户'
}

/**
 * 获取用户等级显示信息
 * @param {Object} userInfo - 用户信息
 * @returns {Object} 等级信息
 */
export function getUserLevelInfo(userInfo) {
  const level = getUserLevel(userInfo)
  
  const levelInfo = {
    '普通用户': {
      name: '普通用户',
      color: '#666',
      icon: '👤',
      description: '标准服务'
    },
    '金卡用户': {
      name: '金卡用户',
      color: '#FFD700',
      icon: '🥇',
      description: '优先服务'
    },
    '白金贵宾': {
      name: '白金贵宾',
      color: '#C0C0C0',
      icon: '💎',
      description: '专属服务'
    }
  }
  
  return levelInfo[level] || levelInfo['普通用户']
}

/**
 * 检查用户是否可以访问白金贵宾专线
 * @param {Object} userInfo - 用户信息
 * @returns {boolean} 是否可以访问
 */
export function canAccessPlatinumHotline(userInfo) {
  return isPlatinumVip(userInfo)
}

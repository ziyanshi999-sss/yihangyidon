// 从JSON文件加载用户数据
import userDataJson from '../../db/user.json'
import { getStorage, setStorage } from '@/utils/storage'

// 用户数据存储
let users = []

// 初始化用户数据
function initUsers() {
  try {
    // 首先尝试从本地存储获取用户数据
    const storedUsers = getStorage('users', true)
    if (storedUsers && storedUsers.length > 0) {
      users = storedUsers
      console.log('从本地存储加载用户数据:', users.length, '个用户')
    } else {
      // 如果本地存储没有数据，使用JSON文件数据
      users = userDataJson || []
      // 保存到本地存储
      saveUsersToStorage()
      console.log('从JSON文件加载用户数据:', users.length, '个用户')
    }
  } catch (error) {
    console.error('初始化用户数据失败:', error)
    users = userDataJson || []
  }
}

// 保存用户数据到本地存储
function saveUsersToStorage() {
  try {
    setStorage('users', users, true)
    console.log('用户数据已保存到本地存储')
  } catch (error) {
    console.error('保存用户数据失败:', error)
  }
}

// 初始化用户数据
initUsers()

// 模拟验证码存储
const verificationCodes = new Map()

// 生成验证码
export function generateVerificationCode(phone) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  verificationCodes.set(phone, {
    code,
    expireTime: Date.now() + 5 * 60 * 1000 // 5分钟过期
  })
  return code
}

// 验证验证码
export function verifyCode(phone, code) {
  const stored = verificationCodes.get(phone)
  if (!stored) return false
  
  if (Date.now() > stored.expireTime) {
    verificationCodes.delete(phone)
    return false
  }
  
  if (stored.code === code) {
    verificationCodes.delete(phone)
    return true
  }
  
  return false
}

// 验证用户登录
export function validateUser(usernameOrPhone, password) {
  console.log('登录验证:', { usernameOrPhone, password, totalUsers: users.length })
  
  const user = users.find(user => {
    // 支持用户名或手机号登录
    const matchUsername = user.username && user.username === usernameOrPhone
    const matchPhone = user.phone && user.phone === usernameOrPhone
    const matchPassword = user.password === password
    
    console.log('检查用户:', { 
      userId: user.id, 
      username: user.username, 
      phone: user.phone,
      matchUsername, 
      matchPhone, 
      matchPassword 
    })
    
    return (matchUsername || matchPhone) && matchPassword
  })
  
  if (user) {
    console.log('登录成功:', user.id)
    // 更新最后登录时间
    user.lastLoginTime = new Date().toISOString()
  } else {
    console.log('登录失败: 用户名/手机号或密码错误')
  }
  
  return user
}

// 根据用户名或手机号查找用户
export function findUserByUsername(username) {
  return users.find(user => 
    user.username === username || user.phone === username
  )
}

// 检查用户是否已存在
export function checkUserExists(username, phone) {
  return users.some(user => 
    user.username === username || user.phone === phone
  )
}

// 注册新用户
export function registerUser(userData) {
  // 生成新的用户ID
  const maxId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id.replace('u', '')))) : 0
  const newId = `u${String(maxId + 1).padStart(3, '0')}`
  
  const newUser = {
    id: newId,
    username: userData.username,
    password: userData.password,
    transactionPassword: userData.password, // 默认交易密码与登录密码相同
    phone: userData.phone,
    nickname: userData.nickname || userData.username,
    email: userData.email || '',
    idCard: userData.idCard || '',
    avatar: '/static/wealth/useravatar.jpg', // 默认头像
    balance: 0.00, // 初始余额
    realName: userData.nickname || userData.username,
    gender: '',
    birthDate: '',
    address: '',
    avatarUpdateTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString(),
    createTime: new Date().toISOString(),
    lastLoginTime: null,
    status: 'active',
    securitySettings: {
      biometricEnabled: false,
      smsVerificationEnabled: true,
      accountLockEnabled: true,
      twoFactorEnabled: false,
      securityNotificationsEnabled: true,
      transactionLimit: 10000,
      passwordUpdateTime: new Date().toISOString(),
      transactionPasswordUpdateTime: new Date().toISOString(),
      securityQuestionsSet: false,
      emergencyContactSet: false,
      loginDevices: [],
      securityEvents: [],
      securityQuestions: [],
      emergencyContact: null,
      twoFactorSecret: null
    },
    creditCards: []
  }
  
  // 添加到用户数组
  users.push(newUser)
  
  // 保存到本地存储
  saveUsersToStorage()
  
  console.log('新用户注册成功:', newUser)
  console.log('当前用户总数:', users.length)
  
  return newUser
}

// 获取所有用户（管理员功能）
export function getAllUsers() {
  return users
}

// 根据ID查找用户
export function findUserById(id) {
  return users.find(user => user.id === id)
}

// 更新用户信息
export function updateUser(userId, updateData) {
  const userIndex = users.findIndex(user => user.id === userId)
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updateData, lastUpdateTime: new Date().toISOString() }
    saveUsersToStorage()
    return users[userIndex]
  }
  return null
}

// 获取用户数据（用于调试）
export function getUsersData() {
  return users
}

// 导出用户数组（兼容性）
export { users }

// 重置用户数据（用于测试）
export function resetUsersData() {
  users = userDataJson || []
  saveUsersToStorage()
  console.log('用户数据已重置')
}
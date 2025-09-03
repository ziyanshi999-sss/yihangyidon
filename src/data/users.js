// 从JSON文件加载用户数据
import userDataJson from '../../db/user.json'

// 用户数据存储
export const users = userDataJson || []

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
    phone: userData.phone,
    nickname: userData.nickname || userData.username,
    avatar: '',
    email: userData.email || '',
    idCard: userData.idCard || '',
    createTime: new Date().toISOString(),
    lastLoginTime: null,
    status: 'active'
  }
  
  users.push(newUser)
  
  // 在实际项目中，这里应该发送到后端API
  console.log('新用户注册成功:', newUser)
  
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
// 模拟用户数据
export const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    phone: '13800138000',
    nickname: '管理员',
    avatar: '/static/logo.png',
    email: 'admin@example.com'
  },
  {
    id: 2,
    username: 'user001',
    password: '123456',
    phone: '13800138001',
    nickname: '张三',
    avatar: '/static/logo.png',
    email: 'user001@example.com'
  },
  {
    id: 3,
    username: 'user002',
    password: '123456',
    phone: '13800138002',
    nickname: '李四',
    avatar: '/static/logo.png',
    email: 'user002@example.com'
  },
  {
    id: 4,
    username: 'test',
    password: 'test123',
    phone: '13800138003',
    nickname: '测试用户',
    avatar: '/static/logo.png',
    email: 'test@example.com'
  }
]

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
export function validateUser(username, password) {
  return users.find(user => 
    (user.username === username || user.phone === username) && 
    user.password === password
  )
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
  const newUser = {
    id: users.length + 1,
    username: userData.username,
    password: userData.password,
    phone: userData.phone,
    nickname: userData.nickname || userData.username,
    avatar: '/static/logo.png',
    email: userData.email || '',
    createTime: new Date().toISOString(),
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
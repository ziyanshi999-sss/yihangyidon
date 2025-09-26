// 数据配置文件
// 用于连接项目到新的 bank-data.json 文件

const config = {
  // API 服务器配置
  apiServer: {
    baseUrl: 'http://localhost:3002',
    endpoints: {
      users: '/users',
      systemConfig: '/systemConfig',
      bankInfo: '/bankInfo',
      lifeServices: '/lifeServices',
      wealthProducts: '/wealthProducts'
    }
  },
  
  // 数据字段映射
  dataMapping: {
    // 用户数据映射
    user: {
      id: 'id',
      username: 'username',
      phone: 'phone',
      password: 'password',
      transactionPassword: 'transactionPassword',
      balance: 'balance',
      nickname: 'nickname',
      email: 'email',
      idCard: 'idCard',
      avatar: 'avatar',
      status: 'status',
      createTime: 'createTime',
      lastLoginTime: 'lastLoginTime',
      realName: 'realName',
      gender: 'gender',
      birthDate: 'birthDate',
      address: 'address',
      isLoggedIn: 'isLoggedIn'
    },
    
    // 安全设置映射
    securitySettings: {
      biometricEnabled: 'biometricEnabled',
      smsVerificationEnabled: 'smsVerificationEnabled',
      accountLockEnabled: 'accountLockEnabled',
      twoFactorEnabled: 'twoFactorEnabled',
      securityNotificationsEnabled: 'securityNotificationsEnabled',
      transactionLimit: 'transactionLimit',
      loginDevices: 'loginDevices',
      securityEvents: 'securityEvents',
      securityQuestions: 'securityQuestions',
      emergencyContact: 'emergencyContact'
    },
    
    // 信用卡数据映射
    creditCards: {
      id: 'id',
      cardNumber: 'cardNumber',
      cardType: 'cardType',
      cardBrand: 'cardBrand',
      creditLimit: 'creditLimit',
      availableCredit: 'availableCredit',
      currentBalance: 'currentBalance',
      minPayment: 'minPayment',
      dueDate: 'dueDate',
      cardStatus: 'cardStatus',
      cardHolder: 'cardHolder',
      expiryDate: 'expiryDate',
      rewardsPoints: 'rewardsPoints',
      cardColor: 'cardColor'
    },
    
    // 交易记录映射
    transactionRecords: {
      id: 'id',
      type: 'type',
      amount: 'amount',
      description: 'description',
      balance: 'balance',
      timestamp: 'timestamp',
      icon: 'icon',
      title: 'title',
      time: 'time'
    },
    
    // 财富产品映射
    wealthProducts: {
      deposits: 'deposits',
      investments: 'investments'
    },
    
    // 投资组合映射
    investmentPortfolio: {
      totalValue: 'totalValue',
      totalReturn: 'totalReturn',
      returnRate: 'returnRate',
      holdings: 'holdings'
    }
  },
  
  // 数据验证规则
  validation: {
    phone: /^1[3-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    idCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/
  },
  
  // 默认值配置
  defaults: {
    user: {
      status: 'active',
      balance: 0,
      isLoggedIn: false,
      avatar: '/static/wealth/useravatar.jpg'
    },
    securitySettings: {
      biometricEnabled: false,
      smsVerificationEnabled: true,
      accountLockEnabled: true,
      twoFactorEnabled: false,
      securityNotificationsEnabled: true,
      transactionLimit: 50000
    }
  }
};

// 导出配置
export default config;

// 如果在 Node.js 环境中使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

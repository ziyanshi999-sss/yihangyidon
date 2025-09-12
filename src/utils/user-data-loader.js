/**
 * 用户数据加载器
 * 从 user.json 文件加载真实的用户数据
 */

class UserDataLoader {
  constructor() {
    this.userData = null
    this.currentUser = null
  }

  /**
   * 加载所有用户数据
   */
  async loadAllUsers() {
    try {
      // 尝试从user.json文件加载真实数据
      console.log('尝试从user.json加载用户数据')
      this.userData = await this.getMockUserData()
      return this.userData
    } catch (error) {
      console.error('加载用户数据失败:', error)
      // 如果仍然失败，返回空数组而不是抛出错误
      this.userData = []
      return []
    }
  }

  /**
   * 根据用户ID获取用户数据
   */
  async getUserById(userId) {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const user = this.userData.find(u => u.id === userId)
      if (user) {
        this.currentUser = user
        return user
      } else {
        throw new Error(`用户不存在: ${userId}`)
      }
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return null
    }
  }

  /**
   * 根据手机号获取用户数据
   */
  async getUserByPhone(phone) {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const user = this.userData.find(u => u.phone === phone)
      if (user) {
        this.currentUser = user
        return user
      } else {
        throw new Error(`用户不存在: ${phone}`)
      }
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return null
    }
  }

  /**
   * 根据用户名获取用户数据
   */
  async getUserByUsername(username) {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const user = this.userData.find(u => u.username === username)
      if (user) {
        this.currentUser = user
        return user
      } else {
        throw new Error(`用户不存在: ${username}`)
      }
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return null
    }
  }

  /**
   * 获取当前登录用户数据
   */
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser
    }
    
    // 尝试从本地存储获取当前用户信息
    const loginInfo = uni.getStorageSync('loginInfo')
    if (loginInfo && loginInfo.username) {
      return this.getUserByUsername(loginInfo.username)
    }
    
    return null
  }

  /**
   * 获取用户完整财务数据
   */
  async getUserFinancialData(userId) {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        throw new Error('用户不存在')
      }

      return {
        // 基本信息
        userInfo: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          realName: user.realName,
          gender: user.gender,
          birthDate: user.birthDate,
          address: user.address,
          avatar: user.avatar,
          status: user.status,
          createTime: user.createTime,
          lastLoginTime: user.lastLoginTime
        },

        // 账户数据
        accountData: {
          balance: user.balance,
          bankAccounts: user.bankAccounts || [],
          totalBalance: user.balance,
          accountCount: (user.bankAccounts || []).length
        },

        // 信用卡数据
        creditCardData: {
          cards: user.creditCards || [],
          totalCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.creditLimit || 0), 0),
          usedCreditLimit: (user.creditCards || []).reduce((sum, card) => sum + (card.currentBalance || 0), 0),
          availableCredit: (user.creditCards || []).reduce((sum, card) => sum + (card.availableCredit || 0), 0),
          cardCount: (user.creditCards || []).length
        },

        // 交易数据
        transactionData: {
          records: user.transactionRecords || [],
          totalTransactions: (user.transactionRecords || []).length,
          totalAmount: (user.transactionRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0),
          averageAmount: (user.transactionRecords || []).length > 0 ? 
            (user.transactionRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0) / (user.transactionRecords || []).length : 0
        },

        // 投资数据
        investmentData: {
          portfolio: user.investmentPortfolio || {},
          wealthProducts: user.wealthProducts || {},
          totalInvested: (user.investmentPortfolio?.holdings || []).reduce((sum, inv) => sum + (inv.amount || 0), 0),
          currentValue: (user.investmentPortfolio?.holdings || []).reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0),
          totalReturn: (user.investmentPortfolio?.holdings || []).reduce((sum, inv) => sum + ((inv.currentValue || inv.amount || 0) - (inv.amount || 0)), 0),
          returnRate: user.investmentPortfolio?.returnRate || 0
        },

        // 转账数据
        transferData: {
          records: user.transferRecords || [],
          frequentContacts: user.frequentContacts || [],
          totalTransfers: (user.transferRecords || []).length,
          totalTransferAmount: (user.transferRecords || []).reduce((sum, t) => sum + (t.amount || 0), 0)
        },

        // 支付数据
        paymentData: {
          records: user.paymentRecords || [],
          lifeServices: user.lifeServices || {},
          totalPayments: (user.paymentRecords || []).length,
          totalPaymentAmount: (user.paymentRecords || []).reduce((sum, p) => sum + (p.amount || 0), 0)
        },

        // 安全设置
        securityData: {
          settings: user.securitySettings || {},
          biometricEnabled: user.securitySettings?.biometricEnabled || false,
          twoFactorEnabled: user.securitySettings?.twoFactorEnabled || false,
          transactionLimit: user.securitySettings?.transactionLimit || 0
        },

        // 时间戳
        loadedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('获取用户财务数据失败:', error)
      throw error
    }
  }

  /**
   * 更新用户数据
   */
  async updateUserData(userId, updateData) {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const userIndex = this.userData.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('用户不存在')
      }
      
      // 更新用户数据
      this.userData[userIndex] = {
        ...this.userData[userIndex],
        ...updateData,
        lastUpdateTime: new Date().toISOString()
      }
      
      // 更新当前用户
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = this.userData[userIndex]
      }
      
      // 保存到本地存储
      uni.setStorageSync('userData', this.userData)
      
      return this.userData[userIndex]
    } catch (error) {
      console.error('更新用户数据失败:', error)
      throw error
    }
  }

  /**
   * 添加交易记录
   */
  async addTransaction(userId, transaction) {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        throw new Error('用户不存在')
      }
      
      const newTransaction = {
        id: Date.now(),
        ...transaction,
        timestamp: new Date().toISOString()
      }
      
      if (!user.transactionRecords) {
        user.transactionRecords = []
      }
      
      user.transactionRecords.push(newTransaction)
      
      // 更新余额
      if (transaction.type === 'income') {
        user.balance += transaction.amount
      } else if (transaction.type === 'expense') {
        user.balance -= transaction.amount
      }
      
      await this.updateUserData(userId, user)
      
      return newTransaction
    } catch (error) {
      console.error('添加交易记录失败:', error)
      throw error
    }
  }

  /**
   * 添加投资记录
   */
  async addInvestment(userId, investment) {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        throw new Error('用户不存在')
      }
      
      const newInvestment = {
        id: `inv${Date.now()}`,
        ...investment,
        purchaseDate: new Date().toISOString(),
        status: '持有中',
        currentValue: investment.amount || 0
      }
      
      if (!user.investmentPortfolio) {
        user.investmentPortfolio = {
          totalValue: 0,
          totalReturn: 0,
          returnRate: 0,
          holdings: []
        }
      }
      
      if (!user.investmentPortfolio.holdings) {
        user.investmentPortfolio.holdings = []
      }
      
      user.investmentPortfolio.holdings.push(newInvestment)
      
      // 更新投资组合统计
      user.investmentPortfolio.totalValue = user.investmentPortfolio.holdings.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0)
      user.investmentPortfolio.totalReturn = user.investmentPortfolio.holdings.reduce((sum, inv) => sum + ((inv.currentValue || inv.amount || 0) - (inv.amount || 0)), 0)
      user.investmentPortfolio.returnRate = user.investmentPortfolio.totalValue > 0 ? (user.investmentPortfolio.totalReturn / user.investmentPortfolio.totalValue) * 100 : 0
      
      await this.updateUserData(userId, user)
      
      return newInvestment
    } catch (error) {
      console.error('添加投资记录失败:', error)
      throw error
    }
  }

  /**
   * 获取模拟用户数据（备用）
   */
  async getMockUserData() {
    try {
      // 尝试从user.json文件加载真实数据
      const response = await fetch('/db/user.json')
      if (response.ok) {
        const userData = await response.json()
        return userData
      }
    } catch (error) {
      console.error('加载user.json失败，使用默认数据:', error)
    }
    
    // 如果加载失败，返回默认数据
    return [
      {
        id: "u001",
        username: "李华",
        phone: "13888888888",
        password: "123456",
        transactionPassword: "888888",
        balance: 280000.00,
        nickname: "华华",
        email: "lihua@example.com",
        idCard: "110101199503151234",
        avatar: "/static/wealth/useravatar.jpg",
        status: "active",
        createTime: "2024-01-10T08:30:00.000Z",
        lastLoginTime: "2024-01-20T16:45:00.000Z",
        realName: "李华",
        gender: "女",
        birthDate: "1995-03-15",
        address: "北京市朝阳区建国门外大街1号",
        avatarUpdateTime: "2024-01-15T14:20:00.000Z",
        lastUpdateTime: "2024-01-15T14:20:00.000Z",
        securitySettings: {
          biometricEnabled: true,
          smsVerificationEnabled: true,
          accountLockEnabled: true,
          twoFactorEnabled: true,
          securityNotificationsEnabled: true,
          transactionLimit: 100000,
          passwordUpdateTime: "2024-01-10T00:00:00.000Z",
          transactionPasswordUpdateTime: "2024-01-10T00:00:00.000Z",
          securityQuestionsSet: true,
          emergencyContactSet: true,
          loginDevices: [
            {
              id: 1,
              name: "iPhone 15 Pro",
              lastLogin: "2024-01-15T14:20:00.000Z",
              location: "上海市",
              status: "active",
              ip: "192.168.1.200",
              deviceType: "mobile"
            }
          ],
          securityEvents: [
            {
              id: 1,
              type: "login",
              description: "账户登录",
              timestamp: "2024-01-15T14:20:00.000Z",
              location: "上海市",
              ip: "192.168.1.200",
              status: "success"
            }
          ],
          securityQuestions: [
            {
              question: "您的小学名称是什么？",
              answer: "实验小学"
            }
          ],
          emergencyContact: {
            name: "张大明",
            phone: "13800138000",
            relationship: "父亲"
          },
          twoFactorSecret: "JBSWY3DPEHPK3PXP"
        },
        creditCards: [
          {
            id: "cc001",
            cardNumber: "6222 9999 9999 9999",
            cardType: "白金卡",
            cardBrand: "银联",
            creditLimit: 100000,
            availableCredit: 85000,
            currentBalance: 15000,
            minPayment: 1500,
            statementDate: "20",
            dueDate: "2024-02-10",
            lastStatementDate: "2024-01-20",
            cardStatus: "active",
            cardHolder: "李华",
            expiryDate: "2029-09-30",
            cvv: "456",
            annualFee: 500,
            interestRate: 0.0004,
            cashAdvanceLimit: 50000,
            rewardsPoints: 3200,
            cardColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            createTime: "2023-01-15T00:00:00.000Z",
            lastUsedTime: "2024-01-15T14:20:00.000Z",
            monthlySpending: 8500,
            transactionCount: 23,
            topCategory: "餐饮",
            securityFeatures: {
              chipEnabled: true,
              contactlessEnabled: true,
              onlineShoppingEnabled: true,
              internationalEnabled: true
            }
          }
        ],
        transactionRecords: [
          {
            id: 1,
            type: "income",
            amount: 15000,
            description: "工资收入",
            balance: 280000,
            timestamp: "2024-01-15T09:00:00.000Z",
            icon: "💰",
            title: "工资收入",
            time: "09:00"
          },
          {
            id: 2,
            type: "expense",
            amount: 2000,
            description: "信用卡还款",
            balance: 148000,
            timestamp: "2024-01-12T11:45:00.000Z",
            icon: "💳",
            title: "信用卡还款",
            time: "11:45"
          }
        ],
        wealthProducts: {
          deposits: {
            current: 30000,
            fixed: 50000,
            smart: 20000
          },
          investments: [
            {
              id: "inv002",
              name: "稳健理财B",
              type: "理财产品",
              amount: 20000,
              rate: 4.5,
              term: "180天",
              purchaseDate: "2024-01-05T00:00:00.000Z",
              maturityDate: "2024-07-05T00:00:00.000Z",
              status: "持有中"
            }
          ]
        },
        investmentPortfolio: {
          totalValue: 100000,
          totalReturn: 4500,
          returnRate: 4.5,
          holdings: [
            {
              id: "inv001",
              name: "稳健理财A",
              type: "理财产品",
              amount: 30000,
              rate: 3.8,
              term: "90天",
              purchaseDate: "2024-01-01T00:00:00.000Z",
              maturityDate: "2024-04-01T00:00:00.000Z",
              status: "持有中",
              currentValue: 30285
            },
            {
              id: "inv002",
              name: "稳健理财B",
              type: "理财产品",
              amount: 20000,
              rate: 4.5,
              term: "180天",
              purchaseDate: "2024-01-05T00:00:00.000Z",
              maturityDate: "2024-07-05T00:00:00.000Z",
              status: "持有中",
              currentValue: 20450
            },
            {
              id: "inv003",
              name: "灵活理财C",
              type: "货币基金",
              amount: 50000,
              rate: 2.8,
              term: "开放式",
              purchaseDate: "2023-12-01T00:00:00.000Z",
              maturityDate: null,
              status: "持有中",
              currentValue: 51140
            }
          ]
        },
        bankAccounts: [
          {
            accountNumber: "6228480012345678901",
            accountName: "李华",
            bankName: "中国农业银行",
            accountType: "储蓄卡",
            balance: 280000.00,
            currency: "CNY",
            status: "active",
            openDate: "2020-03-15T00:00:00.000Z",
            branchName: "上海陆家嘴支行"
          }
        ],
        transferRecords: [
          {
            id: "t001",
            type: "outgoing",
            amount: 5000,
            recipient: "李小红",
            recipientAccount: "6228480012345678903",
            description: "生活费转账",
            status: "completed",
            timestamp: "2024-01-14T10:30:00.000Z",
            fee: 2.5
          }
        ],
        paymentRecords: [
          {
            id: "p001",
            type: "手机充值",
            amount: 100,
            phoneNumber: "13999999999",
            status: "completed",
            timestamp: "2024-01-10T14:20:00.000Z",
            operator: "中国移动"
          }
        ]
      },
      {
        id: "u002",
        username: "李小红",
        phone: "13777777777",
        password: "password123",
        transactionPassword: "789012",
        balance: 80000.00,
        nickname: "小红",
        email: "lixiaohong@example.com",
        idCard: "110101199303031789",
        avatar: "/static/wealth/useravatar.jpg",
        status: "active",
        createTime: "2024-01-03T16:45:00.000Z",
        lastLoginTime: "2024-01-14T11:10:00.000Z",
        realName: "李小红",
        gender: "女",
        birthDate: "1993-03-03",
        address: "广州市天河区珠江新城花城大道85号",
        avatarUpdateTime: "2024-01-14T11:10:00.000Z",
        lastUpdateTime: "2024-01-14T11:10:00.000Z",
        securitySettings: {
          biometricEnabled: false,
          smsVerificationEnabled: true,
          accountLockEnabled: false,
          twoFactorEnabled: false,
          securityNotificationsEnabled: false,
          transactionLimit: 200000,
          passwordUpdateTime: "2023-12-01T00:00:00.000Z",
          transactionPasswordUpdateTime: "2023-12-01T00:00:00.000Z",
          securityQuestionsSet: false,
          emergencyContactSet: false,
          loginDevices: [
            {
              id: 1,
              name: "Samsung Galaxy S24",
              lastLogin: "2024-01-14T11:10:00.000Z",
              location: "广州市",
              status: "active",
              ip: "192.168.1.300",
              deviceType: "mobile"
            }
          ],
          securityEvents: [
            {
              id: 1,
              type: "login",
              description: "账户登录",
              timestamp: "2024-01-14T11:10:00.000Z",
              location: "广州市",
              ip: "192.168.1.300",
              status: "success"
            }
          ],
          securityQuestions: [],
          emergencyContact: null,
          twoFactorSecret: null
        },
        creditCards: [
          {
            cardNumber: "6222 6666 6666 6666",
            cardType: "钻石卡",
            cardBrand: "银联",
            creditLimit: 200000,
            availableCredit: 180000,
            currentBalance: 20000,
            minPayment: 2000,
            statementDate: "10",
            dueDate: "2024-02-01",
            lastStatementDate: "2024-01-10",
            cardStatus: "active",
            cardHolder: "李小红",
            expiryDate: "2030-03-31",
            cvv: "321",
            annualFee: 1000,
            interestRate: 0.0003,
            cashAdvanceLimit: 100000,
            rewardsPoints: 6800,
            cardColor: "#FF69B4"
          }
        ],
        transactionRecords: [
          {
            id: 1,
            type: "income",
            amount: 12000,
            description: "工资收入",
            balance: 80000,
            timestamp: "2024-01-14T09:00:00.000Z",
            icon: "💰",
            title: "工资收入",
            time: "09:00"
          },
          {
            id: 2,
            type: "expense",
            amount: 1000,
            description: "生活缴费",
            balance: 79000,
            timestamp: "2024-01-11T16:45:00.000Z",
            icon: "🏠",
            title: "电费缴费",
            time: "16:45"
          }
        ],
        wealthProducts: {
          deposits: {
            current: 20000,
            fixed: 30000,
            smart: 15000
          },
          investments: [
            {
              id: "inv004",
              name: "高收益理财C",
              type: "理财产品",
              amount: 15000,
              rate: 5.2,
              term: "365天",
              purchaseDate: "2024-01-01T00:00:00.000Z",
              maturityDate: "2025-01-01T00:00:00.000Z",
              status: "持有中"
            }
          ]
        },
        investmentPortfolio: {
          totalValue: 65000,
          totalReturn: 2800,
          returnRate: 4.3,
          holdings: [
            {
              id: "inv004",
              name: "高收益理财C",
              type: "理财产品",
              amount: 15000,
              rate: 5.2,
              term: "365天",
              purchaseDate: "2024-01-01T00:00:00.000Z",
              maturityDate: "2025-01-01T00:00:00.000Z",
              status: "持有中",
              currentValue: 15780
            }
          ]
        },
        bankAccounts: [
          {
            accountNumber: "6228480012345678903",
            accountName: "李小红",
            bankName: "中国农业银行",
            accountType: "储蓄卡",
            balance: 80000.00,
            currency: "CNY",
            status: "active",
            openDate: "2021-05-20T00:00:00.000Z",
            branchName: "广州珠江新城支行"
          }
        ],
        transferRecords: [
          {
            id: "t003",
            type: "incoming",
            amount: 5000,
            sender: "李华",
            senderAccount: "6228480012345678901",
            description: "生活费转账",
            status: "completed",
            timestamp: "2024-01-14T10:30:00.000Z",
            fee: 0
          }
        ],
        paymentRecords: [
          {
            id: "p004",
            type: "手机充值",
            amount: 200,
            phoneNumber: "13777777777",
            status: "completed",
            timestamp: "2024-01-05T16:30:00.000Z",
            operator: "中国联通"
          }
        ]
      }
    ]
  }

  /**
   * 搜索用户
   */
  async searchUsers(keyword) {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const results = this.userData.filter(user => 
        user.username.includes(keyword) ||
        user.phone.includes(keyword) ||
        user.realName.includes(keyword) ||
        user.email.includes(keyword)
      )
      
      return results
    } catch (error) {
      console.error('搜索用户失败:', error)
      return []
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats() {
    try {
      if (!this.userData) {
        await this.loadAllUsers()
      }
      
      const stats = {
        totalUsers: this.userData.length,
        activeUsers: this.userData.filter(u => u.status === 'active').length,
        totalBalance: this.userData.reduce((sum, u) => sum + (u.balance || 0), 0),
        averageBalance: this.userData.length > 0 ? this.userData.reduce((sum, u) => sum + (u.balance || 0), 0) / this.userData.length : 0,
        totalInvestments: this.userData.reduce((sum, u) => sum + (u.investmentPortfolio?.totalValue || 0), 0),
        totalCreditLimit: this.userData.reduce((sum, u) => sum + (u.creditCards || []).reduce((cardSum, card) => cardSum + (card.creditLimit || 0), 0), 0)
      }
      
      return stats
    } catch (error) {
      console.error('获取用户统计失败:', error)
      return null
    }
  }
}

// 创建单例实例
const userDataLoader = new UserDataLoader()

export default userDataLoader

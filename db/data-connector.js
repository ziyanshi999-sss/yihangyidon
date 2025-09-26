// 数据连接工具类
// 用于连接项目到 bank-data.json 文件

import config from './data-config.js';

class DataConnector {
  constructor() {
    this.baseUrl = config.apiServer.baseUrl;
    this.endpoints = config.apiServer.endpoints;
    this.isOnline = false;
    this.isInitialized = false;
    this.cache = new Map();
  }

  // 检查 API 服务器是否可用
  async checkServerStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/systemConfig`);
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      console.warn('API 服务器不可用，将使用本地数据:', error.message);
      this.isOnline = false;
      return false;
    }
  }

  // 获取用户数据
  async getUsers() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.users}`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('users', data);
          return data;
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
    }
    
    // 如果在线获取失败，返回缓存数据或空数组
    let cachedUsers = this.cache.get('users') || [];
    
    // 同步本地存储中的用户登录状态（但不覆盖交易记录）
    try {
      const currentUser = uni.getStorageSync('currentUser');
      const isLoggedIn = uni.getStorageSync('isLoggedIn');
      
      if (currentUser && isLoggedIn) {
        // 更新缓存中用户的登录状态
        const userIndex = cachedUsers.findIndex(user => user.id === currentUser.id);
        if (userIndex !== -1) {
          // 保留缓存中的交易记录，只更新其他字段
          const existingTransactionRecords = cachedUsers[userIndex].transactionRecords || [];
          cachedUsers[userIndex].isLoggedIn = true;
          cachedUsers[userIndex] = { 
            ...cachedUsers[userIndex], 
            ...currentUser,
            transactionRecords: existingTransactionRecords // 保留现有交易记录
          };
          console.log('🔄 同步用户登录状态:', currentUser.username);
        } else {
          // 如果缓存中没有用户，添加当前用户
          currentUser.isLoggedIn = true;
          cachedUsers.push(currentUser);
          console.log('➕ 添加当前用户到缓存:', currentUser.username);
        }
        
        // 更新缓存
        this.cache.set('users', cachedUsers);
      }
    } catch (error) {
      console.warn('同步用户登录状态失败:', error);
    }
    
    console.log('📊 返回用户数据:', cachedUsers.length, '个用户');
    return cachedUsers;
  }

  // 根据 ID 获取用户
  async getUserById(userId) {
    const users = await this.getUsers();
    return users.find(user => user.id === userId);
  }

  // 根据手机号获取用户
  async getUserByPhone(phone) {
    const users = await this.getUsers();
    return users.find(user => user.phone === phone);
  }

  // 更新用户数据
  async updateUser(userId, updateData) {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.users}/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
          const updatedUser = await response.json();
          // 更新缓存
          const users = this.cache.get('users') || [];
          const index = users.findIndex(user => user.id === userId);
          if (index !== -1) {
            users[index] = updatedUser;
            this.cache.set('users', users);
          }
          return updatedUser;
        }
      } catch (error) {
        console.error('更新用户数据失败:', error);
      }
    }
    
    // 如果在线更新失败，更新本地缓存
    const users = this.cache.get('users') || [];
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updateData, lastUpdateTime: new Date().toISOString() };
      this.cache.set('users', users);
      return users[index];
    }
    
    return null;
  }

  // 添加交易记录
  async addTransactionRecord(userId, transaction) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    if (!user.transactionRecords) {
      user.transactionRecords = [];
    }

    const newRecord = {
      id: Date.now(),
      ...transaction,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    user.transactionRecords.unshift(newRecord);
    
    // 只保留最近100条记录
    if (user.transactionRecords.length > 100) {
      user.transactionRecords = user.transactionRecords.slice(0, 100);
    }

    // 更新用户数据
    return await this.updateUser(userId, { transactionRecords: user.transactionRecords });
  }

  // 获取系统配置
  async getSystemConfig() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.systemConfig}`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('systemConfig', data);
          return data;
        }
      } catch (error) {
        console.error('获取系统配置失败:', error);
      }
    }
    
    return this.cache.get('systemConfig') || config.defaults.systemConfig;
  }

  // 获取银行信息
  async getBankInfo() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.bankInfo}`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('bankInfo', data);
          return data;
        }
      } catch (error) {
        console.error('获取银行信息失败:', error);
      }
    }
    
    return this.cache.get('bankInfo') || config.defaults.bankInfo;
  }

  // 获取生活服务数据
  async getLifeServices() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.lifeServices}`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('lifeServices', data);
          return data;
        }
      } catch (error) {
        console.error('获取生活服务数据失败:', error);
      }
    }
    
    return this.cache.get('lifeServices') || config.defaults.lifeServices;
  }

  // 获取财富产品数据
  async getWealthProducts() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}${this.endpoints.wealthProducts}`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('wealthProducts', data);
          return data;
        }
      } catch (error) {
        console.error('获取财富产品数据失败:', error);
      }
    }
    
    return this.cache.get('wealthProducts') || config.defaults.wealthProducts;
  }

  // 获取AI建议数据
  async getAISuggestions() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}/aiSuggestions`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('aiSuggestions', data);
          return data;
        }
      } catch (error) {
        console.error('获取AI建议数据失败:', error);
      }
    }
    
    return this.cache.get('aiSuggestions') || {};
  }

  // 获取用户目标数据
  async getUserGoals() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}/userGoals`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('userGoals', data);
          return data;
        }
      } catch (error) {
        console.error('获取用户目标数据失败:', error);
      }
    }
    
    return this.cache.get('userGoals') || [];
  }

  // 获取水费支付数据
  async getWaterPaymentData() {
    if (this.isOnline) {
      try {
        const response = await fetch(`${this.baseUrl}/waterPaymentData`);
        if (response.ok) {
          const data = await response.json();
          this.cache.set('waterPaymentData', data);
          return data;
        }
      } catch (error) {
        console.error('获取水费支付数据失败:', error);
      }
    }
    
    return this.cache.get('waterPaymentData') || {};
  }

  // 获取水费缴费历史
  async getWaterPaymentHistory() {
    const waterData = await this.getWaterPaymentData();
    return waterData.paymentHistory || [];
  }

  // 获取水费账单
  async getWaterBills() {
    const waterData = await this.getWaterPaymentData();
    return waterData.bills || [];
  }

  // 添加水费缴费记录
  async addWaterPaymentRecord(paymentRecord) {
    try {
      const waterData = await this.getWaterPaymentData();
      const paymentHistory = waterData.paymentHistory || [];
      
      // 添加新的缴费记录
      const newRecord = {
        id: `water_${Date.now()}`,
        ...paymentRecord,
        paymentDate: new Date().toISOString(),
        status: 'success'
      };
      
      paymentHistory.unshift(newRecord);
      waterData.paymentHistory = paymentHistory;
      
      // 更新缓存
      this.cache.set('waterPaymentData', waterData);
      
      console.log('✅ 水费缴费记录添加成功:', newRecord);
      return newRecord;
    } catch (error) {
      console.error('❌ 添加水费缴费记录失败:', error);
      throw error;
    }
  }

  // 获取用户交易记录
  async getUserTransactions(userId) {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.id === userId);
      
      if (user && user.transactionRecords) {
        return user.transactionRecords.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
      }
      
      return [];
    } catch (error) {
      console.error('❌ 获取用户交易记录失败:', error);
      return [];
    }
  }

  // 添加交易记录
  async addTransactionRecord(userId, transaction) {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }
      
      const user = users[userIndex];
      if (!user.transactionRecords) {
        user.transactionRecords = [];
      }
      
      // 生成新的交易记录
      const newTransaction = {
        id: `tx_${Date.now()}`,
        ...transaction,
        timestamp: new Date().toISOString(),
        status: transaction.status || 'completed'
      };
      
      // 添加到用户交易记录
      user.transactionRecords.unshift(newTransaction);
      
      // 更新用户余额
      if (transaction.type === 'income') {
        user.balance = (user.balance || 0) + (transaction.amount || 0);
      } else if (transaction.type === 'expense') {
        user.balance = (user.balance || 0) - (transaction.amount || 0);
      }
      
      // 更新缓存
      this.cache.set('users', users);
      
      console.log('✅ 交易记录添加成功:', newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('❌ 添加交易记录失败:', error);
      throw error;
    }
  }

  // 更新交易记录
  async updateTransactionRecord(userId, transactionId, updates) {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }
      
      const user = users[userIndex];
      if (!user.transactionRecords) {
        throw new Error('用户没有交易记录');
      }
      
      const transactionIndex = user.transactionRecords.findIndex(t => t.id === transactionId);
      if (transactionIndex === -1) {
        throw new Error('交易记录不存在');
      }
      
      // 更新交易记录
      user.transactionRecords[transactionIndex] = {
        ...user.transactionRecords[transactionIndex],
        ...updates
      };
      
      // 更新缓存
      this.cache.set('users', users);
      
      console.log('✅ 交易记录更新成功:', user.transactionRecords[transactionIndex]);
      return user.transactionRecords[transactionIndex];
    } catch (error) {
      console.error('❌ 更新交易记录失败:', error);
      throw error;
    }
  }

  // 获取默认数据
  getDefaultData() {
    return {
      users: [
        {
          id: "u001",
          username: "李华",
          realName: "李华",
          phone: "13888888888",
          balance: 280000.00,
          isLoggedIn: true,
          bankAccount: {
            accountNumber: "6222 9999 9999 9999",
            bankName: "中国农业银行",
            accountType: "储蓄卡",
            accountHolder: "李华",
            branchName: "北京朝阳支行"
          }
        },
        {
          id: "u002",
          username: "李小红",
          realName: "李小红",
          phone: "13777777777",
          balance: 80000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 1234 5678",
            bankName: "中国农业银行",
            accountType: "储蓄卡",
            accountHolder: "李小红",
            branchName: "广州天河支行"
          }
        },
        {
          id: "u003",
          username: "王小明",
          realName: "王小明",
          phone: "13666666666",
          balance: 150000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 2345 6789",
            bankName: "中国工商银行",
            accountType: "储蓄卡",
            accountHolder: "王小明",
            branchName: "深圳南山支行"
          }
        },
        {
          id: "u004",
          username: "张美丽",
          realName: "张美丽",
          phone: "13555555555",
          balance: 95000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 3456 7890",
            bankName: "中国建设银行",
            accountType: "储蓄卡",
            accountHolder: "张美丽",
            branchName: "杭州西湖支行"
          }
        },
        {
          id: "u005",
          username: "刘强",
          realName: "刘强",
          phone: "13444444444",
          balance: 120000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 4567 8901",
            bankName: "中国银行",
            accountType: "储蓄卡",
            accountHolder: "刘强",
            branchName: "成都锦江支行"
          }
        }
      ],
      systemConfig: {
        version: "1.0.0",
        lastUpdate: new Date().toISOString(),
        features: {
          biometricLogin: true,
          aiChat: true,
          wealthManagement: true,
          lifeServices: true
        }
      },
      bankInfo: {
        name: "中国农业银行",
        logo: "/static/logo.png",
        hotline: "95599",
        website: "www.abchina.com"
      },
      lifeServices: {},
      wealthProducts: {},
      aiSuggestions: {},
      userGoals: [],
      waterPaymentData: {}
    }
  }

  // 初始化数据连接
  async init() {
    console.log('正在初始化数据连接...');
    await this.checkServerStatus();
    
    if (this.isOnline) {
      console.log('✅ 已连接到 API 服务器:', this.baseUrl);
      // 预加载常用数据
      await Promise.all([
        this.getUsers(),
        this.getSystemConfig(),
        this.getBankInfo()
      ]);
    } else {
      console.log('⚠️ API 服务器不可用，加载本地数据');
      // 在离线模式下，从本地文件加载数据
      await this.loadLocalData();
    }
    
    this.isInitialized = true;
    console.log('✅ 数据连接器初始化完成');
    return this.isOnline;
  }

  // 加载本地数据
  async loadLocalData() {
    try {
      console.log('正在加载本地数据...');
      
      // 尝试多种方式加载JSON数据
      let localData = null;
      
      try {
        // 方式1: 动态导入
        const importedData = await import('./bank-data.json');
        localData = importedData.default || importedData;
      } catch (importError) {
        console.warn('动态导入失败，尝试fetch方式:', importError.message);
        
        try {
          // 方式2: 使用fetch
          const response = await fetch('/db/bank-data.json');
          if (response.ok) {
            localData = await response.json();
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (fetchError) {
          console.warn('fetch方式失败，使用默认数据:', fetchError.message);
          // 使用硬编码的默认数据
          localData = this.getDefaultData();
        }
      }
      
      // 将数据存储到缓存中
      this.cache.set('users', localData.users || []);
      this.cache.set('systemConfig', localData.systemConfig || {});
      this.cache.set('bankInfo', localData.bankInfo || {});
      this.cache.set('lifeServices', localData.lifeServices || {});
      this.cache.set('wealthProducts', localData.wealthProducts || {});
      this.cache.set('aiSuggestions', localData.aiSuggestions || {});
      this.cache.set('userGoals', localData.userGoals || []);
      this.cache.set('waterPaymentData', localData.waterPaymentData || {});
      
      console.log('✅ 本地数据加载完成:', {
        users: this.cache.get('users').length,
        systemConfig: !!this.cache.get('systemConfig'),
        bankInfo: !!this.cache.get('bankInfo'),
        aiSuggestions: Object.keys(this.cache.get('aiSuggestions')).length,
        userGoals: this.cache.get('userGoals').length
      });
      
    } catch (error) {
      console.error('❌ 加载本地数据失败:', error);
      // 使用默认数据
      this.cache.set('users', []);
      this.cache.set('systemConfig', {});
      this.cache.set('bankInfo', {});
      this.cache.set('lifeServices', {});
      this.cache.set('wealthProducts', {});
    }
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
    console.log('数据缓存已清除');
  }

  // 获取缓存状态
  getCacheStatus() {
    return {
      isOnline: this.isOnline,
      cacheSize: this.cache.size,
      cachedKeys: Array.from(this.cache.keys())
    };
  }
}

// 创建单例实例
const dataConnector = new DataConnector();

// 导出实例和类
export default dataConnector;
export { DataConnector };


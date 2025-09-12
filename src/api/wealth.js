/**
 * 财富管理API服务
 * 从user.json中读取财富相关数据
 */

import { getUsersData, updateUser } from '@/data/users.js'
import { getStorage, setStorage } from '@/utils/storage'

/**
 * 获取当前用户的财富数据
 * @returns {Object} 财富数据
 */
export function getCurrentUserWealthData() {
  // 首先尝试从本地存储获取数据
  let users = uni.getStorageSync('users')
  
  if (!users || users.length === 0) {
    // 如果本地存储没有数据，从getUsersData获取
    users = getUsersData()
  }
  
  const currentUserId = getCurrentUserId()
  const currentUser = users.find(user => user.id === currentUserId) || users[0]
  
  return {
    deposits: currentUser.wealthProducts?.deposits || {
      current: 0,
      fixed: 0,
      smart: 0
    },
    investments: currentUser.wealthProducts?.investments || [],
    investmentPortfolio: currentUser.investmentPortfolio || {
      totalValue: 0,
      totalReturn: 0,
      returnRate: 0,
      holdings: []
    },
    depositProducts: currentUser.depositProducts || {
      current: { 
        rate: 0.35, 
        features: ['随时存取', '灵活方便', '安全可靠', '存款保险保障'], 
        riskWarning: '存款保险保障，风险极低' 
      },
      fixed: [
        { term: '3个月', rate: 1.85, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
        { term: '6个月', rate: 2.05, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
        { term: '1年', rate: 2.10, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
        { term: '2年', rate: 2.60, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
        { term: '3年', rate: 2.95, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
        { term: '5年', rate: 3.20, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' }
      ],
      smart: { 
        rate: 2.8, 
        features: ['智能计息', '灵活存取', '收益优化', '自动转存'], 
        riskWarning: '存款保险保障，风险极低' 
      }
    },
    insuranceProducts: currentUser.insuranceProducts || {
      categories: [
        {
          id: 'life',
          name: '人寿保险',
          icon: '👨‍👩‍👧‍👦',
          color: '#FF6B35',
          products: [
            {
              id: 'life001',
              name: '农银终身寿险',
              type: '终身寿险',
              premium: 5000,
              coverage: 500000,
              term: '终身',
              features: ['终身保障', '现金价值', '分红收益', '保单贷款'],
              riskLevel: '低风险',
              status: '在售',
              description: '提供终身保障，具有现金价值和分红功能，适合长期规划'
            },
            {
              id: 'life002',
              name: '农银定期寿险',
              type: '定期寿险',
              premium: 2000,
              coverage: 300000,
              term: '20年',
              features: ['高保障', '低保费', '灵活选择', '可续保'],
              riskLevel: '低风险',
              status: '在售',
              description: '高保障低保费，适合家庭经济支柱，保障期间灵活'
            },
            {
              id: 'life003',
              name: '农银两全保险',
              type: '两全保险',
              premium: 8000,
              coverage: 200000,
              term: '30年',
              features: ['生死两全', '满期返还', '分红收益', '疾病保障'],
              riskLevel: '中风险',
              status: '在售',
              description: '生死两全保障，满期返还保费，兼具保障和储蓄功能'
            }
          ]
        },
        {
          id: 'health',
          name: '健康保险',
          icon: '🏥',
          color: '#34C759',
          products: [
            {
              id: 'health001',
              name: '农银重疾保险',
              type: '重疾保险',
              premium: 3000,
              coverage: 200000,
              term: '终身',
              features: ['重疾保障', '轻症赔付', '豁免保费', '多次赔付'],
              riskLevel: '中风险',
              status: '在售',
              description: '覆盖100种重疾，轻症豁免保费，提供全面健康保障'
            },
            {
              id: 'health002',
              name: '农银医疗保险',
              type: '医疗保险',
              premium: 800,
              coverage: 100000,
              term: '1年',
              features: ['住院保障', '门诊报销', '无免赔额', '续保保证'],
              riskLevel: '低风险',
              status: '在售',
              description: '住院医疗费用报销，门诊费用覆盖，无免赔额设计'
            },
            {
              id: 'health003',
              name: '农银防癌保险',
              type: '防癌保险',
              premium: 1500,
              coverage: 500000,
              term: '终身',
              features: ['癌症保障', '原位癌赔付', '康复津贴', '绿色通道'],
              riskLevel: '中风险',
              status: '在售',
              description: '专门针对癌症风险，提供高额保障和就医绿色通道'
            }
          ]
        },
        {
          id: 'accident',
          name: '意外保险',
          icon: '🛡️',
          color: '#FF9500',
          products: [
            {
              id: 'accident001',
              name: '农银综合意外险',
              type: '意外保险',
              premium: 200,
              coverage: 100000,
              term: '1年',
              features: ['意外身故', '意外伤残', '意外医疗', '住院津贴'],
              riskLevel: '低风险',
              status: '在售',
              description: '全面意外保障，包含身故、伤残、医疗和住院津贴'
            },
            {
              id: 'accident002',
              name: '农银交通意外险',
              type: '交通意外险',
              premium: 100,
              coverage: 500000,
              term: '1年',
              features: ['交通意外', '高额保障', '多种交通工具', '全球保障'],
              riskLevel: '低风险',
              status: '在售',
              description: '专门保障交通意外，覆盖飞机、火车、汽车等多种交通工具'
            }
          ]
        },
        {
          id: 'property',
          name: '财产保险',
          icon: '🏠',
          color: '#9C27B0',
          products: [
            {
              id: 'property001',
              name: '农银家财保险',
              type: '家财保险',
              premium: 500,
              coverage: 500000,
              term: '1年',
              features: ['房屋保障', '室内财产', '盗抢保障', '水渍保障'],
              riskLevel: '低风险',
              status: '在售',
              description: '保障家庭财产安全，覆盖房屋及室内财产损失'
            },
            {
              id: 'property002',
              name: '住宅火灾及自然灾害保险',
              type: '家财保险',
              premium: 380,
              coverage: 300000,
              term: '1年',
              features: ['火灾爆炸', '台风暴雨', '冰雹洪水', '附加盗抢'],
              riskLevel: '低风险',
              status: '在售',
              description: '针对住宅火灾与自然灾害造成的房屋及室内财产损失提供保障'
            },
            {
              id: 'property003',
              name: '企业财产综合保险',
              type: '企业财产险',
              premium: 2600,
              coverage: 5000000,
              term: '1年',
              features: ['房屋机器', '存货成品', '盗抢责任', '营业中断可选'],
              riskLevel: '中风险',
              status: '在售',
              description: '适用于中小企业，对房屋、机器设备、存货等提供综合保障，可选营业中断险'
            },
            {
              id: 'property004',
              name: '设备损坏保险（家商两用）',
              type: '设备险',
              premium: 980,
              coverage: 1000000,
              term: '1年',
              features: ['意外损坏', '操作不当', '电涌短路', '零部件更换'],
              riskLevel: '中风险',
              status: '在售',
              description: '对家用或商用设备因意外损坏、操作不当、电气故障造成的损失进行赔偿'
            },
            {
              id: 'property005',
              name: '租客家财与第三者责任保险',
              type: '家财责任险',
              premium: 260,
              coverage: 200000,
              term: '1年',
              features: ['室内财产', '租客责任', '第三者责任', '水渍玻璃破碎'],
              riskLevel: '低风险',
              status: '在售',
              description: '面向租住房人群，覆盖室内财产、租客责任与第三者责任等常见风险'
            }
          ]
        }
      ]
    },
    forexProducts: currentUser.forexProducts || {
      majorPairs: [
        {
          code: 'USD/CNY',
          name: '美元/人民币',
          price: '7.2345',
          change: '+0.0123',
          changePercent: '+0.17%',
          trend: 'up',
          high: '7.2456',
          low: '7.2100',
          volume: '125.6M'
        },
        {
          code: 'EUR/CNY',
          name: '欧元/人民币',
          price: '7.8901',
          change: '-0.0234',
          changePercent: '-0.30%',
          trend: 'down',
          high: '7.9200',
          low: '7.8800',
          volume: '89.3M'
        },
        {
          code: 'GBP/CNY',
          name: '英镑/人民币',
          price: '9.1234',
          change: '+0.0456',
          changePercent: '+0.50%',
          trend: 'up',
          high: '9.1500',
          low: '9.0800',
          volume: '67.8M'
        },
        {
          code: 'JPY/CNY',
          name: '日元/人民币',
          price: '0.0489',
          change: '-0.0001',
          changePercent: '-0.20%',
          trend: 'down',
          high: '0.0495',
          low: '0.0485',
          volume: '156.2M'
        },
        {
          code: 'AUD/CNY',
          name: '澳元/人民币',
          price: '4.7856',
          change: '+0.0123',
          changePercent: '+0.26%',
          trend: 'up',
          high: '4.7900',
          low: '4.7700',
          volume: '45.7M'
        },
        {
          code: 'CAD/CNY',
          name: '加元/人民币',
          price: '5.3456',
          change: '-0.0089',
          changePercent: '-0.17%',
          trend: 'down',
          high: '5.3600',
          low: '5.3400',
          volume: '32.1M'
        }
      ],
      tradingPairs: [
        {
          id: 'forex001',
          pair: 'USD/CNY',
          buyPrice: '7.2345',
          sellPrice: '7.2340',
          spread: '0.0005',
          status: '可交易',
          minAmount: 100,
          maxAmount: 50000,
          commission: 0.0002
        },
        {
          id: 'forex002',
          pair: 'EUR/CNY',
          buyPrice: '7.8901',
          sellPrice: '7.8896',
          spread: '0.0005',
          status: '可交易',
          minAmount: 100,
          maxAmount: 50000,
          commission: 0.0002
        },
        {
          id: 'forex003',
          pair: 'GBP/CNY',
          buyPrice: '9.1234',
          sellPrice: '9.1229',
          spread: '0.0005',
          status: '可交易',
          minAmount: 100,
          maxAmount: 50000,
          commission: 0.0002
        },
        {
          id: 'forex004',
          pair: 'JPY/CNY',
          buyPrice: '0.0489',
          sellPrice: '0.0488',
          spread: '0.0001',
          status: '可交易',
          minAmount: 1000,
          maxAmount: 100000,
          commission: 0.0001
        },
        {
          id: 'forex005',
          pair: 'AUD/CNY',
          buyPrice: '4.7856',
          sellPrice: '4.7850',
          spread: '0.0006',
          status: '可交易',
          minAmount: 100,
          maxAmount: 50000,
          commission: 0.0002
        }
      ],
      marketInfo: {
        lastUpdate: '2024-01-15T15:30:00Z',
        marketStatus: '开放',
        nextClose: '2024-01-15T23:00:00Z',
        tradingHours: '周一至周五 09:00-23:00'
      }
    }
  }
}

/**
 * 获取存款产品数据
 * @returns {Object} 存款产品数据
 */
export function getDepositProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.depositProducts
}

/**
 * 获取理财产品数据
 * @returns {Array} 理财产品数据
 */
export function getWealthProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.investments
}

/**
 * 获取保险产品数据
 * @returns {Object} 保险产品数据
 */
export function getInsuranceProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.insuranceProducts
}

/**
 * 获取外汇产品数据
 * @returns {Object} 外汇产品数据
 */
export function getForexProducts() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.forexProducts
}

/**
 * 获取投资组合数据
 * @returns {Object} 投资组合数据
 */
export function getInvestmentPortfolio() {
  const wealthData = getCurrentUserWealthData()
  return wealthData.investmentPortfolio
}

/**
 * 获取存款利率数据
 * @returns {Object} 存款利率数据
 */
export function getDepositRates() {
  const depositProducts = getDepositProducts()
  
  return {
    current: {
      rate: depositProducts.current?.rate || 0.35,
      features: depositProducts.current?.features || ['随时存取', '灵活方便', '安全可靠'],
      riskWarning: depositProducts.current?.riskWarning || '存款保险保障，风险极低'
    },
    fixed: depositProducts.fixed || [
      { term: '3个月', rate: 1.85, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '6个月', rate: 2.05, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '1年', rate: 2.10, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '2年', rate: 2.60, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '3年', rate: 2.95, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' },
      { term: '5年', rate: 3.20, minAmount: 1000, features: ['保本保息', '收益稳定', '期限灵活'], riskWarning: '存款保险保障，风险极低' }
    ],
    smart: {
      rate: depositProducts.smart?.rate || 2.8,
      features: depositProducts.smart?.features || ['智能计息', '灵活存取', '收益优化'],
      riskWarning: depositProducts.smart?.riskWarning || '存款保险保障，风险极低'
    }
  }
}

/**
 * 获取理财产品分类数据
 * @returns {Array} 理财产品分类数据
 */
export function getWealthProductCategories() {
  const investments = getWealthProducts()
  
  // 根据投资类型分组
  const categories = [
    {
      id: 'low-risk',
      name: '低风险理财',
      icon: '🛡️',
      color: '#34C759',
      products: investments.filter(inv => inv.rate <= 4.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 1000,
        term: inv.term,
        riskLevel: '低风险',
        features: ['保本保息', '收益稳定', '风险极低'],
        status: inv.status,
        description: '适合稳健型投资者，风险极低，收益稳定'
      }))
    },
    {
      id: 'medium-risk',
      name: '中风险理财',
      icon: '⚖️',
      color: '#FF9500',
      products: investments.filter(inv => inv.rate > 4.0 && inv.rate <= 6.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 5000,
        term: inv.term,
        riskLevel: '中风险',
        features: ['收益较高', '风险适中', '期限灵活'],
        status: inv.status,
        description: '适合平衡型投资者，风险适中，收益较高'
      }))
    },
    {
      id: 'high-risk',
      name: '高风险理财',
      icon: '🚀',
      color: '#FF3B30',
      products: investments.filter(inv => inv.rate > 6.0).map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        yield: inv.rate,
        minAmount: 10000,
        term: inv.term,
        riskLevel: '高风险',
        features: ['高收益', '高风险', '专业投资'],
        status: inv.status,
        description: '适合激进型投资者，高风险高收益'
      }))
    }
  ]
  
  // 如果没有数据，返回默认数据
  if (investments.length === 0) {
    return [
      {
        id: 'low-risk',
        name: '稳健型理财',
        icon: '🛡️',
        color: '#34C759',
        products: [
          {
            id: 'w001',
            name: '农银稳健优选第68期',
            type: '净值型',
            yield: 3.20,
            minAmount: 10000,
            term: '90天',
            riskLevel: '低风险',
            features: ['保本保息', '收益稳定', '风险极低', '银行担保'],
            status: '在售',
            description: '适合稳健型投资者，风险极低，收益稳定，银行提供本金保障'
          },
          {
            id: 'w002',
            name: '农银灵活理财T+1',
            type: '货币型',
            yield: 2.65,
            minAmount: 1000,
            term: '开放式',
            riskLevel: '低风险',
            features: ['随时存取', '灵活方便', '安全可靠', 'T+1到账'],
            status: '在售',
            description: '开放式理财产品，随时申购赎回，T+1到账，适合短期资金管理'
          },
          {
            id: 'w003',
            name: '农银安心宝30天',
            type: '固定收益',
            yield: 2.85,
            minAmount: 5000,
            term: '30天',
            riskLevel: '低风险',
            features: ['保本保息', '收益稳定', '期限灵活', '自动续存'],
            status: '在售',
            description: '30天短期理财产品，保本保息，适合短期闲置资金'
          }
        ]
      },
      {
        id: 'medium-risk',
        name: '平衡型理财',
        icon: '⚖️',
        color: '#FF9500',
        products: [
          {
            id: 'w004',
            name: '农银进取增强半年期',
            type: '混合型',
            yield: 4.10,
            minAmount: 10000,
            term: '180天',
            riskLevel: '中风险',
            features: ['收益较高', '风险适中', '期限灵活', '专业管理'],
            status: '在售',
            description: '混合型理财产品，投资于债券和货币市场工具，风险适中收益较高'
          },
          {
            id: 'w005',
            name: '农银成长优选一年期',
            type: '权益型',
            yield: 4.50,
            minAmount: 20000,
            term: '365天',
            riskLevel: '中风险',
            features: ['收益较高', '风险适中', '期限灵活', '成长潜力'],
            status: '在售',
            description: '权益类理财产品，投资于优质企业债券和股票，具有成长潜力'
          },
          {
            id: 'w006',
            name: '农银价值发现180天',
            type: '混合型',
            yield: 3.95,
            minAmount: 15000,
            term: '180天',
            riskLevel: '中风险',
            features: ['价值投资', '风险适中', '期限适中', '专业选股'],
            status: '在售',
            description: '价值投资理念，精选优质标的，风险适中收益稳定'
          }
        ]
      },
      {
        id: 'high-risk',
        name: '进取型理财',
        icon: '🚀',
        color: '#FF3B30',
        products: [
          {
            id: 'w007',
            name: '农银价值发现两年期',
            type: '权益型',
            yield: 5.80,
            minAmount: 50000,
            term: '730天',
            riskLevel: '高风险',
            features: ['高收益', '高风险', '专业投资', '长期持有'],
            status: '在售',
            description: '长期价值投资产品，投资于优质成长企业，适合风险承受能力强的投资者'
          },
          {
            id: 'w008',
            name: '农银科技成长三年期',
            type: '权益型',
            yield: 6.20,
            minAmount: 100000,
            term: '1095天',
            riskLevel: '高风险',
            features: ['高收益', '高风险', '科技主题', '成长潜力'],
            status: '在售',
            description: '科技主题投资产品，专注于科技创新企业，具有较高成长潜力'
          },
          {
            id: 'w009',
            name: '农银新兴产业一年期',
            type: '权益型',
            yield: 5.50,
            minAmount: 80000,
            term: '365天',
            riskLevel: '高风险',
            features: ['新兴产业', '高收益', '高风险', '主题投资'],
            status: '在售',
            description: '新兴产业主题投资，涵盖新能源、生物医药等新兴领域'
          }
        ]
      }
    ]
  }
  
  return categories
}

/**
 * 获取保险产品分类数据
 * @returns {Array} 保险产品分类数据
 */
export function getInsuranceCategories() {
  const insuranceProducts = getInsuranceProducts()
  return insuranceProducts.categories || []
}

/**
 * 获取外汇主要货币对数据
 * @returns {Array} 外汇主要货币对数据
 */
export function getForexMajorPairs() {
  const forexProducts = getForexProducts()
  return forexProducts.majorPairs || []
}

/**
 * 获取外汇交易货币对数据
 * @returns {Array} 外汇交易货币对数据
 */
export function getForexTradingPairs() {
  const forexProducts = getForexProducts()
  return forexProducts.tradingPairs || []
}

/**
 * 更新用户财富数据
 * @param {string} userId 用户ID
 * @param {Object} wealthData 财富数据
 * @returns {boolean} 更新是否成功
 */
export function updateUserWealthData(userId, wealthData) {
  try {
    // 更新用户数据
    const success = updateUser(userId, wealthData)
    
    if (success) {
      // 同步到本地存储
      syncWealthDataToStorage(userId, wealthData)
      
      // 触发数据更新事件
      uni.$emit('wealthDataUpdated', { userId, wealthData })
      
      console.log('财富数据更新成功:', userId, wealthData)
      return true
    }
    return false
  } catch (error) {
    console.error('更新财富数据失败:', error)
    return false
  }
}

/**
 * 同步财富数据到本地存储
 * @param {string} userId 用户ID
 * @param {Object} wealthData 财富数据
 */
function syncWealthDataToStorage(userId, wealthData) {
  try {
    // 获取当前本地存储的财富数据
    const localWealthData = getStorage('wealthData', true) || {}
    
    // 更新对应用户的财富数据
    localWealthData[userId] = {
      ...localWealthData[userId],
      ...wealthData,
      lastUpdateTime: new Date().toISOString()
    }
    
    // 保存到本地存储
    setStorage('wealthData', localWealthData, true)
    
    console.log('财富数据已同步到本地存储:', userId)
  } catch (error) {
    console.error('同步财富数据到本地存储失败:', error)
  }
}

/**
 * 从本地存储获取财富数据
 * @param {string} userId 用户ID
 * @returns {Object} 财富数据
 */
export function getWealthDataFromStorage(userId) {
  try {
    const localWealthData = getStorage('wealthData', true) || {}
    return localWealthData[userId] || null
  } catch (error) {
    console.error('从本地存储获取财富数据失败:', error)
    return null
  }
}

/**
 * 同步本地存储的财富数据到用户数据
 * @param {string} userId 用户ID
 */
export function syncStorageToUserData(userId) {
  try {
    const localWealthData = getWealthDataFromStorage(userId)
    if (localWealthData) {
      updateUser(userId, localWealthData)
      console.log('本地存储财富数据已同步到用户数据:', userId)
    }
  } catch (error) {
    console.error('同步本地存储到用户数据失败:', error)
  }
}

/**
 * 添加投资记录
 * @param {string} userId 用户ID
 * @param {Object} investment 投资记录
 * @returns {boolean} 添加是否成功
 */
export function addInvestmentRecord(userId, investment) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      if (!user.wealthProducts) {
        user.wealthProducts = { investments: [] }
      }
      if (!user.wealthProducts.investments) {
        user.wealthProducts.investments = []
      }
      
      // 添加投资记录
      const newInvestment = {
        ...investment,
        id: `inv${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        status: '持有中'
      }
      user.wealthProducts.investments.push(newInvestment)
      
      // 更新用户数据并同步
      updateUserWealthData(userId, { wealthProducts: user.wealthProducts })
      
      // 更新投资组合数据
      updateInvestmentPortfolio(userId)
      
      console.log('投资记录添加成功:', newInvestment)
      return true
    }
    return false
  } catch (error) {
    console.error('添加投资记录失败:', error)
    return false
  }
}

/**
 * 更新投资组合数据
 * @param {string} userId 用户ID
 */
function updateInvestmentPortfolio(userId) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user && user.wealthProducts && user.wealthProducts.investments) {
      const investments = user.wealthProducts.investments
      
      // 计算总投资价值和收益
      const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0)
      const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0)
      const totalReturn = totalValue - totalAmount
      const returnRate = totalAmount > 0 ? (totalReturn / totalAmount) * 100 : 0
      
      // 更新投资组合
      const investmentPortfolio = {
        totalValue,
        totalReturn,
        returnRate: parseFloat(returnRate.toFixed(2)),
        holdings: investments
      }
      
      updateUserWealthData(userId, { investmentPortfolio })
    }
  } catch (error) {
    console.error('更新投资组合失败:', error)
  }
}

/**
 * 添加存款记录
 * @param {string} userId 用户ID
 * @param {string} type 存款类型 (current/fixed/smart)
 * @param {number} amount 存款金额
 * @returns {boolean} 添加是否成功
 */
export function addDepositRecord(userId, type, amount) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      if (!user.wealthProducts) {
        user.wealthProducts = { deposits: { current: 0, fixed: 0, smart: 0 } }
      }
      if (!user.wealthProducts.deposits) {
        user.wealthProducts.deposits = { current: 0, fixed: 0, smart: 0 }
      }
      
      // 更新存款金额
      user.wealthProducts.deposits[type] = (user.wealthProducts.deposits[type] || 0) + amount
      
      // 更新用户数据并同步
      updateUserWealthData(userId, { wealthProducts: user.wealthProducts })
      
      // 更新账户余额（从主账户扣除存款金额）
      updateUserBalance(userId, -amount, `存款-${type}`)
      
      console.log('存款记录添加成功:', { type, amount })
      return true
    }
    return false
  } catch (error) {
    console.error('添加存款记录失败:', error)
    return false
  }
}

/**
 * 更新用户账户余额
 * @param {string} userId 用户ID
 * @param {number} amount 金额变化（正数为收入，负数为支出）
 * @param {string} description 交易描述
 */
function updateUserBalance(userId, amount, description) {
  try {
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (user) {
      // 更新余额
      user.balance = (user.balance || 0) + amount
      
      // 添加交易记录
      if (!user.transactionRecords) {
        user.transactionRecords = []
      }
      
      const transaction = {
        id: Date.now(),
        type: amount > 0 ? 'income' : 'expense',
        amount: Math.abs(amount),
        description,
        balance: user.balance,
        timestamp: new Date().toISOString(),
        icon: amount > 0 ? '💰' : '💳',
        title: description,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      user.transactionRecords.unshift(transaction)
      
      // 更新用户数据
      updateUser(userId, { 
        balance: user.balance, 
        transactionRecords: user.transactionRecords 
      })
      
      // 触发余额更新事件
      uni.$emit('balanceUpdated', { userId, balance: user.balance, transaction })
      
      console.log('用户余额更新成功:', { userId, balance: user.balance })
    }
  } catch (error) {
    console.error('更新用户余额失败:', error)
  }
}

/**
 * 获取当前用户ID
 * @returns {string} 用户ID
 */
export function getCurrentUserId() {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    return userInfo?.id || 'u001' // 默认返回第一个用户
  } catch (error) {
    console.error('获取当前用户ID失败:', error)
    return 'u001'
  }
}

/**
 * 初始化财富数据同步
 * 在应用启动时调用，确保数据一致性
 */
export function initWealthDataSync() {
  try {
    const userId = getCurrentUserId()
    
    // 同步本地存储到用户数据
    syncStorageToUserData(userId)
    
    // 监听数据更新事件
    uni.$on('wealthDataUpdated', (data) => {
      console.log('财富数据更新事件:', data)
      // 可以在这里添加其他页面的数据同步逻辑
    })
    
    uni.$on('balanceUpdated', (data) => {
      console.log('余额更新事件:', data)
      // 可以在这里更新其他页面的余额显示
    })
    
    console.log('财富数据同步初始化完成')
  } catch (error) {
    console.error('初始化财富数据同步失败:', error)
  }
}

/**
 * 购买理财产品
 * @param {string} userId 用户ID
 * @param {Object} product 产品信息
 * @param {number} amount 购买金额
 * @returns {boolean} 购买是否成功
 */
export function purchaseWealthProduct(userId, product, amount) {
  try {
    // 检查余额是否足够
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (!user || user.balance < amount) {
      console.log('余额不足，无法购买')
      return false
    }
    
    // 创建投资记录
    const investment = {
      name: product.name,
      type: product.type || '理财产品',
      amount: amount,
      rate: product.rate || 0,
      term: product.term || '开放式',
      currentValue: amount // 初始价值等于购买金额
    }
    
    // 添加投资记录
    const success = addInvestmentRecord(userId, investment)
    
    if (success) {
      // 更新余额（扣除购买金额）
      updateUserBalance(userId, -amount, `购买${product.name}`)
      
      console.log('理财产品购买成功:', { product: product.name, amount })
      return true
    }
    
    return false
  } catch (error) {
    console.error('购买理财产品失败:', error)
    return false
  }
}

/**
 * 购买保险产品
 * @param {string} userId 用户ID
 * @param {Object} product 保险产品信息
 * @returns {boolean} 购买是否成功
 */
export function purchaseInsuranceProduct(userId, product) {
  try {
    const premium = product.premium || 0
    
    // 检查余额是否足够
    const users = getUsersData()
    const user = users.find(user => user.id === userId)
    if (!user || user.balance < premium) {
      console.log('余额不足，无法购买保险')
      return false
    }
    
    // 更新余额（扣除保费）
    updateUserBalance(userId, -premium, `购买${product.name}保险`)
    
    // 可以在这里添加保险记录到用户数据
    console.log('保险产品购买成功:', { product: product.name, premium })
    return true
  } catch (error) {
    console.error('购买保险产品失败:', error)
    return false
  }
}
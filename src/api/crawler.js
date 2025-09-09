/**
 * 模拟数据服务
 * 提供模拟的金融数据，通过大模型生成图表
 */

/**
 * 生成模拟存款利率数据
 * @returns {Object} 存款利率数据
 */
export function getDepositRates() {
  try {
    console.log('生成模拟存款利率数据...')
    
    const now = new Date()
    const timeSeed = now.getHours() * 60 + now.getMinutes()
    
    // 基于时间生成动态的模拟数据
    const baseRate = 0.35 + Math.sin(timeSeed / 200) * 0.05
    const volatility = Math.sin(timeSeed / 100) * 0.1
    
    const depositData = {
      current: baseRate,
      fixed: [
        { 
          term: '3个月', 
          rate: baseRate + 1.35 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        },
        { 
          term: '6个月', 
          rate: baseRate + 1.55 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        },
        { 
          term: '1年', 
          rate: baseRate + 1.75 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        },
        { 
          term: '2年', 
          rate: baseRate + 2.25 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        },
        { 
          term: '3年', 
          rate: baseRate + 2.75 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        },
        { 
          term: '5年', 
          rate: baseRate + 2.75 + volatility + Math.random() * 0.1, 
          minAmount: 1000 
        }
      ],
      lastUpdate: now.toISOString(),
      source: 'mock-data'
    }
    
    console.log('模拟存款利率数据生成完成:', depositData)
    return depositData
  } catch (error) {
    console.error('生成模拟存款利率数据失败:', error)
    throw error
  }
}

/**
 * 生成模拟理财产品数据
 * @returns {Object} 理财产品数据
 */
export function getWealthProducts() {
  try {
    console.log('生成模拟理财产品数据...')
    
    const now = new Date()
    const timeFactor = (now.getHours() + now.getMinutes() / 60) / 24
    
    const productData = {
      categories: [
        {
          name: '稳健型',
          products: [
            { 
              id: 'w1', 
              name: `稳健优选第${Math.floor(Math.random() * 100)}期`, 
              risk: '低', 
              term: '90天', 
              minAmount: 10000, 
              expectedReturn: parseFloat((3.20 + Math.random() * 0.3 + timeFactor * 0.1).toFixed(2)), 
              type: '净值型' 
            },
            { 
              id: 'w2', 
              name: '灵活理财T+1', 
              risk: '低', 
              term: '开放式', 
              minAmount: 1000, 
              expectedReturn: parseFloat((2.65 + Math.random() * 0.2 + timeFactor * 0.05).toFixed(2)), 
              type: '货币型' 
            },
            { 
              id: 'w3', 
              name: '保本理财', 
              risk: '低', 
              term: '180天', 
              minAmount: 5000, 
              expectedReturn: parseFloat((2.85 + Math.random() * 0.15 + timeFactor * 0.08).toFixed(2)), 
              type: '保本型' 
            }
          ]
        },
        {
          name: '平衡型',
          products: [
            { 
              id: 'b1', 
              name: `平衡增长第${Math.floor(Math.random() * 50)}期`, 
              risk: '中', 
              term: '180天', 
              minAmount: 50000, 
              expectedReturn: parseFloat((4.50 + Math.random() * 0.4 + timeFactor * 0.15).toFixed(2)), 
              type: '混合型' 
            },
            { 
              id: 'b2', 
              name: '债券增强', 
              risk: '中', 
              term: '365天', 
              minAmount: 20000, 
              expectedReturn: parseFloat((4.20 + Math.random() * 0.3 + timeFactor * 0.12).toFixed(2)), 
              type: '债券型' 
            }
          ]
        },
        {
          name: '进取型',
          products: [
            { 
              id: 'a1', 
              name: `股票精选第${Math.floor(Math.random() * 30)}期`, 
              risk: '高', 
              term: '730天', 
              minAmount: 100000, 
              expectedReturn: parseFloat((6.80 + Math.random() * 0.8 + timeFactor * 0.25).toFixed(2)), 
              type: '股票型' 
            },
            { 
              id: 'a2', 
              name: '量化对冲', 
              risk: '高', 
              term: '1095天', 
              minAmount: 200000, 
              expectedReturn: parseFloat((7.50 + Math.random() * 1.0 + timeFactor * 0.3).toFixed(2)), 
              type: '量化型' 
            }
          ]
        }
      ],
      lastUpdate: now.toISOString(),
      source: 'mock-data'
    }
    
    console.log('模拟理财产品数据生成完成:', productData)
    return productData
  } catch (error) {
    console.error('生成模拟理财产品数据失败:', error)
    throw error
  }
}

/**
 * 生成模拟保险产品数据
 * @returns {Object} 保险产品数据
 */
export function getInsuranceProducts() {
  try {
    console.log('生成模拟保险产品数据...')
    
    const now = new Date()
    const timeFactor = (now.getHours() + now.getMinutes() / 60) / 24
    
    const insuranceData = {
      products: [
        {
          id: 'i1',
          name: '健康无忧终身重疾险',
          company: '中国人寿',
          type: '重疾险',
          coverage: '100万',
          term: '终身',
          monthlyPremium: Math.floor(500 + Math.random() * 200 + timeFactor * 50),
          features: ['100种重疾保障', '50种轻症保障', '身故保障', '保费豁免']
        },
        {
          id: 'i2',
          name: '平安福终身寿险',
          company: '中国平安',
          type: '终身寿险',
          coverage: '200万',
          term: '终身',
          monthlyPremium: Math.floor(800 + Math.random() * 300 + timeFactor * 80),
          features: ['终身保障', '现金价值', '保单贷款', '分红收益']
        },
        {
          id: 'i3',
          name: '康乐一生重疾险',
          company: '太平洋保险',
          type: '重疾险',
          coverage: '80万',
          term: '终身',
          monthlyPremium: Math.floor(400 + Math.random() * 150 + timeFactor * 40),
          features: ['80种重疾保障', '30种轻症保障', '身故保障', '轻症豁免']
        },
        {
          id: 'i4',
          name: '金佑人生分红险',
          company: '新华保险',
          type: '分红险',
          coverage: '150万',
          term: '终身',
          monthlyPremium: Math.floor(600 + Math.random() * 250 + timeFactor * 60),
          features: ['分红收益', '身故保障', '现金价值', '保单贷款']
        }
      ],
      lastUpdate: now.toISOString(),
      source: 'mock-data'
    }
    
    console.log('模拟保险产品数据生成完成:', insuranceData)
    return insuranceData
  } catch (error) {
    console.error('生成模拟保险产品数据失败:', error)
    throw error
  }
}

/**
 * 生成模拟外汇汇率数据
 * @returns {Object} 外汇汇率数据
 */
export function getForexRates() {
  try {
    console.log('生成模拟外汇汇率数据...')
    
    const now = new Date()
    const timeSeed = now.getHours() * 60 + now.getMinutes()
    
    // 基于时间生成稳定的基准汇率
    const baseRates = {
      'USD/CNY': 7.25 + Math.sin(timeSeed / 100) * 0.1,
      'EUR/CNY': 7.85 + Math.cos(timeSeed / 120) * 0.15,
      'JPY/CNY': 0.048 + Math.sin(timeSeed / 80) * 0.002,
      'GBP/CNY': 9.15 + Math.cos(timeSeed / 90) * 0.2,
      'AUD/CNY': 4.75 + Math.sin(timeSeed / 110) * 0.1,
      'CAD/CNY': 5.35 + Math.cos(timeSeed / 95) * 0.08
    }
    
    const majorPairs = []
    const pairNames = [
      { code: 'USD/CNY', name: '美元/人民币' },
      { code: 'EUR/CNY', name: '欧元/人民币' },
      { code: 'JPY/CNY', name: '日元/人民币' },
      { code: 'GBP/CNY', name: '英镑/人民币' },
      { code: 'AUD/CNY', name: '澳元/人民币' },
      { code: 'CAD/CNY', name: '加元/人民币' }
    ]
    
    pairNames.forEach((pair, index) => {
      const basePrice = baseRates[pair.code]
      const volatility = 0.02 // 2%的波动率
      const change = (Math.random() - 0.5) * volatility * basePrice
      const price = basePrice + change
      const changePercent = (change / basePrice) * 100
      
      majorPairs.push({
        code: pair.code,
        name: pair.name,
        price: price.toFixed(4),
        change: change.toFixed(4),
        changePercent: changePercent.toFixed(4),
        high: (price + Math.random() * 0.01).toFixed(4),
        low: (price - Math.random() * 0.01).toFixed(4)
      })
    })
    
    const forexData = {
      majorPairs,
      marketStatus: {
        isOpen: true,
        nextOpen: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lastUpdate: new Date().toISOString()
      },
      trends: {
        usdTrend: majorPairs[0]?.change > 0 ? 'up' : 'down',
        eurTrend: majorPairs[1]?.change > 0 ? 'up' : 'down',
        jpyTrend: majorPairs[2]?.change > 0 ? 'up' : 'down'
      },
      source: 'mock-data'
    }
    
    console.log('模拟外汇汇率数据生成完成:', forexData)
    return forexData
  } catch (error) {
    console.error('生成模拟外汇汇率数据失败:', error)
    throw error
  }
}

/**
 * 获取缓存数据（现在直接返回模拟数据）
 * @param {string} key 缓存键
 * @param {Function} fetchFunction 获取数据的函数
 * @returns {Promise} 返回数据
 */
export async function getCachedData(key, fetchFunction) {
  try {
    console.log(`获取模拟数据: ${key}`)
    const data = await fetchFunction()
    return data
  } catch (error) {
    console.error(`获取模拟数据失败 (${key}):`, error)
    throw error
  }
}

/**
 * 清除所有缓存数据（现在不需要缓存）
 */
export function clearAllCache() {
  console.log('模拟数据模式，无需清除缓存')
}
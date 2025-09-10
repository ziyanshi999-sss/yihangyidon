/**
 * uCharts图表渲染工具
 * 专门为uni-app设计的图表库，在App-Plus环境下表现更好
 */

import uCharts from '@qiun/ucharts'

/**
 * 初始化uCharts图表
 * @param {string} canvasId Canvas ID
 * @param {Object} option 图表配置
 * @param {Object} context 页面上下文
 */
export function initUCharts(canvasId, option, context) {
  try {
    console.log('🎨 初始化uCharts图表:', canvasId)
    
    // #ifdef APP-PLUS
    // App-Plus环境使用uni.createCanvasContext
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const ctx = uni.createCanvasContext(canvasId, context)
          
          // 获取系统信息
          const systemInfo = uni.getSystemInfoSync()
          const width = systemInfo.windowWidth - 40 // 减去padding
          const height = 200 // 进一步减小高度避免溢出
          
          // 初始化uCharts
          const chart = new uCharts({
            type: option.type || 'line',
            context: ctx,
            width: width,
            height: height,
            ...option
          })
          
          console.log('✅ uCharts图表渲染成功 (App-Plus)')
          resolve(chart)
        } catch (error) {
          console.error('App-Plus: uCharts初始化失败:', error)
          resolve(null)
        }
      }, 300)
    })
    // #endif
    
    // #ifdef H5
    // H5环境使用document.getElementById
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const canvas = document.getElementById(canvasId)
          if (canvas && typeof canvas.getContext === 'function') {
            const ctx = canvas.getContext('2d')
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
            
            // 初始化uCharts
            const chart = new uCharts({
              type: option.type || 'line',
              context: ctx,
              width: rect.width,
              height: rect.height,
              ...option
            })
            
            console.log('✅ uCharts图表渲染成功 (H5)')
            resolve(chart)
          } else {
            console.error('H5: 无法找到Canvas元素或Canvas不支持getContext')
            resolve(null)
          }
        } else {
          console.error('H5: document对象未定义')
          resolve(null)
        }
      }, 100)
    })
    // #endif
    
    // #ifdef MP-WEIXIN
    // 小程序环境使用uni.createCanvasContext
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const ctx = uni.createCanvasContext(canvasId, context)
          
          // 初始化uCharts
          const chart = new uCharts({
            type: option.type || 'line',
            context: ctx,
            width: 300,
            height: 200,
            ...option
          })
          
          console.log('✅ uCharts图表渲染成功 (小程序)')
          resolve(chart)
        } catch (error) {
          console.error('小程序: uCharts初始化失败:', error)
          resolve(null)
        }
      }, 300)
    })
    // #endif
    
  } catch (error) {
    console.error('❌ uCharts图表初始化失败:', error)
    return null
  }
}

/**
 * 创建存款利率趋势图配置 - 渐变色曲线区域图
 * @param {Object} depositData 存款数据
 */
export function createDepositRateChart(depositData) {
  const fixedData = depositData?.fixed || []
  const categories = fixedData.map(item => item.term) || ['3个月', '6个月', '1年', '2年', '3年', '5年']
  const series = [{
    name: '存款利率',
    data: fixedData.map(item => item.rate) || [1.85, 2.05, 2.10, 2.60, 2.95, 3.20],
    color: '#007AFF'
  }]
  
  return {
    type: 'area',
    categories: categories,
    series: series,
    color: ['#007AFF'],
    animation: true,
    background: '#fff',
    padding: [15, 15, 15, 15],
    xAxis: {
      disableGrid: false
    },
    yAxis: {
      disableGrid: false
    },
    extra: {
      area: {
        type: 'curve',
        opacity: 0.3,
        addLine: true,
        width: 2,
        gradient: true,
        activeType: 'hollow'
      }
    }
  }
}

/**
 * 创建理财产品收益对比图配置
 * @param {Array} productCategories 产品分类数据
 */
export function createWealthProductChart(productCategories) {
  const categories = productCategories?.map(category => category.name) || ['低风险理财', '中风险理财', '高风险理财']
  const series = [{
    name: '平均收益率',
    data: productCategories?.map(category => {
      const products = category.products || []
      const totalYield = products.reduce((sum, product) => sum + (product.yield || 0), 0)
      return products.length > 0 ? (totalYield / products.length) : 0
    }) || [3.2, 3.8, 4.1],
    color: '#34C759'
  }]
  
  return {
    type: 'column',
    categories: categories,
    series: series,
    color: ['#34C759', '#FF9500', '#FF3B30'],
    animation: true,
    background: '#fff',
    padding: [15, 15, 15, 15],
    xAxis: {
      disableGrid: false
    },
    yAxis: {
      disableGrid: false
    },
    extra: {
      column: {
        type: 'group',
        width: 20,
        activeBgColor: '#000000',
        activeBgOpacity: 0.1
      }
    }
  }
}

/**
 * 创建保险产品保费对比图配置 - 半径玫瑰图
 * @param {Object} data 保险数据
 */
export function createInsuranceChart(data) {
  const categories = data?.categories || []
  const series = [{
    name: '平均保费',
    data: categories.map(category => {
      const products = category.products || []
      const totalPremium = products.reduce((sum, product) => sum + (product.premium || 0), 0)
      return products.length > 0 ? (totalPremium / products.length) : 0
    }),
    color: '#FF6B35'
  }]
  
  return {
    type: 'pie',
    categories: categories.map(category => category.name),
    series: series,
    color: ['#FF6B35', '#34C759', '#FF9500', '#007AFF', '#AF52DE', '#FF2D92'],
    animation: true,
    background: '#fff',
    padding: [15, 15, 15, 15],
    extra: {
      pie: {
        type: 'ring',
        ringWidth: 30,
        ringRadius: 60,
        activeOpacity: 0.5,
        activeRadius: 10,
        offsetAngle: 0,
        labelWidth: 15,
        border: true,
        borderWidth: 3,
        borderColor: '#FFFFFF'
      }
    }
  }
}

/**
 * 创建外汇汇率走势图配置 - 渐变色曲线区域图
 * @param {Object} forexData 外汇数据
 */
export function createForexChart(forexData) {
  const majorPairs = forexData?.majorPairs || []
  const categories = majorPairs.map(pair => pair.code) || ['USD/CNY', 'EUR/CNY', 'GBP/CNY', 'JPY/CNY']
  const series = [{
    name: '汇率',
    data: majorPairs.map(pair => parseFloat(pair.price)) || [7.2345, 7.8901, 9.1234, 0.0489],
    color: '#FF6B35'
  }]
  
  return {
    type: 'area',
    categories: categories,
    series: series,
    color: ['#FF6B35', '#34C759', '#FF9500', '#007AFF', '#AF52DE', '#FF2D92'],
    animation: true,
    background: '#fff',
    padding: [15, 15, 15, 15],
    xAxis: {
      disableGrid: false
    },
    yAxis: {
      disableGrid: false
    },
    extra: {
      area: {
        type: 'curve',
        opacity: 0.3,
        addLine: true,
        width: 2,
        gradient: true,
        activeType: 'hollow'
      }
    }
  }
}
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
          const height = 200 // 继续缩小图表初始化高度
          
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
  const values = productCategories?.map(category => {
    const products = category.products || []
    const totalYield = products.reduce((sum, product) => sum + (product.yield || 0), 0)
    const avg = products.length > 0 ? (totalYield / products.length) : 0
    return parseFloat(avg.toFixed(2))
  }) || [3.20, 3.80, 4.10]
  const series = [{ name: '平均收益率', data: values, color: '#34C759' }]
  const peak = values.length ? Math.max.apply(null, values) : 0
  const yMax = parseFloat((Math.max(peak * 1.15, peak + 0.2)).toFixed(2))
  
  return {
    type: 'bar',
    categories: categories,
    series: series,
    color: ['#34C759', '#FF9500', '#FF3B30'],
    animation: true,
    background: '#fff',
    padding: [15, 20, 18, 20],
    dataLabel: true,
    xAxis: {
      // 数值轴（横向）
      disableGrid: false,
      fontSize: 10,
      rotateLabel: false,
      min: 0,
      max: yMax,
      tofix: 2,
      format: (val) => (typeof val === 'number' ? val.toFixed(2) : String(val))
    },
    yAxis: {
      // 类目轴（纵向）
      disableGrid: false,
      fontSize: 10
    },
    extra: {
      bar: {
        type: 'group',
        width: 20,
        activeBgColor: '#000000',
        activeBgOpacity: 0.1,
        labelPosition: 'right',
        dataLabel: true,
        // 开启渐变填充
        gradient: true
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
  
  // 计算每个类别的平均保费
  const chartData = categories.map(category => {
    const products = category.products || []
    const totalPremium = products.reduce((sum, product) => sum + (product.premium || 0), 0)
    const avgPremium = products.length > 0 ? (totalPremium / products.length) : 0
    return {
      name: category.name,
      value: avgPremium,
      color: category.color || '#FF6B35'
    }
  })
  
  return {
    type: 'pie',
    series: [{
      name: '平均保费',
      data: chartData,
      type: 'pie'
    }],
    color: chartData.map(item => item.color),
    animation: true,
    background: '#fff',
    padding: [15, 15, 15, 15],
    // 关闭内置图例，改用自定义一行图例
    legend: {
      show: false
    },
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
        borderColor: '#FFFFFF',
        // 开启渐变，让每个扇区有更柔和的过渡
        gradient: true,
        linearType: 'radial'
      }
    }
  }
}

/**
 * 创建外汇汇率走势图配置 - 渐变色曲线区域图
 * @param {Object} forexData 外汇数据
 */
export function createForexChart(forexData) {
  // 历史模式：用于单一币种近30天走势图
  if (forexData && forexData.history && Array.isArray(forexData.history.dates) && Array.isArray(forexData.history.values)) {
    const categories = forexData.history.dates
    const series = [{
      name: forexData.history.name || '汇率',
      data: forexData.history.values,
      color: '#FF6B35'
    }]

    // 根据指定币种，设置目标纵轴基准区间，并在此区间内按数据细化
    const pairName = (forexData.history.name || '').toUpperCase()
    const isUSD = pairName.includes('USD/CNY')
    const isEUR = pairName.includes('EUR/CNY')
    const isJPY = pairName.includes('JPY/CNY')
    let baseMin = 0, baseMax = 1
    if (isUSD) { baseMin = 6; baseMax = 8 }
    else if (isEUR) { baseMin = 7; baseMax = 9 }
    else if (isJPY) { baseMin = 0; baseMax = 1 }

    const vals = Array.isArray(series[0].data) ? series[0].data : []
    let dMin = vals.length ? Math.min.apply(null, vals) : baseMin
    let dMax = vals.length ? Math.max.apply(null, vals) : baseMax
    // 两位小数的细化边界并夹在基准区间内
    dMin = Math.max(baseMin, Math.floor(dMin * 100) / 100)
    dMax = Math.min(baseMax, Math.ceil(dMax * 100) / 100)
    // 确保最小跨度，曲线更明显
    const minSpan = isJPY ? 0.02 : 0.20
    if (dMax - dMin < minSpan) {
      const mid = (dMax + dMin) / 2
      dMin = Math.max(baseMin, parseFloat((mid - minSpan / 2).toFixed(2)))
      dMax = Math.min(baseMax, parseFloat((mid + minSpan / 2).toFixed(2)))
      if (dMax - dMin < minSpan) {
        dMax = Math.min(baseMax, parseFloat((dMin + minSpan).toFixed(2)))
      }
    }
    const yMin = dMin
    const yMax = dMax
    const yTicks = 5
    const yDec = 4

    return {
      type: 'area',
      categories: categories,
      series: series,
      color: ['#FF6B35'],
      animation: true,
      background: '#fff',
      // 增加右侧内边距，避免尾标签溢出（进一步左移尾标签）
      padding: [12, 44, 12, 12],
      dataLabel: false,
      xAxis: {
        disableGrid: false,
        boundaryGap: 'center',
        // 仅显示首尾标签
        itemCount: categories.length,
        scrollShow: true,
        scrollAlign: 'left',
        fontSize: 10,
        rotateLabel: false,
        formatter: (val, index) => {
          if (index === 0) return val
          if (index === categories.length - 1) return val
          return ''
        }
      },
      yAxis: {
        disableGrid: false,
        splitNumber: yTicks,
        fontSize: 10,
        min: yMin,
        max: yMax,
        // 强制显示小数刻度
        tofix: yDec,
        format: (val, index) => (typeof val === 'number' ? val.toFixed(yDec) : String(val))
      },
      extra: {
        area: {
          type: 'curve',
          opacity: 0.2,
          addLine: true,
          width: 2,
          gradient: true,
          activeType: 'hollow',
          dataLabel: false
        }
      }
    }
  }

  // 概览模式：展示主要货币对的当前价
  const majorPairs = forexData?.majorPairs || []
  const categories = majorPairs.map(pair => pair.code) || ['USD/CNY', 'EUR/CNY', 'GBP/CNY', 'JPY/CNY']
  const series = [{
    name: '汇率',
    data: majorPairs.map(pair => parseFloat(pair.price)) || [7.2345, 7.8901, 9.1234, 0.0489],
    color: '#FF6B35'
  }]

  // 概览模式：区间细化到两位小数，确保曲线明显
  let ovMin = Number.POSITIVE_INFINITY
  let ovMax = Number.NEGATIVE_INFINITY
  for (const code of categories) {
    if (code.includes('USD/CNY')) { ovMin = Math.min(ovMin, 6); ovMax = Math.max(ovMax, 8) }
    else if (code.includes('EUR/CNY')) { ovMin = Math.min(ovMin, 7); ovMax = Math.max(ovMax, 9) }
    else if (code.includes('JPY/CNY')) { ovMin = Math.min(ovMin, 0); ovMax = Math.max(ovMax, 1) }
  }
  if (!isFinite(ovMin) || !isFinite(ovMax)) { ovMin = 0; ovMax = 1 }
  // 按当前数据再细化并夹在基础区间
  const ovVals = Array.isArray(series[0].data) ? series[0].data : []
  let oMin = ovVals.length ? Math.min.apply(null, ovVals) : ovMin
  let oMax = ovVals.length ? Math.max.apply(null, ovVals) : ovMax
  oMin = Math.max(ovMin, Math.floor(oMin * 100) / 100)
  oMax = Math.min(ovMax, Math.ceil(oMax * 100) / 100)
  if (oMax - oMin < 0.20 && !(ovMin === 0 && ovMax === 1)) { // 非JPY时至少0.20
    const mid = (oMax + oMin) / 2
    oMin = Math.max(ovMin, parseFloat((mid - 0.10).toFixed(2)))
    oMax = Math.min(ovMax, parseFloat((mid + 0.10).toFixed(2)))
  }
  if (ovMin === 0 && ovMax === 1 && oMax - oMin < 0.02) { // JPY最小0.02
    oMax = Math.min(1, parseFloat((oMin + 0.02).toFixed(2)))
  }
  const ovTick = 5
  const isJPYOnly = (ovMin === 0 && ovMax === 1)

  // 概览模式下也设置仅首尾纵轴标注与动态小数位
  return {
    type: 'area',
    categories: categories,
    series: series,
    color: ['#FF6B35', '#34C759', '#FF9500', '#007AFF', '#AF52DE', '#FF2D92'],
    animation: true,
    background: '#fff',
    // 增加右侧内边距，避免尾标签溢出（进一步左移尾标签）
    padding: [12, 44, 12, 12],
    dataLabel: false,
    xAxis: {
      disableGrid: false,
      itemCount: categories.length,
      fontSize: 10,
      rotateLabel: false,
      formatter: (val, index) => {
        if (index === 0) return val
        if (index === categories.length - 1) return val
        return ''
      }
    },
    yAxis: {
      disableGrid: false,
      splitNumber: ovTick,
      fontSize: 10,
      min: oMin,
      max: oMax,
      tofix: 4,
      format: (val, index) => (typeof val === 'number' ? val.toFixed(4) : String(val))
    },
    extra: {
      area: {
        type: 'curve',
        opacity: 0.2,
        addLine: true,
        width: 2,
        gradient: true,
        activeType: 'hollow',
        dataLabel: false
      }
    }
  }
}
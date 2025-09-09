/**
 * 图表动态更新工具
 * 实现图表的实时数据更新和动画效果
 */

/**
 * 更新图表数据
 * @param {Object} chartInstance ECharts实例
 * @param {Object} newData 新数据
 * @param {string} chartType 图表类型
 */
export function updateChartData(chartInstance, newData, chartType) {
  if (!chartInstance || !newData) {
    console.log('图表实例或数据无效')
    return
  }

  console.log('开始更新图表数据:', chartType)

  try {
    switch (chartType) {
      case 'deposit':
        updateDepositChart(chartInstance, newData)
        break
      case 'product':
        updateProductChart(chartInstance, newData)
        break
      case 'insurance':
        updateInsuranceChart(chartInstance, newData)
        break
      case 'forex':
        updateForexChart(chartInstance, newData)
        break
      default:
        console.log('未知的图表类型:', chartType)
    }
  } catch (error) {
    console.error('更新图表数据失败:', error)
  }
}

/**
 * 更新存款利率图表
 */
function updateDepositChart(chartInstance, data) {
  if (!data.fixed) return

  const categories = Object.keys(data.fixed)
  const values = Object.values(data.fixed)

  chartInstance.setOption({
    xAxis: {
      data: categories
    },
    series: [{
      data: values,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }]
  }, true)
}

/**
 * 更新理财产品图表
 */
function updateProductChart(chartInstance, data) {
  if (!data.products) return

  const products = data.products.slice(0, 8)
  const names = products.map(p => p.name.length > 6 ? p.name.substring(0, 6) + '...' : p.name)
  const rates = products.map(p => p.expectedReturn)

  chartInstance.setOption({
    xAxis: {
      data: names
    },
    series: [{
      data: rates,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }]
  }, true)
}

/**
 * 更新保险产品图表
 */
function updateInsuranceChart(chartInstance, data) {
  if (!data.products) return

  const products = data.products.slice(0, 6)
  const names = products.map(p => p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name)
  const premiums = products.map(p => p.monthlyPremium)

  chartInstance.setOption({
    xAxis: {
      data: names
    },
    series: [{
      data: premiums,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }]
  }, true)
}

/**
 * 更新外汇汇率图表
 */
function updateForexChart(chartInstance, data) {
  if (!data.majorPairs) return

  const pairs = data.majorPairs.slice(0, 6)
  const names = pairs.map(p => p.code)
  const prices = pairs.map(p => parseFloat(p.price))

  chartInstance.setOption({
    xAxis: {
      data: names
    },
    series: [{
      data: prices,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }]
  }, true)
}

/**
 * 创建图表更新定时器
 * @param {Object} chartInstance ECharts实例
 * @param {Function} dataFetcher 数据获取函数
 * @param {string} chartType 图表类型
 * @param {number} interval 更新间隔（毫秒）
 * @returns {Object} 定时器对象
 */
export function createChartUpdater(chartInstance, dataFetcher, chartType, interval = 30000) {
  let updateTimer = null
  let isUpdating = false

  const updateChart = async () => {
    if (isUpdating) return
    isUpdating = true

    try {
      console.log(`开始定时更新${chartType}图表数据...`)
      const newData = await dataFetcher()
      updateChartData(chartInstance, newData, chartType)
      console.log(`${chartType}图表数据更新完成`)
    } catch (error) {
      console.error(`更新${chartType}图表数据失败:`, error)
    } finally {
      isUpdating = false
    }
  }

  const start = () => {
    if (updateTimer) return
    updateTimer = setInterval(updateChart, interval)
    console.log(`${chartType}图表定时更新已启动，间隔: ${interval}ms`)
  }

  const stop = () => {
    if (updateTimer) {
      clearInterval(updateTimer)
      updateTimer = null
      console.log(`${chartType}图表定时更新已停止`)
    }
  }

  const destroy = () => {
    stop()
  }

  return {
    start,
    stop,
    destroy,
    update: updateChart
  }
}

/**
 * 添加图表动画效果
 * @param {Object} chartInstance ECharts实例
 * @param {string} animationType 动画类型
 */
export function addChartAnimation(chartInstance, animationType = 'fadeIn') {
  if (!chartInstance) return

  const animations = {
    fadeIn: {
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    },
    slideUp: {
      animation: true,
      animationDuration: 1200,
      animationEasing: 'elasticOut'
    },
    bounce: {
      animation: true,
      animationDuration: 2000,
      animationEasing: 'bounceOut'
    }
  }

  const animationConfig = animations[animationType] || animations.fadeIn

  chartInstance.setOption({
    series: [{
      ...animationConfig
    }]
  })
}

/**
 * 创建数据变化指示器
 * @param {Array} oldData 旧数据
 * @param {Array} newData 新数据
 * @returns {Object} 变化指示器
 */
export function createDataChangeIndicator(oldData, newData) {
  const changes = []
  
  if (Array.isArray(oldData) && Array.isArray(newData)) {
    const maxLength = Math.max(oldData.length, newData.length)
    
    for (let i = 0; i < maxLength; i++) {
      const oldValue = oldData[i] || 0
      const newValue = newData[i] || 0
      const change = newValue - oldValue
      const changePercent = oldValue !== 0 ? (change / oldValue) * 100 : 0
      
      changes.push({
        index: i,
        oldValue,
        newValue,
        change,
        changePercent,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      })
    }
  }
  
  return {
    changes,
    hasChanges: changes.some(c => c.change !== 0),
    totalChange: changes.reduce((sum, c) => sum + c.change, 0),
    averageChange: changes.length > 0 ? changes.reduce((sum, c) => sum + c.change, 0) / changes.length : 0
  }
}

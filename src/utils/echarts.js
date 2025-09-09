/**
 * ECharts图表渲染工具
 * 用于在UniApp中渲染ECharts图表
 */

import * as echarts from 'echarts'

/**
 * 初始化ECharts图表
 * @param {string} canvasId Canvas ID
 * @param {Object} option 图表配置
 * @param {Object} context 页面上下文
 * @returns {Promise<Object>} ECharts实例
 */
export function initChart(canvasId, option, context) {
  return new Promise((resolve, reject) => {
    try {
      console.log('🎨 初始化ECharts图表:', canvasId)
      
      // #ifdef APP-PLUS
      // App-Plus环境使用canvas-2d
      const query = uni.createSelectorQuery().in(context)
      query.select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          try {
            if (res[0]) {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')
              
              // 设置canvas尺寸
              const dpr = uni.getSystemInfoSync().pixelRatio
              canvas.width = res[0].width * dpr
              canvas.height = res[0].height * dpr
              ctx.scale(dpr, dpr)
              
              // 创建ECharts实例
              const chart = echarts.init(canvas, null, {
                width: res[0].width,
                height: res[0].height,
                devicePixelRatio: dpr
              })
              
              // 设置图表配置
              chart.setOption(option)
              
              console.log('✅ ECharts图表渲染完成 (App-Plus)')
              resolve(chart)
            } else {
              reject(new Error('未找到canvas节点'))
            }
          } catch (error) {
            console.error('❌ App-Plus ECharts初始化失败:', error)
            reject(error)
          }
        })
      // #endif
      
      // #ifndef APP-PLUS
      // 其他环境使用传统方式
      setTimeout(() => {
        try {
          // 使用uni.createCanvasContext创建上下文
          const ctx = uni.createCanvasContext(canvasId, context)
          
          // 直接使用ECharts的uni-app适配器
          const chart = echarts.init(ctx, null, {
            width: 300,
            height: 200,
            devicePixelRatio: 1
          })
          
          // 设置图表配置
          chart.setOption(option, true)
          
          // 渲染图表
          chart.render()
          
          console.log('✅ ECharts图表渲染完成')
          resolve(chart)
        } catch (error) {
          console.error('❌ 传统环境ECharts初始化失败:', error)
          // 尝试备用方案
          try {
            const ctx = uni.createCanvasContext(canvasId, context)
            const chart = echarts.init(ctx)
            chart.setOption(option)
            chart.render()
            console.log('✅ 备用方案ECharts渲染成功')
            resolve(chart)
          } catch (backupError) {
            console.error('❌ 备用方案也失败:', backupError)
            reject(backupError)
          }
        }
      }, 300)
      // #endif
      
    } catch (error) {
      console.error('❌ ECharts图表初始化失败:', error)
      reject(error)
    }
  })
}

/**
 * 更新图表配置
 * @param {Object} chart ECharts实例
 * @param {Object} option 新的图表配置
 */
export function updateChart(chart, option) {
  try {
    if (chart) {
      chart.setOption(option, true)
      chart.render()
      console.log('图表配置更新完成')
    }
  } catch (error) {
    console.error('图表更新失败:', error)
  }
}

/**
 * 销毁图表
 * @param {Object} chart ECharts实例
 */
export function disposeChart(chart) {
  try {
    if (chart) {
      chart.dispose()
      console.log('图表已销毁')
    }
  } catch (error) {
    console.error('图表销毁失败:', error)
  }
}

/**
 * 创建存款利率趋势图配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createDepositRateChart(data) {
  return {
    title: {
      text: '存款利率趋势',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: data.fixed ? data.fixed.map(item => item.term) : ['3个月', '6个月', '1年', '2年', '3年', '5年'],
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '年化利率(%)',
      nameTextStyle: {
        fontSize: 10
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [{
      name: '存款利率',
      type: 'line',
      data: data.fixed ? data.fixed.map(item => item.rate) : [1.85, 2.05, 2.10, 2.60, 2.95, 3.20],
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#1976d2'
      },
      itemStyle: {
        color: '#1976d2'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(25, 118, 210, 0.3)' },
            { offset: 1, color: 'rgba(25, 118, 210, 0.1)' }
          ]
        }
      }
    }],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    }
  }
}

/**
 * 创建理财产品收益对比图配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createWealthProductChart(data) {
  const categories = data.categories || []
  const categoryNames = categories.map(cat => cat.name)
  const avgYields = categories.map(cat => {
    const products = cat.products || []
    const totalYield = products.reduce((sum, product) => sum + (product.yield || 0), 0)
    return products.length > 0 ? (totalYield / products.length).toFixed(2) : 0
  })
  
  return {
    title: {
      text: '理财产品平均收益率',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: categoryNames,
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '平均收益率(%)',
      nameTextStyle: {
        fontSize: 10
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [{
      name: '平均收益率',
      type: 'bar',
      data: avgYields,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#42a5f5' },
            { offset: 1, color: '#1976d2' }
          ]
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 10
      }
    }],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    }
  }
}

/**
 * 创建外汇汇率走势图配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createForexChart(data) {
  const majorPairs = data.majorPairs || []
  const pairNames = majorPairs.map(pair => pair.code)
  const prices = majorPairs.map(pair => parseFloat(pair.price) || 0)
  
  return {
    title: {
      text: '主要货币对汇率',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: pairNames,
      axisLabel: {
        fontSize: 10,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '汇率',
      nameTextStyle: {
        fontSize: 10
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [{
      name: '汇率',
      type: 'line',
      data: prices,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#e53935'
      },
      itemStyle: {
        color: '#e53935'
      }
    }],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '20%',
      containLabel: true
    }
  }
}

/**
 * 创建保险产品保费对比图配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createInsuranceChart(data) {
  const categories = data.categories || []
  const categoryNames = categories.map(cat => cat.name)
  const avgPremiums = categories.map(cat => {
    const products = cat.products || []
    const totalPremium = products.reduce((sum, product) => sum + (product.premium || 0), 0)
    return products.length > 0 ? (totalPremium / products.length).toFixed(0) : 0
  })
  
  return {
    title: {
      text: '保险产品平均保费',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: categoryNames,
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '平均保费(元/年)',
      nameTextStyle: {
        fontSize: 10
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [{
      name: '平均保费',
      type: 'bar',
      data: avgPremiums,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#66bb6a' },
            { offset: 1, color: '#43a047' }
          ]
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '¥{c}',
        fontSize: 10
      }
    }],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    }
  }
}

/**
 * 创建资产配置饼图配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createAssetAllocationChart(data) {
  const items = data.items || [
    { name: '存款', value: 100000 },
    { name: '理财', value: 150000 },
    { name: '保险', value: 50000 },
    { name: '外汇', value: 30000 }
  ]
  
  return {
    title: {
      text: '资产配置分布',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: {
        color: '#fff'
      },
      formatter: '{b}: ¥{c} ({d}%)'
    },
    series: [{
      name: '资产分布',
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['50%', '50%'],
      data: items,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{b}: {d}%',
        fontSize: 10
      }
    }]
  }
}

/**
 * 创建收益率仪表盘配置
 * @param {Object} data 数据
 * @returns {Object} 图表配置
 */
export function createYieldGaugeChart(data) {
  const value = data.value || 3.5
  
  return {
    title: {
      text: '投资组合收益率',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    series: [{
      name: '收益率',
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '70%',
      min: 0,
      max: 10,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 4,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        distance: -20,
        splitNumber: 5,
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      splitLine: {
        distance: -20,
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        color: 'auto',
        distance: 25,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: 'auto',
        fontSize: 16
      },
      data: [{
        value: value,
        name: '年化收益率'
      }]
    }]
  }
}

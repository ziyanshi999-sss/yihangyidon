/**
 * AI图表生成服务
 * 使用硅基流动大模型生成金融数据图表
 */

const BASE_URL = 'https://api.siliconflow.cn/v1'
const SILICONFLOW_API_KEY = 'sk-fkzxlpblcjigbzitanooofmnfmvvedobfdvvxqdbbdodntdt'

/**
 * 生成图表配置
 * @param {Object} data 数据对象
 * @param {string} chartType 图表类型
 * @param {Object} options 选项
 * @returns {Promise<Object>} 图表配置
 */
export async function generateChartConfig(data, chartType, options = {}) {
  try {
    console.log('🤖 使用大模型生成图表配置，数据类型:', chartType)
    
    const prompt = buildChartPrompt(data, chartType, options)
    
    const response = await uni.request({
      url: `${BASE_URL}/chat/completions`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'Qwen/Qwen2.5-14B-Instruct',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的金融数据可视化专家。请根据提供的数据生成ECharts图表配置JSON。要求：1. 图表美观专业 2. 金融主题配色 3. 清晰的数据标签 4. 流畅动画效果 5. 只返回JSON，不要其他文字'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      },
      timeout: 20000
    })
    
    if (response.statusCode === 200 && response.data && response.data.choices && response.data.choices[0]) {
      const aiContent = response.data.choices[0].message.content
      console.log('AI返回内容:', aiContent)
      
      // 提取JSON
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const chartConfig = JSON.parse(jsonMatch[0])
        console.log('✅ 大模型生成图表配置成功')
        return chartConfig
      } else {
        throw new Error('无法从AI响应中提取JSON')
      }
    } else {
      throw new Error('AI请求失败')
    }
    
  } catch (error) {
    console.error('❌ 大模型生成图表失败:', error)
    throw error
  }
}

/**
 * 智能生成图表配置（不依赖AI）
 * @param {Object} data 数据对象
 * @param {string} chartType 图表类型
 * @param {Object} options 选项
 * @returns {Object} 图表配置
 */
async function generateSmartChartConfig(data, chartType, options = {}) {
  console.log('使用智能生成图表配置')
  
  switch (chartType) {
    case 'deposit':
      return generateDepositChart(data)
    case 'product':
      return generateProductChart(data)
    case 'insurance':
      return generateInsuranceChartInternal(data)
    case 'forex':
      return await generateForexChart(data)
    default:
      return getDefaultChartConfig(chartType, data)
  }
}

/**
 * 生成存款利率图表
 */
function generateDepositChart(data) {
  if (!data || !data.fixed) {
    return getDefaultChartConfig('deposit', data)
  }
  
  const categories = Object.keys(data.fixed)
  const values = Object.values(data.fixed)
  
  return {
    title: {
      text: '存款利率对比',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: '利率(%)',
      axisLabel: { formatter: '{value}%' }
    },
    series: [{
      name: '存款利率',
      type: 'bar',
      data: values,
      itemStyle: {
        color: '#5470c6',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: { color: '#3ba0ff' }
      }
    }]
  }
}

/**
 * 生成理财产品图表
 */
function generateProductChart(data) {
  if (!data || !data.products) {
    return getDefaultChartConfig('product', data)
  }
  
  const products = data.products.slice(0, 8) // 取前8个产品
  const names = products.map(p => p.name.length > 6 ? p.name.substring(0, 6) + '...' : p.name)
  const rates = products.map(p => p.expectedReturn)
  
  return {
    title: {
      text: '理财产品收益率',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: '预期收益率(%)',
      axisLabel: { formatter: '{value}%' }
    },
    series: [{
      name: '预期收益率',
      type: 'bar',
      data: rates,
      itemStyle: {
        color: '#91cc75',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: { color: '#73a373' }
      }
    }]
  }
}

/**
 * 生成保险产品图表
 */
function generateInsuranceChartInternal(data) {
  if (!data || !data.products) {
    return getDefaultChartConfig('insurance', data)
  }
  
  const products = data.products.slice(0, 6)
  const names = products.map(p => p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name)
  const premiums = products.map(p => p.monthlyPremium)
  
  return {
    title: {
      text: '保险产品月保费对比',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ¥{c}'
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: '月保费(元)',
      axisLabel: { formatter: '¥{value}' }
    },
    series: [{
      name: '月保费',
      type: 'bar',
      data: premiums,
      itemStyle: {
        color: '#fac858',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: { color: '#f7ba2a' }
      }
    }]
  }
}


/**
 * 构建图表提示词
 */
function buildChartPrompt(data, chartType, options) {
  const basePrompt = `请根据以下金融数据生成${chartType}图表配置：

数据内容：
${JSON.stringify(data, null, 2)}

图表要求：
- 使用ECharts配置格式
- 图表类型：${chartType}
- 颜色方案：专业金融风格（蓝色系为主）
- 包含标题、图例、坐标轴标签
- 数据标签显示
- 响应式设计

请直接返回JSON配置，不要包含其他文字说明。`

  switch (chartType) {
    case 'line':
      return basePrompt + '\n\n特别要求：\n- 折线图，显示趋势变化\n- 支持多条线对比\n- 添加数据点标记\n- 平滑曲线'
    
    case 'bar':
      return basePrompt + '\n\n特别要求：\n- 柱状图，对比不同类别数据\n- 支持横向和纵向显示\n- 渐变色填充\n- 数值标签显示'
    
    case 'pie':
      return basePrompt + '\n\n特别要求：\n- 饼图，显示占比关系\n- 支持环形图\n- 突出显示最大占比\n- 百分比标签'
    
    case 'area':
      return basePrompt + '\n\n特别要求：\n- 面积图，显示累积效果\n- 渐变色填充\n- 支持堆叠\n- 平滑过渡'
    
    case 'gauge':
      return basePrompt + '\n\n特别要求：\n- 仪表盘，显示指标值\n- 分段颜色（绿色、黄色、红色）\n- 指针动画\n- 数值显示'
    
    case 'candlestick':
      return basePrompt + '\n\n特别要求：\n- K线图，显示价格走势\n- 红涨绿跌\n- 支持成交量\n- 技术指标线'
    
    default:
      return basePrompt
  }
}

/**
 * 获取默认图表配置
 */
function getDefaultChartConfig(chartType, data) {
  const baseConfig = {
    title: {
      text: '金融数据图表',
      left: 'center',
      textStyle: {
        fontSize: 16,
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
    legend: {
      top: 'bottom',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }

  switch (chartType) {
    case 'line':
      return {
        ...baseConfig,
        xAxis: {
          type: 'category',
          data: data.categories || ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '收益率',
          type: 'line',
          data: data.values || [2.1, 2.3, 2.0, 2.5, 2.8, 2.6],
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#1976d2'
          },
          itemStyle: {
            color: '#1976d2'
          }
        }]
      }
    
    case 'bar':
      return {
        ...baseConfig,
        xAxis: {
          type: 'category',
          data: data.categories || ['存款', '理财', '保险', '外汇']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '金额',
          type: 'bar',
          data: data.values || [100000, 150000, 50000, 30000],
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
            formatter: '{c}'
          }
        }]
      }
    
    case 'pie':
      return {
        ...baseConfig,
        series: [{
          name: '资产分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: data.items || [
            { value: 100000, name: '存款' },
            { value: 150000, name: '理财' },
            { value: 50000, name: '保险' },
            { value: 30000, name: '外汇' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {d}%'
          }
        }]
      }
    
    case 'gauge':
      return {
        ...baseConfig,
        series: [{
          name: '收益率',
          type: 'gauge',
          center: ['50%', '60%'],
          radius: '80%',
          min: 0,
          max: 10,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 6,
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
            distance: -30,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              width: 4,
              color: '#999'
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 40,
            fontSize: 12
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            color: 'auto',
            fontSize: 20
          },
          data: [{
            value: data.value || 3.5,
            name: '年化收益率'
          }]
        }]
      }
    
    default:
      return baseConfig
  }
}

/**
 * 生成存款利率趋势图
 */
export async function generateDepositRateChart(depositData) {
  const chartData = {
    categories: depositData.fixed.map(item => item.term),
    values: depositData.fixed.map(item => item.rate),
    title: '存款利率趋势'
  }
  
  return await generateChartConfig(chartData, 'line', {
    title: '存款利率趋势图',
    yAxisLabel: '年化利率(%)'
  })
}

/**
 * 生成理财产品收益对比图
 */
export async function generateWealthProductChart(wealthData) {
  const chartData = {
    categories: wealthData.categories.map(cat => cat.name),
    values: wealthData.categories.map(cat => 
      cat.products.reduce((sum, product) => sum + product.yield, 0) / cat.products.length
    ),
    title: '理财产品平均收益率对比'
  }
  
  return await generateChartConfig(chartData, 'bar', {
    title: '理财产品收益率对比',
    yAxisLabel: '平均收益率(%)'
  })
}

/**
 * 生成外汇汇率走势图
 */
export async function generateForexChart(forexData) {
  try {
    console.log('开始生成外汇图表配置')
    
    if (!forexData || !forexData.majorPairs) {
      console.log('外汇数据无效，使用默认配置')
      return getDefaultChartConfig('forex', forexData)
    }
    
    const pairs = forexData.majorPairs.slice(0, 6)
    const names = pairs.map(p => p.code)
    const prices = pairs.map(p => parseFloat(p.price))
    
    const chartConfig = {
      title: {
        text: '主要货币对汇率',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}'
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '汇率',
        axisLabel: { formatter: '{value}' }
      },
      series: [{
        name: '汇率',
        type: 'line',
        data: prices,
        smooth: true,
        lineStyle: { color: '#ee6666', width: 3 },
        itemStyle: { color: '#ee6666' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(238, 102, 102, 0.3)' },
              { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
            ]
          }
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }]
    }
    
    console.log('外汇图表配置生成成功')
    return chartConfig
  } catch (error) {
    console.error('生成外汇图表配置失败:', error)
    return getDefaultChartConfig('forex', forexData)
  }
}

/**
 * 生成保险产品保费对比图
 */
export async function generateInsuranceChart(insuranceData) {
  const chartData = {
    categories: insuranceData.categories.map(cat => cat.name),
    values: insuranceData.categories.map(cat => 
      cat.products.reduce((sum, product) => sum + product.premium, 0) / cat.products.length
    ),
    title: '保险产品平均保费对比'
  }
  
  return await generateChartConfig(chartData, 'bar', {
    title: '保险产品保费对比',
    yAxisLabel: '平均保费(元/年)'
  })
}

/**
 * 生成资产配置饼图
 */
export async function generateAssetAllocationChart(assetData) {
  const chartData = {
    items: [
      { name: '存款', value: assetData.deposit || 0 },
      { name: '理财', value: assetData.wealth || 0 },
      { name: '保险', value: assetData.insurance || 0 },
      { name: '外汇', value: assetData.forex || 0 }
    ],
    title: '资产配置分布'
  }
  
  return await generateChartConfig(chartData, 'pie', {
    title: '个人资产配置',
    showPercentage: true
  })
}

/**
 * 生成收益率仪表盘
 */
export async function generateYieldGaugeChart(yieldData) {
  const chartData = {
    value: yieldData.averageYield || 3.5,
    title: '综合收益率'
  }
  
  return await generateChartConfig(chartData, 'gauge', {
    title: '投资组合收益率',
    max: 10,
    min: 0
  })
}

/**
 * 生成市场指数K线图
 */
export async function generateKLineChart(marketData) {
  const chartData = {
    categories: marketData.dates || ['09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'],
    values: marketData.klineData || [
      [3080, 3090, 3075, 3085],
      [3085, 3095, 3080, 3090],
      [3090, 3100, 3085, 3095],
      [3095, 3105, 3090, 3100],
      [3100, 3110, 3095, 3105],
      [3105, 3115, 3100, 3110],
      [3110, 3120, 3105, 3115],
      [3115, 3125, 3110, 3120]
    ],
    title: '市场指数走势'
  }
  
  return await generateChartConfig(chartData, 'candlestick', {
    title: '上证指数K线图',
    yAxisLabel: '指数点位'
  })
}

/**
 * 批量生成图表配置
 */
export async function generateMultipleCharts(data) {
  try {
    const charts = {}
    
    // 并行生成多个图表
    const promises = []
    
    if (data.deposit) {
      promises.push(
        generateDepositRateChart(data.deposit).then(config => {
          charts.depositRate = config
        })
      )
    }
    
    if (data.wealth) {
      promises.push(
        generateWealthProductChart(data.wealth).then(config => {
          charts.wealthProduct = config
        })
      )
    }
    
    if (data.forex) {
      promises.push(
        generateForexChart(data.forex).then(config => {
          charts.forex = config
        })
      )
    }
    
    if (data.insurance) {
      promises.push(
        generateInsuranceChart(data.insurance).then(config => {
          charts.insurance = config
        })
      )
    }
    
    if (data.asset) {
      promises.push(
        generateAssetAllocationChart(data.asset).then(config => {
          charts.assetAllocation = config
        })
      )
    }
    
    await Promise.all(promises)
    
    console.log('批量生成图表配置完成:', charts)
    return charts
    
  } catch (error) {
    console.error('批量生成图表失败:', error)
    throw error
  }
}

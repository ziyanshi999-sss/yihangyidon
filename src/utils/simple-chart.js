/**
 * 简单图表工具
 * 不依赖echarts，使用原生canvas绘制简单图表
 */

/**
 * 绘制简单的折线图
 * @param {string} canvasId Canvas ID
 * @param {Object} data 数据
 * @param {Object} context 页面上下文
 */
export function drawSimpleLineChart(canvasId, data, context) {
  try {
    console.log('🎨 绘制简单折线图:', canvasId)
    
    // #ifdef APP-PLUS
    const query = uni.createSelectorQuery().in(context)
    query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          
          // 设置canvas尺寸
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          drawLineChart(ctx, res[0].width, res[0].height, data)
        }
      })
    // #endif
    
    // #ifndef APP-PLUS
    setTimeout(() => {
      const ctx = uni.createCanvasContext(canvasId, context)
      drawLineChart(ctx, 300, 200, data)
      ctx.draw()
    }, 300)
    // #endif
    
  } catch (error) {
    console.error('绘制简单图表失败:', error)
  }
}

/**
 * 绘制折线图
 * @param {Object} ctx Canvas上下文
 * @param {number} width 宽度
 * @param {number} height 高度
 * @param {Object} data 数据
 */
function drawLineChart(ctx, width, height, data) {
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 设置背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制坐标轴
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()
  
  // 绘制数据
  if (data && data.length > 0) {
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const valueRange = maxValue - minValue || 1
    
    // 绘制折线
    ctx.strokeStyle = '#1976d2'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // 绘制数据点
    ctx.fillStyle = '#1976d2'
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('数据趋势图', width / 2, 20)
}

/**
 * 绘制简单的柱状图
 * @param {string} canvasId Canvas ID
 * @param {Object} data 数据
 * @param {Object} context 页面上下文
 */
export function drawSimpleBarChart(canvasId, data, context) {
  try {
    console.log('🎨 绘制简单柱状图:', canvasId)
    
    // #ifdef APP-PLUS
    const query = uni.createSelectorQuery().in(context)
    query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          drawBarChart(ctx, res[0].width, res[0].height, data)
        }
      })
    // #endif
    
    // #ifndef APP-PLUS
    setTimeout(() => {
      const ctx = uni.createCanvasContext(canvasId, context)
      drawBarChart(ctx, 300, 200, data)
      ctx.draw()
    }, 300)
    // #endif
    
  } catch (error) {
    console.error('绘制简单柱状图失败:', error)
  }
}

/**
 * 绘制柱状图
 * @param {Object} ctx Canvas上下文
 * @param {number} width 宽度
 * @param {number} height 高度
 * @param {Object} data 数据
 */
function drawBarChart(ctx, width, height, data) {
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 设置背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制坐标轴
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()
  
  // 绘制柱状图
  if (data && data.length > 0) {
    const maxValue = Math.max(...data)
    const barWidth = chartWidth / data.length * 0.8
    const barSpacing = chartWidth / data.length * 0.2
    
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const barHeight = (value / maxValue) * chartHeight
      const y = height - padding - barHeight
      
      // 绘制柱子
      ctx.fillStyle = '#42a5f5'
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // 绘制数值标签
      ctx.fillStyle = '#333'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })
  }
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('数据对比图', width / 2, 20)
}

/**
 * 绘制简单的饼图
 * @param {string} canvasId Canvas ID
 * @param {Object} data 数据
 * @param {Object} context 页面上下文
 */
export function drawSimplePieChart(canvasId, data, context) {
  try {
    console.log('🎨 绘制简单饼图:', canvasId)
    
    // #ifdef APP-PLUS
    const query = uni.createSelectorQuery().in(context)
    query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          drawPieChart(ctx, res[0].width, res[0].height, data)
        }
      })
    // #endif
    
    // #ifndef APP-PLUS
    setTimeout(() => {
      const ctx = uni.createCanvasContext(canvasId, context)
      drawPieChart(ctx, 300, 200, data)
      ctx.draw()
    }, 300)
    // #endif
    
  } catch (error) {
    console.error('绘制简单饼图失败:', error)
  }
}

/**
 * 绘制饼图
 * @param {Object} ctx Canvas上下文
 * @param {number} width 宽度
 * @param {number} height 高度
 * @param {Object} data 数据
 */
function drawPieChart(ctx, width, height, data) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 2 - 40
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 设置背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)
  
  if (data && data.length > 0) {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2
    
    const colors = ['#42a5f5', '#66bb6a', '#ff7043', '#ab47bc', '#ffa726']
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      
      // 绘制扇形
      ctx.fillStyle = colors[index % colors.length]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()
      
      // 绘制标签
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20)
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20)
      
      ctx.fillStyle = '#333'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(item.name, labelX, labelY)
      
      currentAngle += sliceAngle
    })
  }
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('数据分布图', width / 2, 20)
}


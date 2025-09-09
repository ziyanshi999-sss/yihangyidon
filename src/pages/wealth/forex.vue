<template>
  <view class="forex-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">‹</text>
        </view>
        <text class="nav-title">外汇交易</text>
        <view class="nav-right">
          <text class="nav-icon" @click="toggleAutoUpdate" :class="{ active: autoUpdate }">⏰</text>
          <text class="nav-icon" @click="onRefresh">⟳</text>
        </view>
      </view>
    </view>

    <!-- 市场状态 -->
    <view class="market-status">
      <view class="status-header">
        <view class="status-info">
          <text class="status-title">外汇市场</text>
          <view class="status-indicator" :class="{ open: marketStatus.isOpen, closed: !marketStatus.isOpen }">
            <text class="status-dot"></text>
            <text class="status-text">{{ marketStatus.isOpen ? '开市' : '休市' }}</text>
          </view>
        </view>
        <text class="last-update">最后更新: {{ formatTime(marketStatus.lastUpdate) }}</text>
      </view>
    </view>

    <!-- 主要货币对 -->
    <view class="major-pairs">
      <view class="pairs-header">
        <text class="pairs-title">主要货币对</text>
        <text class="pairs-subtitle">实时汇率</text>
      </view>
      
      <view class="pairs-list">
        <view 
          class="pair-item" 
          v-for="pair in forexData.majorPairs" 
          :key="pair.code"
          @click="onPairDetail(pair)"
        >
          <view class="pair-info">
            <text class="pair-code">{{ pair.code }}</text>
            <text class="pair-name">{{ pair.name }}</text>
          </view>
          <view class="pair-price">
            <text class="price-value">{{ pair.price }}</text>
            <view class="price-change" :class="{ up: pair.change > 0, down: pair.change < 0 }">
              <text class="change-value">{{ pair.change > 0 ? '+' : '' }}{{ pair.change }}%</text>
            </view>
          </view>
          <view class="pair-actions">
            <button class="trade-btn" @click.stop="onTrade(pair)">交易</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 汇率走势图表 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">汇率走势图</text>
        <view class="chart-tabs">
          <text 
            class="chart-tab" 
            :class="{ active: selectedPair === 'USD/CNY' }"
            @click="selectedPair = 'USD/CNY'"
          >美元/人民币</text>
          <text 
            class="chart-tab" 
            :class="{ active: selectedPair === 'EUR/CNY' }"
            @click="selectedPair = 'EUR/CNY'"
          >欧元/人民币</text>
          <text 
            class="chart-tab" 
            :class="{ active: selectedPair === 'JPY/CNY' }"
            @click="selectedPair = 'JPY/CNY'"
          >日元/人民币</text>
        </view>
      </view>
      <view class="chart-container">
        <canvas 
          canvas-id="forexChart" 
          class="chart-canvas"
          @touchstart="onChartTouch"
        ></canvas>
      </view>
    </view>

    <!-- 外汇工具 -->
    <view class="tools-section">
      <view class="section-header">
        <text class="section-title">外汇工具</text>
        <text class="section-subtitle">实用工具 · 便捷交易</text>
      </view>
      
      <view class="tools-grid">
        <view class="tool-item" @click="onOpenTool('calculator')">
          <view class="tool-icon">🧮</view>
          <text class="tool-text">汇率计算器</text>
        </view>
        <view class="tool-item" @click="onOpenTool('converter')">
          <view class="tool-icon">💱</view>
          <text class="tool-text">货币转换</text>
        </view>
        <view class="tool-item" @click="onOpenTool('calendar')">
          <view class="tool-icon">📅</view>
          <text class="tool-text">财经日历</text>
        </view>
        <view class="tool-item" @click="onOpenTool('news')">
          <view class="tool-icon">📰</view>
          <text class="tool-text">外汇资讯</text>
        </view>
      </view>
    </view>

    <!-- 汇率计算器 -->
    <view class="calculator-section">
      <view class="section-header">
        <text class="section-title">汇率计算器</text>
        <text class="section-subtitle">实时计算 · 精确转换</text>
      </view>
      
      <view class="calculator-form">
        <view class="form-group">
          <text class="form-label">从</text>
          <picker 
            :value="calculator.fromIndex" 
            :range="currencyList" 
            @change="onFromCurrencyChange"
          >
            <view class="picker-input">
              {{ currencyList[calculator.fromIndex] }}
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">到</text>
          <picker 
            :value="calculator.toIndex" 
            :range="currencyList" 
            @change="onToCurrencyChange"
          >
            <view class="picker-input">
              {{ currencyList[calculator.toIndex] }}
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">金额</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="calculator.amount"
            placeholder="请输入金额"
          />
        </view>
        
        <button class="calculate-btn" @click="calculateExchange">计算</button>
      </view>
      
      <view class="calculator-result" v-if="calculator.result">
        <view class="result-display">
          <text class="result-amount">{{ calculator.result.amount }}</text>
          <text class="result-currency">{{ currencyList[calculator.toIndex] }}</text>
        </view>
        <view class="result-rate">
          <text class="rate-text">汇率: 1 {{ currencyList[calculator.fromIndex] }} = {{ calculator.result.rate }} {{ currencyList[calculator.toIndex] }}</text>
        </view>
      </view>
    </view>

    <!-- 外汇知识 -->
    <view class="knowledge-section">
      <view class="section-header">
        <text class="section-title">外汇知识</text>
        <text class="section-subtitle">了解外汇 · 理性投资</text>
      </view>
      
      <view class="knowledge-list">
        <view class="knowledge-item" v-for="item in knowledgeList" :key="item.id">
          <text class="knowledge-title">{{ item.title }}</text>
          <text class="knowledge-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 风险提示 -->
    <view class="risk-warning">
      <view class="warning-header">
        <text class="warning-icon">⚠️</text>
        <text class="warning-title">风险提示</text>
      </view>
      <view class="warning-content">
        <text class="warning-text">• 外汇交易存在汇率波动风险，可能导致本金损失</text>
        <text class="warning-text">• 请根据自身风险承受能力合理配置外汇资产</text>
        <text class="warning-text">• 建议分散投资，不要将所有资金投入外汇</text>
        <text class="warning-text">• 交易前请充分了解相关风险和政策规定</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getForexMajorPairs, getForexTradingPairs } from '@/api/wealth.js'
import { drawSimpleLineChart } from '@/utils/simple-chart.js'

export default {
  data() {
    return {
      loading: false,
      selectedPair: 'USD/CNY',
      chartInstance: null,
      forexData: {
        majorPairs: [
          { code: 'USD/CNY', name: '美元/人民币', price: 7.2375, change: 0.12, changePercent: 0.0017, high: 7.2450, low: 7.2200 },
          { code: 'EUR/CNY', name: '欧元/人民币', price: 7.8801, change: -0.08, changePercent: -0.0010, high: 7.8900, low: 7.8700 },
          { code: 'JPY/CNY', name: '日元/人民币', price: 0.0468, change: 0.02, changePercent: 0.0043, high: 0.0470, low: 0.0465 },
          { code: 'GBP/CNY', name: '英镑/人民币', price: 9.1205, change: -0.15, changePercent: -0.0016, high: 9.1350, low: 9.1100 },
          { code: 'AUD/CNY', name: '澳元/人民币', price: 4.7850, change: 0.05, changePercent: 0.0011, high: 4.7900, low: 4.7800 },
          { code: 'CAD/CNY', name: '加元/人民币', price: 5.3200, change: -0.03, changePercent: -0.0006, high: 5.3250, low: 5.3150 }
        ],
        marketStatus: {
          isOpen: true,
          nextOpen: '2024-01-02T09:00:00Z',
          lastUpdate: new Date().toISOString()
        }
      },
      currencyList: ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD'],
      calculator: {
        fromIndex: 0,
        toIndex: 1,
        amount: '',
        result: null
      },
      updateTimer: null,
      autoUpdate: true,
      updateInterval: 30000, // 30秒更新一次
      knowledgeList: [
        {
          id: 'k1',
          title: '什么是外汇？',
          desc: '外汇是指不同国家货币之间的兑换，外汇市场是全球最大的金融市场。'
        },
        {
          id: 'k2',
          title: '汇率如何影响投资？',
          desc: '汇率波动会影响海外投资收益，汇率上升时海外资产价值下降。'
        },
        {
          id: 'k3',
          title: '外汇交易时间',
          desc: '外汇市场24小时交易，但不同时段流动性不同，亚洲、欧洲、美洲时段各有特点。'
        }
      ]
    }
  },
  
  computed: {
    marketStatus() {
      return this.forexData.marketStatus
    }
  },
  
  onLoad() {
    this.loadForexData()
  },
  
  onShow() {
    // 页面显示时启动自动更新
    if (this.chartInstance && this.autoUpdate) {
      this.startAutoUpdate()
    }
  },
  
  onHide() {
    // 页面隐藏时停止自动更新
    this.stopAutoUpdate()
  },
  
  onUnload() {
    // 页面卸载时清理资源
    this.stopAutoUpdate()
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onRefresh() {
      this.loadForexData()
    },
    
    async loadForexData() {
      try {
        this.loading = true
        uni.showLoading({ title: '加载中...' })
        
        // 从财富API获取外汇数据
        const majorPairs = getForexMajorPairs()
        const tradingPairs = getForexTradingPairs()
        
        const forexData = {
          majorPairs: majorPairs,
          tradingPairs: tradingPairs,
          marketStatus: '正常交易',
          lastUpdate: new Date().toISOString()
        }
        
        console.log('外汇数据:', forexData)
        
        // 更新数据
        this.forexData = forexData
        
        // 初始化图表
        await this.initChart(forexData)
        
        // 启动自动更新（简化版）
        this.startSimpleAutoUpdate()
        
        uni.hideLoading()
        this.loading = false
      } catch (error) {
        console.error('加载外汇数据失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
        this.loading = false
      }
    },
    
    // 启动简单自动更新
    startSimpleAutoUpdate() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
      }
      
      if (this.autoUpdate) {
        this.updateTimer = setInterval(() => {
          this.loadForexData()
        }, this.updateInterval)
        console.log('外汇数据自动更新已启动')
      }
    },
    
    // 停止自动更新
    stopAutoUpdate() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
        console.log('外汇数据自动更新已停止')
      }
    },
    
    // 切换自动更新
    toggleAutoUpdate() {
      this.autoUpdate = !this.autoUpdate
      if (this.autoUpdate) {
        this.startSimpleAutoUpdate()
        uni.showToast({ title: '自动更新已开启', icon: 'success' })
      } else {
        this.stopAutoUpdate()
        uni.showToast({ title: '自动更新已关闭', icon: 'none' })
      }
    },
    
    async initChart(forexData) {
      try {
        console.log('🎨 开始渲染外汇图表')
        
        // #ifdef APP-PLUS
        // App-Plus环境需要延迟初始化
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        // #endif
        
        // 提取汇率数据用于图表
        const chartData = forexData.majorPairs.map(pair => parseFloat(pair.price))
        const labels = forexData.majorPairs.map(pair => pair.code)
        
        // 使用简单图表工具渲染折线图
        drawSimpleLineChart('forexChart', {
          data: chartData,
          labels: labels,
          title: '主要货币对汇率',
          yAxisLabel: '汇率',
          colors: ['#FF6B35', '#34C759', '#FF9500', '#007AFF', '#AF52DE', '#FF2D92']
        })
        
        console.log('✅ 外汇图表渲染成功')
      } catch (error) {
        console.error('❌ 外汇图表渲染失败:', error)
        // 降级处理：显示文本信息
        this.showChartFallback('外汇汇率数据加载失败')
      }
    },
    
    // 图表降级处理
    showChartFallback(message) {
      const chartContainer = document.getElementById('forexChart')
      if (chartContainer) {
        chartContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #999; font-size: 14px;">
            ${message}
          </div>
        `
      }
    },
    
    onChartTouch(e) {
      console.log('图表触摸事件:', e)
    },
    
    formatTime(timeString) {
      const date = new Date(timeString)
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    
    onPairDetail(pair) {
      uni.navigateTo({
        url: `/pages/wealth/forex-detail?pair=${pair.code}&name=${pair.name}`
      })
    },
    
    onTrade(pair) {
      uni.navigateTo({
        url: `/pages/wealth/forex-trade?pair=${pair.code}&price=${pair.price}`
      })
    },
    
    onOpenTool(tool) {
      const toolMap = {
        calculator: '汇率计算器',
        converter: '货币转换',
        calendar: '财经日历',
        news: '外汇资讯'
      }
      uni.showToast({ title: `${toolMap[tool]}(开发中)`, icon: 'none' })
    },
    
    onFromCurrencyChange(e) {
      this.calculator.fromIndex = e.detail.value
    },
    
    onToCurrencyChange(e) {
      this.calculator.toIndex = e.detail.value
    },
    
    calculateExchange() {
      const amount = parseFloat(this.calculator.amount)
      if (!amount) {
        uni.showToast({ title: '请输入金额', icon: 'none' })
        return
      }
      
      // 模拟汇率计算（实际应该调用实时汇率API）
      const exchangeRates = {
        'CNY': { 'USD': 0.138, 'EUR': 0.127, 'JPY': 21.37, 'GBP': 0.110, 'AUD': 0.209, 'CAD': 0.188 },
        'USD': { 'CNY': 7.238, 'EUR': 0.920, 'JPY': 154.8, 'GBP': 0.794, 'AUD': 1.515, 'CAD': 1.365 },
        'EUR': { 'CNY': 7.880, 'USD': 1.087, 'JPY': 168.2, 'GBP': 0.863, 'AUD': 1.647, 'CAD': 1.484 },
        'JPY': { 'CNY': 0.047, 'USD': 0.006, 'EUR': 0.006, 'GBP': 0.005, 'AUD': 0.010, 'CAD': 0.009 },
        'GBP': { 'CNY': 9.121, 'USD': 1.260, 'EUR': 1.159, 'JPY': 194.9, 'AUD': 1.908, 'CAD': 1.720 },
        'AUD': { 'CNY': 4.785, 'USD': 0.660, 'EUR': 0.607, 'JPY': 102.1, 'GBP': 0.524, 'CAD': 0.901 },
        'CAD': { 'CNY': 5.320, 'USD': 0.733, 'EUR': 0.674, 'JPY': 113.4, 'GBP': 0.582, 'AUD': 1.110 }
      }
      
      const fromCurrency = this.currencyList[this.calculator.fromIndex]
      const toCurrency = this.currencyList[this.calculator.toIndex]
      
      if (fromCurrency === toCurrency) {
        this.calculator.result = {
          amount: amount.toFixed(2),
          rate: '1.0000'
        }
        return
      }
      
      const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1
      const result = amount * rate
      
      this.calculator.result = {
        amount: result.toFixed(2),
        rate: rate.toFixed(4)
      }
    }
  }
}
</script>

<style scoped>
.forex-page {
  background: #f5f7fb;
  min-height: 100vh;
}

/* 头部导航 */
.header {
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  height: 88rpx;
}

.nav-left, .nav-right {
  width: 60rpx;
  text-align: center;
}

.nav-icon {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-icon.active {
  color: #007aff;
}

.nav-icon:hover {
  color: #007aff;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 市场状态 */
.market-status {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.status-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #4caf50;
}

.status-indicator.closed .status-dot {
  background: #f44336;
}

.status-text {
  font-size: 22rpx;
  color: #666;
}

.last-update {
  font-size: 20rpx;
  color: #999;
}

/* 主要货币对 */
.major-pairs {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.pairs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.pairs-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.pairs-subtitle {
  font-size: 22rpx;
  color: #666;
}

.pairs-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.pair-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.pair-info {
  flex: 1;
}

.pair-code {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.pair-name {
  font-size: 22rpx;
  color: #666;
}

.pair-price {
  text-align: center;
  min-width: 120rpx;
}

.price-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.price-change {
  font-size: 20rpx;
}

.price-change.up {
  color: #4caf50;
}

.price-change.down {
  color: #f44336;
}

.pair-actions {
  min-width: 80rpx;
}

.trade-btn {
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.chart-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.chart-tabs {
  display: flex;
  gap: 12rpx;
}

.chart-tab {
  font-size: 20rpx;
  color: #666;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}

.chart-tab.active {
  background: #2e7d32;
  color: #fff;
}

.chart-container {
  height: 400rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

/* 工具区域 */
.tools-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.section-subtitle {
  font-size: 22rpx;
  color: #666;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.tool-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
}

.tool-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
  display: block;
}

.tool-text {
  font-size: 24rpx;
  color: #333;
}

/* 计算器 */
.calculator-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.calculator-form {
  margin-bottom: 30rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.picker-input {
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.calculate-btn {
  width: 100%;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  height: 80rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.calculator-result {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
}

.result-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.result-amount {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.result-currency {
  font-size: 24rpx;
  color: #666;
}

.result-rate {
  font-size: 22rpx;
  color: #666;
}

/* 知识区域 */
.knowledge-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.knowledge-item {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.knowledge-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.knowledge-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 风险提示 */
.risk-warning {
  background: #fff3cd;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  border-left: 6rpx solid #ffc107;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.warning-icon {
  font-size: 24rpx;
}

.warning-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #856404;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.warning-text {
  font-size: 22rpx;
  color: #856404;
  line-height: 1.4;
}
</style>

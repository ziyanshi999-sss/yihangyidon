<template>
  <view class="deposit-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">‹</text>
        </view>
        <text class="nav-title">存款产品</text>
        <view class="nav-right">
          <text class="nav-icon" @click="onRefresh">⟳</text>
        </view>
      </view>
    </view>

    <!-- 我的存款概览 -->
    <view class="overview-card">
      <view class="overview-header">
        <text class="overview-title">我的存款</text>
        <view class="amount-toggle" @click="toggleAmountVisibility">
          <text class="toggle-icon">{{ hideAmount ? '👁️' : '🙈' }}</text>
        </view>
      </view>
      <view class="amount-grid">
        <view class="amount-item">
          <text class="amount-label">活期存款</text>
          <text class="amount-value">{{ hideAmount ? '****' : '¥23,560.20' }}</text>
          <text class="amount-rate">年利率 0.35%</text>
        </view>
        <view class="amount-item">
          <text class="amount-label">定期存款</text>
          <text class="amount-value">{{ hideAmount ? '****' : '¥80,000.00' }}</text>
          <text class="amount-rate">平均利率 2.45%</text>
        </view>
        <view class="amount-item">
          <text class="amount-label">智能存款</text>
          <text class="amount-value">{{ hideAmount ? '****' : '¥8,520.32' }}</text>
          <text class="amount-rate">平均利率 3.50%</text>
        </view>
      </view>
    </view>

    <!-- 利率趋势图表 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">存款利率趋势</text>
        <text class="chart-subtitle">数据展示</text>
      </view>
      <view class="chart-container">
        <!-- #ifdef APP-PLUS -->
        <canvas 
          id="depositRateChart" 
          type="2d"
          class="chart-canvas"
          @touchstart="onChartTouch"
        ></canvas>
        <!-- #endif -->
        <!-- #ifndef APP-PLUS -->
        <canvas 
          canvas-id="depositRateChart" 
          class="chart-canvas"
          @touchstart="onChartTouch"
        ></canvas>
        <!-- #endif -->
      </view>
    </view>

    <!-- 定期存款产品 -->
    <view class="products-section">
      <view class="section-header">
        <text class="section-title">定期存款产品</text>
        <text class="section-subtitle">保本保息 · 收益稳定</text>
      </view>
      
      <view class="product-list">
        <view 
          class="product-item" 
          v-for="product in depositProducts" 
          :key="product.id"
          @click="onProductDetail(product)"
        >
          <view class="product-info">
            <view class="product-header">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-term">{{ product.term }}</text>
            </view>
            <text class="product-desc">起存金额 {{ product.minAmount.toLocaleString() }} 元</text>
            <view class="product-features">
              <text class="feature-tag">保本保息</text>
              <text class="feature-tag">提前支取</text>
              <text class="feature-tag">自动转存</text>
            </view>
          </view>
          <view class="product-rate">
            <text class="rate-value">{{ product.rate }}%</text>
            <text class="rate-label">年化利率</text>
            <button class="deposit-btn" @click.stop="onDepositNow(product)">立即存入</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 智能存款产品 -->
    <view class="products-section">
      <view class="section-header">
        <text class="section-title">智能存款产品</text>
        <text class="section-subtitle">灵活存取 · 收益更高</text>
      </view>
      
      <view class="smart-product-list">
        <view 
          class="smart-product-item" 
          v-for="product in smartProducts" 
          :key="product.id"
          @click="onProductDetail(product)"
        >
          <view class="smart-product-header">
            <text class="smart-product-name">{{ product.name }}</text>
            <text class="smart-product-rate">{{ product.rate }}%</text>
          </view>
          <view class="smart-product-details">
            <view class="detail-row">
              <text class="detail-label">期限</text>
              <text class="detail-value">{{ product.term }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">起存金额</text>
              <text class="detail-value">¥{{ product.minAmount.toLocaleString() }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">计息方式</text>
              <text class="detail-value">{{ product.interestMethod }}</text>
            </view>
          </view>
          <view class="smart-product-actions">
            <button class="detail-btn" @click.stop="onProductDetail(product)">查看详情</button>
            <button class="deposit-btn primary" @click.stop="onDepositNow(product)">存入</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 存款计算器 -->
    <view class="calculator-section">
      <view class="section-header">
        <text class="section-title">存款收益计算器</text>
        <text class="section-subtitle">预估收益 · 合理规划</text>
      </view>
      
      <view class="calculator-form">
        <view class="form-group">
          <text class="form-label">存款金额</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="calculator.amount"
            placeholder="请输入存款金额"
          />
        </view>
        <view class="form-group">
          <text class="form-label">存款期限</text>
          <picker 
            :value="calculator.termIndex" 
            :range="calculator.terms" 
            @change="onTermChange"
          >
            <view class="picker-input">
              {{ calculator.terms[calculator.termIndex] }}
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">年化利率</text>
          <input 
            class="form-input" 
            type="digit" 
            v-model="calculator.rate"
            placeholder="请输入年化利率"
          />
        </view>
        <button class="calculate-btn" @click="calculateInterest">计算收益</button>
      </view>
      
      <view class="calculator-result" v-if="calculator.result">
        <view class="result-item">
          <text class="result-label">到期本息</text>
          <text class="result-value">¥{{ calculator.result.total.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">利息收入</text>
          <text class="result-value">¥{{ calculator.result.interest.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">年化收益率</text>
          <text class="result-value">{{ calculator.result.annualRate }}%</text>
        </view>
      </view>
    </view>

    <!-- 存款知识 -->
    <view class="knowledge-section">
      <view class="section-header">
        <text class="section-title">存款知识</text>
        <text class="section-subtitle">了解存款 · 理性投资</text>
      </view>
      
      <view class="knowledge-list">
        <view class="knowledge-item" v-for="item in knowledgeList" :key="item.id">
          <text class="knowledge-title">{{ item.title }}</text>
          <text class="knowledge-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getDepositRates, getCachedData, clearAllCache } from '@/api/crawler.js'
import { generateDepositRateChart } from '@/api/chartGenerator.js'
import { initChart, createDepositRateChart } from '@/utils/echarts.js'

export default {
  data() {
    return {
      hideAmount: false,
      loading: false,
      depositData: null,
      chartInstance: null,
      showDataTable: false,
      depositProducts: [
        { id: 'd1', name: '整存整取', term: '3个月', minAmount: 1000, rate: 1.85 },
        { id: 'd2', name: '整存整取', term: '6个月', minAmount: 1000, rate: 2.05 },
        { id: 'd3', name: '整存整取', term: '1年', minAmount: 1000, rate: 2.10 },
        { id: 'd4', name: '整存整取', term: '2年', minAmount: 1000, rate: 2.60 },
        { id: 'd5', name: '整存整取', term: '3年', minAmount: 1000, rate: 2.95 },
        { id: 'd6', name: '整存整取', term: '5年', minAmount: 1000, rate: 3.20 }
      ],
      smartProducts: [
        { 
          id: 's1', 
          name: '智能存款A', 
          term: '1年', 
          minAmount: 50000, 
          rate: 3.50,
          interestMethod: '按月付息'
        },
        { 
          id: 's2', 
          name: '智能存款B', 
          term: '2年', 
          minAmount: 100000, 
          rate: 3.80,
          interestMethod: '到期付息'
        },
        { 
          id: 's3', 
          name: '智能存款C', 
          term: '3年', 
          minAmount: 200000, 
          rate: 4.20,
          interestMethod: '按季付息'
        }
      ],
      calculator: {
        amount: '',
        termIndex: 0,
        terms: ['3个月', '6个月', '1年', '2年', '3年', '5年'],
        rate: '',
        result: null
      },
      knowledgeList: [
        {
          id: 'k1',
          title: '什么是定期存款？',
          desc: '定期存款是银行与存款人双方在存款时事先约定期限、利率，到期后支取本息的存款。'
        },
        {
          id: 'k2',
          title: '提前支取如何计息？',
          desc: '提前支取按活期利率计息，建议根据资金使用计划选择合适的存款期限。'
        },
        {
          id: 'k3',
          title: '存款保险保障范围',
          desc: '单家银行50万元以内的存款享受存款保险保障，超出部分不享受保障。'
        }
      ]
    }
  },
  
  onLoad() {
    this.loadDepositData()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onRefresh() {
      this.loadDepositData()
    },
    
    toggleAmountVisibility() {
      this.hideAmount = !this.hideAmount
    },
    
    async loadDepositData() {
      try {
        this.loading = true
        uni.showLoading({ title: '加载中...' })
        
        // 使用模拟数据，无需清除缓存
        console.log('使用模拟数据模式')
        
        // 获取存款数据
        const depositData = await getCachedData('deposit_rates', getDepositRates)
        console.log('存款数据:', depositData)
        
        // 保存数据用于图表渲染
        this.depositData = depositData
        
        // 生成图表
        const chartConfig = await generateDepositRateChart(depositData)
        await this.initChart(chartConfig)
        
        uni.hideLoading()
        this.loading = false
      } catch (error) {
        console.error('加载存款数据失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
        this.loading = false
      }
    },
    
    async initChart(chartConfig) {
      try {
        console.log('🎨 开始渲染存款利率图表')
        
        // #ifdef APP-PLUS
        // App-Plus环境需要延迟初始化
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        // #endif
        
        // 直接使用大模型生成的配置
        const chart = await initChart('depositRateChart', chartConfig, this)
        if (chart) {
          console.log('✅ 存款利率图表渲染成功')
          this.chartInstance = chart
        } else {
          console.log('❌ 图表渲染失败')
        }
        
      } catch (error) {
        console.error('❌ 图表渲染失败:', error)
      }
    },
    
    onChartTouch(e) {
      console.log('图表触摸事件:', e)
    },
    
    onProductDetail(product) {
      uni.navigateTo({
        url: `/pages/wealth/deposit-detail?id=${product.id}&type=${product.name}`
      })
    },
    
    onDepositNow(product) {
      uni.navigateTo({
        url: `/pages/wealth/deposit-form?productId=${product.id}&productName=${product.name}&rate=${product.rate}`
      })
    },
    
    onTermChange(e) {
      this.calculator.termIndex = e.detail.value
    },
    
    calculateInterest() {
      const amount = parseFloat(this.calculator.amount)
      const rate = parseFloat(this.calculator.rate)
      const termIndex = this.calculator.termIndex
      
      if (!amount || !rate) {
        uni.showToast({ title: '请输入完整信息', icon: 'none' })
        return
      }
      
      // 计算期限（年）
      const termYears = [0.25, 0.5, 1, 2, 3, 5][termIndex]
      const interest = amount * rate / 100 * termYears
      const total = amount + interest
      const annualRate = (interest / amount / termYears) * 100
      
      this.calculator.result = {
        total: total.toFixed(2),
        interest: interest.toFixed(2),
        annualRate: annualRate.toFixed(2)
      }
    }
  }
}
</script>

<style scoped>
.deposit-page {
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
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 概览卡片 */
.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  color: #fff;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.overview-title {
  font-size: 32rpx;
  font-weight: 600;
}

.amount-toggle {
  padding: 10rpx;
}

.toggle-icon {
  font-size: 28rpx;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.amount-item {
  text-align: center;
}

.amount-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.amount-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.amount-rate {
  display: block;
  font-size: 22rpx;
  opacity: 0.7;
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

.chart-subtitle {
  font-size: 22rpx;
  color: #666;
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

/* 产品区域 */
.products-section {
  margin: 20rpx;
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

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.product-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.product-info {
  flex: 1;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.product-term {
  font-size: 22rpx;
  color: #666;
  background: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.product-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.product-features {
  display: flex;
  gap: 8rpx;
}

.feature-tag {
  font-size: 20rpx;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.product-rate {
  text-align: right;
  min-width: 160rpx;
}

.rate-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #e53935;
  display: block;
  margin-bottom: 4rpx;
}

.rate-label {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.deposit-btn {
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
}

.deposit-btn.primary {
  background: #1976d2;
}

/* 智能存款产品 */
.smart-product-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.smart-product-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.smart-product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.smart-product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.smart-product-rate {
  font-size: 32rpx;
  font-weight: 600;
  color: #e53935;
}

.smart-product-details {
  margin-bottom: 20rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
}

.detail-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.smart-product-actions {
  display: flex;
  gap: 12rpx;
}

.detail-btn {
  flex: 1;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
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
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  font-size: 24rpx;
  color: #666;
}

.result-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
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
</style>

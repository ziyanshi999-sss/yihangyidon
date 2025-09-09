<template>
  <view class="product-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">‹</text>
        </view>
        <text class="nav-title">理财产品</text>
        <view class="nav-right">
          <text class="nav-icon" @click="onRefresh">⟳</text>
        </view>
      </view>
    </view>

    <!-- 市场概览 -->
    <view class="market-overview">
      <view class="overview-header">
        <text class="overview-title">理财市场概览</text>
        <text class="overview-subtitle">实时数据</text>
      </view>
      <view class="overview-stats">
        <view class="stat-item">
          <text class="stat-value">{{ marketData.totalAUM }}</text>
          <text class="stat-label">总规模(亿元)</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ marketData.avgYield }}%</text>
          <text class="stat-label">平均收益率</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ marketData.productCount }}</text>
          <text class="stat-label">在售产品</text>
        </view>
      </view>
    </view>

    <!-- 收益率趋势图表 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">理财产品收益率趋势</text>
        <view class="chart-tabs">
          <text 
            class="chart-tab" 
            :class="{ active: chartPeriod === '7d' }"
            @click="chartPeriod = '7d'"
          >7天</text>
          <text 
            class="chart-tab" 
            :class="{ active: chartPeriod === '30d' }"
            @click="chartPeriod = '30d'"
          >30天</text>
          <text 
            class="chart-tab" 
            :class="{ active: chartPeriod === '90d' }"
            @click="chartPeriod = '90d'"
          >90天</text>
        </view>
      </view>
      <view class="chart-container">
        <canvas 
          canvas-id="yieldChart" 
          class="chart-canvas"
          @touchstart="onChartTouch"
        ></canvas>
      </view>
    </view>

    <!-- 产品分类筛选 -->
    <view class="filter-section">
      <scroll-view class="filter-scroll" scroll-x="true">
        <view class="filter-list">
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            全部
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'low' }"
            @click="activeFilter = 'low'"
          >
            低风险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'medium' }"
            @click="activeFilter = 'medium'"
          >
            中风险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'high' }"
            @click="activeFilter = 'high'"
          >
            高风险
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 产品列表 -->
    <view class="products-section">
      <view 
        class="product-category" 
        v-for="category in filteredCategories" 
        :key="category.name"
      >
        <view class="category-header">
          <text class="category-title">{{ category.name }}</text>
          <text class="category-count">{{ category.products.length }}款产品</text>
        </view>
        
        <view class="product-list">
          <view 
            class="product-item" 
            v-for="product in category.products" 
            :key="product.id"
            @click="onProductDetail(product)"
          >
            <view class="product-header">
              <view class="product-info">
                <text class="product-name">{{ product.name }}</text>
                <view class="product-tags">
                  <text class="risk-tag" :class="product.risk">{{ product.risk }}风险</text>
                  <text class="type-tag">{{ product.type }}</text>
                </view>
              </view>
              <view class="product-yield">
                <text class="yield-value">{{ product.yield }}%</text>
                <text class="yield-label">近七日年化</text>
              </view>
            </view>
            
            <view class="product-details">
              <view class="detail-item">
                <text class="detail-label">期限</text>
                <text class="detail-value">{{ product.term }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">起投金额</text>
                <text class="detail-value">¥{{ product.minAmount.toLocaleString() }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品类型</text>
                <text class="detail-value">{{ product.type }}</text>
              </view>
            </view>
            
            <view class="product-actions">
              <button class="detail-btn" @click.stop="onProductDetail(product)">查看详情</button>
              <button class="buy-btn" @click.stop="onProductBuy(product)">立即申购</button>
            </view>
          </view>
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
        <text class="warning-text">• 理财产品不保证本金和收益，投资有风险</text>
        <text class="warning-text">• 请根据自身风险承受能力选择合适的产品</text>
        <text class="warning-text">• 过往业绩不代表未来表现</text>
        <text class="warning-text">• 投资前请仔细阅读产品说明书</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getWealthProducts, getCachedData } from '@/api/crawler.js'
import { generateWealthProductChart } from '@/api/chartGenerator.js'
import { initChart, createWealthProductChart } from '@/utils/echarts.js'

export default {
  data() {
    return {
      loading: false,
      activeFilter: 'all',
      chartPeriod: '7d',
      productData: null,
      chartInstance: null,
      marketData: {
        totalAUM: '125,000',
        avgYield: 3.45,
        productCount: 156
      },
      productCategories: [
        {
          name: '稳健型',
          products: [
            { 
              id: 'w1', 
              name: '稳健优选第68期', 
              risk: '低', 
              term: '90天', 
              minAmount: 10000, 
              yield: 3.20, 
              type: '净值型' 
            },
            { 
              id: 'w2', 
              name: '灵活理财T+1', 
              risk: '低', 
              term: '开放式', 
              minAmount: 1000, 
              yield: 2.65, 
              type: '货币型' 
            },
            { 
              id: 'w3', 
              name: '安心宝30天', 
              risk: '低', 
              term: '30天', 
              minAmount: 5000, 
              yield: 2.85, 
              type: '固定收益' 
            }
          ]
        },
        {
          name: '平衡型',
          products: [
            { 
              id: 'w4', 
              name: '进取增强半年期', 
              risk: '中', 
              term: '180天', 
              minAmount: 10000, 
              yield: 4.10, 
              type: '混合型' 
            },
            { 
              id: 'w5', 
              name: '成长优选一年期', 
              risk: '中', 
              term: '365天', 
              minAmount: 20000, 
              yield: 4.50, 
              type: '权益型' 
            }
          ]
        },
        {
          name: '进取型',
          products: [
            { 
              id: 'w6', 
              name: '价值发现两年期', 
              risk: '高', 
              term: '730天', 
              minAmount: 50000, 
              yield: 5.80, 
              type: '权益型' 
            },
            { 
              id: 'w7', 
              name: '科技成长三年期', 
              risk: '高', 
              term: '1095天', 
              minAmount: 100000, 
              yield: 6.20, 
              type: '权益型' 
            }
          ]
        }
      ]
    }
  },
  
  computed: {
    filteredCategories() {
      if (this.activeFilter === 'all') {
        return this.productCategories
      }
      
      return this.productCategories.map(category => ({
        ...category,
        products: category.products.filter(product => {
          const riskMap = { '低': 'low', '中': 'medium', '高': 'high' }
          return riskMap[product.risk] === this.activeFilter
        })
      })).filter(category => category.products.length > 0)
    }
  },
  
  onLoad() {
    this.loadProductData()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onRefresh() {
      this.loadProductData()
    },
    
    async loadProductData() {
      try {
        this.loading = true
        uni.showLoading({ title: '加载中...' })
        
        // 获取理财产品数据
        const productData = await getCachedData('wealth_products', getWealthProducts)
        console.log('理财产品数据:', productData)
        
        // 保存数据用于图表渲染
        this.productData = productData
        
        // 更新市场数据
        if (productData.marketTrend) {
          this.marketData = {
            totalAUM: (productData.marketTrend.totalAUM / 100000000).toFixed(0),
            avgYield: productData.marketTrend.avgYield,
            productCount: productData.categories.reduce((sum, cat) => sum + cat.products.length, 0)
          }
        }
        
        // 生成图表
        const chartConfig = await generateWealthProductChart(productData)
        this.initChart(chartConfig)
        
        uni.hideLoading()
        this.loading = false
      } catch (error) {
        console.error('加载理财产品数据失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
        this.loading = false
      }
    },
    
    initChart(chartConfig) {
      try {
        console.log('开始渲染理财产品图表')
        
        // 使用ECharts工具类渲染图表
        const chart = initChart('yieldChart', chartConfig, this)
        
        if (chart) {
          console.log('理财产品图表渲染成功')
          this.chartInstance = chart
        } else {
          console.log('图表渲染失败，使用默认配置')
          // 如果AI生成的配置失败，使用本地配置
          const defaultConfig = createWealthProductChart(this.productData)
          this.chartInstance = initChart('yieldChart', defaultConfig, this)
        }
      } catch (error) {
        console.error('图表渲染失败:', error)
        // 使用默认配置作为备用
        const defaultConfig = createWealthProductChart(this.productData)
        this.chartInstance = initChart('yieldChart', defaultConfig, this)
      }
    },
    
    onChartTouch(e) {
      console.log('图表触摸事件:', e)
    },
    
    onProductDetail(product) {
      uni.navigateTo({
        url: `/pages/wealth/product-detail?id=${product.id}&name=${product.name}`
      })
    },
    
    onProductBuy(product) {
      uni.navigateTo({
        url: `/pages/wealth/product-buy?productId=${product.id}&productName=${product.name}&yield=${product.yield}&minAmount=${product.minAmount}`
      })
    }
  }
}
</script>

<style scoped>
.product-page {
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

/* 市场概览 */
.market-overview {
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

.overview-subtitle {
  font-size: 22rpx;
  opacity: 0.8;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  opacity: 0.8;
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
  gap: 16rpx;
}

.chart-tab {
  font-size: 22rpx;
  color: #666;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
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

/* 筛选区域 */
.filter-section {
  margin: 0 20rpx 20rpx;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: flex;
  gap: 16rpx;
}

.filter-item {
  flex-shrink: 0;
  padding: 16rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.filter-item.active {
  background: #2e7d32;
  color: #fff;
}

/* 产品区域 */
.products-section {
  padding: 0 20rpx;
}

.product-category {
  margin-bottom: 30rpx;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.category-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.category-count {
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
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.product-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.product-tags {
  display: flex;
  gap: 8rpx;
}

.risk-tag {
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  color: #fff;
}

.risk-tag.低 {
  background: #4caf50;
}

.risk-tag.中 {
  background: #ff9800;
}

.risk-tag.高 {
  background: #f44336;
}

.type-tag {
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  background: #e3f2fd;
  color: #1976d2;
}

.product-yield {
  text-align: right;
  min-width: 120rpx;
}

.yield-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #e53935;
  display: block;
  margin-bottom: 4rpx;
}

.yield-label {
  font-size: 20rpx;
  color: #666;
}

.product-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 20rpx;
  color: #666;
  display: block;
  margin-bottom: 4rpx;
}

.detail-value {
  font-size: 22rpx;
  color: #333;
  font-weight: 500;
}

.product-actions {
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

.buy-btn {
  flex: 1;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
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

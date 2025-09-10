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
          :id="'yieldChart'"
          :canvas-id="'yieldChart'"
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

    <!-- 快速筛选 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <text 
          class="filter-tab" 
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >全部</text>
        <text 
          class="filter-tab" 
          :class="{ active: activeFilter === 'low' }"
          @click="setFilter('low')"
        >低风险</text>
        <text 
          class="filter-tab" 
          :class="{ active: activeFilter === 'medium' }"
          @click="setFilter('medium')"
        >中风险</text>
        <text 
          class="filter-tab" 
          :class="{ active: activeFilter === 'high' }"
          @click="setFilter('high')"
        >高风险</text>
      </view>
      
      <view class="sort-options">
        <picker 
          :value="sortIndex" 
          :range="sortOptions" 
          range-key="label"
          @change="onSortChange"
        >
          <view class="sort-picker">
            <text class="sort-label">排序：</text>
            <text class="sort-value">{{ sortOptions[sortIndex].label }}</text>
            <text class="sort-arrow">▼</text>
          </view>
        </picker>
      </view>
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

    <!-- 产品详情弹窗 -->
    <view class="product-detail-modal" v-if="showDetailModal" @tap="closeDetailModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedProduct.name }}</text>
          <text class="modal-close" @tap="closeDetailModal">×</text>
        </view>
        <view class="modal-body">
          <view class="product-overview">
            <view class="overview-item">
              <text class="overview-label">产品类型</text>
              <text class="overview-value">{{ selectedProduct.type }}</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">风险等级</text>
              <text class="overview-value risk" :class="selectedProduct.risk">{{ selectedProduct.risk }}风险</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">预期收益率</text>
              <text class="overview-value yield">{{ selectedProduct.yield }}%</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">投资期限</text>
              <text class="overview-value">{{ selectedProduct.term }}</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">起投金额</text>
              <text class="overview-value">¥{{ selectedProduct.minAmount?.toLocaleString() }}</text>
            </view>
          </view>
          
          <view class="product-description">
            <text class="desc-title">产品说明</text>
            <text class="desc-content">{{ selectedProduct.description || '本产品为银行理财产品，具有较好的流动性和收益性，适合稳健型投资者。' }}</text>
          </view>
          
          <view class="risk-warning">
            <text class="warning-title">风险提示</text>
            <text class="warning-content">理财产品不保证本金和收益，投资有风险，请根据自身风险承受能力谨慎投资。</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="closeDetailModal">关闭</button>
          <button class="modal-btn primary" @tap="onProductBuy(selectedProduct)">立即申购</button>
        </view>
      </view>
    </view>

    <!-- 申购确认弹窗 -->
    <view class="purchase-modal" v-if="showPurchaseModal" @tap="closePurchaseModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">确认申购</text>
          <text class="modal-close" @tap="closePurchaseModal">×</text>
        </view>
        <view class="modal-body">
          <view class="purchase-info">
            <view class="info-item">
              <text class="info-label">产品名称</text>
              <text class="info-value">{{ purchaseProduct.name }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">预期收益率</text>
              <text class="info-value yield">{{ purchaseProduct.yield }}%</text>
            </view>
            <view class="info-item">
              <text class="info-label">投资期限</text>
              <text class="info-value">{{ purchaseProduct.term }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">申购金额</text>
              <input 
                class="amount-input" 
                v-model="purchaseAmount" 
                type="number" 
                placeholder="请输入申购金额"
              />
            </view>
            <view class="info-item">
              <text class="info-label">预计收益</text>
              <text class="info-value expected">¥{{ calculateExpectedReturn() }}</text>
            </view>
          </view>
          
          <view class="agreement-section">
            <view class="agreement-item" @tap="toggleAgreement('risk')">
              <text class="agreement-check" :class="{ checked: agreements.risk }">✓</text>
              <text class="agreement-text">我已阅读并同意《理财产品风险揭示书》</text>
            </view>
            <view class="agreement-item" @tap="toggleAgreement('terms')">
              <text class="agreement-check" :class="{ checked: agreements.terms }">✓</text>
              <text class="agreement-text">我已阅读并同意《理财产品说明书》</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="closePurchaseModal">取消</button>
          <button 
            class="modal-btn primary" 
            :class="{ disabled: !canPurchase }"
            @tap="onConfirmPurchase"
          >确认申购</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getWealthProductCategories, purchaseWealthProduct, getCurrentUserId, initWealthDataSync } from '@/api/wealth.js'
import { initUCharts, createWealthProductChart } from '@/utils/ucharts.js'

export default {
  data() {
    return {
      loading: false,
      activeFilter: 'all',
      chartPeriod: '7d',
      productData: null,
      chartInstance: null,
      
      // 筛选和排序
      sortIndex: 0,
      sortOptions: [
        { label: '收益率从高到低', value: 'yield_desc' },
        { label: '收益率从低到高', value: 'yield_asc' },
        { label: '起投金额从低到高', value: 'amount_asc' },
        { label: '期限从短到长', value: 'term_asc' }
      ],
      
      // 弹窗控制
      showDetailModal: false,
      showPurchaseModal: false,
      selectedProduct: {},
      purchaseProduct: {},
      purchaseAmount: '',
      
      // 协议确认
      agreements: {
        risk: false,
        terms: false
      },
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
      let categories = this.productCategories
      
      // 按风险等级筛选
      if (this.activeFilter !== 'all') {
        categories = categories.map(category => ({
          ...category,
          products: category.products.filter(product => {
            const riskMap = { '低': 'low', '中': 'medium', '高': 'high' }
            return riskMap[product.risk] === this.activeFilter
          })
        })).filter(category => category.products.length > 0)
      }
      
      // 排序
      const sortOption = this.sortOptions[this.sortIndex]
      categories = categories.map(category => ({
        ...category,
        products: this.sortProducts(category.products, sortOption.value)
      }))
      
      return categories
    },
    
    canPurchase() {
      return this.purchaseAmount && 
             parseFloat(this.purchaseAmount) >= (this.purchaseProduct.minAmount || 0) &&
             this.agreements.risk && 
             this.agreements.terms
    }
  },
  
  onLoad() {
    this.loadProductData()
    this.initDataSync()
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
        
        // 从财富API获取理财产品数据
        const productCategories = getWealthProductCategories()
        console.log('理财产品数据:', productCategories)
        
        // 保存数据用于图表渲染
        this.productCategories = productCategories
        
        // 更新市场数据
        const totalProducts = productCategories.reduce((sum, cat) => sum + cat.products.length, 0)
        const avgYield = productCategories.reduce((sum, cat) => {
          const categoryAvg = cat.products.reduce((catSum, product) => catSum + product.yield, 0) / cat.products.length
          return sum + categoryAvg
        }, 0) / productCategories.length
        
        this.marketData = {
          totalAUM: '1,250',
          avgYield: avgYield.toFixed(2),
          productCount: totalProducts
        }
        
        // 初始化图表
        this.initChart(productCategories)
        
        uni.hideLoading()
        this.loading = false
      } catch (error) {
        console.error('加载理财产品数据失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
        this.loading = false
      }
    },
    
    async initChart(chartConfig) {
      try {
        console.log('🎨 开始渲染理财产品图表')
        
        // #ifdef APP-PLUS
        // App-Plus环境需要延迟初始化
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        // #endif
        
        // 使用uCharts渲染图表
        const option = createWealthProductChart(this.productCategories)
        this.chartInstance = await initUCharts('yieldChart', option, this)
        
        if (this.chartInstance) {
          console.log('✅ 理财产品图表渲染成功 (uCharts)')
        } else {
          console.warn('❌ uCharts图表渲染失败')
        }
        
      } catch (error) {
        console.error('❌ 图表渲染失败:', error)
      }
    },
    
    onChartTouch(e) {
      console.log('图表触摸事件:', e)
    },
    
    // 筛选和排序方法
    setFilter(filter) {
      this.activeFilter = filter
    },
    
    onSortChange(e) {
      this.sortIndex = e.detail.value
    },
    
    sortProducts(products, sortType) {
      const sorted = [...products]
      
      switch (sortType) {
        case 'yield_desc':
          return sorted.sort((a, b) => b.yield - a.yield)
        case 'yield_asc':
          return sorted.sort((a, b) => a.yield - b.yield)
        case 'amount_asc':
          return sorted.sort((a, b) => a.minAmount - b.minAmount)
        case 'term_asc':
          return sorted.sort((a, b) => this.parseTerm(a.term) - this.parseTerm(b.term))
        default:
          return sorted
      }
    },
    
    parseTerm(term) {
      // 将期限转换为天数进行比较
      if (term.includes('天')) {
        return parseInt(term)
      } else if (term.includes('月')) {
        return parseInt(term) * 30
      } else if (term.includes('年')) {
        return parseInt(term) * 365
      } else if (term === '开放式') {
        return 0
      }
      return 999999 // 其他情况排在最后
    },
    
    // 产品详情和申购
    onProductDetail(product) {
      this.selectedProduct = product
      this.showDetailModal = true
    },
    
    onProductBuy(product) {
      this.purchaseProduct = product
      this.purchaseAmount = ''
      this.agreements.risk = false
      this.agreements.terms = false
      this.showPurchaseModal = true
    },
    
    // 弹窗控制方法
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedProduct = {}
    },
    
    closePurchaseModal() {
      this.showPurchaseModal = false
      this.purchaseProduct = {}
      this.purchaseAmount = ''
      this.agreements.risk = false
      this.agreements.terms = false
    },
    
    // 协议确认
    toggleAgreement(type) {
      this.agreements[type] = !this.agreements[type]
    },
    
    // 计算预期收益
    calculateExpectedReturn() {
      if (!this.purchaseAmount || !this.purchaseProduct.yield) {
        return '0.00'
      }
      
      const amount = parseFloat(this.purchaseAmount)
      const yieldRate = this.purchaseProduct.yield / 100
      let term = 1 // 默认1年
      
      // 根据期限计算年数
      if (this.purchaseProduct.term.includes('天')) {
        const days = parseInt(this.purchaseProduct.term)
        term = days / 365
      } else if (this.purchaseProduct.term.includes('月')) {
        const months = parseInt(this.purchaseProduct.term)
        term = months / 12
      } else if (this.purchaseProduct.term.includes('年')) {
        term = parseInt(this.purchaseProduct.term)
      }
      
      const expectedReturn = amount * yieldRate * term
      return Math.round(expectedReturn * 100) / 100
    },
    
    // 确认申购
    onConfirmPurchase() {
      if (!this.canPurchase) {
        uni.showToast({
          title: '请完善申购信息并同意相关协议',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '确认申购',
        content: `确定要申购${this.purchaseAmount}元的${this.purchaseProduct.name}吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.processPurchase()
          }
        }
      })
    },
    
    // 处理申购业务
    async processPurchase() {
      uni.showLoading({ title: '申购处理中...' })
      
      try {
        const userId = getCurrentUserId()
        const amount = parseFloat(this.purchaseAmount)
        
        // 调用API购买理财产品
        const success = purchaseWealthProduct(userId, this.purchaseProduct, amount)
        
        setTimeout(async () => {
          uni.hideLoading()
          
          if (success) {
            uni.showToast({
              title: '申购成功',
              icon: 'success'
            })
            
            this.closePurchaseModal()
            
            // 刷新数据
            await this.loadProductData()
            
            // 触发数据更新事件
            uni.$emit('purchaseSuccess', { product: this.purchaseProduct.name, amount })
          } else {
            uni.showToast({
              title: '申购失败，余额不足或系统错误',
              icon: 'none'
            })
          }
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '申购失败，请重试',
          icon: 'none'
        })
        console.error('申购处理失败:', error)
      }
    },
    
    // 初始化数据同步
    initDataSync() {
      // 初始化财富数据同步
      initWealthDataSync()
      
      // 监听余额更新事件
      uni.$on('balanceUpdated', (data) => {
        console.log('理财页面收到余额更新事件:', data)
        // 可以在这里更新页面显示
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
  height: 300rpx;
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

/* 筛选和排序 */
.filter-section {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.filter-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.filter-tab {
  padding: 12rpx 20rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;
  min-width: 80rpx;
}

.filter-tab.active {
  background: #2e7d32;
  color: #fff;
}

.sort-options {
  display: flex;
  justify-content: flex-end;
}

.sort-picker {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.sort-label {
  font-size: 22rpx;
  color: #666;
}

.sort-value {
  font-size: 22rpx;
  color: #333;
}

.sort-arrow {
  font-size: 20rpx;
  color: #999;
}

/* 弹窗样式 */
.product-detail-modal,
.purchase-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 2rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.modal-btn.secondary {
  background: #f5f5f5;
  color: #666;
}

.modal-btn.primary {
  background: #2e7d32;
  color: #fff;
}

.modal-btn.disabled {
  background: #ccc;
  color: #999;
}

/* 产品详情弹窗 */
.product-overview {
  margin-bottom: 24rpx;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.overview-item:last-child {
  border-bottom: none;
}

.overview-label {
  font-size: 24rpx;
  color: #666;
}

.overview-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.overview-value.risk.低 {
  color: #4caf50;
}

.overview-value.risk.中 {
  color: #ff9800;
}

.overview-value.risk.高 {
  color: #f44336;
}

.overview-value.yield {
  color: #e53935;
  font-weight: 700;
}

.product-description {
  margin-bottom: 24rpx;
}

.desc-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.desc-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.risk-warning {
  background: #fff3cd;
  border-radius: 12rpx;
  padding: 16rpx;
  border-left: 4rpx solid #ffc107;
}

.warning-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #856404;
  margin-bottom: 8rpx;
  display: block;
}

.warning-content {
  font-size: 22rpx;
  color: #856404;
  line-height: 1.4;
}

/* 申购弹窗 */
.purchase-info {
  margin-bottom: 24rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 24rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.info-value.yield {
  color: #e53935;
  font-weight: 700;
}

.info-value.expected {
  color: #2e7d32;
  font-weight: 700;
}

.amount-input {
  width: 200rpx;
  height: 60rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 12rpx;
  font-size: 24rpx;
  text-align: right;
}

.amount-input:focus {
  border-color: #2e7d32;
}

.agreement-section {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 16rpx;
}

.agreement-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.agreement-item:last-child {
  margin-bottom: 0;
}

.agreement-check {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #fff;
  background: #fff;
}

.agreement-check.checked {
  background: #2e7d32;
  border-color: #2e7d32;
}

.agreement-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}
</style>


<template>
  <view class="product-page">
    <!-- 市场概览 -->
    <view class="market-overview">
      <view class="overview-header">
        <text class="overview-title">理财市场概览</text>
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

    <!-- 产品类型收益率对比混合图表 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">产品类型收益率对比</text>
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
            @click="setFilter('all')"
          >
            全部
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'low' }"
            @click="setFilter('low')"
          >
            低风险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'medium' }"
            @click="setFilter('medium')"
          >
            中风险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'high' }"
            @click="setFilter('high')"
          >
            高风险
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 排序选项 -->
    <view class="filter-section">
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

    <!-- 申购确认弹窗 - 全新设计 -->
    <view class="purchase-modal-new" v-if="showPurchaseModal" @tap="closePurchaseModal">
      <view class="modal-backdrop"></view>
      <view class="modal-container" @tap.stop>
        <!-- 弹窗头部 -->
        <view class="modal-header-new">
          <view class="header-icon">
            <text class="icon-text">💰</text>
          </view>
          <view class="header-content">
            <text class="modal-title-new">确认申购</text>
            <text class="modal-subtitle">请确认您的投资信息</text>
          </view>
          <view class="close-btn" @tap="closePurchaseModal">
            <text class="close-icon">×</text>
          </view>
        </view>

        <!-- 产品信息卡片 -->
        <view class="product-card">
          <view class="product-header">
            <view class="product-icon">
              <text class="product-icon-text">{{ getProductIcon(purchaseProduct.type) }}</text>
            </view>
            <view class="product-info">
              <text class="product-name">{{ purchaseProduct.name }}</text>
              <text class="product-type">{{ purchaseProduct.type }}</text>
            </view>
            <view class="product-yield">
              <text class="yield-value">{{ purchaseProduct.yield }}%</text>
              <text class="yield-label">预期年化</text>
            </view>
          </view>
          
          <view class="product-details">
            <view class="detail-row">
              <text class="detail-label">投资期限</text>
              <text class="detail-value">{{ purchaseProduct.term }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">起投金额</text>
              <text class="detail-value">¥{{ purchaseProduct.minAmount || 1000 }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">风险等级</text>
              <view class="risk-level" :class="'risk-' + (purchaseProduct.risk || 'low')">
                <text class="risk-text">{{ getRiskText(purchaseProduct.risk) }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 申购金额输入 -->
        <view class="amount-section">
          <view class="section-title">
            <text class="title-text">申购金额</text>
            <text class="title-desc">请输入您要投资的金额</text>
          </view>
          <view class="amount-input-container">
            <text class="currency-symbol">¥</text>
            <input 
              class="amount-input-new" 
              v-model="purchaseAmount" 
              type="number" 
              placeholder="请输入申购金额"
              @input="onAmountInput"
            />
            <view class="amount-suggestions">
              <view 
                class="suggestion-item" 
                v-for="suggestion in amountSuggestions" 
                :key="suggestion"
                @tap="setAmount(suggestion)"
              >
                <text class="suggestion-text">{{ suggestion }}万</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 收益预览 -->
        <view class="return-preview" v-if="purchaseAmount">
          <view class="preview-header">
            <text class="preview-title">收益预览</text>
          </view>
          <view class="preview-content">
            <view class="return-item">
              <text class="return-label">预计收益</text>
              <text class="return-value">¥{{ calculateExpectedReturn() }}</text>
            </view>
            <view class="return-item">
              <text class="return-label">到期本息</text>
              <text class="return-value total">¥{{ calculateTotalReturn() }}</text>
            </view>
          </view>
        </view>

        <!-- 协议确认 -->
        <view class="agreement-section-new">
          <view class="agreement-header">
            <text class="agreement-title">风险提示与协议</text>
          </view>
          <view class="agreement-list">
            <view class="agreement-item-new" @tap="toggleAgreement('risk')">
              <view class="agreement-check-new" :class="{ checked: agreements.risk }">
                <text class="check-icon-new" v-if="agreements.risk">✓</text>
              </view>
              <view class="agreement-content">
                <text class="agreement-text-new">我已阅读并同意</text>
                <text class="agreement-link">《理财产品风险揭示书》</text>
              </view>
            </view>
            <view class="agreement-item-new" @tap="toggleAgreement('terms')">
              <view class="agreement-check-new" :class="{ checked: agreements.terms }">
                <text class="check-icon-new" v-if="agreements.terms">✓</text>
              </view>
              <view class="agreement-content">
                <text class="agreement-text-new">我已阅读并同意</text>
                <text class="agreement-link">《理财产品说明书》</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 弹窗底部按钮 -->
        <view class="modal-footer-new">
          <button class="btn-cancel" @tap="closePurchaseModal">
            <text class="btn-text">取消</text>
          </button>
          <button 
            class="btn-confirm" 
            :class="{ disabled: !canPurchase, loading: isProcessing }"
            @tap="onConfirmPurchase"
            :disabled="!canPurchase || isProcessing"
          >
            <text class="btn-text" v-if="!isProcessing">确认申购</text>
            <text class="btn-text" v-else>处理中...</text>
          </button>
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
      
      // 新弹窗相关
      isProcessing: false,
      amountSuggestions: [1, 5, 10, 20, 50],
      marketData: {
        totalAUM: '125,000',
        avgYield: 3.45,
        productCount: 156
      },
      productCategories: []
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
      const hasAmount = this.purchaseAmount && parseFloat(this.purchaseAmount) > 0
      const meetsMinAmount = parseFloat(this.purchaseAmount) >= (this.purchaseProduct.minAmount || 0)
      const riskAgreed = this.agreements.risk
      const termsAgreed = this.agreements.terms
      
      console.log('申购条件检查:', {
        hasAmount,
        meetsMinAmount,
        riskAgreed,
        termsAgreed,
        purchaseAmount: this.purchaseAmount,
        minAmount: this.purchaseProduct.minAmount
      })
      
      return hasAmount && meetsMinAmount && riskAgreed && termsAgreed
    }
  },
  
  onLoad() {
    this.loadProductData()
    this.initDataSync()
  },
  
  methods: {
    
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
      console.log('筛选条件变更:', filter)
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
    
    // 新弹窗相关方法
    getProductIcon(type) {
      const iconMap = {
        '稳健型': '🛡️',
        '平衡型': '⚖️',
        '成长型': '📈',
        '进取型': '🚀',
        '保本型': '🔒'
      }
      return iconMap[type] || '💰'
    },
    
    getRiskText(risk) {
      const riskMap = {
        'low': '低风险',
        'medium': '中风险',
        'high': '高风险'
      }
      return riskMap[risk] || '低风险'
    },
    
    onAmountInput() {
      // 输入金额时的处理
      console.log('申购金额输入:', this.purchaseAmount)
    },
    
    setAmount(amount) {
      this.purchaseAmount = (amount * 10000).toString()
    },
    
    calculateTotalReturn() {
      if (!this.purchaseAmount || !this.purchaseProduct.yield) {
        return '0.00'
      }
      const amount = parseFloat(this.purchaseAmount)
      const expectedReturn = this.calculateExpectedReturn()
      return (amount + parseFloat(expectedReturn)).toFixed(2)
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
        // 提供更详细的错误提示
        let errorMessage = '请完善以下信息：'
        const errors = []
        
        if (!this.purchaseAmount || parseFloat(this.purchaseAmount) <= 0) {
          errors.push('请输入申购金额')
        } else if (parseFloat(this.purchaseAmount) < (this.purchaseProduct.minAmount || 0)) {
          errors.push(`申购金额不能少于${this.purchaseProduct.minAmount || 0}元`)
        }
        
        if (!this.agreements.risk) {
          errors.push('请同意风险揭示书')
        }
        
        if (!this.agreements.terms) {
          errors.push('请同意产品说明书')
        }
        
        errorMessage += errors.join('、')
        
        uni.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
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
      this.isProcessing = true
      uni.showLoading({ title: '申购处理中...' })
      
      try {
        const userId = getCurrentUserId()
        const amount = parseFloat(this.purchaseAmount)
        
        // 调用API购买理财产品
        const success = purchaseWealthProduct(userId, this.purchaseProduct, amount)
        
        setTimeout(async () => {
          uni.hideLoading()
          this.isProcessing = false
          
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
        this.isProcessing = false
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
  padding: 8rpx;
  border-radius: 8rpx;
  transition: background-color 0.2s ease;
}

.agreement-item:last-child {
  margin-bottom: 0;
}

.agreement-item:active {
  background-color: #f0f0f0;
}

.agreement-check {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.agreement-check.checked {
  background: #2e7d32;
  border-color: #2e7d32;
}

.check-icon {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.agreement-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}

/* 全新申购弹窗样式 */
.purchase-modal-new {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4rpx);
}

.modal-container {
  position: relative;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 弹窗头部 */
.modal-header-new {
  display: flex;
  align-items: center;
  padding: 32rpx 32rpx 24rpx;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  position: relative;
}

.header-icon {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-text {
  font-size: 32rpx;
}

.header-content {
  flex: 1;
}

.modal-title-new {
  font-size: 36rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 4rpx;
}

.modal-subtitle {
  font-size: 24rpx;
  opacity: 0.9;
  display: block;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.close-icon {
  font-size: 32rpx;
  font-weight: bold;
}

/* 产品信息卡片 */
.product-card {
  margin: 24rpx 32rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid #e9ecef;
}

.product-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-icon {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.product-icon-text {
  font-size: 28rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.product-type {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.product-yield {
  text-align: right;
}

.yield-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #e74c3c;
  display: block;
  margin-bottom: 4rpx;
}

.yield-label {
  font-size: 20rpx;
  color: #666;
  display: block;
}

.product-details {
  border-top: 1rpx solid #e9ecef;
  padding-top: 20rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.risk-level {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
}

.risk-level.risk-low {
  background: #d4edda;
  color: #155724;
}

.risk-level.risk-medium {
  background: #fff3cd;
  color: #856404;
}

.risk-level.risk-high {
  background: #f8d7da;
  color: #721c24;
}

/* 申购金额输入 */
.amount-section {
  margin: 0 32rpx 24rpx;
}

.section-title {
  margin-bottom: 16rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.title-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.amount-input-container {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #666;
  font-weight: 600;
  z-index: 1;
}

.amount-input-new {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 0 20rpx 0 60rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  background: #fff;
  transition: all 0.2s ease;
}

.amount-input-new:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 4rpx rgba(46, 125, 50, 0.1);
}

.amount-suggestions {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}

.suggestion-item {
  flex: 1;
  height: 60rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.suggestion-item:active {
  background: #2e7d32;
  border-color: #2e7d32;
}

.suggestion-item:active .suggestion-text {
  color: white;
}

.suggestion-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 600;
}

/* 收益预览 */
.return-preview {
  margin: 0 32rpx 24rpx;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid #c8e6c9;
}

.preview-header {
  margin-bottom: 16rpx;
}

.preview-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2e7d32;
}

.preview-content {
  display: flex;
  gap: 24rpx;
}

.return-item {
  flex: 1;
  text-align: center;
}

.return-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.return-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #2e7d32;
  display: block;
}

.return-value.total {
  color: #1976d2;
  font-size: 36rpx;
}

/* 协议确认 */
.agreement-section-new {
  margin: 0 32rpx 24rpx;
}

.agreement-header {
  margin-bottom: 16rpx;
}

.agreement-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
}

.agreement-list {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.agreement-item-new {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 16rpx;
  padding: 12rpx;
  border-radius: 8rpx;
  transition: background-color 0.2s ease;
}

.agreement-item-new:last-child {
  margin-bottom: 0;
}

.agreement-item-new:active {
  background-color: #e9ecef;
}

.agreement-check-new {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.agreement-check-new.checked {
  background: #2e7d32;
  border-color: #2e7d32;
}

.check-icon-new {
  font-size: 22rpx;
  color: #fff;
  font-weight: bold;
}

.agreement-content {
  flex: 1;
}

.agreement-text-new {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.agreement-link {
  font-size: 26rpx;
  color: #2e7d32;
  text-decoration: underline;
  font-weight: 600;
}

/* 弹窗底部按钮 */
.modal-footer-new {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx 40rpx;
  background: #fff;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e9ecef;
}

.btn-cancel:active {
  background: #e9ecef;
}

.btn-confirm {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(46, 125, 50, 0.3);
}

.btn-confirm:active:not(.disabled) {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(46, 125, 50, 0.3);
}

.btn-confirm.disabled {
  background: #ccc;
  color: #999;
  box-shadow: none;
}

.btn-confirm.loading {
  background: #999;
  color: #fff;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 700;
}
</style>


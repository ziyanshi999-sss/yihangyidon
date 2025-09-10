<template>
  <view class="insurance-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">‹</text>
        </view>
        <text class="nav-title">保险产品</text>
        <view class="nav-right">
          <text class="nav-icon" @click="onRefresh">⟳</text>
        </view>
      </view>
    </view>

    <!-- 保险市场概览 -->
    <view class="market-overview">
      <view class="overview-header">
        <text class="overview-title">保险市场概览</text>
        <text class="overview-subtitle">实时数据</text>
      </view>
      <view class="overview-stats">
        <view class="stat-item">
          <text class="stat-value">{{ marketData.totalPremium }}</text>
          <text class="stat-label">总保费(亿元)</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ marketData.growthRate }}%</text>
          <text class="stat-label">增长率</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ marketData.productCount }}</text>
          <text class="stat-label">在售产品</text>
        </view>
      </view>
    </view>

    <!-- 保险类型分布图表 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">保险产品类型分布</text>
        <text class="chart-subtitle">市场占比</text>
      </view>
      <view class="chart-container">
        <canvas 
          :id="'insuranceChart'"
          :canvas-id="'insuranceChart'"
          class="chart-canvas"
          @touchstart="onChartTouch"
        ></canvas>
      </view>
    </view>

    <!-- 保险类型筛选 -->
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
            :class="{ active: activeFilter === 'health' }"
            @click="activeFilter = 'health'"
          >
            健康险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'accident' }"
            @click="activeFilter = 'accident'"
          >
            意外险
          </view>
          <view 
            class="filter-item" 
            :class="{ active: activeFilter === 'life' }"
            @click="activeFilter = 'life'"
          >
            寿险
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 保险产品列表 -->
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
                  <text class="type-tag" :class="product.type">{{ product.typeText }}</text>
                  <text class="age-tag">{{ product.ageRange }}</text>
                </view>
              </view>
              <view class="product-premium">
                <text class="premium-value">¥{{ product.premium }}</text>
                <text class="premium-label">/年起</text>
              </view>
            </view>
            
            <view class="product-desc">
              <text class="desc-text">{{ product.desc }}</text>
            </view>
            
            <view class="product-details">
              <view class="detail-item">
                <text class="detail-label">保额</text>
                <text class="detail-value">¥{{ product.coverage.toLocaleString() }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">保障期限</text>
                <text class="detail-value">{{ product.term || '1年' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">缴费方式</text>
                <text class="detail-value">{{ product.paymentMethod || '年缴' }}</text>
              </view>
            </view>
            
            <view class="product-actions">
              <button class="detail-btn" @click.stop="onProductDetail(product)">查看详情</button>
              <button class="buy-btn" @click.stop="onProductBuy(product)">立即投保</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 保险知识 -->
    <view class="knowledge-section">
      <view class="section-header">
        <text class="section-title">保险知识</text>
        <text class="section-subtitle">了解保险 · 理性投保</text>
      </view>
      
      <view class="knowledge-list">
        <view class="knowledge-item" v-for="item in knowledgeList" :key="item.id">
          <text class="knowledge-title">{{ item.title }}</text>
          <text class="knowledge-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 投保流程 -->
    <view class="process-section">
      <view class="section-header">
        <text class="section-title">投保流程</text>
        <text class="section-subtitle">简单便捷 · 快速投保</text>
      </view>
      
      <view class="process-steps">
        <view class="step-item" v-for="(step, index) in processSteps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <view class="step-content">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-desc">{{ step.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getInsuranceCategories, purchaseInsuranceProduct, getCurrentUserId, initWealthDataSync } from '@/api/wealth.js'
import { initUCharts, createInsuranceChart } from '@/utils/ucharts.js'

export default {
  data() {
    return {
      loading: false,
      activeFilter: 'all',
      insuranceData: null,
      chartInstance: null,
      marketData: {
        totalPremium: '4,500',
        growthRate: 8.5,
        productCount: 89
      },
      productCategories: [
        {
          name: '健康险',
          products: [
            { 
              id: 'i1', 
              name: '安心医疗险', 
              type: 'health', 
              typeText: '医疗险', 
              desc: '百万保额·报销广', 
              premium: 268, 
              coverage: 1000000, 
              ageRange: '18-65岁',
              term: '1年',
              paymentMethod: '年缴'
            },
            { 
              id: 'i2', 
              name: '重疾守护', 
              type: 'critical', 
              typeText: '重疾险', 
              desc: '重大疾病全面保障', 
              premium: 860, 
              coverage: 500000, 
              ageRange: '18-60岁',
              term: '终身',
              paymentMethod: '年缴'
            },
            { 
              id: 'i3', 
              name: '防癌卫士', 
              type: 'cancer', 
              typeText: '防癌险', 
              desc: '癌症专项保障', 
              premium: 320, 
              coverage: 300000, 
              ageRange: '18-70岁',
              term: '1年',
              paymentMethod: '年缴'
            }
          ]
        },
        {
          name: '意外险',
          products: [
            { 
              id: 'i4', 
              name: '家庭意外险', 
              type: 'accident', 
              typeText: '意外险', 
              desc: '全家保障·一年期', 
              premium: 199, 
              coverage: 200000, 
              ageRange: '0-65岁',
              term: '1年',
              paymentMethod: '年缴'
            },
            { 
              id: 'i5', 
              name: '交通意外险', 
              type: 'traffic', 
              typeText: '交通意外', 
              desc: '出行安全保障', 
              premium: 88, 
              coverage: 500000, 
              ageRange: '18-65岁',
              term: '1年',
              paymentMethod: '年缴'
            }
          ]
        },
        {
          name: '寿险',
          products: [
            { 
              id: 'i6', 
              name: '定期寿险', 
              type: 'life', 
              typeText: '寿险', 
              desc: '家庭责任保障', 
              premium: 1200, 
              coverage: 1000000, 
              ageRange: '18-55岁',
              term: '30年',
              paymentMethod: '年缴'
            },
            { 
              id: 'i7', 
              name: '终身寿险', 
              type: 'wholelife', 
              typeText: '终身寿险', 
              desc: '终身保障传承', 
              premium: 5000, 
              coverage: 500000, 
              ageRange: '18-50岁',
              term: '终身',
              paymentMethod: '年缴'
            }
          ]
        }
      ],
      knowledgeList: [
        {
          id: 'k1',
          title: '什么是保险？',
          desc: '保险是一种风险管理工具，通过缴纳保费获得保障，在发生保险事故时获得经济补偿。'
        },
        {
          id: 'k2',
          title: '如何选择保险产品？',
          desc: '根据自身需求、风险承受能力和经济状况，选择适合的保险类型和保额。'
        },
        {
          id: 'k3',
          title: '保险理赔流程',
          desc: '发生保险事故后，及时报案、提交材料、等待审核，符合条件即可获得理赔。'
        }
      ],
      processSteps: [
        {
          title: '选择产品',
          desc: '根据需求选择适合的保险产品'
        },
        {
          title: '填写信息',
          desc: '如实填写投保人和被保险人信息'
        },
        {
          title: '健康告知',
          desc: '如实告知健康状况，避免理赔纠纷'
        },
        {
          title: '支付保费',
          desc: '选择支付方式，完成保费缴纳'
        },
        {
          title: '等待承保',
          desc: '保险公司审核，确认承保后生效'
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
        products: category.products.filter(product => product.type === this.activeFilter)
      })).filter(category => category.products.length > 0)
    }
  },
  
  onLoad() {
    this.loadInsuranceData()
    this.initDataSync()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onRefresh() {
      this.loadInsuranceData()
    },
    
    async loadInsuranceData() {
      try {
        this.loading = true
        uni.showLoading({ title: '加载中...' })
        
        // 从财富API获取保险产品数据
        const insuranceCategories = getInsuranceCategories()
        console.log('保险产品数据:', insuranceCategories)
        
        // 保存数据用于图表渲染
        this.insuranceCategories = insuranceCategories
        
        // 更新市场数据
        const totalProducts = insuranceCategories.reduce((sum, cat) => sum + cat.products.length, 0)
        const avgPremium = insuranceCategories.reduce((sum, cat) => {
          const categoryAvg = cat.products.reduce((catSum, product) => catSum + product.premium, 0) / cat.products.length
          return sum + categoryAvg
        }, 0) / insuranceCategories.length
        
        this.marketData = {
          totalPremium: '850',
          growthRate: '12.5',
          productCount: totalProducts
        }
        
        // 初始化图表
        await this.initChart(insuranceCategories)
        
        uni.hideLoading()
        this.loading = false
      } catch (error) {
        console.error('加载保险产品数据失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
        this.loading = false
      }
    },
    
    async initChart(insuranceCategories) {
      try {
        console.log('🎨 开始渲染保险图表')
        
        // #ifdef APP-PLUS
        // App-Plus环境需要延迟初始化
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        // #endif
        
        // 使用uCharts渲染图表
        const option = createInsuranceChart({ categories: insuranceCategories })
        this.chartInstance = await initUCharts('insuranceChart', option, this)
        
        if (this.chartInstance) {
          console.log('✅ 保险图表渲染成功 (uCharts)')
        } else {
          console.warn('❌ uCharts图表渲染失败')
        }
      } catch (error) {
        console.error('❌ 保险图表渲染失败:', error)
        // 降级处理：显示文本信息
        this.showChartFallback('保险产品保费数据加载失败')
      }
    },
    
    // 图表降级处理
    showChartFallback(message) {
      const chartContainer = document.getElementById('insuranceChart')
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
    
    onProductDetail(product) {
      uni.navigateTo({
        url: `/pages/wealth/insurance-detail?id=${product.id}&name=${product.name}`
      })
    },
    
    onProductBuy(product) {
      // 直接在当前页面处理购买
      this.processInsurancePurchase(product)
    },
    
    onProductDetail(product) {
      uni.navigateTo({
        url: `/pages/wealth/insurance-detail?id=${product.id}&name=${product.name}&type=${product.type}&premium=${product.premium}&coverage=${product.coverage}&term=${product.term}`
      })
    },
    
    // 处理保险购买
    processInsurancePurchase(product) {
      uni.showModal({
        title: '确认投保',
        content: `确定要购买${product.name}吗？保费：${product.premium}元`,
        success: (res) => {
          if (res.confirm) {
            this.executeInsurancePurchase(product)
          }
        }
      })
    },
    
    // 执行保险购买
    executeInsurancePurchase(product) {
      uni.showLoading({ title: '投保处理中...' })
      
      try {
        const userId = getCurrentUserId()
        
        // 调用API购买保险产品
        const success = purchaseInsuranceProduct(userId, product)
        
        setTimeout(() => {
          uni.hideLoading()
          
          if (success) {
            uni.showToast({
              title: '投保成功',
              icon: 'success'
            })
            
            // 触发数据更新事件
            uni.$emit('insurancePurchaseSuccess', { product: product.name, premium: product.premium })
          } else {
            uni.showToast({
              title: '投保失败，余额不足或系统错误',
              icon: 'none'
            })
          }
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '投保失败，请重试',
          icon: 'none'
        })
        console.error('投保处理失败:', error)
      }
    },
    
    // 初始化数据同步
    initDataSync() {
      // 初始化财富数据同步
      initWealthDataSync()
      
      // 监听余额更新事件
      uni.$on('balanceUpdated', (data) => {
        console.log('保险页面收到余额更新事件:', data)
        // 可以在这里更新页面显示
      })
    }
  }
}
</script>

<style scoped>
.insurance-page {
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

.chart-subtitle {
  font-size: 22rpx;
  color: #666;
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
  margin-bottom: 12rpx;
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

.type-tag {
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  color: #fff;
}

.type-tag.health {
  background: #4caf50;
}

.type-tag.accident {
  background: #2196f3;
}

.type-tag.life {
  background: #9c27b0;
}

.type-tag.critical {
  background: #ff9800;
}

.type-tag.cancer {
  background: #f44336;
}

.type-tag.traffic {
  background: #607d8b;
}

.type-tag.wholelife {
  background: #795548;
}

.age-tag {
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  background: #e3f2fd;
  color: #1976d2;
}

.product-premium {
  text-align: right;
  min-width: 120rpx;
}

.premium-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #e53935;
  display: block;
}

.premium-label {
  font-size: 20rpx;
  color: #666;
}

.product-desc {
  margin-bottom: 16rpx;
}

.desc-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
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

/* 知识区域 */
.knowledge-section {
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

/* 投保流程 */
.process-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: #2e7d32;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 8rpx;
}

.step-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.step-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}
</style>

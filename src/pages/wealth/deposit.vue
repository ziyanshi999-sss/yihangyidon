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

    <!-- 快速操作 -->
    <view class="quick-actions">
      <view class="action-item" @click="onQuickDeposit('current')">
        <view class="action-icon current">💰</view>
        <text class="action-text">活期存款</text>
        <text class="action-rate">0.35%</text>
      </view>
      <view class="action-item" @click="onQuickDeposit('fixed')">
        <view class="action-icon fixed">🏦</view>
        <text class="action-text">定期存款</text>
        <text class="action-rate">2.45%</text>
      </view>
      <view class="action-item" @click="onQuickDeposit('smart')">
        <view class="action-icon smart">🧠</view>
        <text class="action-text">智能存款</text>
        <text class="action-rate">3.50%</text>
      </view>
      <view class="action-item" @click="onDepositCalculator">
        <view class="action-icon calc">🧮</view>
        <text class="action-text">收益计算</text>
        <text class="action-rate">工具</text>
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

    <!-- 存款详情弹窗 -->
    <view class="deposit-detail-modal" v-if="showDetailModal" @tap="closeDetailModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedProduct.name }}</text>
          <text class="modal-close" @tap="closeDetailModal">×</text>
        </view>
        <view class="modal-body">
          <view class="detail-section">
            <text class="detail-label">产品类型</text>
            <text class="detail-value">{{ selectedProduct.type }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">存款期限</text>
            <text class="detail-value">{{ selectedProduct.term }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">年化利率</text>
            <text class="detail-value rate-highlight">{{ selectedProduct.rate }}%</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">起存金额</text>
            <text class="detail-value">¥{{ selectedProduct.minAmount.toLocaleString() }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">产品特色</text>
            <view class="features-list">
              <text class="feature-item" v-for="feature in selectedProduct.features" :key="feature">
                ✓ {{ feature }}
              </text>
            </view>
          </view>
          <view class="detail-section">
            <text class="detail-label">风险提示</text>
            <text class="detail-value risk-warning">{{ selectedProduct.riskWarning }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="closeDetailModal">取消</button>
          <button class="modal-btn primary" @tap="onDepositNow(selectedProduct)">立即存入</button>
        </view>
      </view>
    </view>

    <!-- 收益计算器弹窗 -->
    <view class="calculator-modal" v-if="showCalculatorModal" @tap="closeCalculatorModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">存款收益计算器</text>
          <text class="modal-close" @tap="closeCalculatorModal">×</text>
        </view>
        <view class="modal-body">
          <view class="calc-section">
            <text class="calc-label">存款金额（元）</text>
            <input 
              class="calc-input" 
              v-model="calcAmount" 
              type="number" 
              placeholder="请输入存款金额"
              @input="calculateInterest"
            />
          </view>
          <view class="calc-section">
            <text class="calc-label">存款期限</text>
            <picker 
              :value="calcTermIndex" 
              :range="calcTerms" 
              range-key="label"
              @change="onTermChange"
            >
              <view class="calc-picker">
                {{ calcTerms[calcTermIndex].label }}
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="calc-section">
            <text class="calc-label">年化利率（%）</text>
            <input 
              class="calc-input" 
              v-model="calcRate" 
              type="number" 
              placeholder="请输入年化利率"
              @input="calculateInterest"
            />
          </view>
          <view class="calc-result" v-if="calcResult">
            <view class="result-item">
              <text class="result-label">到期本息合计</text>
              <text class="result-value">¥{{ calcResult.total.toLocaleString() }}</text>
            </view>
            <view class="result-item">
              <text class="result-label">利息收入</text>
              <text class="result-value interest">¥{{ calcResult.interest.toLocaleString() }}</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="closeCalculatorModal">关闭</button>
          <button class="modal-btn primary" @tap="onApplyCalculation">应用计算</button>
        </view>
      </view>
    </view>

    <!-- 存款确认弹窗 -->
    <view class="deposit-confirm-modal" v-if="showConfirmModal" @tap="closeConfirmModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">确认存款</text>
          <text class="modal-close" @tap="closeConfirmModal">×</text>
        </view>
        <view class="modal-body">
          <view class="confirm-section">
            <text class="confirm-label">产品名称</text>
            <text class="confirm-value">{{ confirmProduct.name }}</text>
          </view>
          <view class="confirm-section">
            <text class="confirm-label">存款期限</text>
            <text class="confirm-value">{{ confirmProduct.term }}</text>
          </view>
          <view class="confirm-section">
            <text class="confirm-label">年化利率</text>
            <text class="confirm-value rate-highlight">{{ confirmProduct.rate }}%</text>
          </view>
          <view class="confirm-section">
            <text class="confirm-label">存款金额</text>
            <input 
              class="confirm-input" 
              v-model="confirmAmount" 
              type="number" 
              placeholder="请输入存款金额"
            />
          </view>
          <view class="confirm-section">
            <text class="confirm-label">预计收益</text>
            <text class="confirm-value interest">¥{{ calculateExpectedInterest() }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="closeConfirmModal">取消</button>
          <button class="modal-btn primary" @tap="onConfirmDeposit">确认存入</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getDepositRates, getDepositProducts, addDepositRecord, getCurrentUserId, initWealthDataSync } from '@/api/wealth.js'
import { drawSimpleLineChart } from '@/utils/simple-chart.js'

export default {
  data() {
    return {
      hideAmount: false,
      loading: false,
      depositData: null,
      chartInstance: null,
      showDataTable: false,
      
      // 弹窗控制
      showDetailModal: false,
      showCalculatorModal: false,
      showConfirmModal: false,
      selectedProduct: {},
      confirmProduct: {},
      confirmAmount: '',
      
      // 计算器数据
      calcAmount: '',
      calcRate: '',
      calcTermIndex: 0,
      calcTerms: [
        { label: '3个月', value: 0.25 },
        { label: '6个月', value: 0.5 },
        { label: '1年', value: 1 },
        { label: '2年', value: 2 },
        { label: '3年', value: 3 },
        { label: '5年', value: 5 }
      ],
      calcResult: null,
      depositProducts: [
        { 
          id: 'd1', 
          name: '整存整取', 
          type: '定期存款',
          term: '3个月', 
          minAmount: 1000, 
          rate: 1.85,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        },
        { 
          id: 'd2', 
          name: '整存整取', 
          type: '定期存款',
          term: '6个月', 
          minAmount: 1000, 
          rate: 2.05,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        },
        { 
          id: 'd3', 
          name: '整存整取', 
          type: '定期存款',
          term: '1年', 
          minAmount: 1000, 
          rate: 2.10,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        },
        { 
          id: 'd4', 
          name: '整存整取', 
          type: '定期存款',
          term: '2年', 
          minAmount: 1000, 
          rate: 2.60,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        },
        { 
          id: 'd5', 
          name: '整存整取', 
          type: '定期存款',
          term: '3年', 
          minAmount: 1000, 
          rate: 2.95,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        },
        { 
          id: 'd6', 
          name: '整存整取', 
          type: '定期存款',
          term: '5年', 
          minAmount: 1000, 
          rate: 3.20,
          features: ['保本保息', '提前支取', '自动转存'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        }
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
    this.initDataSync()
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
        
        // 从财富API获取存款数据
        const depositData = getDepositRates()
        console.log('存款数据:', depositData)
        
        // 确保数据结构完整
        if (!depositData.fixed || depositData.fixed.length === 0) {
          console.log('定期存款数据为空，使用默认数据')
          depositData.fixed = [
            { term: '3个月', rate: 1.85 },
            { term: '6个月', rate: 2.05 },
            { term: '1年', rate: 2.10 },
            { term: '2年', rate: 2.60 },
            { term: '3年', rate: 2.95 },
            { term: '5年', rate: 3.20 }
          ]
        }
        
        // 保存数据用于图表渲染
        this.depositData = depositData
        
        // 初始化图表
        await this.initChart(depositData)
        
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
        
        // 使用简单图表工具渲染图表
        const chartData = this.depositData?.fixed?.map(item => item.rate) || [1.85, 2.05, 2.10, 2.60, 2.95, 3.20]
        const labels = this.depositData?.fixed?.map(item => item.term) || ['3个月', '6个月', '1年', '2年', '3年', '5年']
        
        drawSimpleLineChart('depositRateChart', {
          data: chartData,
          labels: labels,
          title: '存款利率趋势',
          yAxisLabel: '利率(%)',
          colors: ['#007AFF']
        })
        
        console.log('✅ 存款利率图表渲染成功')
        
      } catch (error) {
        console.error('❌ 图表渲染失败:', error)
        // 使用默认数据作为备用
        const defaultData = [1.85, 2.05, 2.10, 2.60, 2.95, 3.20]
        const defaultLabels = ['3个月', '6个月', '1年', '2年', '3年', '5年']
        
        drawSimpleLineChart('depositRateChart', {
          data: defaultData,
          labels: defaultLabels,
          title: '存款利率趋势',
          yAxisLabel: '利率(%)',
          colors: ['#007AFF']
        })
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
      this.confirmProduct = product
      this.showConfirmModal = true
    },
    
    // 快速存款操作
    onQuickDeposit(type) {
      const typeMap = {
        current: { name: '活期存款', rate: 0.35, term: '灵活' },
        fixed: { name: '定期存款', rate: 2.45, term: '1年' },
        smart: { name: '智能存款', rate: 3.50, term: '灵活' }
      }
      
      const product = typeMap[type]
      if (product) {
        this.confirmProduct = {
          id: type,
          name: product.name,
          type: product.name,
          term: product.term,
          rate: product.rate,
          minAmount: 1000,
          features: ['保本保息'],
          riskWarning: '本产品为存款产品，受存款保险制度保护，本金安全有保障。'
        }
        this.showConfirmModal = true
      }
    },
    
    // 收益计算器
    onDepositCalculator() {
      this.showCalculatorModal = true
    },
    
    // 产品详情
    onProductDetail(product) {
      this.selectedProduct = product
      this.showDetailModal = true
    },
    
    // 弹窗控制方法
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedProduct = {}
    },
    
    closeCalculatorModal() {
      this.showCalculatorModal = false
      this.calcAmount = ''
      this.calcRate = ''
      this.calcResult = null
    },
    
    closeConfirmModal() {
      this.showConfirmModal = false
      this.confirmProduct = {}
      this.confirmAmount = ''
    },
    
    // 计算器相关方法
    onTermChange(e) {
      this.calcTermIndex = e.detail.value
      this.calculateInterest()
    },
    
    calculateInterest() {
      if (!this.calcAmount || !this.calcRate) {
        this.calcResult = null
        return
      }
      
      const amount = parseFloat(this.calcAmount)
      const rate = parseFloat(this.calcRate) / 100
      const term = this.calcTerms[this.calcTermIndex].value
      
      if (amount > 0 && rate > 0 && term > 0) {
        const interest = amount * rate * term
        const total = amount + interest
        
        this.calcResult = {
          interest: Math.round(interest * 100) / 100,
          total: Math.round(total * 100) / 100
        }
      }
    },
    
    onApplyCalculation() {
      if (this.calcResult) {
        this.confirmAmount = this.calcAmount
        this.closeCalculatorModal()
        uni.showToast({
          title: '计算结果已应用',
          icon: 'success'
        })
      }
    },
    
    // 计算预期收益
    calculateExpectedInterest() {
      if (!this.confirmAmount || !this.confirmProduct.rate) {
        return '0.00'
      }
      
      const amount = parseFloat(this.confirmAmount)
      const rate = this.confirmProduct.rate / 100
      let term = 1 // 默认1年
      
      // 根据期限计算年数
      if (this.confirmProduct.term.includes('月')) {
        const months = parseInt(this.confirmProduct.term)
        term = months / 12
      } else if (this.confirmProduct.term.includes('年')) {
        term = parseInt(this.confirmProduct.term)
      }
      
      const interest = amount * rate * term
      return Math.round(interest * 100) / 100
    },
    
    // 确认存款
    onConfirmDeposit() {
      if (!this.confirmAmount || parseFloat(this.confirmAmount) < this.confirmProduct.minAmount) {
        uni.showToast({
          title: `存款金额不能少于${this.confirmProduct.minAmount}元`,
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '确认存款',
        content: `确定要存入${this.confirmAmount}元到${this.confirmProduct.name}吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.processDeposit()
          }
        }
      })
    },
    
    // 处理存款业务
    async processDeposit() {
      uni.showLoading({ title: '处理中...' })
      
      try {
        const userId = getCurrentUserId()
        const depositType = this.getDepositType(this.confirmProduct.name)
        const amount = parseFloat(this.confirmAmount)
        
        // 调用API添加存款记录
        const success = addDepositRecord(userId, depositType, amount)
        
        setTimeout(async () => {
          uni.hideLoading()
          
          if (success) {
            uni.showToast({
              title: '存款成功',
              icon: 'success'
            })
            
            this.closeConfirmModal()
            
            // 刷新数据
            await this.loadDepositData()
            
            // 触发数据更新事件
            uni.$emit('depositSuccess', { type: depositType, amount })
          } else {
            uni.showToast({
              title: '存款失败，请重试',
              icon: 'none'
            })
          }
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '存款失败，请重试',
          icon: 'none'
        })
        console.error('存款处理失败:', error)
      }
    },
    
    // 获取存款类型
    getDepositType(productName) {
      if (!productName || typeof productName !== 'string') {
        console.warn('产品名称为空或无效:', productName)
        return 'current' // 默认活期
      }
      
      if (productName.includes('活期')) return 'current'
      if (productName.includes('定期')) return 'fixed'
      if (productName.includes('智能')) return 'smart'
      return 'current' // 默认活期
    },
    
    // 初始化数据同步
    initDataSync() {
      // 初始化财富数据同步
      initWealthDataSync()
      
      // 监听余额更新事件
      uni.$on('balanceUpdated', (data) => {
        console.log('存款页面收到余额更新事件:', data)
        // 可以在这里更新页面显示
      })
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

/* 快速操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin: 0 20rpx 20rpx;
}

.action-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 2rpx solid #f0f0f0;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
  display: block;
}

.action-text {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
  display: block;
}

.action-rate {
  font-size: 20rpx;
  color: #2e7d32;
  font-weight: 600;
}

/* 弹窗样式 */
.deposit-detail-modal,
.calculator-modal,
.deposit-confirm-modal {
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

/* 详情弹窗 */
.detail-section {
  margin-bottom: 24rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.detail-value.rate-highlight {
  color: #e53935;
  font-weight: 700;
  font-size: 32rpx;
}

.detail-value.risk-warning {
  color: #ff9800;
  font-size: 24rpx;
  line-height: 1.4;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.feature-item {
  font-size: 24rpx;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
}

/* 计算器弹窗 */
.calc-section {
  margin-bottom: 24rpx;
}

.calc-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.calc-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #fff;
}

.calc-input:focus {
  border-color: #2e7d32;
}

.calc-picker {
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  color: #999;
  font-size: 24rpx;
}

.calc-result {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  font-size: 24rpx;
  color: #666;
}

.result-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.result-value.interest {
  color: #2e7d32;
}

/* 确认弹窗 */
.confirm-section {
  margin-bottom: 20rpx;
}

.confirm-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.confirm-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.confirm-value.rate-highlight {
  color: #e53935;
  font-weight: 700;
  font-size: 32rpx;
}

.confirm-value.interest {
  color: #2e7d32;
  font-weight: 700;
}

.confirm-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #fff;
}

.confirm-input:focus {
  border-color: #2e7d32;
}
</style>

<template>
  <view class="loan-application-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">贷款申请</text>
      <text class="header-subtitle">{{ selectedProduct ? selectedProduct.name : '请选择贷款产品' }}</text>
    </view>

    <!-- 申请步骤 -->
    <view class="application-steps">
      <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <view class="step-number">1</view>
        <text class="step-text">选择产品</text>
      </view>
      <view class="step-line" :class="{ completed: currentStep > 1 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <view class="step-number">2</view>
        <text class="step-text">填写信息</text>
      </view>
      <view class="step-line" :class="{ completed: currentStep > 2 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
        <view class="step-number">3</view>
        <text class="step-text">人脸认证</text>
      </view>
      <view class="step-line" :class="{ completed: currentStep > 3 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
        <view class="step-number">4</view>
        <text class="step-text">提交申请</text>
      </view>
    </view>

    <!-- 步骤内容 -->
    <view class="step-content">
      <!-- 步骤1: 选择产品 -->
      <view class="step-panel" v-if="currentStep === 1">
        <view class="panel-title">选择贷款产品</view>
        <view class="products-list">
          <view 
            class="product-item" 
            :class="{ selected: selectedProduct && selectedProduct.id === product.id }"
            v-for="product in loanProducts" 
            :key="product.id"
            @tap="selectProduct(product)">
            <view class="product-header">
              <text class="product-name">{{ product.name }}</text>
              <view class="product-rate">
                <text class="rate-value">{{ product.rate }}%</text>
                <text class="rate-label">年利率起</text>
              </view>
            </view>
            <view class="product-info">
              <text class="info-item">额度：{{ product.amountRange }}</text>
              <text class="info-item">期限：{{ product.termRange }}</text>
            </view>
            <text class="product-features">{{ product.features }}</text>
          </view>
        </view>
        <button class="next-btn" @tap="nextStep" :disabled="!selectedProduct">下一步</button>
      </view>

      <!-- 步骤2: 填写信息 -->
      <view class="step-panel" v-if="currentStep === 2">
        <view class="panel-title">填写申请信息</view>
        <form class="application-form">
          <view class="form-section">
            <text class="section-title">个人信息</text>
            <view class="form-group">
              <text class="form-label">姓名</text>
              <input 
                class="form-input" 
                v-model="applicationData.name" 
                placeholder="请输入真实姓名"
                maxlength="20" />
            </view>
            <view class="form-group">
              <text class="form-label">身份证号</text>
              <input 
                class="form-input" 
                v-model="applicationData.idCard" 
                placeholder="请输入身份证号码"
                maxlength="18" />
            </view>
            <view class="form-group">
              <text class="form-label">手机号</text>
              <input 
                class="form-input" 
                v-model="applicationData.phone" 
                placeholder="请输入手机号码"
                type="number"
                maxlength="11" />
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">贷款信息</text>
            <view class="form-group">
              <text class="form-label">申请金额</text>
              <input 
                class="form-input" 
                v-model="applicationData.amount" 
                placeholder="请输入申请金额"
                type="number" />
              <text class="form-unit">元</text>
            </view>
            <view class="form-group">
              <text class="form-label">贷款期限</text>
              <picker 
                class="form-picker"
                :value="applicationData.termIndex"
                :range="termOptions"
                range-key="label"
                @change="onTermChange">
                <view class="picker-text">
                  {{ applicationData.termIndex >= 0 ? termOptions[applicationData.termIndex].label : '请选择贷款期限' }}
                </view>
              </picker>
            </view>
            <view class="form-group">
              <text class="form-label">贷款用途</text>
              <picker 
                class="form-picker"
                :value="applicationData.purposeIndex"
                :range="purposeOptions"
                @change="onPurposeChange">
                <view class="picker-text">
                  {{ applicationData.purposeIndex >= 0 ? purposeOptions[applicationData.purposeIndex] : '请选择贷款用途' }}
                </view>
              </picker>
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">工作信息</text>
            <view class="form-group">
              <text class="form-label">公司名称</text>
              <input 
                class="form-input" 
                v-model="applicationData.company" 
                placeholder="请输入公司名称" />
            </view>
            <view class="form-group">
              <text class="form-label">月收入</text>
              <input 
                class="form-input" 
                v-model="applicationData.monthlyIncome" 
                placeholder="请输入月收入"
                type="number" />
              <text class="form-unit">元</text>
            </view>
          </view>
        </form>
        
        <view class="step-actions">
          <button class="prev-btn" @tap="prevStep">上一步</button>
          <button class="next-btn" @tap="nextStep" :disabled="!isFormValid">下一步</button>
        </view>
      </view>

      <!-- 步骤3: 人脸认证 -->
      <view class="step-panel" v-if="currentStep === 3">
        <view class="panel-title">人脸认证</view>
        <view class="face-auth-intro">
          <view class="intro-icon">🔒</view>
          <text class="intro-title">为了确保您的身份安全</text>
          <text class="intro-desc">请完成人脸认证，包括眨眼和左右转头动作</text>
          <view class="auth-tips">
            <text class="tip-item">• 请确保光线充足</text>
            <text class="tip-item">• 请正对摄像头</text>
            <text class="tip-item">• 请按照提示完成动作</text>
          </view>
        </view>
        
        <view class="auth-status" v-if="faceAuthCompleted">
          <view class="status-icon success">✓</view>
          <text class="status-text">人脸认证已完成</text>
        </view>
        
        <view class="step-actions">
          <button class="prev-btn" @tap="prevStep">上一步</button>
          <button class="auth-btn" @tap="startFaceAuth" v-if="!faceAuthCompleted">开始认证</button>
          <button class="next-btn" @tap="nextStep" v-if="faceAuthCompleted">下一步</button>
        </view>
      </view>

      <!-- 步骤4: 提交申请 -->
      <view class="step-panel" v-if="currentStep === 4">
        <view class="panel-title">确认申请信息</view>
        <view class="application-summary">
          <view class="summary-section">
            <text class="summary-title">贷款产品</text>
            <text class="summary-value">{{ selectedProduct.name }}</text>
          </view>
          <view class="summary-section">
            <text class="summary-title">申请金额</text>
            <text class="summary-value">¥{{ applicationData.amount }}</text>
          </view>
          <view class="summary-section">
            <text class="summary-title">贷款期限</text>
            <text class="summary-value">{{ applicationData.termIndex >= 0 ? termOptions[applicationData.termIndex].label : '' }}</text>
          </view>
          <view class="summary-section">
            <text class="summary-title">预计月供</text>
            <text class="summary-value highlight">¥{{ calculateMonthlyPayment() }}</text>
          </view>
        </view>

        <view class="agreement-section">
          <checkbox-group @change="onAgreementChange">
            <label class="agreement-item">
              <checkbox value="agree" />
              <text class="agreement-text">我已阅读并同意</text>
              <text class="agreement-link" @tap="viewAgreement">《贷款服务协议》</text>
            </label>
          </checkbox-group>
        </view>
        
        <view class="step-actions">
          <button class="prev-btn" @tap="prevStep">上一步</button>
          <button class="submit-btn" @tap="submitApplication" :disabled="!agreementAccepted || submitting">
            {{ submitting ? '提交中...' : '提交申请' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 人脸认证组件 -->
    <FaceAuth 
      :show="showFaceAuth" 
      @close="closeFaceAuth"
      @auth-success="onFaceAuthSuccess" />
  </view>
</template>

<script>
import FaceAuth from '@/components/common/FaceAuth.vue'
import { getLoanProducts, submitLoanApplication, faceAuthentication } from '@/api/loan.js'
import { forceCheckLogin } from '@/utils/auth.js'

export default {
  components: {
    FaceAuth
  },
  data() {
    return {
      currentStep: 1,
      selectedProduct: null,
      loanProducts: [],
      applicationData: {
        name: '',
        idCard: '',
        phone: '',
        amount: '',
        termIndex: -1,
        purposeIndex: -1,
        company: '',
        monthlyIncome: ''
      },
      termOptions: [
        { label: '6个月', value: 6 },
        { label: '12个月', value: 12 },
        { label: '24个月', value: 24 },
        { label: '36个月', value: 36 },
        { label: '48个月', value: 48 },
        { label: '60个月', value: 60 }
      ],
      purposeOptions: [
        '个人消费',
        '装修房屋',
        '购买家电',
        '教育培训',
        '医疗支出',
        '旅游度假',
        '其他'
      ],
      showFaceAuth: false,
      faceAuthCompleted: false,
      faceAuthData: null,
      agreementAccepted: false,
      submitting: false
    }
  },
  computed: {
    isFormValid() {
      const data = this.applicationData
      return data.name && 
             data.idCard && 
             data.phone && 
             data.amount && 
             data.termIndex >= 0 && 
             data.purposeIndex >= 0 && 
             data.company && 
             data.monthlyIncome
    }
  },
  onLoad(options) {
    this.checkLoginStatus()
    this.loadLoanProducts()
    
    // 如果从贷款列表页传入产品ID，自动选择该产品
    if (options.productId) {
      this.preSelectProduct(options.productId)
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      if (!forceCheckLogin()) {
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
      }
    },

    // 加载贷款产品
    async loadLoanProducts() {
      try {
        // 模拟API调用
        this.loanProducts = [
          {
            id: '1',
            name: '个人消费贷',
            rate: 4.5,
            amountRange: '1万-50万',
            termRange: '6-60期',
            features: '无需抵押，快速审批',
            minAmount: 10000,
            maxAmount: 500000
          },
          {
            id: '2',
            name: '房贷',
            rate: 3.8,
            amountRange: '50万-500万',
            termRange: '12-360期',
            features: '利率优惠，长期稳定',
            minAmount: 500000,
            maxAmount: 5000000
          },
          {
            id: '3',
            name: '经营贷',
            rate: 5.2,
            amountRange: '10万-100万',
            termRange: '12-60期',
            features: '助力创业，灵活还款',
            minAmount: 100000,
            maxAmount: 1000000
          }
        ]
      } catch (error) {
        console.error('加载贷款产品失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    },

    // 预选择产品
    preSelectProduct(productId) {
      this.$nextTick(() => {
        const product = this.loanProducts.find(p => p.id === productId)
        if (product) {
          this.selectProduct(product)
        }
      })
    },

    // 选择产品
    selectProduct(product) {
      this.selectedProduct = product
    },

    // 下一步
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },

    // 上一步
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    // 期限选择改变
    onTermChange(e) {
      this.applicationData.termIndex = e.detail.value
    },

    // 用途选择改变
    onPurposeChange(e) {
      this.applicationData.purposeIndex = e.detail.value
    },

    // 开始人脸认证
    startFaceAuth() {
      this.showFaceAuth = true
    },

    // 关闭人脸认证
    closeFaceAuth() {
      this.showFaceAuth = false
    },

    // 人脸认证成功
    onFaceAuthSuccess(authResult) {
      this.faceAuthCompleted = true
      this.faceAuthData = authResult.authData
      
      uni.showToast({
        title: '认证成功',
        icon: 'success'
      })
    },

    // 协议同意状态改变
    onAgreementChange(e) {
      this.agreementAccepted = e.detail.value.includes('agree')
    },

    // 查看协议
    viewAgreement() {
      uni.showModal({
        title: '贷款服务协议',
        content: '这里显示贷款服务协议的详细内容...',
        showCancel: false
      })
    },

    // 计算月供
    calculateMonthlyPayment() {
      if (!this.applicationData.amount || this.applicationData.termIndex < 0) {
        return '0.00'
      }
      
      const amount = parseFloat(this.applicationData.amount)
      const months = this.termOptions[this.applicationData.termIndex].value
      const rate = this.selectedProduct ? this.selectedProduct.rate / 100 / 12 : 0.045 / 12
      
      const monthlyPayment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      return monthlyPayment.toFixed(2)
    },

    // 提交申请
    async submitApplication() {
      if (!this.agreementAccepted) {
        uni.showToast({
          title: '请先同意协议',
          icon: 'error'
        })
        return
      }

      this.submitting = true
      
      try {
        const submitData = {
          productId: this.selectedProduct.id,
          productName: this.selectedProduct.name,
          ...this.applicationData,
          term: this.termOptions[this.applicationData.termIndex].value,
          purpose: this.purposeOptions[this.applicationData.purposeIndex],
          faceAuthData: this.faceAuthData,
          monthlyPayment: this.calculateMonthlyPayment(),
          submitTime: new Date().toISOString()
        }

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 保存申请记录到本地存储
        const applications = uni.getStorageSync('loanApplications') || []
        const applicationId = 'APP' + Date.now()
        applications.push({
          id: applicationId,
          ...submitData,
          status: 'pending',
          statusText: '审核中'
        })
        uni.setStorageSync('loanApplications', applications)

        uni.showToast({
          title: '申请成功',
          icon: 'success'
        })

        // 跳转到申请结果页面
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/loan/loan-result?applicationId=${applicationId}&success=true`
          })
        }, 1500)

      } catch (error) {
        console.error('提交申请失败:', error)
        uni.showToast({
          title: '提交失败',
          icon: 'error'
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.loan-application-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60rpx;
}

.page-header {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
  color: #fff;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.header-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.application-steps {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #2196f3;
  color: #fff;
}

.step-item.completed .step-number {
  background: #4caf50;
  color: #fff;
}

.step-text {
  font-size: 24rpx;
  color: #999;
  transition: all 0.3s ease;
}

.step-item.active .step-text {
  color: #2196f3;
  font-weight: bold;
}

.step-item.completed .step-text {
  color: #4caf50;
}

.step-line {
  flex: 1;
  height: 4rpx;
  background: #e0e0e0;
  margin: 0 20rpx;
  margin-top: -30rpx;
  transition: all 0.3s ease;
}

.step-line.completed {
  background: #4caf50;
}

.step-content {
  flex: 1;
}

.step-panel {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

/* 产品选择样式 */
.products-list {
  margin-bottom: 30rpx;
}

.product-item {
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.product-item.selected {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.05);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.product-rate {
  text-align: right;
}

.rate-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #f44336;
  display: block;
}

.rate-label {
  font-size: 24rpx;
  color: #999;
}

.product-info {
  margin-bottom: 15rpx;
}

.info-item {
  display: inline-block;
  font-size: 24rpx;
  color: #666;
  margin-right: 30rpx;
  padding: 6rpx 16rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
}

.product-features {
  font-size: 28rpx;
  color: #666;
}

/* 表单样式 */
.application-form {
  margin-bottom: 30rpx;
}

.form-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  position: relative;
}

.form-label {
  width: 150rpx;
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}

.form-input:focus {
  border-color: #2196f3;
}

.form-picker {
  flex: 1;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  background: #fff;
}

.picker-text {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.form-unit {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #666;
}

/* 人脸认证样式 */
.face-auth-intro {
  text-align: center;
  padding: 40rpx 0;
}

.intro-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.intro-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.auth-tips {
  text-align: left;
  max-width: 400rpx;
  margin: 0 auto;
}

.tip-item {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.auth-status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.status-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.status-icon.success {
  background: #4caf50;
  color: #fff;
}

.status-text {
  font-size: 28rpx;
  color: #4caf50;
  font-weight: bold;
}

/* 申请摘要样式 */
.application-summary {
  margin-bottom: 30rpx;
}

.summary-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.summary-section:last-child {
  border-bottom: none;
}

.summary-title {
  font-size: 28rpx;
  color: #666;
}

.summary-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.summary-value.highlight {
  color: #f44336;
  font-weight: bold;
  font-size: 32rpx;
}

/* 协议样式 */
.agreement-section {
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
}

.agreement-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.agreement-text {
  color: #666;
  margin: 0 10rpx;
}

.agreement-link {
  color: #2196f3;
  text-decoration: underline;
}

/* 按钮样式 */
.step-actions {
  display: flex;
  gap: 20rpx;
}

.next-btn, .prev-btn, .auth-btn, .submit-btn {
  flex: 1;
  height: 90rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.next-btn, .auth-btn, .submit-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
}

.next-btn:disabled, .submit-btn:disabled {
  background: #e0e0e0;
  color: #999;
}

.prev-btn {
  background: #f5f5f5;
  color: #666;
}

.auth-btn {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

button:active {
  transform: scale(0.98);
}
</style>

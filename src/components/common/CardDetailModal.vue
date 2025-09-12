<template>
  <view v-if="visible" class="modal-overlay" @click="closeModal">
    <view class="modal-container" @click.stop>
      <view class="modal-header">
        <text class="modal-title">信用卡详情</text>
        <text class="close-btn" @click="closeModal">×</text>
      </view>
      
      <view class="modal-content">
        <!-- 卡片预览 -->
        <view class="card-preview" :style="{ background: (cardInfo && cardInfo.cardColor) || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }">
          <view class="preview-header">
            <view class="card-brand">
              <text class="brand-text">{{ (cardInfo && cardInfo.bankName) || '未知银行' }}</text>
            </view>
            <view class="card-type">
              <text class="type-text">{{ (cardInfo && cardInfo.cardType) || '信用卡' }}</text>
            </view>
          </view>
          
          <view class="card-number">
            <text class="number-text">{{ formatCardNumber(cardInfo && cardInfo.cardNumber) }}</text>
          </view>
          
          <view class="card-footer">
            <view class="card-holder">
              <text class="holder-label">持卡人</text>
              <text class="holder-name">李华</text>
            </view>
            <view class="card-status">
              <text class="status-text">{{ getStatusText(cardInfo && cardInfo.status) }}</text>
            </view>
          </view>
        </view>

        <!-- 基本信息 -->
        <view class="detail-section">
          <text class="section-title">基本信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">银行名称</text>
              <text class="info-value">{{ (cardInfo && cardInfo.bankName) || '未知银行' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">卡片类型</text>
              <text class="info-value">{{ (cardInfo && cardInfo.cardType) || '信用卡' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">卡号</text>
              <text class="info-value">{{ formatCardNumber(cardInfo && cardInfo.cardNumber) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">状态</text>
              <text class="info-value">{{ getStatusText(cardInfo && cardInfo.status) }}</text>
            </view>
          </view>
        </view>

        <!-- 额度信息 -->
        <view class="detail-section">
          <text class="section-title">额度信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">授信额度</text>
              <text class="info-value">{{ formatCurrency(cardInfo && cardInfo.creditLimit) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">可用额度</text>
              <text class="info-value available">{{ formatCurrency(cardInfo && cardInfo.availableCredit) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">当前欠款</text>
              <text class="info-value debt">{{ formatCurrency(cardInfo && cardInfo.currentBalance) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">已用额度</text>
              <text class="info-value">{{ formatCurrency((cardInfo && cardInfo.creditLimit) - (cardInfo && cardInfo.availableCredit)) }}</text>
            </view>
          </view>
        </view>

        <!-- 账单信息 -->
        <view class="detail-section">
          <text class="section-title">账单信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">账单日</text>
              <text class="info-value">每月15日</text>
            </view>
            <view class="info-item">
              <text class="info-label">还款日</text>
              <text class="info-value">每月3日</text>
            </view>
            <view class="info-item">
              <text class="info-label">最低还款额</text>
              <text class="info-value">{{ formatCurrency((cardInfo && cardInfo.currentBalance) * 0.1) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">免息期</text>
              <text class="info-value">最长50天</text>
            </view>
          </view>
        </view>

        <!-- 安全功能 -->
        <view class="detail-section">
          <text class="section-title">安全功能</text>
          <view class="security-features">
            <view class="feature-item">
              <text class="feature-icon">📱</text>
              <text class="feature-text">短信通知</text>
              <text class="feature-status" :class="{ active: cardInfo && cardInfo.securityFeatures?.smsNotification }">
                {{ (cardInfo && cardInfo.securityFeatures?.smsNotification) ? '已开启' : '未开启' }}
              </text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">📧</text>
              <text class="feature-text">邮件通知</text>
              <text class="feature-status" :class="{ active: cardInfo && cardInfo.securityFeatures?.emailNotification }">
                {{ (cardInfo && cardInfo.securityFeatures?.emailNotification) ? '已开启' : '未开启' }}
              </text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">🔒</text>
              <text class="feature-text">生物识别</text>
              <text class="feature-status" :class="{ active: cardInfo && cardInfo.securityFeatures?.biometricAuth }">
                {{ (cardInfo && cardInfo.securityFeatures?.biometricAuth) ? '已开启' : '未开启' }}
              </text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">💰</text>
              <text class="feature-text">交易限额</text>
              <text class="feature-status">
                {{ formatCurrency((cardInfo && cardInfo.securityFeatures?.transactionLimit) || 5000) }}
              </text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="btn-secondary" @click="handleManage">管理卡片</button>
        <button class="btn-primary" @click="handleRepay">立即还款</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CardDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cardInfo: {
      type: Object,
      default: () => ({
        cardColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        bankName: '未知银行',
        cardType: '信用卡',
        cardNumber: '0000000000000000',
        status: 'active',
        creditLimit: 0,
        availableCredit: 0,
        currentBalance: 0,
        billDate: 15,
        repaymentDate: 3,
        securityFeatures: {
          smsNotification: false,
          emailNotification: false,
          biometricAuth: false,
          transactionLimit: 5000
        }
      })
    },
    balanceVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    formatCurrency(amount) {
      if (!this.balanceVisible) return '****'
      return `¥${(amount || 0).toLocaleString()}`
    },
    formatCardNumber(cardNumber) {
      if (!this.balanceVisible) {
        return '**** **** **** ****'
      }
      // 处理空值情况
      if (!cardNumber) {
        return '0000 0000 0000 0000'
      }
      // 显示完整卡号，每4位用空格分隔
      return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    handleRepay() {
      this.$emit('repay', this.cardInfo)
    },
    handleManage() {
      this.$emit('manage', this.cardInfo)
    },
    getStatusText(status) {
      const statusMap = {
        'active': '正常',
        'frozen': '冻结',
        'expired': '过期',
        'cancelled': '注销'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
/* 🎨 清新简约风设计 */
.modal-overlay {
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
  backdrop-filter: blur(10rpx);
}

.modal-container {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 85vh;
  overflow: hidden;
  border: 1rpx solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 20rpx 60rpx rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(59, 130, 246, 0.1);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e40af;
}

.close-btn {
  font-size: 40rpx;
  color: #3b82f6;
  cursor: pointer;
}

.modal-content {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* 卡片预览 - 清新风格 */
.card-preview {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  color: white;
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.2);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-brand, .card-type {
  display: flex;
  flex-direction: column;
}

.brand-text, .type-text {
  font-size: 24rpx;
  font-weight: 500;
  opacity: 0.9;
}

.card-number {
  margin-bottom: 20rpx;
  text-align: center;
}

.number-text {
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-holder {
  display: flex;
  flex-direction: column;
}

.holder-label {
  font-size: 20rpx;
  opacity: 0.8;
}

.holder-name {
  font-size: 24rpx;
  font-weight: 600;
}

.card-status {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.2);
}

.status-text {
  font-size: 20rpx;
  color: white;
  font-weight: 600;
}

.detail-section {
  background: rgba(240, 249, 255, 0.8);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 20rpx;
  display: block;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 12rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
}

.info-label {
  font-size: 22rpx;
  color: #3b82f6;
  margin-bottom: 6rpx;
}

.info-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e40af;
}

.info-value.available {
  color: #059669;
}

.info-value.debt {
  color: #dc2626;
}

.security-features {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.1);
}

.feature-icon {
  font-size: 24rpx;
  margin-right: 16rpx;
  color: #3b82f6;
}

.feature-text {
  flex: 1;
  font-size: 24rpx;
  color: #1e40af;
}

.feature-status {
  font-size: 22rpx;
  color: #3b82f6;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: rgba(59, 130, 246, 0.1);
  border: 1rpx solid rgba(59, 130, 246, 0.2);
}

.feature-status.active {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  border-color: rgba(5, 150, 105, 0.3);
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0 0 24rpx 24rpx;
  flex-shrink: 0;
}

.btn-secondary, .btn-primary {
  flex: 1;
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1rpx solid rgba(107, 114, 128, 0.2);
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.4);
  transform: translateY(-2rpx);
}

/* 🎨 新增样式内容 - 动画效果和交互增强 */

/* 模态框进入动画 */
.modal-container {
  animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: translateY(50rpx) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 卡片预览增强效果 */
.card-preview {
  position: relative;
  overflow: hidden;
}

.card-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.card-preview:hover::before {
  left: 100%;
}

/* 详情区域进入动画 */
.detail-section {
  animation: sectionFadeIn 0.6s ease-out both;
}

.detail-section:nth-child(1) { animation-delay: 0.1s; }
.detail-section:nth-child(2) { animation-delay: 0.2s; }
.detail-section:nth-child(3) { animation-delay: 0.3s; }
.detail-section:nth-child(4) { animation-delay: 0.4s; }

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 信息项增强效果 */
.info-item {
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.1);
}

/* 安全功能项增强效果 */
.feature-item {
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(4rpx);
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.1);
}

/* 按钮增强效果 */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

/* 脉冲效果 */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10rpx rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 摇摆效果 */
.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5rpx);
  }
  75% {
    transform: translateX(5rpx);
  }
}

/* 弹跳效果 */
.bounce {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-10rpx);
  }
  70% {
    transform: translateY(-5rpx);
  }
  90% {
    transform: translateY(-2rpx);
  }
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 发光文字效果 */
.glow-text {
  text-shadow: 0 0 10rpx rgba(59, 130, 246, 0.5);
}

/* 3D效果 */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.card-3d:hover {
  transform: rotateY(5deg) rotateX(5deg);
}

/* 悬浮效果 */
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

/* 波浪效果 */
.wave {
  position: relative;
  overflow: hidden;
}

.wave::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: waveMove 2s infinite;
}

@keyframes waveMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 粒子效果 */
.particles {
  position: relative;
}

.particles::before,
.particles::after {
  content: '';
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: particleFloat 4s infinite;
}

.particles::before {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particles::after {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20rpx) scale(1.2);
    opacity: 1;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: rgba(255, 255, 255, 0.98);
    border: 1rpx solid rgba(59, 130, 246, 0.2);
  }
  
  .card-preview {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  }
  
  .detail-section {
    background: rgba(30, 41, 59, 0.8);
    border: 1rpx solid rgba(59, 130, 246, 0.2);
  }
  
  .info-item {
    background: rgba(30, 41, 59, 0.8);
    border: 1rpx solid rgba(59, 130, 246, 0.1);
  }
  
  .feature-item {
    background: rgba(30, 41, 59, 0.8);
    border: 1rpx solid rgba(59, 130, 246, 0.2);
  }
}
</style>
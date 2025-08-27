<template>
  <view class="recharge-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">手机充值</text>
      <text class="header-subtitle">话费流量一键充值</text>
    </view>

    <!-- 充值表单 -->
    <view class="recharge-form">
      <view class="form-section">
        <view class="phone-input-section">
          <view class="input-row">
            <input 
              class="phone-input" 
              v-model="rechargeForm.phone"
              placeholder="请输入手机号码"
              type="number"
              maxlength="11"
              @input="onPhoneInput"
            />
            <button class="contacts-btn" @tap="selectFromContacts">📞</button>
          </view>
          
          <view class="carrier-info" v-if="carrierInfo.name">
            <text class="carrier-name">{{ carrierInfo.name }}</text>
            <text class="carrier-location">{{ carrierInfo.location }}</text>
          </view>
        </view>

        <!-- 充值类型选择 -->
        <view class="recharge-types">
          <view class="type-tabs">
            <view 
              class="tab-item" 
              v-for="(type, index) in rechargeTypes" 
              :key="index"
              :class="{ active: activeType === index }"
              @tap="switchType(index)"
            >
              <text class="tab-text">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <!-- 金额选择 -->
        <view class="amount-section">
          <view class="amount-grid">
            <view 
              class="amount-item" 
              v-for="(amount, index) in currentAmounts" 
              :key="index"
              :class="{ selected: selectedAmount === amount.value }"
              @tap="selectAmount(amount)"
            >
              <text class="amount-value">¥{{ amount.value }}</text>
              <text class="amount-desc" v-if="amount.desc">{{ amount.desc }}</text>
              <view class="discount-tag" v-if="amount.discount">
                <text class="discount-text">{{ amount.discount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 自定义金额 -->
        <view class="custom-amount">
          <text class="custom-label">自定义金额</text>
          <input 
            class="custom-input" 
            v-model="customAmount"
            placeholder="输入其他金额"
            type="digit"
            @input="onCustomAmountInput"
          />
        </view>
      </view>

      <!-- 充值按钮 -->
      <view class="recharge-actions">
        <button class="recharge-btn" @tap="submitRecharge" :disabled="!canSubmit">
          立即充值 ¥{{ finalAmount }}
        </button>
      </view>
    </view>

    <!-- 充值记录 -->
    <view class="recharge-history">
      <view class="history-header">
        <text class="history-title">最近充值记录</text>
        <text class="view-all" @tap="viewAllHistory">查看全部</text>
      </view>
      
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="(record, index) in rechargeHistory" 
          :key="index"
        >
          <view class="record-info">
            <text class="record-phone">{{ record.phone }}</text>
            <text class="record-time">{{ record.time }}</text>
          </view>
          <view class="record-amount">
            <text class="amount">¥{{ record.amount }}</text>
            <text class="status">{{ record.status }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mobileRecharge } from '@/api/life'

export default {
  name: 'RechargePage',
  data() {
    return {
      activeType: 0,
      selectedAmount: null,
      customAmount: '',
      rechargeForm: {
        phone: ''
      },
      carrierInfo: {
        name: '',
        location: ''
      },
      rechargeTypes: [
        { label: '话费充值', type: 'phone' },
        { label: '流量充值', type: 'data' }
      ],
      phoneAmounts: [
        { value: 10, desc: '话费' },
        { value: 20, desc: '话费' },
        { value: 30, desc: '话费' },
        { value: 50, desc: '话费', discount: '95折' },
        { value: 100, desc: '话费', discount: '95折' },
        { value: 200, desc: '话费', discount: '9折' }
      ],
      dataAmounts: [
        { value: 10, desc: '1GB流量包' },
        { value: 20, desc: '3GB流量包' },
        { value: 30, desc: '5GB流量包' },
        { value: 50, desc: '10GB流量包', discount: '送2GB' },
        { value: 100, desc: '30GB流量包', discount: '送10GB' },
        { value: 150, desc: '50GB流量包', discount: '送20GB' }
      ],
      rechargeHistory: [
        {
          phone: '138****8888',
          amount: '50',
          time: '2024-01-15 14:30',
          status: '成功'
        },
        {
          phone: '139****9999',
          amount: '100',
          time: '2024-01-10 09:15',
          status: '成功'
        }
      ]
    }
  },
  
  computed: {
    currentAmounts() {
      return this.activeType === 0 ? this.phoneAmounts : this.dataAmounts
    },
    
    finalAmount() {
      return this.selectedAmount || this.customAmount || 0
    },
    
    canSubmit() {
      return this.rechargeForm.phone.length === 11 && this.finalAmount > 0
    }
  },
  
  methods: {
    onPhoneInput() {
      if (this.rechargeForm.phone.length === 11) {
        this.getCarrierInfo()
      } else {
        this.carrierInfo = { name: '', location: '' }
      }
    },
    
    getCarrierInfo() {
      // 模拟获取运营商信息
      const phone = this.rechargeForm.phone
      const prefix = phone.substring(0, 3)
      
      let carrier = ''
      if (['130', '131', '132', '155', '156', '185', '186'].includes(prefix)) {
        carrier = '中国联通'
      } else if (['134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '182', '183', '184', '187', '188'].includes(prefix)) {
        carrier = '中国移动'
      } else if (['133', '153', '180', '181', '189'].includes(prefix)) {
        carrier = '中国电信'
      }
      
      this.carrierInfo = {
        name: carrier,
        location: '黑龙江 牡丹江'
      }
    },
    
    switchType(index) {
      this.activeType = index
      this.selectedAmount = null
      this.customAmount = ''
    },
    
    selectAmount(amount) {
      this.selectedAmount = amount.value
      this.customAmount = ''
    },
    
    onCustomAmountInput() {
      this.selectedAmount = null
    },
    
    selectFromContacts() {
      // 模拟从通讯录选择
      uni.showActionSheet({
        itemList: ['138****8888', '139****9999', '137****7777'],
        success: (res) => {
          const phones = ['13812348888', '13912349999', '13712347777']
          this.rechargeForm.phone = phones[res.tapIndex]
          this.getCarrierInfo()
        }
      })
    },
    
    async submitRecharge() {
      if (!this.canSubmit) return
      
      try {
        uni.showLoading({ title: '充值中...' })
        
        await mobileRecharge({
          phone: this.rechargeForm.phone,
          amount: this.finalAmount,
          type: this.rechargeTypes[this.activeType].type
        })
        
        uni.showToast({
          title: '充值成功',
          icon: 'success'
        })
        
        // 添加到充值记录
        this.rechargeHistory.unshift({
          phone: this.rechargeForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          amount: this.finalAmount.toString(),
          time: new Date().toLocaleString(),
          status: '成功'
        })
        
        // 清空表单
        this.rechargeForm.phone = ''
        this.selectedAmount = null
        this.customAmount = ''
        this.carrierInfo = { name: '', location: '' }
        
      } catch (error) {
        uni.showToast({
          title: '充值失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    viewAllHistory() {
      uni.navigateTo({
        url: '/pages/recharge-history/recharge-history'
      })
    }
  }
}
</script>

<style scoped>
.recharge-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.page-header {
  background: linear-gradient(135deg, #FF9500 0%, #FF7A00 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.recharge-form {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 40rpx 30rpx;
}

.phone-input-section {
  margin-bottom: 40rpx;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.phone-input {
  flex: 1;
  padding: 28rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 12rpx;
  font-size: 32rpx;
  text-align: center;
  font-weight: 600;
}

.phone-input:focus {
  border-color: #FF9500;
}

.contacts-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: #F0F0F0;
  border: none;
  font-size: 32rpx;
}

.carrier-info {
  text-align: center;
  padding: 20rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
}

.carrier-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-right: 20rpx;
}

.carrier-location {
  font-size: 24rpx;
  color: #999;
}

.recharge-types {
  margin-bottom: 40rpx;
}

.type-tabs {
  display: flex;
  background: #F0F0F0;
  border-radius: 12rpx;
  padding: 6rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: #FF9500;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #fff;
}

.amount-section {
  margin-bottom: 40rpx;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.amount-item {
  position: relative;
  padding: 30rpx 20rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 12rpx;
  text-align: center;
  background: #FAFAFA;
  transition: all 0.3s ease;
}

.amount-item.selected {
  border-color: #FF9500;
  background: #FFF8F0;
}

.amount-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.amount-desc {
  font-size: 22rpx;
  color: #999;
}

.discount-tag {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #FF3B30;
  border-radius: 20rpx;
  padding: 4rpx 12rpx;
}

.discount-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.custom-amount {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.custom-label {
  font-size: 28rpx;
  color: #666;
  white-space: nowrap;
}

.custom-input {
  flex: 1;
  padding: 24rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 12rpx;
  font-size: 28rpx;
  text-align: center;
}

.custom-input:focus {
  border-color: #FF9500;
}

.recharge-actions {
  padding: 30rpx;
  background: #F8F8F8;
}

.recharge-btn {
  width: 100%;
  padding: 32rpx;
  border-radius: 12rpx;
  background: #FF9500;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
}

.recharge-btn[disabled] {
  background: #CCCCCC;
  color: #999;
}

.recharge-history {
  background: #fff;
  margin: 0 30rpx 100rpx;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #F0F0F0;
}

.history-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.view-all {
  font-size: 26rpx;
  color: #FF9500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-radius: 12rpx;
  background: #FAFAFA;
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-phone {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  text-align: right;
}

.amount {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.status {
  font-size: 22rpx;
  color: #FF9500;
}

/* 点击效果 */
.amount-item:active,
.recharge-btn:active,
.contacts-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
  transition: all 0.1s ease;
}
</style>
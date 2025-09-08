<template>
  <view class="transfer-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">转账汇款</text>
      <view class="nav-right" @click="showTransferTips">
        <text class="help-icon">?</text>
      </view>
    </view>

    <!-- 账户余额显示 -->
    <view class="balance-card">
      <view class="balance-header">
        <view class="balance-icon">💰</view>
        <text class="balance-label">我的账户</text>
      </view>
      <view class="balance-info">
        <text class="balance-amount">¥{{ userBalance.toFixed(2) }}</text>
        <text class="balance-subtitle">可用余额</text>
      </view>
      <view class="balance-footer">
        <view class="limit-info">
          <text class="limit-label">单笔限额</text>
          <text class="limit-amount">¥{{ transferLimit.toLocaleString() }}</text>
        </view>
        <view class="refresh-btn" @click="refreshBalance">
          <text class="refresh-icon">🔄</text>
        </view>
      </view>
    </view>

    <!-- 转账类型选择 -->
    <view class="transfer-types">
      <view class="type-item" :class="{ active: currentTab === 'account' }" @click="switchTab('account')">
        <view class="type-icon">🏦</view>
        <text class="type-text">账号转账</text>
        <text class="type-desc">输入银行账号</text>
      </view>
      <view class="type-item" :class="{ active: currentTab === 'phone' }" @click="switchTab('phone')">
        <view class="type-icon">📱</view>
        <text class="type-text">手机号转账</text>
        <text class="type-desc">输入手机号码</text>
      </view>
    </view>

    <!-- 常用联系人 -->
    <view class="frequent-contacts" v-if="frequentContacts.length > 0">
      <view class="section-header">
        <text class="section-title">常用联系人</text>
        <text class="section-more" @click="showAllContacts">查看全部</text>
      </view>
      <scroll-view class="contacts-scroll" scroll-x="true">
        <view class="contacts-list">
          <view 
            class="contact-item" 
            v-for="contact in frequentContacts.slice(0, 5)" 
            :key="contact.id"
            @click="selectContact(contact)"
          >
            <view class="contact-avatar">{{ contact.name.charAt(0) }}</view>
            <text class="contact-name">{{ contact.name }}</text>
            <text class="contact-bank">{{ contact.bank }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 转账表单 -->
    <view class="transfer-form">
      <!-- 账号转账表单 -->
      <view v-if="currentTab === 'account'" class="form-content">
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">🏦</text>
            <text class="form-label">收款方账号</text>
          </view>
          <input class="form-input" placeholder="请输入收款方银行账号" v-model="accountForm.account" />
        </view>
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">👤</text>
            <text class="form-label">收款人姓名</text>
          </view>
          <input class="form-input" placeholder="请输入收款人真实姓名" v-model="accountForm.name" />
        </view>
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">💰</text>
            <text class="form-label">转账金额</text>
          </view>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input class="form-input amount-input" type="digit" placeholder="0.00" v-model="accountForm.amount" />
          </view>
        </view>
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">📝</text>
            <text class="form-label">转账附言</text>
            <text class="form-optional">（选填）</text>
          </view>
          <input class="form-input" placeholder="不超过20个字" v-model="accountForm.remark" maxlength="20" />
        </view>
      </view>

      <!-- 手机号转账表单 -->
      <view v-if="currentTab === 'phone'" class="form-content">
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">📱</text>
            <text class="form-label">收款人手机号</text>
          </view>
          <input class="form-input" type="number" placeholder="请输入11位手机号码" v-model="phoneForm.phone" />
        </view>
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">💰</text>
            <text class="form-label">转账金额</text>
          </view>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input class="form-input amount-input" type="digit" placeholder="0.00" v-model="phoneForm.amount" />
          </view>
        </view>
        <view class="form-item">
          <view class="form-label-wrapper">
            <text class="form-icon">📝</text>
            <text class="form-label">转账附言</text>
            <text class="form-optional">（选填）</text>
          </view>
          <input class="form-input" placeholder="不超过20个字" v-model="phoneForm.remark" maxlength="20" />
        </view>
      </view>

      <!-- 转账按钮 -->
      <button class="transfer-btn" @click="submitTransfer" :disabled="isProcessing">
        <text class="btn-icon">{{ isProcessing ? '⏳' : '💸' }}</text>
        <text class="btn-text">{{ isProcessing ? '处理中...' : '确认转账' }}</text>
      </button>
    </view>

    <!-- 其他功能 -->
    <view class="other-functions">
      <view class="function-item" @click="goToTransferHistory">
        <view class="function-left">
          <text class="function-icon">📋</text>
          <text class="function-text">转账记录</text>
        </view>
        <text class="arrow-right">></text>
      </view>
      <view class="function-item" @click="goToTransferSettings">
        <view class="function-left">
          <text class="function-icon">⚙️</text>
          <text class="function-text">转账设置</text>
        </view>
        <text class="arrow-right">></text>
      </view>
    </view>

    <!-- 交易密码验证弹窗 -->
    <PaymentPasswordModal
      :visible="showPasswordModal"
      :amount="transferAmount"
      :payee="transferPayee"
      :description="transferDescription"
      @payment-confirmed="onPaymentConfirmed"
      @close="closePasswordModal"
    />
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'
import { transfer, phoneTransfer, validatePayee, getTransferLimit } from '@/api/transfer.js'
import { deductBalance, checkBalanceSufficient, getUserBalance } from '@/api/balance.js'
import PaymentPasswordModal from '@/components/common/PaymentPasswordModal.vue'

export default {
  components: {
    PaymentPasswordModal
  },
  data() {
    return {
      currentTab: 'account', // 默认选择账号转账
      accountForm: {
        account: '',
        name: '',
        amount: '',
        remark: ''
      },
      phoneForm: {
        phone: '',
        amount: '',
        remark: ''
      },
      isProcessing: false, // 转账处理状态
      transferLimit: 50000, // 默认转账限额
      userBalance: 0, // 用户余额
      showPasswordModal: false, // 显示交易密码弹窗
      transferAmount: 0, // 转账金额
      transferPayee: '', // 收款方
      transferDescription: '', // 转账说明
      transferRecords: [], // 转账记录
      frequentContacts: [], // 常用联系人
      showHistory: false // 显示历史记录
    }
  },
  
  mounted() {
    // 页面加载完成
    this.loadTransferData()
  },
  
  onShow() {
    try {
      // 检查登录状态
      if (!forceCheckLogin()) {
        console.log('转账页面：用户未登录，跳转到登录页面')
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
        return
      }
      
      // 加载转账数据
      this.loadTransferData()
      
      // 获取转账限额
      this.getTransferLimit()
    } catch (error) {
      console.error('转账页面onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  },
  
  methods: {
    // 加载转账数据
    loadTransferData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser) {
          this.userBalance = currentUser.balance || 0
          this.transferRecords = currentUser.transferRecords || []
          this.frequentContacts = currentUser.frequentContacts || []
          this.transferLimit = currentUser.securitySettings?.transactionLimit || 50000
        }
      } catch (error) {
        console.error('加载转账数据失败:', error)
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 选择常用联系人
    selectContact(contact) {
      this.accountForm.account = contact.account
      this.accountForm.name = contact.name
      uni.showToast({
        title: `已选择${contact.name}`,
        icon: 'success'
      })
    },

    // 显示所有联系人
    showAllContacts() {
      uni.navigateTo({
        url: '/pages/transfer/contacts'
      })
    },

    // 显示转账提示
    showTransferTips() {
      uni.showModal({
        title: '转账提示',
        content: '请确保收款人信息准确无误，转账后无法撤销。建议先小额测试。',
        showCancel: false,
        confirmText: '我知道了'
      })
    },
    
    // 刷新余额
    async refreshBalance() {
      uni.showLoading({ title: '刷新中...' })
      try {
        await this.getUserBalance()
        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        })
      } catch (error) {
        uni.showToast({
          title: '刷新失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 切换转账类型
    switchTab(tab) {
      this.currentTab = tab
    },
    
    // 获取转账限额
    getTransferLimit() {
      // 在实际环境中调用API，这里使用模拟数据
      // 模拟API调用延迟
      setTimeout(() => {
        // 可以从本地存储获取模拟的限额
        const savedLimit = uni.getStorageSync('transferLimit')
        if (savedLimit) {
          this.transferLimit = savedLimit
        }
        console.log('转账限额:', this.transferLimit)
      }, 300)
    },
    
    // 获取用户余额
    async getUserBalance() {
      try {
        const balance = await getUserBalance()
        this.userBalance = balance
        console.log('获取用户余额成功:', balance)
      } catch (error) {
        console.error('获取用户余额失败:', error)
        this.userBalance = 0
      }
    },
    
    // 验证转账金额
    async validateAmount(amount) {
      const numAmount = parseFloat(amount)
      
      // 检查是否为有效数字
      if (isNaN(numAmount) || numAmount <= 0) {
        uni.showToast({
          title: '请输入有效的转账金额',
          icon: 'none'
        })
        return false
      }
      
      // 检查是否超过限额
      if (numAmount > this.transferLimit) {
        uni.showToast({
          title: `转账金额不能超过${this.transferLimit}元`,
          icon: 'none'
        })
        return false
      }
      
      // 检查余额是否足够
      try {
        const isSufficient = await checkBalanceSufficient(numAmount)
        if (!isSufficient) {
          uni.showToast({
            title: '余额不足，请检查账户余额',
            icon: 'none'
          })
          return false
        }
      } catch (error) {
        console.error('检查余额失败:', error)
        uni.showToast({
          title: '检查余额失败，请重试',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 提交转账
    async submitTransfer() {
      // 标记为处理中状态
      this.isProcessing = true
      
      try {
        if (this.currentTab === 'account') {
          if (!this.accountForm.account || !this.accountForm.name || !this.accountForm.amount) {
            uni.showToast({
              title: '请填写完整信息',
              icon: 'none'
            })
            this.isProcessing = false
            return
          }
          
          // 验证转账金额
          const isValidAmount = await this.validateAmount(this.accountForm.amount)
          if (!isValidAmount) {
            this.isProcessing = false
            return
          }
          
          // 显示交易密码验证弹窗
          this.transferAmount = parseFloat(this.accountForm.amount)
          this.transferPayee = this.accountForm.name
          this.transferDescription = `向账号${this.accountForm.account}转账`
          this.showPasswordModal = true
        } else {
          if (!this.phoneForm.phone || !this.phoneForm.amount) {
            uni.showToast({
              title: '请填写完整信息',
              icon: 'none'
            })
            this.isProcessing = false
            return
          }
          
          // 验证转账金额
          const isValidAmount = await this.validateAmount(this.phoneForm.amount)
          if (!isValidAmount) {
            this.isProcessing = false
            return
          }
          
          // 显示交易密码验证弹窗
          this.transferAmount = parseFloat(this.phoneForm.amount)
          this.transferPayee = this.phoneForm.phone
          this.transferDescription = `向手机号${this.phoneForm.phone}转账`
          this.showPasswordModal = true
        }
      } catch (error) {
        console.error('转账过程中出错:', error)
        uni.showToast({
          title: '转账失败，请重试',
          icon: 'none'
        })
        this.isProcessing = false
      }
    },
    
    // 验证收款人信息
    async verifyPayeeInfo(account, name) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 在实际环境中调用API验证收款人
        // const result = await validatePayee(account, name)
        
        // 模拟验证成功
        console.log('收款人信息验证成功')
        
        // 执行账号转账
        await this.processAccountTransfer()
      } catch (error) {
        console.error('验证收款人信息失败:', error)
        uni.showToast({
          title: '收款人信息验证失败',
          icon: 'none'
        })
        this.isProcessing = false
      }
    },
    
    // 处理账号转账
    async processAccountTransfer() {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 构造转账信息
        const transferInfo = {
          account: this.accountForm.account,
          name: this.accountForm.name,
          amount: parseFloat(this.accountForm.amount),
          remark: this.accountForm.remark,
          timestamp: new Date().getTime()
        }
        
        // 在实际环境中调用API
        // const result = await transfer(transferInfo)
        
        // 模拟转账成功，更新余额
        this.updateUserBalance(parseFloat(this.accountForm.amount))
        
        // 保存转账记录
        this.saveTransferRecord({
          type: 'account',
          ...transferInfo,
          status: 'success',
          transactionId: 'TX' + Date.now() + Math.random().toString(36).substr(2, 9)
        })
        
        // 显示转账成功提示
        uni.showToast({
          title: '转账成功',
          icon: 'success'
        })
        
        // 清空表单
        this.accountForm = {
          account: '',
          name: '',
          amount: '',
          remark: ''
        }
      } catch (error) {
        console.error('账号转账失败:', error)
        // 保存转账失败记录
        this.saveTransferRecord({
          type: 'account',
          account: this.accountForm.account,
          name: this.accountForm.name,
          amount: parseFloat(this.accountForm.amount),
          remark: this.accountForm.remark,
          timestamp: new Date().getTime(),
          status: 'failed',
          errorMsg: '转账失败，请重试',
          transactionId: 'TX' + Date.now() + Math.random().toString(36).substr(2, 9)
        })
        
        uni.showToast({
          title: '转账失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isProcessing = false
      }
    },
    
    // 处理手机号转账
    async processPhoneTransfer() {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 构造转账信息
        const transferInfo = {
          phone: this.phoneForm.phone,
          amount: parseFloat(this.phoneForm.amount),
          remark: this.phoneForm.remark,
          timestamp: new Date().getTime()
        }
        
        // 在实际环境中调用API
        // const result = await phoneTransfer(transferInfo)
        
        // 模拟转账成功，更新余额
        this.updateUserBalance(parseFloat(this.phoneForm.amount))
        
        // 保存转账记录
        this.saveTransferRecord({
          type: 'phone',
          ...transferInfo,
          status: 'success',
          transactionId: 'TX' + Date.now() + Math.random().toString(36).substr(2, 9)
        })
        
        // 显示转账成功提示
        uni.showToast({
          title: '转账成功',
          icon: 'success'
        })
        
        // 清空表单
        this.phoneForm = {
          phone: '',
          amount: '',
          remark: ''
        }
      } catch (error) {
        console.error('手机号转账失败:', error)
        // 保存转账失败记录
        this.saveTransferRecord({
          type: 'phone',
          phone: this.phoneForm.phone,
          amount: parseFloat(this.phoneForm.amount),
          remark: this.phoneForm.remark,
          timestamp: new Date().getTime(),
          status: 'failed',
          errorMsg: '转账失败，请重试',
          transactionId: 'TX' + Date.now() + Math.random().toString(36).substr(2, 9)
        })
        
        uni.showToast({
          title: '转账失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isProcessing = false
      }
    },
    
    // 更新用户余额
    updateUserBalance(amount) {
      this.userBalance -= amount
      // 保存余额到本地存储
      uni.setStorageSync('userBalance', this.userBalance)
    },
    
    // 保存转账记录
    saveTransferRecord(record) {
      try {
        // 获取现有记录
        const records = uni.getStorageSync('transferRecords') || []
        // 添加新记录到开头
        records.unshift(record)
        // 只保留最近100条记录
        if (records.length > 100) {
          records.splice(100)
        }
        // 保存回本地存储
        uni.setStorageSync('transferRecords', records)
        console.log('转账记录已保存')
      } catch (error) {
        console.error('保存转账记录失败:', error)
      }
    },
    
    // 跳转到转账记录
    goToTransferHistory() {
      // 在实际项目中应该跳转到转账记录页面
      // 这里我们可以创建一个临时的转账记录页面
      uni.navigateTo({
        url: '/pages/transfer/history' // 假设我们创建了这个页面
      })
    },
    
    // 跳转到转账设置
    goToTransferSettings() {
      // 在实际项目中应该跳转到转账设置页面
      uni.showToast({
        title: '跳转到转账设置页面',
        icon: 'none'
      })
    },
    
    // 交易密码验证成功
    async onPaymentConfirmed(paymentData) {
      try {
        this.isProcessing = true
        
        // 扣除余额
        const deductResult = await deductBalance(
          this.transferAmount, 
          this.transferDescription
        )
        
        if (!deductResult.success) {
          uni.showToast({
            title: deductResult.message,
            icon: 'none'
          })
          this.isProcessing = false
          return
        }
        
        // 更新本地余额显示
        this.userBalance = deductResult.newBalance
        
        // 执行转账记录保存
        if (this.currentTab === 'account') {
          await this.processAccountTransfer()
        } else {
          await this.processPhoneTransfer()
        }
        
        this.isProcessing = false
        this.closePasswordModal()
        
        // 显示转账成功提示
        uni.showToast({
          title: `转账成功，余额：¥${deductResult.newBalance.toFixed(2)}`,
          icon: 'success',
          duration: 3000
        })
        
        // 清空表单
        this.clearForms()
        
      } catch (error) {
        console.error('转账处理失败:', error)
        this.isProcessing = false
        uni.showToast({
          title: '转账失败，请重试',
          icon: 'none'
        })
      }
    },
    
    // 关闭交易密码弹窗
    closePasswordModal() {
      this.showPasswordModal = false
      this.isProcessing = false
    },
    
    // 清空表单
    clearForms() {
      this.accountForm = {
        account: '',
        name: '',
        amount: '',
        remark: ''
      }
      this.phoneForm = {
        phone: '',
        amount: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped>
.transfer-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 顶部导航 */
.nav-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-left, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.nav-left:active, .nav-right:active {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(0.95);
}

.back-icon, .help-icon {
  font-size: 32rpx;
  color: #667eea;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  flex: 1;
  text-align: center;
  color: #333;
}

/* 账户余额卡片 */
.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 20rpx;
  padding: 40rpx;
  border-radius: 24rpx;
  color: white;
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.balance-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.balance-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
}

.balance-label {
  font-size: 28rpx;
  opacity: 0.9;
  font-weight: 500;
}

.balance-info {
  margin-bottom: 30rpx;
}

.balance-amount {
  font-size: 56rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.balance-subtitle {
  font-size: 24rpx;
  opacity: 0.8;
}

.balance-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-info {
  display: flex;
  flex-direction: column;
}

.limit-label {
  font-size: 22rpx;
  opacity: 0.8;
  margin-bottom: 4rpx;
}

.limit-amount {
  font-size: 26rpx;
  font-weight: 600;
}

.refresh-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.refresh-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.refresh-icon {
  font-size: 28rpx;
}

/* 转账类型选择 */
.transfer-types {
  display: flex;
  background-color: #fff;
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  padding: 8rpx;
}

.type-item {
  flex: 1;
  padding: 30rpx 20rpx;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.type-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.type-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
}

.type-text {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}

.type-desc {
  font-size: 22rpx;
  opacity: 0.7;
}

/* 常用联系人 */
.frequent-contacts {
  background-color: #fff;
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 28rpx;
  color: #007AFF;
}

.contacts-scroll {
  white-space: nowrap;
}

.contacts-list {
  display: flex;
  gap: 20rpx;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  min-width: 120rpx;
  cursor: pointer;
}

.contact-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #007AFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.contact-name {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.contact-bank {
  font-size: 20rpx;
  color: #666;
}

/* 转账表单 */
.transfer-form {
  background-color: #fff;
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.form-content {
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.form-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  color: #667eea;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.form-optional {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  background-color: #fafafa;
  color: #333;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
  background-color: #fff;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 24rpx;
  font-size: 30rpx;
  color: #667eea;
  font-weight: bold;
  z-index: 1;
}

.amount-input {
  padding-left: 60rpx !important;
  font-size: 32rpx !important;
  font-weight: 600;
}

.transfer-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.transfer-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
}

.transfer-btn:disabled {
  background: #e0e0e0;
  color: #999;
  box-shadow: none;
  transform: none;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
}

/* 其他功能 */
.other-functions {
  background-color: #fff;
  margin: 0 20rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item:active {
  background-color: #f8f9ff;
  transform: scale(0.98);
}

.function-left {
  display: flex;
  align-items: center;
}

.function-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #667eea;
}

.function-text {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.arrow-right {
  color: #ccc;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
<template>
  <view class="transfer-page">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="themeStyles.primaryGradient">
      <text class="nav-title">转账</text>
      <view class="nav-actions">
        <SimpleThemeSwitcher />
      </view>
    </view>

    <!-- 账户余额显示 -->
    <view class="balance-card" :style="themeStyles.primaryGradient">
      <view class="balance-info">
        <text class="balance-label">账户余额</text>
        <text class="balance-amount">¥{{ userBalance.toFixed(2) }}</text>
      </view>
      <view class="balance-tip">
        <text class="tip-text">单笔转账限额：¥{{ transferLimit.toLocaleString() }}</text>
      </view>
    </view>

    <!-- 转账类型选择 -->
    <view class="transfer-types" :style="themeStyles.surface">
      <view class="type-item" :class="{ active: currentTab === 'account' }" @click="switchTab('account')">
        <text class="type-text">账号转账</text>
      </view>
      <view class="type-item" :class="{ active: currentTab === 'phone' }" @click="switchTab('phone')">
        <text class="type-text">手机号转账</text>
      </view>
    </view>

    <!-- 转账表单 -->
    <view class="transfer-form">
      <!-- 账号转账表单 -->
      <view v-if="currentTab === 'account'" class="form-content">
        <view class="form-item">
          <text class="form-label">收款方账号</text>
          <input class="form-input" placeholder="请输入收款方账号" v-model="accountForm.account" />
        </view>
        <view class="form-item">
          <text class="form-label">收款人姓名</text>
          <input class="form-input" placeholder="请输入收款人姓名" v-model="accountForm.name" />
        </view>
        <view class="form-item">
          <text class="form-label">转账金额</text>
          <input class="form-input" type="digit" placeholder="请输入转账金额" v-model="accountForm.amount" />
        </view>
        <view class="form-item">
          <text class="form-label">转账附言</text>
          <input class="form-input" placeholder="选填，不超过20个字" v-model="accountForm.remark" maxlength="20" />
        </view>
      </view>

      <!-- 手机号转账表单 -->
      <view v-if="currentTab === 'phone'" class="form-content">
        <view class="form-item">
          <text class="form-label">收款人手机号</text>
          <input class="form-input" type="number" placeholder="请输入收款人手机号" v-model="phoneForm.phone" />
        </view>
        <view class="form-item">
          <text class="form-label">转账金额</text>
          <input class="form-input" type="digit" placeholder="请输入转账金额" v-model="phoneForm.amount" />
        </view>
        <view class="form-item">
          <text class="form-label">转账附言</text>
          <input class="form-input" placeholder="选填，不超过20个字" v-model="phoneForm.remark" maxlength="20" />
        </view>
      </view>

      <!-- 转账按钮 -->
      <button class="transfer-btn" @click="submitTransfer" :disabled="isProcessing">
        {{ isProcessing ? '处理中...' : '确认转账' }}
      </button>
    </view>

    <!-- 其他功能 -->
    <view class="other-functions">
      <view class="function-item" @click="goToTransferHistory">
        <text class="function-text">转账记录</text>
        <text class="arrow-right">➡️</text>
      </view>
      <view class="function-item" @click="goToTransferSettings">
        <text class="function-text">转账设置</text>
        <text class="arrow-right">➡️</text>
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
import SimpleThemeSwitcher from '@/components/common/SimpleThemeSwitcher.vue'
import themeManager from '@/utils/simple-theme.js'
import { getThemeStyles, getThemeGradient } from '@/utils/theme-helper.js'

export default {
  components: {
    PaymentPasswordModal,
    SimpleThemeSwitcher
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
      currentTheme: themeManager.getCurrentTheme(),
      themeStyles: getThemeStyles()
    }
  },
  
  mounted() {
    // 监听主题变化
    themeManager.addThemeListener(this.onThemeChanged)
  },
  
  beforeDestroy() {
    // 移除主题监听器
    themeManager.removeThemeListener(this.onThemeChanged)
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
      
      // 获取转账限额
      this.getTransferLimit()
      
      // 获取用户余额（模拟数据）
      this.getUserBalance()
    } catch (error) {
      console.error('转账页面onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  },
  
  methods: {
    // 主题变化回调
    onThemeChanged(theme) {
      this.currentTheme = theme
      this.themeStyles = getThemeStyles()
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
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 顶部导航 */
.nav-bar {
  background: var(--gradient-primary);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.nav-actions {
  display: flex;
  align-items: center;
}

/* 账户余额卡片 */
.balance-card {
  background: var(--gradient-primary);
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  color: white;
  box-shadow: 0 8rpx 24rpx var(--color-shadowDark);
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.balance-label {
  font-size: 28rpx;
  opacity: 0.9;
}

.balance-amount {
  font-size: 48rpx;
  font-weight: bold;
}

.balance-tip {
  text-align: right;
}

.tip-text {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 转账类型选择 */
.transfer-types {
  display: flex;
  background-color: var(--color-surface);
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx var(--color-shadow);
}

.type-item {
  flex: 1;
  padding: 30rpx 20rpx;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-surface);
}

.type-item.active {
  color: var(--color-primary);
  background-color: var(--color-surfaceVariant);
}

.type-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 4rpx;
  background-color: var(--color-primary);
  border-radius: 2rpx;
}

.type-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 转账表单 */
.transfer-form {
  background-color: var(--color-surface);
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 12rpx var(--color-shadow);
}

.form-content {
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: var(--color-text);
  margin-bottom: 15rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid var(--color-border);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.transfer-btn {
  width: 100%;
  height: 80rpx;
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 12rpx var(--color-shadowDark);
  transition: all 0.3s ease;
}

.transfer-btn:active {
  transform: scale(0.98);
}

.transfer-btn:disabled {
  background: #cccccc;
  color: #666666;
  box-shadow: none;
}

/* 其他功能 */
.other-functions {
  background-color: var(--color-surface);
  margin: 0 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx var(--color-shadow);
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid var(--color-borderLight);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item:active {
  background-color: var(--color-surfaceVariant);
}

.function-text {
  font-size: 28rpx;
  color: var(--color-text);
  font-weight: 500;
}

.arrow-right {
  color: #ccc;
  font-size: 24rpx;
}
</style>
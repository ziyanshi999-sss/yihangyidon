<template>
  <view class="transfer-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-title">转账</text>
    </view>

    <!-- 转账类型选择 -->
    <view class="transfer-types">
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
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'
import { transfer, phoneTransfer, validatePayee, getTransferLimit } from '@/api/transfer.js'

export default {
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
      userBalance: 100000 // 模拟用户余额
    }
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
    
    // 获取用户余额（模拟）
    getUserBalance() {
      // 在实际环境中调用API，这里使用模拟数据
      const savedBalance = uni.getStorageSync('userBalance')
      if (savedBalance) {
        this.userBalance = savedBalance
      }
    },
    
    // 验证转账金额
    validateAmount(amount) {
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
      
      // 检查余额是否充足
      if (numAmount > this.userBalance) {
        uni.showToast({
          title: '余额不足',
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
          if (!this.validateAmount(this.accountForm.amount)) {
            this.isProcessing = false
            return
          }
          
          // 显示转账确认弹窗
          uni.showModal({
            title: '转账确认',
            content: `向 ${this.accountForm.name}（账号：${this.accountForm.account}）转账 ${this.accountForm.amount} 元`,
            success: async (res) => {
              if (res.confirm) {
                // 先验证收款人信息
                await this.verifyPayeeInfo(this.accountForm.account, this.accountForm.name)
              } else {
                this.isProcessing = false
              }
            }
          })
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
          if (!this.validateAmount(this.phoneForm.amount)) {
            this.isProcessing = false
            return
          }
          
          // 显示转账确认弹窗
          uni.showModal({
            title: '转账确认',
            content: `向手机号 ${this.phoneForm.phone} 转账 ${this.phoneForm.amount} 元`,
            success: async (res) => {
              if (res.confirm) {
                // 执行手机号转账
                await this.processPhoneTransfer()
              } else {
                this.isProcessing = false
              }
            }
          })
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
    }
  }
}
</script>

<style scoped>
.transfer-page {
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 顶部导航 */
.nav-bar {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 转账类型选择 */
.transfer-types {
  display: flex;
  background-color: #fff;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.type-item {
  flex: 1;
  padding: 15px;
  text-align: center;
  position: relative;
}

.type-item.active {
  color: #ff6b00;
}

.type-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 2px;
  background-color: #ff6b00;
}

.type-text {
  font-size: 16px;
}

/* 转账表单 */
.transfer-form {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.form-content {
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 16px;
}

.transfer-btn {
  width: 100%;
  height: 45px;
  background-color: #ff6b00;
  color: #fff;
  border-radius: 25px;
  font-size: 16px;
  line-height: 45px;
}

/* 其他功能 */
.other-functions {
  background-color: #fff;
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.function-text {
  font-size: 16px;
  color: #333;
}

.arrow-right {
  color: #ccc;
}
.transfer-btn:disabled {
  background-color: #cccccc;
  color: #666666;
}
</style>
// 修改页面结构，添加登录提示区域
<template>
  <view class="account-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-title">我的账户</text>
    </view>
    
    <!-- 登录提示区域 -->
    <view v-if="isLoginNeeded" class="login-prompt">
      <view class="login-icon">🔐</view>
      <text class="login-text">请先登录</text>
      <button class="login-btn" @click="goToLogin">去登录</button>
    </view>
    
    <!-- 未实名认证页面 -->
    <view v-else-if="!isVerified" class="verify-section">
      <view class="verify-icon">🔍</view>
      <text class="verify-title">请完成实名认证</text>
      <text class="verify-desc">完成实名认证后可享受更多金融服务</text>
      <button class="verify-btn" @click="goToVerify">去认证</button>
      
      <view class="verify-form">
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input class="form-input" placeholder="请输入真实姓名" v-model="verifyInfo.name" />
        </view>
        <view class="form-item">
          <text class="form-label">身份证号</text>
          <input class="form-input" placeholder="请输入18位身份证号" v-model="verifyInfo.idCard" maxlength="18" />
        </view>
        <button class="submit-btn" @click="submitVerify">提交认证</button>
      </view>
    </view>
    
    <!-- 未绑定银行卡页面 -->
    <view v-else-if="isVerified && !hasBankCard" class="bankcard-section">
      <view class="bankcard-icon">💳</view>
      <text class="bankcard-title">请绑定银行卡</text>
      <text class="bankcard-desc">绑定银行卡后可进行存取款和转账等操作</text>
      <button class="bankcard-btn" @click="addBankCard">添加银行卡</button>
      
      <view class="card-form">
        <view class="form-item">
          <text class="form-label">银行卡号</text>
          <input class="form-input" placeholder="请输入银行卡号" v-model="cardInfo.cardNumber" />
        </view>
        <view class="form-item">
          <text class="form-label">开户行</text>
          <input class="form-input" placeholder="请输入开户银行" v-model="cardInfo.bankName" />
        </view>
        <button class="submit-btn" @click="submitBankCard">提交绑定</button>
      </view>
    </view>
    
    <!-- 账户主页面 -->
    <view v-else class="account-main">
      <!-- 账户余额 -->
      <view class="balance-section">
        <text class="balance-title">账户余额</text>
        <text class="balance-amount">¥{{ accountInfo.balance }}</text>
        <view class="balance-actions">
          <button class="action-btn" @click="showWithdraw">取款</button>
          <button class="action-btn" @click="showDeposit">存款</button>
        </view>
      </view>
      
      <!-- 功能菜单 -->
      <view class="account-functions">
        <view class="function-row">
          <view class="function-item" @click="goToTransfer">
            <view class="function-icon">↔️</view>
            <text class="function-text">转账</text>
          </view>
          <view class="function-item" @click="goToPayment">
            <view class="function-icon">💸</view>
            <text class="function-text">付款</text>
          </view>
          <view class="function-item" @click="goToReceive">
            <view class="function-icon">📲</view>
            <text class="function-text">收款</text>
          </view>
        </view>
        
        <view class="function-row">
          <view class="function-item" @click="goToCreditCard">
            <view class="function-icon">💳</view>
            <text class="function-text">信用卡还款</text>
          </view>
          <view class="function-item" @click="goToWealth">
            <view class="function-icon">💰</view>
            <text class="function-text">理财通</text>
          </view>
          <view class="function-item" @click="goToTopup">
            <view class="function-icon">📱</view>
            <text class="function-text">手机充值</text>
          </view>
        </view>
        
        <view class="function-row">
          <view class="function-item" @click="goToBill">
            <view class="function-icon">📊</view>
            <text class="function-text">生活缴费</text>
          </view>
          <view class="function-item" @click="goToDonation">
            <view class="function-icon">❤️</view>
            <text class="function-text">慈善乐捐</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forceCheckLogin } from '@/utils/auth.js'

export default {
  data() {
    return {
      isLoginNeeded: false, // 添加登录提示标志
      isVerified: true, // 默认已实名认证
      hasBankCard: true, // 默认有银行卡
      verifyInfo: {
        name: '',
        idCard: ''
      },
      cardInfo: {
        cardNumber: '',
        bankName: ''
      },
      accountInfo: {
        balance: '12,345.67'
      },
      userBalance: 100000, // 模拟用户余额
    }
  },
  
  // 在onLoad方法中添加调试信息
  onLoad() {
  // 初始化时先检查登录状态
  this.checkLoginStatus()
  
  if (!this.isLoginNeeded) {
  // 检查实名认证状态
  this.checkVerificationStatus()
  // 检查银行卡绑定状态
  this.checkBankCardStatus()
  
  // 添加调试信息
  console.log('账户页面初始化 - 认证状态:', this.isVerified)
  console.log('账户页面初始化 - 银行卡状态:', this.hasBankCard)
  }
  },
  
  onShow() {
    // 每次页面显示时都检查登录状态
    this.checkLoginStatus()
    
    // 获取用户余额（模拟数据）
    this.getUserBalance()
  },
  

    // 检查登录状态
    // 在methods对象中添加缺失的getUserBalance方法
    methods: {
      // ... 现有代码 ...
      
      // 检查登录状态
      checkLoginStatus() {
        try {
          // 检查登录状态
          if (!forceCheckLogin()) {
            console.log('账户页面：用户未登录，显示登录提示')
            this.isLoginNeeded = true
            return
          }
          
          this.isLoginNeeded = false
          console.log('账户页面显示')
        } catch (error) {
          console.error('账户页面登录检查失败:', error)
          this.isLoginNeeded = true
        }
      },
      
      // 新增：获取用户余额的方法
      getUserBalance() {
        // 由于是模拟环境，我们使用预设的余额数据
        // 在实际项目中，这里应该是一个API请求获取真实余额
        try {
          // 模拟从本地存储获取余额（如果有）
          const savedBalance = uni.getStorageSync('userBalance')
          if (savedBalance) {
            this.accountInfo.balance = savedBalance
            return
          }
          
          // 否则使用默认的模拟余额
          console.log('使用默认模拟余额:', this.accountInfo.balance)
        } catch (error) {
          console.error('获取用户余额失败:', error)
        }
      },
      
      // 跳转到登录页面
      goToLogin() {
        // 保存当前页面路径，登录成功后返回
        const currentPath = getCurrentPages()[getCurrentPages().length - 1].route
        uni.setStorageSync('redirectUrl', `/${currentPath}`)
        
        // 跳转到登录页面
        uni.navigateTo({
          url: '/pages/denglu/login'
        })
      },
      
      // 检查实名认证状态
      // 检查实名认证状态
      checkVerificationStatus() {
      // 实际项目中应该从服务器或本地存储获取认证状态
      const verified = uni.getStorageSync('userVerified')
      // 只有当verified明确为false时才设置为false，避免null值导致问题
      if (verified === false) {
        this.isVerified = false
      }
      // 其他情况保持默认值true
      },
      
      // 检查银行卡绑定状态
      checkBankCardStatus() {
      // 实际项目中应该从服务器或本地存储获取银行卡状态
      const hasCard = uni.getStorageSync('hasBankCard')
      // 只有当hasCard明确为false时才设置为false，避免null值导致问题
      if (hasCard === false) {
        this.hasBankCard = false
      }
      // 其他情况保持默认值true
      },
      
      // 提交实名认证
      submitVerify() {
        if (!this.verifyInfo.name || !this.verifyInfo.idCard) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        // 简单的身份证号验证
        const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!idCardRegex.test(this.verifyInfo.idCard)) {
          uni.showToast({
            title: '请输入有效的身份证号',
            icon: 'none'
          })
          return
        }
        
        // 保存认证状态
        this.isVerified = true
        uni.setStorageSync('userVerified', true)
        
        uni.showToast({
          title: '实名认证成功',
          icon: 'success'
        })
      },
      
      // 提交银行卡绑定
      submitBankCard() {
        if (!this.cardInfo.cardNumber || !this.cardInfo.bankName) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        // 保存银行卡状态
        this.hasBankCard = true
        uni.setStorageSync('hasBankCard', true)
        
        uni.showToast({
          title: '银行卡绑定成功',
          icon: 'success'
        })
      },
      
      // 去认证
      goToVerify() {
        // 这里可以跳转到专门的认证页面
        uni.showToast({
          title: '前往认证页面',
          icon: 'none'
        })
      },
      
      // 添加银行卡
      addBankCard() {
        // 这里可以跳转到专门的添加银行卡页面
        uni.showToast({
          title: '前往添加银行卡页面',
          icon: 'none'
        })
      },
      
      // 显示取款弹窗
      showWithdraw() {
        uni.showToast({
          title: '取款功能',
          icon: 'none'
        })
      },
      
      // 显示存款弹窗
      showDeposit() {
        uni.showToast({
          title: '存款功能',
          icon: 'none'
        })
      },
      
      // 跳转到转账页面
      goToTransfer() {
        uni.navigateTo({
          url: '/pages/transfer/transfer'
        })
      },
      
      // 跳转到付款页面
      goToPayment() {
        uni.showToast({
          title: '付款功能',
          icon: 'none'
        })
      },
      
      // 跳转到收款页面
      goToReceive() {
        uni.showToast({
          title: '收款功能',
          icon: 'none'
        })
      },
      
      // 跳转到信用卡还款页面
      goToCreditCard() {
        uni.showToast({
          title: '信用卡还款功能',
          icon: 'none'
        })
      },
      
      // 跳转到理财通页面
      goToWealth() {
        uni.navigateTo({
          url: '/pages/wealth/wealth'
        })
      },
      
      // 跳转到手机充值页面
      goToTopup() {
        uni.showToast({
          title: '手机充值功能',
          icon: 'none'
        })
      },
      
      // 跳转到生活缴费页面
      goToBill() {
        uni.showToast({
          title: '生活缴费功能',
          icon: 'none'
        })
      },
      
      // 跳转到慈善乐捐页面
      goToDonation() {
        uni.showToast({
          title: '慈善乐捐功能',
          icon: 'none'
        })
      }
    }
}
</script>

<style scoped>
.account-page {
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

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  text-align: center;
}

.login-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.login-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.login-btn {
  background-color: #667eea;
  color: white;
  font-size: 32rpx;
  padding: 20rpx 80rpx;
  border-radius: 8rpx;
}

/* 实名认证部分 */
.verify-section {
  padding: 40rpx 30rpx;
  text-align: center;
}

.verify-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.verify-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.verify-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.verify-btn {
  background-color: #f9a825;
  color: #fff;
  border: none;
  padding: 15rpx 40rpx;
  border-radius: 5rpx;
  margin-bottom: 30rpx;
}

/* 银行卡部分 */
.bankcard-section {
  padding: 40rpx 30rpx;
  text-align: center;
}

.bankcard-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.bankcard-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.bankcard-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.bankcard-btn {
  background-color: #f9a825;
  color: #fff;
  border: none;
  padding: 15rpx 40rpx;
  border-radius: 5rpx;
  margin-bottom: 30rpx;
}

/* 表单样式 */
.verify-form,
.card-form {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 10rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 5rpx;
  font-size: 28rpx;
}

.submit-btn {
  width: 100%;
  background-color: #f9a825;
  color: #fff;
  border: none;
  padding: 20rpx;
  border-radius: 5rpx;
  font-size: 32rpx;
}

/* 账户主页面 */
.account-main {
  padding: 20rpx;
}

/* 余额部分 */
.balance-section {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.balance-title {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.balance-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.balance-actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  background-color: #f9a825;
  color: #fff;
  border: none;
  padding: 15rpx 40rpx;
  border-radius: 5rpx;
  margin: 0 10rpx;
  font-size: 28rpx;
}

/* 功能菜单 */
.account-functions {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
}

.function-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.function-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.function-text {
  font-size: 28rpx;
  color: #333;
}
</style>
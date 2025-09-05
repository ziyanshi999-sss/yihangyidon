<template>
  <view class="change-password-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="nav-title">{{ pageTitle }}</view>
      <view class="nav-right"></view>
    </view>

    <!-- 密码修改表单 -->
    <view class="password-form">
      <view class="form-section">
        <view class="section-title">当前密码</view>
        <view class="input-group">
          <input
            ref="currentPasswordInput"
            type="password"
            v-model="currentPassword"
            placeholder="请输入当前密码"
            maxlength="20"
            class="password-input"
          />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">新密码</view>
        <view class="input-group">
          <input
            ref="newPasswordInput"
            type="password"
            v-model="newPassword"
            placeholder="请输入新密码（6-20位，包含字母和数字）"
            maxlength="20"
            class="password-input"
            @input="checkPasswordStrength"
          />
          <view class="password-strength">
            密码强度：
            <text :class="['strength-text', passwordStrengthClass]">{{ passwordStrengthText }}</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">确认新密码</view>
        <view class="input-group">
          <input
            ref="confirmPasswordInput"
            type="password"
            v-model="confirmPassword"
            placeholder="请再次输入新密码"
            maxlength="20"
            class="password-input"
            @input="validateNewPasswords"
          />
        </view>
      </view>

      <button class="save-button" @click="saveNewPassword" :disabled="!canSave">
        确认修改
      </button>
    </view>

    <view class="password-tips">
      <text class="tips-title">密码设置建议：</text>
      <text class="tip-item">• 密码长度应为6-20位</text>
      <text class="tip-item">• 必须包含字母和数字</text>
      <text class="tip-item">• 建议包含特殊字符（如@$!%*#?&）</text>
      <text class="tip-item">• 请勿使用与个人信息相关的简单密码</text>
      <text class="tip-item">• 定期更换密码，提高账户安全性</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/utils/auth.js'

export default {
  data() {
    return {
      type: 'login', // 'login' or 'transaction'
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordStrengthText: '很弱',
      passwordStrengthClass: 'weak',
      userInfo: null,
      canSave: false
    }
  },
  computed: {
    pageTitle() {
      return this.type === 'login' ? '修改登录密码' : '修改交易密码'
    }
  },
  onLoad(options) {
    if (options.type) {
      this.type = options.type
    }
    this.loadUserInfo()
  },
  watch: {
    currentPassword() { this.checkCanSave() },
    newPassword() { this.checkPasswordStrength(); this.checkCanSave() },
    confirmPassword() { this.checkCanSave() }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    loadUserInfo() {
      this.userInfo = getUserInfo()
    },
    
    checkPasswordStrength() {
      const password = this.newPassword
      let strength = 0
      if (password.length >= 6) strength++
      if (/[a-zA-Z]/.test(password)) strength++
      if (/\d/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++

      if (password.length < 6) {
        this.passwordStrengthText = '很弱'
        this.passwordStrengthClass = 'very-weak'
      } else if (strength <= 2) {
        this.passwordStrengthText = '弱'
        this.passwordStrengthClass = 'weak'
      } else if (strength === 3) {
        this.passwordStrengthText = '中'
        this.passwordStrengthClass = 'medium'
      } else {
        this.passwordStrengthText = '强'
        this.passwordStrengthClass = 'strong'
      }
    },
    
    validateCurrentPassword() {
      if (!this.currentPassword) {
        uni.showToast({ title: '请输入当前密码', icon: 'none' })
        return false
      }
      return true
    },
    
    validateNewPasswords() {
      if (!this.newPassword) {
        uni.showToast({ title: '请输入新密码', icon: 'none' })
        return false
      }
      if (this.newPassword.length < 6 || this.newPassword.length > 20) {
        uni.showToast({ title: '新密码长度应为6-20位', icon: 'none' })
        return false
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(this.newPassword)) {
        uni.showToast({ title: '新密码必须包含字母和数字', icon: 'none' })
        return false
      }
      if (this.newPassword !== this.confirmPassword) {
        uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
        return false
      }
      if (this.newPassword === this.currentPassword) {
        uni.showToast({ title: '新密码不能与当前密码相同', icon: 'none' })
        return false
      }
      return true
    },
    
    checkCanSave() {
      this.canSave = this.currentPassword && this.newPassword && this.confirmPassword &&
                  this.newPassword === this.confirmPassword &&
                  this.newPassword.length >= 6 && this.newPassword.length <= 20 &&
                  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(this.newPassword) &&
                  this.newPassword !== this.currentPassword
    },
    
    async saveNewPassword() {
      if (!this.validateCurrentPassword() || !this.validateNewPasswords()) {
        return
      }

      uni.showLoading({ title: '修改中...' })

      try {
        // 验证当前密码是否正确
        const currentPasswordField = this.type === 'login' ? 'password' : 'transactionPassword'
        if (this.userInfo[currentPasswordField] !== this.currentPassword) {
          uni.hideLoading()
          uni.showToast({ title: '当前密码错误', icon: 'none' })
          return
        }

        let updatedUserInfo = { ...this.userInfo }
        if (!updatedUserInfo.securitySettings) {
          updatedUserInfo.securitySettings = {}
        }

        if (this.type === 'login') {
          updatedUserInfo.password = this.newPassword
          updatedUserInfo.securitySettings.passwordUpdateTime = new Date().toISOString()
          this.addSecurityEvent('password_change', '修改登录密码')
        } else {
          updatedUserInfo.transactionPassword = this.newPassword
          updatedUserInfo.securitySettings.transactionPasswordUpdateTime = new Date().toISOString()
          this.addSecurityEvent('transaction_password_change', '修改交易密码')
        }

        // 更新本地存储
        uni.setStorageSync('userInfo', updatedUserInfo)
        uni.setStorageSync('currentUser', updatedUserInfo)

        // 更新本地数据库
        await this.updateLocalDatabase(updatedUserInfo)

        // 更新当前页面的用户信息
        this.userInfo = updatedUserInfo

        // 清空表单
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.canSave = false

        uni.hideLoading()
        uni.showToast({ title: `${this.pageTitle}成功`, icon: 'success' })
        
        setTimeout(() => {
          this.goBack()
        }, 1500)

      } catch (error) {
        console.error('修改密码失败:', error)
        uni.hideLoading()
        uni.showToast({ title: `修改${this.pageTitle}失败`, icon: 'none' })
      }
    },
    
    async updateLocalDatabase(userInfo) {
      try {
        // 从 db/user.json 文件读取用户数据
        const response = await uni.request({
          url: '/db/user.json',
          method: 'GET'
        })
        
        if (response.data && Array.isArray(response.data)) {
          const users = response.data
          const userIndex = users.findIndex(user => user.id === userInfo.id)
          if (userIndex !== -1) {
            // 更新用户信息
            users[userIndex] = { ...users[userIndex], ...userInfo }
            
            // 将更新后的数据写回文件（这里需要后端支持，或者使用本地存储作为备份）
            uni.setStorageSync('users_backup', users)
            console.log('本地数据库密码更新成功')
          }
        } else {
          // 如果无法读取文件，使用本地存储作为备份
          const users = uni.getStorageSync('users') || []
          const userIndex = users.findIndex(user => user.id === userInfo.id)
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userInfo }
            uni.setStorageSync('users', users)
            console.log('本地存储密码更新成功')
          }
        }
      } catch (error) {
        console.error('更新本地数据库失败:', error)
        // 降级到本地存储
        try {
          const users = uni.getStorageSync('users') || []
          const userIndex = users.findIndex(user => user.id === userInfo.id)
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userInfo }
            uni.setStorageSync('users', users)
            console.log('降级到本地存储更新成功')
          }
        } catch (fallbackError) {
          console.error('本地存储更新也失败:', fallbackError)
          throw fallbackError
        }
      }
    },
    
    addSecurityEvent(type, description) {
      const userInfo = uni.getStorageSync('userInfo') || uni.getStorageSync('currentUser')
      if (userInfo && userInfo.securitySettings) {
        if (!userInfo.securitySettings.securityEvents) {
          userInfo.securitySettings.securityEvents = []
        }
        const newEvent = {
          id: Date.now(),
          type: type,
          description: description,
          timestamp: new Date().toISOString(),
          location: '当前位置',
          ip: '192.168.1.100',
          status: 'success'
        }
        userInfo.securitySettings.securityEvents.unshift(newEvent)
        if (userInfo.securitySettings.securityEvents.length > 50) {
          userInfo.securitySettings.securityEvents = userInfo.securitySettings.securityEvents.slice(0, 50)
        }
        uni.setStorageSync('userInfo', userInfo)
        uni.setStorageSync('currentUser', userInfo)
        this.updateLocalDatabase(userInfo)
      }
    }
  }
}
</script>

<style scoped>
.change-password-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
}

.password-form {
  margin: 30rpx;
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.form-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.input-group {
  position: relative;
}

.password-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  background: #fff;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: #4caf50;
}

.password-strength {
  font-size: 24rpx;
  color: #666;
  margin-top: 15rpx;
}

.strength-text {
  font-weight: bold;
  margin-left: 10rpx;
}

.strength-text.very-weak { color: #f44336; }
.strength-text.weak { color: #ff9800; }
.strength-text.medium { color: #ffeb3b; }
.strength-text.strong { color: #4caf50; }

.save-button {
  width: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 40rpx;
}

.save-button:disabled {
  background: #cccccc;
}

.password-tips {
  margin: 30rpx;
  background: #e8f5e9;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.tips-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 20rpx;
  display: block;
}

.tip-item {
  font-size: 24rpx;
  color: #4caf50;
  line-height: 1.6;
  display: block;
}
</style>
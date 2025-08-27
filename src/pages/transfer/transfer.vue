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
      <button class="transfer-btn" @click="submitTransfer">确认转账</button>
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
      }
    }
  },
  methods: {
    // 切换转账类型
    switchTab(tab) {
      this.currentTab = tab
    },
    
    // 提交转账
    submitTransfer() {
      // 这里简化处理，实际项目中应该调用转账API
      if (this.currentTab === 'account') {
        if (!this.accountForm.account || !this.accountForm.name || !this.accountForm.amount) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        // 显示转账确认弹窗
        uni.showModal({
          title: '转账确认',
          content: `向 ${this.accountForm.name}（账号：${this.accountForm.account}）转账 ${this.accountForm.amount} 元`,
          success: (res) => {
            if (res.confirm) {
              // 模拟转账成功
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
            }
          }
        })
      } else {
        if (!this.phoneForm.phone || !this.phoneForm.amount) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        // 显示转账确认弹窗
        uni.showModal({
          title: '转账确认',
          content: `向手机号 ${this.phoneForm.phone} 转账 ${this.phoneForm.amount} 元`,
          success: (res) => {
            if (res.confirm) {
              // 模拟转账成功
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
            }
          }
        })
      }
    },
    
    // 跳转到转账记录
    goToTransferHistory() {
      uni.showToast({
        title: '跳转到转账记录页面',
        icon: 'none'
      })
    },
    
    // 跳转到转账设置
    goToTransferSettings() {
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
</style>
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
        <text class="balance-amount">¥{{ currentUser.balance.toFixed(2) }}</text>
        <text class="balance-subtitle">可用余额</text>
      </view>
      <view class="balance-footer">
        <view class="limit-info">
          <text class="limit-label">单笔限额</text>
          <text class="limit-amount">¥{{ currentUser.securitySettings?.transactionLimit?.toLocaleString() || '100,000' }}</text>
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
    <view class="frequent-contacts" v-if="currentUser.frequentContacts && currentUser.frequentContacts.length > 0">
      <view class="section-header">
        <text class="section-title">常用联系人</text>
        <text class="section-more" @click="showAllContacts">查看全部</text>
      </view>
      <scroll-view class="contacts-scroll" scroll-x="true">
        <view class="contacts-list">
          <view 
            class="contact-item" 
            v-for="contact in currentUser.frequentContacts.slice(0, 5)" 
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

    <!-- 其他用户 -->
    <view class="other-users" @click="handleRetryLoad">
      <view class="section-header">
        <text class="section-title">其他用户</text>
        <text class="section-desc">点击选择用户，自动填入银行卡信息</text>
      </view>
      
      <!-- 加载状态 -->
      <view v-if="isLoadingUsers" class="loading-state">
        <text class="loading-text">正在加载用户数据...</text>
      </view>
      
      <!-- 错误状态 -->
      <view v-else-if="loadError" class="error-state">
        <text class="error-text">连接服务器超时，点击屏幕重试</text>
      </view>
      
      <!-- 用户列表 -->
      <view v-else-if="otherUsers.length > 0" class="users-grid">
        <view 
          class="user-item" 
          v-for="user in otherUsers" 
          :key="user.id"
          @click.stop="selectOtherUser(user)"
        >
          <view class="user-avatar">{{ user.realName.charAt(0) }}</view>
          <view class="user-info">
            <text class="user-name">{{ user.realName }}</text>
            <text class="user-bank">{{ user.bankAccount.bankName }}</text>
            <text class="user-account">{{ user.bankAccount.accountNumber }}</text>
          </view>
          <view class="user-action">
            <text class="action-text">选择</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-text">暂无其他用户数据</text>
      </view>
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
import { forceCheckLogin } from '../../utils/auth.js'
import dataSync from '../../utils/data-sync.js'
import PaymentPasswordModal from '../../components/common/PaymentPasswordModal.vue'

import unifiedDataManager from '../../utils/unified-data-manager.js'

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
      otherUsers: [], // 其他用户列表
      isLoadingUsers: false, // 用户数据加载状态
      loadError: false, // 加载错误状态
      isProcessing: false, // 转账处理状态
      currentUser: {}, // 当前用户信息
      showPasswordModal: false, // 显示交易密码弹窗
      transferAmount: 0, // 转账金额
      transferPayee: '', // 收款方
      transferDescription: '' // 转账说明
    }
  },
  
  mounted() {
    // 页面加载完成
    this.loadUserData()
    this.loadOtherUsers()
    this.initDataSync()
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
      
      // 加载用户数据
      this.loadUserData()
    } catch (error) {
      console.error('转账页面onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  },
  
  methods: {
    // 加载用户数据
    async loadUserData() {
      try {
        console.log('开始加载用户数据...')
        
        // 设置超时时间
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('用户数据加载超时')), 8000)
        })
        
        const loadPromise = (async () => {
          // 初始化统一数据管理器
          await unifiedDataManager.init()
          
          // 从统一数据管理器获取当前用户信息
          const currentUser = unifiedDataManager.getCurrentUser() || {}
          
          return currentUser
        })()
        
        // 使用Promise.race来处理超时
        this.currentUser = await Promise.race([loadPromise, timeoutPromise])
        
        console.log('✅ 转账页面加载用户数据成功:', this.currentUser.username)
        
        // 检查用户数据是否完整
        if (!this.currentUser.id || !this.currentUser.username) {
          console.warn('⚠️ 用户数据不完整，可能需要重新登录')
          uni.showToast({
            title: '用户数据异常，请重新登录',
            icon: 'none',
            duration: 3000
          })
        }
        
      } catch (error) {
        console.error('❌ 加载用户数据失败:', error)
        
        // 显示错误提示
        uni.showToast({
          title: '连接服务器超时，点击屏幕重试',
          icon: 'none',
          duration: 3000
        })
        
        // 设置默认用户数据避免页面错误
        this.currentUser = {
          id: 'unknown',
          username: '未知用户',
          balance: 0,
          frequentContacts: []
        }
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

    // 加载其他用户数据
    async loadOtherUsers() {
      this.isLoadingUsers = true
      this.loadError = false
      
      try {
        console.log('开始加载其他用户数据...')
        
        // 设置超时时间
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('加载超时')), 5000)
        })
        
        const loadPromise = (async () => {
          const dataConnector = await import('../../../db/data-connector.js')
          
          // 初始化数据连接器
          await dataConnector.init()
          
          const allUsers = await dataConnector.getUsers()
          const currentUserId = uni.getStorageSync('currentUserId')
          
          // 过滤掉当前用户，只显示其他用户
          const otherUsers = allUsers.filter(user => 
            user.id !== currentUserId && 
            user.bankAccount && 
            user.bankAccount.accountNumber
          )
          
          return otherUsers
        })()
        
        // 使用Promise.race来处理超时
        this.otherUsers = await Promise.race([loadPromise, timeoutPromise])
        
        console.log('✅ 加载其他用户数据成功:', this.otherUsers.length, '个用户')
        
        // 如果没有其他用户，显示提示
        if (this.otherUsers.length === 0) {
          console.log('⚠️ 没有找到其他用户数据')
        }
        
      } catch (error) {
        console.error('❌ 加载其他用户数据失败:', error)
        
        // 使用备用数据
        console.log('🔄 使用备用用户数据...')
        this.otherUsers = this.getFallbackUsers()
        
        if (this.otherUsers.length > 0) {
          console.log('✅ 备用用户数据加载成功:', this.otherUsers.length, '个用户')
          this.loadError = false
        } else {
          this.loadError = true
        }
      } finally {
        this.isLoadingUsers = false
      }
    },

    // 获取备用用户数据
    getFallbackUsers() {
      return [
        {
          id: "u002",
          username: "李小红",
          realName: "李小红",
          phone: "13777777777",
          balance: 80000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 1234 5678",
            bankName: "中国农业银行",
            accountType: "储蓄卡",
            accountHolder: "李小红",
            branchName: "广州天河支行"
          }
        },
        {
          id: "u003",
          username: "王小明",
          realName: "王小明",
          phone: "13666666666",
          balance: 150000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 2345 6789",
            bankName: "中国工商银行",
            accountType: "储蓄卡",
            accountHolder: "王小明",
            branchName: "深圳南山支行"
          }
        },
        {
          id: "u004",
          username: "张美丽",
          realName: "张美丽",
          phone: "13555555555",
          balance: 95000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 3456 7890",
            bankName: "中国建设银行",
            accountType: "储蓄卡",
            accountHolder: "张美丽",
            branchName: "杭州西湖支行"
          }
        },
        {
          id: "u005",
          username: "刘强",
          realName: "刘强",
          phone: "13444444444",
          balance: 120000.00,
          isLoggedIn: false,
          bankAccount: {
            accountNumber: "6228 4800 4567 8901",
            bankName: "中国银行",
            accountType: "储蓄卡",
            accountHolder: "刘强",
            branchName: "成都锦江支行"
          }
        }
      ]
    },

    // 处理重试加载
    handleRetryLoad() {
      if (this.loadError) {
        console.log('用户点击重试加载数据')
        this.loadOtherUsers()
      }
    },

    // 选择其他用户
    selectOtherUser(user) {
      if (!user.bankAccount) {
        uni.showToast({
          title: '该用户暂无银行卡信息',
          icon: 'none'
        })
        return
      }
      
      // 自动填入银行卡号和姓名
      this.accountForm.account = user.bankAccount.accountNumber
      this.accountForm.name = user.bankAccount.accountHolder
      
      // 切换到账号转账模式
      this.currentTab = 'account'
      
      uni.showToast({
        title: `已选择${user.realName}`,
        icon: 'success'
      })
      
      console.log('选择用户:', {
        name: user.realName,
        account: user.bankAccount.accountNumber,
        bank: user.bankAccount.bankName
      })
    },

    // 显示所有联系人
    showAllContacts() {
      uni.showToast({
        title: "联系人功能开发中",
        icon: "none"
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
        this.loadUserData()
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
      const transferLimit = this.currentUser.securitySettings?.transactionLimit || 100000
      if (numAmount > transferLimit) {
        uni.showToast({
          title: `转账金额不能超过${transferLimit.toLocaleString()}元`,
          icon: 'none'
        })
        return false
      }
      
      // 检查余额是否足够
      if (numAmount > this.currentUser.balance) {
        uni.showToast({
          title: '余额不足，请检查账户余额',
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
          
          // 直接处理转账，不需要密码验证
          this.transferAmount = parseFloat(this.accountForm.amount)
          this.transferPayee = this.accountForm.name
          this.transferDescription = `向账号${this.accountForm.account}转账`
          
          // 直接执行转账
          await this.processTransferSuccess()
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
          
          // 直接处理转账，不需要密码验证
          this.transferAmount = parseFloat(this.phoneForm.amount)
          this.transferPayee = this.phoneForm.phone
          this.transferDescription = `向手机号${this.phoneForm.phone}转账`
          
          // 直接执行转账
          await this.processTransferSuccess()
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
    
    // 处理转账成功
    async processTransferSuccess() {
      try {
        // 使用新的交易记录API
        const { addTransactionRecord } = await import('../../api/transaction.js')


        
        
        // 构建交易记录
        const transaction = {
          type: "expense",
          category: "transfer",
          amount: this.transferAmount,
          description: this.currentTab === 'account' ? 
            `转账给${this.accountForm.name || this.accountForm.account}` : 
            `转账给${this.phoneForm.phone}`,
          source: this.currentTab === 'account' ? 
            this.accountForm.name || this.accountForm.account : 
            this.phoneForm.phone,
          reference: `TRF${Date.now()}`,
          status: "completed"
        }
        
        // 添加交易记录（会自动更新用户余额）
        const newTransaction = await addTransactionRecord(transaction)
        console.log('✅ 转账交易记录添加成功:', newTransaction)
        
        // 创建转账记录（用于转账历史页面）
        const transferRecord = {
          id: 't' + Date.now() + Math.random().toString(36).substr(2, 9),
          type: 'outgoing',
          amount: this.transferAmount,
          recipient: this.currentTab === 'account' ? this.accountForm.name : this.phoneForm.phone,
          recipientAccount: this.currentTab === 'account' ? this.accountForm.account : this.phoneForm.phone,
          description: this.currentTab === 'account' ? this.accountForm.remark || '转账' : this.phoneForm.remark || '转账',
          status: 'completed',
          timestamp: new Date().toISOString(),
          fee: this.transferAmount > 1000 ? 2.5 : 0
        }
        
        // 使用统一数据管理器添加转账记录
        unifiedDataManager.addTransferRecord(this.currentUser.id, transferRecord)
        
        // 更新常用联系人
        this.updateFrequentContacts(transferRecord)
        
        // 触发数据同步
        unifiedDataManager.syncData()
        
        // 触发转账成功事件
        uni.$emit('balanceUpdated', {
          userId: this.currentUser.id,
          balance: newTransaction.balance
        })
        
        // 显示转账成功提示
        uni.showToast({
          title: `转账成功，余额：¥${newTransaction.balance.toFixed(2)}`,
          icon: 'success',
          duration: 3000
        })
        
        // 清空表单
        this.clearForms()
        
        // 重新加载用户数据
        await this.loadUserData()
        
        console.log('✅ 转账操作完成:', {
          amount: this.transferAmount,
          newBalance: newTransaction.balance,
          transferRecord,
          transactionId: newTransaction.id
        })
        
      } catch (error) {
        console.error('❌ 处理转账成功失败:', error)
        // 如果API调用失败，回退到原来的方法
        this.fallbackProcessTransferSuccess()
      } finally {
        this.isProcessing = false
      }
    },

    // 回退方法：直接处理转账成功
    async fallbackProcessTransferSuccess() {
      try {
        // 更新用户余额
        const newBalance = this.currentUser.balance - this.transferAmount
        unifiedDataManager.updateBalance(this.currentUser.id, newBalance)
        
        // 创建转账记录
        const transferRecord = {
          id: 't' + Date.now() + Math.random().toString(36).substr(2, 9),
          type: 'outgoing',
          amount: this.transferAmount,
          recipient: this.currentTab === 'account' ? this.accountForm.name : this.phoneForm.phone,
          recipientAccount: this.currentTab === 'account' ? this.accountForm.account : this.phoneForm.phone,
          description: this.currentTab === 'account' ? this.accountForm.remark || '转账' : this.phoneForm.remark || '转账',
          status: 'completed',
          timestamp: new Date().toISOString(),
          fee: this.transferAmount > 1000 ? 2.5 : 0
        }
        
        // 使用统一数据管理器添加转账记录
        unifiedDataManager.addTransferRecord(this.currentUser.id, transferRecord)
        
        // 更新常用联系人
        this.updateFrequentContacts(transferRecord)
        
        // 触发数据同步
        unifiedDataManager.syncData()
        
        // 触发转账成功事件
        uni.$emit('balanceUpdated', {
          userId: this.currentUser.id,
          balance: newBalance
        })
        
        // 显示转账成功提示
        uni.showToast({
          title: `转账成功，余额：¥${newBalance.toFixed(2)}`,
          icon: 'success',
          duration: 3000
        })
        
        // 清空表单
        this.clearForms()
        
        // 重新加载用户数据
        await this.loadUserData()
        
        console.log('✅ 回退方法：转账操作完成:', {
          amount: this.transferAmount,
          newBalance,
          transferRecord
        })
        
      } catch (error) {
        console.error('❌ 回退方法处理转账成功失败:', error)
        uni.showToast({
          title: '转账处理失败',
          icon: 'none'
        })
      }
    },
    
    // 更新常用联系人
    updateFrequentContacts(transferRecord) {
      const user = unifiedDataManager.getAllUsers().find(u => u.id === this.currentUser.id)
      if (!user) return
      
      if (!user.frequentContacts) {
        user.frequentContacts = []
      }
      
      const existingContact = user.frequentContacts.find(
        contact => contact.account === transferRecord.recipientAccount
      )
      
      if (existingContact) {
        // 更新现有联系人
        existingContact.lastTransfer = transferRecord.timestamp
        existingContact.transferCount = (existingContact.transferCount || 0) + 1
      } else {
        // 添加新联系人
        const newContact = {
          id: 'fc' + Date.now() + Math.random().toString(36).substr(2, 9),
          name: transferRecord.recipient,
          account: transferRecord.recipientAccount,
          bank: '中国农业银行', // 默认银行
          phone: transferRecord.recipientAccount.length === 11 ? transferRecord.recipientAccount : '',
          lastTransfer: transferRecord.timestamp,
          transferCount: 1
        }
        user.frequentContacts.unshift(newContact)
        
        // 只保留最近20个联系人
        if (user.frequentContacts.length > 20) {
          user.frequentContacts = user.frequentContacts.slice(0, 20)
        }
      }
      
      // 使用统一数据管理器更新联系人数据
      unifiedDataManager.updateUserData(this.currentUser.id, { frequentContacts: user.frequentContacts })
    },
    
    // 保存用户数据到本地存储
    saveUserData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUserId = uni.getStorageSync('currentUserId')
        
        if (currentUserId && users.length > 0) {
          const userIndex = users.findIndex(user => user.id === currentUserId)
          if (userIndex !== -1) {
            users[userIndex] = this.currentUser
            uni.setStorageSync('users', users)
            console.log('用户数据已保存到本地存储')
          }
        }
      } catch (error) {
        console.error('保存用户数据失败:', error)
      }
    },
    
    // 跳转到转账记录
    goToTransferHistory() {
      uni.navigateTo({
        url: '/pages/transfer/history'
      })
    },
    
    // 跳转到转账设置
    goToTransferSettings() {
      uni.showToast({
        title: '转账设置功能开发中',
        icon: 'none'
      })
    },
    
    // 交易密码验证成功
    async onPaymentConfirmed(paymentData) {
      try {
        this.isProcessing = true
        
        // 处理转账成功
        await this.processTransferSuccess()
        
        this.closePasswordModal()
        
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
    },

    // 加载用户数据
    async loadUserData() {
      try {
        await unifiedDataManager.init()
        this.currentUser = unifiedDataManager.getCurrentUser() || {}
        console.log('转账页面加载用户数据:', this.currentUser.username)
      } catch (error) {
        console.error('加载用户数据失败:', error)
        this.currentUser = {}
      }
    },

    // 初始化数据同步
    initDataSync() {
      try {
        // 监听统一数据管理器变化
        unifiedDataManager.onDataChange((data) => {
          console.log('转账页面收到数据更新事件:', data)
          this.loadUserData() // 重新加载用户数据
        })

        // 监听余额更新事件
        uni.$on('balanceUpdated', (data) => {
          console.log('转账页面收到余额更新事件:', data)
          if (data.userId && data.balance) {
            const currentUser = unifiedDataManager.getCurrentUser()
            if (currentUser && currentUser.id === data.userId) {
              this.loadUserData() // 重新加载用户数据
            }
          }
        })

        console.log('✅ 转账页面数据同步已初始化')
      } catch (error) {
        console.error('❌ 转账页面数据同步初始化失败:', error)
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

/* 其他用户 */
.other-users {
  background-color: #fff;
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.other-users .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.other-users .section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.other-users .section-desc {
  font-size: 24rpx;
  color: #999;
}

.users-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.user-item:active {
  background: #e9ecef;
  border-color: #007AFF;
  transform: scale(0.98);
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  margin-right: 24rpx;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.user-bank {
  font-size: 26rpx;
  color: #666;
}

.user-account {
  font-size: 24rpx;
  color: #999;
  font-family: 'Courier New', monospace;
}

.user-action {
  padding: 12rpx 24rpx;
  background: #007AFF;
  border-radius: 20rpx;
}

.action-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
}

/* 加载和错误状态样式 */
.loading-state, .error-state, .empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 20rpx;
  text-align: center;
}

.loading-text {
  color: #007AFF;
  font-size: 28rpx;
}

.error-state {
  background: #fff5f5;
  border: 2rpx solid #ffebee;
  border-radius: 12rpx;
  margin: 20rpx 0;
}

.error-text {
  color: #f56565;
  font-size: 28rpx;
  cursor: pointer;
}

.empty-state {
  background: #f8f9fa;
  border-radius: 12rpx;
  margin: 20rpx 0;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
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
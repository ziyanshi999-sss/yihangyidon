<template>
  <view class="ai-wealth-manager" :class="getThemeClass()" :style="getThemeStyle()">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-section">
      <view class="header-content">
        <view class="header-left">
          <button class="back-btn" @tap="goBack">
            <text class="back-icon">←</text>
          </button>
          <view class="ai-avatar-container">
            <image class="ai-avatar" src="/static/wealth/aiavatar.png" mode="aspectFill"></image>
            <view class="ai-status-dot"></view>
          </view>
          <view class="header-info">
            <text class="header-title">智能财富管家</text>
            <text class="header-subtitle">AI Wealth Manager</text>
          </view>
        </view>
        <view class="header-right">
          <button class="chat-btn" @tap="toggleChat">
            <text class="chat-icon">💬</text>
          </button>
        </view>
      </view>
    </view>
    
    <!-- 财富概览卡片 -->
    <view class="wealth-overview-card">
      <view class="wealth-header">
        <view class="wealth-info">
          <text class="wealth-label">总资产</text>
          <text class="wealth-amount">¥{{ formatNumber(userWealth.totalAssets) }}</text>
          <view class="wealth-change" :class="userWealth.changeType">
            <text class="change-icon">{{ userWealth.changeType === 'positive' ? '↗' : '↘' }}</text>
            <text class="change-text">{{ userWealth.changeType === 'positive' ? '+' : '' }}{{ userWealth.changePercent }}%</text>
          </view>
        </view>
        <view class="wealth-chart">
          <view class="chart-circle">
            <view class="chart-segment" v-for="(item, index) in wealthBreakdown" :key="index" 
                  :style="{ 
                    '--segment-color': item.color,
                    '--segment-percent': item.percent,
                    '--segment-start': getSegmentStart(index)
                  }">
            </view>
          </view>
          <view class="chart-center">
            <text class="chart-total">总资产</text>
            <text class="chart-amount">¥{{ formatNumber(userWealth.totalAssets) }}</text>
          </view>
        </view>
      </view>
      
      <view class="wealth-breakdown">
        <view class="breakdown-item" v-for="(item, index) in wealthBreakdown" :key="index">
          <view class="item-icon" :style="{ backgroundColor: item.color }">
            <text class="icon">{{ item.icon }}</text>
          </view>
          <view class="item-content">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-amount">¥{{ formatNumber(item.amount) }}</text>
          </view>
          <text class="item-percent">{{ item.percent }}%</text>
        </view>
      </view>
    </view>
    
    <!-- AI智能分析 -->
    <view class="ai-analysis-section">
      <view class="ai-header">
        <view class="ai-title-container">
          <view class="ai-icon">🤖</view>
          <view class="ai-title-info">
            <text class="ai-title">AI智能分析</text>
            <text class="ai-subtitle">基于您的数据提供专业建议</text>
          </view>
        </view>
        <view class="ai-status" :class="{ active: !isLoading }">
          <view class="status-dot"></view>
          <text class="status-text">{{ isLoading ? '分析中' : (hasFullAccess ? '已授权' : '未授权') }}</text>
        </view>
        
        <!-- 用户选择器 -->
        <view class="user-selector" @tap="showUserSelector" v-if="currentUserInfo">
          <view class="user-avatar">
            <image :src="currentUserInfo.avatar" mode="aspectFill"></image>
          </view>
          <view class="user-info">
            <text class="user-name">{{ currentUserInfo.realName }}</text>
            <text class="user-balance">余额: ¥{{ currentUserInfo.balance.toLocaleString() }}</text>
          </view>
          <view class="user-arrow">
            <text class="arrow">▼</text>
          </view>
        </view>
      </view>
      
      <view class="ai-features">
        <view class="feature-card primary" @tap="getSmartAdvice" :class="{ disabled: isLoading }">
          <view class="feature-icon">
            <text class="icon">💡</text>
          </view>
          <view class="feature-content">
            <text class="feature-title">智能建议</text>
            <text class="feature-desc">获取个性化投资建议</text>
          </view>
          <view class="feature-arrow">
            <text class="arrow">→</text>
          </view>
        </view>
        
        <view class="feature-card" @tap="generateFinancialReport" :class="{ disabled: isLoading }">
          <view class="feature-icon">
            <text class="icon">📊</text>
          </view>
          <view class="feature-content">
            <text class="feature-title">财务报告</text>
            <text class="feature-desc">生成详细分析报告</text>
          </view>
          <view class="feature-arrow">
            <text class="arrow">→</text>
          </view>
        </view>
        
        <view class="feature-card" @tap="assessRisk" :class="{ disabled: isLoading }">
          <view class="feature-icon">
            <text class="icon">🛡️</text>
          </view>
          <view class="feature-content">
            <text class="feature-title">风险评估</text>
            <text class="feature-desc">全面风险分析评估</text>
          </view>
          <view class="feature-arrow">
            <text class="arrow">→</text>
          </view>
        </view>
      </view>
      
      <!-- 权限管理 -->
      <view class="permission-section" v-if="!hasFullAccess">
        <view class="permission-card">
          <view class="permission-icon">🔐</view>
          <view class="permission-content">
            <text class="permission-title">数据访问权限</text>
            <text class="permission-desc">授予AI完整的数据访问权限以获得更好的服务体验</text>
          </view>
          <button class="permission-btn" @tap="requestFullAccess" :disabled="isLoading">
            <text class="btn-text">授予权限</text>
          </button>
        </view>
      </view>
      
      <!-- 权限管理按钮 -->
      <view class="permission-actions" v-if="hasFullAccess">
        <button class="permission-action-btn" @tap="managePermissions">
          <text class="btn-icon">⚙️</text>
          <text class="btn-text">权限管理</text>
        </button>
      </view>
    </view>
    
    <!-- 资产配置优化 -->
    <view class="allocation-section">
      <view class="section-title">资产配置优化</view>
      <view class="allocation-content">
        <view class="allocation-chart">
          <view class="chart-container">
            <view class="pie-chart" ref="pieChart"></view>
          </view>
          <view class="allocation-legend">
            <view class="legend-item" v-for="(item, index) in allocationData" :key="index">
              <view class="legend-color" :style="{ backgroundColor: item.color }"></view>
              <text class="legend-label">{{ item.name }}</text>
              <text class="legend-percent">{{ item.percent }}%</text>
            </view>
          </view>
        </view>
        <view class="allocation-actions">
          <button class="action-btn primary" @tap="showAllocationDetail">查看详细配置</button>
          <button class="action-btn secondary" @tap="autoRebalance">一键调仓</button>
        </view>
      </view>
    </view>
    
    <!-- 目标管理 -->
    <view class="goals-section">
      <view class="section-title">目标管理</view>
      <view class="goals-list">
        <view class="goal-item" v-for="(goal, index) in userGoals" :key="index" @tap="viewGoalDetail(goal)">
          <view class="goal-left">
            <view class="goal-icon" :style="{ backgroundColor: goal.color }">
              <text class="icon">{{ goal.icon }}</text>
            </view>
            <view class="goal-content">
              <text class="goal-title">{{ goal.title }}</text>
              <text class="goal-target">目标：¥{{ formatNumber(goal.target) }}</text>
              <view class="goal-progress">
                <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: goal.progress + '%', backgroundColor: goal.color }"></view>
                </view>
                <text class="progress-text">{{ goal.progress }}%</text>
              </view>
            </view>
          </view>
          <view class="goal-right">
            <text class="goal-timeline">{{ goal.timeline }}</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
      <view class="goal-actions">
        <button class="action-btn primary" @tap="addNewGoal">添加新目标</button>
        <button class="action-btn secondary" @tap="viewAllGoals">查看所有目标</button>
      </view>
    </view>
    
    <!-- 智能建议 -->
    <view class="suggestions-section">
      <view class="section-title">智能建议</view>
      <view class="suggestions-list">
        <view class="suggestion-item" v-for="(suggestion, index) in smartSuggestions" :key="index" @tap="applySuggestion(suggestion)">
          <view class="suggestion-left">
            <view class="suggestion-priority" :class="suggestion.priority">
              <text class="priority-text">{{ suggestion.priorityText }}</text>
            </view>
            <view class="suggestion-content">
              <text class="suggestion-title">{{ suggestion.title }}</text>
              <text class="suggestion-desc">{{ suggestion.description }}</text>
              <text class="suggestion-benefit">预期收益：{{ suggestion.benefit }}</text>
            </view>
          </view>
          <view class="suggestion-right">
            <text class="suggestion-action">立即执行</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 客户经理对接 -->
    <view class="advisor-section">
      <view class="section-title">专属客户经理</view>
      <view class="advisor-card" v-if="assignedAdvisor">
        <view class="advisor-info">
          <image class="advisor-avatar" :src="assignedAdvisor.avatar" mode="aspectFill"></image>
          <view class="advisor-details">
            <text class="advisor-name">{{ assignedAdvisor.name }}</text>
            <text class="advisor-title">{{ assignedAdvisor.title }}</text>
            <text class="advisor-experience">{{ assignedAdvisor.experience }}</text>
            <view class="advisor-rating">
              <view class="rating-stars">
                <text class="star" v-for="n in 5" :key="n" :class="{ active: n <= assignedAdvisor.rating }">★</text>
              </view>
              <text class="rating-text">{{ assignedAdvisor.rating }}/5.0</text>
            </view>
          </view>
        </view>
        <view class="advisor-actions">
          <button class="action-btn primary" @tap="contactAdvisor">联系客户经理</button>
          <button class="action-btn secondary" @tap="scheduleMeeting">预约面谈</button>
        </view>
      </view>
    </view>
    
    <!-- AI对话界面 -->
    <view class="ai-chat-overlay" v-if="showChat" @tap="closeChat">
      <view class="chat-container" ref="chatContainer" @tap.stop>
        <view class="chat-header">
          <view class="chat-avatar">
            <image class="ai-avatar-small" src="/static/wealth/aiavatar.png" mode="aspectFill"></image>
            <view class="ai-status-small"></view>
          </view>
          <view class="chat-info">
            <text class="chat-name">AI财富管家</text>
            <text class="chat-status">在线</text>
          </view>
          <button class="close-btn" @tap="closeChat">×</button>
        </view>
        
        <view class="chat-messages" ref="chatMessages">
          <view class="message-item" v-for="(message, index) in chatMessages" :key="index" :class="message.type">
            <view class="message-avatar" v-if="message.type === 'ai'">
              <image class="avatar-img" src="/static/wealth/aiavatar.png" mode="aspectFill"></image>
            </view>
            <view class="message-content">
            <view class="message-bubble">
              <text class="message-text">{{ message.content }}</text>
              <text class="message-time">{{ message.time }}</text>
            </view>
            </view>
          </view>
        </view>
        
        <view class="chat-input">
          <view class="input-container">
            <input class="message-input" v-model="inputMessage" placeholder="输入您的问题..." @confirm="sendMessage" />
            <button class="send-btn" @tap="sendMessage" :disabled="!inputMessage.trim()">
              <text class="send-icon">📤</text>
            </button>
          </view>
          <view class="quick-questions">
            <button class="quick-btn" v-for="(question, index) in quickQuestions" :key="index" @tap="sendQuickQuestion(question)">
              {{ question }}
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import themeMixin from '@/mixins/theme-mixin.js'
import zhipuAI from '@/api/zhipu-ai.js'
import projectDataAnalyzer from '@/utils/project-data-analyzer.js'
import dataPermissionManager from '@/utils/data-permission-manager.js'
import enhancedDataOperator from '@/utils/enhanced-data-operator.js'
import userDataLoader from '@/utils/user-data-loader.js'
import scrollControl from '@/utils/scroll-control.js'

export default {
  name: 'AIWealthManager',
  mixins: [themeMixin],
  data() {
    return {
      showChat: false,
      inputMessage: '',
      isLoading: false,
      aiAnalysis: null,
      smartAdvice: null,
      projectData: null,
      permissionStatus: null,
      hasFullAccess: false,
      availableUsers: [],
      selectedUserId: 'u001',
      currentUserInfo: null,
      chatMessages: [
        {
          type: 'ai',
          content: '您好！我是您的AI财富管家，很高兴为您服务！我可以帮您分析财务状况、提供投资建议、解答理财问题。有什么我可以帮助您的吗？',
          time: '刚刚'
        }
      ],
      quickQuestions: [
        '我的财务状况如何？',
        '有什么投资建议？',
        '如何优化资产配置？',
        '帮我分析一下风险'
      ],
      userWealth: {
        totalAssets: 125689.23,
        changeType: 'positive',
        changePercent: 3.2
      },
      wealthBreakdown: [
        { icon: '💰', label: '活期存款', amount: 32541.78, percent: 26, color: '#4CAF50' },
        { icon: '🏦', label: '定期存款', amount: 80000.00, percent: 64, color: '#2196F3' },
        { icon: '📈', label: '投资理财', amount: 13147.45, percent: 10, color: '#FF9800' }
      ],
      aiAnalysis: [
        {
          type: 'success',
          icon: '✅',
          title: '财务健康度优秀',
          description: '您的储蓄率达到35%，超出健康标准，建议考虑投资增值',
          action: '查看投资建议'
        },
        {
          type: 'warning',
          icon: '⚠️',
          title: '消费结构优化',
          description: '外卖支出占比25%，建议使用农行生活缴费享满减优惠',
          action: '立即优化'
        },
        {
          type: 'info',
          icon: '💡',
          title: '闲置资金发现',
          description: '发现3笔闲置资金，建议转入农银时时付获得更高收益',
          action: '查看详情'
        }
      ],
      allocationData: [
        { name: '现金类', percent: 30, color: '#4CAF50' },
        { name: '债券类', percent: 40, color: '#2196F3' },
        { name: '股票类', percent: 20, color: '#FF9800' },
        { name: '另类投资', percent: 10, color: '#9C27B0' }
      ],
      userGoals: [
        {
          icon: '🏠',
          title: '购房首付',
          target: 500000,
          progress: 65,
          timeline: '2026年8月',
          color: '#4CAF50'
        },
        {
          icon: '🎓',
          title: '教育基金',
          target: 150000,
          progress: 40,
          timeline: '2028年6月',
          color: '#2196F3'
        },
        {
          icon: '🌴',
          title: '退休规划',
          target: 1000000,
          progress: 25,
          timeline: '2040年12月',
          color: '#FF9800'
        }
      ],
      smartSuggestions: [
        {
          priority: 'high',
          priorityText: '高优先级',
          title: '优化资产配置',
          description: '建议将部分现金转入农银汇理平衡基金，预期年化收益6-8%',
          benefit: '年化收益提升2-3%'
        },
        {
          priority: 'medium',
          priorityText: '中优先级',
          title: '增加定投金额',
          description: '基于您的收入增长，建议将定投金额从2000元提升至3000元',
          benefit: '目标达成时间提前6个月'
        },
        {
          priority: 'low',
          priorityText: '低优先级',
          title: '保险配置建议',
          description: '建议配置重疾险和意外险，完善家庭保障体系',
          benefit: '风险保障提升80%'
        }
      ],
      assignedAdvisor: {
        name: '张理财',
        title: '高级理财顾问',
        experience: '8年从业经验',
        rating: 4.8,
        avatar: '/static/wealth/useravatar.jpg'
      }
    }
  },
  async onLoad() {
    await this.loadAvailableUsers()
    await this.loadUserWealthData()
    await this.checkPermissions()
    await this.loadProjectData()
    await this.generateAIAnalysis()
  },
  
  onUnload() {
    // 页面卸载时解锁滚动
    scrollControl.unlockScroll()
  },
  
  onHide() {
    // 页面隐藏时解锁滚动
    scrollControl.unlockScroll()
  },
  
  onShow() {
    // 页面显示时不锁定滚动，允许正常滑动
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    
    /**
     * 加载可用用户列表
     */
    async loadAvailableUsers() {
      try {
        const users = await userDataLoader.loadAllUsers()
        this.availableUsers = users.map(user => ({
          id: user.id,
          username: user.username,
          realName: user.realName,
          phone: user.phone,
          balance: user.balance,
          avatar: user.avatar
        }))
        
        // 设置默认用户
        if (this.availableUsers.length > 0) {
          this.selectedUserId = this.availableUsers[0].id
          this.currentUserInfo = this.availableUsers[0]
        }
        
        console.log('可用用户列表:', this.availableUsers)
      } catch (error) {
        console.error('加载用户列表失败:', error)
        // 静默处理错误，使用默认用户数据
        this.availableUsers = [
          {
            id: 'u001',
            username: '李华',
            realName: '李华',
            phone: '13888888888',
            balance: 280000.00,
            avatar: '/static/wealth/useravatar.jpg'
          }
        ]
        this.selectedUserId = 'u001'
        this.currentUserInfo = this.availableUsers[0]
      }
    },
    
    /**
     * 切换用户
     */
    async switchUser(userId) {
      try {
        this.selectedUserId = userId
        this.currentUserInfo = this.availableUsers.find(u => u.id === userId)
        
        // 更新本地存储
        uni.setStorageSync('loginInfo', {
          userId: userId,
          username: this.currentUserInfo.username
        })
        
        // 重新加载数据
        await this.loadUserWealthData()
        await this.loadProjectData()
        await this.generateAIAnalysis()
        
        uni.showToast({
          title: `已切换到${this.currentUserInfo.realName}`,
          icon: 'success'
        })
      } catch (error) {
        console.error('切换用户失败:', error)
        // 静默处理错误，不显示错误提示
      }
    },
    
    /**
     * 显示用户选择器
     */
    showUserSelector() {
      const userList = this.availableUsers.map(user => 
        `${user.realName} (${user.username}) - 余额: ¥${user.balance.toLocaleString()}`
      )
      
      uni.showActionSheet({
        itemList: userList,
        success: (res) => {
          const selectedUser = this.availableUsers[res.tapIndex]
          this.switchUser(selectedUser.id)
        }
      })
    },
    
    /**
     * 检查权限状态
     */
    async checkPermissions() {
      try {
        this.permissionStatus = dataPermissionManager.getPermissionStatus()
        this.hasFullAccess = dataPermissionManager.getPermissionSummary().hasFullAccess
        
        console.log('权限状态:', this.permissionStatus)
      } catch (error) {
        console.error('检查权限失败:', error)
      }
    },
    
    /**
     * 请求完整数据访问权限
     */
    async requestFullAccess() {
      try {
        const granted = await dataPermissionManager.requestDataAccess('all', 'analysis')
        if (granted) {
          this.hasFullAccess = true
          this.permissionStatus = dataPermissionManager.getPermissionStatus()
          
          uni.showToast({
            title: '权限授予成功',
            icon: 'success'
          })
          
          // 重新加载数据
          await this.loadProjectData()
          await this.generateAIAnalysis()
        } else {
          uni.showToast({
            title: '权限被拒绝',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('请求权限失败:', error)
        uni.showToast({
          title: '权限请求失败',
          icon: 'error'
        })
      }
    },
    
    /**
     * 管理数据权限
     */
    managePermissions() {
      uni.showModal({
        title: '数据权限管理',
        content: '您希望如何管理AI对您数据的访问权限？',
        confirmText: '查看权限',
        cancelText: '重置权限',
        success: (res) => {
          if (res.confirm) {
            this.showPermissionDetails()
          } else {
            this.resetPermissions()
          }
        }
      })
    },
    
    /**
     * 显示权限详情
     */
    showPermissionDetails() {
      const summary = dataPermissionManager.getPermissionSummary()
      const content = `当前权限状态：
      
读取权限：${summary.readPermissions}项
写入权限：${summary.writePermissions}项
分析权限：${summary.analyzePermissions}项

${this.hasFullAccess ? '✅ 已授予完整访问权限' : '❌ 未授予完整访问权限'}`
      
      uni.showModal({
        title: '权限详情',
        content: content,
        showCancel: false
      })
    },
    
    /**
     * 重置所有权限
     */
    resetPermissions() {
      uni.showModal({
        title: '重置权限',
        content: '确定要重置所有数据访问权限吗？这将撤销AI对您数据的所有访问权限。',
        success: (res) => {
          if (res.confirm) {
            dataPermissionManager.resetAllPermissions()
            this.hasFullAccess = false
            this.permissionStatus = dataPermissionManager.getPermissionStatus()
            
            uni.showToast({
              title: '权限已重置',
              icon: 'success'
            })
          }
        }
      })
    },
    
    /**
     * 加载项目数据
     */
    async loadProjectData() {
      try {
        this.isLoading = true
        
        // 使用增强的数据操作器获取完整数据
        const data = await enhancedDataOperator.collectAllUserData()
        this.projectData = data
        
        // 更新用户财富数据
        this.userWealth.totalAssets = data.accountData.totalBalance
        this.userWealth.changePercent = data.investmentData.returnRate || 3.2
        this.userWealth.changeType = this.userWealth.changePercent >= 0 ? 'positive' : 'negative'
        
        console.log('项目数据加载完成:', data)
      } catch (error) {
        console.error('加载项目数据失败:', error)
        
        // 静默处理错误，不显示弹窗
        // 使用默认数据确保页面正常显示
        this.userWealth.totalAssets = 150000
        this.userWealth.changePercent = 3.2
        this.userWealth.changeType = 'positive'
        
        // 如果权限被拒绝，静默请求权限
        if (error.message.includes('权限')) {
          try {
            await this.requestFullAccess()
          } catch (permissionError) {
            console.log('权限请求被拒绝，使用默认数据')
          }
        }
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 加载用户财富数据
     */
    async loadUserWealthData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn) || users[0]
        
        if (currentUser && currentUser.wealthProducts) {
          // 更新财富分解数据
          const deposits = currentUser.wealthProducts.deposits || {}
          const investments = currentUser.wealthProducts.investments || []
          
          // 计算总资产
          const totalAssets = (deposits.current || 0) + (deposits.fixed || 0) + (deposits.smart || 0) + 
                             investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
          
          // 更新财富分解
          this.wealthBreakdown = [
            { 
              icon: '💰', 
              label: '活期存款', 
              amount: deposits.current || 0, 
              percent: totalAssets > 0 ? Math.round((deposits.current || 0) / totalAssets * 100) : 0, 
              color: '#4CAF50' 
            },
            { 
              icon: '🏦', 
              label: '定期存款', 
              amount: deposits.fixed || 0, 
              percent: totalAssets > 0 ? Math.round((deposits.fixed || 0) / totalAssets * 100) : 0, 
              color: '#2196F3' 
            },
            { 
              icon: '📈', 
              label: '投资理财', 
              amount: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0), 
              percent: totalAssets > 0 ? Math.round(investments.reduce((sum, inv) => sum + (inv.amount || 0), 0) / totalAssets * 100) : 0, 
              color: '#FF9800' 
            }
          ]
          
          // 更新用户财富数据
          this.userWealth.totalAssets = totalAssets
          
          console.log('✅ 用户财富数据加载成功:', {
            totalAssets,
            wealthBreakdown: this.wealthBreakdown
          })
        }
      } catch (error) {
        console.error('❌ 加载用户财富数据失败:', error)
      }
    },

    /**
     * 生成AI分析
     */
    async generateAIAnalysis() {
      try {
        this.isLoading = true
        const analysis = await projectDataAnalyzer.analyzeWithAI()
        
        if (analysis.success) {
          this.aiAnalysis = analysis.aiAnalysis
          console.log('AI分析完成:', analysis.aiAnalysis)
        } else {
          console.error('AI分析失败:', analysis.error)
        }
      } catch (error) {
        console.error('生成AI分析失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 获取智能建议
     */
    async getSmartAdvice() {
      try {
        this.isLoading = true
        
        // 分析用户当前财务状况
        const userAnalysis = this.analyzeUserFinancialStatus()
        
        // 获取市场趋势分析
        const marketAnalysis = await this.getMarketTrendAnalysis()
        
        // 生成个性化建议
        const personalizedAdvice = this.generatePersonalizedAdvice(userAnalysis, marketAnalysis)
        
        // 显示智能建议模态框
        this.showAdviceModal(personalizedAdvice)
        
      } catch (error) {
        console.error('获取智能建议失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    analyzeUserFinancialStatus() {
      const totalAssets = this.userWealth.totalAssets || 280000
      const monthlyIncome = 15000 // 模拟月收入
      const monthlyExpenses = 8000 // 模拟月支出
      const emergencyFund = 50000 // 应急资金
      
      return {
        totalAssets,
        monthlyIncome,
        monthlyExpenses,
        emergencyFund,
        savingsRate: ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1),
        debtToIncomeRatio: 0.3, // 模拟负债收入比
        riskCapacity: this.calculateRiskCapacity(totalAssets, monthlyIncome),
        liquidityRatio: (emergencyFund / monthlyExpenses).toFixed(1)
      }
    },
    
    calculateRiskCapacity(assets, income) {
      if (assets > 500000 && income > 20000) return 'high'
      if (assets > 200000 && income > 10000) return 'medium'
      return 'low'
    },
    
    async getMarketTrendAnalysis() {
      // 模拟市场分析数据
      return {
        marketTrend: 'bullish',
        volatility: 'medium',
        interestRate: 3.5,
        inflationRate: 2.1,
        recommendedAllocation: {
          stocks: 25,
          bonds: 35,
          cash: 25,
          alternatives: 15
        }
      }
    },
    
    generatePersonalizedAdvice(userAnalysis, marketAnalysis) {
      const advice = {
        title: '个性化财富建议',
        summary: '',
        recommendations: [],
        riskAssessment: '',
        nextSteps: []
      }
      
      // 根据用户财务状况生成建议
      if (userAnalysis.savingsRate < 20) {
        advice.recommendations.push({
          type: 'savings',
          title: '提高储蓄率',
          description: `当前储蓄率${userAnalysis.savingsRate}%，建议提升至20%以上`,
          priority: 'high',
          action: '制定预算计划，减少非必要支出'
        })
      }
      
      if (userAnalysis.liquidityRatio < 6) {
        advice.recommendations.push({
          type: 'emergency',
          title: '建立应急基金',
          description: `建议储备6个月的生活费用作为应急基金`,
          priority: 'high',
          action: '将部分资金转入货币基金'
        })
      }
      
      // 投资建议
      if (userAnalysis.riskCapacity === 'high') {
        advice.recommendations.push({
          type: 'investment',
          title: '优化投资组合',
          description: '基于您的风险承受能力，建议增加股票类资产配置',
          priority: 'medium',
          action: '考虑定投指数基金'
        })
      }
      
      // 市场趋势建议
      if (marketAnalysis.marketTrend === 'bullish') {
        advice.recommendations.push({
          type: 'market',
          title: '把握市场机会',
          description: '当前市场趋势向好，适合适度增加权益类投资',
          priority: 'medium',
          action: '关注优质成长股和指数基金'
        })
      }
      
      advice.summary = `基于您的财务状况分析，我们为您提供了${advice.recommendations.length}项个性化建议`
      advice.riskAssessment = `您的风险承受能力为${userAnalysis.riskCapacity}，建议采用稳健型投资策略`
      advice.nextSteps = ['制定详细投资计划', '设置自动定投', '定期评估投资表现']
      
      return advice
    },
    
    showAdviceModal(advice) {
      // 创建建议详情页面数据
      const adviceData = {
        title: advice.title,
        summary: advice.summary,
        recommendations: advice.recommendations,
        riskAssessment: advice.riskAssessment,
        nextSteps: advice.nextSteps
      }
      
      // 存储到本地，供详情页面使用
      uni.setStorageSync('currentAdvice', adviceData)
      
      // 跳转到建议详情页面
      uni.navigateTo({
        url: '/pages/wealth/advice-detail'
      })
    },
    
    /**
     * 生成财务报告
     */
    async generateFinancialReport() {
      try {
        this.isLoading = true
        const report = await zhipuAI.generateFinancialReport(this.projectData, 'monthly')
        
        if (report.success) {
          uni.showModal({
            title: '财务分析报告',
            content: report.content,
            showCancel: false
          })
        } else {
          uni.showToast({
            title: '生成报告失败',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('生成财务报告失败:', error)
        uni.showToast({
          title: '网络错误',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 风险评估
     */
    async assessRisk() {
      try {
        this.isLoading = true
        const riskAssessment = await zhipuAI.assessRisk(
          this.projectData,
          {
            marketVolatility: 'medium',
            interestRate: 3.5,
            inflation: 2.1,
            economicOutlook: 'stable'
          }
        )
        
        if (riskAssessment.success) {
          uni.showModal({
            title: '风险评估报告',
            content: riskAssessment.content,
            showCancel: false
          })
        } else {
          uni.showToast({
            title: '风险评估失败',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('风险评估失败:', error)
        uni.showToast({
          title: '网络错误',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 执行AI建议
     */
    async executeAISuggestion(suggestion) {
      try {
        this.isLoading = true
        
        // 使用增强数据操作器执行AI建议
        const result = await enhancedDataOperator.executeAISuggestion(suggestion)
        
        if (result.success) {
          uni.showModal({
            title: 'AI建议执行成功',
            content: result.message,
            showCancel: false
          })
          
          // 重新加载数据
          await this.loadProjectData()
        } else {
          uni.showToast({
            title: '执行建议失败',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('执行AI建议失败:', error)
        uni.showToast({
          title: '执行失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 智能数据操作
     */
    async performDataOperation(operation, data) {
      try {
        this.isLoading = true
        
        const result = await enhancedDataOperator.performDataOperation(operation, data)
        
        if (result.success) {
          uni.showToast({
            title: result.message,
            icon: 'success'
          })
          
          // 重新加载数据
          await this.loadProjectData()
        } else {
          uni.showToast({
            title: '操作失败',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('数据操作失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    formatNumber(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    getSegmentStart(index) {
      let start = 0
      for (let i = 0; i < index; i++) {
        start += this.wealthBreakdown[i].percent
      }
      return start
    },
    toggleChat() {
      this.showChat = !this.showChat
      
      // 控制滚动穿透
      if (this.showChat) {
        scrollControl.handleChatScroll(true, this.$refs.chatContainer)
      } else {
        scrollControl.handleChatScroll(false, this.$refs.chatContainer)
      }
    },
    closeChat() {
      this.showChat = false
      // 关闭聊天时解锁滚动
      scrollControl.handleChatScroll(false, this.$refs.chatContainer)
    },
    async sendMessage() {
      if (!this.inputMessage.trim()) return
      
      // 添加用户消息
      this.chatMessages.push({
        type: 'user',
        content: this.inputMessage,
        time: this.getCurrentTime()
      })
      
      const userMessage = this.inputMessage
      this.inputMessage = ''
      
      try {
        // 使用智谱AI进行对话
        const response = await zhipuAI.chatWithAI(userMessage, {
          userData: this.projectData,
          currentWealth: this.userWealth,
          context: 'wealth_management'
        })
        
        if (response.success) {
          this.chatMessages.push({
            type: 'ai',
            content: response.content,
            time: this.getCurrentTime()
          })
        } else {
          // 如果AI请求失败，使用本地回复
          const fallbackResponse = this.generateAIResponse(userMessage)
          this.chatMessages.push({
            type: 'ai',
            content: fallbackResponse,
            time: this.getCurrentTime()
          })
        }
      } catch (error) {
        console.error('AI对话失败:', error)
        // 使用本地回复作为备选
        const fallbackResponse = this.generateAIResponse(userMessage)
        this.chatMessages.push({
          type: 'ai',
          content: fallbackResponse,
          time: this.getCurrentTime()
        })
      }
      
      this.scrollToBottom()
    },
    sendQuickQuestion(question) {
      this.inputMessage = question
      this.sendMessage()
    },
    generateAIResponse(userMessage) {
      const responses = {
        '我的财务状况如何': '根据您的数据，您的财务状况整体良好。总资产125,689元，储蓄率达到35%，超出健康标准。建议适当增加投资比例以提升收益。',
        '有什么投资建议': '基于您的风险偏好，我建议：1. 增加债券基金配置至40%；2. 考虑定投股票基金；3. 配置部分黄金作为避险资产。',
        '如何优化资产配置': '当前现金配置偏高，建议：1. 减少5%现金配置；2. 增加债券类产品；3. 保持股票类配置不变。',
        '帮我分析一下风险': '您的风险等级为中等，适合平衡型配置。建议定期评估风险承受能力，根据市场变化调整配置比例。'
      }
      
      // 简单的关键词匹配
      for (const [key, response] of Object.entries(responses)) {
        if (userMessage.includes(key)) {
          return response
        }
      }
      
      // 默认回复
      return '感谢您的问题！作为您的AI财富管家，我可以帮您分析财务状况、提供投资建议、制定理财计划。请告诉我您具体想了解什么？'
    },
    getCurrentTime() {
      const now = new Date()
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    },
    scrollToBottom() {
      this.$nextTick(() => {
        // 滚动到底部
        const chatMessages = this.$refs.chatMessages
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight
        }
      })
    },
    handleAnalysisAction(analysis) {
      uni.showModal({
        title: analysis.title,
        content: analysis.description,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '操作已执行',
              icon: 'success'
            })
          }
        }
      })
    },
    viewGoalDetail(goal) {
      uni.showModal({
        title: goal.title,
        content: `目标金额：¥${this.formatNumber(goal.target)}\n完成进度：${goal.progress}%\n时间期限：${goal.timeline}`,
        showCancel: false
      })
    },
    addNewGoal() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },
    viewAllGoals() {
      uni.showToast({
        title: '目标管理功能暂不可用',
        icon: 'none',
        duration: 2000
      })
    },
    applySuggestion(suggestion) {
      uni.showModal({
        title: suggestion.title,
        content: suggestion.description,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '建议已应用',
              icon: 'success'
            })
          }
        }
      })
    },
    showAllocationDetail() {
      uni.navigateTo({
        url: '/pages/wealth/asset-allocation-detail'
      })
    },
    autoRebalance() {
      uni.showModal({
        title: '一键调仓',
        content: '系统将根据您的风险偏好和市场情况自动调整资产配置，确定继续吗？',
        success: (res) => {
          if (res.confirm) {
            this.executeAutoRebalance()
          }
        }
      })
    },
    
    executeAutoRebalance() {
      uni.showLoading({ title: '正在分析市场...' })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showLoading({ title: '正在调仓...' })
        
        // 模拟调仓过程
        setTimeout(() => {
          uni.hideLoading()
          
          // 更新资产配置数据
          this.allocationData = [
            { name: '现金类', percent: 25, color: '#4CAF50' },
            { name: '债券类', percent: 35, color: '#2196F3' },
            { name: '股票类', percent: 25, color: '#FF9800' },
            { name: '另类投资', percent: 15, color: '#9C27B0' }
          ]
          
          uni.showModal({
            title: '调仓完成',
            content: '资产配置已根据市场情况优化调整，预期年化收益率提升至8.5%',
            showCancel: false,
            success: () => {
              // 跳转到资产配置详情页面
              uni.navigateTo({
                url: '/pages/wealth/asset-allocation-detail'
              })
            }
          })
        }, 2000)
      }, 1500)
    },
    addNewGoal() {
      uni.showToast({
        title: '目标管理功能暂不可用',
        icon: 'none',
        duration: 2000
      })
    },
    viewAllGoals() {
      uni.navigateTo({
        url: '/pages/wealth/goal-list'
      })
    },
    applySuggestion(suggestion) {
      uni.showModal({
        title: '执行建议',
        content: suggestion.description,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '建议已执行',
              icon: 'success'
            })
          }
        }
      })
    },
    contactAdvisor() {
      // 显示确认对话框
      uni.showModal({
        title: '联系客户经理',
        content: '是否拨打客户经理电话：15903724152？',
        confirmText: '拨打',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户确认后自动拨打电话
            uni.makePhoneCall({
              phoneNumber: '15903724152',
              success: () => {
                console.log('拨打电话成功')
                uni.showToast({
                  title: '正在拨打电话...',
                  icon: 'success'
                })
              },
              fail: (err) => {
                console.error('拨打电话失败:', err)
                uni.showToast({
                  title: '拨打电话失败',
                  icon: 'none'
                })
                // 如果拨打电话失败，跳转到聊天页面作为备选
                uni.navigateTo({
                  url: '/pages/wealth/advisor-chat'
                })
              }
            })
          }
        }
      })
    },
    scheduleMeeting() {
      uni.navigateTo({
        url: '/pages/wealth/meeting-schedule'
      })
    }
  }
}
</script>

<style scoped>
.ai-wealth-manager {
  min-height: 100vh;
  background: var(--theme-background, #f5f5f5);
  padding: 0;
  transition: background-color 0.3s ease;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 顶部背景 */
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  z-index: 1;
}

/* 顶部导航栏 */
.header-section {
  position: relative;
  z-index: 2;
  padding: 40rpx 30rpx;
  background: transparent;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 28rpx;
  color: white;
  font-weight: bold;
}


.ai-avatar-container {
  position: relative;
}

.ai-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
}

.ai-status-dot {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 20rpx;
  height: 20rpx;
  background: #4caf50;
  border-radius: 50%;
  border: 3rpx solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.chat-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
}

.chat-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.chat-icon {
  font-size: 24rpx;
  color: white;
}

/* 财富概览卡片 */
.wealth-overview-card {
  position: relative;
  z-index: 2;
  margin: 40rpx 30rpx 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.wealth-header {
  display: flex;
  align-items: center;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.wealth-info {
  flex: 1;
  text-align: center;
}

.wealth-label {
  font-size: 24rpx;
  color: var(--text-color, #666);
  display: block;
  margin-bottom: 12rpx;
}

.wealth-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #4caf50;
  display: block;
  margin-bottom: 16rpx;
}

.wealth-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.wealth-change.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.wealth-change.negative {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.change-icon {
  font-size: 16rpx;
}

.wealth-chart {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.chart-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 0deg 93.6deg,
    #2196F3 93.6deg 230.4deg,
    #FF9800 230.4deg 360deg
  );
  position: relative;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: white;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-total {
  font-size: 18rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.chart-amount {
  font-size: 20rpx;
  font-weight: bold;
  color: #333;
}

.wealth-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border: 1rpx solid #e9ecef;
}

.item-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon .icon {
  font-size: 24rpx;
  color: white;
}

.item-content {
  flex: 1;
}

.item-label {
  font-size: 24rpx;
  color: var(--text-color, #333);
  display: block;
  margin-bottom: 4rpx;
  font-weight: 500;
}

.item-amount {
  font-size: 20rpx;
  color: #666;
}

.item-percent {
  font-size: 24rpx;
  font-weight: bold;
  color: #4caf50;
}

/* 分析部分 */
.analysis-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-color, #333);
  padding: 30rpx 40rpx 20rpx;
  border-bottom: 1rpx solid var(--border-color, #f0f0f0);
}

.analysis-list {
  padding: 0 40rpx;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid var(--border-color, #f0f0f0);
  transition: all 0.3s ease;
}

.analysis-item:last-child {
  border-bottom: none;
}

.analysis-item:active {
  background: rgba(76, 175, 80, 0.05);
}

.analysis-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.analysis-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.analysis-icon.success {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.analysis-icon.warning {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.analysis-icon.info {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.analysis-icon .icon {
  font-size: 24rpx;
  color: white;
}

.analysis-content {
  flex: 1;
}

.analysis-title {
  font-size: 30rpx;
  color: var(--text-color, #333);
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.analysis-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.analysis-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.analysis-action {
  font-size: 24rpx;
  color: #4caf50;
  font-weight: 500;
}

.arrow {
  font-size: 28rpx;
  color: #999;
}

/* 资产配置部分 */
.allocation-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.allocation-content {
  padding: 0 40rpx 40rpx;
}

.allocation-chart {
  display: flex;
  align-items: center;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.chart-container {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 0deg 120deg,
    #2196F3 120deg 240deg,
    #FF9800 240deg 360deg
  );
}

.allocation-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.legend-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 24rpx;
  color: var(--text-color, #333);
  flex: 1;
}

.legend-percent {
  font-size: 24rpx;
  color: #4caf50;
  font-weight: bold;
}

.allocation-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 25rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.action-btn.secondary {
  background: #f5f5f5;
  color: var(--text-color, #333);
  border: 1rpx solid #e0e0e0;
}

.action-btn:active {
  transform: scale(0.98);
}

/* 目标管理部分 */
.goals-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.goals-list {
  padding: 0 40rpx;
}

.goal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid var(--border-color, #f0f0f0);
  transition: all 0.3s ease;
}

.goal-item:last-child {
  border-bottom: none;
}

.goal-item:active {
  background: rgba(76, 175, 80, 0.05);
}

.goal-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.goal-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.goal-icon .icon {
  font-size: 24rpx;
  color: white;
}

.goal-content {
  flex: 1;
}

.goal-title {
  font-size: 30rpx;
  color: var(--text-color, #333);
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.goal-target {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: #e0e0e0;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 20rpx;
  color: #4caf50;
  font-weight: bold;
  min-width: 60rpx;
  text-align: right;
}

.goal-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.goal-timeline {
  font-size: 20rpx;
  color: #999;
}

.goal-actions {
  padding: 0 40rpx 40rpx;
  display: flex;
  gap: 20rpx;
}

/* 智能建议部分 */
.suggestions-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.suggestions-list {
  padding: 0 40rpx;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid var(--border-color, #f0f0f0);
  transition: all 0.3s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:active {
  background: rgba(76, 175, 80, 0.05);
}

.suggestion-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.suggestion-priority {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: bold;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.suggestion-priority.medium {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.suggestion-priority.low {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 30rpx;
  color: var(--text-color, #333);
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.suggestion-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.suggestion-benefit {
  font-size: 20rpx;
  color: #4caf50;
  font-weight: 500;
}

.suggestion-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.suggestion-action {
  font-size: 24rpx;
  color: #4caf50;
  font-weight: 500;
}

/* 客户经理部分 */
.advisor-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--card-bg, #ffffff);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.advisor-card {
  padding: 0 40rpx 40rpx;
}

.advisor-info {
  display: flex;
  align-items: center;
  gap: 25rpx;
  margin-bottom: 30rpx;
}

.advisor-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 3rpx solid #4caf50;
  flex-shrink: 0;
}

.advisor-details {
  flex: 1;
}

.advisor-name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-color, #333);
  display: block;
  margin-bottom: 8rpx;
}

.advisor-title {
  font-size: 24rpx;
  color: #4caf50;
  display: block;
  margin-bottom: 8rpx;
}

.advisor-experience {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.advisor-rating {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.rating-stars {
  display: flex;
  gap: 4rpx;
}

.star {
  font-size: 20rpx;
  color: #ddd;
}

.star.active {
  color: #ffc107;
}

.rating-text {
  font-size: 20rpx;
  color: #666;
}

.advisor-actions {
  display: flex;
  gap: 20rpx;
}

/* AI对话界面样式 */
.ai-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  touch-action: none;
}

.chat-container {
  width: 100%;
  height: 80vh;
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #f8f9fa;
  border-radius: 24rpx 24rpx 0 0;
}

.chat-avatar {
  position: relative;
  margin-right: 16rpx;
}

.ai-avatar-small {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 2rpx solid #4caf50;
}

.ai-status-small {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 16rpx;
  height: 16rpx;
  background: #4caf50;
  border-radius: 50%;
  border: 2rpx solid white;
}

.chat-info {
  flex: 1;
}

.chat-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}

.chat-status {
  font-size: 20rpx;
  color: #4caf50;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  background: #f5f5f5;
  border: 1rpx solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #666;
}

.chat-messages {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  gap: 24rpx;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 60rpx;
  height: 60rpx;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2rpx solid #4caf50;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-bubble {
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  border-radius: 20rpx;
  padding: 20rpx;
  position: relative;
}

.message-item.user .message-bubble {
  background: #4caf50;
  border-color: #4caf50;
}

.message-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  display: block;
  margin-bottom: 8rpx;
}

.message-item.user .message-text {
  color: white;
}

.message-time {
  font-size: 18rpx;
  color: #999;
}

.message-item.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-input {
  padding: 24rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #f8f9fa;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.message-input {
  flex: 1;
  padding: 20rpx 24rpx;
  background: white;
  border: 1rpx solid #e0e0e0;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #333;
}

.message-input::placeholder {
  color: #999;
}

.send-btn {
  width: 60rpx;
  height: 60rpx;
  background: #4caf50;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:disabled {
  background: #e0e0e0;
  opacity: 0.5;
}

.send-icon {
  font-size: 20rpx;
  color: white;
}

.quick-questions {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 12rpx 20rpx;
  background: white;
  border: 1rpx solid #e0e0e0;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #666;
  transition: all 0.3s ease;
}

.quick-btn:active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}


.goal-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: var(--theme-border-color, #e0e0e0);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 20rpx;
  color: var(--theme-text-color, #333333);
  font-weight: bold;
}

.goal-timeline {
  font-size: 20rpx;
  color: var(--theme-text-secondary, #999999);
}

.goal-actions {
  display: flex;
  gap: 20rpx;
}

/* 智能建议 */
.smart-suggestions {
  margin: 0 40rpx;
  padding: 40rpx;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.suggestion-priority {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: rgba(239, 68, 68, 0.2);
  color: var(--theme-error, #EF4444);
}

.suggestion-priority.medium {
  background: rgba(245, 158, 11, 0.2);
  color: var(--theme-warning, #F59E0B);
}

.suggestion-priority.low {
  background: rgba(59, 130, 246, 0.2);
  color: var(--theme-info, #3B82F6);
}

.priority-text {
  font-size: 20rpx;
  font-weight: bold;
}

.suggestion-content {
  flex: 1;
  margin-right: 20rpx;
}

.suggestion-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 8rpx;
}

.suggestion-desc {
  font-size: 24rpx;
  color: var(--theme-text-secondary, #666666);
  line-height: 1.4;
  display: block;
  margin-bottom: 12rpx;
}

.suggestion-benefit {
  display: inline-block;
  padding: 6rpx 12rpx;
  background: rgba(16, 185, 129, 0.2);
  color: var(--theme-success, #10B981);
  border-radius: 6rpx;
  font-size: 20rpx;
}

.suggestion-action {
  flex-shrink: 0;
}

.suggestion-btn {
  padding: 16rpx 24rpx;
  background: var(--theme-primary, #6366F1);
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
}

/* 客户经理对接 */
.advisor-connection {
  margin: 0 40rpx 40rpx;
  padding: 40rpx;
}

.advisor-profile {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  margin-bottom: 40rpx;
}

.advisor-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid var(--theme-primary, #6366F1);
  margin-right: 24rpx;
}

.advisor-info {
  flex: 1;
}

.advisor-name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 8rpx;
}

.advisor-title {
  font-size: 24rpx;
  color: var(--theme-text-secondary, #666666);
  display: block;
  margin-bottom: 8rpx;
}

.advisor-experience {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #999999);
  display: block;
  margin-bottom: 12rpx;
}

.advisor-rating {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.rating-text {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
}

.rating-stars {
  display: flex;
  gap: 4rpx;
}

.star {
  font-size: 20rpx;
  color: var(--theme-text-secondary, #999999);
}

.star.active {
  color: var(--theme-warning, #F59E0B);
}

.advisor-actions {
  display: flex;
  gap: 20rpx;
}

/* AI对话界面 */
.ai-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  padding: 0;
}

.chat-container {
  width: 100%;
  height: 80vh;
  background: var(--theme-card-background, #ffffff);
  border-radius: 24rpx 24rpx 0 0;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid var(--theme-border-color, #e0e0e0);
  background: var(--theme-card-background, #ffffff);
  border-radius: 24rpx 24rpx 0 0;
}

.chat-avatar {
  position: relative;
  margin-right: 16rpx;
}

.ai-avatar-small {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 2rpx solid var(--theme-primary, #6366F1);
}

.ai-status-small {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 16rpx;
  height: 16rpx;
  background: var(--theme-success, #10B981);
  border-radius: 50%;
  border: 2rpx solid var(--theme-card-background, #ffffff);
}

.chat-info {
  flex: 1;
}

.chat-name {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
  display: block;
  margin-bottom: 4rpx;
}

.chat-status {
  font-size: 20rpx;
  color: var(--theme-success, #10B981);
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: var(--theme-text-secondary, #666666);
}

.chat-messages {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  gap: 24rpx;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 60rpx;
  height: 60rpx;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2rpx solid var(--theme-primary, #6366F1);
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-bubble {
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 20rpx;
  padding: 20rpx;
  position: relative;
}

.message-item.user .message-bubble {
  background: var(--theme-primary, #6366F1);
  border-color: var(--theme-primary, #6366F1);
}


.message-text {
  font-size: 26rpx;
  color: var(--theme-text-color, #333333);
  line-height: 1.4;
  display: block;
  margin-bottom: 8rpx;
}

.message-item.user .message-text {
  color: white;
}

.message-time {
  font-size: 18rpx;
  color: var(--theme-text-secondary, #999999);
}

.message-item.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-input {
  padding: 24rpx;
  border-top: 1rpx solid var(--theme-border-color, #e0e0e0);
  background: var(--theme-card-background, #ffffff);
}

.input-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.message-input {
  flex: 1;
  padding: 20rpx 24rpx;
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 24rpx;
  font-size: 26rpx;
  color: var(--theme-text-color, #333333);
}

.message-input::placeholder {
  color: var(--theme-text-secondary, #999999);
}

.send-btn {
  width: 60rpx;
  height: 60rpx;
  background: var(--theme-primary, #6366F1);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:disabled {
  background: var(--theme-border-color, #e0e0e0);
  opacity: 0.5;
}

.send-icon {
  font-size: 20rpx;
}

.quick-questions {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 12rpx 20rpx;
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
  transition: all 0.3s ease;
}

.quick-btn:active {
  background: var(--theme-primary, #6366F1);
  color: white;
  border-color: var(--theme-primary, #6366F1);
}

/* 暗黑主题专用样式 */
.theme-dark .header-section,
.dark .header-section {
  background: var(--theme-card-background, #ffffff);
  border-bottom: 1rpx solid var(--theme-border-color, #e0e0e0);
}

.theme-dark .wealth-overview,
.dark .wealth-overview,
.theme-dark .ai-analysis,
.dark .ai-analysis,
.theme-dark .asset-allocation,
.dark .asset-allocation,
.theme-dark .goal-management,
.dark .goal-management,
.theme-dark .smart-suggestions,
.dark .smart-suggestions,
.theme-dark .advisor-connection,
.dark .advisor-connection {
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  box-shadow: var(--theme-shadow-md, 0 4rpx 12rpx rgba(0, 0, 0, 0.9));
}

.theme-dark .breakdown-item,
.dark .breakdown-item,
.theme-dark .analysis-item,
.dark .analysis-item,
.theme-dark .goal-item,
.dark .goal-item,
.theme-dark .suggestion-item,
.dark .suggestion-item,
.theme-dark .advisor-profile,
.dark .advisor-profile {
  background: var(--theme-card-background, #ffffff);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

/* AI智能分析样式 */
.ai-analysis-section {
  position: relative;
  z-index: 2;
  margin: 30rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
}

/* AI头部 */
.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.ai-title-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.ai-icon {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.ai-title-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.ai-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--theme-text-color, #333333);
}

.ai-subtitle {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: var(--theme-background, #f5f5f5);
  border-radius: 20rpx;
  transition: all 0.3s ease;
}

.ai-status.active {
  background: rgba(76, 175, 80, 0.1);
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: var(--theme-text-secondary, #999999);
  transition: all 0.3s ease;
}

.ai-status.active .status-dot {
  background: #4caf50;
  box-shadow: 0 0 8rpx rgba(76, 175, 80, 0.5);
}

.status-text {
  font-size: 20rpx;
  color: var(--theme-text-secondary, #666666);
  font-weight: 500;
}

.ai-status.active .status-text {
  color: #4caf50;
}

/* AI功能卡片 */
.ai-features {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.permission-section {
  margin-top: 20rpx;
}

.permission-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
}

.permission-icon {
  font-size: 24rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.permission-content {
  flex: 1;
}

.permission-title {
  color: #ffffff;
  font-size: 16rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 4rpx;
}

.permission-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12rpx;
  line-height: 1.4;
  display: block;
}

.permission-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  min-width: 80rpx;
}

.permission-btn:disabled {
  opacity: 0.5;
}

.permission-btn .btn-text {
  color: #ffffff;
  font-size: 14rpx;
  font-weight: 500;
}

.permission-actions {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
}

.permission-action-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 12rpx;
  padding: 12rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 4rpx 15rpx rgba(240, 147, 251, 0.3);
}

.permission-action-btn .btn-icon {
  font-size: 16rpx;
}

.permission-action-btn .btn-text {
  color: #ffffff;
  font-size: 14rpx;
  font-weight: 500;
}

/* 用户选择器 */
.user-selector {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 16rpx;
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  color: #ffffff;
  font-size: 14rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 4rpx;
}

.user-balance {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12rpx;
  display: block;
}

.user-arrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12rpx;
}

.feature-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: var(--theme-card-background, #ffffff);
  border-radius: 16rpx;
  border: 1rpx solid var(--theme-border-color, #e0e0e0);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:active {
  transform: scale(0.98);
  background: var(--theme-background, #f5f5f5);
}

.feature-card.primary {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(46, 125, 50, 0.05));
  border: 1rpx solid rgba(76, 175, 80, 0.2);
}

.feature-card.primary:active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(46, 125, 50, 0.1));
}

.feature-card.disabled {
  opacity: 0.6;
  transform: none !important;
  cursor: not-allowed;
}

.feature-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  background: var(--theme-background, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.feature-card.primary .feature-icon {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.feature-icon .icon {
  font-size: 24rpx;
}

.feature-card.primary .feature-icon .icon {
  filter: brightness(0) invert(1);
}

.feature-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.feature-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text-color, #333333);
}

.feature-desc {
  font-size: 22rpx;
  color: var(--theme-text-secondary, #666666);
}

.feature-arrow {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: var(--theme-background, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-card.primary .feature-arrow {
  background: rgba(76, 175, 80, 0.1);
}

.arrow {
  font-size: 20rpx;
  color: var(--theme-text-secondary, #999999);
  font-weight: bold;
}

.feature-card.primary .arrow {
  color: #4caf50;
}
</style>

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
            <text class="user-balance">余额: ¥{{ formatNumber(currentUserInfo.balance) }}</text>
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
        // 从数据连接器获取用户数据
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        // 确保数据连接器已初始化
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        // 获取所有用户数据
        const users = connector.getUsers() || []
        
        this.availableUsers = users.map(user => ({
          id: user.id,
          username: user.username,
          realName: user.realName || user.username,
          phone: user.phone,
          balance: user.balance || 0,
          avatar: user.avatar || '/static/wealth/useravatar.jpg'
        }))
        
        // 设置默认用户（优先选择已登录用户）
        if (this.availableUsers.length > 0) {
          const loggedInUser = this.availableUsers.find(user => user.id === 'u001') // 假设u001是当前登录用户
          this.selectedUserId = loggedInUser ? loggedInUser.id : this.availableUsers[0].id
          this.currentUserInfo = loggedInUser || this.availableUsers[0]
        }
        
        console.log('✅ 可用用户列表加载成功:', this.availableUsers)
      } catch (error) {
        console.error('❌ 加载用户列表失败:', error)
        // 使用默认用户数据
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
        `${user.realName} (${user.username}) - 余额: ¥${this.formatNumber(user.balance)}`
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
        
        // 从数据连接器获取完整数据
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        // 确保数据连接器已初始化
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        // 获取用户数据
        const users = await connector.getUsers()
        const currentUser = users.find(user => user.isLoggedIn) || users[0]
        
        // 获取AI建议和目标数据
        const aiSuggestions = await connector.getAISuggestions()
        const userGoals = await connector.getUserGoals()
        
        if (currentUser) {
          // 构建项目数据结构
          this.projectData = {
            userInfo: {
              id: currentUser.id,
              username: currentUser.username,
              realName: currentUser.realName,
              balance: currentUser.balance || 0
            },
            wealthData: {
              deposits: currentUser.wealthProducts?.deposits || {},
              investments: currentUser.wealthProducts?.investments || [],
              portfolio: currentUser.investmentPortfolio || {}
            },
            transactionData: currentUser.transactionRecords || [],
            creditCardData: currentUser.creditCards || [],
            aiSuggestions: aiSuggestions,
            userGoals: userGoals
          }
          
          // 更新智能建议数据
          this.updateSmartSuggestions(aiSuggestions)
          
          // 更新目标数据
          this.updateUserGoals(userGoals)
          
          // 更新用户财富数据 - 使用用户余额确保数据一致性
          const deposits = currentUser.wealthProducts?.deposits || {}
          const investments = currentUser.wealthProducts?.investments || []
          const portfolio = currentUser.investmentPortfolio || {}
          
          // 使用用户余额作为总资产，确保与余额显示一致
          const totalAssets = currentUser.balance || ((deposits.current || 0) + (deposits.fixed || 0) + (deposits.smart || 0) + 
                             investments.reduce((sum, inv) => sum + (inv.amount || 0), 0) + 
                             (portfolio.totalValue || 0))
          
          this.userWealth.totalAssets = totalAssets
          this.userWealth.changePercent = portfolio.returnRate || 3.2
          this.userWealth.changeType = this.userWealth.changePercent >= 0 ? 'positive' : 'negative'
          
          console.log('💰 项目数据财富计算:', {
            userBalance: currentUser.balance,
            calculatedTotal: totalAssets,
            finalTotal: this.userWealth.totalAssets
          })
          
          console.log('✅ 项目数据加载完成:', this.projectData)
        } else {
          console.warn('⚠️ 未找到用户数据，使用默认数据')
          this.setDefaultProjectData()
        }
      } catch (error) {
        console.error('❌ 加载项目数据失败:', error)
        this.setDefaultProjectData()
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 设置默认项目数据
     */
    setDefaultProjectData() {
      this.projectData = {
        userInfo: {
          id: 'u001',
          username: '李华',
          realName: '李华',
          balance: 280000
        },
        wealthData: {
          deposits: { current: 30000, fixed: 50000, smart: 20000 },
          investments: [],
          portfolio: { totalValue: 100000, returnRate: 3.2 }
        },
        transactionData: [],
        creditCardData: []
      }
      
      this.userWealth.totalAssets = 200000
      this.userWealth.changePercent = 3.2
      this.userWealth.changeType = 'positive'
    },
    
    /**
     * 加载用户财富数据
     */
    async loadUserWealthData() {
      try {
        // 从数据连接器获取用户数据
        const dataConnector = await import('../../../db/data-connector.js')
        const connector = dataConnector.default
        
        // 确保数据连接器已初始化
        if (!connector.isInitialized) {
          await connector.init()
        }
        
        // 获取所有用户数据
        const users = connector.getUsers() || []
        const currentUser = users.find(user => user.isLoggedIn) || users[0]
        
        if (currentUser) {
          // 从后端数据格式中提取财富信息
          const deposits = currentUser.wealthProducts?.deposits || {}
          const investments = currentUser.wealthProducts?.investments || []
          const investmentPortfolio = currentUser.investmentPortfolio || {}
          
          // 计算各项资产
          const currentDeposit = deposits.current || 0
          const fixedDeposit = deposits.fixed || 0
          const smartDeposit = deposits.smart || 0
          const investmentAmount = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
          const portfolioValue = investmentPortfolio.totalValue || 0
          
          // 计算总资产 - 使用用户余额作为总资产，确保数据一致性
          const totalAssets = currentUser.balance || (currentDeposit + fixedDeposit + smartDeposit + investmentAmount + portfolioValue)
          
          console.log('💰 资产计算详情:', {
            userBalance: currentUser.balance,
            currentDeposit,
            fixedDeposit,
            smartDeposit,
            investmentAmount,
            portfolioValue,
            calculatedTotal: currentDeposit + fixedDeposit + smartDeposit + investmentAmount + portfolioValue,
            finalTotal: totalAssets
          })
          
          // 更新财富分解数据 - 基于用户余额重新计算百分比
          this.wealthBreakdown = [
            { 
              icon: '💰', 
              label: '活期存款', 
              amount: currentDeposit, 
              percent: totalAssets > 0 ? Math.round(currentDeposit / totalAssets * 100) : 0, 
              color: '#4CAF50' 
            },
            { 
              icon: '🏦', 
              label: '定期存款', 
              amount: fixedDeposit, 
              percent: totalAssets > 0 ? Math.round(fixedDeposit / totalAssets * 100) : 0, 
              color: '#2196F3' 
            },
            { 
              icon: '📈', 
              label: '投资理财', 
              amount: investmentAmount + portfolioValue, 
              percent: totalAssets > 0 ? Math.round((investmentAmount + portfolioValue) / totalAssets * 100) : 0, 
              color: '#FF9800' 
            },
            { 
              icon: '💳', 
              label: '其他资产', 
              amount: totalAssets - (currentDeposit + fixedDeposit + investmentAmount + portfolioValue), 
              percent: totalAssets > 0 ? Math.round((totalAssets - (currentDeposit + fixedDeposit + investmentAmount + portfolioValue)) / totalAssets * 100) : 0, 
              color: '#9C27B0' 
            }
          ]
          
          // 更新用户财富数据
          this.userWealth.totalAssets = totalAssets
          this.userWealth.changePercent = investmentPortfolio.returnRate || 3.2
          this.userWealth.changeType = this.userWealth.changePercent >= 0 ? 'positive' : 'negative'
          
          // 更新当前用户信息
          if (this.currentUserInfo) {
            this.currentUserInfo.balance = currentUser.balance || 0
          }
          
          console.log('✅ 用户财富数据加载成功:', {
            totalAssets,
            wealthBreakdown: this.wealthBreakdown,
            userWealth: this.userWealth
          })
        } else {
          console.warn('⚠️ 未找到当前用户数据，使用默认数据')
          this.setDefaultWealthData()
        }
      } catch (error) {
        console.error('❌ 加载用户财富数据失败:', error)
        this.setDefaultWealthData()
      }
    },
    
    /**
     * 设置默认财富数据
     */
    setDefaultWealthData() {
      this.userWealth = {
        totalAssets: 125689.23,
        changeType: 'positive',
        changePercent: 3.2
      }
      this.wealthBreakdown = [
        { icon: '💰', label: '活期存款', amount: 32541.78, percent: 26, color: '#4CAF50' },
        { icon: '🏦', label: '定期存款', amount: 80000.00, percent: 64, color: '#2196F3' },
        { icon: '📈', label: '投资理财', amount: 13147.45, percent: 10, color: '#FF9800' }
      ]
    },

    /**
     * 更新智能建议数据
     */
    updateSmartSuggestions(aiSuggestions) {
      try {
        const suggestions = []
        
        // 处理高优先级建议
        if (aiSuggestions.highPriority) {
          aiSuggestions.highPriority.forEach(suggestion => {
            suggestions.push({
              priority: 'high',
              priorityText: '高优先级',
              title: suggestion.title,
              description: suggestion.description,
              benefit: suggestion.benefit,
              action: suggestion.action,
              category: suggestion.category
            })
          })
        }
        
        // 处理中优先级建议
        if (aiSuggestions.mediumPriority) {
          aiSuggestions.mediumPriority.forEach(suggestion => {
            suggestions.push({
              priority: 'medium',
              priorityText: '中优先级',
              title: suggestion.title,
              description: suggestion.description,
              benefit: suggestion.benefit,
              action: suggestion.action,
              category: suggestion.category
            })
          })
        }
        
        // 处理低优先级建议
        if (aiSuggestions.lowPriority) {
          aiSuggestions.lowPriority.forEach(suggestion => {
            suggestions.push({
              priority: 'low',
              priorityText: '低优先级',
              title: suggestion.title,
              description: suggestion.description,
              benefit: suggestion.benefit,
              action: suggestion.action,
              category: suggestion.category
            })
          })
        }
        
        this.smartSuggestions = suggestions
        console.log('✅ 智能建议数据更新完成:', suggestions.length, '条建议')
        
      } catch (error) {
        console.error('❌ 更新智能建议失败:', error)
      }
    },
    
    /**
     * 更新用户目标数据
     */
    updateUserGoals(userGoals) {
      try {
        this.userGoals = userGoals.map(goal => ({
          id: goal.id,
          title: goal.title,
          target: goal.target,
          current: goal.current,
          progress: goal.progress,
          timeline: goal.timeline,
          icon: goal.icon,
          color: goal.color,
          status: goal.status
        }))
        
        console.log('✅ 用户目标数据更新完成:', this.userGoals.length, '个目标')
        
      } catch (error) {
        console.error('❌ 更新用户目标失败:', error)
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
      if (num === null || num === undefined || isNaN(num)) {
        return '0.00'
      }
      return parseFloat(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

/* 全新AI财富管理样式 - 现代化设计 */
.ai-wealth-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部背景增强 */
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0.9;
  z-index: 1;
}

.header-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

/* 顶部导航栏优化 */
.header-section {
  position: relative;
  z-index: 10;
  padding: 60rpx 40rpx 40rpx;
  background: transparent;
  backdrop-filter: blur(20rpx);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  padding: 24rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.back-btn {
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  backdrop-filter: blur(10rpx);
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.back-icon {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.ai-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.ai-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.ai-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.3);
}

.ai-status-dot {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 16rpx;
  height: 16rpx;
  background: #00ff88;
  border-radius: 50%;
  border: 2rpx solid white;
  animation: pulse 2s infinite;
  box-shadow: 0 0 8rpx rgba(0, 255, 136, 0.5);
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.header-title {
  font-size: 32rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5rpx;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  letter-spacing: 0.3rpx;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.chat-btn {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.3);
  backdrop-filter: blur(10rpx);
}

.chat-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.4);
}

.chat-icon {
  font-size: 22rpx;
  color: white;
  filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.2));
}

/* 财富概览卡片优化 */
.wealth-overview-card {
  position: relative;
  z-index: 5;
  margin: 32rpx 24rpx 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 40rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wealth-overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.wealth-overview-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
}

.wealth-header {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.wealth-info {
  flex: 1;
  text-align: center;
}

.wealth-label {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
  letter-spacing: 0.5rpx;
}

.wealth-amount {
  font-size: 52rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-bottom: 12rpx;
  letter-spacing: -1rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.wealth-change {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
}

.wealth-change.positive {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1rpx solid rgba(34, 197, 94, 0.2);
}

.wealth-change.negative {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1rpx solid rgba(239, 68, 68, 0.2);
}

.change-icon {
  font-size: 18rpx;
  font-weight: bold;
}

.wealth-chart {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  flex-shrink: 0;
}

.chart-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0deg 93.6deg,
    #764ba2 93.6deg 230.4deg,
    #f093fb 230.4deg 360deg
  );
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.chart-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.chart-total {
  font-size: 16rpx;
  color: #666;
  margin-bottom: 2rpx;
  font-weight: 500;
}

.chart-amount {
  font-size: 18rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.5rpx;
}

.wealth-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.breakdown-item:active {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.item-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.item-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2);
}

.item-icon .icon {
  font-size: 22rpx;
  color: white;
  filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.2));
}

.item-content {
  flex: 1;
}

.item-label {
  font-size: 26rpx;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
  font-weight: 600;
  letter-spacing: 0.3rpx;
}

.item-amount {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
}

.item-percent {
  font-size: 26rpx;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* AI分析部分优化 */
.ai-analysis-section {
  position: relative;
  z-index: 5;
  margin: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-analysis-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe);
}

.ai-analysis-section:active {
  transform: translateY(-2rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.ai-title-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.ai-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(240, 147, 251, 0.3);
  transition: all 0.3s ease;
}

.ai-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6rpx 20rpx rgba(240, 147, 251, 0.4);
}

.ai-title-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.ai-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5rpx;
  line-height: 1.2;
}

.ai-subtitle {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.3rpx;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 20rpx;
  border: 1rpx solid rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;
}

.ai-status.active {
  background: rgba(34, 197, 94, 0.15);
  box-shadow: 0 2rpx 8rpx rgba(34, 197, 94, 0.2);
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8rpx rgba(34, 197, 94, 0.5);
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 20rpx;
  color: #22c55e;
  font-weight: 600;
}

/* 用户选择器优化 */
.user-selector {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20rpx;
  padding: 16rpx;
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  border: 1rpx solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10rpx);
}

.user-selector:active {
  background: rgba(102, 126, 234, 0.15);
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.2);
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  color: #333;
  font-size: 24rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 2rpx;
  letter-spacing: 0.3rpx;
}

.user-balance {
  color: #666;
  font-size: 20rpx;
  display: block;
  font-weight: 500;
}

.user-arrow {
  color: #999;
  font-size: 20rpx;
  transition: all 0.3s ease;
}

.user-selector:active .user-arrow {
  transform: rotate(180deg);
}

/* AI功能卡片优化 */
.ai-features {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.feature-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.feature-card.primary {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1rpx solid rgba(102, 126, 234, 0.2);
}

.feature-card.disabled {
  opacity: 0.6;
  transform: none !important;
}

.feature-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card.primary .feature-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.feature-icon .icon {
  font-size: 22rpx;
  color: #666;
}

.feature-card.primary .feature-icon .icon {
  color: white;
  filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.2));
}

.feature-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.feature-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.3rpx;
}

.feature-desc {
  font-size: 20rpx;
  color: #666;
  font-weight: 500;
}

.feature-arrow {
  width: 32rpx;
  height: 32rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature-card.primary .feature-arrow {
  background: rgba(102, 126, 234, 0.1);
}

.arrow {
  font-size: 18rpx;
  color: #999;
  font-weight: bold;
}

.feature-card.primary .arrow {
  color: #667eea;
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

/* 智能建议部分优化 */
.suggestions-section {
  position: relative;
  z-index: 5;
  margin: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestions-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #a8edea, #fed6e3, #d299c2);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.suggestion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4rpx;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.suggestion-item:active {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.suggestion-item:active::before {
  opacity: 1;
}

.suggestion-left {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 16rpx;
}

.suggestion-priority {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 18rpx;
  font-weight: 600;
  flex-shrink: 0;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.suggestion-priority.high {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.2);
}

.suggestion-priority.medium {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.2);
  box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.2);
}

.suggestion-priority.low {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.2);
  box-shadow: 0 2rpx 8rpx rgba(34, 197, 94, 0.2);
}

.priority-text {
  font-size: 18rpx;
  font-weight: 600;
  letter-spacing: 0.3rpx;
}

.suggestion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.suggestion-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  display: block;
  letter-spacing: 0.3rpx;
  line-height: 1.3;
}

.suggestion-desc {
  font-size: 22rpx;
  color: #666;
  line-height: 1.5;
  display: block;
  font-weight: 500;
}

.suggestion-benefit {
  font-size: 20rpx;
  color: #22c55e;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.1);
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  border: 1rpx solid rgba(34, 197, 94, 0.2);
  display: inline-block;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 2rpx 8rpx rgba(34, 197, 94, 0.1);
}

.suggestion-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.suggestion-action {
  font-size: 22rpx;
  color: #667eea;
  font-weight: 600;
  padding: 8rpx 16rpx;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12rpx;
  border: 1rpx solid rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.1);
}

.suggestion-item:active .suggestion-action {
  background: rgba(102, 126, 234, 0.15);
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.2);
}

/* 客户经理部分优化 */
.advisor-section {
  position: relative;
  z-index: 5;
  margin: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 32rpx;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.advisor-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #ffecd2, #fcb69f, #ff8a80);
}

.advisor-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.advisor-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.advisor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  border: 3rpx solid #667eea;
  flex-shrink: 0;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.advisor-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

.advisor-details {
  flex: 1;
}

.advisor-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
  letter-spacing: 0.3rpx;
}

.advisor-title {
  font-size: 22rpx;
  color: #667eea;
  display: block;
  margin-bottom: 4rpx;
  font-weight: 600;
}

.advisor-experience {
  font-size: 20rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.advisor-rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.rating-stars {
  display: flex;
  gap: 2rpx;
}

.star {
  font-size: 18rpx;
  color: #ddd;
  transition: all 0.3s ease;
}

.star.active {
  color: #fbbf24;
  text-shadow: 0 1rpx 2rpx rgba(251, 191, 36, 0.3);
}

.rating-text {
  font-size: 18rpx;
  color: #666;
  font-weight: 500;
}

.advisor-actions {
  display: flex;
  gap: 16rpx;
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

<template>
  <view class="allocation-detail-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">资产配置详情</text>
      </view>
    </view>

    <!-- 资产概览 -->
    <view class="overview-section">
      <view class="total-assets">
        <text class="total-label">总资产</text>
        <text class="total-amount">¥{{ formatNumber(totalAssets) }}</text>
        <view class="change-info" :class="changeType">
          <text class="change-arrow">{{ changeType === 'positive' ? '↗' : '↘' }}</text>
          <text class="change-amount">{{ changePercent }}%</text>
        </view>
      </view>
    </view>

    <!-- 资产配置图表 -->
    <view class="chart-section">
      <view class="section-title">资产配置分布</view>
      <view class="chart-container">
        <view class="pie-chart" ref="pieChart">
          <view class="chart-center">
            <text class="center-label">总资产</text>
            <text class="center-amount">¥{{ formatNumber(totalAssets) }}</text>
          </view>
        </view>
        <view class="chart-legend">
          <view class="legend-item" v-for="(item, index) in allocationData" :key="index">
            <view class="legend-color" :style="{ backgroundColor: item.color }"></view>
            <view class="legend-info">
              <text class="legend-name">{{ item.name }}</text>
              <text class="legend-details">{{ item.percent }}% · ¥{{ formatNumber(item.amount) }}</text>
            </view>
            <view class="legend-actions">
              <button class="action-btn-small" @tap="adjustAllocation(item)">调整</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 智能建议 -->
    <view class="suggestions-section">
      <view class="section-title">AI优化建议</view>
      <view class="suggestions-list">
        <view class="suggestion-item" v-for="(suggestion, index) in aiSuggestions" :key="index">
          <view class="suggestion-header">
            <view class="suggestion-icon" :style="{ backgroundColor: suggestion.color }">
              <text class="icon">{{ suggestion.icon }}</text>
            </view>
            <view class="suggestion-info">
              <text class="suggestion-title">{{ suggestion.title }}</text>
              <text class="suggestion-priority" :class="suggestion.priority">{{ suggestion.priorityText }}</text>
            </view>
            <button class="apply-btn" @tap="applySuggestion(suggestion)">应用</button>
          </view>
          <text class="suggestion-desc">{{ suggestion.description }}</text>
          <view class="suggestion-benefits">
            <text class="benefit-label">预期收益：</text>
            <text class="benefit-value">{{ suggestion.expectedReturn }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 风险评估 -->
    <view class="risk-section">
      <view class="section-title">风险评估</view>
      <view class="risk-content">
        <view class="risk-level">
          <text class="risk-label">当前风险等级</text>
          <view class="risk-indicator" :class="riskLevel">
            <text class="risk-text">{{ riskLevelText }}</text>
            <text class="risk-score">{{ riskScore }}/10</text>
          </view>
        </view>
        <view class="risk-factors">
          <text class="factors-title">风险因素分析</text>
          <view class="factor-item" v-for="(factor, index) in riskFactors" :key="index">
            <text class="factor-name">{{ factor.name }}</text>
            <view class="factor-bar">
              <view class="factor-fill" :style="{ width: factor.level + '%', backgroundColor: factor.color }"></view>
            </view>
            <text class="factor-level">{{ factor.level }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 历史表现 -->
    <view class="performance-section">
      <view class="section-title">历史表现</view>
      <view class="performance-chart">
        <view class="chart-header">
          <text class="chart-title">收益率走势</text>
          <view class="time-selector">
            <button class="time-btn" :class="{ active: selectedPeriod === '1M' }" @tap="selectPeriod('1M')">1月</button>
            <button class="time-btn" :class="{ active: selectedPeriod === '3M' }" @tap="selectPeriod('3M')">3月</button>
            <button class="time-btn" :class="{ active: selectedPeriod === '1Y' }" @tap="selectPeriod('1Y')">1年</button>
          </view>
        </view>
        <view class="performance-metrics">
          <view class="metric-item">
            <text class="metric-label">年化收益率</text>
            <text class="metric-value positive">{{ annualReturn }}%</text>
          </view>
          <view class="metric-item">
            <text class="metric-label">最大回撤</text>
            <text class="metric-value negative">{{ maxDrawdown }}%</text>
          </view>
          <view class="metric-item">
            <text class="metric-label">夏普比率</text>
            <text class="metric-value">{{ sharpeRatio }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="action-btn primary" @tap="autoRebalance">一键调仓</button>
      <button class="action-btn secondary" @tap="customRebalance">自定义调仓</button>
      <button class="action-btn tertiary" @tap="exportReport">导出报告</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      totalAssets: 280000,
      changePercent: 3.2,
      changeType: 'positive',
      selectedPeriod: '1M',
      riskLevel: 'medium',
      riskScore: 6,
      allocationData: [
        { 
          name: '现金类', 
          percent: 30, 
          amount: 84000,
          color: '#4CAF50',
          description: '货币基金、银行存款等低风险产品'
        },
        { 
          name: '债券类', 
          percent: 40, 
          amount: 112000,
          color: '#2196F3',
          description: '国债、企业债、债券基金等'
        },
        { 
          name: '股票类', 
          percent: 20, 
          amount: 56000,
          color: '#FF9800',
          description: '股票、股票型基金等'
        },
        { 
          name: '另类投资', 
          percent: 10, 
          amount: 28000,
          color: '#9C27B0',
          description: '黄金、REITs、私募等'
        }
      ],
      aiSuggestions: [
        {
          icon: '📈',
          title: '增加股票配置',
          priority: 'high',
          priorityText: '高优先级',
          description: '基于当前市场环境，建议将股票配置从20%提升至25%，以获取更好的长期收益',
          expectedReturn: '+2.3%',
          color: '#FF9800'
        },
        {
          icon: '🛡️',
          title: '优化债券结构',
          priority: 'medium',
          priorityText: '中优先级',
          description: '建议增加短期债券配置，降低利率风险，提高流动性',
          expectedReturn: '+0.8%',
          color: '#2196F3'
        },
        {
          icon: '💰',
          title: '现金管理优化',
          priority: 'low',
          priorityText: '低优先级',
          description: '将部分现金转入货币基金，提高资金使用效率',
          expectedReturn: '+0.5%',
          color: '#4CAF50'
        }
      ],
      riskFactors: [
        { name: '市场风险', level: 70, color: '#FF5722' },
        { name: '利率风险', level: 45, color: '#FF9800' },
        { name: '信用风险', level: 30, color: '#4CAF50' },
        { name: '流动性风险', level: 20, color: '#2196F3' }
      ],
      annualReturn: 8.5,
      maxDrawdown: -5.2,
      sharpeRatio: 1.2
    }
  },
  
  computed: {
    riskLevelText() {
      const levels = {
        low: '低风险',
        medium: '中等风险',
        high: '高风险'
      }
      return levels[this.riskLevel] || '中等风险'
    }
  },
  
  onLoad() {
    this.loadAllocationData()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    formatNumber(num) {
      return Number(num).toLocaleString('zh-CN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    },
    
    loadAllocationData() {
      // 模拟加载资产配置数据
      console.log('加载资产配置数据')
    },
    
    adjustAllocation(item) {
      uni.showModal({
        title: `调整${item.name}配置`,
        content: `当前配置：${item.percent}%\n建议范围：${this.getAllocationRange(item.name)}`,
        editable: true,
        placeholderText: '请输入新的配置比例',
        success: (res) => {
          if (res.confirm && res.content) {
            const newPercent = parseFloat(res.content)
            if (newPercent >= 0 && newPercent <= 100) {
              this.updateAllocation(item.name, newPercent)
            } else {
              uni.showToast({
                title: '请输入0-100之间的数值',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    
    getAllocationRange(assetType) {
      const ranges = {
        '现金类': '10-30%',
        '债券类': '30-50%',
        '股票类': '15-35%',
        '另类投资': '5-15%'
      }
      return ranges[assetType] || '5-20%'
    },
    
    updateAllocation(assetType, newPercent) {
      const item = this.allocationData.find(item => item.name === assetType)
      if (item) {
        item.percent = newPercent
        item.amount = (this.totalAssets * newPercent / 100)
        uni.showToast({
          title: '配置已更新',
          icon: 'success'
        })
      }
    },
    
    applySuggestion(suggestion) {
      uni.showModal({
        title: '应用建议',
        content: `确定要应用"${suggestion.title}"建议吗？\n预期收益：${suggestion.expectedReturn}`,
        success: (res) => {
          if (res.confirm) {
            this.executeSuggestion(suggestion)
          }
        }
      })
    },
    
    executeSuggestion(suggestion) {
      // 模拟执行建议
      uni.showLoading({ title: '正在应用建议...' })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '建议已应用',
          icon: 'success'
        })
        
        // 更新相关数据
        if (suggestion.title.includes('股票')) {
          const stockItem = this.allocationData.find(item => item.name === '股票类')
          if (stockItem) {
            stockItem.percent = 25
            stockItem.amount = this.totalAssets * 0.25
          }
        }
      }, 2000)
    },
    
    selectPeriod(period) {
      this.selectedPeriod = period
      this.loadPerformanceData(period)
    },
    
    loadPerformanceData(period) {
      console.log(`加载${period}表现数据`)
      
      // 显示加载状态
      uni.showLoading({ title: '正在加载数据...' })
      
      // 模拟不同时期的数据
      const performanceData = {
        '1M': {
          annualReturn: 6.8,
          maxDrawdown: -2.1,
          sharpeRatio: 0.9
        },
        '3M': {
          annualReturn: 8.5,
          maxDrawdown: -5.2,
          sharpeRatio: 1.2
        },
        '1Y': {
          annualReturn: 12.3,
          maxDrawdown: -8.7,
          sharpeRatio: 1.5
        }
      }
      
      // 模拟网络请求延迟
      setTimeout(() => {
        const data = performanceData[period]
        if (data) {
          this.annualReturn = data.annualReturn
          this.maxDrawdown = data.maxDrawdown
          this.sharpeRatio = data.sharpeRatio
          
          console.log(`已更新${period}数据:`, data)
          
          // 显示更新提示
          uni.showToast({
            title: `已切换到${this.getPeriodText(period)}数据`,
            icon: 'success',
            duration: 1500
          })
        }
        
        uni.hideLoading()
      }, 800)
    },
    
    getPeriodText(period) {
      const periodMap = {
        '1M': '1个月',
        '3M': '3个月',
        '1Y': '1年'
      }
      return periodMap[period] || period
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
      uni.showLoading({ title: '正在调仓...' })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '调仓完成',
          icon: 'success'
        })
        
        // 模拟调仓结果
        this.allocationData = [
          { name: '现金类', percent: 25, amount: 70000, color: '#4CAF50' },
          { name: '债券类', percent: 35, amount: 98000, color: '#2196F3' },
          { name: '股票类', percent: 25, amount: 70000, color: '#FF9800' },
          { name: '另类投资', percent: 15, amount: 42000, color: '#9C27B0' }
        ]
      }, 3000)
    },
    
    customRebalance() {
      uni.navigateTo({
        url: '/pages/wealth/custom-rebalance'
      })
    },
    
    exportReport() {
      uni.showModal({
        title: '导出报告',
        content: '选择报告格式',
        showCancel: true,
        cancelText: '取消',
        confirmText: '生成PDF',
        success: (res) => {
          if (res.confirm) {
            this.generatePDFReport()
          } else if (res.cancel) {
            // 用户取消
          }
        }
      })
    },
    
    generatePDFReport() {
      uni.showLoading({ title: '正在生成PDF报告...' })
      
      // 生成报告数据
      const reportData = this.generateReportData()
      
      // 模拟PDF生成过程
      setTimeout(() => {
        uni.hideLoading()
        
        // 显示报告预览
        this.showReportPreview(reportData)
        
        // 模拟下载
        this.downloadReport(reportData)
      }, 3000)
    },
    
    generateReportData() {
      const currentDate = new Date().toLocaleDateString('zh-CN')
      const currentTime = new Date().toLocaleTimeString('zh-CN')
      
      return {
        title: '资产配置分析报告',
        generateTime: `${currentDate} ${currentTime}`,
        userInfo: {
          totalAssets: this.totalAssets,
          changePercent: this.changePercent,
          changeType: this.changeType
        },
        allocationData: this.allocationData,
        riskAssessment: {
          level: this.riskLevel,
          score: this.riskScore,
          factors: this.riskFactors
        },
        performanceMetrics: {
          annualReturn: this.annualReturn,
          maxDrawdown: this.maxDrawdown,
          sharpeRatio: this.sharpeRatio
        },
        aiSuggestions: this.aiSuggestions
      }
    },
    
    showReportPreview(reportData) {
      // 存储报告数据供预览页面使用
      uni.setStorageSync('currentReport', reportData)
      
      // 跳转到报告预览页面
      uni.navigateTo({
        url: '/pages/wealth/report-preview'
      })
    },
    
    downloadReport(reportData) {
      // 生成报告文本内容
      const reportContent = this.formatReportContent(reportData)
      
      // 创建文件内容
      const fileName = `资产配置报告_${new Date().toISOString().slice(0, 10)}.txt`
      
      // 显示下载位置信息
      this.showDownloadLocation(fileName, reportContent, reportData)
    },
    
    showDownloadLocation(fileName, content, reportData) {
      // 获取下载路径信息
      const downloadPath = this.getDownloadPath()
      
      uni.showModal({
        title: '报告生成完成',
        content: `报告已生成完成！\n\n文件名：${fileName}\n生成时间：${reportData.generateTime}\n\n保存位置：${downloadPath}\n\n您可以在以下位置查看：\n• 文件管理器\n• 下载文件夹\n• 文档文件夹`,
        showCancel: true,
        cancelText: '查看报告',
        confirmText: '打开文件夹',
        success: (res) => {
          if (res.confirm) {
            this.openFileManager(downloadPath)
          } else if (res.cancel) {
            // 显示报告内容
            this.showReportContent(content)
          }
        }
      })
    },
    
    getDownloadPath() {
      // 根据平台返回不同的下载路径
      // #ifdef H5
      return '浏览器下载文件夹'
      // #endif
      
      // #ifdef APP-PLUS
      return '/storage/emulated/0/Download/'
      // #endif
      
      // #ifdef MP-WEIXIN
      return '微信小程序文件系统'
      // #endif
      
      // #ifdef MP-ALIPAY
      return '支付宝小程序文件系统'
      // #endif
      
      // 默认路径
      return '设备下载文件夹'
    },
    
    openFileManager(path) {
      // #ifdef APP-PLUS
      // 在APP中打开文件管理器
      plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, (fs) => {
        plus.io.resolveLocalFileSystemURL(fs.root.fullPath, (entry) => {
          plus.runtime.openURL(entry.toLocalURL())
        })
      })
      // #endif
      
      // #ifdef H5
      // 在H5中提示用户
      uni.showToast({
        title: '请查看浏览器下载文件夹',
        icon: 'none',
        duration: 3000
      })
      // #endif
      
      // #ifdef MP
      // 在小程序中提示用户
      uni.showToast({
        title: '请查看小程序文件管理',
        icon: 'none',
        duration: 3000
      })
      // #endif
    },
    
    formatReportContent(reportData) {
      let content = ''
      
      // 报告标题
      content += '='.repeat(50) + '\n'
      content += `           ${reportData.title}\n`
      content += '='.repeat(50) + '\n\n'
      
      // 生成信息
      content += `生成时间：${reportData.generateTime}\n`
      content += `报告类型：资产配置分析报告\n\n`
      
      // 资产概览
      content += '一、资产概览\n'
      content += '-'.repeat(30) + '\n'
      content += `总资产：¥${this.formatNumber(reportData.userInfo.totalAssets)}\n`
      content += `收益率：${reportData.userInfo.changePercent}% (${reportData.userInfo.changeType === 'positive' ? '上涨' : '下跌'})\n\n`
      
      // 资产配置
      content += '二、资产配置详情\n'
      content += '-'.repeat(30) + '\n'
      reportData.allocationData.forEach((item, index) => {
        content += `${index + 1}. ${item.name}\n`
        content += `   配置比例：${item.percent}%\n`
        content += `   配置金额：¥${this.formatNumber(item.amount)}\n`
        content += `   产品描述：${item.description}\n\n`
      })
      
      // 风险评估
      content += '三、风险评估\n'
      content += '-'.repeat(30) + '\n'
      content += `风险等级：${this.riskLevelText}\n`
      content += `风险评分：${reportData.riskAssessment.score}/10\n\n`
      content += '风险因素分析：\n'
      reportData.riskAssessment.factors.forEach(factor => {
        content += `• ${factor.name}：${factor.level}%\n`
      })
      content += '\n'
      
      // 历史表现
      content += '四、历史表现\n'
      content += '-'.repeat(30) + '\n'
      content += `年化收益率：${reportData.performanceMetrics.annualReturn}%\n`
      content += `最大回撤：${reportData.performanceMetrics.maxDrawdown}%\n`
      content += `夏普比率：${reportData.performanceMetrics.sharpeRatio}\n\n`
      
      // AI建议
      content += '五、AI智能建议\n'
      content += '-'.repeat(30) + '\n'
      reportData.aiSuggestions.forEach((suggestion, index) => {
        content += `${index + 1}. ${suggestion.title}\n`
        content += `   优先级：${suggestion.priorityText}\n`
        content += `   建议内容：${suggestion.description}\n`
        content += `   预期收益：${suggestion.expectedReturn}\n\n`
      })
      
      // 报告结尾
      content += '='.repeat(50) + '\n'
      content += '报告说明：\n'
      content += '1. 本报告基于当前市场数据和用户资产配置生成\n'
      content += '2. 投资有风险，建议仅供参考\n'
      content += '3. 建议定期更新资产配置，优化投资组合\n'
      content += '4. 如有疑问，请联系您的理财顾问\n\n'
      content += `报告生成时间：${reportData.generateTime}\n`
      content += '='.repeat(50) + '\n'
      
      return content
    },
    
    showReportContent(content) {
      // 显示报告内容
      uni.showModal({
        title: '资产配置报告',
        content: content.length > 500 ? content.substring(0, 500) + '...\n\n(内容过长，已截取部分显示)' : content,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '复制内容',
        success: (res) => {
          if (res.confirm) {
            // 复制到剪贴板
            uni.setClipboardData({
              data: content,
              success: () => {
                uni.showToast({
                  title: '报告内容已复制到剪贴板',
                  icon: 'success'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.allocation-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 导航栏 - 现代化设计 */
.nav-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20rpx);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

.nav-title {
  font-size: 36rpx;
  color: white;
  font-weight: 600;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* 资产概览 - 卡片式设计 */
.overview-section {
  margin: 30rpx;
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.total-assets {
  text-align: center;
  position: relative;
}

.total-assets::before {
  content: '';
  position: absolute;
  top: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2rpx;
}

.total-label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.total-amount {
  font-size: 52rpx;
  color: #333;
  font-weight: 700;
  display: block;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.change-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  display: inline-flex;
}

.change-info.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.change-info.negative {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.change-arrow {
  font-size: 24rpx;
}

.change-amount {
  font-size: 28rpx;
  font-weight: 600;
}

/* 通用样式 */
.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 700;
  margin-bottom: 30rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3rpx;
}

/* 图表部分 - 现代化设计 */
.chart-section {
  margin: 30rpx;
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.chart-container {
  display: flex;
  gap: 40rpx;
  align-items: flex-start;
}

.pie-chart {
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 0deg 108deg,
    #2196F3 108deg 252deg,
    #FF9800 252deg 324deg,
    #9C27B0 324deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.chart-center {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.center-label {
  font-size: 20rpx;
  color: #666;
  font-weight: 500;
}

.center-amount {
  font-size: 24rpx;
  color: #333;
  font-weight: 700;
}

.chart-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.3s ease;
}

.legend-item:last-child {
  border-bottom: none;
}

.legend-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12rpx;
  padding: 24rpx 16rpx;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.legend-info {
  flex: 1;
}

.legend-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  display: block;
  margin-bottom: 6rpx;
}

.legend-details {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.action-btn-small {
  padding: 12rpx 20rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn-small:active {
  transform: scale(0.95);
}

/* 建议部分 - 卡片式设计 */
.suggestions-section {
  margin: 30rpx;
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.suggestion-item {
  padding: 32rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20rpx;
  border-left: 6rpx solid #667eea;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.suggestion-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.suggestion-icon .icon {
  font-size: 28rpx;
  color: white;
}

.suggestion-info {
  flex: 1;
}

.suggestion-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.suggestion-priority {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  display: inline-block;
  font-weight: 500;
}

.suggestion-priority.high {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.suggestion-priority.medium {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.suggestion-priority.low {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.apply-btn {
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.apply-btn:active {
  transform: scale(0.95);
}

.suggestion-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.suggestion-benefits {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 12rpx;
}

.benefit-label {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.benefit-value {
  font-size: 24rpx;
  color: #4CAF50;
  font-weight: 600;
}

/* 风险评估 - 现代化设计 */
.risk-section {
  margin: 30rpx;
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.risk-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.risk-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.risk-indicator {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 28rpx;
  border-radius: 24rpx;
  font-weight: 500;
}

.risk-indicator.low {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.risk-indicator.medium {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.risk-indicator.high {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.risk-text {
  font-size: 26rpx;
  font-weight: 600;
}

.risk-score {
  font-size: 24rpx;
  font-weight: 700;
}

.risk-factors {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.factors-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.factor-item:hover {
  background: #e9ecef;
}

.factor-name {
  width: 120rpx;
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.factor-bar {
  flex: 1;
  height: 12rpx;
  background: #e0e0e0;
  border-radius: 6rpx;
  overflow: hidden;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.factor-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 6rpx;
}

.factor-level {
  width: 60rpx;
  text-align: right;
  font-size: 24rpx;
  color: #666;
  font-weight: 600;
}

/* 历史表现 - 现代化设计 */
.performance-section {
  margin: 30rpx;
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.performance-chart {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.time-selector {
  display: flex;
  gap: 8rpx;
  background: #f8f9fa;
  padding: 4rpx;
  border-radius: 12rpx;
}

.time-btn {
  padding: 12rpx 20rpx;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.time-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.performance-metrics {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.metric-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.metric-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.metric-value {
  font-size: 28rpx;
  font-weight: 700;
}

.metric-value.positive {
  color: #4CAF50;
}

.metric-value.negative {
  color: #F44336;
}

/* 操作按钮 - 现代化设计 */
.action-section {
  margin: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  padding: 28rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:active::before {
  left: 100%;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.secondary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.action-btn.tertiary {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #666;
  border: 1rpx solid #e0e0e0;
}
</style>
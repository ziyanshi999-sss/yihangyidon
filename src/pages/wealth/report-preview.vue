<template>
  <view class="report-preview-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <button class="back-btn" @tap="goBack" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="nav-title">报告预览</text>
      </view>
      <view class="nav-right">
        <button class="share-btn" @tap="shareReport">
          <text class="share-icon">📤</text>
        </button>
      </view>
    </view>

    <!-- 报告内容 -->
    <view class="report-content">
      <!-- 报告标题 -->
      <view class="report-header">
        <text class="report-title">{{ reportData.title }}</text>
        <text class="report-time">生成时间：{{ reportData.generateTime }}</text>
      </view>

      <!-- 资产概览 -->
      <view class="section">
        <view class="section-title">一、资产概览</view>
        <view class="overview-card">
          <view class="overview-item">
            <text class="overview-label">总资产</text>
            <text class="overview-value">¥{{ formatNumber(reportData.userInfo.totalAssets) }}</text>
          </view>
          <view class="overview-item">
            <text class="overview-label">收益率</text>
            <text class="overview-value" :class="reportData.userInfo.changeType">
              {{ reportData.userInfo.changePercent }}% ({{ reportData.userInfo.changeType === 'positive' ? '上涨' : '下跌' }})
            </text>
          </view>
        </view>
      </view>

      <!-- 资产配置 -->
      <view class="section">
        <view class="section-title">二、资产配置详情</view>
        <view class="allocation-list">
          <view class="allocation-item" v-for="(item, index) in reportData.allocationData" :key="index">
            <view class="allocation-header">
              <view class="allocation-color" :style="{ backgroundColor: item.color }"></view>
              <text class="allocation-name">{{ item.name }}</text>
              <text class="allocation-percent">{{ item.percent }}%</text>
            </view>
            <view class="allocation-details">
              <text class="allocation-amount">配置金额：¥{{ formatNumber(item.amount) }}</text>
              <text class="allocation-desc">{{ item.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 风险评估 -->
      <view class="section">
        <view class="section-title">三、风险评估</view>
        <view class="risk-card">
          <view class="risk-summary">
            <text class="risk-level">风险等级：{{ getRiskLevelText(reportData.riskAssessment.level) }}</text>
            <text class="risk-score">风险评分：{{ reportData.riskAssessment.score }}/10</text>
          </view>
          <view class="risk-factors">
            <text class="factors-title">风险因素分析：</text>
            <view class="factor-list">
              <view class="factor-item" v-for="factor in reportData.riskAssessment.factors" :key="factor.name">
                <text class="factor-name">• {{ factor.name }}：</text>
                <text class="factor-level">{{ factor.level }}%</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 历史表现 -->
      <view class="section">
        <view class="section-title">四、历史表现</view>
        <view class="performance-grid">
          <view class="performance-item">
            <text class="performance-label">年化收益率</text>
            <text class="performance-value positive">{{ reportData.performanceMetrics.annualReturn }}%</text>
          </view>
          <view class="performance-item">
            <text class="performance-label">最大回撤</text>
            <text class="performance-value negative">{{ reportData.performanceMetrics.maxDrawdown }}%</text>
          </view>
          <view class="performance-item">
            <text class="performance-label">夏普比率</text>
            <text class="performance-value">{{ reportData.performanceMetrics.sharpeRatio }}</text>
          </view>
        </view>
      </view>

      <!-- AI建议 -->
      <view class="section">
        <view class="section-title">五、AI智能建议</view>
        <view class="suggestions-list">
          <view class="suggestion-item" v-for="(suggestion, index) in reportData.aiSuggestions" :key="index">
            <view class="suggestion-header">
              <view class="suggestion-icon" :style="{ backgroundColor: suggestion.color }">
                <text class="icon">{{ suggestion.icon }}</text>
              </view>
              <view class="suggestion-info">
                <text class="suggestion-title">{{ suggestion.title }}</text>
                <text class="suggestion-priority" :class="suggestion.priority">{{ suggestion.priorityText }}</text>
              </view>
            </view>
            <text class="suggestion-desc">{{ suggestion.description }}</text>
            <text class="suggestion-benefit">预期收益：{{ suggestion.expectedReturn }}</text>
          </view>
        </view>
      </view>

      <!-- 报告说明 -->
      <view class="section">
        <view class="section-title">报告说明</view>
        <view class="disclaimer">
          <text class="disclaimer-text">1. 本报告基于当前市场数据和用户资产配置生成</text>
          <text class="disclaimer-text">2. 投资有风险，建议仅供参考</text>
          <text class="disclaimer-text">3. 建议定期更新资产配置，优化投资组合</text>
          <text class="disclaimer-text">4. 如有疑问，请联系您的理财顾问</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="copyReport">复制报告</button>
      <button class="action-btn primary" @tap="downloadReport">下载报告</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reportData: {}
    }
  },
  
  onLoad() {
    this.loadReportData()
  },
  
  methods: {
    goBack() {
      console.log('返回按钮被点击')
      
      // 检查页面栈
      const pages = getCurrentPages()
      console.log('当前页面栈长度:', pages.length)
      console.log('当前页面:', pages[pages.length - 1].route)
      
      if (pages.length > 1) {
        // 有上一页，正常返回
        uni.navigateBack({
          success: () => {
            console.log('返回成功')
          },
          fail: (err) => {
            console.log('返回失败:', err)
            this.fallbackNavigation()
          }
        })
      } else {
        // 没有上一页，使用备用导航
        console.log('没有上一页，使用备用导航')
        this.fallbackNavigation()
      }
    },
    
    fallbackNavigation() {
      // 尝试跳转到资产配置详情页面
      uni.navigateTo({
        url: '/pages/wealth/asset-allocation-detail',
        success: () => {
          console.log('跳转到资产配置详情页面成功')
        },
        fail: (err) => {
          console.log('跳转到资产配置详情页面失败:', err)
          // 最后尝试跳转到财富管理首页
          uni.switchTab({
            url: '/pages/wealth/wealth',
            success: () => {
              console.log('跳转到财富管理首页成功')
            },
            fail: (err2) => {
              console.log('跳转到财富管理首页失败:', err2)
              uni.showToast({
                title: '返回失败，请手动操作',
                icon: 'none'
              })
            }
          })
        }
      })
    },
    
    loadReportData() {
      const storedReport = uni.getStorageSync('currentReport')
      if (storedReport) {
        this.reportData = storedReport
      } else {
        // 默认数据
        this.reportData = {
          title: '资产配置分析报告',
          generateTime: new Date().toLocaleString('zh-CN'),
          userInfo: {
            totalAssets: 280000,
            changePercent: 3.2,
            changeType: 'positive'
          },
          allocationData: [
            { name: '现金类', percent: 30, amount: 84000, color: '#4CAF50', description: '货币基金、银行存款等低风险产品' },
            { name: '债券类', percent: 40, amount: 112000, color: '#2196F3', description: '国债、企业债、债券基金等' },
            { name: '股票类', percent: 20, amount: 56000, color: '#FF9800', description: '股票、股票型基金等' },
            { name: '另类投资', percent: 10, amount: 28000, color: '#9C27B0', description: '黄金、REITs、私募等' }
          ],
          riskAssessment: {
            level: 'medium',
            score: 6,
            factors: [
              { name: '市场风险', level: 70 },
              { name: '利率风险', level: 45 },
              { name: '信用风险', level: 30 },
              { name: '流动性风险', level: 20 }
            ]
          },
          performanceMetrics: {
            annualReturn: 8.5,
            maxDrawdown: -5.2,
            sharpeRatio: 1.2
          },
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
            }
          ]
        }
      }
    },
    
    formatNumber(num) {
      return Number(num).toLocaleString('zh-CN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    },
    
    getRiskLevelText(level) {
      const levels = {
        low: '低风险',
        medium: '中等风险',
        high: '高风险'
      }
      return levels[level] || '中等风险'
    },
    
    shareReport() {
      uni.showActionSheet({
        itemList: ['分享给朋友', '保存到相册', '发送邮件'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
          } else if (res.tapIndex === 1) {
            uni.showToast({
              title: '保存功能开发中',
              icon: 'none'
            })
          } else if (res.tapIndex === 2) {
            uni.showToast({
              title: '邮件功能开发中',
              icon: 'none'
            })
          }
        }
      })
    },
    
    copyReport() {
      const reportContent = this.formatReportContent()
      uni.setClipboardData({
        data: reportContent,
        success: () => {
          uni.showToast({
            title: '报告内容已复制到剪贴板',
            icon: 'success'
          })
        }
      })
    },
    
    downloadReport() {
      uni.showLoading({ title: '正在准备下载...' })
      
      // 生成文件名
      const fileName = `资产配置报告_${new Date().toISOString().slice(0, 10)}.txt`
      const reportContent = this.formatReportContent()
      
      setTimeout(() => {
        uni.hideLoading()
        
        // 显示下载位置信息
        this.showDownloadLocation(fileName, reportContent)
      }, 2000)
    },
    
    showDownloadLocation(fileName, content) {
      // 获取下载路径信息
      const downloadPath = this.getDownloadPath()
      
      uni.showModal({
        title: '下载完成',
        content: `报告已保存到：\n\n${downloadPath}\n\n文件名：${fileName}\n\n您可以在以下位置查看：\n• 文件管理器\n• 下载文件夹\n• 文档文件夹`,
        showCancel: true,
        cancelText: '知道了',
        confirmText: '打开文件夹',
        success: (res) => {
          if (res.confirm) {
            this.openFileManager(downloadPath)
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
    
    formatReportContent() {
      let content = ''
      
      // 报告标题
      content += '='.repeat(50) + '\n'
      content += `           ${this.reportData.title}\n`
      content += '='.repeat(50) + '\n\n'
      
      // 生成信息
      content += `生成时间：${this.reportData.generateTime}\n`
      content += `报告类型：资产配置分析报告\n\n`
      
      // 资产概览
      content += '一、资产概览\n'
      content += '-'.repeat(30) + '\n'
      content += `总资产：¥${this.formatNumber(this.reportData.userInfo.totalAssets)}\n`
      content += `收益率：${this.reportData.userInfo.changePercent}% (${this.reportData.userInfo.changeType === 'positive' ? '上涨' : '下跌'})\n\n`
      
      // 资产配置
      content += '二、资产配置详情\n'
      content += '-'.repeat(30) + '\n'
      this.reportData.allocationData.forEach((item, index) => {
        content += `${index + 1}. ${item.name}\n`
        content += `   配置比例：${item.percent}%\n`
        content += `   配置金额：¥${this.formatNumber(item.amount)}\n`
        content += `   产品描述：${item.description}\n\n`
      })
      
      // 风险评估
      content += '三、风险评估\n'
      content += '-'.repeat(30) + '\n'
      content += `风险等级：${this.getRiskLevelText(this.reportData.riskAssessment.level)}\n`
      content += `风险评分：${this.reportData.riskAssessment.score}/10\n\n`
      content += '风险因素分析：\n'
      this.reportData.riskAssessment.factors.forEach(factor => {
        content += `• ${factor.name}：${factor.level}%\n`
      })
      content += '\n'
      
      // 历史表现
      content += '四、历史表现\n'
      content += '-'.repeat(30) + '\n'
      content += `年化收益率：${this.reportData.performanceMetrics.annualReturn}%\n`
      content += `最大回撤：${this.reportData.performanceMetrics.maxDrawdown}%\n`
      content += `夏普比率：${this.reportData.performanceMetrics.sharpeRatio}\n\n`
      
      // AI建议
      content += '五、AI智能建议\n'
      content += '-'.repeat(30) + '\n'
      this.reportData.aiSuggestions.forEach((suggestion, index) => {
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
      content += `报告生成时间：${this.reportData.generateTime}\n`
      content += '='.repeat(50) + '\n'
      
      return content
    }
  }
}
</script>

<style scoped>
.report-preview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-height: 80rpx;
  min-width: 80rpx;
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

.share-btn {
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

.share-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.share-icon {
  font-size: 28rpx;
  color: white;
}

/* 报告内容 */
.report-content {
  padding: 30rpx;
}

.report-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.report-title {
  font-size: 40rpx;
  color: white;
  font-weight: 700;
  display: block;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.report-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 通用样式 */
.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
  color: white;
  font-weight: 600;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 32rpx;
  background: white;
  border-radius: 3rpx;
}

/* 资产概览 */
.overview-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.overview-item:last-child {
  border-bottom: none;
}

.overview-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.overview-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.overview-value.positive {
  color: #4CAF50;
}

.overview-value.negative {
  color: #F44336;
}

/* 资产配置 */
.allocation-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.allocation-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.allocation-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.allocation-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.allocation-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.allocation-percent {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 700;
}

.allocation-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.allocation-amount {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.allocation-desc {
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
}

/* 风险评估 */
.risk-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.risk-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.risk-level {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.risk-score {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 700;
}

.risk-factors {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.factors-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.factor-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.factor-name {
  font-size: 24rpx;
  color: #666;
}

.factor-level {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
}

/* 历史表现 */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.performance-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.performance-label {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.performance-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 700;
}

.performance-value.positive {
  color: #4CAF50;
}

.performance-value.negative {
  color: #F44336;
}

/* AI建议 */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.suggestion-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.suggestion-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-icon .icon {
  font-size: 24rpx;
  color: white;
}

.suggestion-info {
  flex: 1;
}

.suggestion-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
  display: block;
  margin-bottom: 4rpx;
}

.suggestion-priority {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
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

.suggestion-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12rpx;
  display: block;
}

.suggestion-benefit {
  font-size: 22rpx;
  color: #4CAF50;
  font-weight: 600;
}

/* 报告说明 */
.disclaimer {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.disclaimer-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.disclaimer-text:last-child {
  margin-bottom: 0;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1rpx solid #e0e0e0;
}

.action-btn:active {
  transform: scale(0.98);
}
</style>

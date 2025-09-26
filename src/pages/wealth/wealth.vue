<template>
  <view class="wealth-container">
    <!-- 资产概览轮播（图片版） -->
    <view class="asset-swiper-wrap">
      <swiper class="asset-swiper" :circular="true" :autoplay="true" :interval="4000" :duration="500" indicator-dots indicator-active-color="#2e7d32">
        <swiper-item v-for="(img, idx) in swiperImages" :key="idx">
          <image class="swiper-image" :src="img" mode="aspectFill" @click="onSwiperClick(idx)" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 客服模块 -->
    <view class="service-card" @click="onOnlineService">
      <view class="ai-assistant" @click.stop="goToAIWealthManager">
        <image class="ai-assistant-icon" src="/static/wealth/aiavatar.png" mode="aspectFill" />
        <text class="ai-assistant-text">AI助手</text>
      </view>
      <image class="service-icon" src="/static/tabbar/service.png" mode="aspectFit" />
      <view class="service-info">
        <text class="service-title">专属客服</text>
        <text class="service-sub">{{ serviceHours }} · 为您解答理财问题</text>
      </view>
      <view class="service-actions">
        <button class="mini-btn ghost" @click.stop="onOnlineService">在线客服</button>
        <button class="mini-btn call" @click.stop="onCallHotline">拨打 {{ serviceHotline }}</button>
      </view>
    </view>


    <!-- 四宫格入口 -->
    <view class="entry-grid">
      <view class="entry-item" @click="navigateToPage('branch')">
        <view class="entry-icon branch-icon">
          <text class="icon-text">网</text>
        </view>
        <text class="entry-text">我的网点</text>
      </view>
      <view class="entry-item" @click="navigateToPage('product')">
        <view class="entry-icon product-icon">
          <text class="icon-text">理</text>
        </view>
        <text class="entry-text">理财产品</text>
      </view>
      <view class="entry-item" @click="navigateToPage('insurance')">
        <view class="entry-icon insurance-icon">
          <text class="icon-text">保</text>
        </view>
        <text class="entry-text">保险</text>
      </view>
      <view class="entry-item" @click="navigateToPage('forex')">
        <view class="entry-icon forex-icon">
          <text class="icon-text">汇</text>
        </view>
        <text class="entry-text">外汇</text>
      </view>
    </view>

    <!-- Tabs -->
    <view class="tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab-item"
        :class="{ active: activeTab === t.key }"
        @click="activeTab = t.key"
      >
        {{ t.name }}
      </view>
    </view>

    <!-- 内容区（整页滚动） -->
    <view class="content">
      <!-- 存款 -->
      <view v-if="activeTab === 'deposit'">
        <view class="section-card highlight">
          <view class="section-header">
            <text class="section-title">我的存款</text>
            <text class="link" @click="onViewAll('deposit')">查看明细</text>
          </view>
          <view class="deposit-stats">
            <view class="stat-item">
              <text class="stat-label">活期(元)</text>
              <text class="stat-value">{{ hideAmount ? '****' : depositSummary.current }}</text>
            </view>
            <view class="divider"></view>
            <view class="stat-item">
              <text class="stat-label">定期(元)</text>
              <text class="stat-value">{{ hideAmount ? '****' : depositSummary.fixed }}</text>
            </view>
            <view class="divider"></view>
            <view class="stat-item">
              <text class="stat-label">智能存款(元)</text>
              <text class="stat-value">{{ hideAmount ? '****' : depositSummary.smart }}</text>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header">
            <text class="section-title">热门定期存款</text>
            <text class="sub">优选期限 · 灵活到期</text>
          </view>
          <view class="list">
            <view class="list-item" v-for="item in depositProducts" :key="item.id" @click="onDepositDetail(item)">
              <view class="li-left">
                <view class="title-row">
                  <text class="li-title">{{ item.name }}</text>
                  <text class="tag">{{ item.term }}</text>
                </view>
                <text class="li-sub">起存金额 {{ item.minAmount }} 元</text>
              </view>
              <view class="li-right">
                <text class="rate">{{ item.rate }}%</text>
                <text class="rate-sub">年化利率</text>
                <button class="mini-btn" @click.stop="onDepositBuy(item)">存入</button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 理财产品 -->
      <view v-if="activeTab === 'product'">
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">精选理财</text>
            <text class="sub">稳健优选 · 风险匹配</text>
          </view>
          <view class="list">
            <view class="list-item" v-for="p in wealthProducts" :key="p.id" @click="onProductDetail(p)">
              <view class="li-left">
                <view class="title-row">
                  <text class="li-title">{{ p.name }}</text>
                  <text class="tag warn" v-if="p.risk==='中'">中风险</text>
                  <text class="tag safe" v-if="p.risk==='低'">低风险</text>
                </view>
                <text class="li-sub">{{ p.term }} · 起投 {{ p.minAmount }} 元</text>
              </view>
              <view class="li-right">
                <text class="rate strong">{{ p.yield }}%</text>
                <text class="rate-sub">近七日年化</text>
                <button class="mini-btn primary" @click.stop="onProductBuy(p)">申购</button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 保险 -->
      <view v-if="activeTab === 'insurance'">
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">热门保险</text>
            <text class="sub">健康/意外/重疾 全面覆盖</text>
          </view>
          <view class="ins-grid">
            <view class="ins-card" v-for="ins in insuranceList" :key="ins.id" @click="onInsuranceDetail(ins)">
              <view class="ins-head">
                <text class="ins-name">{{ ins.name }}</text>
                <text class="ins-tag" :class="ins.type">{{ ins.typeText }}</text>
              </view>
              <text class="ins-desc">{{ ins.desc }}</text>
              <view class="ins-foot">
                <text class="ins-prem">￥{{ ins.premium }}/年起</text>
                <button class="mini-btn" @click.stop="onInsuranceBuy(ins)">投保</button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 外汇 -->
      <view v-if="activeTab === 'forex'">
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">外汇行情</text>
            <text class="sub">实时汇率 · 支持结售汇</text>
          </view>
          <view class="fx-table">
            <view class="fx-row fx-head">
              <text class="fx-col code">币种</text>
              <text class="fx-col price">现价</text>
              <text class="fx-col change">涨跌</text>
              <text class="fx-col op">操作</text>
            </view>
            <view class="fx-row" v-for="fx in forexList" :key="fx.code">
              <text class="fx-col code">{{ fx.code }}</text>
              <text class="fx-col price">{{ fx.price }}</text>
              <text class="fx-col change" :class="{ up: fx.change>0, down: fx.change<0 }">
                {{ fx.change>0? '+'+fx.change : fx.change }}%
              </text>
              <view class="fx-col op">
                <button class="mini-btn" @click.stop="onForexTrade(fx)">交易</button>
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header">
            <text class="section-title">常用工具</text>
          </view>
          <view class="tool-grid">
            <view class="tool-item" @click="onOpenTool('calc')">
              <text class="tool-icon">🧮</text>
              <text class="tool-text">收益计算器</text>
            </view>
            <view class="tool-item" @click="onOpenTool('calendar')">
              <text class="tool-icon">📅</text>
              <text class="tool-text">产品日历</text>
            </view>
            <view class="tool-item" @click="onOpenTool('risk')">
              <text class="tool-icon">⚖️</text>
              <text class="tool-text">风险评测</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 热点资讯（固定展示在底部） -->
      <view class="section-card">
        <view class="section-header">
          <text class="section-title">热点资讯</text>
          <text class="sub">精选银行与理财要闻</text>
        </view>
        <view class="news-list">
          <view class="news-item" v-for="n in newsList" :key="n.id" @click="onNewsClick(n)">
            <image class="news-cover" :src="n.cover" mode="aspectFill" />
            <view class="news-body">
              <view class="news-title">{{ n.title }}</view>
              <view class="news-meta">
                <text class="news-tag" :class="n.tagClass">{{ n.tag }}</text>
                <text class="news-source">{{ n.source }}</text>
                <text class="news-time">{{ n.time }}</text>
              </view>
            </view>
            <view class="news-arrow">›</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 客服选择弹窗 -->
    <ServiceModal :visible="showServiceModal" @close="closeServiceModal" />
  </view>
</template>

<script>
import ServiceModal from '@/components/common/ServiceModal.vue'
import { getCurrentUserWealthData, initWealthDataSync, getCurrentUserId } from '@/api/wealth.js'
import { checkAndFixUserDataConsistency } from '@/utils/data-consistency.js'
import themeManager from '@/utils/theme.js'
import { useAppStore } from '@/stores/app.js'

export default {
  components: {
    ServiceModal
  },
  data() {
    return {
      hideAmount: false,
      activeTab: 'deposit',
      showServiceModal: false,
      currentTheme: 'light',
      tabs: [
        { key: 'deposit', name: '存款' },
        { key: 'product', name: '理财产品' },
        { key: 'insurance', name: '保险' },
        { key: 'forex', name: '外汇' }
      ],
      // 顶部轮播图片（本地）
      swiperImages: [
        '/static/wealth/swip1.jpg',
        '/static/wealth/swip2.jpg',
        '/static/wealth/swip3.jpg'
      ],
      // 客服
      serviceHotline: '95599',
      serviceHours: '7×24小时在线',
      totalAssets: '0.00',
      yesterdayProfit: '+0.00',
      depositSummary: {
        current: '0.00',
        fixed: '0.00',
        smart: '0.00'
      },
      depositProducts: [],
      wealthProducts: [],
      insuranceList: [],
      forexList: [],
      // 热点资讯（示例静态数据，可后续接入后端/抓取）
      newsList: [
        {
          id: 'n1',
          title: '银行App上线智能投顾：个性化组合更省心',
          source: '银行官方',
          time: '今天 10:20',
          tag: '产品上新',
          tagClass: 'tag-new',
          cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'n2',
          title: '人民币存款利率微调，稳中趋优助力财富增值',
          source: '金融时报',
          time: '今天 09:05',
          tag: '利率',
          tagClass: 'tag-rate',
          cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'n3',
          title: '净值型理财规模增长，风险匹配与长期主义成共识',
          source: '理财早报',
          time: '昨天 18:42',
          tag: '理财',
          tagClass: 'tag-wealth',
          cover: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?q=80&w=1200&auto=format&fit=crop'
        },
        {
          id: 'n4',
          title: '外汇市场波动加大，分散配置与风险对冲受关注',
          source: '外汇观察',
          time: '昨天 14:10',
          tag: '外汇',
          tagClass: 'tag-fx',
          cover: 'https://img0.baidu.com/it/u=4159114734,4003708834&fm=253&fmt=auto&app=138&f=JPEG?w=739&h=500'
        }
      ]
    }
  },
  
  onLoad() {
    console.log('财富页面加载')
    this.ensureLoginStatus()
    this.initDataSync()
    this.loadWealthData()
    this.initTheme()
  },
  
  methods: {
    // 确保登录状态
    ensureLoginStatus() {
      const isLoggedIn = uni.getStorageSync('isLoggedIn')
      const userInfo = uni.getStorageSync('userInfo')
      
      if (!isLoggedIn || !userInfo) {
        console.log('财富页面：用户未登录，尝试从数据库恢复登录状态')
        
        // 尝试从数据库恢复登录状态
        try {
          const users = uni.getStorageSync('users') || []
          const loggedInUser = users.find(user => user.isLoggedIn === true)
          
          if (loggedInUser) {
            console.log('从数据库恢复登录状态:', loggedInUser.username)
            // 恢复登录状态
            uni.setStorageSync('userInfo', loggedInUser)
            uni.setStorageSync('isLoggedIn', true)
            uni.setStorageSync('currentUser', loggedInUser)
            uni.setStorageSync('currentUserId', loggedInUser.id)
          } else {
            // 使用数据一致性检查确保用户信息正确
            const consistentUserInfo = checkAndFixUserDataConsistency()
            
            if (consistentUserInfo) {
              uni.setStorageSync('isLoggedIn', true)
              console.log('已设置真实用户登录状态:', consistentUserInfo.username, '余额:', consistentUserInfo.balance)
            } else {
              // 如果数据库中没有用户，使用默认数据
              const defaultUser = {
                id: 'u001',
                username: '李华',
                phone: '13888888888',
                balance: 280000.00,
                nickname: '华华',
                realName: '李华',
                email: 'lihua@example.com',
                gender: '女',
                birthDate: '1995-03-15',
                address: '北京市朝阳区建国门外大街1号'
              }
              
              uni.setStorageSync('userInfo', defaultUser)
              uni.setStorageSync('isLoggedIn', true)
              uni.setStorageSync('currentUser', defaultUser)
              
              console.log('已设置默认用户登录状态用于测试')
            }
          }
        } catch (recoveryError) {
          console.error('恢复登录状态失败:', recoveryError)
          // 使用数据一致性检查作为备选方案
          const consistentUserInfo = checkAndFixUserDataConsistency()
          if (consistentUserInfo) {
            uni.setStorageSync('isLoggedIn', true)
            console.log('已设置真实用户登录状态:', consistentUserInfo.username, '余额:', consistentUserInfo.balance)
          }
        }
      } else {
        // 即使已登录，也要检查数据一致性
        const consistentUserInfo = checkAndFixUserDataConsistency()
        if (consistentUserInfo) {
          console.log('用户数据一致性检查完成:', consistentUserInfo.username, '余额:', consistentUserInfo.balance)
        }
      }
    },
    
    onSwiperClick(idx) {
      uni.showToast({ title: `轮播图第${idx + 1}张`, icon: 'none' })
    },
    onOnlineService() {
      // 显示客服选择弹窗
      this.showServiceModal = true
    },
    
    // 关闭客服弹窗
    closeServiceModal() {
      this.showServiceModal = false
    },
    onCallHotline() {
      uni.makePhoneCall({ phoneNumber: this.serviceHotline })
    },
    
    // 跳转到AI财富管理
    goToAIWealthManager() {
      uni.navigateTo({
        url: '/pages/wealth/ai-wealth-manager'
      })
    },
    onRecharge() {
      uni.showToast({ title: '充值功能开发中', icon: 'none' })
    },
    onWithdraw() {
      uni.showToast({ title: '提现功能开发中', icon: 'none' })
    },
    onViewAll(type) {
      uni.showToast({ title: `查看全部(${type})`, icon: 'none' })
    },
    onDepositDetail(item) {
      uni.showToast({ title: `${item.name} · ${item.term}`, icon: 'none' })
    },
    onDepositBuy(item) {
      uni.showToast({ title: `存入：${item.name}`, icon: 'none' })
    },
    onProductDetail(p) {
      uni.showToast({ title: `${p.name}`, icon: 'none' })
    },
    onProductBuy(p) {
      uni.showToast({ title: `申购：${p.name}`, icon: 'none' })
    },
    onInsuranceDetail(ins) {
      uni.showToast({ title: `${ins.name}`, icon: 'none' })
    },
    onInsuranceBuy(ins) {
      uni.showToast({ title: `投保：${ins.name}`, icon: 'none' })
    },
    onForexTrade(fx) {
      uni.showToast({ title: `外汇交易：${fx.code}`, icon: 'none' })
    },
    onOpenTool(tool) {
      const map = { calc: '收益计算器', calendar: '产品日历', risk: '风险评测' }
      uni.showToast({ title: `${map[tool]}(开发中)`, icon: 'none' })
    },
    onNewsClick(n) {
      // 可扩展：跳转资讯详情/H5落地页
      uni.showToast({ title: n.title, icon: 'none' })
    },
    
    // 页面跳转方法
    navigateToPage(pageType) {
      // 检查登录状态
      const isLoggedIn = uni.getStorageSync('isLoggedIn')
      const userInfo = uni.getStorageSync('userInfo')
      
      if (!isLoggedIn || !userInfo) {
        uni.showModal({
          title: '需要登录',
          content: '请先登录后再使用此功能',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/denglu/login'
              })
            }
          }
        })
        return
      }
      
      const pageMap = {
        branch: '/pages/wealth/branch',
        product: '/pages/wealth/product',
        insurance: '/pages/wealth/insurance',
        forex: '/pages/wealth/forex'
      }
      
      const url = pageMap[pageType]
      if (url) {
        // 添加延迟确保页面状态正常
        setTimeout(() => {
          uni.navigateTo({
            url: url,
            success: () => {
              console.log('页面跳转成功:', url)
            },
            fail: (err) => {
              console.error('页面跳转失败:', err)
              // 如果navigateTo失败，尝试使用redirectTo
              uni.redirectTo({
                url: url,
                fail: (err2) => {
                  console.error('重定向也失败:', err2)
                  uni.showToast({ title: '页面跳转失败', icon: 'none' })
                }
              })
            }
          })
        }, 100)
      } else {
        uni.showToast({ title: '页面不存在', icon: 'none' })
      }
    },
    
    // 初始化数据同步
    initDataSync() {
      // 初始化财富数据同步
      initWealthDataSync()
      
      // 监听各种数据更新事件
      uni.$on('depositSuccess', (data) => {
        console.log('财富页面收到存款成功事件:', data)
        // 可以在这里更新页面显示或刷新数据
      })
      
      uni.$on('purchaseSuccess', (data) => {
        console.log('财富页面收到购买成功事件:', data)
        // 可以在这里更新页面显示或刷新数据
      })
      
      uni.$on('insurancePurchaseSuccess', (data) => {
        console.log('财富页面收到保险购买成功事件:', data)
        // 可以在这里更新页面显示或刷新数据
      })
      
      uni.$on('balanceUpdated', (data) => {
        console.log('财富页面收到余额更新事件:', data)
        // 可以在这里更新页面显示
        this.loadWealthData() // 重新加载数据
      })
    },
    
    // 从数据连接器加载财富数据
    loadWealthData() {
      try {
        const wealthData = getCurrentUserWealthData()
        console.log('加载财富数据:', wealthData)
        
        // 更新存款数据
        if (wealthData.deposits) {
          this.depositSummary = {
            current: wealthData.deposits.current ? wealthData.deposits.current.toLocaleString() : '0.00',
            fixed: wealthData.deposits.fixed ? wealthData.deposits.fixed.toLocaleString() : '0.00',
            smart: wealthData.deposits.smart ? wealthData.deposits.smart.toLocaleString() : '0.00'
          }
        }
        
        // 更新存款产品数据
        if (wealthData.depositProducts && wealthData.depositProducts.fixed) {
          this.depositProducts = wealthData.depositProducts.fixed.map((product, index) => ({
            id: `d${index + 1}`,
            name: '整存整取',
            term: product.term,
            minAmount: product.minAmount,
            rate: product.rate
          }))
        }
        
        // 更新理财产品数据
        if (wealthData.investments) {
          this.wealthProducts = wealthData.investments.map((investment, index) => ({
            id: `w${index + 1}`,
            name: investment.name,
            risk: investment.rate <= 4.0 ? '低' : investment.rate <= 6.0 ? '中' : '高',
            term: investment.term,
            minAmount: 1000,
            yield: investment.rate
          }))
        }
        
        // 更新保险产品数据
        if (wealthData.insuranceProducts && wealthData.insuranceProducts.categories) {
          this.insuranceList = []
          wealthData.insuranceProducts.categories.forEach(category => {
            category.products.forEach(product => {
              this.insuranceList.push({
                id: product.id,
                name: product.name,
                type: category.id,
                typeText: category.name,
                desc: product.features ? product.features.join('·') : '',
                premium: product.premium
              })
            })
          })
        }
        
        // 更新外汇数据
        if (wealthData.forexProducts && wealthData.forexProducts.majorPairs) {
          this.forexList = wealthData.forexProducts.majorPairs.map(pair => ({
            code: pair.code,
            price: pair.price,
            change: parseFloat(pair.change)
          }))
        }
        
        // 计算总资产
        this.calculateTotalAssets(wealthData)
        
        console.log('财富数据加载完成')
      } catch (error) {
        console.error('加载财富数据失败:', error)
      }
    },
    
    // 计算总资产
    calculateTotalAssets(wealthData) {
      try {
        let totalAssets = 0
        
        // 存款总额
        if (wealthData.deposits) {
          totalAssets += (wealthData.deposits.current || 0)
          totalAssets += (wealthData.deposits.fixed || 0)
          totalAssets += (wealthData.deposits.smart || 0)
        }
        
        // 投资总额
        if (wealthData.investmentPortfolio && wealthData.investmentPortfolio.totalValue) {
          totalAssets += wealthData.investmentPortfolio.totalValue
        }
        
        // 格式化显示
        this.totalAssets = totalAssets.toLocaleString('zh-CN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
        
        // 计算昨日收益（模拟）
        const yesterdayReturn = wealthData.investmentPortfolio?.totalReturn || 0
        this.yesterdayProfit = yesterdayReturn >= 0 ? `+${yesterdayReturn.toFixed(2)}` : `${yesterdayReturn.toFixed(2)}`
        
        console.log('总资产计算完成:', this.totalAssets)
      } catch (error) {
        console.error('计算总资产失败:', error)
      }
    },

    // 初始化主题
    initTheme() {
      try {
        this.currentTheme = themeManager.getCurrentTheme()
        console.log('财富页面初始化主题:', this.currentTheme)
      } catch (error) {
        console.error('财富页面初始化主题失败:', error)
      }
    },

    // 检查主题变化
    checkThemeChange() {
      try {
        const currentTheme = themeManager.getCurrentTheme()
        if (this.currentTheme !== currentTheme) {
          this.currentTheme = currentTheme
          console.log('财富页面主题已更新:', currentTheme)
        }
      } catch (error) {
        console.error('财富页面检查主题变化失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.wealth-container {
  background: var(--theme-background, #f5f7fb);
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

/* 顶部轮播图片样式 */
.asset-swiper-wrap { padding: 20rpx; }
.asset-swiper { height: 220rpx; border-radius: 20rpx; overflow: hidden; }
.swiper-image { width: 100%; height: 100%; border-radius: 20rpx; }

/* 客服模块 */
.service-card { margin: 0 20rpx 16rpx; background: var(--theme-card-background, #fff); border-radius: 16rpx; padding: 16rpx; display: flex; align-items: center; gap: 16rpx; box-shadow: 0 6rpx 20rpx var(--theme-shadow-light, rgba(0,0,0,0.04)); border: 2rpx solid var(--theme-border, #f0f0f0); transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
.service-icon { width: 64rpx; height: 64rpx; }
.service-info { flex: 1; }
.service-title { font-size: 28rpx; font-weight: 700; color: var(--theme-text-primary, #222); transition: color 0.3s ease; }
.service-sub { display: block; font-size: 22rpx; color: var(--theme-text-secondary, #888); margin-top: 4rpx; transition: color 0.3s ease; }
.service-actions { display: flex; gap: 12rpx; }
.mini-btn.ghost { background: #fff; color: #2e7d32; border: 2rpx solid #2e7d32; }
.mini-btn.call { background: #1e88e5; }

/* AI助手 */
.ai-assistant {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 8rpx 12rpx;
  background: linear-gradient(135deg, #f8f9ff, #e8f0ff);
  border-radius: 16rpx;
  border: 1rpx solid rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-width: 80rpx;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.1);
}

.ai-assistant::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.ai-assistant:active::before {
  left: 100%;
}

.ai-assistant:active {
  background: linear-gradient(135deg, #e8f0ff, #d6e7ff);
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.2);
}

.ai-assistant-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 2rpx 6rpx rgba(102, 126, 234, 0.15);
}

.ai-assistant-text {
  font-size: 18rpx;
  color: #667eea;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}


.entry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx; padding: 0 20rpx 20rpx; }
.entry-item { 
  background: var(--theme-card-background, #fff); 
  border-radius: 16rpx; 
  padding: 20rpx 10rpx; 
  text-align: center; 
  box-shadow: 0 6rpx 20rpx var(--theme-shadow-light, rgba(0,0,0,0.04));
  transition: all 0.3s ease;
}
.entry-item:active {
  transform: scale(0.95);
  box-shadow: 0 3rpx 10rpx rgba(0,0,0,0.1);
}
.entry-icon { 
  width: 48rpx; 
  height: 48rpx; 
  margin: 0 auto 10rpx; 
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.icon-text {
  font-size: 24rpx;
  font-weight: bold;
  color: white;
  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.2);
}
/* 网点图标 - 银行建筑风格 */
.branch-icon {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
}
.branch-icon::before {
  content: '';
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 20rpx;
  height: 12rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 2rpx;
}
.branch-icon::after {
  content: '';
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 24rpx;
  height: 16rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 2rpx;
}
/* 理财产品图标 - 图表风格 */
.product-icon {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}
.product-icon::before {
  content: '';
  position: absolute;
  bottom: 8rpx;
  left: 8rpx;
  width: 4rpx;
  height: 12rpx;
  background: rgba(255,255,255,0.6);
  border-radius: 1rpx;
}
.product-icon::after {
  content: '';
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  width: 4rpx;
  height: 20rpx;
  background: rgba(255,255,255,0.8);
  border-radius: 1rpx;
}
/* 保险图标 - 盾牌风格 */
.insurance-icon {
  background: linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%);
}
.insurance-icon::before {
  content: '';
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12rpx solid transparent;
  border-right: 12rpx solid transparent;
  border-bottom: 16rpx solid rgba(255,255,255,0.3);
}
/* 外汇图标 - 货币符号风格 */
.forex-icon {
  background: linear-gradient(135deg, #f57c00 0%, #ffb74d 100%);
}
.forex-icon::before {
  content: '$';
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  font-size: 16rpx;
  color: rgba(255,255,255,0.7);
  font-weight: bold;
}
.forex-icon::after {
  content: '¥';
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  font-size: 16rpx;
  color: rgba(255,255,255,0.7);
  font-weight: bold;
}
.entry-text { font-size: 24rpx; color: var(--theme-text-primary, #333); transition: color 0.3s ease; }

.tabs { display: flex; padding: 0 12rpx; margin: 0 8rpx 12rpx; gap: 12rpx; }
.tab-item { flex: none; padding: 16rpx 24rpx; background: var(--theme-card-background, #fff); border-radius: 999rpx; color: var(--theme-text-primary, #333); transition: background-color 0.3s ease, color 0.3s ease; }
.tab-item.active { background: var(--theme-primary, #2e7d32); color: #fff; font-weight: 700; }

.content { padding: 0 20rpx 30rpx; }

.section-card { background: var(--theme-card-background, #fff); border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx var(--theme-shadow-light, rgba(0,0,0,0.04)); transition: background-color 0.3s ease, box-shadow 0.3s ease; }
.section-card.highlight { background: linear-gradient(135deg, #e8f5e9 0%, var(--theme-card-background, #ffffff) 100%); }
.section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: var(--theme-text-primary, #222); transition: color 0.3s ease; }
.sub { font-size: 22rpx; color: var(--theme-text-secondary, #888); transition: color 0.3s ease; }
.link { font-size: 24rpx; color: var(--theme-primary, #2e7d32); transition: color 0.3s ease; }

.deposit-stats { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 12rpx; }
.divider { width: 2rpx; height: 60rpx; background: var(--theme-border, #eee); transition: background-color 0.3s ease; }
.stat-label { font-size: 24rpx; color: var(--theme-text-secondary, #666); transition: color 0.3s ease; }
.stat-value { font-size: 32rpx; font-weight: 700; color: var(--theme-text-primary, #222); margin-top: 6rpx; display: block; transition: color 0.3s ease; }

.list { display: flex; flex-direction: column; gap: 20rpx; }
.list-item { display: flex; align-items: center; justify-content: space-between; background: var(--theme-card-background, #fff); border-radius: 12rpx; padding: 18rpx; border: 2rpx solid var(--theme-border, #f0f0f0); transition: background-color 0.3s ease, border-color 0.3s ease; }
.li-left { flex: 1; }
.title-row { display: flex; align-items: center; gap: 10rpx; }
.li-title { font-size: 30rpx; font-weight: 700; color: var(--theme-text-primary, #222); transition: color 0.3s ease; }
.li-sub { font-size: 24rpx; color: var(--theme-text-secondary, #888); margin-top: 6rpx; display: block; transition: color 0.3s ease; }
.tag { font-size: 22rpx; padding: 4rpx 10rpx; border-radius: 8rpx; background: #f2f4f8; color: #556; }
.tag.safe { background: #e3f2e6; color: #2e7d32; }
.tag.warn { background: #fff4e5; color: #b26a00; }

.li-right { min-width: 220rpx; display: flex; flex-direction: column; align-items: flex-end; gap: 8rpx; }
.rate { font-size: 34rpx; font-weight: 700; color: #ff6a00; }
.rate.strong { color: #e53935; }
.rate-sub { font-size: 22rpx; color: var(--theme-text-secondary, #888); transition: color 0.3s ease; }
.mini-btn { background: #2e7d32; color: #fff; border: none; border-radius: 999rpx; padding: 10rpx 22rpx; font-size: 24rpx; }
.mini-btn.primary { background: #1e88e5; }

.ins-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.ins-card { background: var(--theme-card-background, #fff); border-radius: 12rpx; padding: 18rpx; border: 2rpx solid var(--theme-border, #f0f0f0); transition: background-color 0.3s ease, border-color 0.3s ease; }
.ins-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx; }
.ins-name { font-size: 28rpx; font-weight: 700; color: var(--theme-text-primary, #222); transition: color 0.3s ease; }
.ins-tag { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 999rpx; color: #fff; }
.ins-tag.health { background: #43a047; }
.ins-tag.accident { background: #1e88e5; }
.ins-tag.critical { background: #8e24aa; }
.ins-desc { font-size: 24rpx; color: var(--theme-text-secondary, #666); display: block; margin: 6rpx 0 12rpx; transition: color 0.3s ease; }
.ins-foot { display: flex; align-items: center; justify-content: space-between; }
.ins-prem { font-size: 26rpx; color: #e53935; font-weight: 700; }

.fx-table { width: 100%; }
.fx-row { display: grid; grid-template-columns: 2fr 2fr 2fr 2fr; align-items: center; padding: 14rpx 10rpx; border-bottom: 2rpx solid var(--theme-border, #f1f1f1); transition: border-color 0.3s ease; }
.fx-head { background: var(--theme-background, #f8fafc); border-radius: 8rpx; font-weight: 600; transition: background-color 0.3s ease; }
.fx-col { font-size: 26rpx; color: var(--theme-text-primary, #333); transition: color 0.3s ease; }
.fx-col.code { font-weight: 700; }
.fx-col.price { color: #111; }
.fx-col.change.up { color: #2e7d32; }
.fx-col.change.down { color: #e53935; }
.fx-col.op { text-align: right; }

.tool-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; }
.tool-item { background: var(--theme-card-background, #fff); border-radius: 12rpx; padding: 20rpx 10rpx; text-align: center; border: 2rpx solid var(--theme-border, #f0f0f0); transition: background-color 0.3s ease, border-color 0.3s ease; }
.tool-icon { font-size: 40rpx; display: block; margin-bottom: 8rpx; }
.tool-text { font-size: 24rpx; color: var(--theme-text-primary, #333); transition: color 0.3s ease; }

/* 热点资讯 */
.news-list { display: flex; flex-direction: column; gap: 16rpx; }
.news-item { display: flex; align-items: center; gap: 14rpx; background: var(--theme-card-background, #fff); border: 2rpx solid var(--theme-border, #f0f0f0); border-radius: 14rpx; padding: 14rpx; transition: background-color 0.3s ease, border-color 0.3s ease; }
.news-cover { width: 160rpx; height: 112rpx; border-radius: 10rpx; object-fit: cover; }
.news-body { flex: 1; min-width: 0; }
.news-title { font-size: 28rpx; font-weight: 700; color: var(--theme-text-primary, #1f2d3d); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.3s ease; }
.news-meta { display: flex; align-items: center; gap: 12rpx; margin-top: 8rpx; }
.news-tag { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 999rpx; color: #fff; background: #90a4ae; }
.news-tag.tag-new { background: linear-gradient(135deg, #42a5f5, #1e88e5); }
.news-tag.tag-rate { background: linear-gradient(135deg, #66bb6a, #43a047); }
.news-tag.tag-wealth { background: linear-gradient(135deg, #ff7043, #f4511e); }
.news-tag.tag-fx { background: linear-gradient(135deg, #ab47bc, #8e24aa); }
.news-source { font-size: 22rpx; color: var(--theme-text-secondary, #607d8b); transition: color 0.3s ease; }
.news-time { font-size: 22rpx; color: var(--theme-text-secondary, #90a4ae); transition: color 0.3s ease; }
.news-arrow { font-size: 36rpx; color: var(--theme-text-secondary, #cfd8dc); padding-left: 8rpx; transition: color 0.3s ease; }
</style>

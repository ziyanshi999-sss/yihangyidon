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
      <view class="entry-item" @click="activeTab = 'deposit'">
        <view class="entry-icon">🏦</view>
        <text class="entry-text">存款</text>
      </view>
      <view class="entry-item" @click="activeTab = 'product'">
        <view class="entry-icon">📈</view>
        <text class="entry-text">理财产品</text>
      </view>
      <view class="entry-item" @click="activeTab = 'insurance'">
        <view class="entry-icon">🛡️</view>
        <text class="entry-text">保险</text>
      </view>
      <view class="entry-item" @click="activeTab = 'forex'">
        <view class="entry-icon">💱</view>
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

    <!-- 内容区 -->
    <scroll-view scroll-y class="content">
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
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      hideAmount: false,
      activeTab: 'deposit',
      tabs: [
        { key: 'deposit', name: '存款' },
        { key: 'product', name: '理财产品' },
        { key: 'insurance', name: '保险' },
        { key: 'forex', name: '外汇' }
      ],
      // 顶部轮播图片
      swiperImages: [
        'https://www.abchina.com/cn/advis/grfw_gggl/sygg/202102/P020210202316125719385.jpg',
        'https://ewealth.abchina.com.cn/advis/sygg/201712/P020200120402132224758.jpg',
        'https://ewealth.abchina.com.cn/advis/whgg/201712/P020171220394037986599.jpg'
      ],
      // 客服
      serviceHotline: '95599',
      serviceHours: '7×24小时在线',
      totalAssets: '125,438.52',
      yesterdayProfit: '+35.78',
      depositSummary: {
        current: '23,560.20',
        fixed: '80,000.00',
        smart: '8,520.32'
      },
      depositProducts: [
        { id: 'd1', name: '整存整取', term: '3个月', minAmount: 1000, rate: 1.85 },
        { id: 'd2', name: '整存整取', term: '1年', minAmount: 1000, rate: 2.10 },
        { id: 'd3', name: '大额存单', term: '3年', minAmount: 200000, rate: 2.95 }
      ],
      wealthProducts: [
        { id: 'w1', name: '稳健优选第68期', risk: '低', term: '90天', minAmount: 10000, yield: 3.20 },
        { id: 'w2', name: '灵活理财T+1', risk: '低', term: '开放式', minAmount: 1000, yield: 2.65 },
        { id: 'w3', name: '进取增强半年期', risk: '中', term: '180天', minAmount: 10000, yield: 4.10 }
      ],
      insuranceList: [
        { id: 'i1', name: '安心医疗险', type: 'health', typeText: '医疗险', desc: '百万保额·报销广', premium: 268 },
        { id: 'i2', name: '家庭意外险', type: 'accident', typeText: '意外险', desc: '全家保障·一年期', premium: 199 },
        { id: 'i3', name: '重疾守护', type: 'critical', typeText: '重疾险', desc: '重大疾病全面保障', premium: 860 }
      ],
      forexList: [
        { code: 'USD/CNY', price: '7.2375', change: 0.12 },
        { code: 'EUR/CNY', price: '7.8801', change: -0.08 },
        { code: 'JPY/CNY', price: '0.0468', change: 0.02 }
      ]
    }
  },
  methods: {
    onSwiperClick(idx) {
      uni.showToast({ title: `轮播图第${idx + 1}张`, icon: 'none' })
    },
    onOnlineService() {
      uni.navigateTo({ url: '/pages/service/chat' })
    },
    onCallHotline() {
      uni.makePhoneCall({ phoneNumber: this.serviceHotline })
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
    }
  }
}
</script>

<style scoped>
.wealth-container {
  background: #f5f7fb;
  min-height: 100vh;
}

/* 顶部轮播图片样式 */
.asset-swiper-wrap { padding: 20rpx; }
.asset-swiper { height: 220rpx; border-radius: 20rpx; overflow: hidden; }
.swiper-image { width: 100%; height: 100%; border-radius: 20rpx; }

/* 客服模块 */
.service-card { margin: 0 20rpx 16rpx; background: #fff; border-radius: 16rpx; padding: 16rpx; display: flex; align-items: center; gap: 16rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); border: 2rpx solid #f0f0f0; }
.service-icon { width: 64rpx; height: 64rpx; }
.service-info { flex: 1; }
.service-title { font-size: 28rpx; font-weight: 700; color: #222; }
.service-sub { display: block; font-size: 22rpx; color: #888; margin-top: 4rpx; }
.service-actions { display: flex; gap: 12rpx; }
.mini-btn.ghost { background: #fff; color: #2e7d32; border: 2rpx solid #2e7d32; }
.mini-btn.call { background: #1e88e5; }

.entry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx; padding: 0 20rpx 20rpx; }
.entry-item { background: #fff; border-radius: 16rpx; padding: 20rpx 10rpx; text-align: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); }
.entry-icon { font-size: 48rpx; margin-bottom: 10rpx; }
.entry-text { font-size: 24rpx; color: #333; }

.tabs { display: flex; padding: 0 12rpx; margin: 0 8rpx 12rpx; gap: 12rpx; }
.tab-item { flex: none; padding: 16rpx 24rpx; background: #fff; border-radius: 999rpx; color: #333; }
.tab-item.active { background: #2e7d32; color: #fff; font-weight: 700; }

.content { height: calc(100vh - 480rpx); padding: 0 20rpx 30rpx; }

.section-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); }
.section-card.highlight { background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%); }
.section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: #222; }
.sub { font-size: 22rpx; color: #888; }
.link { font-size: 24rpx; color: #2e7d32; }

.deposit-stats { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 12rpx; }
.divider { width: 2rpx; height: 60rpx; background: #eee; }
.stat-item { }
.stat-label { font-size: 24rpx; color: #666; }
.stat-value { font-size: 32rpx; font-weight: 700; color: #222; margin-top: 6rpx; display: block; }

.list { display: flex; flex-direction: column; gap: 20rpx; }
.list-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12rpx; padding: 18rpx; border: 2rpx solid #f0f0f0; }
.li-left { flex: 1; }
.title-row { display: flex; align-items: center; gap: 10rpx; }
.li-title { font-size: 30rpx; font-weight: 700; color: #222; }
.li-sub { font-size: 24rpx; color: #888; margin-top: 6rpx; display: block; }
.tag { font-size: 22rpx; padding: 4rpx 10rpx; border-radius: 8rpx; background: #f2f4f8; color: #556; }
.tag.safe { background: #e3f2e6; color: #2e7d32; }
.tag.warn { background: #fff4e5; color: #b26a00; }

.li-right { min-width: 220rpx; display: flex; flex-direction: column; align-items: flex-end; gap: 8rpx; }
.rate { font-size: 34rpx; font-weight: 700; color: #ff6a00; }
.rate.strong { color: #e53935; }
.rate-sub { font-size: 22rpx; color: #888; }
.mini-btn { background: #2e7d32; color: #fff; border: none; border-radius: 999rpx; padding: 10rpx 22rpx; font-size: 24rpx; }
.mini-btn.primary { background: #1e88e5; }

.ins-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.ins-card { background: #fff; border-radius: 12rpx; padding: 18rpx; border: 2rpx solid #f0f0f0; }
.ins-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx; }
.ins-name { font-size: 28rpx; font-weight: 700; color: #222; }
.ins-tag { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 999rpx; color: #fff; }
.ins-tag.health { background: #43a047; }
.ins-tag.accident { background: #1e88e5; }
.ins-tag.critical { background: #8e24aa; }
.ins-desc { font-size: 24rpx; color: #666; display: block; margin: 6rpx 0 12rpx; }
.ins-foot { display: flex; align-items: center; justify-content: space-between; }
.ins-prem { font-size: 26rpx; color: #e53935; font-weight: 700; }

.fx-table { width: 100%; }
.fx-row { display: grid; grid-template-columns: 2fr 2fr 2fr 2fr; align-items: center; padding: 14rpx 10rpx; border-bottom: 2rpx solid #f1f1f1; }
.fx-head { background: #f8fafc; border-radius: 8rpx; font-weight: 600; }
.fx-col { font-size: 26rpx; color: #333; }
.fx-col.code { font-weight: 700; }
.fx-col.price { color: #111; }
.fx-col.change.up { color: #2e7d32; }
.fx-col.change.down { color: #e53935; }
.fx-col.op { text-align: right; }

.tool-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; }
.tool-item { background: #fff; border-radius: 12rpx; padding: 20rpx 10rpx; text-align: center; border: 2rpx solid #f0f0f0; }
.tool-icon { font-size: 40rpx; display: block; margin-bottom: 8rpx; }
.tool-text { font-size: 24rpx; color: #333; }
</style>

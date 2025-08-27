<template>
  <view class="government-page">
    <view class="page-header">
      <text class="header-title">政务民生</text>
      <text class="header-subtitle">便民服务 一键办理</text>
    </view>

    <!-- 服务分类 -->
    <view class="service-categories">
      <view class="category-tabs">
        <view
          class="tab-item"
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: activeCategory === index }"
          @tap="switchCategory(index)"
        >
          <text class="tab-text">{{ category.name }}</text>
        </view>
      </view>
    </view>

    <!-- 政务服务列表 -->
    <view class="government-services">
      <view class="services-grid">
        <view
          class="service-item"
          v-for="(service, index) in currentServices"
          :key="index"
          @tap="handleServiceTap(service)"
        >
          <view
            class="service-icon"
            :style="{ backgroundColor: service.bgColor }"
          >
            <text class="icon-text">{{ service.icon }}</text>
          </view>
          <text class="service-label">{{ service.label }}</text>
          <text class="service-desc">{{ service.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 热门服务 -->
    <view class="hot-services">
      <view class="section-header">
        <text class="section-title">🔥 热门服务</text>
      </view>

      <view class="hot-list">
        <view
          class="hot-item"
          v-for="(item, index) in hotServices"
          :key="index"
          @tap="handleServiceTap(item)"
        >
          <view class="hot-icon">
            <text>{{ item.icon }}</text>
          </view>
          <view class="hot-info">
            <text class="hot-title">{{ item.title }}</text>
            <text class="hot-subtitle">{{ item.subtitle }}</text>
          </view>
          <view class="hot-arrow">></view>
        </view>
      </view>
    </view>

    <!-- 办事指南 -->
    <view class="guide-section">
      <view class="section-header">
        <text class="section-title">📋 办事指南</text>
      </view>

      <view class="guide-cards">
        <view
          class="guide-card"
          v-for="(guide, index) in guides"
          :key="index"
          @tap="viewGuide(guide)"
        >
          <view class="guide-header">
            <text class="guide-title">{{ guide.title }}</text>
            <text class="guide-tag">{{ guide.tag }}</text>
          </view>
          <text class="guide-desc">{{ guide.desc }}</text>
          <view class="guide-steps">
            <text class="steps-text">{{ guide.steps }}个步骤</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "GovernmentPage",
  data() {
    return {
      activeCategory: 0,
      categories: [
        { name: "证件办理", type: "certificate" },
        { name: "社会保障", type: "social" },
        { name: "税务服务", type: "tax" },
        { name: "公积金", type: "fund" },
      ],
      certificateServices: [
        {
          icon: "🆔",
          label: "身份证",
          desc: "身份证办理",
          bgColor: "#007AFF",
          action: "id_card",
        },
        {
          icon: "📄",
          label: "户口本",
          desc: "户籍证明",
          bgColor: "#34C759",
          action: "household",
        },
        {
          icon: "🚗",
          label: "驾驶证",
          desc: "驾照服务",
          bgColor: "#FF9500",
          action: "license",
        },
        {
          icon: "🏠",
          label: "房产证",
          desc: "不动产证",
          bgColor: "#AF52DE",
          action: "property",
        },
      ],
      socialServices: [
        {
          icon: "🏥",
          label: "医保查询",
          desc: "医保信息",
          bgColor: "#FF3B30",
          action: "medical",
        },
        {
          icon: "👴",
          label: "养老保险",
          desc: "养老服务",
          bgColor: "#5AC8FA",
          action: "pension",
        },
        {
          icon: "💼",
          label: "失业保险",
          desc: "失业金",
          bgColor: "#FFCC02",
          action: "unemployment",
        },
        {
          icon: "👶",
          label: "生育保险",
          desc: "生育津贴",
          bgColor: "#FF2D92",
          action: "maternity",
        },
      ],
      taxServices: [
        {
          icon: "💰",
          label: "个税查询",
          desc: "个人所得税",
          bgColor: "#32D74B",
          action: "personal_tax",
        },
        {
          icon: "🏢",
          label: "企业税务",
          desc: "企业纳税",
          bgColor: "#5856D6",
          action: "enterprise_tax",
        },
        {
          icon: "📊",
          label: "纳税证明",
          desc: "完税证明",
          bgColor: "#FF6B35",
          action: "tax_proof",
        },
        {
          icon: "📋",
          label: "税务登记",
          desc: "税务注册",
          bgColor: "#64D2FF",
          action: "tax_register",
        },
      ],
      fundServices: [
        {
          icon: "🏦",
          label: "公积金查询",
          desc: "账户查询",
          bgColor: "#007AFF",
          action: "fund_query",
        },
        {
          icon: "💸",
          label: "公积金提取",
          desc: "提取申请",
          bgColor: "#34C759",
          action: "fund_withdraw",
        },
        {
          icon: "🏠",
          label: "公积金贷款",
          desc: "贷款申请",
          bgColor: "#FF9500",
          action: "fund_loan",
        },
        {
          icon: "📝",
          label: "缴存证明",
          desc: "缴存证明",
          bgColor: "#AF52DE",
          action: "fund_proof",
        },
      ],
      hotServices: [
        {
          icon: "🆔",
          title: "身份证办理进度查询",
          subtitle: "实时查看办证进度",
          action: "id_progress",
        },
        {
          icon: "🏥",
          title: "医保电子凭证",
          subtitle: "医保卡电子化服务",
          action: "medical_card",
        },
        {
          icon: "💰",
          title: "个税年度汇算",
          subtitle: "个人所得税汇算清缴",
          action: "tax_settlement",
        },
        {
          icon: "🏠",
          title: "不动产登记查询",
          subtitle: "房产信息查询服务",
          action: "property_query",
        },
      ],
      guides: [
        {
          title: "身份证首次申领",
          tag: "常用",
          desc: "16周岁以上首次申请身份证办理流程",
          steps: 3,
        },
        {
          title: "医保异地就医备案",
          tag: "热门",
          desc: "异地就医前的备案登记办理指南",
          steps: 4,
        },
        {
          title: "公积金贷款申请",
          tag: "推荐",
          desc: "购房公积金贷款申请条件及流程",
          steps: 5,
        },
      ],
    };
  },

  computed: {
    currentServices() {
      switch (this.activeCategory) {
        case 0:
          return this.certificateServices;
        case 1:
          return this.socialServices;
        case 2:
          return this.taxServices;
        case 3:
          return this.fundServices;
        default:
          return this.certificateServices;
      }
    },
  },

  methods: {
    switchCategory(index) {
      this.activeCategory = index;
    },

    handleServiceTap(service) {
      console.log("点击政务服务:", service);
      uni.showToast({
        title: `即将跳转到${service.label || service.title}`,
        icon: "none",
      });
    },

    viewGuide(guide) {
      console.log("查看办事指南:", guide);
      uni.showToast({
        title: `查看${guide.title}指南`,
        icon: "none",
      });
    },

    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped>
.government-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 60rpx;
  text-align: center;
}

.coming-title {
  font-size: 48rpx;
  margin-bottom: 40rpx;
}

.coming-desc {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 80rpx;
}

/* 服务分类 */
.service-categories {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.category-tabs {
  display: flex;
  padding: 8rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: #34c759;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #fff;
}

/* 政务服务网格 */
.government-services {
  background: #fff;
  margin: 0 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30rpx;
  border-radius: 16rpx;
  background: #fafafa;
  transition: all 0.3s ease;
}

.service-item:active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.icon-text {
  font-size: 32rpx;
  color: #fff;
}

.service-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #999;
}

/* 热门服务 */
.hot-services {
  background: #fff;
  margin: 0 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 12rpx;
  background: #fafafa;
  transition: all 0.3s ease;
}

.hot-item:active {
  background: #f0f0f0;
  transform: scale(0.98);
}

.hot-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #34c759, #30d158);
  border-radius: 12rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
}

.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hot-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.hot-subtitle {
  font-size: 24rpx;
  color: #999;
}

.hot-arrow {
  font-size: 32rpx;
  color: #ccc;
}

/* 办事指南 */
.guide-section {
  background: #fff;
  margin: 0 30rpx 100rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.guide-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.guide-card {
  padding: 30rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-left: 6rpx solid #34c759;
  transition: all 0.3s ease;
}

.guide-card:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.guide-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.guide-tag {
  background: #34c759;
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.guide-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.guide-steps {
  display: flex;
  justify-content: flex-end;
}

.steps-text {
  font-size: 24rpx;
  color: #34c759;
  font-weight: 500;
}
</style>
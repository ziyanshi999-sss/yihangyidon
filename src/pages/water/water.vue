<template>
  <view class="water-page">
    <!-- 位置选择 -->
    <view class="location-section">
      <view class="location-bar">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <text class="location-text">保定市</text>
        </view>
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input
            class="search-input"
            placeholder="请输入水费公司名称或小区名称"
            v-model="searchKeyword"
            @input="handleSearch"
          />
        </view>
      </view>
    </view>

    <!-- 新增缴费标题 -->
    <view class="section-title-container">
      <text class="section-title">新增缴费</text>
    </view>

    <!-- 水费公司列表 -->
    <view class="company-list">
      <view
        class="company-item"
        v-for="(company, index) in filteredCompanies"
        :key="index"
        @tap="selectCompany(company)"
      >
        <view class="company-info">
          <text class="company-name">{{ company.name }}</text>
          <text class="company-desc">{{ company.desc }}</text>
        </view>
        <view class="company-arrow">
          <text class="arrow-icon">→</text>
        </view>
      </view>
    </view>

    <!-- 展开更多按钮 -->
    <view class="expand-more" @tap="toggleExpand" v-if="hasMore">
      <text class="expand-text">{{ isExpanded ? "收起" : "展开更多" }}</text>
      <text class="expand-icon">{{ isExpanded ? "↑" : "↓" }}</text>
    </view>

    <!-- 没有搜索结果时显示 -->
    <view
      class="no-result"
      v-if="searchKeyword && filteredCompanies.length === 0"
    >
      <text class="no-result-text">未找到相关水费公司</text>
      <text class="no-result-desc">请尝试输入其他关键词</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "WaterPage",
  data() {
    return {
      searchKeyword: "",
      isExpanded: false,
      allCompanies: [
        {
          id: 1,
          name: "保定市荣投水务有限公司",
          desc: "水费",
          area: "保定市",
          type: "municipal",
        },
        {
          id: 2,
          name: "保定徐水智享物业管理有限公司",
          desc: "徐水凯郡丽城小区水费",
          area: "徐水区",
          type: "property",
        },
        {
          id: 3,
          name: "定兴县自来水公司",
          desc: "水费",
          area: "定兴县",
          type: "municipal",
        },
        {
          id: 4,
          name: "定州市东亭物业服务有限公司",
          desc: "东亭水电费-金城颂园",
          area: "定州市",
          type: "property",
        },
        {
          id: 5,
          name: "定州市东亭物业服务有限公司",
          desc: "东亭水电费-宝塔花园",
          area: "定州市",
          type: "property",
        },
        {
          id: 6,
          name: "涿州市供水有限公司",
          desc: "水费",
          area: "涿州市",
          type: "municipal",
        },
        {
          id: 7,
          name: "高碑店市自来水公司",
          desc: "水费",
          area: "高碑店市",
          type: "municipal",
        },
        {
          id: 8,
          name: "安国市自来水公司",
          desc: "水费",
          area: "安国市",
          type: "municipal",
        },
        {
          id: 9,
          name: "易县自来水公司",
          desc: "水费",
          area: "易县",
          type: "municipal",
        },
        {
          id: 10,
          name: "曲阳县自来水公司",
          desc: "水费",
          area: "曲阳县",
          type: "municipal",
        },
      ],
    };
  },

  computed: {
    // 过滤后的公司列表
    filteredCompanies() {
      let companies = this.allCompanies;

      // 如果有搜索关键词，进行过滤
      if (this.searchKeyword.trim()) {
        companies = companies.filter(
          (company) =>
            company.name
              .toLowerCase()
              .includes(this.searchKeyword.toLowerCase()) ||
            company.desc
              .toLowerCase()
              .includes(this.searchKeyword.toLowerCase()) ||
            company.area
              .toLowerCase()
              .includes(this.searchKeyword.toLowerCase())
        );
      }

      // 如果没有展开，只显示前5个
      if (!this.isExpanded && !this.searchKeyword) {
        return companies.slice(0, 5);
      }

      return companies;
    },

    // 是否有更多数据
    hasMore() {
      return !this.searchKeyword && this.allCompanies.length > 5;
    },
  },

  onLoad() {
    console.log("水费区域选择页面加载");
  },

  methods: {
    // 处理搜索
    handleSearch(e) {
      this.searchKeyword = e.detail.value;
      console.log("搜索关键词:", this.searchKeyword);
    },

    // 切换展开状态
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      console.log("展开状态:", this.isExpanded);
    },

    // 选择水费公司
    selectCompany(company) {
      console.log("选择水费公司:", company);

      // 显示选择确认
      uni.showModal({
        title: "确认选择",
        content: `您选择了：${company.name}\n服务区域：${company.area}\n是否继续进行水费缴费？`,
        confirmText: "继续缴费",
        cancelText: "重新选择",
        success: (res) => {
          if (res.confirm) {
            this.proceedToPayment(company);
          }
        },
      });
    },

    // 进入缴费流程
    proceedToPayment(company) {
      console.log("进入缴费流程:", company);

      // 创建缴费页面或跳转到缴费表单
      this.showPaymentForm(company);
    },

    // 显示缴费表单
    showPaymentForm(company) {
      // 显示输入户号的对话框
      uni.showModal({
        title: `${company.name}`,
        content: "请输入您的水费户号",
        editable: true,
        placeholderText: "请输入户号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.processWaterPayment(company, res.content);
          }
        },
      });
    },

    // 处理水费缴费
    processWaterPayment(company, accountNumber) {
      uni.showLoading({
        title: "查询中...",
      });

      // 模拟查询过程
      setTimeout(() => {
        uni.hideLoading();

        // 生成模拟数据
        const mockData = this.generateMockWaterBill(company, accountNumber);

        // 显示查询结果
        uni.showModal({
          title: "水费查询结果",
          content: `缴费单位：${company.name}\n户号：${accountNumber}\n用户地址：${mockData.address}\n当前欠费：¥${mockData.amount}元\n账期：${mockData.period}\n\n是否立即缴费？`,
          confirmText: "立即缴费",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              this.completeWaterPayment(company, accountNumber, mockData);
            }
          },
        });
      }, 1500);
    },

    // 完成水费缴费
    completeWaterPayment(company, accountNumber, billData) {
      uni.showLoading({
        title: "缴费中...",
      });

      setTimeout(() => {
        uni.hideLoading();

        uni.showModal({
          title: "缴费成功",
          content: `恭喜您！水费缴费成功\n\n缴费单位：${
            company.name
          }\n户号：${accountNumber}\n缴费金额：¥${
            billData.amount
          }元\n交易时间：${new Date().toLocaleString()}\n\n感谢您的使用！`,
          confirmText: "完成",
          showCancel: false,
          success: () => {
            // 缴费成功后返回上一页
            uni.navigateBack({
              delta: 2, // 返回到缴费主页
            });
          },
        });
      }, 2000);
    },

    // 生成模拟账单数据
    generateMockWaterBill(company, accountNumber) {
      const amounts = [45.5, 67.8, 89.3, 123.6, 156.2, 78.9, 92.4];
      const addresses = [
        "XX小区1号楼2单元301",
        "XX花园3号楼1单元201",
        "XX家园5号楼3单元401",
        "XX公寓2号楼2单元101",
        "XX新城4号楼1单元501",
      ];

      const currentDate = new Date();
      const period = `${currentDate.getFullYear()}年${
        currentDate.getMonth() + 1
      }月`;

      return {
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        period: period,
        usage: Math.floor(Math.random() * 50) + 10 + "吨",
      };
    },
  },
};
</script>

<style scoped>
.water-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 位置选择 */
.location-section {
  background: #fff;
  padding: 60rpx 30rpx 20rpx;
  border-bottom: 8rpx solid #f5f7fa;
}

.location-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.location-icon {
  font-size: 24rpx;
}

.location-text {
  font-size: 28rpx;
  color: #333;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 24rpx;
  padding: 12rpx 20rpx;
  gap: 10rpx;
}

.search-icon {
  font-size: 24rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

/* 标题区域 */
.section-title-container {
  background: #fff;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 公司列表 */
.company-list {
  background: #fff;
}

.company-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
}

.company-item:last-child {
  border-bottom: none;
}

.company-item:active {
  background: #f8f9fa;
  transform: scale(0.99);
}

.company-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 1rpx;
  background: #f0f0f0;
}

.company-item:last-child::after {
  display: none;
}

.company-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.company-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.company-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.3;
}

.company-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
}

.arrow-icon {
  font-size: 28rpx;
  color: #999;
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

.company-item:active .arrow-icon {
  transform: rotate(15deg);
}

/* 展开更多按钮 */
.expand-more {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 32rpx;
  margin-top: 20rpx;
  border-radius: 16rpx;
  margin: 20rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.expand-more:active {
  background: #f8f9fa;
  transform: scale(0.98);
}

.expand-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.expand-icon {
  font-size: 24rpx;
  color: #999;
  transition: transform 0.3s ease;
}

.expand-more:active .expand-icon {
  transform: scale(1.2);
}

/* 无搜索结果 */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;
  text-align: center;
}

.no-result-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.no-result-desc {
  font-size: 26rpx;
  color: #ccc;
}

/* 页面加载动画 */
.water-page {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .company-name {
    font-size: 28rpx;
  }

  .company-desc {
    font-size: 24rpx;
  }

  .nav-title {
    font-size: 32rpx;
  }
}

/* 列表项悬停效果 */
.company-item:hover {
  background: #f8f9fa;
}

.company-item:hover .arrow-icon {
  color: #666;
  transform: translateX(4rpx);
}

/* 搜索框焦点效果 */
.search-bar:focus-within {
  background: #fff;
  box-shadow: 0 0 0 2rpx rgba(64, 181, 246, 0.2);
}

/* 加载状态 */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}
</style>

<template>
  <view class="branch-page">
    <!-- 网点搜索 -->
    <view class="search-section">
      <view class="search-bar">
        <view class="search-input-wrapper">
          <text class="search-icon">🔍</text>
          <input 
            class="search-input" 
            placeholder="搜索网点名称或地址" 
            v-model="searchKeyword"
            @input="onSearchInput"
          />
        </view>
        <button class="location-btn" @click="getCurrentLocation">
          <text class="location-icon">📍</text>
        </button>
      </view>
    </view>

    <!-- 网点筛选 -->
    <view class="filter-section">
      <scroll-view class="filter-scroll" scroll-x="true">
        <view class="filter-list">
          <view 
            class="filter-item" 
            :class="{ active: selectedFilter === 'all' }"
            @click="setFilter('all')"
          >
            全部
          </view>
          <view 
            class="filter-item" 
            :class="{ active: selectedFilter === 'nearby' }"
            @click="setFilter('nearby')"
          >
            附近网点
          </view>
          <view 
            class="filter-item" 
            :class="{ active: selectedFilter === 'atm' }"
            @click="setFilter('atm')"
          >
            ATM
          </view>
          <view 
            class="filter-item" 
            :class="{ active: selectedFilter === 'service' }"
            @click="setFilter('service')"
          >
            营业厅
          </view>
          <view 
            class="filter-item" 
            :class="{ active: selectedFilter === '24h' }"
            @click="setFilter('24h')"
          >
            24小时
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 网点列表 -->
    <view class="branch-list">
      <view 
        class="branch-item" 
        v-for="branch in filteredBranches" 
        :key="branch.id"
        @click="onBranchClick(branch)"
      >
        <view class="branch-header">
          <view class="branch-info">
            <text class="branch-name">{{ branch.name }}</text>
            <view class="branch-tags">
              <text 
                class="branch-tag" 
                v-for="tag in branch.tags" 
                :key="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </text>
            </view>
          </view>
          <view class="branch-distance">
            <text class="distance-text">{{ branch.distance }}</text>
          </view>
        </view>
        
        <view class="branch-details">
          <view class="detail-row">
            <text class="detail-icon">📍</text>
            <text class="detail-text">{{ branch.address }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-icon">📞</text>
            <text class="detail-text">{{ branch.phone }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-icon">🕒</text>
            <text class="detail-text">{{ branch.hours }}</text>
          </view>
        </view>

        <view class="branch-services">
          <text class="services-title">服务项目：</text>
          <view class="services-list">
            <text 
              class="service-item" 
              v-for="service in branch.services" 
              :key="service"
            >
              {{ service }}
            </text>
          </view>
        </view>

        <view class="branch-actions">
          <button class="action-btn call" @click.stop="callBranch(branch)">
            <text class="btn-icon">📞</text>
            <text class="btn-text">电话</text>
          </button>
          <button class="action-btn navigate" @click.stop="navigateToBranch(branch)">
            <text class="btn-icon">🧭</text>
            <text class="btn-text">导航</text>
          </button>
          <button class="action-btn detail" @click.stop="showBranchDetail(branch)">
            <text class="btn-icon">ℹ️</text>
            <text class="btn-text">详情</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 网点详情弹窗 -->
    <view class="branch-modal" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedBranch.name }}</text>
          <button class="close-btn" @click="closeModal">✕</button>
        </view>
        
        <view class="modal-body">
          <view class="modal-section">
            <text class="section-title">基本信息</text>
            <view class="info-item">
              <text class="info-label">地址：</text>
              <text class="info-value">{{ selectedBranch.address }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">电话：</text>
              <text class="info-value">{{ selectedBranch.phone }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">营业时间：</text>
              <text class="info-value">{{ selectedBranch.hours }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">距离：</text>
              <text class="info-value">{{ selectedBranch.distance }}</text>
            </view>
          </view>

          <view class="modal-section">
            <text class="section-title">服务项目</text>
            <view class="services-grid">
              <view 
                class="service-card" 
                v-for="service in selectedBranch.services" 
                :key="service"
              >
                <text class="service-name">{{ service }}</text>
              </view>
            </view>
          </view>

          <view class="modal-section">
            <text class="section-title">设施信息</text>
            <view class="facilities-list">
              <view 
                class="facility-item" 
                v-for="facility in selectedBranch.facilities" 
                :key="facility"
              >
                <text class="facility-icon">✅</text>
                <text class="facility-text">{{ facility }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-btn primary" @click="navigateToBranch(selectedBranch)">
            <text class="btn-icon">🧭</text>
            <text class="btn-text">导航前往</text>
          </button>
          <button class="modal-btn secondary" @click="callBranch(selectedBranch)">
            <text class="btn-icon">📞</text>
            <text class="btn-text">拨打电话</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-overlay" v-if="isLoading">
      <view class="loading-content">
        <text class="loading-text">正在加载网点信息...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      selectedFilter: 'all',
      isLoading: false,
      showModal: false,
      selectedBranch: null,
      userLocation: null,
      branches: [
        {
          id: 'b001',
          name: '中国农业银行北京朝阳支行',
          address: '北京市朝阳区建国门外大街1号',
          phone: '010-12345678',
          hours: '周一至周五 9:00-17:00',
          distance: '1.2km',
          tags: ['营业厅', 'ATM', '24小时'],
          services: ['存取款', '转账汇款', '理财咨询', '贷款业务', '外汇兑换'],
          facilities: ['ATM机', '自助终端', 'VIP室', '停车场', '无障碍通道']
        },
        {
          id: 'b002',
          name: '中国农业银行北京海淀支行',
          address: '北京市海淀区中关村大街27号',
          phone: '010-87654321',
          hours: '周一至周五 9:00-17:00，周六 9:00-12:00',
          distance: '2.5km',
          tags: ['营业厅', 'ATM'],
          services: ['存取款', '转账汇款', '理财咨询', '企业服务'],
          facilities: ['ATM机', '自助终端', '停车场']
        },
        {
          id: 'b003',
          name: '中国农业银行北京西城支行',
          address: '北京市西城区金融大街35号',
          phone: '010-11111111',
          hours: '周一至周五 9:00-17:00',
          distance: '3.8km',
          tags: ['营业厅', 'ATM', '24小时'],
          services: ['存取款', '转账汇款', '理财咨询', '贷款业务', '保险业务'],
          facilities: ['ATM机', '自助终端', 'VIP室', '停车场', '无障碍通道', '母婴室']
        },
        {
          id: 'b004',
          name: '中国农业银行北京东城支行',
          address: '北京市东城区王府井大街138号',
          phone: '010-22222222',
          hours: '周一至周五 9:00-17:00，周六日 10:00-16:00',
          distance: '4.2km',
          tags: ['营业厅', 'ATM'],
          services: ['存取款', '转账汇款', '理财咨询'],
          facilities: ['ATM机', '自助终端', '停车场']
        },
        {
          id: 'b005',
          name: '中国农业银行北京丰台支行',
          address: '北京市丰台区丰台路88号',
          phone: '010-33333333',
          hours: '周一至周五 9:00-17:00',
          distance: '5.1km',
          tags: ['营业厅', 'ATM', '24小时'],
          services: ['存取款', '转账汇款', '理财咨询', '贷款业务'],
          facilities: ['ATM机', '自助终端', 'VIP室', '停车场']
        }
      ]
    }
  },

  computed: {
    filteredBranches() {
      let filtered = this.branches

      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(branch => 
          branch.name.toLowerCase().includes(keyword) ||
          branch.address.toLowerCase().includes(keyword)
        )
      }

      // 按筛选条件过滤
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(branch => {
          switch (this.selectedFilter) {
            case 'nearby':
              return parseFloat(branch.distance) <= 3.0
            case 'atm':
              return branch.tags.includes('ATM')
            case 'service':
              return branch.tags.includes('营业厅')
            case '24h':
              return branch.tags.includes('24小时')
            default:
              return true
          }
        })
      }

      return filtered
    }
  },

  onLoad() {
    this.loadBranches()
  },

  methods: {
    // 加载网点数据
    async loadBranches() {
      this.isLoading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('✅ 网点数据加载完成')
      } catch (error) {
        console.error('❌ 加载网点数据失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 搜索输入
    onSearchInput() {
      // 实时搜索，computed会自动更新
    },

    // 设置筛选条件
    setFilter(filter) {
      this.selectedFilter = filter
    },

    // 获取当前位置
    getCurrentLocation() {
      uni.showLoading({
        title: '定位中...'
      })
      
      // 模拟定位
      setTimeout(() => {
        uni.hideLoading()
        this.userLocation = {
          latitude: 39.9042,
          longitude: 116.4074
        }
        uni.showToast({
          title: '定位成功',
          icon: 'success'
        })
        // 自动筛选附近网点
        this.selectedFilter = 'nearby'
      }, 2000)
    },

    // 网点点击
    onBranchClick(branch) {
      this.selectedBranch = branch
      this.showModal = true
    },

    // 显示网点详情
    showBranchDetail(branch) {
      this.selectedBranch = branch
      this.showModal = true
    },

    // 关闭弹窗
    closeModal() {
      this.showModal = false
      this.selectedBranch = null
    },

    // 拨打电话
    callBranch(branch) {
      uni.showModal({
        title: '拨打电话',
        content: `确定要拨打 ${branch.phone} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: branch.phone
            })
          }
        }
      })
    },

    // 导航到网点
    navigateToBranch(branch) {
      uni.showModal({
        title: '导航前往',
        content: `确定要导航到 ${branch.name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 这里可以调用地图导航API
            uni.showToast({
              title: '正在打开导航',
              icon: 'success'
            })
          }
        }
      })
    },

    // 获取标签样式类
    getTagClass(tag) {
      const classMap = {
        '营业厅': 'tag-service',
        'ATM': 'tag-atm',
        '24小时': 'tag-24h'
      }
      return classMap[tag] || 'tag-default'
    }
  }
}
</script>

<style scoped>
.branch-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20rpx;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: white;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 12rpx 16rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #666;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  border: none;
  background: transparent;
}

.location-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12rpx;
  padding: 12rpx 16rpx;
  color: white;
  font-size: 24rpx;
}

.location-icon {
  font-size: 28rpx;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 20rpx;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: flex;
  gap: 16rpx;
  padding: 0 4rpx;
}

.filter-item {
  background: white;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* 网点列表 */
.branch-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.branch-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.branch-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.branch-info {
  flex: 1;
}

.branch-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.branch-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.branch-tag {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  color: white;
}

.tag-service {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.tag-atm {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.tag-24h {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.tag-default {
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
}

.branch-distance {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.branch-details {
  margin-bottom: 16rpx;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.detail-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
  width: 32rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.branch-services {
  margin-bottom: 20rpx;
}

.services-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.service-item {
  background: #f0f0f0;
  color: #666;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
}

.branch-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 24rpx;
  transition: all 0.3s ease;
}

.action-btn.call {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.action-btn.navigate {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.action-btn.detail {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
}

.action-btn:active {
  transform: scale(0.95);
}

.btn-icon {
  font-size: 24rpx;
}

.btn-text {
  font-size: 24rpx;
}

/* 弹窗样式 */
.branch-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32rpx;
  color: #999;
  padding: 8rpx;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx;
}

.modal-section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.info-item {
  display: flex;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.service-card {
  background: #f8f9fa;
  padding: 16rpx;
  border-radius: 12rpx;
  text-align: center;
}

.service-name {
  font-size: 24rpx;
  color: #333;
}

.facilities-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.facility-icon {
  font-size: 24rpx;
  color: #4CAF50;
}

.facility-text {
  font-size: 26rpx;
  color: #333;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1rpx solid #eee;
}

.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.modal-btn:active {
  transform: scale(0.95);
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-content {
  background: white;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
</style>

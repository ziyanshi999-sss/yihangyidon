<template>
  <view class="branch-page">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-bar">
        <view class="search-input-container">
          <text class="search-icon">🔍</text>
          <input 
            class="search-input" 
            v-model="searchKeyword" 
            placeholder="搜索网点名称或地址"
            @input="onSearchInput"
          />
        </view>
        <button class="search-btn" @tap="searchBranches">搜索</button>
      </view>
      
      <!-- 筛选选项 -->
      <view class="filter-section">
        <view class="filter-item" @tap="showDistanceFilter">
          <text class="filter-label">距离</text>
          <text class="filter-value">{{ distanceFilter }}km</text>
          <text class="filter-arrow">▼</text>
        </view>
        <view class="filter-item" @tap="showServiceFilter">
          <text class="filter-label">服务</text>
          <text class="filter-value">{{ serviceFilter }}</text>
          <text class="filter-arrow">▼</text>
        </view>
        <view class="filter-item" @tap="showTimeFilter">
          <text class="filter-label">营业状态</text>
          <text class="filter-value">{{ timeFilter }}</text>
          <text class="filter-arrow">▼</text>
        </view>
      </view>
    </view>

    <!-- 地图和列表切换 -->
    <view class="view-toggle">
      <view 
        class="toggle-item" 
        :class="{ active: currentView === 'map' }"
        @tap="switchView('map')"
      >
        <text class="toggle-icon">🗺️</text>
        <text class="toggle-text">地图</text>
      </view>
      <view 
        class="toggle-item" 
        :class="{ active: currentView === 'list' }"
        @tap="switchView('list')"
      >
        <text class="toggle-icon">📋</text>
        <text class="toggle-text">列表</text>
      </view>
    </view>

    <!-- 地图视图 -->
    <view class="map-container" v-if="currentView === 'map'">
      <map 
        id="myMap"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :scale="scale"
        show-location
        @markertap="onMarkerTap"
        style="width: 100%; height: 100%;"
      ></map>
      
      <!-- 地图配置提示 -->
      <view class="map-tip" v-if="!mapKey">
        <text class="tip-text">地图功能需要配置API密钥</text>
        <text class="tip-desc">当前显示模拟数据</text>
      </view>
      
      <!-- 地图控制按钮 -->
      <view class="map-controls">
        <button class="control-btn" @tap="getLocation">
          <text class="btn-icon">📍</text>
          <text class="btn-text">定位</text>
        </button>
        <button class="control-btn" @tap="searchNearby">
          <text class="btn-icon">🔍</text>
          <text class="btn-text">附近</text>
        </button>
      </view>
    </view>

    <!-- 列表视图 -->
    <view class="list-container" v-if="currentView === 'list'">
      <view class="list-header">
        <text class="list-title">附近网点 ({{ filteredBranches.length }})</text>
        <view class="sort-options">
          <text 
            class="sort-item" 
            :class="{ active: sortBy === 'distance' }"
            @tap="setSortBy('distance')"
          >
            距离
          </text>
          <text 
            class="sort-item" 
            :class="{ active: sortBy === 'name' }"
            @tap="setSortBy('name')"
          >
            名称
          </text>
        </view>
      </view>
      
      <scroll-view class="branch-list" scroll-y>
        <view 
          class="branch-item" 
          v-for="branch in sortedBranches" 
          :key="branch.id"
          @tap="selectBranch(branch)"
        >
          <view class="branch-info">
            <view class="branch-header">
              <text class="branch-name">{{ branch.name }}</text>
              <view class="branch-status" :class="branch.status">
                <text class="status-text">{{ branch.statusText }}</text>
              </view>
            </view>
            <text class="branch-address">{{ branch.address }}</text>
            <view class="branch-details">
              <text class="branch-distance">{{ branch.distance }}m</text>
              <text class="branch-phone">{{ branch.phone }}</text>
            </view>
            <view class="branch-services">
              <text 
                class="service-tag" 
                v-for="service in branch.services" 
                :key="service"
              >
                {{ service }}
              </text>
            </view>
          </view>
          <view class="branch-actions">
            <button class="action-btn" @tap.stop="callBranch(branch)">
              <text class="action-icon">📞</text>
            </button>
            <button class="action-btn" @tap.stop="navigateToBranch(branch)">
              <text class="action-icon">🧭</text>
            </button>
          </view>
        </view>
        
        <view class="empty-state" v-if="filteredBranches.length === 0">
          <text class="empty-icon">🏦</text>
          <text class="empty-text">暂无网点信息</text>
          <text class="empty-desc">请尝试调整搜索条件</text>
        </view>
      </scroll-view>
    </view>

    <!-- 网点详情弹窗 -->
    <view class="branch-detail-modal" v-if="selectedBranch" @tap="closeBranchDetail">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedBranch.name }}</text>
          <text class="modal-close" @tap="closeBranchDetail">×</text>
        </view>
        <view class="modal-body">
          <view class="detail-section">
            <text class="detail-label">地址</text>
            <text class="detail-value">{{ selectedBranch.address }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">电话</text>
            <text class="detail-value">{{ selectedBranch.phone }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">营业时间</text>
            <text class="detail-value">{{ selectedBranch.businessHours }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">服务项目</text>
            <view class="service-list">
              <text 
                class="service-item" 
                v-for="service in selectedBranch.services" 
                :key="service"
              >
                {{ service }}
              </text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn secondary" @tap="callBranch(selectedBranch)">
            <text class="btn-icon">📞</text>
            <text class="btn-text">拨打电话</text>
          </button>
          <button class="modal-btn primary" @tap="navigateToBranch(selectedBranch)">
            <text class="btn-icon">🧭</text>
            <text class="btn-text">导航前往</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view class="filter-modal" v-if="showFilterModal" @tap="closeFilterModal">
      <view class="filter-content" @tap.stop>
        <view class="filter-header">
          <text class="filter-title">{{ currentFilterType }}筛选</text>
          <text class="filter-close" @tap="closeFilterModal">×</text>
        </view>
        <view class="filter-options">
          <view 
            class="filter-option" 
            v-for="option in getFilterOptions()" 
            :key="option.value"
            :class="{ active: isFilterSelected(option.value) }"
            @tap="selectFilterOption(option.value)"
          >
            <text class="option-text">{{ option.label }}</text>
            <text class="option-check" v-if="isFilterSelected(option.value)">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      scale: 14,
      markers: [],
      searchKeyword: '',
      branches: [],
      mapKey: '', // 地图API Key - 需要配置
      
      // 新增数据
      currentView: 'map', // 'map' 或 'list'
      selectedBranch: null,
      sortBy: 'distance', // 'distance' 或 'name'
      
      // 筛选相关
      distanceFilter: 3,
      serviceFilter: '全部',
      timeFilter: '全部',
      showFilterModal: false,
      currentFilterType: '距离',
      
      // 模拟网点数据
      mockBranches: [
        {
          id: 1,
          name: '中国农业银行上海陆家嘴支行',
          address: '上海市浦东新区陆家嘴环路1000号',
          latitude: 31.2397,
          longitude: 121.4999,
          phone: '021-58888888',
          businessHours: '周一至周五 9:00-17:00',
          status: 'open',
          statusText: '营业中',
          services: ['存取款', '理财', '贷款', '外汇'],
          distance: 0
        },
        {
          id: 2,
          name: '中国农业银行上海外滩支行',
          address: '上海市黄浦区中山东一路1号',
          latitude: 31.2397,
          longitude: 121.4900,
          phone: '021-58888889',
          businessHours: '周一至周五 9:00-17:00',
          status: 'open',
          statusText: '营业中',
          services: ['存取款', '理财', '企业服务'],
          distance: 0
        },
        {
          id: 3,
          name: '中国农业银行上海徐家汇支行',
          address: '上海市徐汇区漕溪北路88号',
          latitude: 31.1997,
          longitude: 121.4399,
          phone: '021-58888890',
          businessHours: '周一至周五 9:00-17:00',
          status: 'closed',
          statusText: '已关闭',
          services: ['存取款', '理财'],
          distance: 0
        },
        {
          id: 4,
          name: '中国农业银行上海静安支行',
          address: '上海市静安区南京西路1376号',
          latitude: 31.2297,
          longitude: 121.4499,
          phone: '021-58888891',
          businessHours: '周一至周五 9:00-17:00',
          status: 'open',
          statusText: '营业中',
          services: ['存取款', '理财', '贷款', '外汇', '企业服务'],
          distance: 0
        },
        {
          id: 5,
          name: '中国农业银行上海虹桥支行',
          address: '上海市长宁区虹桥路1号',
          latitude: 31.2097,
          longitude: 121.4099,
          phone: '021-58888892',
          businessHours: '周一至周五 9:00-17:00',
          status: 'open',
          statusText: '营业中',
          services: ['存取款', '理财', '贷款'],
          distance: 0
        }
      ]
    }
  },
  onLoad() {
    console.log('网点查询页面加载');
    // 先尝试获取位置，如果失败会自动设置默认位置并加载网点数据
    this.getLocation();
  },
  
  computed: {
    // 筛选后的网点列表
    filteredBranches() {
      let filtered = this.branches;
      
      // 按关键词筛选
      if (this.searchKeyword) {
        filtered = filtered.filter(branch => 
          branch.name.includes(this.searchKeyword) || 
          branch.address.includes(this.searchKeyword)
        );
      }
      
      // 按距离筛选
      if (this.distanceFilter !== '全部') {
        const maxDistance = this.distanceFilter * 1000; // 转换为米
        filtered = filtered.filter(branch => branch.distance <= maxDistance);
      }
      
      // 按服务筛选
      if (this.serviceFilter !== '全部') {
        filtered = filtered.filter(branch => 
          branch.services.includes(this.serviceFilter)
        );
      }
      
      // 按营业状态筛选
      if (this.timeFilter !== '全部') {
        if (this.timeFilter === '营业中') {
          filtered = filtered.filter(branch => branch.status === 'open');
        } else if (this.timeFilter === '已关闭') {
          filtered = filtered.filter(branch => branch.status === 'closed');
        }
      }
      
      return filtered;
    },
    
    // 排序后的网点列表
    sortedBranches() {
      const sorted = [...this.filteredBranches];
      if (this.sortBy === 'distance') {
        return sorted.sort((a, b) => a.distance - b.distance);
      } else if (this.sortBy === 'name') {
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      }
      return sorted;
    }
  },
  
  methods: {
    // 获取用户位置
    getLocation() {
      // 检查是否支持位置服务
      if (!uni.getLocation) {
        console.warn('当前环境不支持位置服务');
        this.setDefaultLocation();
        return;
      }

      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          // 清空旧标记点并添加新的当前位置标记
          this.markers = [{
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            title: '当前位置',
            iconPath: '/static/logo.png',
            width: 30,
            height: 30
          }];
          console.log('获取位置成功:', res.latitude, res.longitude);
          
          // 位置获取成功后加载网点数据
          this.loadMockBranches();
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          uni.showToast({
            title: '无法获取位置，使用默认位置',
            icon: 'none',
            duration: 2000
          });
          // 设置默认位置
          this.setDefaultLocation();
        }
      });
    },
    
    // 设置默认位置（当无法获取用户位置时使用）
    setDefaultLocation() {
      // 设置为上海的位置（与模拟数据匹配）
      this.latitude = 31.2397;
      this.longitude = 121.4999;
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        title: '默认位置（上海）',
        iconPath: '/static/logo.png',
        width: 30,
        height: 30
      }];
      
      // 设置默认位置后加载网点数据
      this.loadMockBranches();
    },
    
    // 搜索附近网点
    searchNearby() {
      if (!this.latitude || !this.longitude) {
        uni.showToast({
          title: '请先定位',
          icon: 'none'
        });
        return;
      }
      
      // 如果没有配置地图API Key，使用模拟数据
      if (!this.mapKey) {
        console.log('使用模拟网点数据');
        this.loadMockBranches();
        uni.showToast({
          title: '已加载附近网点',
          icon: 'success',
          duration: 1500
        });
        return;
      }
      
      const location = `${this.latitude},${this.longitude}`;
      const radius = 3000; // 搜索半径3公里
      
      uni.request({
        url: `https://apis.map.qq.com/ws/place/v1/search`,
        data: {
          key: this.mapKey,
          keyword: '农业银行', // 搜索关键词
          boundary: `nearby(${location},${radius})`,
          filter: 'category=银行',
          page_size: 20
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.status === 0) {
            console.log('搜索成功:', res.data);
            // 处理搜索结果
            this.branches = res.data.data.map(item => ({
              id: item.id || Date.now() + Math.random(), // 确保有id
              name: item.title || '未知网点',
              address: item.address || '地址未知',
              latitude: item.location?.lat || 0,
              longitude: item.location?.lng || 0,
              distance: this.calculateDistance(
                this.latitude, 
                this.longitude, 
                item.location?.lat || 0, 
                item.location?.lng || 0
              )
            }));
            this.setMarkers();
          } else {
            console.error('搜索失败:', res.data);
            // 搜索失败时使用模拟数据
            this.loadMockBranches();
            uni.showToast({ 
              title: '使用模拟数据', 
              icon: 'none',
              duration: 1500
            });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          // 网络失败时使用模拟数据
          this.loadMockBranches();
          uni.showToast({ 
            title: '网络异常，使用模拟数据', 
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    
    // 设置地图标记点
    setMarkers() {
      try {
        // 先保留当前位置标记
        const currentLocationMarker = this.markers && this.markers[0] ? this.markers[0] : null;
        
        // 添加网点标记
        const branchMarkers = this.branches.map((branch, index) => ({
          id: index + 1, // 确保id唯一
          latitude: branch.latitude || 0,
          longitude: branch.longitude || 0,
          title: branch.name || '未知网点',
          iconPath: '/static/logo.png',
          width: 24,
          height: 24
        }));
        
        // 合并标记点
        this.markers = currentLocationMarker ? [currentLocationMarker, ...branchMarkers] : branchMarkers;
        
        console.log('设置地图标记点成功:', this.markers.length);
      } catch (error) {
        console.error('设置地图标记点失败:', error);
        // 设置默认标记点
        this.markers = [{
          id: 0,
          latitude: this.latitude || 31.2397,
          longitude: this.longitude || 121.4999,
          title: '当前位置',
          iconPath: '/static/logo.png',
          width: 30,
          height: 30
        }];
      }
    },
    
    // 计算两点间距离（简化版）
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // 地球半径（公里）
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // 距离（公里）
      return (distance * 1000).toFixed(0); // 转换为米并取整
    },
    
    // 角度转弧度
    deg2rad(deg) {
      return deg * (Math.PI/180);
    },
    
    // 加载模拟网点数据
    loadMockBranches() {
      this.branches = this.mockBranches.map(branch => ({
        ...branch,
        distance: this.calculateDistance(
          this.latitude, 
          this.longitude, 
          branch.latitude, 
          branch.longitude
        )
      }));
      this.setMarkers();
    },
    
    // 搜索输入处理
    onSearchInput() {
      // 实时搜索，可以添加防抖处理
      this.searchBranches();
    },
    
    // 搜索网点
    searchBranches() {
      if (!this.searchKeyword.trim()) {
        this.loadMockBranches();
        return;
      }
      
      // 这里可以调用真实的搜索API
      // 目前使用模拟数据
      const filtered = this.mockBranches.filter(branch => 
        branch.name.includes(this.searchKeyword) || 
        branch.address.includes(this.searchKeyword)
      );
      
      this.branches = filtered.map(branch => ({
        ...branch,
        distance: this.calculateDistance(
          this.latitude, 
          this.longitude, 
          branch.latitude, 
          branch.longitude
        )
      }));
      this.setMarkers();
    },
    
    // 切换视图
    switchView(view) {
      this.currentView = view;
    },
    
    // 设置排序方式
    setSortBy(sortBy) {
      this.sortBy = sortBy;
    },
    
    // 选择网点
    selectBranch(branch) {
      this.selectedBranch = branch;
    },
    
    // 关闭网点详情
    closeBranchDetail() {
      this.selectedBranch = null;
    },
    
    // 拨打电话
    callBranch(branch) {
      uni.makePhoneCall({
        phoneNumber: branch.phone,
        success: () => {
          console.log('拨打电话成功');
        },
        fail: (err) => {
          console.error('拨打电话失败:', err);
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 导航到网点
    navigateToBranch(branch) {
      // 这里可以调用地图导航API
      uni.showModal({
        title: '导航提示',
        content: `是否要导航到${branch.name}？`,
        success: (res) => {
          if (res.confirm) {
            // 实际项目中可以调用地图导航
            uni.showToast({
              title: '正在打开导航...',
              icon: 'none'
            });
          }
        }
      });
    },
    
    // 地图标记点击
    onMarkerTap(e) {
      try {
        const markerId = e.detail?.markerId;
        if (markerId > 0 && this.branches && this.branches.length > 0) {
          const branch = this.branches[markerId - 1];
          if (branch && branch.id) {
            this.selectBranch(branch);
          }
        }
      } catch (error) {
        console.error('地图标记点击处理失败:', error);
      }
    },
    
    // 显示距离筛选
    showDistanceFilter() {
      this.currentFilterType = '距离';
      this.showFilterModal = true;
    },
    
    // 显示服务筛选
    showServiceFilter() {
      this.currentFilterType = '服务';
      this.showFilterModal = true;
    },
    
    // 显示时间筛选
    showTimeFilter() {
      this.currentFilterType = '营业状态';
      this.showFilterModal = true;
    },
    
    // 关闭筛选弹窗
    closeFilterModal() {
      this.showFilterModal = false;
    },
    
    // 获取筛选选项
    getFilterOptions() {
      switch (this.currentFilterType) {
        case '距离':
          return [
            { label: '1km内', value: 1 },
            { label: '3km内', value: 3 },
            { label: '5km内', value: 5 },
            { label: '10km内', value: 10 }
          ];
        case '服务':
          return [
            { label: '全部', value: '全部' },
            { label: '存取款', value: '存取款' },
            { label: '理财', value: '理财' },
            { label: '贷款', value: '贷款' },
            { label: '外汇', value: '外汇' },
            { label: '企业服务', value: '企业服务' }
          ];
        case '营业状态':
          return [
            { label: '全部', value: '全部' },
            { label: '营业中', value: '营业中' },
            { label: '已关闭', value: '已关闭' }
          ];
        default:
          return [];
      }
    },
    
    // 检查筛选选项是否被选中
    isFilterSelected(value) {
      switch (this.currentFilterType) {
        case '距离':
          return this.distanceFilter === value;
        case '服务':
          return this.serviceFilter === value;
        case '营业状态':
          return this.timeFilter === value;
        default:
          return false;
      }
    },
    
    // 选择筛选选项
    selectFilterOption(value) {
      switch (this.currentFilterType) {
        case '距离':
          this.distanceFilter = value;
          break;
        case '服务':
          this.serviceFilter = value;
          break;
        case '营业状态':
          this.timeFilter = value;
          break;
      }
      this.closeFilterModal();
    }
  }
}
</script>

<style scoped>
.branch-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 搜索栏 */
.search-section {
  background: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #999;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  background: transparent;
  border: none;
}

.search-btn {
  background: #20c997;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 0 30rpx;
  height: 80rpx;
  font-size: 28rpx;
  font-weight: 500;
}

/* 筛选选项 */
.filter-section {
  display: flex;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e5e5e5;
}

.filter-label {
  font-size: 24rpx;
  color: #666;
}

.filter-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.filter-arrow {
  font-size: 20rpx;
  color: #999;
  margin-left: 8rpx;
}

/* 视图切换 */
.view-toggle {
  display: flex;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.toggle-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.toggle-item.active {
  background: #20c997;
  color: #fff;
}

.toggle-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.toggle-text {
  font-size: 24rpx;
  font-weight: 500;
}

/* 地图容器 */
.map-container {
  height: 60vh;
  position: relative;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 地图提示 */
.map-tip {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 16rpx 20rpx;
  border-radius: 8rpx;
  z-index: 100;
}

.tip-text {
  display: block;
  font-size: 24rpx;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.tip-desc {
  display: block;
  font-size: 20rpx;
  opacity: 0.8;
}

.map-controls {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8rpx;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 24rpx;
}

.btn-text {
  font-size: 20rpx;
  color: #333;
}

/* 列表容器 */
.list-container {
  margin: 0 20rpx 20rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.sort-options {
  display: flex;
  gap: 20rpx;
}

.sort-item {
  font-size: 24rpx;
  color: #666;
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  transition: all 0.3s ease;
}

.sort-item.active {
  background: #20c997;
  color: #fff;
}

/* 网点列表 */
.branch-list {
  max-height: 60vh;
}

.branch-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.branch-item:active {
  background: #f8f9fa;
}

.branch-info {
  flex: 1;
}

.branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.branch-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.branch-status {
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
}

.branch-status.open {
  background: #d4edda;
  color: #155724;
}

.branch-status.closed {
  background: #f8d7da;
  color: #721c24;
}

.branch-address {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.branch-details {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.branch-distance {
  font-size: 24rpx;
  color: #20c997;
  font-weight: 500;
}

.branch-phone {
  font-size: 24rpx;
  color: #666;
}

.branch-services {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.service-tag {
  background: #e9ecef;
  color: #495057;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.branch-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-left: 20rpx;
}

.action-btn {
  background: #f8f9fa;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:active {
  background: #e9ecef;
  transform: scale(0.95);
}

.action-icon {
  font-size: 24rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #999;
}

/* 网点详情弹窗 */
.branch-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  font-weight: 300;
}

.modal-body {
  padding: 30rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30rpx;
}

.detail-label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.service-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.service-item {
  background: #e9ecef;
  color: #495057;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #e5e5e5;
}

.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: #20c997;
  color: #fff;
}

.modal-btn.secondary {
  background: #f8f9fa;
  color: #333;
  border: 1rpx solid #e5e5e5;
}

.modal-btn:active {
  transform: scale(0.98);
}

/* 筛选弹窗 */
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.filter-content {
  background: #fff;
  border-radius: 20rpx;
  width: 80%;
  max-width: 500rpx;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.filter-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.filter-close {
  font-size: 40rpx;
  color: #999;
  font-weight: 300;
}

.filter-options {
  max-height: 60vh;
  overflow-y: auto;
}

.filter-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.filter-option:active {
  background: #f8f9fa;
}

.filter-option.active {
  background: #e8f5e8;
}

.option-text {
  font-size: 28rpx;
  color: #333;
}

.option-check {
  font-size: 24rpx;
  color: #20c997;
  font-weight: 600;
}

/* 动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .search-bar {
    flex-direction: column;
    gap: 16rpx;
  }
  
  .search-input-container {
    width: 100%;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 16rpx;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .filter-content {
    width: 90%;
  }
}
</style>
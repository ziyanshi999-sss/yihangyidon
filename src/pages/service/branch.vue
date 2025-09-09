<template>
  <view class="branch-container">
    <view class="map-section">
      <!-- 腾讯地图组件 -->
      <map
        id="myMap"
        ref="mapRef"
        :latitude="latitude"
        :longitude="longitude"
        :scale="14"
        :markers="markers"
        :show-location="true"
        @markertap="handleMarkerTap"
        style="width: 100%; height: 500rpx;"
      ></map>
    </view>
    
    <view class="search-section">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          placeholder="请输入网点名称或地址"
          v-model="searchKeyword"
          @input="handleSearch"
        />
      </view>
    </view>
    
    <view class="branches-section">
      <view class="section-title">附近网点</view>
      <view class="branches-list">
        <view 
          class="branch-item" 
          v-for="branch in branches" 
          :key="branch.id"
          @tap="navigateToBranch(branch)"
        >
          <view class="branch-name">{{ branch.name }}</view>
          <view class="branch-address">{{ branch.address }}</view>
          <view class="branch-distance">{{ branch.distance }}米</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 39.9042, // 默认北京纬度
      longitude: 116.4074, // 默认北京经度
      scale: 14,
      markers: [],
      searchKeyword: '',
      branches: []
    }
  },
  onLoad() {
    console.log('网点查询页面加载');
    this.getLocation();
  },
  methods: {
    // 获取当前位置
    getLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.loadNearbyBranches();
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          });
        }
      });
    },
    
    // 加载附近网点
    loadNearbyBranches() {
      // 这里应该调用API获取附近网点，现在使用模拟数据
      this.branches = [
        {
          id: 1,
          name: '中国农业银行北京市分行',
          address: '北京市西城区金融大街甲27号',
          latitude: this.latitude + 0.01,
          longitude: this.longitude + 0.01,
          distance: '500'
        },
        {
          id: 2,
          name: '中国农业银行北京西单支行',
          address: '北京市西城区西单北大街109号',
          latitude: this.latitude - 0.01,
          longitude: this.longitude + 0.02,
          distance: '800'
        },
        {
          id: 3,
          name: '中国农业银行北京王府井支行',
          address: '北京市东城区王府井大街138号',
          latitude: this.latitude + 0.02,
          longitude: this.longitude - 0.01,
          distance: '1200'
        }
      ];
      
      // 设置地图标记
      this.setMarkers();
    },
    
    // 设置地图标记
    setMarkers() {
      this.markers = this.branches.map((branch, index) => ({
        id: branch.id,
        latitude: branch.latitude,
        longitude: branch.longitude,
        title: branch.name,
        iconPath: '/static/map-marker.png', // 可以使用自定义图标
        width: 30,
        height: 30
      }));
    },
    
    // 处理标记点点击
    handleMarkerTap(e) {
      const markerId = e.markerId;
      const branch = this.branches.find(b => b.id === markerId);
      if (branch) {
        uni.showModal({
          title: branch.name,
          content: branch.address + '\n距离：' + branch.distance + '米',
          confirmText: '导航',
          success: (res) => {
            if (res.confirm) {
              this.navigateToBranch(branch);
            }
          }
        });
      }
    },
    
    // 导航到网点
    navigateToBranch(branch) {
      // 调用腾讯地图导航
      uni.openLocation({
        latitude: branch.latitude,
        longitude: branch.longitude,
        name: branch.name,
        address: branch.address,
        scale: 18
      });
    },
    
    // 处理搜索
    handleSearch() {
      // 这里应该实现搜索逻辑
      console.log('搜索关键词:', this.searchKeyword);
      // 实际项目中应该调用搜索API
    }
  }
}
</script>

<style scoped>
.branch-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.map-section {
  width: 100%;
}

.search-section {
  padding: 20rpx;
  background-color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 60rpx;
  padding: 0 24rpx;
  height: 80rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #999;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  height: 100%;
  background-color: transparent;
  font-size: 28rpx;
}

.branches-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.branches-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.branch-item {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
}

.branch-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.branch-address {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.branch-distance {
  font-size: 22rpx;
  color: #999;
}
</style>
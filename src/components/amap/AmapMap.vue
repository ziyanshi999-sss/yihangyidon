<template>
  <view class="amap-container">
    <!-- 地图容器 -->
    <view class="map-wrapper">
      <map
        id="amap"
        class="amap"
        :latitude="mapConfig.center.latitude"
        :longitude="mapConfig.center.longitude"
        :scale="mapConfig.zoom"
        :markers="markers"
        :polyline="polylines"
        :show-location="mapConfig.showUserLocation"
        :show-compass="mapConfig.showCompass"
        :show-scale="mapConfig.showScale"
        @markertap="onMarkerTap"
        @regionchange="onRegionChange"
        @tap="onMapTap"
      >
        <!-- 自定义标记点 -->
        <cover-view class="custom-marker" v-for="marker in customMarkers" :key="marker.id">
          <cover-image :src="marker.icon" class="marker-icon" />
          <cover-view class="marker-label">{{ marker.title }}</cover-view>
        </cover-view>
      </map>
    </view>

    <!-- 地图控制面板 -->
    <view class="map-controls">
      <!-- 定位按钮 -->
      <button class="control-btn location-btn" @click="getCurrentLocation">
        <text class="btn-icon">📍</text>
      </button>
      
      <!-- 缩放控制 -->
      <view class="zoom-controls">
        <button class="control-btn zoom-btn" @click="zoomIn">
          <text class="btn-icon">+</text>
        </button>
        <button class="control-btn zoom-btn" @click="zoomOut">
          <text class="btn-icon">-</text>
        </button>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-bar" v-if="showSearch">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索地点" 
          v-model="searchKeyword"
          @confirm="onSearch"
        />
        <button class="search-btn" @click="onSearch">搜索</button>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="searchResults.length > 0">
      <view 
        class="result-item" 
        v-for="result in searchResults" 
        :key="result.id"
        @click="selectSearchResult(result)"
      >
        <view class="result-info">
          <text class="result-name">{{ result.name }}</text>
          <text class="result-address">{{ result.address }}</text>
        </view>
        <view class="result-distance" v-if="result.distance">
          <text class="distance-text">{{ result.distance }}</text>
        </view>
      </view>
    </view>

    <!-- 底部信息面板 -->
    <view class="info-panel" v-if="selectedMarker">
      <view class="panel-header">
        <text class="panel-title">{{ selectedMarker.title }}</text>
        <button class="close-btn" @click="closeInfoPanel">✕</button>
      </view>
      <view class="panel-content">
        <view class="info-item">
          <text class="info-label">地址：</text>
          <text class="info-value">{{ selectedMarker.address }}</text>
        </view>
        <view class="info-item" v-if="selectedMarker.phone">
          <text class="info-label">电话：</text>
          <text class="info-value">{{ selectedMarker.phone }}</text>
        </view>
        <view class="info-item" v-if="selectedMarker.distance">
          <text class="info-label">距离：</text>
          <text class="info-value">{{ selectedMarker.distance }}</text>
        </view>
      </view>
      <view class="panel-actions">
        <button class="action-btn primary" @click="navigateToMarker">
          <text class="btn-icon">🧭</text>
          <text class="btn-text">导航</text>
        </button>
        <button class="action-btn secondary" @click="callMarker" v-if="selectedMarker.phone">
          <text class="btn-icon">📞</text>
          <text class="btn-text">电话</text>
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-overlay" v-if="isLoading">
      <view class="loading-content">
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import amapUtils from '../../config/amap.js'

export default {
  name: 'AmapMap',
  props: {
    // 初始中心点
    initialCenter: {
      type: Object,
      default: () => ({
        latitude: 39.9042,
        longitude: 116.4074
      })
    },
    // 初始缩放级别
    initialZoom: {
      type: Number,
      default: 15
    },
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    },
    // 是否显示用户位置
    showUserLocation: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      // 地图配置
      mapConfig: {
        center: this.initialCenter,
        zoom: this.initialZoom,
        showUserLocation: this.showUserLocation,
        showCompass: true,
        showScale: true
      },
      
      // 标记点
      markers: [],
      customMarkers: [],
      
      // 路径线
      polylines: [],
      
      // 搜索相关
      searchKeyword: '',
      searchResults: [],
      
      // 选中的标记点
      selectedMarker: null,
      
      // 加载状态
      isLoading: false,
      loadingText: '加载中...',
      
      // 用户位置
      userLocation: null
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    // 初始化地图
    async initMap() {
      try {
        this.isLoading = true
        this.loadingText = '正在初始化地图...'
        
        // 获取用户位置
        await this.getCurrentLocation()
        
        // 搜索附近的银行
        await this.searchNearbyBanks()
        
        console.log('✅ 地图初始化完成')
      } catch (error) {
        console.error('❌ 地图初始化失败:', error)
        uni.showToast({
          title: '地图初始化失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 获取当前位置
    async getCurrentLocation() {
      try {
        this.isLoading = true
        this.loadingText = '正在获取位置...'
        
        uni.getLocation({
          type: 'gcj02',
          success: async (res) => {
            console.log('✅ 获取位置成功:', res)
            this.userLocation = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            
            // 更新地图中心点
            this.mapConfig.center = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            
            // 添加用户位置标记
            this.addUserLocationMarker()
            
            // 逆地理编码获取地址
            await this.getAddressFromLocation(res.longitude, res.latitude)
          },
          fail: (error) => {
            console.error('❌ 获取位置失败:', error)
            uni.showToast({
              title: '获取位置失败',
              icon: 'error'
            })
          }
        })
      } catch (error) {
        console.error('❌ 获取位置异常:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 添加用户位置标记
    addUserLocationMarker() {
      if (!this.userLocation) return
      
      const userMarker = {
        id: 'user_location',
        latitude: this.userLocation.latitude,
        longitude: this.userLocation.longitude,
        iconPath: '/static/map/user-location.png',
        width: 30,
        height: 30,
        title: '我的位置',
        callout: {
          content: '我的位置',
          color: '#333',
          fontSize: 12,
          borderRadius: 4,
          bgColor: '#fff',
          padding: 4
        }
      }
      
      this.markers.push(userMarker)
    },

    // 根据坐标获取地址
    async getAddressFromLocation(longitude, latitude) {
      try {
        const result = await amapUtils.regeocode(longitude, latitude)
        if (result.regeocode && result.regeocode.formatted_address) {
          console.log('✅ 地址解析成功:', result.regeocode.formatted_address)
        }
      } catch (error) {
        console.error('❌ 地址解析失败:', error)
      }
    },

    // 搜索附近的银行
    async searchNearbyBanks() {
      if (!this.userLocation) return
      
      try {
        this.isLoading = true
        this.loadingText = '正在搜索附近银行...'
        
        const result = await amapUtils.searchAround(
          this.userLocation.longitude,
          this.userLocation.latitude,
          '银行|ATM|金融服务',
          5000
        )
        
        if (result.pois && result.pois.length > 0) {
          this.addBankMarkers(result.pois)
          console.log('✅ 银行搜索成功:', result.pois.length, '个结果')
        }
      } catch (error) {
        console.error('❌ 银行搜索失败:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 添加银行标记点
    addBankMarkers(pois) {
      const bankMarkers = pois.map((poi, index) => ({
        id: `bank_${index}`,
        latitude: parseFloat(poi.location.split(',')[1]),
        longitude: parseFloat(poi.location.split(',')[0]),
        iconPath: '/static/map/bank-marker.png',
        width: 25,
        height: 25,
        title: poi.name,
        address: poi.address,
        phone: poi.tel,
        distance: poi.distance ? `${Math.round(poi.distance)}m` : '',
        callout: {
          content: poi.name,
          color: '#333',
          fontSize: 12,
          borderRadius: 4,
          bgColor: '#fff',
          padding: 4
        }
      }))
      
      this.markers = [...this.markers, ...bankMarkers]
    },

    // 搜索地点
    async onSearch() {
      if (!this.searchKeyword.trim()) return
      
      try {
        this.isLoading = true
        this.loadingText = '正在搜索...'
        
        const result = await amapUtils.searchText(this.searchKeyword)
        
        if (result.pois && result.pois.length > 0) {
          this.searchResults = result.pois.map((poi, index) => ({
            id: `search_${index}`,
            name: poi.name,
            address: poi.address,
            latitude: parseFloat(poi.location.split(',')[1]),
            longitude: parseFloat(poi.location.split(',')[0]),
            distance: poi.distance ? `${Math.round(poi.distance)}m` : ''
          }))
          
          console.log('✅ 搜索成功:', this.searchResults.length, '个结果')
        } else {
          this.searchResults = []
          uni.showToast({
            title: '未找到相关地点',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 搜索失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 选择搜索结果
    selectSearchResult(result) {
      // 移动地图到选中位置
      this.mapConfig.center = {
        latitude: result.latitude,
        longitude: result.longitude
      }
      
      // 添加标记点
      const marker = {
        id: result.id,
        latitude: result.latitude,
        longitude: result.longitude,
        iconPath: '/static/map/search-marker.png',
        width: 25,
        height: 25,
        title: result.name,
        address: result.address,
        distance: result.distance
      }
      
      this.markers.push(marker)
      this.selectedMarker = marker
      
      // 清空搜索结果
      this.searchResults = []
    },

    // 标记点点击事件
    onMarkerTap(e) {
      const markerId = e.detail.markerId
      const marker = this.markers.find(m => m.id === markerId)
      
      if (marker) {
        this.selectedMarker = marker
        console.log('📍 点击标记点:', marker.title)
      }
    },

    // 地图点击事件
    onMapTap(e) {
      // 点击地图空白区域关闭信息面板
      if (this.selectedMarker) {
        this.selectedMarker = null
      }
    },

    // 地图区域变化事件
    onRegionChange(e) {
      if (e.type === 'end') {
        console.log('🗺️ 地图区域变化:', e.detail)
      }
    },

    // 放大
    zoomIn() {
      if (this.mapConfig.zoom < 20) {
        this.mapConfig.zoom += 1
      }
    },

    // 缩小
    zoomOut() {
      if (this.mapConfig.zoom > 3) {
        this.mapConfig.zoom -= 1
      }
    },

    // 导航到标记点
    async navigateToMarker() {
      if (!this.selectedMarker || !this.userLocation) return
      
      try {
        this.isLoading = true
        this.loadingText = '正在规划路线...'
        
        const result = await amapUtils.getDirection(
          this.userLocation.longitude,
          this.userLocation.latitude,
          this.selectedMarker.longitude,
          this.selectedMarker.latitude
        )
        
        if (result.route && result.route.paths && result.route.paths.length > 0) {
          const path = result.route.paths[0]
          this.drawRoute(path.steps)
          
          uni.showModal({
            title: '导航信息',
            content: `距离：${Math.round(path.distance)}米\n预计时间：${Math.round(path.duration / 60)}分钟`,
            showCancel: false
          })
        }
      } catch (error) {
        console.error('❌ 路径规划失败:', error)
        uni.showToast({
          title: '路径规划失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 绘制路线
    drawRoute(steps) {
      const points = []
      
      steps.forEach(step => {
        const coords = step.polyline.split(';')
        coords.forEach(coord => {
          const [lng, lat] = coord.split(',')
          points.push({
            latitude: parseFloat(lat),
            longitude: parseFloat(lng)
          })
        })
      })
      
      this.polylines = [{
        points: points,
        color: '#007AFF',
        width: 4,
        dottedLine: false
      }]
    },

    // 拨打电话
    callMarker() {
      if (!this.selectedMarker || !this.selectedMarker.phone) return
      
      uni.makePhoneCall({
        phoneNumber: this.selectedMarker.phone
      })
    },

    // 关闭信息面板
    closeInfoPanel() {
      this.selectedMarker = null
    }
  }
}
</script>

<style scoped>
.amap-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

.amap {
  width: 100%;
  height: 100%;
}

/* 地图控制面板 */
.map-controls {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.control-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: white;
  border: 1rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  font-size: 32rpx;
  color: #333;
}

.control-btn:active {
  transform: scale(0.95);
}

.location-btn {
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
  border: none;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.zoom-btn {
  width: 60rpx;
  height: 60rpx;
  font-size: 28rpx;
  font-weight: bold;
}

/* 搜索框 */
.search-bar {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  right: 20rpx;
  z-index: 100;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
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

.search-btn {
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 12rpx 20rpx;
  font-size: 24rpx;
}

/* 搜索结果 */
.search-results {
  position: absolute;
  top: 120rpx;
  left: 20rpx;
  right: 20rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  max-height: 400rpx;
  overflow-y: auto;
  z-index: 100;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-info {
  flex: 1;
}

.result-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.result-address {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.result-distance {
  margin-left: 16rpx;
}

.distance-text {
  font-size: 22rpx;
  color: #007AFF;
  background: #f0f8ff;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

/* 信息面板 */
.info-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.panel-title {
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

.panel-content {
  padding: 24rpx;
}

.info-item {
  display: flex;
  margin-bottom: 16rpx;
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

.panel-actions {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
}

.action-btn.primary {
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-icon {
  font-size: 24rpx;
}

.btn-text {
  font-size: 26rpx;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

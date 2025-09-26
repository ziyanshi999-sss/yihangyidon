<template>
  <view class="map-page">
    <!-- 顶部导航栏 -->
    <view class="header-section">
      <view class="header-content">
        <button class="back-btn" @tap="goBack">
          <text class="back-icon">←</text>
        </button>
        <text class="page-title">我的地图</text>
        <button class="menu-btn" @tap="showMenu">
          <text class="menu-icon">⋯</text>
        </button>
      </view>
    </view>

    <!-- 高德地图组件 -->
    <AmapMap 
      :initial-center="mapCenter"
      :initial-zoom="mapZoom"
      :show-search="true"
      :show-user-location="true"
      @marker-tap="onMarkerTap"
      @search-result="onSearchResult"
    />

    <!-- 底部功能栏 -->
    <view class="bottom-bar">
      <view class="function-grid">
        <view class="function-item" @click="searchNearbyBanks">
          <view class="function-icon bank">🏦</view>
          <text class="function-text">附近银行</text>
        </view>
        <view class="function-item" @click="searchATMs">
          <view class="function-icon atm">🏧</view>
          <text class="function-text">ATM机</text>
        </view>
        <view class="function-item" @click="searchGasStations">
          <view class="function-icon gas">⛽</view>
          <text class="function-text">加油站</text>
        </view>
        <view class="function-item" @click="searchRestaurants">
          <view class="function-icon restaurant">🍽️</view>
          <text class="function-text">餐厅</text>
        </view>
      </view>
    </view>

    <!-- 搜索建议弹窗 -->
    <view class="search-suggestions" v-if="showSuggestions">
      <view class="suggestion-header">
        <text class="suggestion-title">搜索建议</text>
        <button class="close-btn" @click="closeSuggestions">✕</button>
      </view>
      <view class="suggestion-list">
        <view 
          class="suggestion-item" 
          v-for="suggestion in searchSuggestions" 
          :key="suggestion.id"
          @click="selectSuggestion(suggestion)"
        >
          <text class="suggestion-text">{{ suggestion.name }}</text>
          <text class="suggestion-arrow">→</text>
        </view>
      </view>
    </view>

    <!-- 路线规划面板 -->
    <view class="route-panel" v-if="showRoutePanel">
      <view class="panel-header">
        <text class="panel-title">路线规划</text>
        <button class="close-btn" @click="closeRoutePanel">✕</button>
      </view>
      <view class="route-info">
        <view class="route-item">
          <text class="route-label">起点：</text>
          <text class="route-value">{{ routeInfo.origin }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">终点：</text>
          <text class="route-value">{{ routeInfo.destination }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">距离：</text>
          <text class="route-value">{{ routeInfo.distance }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">预计时间：</text>
          <text class="route-value">{{ routeInfo.duration }}</text>
        </view>
      </view>
      <view class="route-actions">
        <button class="route-btn driving" @click="startNavigation('driving')">
          <text class="btn-icon">🚗</text>
          <text class="btn-text">驾车</text>
        </button>
        <button class="route-btn walking" @click="startNavigation('walking')">
          <text class="btn-icon">🚶</text>
          <text class="btn-text">步行</text>
        </button>
        <button class="route-btn transit" @click="startNavigation('transit')">
          <text class="btn-icon">🚌</text>
          <text class="btn-text">公交</text>
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
import AmapMap from '../../components/amap/AmapMap.vue'
import amapUtils from '../../config/amap.js'

export default {
  name: 'MapPage',
  components: {
    AmapMap
  },
  
  data() {
    return {
      // 地图配置
      mapCenter: {
        latitude: 39.9042,
        longitude: 116.4074
      },
      mapZoom: 15,
      
      // 搜索相关
      showSuggestions: false,
      searchSuggestions: [],
      
      // 路线规划
      showRoutePanel: false,
      routeInfo: {
        origin: '',
        destination: '',
        distance: '',
        duration: ''
      },
      
      // 加载状态
      isLoading: false,
      loadingText: '加载中...',
      
      // 用户位置
      userLocation: null,
      
      // 搜索历史
      searchHistory: []
    }
  },

  onLoad() {
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
        
        // 加载搜索历史
        this.loadSearchHistory()
        
        console.log('✅ 地图页面初始化完成')
      } catch (error) {
        console.error('❌ 地图页面初始化失败:', error)
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
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            console.log('✅ 获取位置成功:', res)
            this.userLocation = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            
            // 更新地图中心点
            this.mapCenter = {
              latitude: res.latitude,
              longitude: res.longitude
            }
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
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 显示菜单
    showMenu() {
      uni.showActionSheet({
        itemList: ['地图设置', '清除缓存', '关于地图', '帮助'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.showMapSettings()
              break
            case 1:
              this.clearCache()
              break
            case 2:
              this.showAbout()
              break
            case 3:
              this.showHelp()
              break
          }
        }
      })
    },

    // 地图设置
    showMapSettings() {
      uni.showModal({
        title: '地图设置',
        content: '地图设置功能开发中，敬请期待！',
        showCancel: false
      })
    },

    // 清除缓存
    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除地图缓存吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除搜索历史
            this.searchHistory = []
            uni.setStorageSync('map_search_history', [])
            
            uni.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }
        }
      })
    },

    // 关于地图
    showAbout() {
      uni.showModal({
        title: '关于地图',
        content: '基于高德地图API开发\n版本：1.0.0\n提供精准的地图服务和导航功能',
        showCancel: false
      })
    },

    // 帮助
    showHelp() {
      uni.showModal({
        title: '使用帮助',
        content: '1. 点击搜索框输入地点名称\n2. 点击标记点查看详细信息\n3. 使用底部功能快速搜索\n4. 支持多种导航方式',
        showCancel: false
      })
    },

    // 搜索附近银行
    async searchNearbyBanks() {
      if (!this.userLocation) {
        uni.showToast({
          title: '请先获取位置',
          icon: 'none'
        })
        return
      }

      try {
        this.isLoading = true
        this.loadingText = '正在搜索附近银行...'
        
        const result = await amapUtils.searchAround(
          this.userLocation.longitude,
          this.userLocation.latitude,
          '银行',
          3000
        )
        
        if (result.pois && result.pois.length > 0) {
          this.showSearchResults(result.pois, '银行')
        } else {
          uni.showToast({
            title: '附近暂无银行',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 搜索银行失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 搜索ATM机
    async searchATMs() {
      if (!this.userLocation) {
        uni.showToast({
          title: '请先获取位置',
          icon: 'none'
        })
        return
      }

      try {
        this.isLoading = true
        this.loadingText = '正在搜索ATM机...'
        
        const result = await amapUtils.searchAround(
          this.userLocation.longitude,
          this.userLocation.latitude,
          'ATM',
          2000
        )
        
        if (result.pois && result.pois.length > 0) {
          this.showSearchResults(result.pois, 'ATM机')
        } else {
          uni.showToast({
            title: '附近暂无ATM机',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 搜索ATM失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 搜索加油站
    async searchGasStations() {
      if (!this.userLocation) {
        uni.showToast({
          title: '请先获取位置',
          icon: 'none'
        })
        return
      }

      try {
        this.isLoading = true
        this.loadingText = '正在搜索加油站...'
        
        const result = await amapUtils.searchAround(
          this.userLocation.longitude,
          this.userLocation.latitude,
          '加油站',
          5000
        )
        
        if (result.pois && result.pois.length > 0) {
          this.showSearchResults(result.pois, '加油站')
        } else {
          uni.showToast({
            title: '附近暂无加油站',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 搜索加油站失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 搜索餐厅
    async searchRestaurants() {
      if (!this.userLocation) {
        uni.showToast({
          title: '请先获取位置',
          icon: 'none'
        })
        return
      }

      try {
        this.isLoading = true
        this.loadingText = '正在搜索餐厅...'
        
        const result = await amapUtils.searchAround(
          this.userLocation.longitude,
          this.userLocation.latitude,
          '餐厅|美食',
          3000
        )
        
        if (result.pois && result.pois.length > 0) {
          this.showSearchResults(result.pois, '餐厅')
        } else {
          uni.showToast({
            title: '附近暂无餐厅',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 搜索餐厅失败:', error)
        uni.showToast({
          title: '搜索失败',
          icon: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 显示搜索结果
    showSearchResults(pois, type) {
      this.searchSuggestions = pois.map((poi, index) => ({
        id: `${type}_${index}`,
        name: poi.name,
        address: poi.address,
        latitude: parseFloat(poi.location.split(',')[1]),
        longitude: parseFloat(poi.location.split(',')[0]),
        distance: poi.distance ? `${Math.round(poi.distance)}m` : '',
        type: type
      }))
      
      this.showSuggestions = true
    },

    // 选择搜索建议
    selectSuggestion(suggestion) {
      // 移动地图到选中位置
      this.mapCenter = {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude
      }
      
      // 添加到搜索历史
      this.addToSearchHistory(suggestion)
      
      // 关闭建议面板
      this.closeSuggestions()
      
      // 显示路线规划
      this.showRouteToLocation(suggestion)
    },

    // 显示到指定位置的路线
    showRouteToLocation(location) {
      if (!this.userLocation) return
      
      this.routeInfo = {
        origin: '我的位置',
        destination: location.name,
        distance: location.distance || '计算中...',
        duration: '计算中...'
      }
      
      this.showRoutePanel = true
      
      // 计算路线
      this.calculateRoute(location)
    },

    // 计算路线
    async calculateRoute(destination) {
      try {
        const result = await amapUtils.getDirection(
          this.userLocation.longitude,
          this.userLocation.latitude,
          destination.longitude,
          destination.latitude
        )
        
        if (result.route && result.route.paths && result.route.paths.length > 0) {
          const path = result.route.paths[0]
          this.routeInfo.distance = `${Math.round(path.distance)}米`
          this.routeInfo.duration = `${Math.round(path.duration / 60)}分钟`
        }
      } catch (error) {
        console.error('❌ 路线计算失败:', error)
      }
    },

    // 开始导航
    startNavigation(mode) {
      uni.showModal({
        title: '开始导航',
        content: `确定要使用${mode === 'driving' ? '驾车' : mode === 'walking' ? '步行' : '公交'}导航吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '正在启动导航...',
              icon: 'loading',
              duration: 2000
            })
            
            // 这里可以调用系统导航应用
            setTimeout(() => {
              uni.showToast({
                title: '导航已启动',
                icon: 'success'
              })
            }, 2000)
          }
        }
      })
    },

    // 标记点点击事件
    onMarkerTap(marker) {
      console.log('📍 点击标记点:', marker)
    },

    // 搜索结果事件
    onSearchResult(results) {
      console.log('🔍 搜索结果:', results)
    },

    // 关闭搜索建议
    closeSuggestions() {
      this.showSuggestions = false
    },

    // 关闭路线面板
    closeRoutePanel() {
      this.showRoutePanel = false
    },

    // 添加到搜索历史
    addToSearchHistory(item) {
      // 避免重复添加
      const exists = this.searchHistory.find(h => h.name === item.name)
      if (!exists) {
        this.searchHistory.unshift(item)
        // 只保留最近10条记录
        if (this.searchHistory.length > 10) {
          this.searchHistory = this.searchHistory.slice(0, 10)
        }
        
        // 保存到本地存储
        uni.setStorageSync('map_search_history', this.searchHistory)
      }
    },

    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = uni.getStorageSync('map_search_history')
        if (history && Array.isArray(history)) {
          this.searchHistory = history
        }
      } catch (error) {
        console.error('❌ 加载搜索历史失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn, .menu-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
}

/* 地图容器 */
.map-container {
  flex: 1;
  position: relative;
}

/* 底部功能栏 */
.bottom-bar {
  background: white;
  padding: 20rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.1);
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.function-item:active {
  transform: scale(0.95);
  background: #e9ecef;
}

.function-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: white;
}

.function-icon.bank {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.function-icon.atm {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.function-icon.gas {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.function-icon.restaurant {
  background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
}

.function-text {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

/* 搜索建议弹窗 */
.search-suggestions {
  position: absolute;
  top: 120rpx;
  left: 20rpx;
  right: 20rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 500rpx;
  overflow: hidden;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.suggestion-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28rpx;
  color: #999;
  padding: 8rpx;
}

.suggestion-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1rpx solid #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:active {
  background: #f8f9fa;
}

.suggestion-text {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.suggestion-arrow {
  font-size: 24rpx;
  color: #999;
}

/* 路线规划面板 */
.route-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -8rpx 24rpx rgba(0,0,0,0.15);
  z-index: 1000;
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

.route-info {
  padding: 24rpx;
}

.route-item {
  display: flex;
  margin-bottom: 16rpx;
}

.route-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.route-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.route-actions {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.route-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 26rpx;
  color: white;
}

.route-btn.driving {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.route-btn.walking {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.route-btn.transit {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.btn-icon {
  font-size: 24rpx;
}

.btn-text {
  font-size: 24rpx;
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
  z-index: 2000;
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

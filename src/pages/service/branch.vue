<template>
  <view class="content">
    <map 
      id="myMap"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="scale"
      show-location
      provider="tencent"
      style="width: 100%; height: 80vh;"
    ></map>
    <view class="control-panel">
      <button @tap="getLocation">定位</button> <!-- 修改为调用getLocation -->
      <button @tap="searchNearby">搜索附近网点</button> <!-- 修改方法名避免混淆 -->
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
      mapKey: '3CSBZ-O4BY5-XFSIR-INBZY-OXQR5-WZFSZ' // 您的腾讯地图API Key
    }
  },
  onLoad() {
    console.log('网点查询页面加载');
    this.getLocation();
  },
  methods: {
    // 合并原有的locate和getLocation方法
    getLocation() {
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
            iconPath: '/static/logo.png', // 可添加自定义图标
            width: 30,
            height: 30
          }];
          console.log('获取位置成功:', res.latitude, res.longitude);
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          // 如果用户拒绝授权，可以设置默认位置
          this.setDefaultLocation();
        }
      });
    },
    
    // 设置默认位置（当无法获取用户位置时使用）
    setDefaultLocation() {
      // 例如设置为北京的位置
      this.latitude = 39.9042;
      this.longitude = 116.4074;
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        title: '默认位置'
      }];
      uni.showToast({
        title: '无法获取位置，使用默认位置',
        icon: 'none'
      });
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
              id: item.id,
              name: item.title,
              address: item.address,
              latitude: item.location.lat,
              longitude: item.location.lng,
              distance: this.calculateDistance(
                this.latitude, 
                this.longitude, 
                item.location.lat, 
                item.location.lng
              )
            }));
            this.setMarkers();
          } else {
            console.error('搜索失败:', res.data);
            uni.showToast({ title: '搜索失败: ' + (res.data.message || '未知错误'), icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({ title: '网络异常', icon: 'none' });
        }
      });
    },
    
    // 设置地图标记点
    setMarkers() {
      // 先保留当前位置标记
      const currentLocationMarker = this.markers[0];
      // 添加网点标记
      const branchMarkers = this.branches.map((branch, index) => ({
        id: index + 1, // 确保id唯一
        latitude: branch.latitude,
        longitude: branch.longitude,
        title: branch.name,
        iconPath: '/static/logo.png', // 可自定义图标
        width: 24,
        height: 24
      }));
      // 合并标记点
      this.markers = [currentLocationMarker, ...branchMarkers];
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
    }
  }
}
</script>

<style scoped>
.control-panel {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #fff;
}
.control-panel button {
  margin: 0 10rpx;
}
</style>
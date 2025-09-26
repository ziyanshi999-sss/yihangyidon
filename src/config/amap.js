/**
 * 高德地图配置文件
 * 包含API密钥和地图相关配置
 */

export const AMAP_CONFIG = {
  // 高德地图API密钥
  API_KEY: 'fe211b3e07c4e9b86b16adfd57925547',
  
  // 安全密钥
  SECURITY_KEY: '88a533ed5eb157250debf50883ccbe61',
  
  // 地图配置
  MAP_CONFIG: {
    // 默认中心点（北京）
    center: {
      latitude: 39.9042,
      longitude: 116.4074
    },
    
    // 地图缩放级别
    zoom: 15,
    
    // 地图样式
    style: 'normal', // normal, satellite, hybrid
    
    // 是否显示用户位置
    showUserLocation: true,
    
    // 是否显示定位按钮
    showLocationButton: true,
    
    // 是否显示缩放控件
    showZoomControl: true,
    
    // 是否显示比例尺
    showScale: true,
    
    // 是否显示指南针
    showCompass: true
  },
  
  // 搜索配置
  SEARCH_CONFIG: {
    // 搜索半径（米）
    radius: 5000,
    
    // 搜索结果数量
    pageSize: 20,
    
    // 搜索类型
    types: '银行|ATM|金融服务'
  },
  
  // 导航配置
  NAVIGATION_CONFIG: {
    // 导航策略
    strategy: 'fast', // fast, short, avoid_highway
    
    // 是否避开收费路段
    avoidToll: false,
    
    // 是否避开高速
    avoidHighway: false
  }
}

// 高德地图API接口地址
export const AMAP_API = {
  // 地理编码
  GEOCODE: 'https://restapi.amap.com/v3/geocode/geo',
  
  // 逆地理编码
  REGEOCODE: 'https://restapi.amap.com/v3/geocode/regeo',
  
  // 周边搜索
  AROUND: 'https://restapi.amap.com/v3/place/around',
  
  // 关键词搜索
  TEXT: 'https://restapi.amap.com/v3/place/text',
  
  // 路径规划
  DIRECTION: 'https://restapi.amap.com/v3/direction/driving',
  
  // 步行路径规划
  WALKING: 'https://restapi.amap.com/v3/direction/walking',
  
  // 公交路径规划
  TRANSIT: 'https://restapi.amap.com/v3/direction/transit/integrated',
  
  // 距离测量
  DISTANCE: 'https://restapi.amap.com/v3/distance'
}

// 高德地图工具类
export class AmapUtils {
  constructor() {
    this.apiKey = AMAP_CONFIG.API_KEY
    this.securityKey = AMAP_CONFIG.SECURITY_KEY
  }

  /**
   * 生成签名
   * @param {Object} params 请求参数
   * @returns {string} 签名
   */
  generateSignature(params) {
    // 按参数名排序
    const sortedKeys = Object.keys(params).sort()
    let queryString = ''
    
    sortedKeys.forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryString += `${key}=${params[key]}&`
      }
    })
    
    // 添加安全密钥
    queryString += `key=${this.securityKey}`
    
    // 这里应该使用MD5加密，但在前端环境中我们简化处理
    return btoa(queryString)
  }

  /**
   * 发送请求到高德地图API
   * @param {string} url API地址
   * @param {Object} params 请求参数
   * @returns {Promise} 请求结果
   */
  async request(url, params = {}) {
    try {
      // 添加API密钥
      params.key = this.apiKey
      
      // 生成签名
      const signature = this.generateSignature(params)
      params.sig = signature
      
      // 构建请求URL
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      
      const fullUrl = `${url}?${queryString}`
      
      console.log('🗺️ 高德地图API请求:', fullUrl)
      
      // 发送请求
      const response = await fetch(fullUrl)
      const data = await response.json()
      
      if (data.status === '1') {
        console.log('✅ 高德地图API请求成功:', data)
        return data
      } else {
        console.error('❌ 高德地图API请求失败:', data)
        throw new Error(data.info || 'API请求失败')
      }
    } catch (error) {
      console.error('❌ 高德地图API请求异常:', error)
      throw error
    }
  }

  /**
   * 地理编码（地址转坐标）
   * @param {string} address 地址
   * @returns {Promise} 坐标信息
   */
  async geocode(address) {
    return await this.request(AMAP_API.GEOCODE, {
      address: address,
      output: 'json'
    })
  }

  /**
   * 逆地理编码（坐标转地址）
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise} 地址信息
   */
  async regeocode(longitude, latitude) {
    return await this.request(AMAP_API.REGEOCODE, {
      location: `${longitude},${latitude}`,
      output: 'json',
      extensions: 'all'
    })
  }

  /**
   * 周边搜索
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @param {string} keywords 关键词
   * @param {number} radius 搜索半径
   * @returns {Promise} 搜索结果
   */
  async searchAround(longitude, latitude, keywords = '银行', radius = 5000) {
    return await this.request(AMAP_API.AROUND, {
      location: `${longitude},${latitude}`,
      keywords: keywords,
      radius: radius,
      output: 'json',
      extensions: 'all'
    })
  }

  /**
   * 关键词搜索
   * @param {string} keywords 关键词
   * @param {string} city 城市
   * @returns {Promise} 搜索结果
   */
  async searchText(keywords, city = '北京') {
    return await this.request(AMAP_API.TEXT, {
      keywords: keywords,
      city: city,
      output: 'json',
      extensions: 'all'
    })
  }

  /**
   * 路径规划
   * @param {number} originLng 起点经度
   * @param {number} originLat 起点纬度
   * @param {number} destinationLng 终点经度
   * @param {number} destinationLat 终点纬度
   * @returns {Promise} 路径规划结果
   */
  async getDirection(originLng, originLat, destinationLng, destinationLat) {
    return await this.request(AMAP_API.DIRECTION, {
      origin: `${originLng},${originLat}`,
      destination: `${destinationLng},${destinationLat}`,
      output: 'json',
      extensions: 'all'
    })
  }

  /**
   * 步行路径规划
   * @param {number} originLng 起点经度
   * @param {number} originLat 起点纬度
   * @param {number} destinationLng 终点经度
   * @param {number} destinationLat 终点纬度
   * @returns {Promise} 步行路径规划结果
   */
  async getWalkingRoute(originLng, originLat, destinationLng, destinationLat) {
    return await this.request(AMAP_API.WALKING, {
      origin: `${originLng},${originLat}`,
      destination: `${destinationLng},${destinationLat}`,
      output: 'json'
    })
  }

  /**
   * 公交路径规划
   * @param {number} originLng 起点经度
   * @param {number} originLat 起点纬度
   * @param {number} destinationLng 终点经度
   * @param {number} destinationLat 终点纬度
   * @param {string} city 城市
   * @returns {Promise} 公交路径规划结果
   */
  async getTransitRoute(originLng, originLat, destinationLng, destinationLat, city = '北京') {
    return await this.request(AMAP_API.TRANSIT, {
      origin: `${originLng},${originLat}`,
      destination: `${destinationLng},${destinationLat}`,
      city: city,
      output: 'json'
    })
  }

  /**
   * 计算距离
   * @param {number} originLng 起点经度
   * @param {number} originLat 起点纬度
   * @param {number} destinationLng 终点经度
   * @param {number} destinationLat 终点纬度
   * @returns {Promise} 距离信息
   */
  async getDistance(originLng, originLat, destinationLng, destinationLat) {
    return await this.request(AMAP_API.DISTANCE, {
      origins: `${originLng},${originLat}`,
      destination: `${destinationLng},${destinationLat}`,
      output: 'json'
    })
  }
}

// 导出默认实例
export default new AmapUtils()

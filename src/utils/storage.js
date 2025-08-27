/**
 * 本地存储工具类
 * 封装uni-app的存储API
 */

/**
 * 设置存储
 * @param {string} key 存储键名
 * @param {any} value 存储值
 * @param {boolean} sync 是否同步存储，默认false
 */
export const setStorage = (key, value, sync = false) => {
  try {
    if (sync) {
      uni.setStorageSync(key, value)
    } else {
      return uni.setStorage({
        key,
        data: value
      })
    }
  } catch (error) {
    console.error(`存储失败: ${key}`, error)
  }
}

/**
 * 获取存储
 * @param {string} key 存储键名
 * @param {boolean} sync 是否同步获取，默认false
 * @param {any} defaultValue 默认值
 */
export const getStorage = (key, sync = false, defaultValue = null) => {
  try {
    if (sync) {
      return uni.getStorageSync(key) || defaultValue
    } else {
      return new Promise((resolve) => {
        uni.getStorage({
          key,
          success: (res) => resolve(res.data),
          fail: () => resolve(defaultValue)
        })
      })
    }
  } catch (error) {
    console.error(`获取存储失败: ${key}`, error)
    return defaultValue
  }
}

/**
 * 移除存储
 * @param {string} key 存储键名
 * @param {boolean} sync 是否同步移除，默认false
 */
export const removeStorage = (key, sync = false) => {
  try {
    if (sync) {
      uni.removeStorageSync(key)
    } else {
      return uni.removeStorage({ key })
    }
  } catch (error) {
    console.error(`移除存储失败: ${key}`, error)
  }
}

/**
 * 清空所有存储
 * @param {boolean} sync 是否同步清空，默认false
 */
export const clearStorage = (sync = false) => {
  try {
    if (sync) {
      uni.clearStorageSync()
    } else {
      return uni.clearStorage()
    }
  } catch (error) {
    console.error('清空存储失败', error)
  }
}

/**
 * 获取存储信息
 * @param {boolean} sync 是否同步获取，默认false
 */
export const getStorageInfo = (sync = false) => {
  try {
    if (sync) {
      return uni.getStorageInfoSync()
    } else {
      return new Promise((resolve) => {
        uni.getStorageInfo({
          success: resolve,
          fail: () => resolve({})
        })
      })
    }
  } catch (error) {
    console.error('获取存储信息失败', error)
    return {}
  }
}
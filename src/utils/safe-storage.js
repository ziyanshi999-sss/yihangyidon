/**
 * 安全的本地存储工具函数
 * 确保从本地存储获取的数据类型正确
 */

/**
 * 安全获取数组数据
 * @param {string} key 存储键名
 * @param {Array} defaultValue 默认值
 * @returns {Array} 数组数据
 */
export function getSafeArray(key, defaultValue = []) {
  try {
    const data = uni.getStorageSync(key)
    return Array.isArray(data) ? data : defaultValue
  } catch (error) {
    console.warn(`获取数组数据失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全获取对象数据
 * @param {string} key 存储键名
 * @param {Object} defaultValue 默认值
 * @returns {Object} 对象数据
 */
export function getSafeObject(key, defaultValue = {}) {
  try {
    const data = uni.getStorageSync(key)
    return (data && typeof data === 'object' && !Array.isArray(data)) ? data : defaultValue
  } catch (error) {
    console.warn(`获取对象数据失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全获取字符串数据
 * @param {string} key 存储键名
 * @param {string} defaultValue 默认值
 * @returns {string} 字符串数据
 */
export function getSafeString(key, defaultValue = '') {
  try {
    const data = uni.getStorageSync(key)
    return typeof data === 'string' ? data : defaultValue
  } catch (error) {
    console.warn(`获取字符串数据失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全获取数字数据
 * @param {string} key 存储键名
 * @param {number} defaultValue 默认值
 * @returns {number} 数字数据
 */
export function getSafeNumber(key, defaultValue = 0) {
  try {
    const data = uni.getStorageSync(key)
    return typeof data === 'number' ? data : defaultValue
  } catch (error) {
    console.warn(`获取数字数据失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全获取布尔数据
 * @param {string} key 存储键名
 * @param {boolean} defaultValue 默认值
 * @returns {boolean} 布尔数据
 */
export function getSafeBoolean(key, defaultValue = false) {
  try {
    const data = uni.getStorageSync(key)
    return typeof data === 'boolean' ? data : defaultValue
  } catch (error) {
    console.warn(`获取布尔数据失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全设置数据到本地存储
 * @param {string} key 存储键名
 * @param {any} data 要存储的数据
 * @returns {boolean} 是否成功
 */
export function setSafeStorage(key, data) {
  try {
    uni.setStorageSync(key, data)
    return true
  } catch (error) {
    console.error(`设置存储数据失败 (${key}):`, error)
    return false
  }
}

/**
 * 安全移除本地存储数据
 * @param {string} key 存储键名
 * @returns {boolean} 是否成功
 */
export function removeSafeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.error(`移除存储数据失败 (${key}):`, error)
    return false
  }
}

/**
 * 批量安全获取数据
 * @param {Object} keys 键值对，key为存储键名，value为默认值
 * @returns {Object} 获取到的数据对象
 */
export function getBatchSafeData(keys) {
  const result = {}
  for (const [key, defaultValue] of Object.entries(keys)) {
    if (Array.isArray(defaultValue)) {
      result[key] = getSafeArray(key, defaultValue)
    } else if (typeof defaultValue === 'object' && defaultValue !== null) {
      result[key] = getSafeObject(key, defaultValue)
    } else if (typeof defaultValue === 'string') {
      result[key] = getSafeString(key, defaultValue)
    } else if (typeof defaultValue === 'number') {
      result[key] = getSafeNumber(key, defaultValue)
    } else if (typeof defaultValue === 'boolean') {
      result[key] = getSafeBoolean(key, defaultValue)
    } else {
      result[key] = uni.getStorageSync(key) || defaultValue
    }
  }
  return result
}

export default {
  getSafeArray,
  getSafeObject,
  getSafeString,
  getSafeNumber,
  getSafeBoolean,
  setSafeStorage,
  removeSafeStorage,
  getBatchSafeData
}

// uni-app 主题系统
// 专门为 uni-app 环境优化的主题管理

const THEME_STORAGE_KEY = 'app_theme'

// 主题配置
export const themes = {
  light: {
    name: '浅色主题',
    id: 'light',
    colors: {
      primary: '#4caf50',
      primaryDark: '#2e7d32',
      primaryLight: '#81c784',
      secondary: '#ff9800',
      secondaryDark: '#f57c00',
      background: '#f5f5f5',
      surface: '#ffffff',
      surfaceVariant: '#f8f9fa',
      text: '#333333',
      textSecondary: '#666666',
      textDisabled: '#999999',
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    }
  },
  dark: {
    name: '深色主题',
    id: 'dark',
    colors: {
      primary: '#66bb6a',
      primaryDark: '#4caf50',
      primaryLight: '#81c784',
      secondary: '#ffb74d',
      secondaryDark: '#ff9800',
      background: '#121212',
      surface: '#1e1e1e',
      surfaceVariant: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      textDisabled: '#666666',
      border: '#333333',
      borderLight: '#2d2d2d',
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#f44336',
      info: '#42a5f5'
    }
  },
  blue: {
    name: '蓝色主题',
    id: 'blue',
    colors: {
      primary: '#2196f3',
      primaryDark: '#1976d2',
      primaryLight: '#64b5f6',
      secondary: '#ff9800',
      secondaryDark: '#f57c00',
      background: '#f3f7ff',
      surface: '#ffffff',
      surfaceVariant: '#f8faff',
      text: '#333333',
      textSecondary: '#666666',
      textDisabled: '#999999',
      border: '#e3f2fd',
      borderLight: '#f0f7ff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    }
  },
  purple: {
    name: '紫色主题',
    id: 'purple',
    colors: {
      primary: '#9c27b0',
      primaryDark: '#7b1fa2',
      primaryLight: '#ba68c8',
      secondary: '#ff9800',
      secondaryDark: '#f57c00',
      background: '#faf5ff',
      surface: '#ffffff',
      surfaceVariant: '#f8f4ff',
      text: '#333333',
      textSecondary: '#666666',
      textDisabled: '#999999',
      border: '#e1bee7',
      borderLight: '#f3e5f5',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    }
  }
}

// 简化的主题管理器
class UniThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'light'
    this.listeners = []
  }

  // 获取存储的主题
  getStoredTheme() {
    try {
      return uni.getStorageSync(THEME_STORAGE_KEY)
    } catch (error) {
      console.error('获取主题失败:', error)
      return 'light'
    }
  }

  // 存储主题
  setStoredTheme(themeId) {
    try {
      uni.setStorageSync(THEME_STORAGE_KEY, themeId)
    } catch (error) {
      console.error('存储主题失败:', error)
    }
  }

  // 应用主题
  applyTheme(themeId) {
    const theme = themes[themeId]
    if (!theme) {
      console.error('主题不存在:', themeId)
      return
    }

    this.currentTheme = themeId
    this.setStoredTheme(themeId)
    
    // 通知监听器
    this.notifyListeners(theme)
    
    console.log('主题已切换为:', theme.name)
  }

  // 获取当前主题
  getCurrentTheme() {
    return themes[this.currentTheme]
  }

  // 获取当前主题ID
  getCurrentThemeId() {
    return this.currentTheme
  }

  // 切换主题
  switchTheme(themeId) {
    if (themes[themeId]) {
      this.applyTheme(themeId)
    } else {
      console.error('主题不存在:', themeId)
    }
  }

  // 切换到下一个主题
  switchToNextTheme() {
    const themeIds = Object.keys(themes)
    const currentIndex = themeIds.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themeIds.length
    this.switchTheme(themeIds[nextIndex])
  }

  // 添加主题变化监听器
  addThemeListener(callback) {
    this.listeners.push(callback)
  }

  // 移除主题变化监听器
  removeThemeListener(callback) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  // 通知监听器
  notifyListeners(theme) {
    this.listeners.forEach(callback => {
      try {
        callback(theme)
      } catch (error) {
        console.error('主题监听器执行失败:', error)
      }
    })
  }

  // 获取所有可用主题
  getAllThemes() {
    return Object.values(themes)
  }

  // 检查主题是否存在
  hasTheme(themeId) {
    return themes.hasOwnProperty(themeId)
  }
}

// 创建全局主题管理器实例
const uniThemeManager = new UniThemeManager()

// 导出主题管理器和主题配置
export default uniThemeManager

// 便捷方法
export const switchTheme = (themeId) => uniThemeManager.switchTheme(themeId)
export const getCurrentTheme = () => uniThemeManager.getCurrentTheme()
export const getCurrentThemeId = () => uniThemeManager.getCurrentThemeId()
export const addThemeListener = (callback) => uniThemeManager.addThemeListener(callback)
export const removeThemeListener = (callback) => uniThemeManager.removeThemeListener(callback)

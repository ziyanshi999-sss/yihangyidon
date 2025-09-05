// 简单主题系统 - 专为 uni-app 设计
const THEME_KEY = 'app_theme'

// 主题配置
const themes = {
  light: {
    id: 'light',
    name: '浅色主题',
    colors: {
      primary: '#4caf50',
      primaryDark: '#2e7d32',
      background: '#f5f5f5',
      surface: '#ffffff',
      surfaceVariant: '#f8f9fa',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
    }
  },
  dark: {
    id: 'dark',
    name: '深色主题',
    colors: {
      primary: '#66bb6a',
      primaryDark: '#4caf50',
      background: '#121212',
      surface: '#1e1e1e',
      surfaceVariant: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#333333',
      borderLight: '#2d2d2d',
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#f44336',
      info: '#42a5f5'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)'
    }
  },
  blue: {
    id: 'blue',
    name: '蓝色主题',
    colors: {
      primary: '#2196f3',
      primaryDark: '#1976d2',
      background: '#f3f7ff',
      surface: '#ffffff',
      surfaceVariant: '#f8faff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e3f2fd',
      borderLight: '#f0f7ff',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
    }
  },
  purple: {
    id: 'purple',
    name: '紫色主题',
    colors: {
      primary: '#9c27b0',
      primaryDark: '#7b1fa2',
      background: '#faf5ff',
      surface: '#ffffff',
      surfaceVariant: '#f8f4ff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e1bee7',
      borderLight: '#f3e5f5',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
    }
  }
}

// 主题管理器
class SimpleThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme()
    this.listeners = []
  }

  // 获取存储的主题
  getStoredTheme() {
    try {
      return uni.getStorageSync(THEME_KEY) || 'light'
    } catch (error) {
      console.error('获取主题失败:', error)
      return 'light'
    }
  }

  // 存储主题
  setStoredTheme(themeId) {
    try {
      uni.setStorageSync(THEME_KEY, themeId)
    } catch (error) {
      console.error('存储主题失败:', error)
    }
  }

  // 获取当前主题
  getCurrentTheme() {
    return themes[this.currentTheme] || themes.light
  }

  // 获取当前主题ID
  getCurrentThemeId() {
    return this.currentTheme
  }

  // 切换主题
  switchTheme(themeId) {
    if (themes[themeId]) {
      this.currentTheme = themeId
      this.setStoredTheme(themeId)
      this.notifyListeners(themes[themeId])
      console.log('主题已切换为:', themes[themeId].name)
    } else {
      console.error('主题不存在:', themeId)
    }
  }

  // 获取所有主题
  getAllThemes() {
    return Object.values(themes)
  }

  // 添加监听器
  addThemeListener(callback) {
    this.listeners.push(callback)
  }

  // 移除监听器
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
}

// 创建全局实例
const themeManager = new SimpleThemeManager()

// 导出
export default themeManager
export { themes }

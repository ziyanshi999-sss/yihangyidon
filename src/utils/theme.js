// 主题管理系统
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
      info: '#2196f3',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowDark: 'rgba(0, 0, 0, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
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
      info: '#42a5f5',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowDark: 'rgba(0, 0, 0, 0.5)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      secondary: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      success: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      warning: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      error: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
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
      info: '#2196f3',
      shadow: 'rgba(33, 150, 243, 0.1)',
      shadowDark: 'rgba(33, 150, 243, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
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
      info: '#2196f3',
      shadow: 'rgba(156, 39, 176, 0.1)',
      shadowDark: 'rgba(156, 39, 176, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
    }
  }
}

// 主题管理器
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'light'
    this.listeners = []
    this.init()
  }

  // 初始化主题
  init() {
    // 延迟初始化，确保环境已准备好
    setTimeout(() => {
      this.applyTheme(this.currentTheme)
      this.setupSystemThemeListener()
    }, 100)
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
    
    // 应用CSS变量（仅在浏览器环境中）
    this.applyCSSVariables(theme)
    
    // 通知监听器
    this.notifyListeners(theme)
    
    console.log('主题已切换为:', theme.name)
  }

  // 应用CSS变量
  applyCSSVariables(theme) {
    // 检查是否在浏览器环境中
    if (typeof document === 'undefined') {
      console.warn('Document not available, skipping CSS variable application')
      return
    }
    
    try {
      const root = document.documentElement || document.body
      
      if (!root) {
        console.warn('Root element not available, skipping CSS variable application')
        return
      }
      
      // 应用颜色变量
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
      
      // 应用渐变变量
      Object.entries(theme.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value)
      })
      
      // 设置主题类名
      if (document.body) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '')
        document.body.classList.add(`theme-${theme.id}`)
      }
    } catch (error) {
      console.warn('Failed to apply CSS variables:', error)
    }
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

  // 设置系统主题监听
  setupSystemThemeListener() {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined' || !window.matchMedia) {
      console.warn('Window or matchMedia not available, skipping system theme listener')
      return
    }
    
    // 监听系统主题变化（如果支持）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addListener((e) => {
      // 如果用户没有手动设置主题，跟随系统主题
      const storedTheme = this.getStoredTheme()
      if (!storedTheme || storedTheme === 'auto') {
        this.applyTheme(e.matches ? 'dark' : 'light')
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
const themeManager = new ThemeManager()

// 导出主题管理器
export default themeManager

// 便捷方法
export const switchTheme = (themeId) => themeManager.switchTheme(themeId)
export const getCurrentTheme = () => themeManager.getCurrentTheme()
export const getCurrentThemeId = () => themeManager.getCurrentThemeId()
export const addThemeListener = (callback) => themeManager.addThemeListener(callback)
export const removeThemeListener = (callback) => themeManager.removeThemeListener(callback)
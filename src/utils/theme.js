/**
 * 主题管理器
 * 负责主题切换、状态管理和样式应用
 */

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'system'
    this.themeConfigs = {
      light: {
        name: '明亮主题',
        colors: {
          primary: '#4caf50',
          secondary: '#2196f3',
          background: '#f5f5f5',
          cardBackground: '#ffffff',
          textColor: '#333333',
          textSecondary: '#666666',
          borderColor: '#e0e0e0',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          info: '#2196f3'
        }
      },
      dark: {
        name: '暗黑主题',
        colors: {
          primary: '#4caf50',
          secondary: '#2196f3',
          background: '#121212',
          cardBackground: '#1e1e1e',
          textColor: '#ffffff',
          textSecondary: '#b0b0b0',
          borderColor: '#333333',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          info: '#2196f3'
        }
      },
      system: {
        name: '跟随系统',
        colors: {}
      }
    }
    
    this.init()
  }
  
  /**
   * 初始化主题管理器
   */
  init() {
    this.applyTheme(this.currentTheme)
    this.setupSystemThemeListener()
    this.setupStorageListener()
  }
  
  /**
   * 获取存储的主题
   */
  getStoredTheme() {
    try {
      if (typeof uni !== 'undefined') {
        return uni.getStorageSync('app_theme')
      } else if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('app_theme')
      }
    } catch (error) {
      console.error('获取存储主题失败:', error)
    }
    return null
  }
  
  /**
   * 存储主题设置
   */
  setStoredTheme(theme) {
    try {
      if (typeof uni !== 'undefined') {
        uni.setStorageSync('app_theme', theme)
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_theme', theme)
      }
    } catch (error) {
      console.error('存储主题失败:', error)
    }
  }
  
  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme
  }
  
  /**
   * 获取主题配置
   */
  getThemeConfig(theme) {
    if (theme === 'system') {
      const systemTheme = this.getSystemTheme()
      return this.themeConfigs[systemTheme]
    }
    return this.themeConfigs[theme] || this.themeConfigs.light
  }
  
  /**
   * 获取系统主题
   */
  getSystemTheme() {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
    } catch (error) {
      console.error('获取系统主题失败:', error)
    }
    return 'light'
  }
  
  /**
   * 应用主题
   */
  applyTheme(theme) {
    try {
      this.currentTheme = theme
      this.setStoredTheme(theme)
      
      const actualTheme = theme === 'system' ? this.getSystemTheme() : theme
      const config = this.getThemeConfig(actualTheme)
      
      // 设置CSS变量
      this.setCSSVariables(config.colors)
      
      // 设置页面类名
      this.setPageClasses(actualTheme)
      
      // 触发主题变化事件
      this.triggerThemeChange(theme, config)
      
      console.log('主题已应用:', theme, '实际主题:', actualTheme)
    } catch (error) {
      console.error('应用主题失败:', error)
    }
  }
  
  /**
   * 设置CSS变量
   */
  setCSSVariables(colors) {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        const root = document.documentElement
        
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--theme-${key}`, value)
        })
        
        // 设置一些常用的组合变量
        root.style.setProperty('--theme-glass-bg', colors.cardBackground + '80')
        root.style.setProperty('--theme-glass-border', colors.borderColor + '40')
        root.style.setProperty('--theme-shadow-sm', `0 2rpx 8rpx ${colors.shadowColor}`)
        root.style.setProperty('--theme-shadow-md', `0 4rpx 12rpx ${colors.shadowColor}`)
        root.style.setProperty('--theme-shadow-lg', `0 8rpx 24rpx ${colors.shadowColor}`)
      }
    } catch (error) {
      console.error('设置CSS变量失败:', error)
    }
  }
  
  /**
   * 设置页面类名
   */
  setPageClasses(theme) {
    try {
      if (typeof document !== 'undefined' && document.body) {
        const body = document.body
        
        // 移除所有主题类名
        body.classList.remove('theme-light', 'theme-dark', 'theme-system')
        
        // 添加当前主题类名
        body.classList.add(`theme-${theme}`)
        
        // 设置暗黑模式类名
        if (theme === 'dark') {
          body.classList.add('dark')
        } else {
          body.classList.remove('dark')
        }
      }
    } catch (error) {
      console.error('设置页面类名失败:', error)
    }
  }
  
  /**
   * 触发主题变化事件
   */
  triggerThemeChange(theme, config) {
    try {
      // 触发自定义事件
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('themeChange', {
          detail: { theme, config }
        })
        window.dispatchEvent(event)
      }
      
      // 更新全局数据
      if (typeof getApp !== 'undefined') {
        const app = getApp()
        if (app && app.globalData) {
          app.globalData.currentTheme = theme
          app.globalData.themeConfig = config
        }
      }
    } catch (error) {
      console.error('触发主题变化事件失败:', error)
    }
  }
  
  /**
   * 设置系统主题监听器
   */
  setupSystemThemeListener() {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleSystemThemeChange = (e) => {
          if (this.currentTheme === 'system') {
            this.applyTheme('system')
          }
        }
        
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      }
    } catch (error) {
      console.error('设置系统主题监听器失败:', error)
    }
  }
  
  /**
   * 设置存储监听器
   */
  setupStorageListener() {
    try {
      if (typeof window !== 'undefined') {
        const handleStorageChange = (e) => {
          if (e.key === 'app_theme' && e.newValue !== this.currentTheme) {
            this.applyTheme(e.newValue)
          }
        }
        
        window.addEventListener('storage', handleStorageChange)
      }
    } catch (error) {
      console.error('设置存储监听器失败:', error)
    }
  }
  
  /**
   * 切换主题
   */
  switchTheme(theme) {
    if (this.themeConfigs[theme]) {
      this.applyTheme(theme)
    } else {
      console.error('未知主题:', theme)
    }
  }
  
  /**
   * 获取可用主题列表
   */
  getAvailableThemes() {
    return Object.keys(this.themeConfigs).map(key => ({
      key,
      name: this.themeConfigs[key].name
    }))
  }
}

// 创建全局实例
const themeManager = new ThemeManager()

// 导出默认实例
export default themeManager

// 也导出类，以便需要时创建新实例
export { ThemeManager }
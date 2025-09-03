// 主题管理工具
class ThemeManager {
  constructor() {
    this.currentTheme = 'light'
    this.themeList = [
      'light', 'dark', 'blue', 'green', 'purple', 'orange', 
      'pink', 'red', 'teal', 'indigo', 'amber', 'cyan'
    ]
    this.themes = {
      light: {
        '--bg-color': '#f5f5f5',
        '--text-color': '#333333',
        '--card-bg': '#ffffff',
        '--border-color': '#eeeeee',
        '--primary-color': '#2e7d32',
        '--secondary-color': '#4caf50',
        '--danger-color': '#e74c3c',
        '--warning-color': '#f39c12',
        '--success-color': '#27ae60'
      },
      dark: {
        '--bg-color': '#1a1a1a',
        '--text-color': '#ffffff',
        '--card-bg': '#2d2d2d',
        '--border-color': '#404040',
        '--primary-color': '#4caf50',
        '--secondary-color': '#66bb6a',
        '--danger-color': '#ef5350',
        '--warning-color': '#ffa726',
        '--success-color': '#66bb6a'
      },
      blue: {
        '--bg-color': '#e3f2fd',
        '--text-color': '#1565c0',
        '--card-bg': '#ffffff',
        '--border-color': '#bbdefb',
        '--primary-color': '#1976d2',
        '--secondary-color': '#42a5f5',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      green: {
        '--bg-color': '#e8f5e8',
        '--text-color': '#2e7d32',
        '--card-bg': '#ffffff',
        '--border-color': '#c8e6c9',
        '--primary-color': '#4caf50',
        '--secondary-color': '#66bb6a',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      purple: {
        '--bg-color': '#f3e5f5',
        '--text-color': '#7b1fa2',
        '--card-bg': '#ffffff',
        '--border-color': '#e1bee7',
        '--primary-color': '#9c27b0',
        '--secondary-color': '#ba68c8',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      orange: {
        '--bg-color': '#fff3e0',
        '--text-color': '#e65100',
        '--card-bg': '#ffffff',
        '--border-color': '#ffcc02',
        '--primary-color': '#ff9800',
        '--secondary-color': '#ffb74d',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      pink: {
        '--bg-color': '#fce4ec',
        '--text-color': '#c2185b',
        '--card-bg': '#ffffff',
        '--border-color': '#f8bbd9',
        '--primary-color': '#e91e63',
        '--secondary-color': '#f06292',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      red: {
        '--bg-color': '#ffebee',
        '--text-color': '#c62828',
        '--card-bg': '#ffffff',
        '--border-color': '#ffcdd2',
        '--primary-color': '#f44336',
        '--secondary-color': '#ef5350',
        '--danger-color': '#d32f2f',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      teal: {
        '--bg-color': '#e0f2f1',
        '--text-color': '#00695c',
        '--card-bg': '#ffffff',
        '--border-color': '#b2dfdb',
        '--primary-color': '#009688',
        '--secondary-color': '#4db6ac',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      indigo: {
        '--bg-color': '#e8eaf6',
        '--text-color': '#283593',
        '--card-bg': '#ffffff',
        '--border-color': '#c5cae9',
        '--primary-color': '#3f51b5',
        '--secondary-color': '#7986cb',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      amber: {
        '--bg-color': '#fff8e1',
        '--text-color': '#f57f17',
        '--card-bg': '#ffffff',
        '--border-color': '#ffecb3',
        '--primary-color': '#ffc107',
        '--secondary-color': '#ffd54f',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      },
      cyan: {
        '--bg-color': '#e0f7fa',
        '--text-color': '#006064',
        '--card-bg': '#ffffff',
        '--border-color': '#b2ebf2',
        '--primary-color': '#00bcd4',
        '--secondary-color': '#4dd0e1',
        '--danger-color': '#f44336',
        '--warning-color': '#ff9800',
        '--success-color': '#4caf50'
      }
    }
  }

  // 初始化主题
  init() {
    try {
      const savedTheme = uni.getStorageSync('appTheme')
      if (savedTheme && this.themes[savedTheme]) {
        this.currentTheme = savedTheme
        this.applyTheme(savedTheme)
      }
    } catch (error) {
      console.error('初始化主题失败:', error)
    }
  }

  // 获取当前主题
  getCurrentTheme() {
    return this.currentTheme
  }

  // 切换主题
  toggleTheme() {
    const currentIndex = this.themeList.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % this.themeList.length
    const newTheme = this.themeList[nextIndex]
    this.setTheme(newTheme)
    return newTheme
  }

  // 设置主题
  setTheme(theme) {
    if (!this.themes[theme]) {
      console.error('不支持的主题:', theme)
      return false
    }

    this.currentTheme = theme
    
    // 保存到本地存储
    try {
      uni.setStorageSync('appTheme', theme)
    } catch (error) {
      console.error('保存主题失败:', error)
    }

    // 应用主题
    this.applyTheme(theme)

    // 通知其他页面主题变化
    uni.$emit('themeChanged', theme)

    return true
  }

  // 应用主题
  applyTheme(theme) {
    const themeVars = this.themes[theme]
    
    // 在H5环境中设置CSS变量
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      Object.keys(themeVars).forEach(key => {
        root.style.setProperty(key, themeVars[key])
      })
    }
    // #endif

    // 在小程序环境中，可以通过页面样式类名来切换
    // #ifdef MP
    // 小程序环境下的主题切换逻辑
    // #endif
  }

  // 获取主题变量
  getThemeVar(varName) {
    const themeVars = this.themes[this.currentTheme]
    return themeVars[varName] || ''
  }

  // 获取所有主题变量
  getThemeVars() {
    return this.themes[this.currentTheme]
  }
}

// 创建全局主题管理器实例
const themeManager = new ThemeManager()

// 导出主题管理器
export default themeManager

// 导出便捷方法
export const getCurrentTheme = () => themeManager.getCurrentTheme()
export const toggleTheme = () => themeManager.toggleTheme()
export const setTheme = (theme) => themeManager.setTheme(theme)
export const getThemeVar = (varName) => themeManager.getThemeVar(varName)
export const getThemeVars = () => themeManager.getThemeVars()

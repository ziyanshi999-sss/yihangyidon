/**
 * 主题混入
 * 为所有页面提供主题切换功能
 */

import themeManager from '@/utils/theme.js'

export default {
  data() {
    return {
      currentTheme: themeManager.getCurrentTheme(),
      themeColors: themeManager.getThemeConfig(themeManager.getCurrentTheme()).colors
    }
  },
  
  onLoad() {
    // 页面加载时应用当前主题
    this.applyCurrentTheme()
  },
  
  onShow() {
    // 页面显示时检查主题变化
    this.checkThemeChange()
  },
  
  methods: {
    /**
     * 应用当前主题
     */
    applyCurrentTheme() {
      try {
        const currentTheme = themeManager.getCurrentTheme()
        const themeConfig = themeManager.getThemeConfig(currentTheme)
        
        this.currentTheme = currentTheme
        this.themeColors = themeConfig.colors
        
        // 设置页面样式
        this.setPageTheme(currentTheme)
      } catch (error) {
        console.error('应用当前主题失败:', error)
      }
    },
    
    /**
     * 检查主题变化
     */
    checkThemeChange() {
      try {
        const currentTheme = themeManager.getCurrentTheme()
        if (this.currentTheme !== currentTheme) {
          this.applyCurrentTheme()
        }
      } catch (error) {
        console.error('检查主题变化失败:', error)
      }
    },
    
    /**
     * 设置页面主题
     */
    setPageTheme(theme) {
      try {
        // 设置页面根元素的类名
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
        
        // 设置页面数据
        this.currentTheme = theme
        const themeConfig = themeManager.getThemeConfig(theme)
        this.themeColors = themeConfig.colors
        
        console.log('页面主题已更新:', theme)
      } catch (error) {
        console.error('设置页面主题失败:', error)
      }
    },
    
    /**
     * 更新主题（供外部调用）
     */
    updateTheme(theme) {
      this.setPageTheme(theme)
    },
    
    /**
     * 获取主题样式类
     */
    getThemeClass(baseClass = '') {
      return `${baseClass} theme-${this.currentTheme}`.trim()
    },
    
    /**
     * 获取主题样式
     */
    getThemeStyle() {
      return {
        '--theme-primary': this.themeColors.primary,
        '--theme-secondary': this.themeColors.secondary,
        '--theme-background': this.themeColors.background,
        '--theme-card-background': this.themeColors.cardBackground,
        '--theme-text-color': this.themeColors.textColor,
        '--theme-text-secondary': this.themeColors.textSecondary,
        '--theme-border-color': this.themeColors.borderColor,
        '--theme-shadow-color': this.themeColors.shadowColor
      }
    }
  }
}
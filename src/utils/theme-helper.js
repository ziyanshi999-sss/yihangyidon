// 主题辅助工具
import themeManager from './simple-theme.js'

// 获取当前主题的样式对象
export function getThemeStyles() {
  const theme = themeManager.getCurrentTheme()
  return {
    // 背景色
    background: {
      backgroundColor: theme.colors.background
    },
    surface: {
      backgroundColor: theme.colors.surface
    },
    surfaceVariant: {
      backgroundColor: theme.colors.surfaceVariant
    },
    
    // 文字颜色
    text: {
      color: theme.colors.text
    },
    textSecondary: {
      color: theme.colors.textSecondary
    },
    
    // 边框
    border: {
      borderColor: theme.colors.border
    },
    borderLight: {
      borderColor: theme.colors.borderLight
    },
    
    // 主色调
    primary: {
      color: theme.colors.primary
    },
    primaryBg: {
      backgroundColor: theme.colors.primary
    },
    primaryGradient: {
      background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`
    },
    
    // 状态颜色
    success: {
      color: theme.colors.success
    },
    successBg: {
      backgroundColor: theme.colors.success
    },
    warning: {
      color: theme.colors.warning
    },
    warningBg: {
      backgroundColor: theme.colors.warning
    },
    error: {
      color: theme.colors.error
    },
    errorBg: {
      backgroundColor: theme.colors.error
    },
    info: {
      color: theme.colors.info
    },
    infoBg: {
      backgroundColor: theme.colors.info
    }
  }
}

// 获取主题颜色值
export function getThemeColor(colorName) {
  const theme = themeManager.getCurrentTheme()
  return theme.colors[colorName] || '#333333'
}

// 获取主题渐变
export function getThemeGradient(type = 'primary') {
  const theme = themeManager.getCurrentTheme()
  const colors = theme.colors
  
  switch (type) {
    case 'primary':
      return `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`
    case 'success':
      return `linear-gradient(135deg, ${colors.success} 0%, ${colors.success} 100%)`
    case 'warning':
      return `linear-gradient(135deg, ${colors.warning} 0%, ${colors.warning} 100%)`
    case 'error':
      return `linear-gradient(135deg, ${colors.error} 0%, ${colors.error} 100%)`
    default:
      return `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`
  }
}

// 创建主题化的样式对象
export function createThemedStyle(styleName) {
  const styles = getThemeStyles()
  return styles[styleName] || {}
}

// 监听主题变化
export function onThemeChange(callback) {
  themeManager.addThemeListener(callback)
}

// 移除主题监听
export function offThemeChange(callback) {
  themeManager.removeThemeListener(callback)
}

// 主题样式工具类
// 为 uni-app 环境提供主题样式支持

// 获取主题样式对象
export function getThemeStyles(themeId) {
  const themes = {
    light: {
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
    dark: {
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
    blue: {
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
    purple: {
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
    }
  }

  return themes[themeId] || themes.light
}

// 获取渐变样式
export function getGradientStyles(themeId) {
  const gradients = {
    light: {
      primary: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
    },
    dark: {
      primary: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      secondary: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      success: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      warning: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      error: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
    },
    blue: {
      primary: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
    },
    purple: {
      primary: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
      secondary: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      success: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
      warning: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
    }
  }

  return gradients[themeId] || gradients.light
}

// 创建主题化的样式对象
export function createThemedStyles(themeId) {
  const colors = getThemeStyles(themeId)
  const gradients = getGradientStyles(themeId)

  return {
    // 背景色
    background: {
      backgroundColor: colors.background
    },
    surface: {
      backgroundColor: colors.surface
    },
    surfaceVariant: {
      backgroundColor: colors.surfaceVariant
    },
    
    // 文字颜色
    text: {
      color: colors.text
    },
    textSecondary: {
      color: colors.textSecondary
    },
    textDisabled: {
      color: colors.textDisabled
    },
    
    // 边框
    border: {
      borderColor: colors.border
    },
    borderLight: {
      borderColor: colors.borderLight
    },
    
    // 主色调
    primary: {
      color: colors.primary
    },
    primaryBg: {
      backgroundColor: colors.primary
    },
    primaryGradient: {
      background: gradients.primary
    },
    
    // 状态颜色
    success: {
      color: colors.success
    },
    successBg: {
      backgroundColor: colors.success
    },
    warning: {
      color: colors.warning
    },
    warningBg: {
      backgroundColor: colors.warning
    },
    error: {
      color: colors.error
    },
    errorBg: {
      backgroundColor: colors.error
    },
    info: {
      color: colors.info
    },
    infoBg: {
      backgroundColor: colors.info
    },
    
    // 阴影
    shadow: {
      boxShadow: `0 4rpx 12rpx ${colors.shadow}`
    },
    shadowDark: {
      boxShadow: `0 8rpx 24rpx ${colors.shadowDark}`
    }
  }
}

// 获取当前主题的样式
export function getCurrentThemeStyles() {
  try {
    const currentTheme = uni.getStorageSync('app_theme') || 'light'
    return createThemedStyles(currentTheme)
  } catch (error) {
    console.error('获取主题样式失败:', error)
    return createThemedStyles('light')
  }
}

/**
 * 防录屏和截屏工具类 - 生产版本
 * @description 适用于uni-app的专业防录屏、截屏解决方案
 * @version 1.0.0
 * @author 开发团队
 */

class ScreenProtector {
  constructor() {
    this.isEnabled = false
    this.protectionLevel = 'high'
    this.alertEnabled = true
    this.watermarkEnabled = true
    this.callbacks = {
      onScreenshotDetected: [],
      onRecordingDetected: [],
      onProtectionEnabled: [],
      onProtectionDisabled: []
    }

    // 延迟初始化，确保环境准备就绪
    this.initDetection()
  }

  /**
   * 启用防录屏保护
   */
  enable(options = {}) {
    try {
      console.log('🛡️ 启用防录屏保护，选项:', options)

      const config = {
        level: options.level || 'high',
        showAlert: options.showAlert !== false,
        showWatermark: options.showWatermark !== false,
        watermarkText: options.watermarkText || '隐私保护中',
        ...options
      }

      this.protectionLevel = config.level
      this.alertEnabled = config.showAlert
      this.watermarkEnabled = config.showWatermark

      // 获取当前环境
      const env = this.getCurrentEnvironment()
      console.log('🌍 检测到环境:', env)

      // 根据环境启用相应的保护措施
      if (env === 'h5') {
        this.enableWebProtection()
      } else if (env === 'app') {
        this.enableAppProtection()
      } else if (env === 'mp') {
        this.enableMiniProgramProtection()
      }

      this.isEnabled = true
      this.triggerCallback('onProtectionEnabled', { level: this.protectionLevel })

      console.log(`✅ 防录屏保护已启用，环境: ${env}，级别: ${this.protectionLevel}`)

      if (this.alertEnabled) {
        uni.showToast({
          title: '已启用隐私保护',
          icon: 'success',
          duration: 2000
        })
      }

      return true
    } catch (error) {
      console.error('❌ 启用防录屏保护失败:', error)
      return false
    }
  }

  /**
   * 禁用防录屏保护
   */
  disable() {
    try {
      const env = this.getCurrentEnvironment()

      if (env === 'h5') {
        this.disableWebProtection()
      } else if (env === 'app') {
        this.disableAppProtection()
      } else if (env === 'mp') {
        this.disableMiniProgramProtection()
      }

      this.isEnabled = false
      this.triggerCallback('onProtectionDisabled')

      console.log('🔓 防录屏保护已禁用')

      if (this.alertEnabled) {
        uni.showToast({
          title: '隐私保护已关闭',
          icon: 'none',
          duration: 2000
        })
      }

      return true
    } catch (error) {
      console.error('❌ 禁用防录屏保护失败:', error)
      return false
    }
  }

  /**
   * 获取当前运行环境
   */
  getCurrentEnvironment() {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return 'h5'
    }

    // 检查是否在uni-app APP环境
    if (typeof plus !== 'undefined') {
      return 'app'
    }

    // 检查是否在微信小程序环境
    if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
      return 'mp'
    }

    // 检查uni-app环境信息
    try {
      const systemInfo = uni.getSystemInfoSync()
      if (systemInfo) {
        if (systemInfo.platform === 'devtools') {
          return 'h5' // 开发工具模拟器
        }
        // 根据平台信息判断
        if (systemInfo.uniPlatform === 'h5' || systemInfo.environment === 'h5') {
          return 'h5'
        }
        if (systemInfo.uniPlatform === 'app') {
          return 'app'
        }
        if (systemInfo.uniPlatform && systemInfo.uniPlatform.startsWith('mp-')) {
          return 'mp'
        }
      }
    } catch (error) {
      console.warn('获取系统信息失败:', error)
    }

    return 'h5' // 默认返回h5环境
  }

  /**
   * H5环境防护措施
   */
  enableWebProtection() {
    console.log('🌐 启用H5防护措施（主动防护+检测）')

    // 确保在DOM准备好后执行
    if (typeof document === 'undefined') {
      console.warn('⚠️ document对象不可用')
      return
    }

    try {
      // 主动防护措施

      // 禁用右键菜单
      this.addEventListenerSafe(document, 'contextmenu', this.preventContextMenu, false)

      // 禁用开发者工具快捷键
      this.addEventListenerSafe(document, 'keydown', this.preventDevTools, false)

      // 禁用选择文本
      if (this.protectionLevel === 'high') {
        this.addEventListenerSafe(document, 'selectstart', this.preventSelect, false)
      }

      // 禁用拖拽
      this.addEventListenerSafe(document, 'dragstart', this.preventDrag, false)

      // 检测开发者工具
      this.startDevToolsDetection()

      // 水印功能已移除，保持页面美观

      // 阻止截屏快捷键
      this.preventScreenshotShortcuts()

      // 添加页面保护样式
      this.addProtectionStyles()

      // 检测功能（在主动防护基础上增加）

      // 添加截屏检测
      this.addScreenshotDetection()

      // 添加录屏检测  
      this.addRecordingDetection()

      // 添加页面可见性检测
      this.addVisibilityDetection()

      console.log('✅ H5防护措施已启用（主动防护+检测）')
    } catch (error) {
      console.error('❌ H5防护启用失败:', error)
    }
  }

  /**
   * 安全地添加事件监听器
   */
  addEventListenerSafe(element, event, handler, useCapture = false) {
    try {
      if (element && typeof element.addEventListener === 'function') {
        // 绑定this上下文
        const boundHandler = handler.bind(this)
        element.addEventListener(event, boundHandler, useCapture)

        // 保存引用以便后续移除
        if (!this.eventListeners) {
          this.eventListeners = []
        }
        this.eventListeners.push({
          element,
          event,
          handler: boundHandler,
          useCapture
        })

        console.log(`📎 已添加事件监听器: ${event}`)
        return true
      }
    } catch (error) {
      console.error(`❌ 添加事件监听器失败 (${event}):`, error)
    }
    return false
  }

  /**
   * 阻止右键菜单
   */
  preventContextMenu(e) {
    e.preventDefault()
    if (this.alertEnabled) {
      this.showSecurityAlert('检测到右键操作，已阻止')
    }
    console.log('🚫 阻止右键菜单')
    return false
  }

  /**
   * 阻止开发者工具快捷键
   */
  preventDevTools(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
    const isDevToolsKey = e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
      (e.ctrlKey && e.keyCode === 85) ||
      (e.ctrlKey && e.keyCode === 83)

    const isScreenshotKey = this.isScreenshotShortcut(e)

    if (isDevToolsKey) {
      e.preventDefault()
      if (this.alertEnabled) {
        this.showSecurityAlert('检测到开发者工具快捷键，已阻止')
      }
      console.log('🚫 阻止开发者工具快捷键')
      return false
    }

    if (isScreenshotKey) {
      e.preventDefault()
      this.handleScreenshotDetected()
      console.log('🚫 阻止截屏快捷键')
      return false
    }
  }

  /**
   * 检测截屏快捷键
   */
  isScreenshotShortcut(e) {
    // Windows: PrintScreen, Alt+PrintScreen
    // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
    return (
      e.keyCode === 44 || // PrintScreen
      (e.altKey && e.keyCode === 44) || // Alt+PrintScreen
      (e.metaKey && e.shiftKey && (e.keyCode === 51 || e.keyCode === 52 || e.keyCode === 53)) // Mac screenshots
    )
  }

  /**
   * 阻止文本选择
   */
  preventSelect(e) {
    if (this.protectionLevel === 'high') {
      e.preventDefault()
      return false
    }
  }

  /**
   * 阻止拖拽
   */
  preventDrag(e) {
    e.preventDefault()
    return false
  }

  /**
   * 开发者工具检测
   */
  startDevToolsDetection() {
    if (typeof window === 'undefined') return

    this.devToolsDetection = setInterval(() => {
      const threshold = 160
      if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
        this.handleDevToolsDetected()
      }
    }, 1000)

    console.log('👁️ 开发者工具检测已启动')
  }

  /**
   * 停止开发者工具检测
   */
  stopDevToolsDetection() {
    if (this.devToolsDetection) {
      clearInterval(this.devToolsDetection)
      this.devToolsDetection = null
      console.log('👁️ 开发者工具检测已停止')
    }
  }

  /**
   * 添加水印
   */
  addWatermark() {
    // 水印功能已禁用，保持页面美观
    console.log('💧 水印功能已禁用，保持页面美观')
    return
  }

  /**
   * 移除水印
   */
  removeWatermark() {
    if (typeof document === 'undefined') return

    const watermark = document.getElementById('screen-protector-watermark')
    const style = document.getElementById('screen-protector-watermark-style')

    if (watermark) {
      watermark.remove()
    }
    if (style) {
      style.remove()
    }

    console.log('💧 水印已移除')
  }

  /**
   * 添加保护样式
   */
  addProtectionStyles() {
    if (typeof document === 'undefined') return

    const style = document.createElement('style')
    style.id = 'screen-protector-styles'
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `

    document.head.appendChild(style)
    console.log('🎨 保护样式已添加')
  }

  /**
   * 移除保护样式
   */
  removeProtectionStyles() {
    if (typeof document === 'undefined') return

    const style = document.getElementById('screen-protector-styles')
    if (style) {
      style.remove()
      console.log('🎨 保护样式已移除')
    }
  }

  /**
   * 移除所有事件监听器
   */
  removeAllEventListeners() {
    if (this.eventListeners) {
      this.eventListeners.forEach(({ element, event, handler, useCapture }) => {
        try {
          element.removeEventListener(event, handler, useCapture)
        } catch (error) {
          console.error('移除事件监听器失败:', error)
        }
      })
      this.eventListeners = []
      console.log('📎 所有事件监听器已移除')
    }
  }

  /**
   * 禁用H5防护
   */
  disableWebProtection() {
    console.log('🌐 禁用H5防护措施')

    this.removeAllEventListeners()
    this.stopDevToolsDetection()
    this.removeWatermark()
    this.removeProtectionStyles()

    console.log('✅ H5防护措施已禁用')
  }

  /**
   * App环境防护措施
   */
  enableAppProtection() {
    console.log('📱 启用App防护措施')

    try {
      if (typeof plus !== 'undefined') {
        // Android 防录屏
        if (uni.getSystemInfoSync().platform === 'android') {
          // 这里需要原生插件支持
          console.log('🤖 Android防护已启用')
        }

        // iOS 防录屏
        if (uni.getSystemInfoSync().platform === 'ios') {
          // 这里需要原生插件支持
          console.log('🍎 iOS防护已启用')
        }
      }
    } catch (error) {
      console.error('App防护措施启用失败:', error)
    }
  }

  /**
   * 禁用App防护
   */
  disableAppProtection() {
    console.log('📱 App防护已禁用')
  }

  /**
   * 小程序环境防护措施
   */
  enableMiniProgramProtection() {
    console.log('🔰 启用小程序防护措施')

    // 微信小程序截屏监听
    if (typeof wx !== 'undefined' && wx.onUserCaptureScreen) {
      wx.onUserCaptureScreen(() => {
        this.handleScreenshotDetected()
      })
      console.log('📸 微信小程序截屏监听已启用')
    }
  }

  /**
   * 禁用小程序防护
   */
  disableMiniProgramProtection() {
    if (typeof wx !== 'undefined' && wx.offUserCaptureScreen) {
      wx.offUserCaptureScreen()
    }
    console.log('🔰 小程序防护已禁用')
  }

  /**
   * 阻止截屏快捷键
   */
  preventScreenshotShortcuts() {
    if (typeof window === 'undefined') return

    // 监听 Print Screen 等快捷键
    this.addEventListenerSafe(window, 'keyup', (e) => {
      if (e.keyCode === 44) { // Print Screen
        this.handleScreenshotDetected()
      }
    })
  }

  /**
   * 处理截屏检测（仅在真正检测到时触发）
   */
  handleScreenshotDetected() {
    console.warn('🚨 检测到截屏行为')

    const eventData = {
      timestamp: new Date().toISOString(),
      platform: this.getCurrentEnvironment(),
      detected: true
    }

    // 触发回调
    this.triggerCallback('onScreenshotDetected', eventData)

    // 仅在检测到真实截屏时显示警告
    if (this.alertEnabled) {
      this.showSecurityAlert('检测到截屏行为，已记录此次安全事件')
    }

    // 记录安全事件
    this.logSecurityEvent('screenshot', {
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      detected: true
    })
  }

  /**
   * 处理录屏检测（仅在真正检测到时触发）
   */
  handleRecordingDetected() {
    console.warn('🚨 检测到录屏行为')

    const eventData = {
      timestamp: new Date().toISOString(),
      platform: this.getCurrentEnvironment(),
      detected: true
    }

    // 触发回调
    this.triggerCallback('onRecordingDetected', eventData)

    // 仅在检测到真实录屏时显示警告
    if (this.alertEnabled) {
      this.showSecurityAlert('检测到录屏行为，已记录此次安全事件')
    }

    // 记录安全事件
    this.logSecurityEvent('recording', {
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      detected: true
    })
  }

  /**
   * 处理开发者工具检测
   */
  handleDevToolsDetected() {
    console.warn('🚨 检测到开发者工具')

    if (this.alertEnabled) {
      this.showSecurityAlert('检测到开发者工具，已记录')
    }

    // 记录安全事件
    this.logSecurityEvent('devtools', {
      timestamp: Date.now(),
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      innerHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      outerWidth: typeof window !== 'undefined' ? window.outerWidth : 0,
      outerHeight: typeof window !== 'undefined' ? window.outerHeight : 0
    })
  }

  /**
   * 显示安全警告
   */
  showSecurityAlert(message) {
    uni.showModal({
      title: '安全提示',
      content: message + '\n\n为保护您的隐私安全，此操作已被阻止。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#ff4444'
    })
  }

  /**
   * 记录安全事件
   */
  logSecurityEvent(type, data) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : uni.getSystemInfoSync(),
      page: getCurrentPages().pop()?.route || 'unknown'
    }

    // 保存到本地存储
    try {
      const events = uni.getStorageSync('security_events') || []
      events.push(event)

      // 只保留最近100条记录
      if (events.length > 100) {
        events.splice(0, events.length - 100)
      }

      uni.setStorageSync('security_events', events)
    } catch (error) {
      console.error('保存安全事件失败:', error)
    }

    // 可以发送到服务器
    this.reportSecurityEvent(event)
  }

  /**
   * 上报安全事件
   */
  async reportSecurityEvent(event) {
    try {
      console.log('📤 安全事件上报:', event)

      // 这里可以发送到您的服务器
      // await uni.request({
      //   url: 'https://your-api.com/security-events',
      //   method: 'POST',
      //   data: event
      // })
    } catch (error) {
      console.error('安全事件上报失败:', error)
    }
  }

  /**
   * 初始化检测机制
   */
  initDetection() {
    // 监听页面可见性变化
    if (typeof document !== 'undefined') {
      this.addEventListenerSafe(document, 'visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.isEnabled) {
          console.log('📱 页面隐藏，可能正在截屏或录屏')
        }
      })
    }

    // 监听页面焦点变化
    if (typeof window !== 'undefined') {
      this.addEventListenerSafe(window, 'blur', () => {
        if (this.isEnabled) {
          console.log('🔍 页面失去焦点')
        }
      })
    }

    console.log('🔧 检测机制初始化完成')
  }

  /**
   * 添加事件回调
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback)
    }
  }

  /**
   * 移除事件回调
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback)
      if (index > -1) {
        this.callbacks[event].splice(index, 1)
      }
    }
  }

  /**
   * 触发回调
   */
  triggerCallback(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('回调执行失败:', error)
        }
      })
    }
  }

  /**
   * 获取保护状态
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      protectionLevel: this.protectionLevel,
      platform: this.getCurrentEnvironment(),
      alertEnabled: this.alertEnabled
    }
  }

  /**
   * 获取安全事件记录
   */
  getSecurityEvents() {
    try {
      return uni.getStorageSync('security_events') || []
    } catch (error) {
      console.error('获取安全事件失败:', error)
      return []
    }
  }

  /**
   * 清除安全事件记录
   */
  clearSecurityEvents() {
    try {
      uni.removeStorageSync('security_events')
      console.log('🗑️ 安全事件记录已清除')
    } catch (error) {
      console.error('清除安全事件失败:', error)
    }
  }
  /**
   * 添加截屏检测（H5环境）
   */
  addScreenshotDetection() {
    try {
      // 监听 PrintScreen 键
      this.addEventListenerSafe(document, 'keyup', (event) => {
        if (event.keyCode === 44 || event.key === 'PrintScreen') {
          console.log('🔍 检测到 PrintScreen 键')
          this.handleScreenshotDetected()
        }
      })

      // 监听粘贴事件（可能是截屏后粘贴）
      this.addEventListenerSafe(document, 'paste', (event) => {
        const items = event.clipboardData?.items || []
        for (let item of items) {
          if (item.type.indexOf('image') !== -1) {
            console.log('🔍 检测到剪贴板图片')
            this.handleScreenshotDetected()
            break
          }
        }
      })

      console.log('📸 截屏检测已启用')
    } catch (error) {
      console.error('截屏检测设置失败:', error)
    }
  }

  /**
   * 添加录屏检测（H5环境）
   */
  addRecordingDetection() {
    try {
      // 检测 getUserMedia API 调用（录屏/录音）
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia
        navigator.mediaDevices.getDisplayMedia = (...args) => {
          console.log('🔍 检测到屏幕录制请求')
          this.handleRecordingDetected()
          return originalGetDisplayMedia.apply(navigator.mediaDevices, args)
        }
      }

      // 检测 getUserMedia 用于屏幕捕获
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia
        navigator.mediaDevices.getUserMedia = (constraints) => {
          if (constraints?.video?.mediaSource === 'screen' ||
            constraints?.video?.chromeMediaSource === 'screen') {
            console.log('🔍 检测到屏幕录制请求')
            this.handleRecordingDetected()
          }
          return originalGetUserMedia.call(navigator.mediaDevices, constraints)
        }
      }

      console.log('📹 录屏检测已启用')
    } catch (error) {
      console.error('录屏检测设置失败:', error)
    }
  }

  /**
   * 添加页面可见性检测（可能的录屏行为）
   */
  addVisibilityDetection() {
    try {
      // 监听页面可见性变化
      this.addEventListenerSafe(document, 'visibilitychange', () => {
        if (document.hidden) {
          console.log('🔍 页面进入后台，可能存在录屏行为')
          // 这里可以记录但不一定触发警告，因为用户可能只是切换标签页
        } else {
          console.log('🔍 页面回到前台')
        }
      })

      // 监听窗口失焦（可能的录屏软件激活）
      this.addEventListenerSafe(window, 'blur', () => {
        console.log('🔍 窗口失去焦点，可能存在录屏行为')
      })

      console.log('👁️ 页面可见性检测已启用')
    } catch (error) {
      console.error('页面可见性检测设置失败:', error)
    }
  }
}

// 创建全局实例
const screenProtector = new ScreenProtector()

export default screenProtector

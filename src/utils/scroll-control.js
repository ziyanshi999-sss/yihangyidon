/**
 * 滚动控制工具类
 * 用于处理页面滚动穿透问题，特别是在弹窗、聊天界面等场景下
 */

class ScrollControl {
  constructor() {
    this.isLocked = false
    this.originalOverflow = ''
    this.originalPosition = ''
    this.originalTop = ''
    this.scrollTop = 0
    this.lockCount = 0
  }

  /**
   * 锁定页面滚动
   * @param {Object} options 配置选项
   */
  lockScroll(options = {}) {
    if (this.isLocked) {
      this.lockCount++
      return
    }

    try {
      // 获取当前滚动位置
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      
      // 保存原始样式
      const body = document.body
      const html = document.documentElement
      
      this.originalOverflow = body.style.overflow
      this.originalPosition = body.style.position
      this.originalTop = body.style.top
      
      // 锁定滚动
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${this.scrollTop}px`
      body.style.width = '100%'
      
      // 防止iOS Safari的弹性滚动
      if (options.preventIOSBounce !== false) {
        body.style.webkitOverflowScrolling = 'auto'
        html.style.overflow = 'hidden'
        html.style.position = 'fixed'
        html.style.top = `-${this.scrollTop}px`
        html.style.width = '100%'
      }
      
      this.isLocked = true
      this.lockCount = 1
      
      console.log('页面滚动已锁定')
    } catch (error) {
      console.error('锁定滚动失败:', error)
    }
  }

  /**
   * 解锁页面滚动
   */
  unlockScroll() {
    if (!this.isLocked) {
      return
    }

    this.lockCount--
    if (this.lockCount > 0) {
      return
    }

    try {
      const body = document.body
      const html = document.documentElement
      
      // 恢复原始样式
      body.style.overflow = this.originalOverflow
      body.style.position = this.originalPosition
      body.style.top = this.originalTop
      body.style.width = ''
      
      // 恢复iOS Safari样式
      body.style.webkitOverflowScrolling = ''
      html.style.overflow = ''
      html.style.position = ''
      html.style.top = ''
      html.style.width = ''
      
      // 恢复滚动位置
      window.scrollTo(0, this.scrollTop)
      
      this.isLocked = false
      this.lockCount = 0
      
      console.log('页面滚动已解锁')
    } catch (error) {
      console.error('解锁滚动失败:', error)
    }
  }

  /**
   * 处理聊天界面的滚动控制
   * @param {boolean} isOpen 是否打开聊天界面
   * @param {HTMLElement} chatContainer 聊天容器元素
   */
  handleChatScroll(isOpen, chatContainer) {
    if (isOpen) {
      this.lockScroll()
      
      // 如果提供了聊天容器，确保其可以滚动
      if (chatContainer) {
        chatContainer.style.overflowY = 'auto'
        chatContainer.style.webkitOverflowScrolling = 'touch'
      }
    } else {
      this.unlockScroll()
    }
  }

  /**
   * 强制解锁所有滚动锁定
   */
  forceUnlock() {
    try {
      const body = document.body
      const html = document.documentElement
      
      // 重置所有样式
      body.style.overflow = ''
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''
      body.style.webkitOverflowScrolling = ''
      
      html.style.overflow = ''
      html.style.position = ''
      html.style.top = ''
      html.style.width = ''
      
      this.isLocked = false
      this.lockCount = 0
      
      console.log('强制解锁页面滚动')
    } catch (error) {
      console.error('强制解锁滚动失败:', error)
    }
  }

  /**
   * 获取当前锁定状态
   */
  getLockStatus() {
    return {
      isLocked: this.isLocked,
      lockCount: this.lockCount,
      scrollTop: this.scrollTop
    }
  }

  /**
   * 处理页面可见性变化
   */
  handleVisibilityChange() {
    if (document.hidden && this.isLocked) {
      // 页面隐藏时解锁滚动，避免影响其他应用
      this.forceUnlock()
    }
  }

  /**
   * 处理页面卸载
   */
  handlePageUnload() {
    this.forceUnlock()
  }
}

// 创建单例实例
const scrollControl = new ScrollControl()

// 监听页面可见性变化
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    scrollControl.handleVisibilityChange()
  })

  // 监听页面卸载
  window.addEventListener('beforeunload', () => {
    scrollControl.handlePageUnload()
  })

  // 监听页面隐藏（移动端）
  window.addEventListener('pagehide', () => {
    scrollControl.handlePageUnload()
  })
}

// 导出单例实例
export default scrollControl

// 兼容性导出
export { scrollControl }

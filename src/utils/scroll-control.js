/**
 * 滚动控制工具
 * 解决页面滚动穿透问题
 */

class ScrollControl {
  constructor() {
    this.isLocked = false
    this.originalOverflow = ''
    this.originalPosition = ''
    this.originalTop = ''
  }

  /**
   * 锁定页面滚动
   */
  lockScroll() {
    if (this.isLocked) return

    try {
      // 获取当前滚动位置
      this.originalTop = window.pageYOffset || document.documentElement.scrollTop
      
      // 保存原始样式
      const body = document.body
      const html = document.documentElement
      
      this.originalOverflow = body.style.overflow
      this.originalPosition = body.style.position
      
      // 锁定滚动
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${this.originalTop}px`
      body.style.width = '100%'
      
      // 在uni-app中也需要处理
      if (typeof uni !== 'undefined') {
        // 禁用页面滚动
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
      
      this.isLocked = true
      console.log('页面滚动已锁定')
    } catch (error) {
      console.error('锁定滚动失败:', error)
    }
  }

  /**
   * 解锁页面滚动
   */
  unlockScroll() {
    if (!this.isLocked) return

    try {
      const body = document.body
      
      // 恢复原始样式
      body.style.overflow = this.originalOverflow
      body.style.position = this.originalPosition
      body.style.top = ''
      body.style.width = ''
      
      // 恢复滚动位置
      if (this.originalTop !== '') {
        window.scrollTo(0, this.originalTop)
      }
      
      this.isLocked = false
      console.log('页面滚动已解锁')
    } catch (error) {
      console.error('解锁滚动失败:', error)
    }
  }

  /**
   * 切换滚动锁定状态
   */
  toggleScroll() {
    if (this.isLocked) {
      this.unlockScroll()
    } else {
      this.lockScroll()
    }
  }

  /**
   * 检查滚动锁定状态
   */
  isScrollLocked() {
    return this.isLocked
  }

  /**
   * 强制锁定滚动（用于弹窗等场景）
   */
  forceLockScroll() {
    this.lockScroll()
    
    // 添加额外的锁定措施
    try {
      const body = document.body
      body.style.touchAction = 'none'
      body.style.userSelect = 'none'
      
      // 阻止触摸事件
      body.addEventListener('touchmove', this.preventDefault, { passive: false })
      body.addEventListener('wheel', this.preventDefault, { passive: false })
    } catch (error) {
      console.error('强制锁定滚动失败:', error)
    }
  }

  /**
   * 强制解锁滚动
   */
  forceUnlockScroll() {
    this.unlockScroll()
    
    try {
      const body = document.body
      body.style.touchAction = ''
      body.style.userSelect = ''
      
      // 移除事件监听器
      body.removeEventListener('touchmove', this.preventDefault)
      body.removeEventListener('wheel', this.preventDefault)
    } catch (error) {
      console.error('强制解锁滚动失败:', error)
    }
  }

  /**
   * 阻止默认事件
   */
  preventDefault(e) {
    e.preventDefault()
  }

  /**
   * 处理弹窗滚动穿透
   */
  handleModalScroll(show, modalElement) {
    if (show) {
      this.lockScroll()
      if (modalElement) {
        // 确保弹窗内容可以滚动
        modalElement.style.overflow = 'auto'
        modalElement.style.maxHeight = '100vh'
      }
    } else {
      this.unlockScroll()
    }
  }

  /**
   * 处理聊天窗口滚动穿透
   */
  handleChatScroll(show, chatElement) {
    if (show) {
      this.forceLockScroll()
      if (chatElement) {
        // 确保聊天窗口内容可以滚动
        chatElement.style.overflow = 'auto'
        chatElement.style.maxHeight = '100vh'
        chatElement.style.position = 'fixed'
        chatElement.style.top = '0'
        chatElement.style.left = '0'
        chatElement.style.width = '100%'
        chatElement.style.height = '100%'
        chatElement.style.zIndex = '9999'
      }
    } else {
      this.forceUnlockScroll()
    }
  }

  /**
   * 处理页面切换时的滚动
   */
  handlePageScroll(pageName, show) {
    if (show) {
      this.lockScroll()
      console.log(`页面 ${pageName} 滚动已锁定`)
    } else {
      this.unlockScroll()
      console.log(`页面 ${pageName} 滚动已解锁`)
    }
  }

  /**
   * 重置滚动控制
   */
  reset() {
    this.forceUnlockScroll()
    this.isLocked = false
    this.originalOverflow = ''
    this.originalPosition = ''
    this.originalTop = ''
  }
}

// 创建单例实例
const scrollControl = new ScrollControl()

export default scrollControl

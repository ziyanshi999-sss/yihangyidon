/**
 * 摄像头诊断工具
 * 用于检测和诊断摄像头相关问题
 */

export class CameraDiagnostic {
  constructor() {
    this.platform = this.getPlatform()
    this.diagnosticResults = {
      platform: this.platform,
      cameraSupported: false,
      permissionGranted: false,
      hardwareAvailable: false,
      errors: [],
      suggestions: []
    }
  }

  // 获取当前平台
  getPlatform() {
    // #ifdef H5
    return 'h5'
    // #endif
    
    // #ifdef APP-PLUS
    return 'app'
    // #endif
    
    // #ifdef MP-WEIXIN
    return 'mp-weixin'
    // #endif
    
    // #ifdef MP-ALIPAY
    return 'mp-alipay'
    // #endif
    
    return 'unknown'
  }

  // 执行完整的摄像头诊断
  async runDiagnostic() {
    console.log('开始摄像头诊断...')
    
    try {
      // 检查平台支持
      await this.checkPlatformSupport()
      
      // 检查硬件可用性
      await this.checkHardwareAvailability()
      
      // 检查权限状态
      await this.checkPermissions()
      
      // 生成建议
      this.generateSuggestions()
      
      console.log('摄像头诊断完成:', this.diagnosticResults)
      return this.diagnosticResults
    } catch (error) {
      console.error('摄像头诊断失败:', error)
      this.diagnosticResults.errors.push(`诊断过程出错: ${error.message}`)
      return this.diagnosticResults
    }
  }

  // 检查平台支持
  async checkPlatformSupport() {
    switch (this.platform) {
      case 'h5':
        await this.checkH5Support()
        break
      case 'app':
        await this.checkAppSupport()
        break
      case 'mp-weixin':
        await this.checkMpWeixinSupport()
        break
      default:
        this.diagnosticResults.errors.push('不支持的平台')
    }
  }

  // 检查H5平台支持
  async checkH5Support() {
    // 检查浏览器API支持
    if (!navigator.mediaDevices) {
      this.diagnosticResults.errors.push('浏览器不支持 MediaDevices API')
      return
    }

    if (!navigator.mediaDevices.getUserMedia) {
      this.diagnosticResults.errors.push('浏览器不支持 getUserMedia API')
      return
    }

    this.diagnosticResults.cameraSupported = true

    // 检查HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      this.diagnosticResults.errors.push('摄像头功能需要HTTPS协议')
    }
  }

  // 检查APP平台支持
  async checkAppSupport() {
    this.diagnosticResults.cameraSupported = true
    // APP平台通常支持摄像头，主要检查权限
  }

  // 检查微信小程序支持
  async checkMpWeixinSupport() {
    this.diagnosticResults.cameraSupported = true
    // 小程序平台支持摄像头组件
  }

  // 检查硬件可用性
  async checkHardwareAvailability() {
    if (this.platform === 'h5') {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
        if (videoDevices.length === 0) {
          this.diagnosticResults.errors.push('未检测到摄像头设备')
        } else {
          this.diagnosticResults.hardwareAvailable = true
          console.log(`检测到 ${videoDevices.length} 个摄像头设备`)
        }
      } catch (error) {
        this.diagnosticResults.errors.push(`硬件检测失败: ${error.message}`)
      }
    } else {
      // 对于非H5平台，假设硬件可用
      this.diagnosticResults.hardwareAvailable = true
    }
  }

  // 检查权限状态
  async checkPermissions() {
    switch (this.platform) {
      case 'h5':
        await this.checkH5Permissions()
        break
      case 'app':
        await this.checkAppPermissions()
        break
      case 'mp-weixin':
        await this.checkMpPermissions()
        break
    }
  }

  // 检查H5权限
  async checkH5Permissions() {
    try {
      // 尝试获取摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      
      this.diagnosticResults.permissionGranted = true
      
      // 立即停止流
      stream.getTracks().forEach(track => track.stop())
      
    } catch (error) {
      this.diagnosticResults.permissionGranted = false
      
      if (error.name === 'NotAllowedError') {
        this.diagnosticResults.errors.push('摄像头权限被拒绝')
      } else if (error.name === 'NotFoundError') {
        this.diagnosticResults.errors.push('未找到摄像头设备')
      } else if (error.name === 'NotReadableError') {
        this.diagnosticResults.errors.push('摄像头被其他应用占用')
      } else {
        this.diagnosticResults.errors.push(`摄像头访问失败: ${error.message}`)
      }
    }
  }

  // 检查APP权限
  async checkAppPermissions() {
    // 在APP中，权限检查通常需要调用原生API
    // 这里简化处理
    this.diagnosticResults.permissionGranted = true
  }

  // 检查小程序权限
  async checkMpPermissions() {
    return new Promise((resolve) => {
      uni.getSetting({
        success: (res) => {
          const cameraAuth = res.authSetting['scope.camera']
          
          if (cameraAuth === true) {
            this.diagnosticResults.permissionGranted = true
          } else if (cameraAuth === false) {
            this.diagnosticResults.permissionGranted = false
            this.diagnosticResults.errors.push('小程序摄像头权限被拒绝')
          } else {
            // 未授权状态
            this.diagnosticResults.permissionGranted = false
            this.diagnosticResults.errors.push('小程序摄像头权限未授权')
          }
          
          resolve()
        },
        fail: () => {
          this.diagnosticResults.errors.push('获取小程序权限状态失败')
          resolve()
        }
      })
    })
  }

  // 生成修复建议
  generateSuggestions() {
    const { errors } = this.diagnosticResults
    
    if (errors.length === 0) {
      this.diagnosticResults.suggestions.push('摄像头功能正常')
      return
    }

    // 根据错误类型生成具体建议
    errors.forEach(error => {
      if (error.includes('浏览器不支持')) {
        this.diagnosticResults.suggestions.push('请使用Chrome、Firefox、Safari等现代浏览器')
      } else if (error.includes('HTTPS')) {
        this.diagnosticResults.suggestions.push('请在HTTPS环境下使用摄像头功能')
      } else if (error.includes('权限被拒绝')) {
        this.diagnosticResults.suggestions.push('请在浏览器/系统设置中允许摄像头权限')
      } else if (error.includes('未检测到摄像头')) {
        this.diagnosticResults.suggestions.push('请检查摄像头设备连接')
      } else if (error.includes('被占用')) {
        this.diagnosticResults.suggestions.push('请关闭其他使用摄像头的应用')
      } else if (error.includes('小程序')) {
        this.diagnosticResults.suggestions.push('请在小程序中重新授权摄像头权限')
      }
    })

    // 通用建议
    this.diagnosticResults.suggestions.push('如问题仍然存在，请联系客服')
  }

  // 获取诊断报告文本
  getReportText() {
    const { platform, cameraSupported, permissionGranted, hardwareAvailable, errors, suggestions } = this.diagnosticResults
    
    let report = `摄像头诊断报告\n\n`
    report += `平台: ${platform}\n`
    report += `摄像头支持: ${cameraSupported ? '是' : '否'}\n`
    report += `权限状态: ${permissionGranted ? '已授权' : '未授权'}\n`
    report += `硬件可用: ${hardwareAvailable ? '是' : '否'}\n\n`
    
    if (errors.length > 0) {
      report += `发现问题:\n`
      errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`
      })
      report += `\n`
    }
    
    if (suggestions.length > 0) {
      report += `建议解决方案:\n`
      suggestions.forEach((suggestion, index) => {
        report += `${index + 1}. ${suggestion}\n`
      })
    }
    
    return report
  }
}

// 便捷方法
export async function runCameraDiagnostic() {
  const diagnostic = new CameraDiagnostic()
  return await diagnostic.runDiagnostic()
}

export default CameraDiagnostic

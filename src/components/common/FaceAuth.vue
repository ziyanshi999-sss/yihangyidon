<template>
  <view class="face-auth-container" v-if="show">
    <view class="face-auth-modal">
      <!-- 头部 -->
      <view class="auth-header">
        <text class="auth-title">人脸认证</text>
        <text class="close-btn" @tap="closeAuth">✕</text>
      </view>

      <!-- 认证内容 -->
      <view class="auth-content">
        <!-- 摄像头预览区域 -->
        <view class="camera-container">
          <camera 
            v-if="cameraSupported"
            class="camera-preview"
            device-position="front"
            flash="off"
            @initdone="onCameraInit"
            @error="onCameraError"
            ref="camera">
          </camera>
          
          <!-- 摄像头不可用提示 -->
          <view v-else class="camera-unavailable">
            <view class="unavailable-icon">📹</view>
            <text class="unavailable-text">摄像头不可用</text>
            <text class="unavailable-desc">{{ statusText }}</text>
          </view>
          
          <!-- 人脸框 -->
          <view class="face-frame">
            <view class="frame-corner tl"></view>
            <view class="frame-corner tr"></view>
            <view class="frame-corner bl"></view>
            <view class="frame-corner br"></view>
          </view>

          <!-- 状态提示 -->
          <view class="status-overlay">
            <text class="status-text">{{ statusText }}</text>
            <view class="progress-bar" v-if="showProgress">
              <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
            </view>
          </view>
        </view>

        <!-- 操作指引 -->
        <view class="auth-guide">
          <view class="guide-item" :class="{ active: currentStep === 'blink', completed: steps.blink }">
            <view class="guide-icon">👁️</view>
            <text class="guide-text">请眨眼</text>
            <view class="guide-status" v-if="steps.blink">✓</view>
          </view>
          
          <view class="guide-item" :class="{ active: currentStep === 'turnLeft', completed: steps.turnLeft }">
            <view class="guide-icon">👈</view>
            <text class="guide-text">向左转头</text>
            <view class="guide-status" v-if="steps.turnLeft">✓</view>
          </view>
          
          <view class="guide-item" :class="{ active: currentStep === 'turnRight', completed: steps.turnRight }">
            <view class="guide-icon">👉</view>
            <text class="guide-text">向右转头</text>
            <view class="guide-status" v-if="steps.turnRight">✓</view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="auth-actions">
          <button class="action-btn cancel" @tap="closeAuth">取消</button>
          <button class="action-btn start" @tap="startAuth" v-if="!authStarted && cameraSupported && cameraReady">开始认证</button>
          <button class="action-btn retry" @tap="retryAuth" v-if="authFailed">重新认证</button>
          <button class="action-btn disabled" v-if="!cameraSupported" disabled>摄像头不可用</button>
          <button class="action-btn retry" @tap="retryCamera" v-if="cameraSupported && !cameraReady && errorRetryCount > 0">重试连接</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { runCameraDiagnostic } from '@/utils/camera-diagnostic.js'

export default {
  name: 'FaceAuth',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      authStarted: false,
      authCompleted: false,
      authFailed: false,
      currentStep: 'init', // init, blink, turnLeft, turnRight, completed
      steps: {
        blink: false,
        turnLeft: false,
        turnRight: false
      },
      statusText: '请将面部对准摄像头',
      showProgress: false,
      progressPercent: 0,
      cameraReady: false,
      authTimer: null,
      stepTimer: null,
      blinkDetected: false,
      headDirection: 'center', // center, left, right
      platform: '',
      cameraSupported: true,
      errorRetryCount: 0,
      maxRetryCount: 3
    }
  },
  mounted() {
    this.initPlatform()
  },
  methods: {
    // 初始化平台检测
    initPlatform() {
      // 检测当前运行平台
      // #ifdef H5
      this.platform = 'h5'
      this.checkH5CameraSupport()
      // #endif
      
      // #ifdef APP-PLUS
      this.platform = 'app'
      this.checkAppCameraPermission()
      // #endif
      
      // #ifdef MP-WEIXIN
      this.platform = 'mp-weixin'
      this.checkMpCameraAuth()
      // #endif
      
      console.log('当前平台:', this.platform)
    },

    // 检查H5摄像头支持
    checkH5CameraSupport() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.cameraSupported = false
        this.statusText = '当前浏览器不支持摄像头功能'
        console.warn('浏览器不支持getUserMedia')
        return
      }
      
      // 请求摄像头权限
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          console.log('H5摄像头权限获取成功')
          stream.getTracks().forEach(track => track.stop()) // 停止预览
          this.cameraSupported = true
        })
        .catch(error => {
          console.error('H5摄像头权限获取失败:', error)
          this.cameraSupported = false
          this.statusText = '摄像头权限被拒绝，请允许访问摄像头'
        })
    },

    // 检查APP摄像头权限
    checkAppCameraPermission() {
      // APP平台的摄像头权限检查
      console.log('检查APP摄像头权限')
      // 这里可以添加具体的权限检查逻辑
    },

    // 检查小程序摄像头授权
    checkMpCameraAuth() {
      uni.getSetting({
        success: (res) => {
          if (res.authSetting['scope.camera'] === false) {
            this.cameraSupported = false
            this.statusText = '需要摄像头权限才能进行人脸认证'
            console.warn('小程序摄像头权限被拒绝')
          }
        }
      })
    },

    // 摄像头初始化完成
    onCameraInit() {
      console.log('摄像头初始化成功')
      this.cameraReady = true
      this.errorRetryCount = 0
      this.statusText = '摄像头已就绪，点击开始认证'
    },

    // 摄像头错误
    onCameraError(error) {
      console.error('摄像头错误:', error)
      this.errorRetryCount++
      
      let errorMessage = '摄像头启动失败'
      let statusMessage = '摄像头启动失败，请检查权限'
      
      // 根据平台和错误类型提供具体的解决方案
      if (this.platform === 'h5') {
        errorMessage = '浏览器摄像头访问失败'
        statusMessage = '请允许浏览器访问摄像头权限'
      } else if (this.platform === 'app') {
        errorMessage = 'APP摄像头权限不足'
        statusMessage = '请在系统设置中允许APP使用摄像头'
      } else if (this.platform === 'mp-weixin') {
        errorMessage = '小程序摄像头授权失败'
        statusMessage = '请授权小程序使用摄像头功能'
      }
      
      this.statusText = statusMessage
      this.cameraReady = false
      
      // 显示具体的错误信息和重试选项
      if (this.errorRetryCount < this.maxRetryCount) {
        uni.showModal({
          title: errorMessage,
          content: `${statusMessage}\n\n是否重试？（${this.errorRetryCount}/${this.maxRetryCount}）`,
          success: (res) => {
            if (res.confirm) {
              this.retryCamera()
            } else {
              this.handleCameraFailure()
            }
          }
        })
      } else {
        this.handleCameraFailure()
      }
    },

    // 重试摄像头初始化
    retryCamera() {
      setTimeout(() => {
        this.statusText = '正在重新初始化摄像头...'
        this.initPlatform()
      }, 1000)
    },

    // 处理摄像头完全失败的情况
    async handleCameraFailure() {
      this.cameraSupported = false
      this.statusText = '摄像头功能不可用'
      
      uni.showModal({
        title: '摄像头不可用',
        content: '由于摄像头无法正常工作，人脸认证功能暂时不可用。您可以：\n\n1. 查看诊断报告\n2. 检查设备摄像头权限\n3. 联系客服寻求帮助',
        showCancel: true,
        cancelText: '诊断报告',
        confirmText: '我知道了',
        success: async (res) => {
          if (res.cancel) {
            // 显示诊断报告
            await this.showDiagnosticReport()
          }
          this.closeAuth()
        }
      })
    },

    // 显示摄像头诊断报告
    async showDiagnosticReport() {
      try {
        uni.showLoading({ title: '正在诊断...' })
        
        const diagnosticResult = await runCameraDiagnostic()
        
        uni.hideLoading()
        
        // 生成诊断报告文本
        let reportText = `诊断结果:\n\n`
        reportText += `平台: ${diagnosticResult.platform}\n`
        reportText += `摄像头支持: ${diagnosticResult.cameraSupported ? '是' : '否'}\n`
        reportText += `权限状态: ${diagnosticResult.permissionGranted ? '已授权' : '未授权'}\n`
        reportText += `硬件可用: ${diagnosticResult.hardwareAvailable ? '是' : '否'}\n\n`
        
        if (diagnosticResult.errors.length > 0) {
          reportText += `发现问题:\n`
          diagnosticResult.errors.forEach((error, index) => {
            reportText += `${index + 1}. ${error}\n`
          })
          reportText += `\n`
        }
        
        if (diagnosticResult.suggestions.length > 0) {
          reportText += `建议:\n`
          diagnosticResult.suggestions.forEach((suggestion, index) => {
            reportText += `${index + 1}. ${suggestion}\n`
          })
        }
        
        uni.showModal({
          title: '摄像头诊断报告',
          content: reportText,
          showCancel: true,
          cancelText: '联系客服',
          confirmText: '确定',
          success: (res) => {
            if (res.cancel) {
              this.contactSupport()
            }
          }
        })
        
      } catch (error) {
        uni.hideLoading()
        console.error('诊断失败:', error)
        uni.showToast({
          title: '诊断失败',
          icon: 'error'
        })
      }
    },

    // 联系客服
    contactSupport() {
      uni.showModal({
        title: '客服联系方式',
        content: '客服热线：400-123-4567\n在线客服：点击右上角客服图标\n工作时间：9:00-18:00',
        showCancel: false
      })
    },

    // 开始人脸认证
    startAuth() {
      // 检查摄像头支持
      if (!this.cameraSupported) {
        uni.showModal({
          title: '摄像头不可用',
          content: '当前设备或平台不支持摄像头功能，无法进行人脸认证',
          showCancel: false
        })
        return
      }

      if (!this.cameraReady) {
        uni.showModal({
          title: '摄像头未就绪',
          content: '摄像头正在初始化中，请稍候再试',
          showCancel: false
        })
        return
      }

      this.authStarted = true
      this.authFailed = false
      this.showProgress = true
      this.resetSteps()
      
      // 开始第一步：眨眼检测
      this.startBlinkDetection()
    },

    // 重置认证步骤
    resetSteps() {
      this.steps = {
        blink: false,
        turnLeft: false,
        turnRight: false
      }
      this.currentStep = 'blink'
      this.progressPercent = 0
    },

    // 开始眨眼检测
    startBlinkDetection() {
      this.currentStep = 'blink'
      this.statusText = '请正视摄像头并眨眼'
      
      // 模拟眨眼检测（实际项目中需要接入真实的人脸识别SDK）
      this.stepTimer = setTimeout(() => {
        this.simulateBlinkDetection()
      }, 2000)
    },

    // 模拟眨眼检测
    simulateBlinkDetection() {
      // 模拟检测到眨眼
      this.steps.blink = true
      this.progressPercent = 33
      this.statusText = '眨眼检测成功！'
      
      setTimeout(() => {
        this.startTurnLeftDetection()
      }, 1000)
    },

    // 开始左转头检测
    startTurnLeftDetection() {
      this.currentStep = 'turnLeft'
      this.statusText = '请缓慢向左转头'
      
      this.stepTimer = setTimeout(() => {
        this.simulateTurnLeftDetection()
      }, 3000)
    },

    // 模拟左转头检测
    simulateTurnLeftDetection() {
      this.steps.turnLeft = true
      this.progressPercent = 66
      this.statusText = '左转头检测成功！'
      
      setTimeout(() => {
        this.startTurnRightDetection()
      }, 1000)
    },

    // 开始右转头检测
    startTurnRightDetection() {
      this.currentStep = 'turnRight'
      this.statusText = '请缓慢向右转头'
      
      this.stepTimer = setTimeout(() => {
        this.simulateTurnRightDetection()
      }, 3000)
    },

    // 模拟右转头检测
    simulateTurnRightDetection() {
      this.steps.turnRight = true
      this.progressPercent = 100
      this.statusText = '右转头检测成功！'
      
      setTimeout(() => {
        this.completeAuth()
      }, 1000)
    },

    // 完成认证
    completeAuth() {
      this.currentStep = 'completed'
      this.authCompleted = true
      this.statusText = '人脸认证成功！'
      
      setTimeout(() => {
        this.$emit('auth-success', {
          success: true,
          authData: {
            timestamp: Date.now(),
            steps: this.steps,
            userId: this.getCurrentUserId()
          }
        })
        this.closeAuth()
      }, 2000)
    },

    // 重新认证
    retryAuth() {
      this.authFailed = false
      this.authStarted = false
      this.showProgress = false
      this.statusText = '请将面部对准摄像头'
      this.resetSteps()
    },

    // 关闭认证
    closeAuth() {
      this.clearTimers()
      this.resetAuth()
      this.$emit('close')
    },

    // 重置认证状态
    resetAuth() {
      this.authStarted = false
      this.authCompleted = false
      this.authFailed = false
      this.showProgress = false
      this.statusText = '请将面部对准摄像头'
      this.resetSteps()
    },

    // 清理定时器
    clearTimers() {
      if (this.authTimer) {
        clearTimeout(this.authTimer)
        this.authTimer = null
      }
      if (this.stepTimer) {
        clearTimeout(this.stepTimer)
        this.stepTimer = null
      }
    },

    // 获取当前用户ID
    getCurrentUserId() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        return currentUser ? currentUser.id : null
      } catch (error) {
        console.error('获取用户ID失败:', error)
        return null
      }
    }
  },

  beforeDestroy() {
    this.clearTimers()
  }
}
</script>

<style scoped>
.face-auth-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.face-auth-modal {
  background: #fff;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.auth-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-content {
  padding: 30rpx;
}

.camera-container {
  position: relative;
  width: 100%;
  height: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  background: #000;
}

.camera-preview {
  width: 100%;
  height: 100%;
}

.camera-unavailable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.unavailable-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.unavailable-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.unavailable-desc {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  line-height: 1.5;
  padding: 0 20rpx;
}

.face-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 260rpx;
  border: 4rpx solid rgba(33, 150, 243, 0.8);
  border-radius: 50%;
}

.frame-corner {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #2196f3;
}

.frame-corner.tl {
  top: -4rpx;
  left: -4rpx;
  border-right: none;
  border-bottom: none;
  border-radius: 20rpx 0 0 0;
}

.frame-corner.tr {
  top: -4rpx;
  right: -4rpx;
  border-left: none;
  border-bottom: none;
  border-radius: 0 20rpx 0 0;
}

.frame-corner.bl {
  bottom: -4rpx;
  left: -4rpx;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 20rpx;
}

.frame-corner.br {
  bottom: -4rpx;
  right: -4rpx;
  border-left: none;
  border-top: none;
  border-radius: 0 0 20rpx 0;
}

.status-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 30rpx 20rpx 20rpx;
  text-align: center;
}

.status-text {
  color: #fff;
  font-size: 28rpx;
  display: block;
  margin-bottom: 20rpx;
}

.progress-bar {
  width: 100%;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #4caf50);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.auth-guide {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}

.guide-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20rpx 10rpx;
  border-radius: 16rpx;
  position: relative;
  transition: all 0.3s ease;
}

.guide-item.active {
  background: rgba(33, 150, 243, 0.1);
  border: 2rpx solid #2196f3;
}

.guide-item.completed {
  background: rgba(76, 175, 80, 0.1);
  border: 2rpx solid #4caf50;
}

.guide-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.guide-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.guide-item.active .guide-text {
  color: #2196f3;
  font-weight: bold;
}

.guide-item.completed .guide-text {
  color: #4caf50;
}

.guide-status {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 30rpx;
  height: 30rpx;
  background: #4caf50;
  border-radius: 50%;
  color: #fff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.action-btn.start {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
}

.action-btn.retry {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: #fff;
}

.action-btn.disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.action-btn:active {
  transform: scale(0.98);
}
</style>

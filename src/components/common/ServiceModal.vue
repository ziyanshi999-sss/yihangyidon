<template>
  <view class="service-modal" v-if="visible" @click="closeModal">
    <view class="modal-content" @click.stop @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" :style="{ transform: `translateY(${dragOffset}px)` }">
      <!-- 拖动指示器 -->
      <view class="drag-indicator"></view>
      
      <view class="modal-header">
        <text class="modal-title">联系客服</text>
        <text class="close-btn" @click="closeModal">×</text>
      </view>
      
      <view class="service-options">
        <!-- AI智能客服 -->
        <view class="service-item ai-service" @click="goToAIService">
          <view class="service-icon">🤖</view>
          <view class="service-info">
            <text class="service-title">AI智能客服</text>
            <text class="service-desc">24小时在线，快速解答问题</text>
          </view>
          <text class="service-arrow">></text>
        </view>
        
        <!-- 电话客服 -->
        <view class="service-item phone-service" @click="showPhoneOptions">
          <view class="service-icon">📞</view>
          <view class="service-info">
            <text class="service-title">电话客服</text>
            <text class="service-desc">人工服务，专业解答</text>
          </view>
          <text class="service-arrow">></text>
        </view>
      </view>
      
      <!-- 电话客服选项 -->
      <view class="phone-options" v-if="showPhoneList">
        <view class="phone-section">
          <text class="phone-section-title">客服热线</text>
          <view class="phone-list">
            <view class="phone-item" @click="callService('95599')">
              <view class="phone-info">
                <text class="phone-title">全国客服热线</text>
                <text class="phone-number">95599</text>
                <text class="phone-desc">7×24小时全天候服务</text>
                <text class="phone-feature">支持智能语音识别</text>
              </view>
              <view class="call-btn">
                <text class="call-icon">📞</text>
              </view>
            </view>
            
            <view class="phone-item" @click="callService('4006695599')">
              <view class="phone-info">
                <text class="phone-title">信用卡专线</text>
                <text class="phone-number">4006695599</text>
                <text class="phone-desc">账单分期、积分兑换等</text>
                <text class="phone-feature">专属信用卡服务</text>
              </view>
              <view class="call-btn">
                <text class="call-icon">📞</text>
              </view>
            </view>
            
            <!-- 白金贵宾专线 - 所有用户都可见 -->
            <view class="phone-item" @click="callService('4006195599')">
              <view class="phone-info">
                <text class="phone-title">白金贵宾专线</text>
                <text class="phone-number">4006195599</text>
                <text class="phone-desc">高端客户优先服务</text>
                <text class="phone-feature">VIP专属通道</text>
              </view>
              <view class="call-btn platinum-btn">
                <text class="call-icon">💎</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="phone-tips">
          <text class="tips-title">💡 使用提示</text>
          <text class="tips-text">• 拨打95599后，可直接说出"投诉"或"人工服务"</text>
          <text class="tips-text">• 支持按键转接，按0转人工客服</text>
          <text class="tips-text" v-if="canAccessPlatinum">• 您已开通白金贵宾专线服务</text>
          <text class="tips-text" v-else>• 白金贵宾专线需持有白金卡或钻石卡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { canAccessPlatinumHotline } from '@/utils/user-level.js'
import { getUserInfo } from '@/utils/auth.js'

export default {
  name: 'ServiceModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPhoneList: false,
      // 拖动相关
      dragOffset: 0,
      startY: 0,
      isDragging: false,
      dragThreshold: 100 // 拖动阈值，超过此距离关闭弹窗
    }
  },
  computed: {
    // 检查当前用户是否可以访问白金贵宾专线
    canAccessPlatinum() {
      // 计算属性不能是异步的，这里返回一个默认值
      // 实际的检查在方法中进行
      return false
    }
  },
  methods: {
    // 关闭弹窗
    closeModal() {
      this.showPhoneList = false
      this.dragOffset = 0
      this.$emit('close')
    },
    
    // 拖动开始
    onTouchStart(e) {
      this.startY = e.touches[0].clientY
      this.isDragging = true
    },
    
    // 拖动中
    onTouchMove(e) {
      if (!this.isDragging) return
      
      const currentY = e.touches[0].clientY
      const deltaY = currentY - this.startY
      
      // 只允许向下拖动
      if (deltaY > 0) {
        this.dragOffset = deltaY
      }
    },
    
    // 拖动结束
    onTouchEnd() {
      if (!this.isDragging) return
      
      this.isDragging = false
      
      // 如果拖动距离超过阈值，关闭弹窗
      if (this.dragOffset > this.dragThreshold) {
        this.closeModal()
      } else {
        // 否则回弹到原位置
        this.dragOffset = 0
      }
    },
    
    // 跳转到AI客服
    goToAIService() {
      this.closeModal()
      uni.navigateTo({
        url: '/pages/service/chat'
      })
    },
    
    // 显示电话选项
    showPhoneOptions() {
      this.showPhoneList = !this.showPhoneList
    },
    
    // 拨打电话
    callService(phoneNumber) {
      // 检查是否是白金贵宾专线且用户无权限
      if (phoneNumber === '4006195599' && !this.canAccessPlatinum) {
        uni.showModal({
          title: '权限不足',
          content: '白金贵宾专线仅限白金卡或钻石卡用户使用。您可以通过申请白金卡来获得此服务。',
          showCancel: false,
          confirmText: '我知道了'
        })
        return
      }
      
      uni.showModal({
        title: '拨打电话',
        content: `确定要拨打 ${phoneNumber} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 拨打电话
            uni.makePhoneCall({
              phoneNumber: phoneNumber,
              success: () => {
                console.log('拨打电话成功')
              },
              fail: (err) => {
                console.error('拨打电话失败:', err)
                uni.showToast({
                  title: '拨打电话失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.service-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  margin: 0;
  margin-top: 20vh;
  max-height: 80vh;
  overflow: hidden;
  width: 100%;
  transition: transform 0.3s ease;
}

/* 拖动指示器 */
.drag-indicator {
  width: 60rpx;
  height: 8rpx;
  background: #ddd;
  border-radius: 4rpx;
  margin: 20rpx auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
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

/* 服务选项 */
.service-options {
  padding: 20rpx 0;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item:active {
  background: #f8f9fa;
}

.service-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
  width: 80rpx;
  text-align: center;
}

.service-info {
  flex: 1;
}

.service-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.service-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.service-arrow {
  font-size: 32rpx;
  color: #ccc;
  margin-left: 15rpx;
}

/* 电话选项 */
.phone-options {
  border-top: 1rpx solid #eee;
  background: #f8f9fa;
}

.phone-section {
  padding: 30rpx;
}

.phone-section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.phone-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.phone-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.phone-item:active {
  transform: scale(0.98);
}

.phone-info {
  flex: 1;
}

.phone-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.phone-number {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 8rpx;
}

.phone-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.phone-feature {
  display: block;
  font-size: 22rpx;
  color: #999;
}

.call-btn {
  width: 80rpx;
  height: 80rpx;
  background: #2e7d32;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}

.call-icon {
  font-size: 32rpx;
  color: #fff;
}

/* 白金贵宾按钮样式 */
.platinum-btn {
  background: linear-gradient(135deg, #2e7d32, #4caf50);
}

/* 使用提示 */
.phone-tips {
  padding: 30rpx;
  background: #fff8e1;
  border-top: 1rpx solid #ffc107;
}

.tips-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 15rpx;
}

.tips-text {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8rpx;
}

.tips-text:last-child {
  margin-bottom: 0;
}
</style>

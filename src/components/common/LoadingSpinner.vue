<template>
  <view class="loading-spinner" v-if="show">
    <view class="spinner-container">
      <view class="spinner" :class="{ 'spinner-large': size === 'large' }">
        <view class="spinner-inner"></view>
      </view>
      <text class="loading-text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "加载中...",
    },
    size: {
      type: String,
      default: "normal", // normal, large
      validator: (value) => ["normal", "large"].includes(value),
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-large {
  width: 80rpx;
  height: 80rpx;
  border-width: 6rpx;
}

.spinner-inner {
  width: 100%;
  height: 100%;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
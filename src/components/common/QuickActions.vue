<template>
  <view class="quick-actions">
    <view class="actions-header" v-if="title">
      <text class="header-title">{{ title }}</text>
      <text class="header-more" v-if="showMore" @tap="handleMore">更多</text>
    </view>
    <view class="actions-grid" :class="[`grid-${columns}`]">
      <view
        class="action-item"
        v-for="(action, index) in actions"
        :key="index"
        @tap="handleAction(action, index)"
      >
        <view
          class="action-icon"
          :style="{ backgroundColor: action.bgColor || '#007AFF' }"
        >
          <image
            v-if="action.icon"
            :src="action.icon"
            class="icon-image"
            mode="aspectFit"
          ></image>
          <text v-else class="icon-text">{{ action.iconText || "🔧" }}</text>
        </view>
        <text class="action-label">{{ action.label }}</text>
        <view class="action-badge" v-if="action.badge">
          <text class="badge-text">{{ action.badge }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "QuickActions",
  props: {
    title: {
      type: String,
      default: "",
    },
    actions: {
      type: Array,
      required: true,
      default: () => [],
    },
    columns: {
      type: Number,
      default: 4,
      validator: (value) => [2, 3, 4, 5].includes(value),
    },
    showMore: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleAction(action, index) {
      this.$emit("action-tap", action, index);
    },
    handleMore() {
      this.$emit("more-tap");
    },
  },
};
</script>

<style scoped>
.quick-actions {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.header-more {
  font-size: 28rpx;
  color: #007aff;
}

.actions-grid {
  display: grid;
  gap: 30rpx;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.action-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.action-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  position: relative;
}

.icon-image {
  width: 48rpx;
  height: 48rpx;
}

.icon-text {
  font-size: 36rpx;
  color: #fff;
}

.action-label {
  font-size: 26rpx;
  color: #333;
  line-height: 1.2;
}

.action-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #ff3b30;
  border-radius: 20rpx;
  padding: 4rpx 12rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

/* 点击效果 */
.action-item:active {
  opacity: 0.7;
  transform: scale(0.95);
  transition: all 0.1s ease;
}
</style>
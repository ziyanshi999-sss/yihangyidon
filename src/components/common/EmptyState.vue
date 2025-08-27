<template>
  <view class="empty-state">
    <view class="empty-icon">
      <image
        v-if="iconType === 'image'"
        :src="icon"
        class="icon-image"
        mode="aspectFit"
      ></image>
      <text v-else class="icon-text">{{ icon }}</text>
    </view>
    <text class="empty-title">{{ title }}</text>
    <text class="empty-description" v-if="description">{{ description }}</text>
    <view class="empty-actions" v-if="showButton">
      <button class="action-button" @tap="handleAction" :type="buttonType">
        {{ buttonText }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: "EmptyState",
  props: {
    icon: {
      type: String,
      default: "📭",
    },
    iconType: {
      type: String,
      default: "emoji", // emoji, image
      validator: (value) => ["emoji", "image"].includes(value),
    },
    title: {
      type: String,
      default: "暂无数据",
    },
    description: {
      type: String,
      default: "",
    },
    showButton: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      default: "重新加载",
    },
    buttonType: {
      type: String,
      default: "primary",
    },
  },
  methods: {
    handleAction() {
      this.$emit("action");
    },
  },
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-icon {
  margin-bottom: 40rpx;
}

.icon-image {
  width: 120rpx;
  height: 120rpx;
}

.icon-text {
  font-size: 120rpx;
  line-height: 1;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
}

.empty-description {
  font-size: 28rpx;
  color: #999;
  line-height: 1.5;
  margin-bottom: 40rpx;
}

.empty-actions {
  margin-top: 20rpx;
}

.action-button {
  padding: 24rpx 48rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
}
</style>
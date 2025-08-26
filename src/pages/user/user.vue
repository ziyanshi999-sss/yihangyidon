<template>
	<view class="user-page">
		<h1>个人中心</h1>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		goToProfile() {
			uni.showToast({
				title: '个人资料',
				icon: 'none'
			})
		},
		goToSettings() {
			uni.showToast({
				title: '设置',
				icon: 'none'
			})
		},
		goToHelp() {
			uni.showToast({
				title: '帮助中心',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped>
.user-page {
	padding: 20rpx;
}

.user-header {
	display: flex;
	align-items: center;
	padding: 40rpx 0;
	border-bottom: 1rpx solid #eee;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	overflow: hidden;
	margin-right: 30rpx;
}

.avatar image {
	width: 100%;
	height: 100%;
}

.user-info {
	flex: 1;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.user-desc {
	font-size: 28rpx;
	color: #666;
}

.menu-list {
	margin-top: 40rpx;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.menu-text {
	font-size: 32rpx;
	color: #333;
}

.arrow {
	font-size: 32rpx;
	color: #999;
}
</style>

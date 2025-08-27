<template>
	<view class="user-page">
		<!-- 用户信息头部 -->
		<view class="user-header" v-if="userInfo">
			<view class="avatar">
				<image :src="userInfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="username">{{ userInfo.nickname }}</text>
				<text class="user-desc">{{ userInfo.phone }}</text>
			</view>
		</view>

		<!-- 未登录状态 -->
		<view class="login-prompt" v-else>
			<text class="prompt-text">请先登录</text>
			<button class="login-btn" @click="goToLogin">立即登录</button>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list" v-if="userInfo">
			<view class="menu-item" @click="goToProfile">
				<text class="menu-text">个人资料</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="goToSettings">
				<text class="menu-text">设置</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="goToHelp">
				<text class="menu-text">帮助中心</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="viewLogoutHistory">
				<text class="menu-text">退出记录</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="handleLogout">
				<text class="menu-text logout-text">退出登录</text>
				<text class="arrow">></text>
			</view>
		</view>
	</view>
</template>

<script>
import { checkLoginAndRedirect, getUserInfo, logout, quickLogout, forceLogout, forceCheckLogin } from '@/utils/auth.js'

export default {
	data() {
		return {
			userInfo: null
		}
	},
	onShow() {
		// 强制检查登录状态
		if (!forceCheckLogin()) {
			console.log('个人中心：用户未登录，强制跳转')
			uni.reLaunch({
				url: '/pages/denglu/login'
			})
			return
		}
		
		// 检查登录状态
		if (!checkLoginAndRedirect()) {
			return
		}
		
		this.checkLoginStatus()
	},
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const userInfo = getUserInfo()
			if (userInfo) {
				this.userInfo = userInfo
			} else {
				this.userInfo = null
			}
		},

		// 跳转到登录页面
		goToLogin() {
			uni.navigateTo({
				url: '/pages/denglu/login'
			})
		},

		// 查看退出记录
		viewLogoutHistory() {
			try {
				const logoutLogs = uni.getStorageSync('logoutLogs') || []
				
				if (logoutLogs.length === 0) {
					uni.showToast({
						title: '暂无退出记录',
						icon: 'none'
					})
					return
				}
				
				// 格式化退出记录
				const formattedLogs = logoutLogs.map(log => {
					const date = new Date(log.timestamp)
					return `${date.toLocaleString()}\n原因：${log.reason}\n平台：${log.platform}`
				}).join('\n\n')
				
				uni.showModal({
					title: '退出记录',
					content: formattedLogs,
					showCancel: false,
					confirmText: '确定'
				})
			} catch (error) {
				console.error('查看退出记录失败:', error)
				uni.showToast({
					title: '查看记录失败',
					icon: 'none'
				})
			}
		},

		// 退出登录
		handleLogout() {
			// 显示退出选项
			uni.showActionSheet({
				itemList: ['普通退出', '快速退出', '强制退出'],
				success: (res) => {
					switch (res.tapIndex) {
						case 0:
							// 普通退出
							logout({
								showConfirm: true,
								syncToServer: true,
								reason: '用户从个人中心退出'
							})
							break
						case 1:
							// 快速退出
							quickLogout('用户快速退出')
							break
						case 2:
							// 强制退出
							uni.showModal({
								title: '强制退出确认',
								content: '强制退出将清除所有数据且不同步服务器，确定继续吗？',
								confirmText: '确定',
								cancelText: '取消',
								confirmColor: '#e74c3c',
								success: (modalRes) => {
									if (modalRes.confirm) {
										forceLogout('用户强制退出')
									}
								}
							})
							break
					}
				}
			})
		},

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
	background: #f5f5f5;
	min-height: 100vh;
}

.login-prompt {
	text-align: center;
	padding: 100rpx 40rpx;
	background: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 40rpx;
}

.prompt-text {
	display: block;
	font-size: 32rpx;
	color: #666;
	margin-bottom: 40rpx;
}

.login-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	border: none;
	border-radius: 12rpx;
	padding: 20rpx 60rpx;
	font-size: 32rpx;
}

.logout-text {
	color: #e74c3c !important;
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

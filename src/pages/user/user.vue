<template>
	<view class="user-page">
		<!-- 顶部背景 -->
		<view class="header-bg"></view>
		
		<!-- 用户信息卡片 -->
		<view class="user-card" v-if="userInfo">
			<view class="user-info">
				<view class="avatar-section">
					<view class="avatar">
						<image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					</view>
					<view class="user-details">
						<text class="username">{{ userInfo.nickname || userInfo.username }}</text>
						<text class="user-level">VIP客户</text>
					</view>
				</view>
				<view class="account-info">
					<text class="account-label">账户余额</text>
					<text class="account-balance">¥ 12,580.00</text>
				</view>
			</view>
		</view>

		<!-- 未登录状态 -->
		<view class="login-card" v-else>
			<view class="login-content">
				<text class="login-title">欢迎使用农业银行</text>
				<text class="login-subtitle">请登录您的账户</text>
				<button class="login-btn" @click="goToLogin">立即登录</button>
			</view>
		</view>

		<!-- 快捷功能 -->
		<view class="quick-functions" v-if="userInfo">
			<view class="function-grid">
				<view class="function-item" @click="goToTransfer">
					<view class="function-icon transfer-icon">💳</view>
					<text class="function-text">转账</text>
				</view>
				<view class="function-item" @click="goToPayment">
					<view class="function-icon payment-icon">💰</view>
					<text class="function-text">缴费</text>
				</view>
				<view class="function-item" @click="goToInvestment">
					<view class="function-icon investment-icon">📈</view>
					<text class="function-text">理财</text>
				</view>
				<view class="function-item" @click="goToCredit">
					<view class="function-icon credit-icon">💳</view>
					<text class="function-text">信用卡</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-sections" v-if="userInfo">
			<!-- 账户管理 -->
			<view class="menu-section">
				<view class="section-title">账户管理</view>
				<view class="menu-list">
					<view class="menu-item" @click="goToAccount">
						<view class="menu-left">
							<text class="menu-icon">🏦</text>
							<text class="menu-text">我的账户</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item" @click="goToCards">
						<view class="menu-left">
							<text class="menu-icon">💳</text>
							<text class="menu-text">我的卡片</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item" @click="goToTransactions">
						<view class="menu-left">
							<text class="menu-icon">📊</text>
							<text class="menu-text">交易记录</text>
						</view>
						<text class="arrow">></text>
					</view>
				</view>
			</view>

			<!-- 个人设置 -->
			<view class="menu-section">
				<view class="section-title">个人设置</view>
				<view class="menu-list">
					<view class="menu-item" @click="goToProfile">
						<view class="menu-left">
							<text class="menu-icon">👤</text>
							<text class="menu-text">个人资料</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item" @click="goToSecurity">
						<view class="menu-left">
							<text class="menu-icon">🔒</text>
							<text class="menu-text">安全设置</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item theme-item" @click="toggleTheme">
						<view class="menu-left">
							<text class="menu-icon">🎨</text>
							<text class="menu-text">主题切换</text>
						</view>
						<view class="theme-info">
							<text class="theme-desc">{{ getThemeDisplayName(currentTheme) }}</text>
							<text class="arrow">></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 客户服务 -->
			<view class="menu-section">
				<view class="section-title">客户服务</view>
				<view class="menu-list">
					<view class="menu-item" @click="goToHelp">
						<view class="menu-left">
							<text class="menu-icon">❓</text>
							<text class="menu-text">帮助中心</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item" @click="goToContact">
						<view class="menu-left">
							<text class="menu-icon">📞</text>
							<text class="menu-text">联系客服</text>
						</view>
						<text class="arrow">></text>
					</view>
					<view class="menu-item" @click="viewLogoutHistory">
						<view class="menu-left">
							<text class="menu-icon">📋</text>
							<text class="menu-text">退出记录</text>
						</view>
						<text class="arrow">></text>
					</view>
				</view>
			</view>

			<!-- 退出登录 -->
			<view class="logout-section">
				<button class="logout-btn" @click="handleLogout">退出登录</button>
			</view>
		</view>
	</view>
</template>

<script>
import { checkLoginAndRedirect, getUserInfo, logout, quickLogout, forceLogout, forceCheckLogin } from '@/utils/auth.js'
import themeManager from '@/utils/theme.js'

export default {
	data() {
		return {
			userInfo: null,
			currentTheme: 'light' // 默认浅色主题
		}
	},
	onShow() {
		try {
			// 检查登录状态
			if (!forceCheckLogin()) {
				console.log('个人中心：用户未登录，跳转到登录页面')
				uni.reLaunch({
					url: '/pages/denglu/login',
					fail: (error) => {
						console.error('个人中心跳转失败:', error)
						uni.navigateTo({ url: '/pages/denglu/login' })
					}
				})
				return
			}
			
			this.checkLoginStatus()
			this.loadTheme()
		} catch (error) {
			console.error('个人中心onShow检查失败:', error)
			// 如果检查失败，跳转到登录页面
			uni.reLaunch({
				url: '/pages/denglu/login',
				fail: () => {
					uni.navigateTo({ url: '/pages/denglu/login' })
				}
			})
		}
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

		// 快捷功能
		goToTransfer() {
			uni.showToast({
				title: '转账功能',
				icon: 'none'
			})
		},
		goToPayment() {
			uni.showToast({
				title: '缴费功能',
				icon: 'none'
			})
		},
		goToInvestment() {
			uni.showToast({
				title: '理财功能',
				icon: 'none'
			})
		},
		goToCredit() {
			uni.navigateTo({
				url: '/pages/credit-cards/credit-cards'
			})
		},

		// 菜单功能
		goToAccount() {
			uni.showToast({
				title: '我的账户',
				icon: 'none'
			})
		},
		goToCards() {
			uni.navigateTo({
				url: '/pages/credit-cards/credit-cards'
			})
		},
		goToTransactions() {
			uni.showToast({
				title: '交易记录',
				icon: 'none'
			})
		},
		goToSecurity() {
			uni.navigateTo({
				url: '/pages/user/security'
			})
		},
		goToContact() {
			uni.showToast({
				title: '联系客服',
				icon: 'none'
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

		// 显示信用卡信息
		showCreditCards() {
			if (!this.userInfo) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				return
			}

			// 从用户数据中获取信用卡信息
			try {
				// 尝试从本地存储获取用户数据
				let users = uni.getStorageSync('users') || []
				
				// 如果本地没有数据，尝试从导入的数据获取
				if (users.length === 0) {
					// 动态导入用户数据
					import('@/data/users.js').then(module => {
						const { users: importedUsers } = module
						this.displayCreditCards(importedUsers)
					}).catch(error => {
						console.error('导入用户数据失败:', error)
						uni.showToast({
							title: '获取数据失败',
							icon: 'none'
						})
					})
					return
				}
				
				this.displayCreditCards(users)
			} catch (error) {
				console.error('获取信用卡信息失败:', error)
				uni.showToast({
					title: '获取数据失败',
					icon: 'none'
				})
			}
		},

		// 显示信用卡信息的具体实现
		displayCreditCards(users) {
			const currentUser = users.find(user => 
				user.id === this.userInfo.id || 
				user.phone === this.userInfo.phone ||
				user.username === this.userInfo.username
			)

			if (!currentUser || !currentUser.creditCards || currentUser.creditCards.length === 0) {
				uni.showModal({
					title: '信用卡信息',
					content: '您暂无信用卡信息',
					showCancel: false,
					confirmText: '确定'
				})
				return
			}

			// 格式化信用卡信息
			const cardsInfo = currentUser.creditCards.map((card, index) => {
				const cardNumber = card.cardNumber.replace(/\s/g, '')
				const maskedNumber = cardNumber.substring(0, 4) + ' **** **** ' + cardNumber.substring(cardNumber.length - 4)
				
				return `信用卡 ${index + 1}：${card.cardType} ${card.cardBrand}
卡号：${maskedNumber}
额度：¥${card.creditLimit.toLocaleString()}
可用：¥${card.availableCredit.toLocaleString()}
欠款：¥${card.currentBalance.toLocaleString()}
最低还款：¥${card.minPayment.toLocaleString()}
账单日：每月${card.statementDate}日
还款日：${card.dueDate}
有效期：${card.expiryDate}
积分：${card.rewardsPoints}点`
			}).join('\n\n')

			uni.showModal({
				title: '我的信用卡',
				content: cardsInfo,
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#2e7d32'
			})
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
			uni.navigateTo({
				url: '/pages/user/profile'
			})
		},
		goToHelp() {
			uni.showToast({
				title: '帮助中心',
				icon: 'none'
			})
		},

		// 加载主题设置
		loadTheme() {
			themeManager.init()
			this.currentTheme = themeManager.getCurrentTheme()
		},

		// 获取主题显示名称
		getThemeDisplayName(theme) {
			const themeNames = {
				'light': '浅色主题',
				'dark': '深色主题',
				'blue': '蓝色主题',
				'green': '绿色主题',
				'purple': '紫色主题',
				'orange': '橙色主题',
				'pink': '粉色主题',
				'red': '红色主题',
				'teal': '青色主题',
				'indigo': '靛蓝主题',
				'amber': '琥珀主题',
				'cyan': '青色主题'
			}
			return themeNames[theme] || theme
		},

		// 切换主题
		toggleTheme() {
			const newTheme = themeManager.toggleTheme()
			this.currentTheme = newTheme
			
			// 显示提示
			uni.showToast({
				title: `已切换到${this.getThemeDisplayName(newTheme)}`,
				icon: 'success',
				duration: 1500
			})
		}
	}
}
</script>

<style scoped>
.user-page {
	min-height: 100vh;
	background: var(--bg-color, #f5f5f5);
	position: relative;
}

/* 顶部背景 */
.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 300rpx;
	background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
	border-radius: 0 0 50rpx 50rpx;
	z-index: 1;
}

/* 用户信息卡片 */
.user-card {
	position: relative;
	z-index: 2;
	margin: 40rpx 30rpx 0;
	background: var(--card-bg, #ffffff);
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.user-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.avatar-section {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	overflow: hidden;
	margin-right: 30rpx;
	border: 4rpx solid #4caf50;
}

.avatar image {
	width: 100%;
	height: 100%;
}

.user-details {
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	color: var(--text-color, #333);
	margin-bottom: 10rpx;
}

.user-level {
	font-size: 24rpx;
	color: #4caf50;
	background: rgba(76, 175, 80, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	align-self: flex-start;
}

.account-info {
	text-align: right;
}

.account-label {
	font-size: 24rpx;
	color: var(--text-color, #666);
	display: block;
	margin-bottom: 10rpx;
}

.account-balance {
	font-size: 40rpx;
	font-weight: bold;
	color: #4caf50;
}

/* 未登录状态 */
.login-card {
	position: relative;
	z-index: 2;
	margin: 40rpx 30rpx 0;
	background: var(--card-bg, #ffffff);
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	text-align: center;
}

.login-title {
	font-size: 36rpx;
	font-weight: bold;
	color: var(--text-color, #333);
	display: block;
	margin-bottom: 20rpx;
}

.login-subtitle {
	font-size: 28rpx;
	color: var(--text-color, #666);
	display: block;
	margin-bottom: 40rpx;
}

.login-btn {
	background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
	color: #ffffff;
	border: none;
	border-radius: 50rpx;
	padding: 25rpx 60rpx;
	font-size: 32rpx;
	font-weight: bold;
}

/* 快捷功能 */
.quick-functions {
	position: relative;
	z-index: 2;
	margin: 30rpx;
	background: var(--card-bg, #ffffff);
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.function-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 30rpx;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	border-radius: 16rpx;
	transition: all 0.3s ease;
}

.function-item:active {
	background: rgba(76, 175, 80, 0.1);
	transform: scale(0.95);
}

.function-icon {
	font-size: 48rpx;
	margin-bottom: 15rpx;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
	color: #ffffff;
}

.function-text {
	font-size: 24rpx;
	color: var(--text-color, #333);
	font-weight: 500;
}

/* 功能菜单 */
.menu-sections {
	position: relative;
	z-index: 2;
	margin: 30rpx;
}

.menu-section {
	background: var(--card-bg, #ffffff);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: var(--text-color, #333);
	padding: 30rpx 40rpx 20rpx;
	border-bottom: 1rpx solid var(--border-color, #f0f0f0);
}

.menu-list {
	padding: 0 40rpx;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid var(--border-color, #f0f0f0);
	transition: all 0.3s ease;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item:active {
	background: rgba(76, 175, 80, 0.05);
}

.menu-left {
	display: flex;
	align-items: center;
}

.menu-icon {
	font-size: 36rpx;
	margin-right: 25rpx;
	width: 60rpx;
	text-align: center;
}

.menu-text {
	font-size: 30rpx;
	color: var(--text-color, #333);
	font-weight: 500;
}

.arrow {
	font-size: 28rpx;
	color: var(--text-color, #999);
}

/* 主题切换样式 */
.theme-item .theme-info {
	display: flex;
	align-items: center;
}

.theme-desc {
	font-size: 24rpx;
	color: var(--text-color, #666);
	margin-right: 15rpx;
}

/* 退出登录 */
.logout-section {
	margin-top: 40rpx;
}

.logout-btn {
	width: 100%;
	background: #f44336;
	color: #ffffff;
	border: none;
	border-radius: 50rpx;
	padding: 30rpx;
	font-size: 32rpx;
	font-weight: bold;
	box-shadow: 0 4rpx 16rpx rgba(244, 67, 54, 0.3);
}

.logout-btn:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 8rpx rgba(244, 67, 54, 0.3);
}
</style>

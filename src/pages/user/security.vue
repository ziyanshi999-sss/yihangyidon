<template>
	<view class="security-page">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<view class="nav-title">安全设置</view>
			<view class="nav-right">
				<text class="refresh-btn" @click="refreshSecurityStatus">🔄</text>
			</view>
		</view>

		<!-- 安全状态概览 -->
		<view class="security-overview">
			<view class="overview-header">
				<text class="overview-title">账户安全评分</text>
				<view class="security-score">
					<text class="score-number">{{ securityScore }}</text>
					<text class="score-unit">分</text>
				</view>
			</view>
			<view class="score-bar">
				<view class="score-progress" :style="{ width: (securityScore / 100) * 100 + '%' }"></view>
			</view>
			<text class="score-tip">{{ getScoreTip() }}</text>
			<view class="score-details">
				<text class="detail-item">密码强度：{{ passwordStrength }}</text>
				<text class="detail-item">设备数量：{{ loginDevices.length }}台</text>
				<text class="detail-item">最后更新：{{ lastUpdateTime }}</text>
			</view>
		</view>

		<!-- 安全功能列表 -->
		<view class="security-sections">
			<!-- 登录安全 -->
			<view class="security-section">
				<view class="section-title">
					<text class="title-text">登录安全</text>
					<text class="section-count">{{ getLoginSecurityCount() }}/3</text>
				</view>
				<view class="security-list">
					<view class="security-item" @click="changeLoginPassword">
						<view class="item-left">
							<text class="item-icon">🔐</text>
							<view class="item-info">
								<text class="item-title">登录密码</text>
								<text class="item-desc">定期更换密码提高安全性</text>
								<text class="item-update-time">上次更新：{{ passwordUpdateTime }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="item-status" :class="{ 'warning': isPasswordExpired }">
								{{ isPasswordExpired ? '需更新' : '已设置' }}
							</text>
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="toggleBiometricLogin">
						<view class="item-left">
							<text class="item-icon">👆</text>
							<view class="item-info">
								<text class="item-title">生物识别登录</text>
								<text class="item-desc">指纹/面容识别快速登录</text>
								<text class="item-status-text">{{ biometricEnabled ? '已启用' : '未启用' }}</text>
							</view>
						</view>
						<view class="item-right">
							<switch 
								:checked="biometricEnabled" 
								@change="onBiometricChange"
								color="#4caf50"
							/>
						</view>
					</view>
					
					<view class="security-item" @click="setLoginDevice">
						<view class="item-left">
							<text class="item-icon">📱</text>
							<view class="item-info">
								<text class="item-title">登录设备管理</text>
								<text class="item-desc">管理已登录的设备</text>
								<text class="item-device-info">{{ loginDevices.length }}台设备在线</text>
							</view>
						</view>
						<view class="item-right">
							<text class="device-count">{{ loginDevices.length }}台</text>
							<text class="arrow">></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 交易安全 -->
			<view class="security-section">
				<view class="section-title">
					<text class="title-text">交易安全</text>
					<text class="section-count">{{ getTransactionSecurityCount() }}/3</text>
				</view>
				<view class="security-list">
					<view class="security-item" @click="changeTransactionPassword">
						<view class="item-left">
							<text class="item-icon">💳</text>
							<view class="item-info">
								<text class="item-title">交易密码</text>
								<text class="item-desc">用于重要交易验证</text>
								<text class="item-update-time">上次更新：{{ transactionPasswordUpdateTime }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="item-status" :class="{ 'warning': isTransactionPasswordExpired }">
								{{ isTransactionPasswordExpired ? '需更新' : '已设置' }}
							</text>
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="setTransactionLimit">
						<view class="item-left">
							<text class="item-icon">💰</text>
							<view class="item-info">
								<text class="item-title">交易限额</text>
								<text class="item-desc">设置单笔和日累计限额</text>
								<text class="item-limit-info">当前限额：¥{{ transactionLimit.toLocaleString() }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="item-status">¥{{ transactionLimit.toLocaleString() }}</text>
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="toggleSmsVerification">
						<view class="item-left">
							<text class="item-icon">📱</text>
							<view class="item-info">
								<text class="item-title">短信验证</text>
								<text class="item-desc">重要操作需短信验证</text>
								<text class="item-status-text">{{ smsVerificationEnabled ? '已启用' : '未启用' }}</text>
							</view>
						</view>
						<view class="item-right">
							<switch 
								:checked="smsVerificationEnabled" 
								@change="onSmsVerificationChange"
								color="#4caf50"
							/>
						</view>
					</view>
				</view>
			</view>

			<!-- 账户保护 -->
			<view class="security-section">
				<view class="section-title">
					<text class="title-text">账户保护</text>
					<text class="section-count">{{ getAccountProtectionCount() }}/3</text>
				</view>
				<view class="security-list">
					<view class="security-item" @click="setSecurityQuestions">
						<view class="item-left">
							<text class="item-icon">❓</text>
							<view class="item-info">
								<text class="item-title">安全问题</text>
								<text class="item-desc">设置安全问题用于身份验证</text>
								<text class="item-status-text">{{ securityQuestionsSet ? '已设置3个问题' : '未设置' }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="item-status" :class="{ 'warning': !securityQuestionsSet }">
								{{ securityQuestionsSet ? '已设置' : '未设置' }}
							</text>
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="setEmergencyContact">
						<view class="item-left">
							<text class="item-icon">🚨</text>
							<view class="item-info">
								<text class="item-title">紧急联系人</text>
								<text class="item-desc">设置紧急情况联系人</text>
								<text class="item-status-text">{{ emergencyContactSet ? '已设置联系人' : '未设置' }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="item-status" :class="{ 'warning': !emergencyContactSet }">
								{{ emergencyContactSet ? '已设置' : '未设置' }}
							</text>
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="toggleAccountLock">
						<view class="item-left">
							<text class="item-icon">🔒</text>
							<view class="item-info">
								<text class="item-title">账户锁定</text>
								<text class="item-desc">异常登录时自动锁定账户</text>
								<text class="item-status-text">{{ accountLockEnabled ? '已启用' : '未启用' }}</text>
							</view>
						</view>
						<view class="item-right">
							<switch 
								:checked="accountLockEnabled" 
								@change="onAccountLockChange"
								color="#4caf50"
							/>
						</view>
					</view>
				</view>
			</view>

			<!-- 安全日志 -->
			<view class="security-section">
				<view class="section-title">
					<text class="title-text">安全日志</text>
					<text class="section-count">{{ getSecurityLogCount() }}/2</text>
				</view>
				<view class="security-list">
					<view class="security-item" @click="viewLoginHistory">
						<view class="item-left">
							<text class="item-icon">📋</text>
							<view class="item-info">
								<text class="item-title">登录记录</text>
								<text class="item-desc">查看账户登录历史</text>
								<text class="item-log-info">最近登录：{{ lastLoginTime }}</text>
							</view>
						</view>
						<view class="item-right">
							<text class="arrow">></text>
						</view>
					</view>
					
					<view class="security-item" @click="viewSecurityEvents">
						<view class="item-left">
							<text class="item-icon">🔍</text>
							<view class="item-info">
								<text class="item-title">安全事件</text>
								<text class="item-desc">查看安全相关事件记录</text>
								<text class="item-log-info">{{ securityEventsCount }}个事件</text>
							</view>
						</view>
						<view class="item-right">
							<text class="arrow">></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 高级安全设置 -->
			<view class="security-section">
				<view class="section-title">
					<text class="title-text">高级安全设置</text>
					<text class="section-count">{{ getAdvancedSecurityCount() }}/2</text>
				</view>
				<view class="security-list">
					<view class="security-item" @click="setTwoFactorAuth">
						<view class="item-left">
							<text class="item-icon">🔐</text>
							<view class="item-info">
								<text class="item-title">双重认证</text>
								<text class="item-desc">Google Authenticator等2FA应用</text>
								<text class="item-status-text">{{ twoFactorEnabled ? '已启用' : '未启用' }}</text>
							</view>
						</view>
						<view class="item-right">
							<switch 
								:checked="twoFactorEnabled" 
								@change="onTwoFactorChange"
								color="#4caf50"
							/>
						</view>
					</view>
					
					<view class="security-item" @click="setSecurityNotifications">
						<view class="item-left">
							<text class="item-icon">🔔</text>
							<view class="item-info">
								<text class="item-title">安全通知</text>
								<text class="item-desc">异常活动实时通知</text>
								<text class="item-status-text">{{ securityNotificationsEnabled ? '已启用' : '未启用' }}</text>
							</view>
						</view>
						<view class="item-right">
							<switch 
								:checked="securityNotificationsEnabled" 
								@change="onSecurityNotificationsChange"
								color="#4caf50"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 安全提示 -->
		<view class="security-tips">
			<view class="tips-header">
				<text class="tips-icon">💡</text>
				<text class="tips-title">安全提示</text>
			</view>
			<view class="tips-content">
				<text class="tip-item">• 定期更换密码，不要使用简单密码</text>
				<text class="tip-item">• 不要在公共场所登录账户</text>
				<text class="tip-item">• 及时关注账户异常活动</text>
				<text class="tip-item">• 保护好个人信息，不要泄露给他人</text>
				<text class="tip-item">• 启用双重认证提高账户安全性</text>
			</view>
		</view>

		<!-- 安全建议 -->
		<view class="security-recommendations" v-if="securityRecommendations.length > 0">
			<view class="recommendations-header">
				<text class="recommendations-icon">⚠️</text>
				<text class="recommendations-title">安全建议</text>
			</view>
			<view class="recommendations-content">
				<view 
					class="recommendation-item" 
					v-for="(rec, index) in securityRecommendations" 
					:key="index"
					@click="handleRecommendation(rec)"
				>
					<text class="recommendation-text">{{ rec.text }}</text>
					<text class="recommendation-action">{{ rec.action }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			securityScore: 85,
			biometricEnabled: true,
			smsVerificationEnabled: true,
			accountLockEnabled: true,
			twoFactorEnabled: false,
			securityNotificationsEnabled: true,
			securityQuestionsSet: false,
			emergencyContactSet: false,
			transactionLimit: 50000,
			passwordUpdateTime: '2024-01-01',
			transactionPasswordUpdateTime: '2024-01-01',
			lastUpdateTime: '2024-01-15',
			lastLoginTime: '2024-01-15 14:30:00',
			securityEventsCount: 5,
			loginDevices: [
				{
					id: 1,
					name: 'iPhone 14',
					lastLogin: '2024-01-15 14:30:00',
					location: '北京市',
					status: 'active',
					ip: '192.168.1.100'
				},
				{
					id: 2,
					name: 'MacBook Pro',
					lastLogin: '2024-01-14 09:15:00',
					location: '北京市',
					status: 'active',
					ip: '192.168.1.101'
				}
			],
			securityRecommendations: []
		}
	},
	computed: {
		passwordStrength() {
			// 模拟密码强度计算
			return '强'
		},
		isPasswordExpired() {
			const lastUpdate = new Date(this.passwordUpdateTime)
			const now = new Date()
			const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24)
			return daysDiff > 90 // 90天过期
		},
		isTransactionPasswordExpired() {
			const lastUpdate = new Date(this.transactionPasswordUpdateTime)
			const now = new Date()
			const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24)
			return daysDiff > 180 // 180天过期
		}
	},
	onLoad() {
		this.loadSecuritySettings()
		this.calculateSecurityScore()
		this.generateSecurityRecommendations()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},

		// 刷新安全状态
		refreshSecurityStatus() {
			uni.showLoading({ title: '刷新中...' })
			
			setTimeout(() => {
				this.calculateSecurityScore()
				this.generateSecurityRecommendations()
				uni.hideLoading()
				uni.showToast({
					title: '刷新完成',
					icon: 'success'
				})
			}, 1000)
		},

		// 加载安全设置
		loadSecuritySettings() {
			try {
				const settings = uni.getStorageSync('securitySettings')
				if (settings) {
					Object.assign(this, settings)
				}
			} catch (error) {
				console.error('加载安全设置失败:', error)
			}
		},

		// 保存安全设置
		saveSecuritySettings() {
			try {
				const settings = {
					biometricEnabled: this.biometricEnabled,
					smsVerificationEnabled: this.smsVerificationEnabled,
					accountLockEnabled: this.accountLockEnabled,
					twoFactorEnabled: this.twoFactorEnabled,
					securityNotificationsEnabled: this.securityNotificationsEnabled,
					transactionLimit: this.transactionLimit
				}
				uni.setStorageSync('securitySettings', settings)
				
				// 更新最后更新时间
				this.lastUpdateTime = new Date().toLocaleDateString()
				
				// 重新计算安全评分
				this.calculateSecurityScore()
			} catch (error) {
				console.error('保存安全设置失败:', error)
			}
		},

		// 计算安全评分
		calculateSecurityScore() {
			let score = 0
			
			// 基础分：40分
			score += 40
			
			// 密码相关：20分
			if (!this.isPasswordExpired) score += 10
			if (!this.isTransactionPasswordExpired) score += 10
			
			// 生物识别：10分
			if (this.biometricEnabled) score += 10
			
			// 短信验证：10分
			if (this.smsVerificationEnabled) score += 10
			
			// 账户锁定：5分
			if (this.accountLockEnabled) score += 5
			
			// 双重认证：10分
			if (this.twoFactorEnabled) score += 10
			
			// 安全通知：5分
			if (this.securityNotificationsEnabled) score += 5
			
			// 安全问题和紧急联系人：10分
			if (this.securityQuestionsSet) score += 5
			if (this.emergencyContactSet) score += 5
			
			// 设备管理：10分
			if (this.loginDevices.length <= 3) score += 10
			else if (this.loginDevices.length <= 5) score += 5
			
			this.securityScore = Math.min(100, score)
		},

		// 生成安全建议
		generateSecurityRecommendations() {
			this.securityRecommendations = []
			
			if (this.isPasswordExpired) {
				this.securityRecommendations.push({
					text: '登录密码已超过90天未更新',
					action: '立即更新',
					type: 'password'
				})
			}
			
			if (this.isTransactionPasswordExpired) {
				this.securityRecommendations.push({
					text: '交易密码已超过180天未更新',
					action: '立即更新',
					type: 'transaction'
				})
			}
			
			if (!this.twoFactorEnabled) {
				this.securityRecommendations.push({
					text: '建议启用双重认证',
					action: '立即启用',
					type: '2fa'
				})
			}
			
			if (this.loginDevices.length > 5) {
				this.securityRecommendations.push({
					text: '登录设备过多，建议清理',
					action: '查看设备',
					type: 'device'
				})
			}
			
			if (!this.securityQuestionsSet) {
				this.securityRecommendations.push({
					text: '建议设置安全问题',
					action: '立即设置',
					type: 'questions'
				})
			}
		},

		// 处理安全建议
		handleRecommendation(recommendation) {
			switch (recommendation.type) {
				case 'password':
					this.changeLoginPassword()
					break
				case 'transaction':
					this.changeTransactionPassword()
					break
				case '2fa':
					this.setTwoFactorAuth()
					break
				case 'device':
					this.setLoginDevice()
					break
				case 'questions':
					this.setSecurityQuestions()
					break
			}
		},

		// 获取登录安全计数
		getLoginSecurityCount() {
			let count = 0
			if (!this.isPasswordExpired) count++
			if (this.biometricEnabled) count++
			if (this.loginDevices.length <= 3) count++
			return count
		},

		// 获取交易安全计数
		getTransactionSecurityCount() {
			let count = 0
			if (!this.isTransactionPasswordExpired) count++
			if (this.transactionLimit > 0) count++
			if (this.smsVerificationEnabled) count++
			return count
		},

		// 获取账户保护计数
		getAccountProtectionCount() {
			let count = 0
			if (this.securityQuestionsSet) count++
			if (this.emergencyContactSet) count++
			if (this.accountLockEnabled) count++
			return count
		},

		// 获取安全日志计数
		getSecurityLogCount() {
			return 2 // 固定为2个功能
		},

		// 获取高级安全计数
		getAdvancedSecurityCount() {
			let count = 0
			if (this.twoFactorEnabled) count++
			if (this.securityNotificationsEnabled) count++
			return count
		},

		// 获取安全评分提示
		getScoreTip() {
			if (this.securityScore >= 90) {
				return '账户安全状况优秀，继续保持！'
			} else if (this.securityScore >= 70) {
				return '账户安全状况良好，建议完善安全设置'
			} else if (this.securityScore >= 50) {
				return '账户安全状况一般，请及时完善安全设置'
			} else {
				return '账户安全状况较差，请立即完善安全设置'
			}
		},

		// 修改登录密码
		changeLoginPassword() {
			uni.showModal({
				title: '修改登录密码',
				content: '为了账户安全，建议您定期更换密码。新密码应包含字母、数字和特殊字符。',
				confirmText: '立即修改',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 模拟密码修改
						this.passwordUpdateTime = new Date().toLocaleDateString()
						this.calculateSecurityScore()
						this.generateSecurityRecommendations()
						
						uni.showToast({
							title: '密码已更新',
							icon: 'success'
						})
					}
				}
			})
		},

		// 生物识别开关变化
		onBiometricChange(e) {
			this.biometricEnabled = e.detail.value
			this.saveSecuritySettings()
			
			uni.showToast({
				title: this.biometricEnabled ? '已开启生物识别' : '已关闭生物识别',
				icon: 'success'
			})
		},

		// 设置登录设备
		setLoginDevice() {
			uni.showModal({
				title: '登录设备管理',
				content: `当前有${this.loginDevices.length}台设备登录，建议定期检查并清理不常用的设备。`,
				confirmText: '查看详情',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						this.showDeviceList()
					}
				}
			})
		},

		// 显示设备列表
		showDeviceList() {
			const deviceList = this.loginDevices.map(device => 
				`${device.name}\n最后登录：${device.lastLogin}\n位置：${device.location}\nIP：${device.ip}`
			).join('\n\n')

			uni.showModal({
				title: '登录设备列表',
				content: deviceList,
				showCancel: false,
				confirmText: '确定'
			})
		},

		// 修改交易密码
		changeTransactionPassword() {
			uni.showModal({
				title: '修改交易密码',
				content: '交易密码用于重要交易验证，建议与登录密码不同。',
				confirmText: '立即修改',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 模拟交易密码修改
						this.transactionPasswordUpdateTime = new Date().toLocaleDateString()
						this.calculateSecurityScore()
						this.generateSecurityRecommendations()
						
						uni.showToast({
							title: '交易密码已更新',
							icon: 'success'
						})
					}
				}
			})
		},

		// 设置交易限额
		setTransactionLimit() {
			uni.showModal({
				title: '设置交易限额',
				content: `当前单笔交易限额：¥${this.transactionLimit.toLocaleString()}\n建议根据日常消费需求设置合适的限额。`,
				confirmText: '修改限额',
				cancelText: '保持现状',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '功能开发中',
							icon: 'none'
						})
					}
				}
			})
		},

		// 短信验证开关变化
		onSmsVerificationChange(e) {
			this.smsVerificationEnabled = e.detail.value
			this.saveSecuritySettings()
			
			uni.showToast({
				title: this.smsVerificationEnabled ? '已开启短信验证' : '已关闭短信验证',
				icon: 'success'
			})
		},

		// 设置安全问题
		setSecurityQuestions() {
			uni.showModal({
				title: '设置安全问题',
				content: '安全问题用于身份验证和密码重置，建议设置3个不同的问题。',
				confirmText: '立即设置',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 模拟设置安全问题
						this.securityQuestionsSet = true
						this.calculateSecurityScore()
						this.generateSecurityRecommendations()
						
						uni.showToast({
							title: '安全问题已设置',
							icon: 'success'
						})
					}
				}
			})
		},

		// 设置紧急联系人
		setEmergencyContact() {
			uni.showModal({
				title: '设置紧急联系人',
				content: '紧急联系人用于账户异常情况下的身份验证和通知。',
				confirmText: '立即设置',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 模拟设置紧急联系人
						this.emergencyContactSet = true
						this.calculateSecurityScore()
						this.generateSecurityRecommendations()
						
						uni.showToast({
							title: '紧急联系人已设置',
							icon: 'success'
						})
					}
				}
			})
		},

		// 账户锁定开关变化
		onAccountLockChange(e) {
			this.accountLockEnabled = e.detail.value
			this.saveSecuritySettings()
			
			uni.showToast({
				title: this.accountLockEnabled ? '已开启账户锁定' : '已关闭账户锁定',
				icon: 'success'
			})
		},

		// 双重认证开关变化
		onTwoFactorChange(e) {
			this.twoFactorEnabled = e.detail.value
			this.saveSecuritySettings()
			
			uni.showToast({
				title: this.twoFactorEnabled ? '已启用双重认证' : '已关闭双重认证',
				icon: 'success'
			})
		},

		// 安全通知开关变化
		onSecurityNotificationsChange(e) {
			this.securityNotificationsEnabled = e.detail.value
			this.saveSecuritySettings()
			
			uni.showToast({
				title: this.securityNotificationsEnabled ? '已启用安全通知' : '已关闭安全通知',
				icon: 'success'
			})
		},

		// 设置双重认证
		setTwoFactorAuth() {
			if (this.twoFactorEnabled) {
				uni.showModal({
					title: '双重认证',
					content: '双重认证已启用，建议使用Google Authenticator等应用。',
					showCancel: false,
					confirmText: '确定'
				})
			} else {
				uni.showModal({
					title: '启用双重认证',
					content: '双重认证可以显著提高账户安全性，建议启用。',
					confirmText: '立即启用',
					cancelText: '稍后再说',
					success: (res) => {
						if (res.confirm) {
							this.twoFactorEnabled = true
							this.saveSecuritySettings()
						}
					}
				})
			}
		},

		// 设置安全通知
		setSecurityNotifications() {
			uni.showModal({
				title: '安全通知设置',
				content: '安全通知可以及时提醒您账户的异常活动。',
				confirmText: '确定',
				showCancel: false
			})
		},

		// 查看登录记录
		viewLoginHistory() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		},

		// 查看安全事件
		viewSecurityEvents() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped>
.security-page {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 40rpx;
}

/* 导航栏 */
.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
	color: white;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-left, .nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 40rpx;
	font-weight: bold;
}

.refresh-btn {
	font-size: 32rpx;
	cursor: pointer;
	transition: transform 0.3s ease;
}

.refresh-btn:active {
	transform: rotate(180deg);
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
}

/* 安全状态概览 */
.security-overview {
	margin: 30rpx;
	background: white;
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.overview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.overview-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.security-score {
	display: flex;
	align-items: baseline;
}

.score-number {
	font-size: 48rpx;
	font-weight: bold;
	color: #4caf50;
}

.score-unit {
	font-size: 24rpx;
	color: #666;
	margin-left: 8rpx;
}

.score-bar {
	width: 100%;
	height: 12rpx;
	background: #f0f0f0;
	border-radius: 6rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}

.score-progress {
	height: 100%;
	background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%);
	border-radius: 6rpx;
	transition: width 0.3s ease;
}

.score-tip {
	font-size: 24rpx;
	color: #666;
	text-align: center;
	display: block;
	margin-bottom: 20rpx;
}

.score-details {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.detail-item {
	font-size: 22rpx;
	color: #888;
	text-align: center;
}

/* 安全功能列表 */
.security-sections {
	margin: 0 30rpx;
}

.security-section {
	background: white;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 40rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background: #f8f9fa;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-count {
	font-size: 24rpx;
	color: #4caf50;
	background: rgba(76, 175, 80, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.security-list {
	padding: 0 40rpx;
}

.security-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f8f8f8;
	transition: all 0.3s ease;
}

.security-item:last-child {
	border-bottom: none;
}

.security-item:active {
	background: rgba(76, 175, 80, 0.05);
}

.item-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.item-icon {
	font-size: 36rpx;
	margin-right: 25rpx;
	width: 60rpx;
	text-align: center;
}

.item-info {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.item-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.item-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 5rpx;
}

.item-update-time, .item-status-text, .item-device-info, .item-limit-info, .item-log-info {
	font-size: 20rpx;
	color: #999;
}

.item-right {
	display: flex;
	align-items: center;
}

.item-status {
	font-size: 24rpx;
	color: #4caf50;
	margin-right: 15rpx;
}

.item-status.warning {
	color: #ff9800;
}

.device-count {
	font-size: 24rpx;
	color: #666;
	margin-right: 15rpx;
}

.arrow {
	font-size: 28rpx;
	color: #999;
}

/* 安全提示 */
.security-tips {
	margin: 30rpx;
	background: white;
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.tips-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.tips-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.tips-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.tips-content {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.tip-item {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

/* 安全建议 */
.security-recommendations {
	margin: 30rpx;
	background: #fff3cd;
	border: 1rpx solid #ffeaa7;
	border-radius: 20rpx;
	padding: 40rpx;
}

.recommendations-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.recommendations-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.recommendations-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #856404;
}

.recommendations-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.recommendation-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: white;
	border-radius: 12rpx;
	border: 1rpx solid #ffeaa7;
	transition: all 0.3s ease;
}

.recommendation-item:active {
	background: #f8f9fa;
}

.recommendation-text {
	font-size: 26rpx;
	color: #856404;
	flex: 1;
}

.recommendation-action {
	font-size: 24rpx;
	color: #4caf50;
	font-weight: bold;
	background: rgba(76, 175, 80, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}
</style>


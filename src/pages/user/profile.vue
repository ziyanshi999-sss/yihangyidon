<template>
	<view class="profile-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<view class="nav-title">个人资料</view>
			<view class="nav-right">
				<text class="save-btn" @click="saveProfile">保存</text>
			</view>
		</view>

		<view class="profile-form">
			<view class="avatar-section">
				<view class="avatar-wrapper">
					<image 
						:src="profileData.avatar || '/static/default-avatar.png'" 
						class="avatar-image"
						mode="aspectFill"
					></image>
					<view class="avatar-edit" @click="changeAvatar">
						<text class="edit-icon">📷</text>
					</view>
				</view>
				<text class="avatar-tip">点击更换头像</text>
			</view>

			<view class="form-section">
				<view class="section-title">基本信息</view>
				<view class="form-group">
					<text class="form-label">真实姓名</text>
					<input 
						class="form-input" 
						v-model="profileData.realName" 
						placeholder="请输入真实姓名"
						maxlength="20"
					/>
				</view>
				<view class="form-group">
					<text class="form-label">昵称</text>
					<input 
						class="form-input" 
						v-model="profileData.nickname" 
						placeholder="请输入昵称"
						maxlength="20"
					/>
				</view>
				<view class="form-group">
					<text class="form-label">性别</text>
					<picker 
						class="form-picker" 
						:value="genderIndex" 
						:range="genderOptions"
						@change="onGenderChange"
					>
						<view class="picker-text">{{ genderOptions[genderIndex] }}</view>
					</picker>
				</view>
				<view class="form-group">
					<text class="form-label">出生日期</text>
					<picker 
						class="form-picker" 
						mode="date" 
						:value="profileData.birthDate" 
						@change="onBirthDateChange"
					>
						<view class="picker-text">{{ profileData.birthDate || '请选择出生日期' }}</view>
					</picker>
				</view>
			</view>

			<view class="form-section">
				<view class="section-title">联系方式</view>
				<view class="form-group">
					<text class="form-label">手机号码</text>
					<view class="phone-input-group">
						<input 
							class="form-input phone-input" 
							v-model="profileData.phone" 
							placeholder="请输入手机号码"
							type="number"
							maxlength="11"
							:disabled="true"
						/>
						<text class="phone-status">已验证</text>
					</view>
				</view>
				<view class="form-group">
					<text class="form-label">邮箱地址</text>
					<input 
						class="form-input" 
						v-model="profileData.email" 
						placeholder="请输入邮箱地址"
						type="email"
						maxlength="50"
					/>
				</view>
			</view>

			<view class="form-section">
				<view class="section-title">地址信息</view>
				<view class="form-group">
					<text class="form-label">身份证号</text>
					<input 
						class="form-input" 
						v-model="profileData.idCard" 
						placeholder="请输入身份证号码"
						maxlength="18"
						:disabled="true"
					/>
				</view>
				<view class="form-group">
					<text class="form-label">居住地址</text>
					<input 
						class="form-input" 
						v-model="profileData.address" 
						placeholder="请输入详细居住地址"
						maxlength="100"
					/>
				</view>
			</view>
		</view>

		<view class="bottom-actions">
			<button class="save-button" @click="saveProfile">
				保存修改
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			profileData: {
				avatar: '',
				realName: '',
				nickname: '',
				gender: '男',
				birthDate: '',
				phone: '',
				email: '',
				idCard: '',
				address: ''
			},
			genderOptions: ['男', '女'],
			genderIndex: 0
		}
	},
	onLoad() {
		this.loadProfileData()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		loadProfileData() {
			try {
				const userInfo = uni.getStorageSync('userInfo') || uni.getStorageSync('currentUser')
				if (userInfo) {
					this.profileData = { ...this.profileData, ...userInfo }
					this.setPickerIndexes()
				}
			} catch (error) {
				console.error('加载个人资料失败:', error)
			}
		},

		setPickerIndexes() {
			this.genderIndex = this.genderOptions.indexOf(this.profileData.gender) || 0
		},

		changeAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.profileData.avatar = res.tempFilePaths[0]
				}
			})
		},

		onGenderChange(e) {
			this.genderIndex = e.detail.value
			this.profileData.gender = this.genderOptions[e.detail.value]
		},

		onBirthDateChange(e) {
			this.profileData.birthDate = e.detail.value
		},

		saveProfile() {
			try {
				let userInfo = uni.getStorageSync('userInfo') || uni.getStorageSync('currentUser')
				if (userInfo) {
					userInfo = { ...userInfo, ...this.profileData }
					uni.setStorageSync('userInfo', userInfo)
					uni.setStorageSync('currentUser', userInfo)
				}

				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})

				setTimeout(() => {
					this.goBack()
				}, 1500)

			} catch (error) {
				console.error('保存个人资料失败:', error)
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style scoped>
.profile-page {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

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

.save-btn {
	font-size: 28rpx;
	font-weight: bold;
	cursor: pointer;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
}

.profile-form {
	padding: 30rpx;
}

.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
	padding: 40rpx;
	background: white;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.avatar-wrapper {
	position: relative;
	margin-bottom: 20rpx;
}

.avatar-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	border: 4rpx solid #4caf50;
}

.avatar-edit {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 40rpx;
	height: 40rpx;
	background: #4caf50;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.edit-icon {
	font-size: 20rpx;
	color: white;
}

.avatar-tip {
	font-size: 24rpx;
	color: #666;
}

.form-section {
	background: white;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	padding: 30rpx 40rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background: #f8f9fa;
}

.form-group {
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f8f8f8;
}

.form-group:last-child {
	border-bottom: none;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	font-weight: 500;
}

.form-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	background: #fff;
	box-sizing: border-box;
}

.form-input:focus {
	border-color: #4caf50;
}

.form-input:disabled {
	background: #f5f5f5;
	color: #999;
}

.phone-input-group {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.phone-input {
	flex: 1;
}

.phone-status {
	font-size: 24rpx;
	color: #4caf50;
	background: rgba(76, 175, 80, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	white-space: nowrap;
}

.form-picker {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-sizing: border-box;
}

.picker-text {
	font-size: 28rpx;
	color: #333;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 30rpx;
	background: white;
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.save-button {
	width: 100%;
	background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
	color: white;
	border: none;
	border-radius: 50rpx;
	padding: 30rpx;
	font-size: 32rpx;
	font-weight: bold;
}

.save-button:active {
	transform: scale(0.98);
}
</style>

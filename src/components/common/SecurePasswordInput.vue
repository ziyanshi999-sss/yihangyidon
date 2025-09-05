<template>
	<view class="secure-password-input">
		<view class="input-container">
			<view class="password-display">
				<view 
					class="password-char" 
					v-for="(char, index) in displayChars" 
					:key="index"
					:class="{ 'active': index === currentIndex }"
				>
					{{ char }}
				</view>
			</view>
			<input 
				class="hidden-input"
				:type="inputType"
				:value="actualPassword"
				@input="onInput"
				@focus="onFocus"
				@blur="onBlur"
				:maxlength="maxLength"
				:placeholder="placeholder"
				ref="passwordInput"
			/>
		</view>
		
		<!-- 虚拟键盘 -->
		<view class="virtual-keyboard" v-if="showVirtualKeyboard">
			<view class="keyboard-row" v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex">
				<view 
					class="keyboard-key" 
					v-for="(key, keyIndex) in row" 
					:key="keyIndex"
					@click="onKeyPress(key)"
					:class="{ 'special-key': key === 'delete' || key === 'confirm' }"
				>
					<text v-if="key === 'delete'">⌫</text>
					<text v-else-if="key === 'confirm'">确认</text>
					<text v-else>{{ key }}</text>
				</view>
			</view>
		</view>
		
		<!-- 密码强度指示器 -->
		<view class="password-strength" v-if="showStrengthIndicator">
			<view class="strength-bar">
				<view 
					class="strength-fill" 
					:class="strengthClass"
					:style="{ width: strengthWidth + '%' }"
				></view>
			</view>
			<text class="strength-text">{{ strengthText }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SecurePasswordInput',
	props: {
		// 最大长度
		maxLength: {
			type: Number,
			default: 20
		},
		// 占位符
		placeholder: {
			type: String,
			default: '请输入密码'
		},
		// 是否显示虚拟键盘
		showVirtualKeyboard: {
			type: Boolean,
			default: false
		},
		// 是否显示密码强度指示器
		showStrengthIndicator: {
			type: Boolean,
			default: true
		},
		// 输入类型
		inputType: {
			type: String,
			default: 'password'
		}
	},
	data() {
		return {
			actualPassword: '', // 实际密码
			displayChars: [], // 显示的字符（打乱后）
			currentIndex: 0, // 当前输入位置
			isFocused: false,
			keyboardLayout: [
				['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
				['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
				['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
				['z', 'x', 'c', 'v', 'b', 'n', 'm'],
				['delete', 'confirm']
			],
			// 打乱字符映射
			scrambledChars: ['*', '#', '@', '$', '%', '&', '+', '=', '!', '?']
		}
	},
	computed: {
		// 密码强度
		passwordStrength() {
			return this.calculatePasswordStrength(this.actualPassword)
		},
		// 强度宽度
		strengthWidth() {
			return this.passwordStrength.score * 25 // 0-100%
		},
		// 强度样式类
		strengthClass() {
			return `strength-${this.passwordStrength.level}`
		},
		// 强度文本
		strengthText() {
			return this.passwordStrength.text
		}
	},
	methods: {
		// 输入处理
		onInput(e) {
			const value = e.detail.value
			this.actualPassword = value
			this.updateDisplayChars()
			this.currentIndex = value.length
			
			// 触发输入事件
			this.$emit('input', value)
			this.$emit('change', value)
		},
		
		// 焦点处理
		onFocus() {
			this.isFocused = true
			this.$emit('focus')
		},
		
		onBlur() {
			this.isFocused = false
			this.$emit('blur')
		},
		
		// 更新显示字符
		updateDisplayChars() {
			const length = this.actualPassword.length
			this.displayChars = []
			
			for (let i = 0; i < this.maxLength; i++) {
				if (i < length) {
					// 显示打乱的字符
					const randomIndex = Math.floor(Math.random() * this.scrambledChars.length)
					this.displayChars.push(this.scrambledChars[randomIndex])
				} else {
					this.displayChars.push('')
				}
			}
		},
		
		// 虚拟键盘按键处理
		onKeyPress(key) {
			if (key === 'delete') {
				if (this.actualPassword.length > 0) {
					this.actualPassword = this.actualPassword.slice(0, -1)
					this.updateDisplayChars()
					this.currentIndex = this.actualPassword.length
					this.$emit('input', this.actualPassword)
					this.$emit('change', this.actualPassword)
				}
			} else if (key === 'confirm') {
				this.$emit('confirm', this.actualPassword)
			} else {
				if (this.actualPassword.length < this.maxLength) {
					this.actualPassword += key
					this.updateDisplayChars()
					this.currentIndex = this.actualPassword.length
					this.$emit('input', this.actualPassword)
					this.$emit('change', this.actualPassword)
				}
			}
		},
		
		// 计算密码强度
		calculatePasswordStrength(password) {
			let score = 0
			let level = 'weak'
			let text = '弱'
			
			if (password.length === 0) {
				return { score: 0, level: 'empty', text: '请输入密码' }
			}
			
			// 长度评分
			if (password.length >= 6) score += 1
			if (password.length >= 8) score += 1
			if (password.length >= 12) score += 1
			
			// 字符类型评分
			if (/[a-z]/.test(password)) score += 1
			if (/[A-Z]/.test(password)) score += 1
			if (/[0-9]/.test(password)) score += 1
			if (/[^a-zA-Z0-9]/.test(password)) score += 1
			
			// 复杂度评分
			if (password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)) {
				score += 1
			}
			
			// 确定强度等级
			if (score >= 6) {
				level = 'strong'
				text = '强'
			} else if (score >= 4) {
				level = 'medium'
				text = '中'
			} else if (score >= 2) {
				level = 'weak'
				text = '弱'
			} else {
				level = 'very-weak'
				text = '很弱'
			}
			
			return { score, level, text }
		},
		
		// 清空密码
		clear() {
			this.actualPassword = ''
			this.updateDisplayChars()
			this.currentIndex = 0
		},
		
		// 获取密码
		getPassword() {
			return this.actualPassword
		},
		
		// 设置密码
		setPassword(password) {
			this.actualPassword = password
			this.updateDisplayChars()
			this.currentIndex = password.length
		}
	},
	mounted() {
		this.updateDisplayChars()
	}
}
</script>

<style scoped>
.secure-password-input {
	width: 100%;
}

.input-container {
	position: relative;
	width: 100%;
}

.password-display {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 0 20rpx;
	background: #fff;
	transition: border-color 0.3s ease;
}

.password-display:focus-within {
	border-color: #4caf50;
}

.password-char {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	background: #f5f5f5;
	border-radius: 8rpx;
	transition: all 0.3s ease;
}

.password-char.active {
	background: #4caf50;
	color: #fff;
	transform: scale(1.1);
}

.hidden-input {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	z-index: -1;
}

/* 虚拟键盘 */
.virtual-keyboard {
	margin-top: 30rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
}

.keyboard-row {
	display: flex;
	justify-content: center;
	margin-bottom: 15rpx;
}

.keyboard-row:last-child {
	margin-bottom: 0;
}

.keyboard-key {
	width: 60rpx;
	height: 60rpx;
	margin: 0 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	border: 1rpx solid #e0e0e0;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	transition: all 0.2s ease;
}

.keyboard-key:active {
	background: #4caf50;
	color: #fff;
	transform: scale(0.95);
}

.keyboard-key.special-key {
	width: 100rpx;
	background: #4caf50;
	color: #fff;
}

/* 密码强度指示器 */
.password-strength {
	margin-top: 20rpx;
}

.strength-bar {
	width: 100%;
	height: 8rpx;
	background: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
	margin-bottom: 10rpx;
}

.strength-fill {
	height: 100%;
	transition: width 0.3s ease;
	border-radius: 4rpx;
}

.strength-empty {
	background: #f0f0f0;
}

.strength-very-weak {
	background: #f44336;
}

.strength-weak {
	background: #ff9800;
}

.strength-medium {
	background: #ffeb3b;
}

.strength-strong {
	background: #4caf50;
}

.strength-text {
	font-size: 24rpx;
	color: #666;
	text-align: center;
	display: block;
}
</style>

/**
 * 用户状态管理
 * 使用Vue 3 Composition API进行状态管理
 */
import { reactive, computed } from 'vue'
import { getUserInfo, logout } from '@/api/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

// 用户状态
const state = reactive({
    // 用户信息
    userInfo: null,
    // 登录状态
    isLoggedIn: false,
    // token
    token: '',
    // 银行卡列表
    bankCards: [],
    // 账户余额
    balance: 0,
    // 认证状态
    authStatus: {
        realName: false,
        phone: false,
        email: false
    }
})

// 计算属性
const getters = {
    // 获取用户头像
    avatar: computed(() => state.userInfo?.avatar || ''),
    // 获取用户昵称
    nickname: computed(() => state.userInfo?.nickname || '用户'),
    // 获取用户手机号（脱敏）
    phone: computed(() => {
        if (!state.userInfo?.phone) return ''
        return state.userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }),
    // 获取默认银行卡
    defaultCard: computed(() => {
        return state.bankCards.find(card => card.isDefault) || null
    }),
    // 是否已实名认证
    isRealNameAuth: computed(() => state.authStatus.realName),
    // 格式化余额
    formattedBalance: computed(() => {
        return state.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    })
}

// 用户操作方法
const actions = {
    // 初始化用户状态
    async initUserState() {
        try {
            const token = getStorage('token', true)
            if (token) {
                state.token = token
                state.isLoggedIn = true

                // 获取用户信息
                const userInfo = getStorage('userInfo', true)
                if (userInfo) {
                    state.userInfo = userInfo
                } else {
                    await this.fetchUserInfo()
                }
            }
        } catch (error) {
            console.error('初始化用户状态失败:', error)
        }
    },

    // 登录
    async login(token, userInfo) {
        try {
            state.token = token
            state.userInfo = userInfo
            state.isLoggedIn = true

            // 保存到本地存储
            setStorage('token', token, true)
            setStorage('userInfo', userInfo, true)

            // 获取其他用户数据
            await this.fetchUserInfo()

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    // 退出登录
    async logout() {
        try {
            // 调用退出登录API
            await logout()

            // 清空状态
            this.clearUserState()

            // 跳转到登录页
            uni.navigateTo({
                url: '/login/login'
            })

            return Promise.resolve()
        } catch (error) {
            // 即使API调用失败，也要清空本地状态
            this.clearUserState()
            return Promise.reject(error)
        }
    },

    // 清空用户状态
    clearUserState() {
        state.userInfo = null
        state.isLoggedIn = false
        state.token = ''
        state.bankCards = []
        state.balance = 0
        state.authStatus = {
            realName: false,
            phone: false,
            email: false
        }

        // 清空本地存储
        removeStorage('token', true)
        removeStorage('userInfo', true)
    },

    // 获取用户信息
    async fetchUserInfo() {
        try {
            const userInfo = await getUserInfo()
            state.userInfo = userInfo

            // 更新本地存储
            setStorage('userInfo', userInfo, true)

            return Promise.resolve(userInfo)
        } catch (error) {
            console.error('获取用户信息失败:', error)
            return Promise.reject(error)
        }
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
        state.userInfo = { ...state.userInfo, ...userInfo }
        setStorage('userInfo', state.userInfo, true)
    },

    // 设置银行卡列表
    setBankCards(cards) {
        state.bankCards = cards
    },

    // 添加银行卡
    addBankCard(card) {
        state.bankCards.push(card)
    },

    // 删除银行卡
    removeBankCard(cardId) {
        const index = state.bankCards.findIndex(card => card.id === cardId)
        if (index > -1) {
            state.bankCards.splice(index, 1)
        }
    },

    // 设置账户余额
    setBalance(balance) {
        state.balance = balance
    },

    // 更新认证状态
    updateAuthStatus(authStatus) {
        state.authStatus = { ...state.authStatus, ...authStatus }
    }
}

// 导出用户store
export const useUserStore = () => {
    return {
        state,
        getters,
        actions
    }
}

export default useUserStore
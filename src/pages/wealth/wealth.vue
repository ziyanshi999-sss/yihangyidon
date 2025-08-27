<template>
  <view class="doctor-page">
    <h1>财富</h1>
  </view>
</template>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from '@/utils/auth.js'

export default {
  name: 'Wealth',
  
  onLoad(options) {
    console.log('财富页面加载', options)
  },
  
  onShow() {
    // 如果正在退出登录，跳过检查
    const isLoggingOut = uni.getStorageSync('isLoggingOut')
    if (isLoggingOut) {
      console.log('正在退出登录，跳过财富页面登录检查')
      return
    }
    
    // 强制检查登录状态
    if (!forceCheckLogin()) {
      console.log('财富页面：用户未登录，强制跳转')
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
      return
    }
    
    // 检查登录状态
    if (!checkLoginAndRedirect()) {
      return
    }
    
    // 页面显示逻辑
    console.log('财富页面显示')
  }
}
</script>

<style scoped>
</style>

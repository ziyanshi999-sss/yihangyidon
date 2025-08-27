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
    try {
      // 检查登录状态
      if (!forceCheckLogin()) {
        console.log('财富页面：用户未登录，跳转到登录页面')
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
        return
      }
      
      // 页面显示逻辑
      console.log('财富页面显示')
    } catch (error) {
      console.error('财富页面onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  }
}
</script>

<style scoped>
</style>

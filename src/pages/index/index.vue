<template>
  <view class="home-container">
    <h1>首页</h1>
  </view>
</template>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from '@/utils/auth.js'

export default {
  name: 'Index',
  
  onLoad(options) {
    console.log('首页加载', options)
  },
  
  onShow() {
    try {
      // 检查登录状态
      if (!forceCheckLogin()) {
        console.log('首页：用户未登录，跳转到登录页面')
        uni.reLaunch({
          url: '/pages/denglu/login'
        })
        return
      }
      
      // 页面显示逻辑
      console.log('首页显示')
    } catch (error) {
      console.error('首页onShow检查失败:', error)
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  }
}
</script>

<style scoped>
</style>
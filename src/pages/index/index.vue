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
    // 强制检查登录状态
    if (!forceCheckLogin()) {
      console.log('首页：用户未登录，强制跳转')
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
    console.log('首页显示')
  }
}
</script>

<style scoped>
</style>
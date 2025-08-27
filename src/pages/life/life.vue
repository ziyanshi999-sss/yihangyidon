<template>
  <view class="encyclopedia-page">
    <h1>生活</h1>
  </view>
</template>

<script>
import { checkLoginAndRedirect, forceCheckLogin } from '@/utils/auth.js'

export default {
  name: 'Life',
  
  onLoad(options) {
    console.log('生活页面加载', options)
  },
  
  onShow() {
    // 强制检查登录状态
    if (!forceCheckLogin()) {
      console.log('生活页面：用户未登录，强制跳转')
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
    console.log('生活页面显示')
  }
}
</script>

<style scoped>
</style>

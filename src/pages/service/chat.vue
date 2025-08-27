<template>
  <view class="chat-page">
    <view class="chat-header">
      <text class="title">AI 智能客服</text>
      <text class="sub">7×24小时为您服务</text>
    </view>

    <scroll-view scroll-y class="chat-body" :scroll-into-view="scrollIntoId">
      <view v-for="(m, i) in messages" :key="m.id" :id="'msg-' + i" class="msg-row" :class="m.role">
        <image v-if="m.role==='bot'" class="avatar" src="https://onlineservice.cdn-static.abchina.com.cn/chat/static/img/sister_icon.08ee4961.png" mode="aspectFit" />
        <view class="bubble">
          <rich-text :nodes="m.html"></rich-text>
          <text v-if="m.time" class="time">{{ m.time }}</text>
        </view>
        <image v-if="m.role==='user'" class="avatar" src="/static/tabbar/user-active.png" mode="aspectFit" />
      </view>
    </scroll-view>

    <view class="chat-input">
      <view class="tools">
        <button class="tool-btn" @click="chooseImage" hover-class="btn-hover" hover-stay-time="50">🖼️</button>
        <button class="tool-btn" @click="openEmoji" hover-class="btn-hover" hover-stay-time="50">😀</button>
        <button class="tool-btn" @click="startVoice" hover-class="btn-hover" hover-stay-time="50">🎤</button>
      </view>
      <input class="input" v-model="draft" :placeholder="placeholder" confirm-type="send" @confirm="send" />
      <button class="send" :disabled="!draft.trim() || sending" @click="send">{{ sending ? '发送中...' : '发送' }}</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      draft: '',
      sending: false,
      scrollIntoId: '',
      placeholder: '请输入您的问题，如“我要查询理财收益”',
      messages: [
        {
          id: 'hello',
          role: 'bot',
          html: '您好，我是农业银行AI客服。可为您解答存款、理财、保险、外汇等问题。',
          time: ''
        }
      ]
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album','camera'],
        success: (res) => {
          const path = res.tempFilePaths[0]
          this.messages.push({ id: Date.now()+ '-uimg', role: 'user', html: `<img src="${path}" style="max-width:100%;border-radius:8rpx;"/>`, time: this.nowTime() })
          this.toBottom()
        },
        fail: () => {
          uni.showToast({ title: '选择图片取消', icon: 'none' })
        }
      })
    },
    openEmoji() {
      uni.showToast({ title: '表情面板（待接入）', icon: 'none' })
    },
    startVoice() {
      uni.showToast({ title: '语音输入（待接入）', icon: 'none' })
    },
    send() {
      const content = this.draft.trim()
      if (!content || this.sending) return

      const userMsg = {
        id: Date.now() + '-u',
        role: 'user',
        html: this.escapeHtml(content),
        time: this.nowTime()
      }
      this.messages.push(userMsg)
      this.draft = ''
      this.toBottom()

      // 模拟AI回复
      this.sending = true
      setTimeout(() => {
        const reply = this.generateReply(content)
        this.messages.push({
          id: Date.now() + '-b',
          role: 'bot',
          html: reply,
          time: this.nowTime()
        })
        this.sending = false
        this.toBottom()
      }, 600)
    },
    generateReply(text) {
      const t = text.toLowerCase()
      if (t.includes('存款') || t.includes('定期') || t.includes('利率')) {
        return '存款业务：活期按日计息，定期支持3个月/6个月/1年/3年等档，起存金额1000元起。可通过“财富-存款”进行办理。'
      }
      if (t.includes('理财') || t.includes('收益') || t.includes('申购')) {
        return '理财产品分为低/中风险，起投金额1000-10000元不等，支持T+1灵活赎回与封闭期产品，详情见“财富-理财产品”。'
      }
      if (t.includes('保险') || t.includes('意外') || t.includes('重疾')) {
        return '保险服务：提供医疗险、意外险、重疾险等多品类方案，支持在线投保与电子保单。可在“财富-保险”查看。'
      }
      if (t.includes('外汇') || t.includes('汇率') || t.includes('结售汇')) {
        return '外汇业务：支持主要币种实时汇率查询与结售汇，您可在“财富-外汇”查看行情并发起交易。'
      }
      if (t.includes('人工') || t.includes('转接') || t.includes('客服')) {
        return '需要人工服务吗？您可以拨打客服热线 95599，我们将尽快为您安排专属服务。'
      }
      return '已收到您的问题。我将为您查找相关信息，您也可以具体描述业务类型（如：存款/理财/保险/外汇）。'
    },
    toBottom() {
      this.$nextTick(() => {
        this.scrollIntoId = 'msg-' + (this.messages.length - 1)
      })
    },
    escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },
    nowTime() {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    }
  }
}
</script>

<style scoped>
.chat-page { 
  --primary: #0f8a5f;         /* 主绿 */
  --primary-2: #0aa77f;       /* 渐变辅助绿 */
  --accent: #12b48a;          /* 高亮 */
  --bg: #f1faf7;              /* 页面浅绿色背景 */
  --line: #dfeee9;            /* 分割线 */
  --text: #1f2d3d;
  --muted: #7b8a8e;
  display: flex; flex-direction: column; min-height: 100vh; background: var(--bg);
}

/* 顶部条仿官网绿色头部 */
.chat-header { 
  padding: 20rpx; 
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
  color: #fff;
  border-bottom: 2rpx solid var(--line);
}
.title { font-size: 32rpx; font-weight: 700; }
.sub { display: block; font-size: 22rpx; opacity: 0.9; margin-top: 6rpx; }

/* 滚动区预留底部空间，避免被固定输入栏遮挡 */
.chat-body { flex: 1; padding: 16rpx 20rpx; padding-bottom: 200rpx; }
.msg-row { display: flex; align-items: flex-end; margin: 16rpx 0; gap: 12rpx; }
.msg-row.user { justify-content: flex-end; }
.avatar { width: 64rpx; height: 64rpx; border-radius: 50%; }
.bubble { max-width: 72%; padding: 16rpx 20rpx; border-radius: 16rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); }
.msg-row.bot .bubble { background: #ffffff; color: var(--text); border: 2rpx solid var(--line); }
.msg-row.user .bubble { background: var(--primary); color: #fff; }
.time { display: block; font-size: 20rpx; opacity: 0.85; margin-top: 6rpx; text-align: right; }

/* 输入区固定在底部 */
.chat-input { 
  position: fixed; 
  left: 0; right: 0; bottom: 0; 
  z-index: 1000; 
  display: flex; align-items: center; gap: 12rpx; 
  padding: 12rpx 16rpx calc(20rpx + env(safe-area-inset-bottom)); 
  background: #fff; 
  border-top: 2rpx solid var(--line); 
}
.tools { display: flex; align-items: center; gap: 8rpx; }
.tool-btn { 
  width: 64rpx; height: 64rpx; 
  display: inline-flex; align-items: center; justify-content: center; 
  background: #fff; color: var(--primary); border: 2rpx solid var(--line); 
  border-radius: 50%; font-size: 32rpx;
}
.btn-hover { opacity: 0.8; }

/* 统一输入框与按钮高度 */
.input { 
  flex: 1; 
  height: 88rpx; 
  box-sizing: border-box;
  background: #fff; 
  border: 2rpx solid var(--line); 
  border-radius: 999rpx; 
  padding: 0 24rpx; 
  font-size: 28rpx; 
}
.input:focus { border-color: var(--accent); }
.send { 
  height: 88rpx; 
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--primary); color: #fff; border: none; border-radius: 999rpx; 
  padding: 0 32rpx; font-size: 28rpx; 
  box-shadow: 0 6rpx 16rpx rgba(15,138,95,0.25); 
}
.send:active { background: var(--primary-2); }
</style>

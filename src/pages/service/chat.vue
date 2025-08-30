<template>
  <view class="chat-page">
    <view class="chat-header">
      <text class="title">AI 智能客服</text>
      <text class="sub">24小时为您服务</text>
    </view>

    <scroll-view scroll-y class="chat-body" :scroll-into-view="scrollIntoId">
      <view v-for="(m, i) in messages" :key="m.id" :id="'msg-' + i" class="msg-row" :class="m.role">
        <image v-if="m.role==='bot'" class="avatar" src="/static/wealth/aiavatar.png" mode="aspectFit" />
        <view class="bubble">
          <rich-text v-if="m.html" :nodes="m.html"></rich-text>
          <image v-if="m.image" :src="m.image" style="max-width:100%;border-radius:8rpx;" mode="widthFix" />
          <view v-if="m.audio" class="audio-row">
            <button class="mini-btn ghost" @click="playAudio(m.audio)">▶ 播放语音</button>
          </view>
          <text v-if="m.time" class="time">{{ m.time }}</text>
        </view>
        <image v-if="m.role==='user'" class="avatar" src="/static/wealth/useravatar.jpg" mode="aspectFit" />
      </view>
    </scroll-view>

    <!-- 待发送图片预览（不改变原布局，仅在输入栏上方增加一行） -->
    <view v-if="pendingImageLocalPath" class="pending-preview">
      <image :src="pendingImageLocalPath" class="pending-img" mode="aspectFit" />
      <button class="mini-btn ghost" @click="clearPendingImage">移除</button>
    </view>

    <!-- 表情面板（与 mobile.html 一致：图片表情选择） -->
    <view v-if="showEmoji" class="emoji-panel">
      <view
        class="emoji-item"
        v-for="(item, idx) in EMOJI_ITEMS"
        :key="idx"
        @click="appendEmoji(item)"
        :title="item.code"
      >
        <image :src="item.url" :alt="item.code" style="width:24px;height:24px" mode="aspectFit" />
      </view>
    </view>

    <view class="chat-input">
      <view class="tools">
        <button class="tool-btn" @click="chooseImage" hover-class="btn-hover" hover-stay-time="50">🖼️</button>
        <button class="tool-btn" @click="toggleEmoji" hover-class="btn-hover" hover-stay-time="50">😀</button>
        <button class="tool-btn" @click="toggleRecord" hover-class="btn-hover" hover-stay-time="50">{{ recording ? '■' : '🎤' }}</button>
      </view>
      <input class="input" v-model="draft" :placeholder="placeholder" confirm-type="send" @confirm="send" />
      <button class="send" :disabled="!draft.trim() || sending" @click="send">{{ sending ? '发送中...' : '发送' }}</button>
    </view>
  </view>
</template>

<script>
const AI_BASE = 'http://127.0.0.1:5000'

export default {
  data() {
    return {
      draft: '',
      sending: false,
      recording: false,
      scrollIntoId: '',
      placeholder: '请输入您的问题，如“我要查询理财收益”',
      sessionId: 'default',
      pendingImageBase64: '',
      pendingImageLocalPath: '',
      showEmoji: false,
      emojiList: ['😀','😁','😂','🤣','😊','😍','😎','👍','🙏','💰','📈','🏦','🛡️','💱'],
      // 与 mobile.html 一致的表情清单（含短码与图片URL），用于渲染替换
      EMOJI_ITEMS: [
        { code: ':grinning:', char: '😀', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png' },
        { code: ':smiley:', char: '😃', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f603.png' },
        { code: ':smile:', char: '😄', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f604.png' },
        { code: ':grin:', char: '😁', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f601.png' },
        { code: ':joy:', char: '😂', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f602.png' },
        { code: ':sweat_smile:', char: '😅', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f605.png' },
        { code: ':wink:', char: '😉', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f609.png' },
        { code: ':blush:', char: '😊', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60a.png' },
        { code: ':heart_eyes:', char: '😍', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60d.png' },
        { code: ':thinking:', char: '🤔', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f914.png' },
        { code: ':sunglasses:', char: '😎', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60e.png' },
        { code: ':cry:', char: '😢', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f622.png' },
        { code: ':sob:', char: '😭', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f62d.png' },
        { code: ':angry:', char: '😠', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f620.png' },
        { code: ':thumbsup:', char: '👍', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44d.png' },
        { code: ':clap:', char: '👏', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44f.png' },
        { code: ':ok_hand:', char: '👌', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44c.png' },
        { code: ':heart:', char: '❤️', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png' }
      ],
      messages: [
        {
          id: 'hello',
          role: 'bot',
          html: '您好，我是农业银行AI客服。可为您解答存款、理财、保险、外汇等问题。',
          time: ''
        }
      ],
      recorder: null,
      audioCtx: null
    }
  },
  onLoad() {
    // 录音与音频播放（仅小程序端生效）
    try {
      this.recorder = uni.getRecorderManager && uni.getRecorderManager()
      if (this.recorder) {
        this.recorder.onStop((res) => {
          this.recording = false
          const tempFilePath = res.tempFilePath
          this.uploadAudio(tempFilePath)
        })
      }
      this.audioCtx = uni.createInnerAudioContext && uni.createInnerAudioContext()
    } catch (e) {}
  },
  methods: {
    // 渲染：安全转义 + 基础Markdown + 表情替换（与 mobile.html 对齐）
    renderMarkdownAndEmojis(text = '') {
      let html = this.escapeHtml(text)
      // Markdown 粗体 **text**
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 换行
      html = html.replace(/\n/g, '<br/>')
      // 表情替换：短码/Unicode -> img（注意：小程序需将域名加入下载白名单）
      for (const item of (this.EMOJI_ITEMS || [])) {
        const img = `<img src="${item.url}" alt="${item.code}" style="height:1.2em;vertical-align:-0.2em"/>`
        html = html.split(item.code).join(img)
        html = html.split(item.char).join(img)
      }
      return html
    },
    playAudio(url) {
      try {
        if (!this.audioCtx) this.audioCtx = uni.createInnerAudioContext()
        this.audioCtx.src = url
        this.audioCtx.play()
      } catch (e) {
        uni.showToast({ title: '无法播放语音', icon: 'none' })
      }
    },
    toggleEmoji() {
      this.showEmoji = !this.showEmoji
    },
    appendEmoji(item) {
      const ch = (item && item.char) ? item.char : ''
      this.draft += (this.draft && !/\s$/.test(this.draft) ? ' ' : '') + ch + ' '
      this.showEmoji = false
    },
    toggleRecord() {
      if (!this.recorder) {
        uni.showToast({ title: '当前平台不支持录音', icon: 'none' })
        return
      }
      if (this.recording) {
        this.recorder.stop()
      } else {
        this.recording = true
        this.recorder.start({
          duration: 60000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        })
      }
    },
    uploadAudio(filePath) {
      uni.showLoading({ title: '识别中' })
      uni.uploadFile({
        url: `${AI_BASE}/api/speech-to-text`,
        name: 'audio',
        filePath,
        success: (res) => {
          uni.hideLoading()
          try {
            const data = JSON.parse(res.data)
            if (data.success && data.text) {
              this.draft = data.text
              this.send()
            } else {
              uni.showToast({ title: data.error || '识别失败', icon: 'none' })
            }
          } catch (e) {
            uni.showToast({ title: '解析失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '上传失败', icon: 'none' })
        }
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album','camera'],
        success: (res) => {
          const path = res.tempFilePaths[0]
          // 不立即发送，只记录待发送图片
          this.pendingImageLocalPath = path
          // 转base64（仅小程序端执行；H5 仅样式预览，不转换）
          try {
            // #ifdef MP-WEIXIN
            const fsm = (typeof wx !== 'undefined' && wx.getFileSystemManager) ? wx.getFileSystemManager() : (uni.getFileSystemManager && uni.getFileSystemManager())
            if (!fsm) throw new Error('getFileSystemManager 不可用')
            const ext = (path.split('.').pop() || '').toLowerCase()
            let mime = 'image/jpeg'
            if (ext === 'png') mime = 'image/png'
            else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg'
            else if (ext === 'webp') mime = 'image/webp'
            const base64 = fsm.readFileSync(path, 'base64')
            this.pendingImageBase64 = `data:${mime};base64,${base64}`
            // #endif
            // #ifndef MP-WEIXIN
            this.pendingImageBase64 = ''
            uni.showToast({ title: 'H5预览模式：不进行图片转换', icon: 'none' })
            // #endif
          } catch (e) {
            console.warn('图片转base64失败:', e)
            this.pendingImageBase64 = ''
            this.pendingImageLocalPath = ''
          }
          uni.showToast({ title: '已选择图片，可继续输入文字后发送', icon: 'none' })
        },
        fail: () => {
          uni.showToast({ title: '选择图片取消', icon: 'none' })
        }
      })
    },
    clearPendingImage() {
      this.pendingImageLocalPath = ''
      this.pendingImageBase64 = ''
    },
    async send() {
      const content = this.draft.trim()
      if (!content && !this.pendingImageBase64) {
        return
      }
      if (this.sending) return
      await this.sendMessage(content)
    },
    async sendMessage(content) {
      const renderedUser = this.renderMarkdownAndEmojis(content)
      const userMsg = { id: Date.now() + '-u', role: 'user', html: renderedUser, time: this.nowTime() }
      if (this.pendingImageLocalPath) {
        userMsg.image = this.pendingImageLocalPath
      }
      this.messages.push(userMsg)
      this.draft = ''
      this.showEmoji = false
      this.toBottom()

      this.sending = true
      try {
        // 调用 /api/chat（支持多模态）
        const [err, res] = await new Promise((resolve) => {
          uni.request({
            url: `${AI_BASE}/api/chat`,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            data: { message: content, session_id: this.sessionId, image: this.pendingImageBase64 || null },
            success: (r) => resolve([null, r]),
            fail: (e) => resolve([e, null])
          })
        })
        // 清除待发图片
        this.pendingImageBase64 = ''
        this.pendingImageLocalPath = ''
        if (err) throw err
        if (!res || res.statusCode < 200 || res.statusCode >= 300 || !res.data) throw new Error('接口异常')
        const data = res.data
        if (!(data.success && data.reply) && !data.reply) {
          throw new Error(data.error || '无有效应答')
        }
        let replyText = Array.isArray(data.reply) ? (data.reply.map(p => (p && p.text) ? p.text : '').join('')) : (typeof data.reply === 'string' ? data.reply : '')
        const renderedReply = this.renderMarkdownAndEmojis(replyText || '')
        // 先渲染文字
        const botId = Date.now() + '-b'
        this.messages.push({ id: botId, role: 'bot', html: renderedReply, time: data.timestamp || this.nowTime() })
        this.toBottom()
        // 再调用 TTS 获取语音
        const [tErr, tRes] = await new Promise((resolve) => {
          uni.request({
            url: `${AI_BASE}/api/text-to-speech`,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            data: { text: replyText || '' },
            success: (r) => resolve([null, r]),
            fail: (e) => resolve([e, null])
          })
        })
        if (!tErr && tRes && tRes.statusCode >= 200 && tRes.statusCode < 300 && tRes.data && tRes.data.success && tRes.data.audio_file) {
          const url = `${AI_BASE}/api/audio/${tRes.data.audio_file}`
          const lastIdx = this.messages.length - 1
          if (lastIdx >= 0 && this.messages[lastIdx].role === 'bot') {
            this.$set(this.messages[lastIdx], 'audio', url)
          }
        }
      } catch (e) {
        const reply = this.generateReply(content)
        const rendered = this.renderMarkdownAndEmojis(reply)
        this.messages.push({ id: Date.now() + '-b', role: 'bot', html: rendered, time: this.nowTime() })
        uni.showToast({ title: 'AI服务不可用，已使用本地回复', icon: 'none' })
      } finally {
        this.sending = false
        this.toBottom()
      }
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
  --primary: #0f8a5f;
  --primary-2: #0aa77f;
  --accent: #12b48a;
  --bg: #f1faf7;
  --line: #dfeee9;
  --text: #1f2d3d;
  --muted: #7b8a8e;
  display: flex; flex-direction: column; min-height: 100vh; background: var(--bg);
}
.chat-header { 
  padding: 20rpx; 
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
  color: #fff;
  border-bottom: 2rpx solid var(--line);
}
.title { font-size: 32rpx; font-weight: 700; }
.sub { display: block; font-size: 22rpx; opacity: 0.9; margin-top: 6rpx; }

.chat-body { flex: 1; padding: 16rpx 20rpx; padding-bottom: 260rpx; }
.msg-row { display: flex; align-items: flex-end; margin: 16rpx 0; gap: 12rpx; }
.msg-row.user { justify-content: flex-end; }
.avatar { width: 64rpx; height: 64rpx; border-radius: 50%; }
.bubble { max-width: 72%; padding: 16rpx 20rpx; border-radius: 16rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); }
.msg-row.bot .bubble { background: #ffffff; color: var(--text); border: 2rpx solid var(--line); }
.msg-row.user .bubble { background: var(--primary); color: #fff; }
.time { display: block; font-size: 20rpx; opacity: 0.85; margin-top: 6rpx; text-align: right; }
.audio-row { margin-top: 10rpx; }

/* 表情面板 */
.emoji-panel { position: fixed; left: 0; right: 0; bottom: 120rpx; background: #fff; border-top: 2rpx solid var(--line); padding: 12rpx; display: flex; flex-wrap: wrap; gap: 12rpx; z-index: 999; }
.emoji-item { font-size: 40rpx; padding: 8rpx 12rpx; }

/* 输入区 */
.chat-input { 
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 1000; 
  display: flex; align-items: center; gap: 12rpx; 
  padding: 12rpx 16rpx calc(20rpx + env(safe-area-inset-bottom)); 
  background: #fff; border-top: 2rpx solid var(--line); 
}
.tools { display: flex; align-items: center; gap: 8rpx; }
.tool-btn { width: 64rpx; height: 64rpx; display: inline-flex; align-items: center; justify-content: center; background: #fff; color: var(--primary); border: 2rpx solid var(--line); border-radius: 50%; font-size: 32rpx; }
.btn-hover { opacity: 0.8; }
.input { flex: 1; height: 88rpx; box-sizing: border-box; background: #fff; border: 2rpx solid var(--line); border-radius: 999rpx; padding: 0 24rpx; font-size: 28rpx; }
.input:focus { border-color: var(--accent); }
.send { height: 88rpx; display: inline-flex; align-items: center; justify-content: center; background: var(--primary); color: #fff; border: none; border-radius: 999rpx; padding: 0 32rpx; font-size: 28rpx; box-shadow: 0 6rpx 16rpx rgba(15,138,95,0.25); }
.send:active { background: var(--primary-2); }
.pending-preview { display: flex; align-items: center; gap: 12rpx; padding: 8rpx 16rpx; background: #fff; border-top: 2rpx solid var(--line); }
.pending-img { width: 160rpx; height: 160rpx; border-radius: 8rpx; border: 2rpx solid #f0f0f0; }
</style>

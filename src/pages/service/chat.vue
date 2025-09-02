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
// 后端地址策略：
// - H5：使用相对路径，通过 Vite 代理转发到后端（避免跨域/混合内容）
// - 小程序：优先读本地存储 AI_BASE（可在控制台设置），否则读环境变量 VITE_AI_BASE
const AI_BASE = (() => {
  let base = ''
  // #ifdef H5
  base = '' // 相对路径，配合 vite.config.js -> server.proxy['/api']
  // #endif
  // #ifdef MP-WEIXIN
  try {
    base = (uni.getStorageSync && uni.getStorageSync('AI_BASE')) || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AI_BASE) || ''
  } catch (_) { base = '' }
  // #endif
  return base
})()

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
    showThinking() {
      const botId = Date.now() + '-thinking'
      const msg = { id: botId, role: 'bot', html: '思考中…', time: '' }
      this.messages.push(msg)
      this.toBottom()
      return this.messages.length - 1
    },
    updateBotMessage(index, text) {
      const rendered = this.renderMarkdownAndEmojis(text)
      if (this.messages[index] && this.messages[index].role === 'bot') {
        this.$set(this.messages[index], 'html', rendered)
        this.$set(this.messages[index], 'time', this.nowTime())
      }
      this.toBottom()
    },
    typeOut(fullText, index, chunkSize = 2, interval = 30) {
      return new Promise((resolve) => {
        let pos = 0
        const step = () => {
          if (pos >= fullText.length) return resolve()
          const nextPos = Math.min(fullText.length, pos + chunkSize)
          const slice = fullText.slice(0, nextPos)
          this.updateBotMessage(index, slice)
          pos = nextPos
          setTimeout(step, interval)
        }
        // 从空开始
        this.updateBotMessage(index, '')
        step()
      })
    },
    async streamTextReply(content) {
      // 在H5端使用fetch流式；其他端或失败则回退普通请求
      const thinkingIndex = this.showThinking()
      try {
        if (!AI_BASE) throw new Error('未配置AI服务地址')
        if (typeof window === 'undefined' || !window.fetch) {
          throw new Error('stream not supported')
        }
        const res = await fetch(`${AI_BASE}/api/chat-stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, session_id: this.sessionId })
        })
        if (!res.ok || !res.body) throw new Error('stream request failed')
        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        let full = ''
        // 将“思考中…”先清空
        this.updateBotMessage(thinkingIndex, '')
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''
          for (const part of parts) {
            const line = part.trim()
            if (!line.startsWith('data:')) continue
            const dataPart = line.slice(5).trim()
            if (dataPart === '[DONE]') {
              buffer = ''
              break
            }
            try {
              const obj = JSON.parse(dataPart)
              const delta = obj && obj.delta ? obj.delta : ''
              if (delta) {
                full += delta
                this.updateBotMessage(thinkingIndex, full)
              }
            } catch (_) {
              // 非JSON增量，直接追加
              full += dataPart
              this.updateBotMessage(thinkingIndex, full)
            }
          }
        }
        // 流结束后TTS
        if (full) {
          const [tErr, tRes] = await new Promise((resolve) => {
            uni.request({
              url: `${AI_BASE}/api/text-to-speech`,
              method: 'POST',
              header: { 'Content-Type': 'application/json' },
              data: { text: full },
              success: (r) => resolve([null, r]),
              fail: (e) => resolve([e, null])
            })
          })
          if (!tErr && tRes && tRes.statusCode >= 200 && tRes.statusCode < 300 && tRes.data && tRes.data.success && tRes.data.audio_file) {
            const url = `${AI_BASE}/api/audio/${tRes.data.audio_file}`
            this.$set(this.messages[thinkingIndex], 'audio', url)
          }
        }
      } catch (e) {
        console.error('AI stream error:', e)
        // 失败回退到普通请求
        await this.requestOnceText(content, thinkingIndex)
      }
    },
    async requestOnceText(content, botIndexToReuse = null) {
      // 普通一次性请求（用于小程序或流失败）
      if (!AI_BASE) {
        const fallback = this.generateReply(content)
        const msg = '未配置AI服务地址，小程序可执行 uni.setStorageSync("AI_BASE","http://你的电脑IP:5000")；H5请配置 /api 代理'
        if (botIndexToReuse != null) this.updateBotMessage(botIndexToReuse, fallback)
        else this.messages.push({ id: Date.now() + '-b', role: 'bot', html: this.renderMarkdownAndEmojis(fallback), time: this.nowTime() })
        uni.showToast({ title: msg.slice(0,28), icon: 'none' })
        console.warn(msg)
        return
      }
      const [err, res] = await new Promise((resolve) => {
        uni.request({
          url: `${AI_BASE}/api/chat`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { message: content, session_id: this.sessionId, image: null },
          success: (r) => resolve([null, r]),
          fail: (e) => resolve([e, null])
        })
      })
      if (err || !res || res.statusCode < 200 || res.statusCode >= 300 || !res.data || (!res.data.success && !res.data.reply)) {
        const fallback = this.generateReply(content)
        if (botIndexToReuse != null) this.updateBotMessage(botIndexToReuse, fallback)
        else this.messages.push({ id: Date.now() + '-b', role: 'bot', html: this.renderMarkdownAndEmojis(fallback), time: this.nowTime() })
        console.error('AI /api/chat error:', err, res)
        uni.showToast({ title: 'AI服务请求失败', icon: 'none' })
        return
      }
      let replyText = Array.isArray(res.data.reply) ? (res.data.reply.map(p => (p && p.text) ? p.text : '').join('')) : (typeof res.data.reply === 'string' ? res.data.reply : '')
      // 小程序端伪流式（打字机效果）
      // #ifdef MP-WEIXIN
      if (botIndexToReuse != null) {
        await this.typeOut(replyText || '', botIndexToReuse, 2, 25)
      } else {
        const idx = this.showThinking()
        await this.typeOut(replyText || '', idx, 2, 25)
      }
      // #endif
      // #ifndef MP-WEIXIN
      const renderedReply = this.renderMarkdownAndEmojis(replyText || '')
      if (botIndexToReuse != null) this.updateBotMessage(botIndexToReuse, replyText || '')
      else this.messages.push({ id: Date.now() + '-b', role: 'bot', html: renderedReply, time: res.data.timestamp || this.nowTime() })
      // #endif
      // TTS
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
        // 确定目标索引（小程序伪流式下复用思考中索引）
        const lastIdx = botIndexToReuse != null ? botIndexToReuse : (this.messages.length - 1)
        if (lastIdx >= 0 && this.messages[lastIdx].role === 'bot') {
          this.$set(this.messages[lastIdx], 'audio', url)
        }
      }
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
    // 安全转义 + 简单Markdown + 表情替换
    renderMarkdownAndEmojis(text = '') {
      // 转义
      let html = this.escapeHtml(text || '')
      // 粗体 **text**
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 换行
      html = html.replace(/\n/g, '<br/>')
      // 表情：短码与Unicode替换为图片
      if (Array.isArray(this.EMOJI_ITEMS)) {
        for (const item of this.EMOJI_ITEMS) {
          const img = `<img src="${item.url}" alt="${item.code}" style="height:1.2em;vertical-align:-0.2em"/>`
          html = html.split(item.code).join(img)
          html = html.split(item.char).join(img)
        }
      }
      return html
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
        // 带图：一次性请求；纯文本：H5流式/小程序一次性
        if (this.pendingImageBase64) {
          await this.requestOnceText(content)
        } else {
          if (typeof window !== 'undefined' && window.fetch) {
            await this.streamTextReply(content)
          } else {
            // 小程序端：先显示思考中，再伪流式
            const thinkingIndex = this.showThinking()
            await this.requestOnceText(content, thinkingIndex)
          }
        }
      } catch (e) {
        const reply = this.generateReply(content)
        const rendered = this.renderMarkdownAndEmojis(reply)
        this.messages.push({ id: Date.now() + '-b', role: 'bot', html: rendered, time: this.nowTime() })
        uni.showToast({ title: 'AI服务不可用，已使用本地回复', icon: 'none' })
      } finally {
        this.sending = false
        // 清除待发图片
        this.pendingImageBase64 = ''
        this.pendingImageLocalPath = ''
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
.msg-row.user { justify-content: flex-end; padding-right: 40rpx; }
.avatar { width: 64rpx; height: 64rpx; border-radius: 50%; flex-shrink: 0; }
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

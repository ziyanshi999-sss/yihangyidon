<template>
    <view class="chat-page">
      <view class="chat-header">
        <text class="title">AI 智能客服</text>
        <text class="sub">24小时为您服务</text>
      </view>
  
      <scroll-view scroll-y class="chat-body" :scroll-into-view="scrollIntoId" scroll-with-animation="true">
        <!-- 预设问答区：猜你想了解 -->
        <view v-if="showFaqSuggestions" class="faq-card">
          <view class="faq-card-header">
            <image class="faq-avatar" src="/static/wealth/aiavatar.png" mode="aspectFit" />
            <text class="faq-title">猜您想要了解以下内容</text>
          </view>
          <view class="faq-list">
            <view class="faq-item" v-for="(q,idx) in faqSuggestions" :key="idx" @click="selectFaq(q)">
              <text class="faq-text">{{ q.title }}</text>
              <text class="faq-arrow">›</text>
            </view>
          </view>
        </view>
        <view v-for="(m, i) in messages" :key="m.id" :id="'msg-' + i" class="msg-row" :class="m.role">
          <image v-if="m.role==='bot'" class="avatar" src="/static/wealth/aiavatar.png" mode="aspectFit" />
          <view class="bubble">
            <rich-text v-if="m.html" :nodes="m.html"></rich-text>
            <image v-if="m.image" :src="m.image" class="message-img" mode="widthFix" />
            <text v-if="m.time" class="time">{{ m.time }}</text>
          </view>
          <!-- AI回复的播放按钮（仅在存在音频时显示） -->
          <view v-if="m.role === 'bot' && m.audio" class="play-btn-container">
                       <button 
               class="play-btn" 
               :class="{ 'playing': m.isPlaying }"
               @click="togglePlayAudio(m)"
               :disabled="!m.audio"
             >
               <view v-if="!m.isPlaying" class="speaker-icon">
                 <view class="speaker-body"></view>
                 <view class="speaker-waves">
                   <view class="wave"></view>
                   <view class="wave"></view>
                   <view class="wave"></view>
                 </view>
               </view>
               <view v-else class="speaker-icon playing">
                 <view class="speaker-body"></view>
                 <view class="speaker-waves">
                   <view class="wave active"></view>
                   <view class="wave active"></view>
                   <view class="wave active"></view>
                 </view>
               </view>
             </button>
          </view>
          <image v-if="m.role==='user'" class="avatar" src="/static/wealth/useravatar.jpg" mode="aspectFit" />
        </view>
        <!-- 底部锚点用于自动滚动 -->
        <view :id="scrollIntoId"></view>
      </scroll-view>
  
      <!-- 待发送图片预览（不改变原布局，仅在输入栏上方增加一行） -->
      <view v-if="pendingImageLocalPath" class="pending-preview">
        <image :src="pendingImageLocalPath" class="pending-img" mode="aspectFit" />
        <button class="mini-btn ghost" @click="clearPendingImage">移除</button>
      </view>
  
      <!-- 表情面板（与 mobile.html 一致：图片表情选择） -->
      <view v-show="showEmoji" class="emoji-panel">
        <view
          class="emoji-item"
          v-for="(item, idx) in EMOJI_ITEMS"
          :key="idx"
          @click="appendEmoji(item)"
          :title="item.code"
        >
          <image v-if="item.url" :src="item.url" :alt="item.code" style="width:24px;height:24px" mode="aspectFit" :lazy-load="false" @error="item.url=''" />
          <text v-else style="font-size:24px;line-height:24px">{{ item.char }}</text>
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
  // 导入前端AI API服务（已移除流式）
  import { chat, speechToText, textToSpeech, clearHistory } from '@/api/ai.js'
  
  export default {
    data() {
      return {
        draft: '',
        sending: false,
        recording: false,
        scrollIntoId: 'chat-bottom-anchor',
        placeholder: '请输入您的问题',
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
        // 预设问答
        showFaqSuggestions: true,
        faqSuggestions: [
          {
            title: '交易限额',
            answer: '我行渠道常见交易限额：\n- 微信银行单笔/单日可能存在额度限制，视账户与安全控件而定；\n- 手机银行按认证等级与设备控件不同；\n- 网银/U盾通常额度更高。\n如需提升额度：进入 设置-限额设置 或前往网点升级身份核验。'
          },
          {
            title: '个人消费贷款贴息范围',
            answer: '个人消费贷款贴息范围一般涵盖教育培训、家装家电、耐用消费品购置等合规消费用途，具体以当地贴息政策与银行审核为准。可咨询本地营业网点或致电95599。'
          },
          {
            title: '如何申请个人消费贷款贴息',
            answer: '申请流程：\n1) 确认是否在贴息活动覆盖区域及名单；\n2) 通过手机银行/网点提交贷款申请与相关材料；\n3) 审批后按合同发放；\n4) 贴息按政策周期与比例执行，系统自动核算抵扣。'
          },
          {
            title: '抗战胜利80周年普通纪念币',
            answer: '该纪念币发行与预约以人民银行公告为准。预约、兑换时间、额度及网点安排以公告为准，请关注人民银行与我行官方渠道通知。'
          }
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
        audioCtx: null,
        currentPlayingMessage: null
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
        // 初始化音频上下文
        this.initAudioContext()
      } catch (e) {
        console.error('onLoad初始化失败:', e)
      }
    },
    onUnload() {
      // 页面销毁时清理音频资源
      this.stopCurrentAudio()
      if (this.audioCtx) {
        this.audioCtx.destroy()
        this.audioCtx = null
      }
    },
    methods: {
      async selectFaq(item) {
        const renderedQ = this.renderMarkdownAndEmojis(item.title)
        const userMsg = { id: Date.now() + '-u', role: 'user', html: renderedQ, time: this.nowTime() }
        this.messages.push(userMsg)
        const botIndex = this.showThinking('思考中…')
        const answer = item.answer || '稍后为您补充详细说明。'
        await this.typeOut(answer, botIndex, 1, 30)
        // 生成并绑定TTS音频，显示播放按钮
        try {
          const tts = await textToSpeech(answer)
          if (tts && tts.success && this.messages[botIndex] && this.messages[botIndex].role === 'bot') {
            this.$set(this.messages[botIndex], 'audio', tts.audioPath)
          }
        } catch (e) {
          console.warn('预设问答TTS失败:', e)
        }
        this.toBottom()
      },
      showThinking(text = '思考中…') {
        const botId = Date.now() + '-thinking'
        const msg = { id: botId, role: 'bot', html: text, time: '' }
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
      typeOut(fullText, index, chunkSize = 1, interval = 50) {
        return new Promise((resolve) => {
          let pos = 0
          const step = () => {
            if (pos >= fullText.length) return resolve()
            const nextPos = Math.min(fullText.length, pos + chunkSize)
            const slice = fullText.slice(0, nextPos)
            this.updateBotMessage(index, slice)
            pos = nextPos
            // 每次追加都触发滚动
            this.toBottom()
            setTimeout(step, interval)
          }
          // 从空开始
          this.updateBotMessage(index, '')
          this.toBottom()
          step()
        })
      },
      // 已移除流式实现，统一走一次性请求
      async requestOnceText(content, botIndexToReuse = null, imageData = null) {
        // 使用前端API进行一次性请求，统一采用打字机效果展示（所有平台）
        try {
          const result = await chat(content, this.sessionId, imageData != null ? imageData : this.pendingImageBase64)
          
          if (result.success) {
            const replyText = result.reply || ''
            const targetIndex = botIndexToReuse != null ? botIndexToReuse : this.showThinking()
            await this.typeOut(replyText, targetIndex, 1, 50)
            
            // TTS
            const ttsResult = await textToSpeech(replyText)
            console.log('TTS结果:', ttsResult)
            if (ttsResult.success) {
              if (targetIndex >= 0 && this.messages[targetIndex].role === 'bot') {
                console.log('设置音频路径:', ttsResult.audioPath)
                this.$set(this.messages[targetIndex], 'audio', ttsResult.audioPath)
                console.log('消息对象:', this.messages[targetIndex])
              }
            } else {
              console.error('TTS失败:', ttsResult.error)
            }
          } else {
            throw new Error(result.error || 'AI服务请求失败')
          }
        } catch (e) {
          console.error('AI request error:', e)
          const fallback = this.generateReply(content)
          if (botIndexToReuse != null) this.updateBotMessage(botIndexToReuse, fallback)
          else this.messages.push({ id: Date.now() + '-b', role: 'bot', html: this.renderMarkdownAndEmojis(fallback), time: this.nowTime() })
          uni.showToast({ title: 'AI服务请求失败', icon: 'none' })
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
      togglePlayAudio(message) {
        console.log('点击播放按钮，消息对象:', message)
        console.log('音频路径:', message.audio)
        console.log('播放状态:', message.isPlaying)
        console.log('音频数据前100字符:', message.audio ? message.audio.substring(0, 100) : '无')
        
        if (!message.audio) {
          uni.showToast({ title: '没有语音内容', icon: 'none' })
          return
        }
        
        // 如果当前消息正在播放，则停止
        if (message.isPlaying) {
          this.stopCurrentAudio()
          return
        }
        
        // 停止其他正在播放的音频
        this.stopCurrentAudio()
        
        // 确保音频上下文存在
        if (!this.audioCtx) {
          console.log('音频上下文不存在，重新初始化')
          this.initAudioContext()
        }
        
        // 开始播放当前消息的音频
        try {
          console.log('设置音频源:', message.audio)
          
          // 直接使用临时文件方式播放（避免base64兼容性问题）
          try {
            // 将base64转换为临时文件
            const base64Data = message.audio.replace(/^data:audio\/(mp3|mpeg);base64,/, '')
            console.log('base64数据长度:', base64Data.length)
            
            const arrayBuffer = this.base64ToArrayBuffer(base64Data)
            console.log('ArrayBuffer长度:', arrayBuffer.byteLength)
            
            // 根据平台选择不同的文件系统API
            // #ifdef MP-WEIXIN
            // 微信小程序环境
            const fs = uni.getFileSystemManager()
            const tempFilePath = `${uni.env.USER_DATA_PATH}/temp_audio_${Date.now()}.mp3`
            
            console.log('开始保存临时文件(小程序):', tempFilePath)
            
            // 优先以 base64 写入，兼容性更好；失败再退回 ArrayBuffer 写入
            fs.writeFile({
              filePath: tempFilePath,
              data: base64Data,
              encoding: 'base64',
              success: () => {
                console.log('临时文件保存成功(小程序,base64):', tempFilePath)
                this.audioCtx.src = tempFilePath
                this.audioCtx.play()
                this.$set(message, 'isPlaying', true)
                this.currentPlayingMessage = message
              },
              fail: (err1) => {
                console.warn('base64写入失败，改用ArrayBuffer:', err1)
                fs.writeFile({
                  filePath: tempFilePath,
                  data: arrayBuffer,
                  success: () => {
                    console.log('临时文件保存成功(小程序,ArrayBuffer):', tempFilePath)
                    this.audioCtx.src = tempFilePath
                    this.audioCtx.play()
                    this.$set(message, 'isPlaying', true)
                    this.currentPlayingMessage = message
                  },
                  fail: (err2) => {
                    console.error('保存临时文件失败(小程序):', err2)
                    console.error('错误详情:', JSON.stringify(err2))
                    uni.showToast({ title: '音频格式不支持', icon: 'none' })
                  }
                })
              }
            })
            // #endif
            
            // #ifdef APP-PLUS || APP-NVUE
            // App-Plus环境（HBuilderX手机基座）优先使用安卓原生写文件再播放
            try {
              console.log('App-Plus环境：使用Android原生写入文件后播放')
              const tempFileName = `temp_audio_${Date.now()}.mp3`
              const appPlusTempPath = `_doc/${tempFileName}`
              const nativePath = plus.io.convertLocalFileSystemURL(appPlusTempPath)
  
              // 使用 Android 原生 API 写文件
              const Base64 = plus.android.importClass('android.util.Base64')
              const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
              const File = plus.android.importClass('java.io.File')
              const bytes = Base64.decode(base64Data, Base64.DEFAULT)
              const file = new File(nativePath)
              const fos = new FileOutputStream(file)
              fos.write(bytes)
              fos.flush()
              fos.close()
              console.log('原生写入完成:', nativePath)
  
              this.audioCtx.src = appPlusTempPath
              this.audioCtx.play()
              // 设置播放状态
              this.$set(message, 'isPlaying', true)
              this.currentPlayingMessage = message
            } catch (appPlusNativeErr) {
              console.error('App-Plus 原生写入失败，回退尝试base64播放:', appPlusNativeErr)
              try {
                this.audioCtx.src = message.audio
                this.audioCtx.play()
                // 设置播放状态
                this.$set(message, 'isPlaying', true)
                this.currentPlayingMessage = message
              } catch (fallbackErr) {
                console.error('App-Plus base64播放仍失败:', fallbackErr)
                uni.showToast({ title: '播放失败', icon: 'none' })
              }
            }
            // #endif
            
            // #ifndef MP-WEIXIN || APP-PLUS || APP-NVUE
            // H5或其他环境，尝试直接播放base64
            console.log('H5环境，尝试直接播放base64')
            this.audioCtx.src = message.audio
            this.audioCtx.play()
            
            // 设置播放状态
            this.$set(message, 'isPlaying', true)
            this.currentPlayingMessage = message
            // #endif
            
          } catch (convertError) {
            console.error('音频转换失败:', convertError)
            console.error('转换错误堆栈:', convertError.stack)
            uni.showToast({ title: '音频格式不支持', icon: 'none' })
          }
          
        } catch (e) {
          console.error('播放音频失败:', e)
          console.error('错误堆栈:', e.stack)
          uni.showToast({ title: '无法播放语音', icon: 'none' })
        }
      },
      stopCurrentAudio() {
        if (this.audioCtx) {
          this.audioCtx.stop()
        }
        
        if (this.currentPlayingMessage) {
          this.$set(this.currentPlayingMessage, 'isPlaying', false)
          this.currentPlayingMessage = null
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
        speechToText(filePath).then(result => {
          uni.hideLoading()
          if (result.success && result.text) {
            this.draft = result.text
            this.send()
          } else {
            uni.showToast({ title: result.error || '识别失败', icon: 'none' })
          }
        }).catch(e => {
          uni.hideLoading()
          uni.showToast({ title: '识别失败', icon: 'none' })
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
            // 转base64：支持小程序与 App-Plus（安卓基座）
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
  
              // #ifdef APP-PLUS
              const ext2 = (path.split('.').pop() || '').toLowerCase()
              let mime2 = 'image/jpeg'
              if (ext2 === 'png') mime2 = 'image/png'
              else if (ext2 === 'jpg' || ext2 === 'jpeg') mime2 = 'image/jpeg'
              else if (ext2 === 'webp') mime2 = 'image/webp'
              plus.io.resolveLocalFileSystemURL(path, (entry) => {
                entry.file((file) => {
                  const reader = new plus.io.FileReader()
                  reader.onloadend = (e) => {
                    const dataUrl = e.target && e.target.result ? String(e.target.result) : ''
                    // dataUrl 形如 data:<mime>;base64,xxxx
                    if (dataUrl && dataUrl.startsWith('data:')) {
                      this.pendingImageBase64 = dataUrl
                    } else if (dataUrl) {
                      // 兜底：拼接 MIME 前缀
                      this.pendingImageBase64 = `data:${mime2};base64,${dataUrl}`
                    }
                  }
                  reader.readAsDataURL(file)
                }, (err) => {
                  console.warn('读取文件失败:', err)
                })
              }, (err) => {
                console.warn('路径解析失败:', err)
              })
              // #endif
  
              // #ifdef H5
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
          // 发送前缓存图片数据，并立刻清空预览，避免发送中仍显示
          const imageDataForSend = this.pendingImageBase64
          this.pendingImageLocalPath = ''
          
          // 如果有图片，先显示"正在分析图片中..."
          let botIndex = null
          if (imageDataForSend) {
            botIndex = this.showThinking('正在分析图片中...')
          }
          
          this.pendingImageBase64 = ''
          // 统一一次性请求（非流式），使用打字机效果展示
          await this.requestOnceText(content, botIndex, imageDataForSend)
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
          return '存款业务：活期按日计息，定期支持3个月/6个月/1年/3年等档，起存金额1000元起。可通过"财富-存款"进行办理。'
        }
        if (t.includes('理财') || t.includes('收益') || t.includes('申购')) {
          return '理财产品分为低/中风险，起投金额1000-10000元不等，支持T+1灵活赎回与封闭期产品，详情见"财富-理财产品"。'
        }
        if (t.includes('保险') || t.includes('意外') || t.includes('重疾')) {
          return '保险服务：提供医疗险、意外险、重疾险等多品类方案，支持在线投保与电子保单。可在"财富-保险"查看。'
        }
        if (t.includes('外汇') || t.includes('汇率') || t.includes('结售汇')) {
          return '外汇业务：支持主要币种实时汇率查询与结售汇，您可在"财富-外汇"查看行情并发起交易。'
        }
        if (t.includes('人工') || t.includes('转接') || t.includes('客服')) {
          return '需要人工服务吗？您可以拨打客服热线 95599，我们将尽快为您安排专属服务。'
        }
        return '已收到您的问题。我将为您查找相关信息，您也可以具体描述业务类型（如：存款/理财/保险/外汇）。'
      },
      toBottom() {
        this.$nextTick(() => {
          // 使用稳定的锚点 id，便于 scroll-into-view 正常定位
          this.scrollIntoId = 'chat-bottom-anchor'
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
      },
      // base64转ArrayBuffer
      base64ToArrayBuffer(base64) {
        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes.buffer
      },
      // 初始化音频上下文
      initAudioContext() {
        try {
          if (this.audioCtx) {
            this.audioCtx.destroy()
          }
          this.audioCtx = uni.createInnerAudioContext()
          console.log('音频上下文初始化成功')
          
          // 监听播放结束
          this.audioCtx.onEnded(() => {
            console.log('音频播放结束')
            this.stopCurrentAudio()
          })
          
          // 监听播放错误
          this.audioCtx.onError((err) => {
            console.error('音频播放错误:', err)
            console.error('错误详情:', JSON.stringify(err))
            this.stopCurrentAudio()
            uni.showToast({ title: '播放失败', icon: 'none' })
          })
          
          // 监听播放开始
          this.audioCtx.onPlay(() => {
            console.log('音频开始播放')
          })
          
          // 监听加载完成
          this.audioCtx.onCanplay(() => {
            console.log('音频加载完成')
          })
          
          // 监听加载中（仅在支持时添加）
          if (this.audioCtx.onLoadstart) {
            this.audioCtx.onLoadstart(() => {
              console.log('音频开始加载')
            })
          }
          
          // 监听加载失败（仅在支持时添加）
          if (this.audioCtx.onLoaderror) {
            this.audioCtx.onLoaderror((err) => {
              console.error('音频加载失败:', err)
              console.error('加载错误详情:', JSON.stringify(err))
            })
          }
          
        } catch (e) {
          console.error('音频上下文初始化失败:', e)
        }
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
    overflow-x: hidden; /* 防止横向溢出导致抖动 */
  }
  .chat-header { 
    padding: 20rpx; 
    background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
    color: #fff;
    border-bottom: 2rpx solid var(--line);
  }
  .title { font-size: 32rpx; font-weight: 700; }
  .sub { display: block; font-size: 22rpx; opacity: 0.9; margin-top: 6rpx; }
  
  .chat-body { flex: 1; padding: 16rpx 20rpx; padding-bottom: 320rpx; width: 100%; overflow-x: hidden; }
  .msg-row { display: flex; align-items: flex-end; margin: 16rpx 0; gap: 12rpx; }
  .msg-row.user { justify-content: flex-end; padding-right: 40rpx; }
  .avatar { width: 64rpx; height: 64rpx; border-radius: 50%; flex-shrink: 0; }
  .bubble { max-width: 72%; padding: 16rpx 20rpx; border-radius: 16rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.04); word-break: break-word; overflow-wrap: anywhere; }
  .msg-row.bot .bubble { background: #ffffff; color: var(--text); border: 2rpx solid var(--line); }
  .msg-row.user .bubble { background: var(--primary); color: #fff; }
  
  /* 消息中的图片样式 */
  .message-img {
    max-width: 200rpx;
    max-height: 200rpx;
    border-radius: 8rpx;
    margin-top: 8rpx;
    object-fit: cover;
  }
  /* 富文本或消息内图片在气泡内不超过容器宽度 */
  .bubble image,
  .bubble img,
  .bubble rich-text image {
    max-width: 100%;
    height: auto;
  }
  
  /* 预设问答卡片样式 */
  .faq-card { background: #e9f7f2; border: 2rpx solid var(--line); border-radius: 16rpx; padding: 20rpx; margin: 8rpx 0 16rpx; }
  .faq-card-header { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
  .faq-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; }
  .faq-title { font-size: 28rpx; color: var(--text); font-weight: 600; }
  .faq-list { display: flex; flex-direction: column; }
  .faq-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 2rpx solid var(--line); border-radius: 12rpx; padding: 18rpx 20rpx; margin-top: 12rpx; }
  .faq-text { font-size: 28rpx; color: var(--text); }
  .faq-arrow { color: var(--muted); font-size: 32rpx; }
  
  .time { display: block; font-size: 20rpx; opacity: 0.85; margin-top: 6rpx; text-align: right; }
  .audio-row { margin-top: 10rpx; }
  
  /* 表情面板 */
  .emoji-panel { position: fixed; left: 0; right: 0; bottom: 120rpx; background: #fff; border-top: 2rpx solid var(--line); padding: 12rpx; display: flex; flex-wrap: wrap; gap: 12rpx; z-index: 999; min-height: 220rpx; max-height: 40vh; overflow-y: auto; }
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
  /* 图片预览区域 - 修复位置问题 */
  .pending-preview { 
    position: fixed; 
    left: 0; 
    right: 0; 
    bottom: 120rpx; /* 确保在输入框上方 */
    z-index: 999; 
    display: flex; 
    align-items: center; 
    gap: 12rpx; 
    padding: 16rpx; 
    background: #fff; 
    border-top: 2rpx solid var(--line); 
    box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.1);
  }
  .pending-img { 
    width: 120rpx; 
    height: 120rpx; 
    border-radius: 8rpx; 
    border: 2rpx solid #f0f0f0; 
    object-fit: cover; /* 确保图片完整显示 */
  }
  
  /* 移除按钮美化样式 */
  .mini-btn {
    padding: 8rpx 16rpx;
    font-size: 22rpx;
    border-radius: 20rpx;
    border: 2rpx solid #ff6b6b;
    background: #fff;
    color: #ff6b6b;
    transition: all 0.3s ease;
    min-width: 80rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mini-btn.ghost {
    background: transparent;
    color: #ff6b6b;
  }
  
  .mini-btn:active {
    background: #ff6b6b;
    color: #fff;
    transform: scale(0.95);
  }
  
  .mini-btn:hover {
    background: #ff6b6b;
    color: #fff;
    box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
  }
  
  /* 播放按钮样式 */
  .play-btn-container {
    display: flex;
    align-items: center;
    margin-left: 12rpx;
  }
  
  .play-btn {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    border: 2rpx solid var(--primary);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .play-btn:active {
    transform: scale(0.95);
  }
  
  .play-btn.playing {
    background: var(--primary);
    border-color: var(--primary);
  }
  
  .play-btn:disabled {
    opacity: 0.5;
    border-color: var(--muted);
  }
  
  /* 喇叭图标样式 */
  .speaker-icon {
    position: relative;
    width: 32rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .speaker-body {
    width: 16rpx;
    height: 20rpx;
    background: var(--primary);
    border-radius: 8rpx 0 0 8rpx;
    position: relative;
  }
  
  .speaker-body::before {
    content: '';
    position: absolute;
    left: -4rpx;
    top: 6rpx;
    width: 6rpx;
    height: 8rpx;
    background: var(--primary);
    border-radius: 3rpx;
  }
  
  .speaker-waves {
    position: absolute;
    right: -8rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 2rpx;
  }
  
  .wave {
    width: 3rpx;
    height: 8rpx;
    background: var(--primary);
    border-radius: 2rpx;
    opacity: 0.3;
    transition: all 0.3s ease;
  }
  
  .wave.active {
    opacity: 1;
    animation: wavePulse 1.2s ease-in-out infinite;
  }
  
  .wave:nth-child(1) {
    animation-delay: 0s;
  }
  
  .wave:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .wave:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes wavePulse {
    0%, 40%, 100% {
      height: 8rpx;
      opacity: 0.3;
    }
    20% {
      height: 16rpx;
      opacity: 1;
    }
  }
  
  /* 播放状态下的喇叭样式 */
  .speaker-icon.playing .speaker-body,
  .speaker-icon.playing .speaker-body::before {
    background: #fff;
  }
  
  .speaker-icon.playing .wave {
    background: #fff;
  }
  
  
  </style>
  
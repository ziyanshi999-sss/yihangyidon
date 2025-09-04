/**
 * 硅基流动AI API服务
 * 前端直接调用，无需Python后端
 */

// 硅基流动API配置
const SILICONFLOW_API_KEY = "sk-fkzxlpblcjigbzitanooofmnfmvvedobfdvvxqdbbdodntdt"
const API_BASE_URL = "https://api.siliconflow.cn/v1"

// 会话历史存储
const sessionHistory = {}

/**
 * 聊天对话（一次性请求）
 */
export const chat = async (message, sessionId = 'default', imageData = null) => {
  try {
    console.log('chat API调用，接收到的参数:')
    console.log('- message:', message)
    console.log('- sessionId:', sessionId)
    console.log('- imageData长度:', imageData ? imageData.length : 0)
    console.log('- imageData前50字符:', imageData ? imageData.substring(0, 50) : '无')
    
    // 初始化会话历史
    if (!sessionHistory[sessionId]) {
      sessionHistory[sessionId] = []
    }

    // 构建消息内容
    const messageContent = []
    if (imageData) {
      console.log('添加图片到消息内容')
      messageContent.push({
        type: "image_url",
        image_url: { url: imageData }
      })
    }
    messageContent.push({ type: "text", text: message })

    // 添加用户消息到历史
    sessionHistory[sessionId].push({
      role: 'user',
      content: messageContent
    })

    // 选择模型
    const selectedModel = imageData ? "Qwen/Qwen2.5-VL-32B-Instruct" : "Qwen/Qwen2.5-14B-Instruct"
    console.log('选择的模型:', selectedModel)
    console.log('发送给AI的消息内容:', JSON.stringify(messageContent, null, 2))

    const response = await uni.request({
      url: `${API_BASE_URL}/chat/completions`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: selectedModel,
        messages: sessionHistory[sessionId],
        stream: false
      },
      timeout: 60000
    })

    if (response.statusCode === 200 && response.data) {
      const assistantReply = response.data.choices[0].message
      sessionHistory[sessionId].push(assistantReply)
      
      return {
        success: true,
        reply: assistantReply.content,
        timestamp: new Date().toLocaleTimeString()
      }
    } else {
      throw new Error(`API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('聊天请求失败:', error)
    return {
      success: false,
      error: error.message || '请求失败'
    }
  }
}

// 已移除流式聊天实现，统一使用一次性请求 chat()

/**
 * 语音转文字
 */
export const speechToText = async (audioFile) => {
  try {
    const response = await uni.uploadFile({
      url: `${API_BASE_URL}/audio/transcriptions`,
      name: 'file',
      filePath: audioFile,
      header: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`
      },
      formData: {
        model: 'FunAudioLLM/SenseVoiceSmall',
        language: 'zh'
      }
    })

    if (response.statusCode === 200) {
      const data = JSON.parse(response.data)
      return {
        success: true,
        text: data.text || data.result || ''
      }
    } else {
      throw new Error(`语音识别失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('语音转文字失败:', error)
    return {
      success: false,
      error: error.message || '语音识别失败'
    }
  }
}

/**
 * 文字转语音
 */
export const textToSpeech = async (text) => {
  try {
    console.log('开始TTS请求，文本:', text)
    
    // 根据硅基流动官方文档，使用正确的模型和参数
    const requestData = {
      model: 'fnlp/MOSS-TTSD-v0.5',
      input: `[S1]${text}`, // 使用[S1]标记说话人1
      voice: 'fnlp/MOSS-TTSD-v0.5:anna', // 切换为 anna（温柔女声）
      response_format: 'mp3',
      sample_rate: 44100,
      stream: false, // 改为false，获取完整音频文件
      speed: 1.0, // 语速
      gain: 0
    }
    
    console.log('TTS请求数据:', requestData)
    
    const response = await uni.request({
      url: `${API_BASE_URL}/audio/speech`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: requestData,
      timeout: 60000,
      responseType: 'arraybuffer' // 确保返回二进制数据
    })

    console.log('TTS响应状态:', response.statusCode)
    console.log('TTS响应头:', response.header)

    if (response.statusCode === 200) {
      // 将音频数据转换为base64
      const arrayBuffer = response.data
      const uint8Array = new Uint8Array(arrayBuffer)
      
      console.log('音频数据长度:', uint8Array.length)
      
      // 使用小程序兼容的base64编码方法
      let base64 = ''
      try {
        // 尝试使用btoa
        let binaryString = ''
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i])
        }
        base64 = btoa(binaryString)
      } catch (e) {
        console.log('btoa不可用，使用手动base64编码')
        // 手动base64编码
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        for (let i = 0; i < uint8Array.length; i += 3) {
          const byte1 = uint8Array[i] || 0
          const byte2 = uint8Array[i + 1] || 0
          const byte3 = uint8Array[i + 2] || 0
          
          const enc1 = byte1 >> 2
          const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4)
          const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6)
          const enc4 = byte3 & 63
          
          base64 += chars[enc1] + chars[enc2] + chars[enc3] + chars[enc4]
        }
      }
      
      console.log('base64长度:', base64.length)
      
      // 返回base64格式的音频数据
      return {
        success: true,
        audioData: `data:audio/mp3;base64,${base64}`,
        audioPath: `data:audio/mp3;base64,${base64}` // 兼容原有代码
      }
    } else {
      console.error('TTS API响应:', response)
      console.error('TTS响应数据:', response.data)
      
      // 尝试解析错误响应
      let errorMessage = `语音合成失败: ${response.statusCode}`
      try {
        if (response.data) {
          const errorData = JSON.parse(response.data)
          errorMessage = errorData.message || errorData.error || errorMessage
        }
      } catch (e) {
        console.log('无法解析错误响应')
      }
      
      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error('文字转语音失败:', error)
    return {
      success: false,
      error: error.message || '语音合成失败'
    }
  }
}

/**
 * 清空会话历史
 */
export const clearHistory = (sessionId = 'default') => {
  if (sessionHistory[sessionId]) {
    sessionHistory[sessionId] = []
  }
  return { success: true }
}

/**
 * 获取会话历史
 */
export const getHistory = (sessionId = 'default') => {
  return sessionHistory[sessionId] || []
}

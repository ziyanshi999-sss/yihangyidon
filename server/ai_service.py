#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI客服系统
"""

from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import requests
import json
import base64
import os
import time
from datetime import datetime
import threading
from flask import Response

# 配置硅基流动API密钥（请替换为你的实际密钥）
SILICONFLOW_API_KEY = "sk-fkzxlpblcjigbzitanooofmnfmvvedobfdvvxqdbbdodntdt"
API_BASE_URL = "https://api.siliconflow.cn/v1"

app = Flask(__name__)
CORS(app)

# 全局变量
session_history = {}
audio_dir = "audio"
if not os.path.exists(audio_dir):
    os.makedirs(audio_dir)

@app.route('/')
def index():
    """主页（直达移动端）"""
    return render_template('mobile.html')

@app.route('/mobile')
def mobile():
    """移动端页面"""
    return render_template('mobile.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    try:
        data = request.json
        user_input = data.get('message', '')
        session_id = data.get('session_id', 'default')
        image_data = data.get('image', None)
        
        if not user_input:
            return jsonify({'error': '请输入消息内容'}), 400
        
        # 处理AI回复
        reply = process_multimodal_input(user_input, image_data, session_id)
        
        return jsonify({
            'success': True,
            'reply': reply,
            'timestamp': datetime.now().strftime('%H:%M:%S')
        })
        
    except Exception as e:
        return jsonify({'error': f'处理失败: {str(e)}'}), 500

@app.route('/api/chat-stream', methods=['POST'])
def chat_stream():
    """流式聊天（仅文本，无图片时启用）"""
    try:
        data = request.json
        user_input = data.get('message', '')
        session_id = data.get('session_id', 'default')

        if not user_input:
            return jsonify({'error': '请输入消息内容'}), 400

        # 初始化会话
        if session_id not in session_history:
            session_history[session_id] = []

        # 添加用户消息
        session_history[session_id].append({
            'role': 'user',
            'content': [{'type': 'text', 'text': user_input}]
        })

        # 选择模型（文本流用对话模型）
        selected_model = "Qwen/Qwen2.5-14B-Instruct"

        url = f"{API_BASE_URL}/chat/completions"
        headers = {
            'Authorization': f'Bearer {SILICONFLOW_API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model': selected_model,
            'messages': session_history[session_id],
            'stream': True
        }

        def generate():
            try:
                with requests.post(
                    url,
                    headers={**headers, 'Accept': 'text/event-stream'},
                    json=payload,
                    stream=True,
                    timeout=300
                ) as r:
                    if not r.ok:
                        yield f"data: {json.dumps({'error': r.text}, ensure_ascii=False)}\n\n"
                        return
                    # 逐字节读取，尽快推送到前端
                    buf = b''
                    for chunk in r.iter_content(chunk_size=1):
                        if not chunk:
                            continue
                        buf += chunk
                        if b"\n\n" not in buf:
                            continue
                        parts = buf.split(b"\n\n")
                        buf = parts[-1]
                        for part in parts[:-1]:
                            try:
                                line = part.decode('utf-8', errors='replace').strip()
                            except Exception:
                                line = str(part)
                            if not line.startswith('data: '):
                                continue
                            data_part = line[6:].strip()
                            if data_part == '[DONE]':
                                yield 'data: [DONE]\n\n'
                                return
                            try:
                                obj = json.loads(data_part)
                                delta = obj.get('choices', [{}])[0].get('delta', {}).get('content', '')
                                if delta:
                                    yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"
                            except Exception:
                                yield f"data: {json.dumps({'delta': data_part}, ensure_ascii=False)}\n\n"
            except Exception as e:
                err = str(e)
                yield f"data: {json.dumps({'error': err}, ensure_ascii=False)}\n\n"

        resp = Response(generate(), mimetype='text/event-stream; charset=utf-8')
        resp.headers['Cache-Control'] = 'no-cache'
        resp.headers['X-Accel-Buffering'] = 'no'  # for nginx
        return resp

    except Exception as e:
        return jsonify({'error': f'流式处理失败: {str(e)}'}), 500

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    """语音转文字"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': '没有上传音频文件'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
        
        # 保存音频文件
        timestamp = int(time.time())
        # 保留来文件的扩展名和MIME类型，默认webm
        original_name = audio_file.filename or f"voice_{timestamp}.webm"
        ext = os.path.splitext(original_name)[1].lower() or '.webm'
        mime = audio_file.mimetype or 'audio/webm'
        filename = f"user_voice_{timestamp}{ext}"
        filepath = os.path.join(audio_dir, filename)
        audio_file.save(filepath)
        
        # 调用API进行语音识别
        text = speech_to_text_api(filepath, filename=filename, mimetype=mime)
        
        if text:
            return jsonify({
                'success': True,
                'text': text,
                'filename': filename
            })
        else:
            return jsonify({'error': '语音识别失败'}), 500
            
    except Exception as e:
        return jsonify({'error': f'语音识别失败: {str(e)}'}), 500

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    """文字转语音"""
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': '请输入要转换的文字'}), 400
        
        # 调用API进行语音合成
        audio_file = text_to_speech_api(text)
        
        if audio_file:
            return jsonify({
                'success': True,
                'audio_file': audio_file
            })
        else:
            return jsonify({'error': '语音合成失败'}), 500
            
    except Exception as e:
        return jsonify({'error': f'语音合成失败: {str(e)}'}), 500

@app.route('/api/audio/<filename>')
def get_audio(filename):
    """获取音频文件"""
    try:
        filepath = os.path.join(audio_dir, filename)
        if os.path.exists(filepath):
            ext = os.path.splitext(filename)[1].lower()
            mime = 'application/octet-stream'
            if ext in ['.mp3']:
                mime = 'audio/mpeg'
            elif ext in ['.wav']:
                mime = 'audio/wav'
            elif ext in ['.ogg']:
                mime = 'audio/ogg'
            elif ext in ['.m4a']:
                mime = 'audio/mp4'
            return send_file(filepath, mimetype=mime)
        else:
            return jsonify({'error': '文件不存在'}), 404
    except Exception as e:
        return jsonify({'error': f'获取音频失败: {str(e)}'}), 500

def process_multimodal_input(user_input, image_data=None, session_id='default'):
    """处理多模态输入"""
    url = f"{API_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # 获取或创建会话历史
    if session_id not in session_history:
        session_history[session_id] = []
    
    # 构建消息内容
    message_content = []
    if image_data:
        # 处理Base64图片数据：保留前端传入的原始 data URL（包含正确的 MIME 类型）
        if image_data.startswith('data:image'):
            image_url = image_data
        else:
            # 如果前端只传了纯base64字符串，则默认按PNG拼接
            image_url = f"data:image/png;base64,{image_data}"

        message_content.append({
            "type": "image_url",
            "image_url": {"url": image_url}
        })
    
    message_content.append({"type": "text", "text": user_input})
    
    # 更新对话历史
    session_history[session_id].append({
        "role": "user",
        "content": message_content
    })
    
    # 确保对话历史不超过限制
    if len(session_history[session_id]) > 20:
        session_history[session_id] = session_history[session_id][-20:]
    
    # 选择模型：有图片用多模态模型，无图片用纯文本模型
    selected_model = "Qwen/Qwen2.5-14B-Instruct"
    if image_data:
        selected_model = "Qwen/Qwen2.5-VL-32B-Instruct"

    data = {
        "model": selected_model,
        "messages": session_history[session_id],
        "stream": False
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        # 若出现非200，打印服务端返回以便定位
        if not response.ok:
            try:
                print("多模态响应错误:", response.status_code, response.text)
            except Exception:
                pass
        response.raise_for_status()
        result = response.json()
        
        # 获取助手回复并更新历史
        assistant_reply = result["choices"][0]["message"]
        session_history[session_id].append(assistant_reply)
        
        return assistant_reply["content"]
    except Exception as e:
        print(f"多模态处理失败: {str(e)}")
        return "抱歉，处理您的请求时出现错误，请重试"

def speech_to_text_api(audio_file, filename=None, mimetype=None):
    """调用API进行语音转文字"""
    url = f"{API_BASE_URL}/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}"
    }
    
    file_tuple = (filename or os.path.basename(audio_file), open(audio_file, "rb"), mimetype or "application/octet-stream")
    files = {
        "file": file_tuple,
        "model": (None, "FunAudioLLM/SenseVoiceSmall"),  # 硅基流动提供的免费ASR模型
        "language": (None, "zh")
    }
    
    try:
        response = requests.post(url, headers=headers, files=files, timeout=60)
        if not response.ok:
            try:
                print("语音识别响应错误:", response.status_code, response.text)
            except Exception:
                pass
        response.raise_for_status()
        return response.json().get("text") or response.json().get("result")
    except Exception as e:
        print(f"语音识别失败: {str(e)}")
        return None

def text_to_speech_api(text, voice="default"):
    """调用API进行文字转语音"""
    url = f"{API_BASE_URL}/audio/speech"
    headers = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # 尝试多种voice配置，兼容不同模型
    candidate_voices = [voice, "female", "male", "zh", None]
    for v in candidate_voices:
        payload = {
            "model": "fnlp/MOSS-TTSD-v0.5",
            "input": text,
            "speed": 1.0
        }
        if v:
            payload["voice"] = v
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            if not response.ok:
                try:
                    print("语音合成响应错误:", response.status_code, response.text)
                except Exception:
                    pass
                # 如果是voice不合法，尝试下一个候选
                if response.status_code == 400 and 'Invalid voice' in response.text:
                    continue
            response.raise_for_status()

            # 保存为mp3
            filename = f"reply_voice_{int(time.time())}.mp3"
            filepath = os.path.join(audio_dir, filename)
            with open(filepath, "wb") as f:
                f.write(response.content)
            return filename
        except Exception as e:
            print(f"语音合成失败: {str(e)}")
            continue
    return None

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    """清空对话历史"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in session_history:
            session_history[session_id].clear()
        
        return jsonify({'success': True, 'message': '历史已清空'})
    except Exception as e:
        return jsonify({'error': f'清空历史失败: {str(e)}'}), 500

@app.route('/api/status')
def get_status():
    """获取系统状态"""
    try:
        # 检查API密钥
        api_key_status = "已配置" if SILICONFLOW_API_KEY != "your_api_key_here" else "未配置"
        
        # 检查音频目录
        audio_files = len([f for f in os.listdir(audio_dir) if f.endswith(('.wav', '.mp3'))])
        
        return jsonify({
            'success': True,
            'api_key_status': api_key_status,
            'audio_files_count': audio_files,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        return jsonify({'error': f'获取状态失败: {str(e)}'}), 500

if __name__ == '__main__':
    # 检查API密钥
    if SILICONFLOW_API_KEY == "your_api_key_here":
        print("⚠️  警告：请先配置API密钥！")
        print("修改 web_app.py 文件中的 SILICONFLOW_API_KEY 变量")
        print("或设置环境变量：export SILICONFLOW_API_KEY='your_key'")
    
    print("🚀 启动AI客服Web系统...")
    print("📱 请在浏览器中访问: http://localhost:5000")
    print("🔧 按 Ctrl+C 停止服务")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

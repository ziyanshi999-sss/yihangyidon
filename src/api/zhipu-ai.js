/**
 * 智谱AI API服务
 * 集成GLM-4.5模型进行智能财富管理分析
 */

const ZHIPU_API_KEY = 'e35b142ca46a41c6b9dba61aaeeb7bab.FBAPapUnBuplkDry'
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

class ZhipuAIService {
  constructor() {
    this.apiKey = ZHIPU_API_KEY
    this.baseURL = ZHIPU_API_URL
  }

  /**
   * 发送请求到智谱AI
   */
  async sendRequest(messages, options = {}) {
    try {
      const response = await uni.request({
        url: this.baseURL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        data: {
          model: 'glm-4',
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: false,
          ...options
        }
      })

      if (response.statusCode === 200 && response.data.choices && response.data.choices.length > 0) {
        return {
          success: true,
          content: response.data.choices[0].message.content,
          usage: response.data.usage
        }
      } else {
        throw new Error(`API请求失败: ${response.statusCode}`)
      }
    } catch (error) {
      console.error('智谱AI API请求错误:', error)
      return {
        success: false,
        error: error.message || '网络请求失败'
      }
    }
  }

  /**
   * 分析用户财务状况
   */
  async analyzeFinancialStatus(userData) {
    const prompt = `作为专业的财富管理AI顾问，请分析以下用户数据并提供专业的财务建议：

用户数据：
- 总资产：¥${userData.totalAssets}
- 风险偏好：${userData.riskProfile}
- 年龄：${userData.age || '未知'}
- 收入：¥${userData.monthlyIncome || '未知'}/月
- 支出：¥${userData.monthlyExpense || '未知'}/月
- 投资组合：${JSON.stringify(userData.portfolio)}

请从以下角度进行分析：
1. 资产配置合理性评估
2. 风险收益分析
3. 具体优化建议
4. 未来规划建议

请用专业但易懂的语言回答，并提供具体的数据支撑。`

    const messages = [
      {
        role: 'system',
        content: '你是一位专业的财富管理顾问，具有丰富的金融知识和投资经验。请为用户提供专业、实用的财务建议。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, { temperature: 0.3 })
  }

  /**
   * 生成投资建议
   */
  async generateInvestmentAdvice(marketData, userProfile) {
    const prompt = `基于当前市场情况和用户画像，请生成个性化的投资建议：

市场数据：
${JSON.stringify(marketData, null, 2)}

用户画像：
- 风险承受能力：${userProfile.riskTolerance}
- 投资目标：${userProfile.investmentGoals}
- 投资期限：${userProfile.investmentHorizon}
- 当前资产：¥${userProfile.currentAssets}

请提供：
1. 市场趋势分析
2. 推荐投资策略
3. 具体产品建议
4. 风险提示
5. 预期收益评估`

    const messages = [
      {
        role: 'system',
        content: '你是一位资深的投资顾问，擅长市场分析和投资策略制定。请基于数据和用户需求提供专业建议。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, { temperature: 0.4 })
  }

  /**
   * 智能对话
   */
  async chatWithAI(userMessage, context = {}) {
    const systemPrompt = `你是智能财富管家AI助手，专门帮助用户进行财富管理和投资决策。

你的能力包括：
1. 财务分析和建议
2. 投资组合优化
3. 风险管理和评估
4. 市场趋势分析
5. 理财规划指导

请用专业、友好、易懂的语言与用户交流，并提供实用的建议。如果用户询问超出财务范围的问题，请礼貌地引导回财富管理话题。

当前用户上下文：
${JSON.stringify(context, null, 2)}`

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ]

    return await this.sendRequest(messages, { temperature: 0.6 })
  }

  /**
   * 生成财务报告
   */
  async generateFinancialReport(userData, timeRange = 'monthly') {
    const prompt = `请为用户生成一份详细的财务报告：

用户数据：
${JSON.stringify(userData, null, 2)}

报告周期：${timeRange}

请包含以下内容：
1. 财务状况总览
2. 收入支出分析
3. 投资表现评估
4. 风险分析
5. 改进建议
6. 未来规划

请用专业的财务报告格式，包含数据分析和具体建议。`

    const messages = [
      {
        role: 'system',
        content: '你是一位专业的财务分析师，擅长制作详细的财务报告。请提供专业、全面的分析。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, { temperature: 0.2 })
  }

  /**
   * 风险评估
   */
  async assessRisk(userData, marketConditions) {
    const prompt = `请对用户进行全面的风险评估：

用户数据：
${JSON.stringify(userData, null, 2)}

市场环境：
${JSON.stringify(marketConditions, null, 2)}

请评估：
1. 个人风险承受能力
2. 投资组合风险水平
3. 市场风险影响
4. 流动性风险
5. 信用风险
6. 风险缓解建议

请提供量化的风险评分（1-10分）和具体建议。`

    const messages = [
      {
        role: 'system',
        content: '你是一位专业的风险管理专家，擅长识别和评估各种金融风险。请提供准确的风险评估。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, { temperature: 0.3 })
  }
}

// 创建单例实例
const zhipuAI = new ZhipuAIService()

export default zhipuAI

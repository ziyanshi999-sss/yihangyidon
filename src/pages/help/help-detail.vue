<template>
  <view class="help-detail">
    <!-- 顶部导航 -->
    <view class="detail-header">
      <text class="detail-title">{{ helpDetail.title }}</text>
      <text class="detail-subtitle">{{ helpDetail.subtitle }}</text>
    </view>

    <!-- 帮助内容 -->
    <view class="detail-content">
      <view class="content-section" v-for="(section, index) in helpDetail.sections" :key="index">
        <view class="section-title">{{ section.title }}</view>
        <view class="section-content">
          <view v-if="section.type === 'text'" class="text-content">
            <text class="content-text">{{ section.content }}</text>
          </view>
          <view v-else-if="section.type === 'steps'" class="steps-content">
            <view class="step-item" v-for="(step, stepIndex) in section.steps" :key="stepIndex">
              <view class="step-number">{{ stepIndex + 1 }}</view>
              <view class="step-content">
                <text class="step-title">{{ step.title }}</text>
                <text class="step-desc" v-if="step.desc">{{ step.desc }}</text>
              </view>
            </view>
          </view>
          <view v-else-if="section.type === 'tips'" class="tips-content">
            <view class="tip-item" v-for="(tip, tipIndex) in section.tips" :key="tipIndex">
              <text class="tip-icon">💡</text>
              <text class="tip-text">{{ tip }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 相关帮助 -->
    <view class="related-help" v-if="helpDetail.related && helpDetail.related.length > 0">
      <view class="related-title">相关帮助</view>
      <view class="related-list">
        <view class="related-item" v-for="(item, index) in helpDetail.related" :key="index" @click="openRelatedHelp(item.id)">
          <text class="related-text">{{ item.title }}</text>
          <text class="related-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="detail-footer">
      <button class="helpful-btn" @click="markHelpful">
        <text class="btn-icon">👍</text>
        <text class="btn-text">有帮助</text>
      </button>
      <button class="contact-btn" @click="goToAIService">
        <text class="btn-icon">💬</text>
        <text class="btn-text">联系客服</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      helpId: '',
      helpDetail: {}
    }
  },
  onLoad(options) {
    this.helpId = options.helpId || ''
    this.loadHelpDetail()
  },
  methods: {
    // 加载帮助详情
    loadHelpDetail() {
      // 根据helpId加载对应的帮助内容
      const helpData = this.getHelpData(this.helpId)
      this.helpDetail = helpData
    },
    
    // 获取帮助数据
    getHelpData(helpId) {
      const helpDatabase = {
        'account-loss': {
          title: '银行卡挂失',
          subtitle: '快速挂失银行卡，保护资金安全',
          sections: [
            {
              title: '挂失方式',
              type: 'text',
              content: '您可以通过以下方式挂失银行卡：\n1. 掌上银行APP\n2. 网上银行\n3. 客服热线95599\n4. 银行网点'
            },
            {
              title: '掌上银行挂失步骤',
              type: 'steps',
              steps: [
                { title: '登录掌上银行', desc: '使用指纹或密码登录' },
                { title: '进入账户管理', desc: '点击"我的账户"→"账户管理"' },
                { title: '选择挂失', desc: '找到需要挂失的卡片，点击"挂失"' },
                { title: '确认挂失', desc: '阅读挂失说明，确认挂失操作' },
                { title: '挂失完成', desc: '系统将发送挂失成功短信' }
              ]
            },
            {
              title: '注意事项',
              type: 'tips',
              tips: [
                '挂失后卡片将立即冻结，无法进行任何交易',
                '挂失手续费为10元/张，从账户余额中扣除',
                '如需补办新卡，请携带身份证到银行网点办理',
                '挂失期间如有资金损失，银行将承担相应责任'
              ]
            }
          ],
          related: [
            { id: 'password-change', title: '密码修改' },
            { id: 'account-query', title: '账户查询' }
          ]
        },
        'phone-transfer': {
          title: '手机号转账',
          subtitle: '通过手机号码快速转账操作流程',
          sections: [
            {
              title: '功能介绍',
              type: 'text',
              content: '手机号转账是农业银行推出的便民服务，您只需输入收款人手机号码即可完成转账，无需记住复杂的银行卡号。'
            },
            {
              title: '操作步骤',
              type: 'steps',
              steps: [
                { title: '进入转账页面', desc: '在首页点击"转账"功能' },
                { title: '选择手机号转账', desc: '选择"手机号转账"选项' },
                { title: '输入收款信息', desc: '输入收款人手机号和姓名' },
                { title: '输入转账金额', desc: '输入转账金额和转账说明' },
                { title: '确认转账', desc: '输入支付密码完成转账' }
              ]
            },
            {
              title: '使用提示',
              type: 'tips',
              tips: [
                '收款人手机号必须已开通手机号转账功能',
                '单笔转账限额为5万元，日累计限额为20万元',
                '转账手续费按标准收取，具体费率请咨询客服',
                '转账成功后，收款人将收到短信通知'
              ]
            }
          ],
          related: [
            { id: 'quick-transfer', title: '快捷转账' },
            { id: 'cross-bank', title: '跨行转账' }
          ]
        },
        'electronic-receipt': {
          title: '电子回单',
          subtitle: '电子回单查询和验证方法',
          sections: [
            {
              title: '什么是电子回单',
              type: 'text',
              content: '电子回单是银行提供的电子化交易凭证，具有与纸质回单同等的法律效力，可用于财务记账、税务申报等用途。'
            },
            {
              title: '查询步骤',
              type: 'steps',
              steps: [
                { title: '登录掌上银行', desc: '使用指纹或密码登录' },
                { title: '进入交易明细', desc: '点击"我的账户"→"交易明细"' },
                { title: '选择交易记录', desc: '找到需要查询的交易记录' },
                { title: '生成电子回单', desc: '点击"电子回单"按钮' },
                { title: '下载或分享', desc: '可下载到手机或分享给他人' }
              ]
            },
            {
              title: '验证方法',
              type: 'tips',
              tips: [
                '电子回单包含数字签名，确保真实性',
                '可通过银行官网验证回单真伪',
                '回单有效期为2年，请及时保存',
                '电子回单与纸质回单具有同等效力'
              ]
            }
          ],
          related: [
            { id: 'account-query', title: '账户查询' },
            { id: 'mobile-bank', title: '掌上银行' }
          ]
        }
      }
      
      return helpDatabase[helpId] || {
        title: '帮助内容',
        subtitle: '暂无详细内容',
        sections: [
          {
            title: '提示',
            type: 'text',
            content: '该帮助内容正在完善中，如有疑问请联系客服。'
          }
        ]
      }
    },
    
    // 打开相关帮助
    openRelatedHelp(helpId) {
      uni.redirectTo({
        url: `/pages/help/help-detail?helpId=${helpId}`
      })
    },
    
    // 标记有帮助
    markHelpful() {
      uni.showToast({
        title: '感谢您的反馈',
        icon: 'success'
      })
    },
    
    // 跳转到AI客服
    goToAIService() {
      uni.navigateTo({
        url: '/pages/service/chat'
      })
    }
  }
}
</script>

<style scoped>
.help-detail {
  background: #f5f7fb;
  min-height: 100vh;
}

/* 顶部导航 */
.detail-header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  padding: 40rpx 30rpx;
  color: #fff;
}

.detail-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
}

.detail-subtitle {
  display: block;
  font-size: 26rpx;
  opacity: 0.9;
}

/* 帮助内容 */
.detail-content {
  padding: 30rpx;
}

.content-section {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.section-title {
  background: #f8f9fa;
  padding: 30rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  border-bottom: 1rpx solid #eee;
}

.section-content {
  padding: 30rpx;
}

/* 文本内容 */
.text-content {
  line-height: 1.6;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  white-space: pre-line;
}

/* 步骤内容 */
.steps-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  background: #2e7d32;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 10rpx;
}

.step-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.step-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

/* 提示内容 */
.tips-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
  padding: 20rpx;
  background: #fff8e1;
  border-radius: 12rpx;
  border-left: 6rpx solid #ffc107;
}

.tip-icon {
  font-size: 28rpx;
  margin-top: 2rpx;
}

.tip-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
}

/* 相关帮助 */
.related-help {
  padding: 0 30rpx 30rpx;
}

.related-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.related-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.related-item:last-child {
  border-bottom: none;
}

.related-item:active {
  background: #f8f9fa;
}

.related-text {
  font-size: 28rpx;
  color: #333;
}

.related-arrow {
  font-size: 32rpx;
  color: #ccc;
}

/* 底部操作 */
.detail-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
}

.helpful-btn, .contact-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 28rpx;
  border: none;
}

.helpful-btn {
  background: #f8f9fa;
  color: #333;
}

.contact-btn {
  background: #2e7d32;
  color: #fff;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 28rpx;
}
</style>

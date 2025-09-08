<template>
	<view class="credit-cards-page">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<view class="nav-title">我的信用卡</view>
			<view class="nav-right">
				<view class="nav-icon" @click="toggleCardNumberVisibility">
					<text class="eye-icon">{{ showFullCardNumbers ? '👁️' : '👁️‍🗨️' }}</text>
				</view>
				<view class="nav-icon" @click="showAddCardModal">
					<text class="add-icon">+</text>
				</view>
			</view>
		</view>

		<!-- 信用卡列表 -->
		<view class="cards-container" v-if="creditCards && creditCards.length > 0">
			<!-- 卡片统计信息 -->
			<view class="cards-summary">
				<view class="summary-item">
					<text class="summary-number">{{ creditCards.length }}</text>
					<text class="summary-label">信用卡数量</text>
				</view>
				<view class="summary-item">
					<text class="summary-number">{{ getTotalCreditLimit() }}</text>
					<text class="summary-label">总信用额度</text>
				</view>
				<view class="summary-item">
					<text class="summary-number">{{ getTotalAvailableCredit() }}</text>
					<text class="summary-label">总可用额度</text>
				</view>
			</view>

			<view 
				class="card-item" 
				v-for="(card, index) in creditCards" 
				:key="index"
				:style="{ background: card.cardColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
				@click="showCardDetail(card, index)"
			>
				<!-- 卡片头部 -->
				<view class="card-header">
					<view class="card-brand">
						<text class="brand-text">{{ card.cardBrand }}</text>
					</view>
					<view class="card-type">
						<text class="type-text">{{ card.cardType }}</text>
					</view>
				</view>

				<!-- 卡片号码 -->
				<view class="card-number">
					<text class="number-text">{{ showFullCardNumbers ? card.cardNumber : formatCardNumber(card.cardNumber) }}</text>
					<view class="card-number-toggle" @click.stop="toggleCardNumberVisibility">
						<text class="toggle-icon">{{ showFullCardNumbers ? '👁️' : '👁️‍🗨️' }}</text>
					</view>
				</view>

				<!-- 卡片底部信息 -->
				<view class="card-footer">
					<view class="card-holder">
						<text class="holder-label">持卡人</text>
						<text class="holder-name">{{ card.cardHolder }}</text>
					</view>
					<view class="card-expiry">
						<text class="expiry-label">有效期</text>
						<text class="expiry-date">{{ formatExpiryDate(card.expiryDate) }}</text>
					</view>
				</view>

				<!-- 卡片状态指示器 - 只显示非正常状态 -->
				<view class="card-status" :class="card.cardStatus" v-if="card.cardStatus !== 'active'">
					<text class="status-text">{{ getStatusText(card.cardStatus) }}</text>
				</view>
			</view>
		</view>

		<!-- 无信用卡提示 -->
		<view class="empty-state" v-else>
			<view class="empty-icon">💳</view>
			<text class="empty-title">暂无信用卡</text>
			<text class="empty-desc">您还没有申请信用卡</text>
			<button class="apply-btn" @click="applyCard">立即申请</button>
		</view>

		<!-- 信用卡详情弹窗 -->
		<view class="card-detail-modal" v-if="showDetail" @click="closeDetail">
			<view class="modal-content detail-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">信用卡详情</text>
					<view class="modal-actions">
						<view class="action-icon" @click="toggleDetailCardNumberVisibility">
							<text class="eye-icon">{{ showDetailCardNumbers ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
						<text class="close-btn" @click="closeDetail">×</text>
					</view>
				</view>
				
				<view class="detail-content">
					<!-- 卡片基本信息 -->
					<view class="detail-section">
						<view class="section-title">基本信息</view>
						<view class="info-row">
							<text class="info-label">卡号</text>
							<view class="card-number-display">
								<text class="info-value">{{ showDetailCardNumbers ? selectedCard.cardNumber : formatCardNumber(selectedCard.cardNumber) }}</text>
								<view class="toggle-visibility" @click="toggleDetailCardNumberVisibility">
									<text class="toggle-icon">{{ showDetailCardNumbers ? '👁️' : '👁️‍🗨️' }}</text>
								</view>
							</view>
						</view>
						<view class="info-row">
							<text class="info-label">卡片类型</text>
							<text class="info-value">{{ selectedCard.cardType }} {{ selectedCard.cardBrand }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">持卡人</text>
							<text class="info-value">{{ selectedCard.cardHolder }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">有效期</text>
							<text class="info-value">{{ formatExpiryDate(selectedCard.expiryDate) }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">卡片状态</text>
							<text class="info-value status">{{ getStatusText(selectedCard.cardStatus) }}</text>
						</view>
					</view>

					<!-- 额度信息 -->
					<view class="detail-section">
						<view class="section-title">额度信息</view>
						<view class="limit-info">
							<view class="limit-item">
								<text class="limit-label">信用额度</text>
								<text class="limit-value">¥{{ selectedCard.creditLimit.toLocaleString() }}</text>
							</view>
							<view class="limit-item">
								<text class="limit-label">可用额度</text>
								<text class="limit-value available">¥{{ selectedCard.availableCredit.toLocaleString() }}</text>
							</view>
							<view class="limit-item">
								<text class="limit-label">当前欠款</text>
								<text class="limit-value debt">¥{{ selectedCard.currentBalance.toLocaleString() }}</text>
							</view>
							<view class="limit-item">
								<text class="limit-label">最低还款</text>
								<text class="limit-value min">¥{{ selectedCard.minPayment.toLocaleString() }}</text>
							</view>
						</view>
					</view>

					<!-- 账单信息 -->
					<view class="detail-section">
						<view class="section-title">账单信息</view>
						<view class="info-row">
							<text class="info-label">账单日</text>
							<text class="info-value">每月{{ selectedCard.statementDate }}日</text>
						</view>
						<view class="info-row">
							<text class="info-label">到期还款日</text>
							<text class="info-value">{{ selectedCard.dueDate }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">年费</text>
							<text class="info-value">¥{{ selectedCard.annualFee.toLocaleString() }}</text>
						</view>
					</view>
				</view>
				
				<view class="modal-footer detail-footer">
					<button class="action-btn primary" @click="showRepayment">立即还款</button>
					<button class="action-btn secondary" @click="showTransactions">查看交易</button>
				</view>
			</view>
		</view>

		<!-- 还款弹窗 -->
		<view class="modal-overlay" v-if="showRepaymentModal" @click="closeRepaymentModal">
			<view class="modal-content repayment-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">立即还款</text>
					<text class="close-btn" @click="closeRepaymentModal">×</text>
				</view>
				
				<view class="modal-body">
					<!-- 卡片信息 -->
					<view class="card-info">
						<view class="card-number">{{ selectedCard?.cardNumber }}</view>
						<view class="card-type">{{ selectedCard?.cardType }} {{ selectedCard?.cardBrand }}</view>
					</view>

					<!-- 还款信息 -->
					<view class="repayment-info">
						<view class="info-row">
							<text class="info-label">当前欠款</text>
							<text class="info-value debt">¥{{ selectedCard?.currentBalance?.toLocaleString() || '0' }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">最低还款</text>
							<text class="info-value">¥{{ selectedCard?.minPayment?.toLocaleString() || '0' }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">可用额度</text>
							<text class="info-value available">¥{{ selectedCard?.availableCredit?.toLocaleString() || '0' }}</text>
						</view>
					</view>

					<!-- 还款方式 -->
					<view class="repayment-methods">
						<button class="method-btn full" @click="handleRepayment('full')">
							<view class="left-content">
								<text class="method-icon">💰</text>
								<text class="method-title">全额还款</text>
							</view>
							<text class="method-amount">¥{{ selectedCard?.currentBalance?.toLocaleString() || '0' }}</text>
						</button>
						
						<button class="method-btn min" @click="handleRepayment('min')">
							<view class="left-content">
								<text class="method-icon">💳</text>
								<text class="method-title">最低还款</text>
							</view>
							<text class="method-amount">¥{{ selectedCard?.minPayment?.toLocaleString() || '0' }}</text>
						</button>
						
						<view class="method-btn custom">
							<view class="left-content">
								<text class="method-icon">✏️</text>
								<text class="method-title">自定义还款</text>
							</view>
							<view class="custom-input-section">
								<input 
									class="custom-amount-input" 
									v-model="customAmount" 
									placeholder="输入金额"
									type="number"
									maxlength="10"
									@input="validateCustomAmount"
								/>
							</view>
						</view>
					</view>
					
					<!-- 确认还款按钮区域 -->
					<view class="modal-footer">
						<button class="confirm-repayment-btn" @click="confirmCustomRepayment" :disabled="!isCustomAmountValid">
							确认还款
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 交易记录弹窗 -->
		<view class="modal-overlay" v-if="showTransactionsModal" @click="closeTransactionsModal">
			<view class="modal-content transactions-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">交易记录</text>
					<text class="close-btn" @click="closeTransactionsModal">×</text>
				</view>
				
				<view class="modal-body">
					<!-- 卡片信息 -->
					<view class="card-info">
						<view class="card-number">{{ selectedCard?.cardNumber }}</view>
						<view class="card-type">{{ selectedCard?.cardType }} {{ selectedCard?.cardBrand }}</view>
					</view>

					<!-- 交易列表 -->
					<view class="transactions-list">
						<view 
							class="transaction-item" 
							v-for="trans in getTransactions()" 
							:key="trans.id"
						>
							<view class="transaction-left">
								<text class="transaction-icon">{{ getTransactionIcon(trans.type) }}</text>
								<view class="transaction-details">
									<text class="transaction-desc">{{ trans.description }}</text>
									<text class="transaction-merchant">{{ trans.merchant }}</text>
									<text class="transaction-location">{{ trans.location }}</text>
								</view>
							</view>
							<view class="transaction-right">
								<text class="transaction-amount" :class="{ 'income': trans.amount > 0, 'expense': trans.amount < 0 }">
									{{ trans.amount > 0 ? '+' : '' }}¥{{ Math.abs(trans.amount).toLocaleString() }}
								</text>
								<text class="transaction-date">{{ formatTransactionDate(trans.date) }}</text>
								<text class="transaction-type">{{ getTransactionTypeText(trans.type) }}</text>
							</view>
						</view>
					</view>

					<!-- 交易统计 -->
					<view class="transactions-summary">
						<text class="summary-text">共 {{ getTransactions().length }} 笔交易</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 还款记录弹窗 -->
		<view class="modal-overlay" v-if="showRepaymentRecordModal && repaymentRecord" @click="closeRepaymentRecordModal">
			<view class="modal-content repayment-record-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">还款记录</text>
					<text class="close-btn" @click="closeRepaymentRecordModal">×</text>
				</view>
				
				<view class="modal-body">
					<!-- 还款成功图标和动画 -->
					<view class="success-animation">
						<view class="success-circle">
							<text class="success-symbol">✓</text>
						</view>
						<view class="success-ripple"></view>
						<view class="success-ripple delay-1"></view>
						<view class="success-ripple delay-2"></view>
						
						<!-- 庆祝动画 -->
						<view class="celebration" v-if="showSuccessAnimation">
							<text class="celebration-item">🎉</text>
							<text class="celebration-item">✨</text>
							<text class="celebration-item">🎊</text>
							<text class="celebration-item">💫</text>
						</view>
					</view>
					
					<!-- 还款状态 -->
					<view class="repayment-status">
						<text class="status-text">还款成功</text>
						<text class="status-subtitle">您的还款已成功处理，资金已实时到账</text>
					</view>
					
					<!-- 还款金额突出显示 -->
					<view class="amount-highlight">
						<text class="amount-label">本次还款金额</text>
						<text class="amount-value">¥{{ repaymentRecord.repaymentAmount.toLocaleString() }}</text>
						<text class="amount-desc">{{ repaymentRecord.repaymentType }}</text>
					</view>
					
					<!-- 卡片信息 -->
					<view class="record-card-info">
						<view class="card-icon">💳</view>
						<view class="card-number">{{ repaymentRecord.cardNumber }}</view>
						<view class="card-type">{{ repaymentRecord.cardType }} {{ repaymentRecord.cardBrand }}</view>
					</view>
					
					<!-- 还款详情 -->
					<view class="repayment-details">
						<view class="details-header">
							<text class="header-title">还款详情</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">💰</text>
								<text class="detail-label">还款方式</text>
							</view>
							<text class="detail-value">{{ repaymentRecord.repaymentType }}</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">📊</text>
								<text class="detail-label">还款前欠款</text>
							</view>
							<text class="detail-value debt">¥{{ repaymentRecord.oldBalance.toLocaleString() }}</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">📉</text>
								<text class="detail-label">还款后欠款</text>
							</view>
							<text class="detail-value debt">¥{{ repaymentRecord.newBalance.toLocaleString() }}</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">⏰</text>
								<text class="detail-label">还款时间</text>
							</view>
							<text class="detail-value">{{ repaymentRecord.repaymentTime }}</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">🎯</text>
								<text class="detail-label">处理状态</text>
							</view>
							<text class="detail-value success">处理成功</text>
						</view>
						
						<view class="detail-row">
							<view class="detail-left">
								<text class="detail-icon">📱</text>
								<text class="detail-label">交易流水号</text>
							</view>
							<text class="detail-value">R{{ Date.now().toString().slice(-8) }}</text>
						</view>
					</view>
					
					<!-- 温馨提示 -->
					<view class="repayment-tips">
						<view class="tips-header">
							<text class="tips-icon">💡</text>
							<text class="tips-title">温馨提示</text>
						</view>
						<view class="tips-list">
							<text class="tips-content">• 还款已实时到账，请注意查收银行短信通知</text>
							<text class="tips-content">• 建议保留此记录，以备后续查询使用</text>
							<text class="tips-content">• 如有疑问，请联系客服热线：400-888-8888</text>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="modal-footer">
					<button class="action-btn primary" @click="closeRepaymentRecordModal">确定</button>
					<button class="action-btn secondary" @click="testRepaymentRecord" style="margin-left: 20rpx;">测试数据</button>
				</view>
			</view>
		</view>

		<!-- 添加银行卡弹窗 -->
		<view class="modal-overlay" v-if="showAddCard" @click="closeAddCard">
			<view class="modal-content add-card-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">添加银行卡</text>
					<text class="close-btn" @click="closeAddCard">×</text>
				</view>
				
				<view class="modal-body">
					<!-- 银行卡类型选择 -->
					<view class="form-section">
						<view class="form-title">银行卡类型</view>
						<view class="card-type-options">
							<view 
								class="type-option" 
								:class="{ active: newCard.cardType === type.value }"
								v-for="type in cardTypes" 
								:key="type.value"
								@click="selectCardType(type.value)"
							>
								<text class="type-icon">{{ type.icon }}</text>
								<text class="type-name">{{ type.name }}</text>
							</view>
						</view>
					</view>

					<!-- 银行品牌选择 -->
					<view class="form-section">
						<view class="form-title">银行品牌</view>
						<view class="bank-options">
							<view 
								class="bank-option" 
								:class="{ active: newCard.cardBrand === bank.value }"
								v-for="bank in bankBrands" 
								:key="bank.value"
								@click="selectBankBrand(bank.value)"
							>
								<text class="bank-icon">{{ bank.icon }}</text>
								<text class="bank-name">{{ bank.name }}</text>
							</view>
						</view>
					</view>

					<!-- 卡片信息输入 -->
					<view class="form-section">
						<view class="form-title">卡片信息</view>
						
						<view class="input-group">
							<text class="input-label">卡号</text>
							<view class="card-input-container">
								<input 
									class="form-input" 
									v-model="newCard.cardNumber" 
									placeholder="请输入银行卡号"
									type="text"
									maxlength="19"
									@input="formatCardNumberInput"
								/>
								<view class="input-toggle" @click="toggleNewCardNumberVisibility">
									<text class="toggle-icon">{{ showNewCardNumber ? '👁️' : '👁️‍🗨️' }}</text>
								</view>
							</view>
							<view class="input-tip">请输入16-19位银行卡号</view>
						</view>

						<view class="input-group">
							<text class="input-label">持卡人姓名</text>
							<input 
								class="form-input" 
								v-model="newCard.cardHolder" 
								placeholder="请输入持卡人姓名"
								type="text"
								maxlength="20"
							/>
						</view>

						<view class="input-row">
							<view class="input-group half">
								<text class="input-label">有效期</text>
								<input 
									class="form-input" 
									v-model="newCard.expiryDate" 
									placeholder="MM/YY"
									type="text"
									maxlength="5"
									@input="formatExpiryInput"
								/>
							</view>
							<view class="input-group half">
								<text class="input-label">CVV</text>
								<view class="card-input-container">
									<input 
										class="form-input" 
										v-model="newCard.cvv" 
										placeholder="3-4位安全码"
										:type="showNewCVV ? 'text' : 'password'"
										maxlength="4"
									/>
									<view class="input-toggle" @click="toggleNewCVVVisibility">
										<text class="toggle-icon">{{ showNewCVV ? '👁️' : '👁️‍🗨️' }}</text>
									</view>
								</view>
								<view class="cvv-tip">
									<text class="tip-icon">👁️</text>
									<text class="tip-text">卡片背面3-4位数字</text>
								</view>
							</view>
						</view>

						<view class="input-group">
							<text class="input-label">信用额度</text>
							<input 
								class="form-input" 
								v-model="newCard.creditLimit" 
								placeholder="请输入信用额度"
								type="number"
								maxlength="10"
							/>
							<view class="input-tip">单位：元</view>
						</view>

						<view class="input-group">
							<text class="input-label">年费</text>
							<input 
								class="form-input" 
								v-model="newCard.annualFee" 
								placeholder="请输入年费"
								type="number"
								maxlength="6"
							/>
							<view class="input-tip">单位：元</view>
						</view>
					</view>

					<!-- 账单信息 -->
					<view class="form-section">
						<view class="form-title">账单信息</view>
						
						<view class="input-row">
							<view class="input-group half">
								<text class="input-label">账单日</text>
								<input 
									class="form-input" 
									v-model="newCard.statementDate" 
									placeholder="1-31"
									type="number"
									min="1"
									max="31"
								/>
							</view>
							<view class="input-group half">
								<text class="input-label">到期还款日</text>
								<input 
									class="form-input" 
									v-model="newCard.dueDate" 
									placeholder="YYYY-MM-DD"
									type="text"
									maxlength="10"
								/>
							</view>
						</view>
					</view>

					<!-- 卡片颜色选择 -->
					<view class="form-section">
						<view class="form-title">卡片颜色</view>
						<view class="color-options">
							<view 
								class="color-option" 
								:class="{ active: newCard.cardColor === color.value }"
								:style="{ background: color.value }"
								v-for="color in cardColors" 
								:key="color.value"
								@click="selectCardColor(color.value)"
							></view>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="modal-footer">
					<button class="action-btn secondary" @click="closeAddCard">取消</button>
					<button class="action-btn primary" @click="confirmAddCard" :disabled="!isFormValid">确认添加</button>
				</view>
			</view>
		</view>

		<!-- 银行卡详情弹窗 -->
		<view class="modal-overlay" v-if="showCardDetailModal" @click="closeCardDetailModal">
			<view class="modal-content card-detail-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">银行卡详情</text>
					<text class="close-btn" @click="closeCardDetailModal">×</text>
				</view>
				
				<view class="modal-body">
					<!-- 卡片预览 -->
					<view class="card-preview" :style="{ background: selectedCard?.cardColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }">
						<view class="preview-header">
							<text class="preview-brand">{{ selectedCard?.cardBrand }}</text>
							<text class="preview-type">{{ selectedCard?.cardType }}</text>
						</view>
						<view class="preview-number">
							<text class="number-text">{{ showDetailCardNumbers ? selectedCard?.cardNumber : formatCardNumber(selectedCard?.cardNumber) }}</text>
						</view>
						<view class="preview-footer">
							<text class="preview-holder">{{ selectedCard?.cardHolder }}</text>
							<text class="preview-expiry">{{ formatExpiryDate(selectedCard?.expiryDate) }}</text>
						</view>
					</view>

					<!-- 详细信息 -->
					<view class="detail-sections">
						<!-- 基本信息 -->
						<view class="detail-section">
							<view class="section-title">基本信息</view>
							<view class="info-grid">
								<view class="info-item">
									<text class="info-label">卡号</text>
									<view class="card-number-display">
										<text class="info-value">{{ showDetailCardNumbers ? selectedCard?.cardNumber : formatCardNumber(selectedCard?.cardNumber) }}</text>
										<view class="toggle-visibility" @click="toggleDetailCardNumberVisibility">
											<text class="toggle-icon">{{ showDetailCardNumbers ? '👁️' : '👁️‍🗨️' }}</text>
										</view>
									</view>
								</view>
								<view class="info-item">
									<text class="info-label">持卡人</text>
									<text class="info-value">{{ selectedCard?.cardHolder }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">有效期</text>
									<text class="info-value">{{ formatExpiryDate(selectedCard?.expiryDate) }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">CVV</text>
									<view class="card-number-display">
										<text class="info-value">{{ showDetailCVV ? selectedCard?.cvv : '***' }}</text>
										<view class="toggle-visibility" @click="toggleDetailCVVVisibility">
											<text class="toggle-icon">{{ showDetailCVV ? '👁️' : '👁️‍🗨️' }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>

						<!-- 额度信息 -->
						<view class="detail-section">
							<view class="section-title">额度信息</view>
							<view class="info-grid">
								<view class="info-item">
									<text class="info-label">信用额度</text>
									<text class="info-value">¥{{ selectedCard?.creditLimit?.toLocaleString() || '0' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">可用额度</text>
									<text class="info-value available">¥{{ selectedCard?.availableCredit?.toLocaleString() || '0' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">当前欠款</text>
									<text class="info-value debt">¥{{ selectedCard?.currentBalance?.toLocaleString() || '0' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">最低还款</text>
									<text class="info-value min">¥{{ selectedCard?.minPayment?.toLocaleString() || '0' }}</text>
								</view>
							</view>
						</view>

						<!-- 账单信息 -->
						<view class="detail-section">
							<view class="section-title">账单信息</view>
							<view class="info-grid">
								<view class="info-item">
									<text class="info-label">账单日</text>
									<text class="info-value">每月{{ selectedCard?.statementDate || '0' }}日</text>
								</view>
								<view class="info-item">
									<text class="info-label">到期还款日</text>
									<text class="info-value">{{ selectedCard?.dueDate || '未设置' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">年费</text>
									<text class="info-value">¥{{ selectedCard?.annualFee?.toLocaleString() || '0' }}</text>
								</view>
								<view class="info-item">
									<text class="info-label">卡片状态</text>
									<text class="info-value status">{{ getStatusText(selectedCard?.cardStatus) }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="modal-footer">
					<button class="action-btn secondary" @click="closeCardDetailModal">关闭</button>
					<button class="action-btn primary" @click="editCard">编辑卡片</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			creditCards: [],
			showDetail: false,
			selectedCard: null,
			selectedIndex: 0,
			showAddCard: false,
			showFullCardNumbers: false,
			showDetailCardNumbers: false,
			showDetailCVV: false,
			showNewCardNumber: false,
			creditCardTransactions: [], // 信用卡交易记录
			showNewCVV: false,
			showRepaymentModal: false,
			showTransactionsModal: false,
			showRepaymentRecordModal: false,
			showCardDetailModal: false,
			customAmount: '',
			isCustomAmountValid: false,
			repaymentRecord: null,
			showSuccessAnimation: false,
			
			// 新增银行卡相关数据
			newCard: {
				cardType: '',
				cardBrand: '',
				cardNumber: '',
				cardHolder: '',
				expiryDate: '',
				cvv: '',
				creditLimit: '',
				annualFee: '',
				statementDate: '',
				dueDate: '',
				cardColor: '#4CAF50'
			},
			
			// 银行卡类型选项
			cardTypes: [
				{ value: '钻石卡', name: '钻石卡', icon: '💎' },
				{ value: '白金卡', name: '白金卡', icon: '⚪' },
				{ value: '金卡', name: '金卡', icon: '🟡' },
				{ value: '普卡', name: '普卡', icon: '🟢' },
				{ value: '学生卡', name: '学生卡', icon: '🎓' },
				{ value: '商务卡', name: '商务卡', icon: '💼' }
			],
			
			// 银行品牌选项
			bankBrands: [
				{ value: '中国农业银行', name: '中国农业银行', icon: '🏦' },
				{ value: '中国工商银行', name: '中国工商银行', icon: '🏦' },
				{ value: '中国建设银行', name: '中国建设银行', icon: '🏦' },
				{ value: '中国银行', name: '中国银行', icon: '🏦' },
				{ value: '交通银行', name: '交通银行', icon: '🏦' },
				{ value: '招商银行', name: '招商银行', icon: '🏦' },
				{ value: '浦发银行', name: '浦发银行', icon: '🏦' },
				{ value: '中信银行', name: '中信银行', icon: '🏦' },
				{ value: '华夏银行', name: '华夏银行', icon: '🏦' },
				{ value: '民生银行', name: '民生银行', icon: '🏦' },
				{ value: '广发银行', name: '广发银行', icon: '🏦' },
				{ value: '平安银行', name: '平安银行', icon: '🏦' },
				{ value: '兴业银行', name: '兴业银行', icon: '🏦' },
				{ value: '银联', name: '银联', icon: '💳' },
				{ value: 'Visa', name: 'Visa', icon: '💳' },
				{ value: 'MasterCard', name: 'MasterCard', icon: '💳' },
				{ value: 'American Express', name: 'American Express', icon: '💳' }
			],
			
			// 卡片颜色选项
			cardColors: [
				{ value: '#4CAF50', name: '绿色' },
				{ value: '#2196F3', name: '蓝色' },
				{ value: '#FF9800', name: '橙色' },
				{ value: '#9C27B0', name: '紫色' },
				{ value: '#F44336', name: '红色' },
				{ value: '#607D8B', name: '灰色' },
				{ value: '#795548', name: '棕色' },
				{ value: '#FF5722', name: '深橙色' },
				{ value: '#3F51B5', name: '靛蓝色' },
				{ value: '#009688', name: '青色' },
				{ value: '#E91E63', name: '粉色' },
				{ value: '#673AB7', name: '深紫色' }
			]
		}
	},
	onLoad() {
		console.log('信用卡页面加载开始')
		this.loadCreditCards()
		
		// 添加调试信息
		setTimeout(() => {
			console.log('信用卡数据加载完成:', this.creditCards)
			if (!this.creditCards || this.creditCards.length === 0) {
				console.warn('警告: 信用卡数据为空')
				uni.showToast({
					title: '未找到信用卡数据',
					icon: 'none',
					duration: 2000
				})
			}
		}, 1000)
	},
	computed: {
		isFormValid() {
			return this.validateForm()
		}
	},
	methods: {
		goBack() {
			uni.switchTab({
				url: '/pages/user/user'
			})
		},

		toggleCardNumberVisibility() {
			this.showFullCardNumbers = !this.showFullCardNumbers
			uni.showToast({
				title: this.showFullCardNumbers ? '显示完整卡号' : '隐藏卡号',
				icon: 'none',
				duration: 1500
			})
		},

		toggleDetailCardNumberVisibility() {
			this.showDetailCardNumbers = !this.showDetailCardNumbers
			uni.showToast({
				title: this.showDetailCardNumbers ? '显示完整卡号' : '隐藏卡号',
				icon: 'none',
				duration: 1500
			})
		},

		toggleDetailCVVVisibility() {
			this.showDetailCVV = !this.showDetailCVV
			uni.showToast({
				title: this.showDetailCVV ? '显示CVV' : '隐藏CVV',
				icon: 'none',
				duration: 1500
			})
		},

		toggleNewCardNumberVisibility() {
			this.showNewCardNumber = !this.showNewCardNumber
		},

		toggleNewCVVVisibility() {
			this.showNewCVV = !this.showNewCVV
		},

		loadCreditCards() {
			try {
				// 从user.json获取信用卡数据
				const users = uni.getStorageSync('users') || []
				const currentUser = users.find(user => user.isLoggedIn)
				
				if (currentUser && currentUser.creditCards && currentUser.creditCards.length > 0) {
					this.creditCards = currentUser.creditCards
					this.creditCardTransactions = currentUser.creditCardTransactions || []
					console.log('加载用户信用卡数据:', this.creditCards)
				} else {
					console.log('用户没有信用卡数据')
					this.creditCards = []
				}
				
				// 确保数据格式正确
				this.creditCards.forEach(card => {
					if (!card.availableCredit) {
						card.availableCredit = card.creditLimit - (card.currentBalance || 0)
					}
					if (!card.minPayment) {
						card.minPayment = Math.max(card.currentBalance * 0.1, 100)
					}
				})
				
			} catch (error) {
				console.error('加载信用卡信息失败:', error)
				uni.showToast({
					title: '加载失败: ' + error.message,
					icon: 'none',
					duration: 3000
				})
				this.creditCards = []
			}
		},

		showCardDetail(card, index) {
			this.selectedCard = card
			this.selectedIndex = index
			this.showDetail = true
			// 重置显示状态
			this.showDetailCardNumbers = false
			this.showDetailCVV = false
		},

		closeDetail() {
			this.showDetail = false
			this.selectedCard = null
			// 重置显示状态
			this.showDetailCardNumbers = false
			this.showDetailCVV = false
		},

		showRepayment() {
			this.showDetail = false
			this.showRepaymentModal = true
		},

		closeRepaymentModal() {
			this.showRepaymentModal = false
			this.customAmount = ''
			this.isCustomAmountValid = false
		},

		closeRepaymentRecordModal() {
			this.showRepaymentRecordModal = false
			this.repaymentRecord = null
			this.showSuccessAnimation = false
		},

		showRepaymentRecord() {
			if (!this.repaymentRecord) {
				console.error('还款记录数据不存在')
				uni.showToast({
					title: '还款记录数据错误',
					icon: 'none'
				})
				return
			}
			
			this.showRepaymentRecordModal = true
			
			setTimeout(() => {
				this.showSuccessAnimation = true
			}, 500)
		},

		testRepaymentRecord() {
			this.repaymentRecord = {
				id: Date.now(),
				cardNumber: '6222 6666 6666 6666',
				cardType: '钻石卡',
				cardBrand: '银联',
				repaymentAmount: 5000,
				repaymentType: '测试还款',
				oldBalance: 10000,
				newBalance: 5000,
				repaymentTime: new Date().toLocaleString('zh-CN'),
				status: '成功'
			}
			
			uni.showToast({
				title: '测试数据已创建',
				icon: 'success'
			})
		},

		showTransactions() {
			this.showDetail = false
			this.showTransactionsModal = true
		},

		closeTransactionsModal() {
			this.showTransactionsModal = false
		},

		handleRepayment(type) {
			const card = this.selectedCard
			if (!card) return
			
			let amount = 0
			let repaymentType = ''
			
			switch (type) {
				case 'full':
					amount = card.currentBalance
					repaymentType = '全额还款'
					break
				case 'min':
					amount = card.minPayment
					repaymentType = '最低还款'
					break
				default:
					return
			}
			
			if (amount < card.minPayment) {
				uni.showModal({
					title: '还款失败',
					content: `还款金额不能低于最低还款额 ¥${card.minPayment.toLocaleString()}`,
					showCancel: false
				})
				return
			}
			
			this.processRepayment(amount, repaymentType)
		},

		confirmCustomRepayment() {
			const amount = parseFloat(this.customAmount)
			if (isNaN(amount) || amount <= 0) {
				uni.showToast({
					title: '请输入有效金额',
					icon: 'none'
				})
				return
			}
			
			if (amount < this.selectedCard.minPayment) {
				uni.showModal({
					title: '还款失败',
					content: `还款金额不能低于最低还款额 ¥${this.selectedCard.minPayment.toLocaleString()}`,
					showCancel: false
				})
				return
			}
			
			this.processRepayment(amount, '自定义还款')
		},

		processRepayment(amount, repaymentType) {
			const card = this.selectedCard
			if (!card) return
			
			uni.showLoading({
				title: '处理中...'
			})
			
			setTimeout(() => {
				uni.hideLoading()
				
				const oldBalance = card.currentBalance
				const newBalance = Math.max(0, oldBalance - amount)
				
				card.currentBalance = newBalance
				card.availableCredit = card.creditLimit - newBalance
				
				this.repaymentRecord = {
					id: Date.now(),
					cardNumber: card.cardNumber,
					cardType: card.cardType,
					cardBrand: card.cardBrand,
					repaymentAmount: amount,
					repaymentType: repaymentType,
					oldBalance: oldBalance,
					newBalance: newBalance,
					repaymentTime: new Date().toLocaleString('zh-CN'),
					status: '成功'
				}
				
				this.updateCreditCardData()
				this.closeRepaymentModal()
				this.showRepaymentRecord()
				
			}, 1500)
		},

		validateCustomAmount() {
			const amount = parseFloat(this.customAmount)
			
			// 检查输入是否有效
			if (isNaN(amount) || amount <= 0) {
				this.isCustomAmountValid = false
				return
			}
			
			// 检查是否有选中的卡片
			if (!this.selectedCard) {
				this.isCustomAmountValid = false
				return
			}
			
			// 检查最低还款额
			if (amount < this.selectedCard.minPayment) {
				this.isCustomAmountValid = false
				return
			}
			
			// 检查是否超过当前欠款
			if (amount > this.selectedCard.currentBalance) {
				this.isCustomAmountValid = false
				return
			}
			
			// 通过所有验证
			this.isCustomAmountValid = true
		},

		updateCreditCardData() {
			try {
				let users = uni.getStorageSync('users') || []
				const currentUser = users.find(user => user.isLoggedIn)
				
				if (currentUser) {
					currentUser.creditCards = this.creditCards
					uni.setStorageSync('users', users)
				}
			} catch (error) {
				console.error('更新信用卡数据失败:', error)
			}
		},

		getTransactions() {
			return [
				{
					id: 1,
					type: 'expense',
					description: '餐饮消费',
					merchant: '星巴克咖啡',
					location: '北京市朝阳区',
					amount: -68.50,
					date: '2024-01-15 14:30:00'
				},
				{
					id: 2,
					type: 'expense',
					description: '购物消费',
					merchant: '京东商城',
					location: '北京市',
					amount: -1299.00,
					date: '2024-01-14 16:20:00'
				},
				{
					id: 3,
					type: 'income',
					description: '还款入账',
					merchant: '中国农业银行',
					location: '北京市',
					amount: 5000.00,
					date: '2024-01-13 09:00:00'
				}
			]
		},

		getTransactionIcon(type) {
			const icons = {
				expense: '💸',
				income: '💰',
				transfer: '↔️'
			}
			return icons[type] || '💳'
		},

		getTransactionTypeText(type) {
			const texts = {
				expense: '消费',
				income: '收入',
				transfer: '转账'
			}
			return texts[type] || '其他'
		},

		formatTransactionDate(dateStr) {
			const date = new Date(dateStr)
			const now = new Date()
			const diffTime = Math.abs(now - date)
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
			
			if (diffDays === 1) {
				return '今天'
			} else if (diffDays === 2) {
				return '昨天'
			} else if (diffDays <= 7) {
				return `${diffDays - 1}天前`
			} else {
				return date.toLocaleDateString('zh-CN')
			}
		},

		formatCardNumber(cardNumber) {
			if (!cardNumber) return ''
			const cleaned = cardNumber.replace(/\s/g, '')
			if (cleaned.length <= 8) {
				return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
			} else {
				// 显示前4位和后4位，中间用*号代替
				const firstFour = cleaned.substring(0, 4)
				const lastFour = cleaned.substring(cleaned.length - 4)
				const middle = '*'.repeat(cleaned.length - 8)
				return `${firstFour} ${middle} ${lastFour}`
			}
		},

		formatExpiryDate(expiryDate) {
			if (!expiryDate) return ''
			return expiryDate.replace(/(\d{4})-(\d{2})/, '$2/$1')
		},

		applyCard() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		},

		showAddCardModal() {
			this.showAddCard = true
		},

		closeAddCard() {
			this.showAddCard = false
			// 重置显示状态
			this.showNewCardNumber = false
			this.showNewCVV = false
		},

		// 获取总信用额度
		getTotalCreditLimit() {
			if (!this.creditCards || this.creditCards.length === 0) return '¥0'
			const total = this.creditCards.reduce((sum, card) => sum + (card.creditLimit || 0), 0)
			return `¥${total.toLocaleString()}`
		},

		// 获取总可用额度
		getTotalAvailableCredit() {
			if (!this.creditCards || this.creditCards.length === 0) return '¥0'
			const total = this.creditCards.reduce((sum, card) => sum + (card.availableCredit || 0), 0)
			return `¥${total.toLocaleString()}`
		},

		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				active: '正常',
				frozen: '冻结',
				expired: '过期',
				locked: '锁定'
			}
			return statusMap[status] || '未知'
		},

		// 银行卡管理相关方法
		selectCardType(type) {
			this.newCard.cardType = type
		},

		selectBankBrand(bank) {
			this.newCard.cardBrand = bank
		},

		selectCardColor(color) {
			this.newCard.cardColor = color
		},

		formatCardNumberInput(event) {
			let value = event.detail.value.replace(/\s/g, '')
			value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
			this.newCard.cardNumber = value
		},

		formatExpiryInput(event) {
			let value = event.detail.value.replace(/\D/g, '')
			if (value.length >= 2) {
				value = value.slice(0, 2) + '/' + value.slice(2, 4)
			}
			this.newCard.expiryDate = value
		},

		validateForm() {
			return (
				this.newCard.cardType &&
				this.newCard.cardBrand &&
				this.newCard.cardNumber.replace(/\s/g, '').length >= 16 &&
				this.newCard.cardHolder &&
				this.newCard.expiryDate &&
				this.newCard.cvv &&
				this.newCard.creditLimit &&
				this.newCard.annualFee &&
				this.newCard.statementDate &&
				this.newCard.dueDate
			)
		},

		confirmAddCard() {
			if (!this.validateForm()) {
				uni.showToast({
					title: '请完善所有必填信息',
					icon: 'none'
				})
				return
			}

			// 验证卡号格式
			const cardNumber = this.newCard.cardNumber.replace(/\s/g, '')
			if (!/^\d{16,19}$/.test(cardNumber)) {
				uni.showToast({
					title: '银行卡号格式不正确',
					icon: 'none'
				})
				return
			}

			// 验证CVV格式
			if (!/^\d{3,4}$/.test(this.newCard.cvv)) {
				uni.showToast({
					title: 'CVV格式不正确',
					icon: 'none'
				})
				return
			}

			// 创建新卡片
			const newCardData = {
				id: Date.now(),
				cardNumber: this.newCard.cardNumber,
				cardType: this.newCard.cardType,
				cardBrand: this.newCard.cardBrand,
				creditLimit: parseFloat(this.newCard.creditLimit),
				availableCredit: parseFloat(this.newCard.creditLimit),
				currentBalance: 0,
				minPayment: 0,
				statementDate: this.newCard.statementDate,
				dueDate: this.newCard.dueDate,
				lastStatementDate: new Date().toISOString().slice(0, 10),
				cardStatus: 'active',
				cardHolder: this.newCard.cardHolder,
				expiryDate: this.newCard.expiryDate.replace('/', '-'),
				cvv: this.newCard.cvv,
				annualFee: parseFloat(this.newCard.annualFee),
				interestRate: 0.0005,
				cashAdvanceLimit: parseFloat(this.newCard.creditLimit) * 0.5,
				rewardsPoints: 0,
				cardColor: this.newCard.cardColor
			}

			// 添加到卡片列表
			this.creditCards.push(newCardData)
			
			// 更新用户数据
			this.updateCreditCardData()
			
			// 重置表单
			this.resetNewCardForm()
			
			// 关闭弹窗
			this.closeAddCard()
			
			// 显示成功提示
			uni.showToast({
				title: '银行卡添加成功',
				icon: 'success'
			})
		},

		resetNewCardForm() {
			this.newCard = {
				cardType: '',
				cardBrand: '',
				cardNumber: '',
				cardHolder: '',
				expiryDate: '',
				cvv: '',
				creditLimit: '',
				annualFee: '',
				statementDate: '',
				dueDate: '',
				cardColor: '#4CAF50'
			}
		},

		openCardDetailModal() {
			this.showCardDetailModal = true
		},

		closeCardDetailModal() {
			this.showCardDetailModal = false
			// 重置显示状态
			this.showDetailCardNumbers = false
			this.showDetailCVV = false
		},

		editCard() {
			// 编辑卡片功能
			uni.showToast({
				title: '编辑功能开发中',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped>
.credit-cards-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	padding-bottom: 40rpx;
}

/* 顶部导航栏 */
.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx 30rpx 20rpx 30rpx;
	background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
	color: white;
	position: relative;
}

.nav-left {
	display: flex;
	align-items: center;
}

.back-icon {
	font-size: 48rpx;
	font-weight: bold;
	color: white;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	margin-left: 20rpx;
}

.nav-right {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.nav-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-icon:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(1.1);
}

.eye-icon, .add-icon {
	font-size: 32rpx;
}

/* 信用卡列表 */
.cards-container {
	padding: 30rpx;
}

/* 卡片统计信息 */
.cards-summary {
	display: flex;
	justify-content: space-around;
	background: white;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.summary-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.summary-number {
	font-size: 32rpx;
	font-weight: 700;
	color: #4caf50;
	margin-bottom: 10rpx;
}

.summary-label {
	font-size: 24rpx;
	color: #666;
}

.card-item {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
	color: white;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.card-item:hover {
	transform: translateY(-4rpx);
	box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.card-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
	transform: translateX(-100%);
	transition: transform 0.6s ease;
}

.card-item:hover::before {
	transform: translateX(100%);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.card-brand, .card-type {
	display: flex;
	flex-direction: column;
}

.brand-text, .type-text {
	font-size: 28rpx;
	font-weight: 500;
	opacity: 0.9;
}

.card-number {
	margin-bottom: 30rpx;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.number-text {
	font-size: 36rpx;
	font-weight: 600;
	letter-spacing: 4rpx;
	font-family: 'Courier New', monospace;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.card-holder, .card-expiry {
	display: flex;
	flex-direction: column;
}

.holder-label, .expiry-label {
	font-size: 22rpx;
	opacity: 0.6;
	margin-bottom: 5rpx;
}

.holder-name, .expiry-date {
	font-size: 26rpx;
	opacity: 0.8;
	font-weight: 500;
}

/* 卡片状态 */
.card-status {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10rpx);
}

.card-status.frozen {
	background: rgba(255, 87, 34, 0.9);
}

.card-status.expired {
	background: rgba(158, 158, 158, 0.9);
}

.card-status.locked {
	background: rgba(244, 67, 54, 0.9);
}

.status-text {
	font-size: 20rpx;
	color: white;
	font-weight: 600;
}

/* 无信用卡提示 */
.empty-state {
	text-align: center;
	padding: 100rpx 30rpx;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.empty-title {
	font-size: 32rpx;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.empty-desc {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 50rpx;
	display: block;
}

.apply-btn {
	background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
	color: white;
	border: none;
	padding: 25rpx 50rpx;
	border-radius: 50rpx;
	font-size: 30rpx;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.apply-btn:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.3);
}

/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	backdrop-filter: blur(10rpx);
}

.modal-content {
	background: white;
	border-radius: 24rpx;
	width: 90%;
	max-width: 600rpx;
	max-height: 90vh;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
	animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: translateY(50rpx) scale(0.9);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	flex-shrink: 0;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.close-btn {
	font-size: 40rpx;
	color: #999;
	cursor: pointer;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: #f0f0f0;
	color: #666;
}

.modal-body {
	padding: 30rpx;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
	flex: 1;
}

.modal-footer {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 25rpx;
	padding: 35rpx 30rpx 25rpx 30rpx;
	border-top: 2rpx solid #f0f0f0;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	min-height: 140rpx;
	flex-shrink: 0;
}

	/* 信用卡详情弹窗 */
	.card-detail-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 40rpx;
	}

	/* 弹窗头部操作按钮样式 */
	.modal-actions {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.action-icon {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.action-icon:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	.action-icon:active {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(0.95);
	}

	.action-icon .eye-icon {
		font-size: 32rpx;
		color: #fff;
	}

	/* 卡号显示容器样式 */
	.card-number-display {
		display: flex;
		align-items: center;
		gap: 20rpx;
		flex: 1;
		min-width: 0;
	}

	.toggle-visibility {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(76, 175, 80, 0.1);
		border: 2rpx solid rgba(76, 175, 80, 0.3);
		transition: all 0.3s ease;
		cursor: pointer;
		flex-shrink: 0;
	}

	.toggle-visibility:hover {
		background: rgba(76, 175, 80, 0.2);
		transform: scale(1.05);
	}

	.toggle-visibility:active {
		background: rgba(76, 175, 80, 0.2);
		transform: scale(0.95);
	}

	.toggle-visibility .toggle-icon {
		font-size: 28rpx;
		color: #4CAF50;
	}

	/* 输入框容器样式 */
	.card-input-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.input-toggle {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(76, 175, 80, 0.1);
		border: 2rpx solid rgba(76, 175, 80, 0.3);
		transition: all 0.3s ease;
		cursor: pointer;
		z-index: 10;
		flex-shrink: 0;
	}

	.input-toggle:hover {
		background: rgba(76, 175, 80, 0.2);
		transform: translateY(-50%) scale(1.05);
	}

	.input-toggle:active {
		background: rgba(76, 175, 80, 0.2);
		transform: translateY(-50%) scale(0.95);
	}

	.input-toggle .toggle-icon {
		font-size: 28rpx;
		color: #4CAF50;
	}

	/* 卡片预览中的卡号样式 */
	.preview-number .number-text {
		font-size: 48rpx;
		font-weight: bold;
		color: #fff;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
		letter-spacing: 4rpx;
		word-break: break-all;
		line-height: 1.2;
	}

	/* 信用卡列表中的卡号切换按钮 */
	.card-number {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
	}

	.card-number-toggle {
		position: absolute;
		right: -60rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		border: 2rpx solid rgba(255, 255, 255, 0.3);
		transition: all 0.3s ease;
		cursor: pointer;
		flex-shrink: 0;
	}

	.card-number-toggle:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-50%) scale(1.05);
	}

	.card-number-toggle:active {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-50%) scale(0.95);
	}

	.card-number-toggle .toggle-icon {
		font-size: 28rpx;
		color: #fff;
	}

	/* 导航栏眼睛图标样式优化 */
	.nav-icon .eye-icon {
		font-size: 32rpx;
		color: #fff;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
	}

	/* 确保输入框在有切换按钮时不会重叠 */
	.card-input-container .form-input {
		padding-right: 80rpx;
	}

	/* 优化卡号显示区域的布局 */
	.info-item:has(.card-number-display) {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
		padding: 20rpx;
		border-bottom: 1rpx solid #f8f9fa;
		margin-bottom: 15rpx;
		background: rgba(248, 249, 250, 0.8);
		border-radius: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	/* 确保切换按钮在移动端也能正常点击 */
	@media (max-width: 768rpx) {
		.card-number-toggle {
			right: -50rpx;
			width: 60rpx;
			height: 60rpx;
		}
		
		.input-toggle {
			width: 60rpx;
			height: 60rpx;
			right: 15rpx;
		}
		
		.toggle-visibility {
			width: 60rpx;
			height: 60rpx;
		}
	}

.detail-modal {
	max-height: 90vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.detail-content {
	padding: 20rpx 0;
	flex: 1;
	overflow-y: auto;
	max-height: calc(90vh - 300rpx);
}

.detail-section {
	margin-bottom: 40rpx;
}

.detail-section:last-child {
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f8f9fa;
	min-height: 60rpx;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
	min-width: 120rpx;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	text-align: right;
	max-width: 60%;
	word-break: break-all;
	line-height: 1.4;
}

.info-value.status {
	color: #4caf50;
	font-weight: 600;
}

.limit-info {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.limit-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	border-left: 6rpx solid #4caf50;
}

.limit-label {
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
}

.limit-value {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	text-align: right;
}

.limit-value.available {
	color: #4caf50;
}

.limit-value.debt {
	color: #f44336;
}

.limit-value.min {
	color: #ff9800;
}

/* 详情弹窗底部按钮 */
.detail-footer {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-top: 2rpx solid #f0f0f0;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 30rpx;
	flex-shrink: 0;
}

.detail-footer .action-btn {
	min-width: 200rpx;
	height: 80rpx;
	font-size: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 底部按钮 */
.action-btn {
	padding: 32rpx 25rpx;
	border-radius: 16rpx;
	font-size: 32rpx;
	font-weight: 600;
	border: none;
	cursor: pointer;
	transition: all 0.3s ease;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.action-btn.primary {
	background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
	color: white;
	box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.3);
}

.action-btn.primary:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 28rpx rgba(76, 175, 80, 0.4);
}

.action-btn.secondary {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	color: #666;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}

.action-btn.secondary:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.15);
}

/* 还款弹窗样式 */
.repayment-modal .modal-body {
	padding: 40rpx 30rpx;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
}

.card-info {
	text-align: center;
	margin-bottom: 40rpx;
	padding: 30rpx;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 20rpx;
}

.card-info .card-number {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 15rpx;
	word-break: break-all;
	line-height: 1.3;
}

.card-info .card-type {
	font-size: 26rpx;
	color: #666;
	line-height: 1.3;
}

.repayment-info {
	margin-bottom: 40rpx;
}

.repayment-info .info-row {
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	min-height: 60rpx;
}

.repayment-info .info-row:last-child {
	border-bottom: none;
}

.repayment-info .info-label {
	font-size: 28rpx;
	color: #666;
}

.repayment-info .info-value {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	word-break: break-all;
	line-height: 1.3;
}

.repayment-info .info-value.debt {
	color: #f44336;
}

.repayment-info .info-value.available {
	color: #4caf50;
}

.repayment-methods {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.method-btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	background: #f8f9fa;
	border: 2rpx solid #e0e0e0;
	border-radius: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	min-height: 100rpx;
}

.method-btn:hover {
	border-color: #4caf50;
	background: #f1f8e9;
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.15);
}

.method-btn.full {
	border-color: #4caf50;
	background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
}

.method-btn.min {
	border-color: #2196f3;
	background: linear-gradient(135deg, #e3f2fd 0%, #f3f9ff 100%);
}

.method-btn.custom {
	border-color: #ff9800;
	background: linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%);
	align-items: center;
}

.left-content {
	display: flex;
	align-items: center;
	gap: 20rpx;
	height: 100%;
}

.method-icon {
	font-size: 36rpx;
}

.method-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	line-height: 1.2;
}

.method-amount {
	font-size: 32rpx;
	font-weight: 700;
	color: #4caf50;
	word-break: break-all;
	line-height: 1.2;
}

.custom-input-section {
	display: flex;
	align-items: center;
	min-width: 160rpx;
	height: 120rpx;
	justify-content: center;
}

.custom-amount-input {
	width: 160rpx;
	height: 60rpx;
	border: 2rpx solid #ff9800;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	background: white;
	text-align: center;
	transition: all 0.3s ease;
	color: #4caf50;
	font-weight: bold;
	box-sizing: border-box;
}

.custom-amount-input:focus {
	outline: none;
	border-color: #f57c00;
	box-shadow: 0 0 0 4rpx rgba(255, 152, 0, 0.1);
}

.custom-amount-input::placeholder {
	color: #4caf50;
	font-size: 26rpx;
	font-weight: bold;
	opacity: 0.6;
}

/* 确认还款按钮 */
.confirm-repayment-btn {
	height: 88rpx;
	padding: 0 60rpx;
	background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
	color: white;
	border: none;
	border-radius: 24rpx;
	font-size: 32rpx;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.3);
	max-width: 400rpx;
}

.confirm-repayment-btn:not(:disabled):hover {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 28rpx rgba(76, 175, 80, 0.4);
}

.confirm-repayment-btn:disabled {
	background: #ccc;
	cursor: not-allowed;
	box-shadow: none;
}

/* 交易记录弹窗样式 */
.transactions-modal .modal-body {
	padding: 30rpx;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
}

.transactions-list {
	margin-bottom: 30rpx;
}

.transaction-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	border-left: 6rpx solid #4caf50;
	min-height: 80rpx;
}

.transaction-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
	flex: 1;
	min-width: 0;
}

.transaction-icon {
	font-size: 40rpx;
	flex-shrink: 0;
}

.transaction-details {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
	min-width: 0;
}

.transaction-desc {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	word-break: break-all;
	line-height: 1.3;
}

.transaction-merchant {
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
	line-height: 1.3;
}

.transaction-location {
	font-size: 22rpx;
	color: #999;
	word-break: break-all;
	line-height: 1.3;
}

.transaction-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
	flex-shrink: 0;
}

.transaction-amount {
	font-size: 30rpx;
	font-weight: 700;
	word-break: break-all;
	line-height: 1.2;
}

.transaction-amount.income {
	color: #4caf50;
}

.transaction-amount.expense {
	color: #f44336;
}

.transaction-date {
	font-size: 22rpx;
	color: #999;
	line-height: 1.2;
}

.transaction-type {
	font-size: 22rpx;
	color: #666;
	background: #e9ecef;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	line-height: 1.2;
}

.transactions-summary {
	text-align: center;
	padding: 20rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
}

.summary-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.3;
}

/* 还款记录弹窗样式 */
.repayment-record-modal .modal-body {
	padding: 40rpx 30rpx;
	text-align: center;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
}

/* 成功动画 */
.success-animation {
	position: relative;
	margin-bottom: 40rpx;
}

.success-circle {
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 30rpx auto;
	box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.3);
	animation: successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.05); }
}

.success-symbol {
	color: white;
	font-size: 60rpx;
	font-weight: bold;
}

.success-ripple {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 120rpx;
	height: 120rpx;
	border: 3rpx solid #4caf50;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	opacity: 0;
	animation: ripple 2s ease-out infinite;
}

.success-ripple.delay-1 {
	animation-delay: 0.5s;
}

.success-ripple.delay-2 {
	animation-delay: 1s;
}

@keyframes ripple {
	0% {
		transform: translate(-50%, -50%) scale(0.8);
		opacity: 1;
	}
	100% {
		transform: translate(-50%, -50%) scale(2);
		opacity: 0;
	}
}

/* 庆祝动画 */
.celebration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.celebration-item {
	position: absolute;
	font-size: 40rpx;
	animation: celebration 2s ease-out infinite;
}

.celebration-item:nth-child(1) {
	top: 20%;
	left: 20%;
	animation-delay: 0s;
}

.celebration-item:nth-child(2) {
	top: 30%;
	right: 20%;
	animation-delay: 0.3s;
}

.celebration-item:nth-child(3) {
	bottom: 30%;
	left: 30%;
	animation-delay: 0.6s;
}

.celebration-item:nth-child(4) {
	bottom: 20%;
	right: 30%;
	animation-delay: 0.9s;
}

@keyframes celebration {
	0% {
		opacity: 0;
		transform: translateY(0) scale(0.5);
	}
	50% {
		opacity: 1;
		transform: translateY(-20rpx) scale(1.2);
	}
	100% {
		opacity: 0;
		transform: translateY(-40rpx) scale(0.8);
	}
}

/* 还款状态 */
.repayment-status {
	margin-bottom: 40rpx;
}

.status-text {
	font-size: 36rpx;
	font-weight: 700;
	color: #4caf50;
	margin-bottom: 15rpx;
	display: block;
	line-height: 1.3;
}

.status-subtitle {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	display: block;
	word-break: break-all;
}

/* 还款金额突出显示 */
.amount-highlight {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	border: 2rpx solid #4caf50;
}

.amount-label {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 15rpx;
	display: block;
	line-height: 1.3;
}

.amount-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #4caf50;
	margin-bottom: 10rpx;
	display: block;
	line-height: 1.2;
}

.amount-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	line-height: 1.3;
}

/* 卡片信息 */
.record-card-info {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	color: white;
	position: relative;
	overflow: hidden;
}

.card-icon {
	font-size: 48rpx;
	margin-bottom: 20rpx;
}

.record-card-info .card-number {
	font-size: 32rpx;
	font-weight: 600;
	margin-bottom: 15rpx;
	word-break: break-all;
	line-height: 1.3;
}

.record-card-info .card-type {
	font-size: 26rpx;
	opacity: 0.9;
	line-height: 1.3;
}

/* 还款详情 */
.repayment-details {
	background: #f8f9fa;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
}

.details-header {
	margin-bottom: 25rpx;
	text-align: center;
}

.header-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	line-height: 1.3;
}

.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #e9ecef;
	min-height: 60rpx;
}

.detail-row:last-child {
	border-bottom: none;
}

.detail-left {
	display: flex;
	align-items: center;
	gap: 15rpx;
	flex-shrink: 0;
}

.detail-icon {
	font-size: 32rpx;
}

.detail-label {
	font-size: 28rpx;
	color: #666;
	line-height: 1.3;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	word-break: break-all;
	line-height: 1.3;
	max-width: 50%;
	text-align: right;
}

.detail-value.success {
	color: #4caf50;
	font-weight: 600;
}

.detail-value.debt {
	color: #f44336;
}

/* 温馨提示 */
.repayment-tips {
	background: linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%);
	border-radius: 20rpx;
	padding: 30rpx;
	border-left: 6rpx solid #ff9800;
}

.tips-header {
	display: flex;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.tips-icon {
	font-size: 32rpx;
}

.tips-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	line-height: 1.3;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.tips-content {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	text-align: left;
	word-break: break-all;
}

/* 银行卡管理样式 */
.add-card-modal .modal-body {
	padding: 40rpx 30rpx;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
}

.form-section {
	margin-bottom: 40rpx;
}

.form-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 25rpx;
	padding-bottom: 15rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

/* 卡片类型选择 */
.card-type-options {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
}

.type-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 25rpx 20rpx;
	background: #f8f9fa;
	border: 2rpx solid #e0e0e0;
	border-radius: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	text-align: center;
	min-height: 120rpx;
}

.type-option:hover {
	border-color: #4caf50;
	background: #f1f8e9;
	transform: translateY(-2rpx);
}

.type-option.active {
	border-color: #4caf50;
	background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
	box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.15);
}

.type-icon {
	font-size: 40rpx;
	margin-bottom: 15rpx;
}

.type-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
	line-height: 1.2;
}

/* 银行品牌选择 */
.bank-options {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 15rpx;
}

.bank-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 15rpx;
	background: #f8f9fa;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	text-align: center;
	min-height: 100rpx;
}

.bank-option:hover {
	border-color: #2196f3;
	background: #e3f2fd;
	transform: translateY(-2rpx);
}

.bank-option.active {
	border-color: #2196f3;
	background: linear-gradient(135deg, #e3f2fd 0%, #f3f9ff 100%);
	box-shadow: 0 6rpx 16rpx rgba(33, 150, 243, 0.15);
}

.bank-icon {
	font-size: 32rpx;
	margin-bottom: 10rpx;
}

.bank-name {
	font-size: 22rpx;
	font-weight: 500;
	color: #333;
	line-height: 1.2;
	word-break: break-all;
}

/* 表单输入 */
.input-group {
	margin-bottom: 30rpx;
}

.input-row {
	display: flex;
	gap: 20rpx;
}

.input-group.half {
	flex: 1;
}

.input-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 15rpx;
	display: block;
}

.form-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	background: white;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.form-input:focus {
	outline: none;
	border-color: #4caf50;
	box-shadow: 0 0 0 4rpx rgba(76, 175, 80, 0.1);
}

.input-tip {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
	line-height: 1.3;
}

.cvv-tip {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-top: 10rpx;
}

.tip-icon {
	font-size: 24rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #999;
	line-height: 1.3;
}

/* 颜色选择 */
.color-options {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 15rpx;
}

.color-option {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	border: 3rpx solid #e0e0e0;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
}

.color-option:hover {
	transform: scale(1.1);
	border-color: #333;
}

.color-option.active {
	border-color: #333;
	transform: scale(1.1);
	box-shadow: 0 0 0 4rpx rgba(0, 0, 0, 0.1);
}

.color-option.active::after {
	content: '✓';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-size: 24rpx;
	font-weight: bold;
	text-shadow: 0 0 4rpx rgba(0, 0, 0, 0.5);
}

/* 银行卡详情弹窗样式 */
.card-detail-modal .modal-body {
	padding: 40rpx 30rpx;
	max-height: calc(90vh - 200rpx);
	overflow-y: auto;
}

.card-preview {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 40rpx;
	color: white;
	position: relative;
	overflow: hidden;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.preview-brand {
	font-size: 28rpx;
	font-weight: 500;
	opacity: 0.9;
}

.preview-type {
	font-size: 26rpx;
	opacity: 0.8;
}

.preview-number {
	font-size: 36rpx;
	font-weight: 600;
	letter-spacing: 4rpx;
	font-family: 'Courier New', monospace;
	margin-bottom: 30rpx;
	word-break: break-all;
	line-height: 1.2;
}

.preview-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.preview-holder {
	font-size: 26rpx;
	opacity: 0.8;
	font-weight: 500;
}

.preview-expiry {
	font-size: 24rpx;
	opacity: 0.7;
}

.detail-sections {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	align-items: start;
}

.info-grid .info-item:has(.card-number-display) {
	grid-column: 1 / -1;
	grid-row: auto;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	min-height: 60rpx;
}

.info-item:has(.card-number-display) {
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	padding: 15rpx;
	border-bottom: 1rpx solid #f8f9fa;
	margin-bottom: 10rpx;
	background: rgba(248, 249, 250, 0.5);
	border-radius: 8rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.info-label {
	font-size: 26rpx;
	color: #666;
	flex-shrink: 0;
	min-width: 120rpx;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	word-break: break-all;
	line-height: 1.4;
}

.info-value:has(.card-number-display) {
	flex: 1;
	text-align: left;
	max-width: none;
}

.info-value.available {
	color: #4caf50;
}

.info-value.debt {
	color: #f44336;
}

.info-value.min {
	color: #ff9800;
}

.info-value.status {
	color: #4caf50;
	font-weight: 600;
}
</style>

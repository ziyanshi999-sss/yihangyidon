<template>
  <view class="games-page">
    <view class="page-header">
      <text class="header-title">小豆乐园</text>
      <text class="header-subtitle">趣味游戏 积分奖励</text>
    </view>

    <!-- 积分信息 -->
    <view class="points-info">
      <view class="points-card">
        <view class="points-header">
          <text class="points-title">我的积分</text>
          <text class="points-rule" @tap="viewPointsRule">积分规则 ></text>
        </view>
        <view class="points-content">
          <text class="points-number">{{ userPoints }}</text>
          <text class="points-unit">分</text>
        </view>
        <view class="points-actions">
          <button class="action-btn primary" @tap="signIn">每日签到</button>
          <button class="action-btn secondary" @tap="viewPointsHistory">
            积分明细
          </button>
        </view>
      </view>
    </view>

    <!-- 游戏分类 -->
    <view class="game-categories">
      <view class="category-tabs">
        <view
          class="tab-item"
          v-for="(category, index) in gameCategories"
          :key="index"
          :class="{ active: activeCategory === index }"
          @tap="switchCategory(index)"
        >
          <text class="tab-text">{{ category }}</text>
        </view>
      </view>
    </view>

    <!-- 游戏列表 -->
    <view class="games-grid">
      <view
        class="game-item"
        v-for="(game, index) in currentGames"
        :key="index"
        @tap="playGame(game)"
      >
        <view class="game-cover">
          <text class="game-icon">{{ game.icon }}</text>
          <view class="game-badge" v-if="game.badge">
            <text class="badge-text">{{ game.badge }}</text>
          </view>
        </view>
        <view class="game-info">
          <text class="game-title">{{ game.title }}</text>
          <text class="game-desc">{{ game.desc }}</text>
          <view class="game-reward">
            <text class="reward-text">+{{ game.reward }}积分</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动专区 -->
    <view class="activity-section">
      <view class="section-header">
        <text class="section-title">🎉 活动专区</text>
        <text class="view-all" @tap="viewAllActivities">查看全部</text>
      </view>

      <view class="activity-cards">
        <view
          class="activity-card"
          v-for="(activity, index) in activities"
          :key="index"
          @tap="joinActivity(activity)"
        >
          <view class="activity-header">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-status">{{ activity.status }}</text>
          </view>
          <text class="activity-desc">{{ activity.desc }}</text>
          <view class="activity-footer">
            <text class="activity-time">{{ activity.time }}</text>
            <text class="activity-reward">奖励: {{ activity.reward }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 兑换商城 -->
    <view class="exchange-section">
      <view class="section-header">
        <text class="section-title">🎁 积分商城</text>
        <text class="view-all" @tap="viewExchangeMall">更多好礼</text>
      </view>

      <view class="exchange-grid">
        <view
          class="exchange-item"
          v-for="(item, index) in exchangeItems"
          :key="index"
          @tap="exchangeItem(item)"
        >
          <view class="item-image">
            <text class="item-icon">{{ item.icon }}</text>
          </view>
          <text class="item-name">{{ item.name }}</text>
          <text class="item-points">{{ item.points }}积分</text>
          <button class="exchange-btn" :disabled="userPoints < item.points">
            {{ userPoints >= item.points ? "立即兑换" : "积分不足" }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "GamesPage",
  data() {
    return {
      userPoints: 1580,
      activeCategory: 0,
      gameCategories: ["答题闯关", "趣味游戏", "签到任务", "分享赚积分"],
      quizGames: [
        {
          icon: "🧠",
          title: "金融知识问答",
          desc: "答对10题获得积分",
          reward: 50,
          badge: "热门",
        },
        {
          icon: "📚",
          title: "理财小课堂",
          desc: "学习理财知识",
          reward: 30,
          badge: "",
        },
        {
          icon: "💰",
          title: "投资达人",
          desc: "投资知识竞答",
          reward: 100,
          badge: "高分",
        },
      ],
      funGames: [
        {
          icon: "🎮",
          title: "农行大富翁",
          desc: "虚拟理财游戏",
          reward: 80,
          badge: "新游戏",
        },
        {
          icon: "🎯",
          title: "幸运转盘",
          desc: "每日一次免费转",
          reward: 20,
          badge: "",
        },
        {
          icon: "🎲",
          title: "财富密码",
          desc: "猜数字赢积分",
          reward: 60,
          badge: "",
        },
      ],
      checkInGames: [
        {
          icon: "📅",
          title: "每日签到",
          desc: "连续签到奖励更多",
          reward: 10,
          badge: "每日",
        },
        {
          icon: "📱",
          title: "APP使用",
          desc: "使用APP功能",
          reward: 5,
          badge: "",
        },
        {
          icon: "💳",
          title: "绑定银行卡",
          desc: "绑卡获得积分",
          reward: 200,
          badge: "一次性",
        },
      ],
      shareGames: [
        {
          icon: "📤",
          title: "分享好友",
          desc: "邀请好友注册",
          reward: 500,
          badge: "高奖励",
        },
        {
          icon: "📢",
          title: "朋友圈分享",
          desc: "分享优惠信息",
          reward: 20,
          badge: "",
        },
        {
          icon: "👥",
          title: "推荐产品",
          desc: "推荐理财产品",
          reward: 100,
          badge: "",
        },
      ],
      activities: [
        {
          title: "新春积分翻倍",
          desc: "春节期间所有游戏积分翻倍",
          status: "进行中",
          time: "2024.01.01-2024.02.15",
          reward: "双倍积分",
        },
        {
          title: "理财达人挑战",
          desc: "连续30天完成理财任务",
          status: "即将开始",
          time: "2024.02.01-2024.02.29",
          reward: "1000积分+理财券",
        },
      ],
      exchangeItems: [
        {
          icon: "☕",
          name: "星巴克咖啡券",
          points: 2000,
        },
        {
          icon: "🎬",
          name: "电影票",
          points: 1500,
        },
        {
          icon: "📱",
          name: "话费充值券",
          points: 1000,
        },
        {
          icon: "🎁",
          name: "京东购物券",
          points: 800,
        },
      ],
    };
  },

  computed: {
    currentGames() {
      switch (this.activeCategory) {
        case 0:
          return this.quizGames;
        case 1:
          return this.funGames;
        case 2:
          return this.checkInGames;
        case 3:
          return this.shareGames;
        default:
          return this.quizGames;
      }
    },
  },

  methods: {
    switchCategory(index) {
      this.activeCategory = index;
    },

    signIn() {
      uni.showModal({
        title: "签到成功",
        content: "恭喜您获得10积分！连续签到7天可获得额外奖励",
        showCancel: false,
      });
      this.userPoints += 10;
    },

    viewPointsRule() {
      uni.showModal({
        title: "积分规则",
        content:
          "1. 每日签到获得10积分\n2. 完成游戏任务获得相应积分\n3. 积分可用于兑换礼品\n4. 积分有效期为1年",
        showCancel: false,
      });
    },

    viewPointsHistory() {
      uni.showToast({
        title: "跳转到积分明细页面",
        icon: "none",
      });
    },

    playGame(game) {
      console.log("开始游戏:", game);
      uni.showModal({
        title: game.title,
        content: `即将开始${game.title}，完成后可获得${game.reward}积分`,
        confirmText: "开始游戏",
        success: (res) => {
          if (res.confirm) {
            // 模拟游戏完成
            setTimeout(() => {
              uni.showToast({
                title: `恭喜获得${game.reward}积分！`,
                icon: "success",
              });
              this.userPoints += game.reward;
            }, 2000);
          }
        },
      });
    },

    joinActivity(activity) {
      console.log("参加活动:", activity);
      uni.showToast({
        title: `参加${activity.title}活动`,
        icon: "none",
      });
    },

    viewAllActivities() {
      uni.showToast({
        title: "查看全部活动",
        icon: "none",
      });
    },

    exchangeItem(item) {
      if (this.userPoints < item.points) {
        uni.showToast({
          title: "积分不足，无法兑换",
          icon: "none",
        });
        return;
      }

      uni.showModal({
        title: "确认兑换",
        content: `确定使用${item.points}积分兑换${item.name}吗？`,
        success: (res) => {
          if (res.confirm) {
            this.userPoints -= item.points;
            uni.showToast({
              title: "兑换成功！",
              icon: "success",
            });
          }
        },
      });
    },

    viewExchangeMall() {
      uni.showToast({
        title: "跳转到积分商城",
        icon: "none",
      });
    },

    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a65 100%);
  padding: 60rpx 30rpx 40rpx;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 60rpx;
  text-align: center;
}

.coming-title {
  font-size: 48rpx;
  margin-bottom: 40rpx;
}

.coming-desc {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 80rpx;
}

/* 积分信息 */
.points-info {
  margin: 20rpx 30rpx;
}

.points-card {
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  border-radius: 20rpx;
  padding: 40rpx;
  color: #fff;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.points-title {
  font-size: 28rpx;
  font-weight: 500;
}

.points-rule {
  font-size: 24rpx;
  opacity: 0.8;
}

.points-content {
  text-align: center;
  margin-bottom: 30rpx;
}

.points-number {
  font-size: 72rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.points-unit {
  font-size: 32rpx;
  opacity: 0.8;
}

.points-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  border: none;
}

.action-btn.primary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 游戏分类 */
.game-categories {
  background: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.category-tabs {
  display: flex;
  padding: 8rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 8rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: #ff6b35;
}

.tab-text {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #fff;
}

/* 游戏网格 */
.games-grid {
  margin: 0 30rpx 20rpx;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20rpx;
}

.game-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.game-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.game-cover {
  position: relative;
  margin-right: 30rpx;
}

.game-icon {
  display: block;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  border-radius: 16rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
}

.game-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #ff3b30;
  border-radius: 20rpx;
  padding: 4rpx 12rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
}

.game-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.game-reward {
  display: inline-block;
}

.reward-text {
  background: #ff6b35;
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

/* 活动专区 */
.activity-section {
  background: #fff;
  margin: 0 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.view-all {
  font-size: 26rpx;
  color: #ff6b35;
}

.activity-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.activity-card {
  padding: 30rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-left: 6rpx solid #ff6b35;
  transition: all 0.3s ease;
}

.activity-card:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.activity-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.activity-status {
  background: #ff6b35;
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.activity-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: block;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-time {
  font-size: 24rpx;
  color: #999;
}

.activity-reward {
  font-size: 24rpx;
  color: #ff6b35;
  font-weight: 500;
}

/* 兑换商城 */
.exchange-section {
  background: #fff;
  margin: 0 30rpx 100rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.exchange-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.exchange-item {
  padding: 30rpx 20rpx;
  border-radius: 12rpx;
  background: #fafafa;
  text-align: center;
  transition: all 0.3s ease;
}

.exchange-item:active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.item-image {
  margin-bottom: 16rpx;
}

.item-icon {
  display: block;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  border-radius: 16rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
  margin: 0 auto;
}

.item-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
  display: block;
}

.item-points {
  font-size: 24rpx;
  color: #ff6b35;
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
}

.exchange-btn {
  width: 100%;
  padding: 16rpx;
  border-radius: 8rpx;
  background: #ff6b35;
  color: #fff;
  font-size: 24rpx;
  border: none;
}

.exchange-btn[disabled] {
  background: #ccc;
  color: #999;
}
</style>
<template>
  <view class="payment-management-page">
    <!-- 新增分组 -->
    <view class="add-group-section">
      <view class="add-group-card" @tap="handleAddGroup">
        <view class="add-group-content">
          <text class="add-group-text">新增分组</text>
        </view>
      </view>
    </view>

    <!-- 分组列表 -->
    <view class="groups-section">
      <!-- 动态渲染分组 -->
      <view class="group-card" v-for="group in groups" :key="group.id">
        <view class="group-header" @tap="toggleGroup(group.id)">
          <text class="group-title">{{ group.name }}</text>
          <view class="group-actions">
            <text class="action-icon edit-icon" @tap.stop="editGroup(group.id)"
              >✏️</text
            >
            <text
              class="action-icon delete-icon"
              @tap.stop="deleteGroup(group.id)"
              >🗑️</text
            >
          </view>
        </view>

        <view class="group-items" v-if="expandedGroups.includes(group.id)">
          <!-- 动态渲染分组项目 -->
          <view class="payment-item" v-for="item in group.items" :key="item.id">
            <view class="item-left">
              <view class="item-icon" :style="{ background: item.bgColor }">
                <text class="item-symbol">{{ item.icon }}</text>
              </view>
              <view class="item-info">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-desc">{{ item.desc }}</text>
              </view>
            </view>
            <view class="item-actions">
              <text class="action-icon edit-icon" @tap="editPaymentItem(item)"
                >✏️</text
              >
              <text
                class="action-icon delete-icon"
                @tap="deletePaymentItem(item)"
                >🗑️</text
              >
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加缴费项目浮动按钮 -->
    <view class="fab-container">
      <view class="fab-button" @tap="showAddItemMenu">
        <text class="fab-icon">+</text>
      </view>
    </view>

    <!-- 添加项目菜单 -->
    <view class="add-menu-overlay" v-if="showAddMenu" @tap="hideAddItemMenu">
      <view class="add-menu" @tap.stop>
        <view class="menu-header">
          <text class="menu-title">添加缴费项目</text>
          <text class="menu-close" @tap="hideAddItemMenu">✕</text>
        </view>
        <view class="menu-items">
          <view
            class="menu-item"
            v-for="(item, index) in addMenuItems"
            :key="index"
            @tap="addPaymentItem(item)"
          >
            <view
              class="menu-item-icon"
              :style="{ backgroundColor: item.bgColor }"
            >
              <text class="menu-icon-text">{{ item.icon }}</text>
            </view>
            <text class="menu-item-label">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PaymentManagementPage",
  data() {
    return {
      expandedGroups: ["self", "common"], // 默认展开的分组
      showAddMenu: false,

      // 添加菜单项目
      addMenuItems: [
        {
          icon: "💧",
          label: "水费",
          bgColor: "#64B5F6",
          type: "water",
        },
        {
          icon: "💡",
          label: "电费",
          bgColor: "#FFB74D",
          type: "electric",
        },
        {
          icon: "🔥",
          label: "燃气费",
          bgColor: "#FF8A65",
          type: "gas",
        },
        {
          icon: "📱",
          label: "手机充值",
          bgColor: "#81C784",
          type: "phone",
        },
        {
          icon: "🏠",
          label: "供暖费",
          bgColor: "#A1887F",
          type: "heating",
        },
        {
          icon: "📺",
          label: "有线电视费",
          bgColor: "#9575CD",
          type: "tv",
        },
        {
          icon: "📦",
          label: "物业费",
          bgColor: "#4DB6AC",
          type: "property",
        },
        {
          icon: "☭",
          label: "党费",
          bgColor: "#FF5252",
          type: "party",
        },
      ],

      // 分组数据
      groups: [
        {
          id: "self",
          name: "自己",
          items: [
            {
              id: "party-001",
              type: "party",
              title: "党费",
              desc: "★手机 | 410************5030",
              icon: "☭",
              bgColor: "#FF5252",
            },
          ],
        },
        {
          id: "common",
          name: "常用缴费",
          items: [
            {
              id: "phone-001",
              type: "phone",
              title: "手机充值",
              desc: "15703724152 | 50元",
              icon: "📱",
              bgColor: "#81C784",
            },
          ],
        },
      ],
    };
  },

  onLoad() {
    console.log("缴费管理页面加载");
    this.loadPaymentData();
  },

  onShow() {
    console.log("缴费管理页面显示");
    this.loadPaymentData();
  },

  methods: {
    // 加载缴费数据
    loadPaymentData() {
      try {
        const users = uni.getStorageSync('users') || []
        const currentUser = users.find(user => user.isLoggedIn)
        
        if (currentUser && currentUser.paymentRecords) {
          // 将缴费记录按类型分组
          const groupedRecords = this.groupPaymentRecords(currentUser.paymentRecords)
          
          // 更新分组数据
          this.groups = [
            {
              id: "self",
              name: "自己",
              items: groupedRecords.self || []
            },
            {
              id: "common",
              name: "常用缴费",
              items: groupedRecords.common || []
            }
          ]
          
          console.log('缴费管理数据加载成功:', {
            totalRecords: currentUser.paymentRecords.length,
            groups: this.groups.length
          })
        } else {
          console.log('未找到缴费记录数据')
        }
      } catch (error) {
        console.error('加载缴费数据失败:', error)
      }
    },

    // 将缴费记录按类型分组
    groupPaymentRecords(records) {
      const grouped = {
        self: [],
        common: []
      }
      
      records.forEach(record => {
        const item = {
          id: record.id,
          type: this.getPaymentType(record.type),
          title: record.type,
          desc: record.phoneNumber || record.account || record.description,
          icon: this.getPaymentIcon(record.type),
          bgColor: this.getPaymentColor(record.type)
        }
        
        // 根据类型分配到不同分组
        if (record.type === '党费') {
          grouped.self.push(item)
        } else {
          grouped.common.push(item)
        }
      })
      
      return grouped
    },

    // 获取缴费类型
    getPaymentType(type) {
      const typeMap = {
        '手机充值': 'phone',
        '电费': 'electric',
        '水费': 'water',
        '燃气费': 'gas',
        '党费': 'party'
      }
      return typeMap[type] || 'other'
    },

    // 获取缴费图标
    getPaymentIcon(type) {
      const iconMap = {
        '手机充值': '📱',
        '电费': '⚡',
        '水费': '💧',
        '燃气费': '🔥',
        '党费': '☭'
      }
      return iconMap[type] || '💰'
    },

    // 获取缴费颜色
    getPaymentColor(type) {
      const colorMap = {
        '手机充值': '#81C784',
        '电费': '#FFB74D',
        '水费': '#64B5F6',
        '燃气费': '#FF8A65',
        '党费': '#FF5252'
      }
      return colorMap[type] || '#4DB6AC'
    },

    // 切换分组展开状态
    toggleGroup(groupId) {
      const index = this.expandedGroups.indexOf(groupId);
      if (index > -1) {
        this.expandedGroups.splice(index, 1);
      } else {
        this.expandedGroups.push(groupId);
      }
      console.log("切换分组:", groupId, "展开状态:", this.expandedGroups);
    },

    // 处理新增分组
    handleAddGroup() {
      console.log("新增分组");
      uni.showModal({
        title: "新增分组",
        content: "请输入分组名称",
        editable: true,
        placeholderText: "分组名称",
        success: (res) => {
          if (res.confirm && res.content) {
            this.createNewGroup(res.content);
          }
        },
      });
    },

    // 创建新分组
    createNewGroup(groupName) {
      const newGroup = {
        id: `group-${Date.now()}`,
        name: groupName,
        items: [],
      };

      this.groups.push(newGroup);
      this.expandedGroups.push(newGroup.id);

      uni.showToast({
        title: `分组"${groupName}"创建成功`,
        icon: "success",
      });

      console.log("创建新分组:", newGroup);
    },

    // 编辑分组
    editGroup(groupId) {
      console.log("编辑分组:", groupId);
      const group = this.groups.find((g) => g.id === groupId);
      if (!group) return;

      uni.showModal({
        title: "编辑分组",
        content: `当前分组名称：${group.name}`,
        editable: true,
        placeholderText: group.name,
        success: (res) => {
          if (res.confirm && res.content && res.content !== group.name) {
            group.name = res.content;
            uni.showToast({
              title: "分组名称已更新",
              icon: "success",
            });
          }
        },
      });
    },

    // 删除分组
    deleteGroup(groupId) {
      console.log("删除分组:", groupId);
      const group = this.groups.find((g) => g.id === groupId);
      if (!group) return;

      uni.showModal({
        title: "确认删除",
        content: `确定要删除分组"${group.name}"吗？\n删除后该分组下的所有缴费项目也会被删除。`,
        confirmText: "删除",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            // 从数组中移除分组
            const index = this.groups.findIndex((g) => g.id === groupId);
            if (index > -1) {
              this.groups.splice(index, 1);
            }

            // 从展开列表中移除
            const expandIndex = this.expandedGroups.indexOf(groupId);
            if (expandIndex > -1) {
              this.expandedGroups.splice(expandIndex, 1);
            }

            uni.showToast({
              title: "分组已删除",
              icon: "success",
            });
          }
        },
      });
    },

    // 编辑缴费项目
    editPaymentItem(item) {
      console.log("编辑缴费项目:", item);
      uni.showModal({
        title: `编辑${item.title}`,
        content: "请输入新的信息",
        editable: true,
        placeholderText: item.desc,
        success: (res) => {
          if (res.confirm && res.content && res.content !== item.desc) {
            item.desc = res.content;
            uni.showToast({
              title: "项目信息已更新",
              icon: "success",
            });
          }
        },
      });
    },

    // 删除缴费项目
    deletePaymentItem(item) {
      console.log("删除缴费项目:", item);

      uni.showModal({
        title: "确认删除",
        content: `确定要删除"${item.title}"吗？`,
        confirmText: "删除",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            // 找到包含该项目的分组
            const group = this.groups.find((g) =>
              g.items.some((groupItem) => groupItem.id === item.id)
            );

            if (group) {
              // 从分组中删除该项目
              const itemIndex = group.items.findIndex(
                (groupItem) => groupItem.id === item.id
              );
              if (itemIndex > -1) {
                group.items.splice(itemIndex, 1);
                uni.showToast({
                  title: `${item.title}已删除`,
                  icon: "success",
                });
              }
            }
          }
        },
      });
    },

    // 显示添加项目菜单
    showAddItemMenu() {
      this.showAddMenu = true;
      console.log("显示添加菜单");
    },

    // 隐藏添加项目菜单
    hideAddItemMenu() {
      this.showAddMenu = false;
      console.log("隐藏添加菜单");
    },

    // 添加缴费项目
    addPaymentItem(item) {
      console.log("添加缴费项目:", item);
      this.hideAddItemMenu();

      // 显示选择分组对话框
      this.showGroupSelector(item);
    },

    // 显示分组选择器
    showGroupSelector(item) {
      const groupNames = this.groups.map((g) => g.name);

      uni.showActionSheet({
        itemList: [...groupNames, "新建分组"],
        success: (res) => {
          if (res.tapIndex < groupNames.length) {
            // 选择了现有分组
            const selectedGroup = this.groups[res.tapIndex];
            this.addItemToGroup(selectedGroup, item);
          } else {
            // 选择了新建分组
            this.createGroupForItem(item);
          }
        },
      });
    },

    // 为新项目创建分组
    createGroupForItem(item) {
      uni.showModal({
        title: "新建分组",
        content: "请输入新分组的名称",
        editable: true,
        placeholderText: "分组名称",
        success: (res) => {
          if (res.confirm && res.content) {
            const newGroup = {
              id: `group-${Date.now()}`,
              name: res.content,
              items: [],
            };

            this.groups.push(newGroup);
            this.expandedGroups.push(newGroup.id);
            this.addItemToGroup(newGroup, item);
          }
        },
      });
    },

    // 将项目添加到分组
    addItemToGroup(group, item) {
      // 这里可以显示输入表单来配置项目详情
      uni.showModal({
        title: `添加${item.label}`,
        content: "请输入相关信息（如户号、手机号等）",
        editable: true,
        placeholderText: "请输入相关信息",
        success: (res) => {
          if (res.confirm) {
            const newItem = {
              id: `${item.type}-${Date.now()}`,
              type: item.type,
              title: item.label,
              desc: res.content || "待完善信息",
              icon: item.icon,
              bgColor: item.bgColor,
            };

            group.items.push(newItem);

            uni.showToast({
              title: `${item.label}已添加到${group.name}`,
              icon: "success",
            });
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.payment-management-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 新增分组 */
.add-group-section {
  padding: 60rpx 30rpx 30rpx;
}

.add-group-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  border: 2rpx dashed #ddd;
  transition: all 0.3s ease;
}

.add-group-card:active {
  transform: scale(0.98);
  border-color: #007aff;
  background: #f8f9ff;
}

.add-group-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
}

/* 分组列表 */
.groups-section {
  padding: 0 30rpx 120rpx;
}

.group-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background: #fafafa;
  border-bottom: 1rpx solid #eee;
  transition: all 0.3s ease;
}

.group-header:active {
  background: #f0f0f0;
}

.group-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.action-icon {
  font-size: 28rpx;
  padding: 8rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.edit-icon {
  background: #e3f2fd;
  color: #1976d2;
}

.delete-icon {
  background: #ffebee;
  color: #d32f2f;
}

.action-icon:active {
  transform: scale(0.9);
  opacity: 0.7;
}

/* 分组项目 */
.group-items {
  background: #fff;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.payment-item:last-child {
  border-bottom: none;
}

.payment-item:active {
  background: #f8f9fa;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.item-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.item-symbol {
  color: #fff;
  font-size: 32rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #666;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

/* 浮动按钮 */
.fab-container {
  position: fixed;
  bottom: 100rpx;
  right: 30rpx;
  z-index: 10;
}

.fab-button {
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.fab-button:active {
  transform: scale(0.9);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.6);
}

.fab-icon {
  font-size: 48rpx;
  color: #fff;
  font-weight: 300;
}

/* 添加菜单 */
.add-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.add-menu {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 80vh;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.menu-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.menu-close {
  font-size: 28rpx;
  color: #999;
  padding: 8rpx;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
  padding: 30rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.menu-item:active {
  transform: translateY(-4rpx);
}

.menu-item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.menu-icon-text {
  font-size: 32rpx;
  color: #fff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.menu-item-label {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 页面加载动画 */
.payment-management-page {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .menu-items {
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }

  .menu-item-icon {
    width: 72rpx;
    height: 72rpx;
  }

  .menu-icon-text {
    font-size: 28rpx;
  }
}
</style>

"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const ServiceModal = () => "../../components/common/ServiceModal.js";
const _sfc_main = {
  components: {
    ServiceModal
  },
  data() {
    return {
      userInfo: null,
      showServiceModal: false
    };
  },
  onShow() {
    try {
      if (!utils_auth.forceCheckLogin()) {
        console.log("个人中心：用户未登录，跳转到登录页面");
        common_vendor.index.reLaunch({
          url: "/pages/denglu/login",
          fail: (error) => {
            console.error("个人中心跳转失败:", error);
            common_vendor.index.navigateTo({ url: "/pages/denglu/login" });
          }
        });
        return;
      }
      this.checkLoginStatus();
    } catch (error) {
      console.error("个人中心onShow检查失败:", error);
      common_vendor.index.reLaunch({
        url: "/pages/denglu/login",
        fail: () => {
          common_vendor.index.navigateTo({ url: "/pages/denglu/login" });
        }
      });
    }
  },
  mounted() {
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = utils_auth.getUserInfo();
      if (userInfo) {
        this.userInfo = userInfo;
      } else {
        this.userInfo = null;
      }
    },
    // 跳转到登录页面
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/denglu/login"
      });
    },
    // 快捷功能
    goToTransfer() {
      common_vendor.index.showToast({
        title: "转账功能",
        icon: "none"
      });
    },
    goToPayment() {
      common_vendor.index.showToast({
        title: "缴费功能",
        icon: "none"
      });
    },
    goToInvestment() {
      common_vendor.index.showToast({
        title: "理财功能",
        icon: "none"
      });
    },
    goToCredit() {
      common_vendor.index.navigateTo({
        url: "/pages/credit-cards/credit-cards"
      });
    },
    // 菜单功能
    goToAccount() {
      common_vendor.index.showToast({
        title: "我的账户",
        icon: "none"
      });
    },
    goToCards() {
      common_vendor.index.navigateTo({
        url: "/pages/credit-cards/credit-cards"
      });
    },
    goToTransactions() {
      common_vendor.index.showToast({
        title: "交易记录",
        icon: "none"
      });
    },
    goToSecurity() {
      common_vendor.index.navigateTo({
        url: "/pages/user/security"
      });
    },
    goToContact() {
      this.showServiceModal = true;
    },
    // 关闭客服弹窗
    closeServiceModal() {
      this.showServiceModal = false;
    },
    // 查看退出记录
    viewLogoutHistory() {
      try {
        const logoutLogs = common_vendor.index.getStorageSync("logoutLogs") || [];
        if (logoutLogs.length === 0) {
          common_vendor.index.showToast({
            title: "暂无退出记录",
            icon: "none"
          });
          return;
        }
        const formattedLogs = logoutLogs.map((log) => {
          const date = new Date(log.timestamp);
          return `${date.toLocaleString()}
原因：${log.reason}
平台：${log.platform}`;
        }).join("\n\n");
        common_vendor.index.showModal({
          title: "退出记录",
          content: formattedLogs,
          showCancel: false,
          confirmText: "确定"
        });
      } catch (error) {
        console.error("查看退出记录失败:", error);
        common_vendor.index.showToast({
          title: "查看记录失败",
          icon: "none"
        });
      }
    },
    // 显示信用卡信息
    showCreditCards() {
      if (!this.userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      try {
        let users = common_vendor.index.getStorageSync("users") || [];
        if (users.length === 0) {
          "../../data/users.js".then((module) => {
            const importedUsers = module.users || module.getAllUsers();
            this.displayCreditCards(importedUsers);
          }).catch((error) => {
            console.error("导入用户数据失败:", error);
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          });
          return;
        }
        this.displayCreditCards(users);
      } catch (error) {
        console.error("获取信用卡信息失败:", error);
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "none"
        });
      }
    },
    // 显示信用卡信息的具体实现
    displayCreditCards(users) {
      const currentUser = users.find(
        (user) => user.id === this.userInfo.id || user.phone === this.userInfo.phone || user.username === this.userInfo.username
      );
      if (!currentUser || !currentUser.creditCards || currentUser.creditCards.length === 0) {
        common_vendor.index.showModal({
          title: "信用卡信息",
          content: "您暂无信用卡信息",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }
      const cardsInfo = currentUser.creditCards.map((card, index) => {
        const cardNumber = card.cardNumber.replace(/\s/g, "");
        const maskedNumber = cardNumber.substring(0, 4) + " **** **** " + cardNumber.substring(cardNumber.length - 4);
        return `信用卡 ${index + 1}：${card.cardType} ${card.cardBrand}
卡号：${maskedNumber}
额度：¥${card.creditLimit.toLocaleString()}
可用：¥${card.availableCredit.toLocaleString()}
欠款：¥${card.currentBalance.toLocaleString()}
最低还款：¥${card.minPayment.toLocaleString()}
账单日：每月${card.statementDate}日
还款日：${card.dueDate}
有效期：${card.expiryDate}
积分：${card.rewardsPoints}点`;
      }).join("\n\n");
      common_vendor.index.showModal({
        title: "我的信用卡",
        content: cardsInfo,
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#2e7d32"
      });
    },
    // 退出登录
    handleLogout() {
      common_vendor.index.showActionSheet({
        itemList: ["普通退出", "快速退出", "强制退出"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              utils_auth.logout({
                showConfirm: true,
                syncToServer: true,
                reason: "用户从个人中心退出"
              });
              break;
            case 1:
              utils_auth.quickLogout("用户快速退出");
              break;
            case 2:
              common_vendor.index.showModal({
                title: "强制退出确认",
                content: "强制退出将清除所有数据且不同步服务器，确定继续吗？",
                confirmText: "确定",
                cancelText: "取消",
                confirmColor: "#e74c3c",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    utils_auth.forceLogout("用户强制退出");
                  }
                }
              });
              break;
          }
        }
      });
    },
    goToProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/user/profile"
      });
    },
    goToHelp() {
      common_vendor.index.navigateTo({
        url: "/pages/help/help-center"
      });
    },
    // 查看头像
    viewAvatar() {
      if (!this.userInfo || !this.userInfo.avatar) {
        common_vendor.index.showToast({
          title: "暂无头像",
          icon: "none"
        });
        return;
      }
      common_vendor.index.previewImage({
        urls: [this.userInfo.avatar],
        current: this.userInfo.avatar,
        fail: (error) => {
          console.error("预览头像失败:", error);
          common_vendor.index.showToast({
            title: "预览失败",
            icon: "none"
          });
        }
      });
    }
  }
};
if (!Array) {
  const _component_ServiceModal = common_vendor.resolveComponent("ServiceModal");
  _component_ServiceModal();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? {
    b: $data.userInfo.avatar || "/static/default-avatar.png",
    c: common_vendor.o((...args) => $options.viewAvatar && $options.viewAvatar(...args)),
    d: common_vendor.t($data.userInfo.nickname || $data.userInfo.username)
  } : {
    e: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    f: $data.userInfo
  }, $data.userInfo ? {
    g: common_vendor.o((...args) => $options.goToTransfer && $options.goToTransfer(...args)),
    h: common_vendor.o((...args) => $options.goToPayment && $options.goToPayment(...args)),
    i: common_vendor.o((...args) => $options.goToInvestment && $options.goToInvestment(...args)),
    j: common_vendor.o((...args) => $options.goToCredit && $options.goToCredit(...args))
  } : {}, {
    k: $data.userInfo
  }, $data.userInfo ? {
    l: common_vendor.o((...args) => $options.goToAccount && $options.goToAccount(...args)),
    m: common_vendor.o((...args) => $options.goToCards && $options.goToCards(...args)),
    n: common_vendor.o((...args) => $options.goToTransactions && $options.goToTransactions(...args)),
    o: common_vendor.o((...args) => $options.goToProfile && $options.goToProfile(...args)),
    p: common_vendor.o((...args) => $options.goToSecurity && $options.goToSecurity(...args)),
    q: common_vendor.o((...args) => $options.goToHelp && $options.goToHelp(...args)),
    r: common_vendor.o((...args) => $options.goToContact && $options.goToContact(...args)),
    s: common_vendor.o((...args) => $options.viewLogoutHistory && $options.viewLogoutHistory(...args)),
    t: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}, {
    v: common_vendor.o($options.closeServiceModal),
    w: common_vendor.p({
      visible: $data.showServiceModal
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99b0ba47"]]);
wx.createPage(MiniProgramPage);

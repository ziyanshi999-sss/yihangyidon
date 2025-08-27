"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    goToProfile() {
      common_vendor.index.showToast({
        title: "个人资料",
        icon: "none"
      });
    },
    goToSettings() {
      common_vendor.index.showToast({
        title: "设置",
        icon: "none"
      });
    },
    goToHelp() {
      common_vendor.index.showToast({
        title: "帮助中心",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99b0ba47"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map

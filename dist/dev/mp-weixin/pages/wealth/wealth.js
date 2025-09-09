"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const ServiceModal = () => "../../components/common/ServiceModal.js";
const _sfc_main = {
  components: {
    ServiceModal
  },
  data() {
    return {
      hideAmount: false,
      activeTab: "deposit",
      showServiceModal: false,
      tabs: [
        { key: "deposit", name: "存款" },
        { key: "product", name: "理财产品" },
        { key: "insurance", name: "保险" },
        { key: "forex", name: "外汇" }
      ],
      // 顶部轮播图片（本地）
      swiperImages: [
        "/static/wealth/swip1.jpg",
        "/static/wealth/swip2.jpg",
        "/static/wealth/swip3.jpg"
      ],
      // 客服
      serviceHotline: "95599",
      serviceHours: "7×24小时在线",
      totalAssets: "125,438.52",
      yesterdayProfit: "+35.78",
      depositSummary: {
        current: "23,560.20",
        fixed: "80,000.00",
        smart: "8,520.32"
      },
      depositProducts: [
        { id: "d1", name: "整存整取", term: "3个月", minAmount: 1e3, rate: 1.85 },
        { id: "d2", name: "整存整取", term: "1年", minAmount: 1e3, rate: 2.1 },
        { id: "d3", name: "大额存单", term: "3年", minAmount: 2e5, rate: 2.95 }
      ],
      wealthProducts: [
        { id: "w1", name: "稳健优选第68期", risk: "低", term: "90天", minAmount: 1e4, yield: 3.2 },
        { id: "w2", name: "灵活理财T+1", risk: "低", term: "开放式", minAmount: 1e3, yield: 2.65 },
        { id: "w3", name: "进取增强半年期", risk: "中", term: "180天", minAmount: 1e4, yield: 4.1 }
      ],
      insuranceList: [
        { id: "i1", name: "安心医疗险", type: "health", typeText: "医疗险", desc: "百万保额·报销广", premium: 268 },
        { id: "i2", name: "家庭意外险", type: "accident", typeText: "意外险", desc: "全家保障·一年期", premium: 199 },
        { id: "i3", name: "重疾守护", type: "critical", typeText: "重疾险", desc: "重大疾病全面保障", premium: 860 }
      ],
      forexList: [
        { code: "USD/CNY", price: "7.2375", change: 0.12 },
        { code: "EUR/CNY", price: "7.8801", change: -0.08 },
        { code: "JPY/CNY", price: "0.0468", change: 0.02 }
      ],
      // 热点资讯（示例静态数据，可后续接入后端/抓取）
      newsList: [
        {
          id: "n1",
          title: "银行App上线智能投顾：个性化组合更省心",
          source: "银行官方",
          time: "今天 10:20",
          tag: "产品上新",
          tagClass: "tag-new",
          cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "n2",
          title: "人民币存款利率微调，稳中趋优助力财富增值",
          source: "金融时报",
          time: "今天 09:05",
          tag: "利率",
          tagClass: "tag-rate",
          cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "n3",
          title: "净值型理财规模增长，风险匹配与长期主义成共识",
          source: "理财早报",
          time: "昨天 18:42",
          tag: "理财",
          tagClass: "tag-wealth",
          cover: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?q=80&w=1200&auto=format&fit=crop"
        },
        {
          id: "n4",
          title: "外汇市场波动加大，分散配置与风险对冲受关注",
          source: "外汇观察",
          time: "昨天 14:10",
          tag: "外汇",
          tagClass: "tag-fx",
          cover: "https://img0.baidu.com/it/u=4159114734,4003708834&fm=253&fmt=auto&app=138&f=JPEG?w=739&h=500"
        }
      ]
    };
  },
  methods: {
    onSwiperClick(idx) {
      common_vendor.index.showToast({ title: `轮播图第${idx + 1}张`, icon: "none" });
    },
    onOnlineService() {
      this.showServiceModal = true;
    },
    // 关闭客服弹窗
    closeServiceModal() {
      this.showServiceModal = false;
    },
    onCallHotline() {
      common_vendor.index.makePhoneCall({ phoneNumber: this.serviceHotline });
    },
    onRecharge() {
      common_vendor.index.showToast({ title: "充值功能开发中", icon: "none" });
    },
    onWithdraw() {
      common_vendor.index.showToast({ title: "提现功能开发中", icon: "none" });
    },
    onViewAll(type) {
      common_vendor.index.showToast({ title: `查看全部(${type})`, icon: "none" });
    },
    onDepositDetail(item) {
      common_vendor.index.showToast({ title: `${item.name} · ${item.term}`, icon: "none" });
    },
    onDepositBuy(item) {
      common_vendor.index.showToast({ title: `存入：${item.name}`, icon: "none" });
    },
    onProductDetail(p) {
      common_vendor.index.showToast({ title: `${p.name}`, icon: "none" });
    },
    onProductBuy(p) {
      common_vendor.index.showToast({ title: `申购：${p.name}`, icon: "none" });
    },
    onInsuranceDetail(ins) {
      common_vendor.index.showToast({ title: `${ins.name}`, icon: "none" });
    },
    onInsuranceBuy(ins) {
      common_vendor.index.showToast({ title: `投保：${ins.name}`, icon: "none" });
    },
    onForexTrade(fx) {
      common_vendor.index.showToast({ title: `外汇交易：${fx.code}`, icon: "none" });
    },
    onOpenTool(tool) {
      const map = { calc: "收益计算器", calendar: "产品日历", risk: "风险评测" };
      common_vendor.index.showToast({ title: `${map[tool]}(开发中)`, icon: "none" });
    },
    onNewsClick(n) {
      common_vendor.index.showToast({ title: n.title, icon: "none" });
    }
  }
};
if (!Array) {
  const _component_ServiceModal = common_vendor.resolveComponent("ServiceModal");
  _component_ServiceModal();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.swiperImages, (img, idx, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.onSwiperClick(idx), idx),
        c: idx
      };
    }),
    b: common_assets._imports_0,
    c: common_vendor.t($data.serviceHours),
    d: common_vendor.o((...args) => $options.onOnlineService && $options.onOnlineService(...args)),
    e: common_vendor.t($data.serviceHotline),
    f: common_vendor.o((...args) => $options.onCallHotline && $options.onCallHotline(...args)),
    g: common_vendor.o((...args) => $options.onOnlineService && $options.onOnlineService(...args)),
    h: common_vendor.o(($event) => $data.activeTab = "deposit"),
    i: common_vendor.o(($event) => $data.activeTab = "product"),
    j: common_vendor.o(($event) => $data.activeTab = "insurance"),
    k: common_vendor.o(($event) => $data.activeTab = "forex"),
    l: common_vendor.f($data.tabs, (t, k0, i0) => {
      return {
        a: common_vendor.t(t.name),
        b: t.key,
        c: $data.activeTab === t.key ? 1 : "",
        d: common_vendor.o(($event) => $data.activeTab = t.key, t.key)
      };
    }),
    m: $data.activeTab === "deposit"
  }, $data.activeTab === "deposit" ? {
    n: common_vendor.o(($event) => $options.onViewAll("deposit")),
    o: common_vendor.t($data.hideAmount ? "****" : $data.depositSummary.current),
    p: common_vendor.t($data.hideAmount ? "****" : $data.depositSummary.fixed),
    q: common_vendor.t($data.hideAmount ? "****" : $data.depositSummary.smart),
    r: common_vendor.f($data.depositProducts, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.term),
        c: common_vendor.t(item.minAmount),
        d: common_vendor.t(item.rate),
        e: common_vendor.o(($event) => $options.onDepositBuy(item), item.id),
        f: item.id,
        g: common_vendor.o(($event) => $options.onDepositDetail(item), item.id)
      };
    })
  } : {}, {
    s: $data.activeTab === "product"
  }, $data.activeTab === "product" ? {
    t: common_vendor.f($data.wealthProducts, (p, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(p.name),
        b: p.risk === "中"
      }, p.risk === "中" ? {} : {}, {
        c: p.risk === "低"
      }, p.risk === "低" ? {} : {}, {
        d: common_vendor.t(p.term),
        e: common_vendor.t(p.minAmount),
        f: common_vendor.t(p.yield),
        g: common_vendor.o(($event) => $options.onProductBuy(p), p.id),
        h: p.id,
        i: common_vendor.o(($event) => $options.onProductDetail(p), p.id)
      });
    })
  } : {}, {
    v: $data.activeTab === "insurance"
  }, $data.activeTab === "insurance" ? {
    w: common_vendor.f($data.insuranceList, (ins, k0, i0) => {
      return {
        a: common_vendor.t(ins.name),
        b: common_vendor.t(ins.typeText),
        c: common_vendor.n(ins.type),
        d: common_vendor.t(ins.desc),
        e: common_vendor.t(ins.premium),
        f: common_vendor.o(($event) => $options.onInsuranceBuy(ins), ins.id),
        g: ins.id,
        h: common_vendor.o(($event) => $options.onInsuranceDetail(ins), ins.id)
      };
    })
  } : {}, {
    x: $data.activeTab === "forex"
  }, $data.activeTab === "forex" ? {
    y: common_vendor.f($data.forexList, (fx, k0, i0) => {
      return {
        a: common_vendor.t(fx.code),
        b: common_vendor.t(fx.price),
        c: common_vendor.t(fx.change > 0 ? "+" + fx.change : fx.change),
        d: fx.change > 0 ? 1 : "",
        e: fx.change < 0 ? 1 : "",
        f: common_vendor.o(($event) => $options.onForexTrade(fx), fx.code),
        g: fx.code
      };
    }),
    z: common_vendor.o(($event) => $options.onOpenTool("calc")),
    A: common_vendor.o(($event) => $options.onOpenTool("calendar")),
    B: common_vendor.o(($event) => $options.onOpenTool("risk"))
  } : {}, {
    C: common_vendor.f($data.newsList, (n, k0, i0) => {
      return {
        a: n.cover,
        b: common_vendor.t(n.title),
        c: common_vendor.t(n.tag),
        d: common_vendor.n(n.tagClass),
        e: common_vendor.t(n.source),
        f: common_vendor.t(n.time),
        g: n.id,
        h: common_vendor.o(($event) => $options.onNewsClick(n), n.id)
      };
    }),
    D: common_vendor.o($options.closeServiceModal),
    E: common_vendor.p({
      visible: $data.showServiceModal
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a00d3a3e"]]);
wx.createPage(MiniProgramPage);

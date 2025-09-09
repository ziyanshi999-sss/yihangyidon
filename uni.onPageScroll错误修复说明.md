# uni.onPageScroll 错误修复说明

## 错误描述

在 `src/pages/city-select/city-select.vue` 文件中出现了 `TypeError: uni.onPageScroll is not a function` 错误：

```
TypeError: uni.onPageScroll is not a function
at Proxy.onReady (city-select.vue:1177:9)
```

## 错误分析

### 问题原因
`uni.onPageScroll` 不是一个有效的uni-app API。在uni-app中，页面滚动监听应该使用 `onPageScroll` 生命周期函数，而不是 `uni.onPageScroll()` 方法调用。

### 错误代码
```javascript
// 错误的代码
onReady() {
  // 监听页面滚动
  uni.onPageScroll((scrollInfo) => {
    this.handlePageScroll(scrollInfo);
  });
}
```

## 修复方案

### 修复步骤

1. **移除错误的API调用**
   - 从 `onReady()` 生命周期中移除 `uni.onPageScroll()` 调用

2. **添加正确的生命周期函数**
   - 添加 `onPageScroll(scrollInfo)` 生命周期函数

### 修复后的代码

```javascript
// 修复后的 onReady 生命周期
onReady() {
  // 监听城市选择事件
  uni.$on("citySelected", (city) => {
    console.log("接收到城市选择:", city);
  });

  // 动态调整侧边栏位置，确保不遮挡热门城市
  this.adjustSidebarPosition();

  // 其他初始化代码...
},

// 新增的页面滚动生命周期函数
onPageScroll(scrollInfo) {
  // 处理页面滚动事件
  this.handlePageScroll(scrollInfo);
}
```

## uni-app 页面滚动监听正确方式

### 1. 使用生命周期函数（推荐）
```javascript
export default {
  onPageScroll(scrollInfo) {
    console.log('页面滚动:', scrollInfo.scrollTop);
    // 处理滚动逻辑
  }
}
```

### 2. 在页面配置中启用
```json
// pages.json
{
  "path": "pages/example/example",
  "style": {
    "enablePullDownRefresh": true,
    "onReachBottomDistance": 50
  }
}
```

### 3. 注意事项
- `onPageScroll` 只在页面级别有效，不能在组件中使用
- 滚动信息包含 `scrollTop` 属性
- 频繁的滚动事件可能影响性能，需要节流处理

## 修复结果

### 修复前
- ❌ `TypeError: uni.onPageScroll is not a function`
- ❌ 城市选择页面无法正常加载
- ❌ 应用出现错误提示

### 修复后
- ✅ 错误已消除
- ✅ 页面滚动监听正常工作
- ✅ 城市选择页面功能正常

## 相关文件

- **修复文件**: `src/pages/city-select/city-select.vue`
- **影响范围**: 城市选择页面的滚动功能
- **依赖方法**: `handlePageScroll()` 方法

## 预防措施

### 1. API使用规范
- 查阅uni-app官方文档确认API的正确用法
- 区分生命周期函数和API方法调用
- 使用TypeScript可以获得更好的类型提示

### 2. 开发工具
- 使用uni-app官方开发工具
- 启用ESLint检查
- 定期更新uni-app版本

### 3. 测试验证
- 在真机上测试页面滚动功能
- 检查控制台错误信息
- 验证滚动监听是否正常工作

## 总结

通过将错误的 `uni.onPageScroll()` API调用改为正确的 `onPageScroll` 生命周期函数，成功解决了城市选择页面的滚动监听问题。现在页面可以正常加载和运行，不再出现TypeError错误！🎉


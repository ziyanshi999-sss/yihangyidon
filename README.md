# 中国农业银行APP

一个基于uni-app开发的跨平台农业银行APP，提供全面的金融服务功能。

## 📱 项目介绍

本项目是中国农业银行官方APP的技术实现，采用现代化的前端技术栈，支持多平台部署，为用户提供安全、便捷的金融服务体验。

## 🏗️ 技术栈

### 核心框架
- **uni-app 3.x**: 跨平台开发框架
- **Vue 3.4.21**: 前端MVVM框架，使用Composition API
- **Vite 5.2.8**: 现代化构建工具

### 开发工具链
- **ESLint + Prettier**: 代码规范和格式化
- **Husky**: Git钩子管理
- **Vue I18n**: 国际化支持
- **TypeScript**: 类型支持

### 平台支持
- 🌐 H5网页版
- 📱 微信小程序
- 📱 支付宝小程序
- 📱 Android原生APP
- 📱 iOS原生APP
- 📱 鸿蒙系统

## 📁 项目结构

```
项目/
├── src/                          # 源代码目录
│   ├── api/                      # API接口层
│   │   ├── auth.js              # 认证相关API
│   │   ├── user.js              # 用户相关API
│   │   ├── wealth.js            # 财富管理API
│   │   └── transfer.js          # 转账汇款API
│   ├── components/              # 公共组件
│   │   └── common/             # 通用组件
│   │       ├── LoadingSpinner.vue  # 加载动画组件
│   │       └── BankCard.vue     # 银行卡组件
│   ├── pages/                   # 页面目录
│   │   ├── index/              # 首页
│   │   ├── wealth/             # 财富管理
│   │   ├── life/               # 生活服务
│   │   └── user/               # 个人中心
│   ├── stores/                  # 状态管理
│   │   ├── user.js             # 用户状态
│   │   └── app.js              # 应用状态
│   ├── utils/                   # 工具函数
│   │   ├── request.js          # 网络请求
│   │   ├── storage.js          # 本地存储
│   │   └── common.js           # 通用工具
│   ├── static/                  # 静态资源
│   ├── login/                   # 登录模块
│   ├── App.vue                  # 应用主组件
│   ├── main.js                  # 应用入口
│   ├── pages.json              # 页面路由配置
│   └── manifest.json           # 应用配置
├── package.json                 # 依赖配置
└── vite.config.js              # 构建配置
```

## 🚀 功能特性

### 核心功能
- 🔐 **安全登录**: 支持密码登录、短信验证码登录、生物识别
- 💰 **账户管理**: 账户余额查询、交易记录、银行卡管理
- 💸 **转账汇款**: 本行转账、跨行转账、手机号转账、二维码收款
- 💎 **财富管理**: 理财产品、基金投资、投资组合分析
- 🏪 **生活服务**: 生活缴费、网点查询、客服咨询

### 技术特性
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎨 **现代UI**: 遵循Material Design设计规范
- 🔒 **安全防护**: 接口加密、防篡改、防重放攻击
- 📊 **性能优化**: 代码分割、懒加载、缓存策略
- 🌍 **国际化**: 支持多语言切换

## 🛠️ 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- HBuilderX (推荐) 或 其他支持uni-app的IDE

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# Android开发
npm run dev:app-android

# iOS开发
npm run dev:app-ios
```

### 项目构建
```bash
# H5构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# APP构建
npm run build:app
```

### 代码规范
```bash
# 代码检查
npm run lint:check

# 代码修复
npm run lint

# 代码格式化
npm run format
```

## 🔧 配置说明

### API配置
在 `src/utils/request.js` 中修改API基础地址：
```javascript
const BASE_URL = 'https://api.abchina.com'
```

### 第三方服务配置
在 `src/manifest.json` 中配置相关SDK：
- 支付宝支付
- 微信支付
- 高德地图
- 百度地图
- 极光推送

### 环境变量
创建 `.env` 文件配置环境变量：
```
# API地址
VITE_API_BASE_URL=https://api.abchina.com

# 应用版本
VITE_APP_VERSION=1.0.0

# 调试模式
VITE_DEBUG=false
```

## 📋 API接口

### 认证接口
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 退出登录
- `POST /auth/refresh` - 刷新token

### 用户接口
- `GET /user/info` - 获取用户信息
- `GET /user/bank-cards` - 获取银行卡列表
- `GET /user/transactions` - 获取交易记录

### 财富接口
- `GET /wealth/products` - 获取理财产品
- `POST /wealth/purchase` - 购买理财产品
- `GET /wealth/my-products` - 我的理财

### 转账接口
- `POST /transfer/send` - 发起转账
- `GET /transfer/history` - 转账记录
- `POST /transfer/validate-payee` - 验证收款人

## 🔒 安全规范

### 数据加密
- 敏感数据传输采用HTTPS + AES加密
- 本地存储敏感信息使用加密存储
- API接口签名验证防篡改

### 身份认证
- JWT token机制
- 生物识别认证
- 设备指纹识别

### 风险控制
- 登录失败次数限制
- 异常登录地点检测
- 大额交易二次验证

## 📚 开发规范

### 代码规范
- 使用ESLint + Prettier统一代码风格
- 组件命名采用PascalCase
- 文件名采用kebab-case
- 变量命名采用camelCase

### Git规范
- 使用Conventional Commits规范
- feat: 新功能
- fix: Bug修复
- docs: 文档更新
- style: 代码格式化
- refactor: 代码重构

### 注释规范
- 组件必须添加说明注释
- 复杂逻辑必须添加行内注释
- API接口必须添加JSDoc注释

## 🐛 调试指南

### 开发调试
- 使用Chrome DevTools调试H5版本
- 使用微信开发者工具调试小程序
- 使用HBuilderX真机调试APP

### 日志系统
- 使用console.log进行开发调试
- 生产环境集成日志上报系统
- 错误日志自动收集和分析

## 📱 兼容性

### 浏览器支持
- Chrome >= 88
- Safari >= 14
- Firefox >= 78
- Edge >= 88

### 移动端支持
- iOS >= 12.0
- Android >= 8.0
- 微信小程序基础库 >= 2.20.0

## 🤝 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 官网：https://www.abchina.com
- 客服电话：95599
- 技术支持：tech@abchina.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**注意**: 这是一个演示项目，仅用于学习和技术交流，不得用于商业用途。
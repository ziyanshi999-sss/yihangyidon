# 医院问诊系统

一个基于 uni-app 开发的现代化医疗问诊 H5 应用，提供在线问诊、预约挂号、健康管理等服务。

## 🚀 功能特性

- **用户认证**: 完整的登录注册系统，支持手机号、微信等多种登录方式
- **在线问诊**: 实时医生咨询，支持文字、语音、图片等多种沟通方式
- **预约挂号**: 便捷的医院科室预约和挂号服务
- **健康管理**: 个人健康档案、体检报告、用药提醒等功能
- **医疗资讯**: 专业的健康科普文章和医疗知识
- **药品配送**: 在线购药和配送服务

## 📱 技术栈

- **框架**: uni-app 3.x + Vue 3.x
- **构建工具**: Vite 5.x
- **样式**: SCSS + CSS3
- **代码规范**: ESLint + Prettier
- **状态管理**: Vue 3 Composition API
- **网络请求**: uni.request 封装

## 🛠️ 开发环境

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- HBuilderX (推荐) 或 VS Code

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 开发命令

```bash
# 开发模式 (H5)
npm run dev:h5

# 开发模式 (微信小程序)
npm run dev:mp-weixin

# 开发模式 (APP)
npm run dev:app

# 构建生产版本 (H5)
npm run build:h5

# 构建生产版本 (微信小程序)
npm run build:mp-weixin

# 构建生产版本 (APP)
npm run build:app
```

## 📁 项目结构

```
uniapp/
├── src/                          # 源代码目录
│   ├── App.vue                   # 应用入口组件
│   ├── main.js                   # 应用入口文件
│   ├── manifest.json             # 应用配置文件
│   ├── pages.json                # 页面路由配置
│   ├── uni.scss                  # 全局样式文件
│   ├── login/                    # 登录模块
│   │   └── login.vue            # 登录页面
│   ├── pages/                    # 页面目录
│   │   ├── index/               # 首页模块
│   │   │   └── index.vue        # 首页
│   │   ├── doctor/              # 医生模块
│   │   │   └── doctor.vue       # 医生列表页
│   │   ├── encyclopedia/        # 百科模块
│   │   │   └── encyclopedia.vue # 医疗百科页
│   │   └── user/                # 用户模块
│   │       └── user.vue         # 个人中心页
│   └── static/                   # 静态资源
│       ├── logo.png             # 应用Logo
│       └── tabbar/              # 底部导航图标
├── .eslintrc.js                  # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── package.json                  # 项目依赖配置
├── vite.config.js               # Vite 构建配置
└── README.md                     # 项目说明文档
```

## 🎨 设计规范

### 色彩系统

- **主色调**: `#667eea` (渐变到 `#764ba2`)
- **成功色**: `#27ae60`
- **警告色**: `#f39c12`
- **错误色**: `#e74c3c`
- **文本色**: `#333333` (主要), `#666666` (次要), `#999999` (辅助)

### 字体规范

- **主字体**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei'
- **字号**: 12px (小), 14px (基础), 16px (大), 18px (标题), 20px (大标题), 24px (特大标题)

### 间距规范

- **基础间距**: 8px, 16px, 24px, 32px
- **组件间距**: 12px, 20px, 28px, 36px
- **页面边距**: 16px (移动端), 20px (桌面端)

## 🔧 开发规范

### 代码规范

1. **命名规范**
   - 组件名使用 PascalCase
   - 文件名使用 kebab-case
   - 变量和函数使用 camelCase
   - 常量使用 UPPER_SNAKE_CASE

2. **文件组织**
   - 每个页面一个目录
   - 组件按功能模块组织
   - 工具函数统一放在 utils 目录

3. **注释规范**
   - 函数必须有 JSDoc 注释
   - 复杂逻辑需要行内注释
   - 组件需要有功能说明

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📱 页面说明

### 登录页面 (`/login/login`)
- 支持手机号密码登录
- 微信登录集成
- 短信验证码登录
- 记住密码功能
- 忘记密码和注册入口

### 首页 (`/pages/index/index`)
- 搜索功能
- 轮播图展示
- 快速服务入口
- 推荐医生列表
- 健康资讯展示

### 医生页面 (`/pages/doctor/doctor`)
- 医生列表展示
- 科室分类筛选
- 医生详情查看
- 在线咨询入口

### 百科页面 (`/pages/encyclopedia/encyclopedia`)
- 医疗知识分类
- 文章列表展示
- 搜索和筛选功能
- 收藏和分享功能

### 个人中心 (`/pages/user/user`)
- 用户信息展示
- 订单管理
- 健康档案
- 设置和帮助

## 🔌 API 接口

### 基础配置

```javascript
// 开发环境
baseURL: 'http://localhost:3000/api'

// 生产环境
baseURL: 'https://api.hospital.com'
```

### 主要接口

- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `GET /doctors` - 获取医生列表
- `GET /doctors/:id` - 获取医生详情
- `POST /consultations` - 创建咨询
- `GET /appointments` - 获取预约列表
- `POST /appointments` - 创建预约

## 🚀 部署说明

### H5 部署

1. 构建项目
```bash
npm run build:h5
```

2. 将 `dist/build/h5` 目录下的文件部署到 Web 服务器

### 小程序部署

1. 构建项目
```bash
npm run build:mp-weixin
```

2. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
3. 上传代码到微信小程序后台

### APP 部署

1. 构建项目
```bash
npm run build:app
```

2. 使用 HBuilderX 打开项目
3. 云打包或本地打包生成 APK/IPA 文件

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: [您的姓名]
- 邮箱: [您的邮箱]
- 项目地址: [项目GitHub地址]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

**注意**: 这是一个演示项目，实际使用时需要根据具体需求进行调整和完善。 
# 银行APP单点登录(SSO)集成指南

## 📋 概述

本文档介绍如何在银行APP项目中集成和使用单点登录(SSO)功能。该SSO系统支持多种认证方式，提供完整的权限管理和跨应用通信能力。

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   银行APP       │    │   认证中心      │    │   其他应用      │
│                 │    │  (Auth Server)  │    │                 │
│  ┌───────────┐  │    │                 │    │  ┌───────────┐  │
│  │SSO Client │◄─┼────┤   JWT Service   │────┼─►│SSO Client │  │
│  └───────────┘  │    │   Permission    │    │  └───────────┘  │
│  ┌───────────┐  │    │   Management    │    │  ┌───────────┐  │
│  │Auth Guard │  │    │                 │    │  │Auth Guard │  │
│  └───────────┘  │    └─────────────────┘    │  └───────────┘  │
└─────────────────┘                           └─────────────────┘
```

## 📁 文件结构

```
src/
├── utils/
│   ├── sso-client.js          # SSO客户端核心库
│   └── sso-guard.js           # 路由守卫和权限检查
├── mixins/
│   └── sso-mixin.js           # SSO混入，提供认证状态管理
├── components/
│   └── common/
│       └── SSOLogin.vue       # 增强的登录组件
└── pages/
    └── sso-demo/
        └── sso-demo.vue       # SSO功能演示页面
```

## 🚀 快速开始

### 1. 基本集成

在页面中使用SSO混入：

```javascript
// pages/example/example.vue
import ssoMixin from '@/mixins/sso-mixin.js'

export default {
  mixins: [ssoMixin],
  
  async onLoad() {
    // 检查认证状态
    if (!this.isAuthenticated) {
      // 未认证时的处理逻辑
      this.handleUnauthenticated()
      return
    }
    
    // 已认证，继续页面逻辑
    await this.loadPageData()
  },
  
  methods: {
    async loadPageData() {
      // 使用认证请求获取数据
      const response = await this.makeAuthenticatedRequest('/api/data')
      // 处理响应...
    },
    
    handleUnauthenticated() {
      uni.reLaunch({
        url: '/pages/denglu/login'
      })
    }
  }
}
```

### 2. 权限检查

```javascript
// 检查单个权限
const hasPermission = await this.checkPermission('admin')

// 检查多个权限（需要全部具备）
const hasAllPermissions = await this.checkAllPermissions(['user.edit', 'user.delete'])

// 检查多个权限（具备任一即可）
const hasAnyPermission = await this.checkAnyPermission(['user.view', 'user.edit'])

// 权限守卫（无权限时自动提示）
const canProceed = await this.requirePermission('admin', {
  message: '需要管理员权限才能访问此功能'
})
```

### 3. 登录登出

```javascript
// 执行登录
const result = await this.performLogin({
  type: 'password',
  username: 'user@example.com',
  password: 'password123'
})

if (result.success) {
  // 登录成功
  console.log('用户信息:', result.user)
} else {
  // 登录失败
  console.error('登录失败:', result.error)
}

// 执行登出
await this.performLogout(true) // true表示显示确认对话框
```

## 🔧 高级功能

### 1. 路由守卫

SSO系统提供自动路由守卫，无需手动配置：

```javascript
// 系统会自动拦截未认证用户访问受保护页面
// 并重定向到登录页面

// 如需手动检查当前页面权限
import ssoGuard from '@/utils/sso-guard.js'

const hasAccess = await ssoGuard.checkCurrentPagePermission()
if (!hasAccess) {
  // 处理无权限访问
}
```

### 2. 跨应用通信

```javascript
// 发送消息到其他应用
this.ssoClient.notifyOtherApps('user_action', {
  action: 'profile_updated',
  userId: this.getUserId(),
  timestamp: Date.now()
})

// 监听其他应用消息（在ssoMixin中自动处理）
// 可通过重写回调方法来自定义处理逻辑
handleLoginSuccess(user) {
  console.log('其他应用登录:', user)
  // 自定义处理逻辑
}
```

### 3. Token管理

```javascript
// 手动刷新Token
const refreshed = await this.ssoClient.refreshToken()

// 检查Token是否即将过期
const token = this.ssoClient.getToken()
const nearExpiration = this.ssoClient.isTokenNearExpiration(token)

// 清除认证数据
this.ssoClient.clearAuthData()
```

## 🔐 权限系统

### 权限定义

系统支持以下权限类型：

```javascript
const permissions = {
  // 管理员权限
  'admin': '系统管理员',
  'developer': '开发人员',
  
  // 用户管理
  'user.view': '查看用户信息',
  'user.edit': '编辑用户信息',
  'user.security': '安全设置',
  
  // 业务权限
  'loan.apply': '贷款申请',
  'loan.approve': '贷款审批',
  'wealth.premium': '高端理财',
  'transfer.send': '转账权限',
  'payment.make': '支付权限'
}
```

### 页面权限配置

在`sso-guard.js`中配置页面权限：

```javascript
const pagePermissions = {
  '/pages/user/security': ['user.security'],
  '/pages/loan/loan-application': ['loan.apply'],
  '/pages/wealth/ai-wealth-manager': ['wealth.premium'],
  '/pages/admin/*': ['admin']
}
```

## 🎨 UI组件

### SSOLogin组件

提供完整的登录界面，支持多种登录方式：

```vue
<template>
  <SSOLogin />
</template>

<script>
import SSOLogin from '@/components/common/SSOLogin.vue'

export default {
  components: {
    SSOLogin
  }
}
</script>
```

### 权限指令

```vue
<template>
  <!-- 只有管理员才能看到这个按钮 -->
  <button v-permission="'admin'">管理员功能</button>
  
  <!-- 多权限检查 -->
  <view v-permission="['user.edit', 'user.delete']">
    编辑用户界面
  </view>
</template>

<script>
import { permissionDirective } from '@/utils/sso-guard.js'

export default {
  directives: {
    permission: permissionDirective
  }
}
</script>
```

## 📱 平台适配

### H5浏览器

- 支持localStorage存储
- 跨标签页通信
- HTTPS要求

### APP应用

- 支持原生存储
- 生物识别认证
- 推送通知

### 小程序

- 支持微信授权登录
- 存储限制处理
- 权限申请流程

## 🔧 配置选项

### SSO客户端配置

```javascript
const ssoClient = new BankSSOClient({
  authServerUrl: 'https://auth.bank.com',
  appId: 'bank-mobile-app',
  config: {
    tokenExpireBuffer: 5 * 60 * 1000,  // Token过期缓冲时间
    maxRetryCount: 3,                   // 最大重试次数
    retryDelay: 1000                    // 重试延迟
  },
  onTokenExpired: () => {
    // Token过期回调
  },
  onLoginSuccess: (user) => {
    // 登录成功回调
  },
  onLogout: () => {
    // 登出回调
  }
})
```

## 🚨 错误处理

### 常见错误类型

```javascript
// 认证错误
{
  code: 'AUTH_FAILED',
  message: '认证失败',
  reason: 'invalid_credentials'
}

// 权限错误
{
  code: 'PERMISSION_DENIED',
  message: '权限不足',
  required: ['admin']
}

// 网络错误
{
  code: 'NETWORK_ERROR',
  message: '网络连接失败',
  retry: true
}

// Token过期
{
  code: 'TOKEN_EXPIRED',
  message: 'Token已过期',
  action: 'refresh_required'
}
```

### 错误处理最佳实践

```javascript
try {
  const response = await this.makeAuthenticatedRequest('/api/data')
  // 处理成功响应
} catch (error) {
  switch (error.code) {
    case 'AUTH_FAILED':
      // 重定向到登录页
      this.redirectToLogin()
      break
    case 'PERMISSION_DENIED':
      // 显示权限不足提示
      this.showPermissionError(error.required)
      break
    case 'NETWORK_ERROR':
      // 显示网络错误，提供重试选项
      this.showNetworkError(error.retry)
      break
    default:
      // 通用错误处理
      this.showGenericError(error.message)
  }
}
```

## 📊 监控和日志

### 认证事件监控

```javascript
// 登录成功
logger.info('User login successful', {
  userId: user.id,
  loginMethod: 'password',
  ip: clientIP,
  userAgent: request.headers['user-agent']
})

// 权限检查
logger.info('Permission check', {
  userId: user.id,
  permission: 'admin',
  result: 'granted',
  resource: '/api/admin/users'
})

// Token刷新
logger.info('Token refresh', {
  userId: user.id,
  oldTokenExp: oldToken.exp,
  newTokenExp: newToken.exp
})
```

## 🔒 安全最佳实践

### 1. Token安全

- 使用HTTPS传输所有认证相关请求
- 设置合理的Token过期时间（推荐24小时）
- 实施Token刷新机制
- 使用强密钥签名JWT

### 2. 存储安全

- 敏感信息加密存储
- 定期清理过期数据
- 避免在日志中记录敏感信息

### 3. 权限控制

- 实施最小权限原则
- 定期审查用户权限
- 记录所有权限变更

### 4. 会话管理

- 实施会话超时机制
- 支持强制登出功能
- 监控异常登录行为

## 🧪 测试

### 单元测试

```javascript
// 测试SSO客户端
describe('BankSSOClient', () => {
  it('should login successfully with valid credentials', async () => {
    const result = await ssoClient.login({
      username: 'test@example.com',
      password: 'password123'
    })
    
    expect(result.success).toBe(true)
    expect(result.user).toBeDefined()
  })
  
  it('should handle token refresh', async () => {
    const refreshed = await ssoClient.refreshToken()
    expect(refreshed).toBe(true)
  })
})
```

### 集成测试

```javascript
// 测试页面权限
describe('Page Permission', () => {
  it('should redirect to login for unauthenticated users', async () => {
    const result = await ssoGuard.beforeNavigation({
      url: '/pages/admin/users'
    })
    
    expect(result.allowed).toBe(false)
  })
})
```

## 📈 性能优化

### 1. Token缓存

- 内存中缓存解析后的Token信息
- 避免重复解析JWT

### 2. 权限缓存

- 缓存用户权限信息
- 设置合理的缓存过期时间

### 3. 网络优化

- 使用请求去重机制
- 实施智能重试策略

## 🔄 部署和维护

### 环境配置

```javascript
// 开发环境
const config = {
  authServerUrl: 'http://localhost:3001',
  debug: true,
  logLevel: 'debug'
}

// 生产环境
const config = {
  authServerUrl: 'https://auth.bank.com',
  debug: false,
  logLevel: 'error'
}
```

### 版本升级

1. 备份当前用户认证状态
2. 更新SSO客户端代码
3. 验证兼容性
4. 逐步迁移用户会话

## 📞 技术支持

如有问题，请联系：

- 技术支持：tech-support@bank.com
- 安全团队：security@bank.com
- 开发团队：dev-team@bank.com

## 📚 相关文档

- [JWT规范](https://tools.ietf.org/html/rfc7519)
- [OAuth 2.0规范](https://tools.ietf.org/html/rfc6749)
- [SAML 2.0规范](http://docs.oasis-open.org/security/saml/v2.0/)
- [UniApp开发文档](https://uniapp.dcloud.io/)

---

*本文档最后更新时间：2024年12月*

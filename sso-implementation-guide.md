# 单点登录（SSO）实现指南

## 1. 基于 JWT 的 SSO 实现

### 系统架构
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   应用 A    │    │  认证中心   │    │   应用 B    │
│             │    │   (Auth)    │    │             │
│  ┌───────┐  │    │             │    │  ┌───────┐  │
│  │ Login │◄─┼────┤   JWT       │────┼─►│ Login │  │
│  └───────┘  │    │   Service   │    │  └───────┘  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 核心组件

#### 1.1 认证中心 (Authentication Server)

```javascript
// auth-server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-super-secret-key';
const JWT_EXPIRES_IN = '24h';

// 用户数据库（实际项目中应使用真实数据库）
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$...' // bcrypt hashed password
  }
];

// 登录接口
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 生成 JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 验证 Token 接口
app.post('/auth/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      user: {
        userId: decoded.userId,
        username: decoded.username
      }
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 刷新 Token 接口
app.post('/auth/refresh', (req, res) => {
  try {
    const { token } = req.body;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 生成新的 Token
    const newToken = jwt.sign(
      { 
        userId: decoded.userId, 
        username: decoded.username,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token: newToken
    });
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(3001, () => {
  console.log('Auth Server running on port 3001');
});
```

#### 1.2 SSO 客户端库

```javascript
// sso-client.js
class SSOClient {
  constructor(options) {
    this.authServerUrl = options.authServerUrl;
    this.appId = options.appId;
    this.redirectUrl = options.redirectUrl;
    this.tokenKey = 'sso_token';
  }
  
  // 检查登录状态
  async checkAuthStatus() {
    const token = this.getToken();
    if (!token) {
      return { isAuthenticated: false };
    }
    
    try {
      const response = await fetch(`${this.authServerUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return {
          isAuthenticated: true,
          user: result.user
        };
      } else {
        this.removeToken();
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      return { isAuthenticated: false };
    }
  }
  
  // 登录
  async login(username, password) {
    try {
      const response = await fetch(`${this.authServerUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.setToken(result.token);
        return {
          success: true,
          user: result.user
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }
  
  // 登出
  logout() {
    this.removeToken();
    // 可以添加通知其他应用登出的逻辑
    this.notifyOtherApps('logout');
  }
  
  // Token 管理
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }
  
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }
  
  // 刷新 Token
  async refreshToken() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const response = await fetch(`${this.authServerUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.setToken(result.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  
  // 跨应用通信
  notifyOtherApps(action, data = {}) {
    // 使用 localStorage 事件进行跨标签页通信
    const message = {
      action,
      data,
      timestamp: Date.now(),
      appId: this.appId
    };
    localStorage.setItem('sso_message', JSON.stringify(message));
    localStorage.removeItem('sso_message');
  }
  
  // 监听其他应用的消息
  setupCrossAppCommunication() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'sso_message' && e.newValue) {
        const message = JSON.parse(e.newValue);
        if (message.appId !== this.appId) {
          this.handleCrossAppMessage(message);
        }
      }
    });
  }
  
  handleCrossAppMessage(message) {
    switch (message.action) {
      case 'logout':
        this.removeToken();
        // 触发应用的登出逻辑
        this.onLogout && this.onLogout();
        break;
      case 'login':
        // 触发应用的登录逻辑
        this.onLogin && this.onLogin(message.data);
        break;
    }
  }
}

// 使用示例
const ssoClient = new SSOClient({
  authServerUrl: 'http://localhost:3001',
  appId: 'app-1',
  redirectUrl: 'http://localhost:3000'
});

// 初始化
ssoClient.setupCrossAppCommunication();

// 设置回调
ssoClient.onLogin = (userData) => {
  console.log('User logged in from another app:', userData);
  // 更新UI
};

ssoClient.onLogout = () => {
  console.log('User logged out from another app');
  // 更新UI，重定向到登录页
  window.location.href = '/login';
};

export default SSOClient;
```

#### 1.3 Vue.js 集成示例

```vue
<!-- SSO-Login.vue -->
<template>
  <div class="sso-login">
    <div v-if="!isAuthenticated" class="login-form">
      <h2>统一登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            v-model="credentials.username"
            type="text" 
            placeholder="用户名"
            required
          />
        </div>
        <div class="form-group">
          <input 
            v-model="credentials.password"
            type="password" 
            placeholder="密码"
            required
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
    
    <div v-else class="user-info">
      <h2>欢迎，{{ user.username }}!</h2>
      <div class="apps">
        <h3>可访问的应用：</h3>
        <div class="app-list">
          <a href="http://localhost:3000" class="app-link">应用 A</a>
          <a href="http://localhost:3002" class="app-link">应用 B</a>
          <a href="http://localhost:3003" class="app-link">应用 C</a>
        </div>
      </div>
      <button @click="handleLogout" class="logout-btn">登出</button>
    </div>
  </div>
</template>

<script>
import SSOClient from './sso-client.js';

export default {
  name: 'SSOLogin',
  data() {
    return {
      ssoClient: null,
      isAuthenticated: false,
      user: null,
      credentials: {
        username: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },
  
  async mounted() {
    this.ssoClient = new SSOClient({
      authServerUrl: 'http://localhost:3001',
      appId: 'sso-portal',
      redirectUrl: window.location.origin
    });
    
    // 检查当前登录状态
    const authStatus = await this.ssoClient.checkAuthStatus();
    this.isAuthenticated = authStatus.isAuthenticated;
    this.user = authStatus.user;
    
    // 设置跨应用通信
    this.ssoClient.setupCrossAppCommunication();
  },
  
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      
      const result = await this.ssoClient.login(
        this.credentials.username,
        this.credentials.password
      );
      
      if (result.success) {
        this.isAuthenticated = true;
        this.user = result.user;
        
        // 通知其他应用用户已登录
        this.ssoClient.notifyOtherApps('login', result.user);
      } else {
        this.error = result.error;
      }
      
      this.loading = false;
    },
    
    handleLogout() {
      this.ssoClient.logout();
      this.isAuthenticated = false;
      this.user = null;
    }
  }
};
</script>

<style scoped>
.sso-login {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  margin-top: 10px;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.app-link {
  padding: 10px 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-decoration: none;
  color: #495057;
  text-align: center;
}

.app-link:hover {
  background: #e9ecef;
}

.logout-btn {
  background: #dc3545;
  margin-top: 20px;
}
</style>
```

## 2. OAuth 2.0 实现

### 2.1 OAuth 服务器配置

```javascript
// oauth-server.js
const express = require('express');
const { AuthorizationServer } = require('oauth2-server');

const app = express();

// OAuth 模型实现
const model = {
  // 获取客户端
  getClient: async (clientId, clientSecret) => {
    const clients = {
      'app-a': {
        id: 'app-a',
        secret: 'app-a-secret',
        grants: ['authorization_code', 'refresh_token'],
        redirectUris: ['http://localhost:3000/callback']
      }
    };
    
    const client = clients[clientId];
    if (client && (!clientSecret || client.secret === clientSecret)) {
      return client;
    }
    return null;
  },
  
  // 保存授权码
  saveAuthorizationCode: async (code, client, user) => {
    // 保存到数据库或内存
    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      client: client,
      user: user
    };
  },
  
  // 获取授权码
  getAuthorizationCode: async (authorizationCode) => {
    // 从数据库获取
    return savedCode;
  },
  
  // 撤销授权码
  revokeAuthorizationCode: async (code) => {
    return true;
  },
  
  // 保存访问令牌
  saveToken: async (token, client, user) => {
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client,
      user: user
    };
  },
  
  // 获取访问令牌
  getAccessToken: async (accessToken) => {
    // 从数据库获取
    return savedToken;
  }
};

const oauth = new AuthorizationServer(model);

// 授权端点
app.get('/oauth/authorize', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  try {
    const code = await oauth.authorize(request, response);
    res.json(code);
  } catch (err) {
    res.status(err.code || 500).json(err);
  }
});

// 令牌端点
app.post('/oauth/token', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  
  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    res.status(err.code || 500).json(err);
  }
});

app.listen(3001);
```

## 3. SAML 2.0 实现

### 3.1 SAML 身份提供者配置

```javascript
// saml-idp.js
const saml = require('samlp');
const express = require('express');

const app = express();

const options = {
  issuer: 'http://localhost:3001',
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./key.pem'),
  
  // 用户认证函数
  authenticate: (req, callback) => {
    // 实现用户认证逻辑
    const user = {
      id: '123',
      email: 'user@example.com',
      name: 'Test User'
    };
    callback(null, user);
  },
  
  // 用户属性映射
  profileMapper: (user) => {
    return {
      nameID: user.id,
      nameIDFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      attributes: {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': user.email,
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': user.name
      }
    };
  }
};

app.get('/saml/sso', saml.auth(options));
app.post('/saml/sso', saml.auth(options));

app.listen(3001);
```

## 4. 部署和配置

### 4.1 Docker 配置

```yaml
# docker-compose.yml
version: '3.8'
services:
  auth-server:
    build: ./auth-server
    ports:
      - "3001:3001"
    environment:
      - JWT_SECRET=your-super-secret-key
      - DB_URL=mongodb://mongo:27017/sso
    depends_on:
      - mongo
  
  app-a:
    build: ./app-a
    ports:
      - "3000:3000"
    environment:
      - AUTH_SERVER_URL=http://auth-server:3001
  
  app-b:
    build: ./app-b
    ports:
      - "3002:3002"
    environment:
      - AUTH_SERVER_URL=http://auth-server:3001
  
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### 4.2 Nginx 配置

```nginx
# nginx.conf
upstream auth_server {
    server auth-server:3001;
}

upstream app_a {
    server app-a:3000;
}

upstream app_b {
    server app-b:3002;
}

server {
    listen 80;
    server_name auth.example.com;
    
    location / {
        proxy_pass http://auth_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name app-a.example.com;
    
    location / {
        proxy_pass http://app_a;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 5. 安全最佳实践

### 5.1 Token 安全
- 使用 HTTPS 传输
- 设置合理的过期时间
- 实现 Token 刷新机制
- 使用强密钥签名

### 5.2 跨域安全
- 配置正确的 CORS 策略
- 验证 Referer 头
- 使用 CSRF Token

### 5.3 会话管理
- 实现会话超时
- 支持强制登出
- 监控异常登录

## 6. 监控和日志

```javascript
// 登录监控
const loginAttempts = new Map();

app.post('/auth/login', async (req, res) => {
  const clientIP = req.ip;
  const attempts = loginAttempts.get(clientIP) || 0;
  
  if (attempts >= 5) {
    return res.status(429).json({ error: 'Too many attempts' });
  }
  
  try {
    // 登录逻辑
    const result = await authenticateUser(req.body);
    
    if (result.success) {
      loginAttempts.delete(clientIP);
      
      // 记录成功登录
      logger.info('Login successful', {
        userId: result.user.id,
        ip: clientIP,
        userAgent: req.headers['user-agent']
      });
    } else {
      loginAttempts.set(clientIP, attempts + 1);
      
      // 记录失败登录
      logger.warn('Login failed', {
        username: req.body.username,
        ip: clientIP,
        reason: result.error
      });
    }
    
    res.json(result);
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

这个完整的SSO实现方案包含了认证服务器、客户端库、前端集成、安全配置等所有必要组件，可以根据具体需求进行调整和扩展。

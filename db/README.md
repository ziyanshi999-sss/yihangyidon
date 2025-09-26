# 银行数据管理系统

## 概述

这个数据管理系统为农业银行AI智能客服系统提供完整的数据支持，包括用户信息、交易记录、财富管理、生活服务等所有业务数据。

## 文件结构

```
db/
├── bank-data.json          # 主数据文件（JSON格式）
├── data-config.js          # 数据配置文件
├── data-connector.js       # 数据连接工具类
├── user.json              # 原始用户数据（兼容性保留）
├── 数据原型结构.md         # 数据结构文档
├── 数据应用说明.md         # 数据应用说明
├── 数据应用位置映射.md     # 数据位置映射
└── README.md              # 本文件
```

## 数据文件说明

### bank-data.json

主数据文件，包含以下数据结构：

- **users**: 用户数据数组
  - 基本信息：用户名、手机号、密码、余额等
  - 安全设置：生物识别、短信验证、双因子认证等
  - 信用卡信息：卡号、额度、账单等
  - 交易记录：收入、支出、转账记录
  - 财富产品：存款、理财产品、投资组合

- **systemConfig**: 系统配置
  - 版本信息、功能开关、更新时间

- **bankInfo**: 银行信息
  - 银行名称、联系方式、网点信息

- **lifeServices**: 生活服务
  - 快捷服务、全部服务、缴费分类

- **wealthProducts**: 财富产品
  - 存款产品、保险产品、理财产品

## 使用方法

### 1. 启动 JSON Server

```bash
# 进入 db 目录
cd db

# 启动 JSON Server（端口 3002）
json-server bank-data.json --port 3002
```

### 2. 在项目中使用数据连接器

```javascript
// 导入数据连接器
import dataConnector from '@/db/data-connector.js';

// 初始化数据连接
await dataConnector.init();

// 获取用户数据
const users = await dataConnector.getUsers();

// 根据ID获取用户
const user = await dataConnector.getUserById('u001');

// 更新用户数据
await dataConnector.updateUser('u001', { balance: 300000 });

// 添加交易记录
await dataConnector.addTransactionRecord('u001', {
  type: 'income',
  amount: 5000,
  description: '奖金收入'
});
```

### 3. API 端点

JSON Server 启动后，可以通过以下端点访问数据：

- **用户数据**: `GET/PUT/POST/DELETE http://localhost:3002/users`
- **系统配置**: `GET http://localhost:3002/systemConfig`
- **银行信息**: `GET http://localhost:3002/bankInfo`
- **生活服务**: `GET http://localhost:3002/lifeServices`
- **财富产品**: `GET http://localhost:3002/wealthProducts`

## 数据同步机制

### 在线模式
- 当 JSON Server 可用时，数据连接器会从 API 服务器获取最新数据
- 支持实时数据更新和同步
- 自动缓存数据以提高性能

### 离线模式
- 当 JSON Server 不可用时，数据连接器会使用本地缓存数据
- 确保应用在离线状态下仍能正常工作
- 数据修改会保存在本地缓存中

## 数据验证

系统内置数据验证规则：

- **手机号**: 1[3-9]xxxxxxxxx 格式
- **邮箱**: 标准邮箱格式
- **身份证**: 18位身份证号码格式
- **密码**: 6-20位字母数字组合

## 安全特性

- 密码加密存储
- 交易密码独立验证
- 生物识别支持
- 双因子认证
- 安全事件记录
- 设备管理

## 扩展说明

### 添加新用户
1. 在 `bank-data.json` 的 `users` 数组中添加新用户对象
2. 确保包含所有必需字段
3. 重启 JSON Server 使更改生效

### 添加新服务
1. 在相应的服务分类中添加新服务
2. 更新 `data-config.js` 中的映射配置
3. 在 `data-connector.js` 中添加相应的获取方法

### 自定义数据字段
1. 在 `bank-data.json` 中添加新字段
2. 在 `data-config.js` 的 `dataMapping` 中配置映射
3. 在 `data-connector.js` 中添加相应的处理方法

## 故障排除

### JSON Server 启动失败
- 检查端口是否被占用
- 确认 `bank-data.json` 文件格式正确
- 查看控制台错误信息

### 数据连接失败
- 确认 JSON Server 正在运行
- 检查网络连接
- 查看浏览器控制台错误信息

### 数据不同步
- 清除浏览器缓存
- 重启 JSON Server
- 检查数据连接器缓存状态

## 版本历史

- **v1.0.0**: 初始版本，包含基础用户数据和系统配置
- **v1.1.0**: 添加财富管理和生活服务数据
- **v1.2.0**: 完善安全设置和交易记录功能

## 技术支持

如有问题，请查看：
1. 控制台错误信息
2. 数据连接器状态日志
3. JSON Server 运行日志

---

*最后更新: 2024-01-20*

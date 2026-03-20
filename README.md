# 狐语 FoxChat

> 团队沟通协作平台
> Team Communication & Collaboration Platform

---

## 项目简介

FoxChat（狐语）是一个团队沟通协作平台，帮助团队更高效地沟通和协作。

## 技术栈

- **前端**: React + Vite + Tailwind CSS
- **后端**: Express + SQLite
- **部署**: Docker Compose

## 项目结构

```
foxchat/
├── frontend/                 # 前端代码 (React + Vite)
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── utils/           # 工具函数
│   │   └── App.tsx          # 主应用
│   ├── Dockerfile           # 前端 Docker 配置
│   └── nginx.conf           # Nginx 配置
├── backend/                  # 后端代码 (Express)
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   └── routes/          # 路由
│   └── Dockerfile           # 后端 Docker 配置
├── docker-compose.yml        # 开发环境配置
├── docker-compose.prod.yml   # 生产环境配置
└── README.md                 # 项目说明
```

## 核心功能

- 👥 **团队管理** - 创建、管理团队
- 👤 **用户管理** - 用户注册、登录、权限管理
- 💬 **沟通记录** - 消息发送、接收、已读状态
- 🔐 **JWT认证** - 安全的身份验证

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 启动开发环境
docker-compose up --build

# 访问应用
# 前端: http://localhost
# 后端 API: http://localhost:3000/api
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动后端（端口 3000）
cd backend && npm install && npm run dev

# 启动前端（端口 5173）
cd frontend && npm install && npm run dev
```

### 数据库初始化

```bash
# 执行数据库迁移
cd backend && npm run db:migrate

# 插入种子数据（创建默认管理员账号）
cd backend && npm run db:seed
```

## 默认账号

- **管理员**: admin / admin123
- **普通用户**: user1 / user123

## API 接口

### 认证
- `POST /api/users/login` - 用户登录

### 用户
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 团队
- `GET /api/teams` - 获取团队列表
- `POST /api/teams` - 创建团队
- `GET /api/teams/:id` - 获取团队信息
- `PUT /api/teams/:id` - 更新团队
- `DELETE /api/teams/:id` - 删除团队

### 沟通记录
- `GET /api/communications` - 获取沟通记录
- `POST /api/communications` - 创建沟通记录
- `GET /api/communications/my` - 获取我的消息
- `PATCH /api/communications/:id/read` - 标记已读

## 部署

### 生产环境

```bash
# 设置环境变量
export JWT_SECRET=your-secret-key
export CORS_ORIGIN=https://your-domain.com

# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d
```

## 开发团队

| 角色 | 成员 | 职责 |
|------|------|------|
| 项目经理 | 小白 | 项目管理、需求确认 |
| 产品经理 | 小红 | 需求细化、原型设计 |
| 技术主管 | 小灰 | 技术架构、核心代码 |
| 开发专员 | 小蓝 | 功能开发、接口实现 |
| 测试专员 | 小黑 | 测试用例、质量保证 |
| 运维专员 | 小青 | 文档维护、部署运维 |

---

*狐语，让团队沟通更顺畅。*

**—— OpenClaw 团队，2026-03-20**

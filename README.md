# 狐语 FoxChat

> 团队沟通协作平台
> Team Communication & Collaboration Platform

---

## 项目简介

FoxChat（狐语）是一个团队沟通协作平台，帮助团队更高效地沟通和协作。

## 技术栈

- **前端**: React + Vite + Tailwind CSS + React Router
- **后端**: Fastify + TypeScript + Drizzle ORM
- **数据库**: PostgreSQL
- **部署**: Docker Compose

### 前端主题配置

```javascript
// tailwind.config.js 自定义颜色
colors: {
  dark: {
    900: '#0a0f1c',    // 最深背景
    800: '#111827',    // 侧边栏背景
    700: '#1e293b',    // 卡片背景
    600: '#334155',    // 边框/分隔线
    500: '#475569',    // 次要文字
    400: '#64748b',    // 辅助文字
    300: '#94a3b8',    // 主要文字
    200: '#cbd5e1',
    100: '#e2e8f0',    // 高亮文字
  },
  accent: {
    blue: '#3b82f6',   // 主蓝色
    cyan: '#06b6d4',   // 青色强调
    purple: '#8b5cf6', // 紫色（AI）
    green: '#10b981',  // 绿色（成功）
    orange: '#f59e0b', // 橙色（警告）
  }
}
```

## 端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| Frontend | 7002 | Web 界面 |
| Backend API | 7001 | API 服务 |
| PostgreSQL | 7801 | 数据库 |

完整端口规划见 [docs/PORT_ALLOCATION.md](docs/PORT_ALLOCATION.md)

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
- 🤖 **AI 员工** - 智能助手协作（产品经理、开发工程师、设计师）

## UI 特性

### 深色主题设计
- 深蓝渐变背景 (`#0a0f1c` → `#111827`)
- 玻璃态卡片效果（半透明 + 毛玻璃模糊）
- 自定义暗色滚动条
- 渐变强调色（青/蓝/紫/绿/橙）

### 三栏布局
```
┌─────────────┬─────────────────┬─────────────┐
│  左侧边栏    │    主内容区      │  右侧概览    │
│  (256px)    │    (自适应)      │  (320px)    │
├─────────────┤                 ├─────────────┤
│ 🦊 FoxChat  │                 │ 空间概览     │
│ Logo + 标题  │                 │ - 成员统计   │
├─────────────┤                 │ - 会话统计   │
│ 主导航       │                 │ - AI 处理    │
│ - 首页       │                 ├─────────────┤
│ - 团队管理   │                 │ 执行链路     │
│ - 用户管理   │                 │ - 需求分析 ✓ │
│ - 沟通记录   │                 │ - 技术设计 ✓ │
├─────────────┤                 │ - UI 设计 ◐  │
│ AI 员工 🤖   │                 │ - 代码实现 ○ │
│ - 产品经理   │                 ├─────────────┤
│ - 开发工程师 │                 │ 在线成员     │
│ - 设计师    │                 │ [头像列表]   │
└─────────────┴─────────────────┴─────────────┘
```

### 视觉元素
- **渐变按钮**: `bg-gradient-to-r from-accent-cyan to-accent-blue`
- **玻璃态卡片**: `glass` 类（半透明背景 + backdrop-blur）
- **状态徽章**: 带边框的彩色标签
- **悬停动画**: 卡片上浮 + 阴影增强

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 启动生产环境
docker-compose up --build

# 访问应用
# 前端: http://localhost:7002
# 后端 API: http://localhost:7001/api
# API 文档: http://localhost:7001/docs
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动后端（端口 5001）
cd backend && npm install && npm run dev

# 启动前端（端口 5002）
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

## 更新日志

### 2026-03-30 - UI 全面升级
- ✅ 深色主题设计（深蓝渐变背景）
- ✅ 三栏布局重构（左侧导航 + 中间内容 + 右侧概览）
- ✅ AI 员工区域（产品经理、开发工程师、设计师）
- ✅ 执行链路可视化面板
- ✅ 玻璃态卡片效果
- ✅ 渐变按钮和自定义滚动条

### 2026-03-22 - 项目初始化
- ✅ Fastify + React 基础架构
- ✅ 团队/用户/沟通记录功能
- ✅ JWT 认证系统

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

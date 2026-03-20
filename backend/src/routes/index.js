const express = require('express');
const router = express.Router();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FoxChat API 运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'FoxChat API',
      version: '1.0.0',
      description: 'FoxChat 后端 API 服务',
      endpoints: {
        auth: {
          login: 'POST /api/users/login'
        },
        users: {
          list: 'GET /api/users',
          get: 'GET /api/users/:id',
          create: 'POST /api/users',
          update: 'PUT /api/users/:id',
          delete: 'DELETE /api/users/:id',
          me: 'GET /api/users/me',
          communications: 'GET /api/users/:id/communications'
        },
        teams: {
          list: 'GET /api/teams',
          get: 'GET /api/teams/:id',
          create: 'POST /api/teams',
          update: 'PUT /api/teams/:id',
          delete: 'DELETE /api/teams/:id',
          members: 'GET /api/teams/:id/members'
        },
        communications: {
          list: 'GET /api/communications',
          get: 'GET /api/communications/:id',
          create: 'POST /api/communications',
          update: 'PUT /api/communications/:id',
          delete: 'DELETE /api/communications/:id',
          my: 'GET /api/communications/my',
          unread: 'GET /api/communications/unread/count',
          markRead: 'PATCH /api/communications/:id/read',
          markReadBatch: 'PATCH /api/communications/read/batch',
          team: 'GET /api/communications/team/:teamId'
        }
      }
    }
  });
});

module.exports = router;

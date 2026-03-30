const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

// 导入路由
const indexRoutes = require('./routes');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');
const communicationRoutes = require('./routes/communications');

const app = express();

// 中间件
app.use(helmet()); // 安全头
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(morgan('dev')); // 请求日志
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 路由
app.use('/', indexRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/communications', communicationRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(config.server.env === 'development' && { stack: err.stack })
  });
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`FoxChat API 服务已启动`);
  console.log(`环境: ${config.server.env}`);
  console.log(`端口: ${PORT}`);
  console.log(`=================================`);
});

module.exports = app;

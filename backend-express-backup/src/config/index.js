require('dotenv').config();

module.exports = {
  // 数据库配置
  database: {
    path: process.env.DB_PATH || './data/foxchat.db',
    name: process.env.DB_NAME || 'foxchat'
  },
  
  // 服务器配置
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080'
  }
};

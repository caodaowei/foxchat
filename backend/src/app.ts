import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config.js';
import routes from './routes/index.js';

const app = Fastify({
  logger: {
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  },
});

// Register plugins
await app.register(cors, {
  origin: config.CORS_ORIGIN,
  credentials: true,
});

await app.register(jwt, {
  secret: config.JWT_SECRET,
});

// Swagger documentation
await app.register(swagger, {
  openapi: {
    info: {
      title: 'FoxChat API',
      description: 'FoxChat 团队沟通协作平台 API',
      version: '2.0.0',
    },
    tags: [
      { name: 'Auth', description: '认证相关' },
      { name: 'Users', description: '用户管理' },
      { name: 'Teams', description: '团队管理' },
      { name: 'Communications', description: '沟通记录' },
    ],
  },
});

await app.register(swaggerUi, {
  routePrefix: '/docs',
});

// Register routes
await app.register(routes, { prefix: '/api' });

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: '请求参数错误',
      errors: error.validation,
    });
  }

  return reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || '服务器内部错误',
  });
});

// 404 handler
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    message: '接口不存在',
    path: request.url,
  });
});

// Start server
try {
  await app.listen({ port: parseInt(config.PORT), host: config.HOST });
  console.log(`=================================`);
  console.log(`🚀 FoxChat API 服务已启动`);
  console.log(`📡 环境: ${config.NODE_ENV}`);
  console.log(`🔗 地址: http://${config.HOST}:${config.PORT}`);
  console.log(`📚 文档: http://${config.HOST}:${config.PORT}/docs`);
  console.log(`=================================`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

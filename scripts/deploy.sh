#!/bin/bash
# FoxChat 部署脚本

set -e

echo "🚀 开始部署 FoxChat..."

# 加载环境变量
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 构建并启动
echo "🔨 构建并启动服务..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 执行数据库迁移
echo "🗄️  执行数据库迁移..."
docker-compose -f docker-compose.prod.yml exec -T backend npm run db:migrate

# 健康检查
echo "🏥 健康检查..."
sleep 5
curl -f http://localhost/api/health || exit 1

echo "✅ 部署完成！"

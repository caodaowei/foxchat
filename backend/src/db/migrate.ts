import { sql } from 'drizzle-orm';
import { db } from './index.js';

async function migrate() {
  console.log('🚀 开始 PostgreSQL 数据库迁移...');

  try {
    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        avatar TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        avatar TEXT,
        role VARCHAR(20) DEFAULT 'member' NOT NULL,
        status VARCHAR(20) DEFAULT 'active' NOT NULL,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS communications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
        type VARCHAR(20) DEFAULT 'message' NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_communications_sender ON communications(sender_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_communications_receiver ON communications(receiver_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_communications_team ON communications(team_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_communications_created ON communications(created_at);`);

    console.log('✅ PostgreSQL 数据库迁移完成');
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

migrate();

const db = require('./database');

// 数据库迁移脚本
const migrations = [
  // 1. 创建 teams 表
  `
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `,
  
  // 2. 创建 users 表
  `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    team_id TEXT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'member' CHECK(role IN ('admin', 'manager', 'member')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
  );
  `,
  
  // 3. 创建 communications 表
  `
  CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT,
    team_id TEXT,
    type TEXT NOT NULL CHECK(type IN ('message', 'announcement', 'notification')),
    content TEXT NOT NULL,
    attachments TEXT, -- JSON格式存储附件信息
    is_read BOOLEAN DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );
  `,
  
  // 4. 创建索引
  `CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
  `CREATE INDEX IF NOT EXISTS idx_communications_sender ON communications(sender_id);`,
  `CREATE INDEX IF NOT EXISTS idx_communications_receiver ON communications(receiver_id);`,
  `CREATE INDEX IF NOT EXISTS idx_communications_team ON communications(team_id);`,
  `CREATE INDEX IF NOT EXISTS idx_communications_created ON communications(created_at);`
];

// 执行迁移
function runMigrations() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      migrations.forEach((sql, index) => {
        db.run(sql, (err) => {
          if (err) {
            console.error(`迁移 ${index + 1} 失败:`, err.message);
            reject(err);
          } else {
            console.log(`迁移 ${index + 1} 执行成功`);
          }
        });
      });
    });
    
    // 等待所有迁移完成
    db.wait((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('所有数据库迁移完成');
        resolve();
      }
    });
  });
}

// 如果直接运行此文件，执行迁移
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('数据库初始化完成');
      db.close();
    })
    .catch((err) => {
      console.error('数据库初始化失败:', err);
      db.close();
      process.exit(1);
    });
}

module.exports = { runMigrations };

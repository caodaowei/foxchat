const db = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// 种子数据
async function seed() {
  console.log('开始插入种子数据...');

  try {
    // 1. 创建默认团队
    const teamId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO teams (id, name, description) VALUES (?, ?, ?)`,
        [teamId, '默认团队', '系统自动创建的默认团队'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    console.log('✓ 默认团队创建成功');

    // 2. 创建管理员用户
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash('admin123', 10);
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO users (id, team_id, username, email, password_hash, display_name, role, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [adminId, teamId, 'admin', 'admin@foxchat.com', passwordHash, '管理员', 'admin', 'active'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    console.log('✓ 管理员用户创建成功');

    // 3. 创建示例用户
    const userId = uuidv4();
    const userPasswordHash = await bcrypt.hash('user123', 10);
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO users (id, team_id, username, email, password_hash, display_name, role, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, teamId, 'user1', 'user1@foxchat.com', userPasswordHash, '测试用户', 'member', 'active'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    console.log('✓ 示例用户创建成功');

    // 4. 创建示例沟通记录
    const commId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO communications (id, sender_id, team_id, type, content) 
         VALUES (?, ?, ?, ?, ?)`,
        [commId, adminId, teamId, 'announcement', '欢迎使用 FoxChat！这是系统公告。'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    console.log('✓ 示例沟通记录创建成功');

    console.log('\n种子数据插入完成！');
    console.log('默认登录账号：');
    console.log('  管理员：admin / admin123');
    console.log('  普通用户：user1 / user123');

  } catch (error) {
    console.error('种子数据插入失败:', error);
  } finally {
    db.close();
  }
}

// 如果直接运行此文件
if (require.main === module) {
  seed();
}

module.exports = { seed };

const db = require('../config/database');

class User {
  // 创建用户
  static create({ id, team_id, username, email, password_hash, display_name, avatar, role }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (id, team_id, username, email, password_hash, display_name, avatar, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(sql, [id, team_id, username, email, password_hash, display_name, avatar, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, team_id, username, email, display_name, avatar, role });
        }
      });
    });
  }
  
  // 获取所有用户
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, team_id, username, email, display_name, avatar, role, status, last_login_at, created_at 
        FROM users 
        ORDER BY created_at DESC
      `;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  // 根据ID获取用户
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, team_id, username, email, display_name, avatar, role, status, last_login_at, created_at 
        FROM users 
        WHERE id = ?
      `;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  // 根据用户名获取用户（包含密码，用于登录）
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  // 根据邮箱获取用户
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  // 更新用户
  static update(id, updates) {
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) {
      return Promise.resolve({ changes: 0 });
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 删除用户
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 更新最后登录时间
  static updateLastLogin(id) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 获取用户通讯记录
  static getCommunications(userId, type = 'all') {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT c.*, 
               s.display_name as sender_name, s.avatar as sender_avatar,
               r.display_name as receiver_name, r.avatar as receiver_avatar,
               t.name as team_name
        FROM communications c
        LEFT JOIN users s ON c.sender_id = s.id
        LEFT JOIN users r ON c.receiver_id = r.id
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.sender_id = ? OR c.receiver_id = ?
      `;
      const params = [userId, userId];
      
      if (type !== 'all') {
        sql += ` AND c.type = ?`;
        params.push(type);
      }
      
      sql += ` ORDER BY c.created_at DESC`;
      
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = User;

const db = require('../config/database');

class Team {
  // 创建团队
  static create({ id, name, description, avatar }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO teams (id, name, description, avatar) 
        VALUES (?, ?, ?, ?)
      `;
      db.run(sql, [id, name, description, avatar], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, description, avatar });
        }
      });
    });
  }
  
  // 获取所有团队
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM teams ORDER BY created_at DESC`;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  // 根据ID获取团队
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM teams WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  // 更新团队
  static update(id, { name, description, avatar }) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE teams 
        SET name = ?, description = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      db.run(sql, [name, description, avatar, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 删除团队
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM teams WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 获取团队成员
  static getMembers(teamId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username, email, display_name, avatar, role, status, created_at 
        FROM users 
        WHERE team_id = ?
        ORDER BY created_at DESC
      `;
      db.all(sql, [teamId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Team;

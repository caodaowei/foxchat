const db = require('../config/database');

class Communication {
  // 创建通讯记录
  static create({ id, sender_id, receiver_id, team_id, type, content, attachments }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO communications (id, sender_id, receiver_id, team_id, type, content, attachments) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const attachmentStr = attachments ? JSON.stringify(attachments) : null;
      db.run(sql, [id, sender_id, receiver_id, team_id, type, content, attachmentStr], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, sender_id, receiver_id, team_id, type, content, attachments });
        }
      });
    });
  }
  
  // 获取所有通讯记录
  static findAll(options = {}) {
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
        WHERE 1=1
      `;
      const params = [];
      
      if (options.type) {
        sql += ` AND c.type = ?`;
        params.push(options.type);
      }
      
      if (options.sender_id) {
        sql += ` AND c.sender_id = ?`;
        params.push(options.sender_id);
      }
      
      if (options.receiver_id) {
        sql += ` AND c.receiver_id = ?`;
        params.push(options.receiver_id);
      }
      
      if (options.team_id) {
        sql += ` AND c.team_id = ?`;
        params.push(options.team_id);
      }
      
      if (options.is_read !== undefined) {
        sql += ` AND c.is_read = ?`;
        params.push(options.is_read ? 1 : 0);
      }
      
      sql += ` ORDER BY c.created_at DESC`;
      
      if (options.limit) {
        sql += ` LIMIT ?`;
        params.push(options.limit);
      }
      
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  // 根据ID获取通讯记录
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, 
               s.display_name as sender_name, s.avatar as sender_avatar,
               r.display_name as receiver_name, r.avatar as receiver_avatar,
               t.name as team_name
        FROM communications c
        LEFT JOIN users s ON c.sender_id = s.id
        LEFT JOIN users r ON c.receiver_id = r.id
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.id = ?
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
  
  // 标记为已读
  static markAsRead(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE communications 
        SET is_read = 1, read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 批量标记为已读
  static markMultipleAsRead(ids) {
    return new Promise((resolve, reject) => {
      const placeholders = ids.map(() => '?').join(',');
      const sql = `
        UPDATE communications 
        SET is_read = 1, read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
        WHERE id IN (${placeholders})
      `;
      db.run(sql, ids, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 更新通讯记录
  static update(id, { content, attachments }) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE communications 
        SET content = ?, attachments = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      const attachmentStr = attachments ? JSON.stringify(attachments) : null;
      db.run(sql, [content, attachmentStr, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 删除通讯记录
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM communications WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
  
  // 获取未读消息数量
  static getUnreadCount(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(*) as count 
        FROM communications 
        WHERE receiver_id = ? AND is_read = 0
      `;
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  }
  
  // 获取团队消息
  static getTeamMessages(teamId, options = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT c.*, 
               s.display_name as sender_name, s.avatar as sender_avatar,
               t.name as team_name
        FROM communications c
        LEFT JOIN users s ON c.sender_id = s.id
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.team_id = ?
      `;
      const params = [teamId];
      
      if (options.type) {
        sql += ` AND c.type = ?`;
        params.push(options.type);
      }
      
      sql += ` ORDER BY c.created_at DESC`;
      
      if (options.limit) {
        sql += ` LIMIT ?`;
        params.push(options.limit);
      }
      
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

module.exports = Communication;

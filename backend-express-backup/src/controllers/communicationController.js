const { v4: uuidv4 } = require('uuid');
const { Communication } = require('../models');

// 获取所有通讯记录
const getAllCommunications = async (req, res) => {
  try {
    const { type, sender_id, receiver_id, team_id, is_read, limit } = req.query;
    
    const options = {};
    if (type) options.type = type;
    if (sender_id) options.sender_id = sender_id;
    if (receiver_id) options.receiver_id = receiver_id;
    if (team_id) options.team_id = team_id;
    if (is_read !== undefined) options.is_read = is_read === 'true';
    if (limit) options.limit = parseInt(limit, 10);
    
    const communications = await Communication.findAll(options);
    
    res.json({
      success: true,
      data: communications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取通讯记录失败',
      error: error.message
    });
  }
};

// 获取单个通讯记录
const getCommunicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const communication = await Communication.findById(id);
    
    if (!communication) {
      return res.status(404).json({
        success: false,
        message: '通讯记录不存在'
      });
    }
    
    res.json({
      success: true,
      data: communication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取通讯记录失败',
      error: error.message
    });
  }
};

// 创建通讯记录
const createCommunication = async (req, res) => {
  try {
    const { receiver_id, team_id, type, content, attachments } = req.body;
    const sender_id = req.user.id;
    
    // 验证：私信需要接收者，团队消息需要团队ID
    if (type === 'message' && !receiver_id && !team_id) {
      return res.status(400).json({
        success: false,
        message: '私信需要提供接收者ID或团队ID'
      });
    }
    
    const communication = await Communication.create({
      id: uuidv4(),
      sender_id,
      receiver_id,
      team_id,
      type,
      content,
      attachments
    });
    
    res.status(201).json({
      success: true,
      message: '通讯记录创建成功',
      data: communication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建通讯记录失败',
      error: error.message
    });
  }
};

// 更新通讯记录
const updateCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;
    
    // 检查记录是否存在
    const existing = await Communication.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: '通讯记录不存在'
      });
    }
    
    // 检查权限（只有发送者可以修改）
    if (existing.sender_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此通讯记录'
      });
    }
    
    const result = await Communication.update(id, { content, attachments });
    
    if (result.changes === 0) {
      return res.status(400).json({
        success: false,
        message: '未做任何更改'
      });
    }
    
    const updated = await Communication.findById(id);
    
    res.json({
      success: true,
      message: '通讯记录更新成功',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新通讯记录失败',
      error: error.message
    });
  }
};

// 删除通讯记录
const deleteCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查记录是否存在
    const existing = await Communication.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: '通讯记录不存在'
      });
    }
    
    // 检查权限（只有发送者或管理员可以删除）
    if (existing.sender_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权删除此通讯记录'
      });
    }
    
    const result = await Communication.delete(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '通讯记录不存在'
      });
    }
    
    res.json({
      success: true,
      message: '通讯记录删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除通讯记录失败',
      error: error.message
    });
  }
};

// 标记为已读
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Communication.markAsRead(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '通讯记录不存在'
      });
    }
    
    res.json({
      success: true,
      message: '已标记为已读'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '标记已读失败',
      error: error.message
    });
  }
};

// 批量标记为已读
const markMultipleAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的ID列表'
      });
    }
    
    const result = await Communication.markMultipleAsRead(ids);
    
    res.json({
      success: true,
      message: `成功标记 ${result.changes} 条记录为已读`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '批量标记已读失败',
      error: error.message
    });
  }
};

// 获取未读消息数量
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Communication.getUnreadCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取未读消息数量失败',
      error: error.message
    });
  }
};

// 获取团队消息
const getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { type, limit } = req.query;
    
    const options = {};
    if (type) options.type = type;
    if (limit) options.limit = parseInt(limit, 10);
    
    const messages = await Communication.getTeamMessages(teamId, options);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取团队消息失败',
      error: error.message
    });
  }
};

// 获取当前用户的通讯记录
const getMyCommunications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    
    const communications = await Communication.findAll({
      receiver_id: userId,
      type
    });
    
    res.json({
      success: true,
      data: communications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取通讯记录失败',
      error: error.message
    });
  }
};

module.exports = {
  getAllCommunications,
  getCommunicationById,
  createCommunication,
  updateCommunication,
  deleteCommunication,
  markAsRead,
  markMultipleAsRead,
  getUnreadCount,
  getTeamMessages,
  getMyCommunications
};

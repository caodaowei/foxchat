const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { communicationValidation } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// 所有通讯接口都需要认证
router.use(authenticateToken);

// 获取当前用户的通讯记录
router.get('/my', communicationController.getMyCommunications);

// 获取未读消息数量
router.get('/unread/count', communicationController.getUnreadCount);

// 获取所有通讯记录（管理员可用）
router.get('/', communicationController.getAllCommunications);

// 获取团队消息
router.get('/team/:teamId', communicationController.getTeamMessages);

// 获取单个通讯记录
router.get('/:id', communicationController.getCommunicationById);

// 创建通讯记录
router.post('/', communicationValidation.create, communicationController.createCommunication);

// 更新通讯记录
router.put('/:id', communicationValidation.update, communicationController.updateCommunication);

// 删除通讯记录
router.delete('/:id', communicationController.deleteCommunication);

// 标记为已读
router.patch('/:id/read', communicationController.markAsRead);

// 批量标记为已读
router.patch('/read/batch', communicationController.markMultipleAsRead);

module.exports = router;

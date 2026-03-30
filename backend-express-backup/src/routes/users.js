const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userValidation } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// 公开接口
router.post('/login', userValidation.login, userController.login);

// 需要认证的接口
router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/:id/communications', authenticateToken, userController.getUserCommunications);

// 需要管理员权限的接口
router.post('/', authenticateToken, requireRole('admin', 'manager'), userValidation.create, userController.createUser);
router.put('/:id', authenticateToken, requireRole('admin'), userValidation.update, userController.updateUser);
router.delete('/:id', authenticateToken, requireRole('admin'), userController.deleteUser);

module.exports = router;

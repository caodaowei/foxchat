const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { teamValidation } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// 公开接口
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.get('/:id/members', teamController.getTeamMembers);

// 需要认证的接口
router.post('/', authenticateToken, requireRole('admin', 'manager'), teamValidation.create, teamController.createTeam);
router.put('/:id', authenticateToken, requireRole('admin', 'manager'), teamValidation.update, teamController.updateTeam);
router.delete('/:id', authenticateToken, requireRole('admin'), teamController.deleteTeam);

module.exports = router;

const { body, param, validationResult } = require('express-validator');

// 处理验证错误
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

// 团队验证规则
const teamValidation = {
  create: [
    body('name')
      .notEmpty().withMessage('团队名称不能为空')
      .isLength({ min: 2, max: 50 }).withMessage('团队名称长度应在2-50个字符之间'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('团队描述不能超过500个字符'),
    body('avatar')
      .optional()
      .isURL().withMessage('头像必须是有效的URL'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .notEmpty().withMessage('团队ID不能为空'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('团队名称长度应在2-50个字符之间'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('团队描述不能超过500个字符'),
    body('avatar')
      .optional()
      .isURL().withMessage('头像必须是有效的URL'),
    handleValidationErrors
  ]
};

// 用户验证规则
const userValidation = {
  create: [
    body('username')
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 30 }).withMessage('用户名长度应在3-30个字符之间')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
    body('email')
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('邮箱格式不正确'),
    body('password')
      .notEmpty().withMessage('密码不能为空')
      .isLength({ min: 6 }).withMessage('密码长度至少为6个字符'),
    body('display_name')
      .optional()
      .isLength({ max: 50 }).withMessage('显示名称不能超过50个字符'),
    body('role')
      .optional()
      .isIn(['admin', 'manager', 'member']).withMessage('角色必须是 admin、manager 或 member'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .notEmpty().withMessage('用户ID不能为空'),
    body('email')
      .optional()
      .isEmail().withMessage('邮箱格式不正确'),
    body('display_name')
      .optional()
      .isLength({ max: 50 }).withMessage('显示名称不能超过50个字符'),
    body('role')
      .optional()
      .isIn(['admin', 'manager', 'member']).withMessage('角色必须是 admin、manager 或 member'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'suspended']).withMessage('状态必须是 active、inactive 或 suspended'),
    handleValidationErrors
  ],
  
  login: [
    body('username')
      .notEmpty().withMessage('用户名不能为空'),
    body('password')
      .notEmpty().withMessage('密码不能为空'),
    handleValidationErrors
  ]
};

// 通讯验证规则
const communicationValidation = {
  create: [
    body('type')
      .notEmpty().withMessage('通讯类型不能为空')
      .isIn(['message', 'announcement', 'notification']).withMessage('类型必须是 message、announcement 或 notification'),
    body('content')
      .notEmpty().withMessage('内容不能为空')
      .isLength({ max: 5000 }).withMessage('内容不能超过5000个字符'),
    body('receiver_id')
      .optional()
      .notEmpty().withMessage('接收者ID不能为空'),
    body('team_id')
      .optional()
      .notEmpty().withMessage('团队ID不能为空'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .notEmpty().withMessage('通讯ID不能为空'),
    body('content')
      .optional()
      .isLength({ max: 5000 }).withMessage('内容不能超过5000个字符'),
    handleValidationErrors
  ]
};

module.exports = {
  teamValidation,
  userValidation,
  communicationValidation,
  handleValidationErrors
};

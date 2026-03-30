const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

// 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
};

// 获取单个用户
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const { team_id, username, email, password, display_name, avatar, role } = req.body;
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: '邮箱已被注册'
      });
    }
    
    // 加密密码
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const user = await User.create({
      id: uuidv4(),
      team_id,
      username,
      email,
      password_hash,
      display_name,
      avatar,
      role: role || 'member'
    });
    
    // 不返回密码
    delete user.password_hash;
    
    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 不允许通过此接口更新密码
    delete updates.password;
    delete updates.password_hash;
    
    const result = await User.update(id, updates);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在或未做任何更改'
      });
    }
    
    const updatedUser = await User.findById(id);
    
    res.json({
      success: true,
      message: '用户更新成功',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新用户失败',
      error: error.message
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await User.delete(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: '账户已被禁用或暂停'
      });
    }
    
    // 更新最后登录时间
    await User.updateLastLogin(user.id);
    
    // 生成JWT令牌
    const token = generateToken(user);
    
    // 不返回密码
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

// 获取用户通讯记录
const getUserCommunications = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const communications = await User.getCommunications(id, type);
    
    res.json({
      success: true,
      data: communications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户通讯记录失败',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
  getUserCommunications
};

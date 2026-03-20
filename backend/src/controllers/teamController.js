const { v4: uuidv4 } = require('uuid');
const { Team } = require('../models');

// 获取所有团队
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取团队列表失败',
      error: error.message
    });
  }
};

// 获取单个团队
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: '团队不存在'
      });
    }
    
    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取团队信息失败',
      error: error.message
    });
  }
};

// 创建团队
const createTeam = async (req, res) => {
  try {
    const { name, description, avatar } = req.body;
    
    const team = await Team.create({
      id: uuidv4(),
      name,
      description,
      avatar
    });
    
    res.status(201).json({
      success: true,
      message: '团队创建成功',
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建团队失败',
      error: error.message
    });
  }
};

// 更新团队
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, avatar } = req.body;
    
    const result = await Team.update(id, { name, description, avatar });
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '团队不存在或未做任何更改'
      });
    }
    
    const updatedTeam = await Team.findById(id);
    
    res.json({
      success: true,
      message: '团队更新成功',
      data: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新团队失败',
      error: error.message
    });
  }
};

// 删除团队
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Team.delete(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '团队不存在'
      });
    }
    
    res.json({
      success: true,
      message: '团队删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除团队失败',
      error: error.message
    });
  }
};

// 获取团队成员
const getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: '团队不存在'
      });
    }
    
    const members = await Team.getMembers(id);
    
    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取团队成员失败',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers
};

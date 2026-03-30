import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { getToken } from '../utils/auth'

interface Stats {
  teams: number
  users: number
  communications: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ teams: 0, users: 0, communications: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken()
      try {
        const [teamsRes, usersRes, commsRes] = await Promise.all([
          api.get('/teams', token || undefined),
          api.get('/users', token || undefined),
          api.get('/communications', token || undefined),
        ])

        setStats({
          teams: teamsRes.data?.length || 0,
          users: usersRes.data?.length || 0,
          communications: commsRes.data?.length || 0,
        })
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { 
      title: '团队数量', 
      value: stats.teams, 
      icon: '👥', 
      color: 'from-accent-blue to-accent-cyan',
      trend: '+12%'
    },
    { 
      title: '用户数量', 
      value: stats.users, 
      icon: '👤', 
      color: 'from-accent-green to-emerald-400',
      trend: '+8%'
    },
    { 
      title: '沟通记录', 
      value: stats.communications, 
      icon: '💬', 
      color: 'from-accent-purple to-violet-400',
      trend: '+23%'
    },
  ]

  const quickActions = [
    { icon: '➕', label: '创建团队', desc: '新建协作空间', color: 'bg-accent-blue/20 text-accent-blue' },
    { icon: '👤', label: '邀请成员', desc: '添加团队成员', color: 'bg-accent-green/20 text-accent-green' },
    { icon: '🤖', label: 'AI 助手', desc: '智能协作', color: 'bg-accent-purple/20 text-accent-purple' },
    { icon: '📊', label: '查看报表', desc: '数据分析', color: 'bg-accent-orange/20 text-accent-orange' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">欢迎回来，大哥 👋</h1>
            <p className="text-dark-400">今天有 3 个待办事项需要处理</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent-cyan">12</div>
            <div className="text-sm text-dark-400">待处理消息</div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-accent-green/20 text-accent-green rounded-full">
                {card.trend}
              </span>
              <span className="text-xs text-dark-500">较上周</span>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div>
        <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">快捷操作</h3>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="glass rounded-xl p-4 text-left card-hover group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div className="text-sm font-medium text-white">{action.label}</div>
              <div className="text-xs text-dark-500 mt-1">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">最近活动</h3>
          <button className="text-sm text-accent-cyan hover:text-accent-blue transition-colors">
            查看全部 →
          </button>
        </div>
        <div className="space-y-3">
          {[
            { user: '产品经理', action: '更新了需求文档', time: '5分钟前', type: 'ai' },
            { user: '开发工程师', action: '完成了代码审查', time: '15分钟前', type: 'ai' },
            { user: '大哥', action: '创建了新团队 "FoxChat"', time: '1小时前', type: 'user' },
            { user: '设计师', action: '上传了 UI 设计稿', time: '2小时前', type: 'ai' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-700/30 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                item.type === 'ai' 
                  ? 'bg-accent-purple/20 text-accent-purple' 
                  : 'bg-accent-cyan/20 text-accent-cyan'
              }`}>
                {item.type === 'ai' ? '🤖' : '👤'}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white">
                  <span className="font-medium">{item.user}</span>
                  <span className="text-dark-400"> {item.action}</span>
                </div>
              </div>
              <div className="text-xs text-dark-500">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
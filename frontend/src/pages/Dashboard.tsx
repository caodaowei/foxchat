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
    { title: '团队数量', value: stats.teams, icon: '👥', color: 'bg-blue-500' },
    { title: '用户数量', value: stats.users, icon: '👤', color: 'bg-green-500' },
    { title: '沟通记录', value: stats.communications, icon: '💬', color: 'bg-purple-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${card.color} p-4 rounded-lg text-white text-2xl`}>
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">欢迎使用 FoxChat</h2>
        <p className="text-gray-600">
          FoxChat 是一个团队沟通协作平台，帮助您的团队更高效地沟通和协作。
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">🚀 快速开始</h3>
            <p className="text-sm text-gray-500 mt-1">
              创建团队、添加成员，开始您的协作之旅
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">💡 功能特性</h3>
            <p className="text-sm text-gray-500 mt-1">
              支持团队管理、用户管理、沟通记录等功能
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

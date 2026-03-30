import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { getToken } from '../utils/auth'

interface Team {
  id: string
  name: string
  description: string
  avatar: string
  created_at: string
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', avatar: '' })

  const token = getToken() || ''

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams', token)
      if (response.success) {
        setTeams(response.data)
      }
    } catch (error) {
      console.error('获取团队列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, formData, token)
      } else {
        await api.post('/teams', formData, token)
      }
      setShowModal(false)
      setEditingTeam(null)
      setFormData({ name: '', description: '', avatar: '' })
      fetchTeams()
    } catch (error) {
      console.error('保存团队失败:', error)
    }
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      description: team.description || '',
      avatar: team.avatar || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个团队吗？')) return
    try {
      await api.delete(`/teams/${id}`, token)
      fetchTeams()
    } catch (error) {
      console.error('删除团队失败:', error)
    }
  }

  const handleAdd = () => {
    setEditingTeam(null)
    setFormData({ name: '', description: '', avatar: '' })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">团队管理</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span>+</span> 新建团队
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">团队名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">创建时间</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-dark-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600/30">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-dark-700/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{team.name}</td>
                <td className="px-6 py-4 text-dark-400">{team.description || '-'}</td>
                <td className="px-6 py-4 text-dark-400">
                  {new Date(team.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(team)}
                    className="text-accent-cyan hover:text-accent-blue transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {teams.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            暂无团队数据
          </div>
        )}
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTeam ? '编辑团队' : '新建团队'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  团队名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  头像 URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-dark-300 hover:bg-dark-700/50 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-lg hover:opacity-90 transition-all"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Teams
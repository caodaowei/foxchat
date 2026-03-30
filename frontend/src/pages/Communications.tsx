import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { getToken } from '../utils/auth'

interface Communication {
  id: string
  sender_id: string
  receiver_id: string
  team_id: string
  type: 'message' | 'announcement' | 'notification'
  content: string
  is_read: boolean
  created_at: string
  sender_name: string
  receiver_name: string
  team_name: string
}

const Communications = () => {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<{
    type: 'message' | 'announcement' | 'notification'
    content: string
    receiver_id: string
    team_id: string
  }>({
    type: 'message',
    content: '',
    receiver_id: '',
    team_id: '',
  })
  const [filter, setFilter] = useState('all')

  const token = getToken() || ''

  const fetchCommunications = async () => {
    try {
      const response = await api.get('/communications', token)
      if (response.success) {
        setCommunications(response.data)
      }
    } catch (error) {
      console.error('获取沟通记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunications()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/communications', formData, token)
      setShowModal(false)
      setFormData({ type: 'message', content: '', receiver_id: '', team_id: '' })
      fetchCommunications()
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/communications/${id}/read`, {}, token)
      fetchCommunications()
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条消息吗？')) return
    try {
      await api.delete(`/communications/${id}`, token)
      fetchCommunications()
    } catch (error) {
      console.error('删除消息失败:', error)
    }
  }

  const filteredCommunications = communications.filter((comm) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !comm.is_read
    return comm.type === filter
  })

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      message: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
      announcement: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30',
      notification: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
    }
    const labels: Record<string, string> = {
      message: '消息',
      announcement: '公告',
      notification: '通知',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[type]}`}>
        {labels[type]}
      </span>
    )
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
        <h1 className="text-2xl font-bold text-white">沟通记录</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span>+</span> 发送消息
        </button>
      </div>

      {/* 筛选器 */}
      <div className="mb-4 flex space-x-2">
        {[
          { key: 'all', label: '全部' },
          { key: 'unread', label: '未读' },
          { key: 'message', label: '消息' },
          { key: 'announcement', label: '公告' },
          { key: 'notification', label: '通知' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              filter === item.key
                ? 'bg-accent-blue text-white'
                : 'bg-dark-700/50 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCommunications.map((comm) => (
          <div
            key={comm.id}
            className={`glass rounded-xl p-5 ${
              !comm.is_read ? 'border-l-4 border-accent-cyan' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold">
                  {comm.sender_name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{comm.sender_name}</span>
                    {getTypeBadge(comm.type)}
                    {!comm.is_read && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                        未读
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-dark-400">
                    {new Date(comm.created_at).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!comm.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(comm.id)}
                    className="text-sm text-accent-cyan hover:text-accent-blue transition-colors"
                  >
                    标记已读
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comm.id)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="mt-4 text-dark-200 whitespace-pre-wrap">{comm.content}</div>
            {comm.team_name && (
              <div className="mt-2 text-sm text-dark-500">
                团队: {comm.team_name}
              </div>
            )}
          </div>
        ))}

        {filteredCommunications.length === 0 && (
          <div className="text-center py-12 text-dark-400 glass rounded-xl">
            暂无沟通记录
          </div>
        )}
      </div>

      {/* 发送消息模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">发送消息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'message' | 'announcement' | 'notification' })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                >
                  <option value="message">消息</option>
                  <option value="announcement">公告</option>
                  <option value="notification">通知</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  接收者ID (可选)
                </label>
                <input
                  type="text"
                  value={formData.receiver_id}
                  onChange={(e) => setFormData({ ...formData, receiver_id: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  placeholder="私信时填写"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  团队ID (可选)
                </label>
                <input
                  type="text"
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  placeholder="团队消息时填写"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  rows={4}
                  required
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
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Communications
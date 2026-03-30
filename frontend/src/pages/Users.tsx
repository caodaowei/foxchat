import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { getToken } from '../utils/auth'

interface User {
  id: string
  username: string
  email: string
  display_name: string
  avatar: string
  role: 'admin' | 'manager' | 'member'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<{
    username: string
    email: string
    password: string
    display_name: string
    role: 'admin' | 'manager' | 'member'
  }>({
    username: '',
    email: '',
    password: '',
    display_name: '',
    role: 'member',
  })

  const token = getToken() || ''

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', token)
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const { password, ...updateData } = formData
        await api.put(`/users/${editingUser.id}`, updateData, token)
      } else {
        await api.post('/users', formData, token)
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({ username: '', email: '', password: '', display_name: '', role: 'member' })
      fetchUsers()
    } catch (error) {
      console.error('保存用户失败:', error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      display_name: user.display_name || '',
      role: user.role,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个用户吗？')) return
    try {
      await api.delete(`/users/${id}`, token)
      fetchUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({ username: '', email: '', password: '', display_name: '', role: 'member' })
    setShowModal(true)
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      manager: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30',
      member: 'bg-accent-green/20 text-accent-green border-accent-green/30',
    }
    const labels: Record<string, string> = {
      admin: '管理员',
      manager: '经理',
      member: '成员',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[role]}`}>
        {labels[role]}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-accent-green/20 text-accent-green',
      inactive: 'bg-dark-600 text-dark-400',
      suspended: 'bg-red-500/20 text-red-400',
    }
    const labels: Record<string, string> = {
      active: '活跃',
      inactive: '未激活',
      suspended: '已暂停',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
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
        <h1 className="text-2xl font-bold text-white">用户管理</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span>+</span> 新建用户
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">创建时间</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-dark-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600/30">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-dark-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold">
                      {user.display_name?.[0] || user.username[0].toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-white">{user.display_name || user.username}</div>
                      <div className="text-sm text-dark-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 text-dark-400">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-accent-cyan hover:text-accent-blue transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            暂无用户数据
          </div>
        )}
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingUser ? '编辑用户' : '新建用户'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    密码
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                    required={!editingUser}
                    minLength={6}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  显示名称
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  角色
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'manager' | 'member' })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-accent-blue outline-none"
                >
                  <option value="member">成员</option>
                  <option value="manager">经理</option>
                  <option value="admin">管理员</option>
                </select>
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

export default Users
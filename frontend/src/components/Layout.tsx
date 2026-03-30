import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clearToken } from '../utils/auth'

interface LayoutProps {
  children: ReactNode
  onLogout: () => void
}

const Layout = ({ children, onLogout }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/teams', label: '团队管理', icon: '👥' },
    { path: '/users', label: '用户管理', icon: '👤' },
    { path: '/communications', label: '沟通记录', icon: '💬' },
  ]

  const handleLogout = () => {
    clearToken()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* 左侧边栏 - 空间列表 */}
      <aside className="w-64 bg-dark-800/80 backdrop-blur-sm border-r border-dark-600/50 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-dark-600/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
              🦊
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">FoxChat</h1>
              <p className="text-xs text-dark-400">团队沟通协作</p>
            </div>
          </div>
        </div>

        {/* 主导航 */}
        <nav className="flex-1 py-4">
          <div className="px-4 mb-2 text-xs font-medium text-dark-400 uppercase tracking-wider">
            主要功能
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-accent-blue/20 text-accent-blue border-l-2 border-accent-blue'
                  : 'text-dark-300 hover:bg-dark-700/50 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* AI 员工区域 */}
          <div className="mt-6 px-4 mb-2 text-xs font-medium text-dark-400 uppercase tracking-wider">
            AI 员工
          </div>
          <div className="mx-2 space-y-1">
            {[
              { name: '产品经理', role: '需求分析', color: 'bg-accent-purple' },
              { name: '开发工程师', role: '技术实现', color: 'bg-accent-blue' },
              { name: '设计师', role: 'UI/UX', color: 'bg-accent-cyan' },
            ].map((ai) => (
              <button
                key={ai.name}
                className="w-full flex items-center px-4 py-2 text-sm text-dark-300 hover:bg-dark-700/50 hover:text-white rounded-lg transition-all group"
              >
                <div className={`w-2 h-2 rounded-full ${ai.color} mr-3 group-hover:shadow-[0_0_8px_currentColor]`} />
                <div className="text-left">
                  <div className="text-sm">{ai.name}</div>
                  <div className="text-xs text-dark-500">{ai.role}</div>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 bg-dark-700 rounded text-dark-400">空闲</span>
              </button>
            ))}
          </div>
        </nav>

        {/* 底部操作 */}
        <div className="p-4 border-t border-dark-600/50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-dark-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <span className="mr-3">🚪</span>
            退出登录
          </button>
        </div>
      </aside>

      {/* 中间主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-16 bg-dark-800/50 backdrop-blur-sm border-b border-dark-600/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              {navItems.find(item => item.path === location.pathname)?.label || '首页'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all">
              🔍
            </button>
            <button className="p-2 text-dark-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white text-sm font-medium">
              大
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>

      {/* 右侧概览面板 */}
      <aside className="w-80 bg-dark-800/50 backdrop-blur-sm border-l border-dark-600/50 flex flex-col">
        {/* 面板标题 */}
        <div className="p-4 border-b border-dark-600/50">
          <h3 className="text-sm font-semibold text-white">空间概览</h3>
        </div>

        {/* 统计卡片 */}
        <div className="p-4 space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400">成员数</span>
              <span className="text-xs px-2 py-0.5 bg-accent-green/20 text-accent-green rounded-full">在线 12</span>
            </div>
            <div className="text-2xl font-bold text-white">48</div>
          </div>
          
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400">会话数</span>
              <span className="text-xs text-dark-500">今日</span>
            </div>
            <div className="text-2xl font-bold text-white">156</div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400">AI 处理</span>
              <span className="text-xs px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded-full">活跃</span>
            </div>
            <div className="text-2xl font-bold text-white">89</div>
          </div>
        </div>

        {/* 执行链路 */}
        <div className="flex-1 px-4">
          <div className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-3">执行链路</div>
          <div className="space-y-2">
            {[
              { step: '需求分析', status: 'completed', ai: '产品经理' },
              { step: '技术设计', status: 'completed', ai: '开发工程师' },
              { step: 'UI 设计', status: 'active', ai: '设计师' },
              { step: '代码实现', status: 'pending', ai: '开发工程师' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'completed' ? 'bg-accent-green' :
                  item.status === 'active' ? 'bg-accent-orange animate-pulse' :
                  'bg-dark-600'
                }`} />
                <div className="flex-1">
                  <div className="text-sm text-dark-200">{item.step}</div>
                  <div className="text-xs text-dark-500">{item.ai}</div>
                </div>
                {item.status === 'completed' && <span className="text-xs text-accent-green">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 在线成员 */}
        <div className="p-4 border-t border-dark-600/50">
          <div className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-3">在线成员</div>
          <div className="flex -space-x-2">
            {['大', '小', 'A', 'B', 'C'].map((name, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-dark-600 border-2 border-dark-800 flex items-center justify-center text-xs text-white"
                style={{ zIndex: 5 - i }}
              >
                {name}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-800 flex items-center justify-center text-xs text-dark-400">
              +7
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Layout